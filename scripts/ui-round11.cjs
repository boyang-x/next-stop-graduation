async page => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(v,m)=>{if(!v)throw Error(m);};
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
 const click=(action,id)=>page.locator('[data-action="'+action+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
 const seed=async(mode)=>{
  await page.evaluate(async mode=>{
   const E=await import('/src/engine.js'),C=await import('/src/content.js'),S=await import('/src/story.js'),P=await import('/src/participation.js');
   const s=E.createGame({name:'像素验收',gender:'female',personality:'balanced'},741);
   Object.assign(s,{notifications:[],notices:[],feedback:null,deferred:null,phase:'events',energy:60,mood:50});s.hooks['0-0-committee']=true;s.lastIncidentClock=100;
   if(mode==='routine'){s.card={...S.prepareStoryEvent(s,C.EVENTS.find(e=>e.id==='coffee')),kind:'choice',consume:true,duration:2};}
   if(mode==='notifications'){s.card={id:'pending-focus',kind:'focus',title:'待选择的学期重点',text:'通知确认后继续选择。'};s.notifications=[{title:'本月生活账单',text:'生活费已到账，必要开销已支付。'},{title:'期末成绩公布',text:'本学年综测0分，明细可以查看。'}];}
   if(mode==='exercise'){s.card={kind:'free',title:'周末自由安排',text:'本次选择只结算一次。'};s.freeTime={consume:false,leisure:true};}
   if(mode==='exam'){s.rng=1;s.card={...S.prepareStoryEvent(s,C.EVENTS.find(e=>e.id==='english')),kind:'choice',consume:true,duration:2};}
   if(mode==='award'){const p=P.registerProgram(s,'national',0,{ready:true});s.eventClock=p.due;s.card=null;E.ensureCard(s);}
   if(mode==='upgrade'){s.month=1;s.rng=1;const p=P.registerProgram(s,'campus',0,{ready:true});s.eventClock=p.due;s.card=null;E.ensureCard(s);}
   if(mode==='incident'){const e=C.EVENTS.find(e=>e.id==='incident-device');E.arriveEvent(s,e);s.card={...S.prepareStoryEvent(s,e),kind:'choice',consume:true};}
   if(mode==='relationship'){s.relationship={id:'r-ui',person:C.PEOPLE.find(p=>p.gender==='male'),intimacy:80,started:0,flags:{},memories:0,lastContact:s.calendarTick};const e=C.EVENTS.find(e=>e.id==='bond-miss-start');E.arriveEvent(s,e);s.card={...S.prepareStoryEvent(s,e),kind:'choice',consume:true};}
   if(mode==='legacy'){s.version=4;delete s.creditRevision;delete s.creditLedger;s.sem=2;s.history=[{tag:'英语证书',sem:0,detail:''}];s.activity=20;s.comp=100;s.card={...S.prepareStoryEvent(s,C.EVENTS.find(e=>e.id==='tutoring')),kind:'choice',consume:false};s.card.choices[2].text='旁听同学的试课，暂不接单';}
   localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },mode);await page.reload();await page.getByRole('button',{name:/继续 像素验收 的人生/}).click();
 };
 await page.setViewportSize({width:1440,height:1000});await seed('routine');
 check(await page.locator('.pixel-scene').count(),'pixel scene absent');const before=await read();await page.locator('[data-action="choice"][data-index="1"]').click();
 check(await page.locator('.event-paper .outcome-box').count(),'result outside event region');check(!await page.locator('.transient-result').count(),'toast remains');check((await read()).week===before.week,'advanced without confirmation');
 await page.screenshot({path:'output/playwright/round11-result-desktop.png',fullPage:true});
 await page.waitForTimeout(7000);check(await page.locator('[data-action="continue"]').count(),'result auto disappeared');
 await page.reload();await page.getByRole('button',{name:/继续 像素验收 的人生/}).click();check((await read()).feedback,'result lost on reload');await click('continue');check((await read()).week===2,'confirmation did not advance once');
 await seed('notifications');await click('confirm-notification');check((await read()).notifications.length===1,'queue not ordered');check((await read()).card.id==='pending-focus','notification changed pending action');await click('confirm-notification');check(await page.locator('[data-action="focus"]').count(),'suspended action missing');
 await seed('exercise');const sports=await read();await click('free','exercise');const exercised=await read();check(exercised.energy===sports.energy-8,'exercise energy wrong');check(exercised.charm===sports.charm+.5,'exercise charm wrong');check((await page.locator('.result-changes').textContent()).includes('魅力 +0.5'),'charm result not shown');
 await page.setViewportSize({width:390,height:844});await seed('exam');await page.locator('[data-action="choice"][data-index="0"]').click();check((await read()).programs[0].status==='preparing','registration missing');check((await read()).creditLedger.length===0,'registration prematurely scored');await click('continue');
 while(await page.locator('[data-action="confirm-notification"]').count())await click('confirm-notification');check((await read()).card.id==='program-prepare','preparation missing');await page.locator('[data-action="choice"][data-index="0"]').click();await click('continue');
 while(await page.locator('[data-action="confirm-notification"]').count())await click('confirm-notification');check((await read()).card.id==='program-result','exam result missing');check((await read()).programs[0].status==='settled','exam not settled');
 await page.screenshot({path:'output/playwright/round11-exam-mobile.png',fullPage:true});const ledger=JSON.stringify((await read()).creditLedger);await page.reload();await page.getByRole('button',{name:/继续 像素验收 的人生/}).click();check(JSON.stringify((await read()).creditLedger)===ledger,'reload duplicates credit');await click('notice');
 await seed('award');check((await page.locator('.event-text').textContent()).includes('一等奖'),'award level missing');await page.locator('.credit-details').evaluate(el=>el.open=true);check((await page.locator('.credit-details').textContent()).includes('+35分'),'credit ledger missing award');await page.screenshot({path:'output/playwright/round11-ledger-mobile.png',fullPage:true});
 await seed('upgrade');check((await read()).creditLedger[0].points===10,'campus award missing');await click('notice');
 while(await page.locator('[data-action="confirm-notification"]').count())await click('confirm-notification');check((await read()).card.id==='program-advance','advancement offer missing');const upgradeBalance=(await read()).balance;
 await page.locator('[data-action="choice"][data-index="0"]').click();check((await read()).balance===upgradeBalance-160,'advancement fee wrong');await click('continue');
 while(await page.locator('[data-action="confirm-notification"]').count())await click('confirm-notification');check((await read()).card.id==='program-prepare','advancement preparation missing');await page.locator('[data-action="choice"][data-index="0"]').click();await click('continue');
 while(await page.locator('[data-action="confirm-notification"]').count())await click('confirm-notification');const upgraded=await read();check(upgraded.card.id==='program-result','advancement result missing');check(upgraded.programs[1].rank===1,'expected seeded province award');check(upgraded.creditLedger.reduce((n,x)=>n+x.points,0)===20,'same-work award counted twice');await page.screenshot({path:'output/playwright/round11-upgrade-mobile.png',fullPage:true});
 await seed('incident');check((await read()).mood===34,'incident initial loss missing');await page.reload();await page.getByRole('button',{name:/继续 像素验收 的人生/}).click();check((await read()).mood===34,'incident loss repeated on reload');await page.locator('[data-action="choice"][data-index="1"]').click();check((await read()).incidentRecovery,'recovery absent');
 await seed('relationship');check((await read()).relationship.intimacy===68,'relationship shock missing');await page.locator('[data-action="choice"][data-index="0"]').click();check((await read()).relationship.intimacy<80,'repair restored too fast');check((await read()).storyQueue[0].id==='bond-miss-middle','relationship follow-up missing');
 await seed('legacy');check((await read()).version===5,'legacy not migrated');check((await read()).creditLedger.reduce((n,x)=>n+x.points,0)===4,'legacy arbitrary activity converted');check(!(await page.locator('.choices').textContent()).includes('旁听同学的试课'),'previous clarity missing');
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);const button=page.locator('[data-action="choice"][data-index="2"]');await button.scrollIntoViewIfNeeded();check(await button.isVisible(),'unreachable option '+width);}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/playwright/round11-tutoring-mobile.png',fullPage:true});await page.locator('[data-action="choice"][data-index="2"]').click();check((await read()).feedback,'last mobile choice did not transition');
 check(!errors.length,errors.join(';'));return {passed:true,widths:[320,390,768,1440],cases:['result-confirm','notification-queue','exercise','exam-chain','award-ledger','competition-upgrade','incident','relationship','legacy-migration'],errors};
}
