async (page) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const click=async(action,id)=>page.locator(`[data-action="${action}"]${id?`[data-id="${id}"]`:''}`).first().click();
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  const assert=(value,note)=>{if(!value)throw new Error(note);};
  const screenshot=path=>page.screenshot({path:'output/playwright/'+path,fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>localStorage.removeItem('next-stop-campus-v1'));await page.reload();
  await screenshot('v3-landing.png');
  await click('school','aero');await click('setup-next');await click('major','humanities');await click('setup-next');
  await click('gender','female');await page.locator('#player-name').fill('小林');await screenshot('v3-identity.png');
  await click('start');await click('focus','study');await click('notice');
  await screenshot('v3-game.png');
  const before=await read();assert(await page.locator('[data-action="lottery-entry"]').isEnabled(),'standalone entry enabled');
  await click('lottery-entry');await click('free','back');assert(JSON.stringify((await read()).card)===JSON.stringify(before.card),'cancel returns original card');
  await click('lottery-entry');await click('buy-ticket','small');
  const purchased=await read();await page.reload();await click('resume');
  assert((await read()).lotteryTransactions[0].prize===purchased.lotteryTransactions[0].prize,'refresh preserves ticket');
  let box=await page.locator('.scratch-canvas').boundingBox();
  await page.mouse.move(box.x+30,box.y+40);await page.mouse.down();await page.mouse.move(box.x+130,box.y+70,{steps:12});await page.mouse.up();
  assert((await read()).lotteryTransactions[0].revealed===false,'partial scratch does not pay yet');
  await screenshot('v3-scratch-partial.png');
  await page.mouse.move(box.x+10,box.y+10);await page.mouse.down();
  for(let y=12;y<box.height;y+=27){await page.mouse.move(box.x+10,box.y+y,{steps:3});await page.mouse.move(box.x+box.width-10,box.y+y,{steps:18});}
  await page.mouse.up();await page.locator('[data-action="continue"]').waitFor();
  assert((await read()).lotteryTransactions[0].revealed,'drag scratch reveals');await click('continue');
  const after=await read();assert(after.card.id===before.card.id,'scratch returns original card');assert(after.month===before.month,'scratch does not skip month');
  assert(await page.locator('[data-action="lottery-entry"]').isDisabled(),'month cooldown shown');
  await click('leisure');assert(await page.locator('.activity-tile').count()>=7,'expanded activities');await screenshot('v3-weekend.png');
  await click('free','work');await click('continue');assert((await read()).balance===after.balance+100,'part time pays once');
  await page.evaluate(async()=>{const key='next-stop-campus-v1',s=JSON.parse(localStorage.getItem(key));const {PEOPLE}=await import('/src/content.js');s.relationship={person:PEOPLE.find(p=>p.gender==='male'),stage:'dating'};s.calendarTick++;localStorage.setItem(key,JSON.stringify(s));});
  await page.reload();await click('resume');await click('leisure');assert(await page.locator('[data-action="free"][data-id="date"]').count()===1,'partner outing shown');await screenshot('v3-partner-activities.png');
  const oldBalance=(await read()).balance;await click('free','gift');await click('continue');assert((await read()).balance===oldBalance-120,'gift cost');
  await page.setViewportSize({width:390,height:844});await screenshot('v3-mobile-game.png');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile no overflow');
  await click('lottery-entry');await click('buy-ticket','weekend');await page.locator('.scratch-canvas').scrollIntoViewIfNeeded();
  box=await page.locator('.scratch-canvas').boundingBox();
  const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true});
  const send=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,id:1,radiusX:3,radiusY:3,force:1}]});
  await send('touchStart',box.x+12,box.y+15);
  for(let y=15;y<box.height-5;y+=28){await send('touchMove',box.x+12,box.y+y);for(let x=12;x<box.width-5;x+=18)await send('touchMove',box.x+x,box.y+y);}
  await send('touchEnd');await page.locator('[data-action="continue"]').waitFor();assert((await read()).lotteryTransactions.at(-1).revealed,'touch scratch reveals');await click('continue');
  // A saved semester boundary exercises the real vacation hook.
  await page.evaluate(async()=>{const key='next-stop-campus-v1',s=JSON.parse(localStorage.getItem(key));s.sem=1;s.month=0;s.phase='start';s.card=null;s.feedback=null;s.freeTime=null;s.deferred=null;s.notices=[];const {ensureCard}=await import('/src/engine.js');ensureCard(s);localStorage.setItem(key,JSON.stringify(s));});
  await page.reload();await click('resume');assert((await read()).freeTime.holiday==='寒假','vacation opens');await screenshot('v3-mobile-holiday.png');await click('free','exercise');await click('continue');assert((await read()).card.kind==='focus','vacation returns to next term');
  await click('home');await screenshot('v3-mobile-landing.png');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'landing no overflow');
  assert(errors.length===0,'browser errors: '+errors.join(';'));return {errors,desktop:'1440x1000',mobile:'390x844',checked:['wizard','cancel/restore','ticket reload','mouse scratch','touch scratch','monthly cooldown','weekend','part time','partner gift','vacation','mobile overflow']};
}
