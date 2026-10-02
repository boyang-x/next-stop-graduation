async (page) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:5188/');
  await page.screenshot({path:'output/playwright/v2-landing-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'女生',exact:true}).click();
  await page.getByRole('button',{name:'精品文科 · 人文与公共管理',exact:true}).click();
  await page.getByRole('textbox',{name:'你的名字'}).fill('林同学');
  await page.getByRole('button',{name:'带上录取通知书，出发 →',exact:true}).click();
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  let s=await read();if(s.gender!=='female'||s.major!=='humanities')throw new Error('Setup mismatch');
  await page.locator('[data-action="focus"][data-id="study"]').click();
  s=await read();if(s.card.kind==='notice')await page.locator('[data-action="notice"]').click();
  await page.locator('[data-action="choice"][data-index="2"]').click();
  await page.locator('[data-action="continue"]').click();
  await page.screenshot({path:'output/playwright/v2-free-desktop.png',fullPage:true});
  await page.locator('[data-action="free"][data-id="lottery"]').click();
  await page.screenshot({path:'output/playwright/v2-lottery-desktop.png',fullPage:true});
  await page.locator('[data-action="buy-ticket"][data-id="graduate"]').click();
  const before=await read();await page.reload();await page.getByRole('button',{name:/继续.*的人生/}).click();
  const restored=await read();if(restored.freeTime.ticket!==before.freeTime.ticket||restored.balance!==before.balance)throw new Error('Ticket restore mismatch');
  await page.getByRole('button',{name:'刮开彩票',exact:true}).click();await page.locator('[data-action="continue"]').click();
  await page.screenshot({path:'output/playwright/v2-game-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.reload();await page.getByRole('button',{name:/继续.*的人生/}).click();
  await page.screenshot({path:'output/playwright/v2-game-mobile.png',fullPage:true});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw new Error('Mobile overflow');
  const font=await page.locator('.event-text').evaluate(el=>getComputedStyle(el).fontSize);if(parseFloat(font)<16)throw new Error('Text too small');
  await page.locator('.profile-panel>summary').click();await page.locator('[data-action="profile"][data-id="history"]').click();
  await page.screenshot({path:'output/playwright/v2-profile-mobile.png',fullPage:true});
  await page.locator('[data-action="profile"][data-id="now"]').click();
  await page.setViewportSize({width:1440,height:1000});await page.reload();await page.getByRole('button',{name:/继续.*的人生/}).click();
  const answers=await page.evaluate(async()=>Object.fromEntries((await import('/src/content.js')).QUESTIONS.map(q=>[q.id,q.answer])));
  let testedChoiceHints=false;
  for(let n=0;n<1100;n++){
    const s=await read();if(s.ending){await page.getByRole('heading',{name:s.ending.title,exact:true}).waitFor();await page.screenshot({path:'output/playwright/v2-summary-desktop.png',fullPage:true});const d=page.waitForEvent('download');await page.locator('[data-action="download"]').click();await (await d).saveAs('output/playwright/v2-summary.txt');await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/playwright/v2-summary-mobile.png',fullPage:true});if(errors.length)throw new Error(errors.join('; '));return {ending:s.ending.title,offers:s.jobResults.filter(r=>r.offer).length,gender:s.gender,major:s.major,tickets:s.lotteryTransactions.length,events:s.log.filter(r=>r.kind==='event').length,mobileFont:font,errors,testedChoiceHints};}
    if(s.feedback){await page.locator('[data-action="continue"]').click();continue;}const c=s.card;
    if(c.kind==='notice'){await page.locator('[data-action="notice"]').click();continue;}if(c.kind==='focus'){await page.locator('[data-action="focus"][data-id="study"]').click();continue;}
    if(['free','lottery'].includes(c.kind)){await page.locator('[data-action="free"][data-id="rest"], [data-action="free"][data-id="back"]').first().click();continue;}
    if(c.kind==='scratch'){await page.locator('[data-action="scratch"]').click();continue;}
    if(c.kind==='target'){await page.locator('[data-action="target"][data-id="normal"]').click();continue;}
    if(c.kind==='jobs'){const boxes=page.locator('.job-check:not(:disabled)');for(let i=0;i<await boxes.count();i++)await boxes.nth(i).check();await page.screenshot({path:'output/playwright/v2-jobs-desktop.png',fullPage:true});await page.locator('[data-action="submit-jobs"]').click();continue;}
    if(c.kind==='quiz'){if(s.quiz.reveal)await page.locator('[data-action="next-question"]').click();else{if(s.quiz.index===0)await page.screenshot({path:'output/playwright/v2-quiz-desktop.png',fullPage:true});await page.locator('[data-action="answer"][data-index="'+answers[s.quiz.questions[s.quiz.index]]+'"]').click();}continue;}
    if(c.kind==='offers'){await page.screenshot({path:'output/playwright/v2-offers-desktop.png',fullPage:true});await page.locator(s.jobResults.some(r=>r.offer)?'[data-action="offer"]':'[data-action="no-offer"]').first().click();continue;}
    if(!testedChoiceHints){const choiceText=await page.locator('.choices').innerText();if(/成功概率|学习积累|综测活动/.test(choiceText))throw new Error('Spoiler hints');testedChoiceHints=true;}
    let i=c.id==='route'?c.choices.findIndex(x=>x.action==='work'):c.choices.reduce((best,x,i,a)=>(x.effects?.study||0)>(a[best].effects?.study||0)?i:best,0);let option=page.locator('[data-action="choice"][data-index="'+i+'"]');if(await option.isDisabled())option=page.locator('[data-action="choice"]:not(:disabled)').first();await option.click();
  }throw new Error('No UI ending');
}
