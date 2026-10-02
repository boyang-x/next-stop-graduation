async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=(x,m)=>{if(!x)throw new Error(m);};
  const click=(a,id)=>page.locator('[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
  await page.reload();await page.setViewportSize({width:1440,height:1000});
  await click('school','aero');await click('setup-next');await click('major','humanities');await click('setup-next');
  check(await page.locator('.personality-option').count()===5,'five traits');
  check(!await page.getByText('想认识的恋爱对象',{exact:true}).count(),'no partner preference');
  await page.locator('#player-name').fill('卷王检查');await click('gender','female');await click('personality','scholar');
  check(await page.locator('#player-name').inputValue()==='卷王检查','name preserved across selection');
  await page.screenshot({path:'output/playwright/v8-traits-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'trait mobile overflow');
  await page.screenshot({path:'output/playwright/v8-traits-mobile.png',fullPage:true});await click('start');
  const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  check(s.personality==='scholar'&&s.gender==='female'&&s.romancePreference==='male','trait/gender saved');
  check(s.finances[0].income===1800&&s.finances[0].before===2000,'uniform money');
  check((await page.locator('.compact-vitals').innerText()).includes('96 / 120'),'energy integer and maximum');
  const mobileOrder=await page.evaluate(()=>({event:document.querySelector('.main-column').getBoundingClientRect().top,profile:document.querySelector('.right-rail').getBoundingClientRect().top}));check(mobileOrder.event<mobileOrder.profile,'event before profile');
  await click('focus','study');check(!/约.*周/.test(await page.locator('.choices').innerText()),'no duration');
  await page.screenshot({path:'output/playwright/v8-game-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'output/playwright/v8-game-desktop.png',fullPage:true});

  async function load(mode){await page.reload();await page.evaluate(async mode=>{
    const E=await import('/src/engine.js'),C=await import('/src/content.js'),T=await import('/src/story.js');const s=E.createGame({name:'本轮检查',personality:'scholar',school:'aero',major:'cs'},71);
    Object.assign(s,{card:null,feedback:null,notices:[],deferred:null,phase:'events'});delete s.notification;s.hooks['0-0-committee']=true;
    if(mode==='result'){s.energy=18.4;s.mood=86;s.card={...C.EVENTS.find(e=>e.id==='campus-run'),kind:'choice',consume:true};}
    if(mode==='election'){s.card={kind:'cadre'};E.selectCadre(s,'class-study');s.rng=1;}
    if(mode==='academic'){s.sem=5;s.policy.published=true;s.grades=[{sem:0,grade:90,comp:60}];s.gpa=90;s.comp=60;E.updateRanks(s);s.policy.result={eligible:true,rank:s.combinedRank,sem:5};s.card={...T.prepareStoryEvent(s,C.EVENTS.find(e=>e.id==='policy-leading')),kind:'choice',consume:true};}
    if(mode==='zero'){s.energy=0;s.card={...C.EVENTS.find(e=>e.id==='energy-low'),kind:'choice',consume:true};}
    localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },mode);await page.reload();await click('resume');}
  await load('result');check(!await page.locator('.brief-news,.recent-outcome').count(),'no duplicate panels');
  await page.locator('[data-action="choice"][data-index="0"]').click();check(await page.locator('.transient-result').count()===1,'one-shot result visible');
  await page.locator('.transient-result [data-action="log"]').click();check((await page.locator('.modal-body').innerText()).includes('操场的晚风'),'result in log');await click('close');
  await page.waitForTimeout(6700);check(await page.locator('.transient-result').count()===0,'result expires');
  await page.reload();await click('resume');check(!await page.locator('.transient-result').count(),'result not persistent after refresh');
  await load('election');await page.locator('[data-action="choice"][data-index="0"]').click();
  await page.locator('.result-detail summary').click();const detail=await page.locator('.result-detail').innerText();check(detail.includes('魅力')&&detail.includes('个百分点'),'probability explanation');check(!detail.includes('心情 +'),'not a misleading stat bonus');
  await page.screenshot({path:'output/playwright/v8-election-probability.png',fullPage:true});
  await load('academic');const academic=await page.locator('.academic-grid').innerText();check(academic.includes('84.0')&&academic.includes('60.0')&&academic.includes('综合排名'),'80/20 score');
  check(!await page.locator('.main-column').getByText('近况播报').count(),'no permanent notice');check((await page.locator('.policy-summary').innerText()).includes('已获资格'),'policy in profile');
  await page.screenshot({path:'output/playwright/v8-academics-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'academic mobile overflow');await page.screenshot({path:'output/playwright/v8-academics-mobile.png',fullPage:true});
  await load('zero');const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')).study);
  await page.locator('[data-action="choice"][data-index="2"]').click();const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));check(after.study>before&&after.energy===0,'zero energy study continues');
  check(!errors.length,errors.join(';'));return {passed:true,scenarios:['traits','uniform-money','gender','integer-stats','mobile-order','hidden-duration','transient-result-log-refresh','election-percentage-points','combined-rank','zero-energy-study'],errors};
}

