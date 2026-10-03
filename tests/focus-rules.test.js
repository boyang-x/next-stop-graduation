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
test('long-event plans settle three different months with exactly one reward and budget per month',()=>{
 const s=longWeekend(),manual=structuredClone(s);assert.equal(E.monthlyLeisureSlots(s).length,3);assert.ok(E.submitLeisurePlan(s,['work','work','work']));assert.equal(s.feedback.rows.length,3);assert.equal(s.feedback.leisureReport,true);
 for(let i=0;i<3;i++){assert.ok(E.freeAction(manual,'work'));E.continueFeedback(manual);}
 for(const field of ['balance','energy','mood','study','week','month','calendarTick','pendingWeeks'])assert.equal(s[field],manual[field],field);
 assert.deepEqual(s.finances,manual.finances);assert.equal(s.traits['兼职经历'],3);assert.equal(E.submitLeisurePlan(s,['work','work','work']),false);
 const restored=E.migrateSave(JSON.parse(JSON.stringify(s))),balance=restored.balance;E.continueFeedback(restored);assert.equal(restored.balance,balance);assert.ok(restored.card);assert.equal(restored.feedback,null);
});
test('manual monthly choice preserves later planned activities and all interactive options',()=>{
 const s=longWeekend();assert.ok(E.submitLeisurePlan(s,['rest','manual','work']));assert.equal(s.feedback.rows.length,1);E.continueFeedback(s);assert.equal(s.card.kind,'free');assert.equal(s.freeTime.manual,true);assert.equal(s.month,1);E.freeAction(s,'lottery');assert.equal(s.card.kind,'lottery');E.freeAction(s,'back');E.freeAction(s,'skip');assert.equal(s.feedback.rows.length,1);assert.equal(s.traits['兼职经历'],1);assert.equal(s.month,2);
});
test('unavailable planned activities require a replacement without awarding or advancing that month',()=>{
 const s=longWeekend();s.exercisePauseUntil=s.eventClock+10;assert.ok(E.submitLeisurePlan(s,['exercise','rest','rest']));assert.equal(s.month,0);assert.equal(s.freeTime.manual,true);assert.equal(s.traits['运动习惯'],undefined);assert.equal(s.feedback,null);assert.ok(E.freeAction(s,'rest'));
});
test('summer is one selection covering July and August and cannot become a monthly plan',()=>{
 const s=ready();s.sem=2;s.phase='start';E.ensureCard(s);assert.equal(s.freeTime.holiday,'暑假');assert.equal(E.monthlyLeisureSlots(s).length,0);assert.equal(s.finances.filter(x=>x.type==='holiday').length,2);E.freeAction(s,'study');E.continueFeedback(s);assert.equal(s.card.kind,'focus');assert.equal(s.freeTime,null);
});
test('pending old interview migrates once without RNG changes or rerolling acknowledged outcomes',()=>{
 const s=ready();Object.assign(s,{sem:7,month:1,route:'exam',target:'aero',examScore:89,quizHistory:[{purpose:'exam',weightedScore:100}],card:{id:'exam-interview',kind:'choice',choices:[]}});const rng=s.rng;const restored=E.migrateSave(s);assert.equal(restored.examScore,100);assert.equal(restored.rng,rng);assert.equal(restored.card.choices[0].probability,1);E.choose(restored,0);const current=E.migrateSave(restored);assert.deepEqual(current.feedback,restored.feedback);assert.equal(current.rng,restored.rng);
});
