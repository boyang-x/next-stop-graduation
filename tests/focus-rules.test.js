import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {QUESTIONS} from '../src/content.js';
import {interviewAssessment,admissionChance} from '../src/admission-rules.js';
function ready(seed=67){const s=E.createGame({},seed);s.phase='events';s.notices=[];s.notifications=[];s.deferred=null;s.hooks['0-0-committee']=true;s.lastIncidentClock=100;s.card=null;return s;}
function longWeekend(){const s=ready();s.card={id:'long-test',kind:'choice',consume:true,duration:10,choices:[{text:'完成任务',result:'完成'}]};E.choose(s,0);E.continueFeedback(s);assert.equal(s.card.kind,'free');return s;}
test('full written marks guarantee admission for every school and interview style, even with low preparation',()=>{
 for(const target of ['aero','finance','normal'])for(let seed=1;seed<=12;seed++)for(let index=0;index<3;index++){
  const s=ready(seed);Object.assign(s,{sem:7,month:1,route:'exam',target,examScore:100,examScoreVersion:2,gpa:0,charm:0});s.policy.published=true;E.ensureCard(s);assert.equal(s.card.id,'exam-interview');assert.equal(s.card.choices[index].probability,1);E.choose(s,index);assert.equal(s.examAssessment.accepted,true);assert.ok(s.admission);assert.equal(s.feedback.admission.writtenScore,100);
 }
});
test('admissions use actual 70/30 scores and monotonic odds with visible experience effects',()=>{
 const s=ready();Object.assign(s,{examScore:80,target:'aero'});const before=interviewAssessment(s,'results',E.hasTag);E.addHistory(s,'科研经历');const after=interviewAssessment(s,'results',E.hasTag);assert.ok(after.interviewScore>before.interviewScore);assert.equal(after.combinedScore,Math.round((80*.7+after.interviewScore*.3)*10)/10);
 let last=0;for(let score=0;score<=100;score+=.1){const value=admissionChance(score,80);assert.ok(value>=last-1e-10);assert.ok(value>=0&&value<=1);last=value;}
 s.examScore=71;assert.equal(interviewAssessment(s,'results',E.hasTag).value,0);
});
test('a real perfect written paper stays at 100 without academic preparation diluting the answers',()=>{
 const s=ready();Object.assign(s,{sem:6,month:3,route:'exam',gpa:0,study:0});s.policy.published=true;E.ensureCard(s);
 for(let i=0;i<50&&s.card.kind==='quiz';i++){const q=QUESTIONS.find(x=>x.id===s.quiz.questions[s.quiz.index]);assert.ok(E.answerQuestion(s,q.answer));assert.ok(E.nextQuestion(s));}
 assert.equal(s.examScore,100);assert.equal(s.quizHistory.at(-1).weightedScore,100);assert.equal(s.examScoreVersion,2);
});
test('zero admission probability is a recorded rejection rather than a missing probability branch',()=>{
 const s=ready();Object.assign(s,{sem:7,month:1,route:'exam',target:'aero',examScore:72,examScoreVersion:2,gpa:0,charm:0});s.policy.published=true;E.ensureCard(s);assert.equal(s.card.choices[0].probability,0);assert.ok(E.choose(s,0));assert.equal(s.feedback.probability.value,0);assert.equal(s.examAssessment.accepted,false);assert.equal(s.admission,null);
});
test('long events stop for one manual choice in every crossed month without duplicate rewards',()=>{
 const s=longWeekend(),balance=s.balance;
 for(let month=0;month<3;month++){assert.equal(s.card.kind,'free');assert.equal(s.month,month);assert.equal(s.traits['兼职经历']||0,month);assert.ok(E.freeAction(s,'work'));assert.equal(E.freeAction(s,'work'),false);E.continueFeedback(s);}
 assert.equal(s.month,2);assert.equal(s.week,2);assert.equal(s.pendingWeeks,0);assert.equal(s.card.kind,'choice');assert.equal(s.traits['兼职经历'],3);assert.equal(s.balance,balance+900);assert.equal(s.finances.filter(x=>x.key==='calendar-1').length,1);assert.equal(s.finances.filter(x=>x.key==='calendar-2').length,1);
});
test('manual weekends retain lottery interaction and refresh without choosing the following month',()=>{
 let s=longWeekend();E.freeAction(s,'rest');E.continueFeedback(s);assert.equal(s.month,1);const balance=s.balance;s=E.migrateSave(s);assert.equal(s.card.kind,'free');assert.equal(s.balance,balance);E.freeAction(s,'lottery');assert.equal(s.card.kind,'lottery');E.freeAction(s,'back');assert.equal(s.month,1);E.freeAction(s,'skip');assert.equal(s.month,2);assert.equal(s.card.kind,'free');assert.equal(s.traits['兼职经历'],undefined);
});
test('retired future plans are discarded on restore and cannot automatically execute',()=>{
 const raw=longWeekend();E.freeAction(raw,'rest');E.continueFeedback(raw);raw.monthlyLeisurePlan={'0-1':'manual','0-2':'work'};raw.leisureReportRows=[{text:'old transient row'}];const balance=raw.balance,rng=raw.rng;
 const s=E.migrateSave(raw);assert.equal(s.monthlyLeisurePlan,undefined);assert.equal(s.leisureReportRows,undefined);assert.equal(s.balance,balance);assert.equal(s.rng,rng);assert.ok(raw.monthlyLeisurePlan);E.freeAction(s,'skip');assert.equal(s.card.kind,'free');assert.equal(s.month,2);assert.equal(s.traits['兼职经历'],undefined);
});
test('an already settled old batch result resumes its saved card without paying again',()=>{
 const raw=longWeekend();E.freeAction(raw,'rest');E.continueFeedback(raw);raw.leisureReturnCard=raw.card;raw.card=null;raw.feedback={title:'这段时间的课余安排',leisureReport:true,rows:[{date:'九月',text:'已休息'}]};raw.monthlyLeisurePlan={'0-2':'work'};const balance=raw.balance,energy=raw.energy;
 const s=E.migrateSave(raw);assert.equal(s.feedback.leisureReport,true);assert.equal(s.monthlyLeisurePlan,undefined);E.continueFeedback(s);assert.equal(s.card.kind,'free');assert.equal(s.month,1);assert.equal(s.balance,balance);assert.equal(s.energy,energy);assert.equal(s.leisureReturnCard,undefined);E.freeAction(s,'skip');assert.equal(s.card.kind,'free');assert.equal(s.month,2);assert.equal(s.traits['兼职经历'],undefined);
});
test('multiple manually selected months still yield to entrance-exam milestones',()=>{
 const s=ready();Object.assign(s,{sem:6,month:2,week:2,route:'exam',pendingWeeks:6,weekendDue:true});s.policy.published=true;E.ensureCard(s);assert.equal(s.card.kind,'free');E.freeAction(s,'skip');assert.equal(s.card.kind,'quiz');assert.equal(s.month,3);assert.equal(s.quiz.purpose,'exam');
});
test('summer is one selection covering July and August with two monthly budgets',()=>{
 const s=ready();s.sem=2;s.phase='start';E.ensureCard(s);assert.equal(s.freeTime.holiday,'暑假');assert.equal(s.finances.filter(x=>x.type==='holiday').length,2);E.freeAction(s,'study');E.continueFeedback(s);assert.equal(s.card.kind,'focus');assert.equal(s.freeTime,null);
});
test('pending old interview migrates once without RNG changes or rerolling acknowledged outcomes',()=>{
 const s=ready();Object.assign(s,{sem:7,month:1,route:'exam',target:'aero',examScore:89,quizHistory:[{purpose:'exam',weightedScore:100}],card:{id:'exam-interview',kind:'choice',choices:[]}});const rng=s.rng;const restored=E.migrateSave(s);assert.equal(restored.examScore,100);assert.equal(restored.rng,rng);assert.equal(restored.card.choices[0].probability,1);E.choose(restored,0);const current=E.migrateSave(restored);assert.deepEqual(current.feedback,restored.feedback);assert.equal(current.rng,restored.rng);
});
