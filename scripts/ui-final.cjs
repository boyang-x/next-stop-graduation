async (page) => {
  await page.getByRole('button',{name:/继续手机同学的人生/}).click();
  if(!await page.getByText('等待期末',{exact:true}).isVisible())throw new Error('unearned academic grade was displayed');
  await page.screenshot({path:'output/playwright/game-mobile.png',fullPage:true});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('horizontal overflow');
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'output/playwright/game-desktop.png',fullPage:true});
  return {pendingGradesCorrect:true,mobileOverflow:false};
}
