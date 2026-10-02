import fs from 'node:fs';
import assert from 'node:assert/strict';
import {SCHOOLS,EVENTS} from '../src/content.js';
import {createGame,eventEligible,choiceAvailable} from '../src/engine.js';
const cases=[];
for(const school of SCHOOLS)for(const major of school.majors)for(let sem=0;sem<16;sem++)for(let month=0;month<5;month++)for(const identity of ['ordinary','dating','cadre','both'])for(const balance of [0,2000]){
 const s=createGame({school:school.id,major},75);Object.assign(s,{sem,month,week:0,card:null,feedback:null,balance,gpa:80,comp:60,combinedRank:120,rank:130});
 s.policy.published=sem>=2;s.policy.result=null;s.eligible=false;
 if(identity==='dating'||identity==='both')s.relationship={id:'current',person:{id:'p',name:'同学',rich:false},flags:{},intimacy:60,lastContact:s.calendarTick};
 if(identity==='cadre'||identity==='both')s.cadre={role:'class-study',startSem:sem-sem%2,flags:{}};
 const pool=EVENTS.filter(e=>eventEligible(s,e));assert.ok(pool.length,'empty fresh contextual pool');
 assert.ok(pool.every(e=>e.choices.some(c=>choiceAvailable(s,c,e).ok)),'event with no available choices');
 assert.ok(!pool.some(e=>e.id==='ticket-home'||e.locations?.includes('home')),'home leaks into campus pool');
 assert.ok(pool.filter(e=>e.gapOnly).every(()=>sem>=14),'gap leaks into student pool');
 cases.push({school:school.id,major,sem,month,identity,balance,size:pool.length,romance:pool.filter(e=>e.group==='romance').length,cadre:pool.filter(e=>e.group==='cadre').length});
}
const groups=Array.from({length:16},(_,sem)=>{const xs=cases.filter(x=>x.sem===sem);return {sem,scenarios:xs.length,min:Math.min(...xs.map(x=>x.size)),max:Math.max(...xs.map(x=>x.size))};});
const result={source:'Fresh available-pool capacity with no prior exposure, ordinary/dating/cadre/both and balances 0/2000. Not remaining content after a natural run; the full route audit measures depletion.',scenarios:cases.length,groups,cases};
fs.writeFileSync('output/round8-pool-capacity.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,cases:undefined},null,2));
