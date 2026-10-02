import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {PERSONALITIES,energyMax,energyPercent,changeEnergy} from '../src/personality.js';
import {monthlyBudget} from '../src/life-rules.js';
import {coCurricularScore,combinedScore,aggregateAcademics,repairAcademicCourse} from '../src/academics.js';
import {EVENTS,QUESTIONS} from '../src/content.js';
import {TEXT_REVISIONS} from '../src/text-polish.js';
const ready=(personality='balanced')=>{const s=E.createGame({personality},713);Object.assign(s,{card:null,feedback:null,notices:[],deferred:null,phase:'events'});s.hooks['0-0-committee']=true;return s;};

test('all traits share initial cash and allowance through study, vacation and retry years',()=>{
  for(const p of PERSONALITIES){const s=ready(p.id);assert.equal(s.finances[0].before,2000);assert.equal(s.balance,2300);assert.ok(!('background' in s));assert.ok(!('spendingStyle' in s));
    for(const sem of [0,7,8,13,14,15]){s.sem=sem;assert.equal(monthlyBudget(s).income,1800);assert.equal(monthlyBudget(s,{holiday:'暑假'}).income,1800);}
  }
});
test('starting traits change learning, activity gains and recovery independently',()=>{
  const study=[],activity=[],recovery=[];
  for(const p of PERSONALITIES){const s=ready(p.id);s.energy=energyMax(s)*.5;s.study=0;s.activity=0;E.applyEffects(s,{study:10,activity:5,energy:10});study.push(s.study);activity.push(s.activity);recovery.push(s.energy-energyMax(s)*.5);}
  assert.deepEqual(study,[10,11.5,9,9.5,9.5]);assert.deepEqual(activity,[5,5,5,6,5]);assert.deepEqual(recovery,[10,8,10,9,12.5]);
});
test('energy is normalized to each trait maximum and bounded without binary float tails',()=>{
  for(const p of PERSONALITIES){const s=ready(p.id);s.energy=p.energyMax*.8;assert.equal(energyPercent(s),80);E.applyEffects(s,{study:10});assert.equal(s.study,10.8*p.study);
    s.energy=0;for(let i=0;i<37;i++)changeEnergy(s,.3);assert.equal(s.energy,Math.round(s.energy*10)/10);changeEnergy(s,1000);assert.equal(s.energy,p.energyMax);changeEnergy(s,-1000);assert.equal(s.energy,0);
  }
});
test('zero energy permits prolonged study and its choices do not force recovery',()=>{
  const s=ready('scholar');s.energy=0;
  for(let i=0;i<5;i++){s.card={id:'zero-study',kind:'choice',consume:false,choices:[{text:'继续学习',effects:{study:4,energy:-3},result:'做完了练习'}]};assert.ok(E.choose(s,0));E.continueFeedback(s);assert.notEqual(s.card.id,'state-recovery');}
  assert.equal(s.energy,0);assert.ok(s.study>18&&s.study<4*.85*1.15*5,'high preparation reduces growth but never blocks further learning');
});
test('charm changes social chances but cannot improve unrelated exam or lottery results',()=>{
  const low=ready(),high=ready();low.charm=0;high.charm=100;for(const s of [low,high])s.card={category:'social',group:'romance'};
  const a=E.probability(low,{base:.5,mood:0}),b=E.probability(high,{base:.5,mood:0});assert.equal(a.value,.4);assert.equal(b.value,.6);assert.ok(b.reasons.some(r=>r==='魅力：成功概率 +10 个百分点'));
  for(const s of [low,high]){s.card={category:'study',group:'major'};assert.equal(E.probability(s,{base:.5,energy:0}).value,.5);}
  low.rng=high.rng=711;for(const s of [low,high]){s.freeTime={consume:false};s.card={kind:'lottery'};E.buyTicket(s,'small');}assert.equal(low.lotteryTransactions[0].prize,high.lotteryTransactions[0].prize);
  E.startQuiz(low,'civil');E.startQuiz(high,'civil');for(const s of [low,high]){const q=QUESTIONS.find(q=>q.id===s.quiz.questions[0]);E.answerQuestion(s,q.answer);}assert.equal(low.quiz.answers[0],high.quiz.answers[0]);
});
test('charm grows slowly from specific communication and is a minor established-relationship factor',()=>{
  const e=EVENTS.find(e=>e.id==='student-show');assert.equal(e.choices[0].success.effects.charm,.6);assert.equal(e.choices[0].failure.effects?.charm,undefined);
  const romance=EVENTS.find(e=>e.id==='love-conflict');assert.equal(romance.choices[0].probability.charm,.0005);
  const s=ready();E.applyEffects(s,{charm:.6});assert.equal(s.charm,50.6);E.applyEffects(s,{charm:1000});assert.equal(s.charm,100);E.applyEffects(s,{charm:-1000});assert.equal(s.charm,0);
});
test('academic and extracurricular scores are independent and ranking uses the 80/20 formula',()=>{
  assert.equal(coCurricularScore(0),50);assert.equal(coCurricularScore(8),70);assert.equal(coCurricularScore(20),100);assert.equal(combinedScore(90,60),84);
  const s=ready();s.gpa=90;s.comp=60;s.peers['aero-under']=[{grade:95,activity:0},{grade:80,activity:20}];E.updateRanks(s);
  // Peer totals are about 86 and 84 after a tiny semester grade variation.
  assert.equal(s.combined,84);assert.equal(s.combinedRank,3);assert.equal(s.rank,2);assert.ok(!('compRank' in s));
  s.comp=100;E.updateRanks(s);assert.equal(s.combined,92);assert.equal(s.combinedRank,1);assert.equal(s.rank,2);
});
test('degree changes and course repair recompute academics without inflating extracurricular scores',()=>{
  const s=ready();s.grades=[{sem:0,grade:40,comp:80},{sem:1,grade:90,comp:50},{sem:8,grade:95,comp:60}];s.academicFailures=[{id:'f',sem:0,resolved:false}];s.sem=1;aggregateAcademics(s);assert.equal(s.gpa,65);assert.equal(s.comp,65);assert.equal(s.combined,65);
  repairAcademicCourse(s,'f');assert.equal(s.gpa,75);assert.equal(s.comp,65);assert.equal(s.combined,73);s.sem=8;aggregateAcademics(s);assert.equal(s.gpa,95);assert.equal(s.comp,60);assert.equal(s.combined,88);
});
test('election first-year probability ignores placeholder grade, role experience and charm affect later elections',()=>{
  const election=(s,id)=>{s.card={kind:'cadre'};assert.ok(E.selectCadre(s,id));return E.probability(s,s.card.choices[0].probability);};
  const low=ready(),high=ready();low.gpa=0;high.gpa=100;assert.equal(election(low,'class-study').value,election(high,'class-study').value);
  for(const s of [low,high]){s.sem=2;s.grades=[{sem:0,grade:s.gpa,comp:50}];}assert.ok(election(high,'class-study').value>election(low,'class-study').value);
  const social=ready('social'),scholar=ready('scholar');assert.ok(election(social,'class-leader').value>election(scholar,'class-leader').value);
  const service=ready();E.addHistory(service,'志愿服务');E.addHistory(service,'志愿服务');E.addHistory(service,'志愿服务');assert.ok(election(service,'class-life').value>election(ready(),'class-life').value);
});
test('choice and free activity records retain actual trait-adjusted deltas and probability units',()=>{
  const s=ready('scholar');s.energy=60;s.card={id:'talk',kind:'choice',category:'social',consume:false,title:'一次交谈',choices:[{text:'谈谈',effects:{energy:10},probability:{base:.5,charm:.002,mood:.001},success:{text:'聊好了'},failure:{text:'没聊好'}}]};E.choose(s,0);const l=s.log.findLast(x=>x.title==='一次交谈');assert.equal(l.effects.energy,8);assert.ok(l.probability.reasons.every(r=>r.includes('个百分点')));
  s.feedback=null;s.card={kind:'free'};s.freeTime={consume:false};E.freeAction(s,'rest');assert.equal(s.log.at(-1).effects.energy,9.6);assert.equal(s.log.at(-1).effects.mood,3);
});
test('reviewed major and graduate choices have concrete varied text, preserving three options and actions',()=>{
  assert.ok(TEXT_REVISIONS.length>=140);const generic=/成果完成了。以后|生活不是只有冲刺。今天睡得|你的准备留在了本学期|认真推进这次工作/;
  for(const e of EVENTS){assert.equal(e.choices.length,3,e.id);for(const c of e.choices){assert.ok(c.text&&c.result||c.text&&c.success?.text&&c.failure?.text,e.id);assert.ok(!generic.test([c.text,c.result,c.success?.text,c.failure?.text].join(' ')),e.id);}}
  assert.equal(EVENTS.find(e=>e.id==='internship-apply').choices[0].success.action,'startInternship:local');
});
