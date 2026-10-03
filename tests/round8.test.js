import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {EVENTS} from '../src/content.js';
import {academicMonth,vacationMonths} from '../src/calendar.js';
import {EVENT_CONDITIONS,unknownEventFields,eventConditionErrors} from '../src/event-conditions.js';
import {pruneStories,queueFollowUp,prepareStoryEvent,markEventShown} from '../src/story.js';
import {studyContribution,studyGain,semesterGrade} from '../src/academics.js';
import {LOTTERY_TICKETS,lotteryStats,drawPrize} from '../src/lottery.js';
import {recruitBatch} from '../src/recruitment.js';
import {MAJORS,JOBS} from '../src/content.js';

function ready(){const s=E.createGame({},321);s.notices=[];s.feedback=null;s.card=null;s.phase='events';s.hooks['0-0-committee']=true;return s;}
function relationship(s,id='r1'){s.relationship={id,person:{name:'同学',id:'p',gender:'female'},intimacy:60,flags:{},lastContact:s.calendarTick};}

test('natural conflict expiry releases pending and response markers together',()=>{
 const s=ready();relationship(s);s.rng=1;assert.ok(E.maybeRelationshipConflict(s));
 s.relationship.flags.conflictAvoided=true;s.relationship.flags.conflictDiscussed=true;
 s.eventClock=100;pruneStories(s);
 for(const flag of ['conflictPending','conflictAvoided','conflictDiscussed'])assert.equal(s.relationship.flags[flag],false);
});

test('second-attempt admission starts graduate finances after the gap year, without reusing gap-month keys',()=>{
 const s=ready();s.sem=15;s.month=1;s.route='exam';s.target='normal';s.attempt=2;
 E.settleCalendarMonth(s,48);E.settleCalendarMonth(s,49);E.settleCalendarMonth(s,54);
 assert.ok(E.resolveAdmissionAction(s,'examAccepted'));assert.equal(s.sem,8);assert.equal(s.graduateStartYear,5);
 assert.equal(academicMonth(s),60);assert.deepEqual(vacationMonths(s,'暑假'),[58,59]);
 const before=s.balance;assert.ok(E.settleCalendarMonth(s,60));assert.ok(s.balance>before);assert.equal(E.settleCalendarMonth(s,60),null);
 s.sem=9;s.month=0;assert.equal(academicMonth(s),65);
});

test('graduation relationship choice does not label a same-city couple as long distance',()=>{
 for(const sameCity of [true,false]){
  const s=ready();relationship(s);s.sem=6;s.route='work';const job=JOBS.find(j=>j.degree==='本科'&&j.tier===1);
  s.relationship.person.city=sameCity?job.city:'另一城';s.card={kind:'offers'};s.jobResults=[{id:job.id,offer:true,salary:job.salary}];
  assert.ok(E.selectOffer(s,job.id));assert.equal(s.card.id,'epilogue');assert.ok(E.choose(s,0));assert.equal(E.hasTag(s,'远距离相处'),!sameCity);
 }
});

test('declared conditions use executable predicates and unknown fields fail the audit contract',()=>{
  assert.ok(Object.values(EVENT_CONDITIONS).every(f=>typeof f==='function'));
  assert.deepEqual(EVENTS.flatMap(e=>unknownEventFields(e)),[]);
  assert.deepEqual(unknownEventFields({...EVENTS[0],minMissedTypo:2}),['minMissedTypo']);
  const s=ready(),e=EVENTS.find(e=>e.id==='attendance-warning');
  for(const [missed,expected] of [[0,false],[1,false],[2,true],[3,true]]){s.termBehavior.missed=missed;assert.equal(E.eventEligible(s,e),expected);}
  s.month=0;s.week=0;assert.equal(E.eventEligible(s,{...EVENTS[0],id:'window',months:[9],weeks:[1]}),true);
  s.week=1;assert.equal(E.eventEligible(s,{...EVENTS[0],id:'window',months:[9],weeks:[1]}),false);
  s.month=1;s.week=0;assert.equal(E.eventEligible(s,{...EVENTS[0],id:'window',months:[9],weeks:[1]}),false);
});

test('expired conflict follow-up clears pending markers, preserves loss, and allows another conflict',()=>{
  const s=ready();relationship(s);s.relationship.flags={conflictPending:true,conflictAvoided:true,conflictDiscussed:true};
  const c=EVENTS.find(e=>e.id==='love-unexpected-conflict').choices[1];
  queueFollowUp(s,c.followUp,'relationship');const before=s.relationship.intimacy;
  s.sem=14;const cancelled=pruneStories(s);assert.equal(cancelled.length,1);assert.equal(s.storyQueue.length,0);
  for(const flag of ['conflictPending','conflictAvoided','conflictDiscussed'])assert.equal(s.relationship.flags[flag],false);
  assert.equal(s.relationship.intimacy,before);s.calendarTick+=3;s.rng=1;
  assert.equal(E.maybeRelationshipConflict(s),true);assert.equal(s.relationship.intimacy,before-20);
});

test('an old relationship cancellation cannot clear the new relationship markers',()=>{
  const s=ready();relationship(s);queueFollowUp(s,{id:'love-conflict-follow',clearFlags:['conflictPending']},'relationship');
  relationship(s,'r2');s.relationship.flags.conflictPending=true;pruneStories(s);
  assert.equal(s.storyQueue.length,0);assert.equal(s.relationship.flags.conflictPending,true);
});

test('competition and internship expiry release active flags without awarding completion',()=>{
  for(const [id,flag] of [['competition-team','competitionActive'],['internship-work','internshipActive']]){
    const s=ready();s.plotFlags[flag]=true;queueFollowUp(s,{id,clearFlags:[flag]});s.eventClock=20;pruneStories(s);
    assert.equal(s.plotFlags[flag],false);assert.ok(!E.hasTag(s,id==='competition-team'?'竞赛获奖':'实习经历'));
  }
});

test('ordinary repeated scenes never claim student-cadre duties',()=>{
  const s=ready(),e=EVENTS.find(e=>e.id==='attendance-hole');markEventShown(s,e);
  const text=prepareStoryEvent(s,e).text;assert.ok(!text.includes('承担这一学年的职责'));
});

test('natural month keys deduplicate holiday and term recovery and preserve gap/graduate chronology',()=>{
  const s=ready();s.energy=20;relationship(s);s.relationship.lastContact=-5;
  const n=s.finances.length,b=s.balance,t=s.calendarTick,energy=s.energy,intimacy=s.relationship.intimacy;
  assert.equal(E.settleCalendarMonth(s,0,{holiday:'寒假'}),null);
  assert.equal(s.finances.length,n);assert.equal(s.balance,b);assert.equal(s.calendarTick,t);assert.equal(s.energy,energy);assert.equal(s.relationship.intimacy,intimacy);
  s.sem=1;s.month=0;assert.deepEqual(vacationMonths(s,'寒假'),[4,5]);assert.equal(academicMonth(s),5);
  E.settleCalendarMonth(s,4,{holiday:'寒假'});E.settleCalendarMonth(s,5,{holiday:'寒假'});
  const once={energy:s.energy,balance:s.balance,intimacy:s.relationship.intimacy,tick:s.calendarTick};
  assert.equal(E.settleCalendarMonth(s,5),null);assert.deepEqual({energy:s.energy,balance:s.balance,intimacy:s.relationship.intimacy,tick:s.calendarTick},once);
  s.sem=2;s.month=0;assert.deepEqual(vacationMonths(s,'暑假'),[10,11]);assert.equal(academicMonth(s),12);
  s.sem=8;assert.equal(academicMonth(s),48);s.sem=14;assert.equal(academicMonth(s),48);
});

test('actual fresh-year progression settles exactly twelve unique months and 21600 support',()=>{
  const s=E.createGame({},321);let steps=0;
  for(;steps<500&&!(s.sem===2&&s.card?.kind==='focus');steps++){
    if(s.feedback){E.continueFeedback(s);continue;}
    const c=s.card;assert.ok(c);
    if(c.kind==='notice'){E.advanceNotice(s);continue;}
    if(c.kind==='focus'){E.chooseFocus(s,'study');continue;}
    if(c.kind==='free'){E.freeAction(s,'study');continue;}
    if(c.kind==='choice'){
      if(c.consume){s.card={id:'term-walk',kind:'choice',consume:true,duration:4,choices:[{text:'完成课程',effects:{study:2},result:'完成课程'}]};E.choose(s,0);}
      else E.choose(s,c.id==='cadre-arrange'?2:0);
      continue;
    }
    throw new Error('unexpected '+c.kind);
  }
  assert.ok(steps<500);
  const year=s.finances.filter(f=>Number.isInteger(f.calendarMonth)&&f.calendarMonth<12);
  assert.equal(year.length,12);assert.equal(new Set(year.map(f=>f.calendarMonth)).size,12);
  assert.equal(year.reduce((n,f)=>n+f.income,0),21600);
  assert.deepEqual(year.map(f=>f.calendarMonth).sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i));
  assert.equal(year.find(f=>f.calendarMonth===4).cost,850);assert.equal(year.find(f=>f.calendarMonth===5).cost,850);
});

function vacation(sem=1){const s=ready();s.sem=sem;s.month=0;s.phase='start';E.ensureCard(s);assert.equal(s.card.kind,'free');return s;}
test('home ticket is excluded from random pools and requires an explicit holiday home choice',()=>{
  const s=ready(),ticket=EVENTS.find(e=>e.id==='ticket-home');assert.equal(E.eventEligible(s,ticket),false);assert.equal(E.eventEligible(s,ticket,true),false);
  const v=vacation();assert.equal(E.eventEligible(v,ticket,true),false);const balance=v.balance,energy=v.energy;
  E.freeAction(v,'rest');assert.equal(v.card.id,'ticket-home');assert.equal(v.balance,balance);assert.equal(v.energy,energy);assert.equal(E.eventEligible(v,ticket,true),true);
  assert.equal(E.eventEligible(v,ticket),false);
});
test('cancelling home restores the same holiday plans without costs, recovery or duplicate support',()=>{
  const s=vacation();const before={balance:s.balance,energy:s.energy,mood:s.mood,finance:s.finances.length,tick:s.calendarTick};
  E.freeAction(s,'rest');s.balance=0;assert.equal(E.choiceAvailable(s,s.card.choices[0]).ok,false);assert.equal(E.choiceAvailable(s,s.card.choices[1]).ok,false);
  s.balance=before.balance;E.choose(s,2);E.continueFeedback(s);
  assert.equal(s.card.kind,'free');assert.equal(s.freeTime.location,'campus');
  assert.deepEqual({balance:s.balance,energy:s.energy,mood:s.mood,finance:s.finances.length,tick:s.calendarTick},before);
  E.freeAction(s,'study');E.continueFeedback(s);assert.equal(s.freeTime,null);
});
test('both ticket choices arrive at home, open home-only scenes and complete the vacation once',()=>{
  for(const [choice,cost] of [[0,120],[1,260]]){
    const s=vacation();s.energy=20;s.mood=40;const balance=s.balance,finance=s.finances.length;
    E.freeAction(s,'rest');E.choose(s,choice);assert.equal(s.balance,balance-cost);assert.ok(s.energy>20);assert.equal(s.freeTime.location,'home');
    assert.equal(E.choose(s,choice),false);const restored=JSON.parse(JSON.stringify(s));E.continueFeedback(restored);
    assert.ok(restored.card.homeVisit);assert.ok(restored.card.id.startsWith('home-'));assert.equal(restored.finances.length,finance);
    E.choose(restored,0);E.continueFeedback(restored);assert.equal(restored.freeTime,null);assert.equal(restored.card.kind,'focus');assert.equal(restored.finances.length,finance);
    for(const e of EVENTS.filter(e=>e.locations?.includes('home')))assert.equal(E.eventEligible(restored,e,true),false);
  }
});
test('new-student prose is restricted by school, semester, month and first week',()=>{
  const s=ready(),map=EVENTS.find(e=>e.id==='year-map'),humanities=EVENTS.find(e=>e.id==='hu-first');
  assert.ok(E.eventEligible(s,map));s.week=1;assert.equal(E.eventEligible(s,map),false);s.week=0;s.month=4;assert.equal(E.eventEligible(s,map),false);
  s.month=0;s.major='humanities';assert.ok(E.eventEligible(s,humanities));s.school='normal';assert.equal(E.eventEligible(s,humanities),false);s.school='aero';s.sem=6;assert.equal(E.eventEligible(s,humanities),false);
});
test('qualification guarantees all offered school choices without a second random draw; no qualification rejects mutation',()=>{
  for(const school of ['aero','normal','finance']){
    const s=ready();s.route='recommend';s.eligible=true;s.card={kind:'target'};s.notices=[{kind:'notice',title:'其他通知',text:'不在此处抽取下一件随机事件'}];const rng=s.rng;
    assert.equal(E.selectTarget(s,school),true);assert.equal(s.admission.school,school);assert.equal(s.route,'admitted');assert.equal(s.rng,rng);assert.ok(!s.history.some(h=>h.tag==='保研落选'));assert.ok(s.log.some(l=>l.title==='推免录取确认'));
  }
  const s=ready();s.route='recommend';s.eligible=false;s.card={kind:'target'};const before=JSON.stringify(s);assert.equal(E.selectTarget(s,'aero'),false);assert.equal(JSON.stringify(s),before);
});
test('first routine threshold gives one meaningful feedback and record, without cluttering special experience tags',()=>{
  const s=ready();for(let i=0;i<3;i++)E.addHistory(s,'规律复习');assert.equal(E.hasTag(s,'规律复习'),false);assert.equal(s.routineUnlocks.length,0);
  s.card={id:'practice',group:'common',kind:'choice',consume:true,choices:[{text:'复习',effects:{study:2,tags:['规律复习']},result:'完成练习。'}]};
  E.choose(s,0);assert.ok(E.hasTag(s,'规律复习'));assert.ok(s.feedback.text.includes('已形成规律复习习惯'));assert.equal(s.feedback.effects.tags.length,0);assert.equal(E.importantExperiences(s).length,0);
  const unlocked=JSON.parse(JSON.stringify(s));E.addHistory(unlocked,'规律复习');assert.equal(unlocked.routineUnlocks.length,1);assert.equal(unlocked.log.filter(l=>l.kind==='unlock').length,1);
  assert.equal(E.probability(unlocked,{base:.5,tags:{规律复习:.1}}).value,.6);
});
function civil(score){const s=ready();s.sem=7;s.month=1;s.policy.published=true;s.route='civil';s.civilScore=score;E.ensureCard(s);return s;}
test('civil interview answers need corresponding real experience and provide different probabilities',()=>{
  const s=civil(70);assert.equal(s.card.id,'civil-interview');assert.equal(E.choiceAvailable(s,s.card.choices[0]).ok,false);assert.equal(E.choiceAvailable(s,s.card.choices[1]).ok,false);assert.equal(E.choiceAvailable(s,s.card.choices[2]).ok,true);
  E.addHistory(s,'政策调研');E.addHistory(s,'学生干部经历');assert.equal(E.choiceAvailable(s,s.card.choices[0]).ok,true);assert.equal(E.choiceAvailable(s,s.card.choices[1]).ok,true);
  const ps=s.card.choices.map(c=>E.probability(s,c.probability).value);assert.equal(new Set(ps).size,3);
});
test('civil selection distinguishes written failure and interview failure and preserves terminal probability evidence',()=>{
  const low=civil(44);assert.ok(low.ending.text.includes('未达到45分'));assert.ok(!low.log.some(l=>l.title==='公共岗位的面试'));
  const s=civil(45);s.rng=0xffffffff; // choose a failed outcome deterministically, then check the actual record
  let seed=1;while(seed<100000){const probe={rng:seed};if(E.random(probe)>.9)break;seed++;}s.rng=seed;
  E.choose(s,2);assert.ok(s.ending.text.includes('笔试已通过，面试未获录用'));
  const record=s.log.find(l=>l.title==='公共岗位的面试');assert.equal(record.probability.success,false);assert.ok(record.probability.value>0);assert.ok(record.text.includes('面试未获录用'));assert.ok(E.summaryText(s).includes('本次成功率'));
});

test('high preparation still grows and affects grades, without early hard truncation or zero-energy locks',()=>{
  assert.equal(studyGain(0,10),10);assert.ok(studyGain(36,6)>0&&studyGain(36,6)<6);
  assert.ok(studyContribution(36)<36*.58);assert.ok(studyContribution(60)>studyContribution(36));
  const s=ready();s.study=36;s.energy=0;const grade=semesterGrade(s);
  s.card={id:'high-study',kind:'choice',consume:false,choices:[{text:'继续复习',effects:{study:6,energy:-4},result:'完成复习。'}]};
  E.choose(s,0);assert.ok(s.study>36);assert.ok(s.feedback.effects.study>0&&s.feedback.effects.study<6);assert.equal(s.energy,0);assert.ok(semesterGrade(s)>grade);assert.ok(s.feedback.text.includes('增长会逐渐放缓'));
});
test('six lottery distributions reach approved win/profit targets and grand jackpot exactly 1/100',()=>{
  assert.deepEqual(LOTTERY_TICKETS.map(t=>t.price),[10,20,50,100,500,1000]);
  LOTTERY_TICKETS.forEach((t,i)=>{const stats=lotteryStats(t);assert.ok(Math.abs(stats.winChance-(.55+i*.05))<1e-12);assert.ok(Math.abs(stats.profitChance-(.25+i*.05))<1e-12);assert.equal(drawPrize(t.id,stats.jackpotChance/2),10000000);assert.ok(t.prizes.some(([v])=>v>0&&v<t.price));});
  const grand=LOTTERY_TICKETS.at(-1);assert.equal(lotteryStats(grand).jackpotChance,1/100);assert.equal(drawPrize(grand.id,.01),1000000);assert.ok(lotteryStats(grand).returnRatio>20);
});
test('high-requirement roles need academic or actual project plus internship preparation',()=>{
  const s=ready(),job=JOBS.find(j=>j.category==='tech'&&j.tier===3&&j.degree==='本科');s.gpa=77;
  assert.equal(E.jobEligibility(s,job).ok,false);s.gpa=86;assert.equal(E.jobEligibility(s,job).ok,true);
  s.gpa=77;E.addHistory(s,'软件项目');assert.equal(E.jobEligibility(s,job).ok,false);E.addHistory(s,'实习经历');assert.equal(E.jobEligibility(s,job).ok,true);
});
test('same test score and seed make preparation change offer probabilities and salary within job range',()=>{
  const job=JOBS.find(j=>j.category==='tech'&&j.tier===1),low=ready(),high=ready();low.gpa=77;high.gpa=95;
  for(const tag of ['软件项目','实习经历','英语证书'])E.addHistory(high,tag);
  low.rng=high.rng=1;low.interviewStyle=high.interviewStyle='interviewCase';
  const context={hasTag:E.hasTag,major:MAJORS.cs,probability:E.probability,random:E.random,scoreFor:()=>100};
  const a=recruitBatch(low,[job],context)[0],b=recruitBatch(high,[job],context)[0];
  assert.equal(a.score,b.score);assert.ok(a.offer&&b.offer);assert.ok(b.probability>a.probability);assert.ok(b.salary>a.salary);assert.ok(b.salary<=job.salaryMax&&a.salary>=job.salary);
});
test('company common evaluation correlates identical roles while retaining their correct marginal odds',()=>{
  const job=JOBS.find(j=>j.category==='tech'&&j.tier===1),jobs=[{...job,id:'a'},{...job,id:'b'}];let offered=0,joint=0,p=0;
  const context={hasTag:E.hasTag,major:MAJORS.cs,probability:E.probability,random:E.random,scoreFor:()=>100};
  const base=ready();
  for(let seed=1;seed<=3000;seed++){const s=structuredClone(base);s.rng=seed*123457;s.interviewStyle='interviewStudy';const [a,b]=recruitBatch(s,jobs,context);offered+=a.offer;joint+=a.offer&&b.offer;p=a.probability;if(a.companyShared)assert.equal(a.offer,b.offer);}
  assert.ok(Math.abs(offered/3000-p)<.035);assert.ok(joint/3000>p*p+.07);
});

test('condition validation rejects unusable types, ranges and mutually impossible windows',()=>{
  for(const changed of [{minMissed:'2'},{months:[0]},{weeks:[5]},{semesters:2},{minSem:4,maxSem:3},{storyScope:'unknown'},{repeat:'yes'}])assert.ok(eventConditionErrors({...EVENTS[0],...changed}).length);
  assert.deepEqual(EVENTS.flatMap(eventConditionErrors),[]);
});
test('holiday stay-at-campus rest remains free and cannot grant a home visit',()=>{
  const s=vacation();s.balance=0;s.energy=1;const finances=s.finances.length;
  assert.ok(E.activitiesFor(s).some(a=>a.id==='campus-rest'));
  assert.ok(E.freeAction(s,'campus-rest'));assert.equal(s.balance,0);assert.ok(s.energy>1);
  E.continueFeedback(s);assert.equal(s.freeTime,null);assert.equal(s.finances.length,finances);
  assert.ok(!s.log.some(l=>l.title.includes('车票')));
});
test('reading, communication and proposals do not fabricate completed research or paid internships',()=>{
  for(const id of ['space-paper','grad-first','hu-stat','hu-tech','hu-admit','psy-listen','edu-observe','lang-poem','grad-review']){
    const s=ready(),e=EVENTS.find(e=>e.id===id);s.sem=Math.max(e.minSem||0,0);s.card={...prepareStoryEvent(s,e),kind:'choice',consume:false};s.rng=1;
    assert.ok(E.choose(s,0),id);assert.ok(!E.hasTag(s,'科研经历'),id);assert.ok(!E.hasTag(s,'实习经历'),id);
  }
  const s=ready();E.addHistory(s,'教育实习');assert.ok(E.hasTag(s,'教学实践'));assert.ok(E.hasTag(s,'教育实习'));
  assert.equal(E.importantExperiences(s)[0].tag,'教学实践');assert.ok(!E.hasTag(s,'实习经历'));
});
test('old-missed-date scene requires an actually explained missed date, not any ordinary communication',()=>{
  const s=ready();relationship(s);const e=EVENTS.find(e=>e.id==='love-old-promise');s.relationship.flags.communicated=true;
  assert.equal(E.eventEligible(s,e),false);s.relationship.flags.missedExplained=true;assert.ok(E.eventEligible(s,e));
});
test('completed or cancelled branches release all their temporary context, including cadre response',()=>{
  for(const [id,scope] of [['competition-entry','run'],['internship-work','run'],['cadre-homework','cadre'],['love-plan','relationship'],['love-repair-talk','relationship']]){
    const s=ready();relationship(s);s.cadre={role:'class-study',startSem:0,flags:{}};
    const link=EVENTS.find(e=>e.id===id).choices.find(c=>c.followUp).followUp;
    const flags=scope==='run'?s.plotFlags:scope==='cadre'?s.cadre.flags:s.relationship.flags;
    assert.ok(link.clearFlags.length,id);for(const flag of link.clearFlags)flags[flag]=true;
    queueFollowUp(s,link,scope);s.eventClock=99;pruneStories(s);for(const flag of link.clearFlags)assert.equal(flags[flag],false,id+flag);
  }
});
test('delaying a candidate confession queues a new interaction instead of replaying the same scene',()=>{
  const s=ready();s.candidate={id:'person',meetingId:'candidate-1',gender:'female',flags:{}};
  queueFollowUp(s,{id:'social-new-invite',scope:'candidate',after:0});const current=s.storyQueue[0];
  s.card={...prepareStoryEvent(s,EVENTS.find(e=>e.id==='social-new-invite')),kind:'choice',consume:true,_follow:current};
  assert.ok(E.choose(s,1));assert.equal(s.storyQueue.length,1);assert.notEqual(s.storyQueue[0],current);
  E.continueFeedback(s);assert.ok(s.storyQueue.some(q=>q.id!=='social-new-invite'&&EVENTS.some(e=>e.id===q.id&&e.candidate)));
});


test('second-attempt pool is exclusive and student-life scenes cannot misstate graduated status',()=>{
  const s=ready();const gap=EVENTS.filter(e=>e.gapOnly);assert.equal(gap.length,10);
  for(const e of gap)assert.equal(E.eventEligible(s,e),false);
  s.sem=14;assert.ok(gap.filter(e=>!e.semesters).every(e=>E.eventEligible(s,e)));
  for(const id of ['morning','room-clean','groupwork','grade-low','love-campus-aero'])assert.equal(E.eventEligible(s,EVENTS.find(e=>e.id===id)),false,id);
  assert.ok(!E.eventEligible(s,EVENTS.find(e=>e.id==='space-paper')));
  for(const e of gap.filter(e=>e.semesters))assert.equal(E.eventEligible(s,e),false);
  s.sem=15;assert.ok(gap.every(e=>E.eventEligible(s,e)));
});
test('new candidate follow-up survives serializing the current card and queue separately',()=>{
  const s=ready();s.candidate={id:'person',meetingId:'candidate-serialized',gender:'female',flags:{}};
  queueFollowUp(s,{id:'social-new-invite',scope:'candidate',after:0});
  s.card={...prepareStoryEvent(s,EVENTS.find(e=>e.id==='social-new-invite')),kind:'choice',consume:true,_follow:s.storyQueue[0]};
  const restored=JSON.parse(JSON.stringify(s));assert.notEqual(restored.card._follow,restored.storyQueue[0]);
  assert.ok(E.choose(restored,1));assert.equal(restored.storyQueue.length,1);assert.notEqual(restored.storyQueue[0].queueId,s.storyQueue[0].queueId);
  E.continueFeedback(restored);assert.ok(restored.storyQueue.some(q=>q.id!=='social-new-invite'&&EVENTS.some(e=>e.id===q.id&&e.candidate)));
});
