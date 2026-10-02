async (page) => {
  await page.reload();
  await page.getByRole('button',{name:/继续小林的人生/}).click();
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')).ending.title);
  if(!await page.getByRole('heading',{name:before,exact:true}).isVisible())throw new Error('summary resume failed');
  await page.getByRole('button',{name:'重过一次大学 →'}).click();
  await page.screenshot({path:'output/playwright/landing-mobile.png',fullPage:true});
  await page.getByRole('textbox',{name:'你的名字'}).fill('手机同学');
  await page.getByRole('button',{name:/师范 · 江城/}).click();
  if(await page.getByRole('textbox',{name:'你的名字'}).inputValue()!=='手机同学')throw new Error('name was lost after school selection');
  await page.getByRole('button',{name:'汉语言文学',exact:true}).click();
  await page.getByRole('button',{name:'带上录取通知书，出发 →'}).click();
  await page.locator('[data-action="focus"][data-id="social"]').click();
  await page.locator('[data-action="notice"]').click();
  await page.locator('[data-action="choice"][data-index="0"]').click();
  const result=await page.locator('.outcome-box').innerText();
  await page.reload();await page.getByRole('button',{name:/继续手机同学的人生/}).click();
  if(await page.locator('.outcome-box').innerText()!==result)throw new Error('probability outcome changed on reload');
  await page.locator('[data-action="continue"]').click();
  await page.screenshot({path:'output/playwright/game-mobile.png',fullPage:true});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow)throw new Error('mobile horizontal overflow');
  return {viewport:390,school:'师范',major:'汉语言文学',savedOutcomeStable:true,horizontalOverflow:false};
}
