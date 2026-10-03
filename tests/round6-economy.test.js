import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,chooseFocus,choose,continueFeedback,applyEffects,choiceAvailable,freeAction,ensureCard,advanceNotice,summary} from '../src/engine.js';
import {EVENTS} from '../src/content.js';
import {internshipTerms} from '../src/economy.js';
import {prepareStoryEvent} from '../src/story.js';
function ready(){const s=createGame({background:'ordinary',school:'aero',major:'cs'},62);s.hooks['0-0-committee']=true;s.notices=[];return s;}
function month(s){s.monthlyFreeDone??={};s.monthlyFreeDone[`${s.sem}-${s.month}`]=true;s.card={kind:'choice',consume:true,choices:[{text:'完成一个月的安排',duration:4,result:'完成'}]};s.feedback=null;choose(s,0);continueFeedback(s);while(s.card?.kind==='notice')advanceNotice(s);}
test('monthly allowance is uniform and focus does not charge optional consumption',()=>{
  const states=['balanced','scholar','social','practical','relaxed'].map(personality=>createGame({personality,school:'aero'},62));
  for(const s of states){const before=s.balance;chooseFocus(s,'study');assert.equal(s.balance,before);month(s);assert.equal(s.balance,before+300);assert.ok(!s.finances.some(f=>f.type==='consumption'));}
});
test('budget review gives no invented cash or retired saving credit',()=>{
  const s=ready();chooseFocus(s,'study');const before=s.balance,e=EVENTS.find(e=>e.id==='budget');s.card={...prepareStoryEvent(s,e),kind:'choice',consume:false};choose(s,0);assert.equal(s.balance,before);assert.equal(s.savingCredit,undefined);
});
test('selling a real unused textbook pays once; extra support has term-specific limits',()=>{
  const s=ready();s.card={...EVENTS.find(e=>e.id==='campus-market'),kind:'choice',consume:false};const balance=s.balance;choose(s,0);assert.equal(s.balance,balance+120);s.feedback=null;assert.equal(choiceAvailable(s,s.card.choices[0]).ok,false);
  s.card={...EVENTS.find(e=>e.id==='balance-low'),kind:'choice',consume:false};choose(s,0);s.feedback=null;assert.equal(choiceAvailable(s,s.card.choices[0]).ok,false);s.sem++;assert.ok(choiceAvailable(s,s.card.choices[0]).ok);
});
test('local and remote internships pay for actual weeks only at handover, with one net payment',()=>{
  for(const option of [0,1]){const s=ready();Object.assign(s,{sem:2,phase:'start',card:null,feedback:null,notices:[],deferred:null});ensureCard(s);freeAction(s,'internship');continueFeedback(s);s.rng=1;choose(s,option);assert.equal(s.internship.weeks,8);const job=structuredClone(s.internship);const balance=s.balance,tick=s.calendarTick;continueFeedback(s);choose(s,1);continueFeedback(s);assert.equal(s.card.id,'internship-end');assert.match(s.card.choices[0].result,new RegExp('净到账 ¥'+job.net));assert.equal(s.balance,balance);choose(s,0);assert.equal(s.balance,balance+job.gross-job.extraCost);assert.equal(s.calendarTick,tick);assert.ok(s.history.some(h=>h.tag==='实习经历'));assert.equal(choose(s,0),false);const recap=summary(s).recap.money;assert.equal(recap.initial+recap.support-recap.necessary+recap.otherNet,s.balance);}
});
test('ordinary term internship offer does not instantly grant wages or experience',()=>{
  const s=ready();s.sem=3;s.phase='events';s.card={...prepareStoryEvent(s,EVENTS.find(e=>e.id==='intern-info')),kind:'choice',consume:true};s.rng=1;const before=s.balance;choose(s,0);assert.equal(s.balance,before);assert.equal(s.internship.weeks,4);assert.equal(s.internship.net,internshipTerms(s).net);assert.ok(!s.history.some(h=>h.tag==='实习经历'));assert.ok(s.storyQueue.some(q=>q.id==='internship-work'));
});
