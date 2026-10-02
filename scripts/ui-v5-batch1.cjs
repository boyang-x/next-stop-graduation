async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  const click=(action,id)=>page.locator('[data-action="'+action+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
  const choice=i=>page.locator('[data-action="choice"][data-index="'+i+'"]').click();
  const assert=(value,text)=>{if(!value)throw new Error(text);};
  const notices=async()=>{for(let n=0;n<15&&(await read()).card?.kind==='notice';n++)await click('notice');};
  const shot=name=>page.screenshot({path:'output/playwright/v5-batch1-'+name+'.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>localStorage.removeItem('next-stop-campus-v1'));await page.reload();
  await click('setup-next');await click('setup-next');await page.locator('#player-name').fill('新机制试玩');await click('start');await click('focus','study');await notices();
  assert((await read()).card.id==='cadre-arrange','annual arrangement appears');await choice(0);await click('continue');
  assert(await page.locator('[data-action="cadre"]:not([data-id="none"])').count()===12,'12 detailed posts');
  assert(await page.locator('[data-action="cadre"][data-id="union-president"]').isDisabled(),'senior post locked');await shot('cadre-desktop');
  await page.setViewportSize({width:390,height:844});await shot('cadre-mobile');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'cadre mobile width');
  await click('cadre','class-study');assert((await read()).card.id==='cadre-election','election responds to selected role');await choice(0);await click('continue');
  const roleResult=await read();assert(roleResult.log.some(x=>x.title==='竞选学习委员'),'election result recorded');
  // Later screens use declared fixtures, not claims of naturally reaching them in this script.
  async function fixture(which){await page.evaluate(async which=>{
    const E=await import('/src/engine.js'),C=await import('/src/content.js');const s=E.createGame({name:'新机制试玩',school:'aero',major:'humanities',gender:'male',background:'ordinary'},61);
    s.sem=2;s.month=0;s.phase='events';s.card=null;s.notices=[];s.deferred=null;s.feedback=null;s.grade=90;s.gpa=90;s.comp=82;s.grades=[{sem:0,grade:90,comp:82},{sem:1,grade:90,comp:82}];E.updateRanks(s);
    if(which==='policy'){s.policy.published=false;}
    else{s.policy.published=true;s.hooks['2-0-committee']=true;s.cadre={role:'class-study',startSem:2,endSem:4,performance:1,tasks:1};E.addHistory(s,'学生干部经历','学习委员 · 一学年');s.relationship={id:'fixture-partner',person:C.PEOPLE[0],intimacy:76,stage:'steady',memories:2,flags:{},lastContact:s.calendarTick};
      if(which==='zero')s.relationship.intimacy=0;
      if(which==='gift'){s.freeTime={consume:false,leisure:true};s.card={kind:'free',title:'周末，今天想做什么？',text:'安排一次活动。'};}
    }
    E.ensureCard(s);localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },which);await page.reload();await click('resume');}
  await fixture('policy');assert((await read()).card.title==='本届推免规则公布','policy announcement');assert((await read()).policy.metric==='compRank','humanities uses comprehensive rank');await shot('policy-mobile');
  await page.setViewportSize({width:1440,height:1000});await fixture('profile');assert(await page.locator('.relationship-vital').count()===1,'intimacy displayed');assert(await page.locator('.current-role').innerText()==='学习委员\n任期至本学年末','active post displayed');await shot('profile-desktop');
  await page.setViewportSize({width:390,height:844});await shot('profile-mobile');
  assert(await page.evaluate(()=>{const a=document.querySelector('.main-column').getBoundingClientRect(),b=document.querySelector('.right-rail').getBoundingClientRect();return b.top>=a.bottom&&document.documentElement.scrollWidth<=innerWidth;}),'mobile story first, no overflow');
  await page.locator('.profile-extra summary').filter({hasText:'特殊经历'}).click();await click('history');assert(await page.locator('.modal .tag').count()===1,'only special experience shown');assert(!await page.locator('.modal').innerText().then(t=>t.includes('规律复习')),'routine not shown');await click('close');
  await fixture('gift');const before=await read();await click('free','gift');const after=await read();assert(after.relationship.intimacy>before.relationship.intimacy,'gift changes intimacy');assert(after.balance===before.balance-120,'gift paid');await shot('gift-mobile');await click('continue');
  await fixture('zero');assert((await read()).card.id==='relationship-breakpoint','zero intimacy opens breakup');await shot('breakup-mobile');await choice(1);assert((await read()).relationship===null,'breakup clears current partner');await click('continue');
  assert(errors.length===0,'browser errors: '+errors.join(', '));console.log(JSON.stringify({status:'passed',naturalElection:true,fixtureScreens:['policy','profile','gift','zero'],screenshots:7,errors}));
}
