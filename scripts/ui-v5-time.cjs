async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const assert=(x,m)=>{if(!x)throw new Error(m);};
  const click=(a,id)=>page.locator('[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  async function load(mode){await page.evaluate(async mode=>{
    const E=await import('/src/engine.js');const s=E.createGame({name:'时间试玩',school:'aero',major:'humanities',background:'ordinary',gender:'female'},212);
    s.notices=[];s.feedback=null;s.deferred=null;s.card=null;s.hooks['0-0-committee']=true;
    if(mode==='summer'){s.sem=2;s.phase='start';}
    if(mode==='time'){s.phase='events';s.card={kind:'choice',title:'本月的安排',text:'为比赛做准备，或者留出时间。',consume:true,duration:3,choices:[{text:'集中准备方案',effects:{study:5,energy:-8},result:'你完成了方案。'},{text:'只核对一次报名材料',duration:1,effects:{},result:'核对完成。'},{text:'不报名，留出空闲',freeTimeGain:1,result:'你留出时间。'}]};}
    if(mode==='graduation'){s.sem=6;s.phase='events';s.policy.published=true;s.grades=[{sem:0,grade:42,comp:35.6}];s.academicFailures=[{id:'course-0',sem:0,original:42,resolved:false,attempts:0}];s.jobResults=[];s.card={kind:'offers',title:'招聘结果到了',text:'这批投递未获得 offer。'};}
    E.ensureCard(s);localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },mode);await page.reload();await click('resume');}
  await page.setViewportSize({width:1440,height:1000});await load('time');assert(await page.getByText('约 3 周',{exact:false}).count()>0,'duration displayed');assert(!await page.getByText('1/2',{exact:false}).count(),'fixed cards removed');await page.screenshot({path:'output/playwright/v5-time-desktop.png',fullPage:true});await page.locator('[data-action="choice"][data-index="1"]').click();await click('continue');assert((await read()).week===1,'short action time');await click('free','skip');
  await page.setViewportSize({width:390,height:844});await load('summer');assert(await page.getByText('接一段暑期工作',{exact:true}).count()===1,'summer work');assert(!await page.getByText('午觉',{exact:false}).count(),'no nap vacation');await page.screenshot({path:'output/playwright/v5-summer-mobile.png',fullPage:true});await click('free','work');assert((await read()).balance>3500,'summer paid work');await click('continue');assert((await read()).card.kind==='focus','next semester focus');
  await load('graduation');await click('no-offer');assert((await read()).card.id==='course-remediation','graduation gate');await page.screenshot({path:'output/playwright/v5-remediation-mobile.png',fullPage:true});await page.locator('[data-action="choice"][data-index="2"]').click();assert((await read()).ending.degree==='本科未毕业','deferred graduation');await page.screenshot({path:'output/playwright/v5-deferred-graduation-mobile.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');assert(errors.length===0,'page errors '+errors);return {status:'passed',scenarios:['variable-duration','summer-plans','graduation-gate'],screenshots:4,errors};
}
