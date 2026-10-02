import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {SCHOOLS,JOBS,MAJORS,QUESTIONS} from '../src/content.js';
import {PERSONALITIES} from '../src/personality.js';
import {recruitBatch} from '../src/recruitment.js';
import {LOTTERY_TICKETS,lotteryStats} from '../src/lottery.js';
const strategies=['study','balanced','casual','activities','romance','work'];
const econOnly=process.env.ROUND8_ECON_ONLY==='1';
const cases=econOnly?JSON.parse(fs.readFileSync('output/round8-quality-calibration.json','utf8')).cases:[],economy=[];
const val=(x,k)=>(x.effects?.[k]||0)+(x.success?.effects?.[k]||0)*.6+(x.failure?.effects?.[k]||0)*.4;
function pick(s,options,strategy){
 const score=x=>{
  const st=val(x,'study'),a=val(x,'activity'),i=val(x,'intimacy'),b=val(x,'balance'),tags=[...x.effects?.tags||[],...x.success?.effects?.tags||[]];
  if(strategy==='casual')return -st-a;
  if(strategy==='study')return st;
  if(strategy==='activities')return a+st*.15;
  if(strategy==='romance')return i+(x.action==='date'||x.action==='meet'?12:0)+(tags.includes('共同回忆')?5:0)+val(x,'mood')*.2;
  if(strategy==='work')return b/100+(tags.includes('实习经历')?8:0)+st*.1;
  return st+a*.8;
 };
 return [...options].sort((a,b)=>score(b.x)-score(a.x))[0];
}
function run(config,seed,strategy,lotto='none'){
 const s=E.createGame(config,seed);let steps=0,highStudyActions=0,highStudyActual=0,lowFunds=0,optionalSpent=0,optionalEarned=0;
 for(;steps<1000&&s.card?.kind!=='jobs'&&!s.ending;steps++){
  if(s.feedback){E.continueFeedback(s);continue;}const c=s.card;assert.ok(c);
  if(c.kind==='notice'){E.advanceNotice(s);continue;}
  if(c.kind==='focus'){E.chooseFocus(s,({study:'study',balanced:'study',casual:'rest',activities:'social',romance:'social',work:'work'})[strategy]);continue;}
  if(c.kind==='cadre'){E.selectCadre(s,strategy==='activities'?'class-culture':'class-study');continue;}
  if(c.kind==='free'){
   if(lotto!=='none'&&s.balance>=(lotto==='low'?10:1000)){E.freeAction(s,'lottery');continue;}
   const a=strategy==='work'&&s.freeTime.holiday==='暑假'&&s.sem>=2?'internship':strategy==='work'?'work':strategy==='study'?'study':strategy==='activities'?'social':strategy==='romance'?(s.relationship?'date':'meet-new'):strategy==='casual'?'walk':s.freeTime.holiday?'campus-rest':steps%2?'study':'exercise';
   const before=s.balance,st=s.study;let ok=E.freeAction(s,a);if(!ok){lowFunds++;ok=E.freeAction(s,s.freeTime.holiday?'campus-rest':'rest');}assert.ok(ok);
   optionalSpent+=Math.max(0,before-s.balance);optionalEarned+=Math.max(0,s.balance-before);if(st>=18&&s.study>st){highStudyActions++;highStudyActual+=s.study-st;}continue;
  }
  if(c.kind==='lottery'){if(lotto==='none'){assert.ok(E.freeAction(s,'back'));}else assert.ok(E.buyTicket(s,lotto==='high'?'grand':'pocket'));continue;}
  if(c.kind==='scratch'){E.revealTicket(s);continue;}
  if(c.id==='route'){const i=c.choices.findIndex(x=>x.action==='work');assert.ok(E.choose(s,i));continue;}
  const options=c.choices.map((x,i)=>({x,i})).filter(({x})=>E.choiceAvailable(s,x).ok&&(lotto!=='none'||!['lottery','browseLottery'].includes(x.action)));assert.ok(options.length,c.id);
  const chosen=c.id==='jackpot'?options.find(x=>x.i===1):pick(s,options,strategy),before=s.balance,st=s.study;
  assert.ok(E.choose(s,chosen.i));optionalSpent+=Math.max(0,before-s.balance);optionalEarned+=Math.max(0,s.balance-before);if(st>=18&&s.study>st){highStudyActions++;highStudyActual+=s.study-st;}
 }
 assert.equal(s.card?.kind,'jobs','failed to reach recruiting');
 const r=E.summary(s),m=r.recap.money;assert.equal(m.initial+m.support-m.necessary+m.otherNet,s.balance);
 // Use recorded action deltas, not raw balance differences that can include a month settlement.
 const actionSpent=s.log.reduce((n,l)=>n+Math.max(0,-(l.effects?.balance||0)),0),actionEarned=s.log.reduce((n,l)=>n+Math.max(0,l.effects?.balance||0),0);
 if(lotto==='none')assert.equal(r.lottery.count,0);
 return {s,stats:{strategy,lotto,seed,trait:config.personality,school:config.school,steps,gpa:s.gpa,comp:s.comp,combined:s.combined,rank:s.combinedRank,qualified:s.eligible,balance:s.balance,highStudyActions,highStudyActual,lowFunds,optionalSpent:actionSpent,optionalEarned:actionEarned,otherNonLotteryNet:m.otherNet-r.lottery.net,support:m.support,necessary:m.necessary,internshipGross:m.internshipGross,internshipCost:m.internshipCost,lotteryCount:r.lottery.count,lotteryNet:r.lottery.net,jackpots:s.lotteryTransactions.filter(t=>t.prize===10000000&&t.revealed).length}};
}
for(const trait of PERSONALITIES)for(const school of SCHOOLS)for(let seed=1;seed<=20;seed++){
 const config={personality:trait.id,school:school.id,major:school.majors[0]};
 if(!econOnly)for(const strategy of strategies){
  const {s,stats}=run(config,seed*127,strategy);const eligible=JOBS.filter(j=>E.jobEligibility(s,j).ok);
  // Fixed per-job scores isolate preparation and common-company assessment from question luck.
  for(const score of [100,60]){
   const state=structuredClone(s);state.rng=seed*419;state.interviewStyle='interviewStudy';
   const results=recruitBatch(state,eligible,{hasTag:E.hasTag,major:MAJORS[s.major],probability:E.probability,random:E.random,scoreFor:()=>score});const offers=results.filter(r=>r.offer);
   for(const offer of offers){const j=JOBS.find(j=>j.id===offer.id);assert.ok(offer.salary>=j.salary&&offer.salary<=j.salaryMax);}
   cases.push({...stats,score,eligible:eligible.length,eligibleTop:eligible.filter(j=>j.tier===3).length,offers:offers.length,topOffers:offers.filter(r=>JOBS.find(j=>j.id===r.id).tier===3).length,meanSalary:offers.length?offers.reduce((n,r)=>n+r.salary,0)/offers.length:null,meanMatch:results.reduce((n,r)=>n+(r.readiness||0),0)/results.length,salaries:offers.map(r=>({id:r.id,tier:JOBS.find(j=>j.id===r.id).tier,salary:r.salary,match:r.readiness}))});
  }
 }
 for(const lotto of ['none','low','high'])economy.push(run(config,seed*127,'balanced',lotto).stats);
}
const mean=(xs,key)=>{const valid=xs.filter(x=>x[key]!==null&&x[key]!==undefined);return valid.length?+(valid.reduce((n,x)=>n+x[key],0)/valid.length).toFixed(2):null;};
const groups=strategies.flatMap(strategy=>[100,60].map(score=>{const xs=cases.filter(x=>x.strategy===strategy&&x.score===score);return {strategy,score,runs:xs.length,gpa:mean(xs,'gpa'),comp:mean(xs,'comp'),qualified:xs.filter(x=>x.qualified).length,eligible:mean(xs,'eligible'),eligibleTop:mean(xs,'eligibleTop'),offers:mean(xs,'offers'),topOffers:mean(xs,'topOffers'),meanSalary:mean(xs,'meanSalary'),internshipGross:mean(xs,'internshipGross'),internshipCost:mean(xs,'internshipCost'),highStudyActions:xs.reduce((n,x)=>n+x.highStudyActions,0),highStudyActual:mean(xs,'highStudyActual')};}));
const econGroups=['none','low','high'].map(lotto=>{const xs=economy.filter(x=>x.lotto===lotto),sorted=xs.map(x=>x.balance).sort((a,b)=>a-b);return {lotto,runs:xs.length,mean:mean(xs,'balance'),median:(sorted[149]+sorted[150])/2,min:sorted[0],max:sorted.at(-1),jackpotRuns:xs.filter(x=>x.jackpots).length,support:mean(xs,'support'),necessary:mean(xs,'necessary'),internshipGross:mean(xs,'internshipGross'),internshipCost:mean(xs,'internshipCost'),optionalSpent:mean(xs,'optionalSpent'),optionalEarned:mean(xs,'optionalEarned'),otherNonLotteryNet:mean(xs,'otherNonLotteryNet'),lotteryCount:mean(xs,'lotteryCount'),lotteryNet:mean(xs,'lotteryNet'),lowFunds:mean(xs,'lowFunds')};});
const result={source:'1800 natural strategies to recruiting, 3600 controlled recruiting batches at fixed 100/60 per-job score; 900 separate natural economic runs. Same seeds/traits/schools/major, all eligible jobs. Eligibility intentionally differs with preparation. Not human player statistics or isolated historical A/B.',groups,econGroups,theory:LOTTERY_TICKETS.map(t=>({price:t.price,...lotteryStats(t)})),cases,economy};
fs.writeFileSync('output/round8-quality-calibration.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,cases:undefined,economy:undefined},null,2));
