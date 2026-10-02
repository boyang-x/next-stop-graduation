async page=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const assert=(v,m)=>{if(!v)throw new Error(m);},click=(a,id)=>page.locator('[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>localStorage.removeItem('next-stop-campus-v1'));await page.reload();await click('school','normal');await click('setup-next');await click('major','psychology');await click('setup-next');await click('gender','female');await page.locator('#player-name').fill('完整试玩');await click('start');
  const milestones=[],counts={};let n;
  for(n=0;n<1400;n++){
    const s=await read();if(s.ending)break;if(s.feedback){await click('continue');continue;}const c=s.card;assert(c,'no card '+s.sem+'/'+s.month);counts[c.kind]=(counts[c.kind]||0)+1;
    if(['route','cadre-election','epilogue','job-interview'].includes(c.id))milestones.push(c.id);
    if(c.kind==='notice'){await click('notice');continue;}
    if(c.kind==='focus'){await click('focus','study');continue;}
    if(c.kind==='cadre'){await click('cadre','class-study');continue;}
    if(c.kind==='lottery'){if(s.balance>=5)await click('buy-ticket','pocket');else await click('free','back');continue;}
    if(c.kind==='free'){await click('free','rest');continue;}
    if(c.kind==='scratch'){await click('scratch');continue;}
    if(c.kind==='target'){await click('target','normal');continue;}
    if(c.kind==='jobs'){
      const ids=await page.evaluate(async()=>{const E=await import('/src/engine.js'),C=await import('/src/content.js');const s=JSON.parse(localStorage.getItem('next-stop-campus-v1'));return C.JOBS.filter(j=>E.jobEligibility(s,j).ok&&['education','general'].includes(j.category)).map(j=>j.id);});
      for(const id of ids)await page.locator('.job-check[data-id="'+id+'"]').check();await page.screenshot({path:'output/playwright/v5-full-recruit-desktop.png',fullPage:true});await click('submit-jobs');continue;
    }
    if(c.kind==='quiz'){
      if(s.quiz.reveal){await click('next-question');continue;}const answer=await page.evaluate(async()=>{const C=await import('/src/content.js');const s=JSON.parse(localStorage.getItem('next-stop-campus-v1'));return C.QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]).answer;});await page.locator('[data-action="answer"][data-index="'+answer+'"]').click();continue;
    }
    if(c.kind==='offers'){await page.screenshot({path:'output/playwright/v5-full-offers-desktop.png',fullPage:true});const offer=s.jobResults.find(r=>r.offer);if(offer)await click('offer',offer.id);else await click('no-offer');continue;}
    const index=await page.evaluate(async()=>{const E=await import('/src/engine.js');const s=JSON.parse(localStorage.getItem('next-stop-campus-v1')),c=s.card;let options=c.choices.map((x,i)=>({x,i})).filter(({x})=>E.choiceAvailable(s,x).ok);if(c.id==='route')return options.find(({x})=>x.action==='work').i;if(c.id==='jackpot')return 1;options.sort((a,b)=>(b.x.effects?.study||0)-(a.x.effects?.study||0));return options[0].i;});await page.locator('[data-action="choice"][data-index="'+index+'"]').click();
  }
  const s=await read();assert(s.ending,'no ending');assert(milestones.includes('route'),'actual route');assert(await page.getByText('这一局，你走过的变化',{exact:true}).count()===1,'recap');assert(s.grades.length===8,'graduation terms');await page.screenshot({path:'output/playwright/v5-full-summary-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/playwright/v5-full-summary-mobile.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'summary width');
  const downloadPromise=page.waitForEvent('download');await click('download');const file=await downloadPromise;await file.saveAs('output/playwright/v5-full-summary.txt');assert(errors.length===0,'errors '+errors);return {status:'passed',source:'UI actions from a new start, no forced gameplay state',steps:n,ending:s.ending,offers:s.jobResults.filter(r=>r.offer).length,counts,milestones,errors};
}
