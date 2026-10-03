import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,choose,continueFeedback,advanceRoutineResult,ensureCard,drawEvent,eventEligible,applyEffects} from '../src/engine.js';
import {markEventShown,prepareStoryEvent} from '../src/story.js';
import {EVENTS,PEOPLE} from '../src/content.js';
function ready(){const s=createGame({school:'aero',major:'cs',background:'ordinary'},87);s.notices=[];s.hooks['0-0-committee']=true;s.phase='events';s.monthlyFreeDone=Object.fromEntries(Array.from({length:80},(_,i)=>[`${Math.floor(i/5)}-${i%5}`,true]));return s;}
test('ordinary result waits for confirmation, stays in the log and advances once',()=>{
  const s=ready();s.card={id:'ordinary-scene',group:'common',kind:'choice',consume:true,duration:2,title:'一次普通讨论',choices:[{text:'认真核对',effects:{study:3,energy:-4},result:'你找到了一处真实遗漏。'}]};choose(s,0);assert.equal(s.feedback.inline,false);assert.equal(s.week,0);const study=s.study;assert.equal(advanceRoutineResult(s),false);assert.ok(continueFeedback(s));assert.equal(s.week,2);assert.equal(s.study,study);assert.equal(s.recentOutcome,undefined);assert.ok(s.log.some(l=>l.text.includes('真实遗漏')));assert.equal(advanceRoutineResult(s),false);assert.equal(s.week,2);
});
test('romance, chain follow-ups and free-time decisions retain their full result step',()=>{
  for(const mode of ['romance','follow','vacant']){const s=ready();s.card={group:mode==='romance'?'romance':'common',kind:'choice',consume:true,_follow:mode==='follow'?{id:'absent',key:'run'}:null,title:'重要安排',choices:[{text:'选择',effects:{},result:'结果',freeTimeGain:mode==='vacant'?1:0}]};choose(s,0);assert.equal(advanceRoutineResult(s),false);assert.ok(s.feedback);}
});
test('monthly finance broadcasts stay queued until confirmed and remain in the log',()=>{
  const s=ready();s.month=0;s.week=2;s.card={group:'common',kind:'choice',consume:true,duration:2,choices:[{text:'继续',effects:{},result:'继续'}]};choose(s,0);continueFeedback(s);assert.equal(s.month,1);assert.notEqual(s.card?.title,'本月生活账单');assert.equal(s.broadcasts,undefined);assert.ok(s.log.some(n=>n.title==='本月生活账单'));assert.ok(s.notifications.some(n=>n.title==='本月生活账单'));
});
test('ordinary repeat flags do not replay the same event in a later semester',()=>{
  const s=ready(),e=EVENTS.find(e=>e.id==='budget');markEventShown(s,e);s.sem=3;assert.equal(eventEligible(s,e),false);
});
test('relationship scenes remain unique across years, and a new partner has independent history',()=>{
  const s=ready();s.relationship={id:'r1',person:PEOPLE[0],intimacy:70,flags:{}};const e=EVENTS.find(e=>e.id==='love-budget');markEventShown(s,e);s.eventClock+=20;assert.equal(eventEligible(s,e),false);s.sem=2;assert.equal(eventEligible(s,e),false);assert.ok(!prepareStoryEvent(s,e).text.startsWith('大二的安排已经不同'));s.relationship.id='r2';s.sem=0;assert.ok(eventEligible(s,e));
});
test('year-specific scenes cannot appear in unrelated years and graduate topics belong to graduate years',()=>{
  const s=ready();const first=EVENTS.find(e=>e.id==='year-map'),third=EVENTS.find(e=>e.id==='year-portfolio'),grad=EVENTS.find(e=>e.id==='year-grad-review');assert.ok(eventEligible(s,first));assert.equal(eventEligible(s,third),false);assert.equal(eventEligible(s,grad),false);s.sem=4;assert.ok(eventEligible(s,third));assert.equal(eventEligible(s,first),false);s.sem=10;assert.ok(eventEligible(s,grad));s.sem=12;assert.equal(eventEligible(s,grad),false);
});
test('low energy leaves exhausting choices available for player decisions',()=>{const s=ready();s.energy=0;const e={id:'exhausting',choices:[1,2,3].map(()=>({effects:{energy:-12}}))};assert.ok(eventEligible(s,e));});
