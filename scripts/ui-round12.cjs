async page => {
 const errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));const check=(v,m)=>{if(!v)throw Error(m);};
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
 const click=(action,index)=>page.locator('[data-action="'+action+'"]'+(index===undefined?'':'[data-index="'+index+'"]')).first().click();
 const resume=async()=>{await page.reload();await page.locator('[data-action="resume"]').click();};
 const seed=async(mode)=>{
  await page.evaluate(async mode=>{
   const E=await import('/src/engine.js'),C=await import('/src/content.js'),S=await import('/src/story.js'),A=await import('/src/project-application.js');
   let s=E.createGame({name:'像素验收',gender:'female'},741);Object.assign(s,{notifications:[],notices:[],feedback:null,deferred:null,phase:'events',energy:65,mood:50});s.hooks['0-0-committee']=true;s.lastIncidentClock=100;
   const set=id=>s.card={...S.prepareStoryEvent(s,C.EVENTS.find(e=>e.id===id)),kind:'choice',consume:true};
   if(mode==='clothes-male'){s.gender='male';set('r12-clothes-male');}
   if(mode==='clothes-poor'){s.balance=0;set('r12-clothes-female');}
   if(mode==='cat-meet')set('r12-cat-meet');
   if(mode==='cat-again'){s=E.migrateSave(JSON.parse(localStorage.getItem('next-stop-campus-v1')));s.feedback=null;s.notifications=[];s.card=null;set('r12-cat-again');}
   if(mode==='cat-graduate'){s=E.migrateSave(JSON.parse(localStorage.getItem('next-stop-campus-v1')));Object.assign(s,{sem:7,month:5,week:0,feedback:null,notifications:[],card:{kind:'offers'},jobResults:[],deferred:null,freeTime:null});s.policy.published=true;E.acceptNoOffer(s);}
   if(mode==='long'){s.monthlyFreeDone={'0-0':true};s.card={id:'long-fixture',kind:'choice',consume:true,duration:6,title:'六周项目安排',text:'这一段日程包括正常课程与项目工作。',choices:[{text:'完成本轮项目任务',effects:{study:4,energy:-16},result:'本轮任务完成，接下来推进日程。'}]};}
   if(mode==='privacy'){s.relationship={id:'ui-partner',person:C.PEOPLE.find(p=>p.gender==='male'),intimacy:70,flags:{},lastContact:s.calendarTick};set('bond-privacy');}
   if(mode==='grad-submission'){s.sem=10;s.monthlyFreeDone={'10-0':true,'10-1':true,'10-2':true,'10-3':true,'10-4':true};s.policy.published=true;set('r12-grad-submission-0');}
   if(mode==='rejection'){A.submitProjectApplication(s,.9);s.eventClock=1;s.card=null;E.ensureCard(s);}
   localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },mode);await resume();
 };
 const clearNotifications=async()=>{for(let i=0;i<30&&await page.locator('[data-action="confirm-notification"]').count();i++)await click('confirm-notification');};
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});await seed('clothes-male');
  for(let i=0;i<3;i++){const button=page.locator('[data-action="choice"][data-index="'+i+'"]');await button.scrollIntoViewIfNeeded();check(await button.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth+.5;}),'choice unreachable '+width);}
  const before=await read();await click('choice',0);const after=await read();check(after.balance===before.balance-200,'clothes charge');check(after.charm===before.charm+1.2,'clothes charm');check(await page.locator('.outcome-box').isVisible(),'result must be in event');await page.screenshot({path:'output/playwright/round12-clothes-'+width+'.png',fullPage:true});await resume();check((await read()).charm===after.charm,'charm reload');results.push({case:'paid-clothes',width});
 }
 await page.setViewportSize({width:390,height:900});await seed('clothes-poor');check(await page.locator('[data-action="choice"][data-index="0"]').isDisabled(),'affordability');const poor=await read();await click('choice',1);check((await read()).balance===0&&(await read()).charm===poor.charm+.4,'free clothes');results.push({case:'free-clothes'});
 await seed('privacy');check(!(await page.locator('.choices').textContent()).includes('密码'),'privacy option');await click('choice',2);check((await read()).charm===50,'legitimate choice charm');results.push({case:'reasonable-relationship'});
 await seed('long');await click('choice',0);await click('continue');await clearNotifications();let long=await read();check(long.month===1&&long.week===0&&long.pendingWeeks===2&&long.card.kind==='free','long action must stop for next-month free opportunity');await page.locator('[data-action="free"][data-id="skip"]').click();long=await read();check(long.month===1&&long.week===2&&long.pendingWeeks===0,'remaining weeks');check(long.finances.filter(f=>f.key==='calendar-1').length===1,'monthly finance twice');results.push({case:'six-week-calendar'});
 await seed('rejection');check((await read()).projectApplication.status==='rejected','saved rejection');check((await read()).card.id==='incident-rejection','visible rejection');const rejectCharm=(await read()).charm;await click('choice',0);check((await read()).charm===rejectCharm,'bad luck charm');results.push({case:'submitted-application-result'});
 await seed('grad-submission');await click('choice',0);let grad=await read();check(grad.plotFlags['r12-manuscript']&&!grad.history.some(h=>h.tag==='发表成果'),'submission invented publication');check(grad.storyQueue.some(q=>q.id==='r12-grad-submission-1'),'submission follow-up');await page.screenshot({path:'output/playwright/round12-grad-submission.png',fullPage:true});results.push({case:'graduate-submission'});
 await seed('cat-meet');check(await page.locator('.pixel-cat').count()>0,'pixel cat missing');await page.screenshot({path:'output/playwright/round12-cat-first.png',fullPage:true});await click('choice',0);await click('continue');await clearNotifications();if((await read()).card.kind==='free')await page.locator('[data-action="free"][data-id="skip"]').click();check((await read()).campusFlags.aero.catKnown,'first cat encounter');
 await seed('cat-again');await click('choice',0);await click('continue');await clearNotifications();check((await read()).campusFlags.aero.catBonded,'second cat encounter');await seed('cat-graduate');check((await read()).card.id==='r12-cat-graduation','graduation cat missing');await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'output/playwright/round12-cat-graduation.png',fullPage:true});await click('choice',0);check(!(await read()).ending&&(await read()).catPhotos.length===1,'photo before confirmation');await click('continue');await clearNotifications();check((await read()).ending,'graduation unfinished');await click('summary-image');await page.locator('.poster-modal img').waitFor();check(await page.locator('.poster-modal img').evaluate(img=>img.naturalWidth===1080&&img.naturalHeight>0),'PNG render');const download=page.waitForEvent('download');await click('poster-download');await(await download).saveAs('output/playwright/round12-cat-summary.png');results.push({case:'cat-complete-photo-export'});
 check(errors.length===0,errors.join('\n'));return {cases:results.length,results,errors};
}
