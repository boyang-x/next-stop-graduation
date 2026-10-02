async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=(v,m)=>{if(!v)throw new Error(m);};
  await page.reload();await page.locator('[data-action="resume"]').click();
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  check(state.ending,'run must be complete before reviewing its summary');
  await page.locator('.run-recap details summary').click();await page.locator('.exam-recap summary').click();
  check((await page.locator('.run-recap').innerText()).includes('已包含上述消费、实习及其他活动'),'subtotal must be clear');
  for(const [width,height,mode] of [[1440,1000,'desktop'],[390,844,'mobile']]){
    await page.setViewportSize({width,height});
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'summary overflow');
    await page.screenshot({path:`output/playwright/v6-summary-expanded-${mode}.png`,fullPage:true});
  }
  const downloaded=page.waitForEvent('download');await page.locator('[data-action="download"]').click();const file=await downloaded;await file.saveAs('output/playwright/v6-full-summary.txt');
  check(!errors.length,errors.join(';'));return {passed:true,ending:state.ending.title,errors};
}
