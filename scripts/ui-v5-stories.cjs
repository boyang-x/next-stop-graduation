async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('next-stop-campus-v1')));
  const click=(a,id)=>page.locator('[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
  const choose=i=>page.locator('[data-action="choice"][data-index="'+i+'"]').click();
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const shot=name=>page.screenshot({path:'output/playwright/v5-story-'+name+'.png',fullPage:true});
  async function fixture(mode){await page.evaluate(async mode=>{
    const E=await import('/src/engine.js'),S=await import('/src/story.js'),C=await import('/src/content.js');
    const s=E.createGame({name:'接续试玩',gender:'female',school:'normal',major:'education',background:'ordinary'},502);
    s.card=null;s.notices=[];s.feedback=null;s.phase='events';s.hooks['0-0-committee']=true;
    if(mode==='cadre'){s.cadre={role:'class-study',startSem:0,endSem:2,performance:0,tasks:0,flags:{}};s.cadreHistory=[{...s.cadre}];E.addHistory(s,'学生干部经历','学习委员');S.queueFollowUp(s,{id:'cadre-first',after:0},'cadre');}
    else{s.relationship={id:'story-partner',person:C.PEOPLE.find(p=>p.gender==='male'),intimacy:60,stage:'dating',memories:0,flags:{},lastContact:s.calendarTick};s.romances=[{name:s.relationship.person.name,start:'大一上',end:null}];
      if(mode==='cancel'){S.queueFollowUp(s,{id:'love-rain'},'relationship');s.relationship=null;}
      else s.card={...S.prepareStoryEvent(s,C.EVENTS.find(e=>e.id==='love-plan')),kind:'choice',consume:true};
    }
    E.ensureCard(s);localStorage.setItem('next-stop-campus-v1',JSON.stringify(s));
  },mode);await page.reload();await click('resume');}
  async function reach(id){for(let n=0;n<15;n++){const s=await read();if(s.card?.id===id)return;if(s.feedback){await click('continue');continue;}if(s.card.kind==='notice'){await click('notice');continue;}if(s.card.kind==='free'){await click('free','skip');continue;}if(s.card.kind==='choice'){await page.locator('[data-action="choice"]:not(:disabled)').first().click();continue;}throw new Error('Unexpected '+s.card.kind);}throw new Error('Missing '+id);}
  await page.setViewportSize({width:1440,height:1000});await fixture('cadre');assert((await read()).card.id==='cadre-first','first duty');await shot('cadre-start');const month=(await read()).month;await choose(0);await click('continue');assert((await read()).month===month,'meeting no extra month');await reach('cadre-homework');await shot('cadre-duty');await choose(0);await click('continue');await reach('cadre-response');assert((await read()).card.text.includes('主动向你道谢'),'prior help changes feedback');await shot('cadre-response');await choose(0);assert((await read()).cadre.performance===3,'performance recorded');
  await page.setViewportSize({width:390,height:844});await fixture('romance');const person=(await read()).relationship.person.name;assert((await read()).card.text.includes(person),'male partner templated for female player');await choose(0);await click('continue');await reach('love-rain');await page.reload();await click('resume');assert((await read()).card.id==='love-rain','follow-up persists');await shot('rain-mobile');await choose(2);await click('continue');await reach('love-missed');assert((await read()).relationship.flags.missed,'missed promise remembered');await shot('missed-mobile');await choose(0);assert(!(await read()).relationship.flags.missed,'communication resolves memory');await click('continue');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile width');await fixture('cancel');assert((await read()).card.kind==='notice','cancel broadcast');assert((await read()).card.text.includes('关系已经结束'),'reason explained');await shot('cancel-mobile');assert(errors.length===0,'page errors '+errors.join(','));return {status:'passed',scenarios:['cadre-duty-feedback','female-male-romance-promise','refresh-follow-up','cancelled-promise'],screenshots:6,errors};
}
