async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(x,m)=>{if(!x)throw new Error(m);};
  const click=(a,i)=>page.locator('[data-action="'+a+'"]'+(i===undefined?'':'[data-index="'+i+'"]')).first().click();
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  async function load(mode){await page.reload();await page.evaluate(async mode=>{
    const E=await import('/src/engine.js'),C=await import('/src/content.js');
    const s=E.createGame({name:'状态与关系',school:'normal',major:'psychology',gender:'female',background:'ordinary'},65);
    Object.assign(s,{sem:1,card:null,feedback:null,notices:[],deferred:null,phase:'events'});
    if(mode==='recovery'){s.energy=0;s.mood=0;s.balance=0;E.ensureCard(s);}
    if(mode==='meeting'){s.rng=1;s.card={id:'free-time',kind:'free',title:'周末安排',text:'今天想做什么？'};s.freeTime={consume:false,leisure:true};}
    if(mode==='conflict'){s.relationship={id:'partner-test',person:C.PEOPLE.find(p=>p.gender==='male'),started:0,intimacy:95,flags:{},memories:2,lastContact:s.calendarTick};s.rng=1;E.maybeRelationshipConflict(s);const e=E.drawEvent(s);s.card={...e,kind:'choice',consume:false};}
    localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },mode);await page.reload();await click('resume');}
  await page.setViewportSize({width:1440,height:1000});await load('recovery');
  check((await read()).card.id==='state-recovery','recovery');await page.screenshot({path:'output/playwright/v6-recovery-desktop.png',fullPage:true});
  await click('choice',1);await click('continue');check((await read()).energy===25,'recovery applied');
  await page.setViewportSize({width:390,height:844});await load('meeting');
  await page.locator('[data-action="free"][data-id="meet-new"]').click();await click('choice',0);
  check((await read()).candidate.gender==='male','female gets male candidate');await click('continue');
  check((await read()).storyQueue.some(q=>q.scope==='candidate'),'later contact stored');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');await page.screenshot({path:'output/playwright/v6-meeting-mobile.png',fullPage:true});
  await load('conflict');check((await read()).relationship.intimacy===75,'quarrel -20');await click('choice',1);
  await page.screenshot({path:'output/playwright/v6-conflict-mobile.png',fullPage:true});await click('continue');
  await page.evaluate(async()=>{const E=await import('/src/engine.js');const s=JSON.parse(localStorage.getItem('next-stop-campus-v1'));s.eventClock+=2;s.card=null;s.notices=[];s.freeTime=null;s.weekendDue=false;E.ensureCard(s);localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));});await page.reload();await click('resume');
  check((await read()).card.id==='love-conflict-follow','repair follow-up');await click('choice',0);check(!(await read()).relationship.flags.conflictPending,'conflict resolved');
  check(!errors.length,errors.join(';'));return {passed:true,scenarios:['recovery','active-meeting','quarrel-and-follow-up'],errors};
}
