async page => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(x,m)=>{if(!x)throw Error(m)};
 const click=a=>page.locator('[data-action="'+a+'"]').first().click();
 const load=async mode=>{await page.evaluate(async mode=>{
  const E=await import('/src/engine.js'),C=await import('/src/content.js');
  const s=E.createGame({name:'像素新同学',school:'aero',major:'cs',personality:'scholar',gender:mode==='love'?'female':'male'},91);
  s.card={...C.EVENTS.find(e=>e.group==='major'&&e.major==='cs'),kind:'choice'};
  if(!s.card.choices)s.card={...C.EVENTS.find(e=>e.group==='common'&&e.category==='study'),kind:'choice'};
  if(!s.card.choices)s.card={...C.EVENTS.find(e=>e.group==='common'),kind:'choice'};
  if(mode==='tired')s.energy=14;
  if(mode==='sad'){s.energy=9;s.mood=15;}
  if(mode==='love')s.relationship={person:{id:'lin',name:'林同学'},intimacy:72,stage:'steady',preference:'shared'};
  if(mode==='joy'){s.mood=90;s.feedback={title:'竞选成功',text:'你当选为班级学习委员。',probability:{success:true,value:.72,reasons:['相关经历']},effects:{mood:4}};}
  localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
 },mode);await page.reload();await click('resume');};
 await page.setViewportSize({width:1440,height:1000});
 for(const mode of ['normal','tired','sad','love','joy']){
  await load(mode);await page.screenshot({path:'output/playwright/pixel-state-'+mode+'.png',fullPage:true});
 }
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});await load('love');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
  check(await page.evaluate(()=>document.querySelector('.main-column').getBoundingClientRect().top<document.querySelector('.right-rail').getBoundingClientRect().top),'event-first '+width);
  await page.screenshot({path:'output/playwright/pixel-event-'+width+'.png',fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await page.reload();
 await page.screenshot({path:'output/playwright/pixel-landing-mobile.png',fullPage:true});
 await click('rules');check(await page.locator('[role="dialog"]').count()===1,'rules opens');await page.keyboard.press('Escape');
 check(!errors.length,errors.join(';'));return {passed:true,states:5,widths:[320,390,768],errors};
}
