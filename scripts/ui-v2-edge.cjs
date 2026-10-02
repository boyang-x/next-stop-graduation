async (page)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));const key='next-stop-campus-v1';
  await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5188/');
  await page.screenshot({path:'output/playwright/v2-landing-mobile.png',fullPage:true});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw new Error('Landing overflow');
  await page.evaluate(async()=>{const {createGame}=await import('/src/engine.js');const s=createGame({name:'旧档同学'},80);s.version=1;delete s.gender;delete s.peers;localStorage.removeItem('next-stop-campus-v1-backup-v1');localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));});
  await page.reload();await page.getByRole('button',{name:/继续旧档同学的人生/}).click();await page.getByRole('button',{name:'女生',exact:true}).click();
  const migrated=await page.evaluate(()=>({s:JSON.parse(localStorage.getItem('next-stop-campus-v1')),backup:JSON.parse(localStorage.getItem('next-stop-campus-v1-backup-v1'))}));
  if(migrated.s.gender!=='female'||migrated.backup.version!==1||migrated.s.name!=='旧档同学')throw new Error('Migration UI mismatch');
  await page.evaluate(async()=>{const {createGame}=await import('/src/engine.js');const s=createGame({name:'大奖验证同学',gender:'female'},81);s.notices=[];s.card={kind:'lottery',title:'便利店的刮刮乐柜台',text:'开奖验证'};s.freeTime={consume:true};function left(v,n){let x=v;for(let i=0;i<32;i++)x=v^(x<<n);return x>>>0;}function right(v,n){let x=v;for(let i=0;i<32;i++)x=v^(x>>>n);return x>>>0;}s.rng=left(right(left(1,5),17),13);localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));});
  await page.reload();await page.getByRole('button',{name:/继续大奖验证同学的人生/}).click();
  await page.screenshot({path:'output/playwright/v2-lottery-mobile.png',fullPage:true});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw new Error('Lottery overflow');
  await page.locator('[data-action="buy-ticket"][data-id="small"]').click();await page.locator('[data-action="scratch"]').click();
  const won=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));if(won.lotteryTransactions[0].prize!==10000000)throw new Error('Jackpot not applied');
  await page.reload();await page.getByRole('button',{name:/继续大奖验证同学的人生/}).click();await page.locator('[data-action="continue"]').click();
  await page.getByRole('heading',{name:'一千万到账之后',exact:true}).waitFor();await page.screenshot({path:'output/playwright/v2-jackpot-mobile.png',fullPage:true});
  await page.locator('[data-action="choice"][data-index="1"]').click();await page.locator('[data-action="continue"]').click();
  const continued=await page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));if(continued.ending||continued.lotteryTransactions.length!==1||continued.balance!==won.balance||continued.eventSlot!==1)throw new Error('Jackpot continuation mismatch');
  if(errors.length)throw new Error(errors.join('; '));return {migration:true,backupVersion:migrated.backup.version,jackpot:won.lotteryTransactions[0].prize,continued:true,errors};
}
