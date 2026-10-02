import { writeFile } from 'node:fs/promises';
import { SCHOOLS, EVENTS } from '../src/content.js';
import { createGame, choose, choiceAvailable, continueFeedback, advanceNotice, chooseFocus, freeAction, selectCadre } from '../src/engine.js';
const results=[];
for(const school of SCHOOLS)for(const policy of ['study','balanced','rest']){
  const samples=[],categories={};let romance=0,spare=0;
  for(let seed=1;seed<=200;seed++){
    const s=createGame({school:school.id,major:school.majors[0]},seed);
    for(let n=0;n<1400&&s.card?.id!=='route';n++){
      if(s.feedback){continueFeedback(s);continue;}const c=s.card;
      if(c.kind==='notice'){advanceNotice(s);continue;}if(c.kind==='focus'){chooseFocus(s,policy==='study'?'study':policy==='rest'?'rest':'project');continue;}
      if(['free','lottery'].includes(c.kind)){spare++;freeAction(s,'rest');continue;}
      if(c.kind==='cadre'){selectCadre(s,policy==='balanced'?'class-study':'none');continue;}
      if(c.kind!=='choice')throw new Error(`Unexpected ${c.id}`);
      if(c.consume){const e=EVENTS.find(e=>e.id===c.id);categories[e?.category||'life']=(categories[e?.category||'life']||0)+1;if(c.group==='romance')romance++;}
      let options=c.choices.map((x,i)=>({x,i})).filter(({x})=>choiceAvailable(s,x).ok);
      if(policy==='balanced')choose(s,options[(seed+n*7)%options.length].i);
      else {const key=policy==='study'?'study':'energy';options.sort((a,b)=>(b.x.effects?.[key]||0)-(a.x.effects?.[key]||0));choose(s,options[0].i);}
    }
    if(s.card?.id!=='route')throw new Error('No graduation route');samples.push({eligible:s.eligible,grade:s.gpa,rank:s.rank,energy:s.energy,balance:s.balance});
  }
  const mean=key=>+(samples.reduce((n,s)=>n+s[key],0)/samples.length).toFixed(1);
  const total=Object.values(categories).reduce((a,b)=>a+b,0);
  results.push({school:school.id,policy,seeds:200,grade:mean('grade'),rank:mean('rank'),top10Percent:samples.filter(s=>s.rank<=30).length/2,top20Percent:samples.filter(s=>s.rank<=60).length/2,recommendationPercent:samples.filter(s=>s.eligible).length/2,energy:mean('energy'),balance:mean('balance'),romancePerRun:romance/200,sparePerRun:spare/200,categories:Object.fromEntries(Object.entries(categories).map(([k,v])=>[k,+(v/total*100).toFixed(1)]))});
}
await writeFile('output/calibration-current.json',JSON.stringify({sample:'200 seeds per school/policy; first major per school; stop at undergraduate route; simulation, not user statistics',results},null,2));console.log(JSON.stringify(results,null,2));
