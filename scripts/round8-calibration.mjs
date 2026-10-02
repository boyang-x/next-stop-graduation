import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {SCHOOLS,EVENTS} from '../src/content.js';
import {PERSONALITIES,energyMax} from '../src/personality.js';
const cases=[];
for(const trait of PERSONALITIES)for(const school of SCHOOLS)for(const strategy of ['study','balanced','activities','casual'])for(let seed=1;seed<=30;seed++){
  const s=E.createGame({school:school.id,major:school.majors[0],personality:trait.id},seed*127);
  let steps=0,zeroStudy=0,paidActivities=0;
  for(;steps<1000&&!s.hooks.qual&&!s.ending;steps++){
    if(s.feedback){E.continueFeedback(s);continue;}const c=s.card;assert.ok(c);
    if(c.kind==='notice'){E.advanceNotice(s);continue;}
    if(c.kind==='focus'){E.chooseFocus(s,strategy==='activities'?'social':strategy==='casual'?'rest':'study');continue;}
    if(c.kind==='cadre'){E.selectCadre(s,strategy==='activities'?'class-culture':'class-study');continue;}
    if(c.kind==='free'){
      const a=strategy==='casual'?'walk':strategy==='study'?'study':strategy==='activities'?'social':steps%2?'study':'exercise';
      const before=s.balance;if(!E.freeAction(s,a))assert.ok(E.freeAction(s,'study'));if(before>s.balance)paidActivities++;continue;
    }
    if(c.kind==='lottery'){E.freeAction(s,'back');continue;}
    const options=c.choices.map((x,i)=>({x,i})).filter(({x})=>E.choiceAvailable(s,x).ok);
    const score=x=>{const effects=x.effects||{},win=x.success?.effects||{};const st=effects.study||win.study||0,activity=effects.activity||win.activity||0;
      return strategy==='casual'?-st-activity:strategy==='study'?st:strategy==='activities'?activity+st*.15:st+activity*.8;};
    options.sort((a,b)=>score(b.x)-score(a.x));const chosen=options[0];assert.ok(chosen,c.id);
    if(s.energy===0&&(chosen.x.effects?.study||chosen.x.success?.effects?.study)>0)zeroStudy++;
    E.choose(s,chosen.i);assert.ok(s.energy>=0&&s.energy<=energyMax(s));
  }
  assert.ok(s.hooks.qual,'pre-qualification deadlock');
  cases.push({trait:trait.id,school:school.id,strategy,seed,steps,zeroStudy,paidActivities,gpa:s.gpa,comp:s.comp,combined:s.combined,rank:s.combinedRank,qualified:s.eligible,energy:s.energy,charm:s.charm,balance:s.balance});
}
const mean=(xs,key)=>+(xs.reduce((n,x)=>n+x[key],0)/xs.length).toFixed(2);
const groups=[];for(const trait of PERSONALITIES)for(const strategy of ['study','balanced','activities','casual']){const xs=cases.filter(c=>c.trait===trait.id&&c.strategy===strategy);groups.push({trait:trait.id,strategy,runs:xs.length,gpa:mean(xs,'gpa'),comp:mean(xs,'comp'),qualified:xs.filter(c=>c.qualified).length,zeroStudy:xs.reduce((n,c)=>n+c.zeroStudy,0),energy:mean(xs,'energy'),charm:mean(xs,'charm'),balance:mean(xs,'balance'),minBalance:Math.min(...xs.map(x=>x.balance)),maxBalance:Math.max(...xs.map(x=>x.balance))});}
const result={source:'authored automated strategies across 3 schools; not human player data',runs:cases.length,groups,cases};fs.writeFileSync('output/round8-calibration.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,cases:undefined},null,2));
