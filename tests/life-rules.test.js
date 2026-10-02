import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame,ensureCard,choose,continueFeedback,advanceNotice,selectCadre,applyEffects,hasTag,freeAction,summary,updateRanks } from '../src/engine.js';
import { CADRE_ROLES,cadreAvailable,importantExperiences,changeIntimacy,initializeLife,monthlyBudget,policyResult } from '../src/life-rules.js';
import { PEOPLE } from '../src/content.js';
function ready(seed=41){const s=createGame({school:'aero',major:'cs',background:'ordinary'},seed);s.card=null;s.feedback=null;s.notices=[];s.phase='events';return s;}
function notices(s){while(s.card?.kind==='notice')advanceNotice(s);}
function partner(s){s.relationship={id:'current',person:PEOPLE[0],stage:'dating',intimacy:55,memories:0,flags:{},lastContact:s.calendarTick};return s.relationship;}
test('policy differs by school major and run, persists unchanged after publish and refresh',()=>{
  const rates=new Set();for(let seed=1;seed<=20;seed++)rates.add(createGame({school:'aero',major:'cs'},seed).policy.rate);assert.ok(rates.size>1);
  const a=createGame({school:'aero',major:'cs'},42),b=createGame({school:'normal',major:'education'},42);assert.equal(a.policy.metric,'combinedRank');assert.equal(b.policy.metric,'combinedRank');assert.notEqual(a.policy.rate,b.policy.rate);
  const s=ready();s.sem=2;ensureCard(s);assert.ok(s.log.some(l=>l.title==='本届推免规则公布'));const p=structuredClone(s.policy);assert.equal(p.published,true);assert.match(s.log.find(l=>l.title==='本届推免规则公布').text,/大三学年末/);notices(s);const restored=JSON.parse(JSON.stringify(s));initializeLife(restored);assert.deepEqual(restored.policy,p);assert.equal(restored.log.filter(l=>l.title==='本届推免规则公布').length,1);
});
test('qualification uses announced rank, grade and outstanding course conditions',()=>{
  const s=ready();s.combinedRank=s.policy.places;s.gpa=85;assert.ok(policyResult(s).eligible);s.combinedRank++;assert.equal(policyResult(s).eligible,false);s.combinedRank=1;s.gpa=77;assert.equal(policyResult(s).eligible,false);s.gpa=90;s.academicFailures=[{resolved:false}];assert.equal(policyResult(s).eligible,false);s.academicFailures[0].resolved=true;assert.ok(policyResult(s).eligible);
});
test('cadre menu contains real roles with year and experience restrictions',()=>{
  const s=ready();ensureCard(s);assert.equal(s.card.id,'cadre-arrange');choose(s,0);continueFeedback(s);assert.equal(s.card.kind,'cadre');assert.equal(CADRE_ROLES.length,12);assert.equal(selectCadre(s,'union-president'),false);assert.equal(cadreAvailable(s,CADRE_ROLES.find(r=>r.id==='union-head')).ok,false);assert.ok(selectCadre(s,'class-study'));s.rng=0;choose(s,0);assert.equal(s.cadre.role,'class-study');assert.equal(s.cadre.endSem,2);assert.equal(s.cadreHistory.length,1);assert.ok(importantExperiences(s).some(h=>h.tag==='学生干部经历'));
});
test('cadre lasts through spring, expires yearly, renewal may fail and clears active identity',()=>{
  const s=ready();s.cadre={role:'class-life',startSem:0,endSem:2,performance:2,tasks:3};s.cadreHistory=[{...s.cadre}];s.sem=1;ensureCard(s);assert.equal(s.cadre.role,'class-life');assert.notEqual(s.card.id,'cadre-arrange');s.sem=2;s.month=0;s.card=null;s.notices=[];ensureCard(s);notices(s);assert.equal(s.cadre,null);assert.equal(s.card.id,'cadre-arrange');assert.match(s.card.choices[0].text,/续任/);choose(s,0);continueFeedback(s);assert.equal(s.card.id,'cadre-election');s.card.choices[0].probability=0;choose(s,0);assert.equal(s.cadre,null);assert.equal(s.committee,false);assert.equal(s.cadreHistory.length,1);
});
test('new annual success replaces expired post and never gives two concurrent roles',()=>{
  const s=ready();s.sem=2;s.policy.published=true;s.cadre={role:'class-life',startSem:0,endSem:2};ensureCard(s);choose(s,1);continueFeedback(s);selectCadre(s,'year-study');s.rng=0;choose(s,0);assert.equal(s.cadre.role,'year-study');assert.equal(s.cadre.startSem,2);assert.equal(s.cadre.endSem,4);assert.equal(s.previousCadre,null);
});
test('routine actions stay internal and habits require repeated actions',()=>{
  const s=ready();for(let i=0;i<3;i++)applyEffects(s,{study:3,tags:['规律复习','运动习惯']});assert.equal(hasTag(s,'规律复习'),false);assert.equal(hasTag(s,'运动习惯'),true);assert.equal(importantExperiences(s).length,0);applyEffects(s,{tags:['规律复习','竞赛获奖']});assert.equal(hasTag(s,'规律复习'),true);assert.deepEqual(importantExperiences(s).map(h=>h.tag),['竞赛获奖']);assert.deepEqual(summary(s).keywords,['竞赛获奖']);
});
test('intimacy zero opens a three-option breakup, accepting clears partner and preserves experience',()=>{
  const s=ready();s.hooks['0-0-committee']=true;partner(s);changeIntimacy(s,-100);assert.equal(s.relationship.intimacy,0);ensureCard(s);assert.equal(s.card.id,'relationship-breakpoint');assert.equal(s.card.choices.length,3);s.romances=[{name:PEOPLE[0].name,end:null}];choose(s,1);assert.equal(s.relationship,null);assert.ok(importantExperiences(s).some(h=>h.tag==='分手经历'));
});
test('successful repair restores intimacy; a new relationship starts with fresh memories',()=>{
  const s=ready();s.hooks['0-0-committee']=true;partner(s);changeIntimacy(s,-100);ensureCard(s);s.rng=0;choose(s,0);assert.equal(s.relationship.intimacy,35);assert.equal(s.relationship.breakupRetryTick,s.calendarTick+1);s.feedback=null;s.card={kind:'choice',choices:[{text:'开始交往',action:'date',result:'开始'}]};s.relationship.memories=9;s.relationship.flags.gifts=4;choose(s,0);assert.equal(s.relationship.intimacy,55);assert.equal(s.relationship.memories,0);assert.deepEqual(s.relationship.flags,{});
});
test('gift gains diminish and expensive actions are rejected before charging',()=>{
  const s=ready();partner(s);const gains=[];for(let i=0;i<3;i++){s.card={kind:'free'};s.feedback=null;s.freeTime={consume:false};const before=s.relationship.intimacy;assert.ok(freeAction(s,'gift'));gains.push(s.relationship.intimacy-before);}assert.ok(gains[0]>gains[1]&&gains[1]>=gains[2]);s.feedback=null;s.card={kind:'free'};s.balance=50;assert.equal(freeAction(s,'gift'),false);assert.equal(s.balance,50);
});
test('monthly finance settles once, documented net income is smaller and shortage can be resolved',()=>{
  const s=ready();s.hooks['0-0-committee']=true;const b=monthlyBudget(s);assert.equal(b.income,1800);assert.equal(b.cost,1500);const initial=s.balance,ticks=s.calendarTick;s.eventSlot=1;s.week=2;s.card={kind:'choice',consume:true,choices:[{text:'结束活动',result:'继续'}]};choose(s,0);continueFeedback(s);assert.equal(s.month,1);assert.equal(s.balance,initial+300);assert.equal(s.calendarTick,ticks+1);const recordCount=s.finances.length;notices(s);s.card=null;ensureCard(s);assert.equal(s.finances.length,recordCount);assert.equal(s.balance,initial+300);
  s.balance=0;s.unpaidLiving=200;s.month=1;s.eventSlot=1;s.week=2;s.card={kind:'choice',consume:true,choices:[{text:'继续',result:'继续'}]};choose(s,0);continueFeedback(s);notices(s);assert.equal(s.card.id,'living-shortfall');assert.equal(s.unpaidLiving,200);choose(s,0);assert.equal(s.unpaidLiving,0);assert.equal(s.balance,300+120);assert.ok(importantExperiences(s).some(h=>h.tag==='资助经历'));
});
test('qualification appears after the last third-year grades, then route choice follows next autumn',()=>{
  const s=ready();s.sem=5;s.month=5;s.policy.published=true;s.study=36;s.grade=90;s.gpa=90;s.comp=85;s.grades=Array.from({length:5},(_,sem)=>({sem,grade:95,comp:95}));s.hooks['vacation-6']=true;ensureCard(s);assert.equal(s.hooks.qual,true);assert.equal(s.policy.result.sem,5);assert.equal(s.sem,6);assert.ok(s.log.some(l=>l.title==='推免资格公布'));assert.equal(s.policy.result.rank,s.combinedRank);notices(s);
});
