import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {EVENTS,PEOPLE} from '../src/content.js';
import {yearScore,lifetimeCredits,awardCredit,settleCadreCredits,refreshCreditAcademics,CADRE_POINTS} from '../src/score-ledger.js';
import {registerProgram,nextProgramCard,programAction,PROGRAM_TYPES} from '../src/participation.js';
import {RELATIONSHIP_EXPANSION} from '../src/relationship-expansion.js';
import {MISFORTUNE_EVENTS} from '../src/misfortune-events.js';
import {markEventShown,prepareStoryEvent} from '../src/story.js';
import {BALANCE_REVIEW} from '../src/balance-rules.js';
function ready(){const s=E.createGame({},741);Object.assign(s,{card:null,feedback:null,notifications:[],notices:[],deferred:null,phase:'events'});s.hooks['0-0-committee']=true;s.monthlyFreeDone=Object.fromEntries(Array.from({length:80},(_,i)=>[`${Math.floor(i/5)}-${i%5}`,true]));return s;}
const result=s=>nextProgramCard(s,{random:E.random,addHistory:E.addHistory,updateRanks:E.updateRanks,log:E.log});
function post(s,intimacy=65){s.relationship={id:'r1',person:PEOPLE[0],intimacy,started:0,flags:{},memories:0,lastContact:s.calendarTick};}

test('zero-base credits ignore ordinary activity, studying, exercise and jobs',()=>{
 const s=ready();assert.equal(s.comp,0);assert.equal(yearScore(s),0);E.applyEffects(s,{activity:20,study:5,tags:['校园活动','兼职经历','运动习惯']});E.updateRanks(s);assert.equal(s.comp,0);assert.equal(lifetimeCredits(s),0);
});
test('credits retain annual sources, deduplicate claims, cap each category and award upgrade differences',()=>{
 const s=ready();assert.equal(awardCredit(s,{key:'a',category:'competition',points:4,label:'校级三等',family:'work'}),4);assert.equal(awardCredit(s,{key:'b',category:'competition',points:14,label:'省级二等',family:'work'}),10);assert.equal(awardCredit(s,{key:'b',category:'competition',points:14,label:'重复'}),0);assert.equal(yearScore(s),14);
 for(let i=0;i<8;i++)awardCredit(s,{key:'v'+i,category:'service',points:3,label:'服务'});assert.equal(yearScore(s),19);
 s.sem=2;awardCredit(s,{key:'v-new',category:'service',points:2,label:'次年服务'});assert.equal(yearScore(s),2);assert.equal(lifetimeCredits(s),21);
});
test('cadre levels and different years accumulate only after actual fulfillment',()=>{
 const s=ready();s.cadre={role:'class-study',startSem:0,endSem:2,tasks:3,performance:2};s.cadreHistory=[{...s.cadre}];assert.equal(settleCadreCredits(s,{through:1}),0);assert.equal(settleCadreCredits(s,{through:2}),2);assert.equal(settleCadreCredits(s,{through:2}),0);
 s.sem=2;s.cadre={role:'year-leader',startSem:2,endSem:4,tasks:4,performance:1};s.cadreHistory.push({...s.cadre});assert.equal(settleCadreCredits(s,{through:4}),4);assert.equal(lifetimeCredits(s),6);assert.equal(CADRE_POINTS['union-president'],6);
});
test('early cadre exits prorate work and a title with no work earns zero',()=>{
 const s=ready();s.cadre={role:'class-leader',startSem:0,endSem:2,tasks:3,performance:1};s.cadreHistory=[{...s.cadre}];assert.equal(settleCadreCredits(s,{through:1,exit:true}),1.5);
 s.cadre={role:'union-head',startSem:2,endSem:4,tasks:0};s.cadreHistory.push({...s.cadre});s.sem=4;assert.equal(settleCadreCredits(s),0);
});
test('cumulative academics average annual points without counting spring as a second award',()=>{
 const s=ready();awardCredit(s,{key:'c',category:'certificate',points:4,label:'证书'});s.grades=[{sem:0,grade:80,comp:99},{sem:1,grade:90,comp:99}];s.sem=1;refreshCreditAcademics(s);assert.equal(s.comp,4);assert.deepEqual(s.grades.map(g=>g.comp),[4,4]);s.sem=2;refreshCreditAcademics(s);assert.equal(s.comp,2);
});
test('old saves migrate confirmed certificates and completed posts, never generic activity or missing evidence',()=>{
 const s=ready();s.version=4;delete s.creditRevision;delete s.creditLedger;s.sem=2;s.comp=100;s.activity=20;s.history=[{tag:'英语证书',sem:0,detail:''},{tag:'校园活动',sem:1,detail:''}];s.cadreHistory=[{role:'class-study',startSem:0,endSem:2,tasks:3,performance:1},{role:'class-life',startSem:0,endSem:2}];s.grades=[{sem:0,grade:80,comp:100}];s.notifications=[{title:'通知',text:'待确认'}];const rng=s.rng,log=structuredClone(s.log);const restored=E.migrateSave(s);assert.equal(restored.version,6);assert.equal(lifetimeCredits(restored),3);assert.equal(restored.rng,rng);assert.deepEqual(restored.log,log);assert.equal(restored.grades[0].comp,3);assert.deepEqual(E.migrateSave(restored).creditLedger,restored.creditLedger);
});
test('all ordinary results persist until confirmation, time and rewards settle only once',()=>{
 const s=ready();s.card={id:'routine',title:'自习',group:'common',kind:'choice',consume:true,duration:2,choices:[{text:'完成练习',effects:{study:3,energy:-10},result:'练习已完成。'}]};E.choose(s,0);assert.equal(s.week,0);assert.equal(s.feedback.inline,false);assert.equal(E.advanceRoutineResult(s),false);const restored=E.migrateSave(s);assert.ok(restored.feedback);const energy=restored.energy;assert.ok(E.continueFeedback(restored));assert.equal(restored.week,2);assert.equal(restored.energy,energy);assert.equal(E.continueFeedback(restored),false);
});
test('notification confirmation preserves suspended card and survives reload',()=>{
 const s=ready();s.card={id:'waiting',kind:'focus'};s.notifications=[{title:'生活账单',text:'已到账'},{title:'成绩',text:'已公布'}];const restored=E.migrateSave(s);assert.ok(E.acknowledgeNotification(restored));assert.equal(restored.notifications.length,1);assert.equal(restored.card.id,'waiting');assert.equal(restored.week,0);E.acknowledgeNotification(restored);assert.equal(E.acknowledgeNotification(restored),false);
});
test('exercise consumes energy, grows charm through consistency and has a semester cap',()=>{
 const s=ready();s.energy=80;const initial=s.charm;
 for(let i=0;i<8;i++){s.card={kind:'free'};s.freeTime={consume:false};s.feedback=null;assert.ok(E.freeAction(s,'exercise'));if(i===0)assert.equal(s.energy,72);}
 assert.equal(s.charm-initial,3);assert.equal(s.exerciseTerms[0].sessions,8);s.sem=1;E.applyEffects(s,{exercise:true});assert.equal(s.charm-initial,3.5);
});
test('monthly recovery is small, and mood gently returns toward a sustainable range',()=>{
 const s=ready();s.energy=25;s.mood=100;E.settleCalendarMonth(s,1);assert.equal(s.energy,27);assert.equal(s.mood,98);const before=s.energy;E.settleCalendarMonth(s,1);assert.equal(s.energy,before);
});
test('all existing 900 choices have balance review records and workloads cost actual energy',()=>{
 assert.equal(BALANCE_REVIEW.length,900);for(const c of E.activitiesFor(ready()).filter(x=>['study','work','exercise','date'].includes(x.id)))assert.ok(c.effects.energy<0,c.id);
 assert.equal(RELATIONSHIP_EXPANSION.length,48);assert.equal(RELATIONSHIP_EXPANSION.filter(e=>e.single).length,18);assert.equal(RELATIONSHIP_EXPANSION.filter(e=>e.dating).length,30);assert.equal(MISFORTUNE_EVENTS.length,12);
});
test('exam registration pays once and has a saved preparation, attendance and result chain',()=>{
 const s=ready();s.card={...prepareStoryEvent(s,EVENTS.find(e=>e.id==='english')),kind:'choice',consume:true};const before=s.balance;E.choose(s,0);assert.equal(s.balance,before-80);assert.equal(yearScore(s),0);const p=s.programs[0];assert.equal(p.status,'preparing');s.feedback=null;s.eventClock=p.due;s.card=result(s);assert.equal(s.card.id,'program-prepare');E.choose(s,0);assert.equal(p.status,'awaiting');assert.equal(p.prepared,2);s.feedback=null;s.eventClock=p.due;s.card=null;
 const restored=E.migrateSave(s);assert.equal(restored.programs[0].roll,p.roll);const card=result(restored);assert.equal(card.id,'program-result');assert.equal(restored.programs[0].status,'settled');const points=yearScore(restored),rng=restored.rng;assert.equal(result(restored),null);assert.equal(yearScore(restored),points);assert.equal(restored.rng,rng);
});
test('passing duplicate exams and failing competitions never invent extra credit',()=>{
 const s=ready();for(let i=0;i<2;i++){const p=registerProgram(s,'english',0,{ready:true});s.eventClock=p.due;result(s);}assert.equal(yearScore(s),1);const lose=registerProgram(s,'national',.99,{ready:true});s.eventClock=lose.due;result(s);assert.equal(lose.rank,null);assert.equal(yearScore(s),1);
});
test('tiered competition results report award level and correct points',()=>{
 for(const [type,points] of [['campus',3],['province',6],['national',10]]){const s=ready();const p=registerProgram(s,type,0,{ready:true});s.eventClock=p.due;const card=result(s);assert.equal(p.rank,1);assert.equal(yearScore(s),points);assert.match(card.text,/一等奖/);assert.match(card.text,new RegExp('综测 \\+'+points));}
});
test('withdrawal has an explicit nonrefundable result and outstanding same-type registrations are gated',()=>{
 const s=ready();const p=registerProgram(s,'mandarin',.5);s.card={programId:p.id};programAction(s,'programWithdraw');assert.equal(p.status,'withdrawn');assert.match(p.result,/不退费/);assert.equal(yearScore(s),0);registerProgram(s,'mandarin',.5);s.card={kind:'choice',consume:true};assert.equal(E.choiceAvailable(s,{action:'program:mandarin'}).ok,false);
});
test('registration fee descriptions agree with actual fees and relevant certificates have result records',()=>{
 for(const id of ['english','normal-language','acc-cert','year-certificate']){const e=EVENTS.find(e=>e.id===id);assert.match(e.text,new RegExp(Math.abs(e.choices[0].effects.balance)+'元'));assert.ok(e.choices[0].action.startsWith('program:'));}
 const s=ready();s.major='accounting';s.card={choices:[{action:'program:relevant',effects:{balance:-180}}]};const p=registerProgram(s,'relevant',0);assert.equal(p.type,'accounting');assert.equal(p.feePaid,180);assert.ok(PROGRAM_TYPES[p.type]);
});
test('negative incidents apply saved losses once, cap heavy cases and provide recovery',()=>{
 const s=ready(),e=EVENTS.find(e=>e.id==='incident-device');const before=s.mood;E.arriveEvent(s,e);assert.equal(s.mood,before-16);E.arriveEvent(s,e);assert.equal(s.mood,before-16);s.eventClock+=6;assert.equal(E.eventEligible(s,EVENTS.find(e=>e.id==='incident-family')),false);assert.ok(E.eventEligible(s,EVENTS.find(e=>e.id==='incident-noise')));
 s.card={...e,kind:'choice',consume:true};E.choose(s,1);assert.ok(s.incidentRecovery);s.feedback=null;s.card=null;s.eventClock=s.incidentRecovery.due;E.ensureCard(s);assert.equal(s.card.id,'incident-recovery');const energy=s.energy;E.choose(s,0);assert.ok(s.energy>energy);
});
test('illness pauses hard exercise while rest and ordinary tasks remain available',()=>{
 const s=ready();E.arriveEvent(s,EVENTS.find(e=>e.id==='incident-sprain'));s.card={kind:'free'};s.freeTime={consume:false};assert.equal(E.freeAction(s,'exercise'),false);assert.ok(E.freeAction(s,'rest'));
});
test('relationship scenes are unique across years and scoped to the current person',()=>{
 const s=ready();post(s);const e=EVENTS.find(e=>e.id==='bond-photo');markEventShown(s,e);s.sem=2;s.eventClock+=10;assert.equal(E.eventEligible(s,e),false);s.relationship.id='r2';assert.ok(E.eventEligible(s,e));
});
test('candidate familiarity and trust affect confession; postponing opens a different scene',()=>{
 const s=ready();s.candidate={id:'c',meetingId:'c1',gender:'female',familiarity:20,trust:50,interest:40,flags:{}};s.card={category:'social'};const p={base:.4,candidate:.003,mood:0,charm:0};const low=E.probability(s,p).value;Object.assign(s.candidate,{familiarity:70,trust:80,interest:70});assert.ok(E.probability(s,p).value>low);
 const e=EVENTS.find(e=>e.id==='social-new-invite');s.card={...e,kind:'choice',consume:true};E.choose(s,1);assert.equal(s.storyQueue.length,1);assert.notEqual(s.storyQueue[0].id,'social-new-invite');
});
test('new relationship conflicts have an actual onset loss and staged repairs cannot restore everything instantly',()=>{
 const s=ready();post(s,80);const e=EVENTS.find(e=>e.id==='bond-miss-start');E.arriveEvent(s,e);assert.equal(s.relationship.intimacy,68);s.card={...prepareStoryEvent(s,e),kind:'choice',consume:true};E.choose(s,0);assert.ok(s.relationship.intimacy<80);assert.equal(s.storyQueue[0].id,'bond-miss-middle');s.relationship=null;s.candidate=null;E.ensureCard(s);assert.ok(s.feedback);
});
test('an expired active role in a legacy save cannot suppress certificate migration',()=>{
 const s=ready();s.version=4;delete s.creditRevision;delete s.creditLedger;s.sem=2;s.history=[{tag:'英语证书',sem:0}];s.cadre={role:'class-study',startSem:0,endSem:2,tasks:3,performance:1};s.cadreHistory=[{...s.cadre}];const r=E.migrateSave(s);assert.equal(lifetimeCredits(r),3);assert.equal(r.cadre,null);
});
test('graduation finishes outstanding participation through player choices and result acknowledgement',()=>{
 const s=ready();s.sem=6;s.policy.published=true;const p=registerProgram(s,'english',0);s.card={kind:'offers'};E.acceptNoOffer(s);assert.equal(s.ending,null);assert.equal(s.card.id,'program-prepare');E.choose(s,0);E.continueFeedback(s);assert.equal(s.card.id,'program-result');assert.equal(p.status,'settled');assert.equal(s.ending,null);E.advanceNotice(s);assert.ok(s.ending);assert.equal(p.credit,1);
});
test('early endings resolve attended exams and explicitly cancel unfinished registration',()=>{
 const s=ready();const a=registerProgram(s,'english',0,{ready:true}),b=registerProgram(s,'national',.9);E.finish(s,'提前收尾','结束');assert.equal(a.status,'settled');assert.equal(b.status,'withdrawn');assert.match(b.result,/费用不退/);assert.ok(!s.programs.some(p=>['preparing','awaiting'].includes(p.status)));
});
test('high mood rewards diminish while real setbacks retain their full loss',()=>{
 const s=ready();s.mood=95;E.applyEffects(s,{mood:10});assert.equal(s.mood,95.5);E.applyEffects(s,{mood:-20});assert.equal(s.mood,75.5);
});
test('different pending competitions preserve their own results instead of silently swallowing a final',()=>{
 const s=ready();const first=registerProgram(s,'campus',.8),final=registerProgram(s,'campus',0,{ready:true});assert.ok(first&&final);assert.notEqual(first.id,final.id);assert.equal(s.programs.length,2);
});
test('actual competition advancement offers choices and awards only the higher-level difference',()=>{
 const s=ready();const p=registerProgram(s,'campus',0,{ready:true});s.eventClock=p.due;result(s);s.card=null;E.ensureCard(s);assert.equal(s.card.id,'program-advance');const before=s.balance;s.rng=1;E.choose(s,0);assert.equal(s.balance,before-160);const advanced=s.programs[1];assert.equal(advanced.family,p.family);s.feedback=null;s.card={kind:'choice',programId:advanced.id};programAction(s,'programPrepare');s.eventClock=advanced.due;result(s);assert.equal(advanced.rank,1);assert.equal(advanced.credit,3);assert.equal(yearScore(s),6);
});
test('exhausted candidate scenes do not replay the original confession',()=>{
 const s=ready();s.candidate={meetingId:'exhausted',id:'p',gender:'female',flags:{}};for(const e of EVENTS.filter(e=>e.storyScope==='candidate'&&!e.followOnly))markEventShown(s,e);s.eventClock+=20;const next=E.nextCandidateEvent(s);assert.equal(next.id,'candidate-checkin');assert.notEqual(next.id,'social-new-invite');assert.match(next.choices[0].result,/最近的变化/);
});
test('reasonable photo refusal and unrelated bad luck never reduce charm',()=>{
 const s=ready();post(s);s.card={...EVENTS.find(e=>e.id==='bond-photo'),kind:'choice',consume:true};const before=s.charm;E.choose(s,2);assert.equal(s.charm,before);s.feedback=null;E.arriveEvent(s,EVENTS.find(e=>e.id==='incident-device'));assert.equal(s.charm,before);
});
test('end-of-term participation cannot push the calendar beyond the semester boundary',()=>{
 const s=ready();s.month=5;const p=registerProgram(s,'english',0);s.card=null;E.ensureCard(s);assert.equal(s.card.id,'program-prepare');assert.equal(s.card.consume,false);E.choose(s,0);E.continueFeedback(s);assert.equal(s.month,5);assert.equal(s.card.id,'program-result');assert.equal(p.status,'settled');
});
test('retry after pending program resolution opens its target card instead of a blank scene',()=>{
 const s=ready();s.sem=7;s.month=1;s.route='exam';s.policy.published=true;registerProgram(s,'english',0);s.card={kind:'choice',choices:[{text:'二战',action:'retry',result:'完成本科收尾，准备第二次考试。'}]};E.choose(s,0);E.continueFeedback(s);assert.equal(s.card.id,'program-prepare');E.choose(s,0);E.continueFeedback(s);assert.equal(s.card.id,'program-result');E.advanceNotice(s);assert.equal(s.sem,14);assert.equal(s.card.kind,'target');assert.equal(s.attempt,2);
});
test('early graduate handover awards only actual fulfilled tenure and retains the past annual entries',()=>{
 const s=ready();s.sem=6;s.month=2;s.policy.published=true;s.cadre={role:'class-leader',startSem:6,endSem:8,tasks:3,performance:2};s.cadreHistory=[{...s.cadre}];s.card={kind:'offers'};E.acceptNoOffer(s);assert.ok(s.ending);assert.equal(s.cadreHistory[0].creditPoints,0.6);assert.equal(s.cadre,null);assert.equal(lifetimeCredits(s),0.6);
});

test('an exercise habit does not discount the onset loss from an accident',()=>{
 const s=ready();s.energy=80;s.traits.运动习惯=3;const e=EVENTS.find(x=>x.id==='incident-sprain');E.arriveEvent(s,e);assert.equal(s.energy,80+e.arrivalEffects.energy);E.arriveEvent(s,e);assert.equal(s.energy,80+e.arrivalEffects.energy);
});
