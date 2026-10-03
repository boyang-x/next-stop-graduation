async page => {
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const check=(value,message)=>{if(!value)throw new Error(message);};
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  const inject=async(id,balance=2300,stale=false)=>{
    await page.evaluate(async({id,balance,stale})=>{
      const E=await import('/src/engine.js'),C=await import('/src/content.js'),S=await import('/src/story.js');
      const s=E.createGame({name:'文案检查'},321);
      Object.assign(s,{notices:[],feedback:null,deferred:null,phase:'events',energy:50,mood:50,balance,rng:1});
      s.hooks['0-0-committee']=true;
      s.card={...S.prepareStoryEvent(s,C.EVENTS.find(e=>e.id===id)),kind:'choice',consume:false};
      if(stale){s.card.title='校园里的安静角落';s.card.text='这里没有绩点讨论。';s.card.choices[0].text='坐一会儿';}
      localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
    },{id,balance,stale});
    await page.reload();
    await page.getByRole('button',{name:/继续 文案检查 的人生/}).click();
  };
  await page.setViewportSize({width:1440,height:1000});
  await inject('coffee',2300,true);
  check((await page.locator('.event-title').textContent()).includes('图书馆一楼'),'old card not refreshed');
  check((await page.locator('[data-action="choice"][data-index="0"]').textContent()).includes('买一杯饮品'),'drink action missing');
  await page.screenshot({path:'output/playwright/scene-coffee-desktop.png',fullPage:true});
  await page.locator('[data-action="choice"][data-index="0"]').click();
  check((await read()).balance===2280,'drink not charged exactly once');
  check((await page.locator('.outcome-text').textContent()).includes('买了饮品'),'wrong drink result');
  await inject('coffee');await page.locator('[data-action="choice"][data-index="1"]').click();
  check((await read()).balance===2300,'free reading charged');
  await inject('coffee');await page.locator('[data-action="choice"][data-index="2"]').click();
  check((await read()).balance===2300,'free exit charged');
  await inject('aero-social');
  check((await page.locator('.event-text').textContent()).includes('场地与饮品'),'social fee reason missing');
  check(!(await page.locator('.event-text').textContent()).includes('螺丝'),'old screw joke remains');
  await page.setViewportSize({width:390,height:844});
  await inject('tutoring');
  const tutor=await page.locator('[data-action="choice"][data-index="0"]').textContent();
  check(tutor.includes('800')&&tutor.includes('100'),'contingent pay invisible');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
  await page.screenshot({path:'output/playwright/scene-tutoring-mobile.png',fullPage:true});
  await page.locator('[data-action="choice"][data-index="2"]').click();
  const learned=await read();check(learned.balance===2300&&learned.study>0,'peer advice fabricated pay');
  await inject('lost-card',24);
  check(await page.locator('[data-action="choice"][data-index="1"]').isDisabled(),'unaffordable contingent payment enabled');
  const repair=await page.locator('[data-action="choice"][data-index="1"]').textContent();
  check(repair.includes('找到原卡不花钱')&&repair.includes('余额不足'),'disabled choice lost cost explanation');
  await page.screenshot({path:'output/playwright/scene-lost-card-mobile.png',fullPage:true});
  await page.locator('[data-action="choice"][data-index="2"]').click();
  check((await read()).balance===24,'temporary credential charged');
  check(!errors.length,errors.join(';'));
  return {passed:true,scenes:['coffee','aero-social','tutoring','lost-card'],mobileWidth:390,errors};
}
