async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(x,m)=>{if(!x)throw new Error(m);};
  async function load(major,purpose,id=null){await page.reload();await page.evaluate(async({major,purpose,id})=>{
    const E=await import('/src/engine.js'),C=await import('/src/content.js');const school=C.SCHOOLS.find(s=>s.majors.includes(major));const s=E.createGame({name:'考试检查',school:school.id,major,personality:'practical'},65);s.sem=6;s.phase='events';s.target='aero';s.policy.published=true;s.notices=[];s.card=null;s.selectedJobs=C.JOBS.filter(j=>E.jobEligibility(s,j).ok).map(j=>j.id);E.startQuiz(s,purpose);if(id)s.quiz.questions=[id];E.ensureCard(s);localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },{major,purpose,id});await page.reload();await page.locator('[data-action="resume"]').click();}
  await page.setViewportSize({width:390,height:844});await load('cs','jobs','v6-cs-4');
  const code=await page.locator('.question-text').innerText();check(code.includes('for j in range(i):\n'),'multiline preserved');check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'code overflow');await page.screenshot({path:'output/playwright/v7-multiline-code-mobile.png',fullPage:true});
  for(const [major,purpose] of [['aerospace','jobs'],['psychology','exam'],['accounting','exam'],['cs','civil']]){
    await load(major,purpose);const seen=[];
    for(let i=0;i<12;i++){
      const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));if(state.card.kind!=='quiz')break;
      if(state.quiz.reveal){await page.locator('[data-action="next-question"]').click();continue;}
      const answer=await page.evaluate(async()=>{const C=await import('/src/content.js');const s=JSON.parse(localStorage.getItem('next-stop-campus-v1'));const q=C.QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]);return {text:q.text,index:q.answer};});
      check(await page.locator('.question-text').innerText()===answer.text,'full question');seen.push(answer.text);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'question overflow');await page.locator('[data-action="answer"][data-index="'+answer.index+'"]').click();await page.locator('[data-action="next-question"]').click();
    }
    const completed=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));check(completed.quiz.weightedScore===100,'completed paper');check(completed.quizHistory.at(-1).sections,'sections saved');await page.screenshot({path:`output/playwright/v7-${major}-${purpose}-mobile.png`,fullPage:true});
  }
  check(!errors.length,errors.join(';'));return {passed:true,scenarios:['multiline-code','aerospace-recruitment','psychology-entrance','accounting-entrance','civil-six-topics'],errors};
}
