async (page) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const click=async(a,id)=>page.locator(`[data-action="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  const shot=name=>page.screenshot({path:'output/playwright/v4-'+name+'.png',fullPage:true});
  const mobileCheck=async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');assert(await page.evaluate(()=>{const story=document.querySelector('.main-column'),profile=document.querySelector('.right-rail');return !story||profile.getBoundingClientRect().top>=story.getBoundingClientRect().bottom;}),'profile must follow story');};
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>localStorage.removeItem('next-stop-campus-v1'));await page.reload();
  assert(await page.locator('.landing-intro').getByRole('heading').count()===1,'one landing title');assert(await page.locator('.landing-intro p').count()===0,'no extra tagline');await shot('landing-desktop');
  await click('setup-next');await click('major','humanities');await click('setup-next');await click('gender','female');
  assert(await page.locator('#romance-preference').count()===0,'preference removed');await page.locator('#player-name').fill('林同学');await shot('identity-desktop');
  await click('start');assert((await read()).romancePreference==='male','female default partner');await click('focus','study');await click('notice');
  assert(await page.locator('.leisure-bar').count()===0,'no permanent leisure bar');await shot('story-desktop');
  const line=await page.locator('.character-school').evaluate(el=>({height:el.getBoundingClientRect().height,lineHeight:parseFloat(getComputedStyle(el).lineHeight)}));assert(line.height<line.lineHeight+2,'school and major one row');
  await page.locator('[data-action="choice"][data-index="1"]').click();await shot('feedback-desktop');await click('continue');
  async function reachWeekend(){for(let n=0;n<30;n++){const s=await read();if(s.freeTime?.scheduled)return;if(s.feedback){await click('continue');continue;}if(s.card.kind==='notice'){await click('notice');continue;}if(s.card.kind==='free'){await click('free','skip');continue;}if(s.card.kind==='choice'){await page.locator('[data-action="choice"]:not(:disabled)').first().click();continue;}throw new Error('Unexpected card '+s.card.kind);}throw new Error('No scheduled weekend');}
  await reachWeekend();const weekend=await read();assert(weekend.eventSlot===1,'between ordinary events');await shot('weekend-desktop');
  await click('free','lottery');assert(await page.locator('[data-action="buy-ticket"]').count()===6,'six ticket options');await shot('lottery-desktop');
  await click('free','back');assert((await read()).freeTime.scheduled,'browse cancels to same weekend');await click('free','lottery');await click('buy-ticket','pocket');const purchased=await read();
  await page.reload();await click('resume');assert((await read()).freeTime.ticket===purchased.freeTime.ticket,'ticket preserved');
  let box=await page.locator('.scratch-canvas').boundingBox();await page.mouse.move(box.x+12,box.y+15);await page.mouse.down();
  for(let y=15;y<box.height-5;y+=28){await page.mouse.move(box.x+12,box.y+y,{steps:2});await page.mouse.move(box.x+box.width-12,box.y+y,{steps:20});}
  await page.mouse.up();await page.locator('[data-action="continue"]').waitFor();await click('continue');assert((await read()).card.kind==='choice','back to ordinary events');assert((await read()).eventSlot===1,'no time skip');
  await page.setViewportSize({width:390,height:844});await mobileCheck();await shot('story-mobile');await page.locator('.right-rail').scrollIntoViewIfNeeded();await shot('profile-mobile');
  await reachWeekend();await click('free','lottery');await mobileCheck();await shot('lottery-mobile');await click('buy-ticket','festival');await page.locator('.scratch-canvas').scrollIntoViewIfNeeded();
  box=await page.locator('.scratch-canvas').boundingBox();const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true});
  const touch=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,id:1,radiusX:3,radiusY:3,force:1}]});
  await touch('touchStart',box.x+10,box.y+12);for(let y=12;y<box.height-5;y+=28){await touch('touchMove',box.x+10,box.y+y);for(let x=10;x<box.width-5;x+=16)await touch('touchMove',box.x+x,box.y+y);}await touch('touchEnd');
  await page.locator('[data-action="continue"]').waitFor();assert((await read()).lotteryTransactions.at(-1).revealed,'touch reveal');await click('continue');
  // Fixtures cover later screens without claiming a full natural run.
  async function loadScenario(which){await page.evaluate(async which=>{const E=await import('/src/engine.js'),key='next-stop-campus-v1';const s=E.createGame({name:'林同学',school:'aero',major:'humanities',gender:'female'},217);s.card=null;s.feedback=null;s.freeTime=null;s.notices=[];s.deferred=null;s.phase='events';
    if(which==='holiday'){s.sem=1;s.month=0;s.phase='start';}
    else {s.sem=6;s.month=1;s.route='work';s.gpa=91;s.comp=83;s.grades=Array.from({length:6},(_,sem)=>({sem,grade:91,comp:83}));for(const tag of ['实习经历','规律复习','政策调研'])E.addHistory(s,tag);E.updateRanks(s);}
    E.ensureCard(s);localStorage.setItem(key,JSON.stringify(s));},which);await page.reload();await click('resume');}
  await loadScenario('holiday');assert((await read()).freeTime.holiday==='寒假','holiday opens');await mobileCheck();await shot('holiday-mobile');await click('free','study');await click('continue');assert((await read()).study>0,'holiday study carried');
  await page.setViewportSize({width:1440,height:1000});await loadScenario('jobs');await shot('jobs-desktop');
  await page.setViewportSize({width:390,height:844});await mobileCheck();await shot('jobs-mobile');
  const boxes=page.locator('.job-check:not(:disabled)');for(let i=0;i<await boxes.count();i++)await boxes.nth(i).check();await click('submit-jobs');await mobileCheck();await shot('quiz-mobile');
  await page.setViewportSize({width:1440,height:1000});await shot('quiz-desktop');
  const answers=await page.evaluate(async()=>Object.fromEntries((await import('/src/content.js')).QUESTIONS.map(q=>[q.id,q.answer])));
  for(let n=0;n<35;n++){const s=await read();if(s.card.kind!=='quiz')break;if(s.quiz.reveal)await click('next-question');else await page.locator(`[data-action="answer"][data-index="${answers[s.quiz.questions[s.quiz.index]]}"]`).click();}
  while((await read()).card.kind==='notice')await click('notice');
  await page.locator('[data-action="choice"][data-index="1"]').click();await click('continue');assert((await read()).card.kind==='offers','offers view');await shot('offers-desktop');
  await page.setViewportSize({width:390,height:844});await mobileCheck();await shot('offers-mobile');const results=(await read()).jobResults;
  if(results.some(r=>r.offer)){await click('offer');await page.locator('[data-action="choice"]').first().click();if((await read()).feedback)await click('continue');}else await click('no-offer');
  assert((await read()).ending,'ending');await shot('summary-mobile');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'summary overflow');await page.setViewportSize({width:1440,height:1000});await shot('summary-desktop');
  const download=page.waitForEvent('download');await click('download');await (await download).saveAs('output/playwright/v4-summary.txt');
  await click('home');await page.setViewportSize({width:390,height:844});await shot('landing-mobile');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'landing overflow');
  assert(errors.length===0,errors.join(';'));return {errors,denominations:[5,10,20,30,50,100],weekend:'automatic',mobile:'story before profile',checked:['landing','identity','story','feedback','weekend','lottery','mouse/touch scratch','holiday','jobs','quiz','offers','summary','download']};
}
