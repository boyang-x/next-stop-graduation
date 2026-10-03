import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {EVENTS} from '../src/content.js';
import {prepareStoryEvent} from '../src/story.js';
import {internshipTerms} from '../src/economy.js';

const event = id => EVENTS.find(e => e.id === id);
function ready(id) {
  const s = E.createGame({}, 321);
  Object.assign(s, {notices:[], feedback:null, deferred:null, phase:'events', energy:50, mood:50});
  s.hooks['0-0-committee'] = true;
  s.card = {...prepareStoryEvent(s,event(id)), kind:'choice', consume:false};
  return s;
}

test('coffee payment buys a drink; free reading and leaving do not charge', () => {
  for (const index of [0,1,2]) {
    const s = ready('coffee'), before = s.balance;
    assert.ok(E.choose(s,index));
    assert.equal(s.balance - before,index === 0 ? -20 : 0);
    if (index === 1) assert.ok(s.study > 0);
    if (index === 2) assert.equal(s.feedback.freeTimeGain,1);
    assert.match(s.card.text,/咖啡店/);
    assert.match(s.card.choices[index].text,index === 0 ? /买.*饮品/ : index === 1 ? /免费.*阅览/ : /离开/);
  }
});

test('tutoring explains trial-only versus completed-work pay before either outcome', () => {
  for (const success of [true,false]) {
    const s = ready('tutoring'), before = s.balance;
    const p = E.probability(s,s.card.choices[0].probability).value;
    const seed = Array.from({length:40000},(_,i)=>i+1).find(rng => (E.random({rng}) < p) === success);
    s.rng = seed;
    assert.match(s.card.choices[0].note,/800.*100/);
    assert.ok(E.choose(s,0));
    assert.equal(s.feedback.probability.success,success);
    assert.equal(s.balance-before,success ? 800 : 100);
    assert.match(s.feedback.text,success ? /完成后续辅导/ : /没有安排后续辅导/);
    assert.equal(E.choose(s,0),false);
  }
  const s = ready('tutoring'), before = s.balance;
  assert.ok(E.choose(s,2));assert.equal(s.balance,before);assert.ok(s.study > 0);
  assert.match(s.feedback.text,/同学.*备课笔记/);
  assert.equal(E.hasTag(s,'兼职经历'),false);
});

test('contingent replacement cost is disclosed and cannot overdraw the wallet', () => {
  const s = ready('lost-card');s.balance = 24;
  assert.equal(E.choiceAvailable(s,s.card.choices[1]).ok,false);
  assert.match(s.card.choices[1].note,/找到.*不花钱.*未找到.*25/);
  assert.ok(E.choiceAvailable(s,s.card.choices[2]).ok);
  assert.ok(E.choose(s,2));assert.equal(s.balance,24);
});

test('work, grant and prepaid practice outcomes correspond to completed actions', () => {
  for (const [id,index,amount,action] of [['budget',1,450,/完成.*兼职/],['balance-low',0,400,/提交.*材料/],['money-family',1,150,/兼职.*交通费.*实践/]]) {
    const s = ready(id), before = s.balance;
    assert.match(s.card.choices[index].text,action);
    assert.ok(E.choose(s,index));assert.equal(s.balance-before,amount);
  }
  const s = ready('city-intern');
  assert.match(s.card.text,/不提供工资/);
  assert.match(s.card.choices[0].note,/2400.*1200/);
  s.balance=2399;assert.equal(E.choiceAvailable(s,s.card.choices[0]).ok,false);
});

test('skipping morning class to borrow notes remains an absence; waiting for rain is a short pause', () => {
  const s = ready('morning');assert.ok(E.choose(s,2));
  assert.equal(s.termBehavior.missed,1);assert.ok(s.study>0);
  const rain = ready('rain'), before = rain.energy;
  assert.ok(E.choose(rain,2));assert.equal(rain.energy-before,2);
  assert.match(rain.feedback.text,/门厅.*晚到/);
});

test('private coordination and handing back a letter do not award volunteer credentials', () => {
  for (const [id,index] of [['room-conflict',2],['mystery-envelope',1]]) {
    const s = ready(id);assert.ok(E.choose(s,index));
    assert.equal(E.hasTag(s,'志愿服务'),false);
    assert.equal(s.traits['校园活动']||0,0);
  }
});

test('save refresh updates unresolved and suspended scenes, preserves feedback, flags and RNG', () => {
  const s = ready('coffee');
  Object.assign(s.card,{title:'校园里的安静角落',text:'这里没有绩点讨论。'});
  s.card.choices[0].text='坐一会儿';s.card._follow={queueId:'keep-queue',id:'coffee'};
  s.freeTime={external:true,returnCard:structuredClone(s.card),returnDeferred:'jobs'};
  const serialized = structuredClone(s), updated = E.migrateSave(s);
  assert.deepEqual(s,serialized,'input save is immutable');
  assert.equal(updated.card.title,event('coffee').title);
  assert.equal(updated.card.choices[0].text,event('coffee').choices[0].text);
  assert.equal(updated.freeTime.returnCard.title,event('coffee').title);
  assert.deepEqual(updated.card._follow,s.card._follow);
  for (const key of ['rng','balance','eventClock','storyQueue','plotFlags','log']) assert.deepEqual(updated[key],s[key],key);
  s.feedback={text:'旧结果已结算',effects:{balance:-20}};
  const resolved=E.migrateSave(s);
  assert.deepEqual(resolved.card,s.card);assert.deepEqual(resolved.feedback,s.feedback);
});

test('restoring an already-shown repeated card does not pretend a new occurrence happened', () => {
  const s = ready('finance-coffee'), once = s.card.text;
  s.scopedSeen['run:finance-coffee']=s.eventClock;
  assert.equal(E.migrateSave(s).card.text,once);
});

test('graduated gap-year players do not receive enrolled-class or student-grant scenes', () => {
  const s=ready('rain');s.sem=14;
  for(const id of ['rain','workload','balance-low','money-family','device-cost','energy-low','love-conflict']) {
    assert.equal(E.eventEligible(s,event(id)),false,id);
  }
  assert.ok(E.eventEligible(s,event('tutoring')));
  assert.ok(E.eventEligible(s,event('gap-basics')));
});

test('a new summer application quotes current terms rather than the last completed internship', () => {
  const s=ready('internship-apply');s.sem=4;
  s.internship={...internshipTerms(s,'remote'),completed:true};
  s.freeTime={holiday:'暑假'};
  const expected=internshipTerms(s),card=prepareStoryEvent(s,event('internship-apply'));
  assert.equal(expected.weeks,8);assert.equal(s.internship.weeks,4);
  for(const amount of [expected.weeks,expected.gross,expected.extraCost,expected.net])assert.ok(card.text.includes(String(amount)),String(amount));
  assert.match(card.choices[1].note,/每周180元/);
});
