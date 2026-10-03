import test from 'node:test';
import assert from 'node:assert/strict';
import { EVENTS, JOBS, QUESTIONS } from '../src/content.js';
import { createGame, random, addHistory, applyEffects, probability, eventEligible, choiceAvailable, choose, continueFeedback, advanceNotice, chooseFocus, selectTarget, submitJobs, answerQuestion, nextQuestion, selectOffer, acceptNoOffer, lotteryPrize, ensureCard, summary, summaryText, isGrad, selectCadre, freeAction, buyTicket, revealTicket } from '../src/engine.js';

function step(s,{route='work',correct=true,retry=true,target='normal'}={}) {
  if(s.ending)return;
  if(s.feedback){continueFeedback(s);return;}
  const c=s.card;assert.ok(c,`missing card at semester ${s.sem} month ${s.month}`);
  if(c.kind==='cadre'){selectCadre(s,'class-study');return;}
  if(c.kind==='notice'){advanceNotice(s);return;}
  if(c.kind==='focus'){chooseFocus(s,'study');return;}
  if(['free','lottery'].includes(c.kind)){freeAction(s,'rest');return;}
  if(c.kind==='scratch'){revealTicket(s);return;}
  if(c.kind==='target'){selectTarget(s,target);return;}
  if(c.kind==='jobs'){submitJobs(s,JOBS.filter(j=>(j.category==='general'||j.category==='tech')&&j.degree==='本科').map(j=>j.id));return;}
  if(c.kind==='quiz'){
    if(s.quiz.reveal){nextQuestion(s);return;}
    const q=QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]);answerQuestion(s,correct?q.answer:(q.answer+1)%q.options.length);return;
  }
  if(c.kind==='offers'){const offer=s.jobResults.find(j=>j.offer);offer?selectOffer(s,offer.id):acceptNoOffer(s);return;}
  let i=0;
  if(c.id==='route')i=c.choices.findIndex(c=>c.action===route);
  else if(c.id==='admission-fallback')i=c.choices.findIndex(c=>c.action==='exam');
  else if(c.id==='exam-fallback')i=c.choices.findIndex(c=>c.action===(retry?'retry':'endExam'));
  else if(c.id==='lottery')i=1;
  else {const best=Math.max(...c.choices.map(c=>c.effects?.study||0));if(best>0)i=c.choices.findIndex(c=>c.effects?.study===best);}
  if(i<0)i=c.choices.findIndex(c=>c.action==='exam');
  if(i<0)i=0;if(!choiceAvailable(s,c.choices[i]).ok)i=c.choices.findIndex(c=>choiceAvailable(s,c).ok);assert.ok(choose(s,i));
}
function walk(s,options){for(let n=0;n<900&&!s.ending;n++)step(s,options);assert.ok(s.ending,`did not terminate: ${s.sem}/${s.month}/${s.card?.id}`);return s;}

test('same seed and choices produce identical state; save roundtrip preserves next random draw',()=>{
  const a=createGame({},321),b=createGame({},321);for(let i=0;i<70;i++){step(a);step(b);}assert.deepEqual(a,b);
  const restored=JSON.parse(JSON.stringify(a));assert.equal(random(a),random(restored));
});
test('exclusive school, major, graduate and relationship events only enter their eligible pools',()=>{
  const s=createGame({school:'aero',major:'cs'},77);
  assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='normal-demo')),false);
  assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='space-wind')),false);
  assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='grad-first')),false);
  assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='love-walk')),false);
  s.sem=8;assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='grad-first')),true);
});
test('relevant tags improve an event probability without granting unrelated attributes',()=>{
  const s=createGame({},9);const p={base:.4,tags:{'实习经历':.15}};const before=probability(s,p).value;const balance=s.balance;
  addHistory(s,'实习经历');assert.equal(probability(s,p).value,before+.15);
  assert.equal(s.balance,balance);assert.equal(s.gpa,78);
});
test('romance memories are scoped to the current person, not every past relationship',()=>{
  const s=createGame({},11);s.relationship={person:{name:'林晚'},stage:'dating'};applyEffects(s,{tags:['共同回忆']});
  assert.equal(probability(s,{base:.3,tags:{'共同回忆':.1}}).value,.4);
  s.relationship={person:{name:'周知夏'},stage:'dating'};assert.equal(probability(s,{base:.3,tags:{'共同回忆':.1}}).value,.3);
});
test('accepting a breakup clears current relationship but preserves past experience',()=>{
  const s=createGame({},13);s.card={...EVENTS.find(e=>e.id==='love-break'),kind:'choice',consume:true};s.relationship={person:{name:'林晚'},stage:'strained'};s.romances=[{name:'林晚',end:null}];
  choose(s,1);assert.equal(s.relationship,null);assert.ok(s.history.some(h=>h.tag==='分手经历'));assert.ok(s.romances[0].end);
  assert.equal(eventEligible(s,EVENTS.find(e=>e.id==='single-after')),true);
});
test('an already resolved probability event cannot be rolled again before acknowledging result',()=>{
  const s=createGame({},19);s.card={...EVENTS.find(e=>e.id==='competition'),kind:'choice',consume:true};choose(s,0);const after=JSON.stringify(s);assert.equal(choose(s,0),false);assert.equal(JSON.stringify(s),after);
});
test('a history-gated choice becomes available only after the matching experience',()=>{
  const s=createGame({},20);s.card={id:'conditional-test',kind:'choice',choices:[{text:'讲实习案例',requiresAnyTags:['实习经历'],effects:{mood:5},result:'介绍了实习。'}]};
  assert.equal(choose(s,0),false);assert.equal(s.mood,65);addHistory(s,'实习经历');assert.equal(choose(s,0),true);assert.equal(s.mood,67.5);
});
test('lottery payout is applied exactly once and opens the optional jackpot ending',()=>{
  const s=createGame({},23);s.notices=[];s.rng=0;s.card={kind:'lottery'};s.freeTime={consume:true};const before=s.balance;
  assert.equal(buyTicket(s,'weekend'),true);assert.equal(revealTicket(s),true);assert.equal(s.balance,before-50+10000000);assert.equal(s.deferred,'jackpot');assert.equal(revealTicket(s),false);assert.equal(s.balance,before-50+10000000);
  continueFeedback(s);assert.equal(s.card.id,'jackpot');choose(s,0);assert.equal(s.ending.title,'幸运人生');assert.equal(summary(s).grade,'未结算');
});
test('lottery distribution includes jackpot, small prize and no prize, with explicit boundaries',()=>{
  assert.equal(lotteryPrize(0),10000000);assert.equal(lotteryPrize(.00025),1000000);assert.equal(lotteryPrize(.00075),100000);assert.equal(lotteryPrize(.005),1000);assert.equal(lotteryPrize(.02),400);assert.equal(lotteryPrize(.05),150);assert.equal(lotteryPrize(.1),100);assert.equal(lotteryPrize(.4),50);assert.equal(lotteryPrize(.6),25);assert.equal(lotteryPrize(.9),0);
});
test('special jackpot can end or continue without removing the payout',()=>{
  const a=createGame({},1);a.card=null;a.notices=[];a.deferred='jackpot';a.balance=10000000;ensureCard(a);choose(a,1);continueFeedback(a);assert.equal(a.ending,null);assert.equal(a.balance,10000000);
  const b=createGame({},2);b.card=null;b.notices=[];b.deferred='jackpot';b.balance=10000000;ensureCard(b);choose(b,0);assert.equal(b.ending.title,'幸运人生');
});
test('undergraduate recruitment produces selectable offers and a graduation summary',()=>{
  const s=walk(createGame({name:'测试同学'},21),{route:'work'});assert.ok(s.selectedOffer);assert.equal(s.ending.title,'下一站，入职');assert.ok(s.epilogue);assert.match(summaryText(s),/测试同学/);assert.ok(summary(s).offer.salary>0);
});
test('all failed applications end only after the complete batch has been revealed',()=>{
  const s=walk(createGame({},22),{route:'work',correct:false});assert.equal(s.ending.title,'毕业，暂未获得 offer');assert.ok(s.jobResults.length>1);assert.ok(s.jobResults.every(r=>!r.offer));
});
test('a successful postgraduate route reaches a new campus and graduate recruiting',()=>{
  let success;
  for(let seed=30;seed<40&&!success;seed++){const s=walk(createGame({},seed),{route:'exam',correct:true});if(s.selectedOffer&&isGrad(s))success=s;}
  assert.ok(success);assert.equal(success.ending.degree,'硕士');assert.equal(success.school,'normal');assert.ok(success.log.some(x=>x.title==='研究生入学'||x.title==='新的录取通知书'));
});
test('recommendation qualification and reception can reach postgraduate life',()=>{
  // Qualification is deterministic; acceptance and recruiting remain probabilistic.
  let success;for(let seed=40;seed<60&&!success;seed++){const s=createGame({},seed);s.sem=6;s.month=0;s.phase='events';s.card=null;s.notices=[];s.rank=1;s.combinedRank=1;s.gpa=97;s.comp=90;ensureCard(s);
    const result=walk(s,{route:'recommend',correct:true});assert.ok(result.history.some(x=>x.tag==='保研资格'));if(result.selectedOffer&&isGrad(result))success=result;}
  assert.ok(success,'a qualified recommendation route can reach graduate recruiting');
});
test('failure on a second entrance attempt triggers the specified ending',()=>{
  const s=walk(createGame({},52),{route:'exam',correct:false,retry:true});assert.equal(s.ending.title,'二战之后');assert.equal(s.attempt,2);assert.ok(s.history.some(x=>x.tag==='二战经历'));
});
test('all primary routes terminate across multiple seeds without exceeding valid attribute bounds',()=>{
  for(const route of ['work','exam','civil'])for(let seed=1;seed<=12;seed++){
    const s=walk(createGame({school:seed%2?'normal':'finance'},seed),{route,correct:seed%3!==0});
    assert.ok(s.balance>=0);assert.ok(s.energy>=0&&s.energy<=100);assert.ok(s.mood>=0&&s.mood<=100);assert.ok(s.gpa>=0&&s.gpa<=100);assert.ok(s.rank>=1&&s.rank<=s.cohort);
  }
});
