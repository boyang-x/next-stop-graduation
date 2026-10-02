async (page) => {
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const questionBank=await page.evaluate(async()=>{const {QUESTIONS}=await import('/src/content.js');return Object.fromEntries(QUESTIONS.map(q=>[q.id,q.answer]));});
  let snapshotChecks=0;
  for(let n=0;n<450;n++){
    const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
    if(s.ending){
      await page.getByRole('heading',{name:s.ending.title,exact:true}).waitFor();
      await page.screenshot({path:'output/playwright/summary-desktop.png',fullPage:true});
      const download=page.waitForEvent('download');await page.getByRole('button',{name:'下载完整本局总结 ↓'}).click();const file=await download;await file.saveAs('output/playwright/summary.txt');
      if(errors.length)throw new Error(errors.join('; '));return {ending:s.ending.title,offers:s.jobResults.filter(x=>x.offer).length,events:s.log.filter(x=>x.kind==='event').length,download:file.suggestedFilename(),errors,snapshotChecks};
    }
    if(s.feedback){await page.getByRole('button',{name:'继续这段人生 →',exact:true}).click();continue;}
    const c=s.card;
    if(c.kind==='notice'){await page.locator('[data-action="notice"]').click();continue;}
    if(c.kind==='focus'){await page.locator('[data-action="focus"][data-id="study"]').click();continue;}
    if(c.kind==='target'){await page.locator('[data-action="target"][data-id="normal"]').click();continue;}
    if(c.kind==='jobs'){
      await page.screenshot({path:'output/playwright/recruitment-desktop.png',fullPage:true});
      const checks=page.locator('.job-check:not(:disabled)');for(let i=0;i<await checks.count();i++)await checks.nth(i).check();
      await page.locator('[data-action="submit-jobs"]').click();continue;
    }
    if(c.kind==='quiz'){
      if(s.quiz.reveal){await page.locator('[data-action="next-question"]').click();continue;}
      const answer=questionBank[s.quiz.questions[s.quiz.index]];await page.locator('[data-action="answer"][data-index="'+answer+'"]').click();continue;
    }
    if(c.kind==='offers'){
      await page.screenshot({path:'output/playwright/offers-desktop.png',fullPage:true});
      if(s.jobResults.some(x=>x.offer))await page.locator('[data-action="offer"]').first().click();else await page.locator('[data-action="no-offer"]').click();continue;
    }
    let i=0;
    if(c.id==='route')i=c.choices.findIndex(c=>c.action==='work');
    else if(c.id==='lottery')i=1;
    else {const max=Math.max(...c.choices.map(c=>c.effects?.study||0));if(max>0)i=c.choices.findIndex(c=>c.effects?.study===max);}
    let choice=page.locator('[data-action="choice"][data-index="'+i+'"]');
    if(n===9){await page.reload();await page.getByRole('button',{name:/继续.*的人生/}).click();snapshotChecks++;}
    if(await choice.isDisabled())choice=page.locator('[data-action="choice"]:not(:disabled)').first();
    await choice.click();
  }
  throw new Error('UI did not reach an ending');
}
