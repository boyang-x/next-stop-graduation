import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {PEOPLE} from '../src/content.js';
const runs=[];
for(let seed=1;seed<=100;seed++){
  const s=E.createGame({school:'normal',major:'psychology',background:'ordinary'},seed);
  s.relationship={id:'calibration-partner',person:PEOPLE[0],started:0,intimacy:70,flags:{},memories:0,lastContact:s.calendarTick};s.romances=[{name:PEOPLE[0].name,start:'大一上',end:null}];
  const samples=[];let conflicts=0,steps=0;
  for(;steps<900&&s.card?.id!=='route'&&!s.ending;steps++){
    if(s.relationship)samples.push(s.relationship.intimacy);
    if(s.feedback){E.continueFeedback(s);continue;}
    const c=s.card;if(c.kind==='notice'){E.advanceNotice(s);continue;}if(c.kind==='focus'){E.chooseSpending(s,'ordinary');E.chooseFocus(s,'study');continue;}
    if(c.kind==='cadre'){E.selectCadre(s,'none');continue;}
    if(['free','lottery'].includes(c.kind)){if(!E.freeAction(s,s.relationship?'date':'rest'))assert.ok(E.freeAction(s,'rest'));continue;}
    if(c.id==='love-unexpected-conflict')conflicts++;
    const choices=c.choices.map((x,i)=>({x,i})).filter(({x})=>E.choiceAvailable(s,x).ok);
    choices.sort((a,b)=>((b.x.effects?.intimacy||0)+(b.x.effects?.study||0)*.2)-((a.x.effects?.intimacy||0)+(a.x.effects?.study||0)*.2));assert.ok(E.choose(s,choices[0].i));
  }
  assert.ok(steps<900,'relationship flow stuck');runs.push({seed,steps,conflicts,mean:samples.reduce((a,b)=>a+b,0)/samples.length,at100:samples.filter(x=>x===100).length/samples.length,final:s.relationship?.intimacy??null});
}
const average=key=>runs.reduce((n,r)=>n+r[key],0)/runs.length;
const result={source:'100 deterministic simulations; initialized dating at 70, always choose largest visible intimacy gain, date whenever affordable; not human playtests',meanIntimacy:average('mean'),fractionAt100:average('at100'),conflictsPerRun:average('conflicts'),runs};fs.writeFileSync('output/round6-relationship-calibration.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,runs:undefined},null,2));
