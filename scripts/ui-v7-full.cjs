async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(x,m)=>{if(!x)throw new Error(m);};
  const click=(a,id)=>page.locator('[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
  await page.reload();await page.setViewportSize({width:1440,height:1000});await click('school','normal');await click('setup-next');await click('major','psychology');await click('setup-next');await click('gender','female');await click('personality','social');await page.locator('#player-name').fill('完整试玩');await click('start');
  let actions=0,inline=0,sawRecruiting=false,sawQuiz=false;
  for(;actions<800;actions++){
    const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));if(s.ending)break;const c=s.card;
    check(c||s.feedback,'missing card');if(await page.locator('.transient-result').count())inline++;
    if(s.feedback){await click('continue');continue;}
    if(c.kind==='notice'){await click('notice');continue;}
    if(c.kind==='focus'){await click('focus','study');continue;}
    if(c.kind==='cadre'){const available=page.locator('[data-action="cadre"]:not([disabled])');await available.first().click();continue;}
    if(c.kind==='free'){
      if(s.freeTime.holiday==='暑假'&&s.sem>=2&&s.sem<=12&&await page.locator('[data-action="free"][data-id="internship"]').count())await click('free','internship');else await click('free','rest');continue;
    }
    if(c.kind==='scratch'){await click('scratch');continue;}
    if(c.kind==='lottery'){await click('free','back');continue;}
    if(c.kind==='target'){await click('target','normal');continue;}
    if(c.kind==='jobs'){sawRecruiting=true;await click('jobs-all');await page.screenshot({path:'output/playwright/v7-full-recruiting.png',fullPage:true});await click('submit-jobs');continue;}
    if(c.kind==='quiz'){sawQuiz=true;if(s.quiz.reveal)await click('next-question');else{
      const answer=await page.evaluate(async()=>{const C=await import('/src/content.js'),s=JSON.parse(localStorage.getItem('next-stop-campus-v1'));return C.QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]).answer;});await page.locator('[data-action="answer"][data-index="'+answer+'"]').click();
    }continue;}
    if(c.kind==='offers'){if(await page.locator('[data-action="offer"]').count())await page.locator('[data-action="offer"]').first().click();else await click('no-offer');continue;}
    let index=await page.evaluate(async()=>{const E=await import('/src/engine.js'),s=JSON.parse(localStorage.getItem('next-stop-campus-v1'));const c=s.card,available=c.choices.map((x,i)=>({x,i})).filter(({x})=>E.choiceAvailable(s,x).ok);
      if(c.id==='route')return available.find(({x})=>x.action==='work').i;
      available.sort((a,b)=>(b.x.effects?.study||0)-(a.x.effects?.study||0));return available[0].i;
    });await page.locator('[data-action="choice"][data-index="'+index+'"]').click();
  }
  const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));check(s.ending,'run unfinished');check(sawRecruiting&&sawQuiz,'recruitment missing');
  await page.screenshot({path:'output/playwright/v7-full-ending-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'ending overflow');await page.screenshot({path:'output/playwright/v7-full-ending-mobile.png',fullPage:true});
  const download=page.waitForEvent('download');await click('download');const file=await download;await file.saveAs('output/playwright/v7-full-summary.txt');check(!errors.length,errors.join(';'));
  return {passed:true,actions,inlineResults:inline,ending:s.ending,offerCount:s.jobResults.filter(r=>r.offer).length,balance:s.balance,errors};
}
