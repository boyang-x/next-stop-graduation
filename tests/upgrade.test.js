import test from 'node:test';
import assert from 'node:assert/strict';
import { SCHOOLS, EVENTS, PEOPLE, QUESTIONS, JOBS } from '../src/content.js';
import { LOTTERY_TICKETS, drawPrize, lotteryStats } from '../src/lottery.js';
import { createGame, addHistory, updateRanks, choose, continueFeedback, selectCadre, freeAction, buyTicket, revealTicket, migrateSave, ensureCard, advanceNotice, chooseFocus, eventEligible, answerQuestion, nextQuestion, submitJobs, selectTarget, selectOffer, acceptNoOffer, choiceAvailable, summary, startQuiz, useHint, random } from '../src/engine.js';

function inverseLeft(v,n){let x=v;for(let i=0;i<32;i++)x=v^(x<<n);return x>>>0;}
function inverseRight(v,n){let x=v;for(let i=0;i<32;i++)x=v^(x>>>n);return x>>>0;}
function rngForNext(v){return inverseLeft(inverseRight(inverseLeft(v,5),17),13);}
function vacant(s,consume=true){s.notices=[];s.deferred=null;s.feedback=null;s.card={id:'vacant',kind:'choice',consume,choices:[{text:'不参加，把下午留给自己',effects:{},freeTimeGain:1,result:'你留出一个空档。'}]};}

test('all six denominations can actually yield ten million from a valid nonzero RNG state',()=>{
  const odds=[];
  for(const ticket of LOTTERY_TICKETS){const s=createGame({},74);s.notices=[];s.freeTime={consume:true};s.card={kind:'lottery'};s.rng=rngForNext(1);assert.notEqual(s.rng,0);const original=s.balance;assert.equal(buyTicket(s,ticket.id),true);assert.equal(s.lotteryTransactions[0].prize,10000000);assert.equal(s.balance,original-ticket.price);const restored=JSON.parse(JSON.stringify(s));assert.equal(revealTicket(restored),true);assert.equal(revealTicket(restored),false);assert.equal(restored.balance,original-ticket.price+10000000);continueFeedback(restored);assert.equal(restored.card.id,'jackpot');choose(restored,1);continueFeedback(restored);assert.equal(restored.ending,null);assert.equal(restored.eventSlot,1);odds.push(lotteryStats(ticket).jackpotChance);}
  assert.ok(odds.every((p,i)=>!i||p>odds[i-1]));
});

test('each prize boundary is exclusive and every distribution sums to one',()=>{
  for(const t of LOTTERY_TICKETS){let bound=0;for(const [amount,p] of t.prizes){assert.ok(p>0);assert.equal(drawPrize(t.id,bound+p/2),amount);bound+=p;}assert.ok(Math.abs(bound-1)<1e-12);const stats=lotteryStats(t);assert.ok(stats.returnRatio>10);assert.ok(stats.profitChance<stats.winChance);assert.equal(drawPrize(t.id,.99999),0);}
});

test('multiple vacant choices in one semester permit multiple tickets, without extra monthly support',()=>{
  const s=createGame({background:'ordinary'},91);const initial=s.balance;for(let i=0;i<4;i++){vacant(s);choose(s,0);continueFeedback(s);assert.equal(s.card.kind,'free');freeAction(s,'lottery');const before=s.balance;buyTicket(s,'small');const tx=s.lotteryTransactions.at(-1);revealTicket(s);continueFeedback(s);assert.equal(s.balance,before-tx.price+tx.prize+(i%2===1?300:0));}
  assert.equal(s.lotteryTransactions.length,4);assert.equal(s.sem,0);assert.equal(s.month,2);assert.ok(s.freeTime.scheduled);assert.equal(s.balance,initial-4*LOTTERY_TICKETS.find(t=>t.id==='small').price+s.lotteryTransactions.reduce((n,t)=>n+t.prize,0)+600);
});

test('browse/cancel do not charge, insufficient balance cannot purchase, and rest creates no new time',()=>{
  const s=createGame({},12);vacant(s,false);choose(s,0);continueFeedback(s);s.balance=5;freeAction(s,'lottery');const rng=s.rng;assert.equal(buyTicket(s,'small'),false);assert.equal(s.rng,rng);freeAction(s,'back');assert.equal(s.balance,5);freeAction(s,'rest');continueFeedback(s);assert.equal(s.freeTime,null);assert.equal(s.balance,5);assert.equal(freeAction(s,'rest'),false);
});

test('fixed peer cohort and repeated ranking do not consume RNG or change rank',()=>{
  const s=createGame({},44);const r=s.rank,c=s.combinedRank,rng=s.rng,peers=JSON.stringify(s.peers);updateRanks(s);updateRanks(s);assert.equal(s.rank,r);assert.equal(s.combinedRank,c);assert.equal(s.rng,rng);assert.equal(JSON.stringify(s.peers),peers);s.gpa=95;updateRanks(s);assert.ok(s.rank<r);
});
test('low energy changes study effectiveness and state events have actual eligibility gates',()=>{
  const a=createGame({},4),b=structuredClone(a);a.energy=85;b.energy=15;for(const s of [a,b]){s.card={kind:'choice',choices:[{text:'认真准备',effects:{study:4,energy:-5},result:'完成准备'}]};choose(s,0);}assert.ok(a.study>b.study);assert.equal(eventEligible(a,EVENTS.find(e=>e.id==='energy-low')),false);assert.equal(eventEligible(b,EVENTS.find(e=>e.id==='energy-low')),true);b.balance=200;assert.equal(eventEligible(b,EVENTS.find(e=>e.id==='balance-low')),true);
});

test('current save roundtrip keeps traits, relationship and original source immutable',()=>{const s=createGame({personality:'scholar'},3);addHistory(s,'竞赛获奖');const raw=JSON.stringify(s),restored=migrateSave(JSON.parse(raw));assert.equal(restored.personality,'scholar');assert.deepEqual(restored.history,s.history);assert.equal(JSON.stringify(s),raw);});
test('legacy saves are rejected instead of silently using obsolete academic and economy rules',()=>{const s=createGame({},3);for(const version of [1,2])assert.equal(migrateSave({...s,version}),null);});
test('female player with male preference meets a male character; generic events remain accessible',()=>{
  const s=createGame({gender:'female',romancePreference:'male'},8);s.card={id:'meet-test',kind:'choice',choices:[{text:'认识一下',effects:{},action:'meet',result:'认识了新同学。'}]};choose(s,0);assert.equal(s.candidate.gender,'male');assert.equal(s.gender,'female');assert.ok(eventEligible(s,EVENTS.find(e=>e.id==='morning')));
});

test('all pool events have three authored options and exposure does not award completed research',()=>{
  for(const e of EVENTS)assert.equal(e.choices.length,3,e.id);assert.deepEqual(EVENTS.find(e=>e.id==='mentor-chat').choices[0].effects.tags,['科研接触']);assert.ok(SCHOOLS[0].majors.includes('humanities'));
});

test('quiz routing separates civil, major entrance questions and job direction; hint never gives answer',()=>{
  for(const [purpose,major,expected] of [['civil','cs','材料分析'],['exam','language','文学专业课'],['exam','psychology','心理专业课'],['exam','humanities','人文与公共管理'],['exam','cs','计算机专业']]){const s=createGame({school:major==='language'||major==='psychology'?'normal':'aero',major},29);s.notices=[];s.card=null;startQuiz(s,purpose);ensureCard(s);const qs=s.quiz.questions.map(id=>QUESTIONS.find(q=>q.id===id));assert.ok(purpose==='civil'?qs.some(q=>q.section.includes('材料分析')):qs.some(q=>q.majors?.includes(major)||major==='cs'&&q.category==='tech'));assert.ok(qs.every(q=>q.purposes.includes(purpose)));if(major==='humanities'||major==='language'||major==='psychology')assert.ok(qs.every(q=>!q.section.includes('数学')));s.history.push({tag:'备考经验'});useHint(s);assert.notEqual(s.quiz.eliminated,qs[0].answer);}
});

export function walk(s,{route='work',policy='study',correct=true,seed=0}={}){
  for(let n=0;n<1400&&!s.ending;n++){
    if(s.feedback){continueFeedback(s);continue;}const c=s.card;assert.ok(c);
    if(c.kind==='cadre'){selectCadre(s,'class-study');continue;}
    if(c.kind==='notice'){advanceNotice(s);continue;}if(c.kind==='focus'){chooseFocus(s,policy==='study'?'study':policy==='rest'?'rest':'social');continue;}
    if(['free','lottery'].includes(c.kind)){freeAction(s,'rest');continue;}if(c.kind==='scratch'){revealTicket(s);continue;}
    if(c.kind==='target'){selectTarget(s,'normal');continue;}
    if(c.kind==='jobs'){submitJobs(s,JOBS.filter(j=>choiceJob(s,j)).map(j=>j.id));continue;}
    if(c.kind==='quiz'){if(s.quiz.reveal)nextQuestion(s);else{const q=QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]);answerQuestion(s,correct?q.answer:(q.answer+1)%4);}continue;}
    if(c.kind==='offers'){const offer=s.jobResults.find(x=>x.offer);offer?selectOffer(s,offer.id):acceptNoOffer(s);continue;}
    let options=c.choices.map((x,i)=>({x,i})).filter(({x})=>choiceAvailable(s,x).ok);
    if(c.id==='route'){const target=options.find(({x})=>x.action===route)||options.find(({x})=>x.action==='exam');choose(s,target.i);continue;}
    if(c.id==='admission-fallback'){choose(s,0);continue;}if(c.id==='exam-fallback'){choose(s,0);continue;}
    const metric=x=>policy==='study'?(x.effects?.study||0):policy==='rest'?(x.effects?.energy||0):(x.effects?.activity||0)+(x.effects?.mood||0)*.3;
    options.sort((a,b)=>metric(b.x)-metric(a.x));choose(s,options[0].i);
  }assert.ok(s.ending,`stuck ${seed} ${route} ${s.sem}/${s.month} ${s.card?.id}`);return s;
}
function choiceJob(s,j){return j.degree==='本科'&&(j.category==='general'||j.category===({cs:'tech',aerospace:'engineering',mechanical:'engineering',education:'education',language:'education',psychology:'education',humanities:'humanities',finance:'business',accounting:'business'})[s.major]);}

test('all school/major/gender and route combinations finish with coherent summaries',()=>{
  for(const school of SCHOOLS)for(const major of school.majors)for(const gender of ['male','female'])for(const route of ['work','exam','civil']){const s=walk(createGame({school:school.id,major,gender},major.length+route.length),{route});assert.ok(summary(s).lottery);if(s.selectedOffer||s.publicOffer){assert.equal(s.month,5);assert.ok(s.history.some(h=>h.tag==='毕业论文'));}assert.ok(s.energy>=0&&s.energy<=100);}
});
