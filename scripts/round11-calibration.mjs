import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {SCHOOLS,QUESTIONS,JOBS} from '../src/content.js';
import {PERSONALITIES,energyPercent} from '../src/personality.js';
import {yearScore} from '../src/score-ledger.js';
export function simulate({trait='balanced',school='aero',strategy='balanced',seed=1,route='work'}={}){
 const campus=SCHOOLS.find(x=>x.id===school),s=E.createGame({school,major:campus.majors[0],personality:trait},seed*127);
 let steps=0,decisions=0,low=0,exhausted=0,full=0,moodFull=0,energySum=0,moodSum=0,romanceIds=[],minimum=100,recoveries=0;
 for(;steps<1800&&!s.ending;steps++){
  assert.ok(s.month>=0&&s.month<=5&&s.week>=0&&s.week<4,'invalid calendar '+s.sem+' '+s.month+' '+s.week);
  if(s.notifications?.length){E.acknowledgeNotification(s);continue;}
  if(s.feedback){E.continueFeedback(s);continue;}
  const c=s.card;assert.ok(c,`missing card ${s.sem} ${s.month}`);
  if(c.kind==='notice'){E.advanceNotice(s);continue;}
  if(c.kind==='focus'){E.chooseFocus(s,strategy==='social'?'social':strategy==='rest'?'rest':'study');continue;}
  if(c.kind==='cadre'){E.selectCadre(s,strategy==='social'?'class-culture':'class-study');continue;}
  if(c.kind==='target'){E.selectTarget(s,school);continue;}
  if(c.kind==='jobs'){E.submitJobs(s,JOBS.filter(j=>E.jobEligibility(s,j).ok).map(j=>j.id));continue;}
  if(c.kind==='offers'){if(s.jobResults.some(x=>x.offer))E.selectOffer(s,s.jobResults.find(x=>x.offer).id);else E.acceptNoOffer(s);continue;}
  if(c.kind==='quiz'){if(s.quiz.reveal)E.nextQuestion(s);else{const q=QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]);E.answerQuestion(s,q.answer);}continue;}
  if(c.kind==='lottery'){E.freeAction(s,'back');continue;}
  if(c.kind==='scratch'){E.revealTicket(s);continue;}
  const energy=energyPercent(s);minimum=Math.min(minimum,energy);energySum+=energy;moodSum+=s.mood;decisions++;if(energy<25)low++;if(energy===0)exhausted++;if(energy>=95)full++;if(s.mood>=95)moodFull++;
  if(c.kind==='free'){
   let action;
   if(strategy==='overwork')action=s.freeTime.holiday?'study':'work';
   else if(strategy==='rest')action=s.freeTime.holiday?'campus-rest':'rest';
   else if(energy<45)action=s.freeTime.holiday?'campus-rest':'rest';
   else if(strategy==='social')action=s.relationship?'date':'meet-new';
   else action=decisions%3===0?'exercise':'study';
   if(!E.freeAction(s,action))assert.ok(E.freeAction(s,'rest'));continue;
  }
  if(c.group==='romance'&&!c._follow)romanceIds.push((s.relationship?.id||s.candidate?.meetingId||'run')+':'+c.id);
  if(c.id==='incident-recovery')recoveries++;
  const options=c.choices.map((x,i)=>({x,i})).filter(({x})=>E.choiceAvailable(s,x).ok);assert.ok(options.length,c.id);
  const score=x=>{
   if(x.action===route)return 1000;
   if(c.id==='route')return -1000;
   if(x.action==='endJackpot'||x.action==='breakup'||x.action==='clearCandidate')return -100;
   if(x.action==='interviewStudy')return 100;
   const e=x.effects||{},st=e.study||x.success?.effects?.study||0,en=e.energy||0;
   if(strategy==='overwork')return st*4+(e.balance>0?e.balance/50:0)-Math.max(0,en);
   if(strategy==='rest'||energy<25)return en*3+(e.mood||0)-st;
   if(strategy==='social')return (e.intimacy||0)*2+(x.candidateDelta?.familiarity||0)+(x.success?.action==='date'?10:0)+(x.action==='meet'?8:0)+(x.credit?.points||0)*3;
   return st*3+(x.credit?.points||0)*2+en*.2+(x.action==='programPrepare'?10:0);
  };
  options.sort((a,b)=>score(b.x)-score(a.x));assert.ok(E.choose(s,options[0].i),c.id);
 }
 return {s,stats:{trait,school,strategy,seed,route,steps,decisions,lowRate:low/(decisions||1),zeroRate:exhausted/(decisions||1),fullRate:full/(decisions||1),moodFullRate:moodFull/(decisions||1),meanEnergy:energySum/(decisions||1),meanMood:moodSum/(decisions||1),minimum,gpa:s.gpa,comp:s.comp,charm:s.charm,incidents:s.incidents?.length||0,recoveries,romanceScenes:romanceIds.length,duplicates:romanceIds.length-new Set(romanceIds).size,pending:s.programs?.filter(p=>['awaiting','preparing'].includes(p.status)).length||0,ending:s.ending?.title}};
}
if(process.argv[1]?.endsWith('round11-calibration.mjs')){
 const cases=[];
 for(const trait of PERSONALITIES)for(const school of SCHOOLS)for(const strategy of ['overwork','balanced','social','rest'])for(let seed=1;seed<=12;seed++){
  const {s,stats}=simulate({trait:trait.id,school:school.id,strategy,seed});assert.ok(s.ending,'unfinished '+JSON.stringify(stats));assert.equal(stats.pending,0,'unsettled participation');cases.push(stats);
 }
 for(const route of ['exam','civil'])for(const school of SCHOOLS)for(let seed=1;seed<=8;seed++){
  const {s,stats}=simulate({school:school.id,strategy:'balanced',seed,route});assert.ok(s.ending,'unfinished route '+JSON.stringify(stats));assert.equal(stats.pending,0);cases.push(stats);
 }
 const mean=(xs,k)=>+(xs.reduce((n,x)=>n+x[k],0)/xs.length).toFixed(3),groups=[];
 for(const strategy of ['overwork','balanced','social','rest']){const xs=cases.filter(c=>c.strategy===strategy&&c.route==='work');groups.push({strategy,runs:xs.length,...Object.fromEntries(['meanEnergy','meanMood','lowRate','zeroRate','fullRate','moodFullRate','comp','charm','incidents','romanceScenes','duplicates'].map(k=>[k,mean(xs,k)])),lowest:Math.min(...xs.map(x=>x.minimum))});}
 const data={runs:cases.length,source:'固定策略与种子的自动模拟，不是人类玩家数据',groups,cases};fs.mkdirSync('output',{recursive:true});fs.writeFileSync('output/round11-calibration.json',JSON.stringify(data,null,2));console.log(JSON.stringify({runs:data.runs,groups},null,2));
 assert.ok(groups.find(g=>g.strategy==='overwork').lowRate>.15,'sustained workload should create fatigue');
 assert.ok(groups.find(g=>g.strategy==='balanced').meanEnergy>groups.find(g=>g.strategy==='overwork').meanEnergy+10,'deliberate recovery should matter');
 assert.ok(groups.every(g=>g.moodFullRate<.5),'mood should not stay capped');
}
