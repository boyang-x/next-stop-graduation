import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,choose,continueFeedback,ensureCard,advanceNotice,freeAction,actionDuration,activitiesFor,acceptNoOffer} from '../src/engine.js';
import {semesterGrade,recordAcademicFailure,repairAcademicCourse,degreeCourses} from '../src/academics.js';
function ready(){const s=createGame({background:'ordinary'},212);s.card=null;s.notices=[];s.feedback=null;s.deferred=null;s.phase='events';s.hooks['0-0-committee']=true;return s;}
function drain(s){for(let i=0;i<40&&s.card?.kind==='notice';i++)advanceNotice(s);}
function act(s,duration){s.card={kind:'choice',consume:true,duration,choices:[{text:'做事',effects:{},result:'完成'}]};choose(s,0);continueFeedback(s);drain(s);}
test('short, ordinary and long work consume different time and cross month exactly once',()=>{
  const s=ready(),tick=s.calendarTick;act(s,1);assert.equal(s.week,1);assert.equal(s.month,0);freeAction(s,'skip');act(s,2);assert.equal(s.week,3);assert.equal(s.month,0);act(s,4);assert.equal(s.week,3);assert.equal(s.month,1);assert.equal(s.calendarTick,tick+1);assert.equal(s.finances.filter(f=>f.key==='calendar-1').length,1);
});
test('declining grants an afternoon but it cannot recursively grant more time',()=>{
  const s=ready();s.card={kind:'choice',consume:true,duration:3,choices:[{text:'留空',freeTimeGain:1,result:'留空'}]};choose(s,0);continueFeedback(s);assert.equal(s.week,0);freeAction(s,'rest');continueFeedback(s);assert.equal(s.week,1);assert.equal(freeAction(s,'rest'),false);assert.equal(s.eventClock,1);
});
test('action tiers and immediate conversations do not charge another month',()=>{
  const card={consume:true,duration:2};assert.equal(actionDuration(card,{effects:{study:6}}),3);assert.equal(actionDuration(card,{effects:{balance:500}}),4);assert.equal(actionDuration(card,{freeTimeGain:1}),1);assert.equal(actionDuration({...card,duration:0},{effects:{study:8}}),0);assert.equal(actionDuration({consume:false},{duration:4}),0);
});
test('a month-long action reaches the exam milestone before discretionary events',()=>{
  const s=ready();s.sem=6;s.month=2;s.week=2;s.route='exam';s.policy.published=true;act(s,4);assert.equal(s.month,3);assert.equal(s.card.kind,'quiz');assert.equal(s.quiz.purpose,'exam');assert.equal(s.freeTime,null);
});
test('summer and winter plans represent the whole vacation, settle once and carry study forward',()=>{
  for(const [sem,holiday,months] of [[1,'寒假',2],[2,'暑假',2]]){const s=ready();s.sem=sem;s.phase='start';const tick=s.calendarTick;ensureCard(s);assert.equal(s.freeTime.holiday,holiday);assert.equal(s.calendarTick,tick+months);assert.ok(activitiesFor(s).every(a=>!a.title.includes('午觉')));const finance=s.finances.length;ensureCard(s);assert.equal(s.finances.length,finance);freeAction(s,'study');const prep=s.study;continueFeedback(s);assert.equal(s.card.kind,'focus');assert.equal(s.study,prep);assert.ok(prep>=10);assert.equal(s.finances.filter(f=>f.type==='holiday').length,months);}
});
test('normal attendance can fall from a previously high grade; regular study and sustained absences differ',()=>{
  const s=ready();s.grade=95;s.study=0;s.energy=60;s.mood=60;s.termBehavior={missed:0,studyActions:0};const normal=semesterGrade(s);s.study=25;s.termBehavior.studyActions=6;const studied=semesterGrade(s);s.study=-12;s.termBehavior={missed:6,studyActions:0};const failed=semesterGrade(s);assert.ok(normal>=75&&normal<80);assert.ok(studied>90);assert.ok(failed<60);s.study=5;s.termBehavior.studyActions=1;assert.ok(semesterGrade(s)<70,'one last-minute action does not erase six absences');
});
test('an actual neglected term records failed courses and next term offers remediation',()=>{
  const s=ready();s.month=5;s.study=-12;s.termBehavior={missed:6,studyActions:0};ensureCard(s);assert.equal(s.academicFailures.length,1);assert.equal(s.academicFailures[0].resolved,false);assert.ok(s.grades[0].grade<60);drain(s);if(s.card.kind==='free'){freeAction(s,'skip');drain(s);}if(s.card.kind==='focus'){s.card=null;ensureCard(s);}drain(s);assert.equal(s.card.id,'course-remediation');assert.equal(s.card.choices.length,3);
});
test('remediation preserves original grade and activity points while recomputing cumulative academic results',()=>{
  const s=ready();s.grade=48;s.grades=[{sem:0,grade:48,comp:43.4},{sem:1,grade:80,comp:64}];recordAcademicFailure(s);s.sem=1;assert.ok(repairAcademicCourse(s,'course-0'));assert.equal(s.grades[0].originalGrade,48);assert.equal(s.grades[0].grade,60);assert.equal(s.grades[0].comp,43.4);assert.equal(s.gpa,70);assert.equal(degreeCourses(s).length,0);assert.equal(repairAcademicCourse(s,'course-0'),false);
});
test('no-offer graduation is blocked by unfinished courses and player may accept deferred graduation',()=>{
  const s=ready();s.sem=6;s.policy.published=true;s.grades=[{sem:0,grade:40,comp:32}];s.academicFailures=[{id:'course-0',sem:0,original:40,resolved:false,attempts:0}];s.jobResults=[];s.card={kind:'offers'};acceptNoOffer(s);assert.equal(s.ending,null);assert.equal(s.card.id,'course-remediation');assert.equal(s.card.consume,false);choose(s,2);assert.equal(s.ending.title,'毕业暂缓');assert.equal(s.ending.degree,'本科未毕业');
});
test('passing the graduation remediation reaches a coherent no-offer ending',()=>{
  const s=ready();s.sem=6;s.policy.published=true;s.grades=[{sem:0,grade:40,comp:32}];s.academicFailures=[{id:'course-0',sem:0,original:40,resolved:false,attempts:0}];s.jobResults=[];s.card={kind:'offers'};acceptNoOffer(s);s.rng=1;choose(s,0);assert.equal(s.academicFailures[0].resolved,true);continueFeedback(s);assert.equal(s.ending.title,'毕业，暂未获得 offer');assert.equal(s.ending.degree,'本科');assert.ok(s.grades[0].remediated);
});
