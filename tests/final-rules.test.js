import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,applyEffects,summary,summaryText,freeAction,choose,continueFeedback,ensureCard} from '../src/engine.js';
import {describeRun} from '../src/run-summary.js';
import {EVENTS,PEOPLE} from '../src/content.js';
test('less preparation is not recorded as skipping class; explicit absence is',()=>{const s=createGame({},7);applyEffects(s,{study:-1});assert.equal(s.termBehavior.missed,0);applyEffects(s,{study:-3,absence:2});assert.equal(s.termBehavior.missed,2);});
test('the summary distinguishes actual changing grades, remediation and synthetic epilogue terms',()=>{
  const s=createGame({},7);s.grades=[{sem:0,grade:72,comp:60},{sem:1,grade:88,comp:73},{sem:2,grade:88,comp:73,epilogue:true}];const r=describeRun(s);assert.equal(r.grades.length,2);assert.ok(r.lines[0].includes('提高 16'));assert.ok(!r.lines[0].includes('大二'));assert.ok(summaryText(s).includes('实际成绩明细'));assert.equal(summary(s).recap.money.initial,2000);
});
test('finance recap reconciles support, necessary spending and optional spending to ending balance',()=>{
  const s=createGame({background:'ordinary'},7);applyEffects(s,{balance:-120});applyEffects(s,{balance:100});const r=describeRun(s).money;assert.equal(r.initial+r.support-r.necessary+r.otherNet,s.balance);assert.equal(r.otherNet,-20);
});
test('summary remembers specific posts and current relationship without exposing routine traits as experiences',()=>{
  const s=createGame({},8);s.cadreHistory=[{role:'class-study',startSem:0,tasks:3,performance:2}];s.relationship={person:PEOPLE[0],id:'x',intimacy:62,memories:2,flags:{}};s.romances=[{name:PEOPLE[0].name,start:'大一上'}];const r=describeRun(s);assert.equal(r.posts[0].name,'学习委员');assert.ok(r.lines.some(l=>l.includes('亲密度 62')));assert.ok(summaryText(s).includes('学习委员'));
});
test('gifts depend on personal preference and communication; they cannot clear a missed promise',()=>{
  const gains=[];for(const [preference,communicated,missed] of [['shared',false,false],['thoughtful',true,false],['thoughtful',false,true]]){const s=createGame({},8);s.notices=[];s.relationship={id:'x',person:PEOPLE[0],intimacy:50,preference,memories:0,flags:{communicated,missed}};s.freeTime={consume:false};s.card={kind:'free'};freeAction(s,'gift');gains.push(s.relationship.intimacy-50);assert.equal(s.relationship.flags.missed,missed);}assert.ok(gains[1]>gains[0]&&gains[1]>gains[2]);
});
test('a retry cannot silently discard a failed undergraduate course or fabricate a completed degree',()=>{
  const s=createGame({},8);s.notices=[];s.sem=7;s.phase='events';s.card={id:'exam-fallback',kind:'choice',consume:false,choices:[{text:'二战',action:'retry',result:'重新准备'}]};s.academicFailures=[{id:'course-0',sem:0,original:44,resolved:false,attempts:0}];s.grades=[{sem:0,grade:44,comp:35.2}];choose(s,0);continueFeedback(s);assert.equal(s.card.id,'course-remediation');assert.equal(s.sem,7);choose(s,2);assert.equal(s.ending.degree,'本科未毕业');
});
test('emergency grants and family top-ups cannot be claimed repeatedly within one term, but work remains possible',()=>{
  const s=createGame({},8);s.phase='events';s.notices=[];s.card=null;s.hooks['0-0-committee']=true;s.unpaidLiving=100;ensureCard(s);const initial=s.balance;choose(s,0);assert.equal(s.balance,initial+120);assert.ok(s.hooks['grant-0']);continueFeedback(s);
  s.card=null;s.unpaidLiving=100;ensureCard(s);const before=s.balance;assert.equal(choose(s,0),false);assert.equal(s.balance,before);assert.ok(choose(s,2));continueFeedback(s);
  s.card=null;s.unpaidLiving=100;ensureCard(s);assert.equal(choose(s,0),false);assert.equal(choose(s,2),false);assert.ok(choose(s,1));assert.equal(s.unpaidLiving,0);
});
