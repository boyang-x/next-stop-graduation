async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(x,m)=>{if(!x)throw new Error(m);};
 const click=(a,id)=>page.locator('[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
 async function load(mode){await page.reload();await page.evaluate(async mode=>{
  const E=await import('/src/engine.js');const s=E.createGame({name:'系统节点检查',school:'aero',major:'cs'},67);
  Object.assign(s,{card:null,notices:[],feedback:null,deferred:null,phase:'events'});delete s.notification;
  if(mode==='habit'){for(let i=0;i<3;i++)E.addHistory(s,'规律复习');s.freeTime={consume:false,leisure:true,scheduled:true};s.card={kind:'free',title:'周末安排',text:'选择自由活动。'};}
  if(mode==='recommend'){s.sem=6;s.eligible=true;s.route='recommend';s.deferred='target';E.ensureCard(s);}
  if(mode.startsWith('civil')){s.sem=7;s.month=1;s.route='civil';s.policy.published=true;s.civilScore=mode==='civil-low'?30:100;if(mode==='civil-history')E.addHistory(s,'学生干部经历','学习委员');E.ensureCard(s);s.rng=mode==='civil-history'?1:15872;}
  localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
 },mode);await page.reload();await click('resume');}
 await page.setViewportSize({width:1440,height:1000});await load('habit');await click('free','study');
 check((await page.locator('.event-paper').innerText()).includes('已形成规律复习习惯'),'habit unlock feedback');await click('log');check((await page.locator('.modal-body').innerText()).includes('已形成规律复习习惯'),'habit unlock recorded');check(!await page.locator('.transient-result').count(),'notification does not cover the log');await click('close');
 await page.screenshot({path:'output/playwright/v8-habit-feedback.png',fullPage:true});
 await load('recommend');check(await page.locator('[data-action="target"]').count()===3,'provided target schools');await click('target','finance');const admitted=await read();check(admitted.admission?.school==='finance'&&admitted.route==='admitted','guaranteed acceptance');check(!JSON.stringify(admitted.log).includes('推免接收未通过'),'no reception rejection');await page.screenshot({path:'output/playwright/v8-recommend-confirmation.png',fullPage:true});
 await load('civil-low');const low=await read();check(low.ending&&low.civilFailure.includes('未达到45分'),'written failure explanation');
 await load('civil-none');check(await page.locator('[data-action="choice"][data-index="0"]:disabled').count()===1,'no fabricated research');check(await page.locator('[data-action="choice"][data-index="1"]:disabled').count()===1,'no fabricated cadre');await page.locator('[data-action="choice"][data-index="2"]').click();check((await read()).ending,'interview failure reaches summary');await click('log');const interview=page.locator('.log-row').filter({has:page.locator('h3',{hasText:'公共岗位的面试'})});await interview.locator('summary').click();check((await interview.innerText()).includes('本次成功率'),'terminal interview probability in log');await page.screenshot({path:'output/playwright/v8-civil-result-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'interview mobile overflow');await page.screenshot({path:'output/playwright/v8-civil-result-mobile.png',fullPage:true});
 check((await page.locator('.modal-body').innerText()).includes('面试未获录用'),'interview failure recorded');await click('close');
 await load('civil-history');check(await page.locator('[data-action="choice"][data-index="1"]:disabled').count()===0,'real service experience unlocks response');await page.locator('[data-action="choice"][data-index="1"]').click();check((await read()).publicOffer,'service response wins actual offer');
 check(!errors.length,errors.join(';'));return {passed:true,source:'engine-prepared targeted scenes, actual browser choices and records',scenarios:['habit-feedback-log','recommend-guaranteed','written-failure','experience-choice-gates','interview-failure-probability-log','service-response-offer','mobile-result'],errors};
}
