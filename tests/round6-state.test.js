import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,applyEffects,ensureCard,choose,continueFeedback,freeAction,choiceAvailable,maybeRelationshipConflict,startQuiz,answerQuestion,nextQuestion,drawEvent} from '../src/engine.js';
import {changeIntimacy} from '../src/life-rules.js';
import {scopeKey,pruneStories} from '../src/story.js';
import {EVENTS,PEOPLE,QUESTIONS} from '../src/content.js';
function ready(){const s=createGame({school:'aero',major:'cs',background:'ordinary'},121);Object.assign(s,{card:null,feedback:null,notices:[],deferred:null,phase:'events'});s.hooks['0-0-committee']=true;return s;}
function partner(s,intimacy=70){s.relationship={id:'partner-1',person:PEOPLE[0],started:0,intimacy,flags:{},memories:0,lastContact:s.calendarTick};}
test('energy bands affect learning using starting energy, not energy after the action',()=>{
  const gain=energy=>{const s=ready();s.energy=energy;applyEffects(s,{study:10,energy:-10});return s.study;};
  assert.equal(gain(90),10.8);assert.equal(gain(55),10);assert.equal(gain(30),9.3);assert.equal(gain(10),8.5);
});
test('zero state opens free recovery once, does not advance time, and can rearm for a later episode',()=>{
  const s=ready();s.energy=0;s.mood=0;s.balance=0;ensureCard(s);assert.equal(s.card.id,'state-recovery');
  const tick=s.calendarTick;choose(s,1);assert.equal(s.energy,25);assert.equal(s.mood,32);assert.equal(s.balance,0);continueFeedback(s);
  assert.equal(s.calendarTick,tick);assert.notEqual(s.card.id,'state-recovery');s.card=null;s.energy=0;s.mood=0;ensureCard(s);assert.equal(s.card.id,'state-recovery');
});
test('depleted energy allows optional work but critical exam answers remain available',()=>{
  const s=ready();s.energy=10;s.card={kind:'choice',consume:true};assert.equal(choiceAvailable(s,{effects:{energy:-12}}).ok,true);assert.ok(choiceAvailable(s,{effects:{energy:12}}).ok);
  s.card={kind:'free'};s.freeTime={consume:false};assert.ok(freeAction(s,'work'));continueFeedback(s);
  s.feedback=null;s.energy=0;s.mood=0;startQuiz(s,'civil');s.card=null;ensureCard(s);assert.equal(s.card.kind,'quiz');
  const q=QUESTIONS.find(q=>q.id===s.quiz.questions[0]);assert.ok(answerQuestion(s,q.answer));assert.ok(nextQuestion(s));
});
test('passing time within a month does not double charge energy',()=>{
  const s=ready();s.energy=70;s.mood=60;s.card={kind:'choice',consume:true,choices:[{text:'继续',duration:2,result:'继续'}]};choose(s,0);continueFeedback(s);assert.equal(s.energy,70);assert.equal(s.mood,60);
});
test('intimacy high-band gains diminish; quarrel is a saved one-off loss with repair follow-up',()=>{
  const s=ready();partner(s,95);changeIntimacy(s,10);assert.equal(s.relationship.intimacy,96.2);
  s.rng=1;assert.ok(maybeRelationshipConflict(s));assert.equal(s.relationship.intimacy,76.2);assert.equal(maybeRelationshipConflict(s),false);
  const restored=JSON.parse(JSON.stringify(s));assert.equal(restored.relationship.intimacy,76.2);assert.equal(restored.storyQueue[0].id,'love-unexpected-conflict');
  const e=drawEvent(restored);assert.equal(e.id,'love-unexpected-conflict');restored.card={...e,kind:'choice',consume:false};choose(restored,1);continueFeedback(restored);
  assert.ok(restored.relationship.intimacy<95);assert.ok(restored.storyQueue.some(q=>q.id==='love-conflict-follow'));restored.eventClock+=2;
  const follow=drawEvent(restored);assert.equal(follow.id,'love-conflict-follow');restored.card={...follow,kind:'choice',consume:false};choose(restored,2);assert.equal(restored.relationship.flags.conflictPending,false);
});
test('active weekend meeting creates a gender-correct candidate and scoped later contact',()=>{
  for(const gender of ['male','female']){const s=ready();s.gender=gender;s.romancePreference=gender==='male'?'female':'male';s.card={kind:'free'};s.freeTime={consume:false,leisure:true};
    assert.ok(freeAction(s,'meet-new'));assert.equal(s.card.id,'social-new-friends');s.rng=1;choose(s,0);
    assert.equal(s.candidate.gender,s.romancePreference);assert.equal(s.relationship,null);const key=scopeKey(s,'candidate');assert.ok(s.storyQueue.some(q=>q.key===key));continueFeedback(s);assert.equal(s.freeTime,null);
    s.candidate=null;pruneStories(s);assert.equal(s.storyQueue.length,0);
  }
});
test('meeting with an existing partner makes friends without replacing the relationship',()=>{
  const s=ready();partner(s);s.card={kind:'free'};s.freeTime={consume:false,leisure:true};assert.ok(freeAction(s,'meet-new'));assert.equal(s.card.id,'social-friends');choose(s,0);continueFeedback(s);assert.equal(s.relationship.id,'partner-1');assert.equal(s.candidate,null);
});
test('natural conflicts and new introductions cannot leak into random unrelated event pools',()=>{
  const s=ready();for(const id of ['love-unexpected-conflict','social-new-friends'])assert.ok(EVENTS.find(e=>e.id===id).followOnly);
  for(let i=0;i<200;i++)assert.ok(!['love-unexpected-conflict','social-new-friends'].includes(drawEvent(s).id));
});
