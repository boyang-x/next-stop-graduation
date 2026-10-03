import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {EVENTS,PEOPLE,SCHOOLS} from '../src/content.js';
import {GRADUATE_EXPANSION,GRADUATE_BANDS} from '../src/round12-graduate.js';
import {COMMON_EXPANSION,COMMON_CHAIN_SOURCES} from '../src/round12-common.js';
import {SCHOOL_EXPANSION,MAJOR_EXPANSION} from '../src/round12-campus-major.js';
import {RELATIONSHIP_EXPANSION_12,CADRE_EXPANSION} from '../src/round12-relationships-cadre.js';
import {flagsFor,prepareStoryEvent,storyWeek,pruneStories} from '../src/story.js';
import {graduationCatCard,finishCatGraduation,currentCatPhoto,catSVG} from '../src/campus-cat.js';
import {submitProjectApplication,projectApplicationCard} from '../src/project-application.js';
import {migrateCredits,yearScore,awardCredit} from '../src/score-ledger.js';
import {lotteryStats,LOTTERY_TICKETS} from '../src/lottery.js';
import {registerProgram} from '../src/participation.js';
const find=id=>EVENTS.find(e=>e.id===id);
function ready(){const s=E.createGame({},741);Object.assign(s,{card:null,feedback:null,notifications:[],notices:[],deferred:null,phase:'events'});s.hooks['0-0-committee']=true;return s;}
function scene(s,e){s.card={...prepareStoryEvent(s,e),kind:'choice',consume:false};}
test('all agreed content pools contain their complete authored additions',()=>{
 assert.equal(EVENTS.length,520);assert.equal(GRADUATE_EXPANSION.length,48);assert.equal(EVENTS.filter(e=>e.group==='graduate').length,68);
 assert.deepEqual([COMMON_EXPANSION.length,SCHOOL_EXPANSION.length,MAJOR_EXPANSION.length,RELATIONSHIP_EXPANSION_12.length,CADRE_EXPANSION.length],[36,18,26,18,12]);
 assert.deepEqual(Object.values(GRADUATE_BANDS).map(es=>es.length),[16,18,14]);
 assert.equal(GRADUATE_EXPANSION.filter(e=>e.followOnly).length,16);assert.equal(GRADUATE_EXPANSION.filter(e=>e.id.match(/-0$/)).length,8);
});
test('every new node is reachable in its declared context and has an available action',()=>{
 for(const e of EVENTS.filter(e=>e.id.startsWith('r12-'))){const s=ready();s.sem=e.semesters?.[0]??e.minSem??(e.graduateOnly?8:0);s.school=e.school||s.school;s.major=e.major||e.majors?.[0]||s.major;s.gender=e.gender||s.gender;s.balance=5000;
 s.relationship=e.dating?{id:'test-partner',person:PEOPLE[0],intimacy:70,flags:{},lastContact:s.calendarTick}:null;s.candidate=e.candidate?{meetingId:'test-meeting',id:'p',familiarity:60,trust:60,interest:50,flags:{}}:null;
 if(e.cadre)s.cadre={role:e.roles?.[0]||'class-study',startSem:s.sem,tasks:3,performance:2,flags:{}};
 if(e.months){let m=s.sem%2?[2,3,4,5,6]:[9,10,11,12,1];if(!e.months.some(x=>m.includes(x))){s.sem++;m=s.sem%2?[2,3,4,5,6]:[9,10,11,12,1];}s.month=m.indexOf(e.months.find(x=>m.includes(x)));assert.ok(s.month>=0,e.id);}
 for(const flag of e.requiresFlags||[])flagsFor(s,e.storyScope)[flag]=true;
 assert.ok(E.eventEligible(s,e,!!e.followOnly),e.id);scene(s,e);assert.ok(e.choices.some(c=>E.choiceAvailable(s,c).ok),e.id);
 }
});
test('professional, gender and year gates exclude inappropriate scenes',()=>{
 const s=ready(),cs=find('r12-grad-method-cs');s.sem=8;s.major='education';assert.equal(E.eventEligible(s,cs),false);s.major='cs';assert.ok(E.eventEligible(s,cs));s.sem=2;assert.equal(E.eventEligible(s,cs),false);
 for(const gender of ['male','female']){s.gender=gender;assert.ok(E.eventEligible(s,find('r12-clothes-'+gender)));assert.equal(E.eventEligible(s,find('r12-clothes-'+(gender==='male'?'female':'male'))),false);}
});
test('every graduate chain continues only after accepted work and can end before commitment',()=>{
 for(const root of GRADUATE_EXPANSION.filter(e=>/-0$/.test(e.id))){const s=ready();s.sem=root.semesters[0];s.major=root.majors?.[0]||'cs';for(const f of root.requiresFlags||[])s.plotFlags[f]=true;
 const middle=find(root.id.replace(/0$/,'1'));assert.equal(E.eventEligible(s,middle,true),false);scene(s,root);assert.ok(E.choose(s,0),root.id);assert.ok(s.storyQueue.some(q=>q.id===middle.id),root.id);assert.ok(E.eventEligible(s,middle,true),middle.id);
 const refused=ready();refused.sem=s.sem;scene(refused,root);E.choose(refused,2);assert.equal(refused.storyQueue.length,0,root.id);assert.ok(!refused.history.some(h=>h.tag==='发表成果'),root.id);
 }
});
test('late graduate commitments reserve time for their full follow-up chain',()=>{
 const s=ready();s.sem=13;s.month=4;s.policy.published=true;s.card={...prepareStoryEvent(s,find('r12-grad-career-0')),kind:'choice',consume:true};assert.equal(E.choiceAvailable(s,s.card.choices[0]).ok,false);assert.equal(E.choiceAvailable(s,s.card.choices[1]).ok,false);assert.ok(E.choiceAvailable(s,s.card.choices[2]).ok);assert.equal(E.choose(s,0),false);E.choose(s,2);assert.equal(s.storyQueue.length,0);
});
test('graduate research blocks keep monthly leisure and finish accepted chains before recruitment',()=>{
 const s=ready();s.sem=12;s.month=0;s.policy.published=true;s.card={...prepareStoryEvent(s,find('r12-grad-career-0')),kind:'choice',consume:true};
 assert.equal(E.actionDuration(s.card,s.card.choices[0],s),10);assert.ok(E.choose(s,0));E.continueFeedback(s);
 while(s.notifications.length)E.acknowledgeNotification(s);
 assert.equal(s.month,0);assert.equal(s.card.kind,'free');assert.equal(s.hooks.gradRecruit,undefined);assert.ok(s.storyQueue.some(q=>q.id==='r12-grad-career-1'));
 E.freeAction(s,'skip');while(s.notifications.length)E.acknowledgeNotification(s);assert.equal(s.month,1);assert.equal(s.card.kind,'free');assert.equal(s.hooks.gradRecruit,undefined);
 const common={consume:true,category:'study',duration:5};assert.equal(E.actionDuration(common,{},s),8);assert.equal(E.actionDuration(common,{},ready()),5);
});
test('a holiday social visit does not consume the first teaching-month free opportunity',()=>{
 const s=ready();s.sem=1;s.phase='start';s.card=null;s.policy.published=true;E.ensureCard(s);assert.ok(s.freeTime.holiday);s.candidate={meetingId:'holiday-meeting',id:'p',gender:'female',flags:{},familiarity:50,trust:50,interest:50};s.card={...prepareStoryEvent(s,find('r12-meet-message')),kind:'choice',consume:false,socialActivity:true};E.choose(s,0);E.continueFeedback(s);assert.equal(s.lastLeisureTick,undefined);assert.equal(s.card.kind,'focus');E.chooseFocus(s,'study');s.card={kind:'choice',consume:true,duration:1,choices:[{text:'完成教学月安排',effects:{study:1},result:'完成。'}]};E.choose(s,0);E.continueFeedback(s);assert.equal(s.card.kind,'free');assert.equal(s.freeTime.scheduled,true);assert.equal(s.freeTime.holiday,undefined);
});
test('graduate recruitment waits for the final research period and its monthly activities',()=>{
 const s=ready();s.sem=13;s.month=0;s.policy.published=true;s.pendingWeeks=6;s.weekendDue=true;s.monthlyFreeDone={};E.ensureCard(s);
 assert.equal(s.card.kind,'free');assert.equal(s.hooks.gradRecruit,undefined);E.freeAction(s,'skip');while(s.notifications.length)E.acknowledgeNotification(s);
 assert.equal(s.month,1);assert.equal(s.card.kind,'free');assert.equal(s.hooks.gradRecruit,undefined);E.freeAction(s,'skip');while(s.notifications.length)E.acknowledgeNotification(s);
 assert.equal(s.pendingWeeks,0);assert.equal(s.card.kind,'jobs');assert.equal(s.week,2);
});
test('prior certificate, reading, mentor, service, internship and travel choices open specific follow-ups',()=>{
 for(const [source,id] of COMMON_CHAIN_SOURCES){const s=ready();scene(s,find(source));assert.ok(E.choose(s,source==='intern-info'?1:0),source);assert.ok(s.storyQueue.some(q=>q.id==='r12-'+id+'-0'),source);assert.equal(yearScore(s),source==='volunteer'?1:0);}
});
test('clothing and grooming charge actual costs; free options improve charm and planning does not',()=>{
 for(const gender of ['male','female'])for(const kind of ['clothes','grooming'])for(let i=0;i<3;i++){const s=ready();s.gender=gender;const e=find('r12-'+kind+'-'+gender),c=e.choices[i],before=s.charm,balance=s.balance;scene(s,e);assert.ok(E.choose(s,i));assert.equal(s.balance,balance+(c.effects.balance||0));assert.equal(s.charm,Math.round((before+(c.effects.charm||0))*10)/10);assert.equal(yearScore(s),0);const restored=E.migrateSave(s);assert.equal(restored.charm,s.charm);}
 const poor=ready();poor.balance=0;scene(poor,find('r12-clothes-female'));assert.equal(E.choiceAvailable(poor,poor.card.choices[0]).ok,false);assert.ok(E.choiceAvailable(poor,poor.card.choices[1]).ok);
});
test('only explicit probabilistic expression failures lower charm, and the loss survives saving',()=>{
 const negative=EVENTS.flatMap(e=>e.choices.flatMap(c=>[c.effects,c.failure?.effects,c.success?.effects].filter(x=>x?.charm<0).map(()=>e.id)));
 assert.deepEqual(negative.sort(),['r12-presentation-question','r12-public-speaking']);
 const s=ready();scene(s,find('r12-public-speaking'));s.card.choices[0]={...s.card.choices[0],probability:{base:.001}};s.rng=123456789;const charm=s.charm;E.choose(s,0);assert.equal(s.feedback.probability.success,false);assert.equal(s.charm,charm-.5);assert.equal(E.migrateSave(s).charm,charm-.5);
});
test('all twelve incidents and their responses preserve charm and avoid the generic forced-overwork option',()=>{
 const incidents=EVENTS.filter(e=>e.id.startsWith('incident-')&&e.arrivalEffects);assert.equal(incidents.length,12);
 for(const e of incidents)for(let i=0;i<e.choices.length;i++){const s=ready(),charm=s.charm;E.arriveEvent(s,e);scene(s,e);E.choose(s,i);assert.equal(s.charm,charm,e.id);assert.doesNotMatch(e.choices[i].text,/全部做完|不处理|强行/);}
});
test('bad-luck work contexts expire; completed projects never count as active tasks',()=>{
 const s=ready();s.activeTasks={completed:true,other:true};assert.equal(E.eventEligible(s,find('incident-deadline')),false);s.cadre={role:'class-study',startSem:0};s.internship={completed:false};assert.equal(E.eventEligible(s,find('incident-deadline')),false);s.storyQueue=[{scope:'cadre',key:'class-study-0',id:'cadre-homework'}];assert.ok(E.eventEligible(s,find('incident-deadline')));
 s.taskContexts={collaboration:storyWeek(s)+2};assert.ok(E.eventEligible(s,find('incident-teammate')));s.week=3;assert.equal(E.eventEligible(s,find('incident-teammate')),false);s.taskContexts.collaboration=true;assert.equal(E.eventEligible(s,find('incident-teammate')),false);
});
test('a rejection requires a submitted application and keeps a saved result without redrawing',()=>{
 const s=ready();assert.equal(E.eventEligible(s,find('incident-rejection')),false);assert.equal(projectApplicationCard(s,find('incident-rejection')),null);submitProjectApplication(s,.9);s.eventClock++;const restored=E.migrateSave(s);const c=projectApplicationCard(restored,find('incident-rejection'));assert.equal(c.id,'incident-rejection');assert.equal(restored.projectApplication.roll,.9);assert.equal(projectApplicationCard(restored,find('incident-rejection')),null);
});
test('real simultaneous commitments can be interrupted before preparation, with no repeat roll on reload',()=>{
 const s=ready();registerProgram(s,'province',.5);registerProgram(s,'campus',.5);s.eventClock=1;s.rng=0;E.ensureCard(s);assert.equal(s.card.id,'incident-deadline');assert.equal(s.programs.filter(p=>p.status==='preparing').length,2);const mood=s.mood,rng=s.rng;const restored=E.migrateSave(s);E.ensureCard(restored);assert.equal(restored.mood,mood);assert.equal(restored.rng,rng);assert.equal(restored.card.id,'incident-deadline');
});
test('graduation resolves a pending project result through a visible choice',()=>{
 const s=ready();s.sem=6;s.policy.published=true;submitProjectApplication(s,.9);s.card={kind:'offers'};E.acceptNoOffer(s);assert.equal(s.card.id,'incident-rejection');assert.equal(s.ending,null);assert.ok(E.choose(s,1));E.continueFeedback(s);assert.ok(s.ending);assert.equal(s.projectApplication.status,'rejected');
});
test('cat familiarity stays on its campus and only established encounters unlock graduation',()=>{
 const s=ready();assert.equal(graduationCatCard(s),null);scene(s,find('r12-cat-meet'));E.choose(s,0);assert.equal(graduationCatCard(s),null);s.feedback=null;scene(s,find('r12-cat-again'));E.choose(s,0);assert.ok(graduationCatCard(s));s.school='finance';assert.equal(graduationCatCard(s),null);s.school='aero';assert.ok(graduationCatCard(s));
});
test('cat photo, refusal, degree transition and reload do not duplicate or invent a photograph',()=>{
 for(const take of [true,false]){const s=ready();s.campusFlags={aero:{catBonded:true}};finishCatGraduation(s,take);assert.equal(graduationCatCard(s),null);assert.equal(!!currentCatPhoto(s),take);const restored=E.migrateSave(s);assert.equal(!!E.summary(restored).catPhoto,take);restored.sem=8;assert.equal(currentCatPhoto(restored),null);assert.ok(graduationCatCard(restored));}
 assert.match(catSVG(),/shape-rendering="crispEdges"/);assert.notEqual(catSVG(),catSVG('sleeping'));
});
test('cat farewell finishes the pending graduation only after its result is confirmed',()=>{
 const s=ready();s.sem=6;s.policy.published=true;s.campusFlags={aero:{catBonded:true}};s.card={kind:'offers'};E.acceptNoOffer(s);assert.equal(s.card.id,'r12-cat-graduation');E.choose(s,0);assert.equal(s.ending,null);assert.ok(E.summary(s).catPhoto);E.continueFeedback(s);assert.ok(s.ending);assert.equal(s.catPhotos.length,1);
});
test('legacy awards are repriced by evidence and same-work upgrades retain only their difference',()=>{
 const s=ready();s.creditRevision=1;s.creditLedger=[{key:'a',category:'competition',points:10,label:'校级一等奖',year:0,sem:0,family:'same'},{key:'b',category:'competition',points:10,label:'省级一等奖',year:0,sem:0,family:'same'},{key:'certificate:英语证书',category:'certificate',points:4,label:'英语',year:0,sem:0}];s.programs=[{id:'a',type:'campus',rank:1,status:'settled',credit:10},{id:'b',type:'province',rank:1,status:'settled',credit:10}];const rng=s.rng;migrateCredits(s,{events:EVENTS});assert.deepEqual(s.creditLedger.map(r=>r.points),[3,3,1]);assert.equal(yearScore(s),7);assert.equal(s.rng,rng);const ledger=structuredClone(s.creditLedger);migrateCredits(s,{events:EVENTS});assert.deepEqual(s.creditLedger,ledger);
});
test('new lottery odds are exactly the approved probabilities and all prize classes are present',()=>{
 LOTTERY_TICKETS.forEach((t,i)=>{const stats=lotteryStats(t);assert.ok(Math.abs(stats.winChance-(.55+i*.05))<1e-12);assert.ok(Math.abs(stats.profitChance-(.25+i*.05))<1e-12);assert.ok(t.prizes.some(([x])=>x===100000));assert.ok(t.prizes.some(([x])=>x===1000000));assert.ok(Math.abs(t.prizes.reduce((n,[,p])=>n+p,0)-1)<1e-12);});
 assert.equal(lotteryStats(LOTTERY_TICKETS.at(-1)).jackpotChance,1/100);
});
