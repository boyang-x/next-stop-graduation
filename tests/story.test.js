import test from 'node:test';
import assert from 'node:assert/strict';
import { EVENTS,PEOPLE } from '../src/content.js';
import { createGame,ensureCard,choose,continueFeedback,advanceNotice,freeAction,eventEligible,drawEvent,choiceAvailable } from '../src/engine.js';
import { initializeStory,queueFollowUp,pruneStories,prepareStoryEvent,markEventShown } from '../src/story.js';
function ready(){const s=createGame({background:'ordinary'},82);s.card=null;s.notices=[];s.phase='events';s.hooks['0-0-committee']=true;initializeStory(s);return s;}
function partner(s,id='partner-A'){s.relationship={id,person:PEOPLE[0],intimacy:60,memories:0,flags:{},lastContact:s.calendarTick,stage:'dating'};}
function scene(s,id){const e=EVENTS.find(e=>e.id===id);s.card={...prepareStoryEvent(s,e),kind:'choice',consume:true};s.feedback=null;return s.card;}
test('follow-only episodes never enter unrelated ordinary draws',()=>{const s=ready();partner(s);assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='love-rain')),false);assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='love-rain'),true),true);});
test('promise opens a saved follow-up, later choices leave a remembered consequence',()=>{
  const s=ready();partner(s);scene(s,'love-plan');choose(s,0);assert.equal(s.relationship.flags.promised,true);assert.equal(s.storyQueue[0].id,'love-rain');continueFeedback(s);freeAction(s,'skip');assert.equal(s.card.id,'love-rain');const saved=JSON.parse(JSON.stringify(s));assert.deepEqual(saved.storyQueue,s.storyQueue);choose(s,2);assert.equal(s.relationship.flags.missed,true);assert.ok(s.storyQueue.some(q=>q.id==='love-missed'));continueFeedback(s);while(s.card?.kind==='notice')advanceNotice(s);assert.equal(s.card.id,'love-missed');assert.match(s.card.text,/失约/);assert.equal(s.storyResults[0].id,'love-rain');
});
test('immediate conversation consumes no extra calendar time and finishes exactly once',()=>{
  const s=ready();partner(s);s.relationship.flags.missed=true;queueFollowUp(s,{id:'love-missed',after:0},'relationship');ensureCard(s);const slot=s.eventSlot,month=s.month,clock=s.eventClock;choose(s,0);continueFeedback(s);assert.equal(s.eventSlot,slot);assert.equal(s.month,month);assert.equal(s.eventClock,clock);assert.equal(s.storyQueue.length,0);assert.equal(s.storyResults.length,1);assert.equal(s.relationship.flags.missed,false);
});
test('breakup or a new person invalidates the old promise with a cancellation explanation',()=>{
  const s=ready();partner(s);queueFollowUp(s,{id:'love-rain'},'relationship');partner(s,'partner-B');const text=pruneStories(s);assert.equal(s.storyQueue.length,0);assert.match(text[0],/关系已经结束/);assert.equal(s.storyResults[0].status,'cancelled');assert.deepEqual(s.relationship.flags,{});
});
test('expiry and retirement cancel episodes, without stale active role gates',()=>{
  const s=ready();s.cadre={role:'class-study',startSem:0,endSem:2};queueFollowUp(s,{id:'cadre-homework',expires:2},'cadre');s.eventClock=3;assert.match(pruneStories(s)[0],/时间窗口/);queueFollowUp(s,{id:'cadre-homework'},'cadre');s.cadre=null;assert.match(pruneStories(s)[0],/任期/);assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='cadre-homework')),false);
});
test('post-specific duty and returned feedback affect performance and renewal record',()=>{
  const s=ready();s.cadre={role:'class-study',startSem:0,endSem:2,performance:0,tasks:0,flags:{}};s.cadreHistory=[{...s.cadre}];queueFollowUp(s,{id:'cadre-first',after:0},'cadre');ensureCard(s);assert.match(s.card.text,/收集作业/);choose(s,0);continueFeedback(s);assert.ok(s.storyQueue.some(q=>q.id==='cadre-homework'));s.eventClock++;s.card=null;ensureCard(s);assert.equal(s.card.id,'cadre-homework');choose(s,0);assert.equal(s.cadre.performance,2);assert.equal(s.cadreHistory[0].performance,2);continueFeedback(s);if(s.card.kind==='free')freeAction(s,'skip');assert.equal(s.card.id,'cadre-response');assert.match(s.card.text,/主动向你道谢/);choose(s,0);assert.equal(s.cadre.performance,3);
});
test('high rank student posts and a new partner have independent event cooldown scopes',()=>{
  const s=ready();partner(s);const e=EVENTS.find(e=>e.id==='love-budget');markEventShown(s,e);assert.equal(eventEligible(s,e),false);s.eventClock=e.cooldown;assert.equal(eventEligible(s,e),false,'same academic context still suppressed');s.sem=2;assert.equal(eventEligible(s,e),true,'new year has a different context');s.sem=0;s.eventClock=0;partner(s,'partner-new');assert.equal(eventEligible(s,e),true);
});
test('school romance is exclusive and prior collaboration makes an otherwise locked action available',()=>{
  const s=ready();partner(s);assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='love-campus-normal')),false);s.cadre={role:'class-leader',startSem:0,endSem:2,flags:{}};scene(s,'cadre-date-clash');assert.equal(choiceAvailable(s,s.card.choices[1]).ok,false);s.cadre.flags.helper=true;assert.equal(choiceAvailable(s,s.card.choices[1]).ok,true);
});
test('dating boosts romance despite study focus and no category becomes a locked story route',()=>{
  const s=ready();partner(s);s.focus='study';let romances=0,others=0;const groups=new Set();for(let i=0;i<2000;i++){s.eventClock=i;s.seen={};s.scopedSeen={};s.eventContexts={};s.recentEvents=[];const e=drawEvent(s);markEventShown(s,e);groups.add(e.group);e.group==='romance'?romances++:others++;}const ratio=romances/(romances+others);assert.ok(ratio>.25&&ratio<.40,'romance ratio '+ratio);assert.ok(groups.has('school')&&groups.has('major')&&groups.has('common'));
});
