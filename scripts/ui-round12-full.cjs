async page => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(v,m)=>{if(!v)throw Error(m);};
 const click=(a,id)=>page.locator('[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
 await page.evaluate(()=>localStorage.clear());await page.reload();await page.setViewportSize({width:1440,height:1000});
 await click('school','normal');await click('setup-next');await click('major','psychology');await click('setup-next');await click('gender','female');await click('personality','social');await page.locator('#player-name').fill('新版完整试玩');await click('start');
 let actions=0,confirmed=0,recruiting=false;
 for(;actions<1200;actions++){
  const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  if(s.notifications?.length){await click('confirm-notification');confirmed++;continue;}
  if(s.ending)break;
  if(s.feedback){await click('continue');confirmed++;continue;}
  const c=s.card;check(c,'missing current card');
  if(c.kind==='notice'){await click('notice');confirmed++;continue;}
  if(c.kind==='focus'){await click('focus','social');continue;}
  if(c.kind==='cadre'){await page.locator('[data-action="cadre"]:not([disabled])').first().click();continue;}
  if(c.kind==='free'){
   let a=s.energy<45?(s.freeTime.holiday?'campus-rest':'rest'):s.relationship?'date':'meet-new';
   const button=page.locator('[data-action="free"][data-id="'+a+'"]:not([disabled])');await (await button.count()?button:page.locator('[data-action="free"][data-id="rest"]')).click();continue;
  }
  if(c.kind==='lottery'){await click('free','back');continue;}
  if(c.kind==='scratch'){await click('scratch');continue;}
  if(c.kind==='target'){await click('target','normal');continue;}
  if(c.kind==='jobs'){recruiting=true;await click('jobs-all');await click('submit-jobs');continue;}
  if(c.kind==='quiz'){if(s.quiz.reveal)await click('next-question');else{const answer=await page.evaluate(async()=>{const C=await import('/src/content.js'),s=JSON.parse(localStorage.getItem('next-stop-campus-v1'));return C.QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]).answer;});await page.locator('[data-action="answer"][data-index="'+answer+'"]').click();}continue;}
  if(c.kind==='offers'){if(await page.locator('[data-action="offer"]').count())await page.locator('[data-action="offer"]').first().click();else await click('no-offer');continue;}
  const index=await page.evaluate(async()=>{
   const E=await import('/src/engine.js'),s=JSON.parse(localStorage.getItem('next-stop-campus-v1')),c=s.card;
   const options=c.choices.map((x,i)=>({x,i})).filter(({x})=>E.choiceAvailable(s,x).ok);
   if(c.id==='route')return options.find(({x})=>x.action==='work').i;
   const score=x=>s.energy<25?(x.effects?.energy||0)*3:(x.effects?.study||0)*2+(x.effects?.intimacy||0)*2+(x.candidateDelta?.familiarity||0)+(x.success?.action==='date'?15:0)+(x.action==='programPrepare'?10:0)+(x.action==='interviewStudy'?100:0)-(x.action==='clearCandidate'?50:0);
   options.sort((a,b)=>score(b.x)-score(a.x));return options[0].i;
  });await page.locator('[data-action="choice"][data-index="'+index+'"]').click();
 }
 const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));check(s.ending,'unfinished');check(recruiting,'no recruitment');check(!s.programs.some(p=>['preparing','awaiting'].includes(p.status)),'participation left unsettled');
 await page.screenshot({path:'output/playwright/round12-full-ending-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');await page.screenshot({path:'output/playwright/round12-full-ending-mobile.png',fullPage:true});
 const textDownload=page.waitForEvent('download');await click('download');await (await textDownload).saveAs('output/playwright/round12-summary.txt');
 await click('summary-image');await page.locator('.poster-modal img').waitFor();const pngDownload=page.waitForEvent('download');await click('poster-download');await (await pngDownload).saveAs('output/playwright/round12-summary.png');await click('close');
 check(!errors.length,errors.join(';'));return {passed:true,actions,confirmed,ending:s.ending,programs:s.programs.length,credits:s.creditLedger.length,relationships:s.romances.length,errors};
}
