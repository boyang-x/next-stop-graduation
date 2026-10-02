async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(ok,m)=>{if(!ok)throw new Error(m);};
 const click=(action,id)=>page.locator('[data-action="'+action+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
 await page.setViewportSize({width:1440,height:1000});await page.reload();await click('setup-next');await click('setup-next');await page.locator('#player-name').fill('像素版页面检查');await click('gender','female');await click('start');
 check((await read()).gender==='female','gender preserved');await click('focus','study');
 await page.screenshot({path:'output/playwright/pixel-game-desktop.png',fullPage:true});
 async function load(mode){await page.reload();await page.evaluate(async mode=>{
  const E=await import('/src/engine.js');const s=E.createGame({name:'假期与开奖检查',personality:'balanced'},82);
  Object.assign(s,{card:null,feedback:null,notices:[],deferred:null});
  delete s.notification;
  if(mode==='holiday'){s.sem=1;s.phase='start';E.ensureCard(s);}
  else{s.phase='events';s.hooks['0-0-committee']=true;s.freeTime={consume:false,leisure:true,scheduled:true};s.card={kind:'free',title:'周末安排',text:'选择自由活动。'};s.rng=1;}
  localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
 },mode);await page.reload();await click('resume');}
 await load('holiday');const before=await read();check((await page.locator('.activity-groups').innerText()).includes('留校休整'),'free stay on campus');
 await click('free','rest');check((await page.locator('.event-paper').innerText()).includes('你选择了假期回家'),'reason for home');
 await page.screenshot({path:'output/playwright/pixel-home-ticket-desktop.png',fullPage:true});
 await page.locator('[data-action="choice"][data-index="2"]').click();await click('continue');const cancelled=await read();
 check(cancelled.balance===before.balance&&cancelled.energy===before.energy&&cancelled.calendarTick===before.calendarTick,'cancel leaves money, recovery and calendar untouched');
 await click('free','campus-rest');await click('continue');check(!(await read()).freeTime,'stay-at-campus ends holiday');
 await load('holiday');await click('free','rest');await page.locator('[data-action="choice"][data-index="0"]').click();await click('continue');check((await read()).card.homeVisit,'confirmed travel opens home scene');
 await page.setViewportSize({width:390,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile home overflow');await page.screenshot({path:'output/playwright/pixel-home-scene-mobile.png',fullPage:true});
 const order=await page.evaluate(()=>({event:document.querySelector('.main-column').getBoundingClientRect().top,profile:document.querySelector('.right-rail').getBoundingClientRect().top}));check(order.event<order.profile,'mobile event above profile');
 await page.locator('[data-action="choice"][data-index="1"]').click();await click('continue');check(!(await read()).freeTime,'home scene leaves holiday');
 await load('lottery');await click('free','lottery');const prices=await page.locator('.ticket-card h3').allTextContents();check(prices.join('|')==='¥10|¥20|¥50|¥100|¥500|¥1,000','six approved prices');
 await click('buy-ticket','grand');const purchased=await read(),tx=purchased.lotteryTransactions[0];check(tx.price===1000&&tx.prize===10000000,'grand fixture fixed actual jackpot');
 await page.reload();await click('resume');check((await read()).lotteryTransactions[0].prize===tx.prize,'refresh preserves draw');
 await page.screenshot({path:'output/playwright/pixel-scratch-covered-mobile.png',fullPage:true});
 const canvas=page.locator('.scratch-canvas');await canvas.scrollIntoViewIfNeeded();const b=await canvas.boundingBox();await page.mouse.move(b.x+16,b.y+16);await page.mouse.down();
 for(let y=16;y<b.height-10;y+=24){await page.mouse.move(b.x+16,b.y+y);await page.mouse.move(b.x+b.width-16,b.y+y,{steps:14});}await page.mouse.up();
 await page.locator('.outcome-title').waitFor();const revealed=await read();check(revealed.balance===purchased.balance+tx.prize&&revealed.lotteryTransactions[0].revealed,'scratch reveals and pays once');
 await page.screenshot({path:'output/playwright/pixel-scratch-result-mobile.png',fullPage:true});await page.reload();await click('resume');check((await read()).balance===revealed.balance,'refresh cannot pay twice');
 await click('continue');await page.locator('[data-action="choice"][data-index="1"]').click();await click('continue');check(!(await read()).ending,'jackpot continue');
 check(!errors.length,errors.join(';'));return {passed:true,source:'new UI start plus engine-prepared holiday/weekend scenes; actual clicks, mouse scratching, persistence and mobile layout',scenarios:['gender','home-cancel','free-campus-rest','home-arrival','home-exit','six-prices','jackpot-scratch','refresh-draw-and-payout','jackpot-continue','mobile-order'],errors};
}

