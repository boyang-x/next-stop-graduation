async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=(x,m)=>{if(!x)throw new Error(m);};
  async function load(mode){await page.evaluate(async mode=>{
    const E=await import('/src/engine.js'), C=await import('/src/content.js');
    const s=E.createGame({name:'第六轮检查',school:'aero',major:'cs',background:'ordinary'},61);
    s.sem=6;s.policy.published=true;s.notices=[];s.feedback=null;s.deferred=null;s.phase='events';
    if(mode==='quiz'){const q=C.QUESTIONS.find(q=>q.text.includes('for(i=1;i<n'));s.quiz={purpose:'jobs',title:'代码题显示检查',questions:[q.id],answers:[],index:0,hintUsed:false};s.card={id:'quiz',kind:'quiz',title:s.quiz.title,text:'请读取完整代码。'};}
    else s.card={id:'jobs',kind:'jobs',title:'岗位选择检查',text:'先筛选，再批量选择。'};
    localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },mode);await page.reload();await page.locator('[data-action="resume"]').click();}
  await load('quiz');
  const question=await page.locator('.question-text').innerText();check(question.includes('for(i=1;i<n;i*=2)'),question);
  await page.setViewportSize({width:390,height:844});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
  await page.screenshot({path:'output/playwright/v6-code-mobile.png',fullPage:true});
  await page.locator('[data-action="answer"]').first().click();check(await page.locator('.quiz-result p').innerText(),'explanation visible');
  await page.setViewportSize({width:1440,height:1000});await load('jobs');
  await page.locator('#city-filter').selectOption('京州');await page.locator('[data-action="jobs-all"]').click();
  const first=Number(await page.locator('#selected-count').innerText());check(first>0,'first city selected');
  check(await page.locator('.job-check:disabled:checked').count()===0,'locked selected');
  await page.locator('#city-filter').selectOption('海州');await page.locator('[data-action="jobs-all"]').click();
  check(Number(await page.locator('#selected-count').innerText())>first,'other city preserved');
  await page.locator('[data-action="jobs-clear"]').click();check(Number(await page.locator('#selected-count').innerText())===first,'clear current filter only');
  await page.screenshot({path:'output/playwright/v6-bulk-jobs.png',fullPage:true});
  check(!errors.length,errors.join(';'));return {passed:true,question,firstCitySelected:first,errors};
}
