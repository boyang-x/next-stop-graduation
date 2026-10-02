async page => {
 await page.setViewportSize({width:1440,height:1000});await page.reload();
 await page.screenshot({path:'output/playwright/pixel-landing-desktop.png',fullPage:true});
 await page.locator('[data-action="setup-next"]').click();await page.locator('[data-action="setup-next"]').click();
 await page.locator('#player-name').fill('像素新同学');
 await page.screenshot({path:'output/playwright/pixel-identity-desktop.png',fullPage:true});
 await page.locator('[data-action="start"]').click();
 await page.screenshot({path:'output/playwright/pixel-game-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'output/playwright/pixel-game-mobile.png',fullPage:true});
 return {overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),scene:await page.locator('.pixel-scene').getAttribute('data-scene')};
}
