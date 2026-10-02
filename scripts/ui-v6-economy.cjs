async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(x,m)=>{if(!x)throw new Error(m);};
  const click=(a,i)=>page.locator('[data-action="'+a+'"]'+(i===undefined?'':'[data-index="'+i+'"]')).first().click();
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  await page.reload();await page.evaluate(async()=>{const E=await import('/src/engine.js');const s=E.createGame({name:'消费与实习',school:'aero',major:'cs',background:'ordinary'},14);s.notices=[];localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));});await page.reload();await click('resume');
  await page.locator('[data-action="spending"][data-id="frugal"]').click();const before=(await read()).balance;await page.locator('[data-action="focus"][data-id="study"]').click();check((await read()).balance===before-80,'selected consumption charged once');
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(async()=>{const E=await import('/src/engine.js');const s=E.createGame({name:'暑期实习',school:'aero',major:'cs',background:'ordinary'},14);Object.assign(s,{sem:2,phase:'start',card:null,feedback:null,notices:[],deferred:null,rng:1});E.ensureCard(s);localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));});await page.reload();await click('resume');
  await page.locator('[data-action="free"][data-id="internship"]').click();await click('continue');await click('choice',1);const job=(await read()).internship;check(job?.kind==='remote'&&job.weeks===8,'remote terms');await click('continue');
  check((await page.locator('.event-text').innerText()).includes('8周'),'terms shown');await page.screenshot({path:'output/playwright/v6-internship-mobile.png',fullPage:true});
  await click('choice',1);await click('continue');const handoverBalance=(await read()).balance;await click('choice',0);check((await read()).balance===handoverBalance+job.net,'wage net paid');
  check((await page.locator('.outcome-text').innerText()).includes('净到账 ¥'+job.net),'settlement visible');await click('continue');
  await page.screenshot({path:'output/playwright/v6-spending-mobile.png',fullPage:true});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow');check(!errors.length,errors.join(';'));return {passed:true,weeks:job.weeks,gross:job.gross,extraCost:job.extraCost,net:job.net,errors};
}
