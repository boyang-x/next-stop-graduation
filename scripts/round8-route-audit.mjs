import {PERSONALITIES,energyMax} from '../src/personality.js';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {SCHOOLS,JOBS,QUESTIONS} from '../src/content.js';
import * as E from '../src/engine.js';
const cases=[],endings={},frequencies={},fallbackSnapshots=[];const narrow=process.env.ROUND8_NARROW==='1';
for(const trait of PERSONALITIES)for(const school of SCHOOLS)for(const major of school.majors)for(const gender of ['male','female'])for(const route of ['work','recommend','exam','civil'])for(const seed of [21,43,86,168]){
  if(narrow&&!(route==='exam'&&(seed===168&&school.id==='aero'&&major==='aerospace'||seed===86&&school.id==='normal'&&major==='cs')))continue;
  const s=E.createGame({school:school.id,major,gender,personality:trait.id},seed);
  const correct=seed!==168;let steps=0,romance=0,ordinary=0,inlineResults=0,fallbackEvents=0;const ordinarySeen=new Set();let ordinaryDuplicates=0;
  for(;steps<1400&&!s.ending;steps++){
    assert.ok(s.card||s.feedback,`missing card ${school.id}/${major}/${route}/${s.sem}/${s.month}`);
    if(s.feedback){E.continueFeedback(s);continue;}const c=s.card;
    if(c.kind==='notice'){E.advanceNotice(s);continue;}
    if(c.kind==='focus'){E.chooseFocus(s,seed===43?'social':seed===86?'project':'study');continue;}
    if(c.kind==='cadre'){E.selectCadre(s,seed===86?'class-life':'class-study');continue;}
    if(['free','lottery'].includes(c.kind)){let action=s.freeTime.holiday==='暑假'&&seed===86&&s.sem>=2&&s.sem<=12?'internship':s.relationship&&seed===43?'date':seed===86?'exercise':s.freeTime.holiday?'campus-rest':'rest';if(!E.freeAction(s,action))assert.ok(E.freeAction(s,s.freeTime.holiday?'campus-rest':'rest'),'free activity fallback unavailable');continue;}
    if(c.kind==='scratch'){E.revealTicket(s);continue;}
    if(c.kind==='target'){E.selectTarget(s,'normal');continue;}
    if(c.kind==='jobs'){E.submitJobs(s,JOBS.filter(j=>E.jobEligibility(s,j).ok).map(j=>j.id));continue;}
    if(c.kind==='quiz'){if(s.quiz.reveal)E.nextQuestion(s);else{const q=QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]);E.answerQuestion(s,correct?q.answer:(q.answer+1)%q.options.length);}continue;}
    if(c.kind==='offers'){const offer=s.jobResults.find(r=>r.offer);offer?E.selectOffer(s,offer.id):E.acceptNoOffer(s);continue;}
    if(c.id==='fallback'){fallbackEvents++;fallbackSnapshots.push({school:school.id,major,gender,trait:trait.id,route,seed,sem:s.sem,month:s.month,week:s.week,relationship:!!s.relationship,storyQueue:s.storyQueue.map(q=>q.id),seen:Object.keys(s.seen).length});}
    if(c.consume&&!c._follow&&c.id!=='fallback'&&!c.storyScope){if(ordinarySeen.has(c.id))ordinaryDuplicates++;ordinarySeen.add(c.id);}
    if(c.consume&&!c._follow&&s.relationship){ordinary++;if(c.group==='romance')romance++;}
    const options=c.choices.map((x,i)=>({x,i})).filter(({x})=>E.choiceAvailable(s,x).ok);assert.ok(options.length,'all choices locked '+c.id);
    let chosen;if(c.id==='route')chosen=options.find(({x})=>x.action===route)||options.find(({x})=>x.action==='exam');
    else if(c.id==='exam-fallback')chosen=options.find(({x})=>x.action==='retry');
    else if(c.id==='jackpot')chosen=options.find(({i})=>i===1);
    else if(c.group==='romance')chosen=options.find(({x})=>x.action==='date')||options.find(({x})=>x.action==='meet')||options[0];
    else{options.sort((a,b)=>((b.x.effects?.study||0)+(b.x.effects?.activity||0)*.4)-((a.x.effects?.study||0)+(a.x.effects?.activity||0)*.4));chosen=options[0];}
    assert.ok(E.choose(s,(chosen||options[0]).i));if(s.feedback?.inline)inlineResults++;
    for(const key of ['energy','mood','charm'])assert.ok(s[key]>=0&&s[key]<=(key==='energy'?energyMax(s):100));assert.equal(s.combined,Math.round((s.gpa*.8+s.comp*.2)*10)/10);assert.ok(!('compRank' in s));assert.ok(s.balance>=0&&Number.isFinite(s.balance));
  }
  assert.ok(s.ending,`stuck ${school.id}/${major}/${route}/${seed}: ${s.card?.id}`);assert.equal(s.storyQueue.length,0);
  const r=E.summary(s);assert.ok(E.summaryText(s).includes('这一局的变化'));assert.ok(!JSON.stringify(r).includes('undefined'));
  if(s.selectedOffer||s.publicOffer)assert.ok(s.ending.degree.includes('未毕业')||s.grades.length>=8);
  const m=r.recap.money;assert.equal(m.initial+m.support-m.necessary+m.otherNet,s.balance);
  const item={personality:trait.id,combined:r.combined,combinedRank:r.combinedRank,energy:s.energy,charm:s.charm,school:school.id,major,gender,route,seed,correct,steps,playerActions:steps-inlineResults,inlineResults,ordinaryDuplicates,fallbackEvents,ending:s.ending.title,degree:s.ending.degree,grade:r.grade,balance:s.balance,offerCount:s.jobResults.filter(r=>r.offer).length,datingOrdinary:ordinary,datingRomance:romance};cases.push(item);endings[item.ending]=(endings[item.ending]||0)+1;
  frequencies[school.id]??={romance:0,ordinary:0};frequencies[school.id].romance+=romance;frequencies[school.id].ordinary+=ordinary;
}
const result={source:'deterministic automated simulation, not player statistics',runs:cases.length,endings,meanPlayerActions:cases.reduce((n,c)=>n+c.playerActions,0)/cases.length,ordinaryDuplicates:cases.reduce((n,c)=>n+c.ordinaryDuplicates,0),fallbackEvents:cases.reduce((n,c)=>n+c.fallbackEvents,0),fallbackSnapshots,maxSteps:Math.max(...cases.map(c=>c.steps)),datingFrequency:Object.fromEntries(Object.entries(frequencies).map(([k,v])=>[k,{...v,ratio:v.ordinary?v.romance/v.ordinary:null}])),cases};fs.writeFileSync(narrow?'output/round8-pool-diagnostics.json':'output/round8-route-audit.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,cases:undefined},null,2));
