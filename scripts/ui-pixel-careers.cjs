async page=>{
 await page.goto('http://127.0.0.1:5188/');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(x,m)=>{if(!x)throw Error(m);};
 const click=(action,index)=>page.locator('[data-action="'+action+'"]'+(index!==undefined?'[data-index="'+index+'"]':'')).first().click();
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
 async function load(mode){await page.evaluate(async mode=>{
  const E=await import('/src/engine.js'),C=await import('/src/content.js'),R=await import('/src/recruitment.js');
  const s=E.createGame({name:'林同学',school:'aero',major:'cs',personality:'scholar'},71);
  Object.assign(s,{sem:6,month:1,card:null,feedback:null,notices:[],deferred:null,phase:'events',gpa:96,grade:96});s.policy.published=true;
  for(const tag of ['软件项目','实习经历','英语证书','科研经历','竞赛获奖'])E.addHistory(s,tag);for(let i=0;i<2;i++)E.addHistory(s,'公共表达');
  if(mode==='jobs'){s.route='work';s.deferred='jobs';E.ensureCard(s);}
  if(mode==='public'){s.route='civil';s.deferred='publicTargets';E.ensureCard(s);}
  if(mode==='offers'||mode==='ended'){
   const job=C.JOBS.find(j=>j.premium&&j.degree==='本科');let result=null;
   for(let seed=1;seed<500&&!result;seed++){s.rng=seed*39157;const r=R.recruitBatch(s,[job],{hasTag:E.hasTag,major:C.MAJORS.cs,probability:E.probability,random:E.random,scoreFor:()=>100})[0];if(r.offer&&r.rating==='SSP')result=r;}
   if(!result)throw Error('SSP not reached');s.jobResults=[result];s.selectedJobs=[job.id];s.card={id:'offers',kind:'offers',title:'招聘结果到了',text:'这批投递全部结算。'};
   if(mode==='ended'){E.selectOffer(s,job.id);E.choose(s,0);}
  }
  if(mode==='early')E.finish(s,'幸运人生','彩票大奖改变了生活，你选择收下这个特殊结局。');
  if(mode==='long'){
   s.name='甲乙丙丁戊己庚辛壬癸甲乙丙丁戊己';s.school='finance';s.sem=13;
   s.publicOffer={company:'江南省选调培养计划（公共服务方向）',city:'江城',role:'选调生（先赴基层锻炼）',salary:24,rating:'选调录用',salaryBasis:'税前年现金收入',hours:'基层实践',benefits:'培养支持',description:'基层锻炼'};
   E.finish(s,'公共服务的新起点','你开始了基层服务与培养。');
  }
  localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
 },mode);await page.reload();await click('resume');}
 await page.setViewportSize({width:1440,height:1000});await load('jobs');
 check(await page.locator('.job-card').count()===62,'all roles visible');
 await click('jobs-all');check(Number(await page.locator('#selected-count').innerText())>0,'bulk selection');
 await page.locator('.career-details').first().locator('summary').click();
 check((await page.locator('.jobs-list').innerText()).includes('SSP 100—120万'),'premium band visible');
 await page.screenshot({path:'output/playwright/pixel-jobs-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile job overflow');
 await page.screenshot({path:'output/playwright/pixel-jobs-mobile.png',fullPage:true});
 await load('public');check(await page.locator('.public-post').count()===8,'eight public choices');
 check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile public overflow');
 await page.screenshot({path:'output/playwright/pixel-public-mobile.png',fullPage:true});await click('choice',6);check((await read()).publicTarget==='township','chosen public post saved');await click('continue');
 await load('offers');check((await page.locator('.offer-rating').innerText())==='SSP','actual SSP badge');await page.locator('.career-details summary').click();
 check((await page.locator('.offer-card').innerText()).includes('股权估值'),'package breakdown');await click('offer');check((await read()).selectedOffer.rating==='SSP','rating persists into epilogue');await click('choice',0);
 check((await read()).ending,'offer graduation');check((await page.locator('.final-offer').innerText()).includes('SSP'),'ending rating retained');
 await click('summary-image');await page.locator('.poster-modal img').waitFor();check(await page.evaluate(()=>document.querySelector('.poster-modal img').naturalWidth===1080),'poster rendered');
 const dl=page.waitForEvent('download');await click('poster-download');const download=await dl;check(download.suggestedFilename().endsWith('.png'),'PNG download');await download.saveAs('output/playwright/pixel-summary.png');
 await page.screenshot({path:'output/playwright/pixel-poster-mobile.png',fullPage:true});await click('close');
 await page.setViewportSize({width:1440,height:1000});await click('summary-image');await page.locator('.poster-modal img').waitFor();await page.screenshot({path:'output/playwright/pixel-poster-desktop.png',fullPage:true});await click('close');
 for(const mode of ['early','long']){await load(mode);await click('summary-image');await page.locator('.poster-modal img').waitFor();const event=page.waitForEvent('download');await click('poster-download');await (await event).saveAs('output/playwright/pixel-summary-'+mode+'.png');await click('close');}
 check(!errors.length,errors.join(';'));return {passed:true,scenarios:['jobs-desktop-mobile','bulk-select','public-application','actual-SSP-result-selection','image-download','early-ending-image','long-text-image'],errors};
}
