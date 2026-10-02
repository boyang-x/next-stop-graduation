import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,startQuiz,ensureCard,answerQuestion,nextQuestion,jobEligibility} from '../src/engine.js';
import {QUESTIONS,JOBS,MAJORS,SCHOOLS} from '../src/content.js';
import {CIVIL_TOPICS,sectionScores,jobPaperScore} from '../src/exam-rules.js';
function paper(major,purpose,target='normal',seed=66){const school=SCHOOLS.find(s=>s.majors.includes(major));const s=createGame({school:school.id,major},seed);s.target=target;s.selectedJobs=JOBS.filter(j=>jobEligibility(s,j).ok).map(j=>j.id);s.notices=[];s.card=null;startQuiz(s,purpose);ensureCard(s);return s;}
function questions(s){return s.quiz.questions.map(id=>QUESTIONS.find(q=>q.id===id));}
test('every playable major has its own recruitment questions, mostly professional rather than generic reasoning',()=>{
  for(const major of Object.keys(MAJORS))for(let seed=1;seed<=20;seed++){
    const s=paper(major,'jobs','normal',seed),qs=questions(s),pro=qs.filter(q=>q.category!=='general');assert.ok(pro.length>=4,major);assert.ok(pro.length>qs.length/2);assert.ok(pro.every(q=>q.majors?.includes(major)||major==='cs'&&q.category==='tech'));assert.ok(qs.every(q=>q.purposes.includes('jobs')));assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);
  }
});
test('civil paper covers each official topic category and separates simplified material cases from major questions',()=>{
  const s=paper('mechanical','civil'),qs=questions(s);assert.deepEqual(new Set(qs.filter(q=>q.topic).map(q=>q.topic)),new Set(CIVIL_TOPICS));assert.equal(qs.filter(q=>q.section.includes('材料分析')).length,2);assert.ok(qs.every(q=>q.category==='general'&&q.purposes.includes('civil')));assert.match(s.quiz.description,/简化/);
});
test('entrance papers have political theory, English and correct major subjects, with math only in configured tracks',()=>{
  for(const major of Object.keys(MAJORS)){
    const s=paper(major,'exam'),qs=questions(s),pro=qs.filter(q=>q.category!=='general');assert.ok(qs.some(q=>q.subject==='政治'));assert.ok(qs.some(q=>q.subject==='英语'||q.section.includes('英语')));assert.ok(pro.every(q=>q.majors?.includes(major)||major==='cs'&&q.category==='tech'));
    assert.equal(qs.some(q=>q.subject==='数学'||q.section.includes('数学')),['cs','aerospace','mechanical','finance','accounting'].includes(major));assert.equal(qs.length,8);
  }
});
test('top-tier recruitment and demanding target schools include challenge questions',()=>{
  const s=paper('cs','jobs');s.selectedJobs=[JOBS.find(j=>j.category==='tech'&&j.tier===3&&j.degree==='本科').id];startQuiz(s,'jobs');assert.ok(questions(s).filter(q=>q.difficulty==='挑战').length>=2);
  const e=paper('aerospace','exam','aero');assert.equal(questions(e).filter(q=>q.category!=='general'&&q.difficulty==='挑战').length,2);
});
test('professional answers dominate technical job score; general jobs use their own general assessment',()=>{
  const s=paper('cs','jobs'),quiz=s.quiz,qs=questions(s);quiz.answers=qs.map(q=>q.category==='general'?(q.answer+1)%4:q.answer);quiz.generalScore=0;
  const technical=JOBS.find(j=>j.category==='tech'&&j.tier===3&&j.degree==='本科'),general=JOBS.find(j=>j.category==='general');assert.equal(jobPaperScore(quiz,technical),80);assert.equal(jobPaperScore(quiz,general),0);
  quiz.answers=qs.map(q=>q.category==='general'?q.answer:(q.answer+1)%4);quiz.generalScore=100;assert.equal(jobPaperScore(quiz,technical),20);
});
test('scores and section breakdown persist after completing actual answers, hint-free and independent of wellbeing',()=>{
  for(const purpose of ['jobs','exam','civil']){const s=paper('psychology',purpose);s.energy=0;s.mood=0;while(s.card?.kind==='quiz'){if(s.quiz.reveal)nextQuestion(s);else{const q=QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]);answerQuestion(s,q.answer);}}
    assert.equal(s.quiz.weightedScore,100);assert.ok(s.quizHistory.at(-1).sections);assert.deepEqual(sectionScores(s.quiz),s.quiz.sections);assert.equal(s.quizHistory.at(-1).weightedScore,100);if(purpose==='civil')assert.equal(s.civilScore,100);
  }
});
test('new papers share a single major assessment regardless of number of companies and prefer unused questions',()=>{
  const s=paper('cs','jobs'),first=[...s.quiz.questions];s.quizHistory=[{questions:first}];startQuiz(s,'jobs');const second=s.quiz.questions;assert.ok(second.filter(id=>first.includes(id)).length<second.length);
  s.selectedJobs=[JOBS.find(j=>j.category==='tech'&&j.tier===3&&j.degree==='本科').id];startQuiz(s,'jobs');const count=s.quiz.questions.length;s.selectedJobs=JOBS.filter(j=>jobEligibility(s,j).ok).map(j=>j.id);startQuiz(s,'jobs');assert.equal(s.quiz.questions.length,count);
});
test('programming operators and multiline question contents exist as literal readable source',()=>{
  const q=QUESTIONS.find(q=>q.id==='v6-cs-4');assert.match(q.text,/\n/);assert.match(q.text,/range\(i\)/);assert.equal(q.options[q.answer],'n(n−1)/2');
});

test('authored numerical and code answers agree with independent worked calculations',()=>{
  const answer=id=>{const q=QUESTIONS.find(q=>q.id===id);return q.options[q.answer];};
  let misses=0;const lru=[];for(const page of [1,2,3,4,1,5,2]){const at=lru.indexOf(page);if(at<0){misses++;if(lru.length===4)lru.shift();}else lru.splice(at,1);lru.push(page);}
  assert.equal(Number(answer('v6-cs-3')),misses);
  for(let n=1;n<25;n++){let count=0;for(let i=0;i<n;i++)for(let j=0;j<i;j++)count++;assert.equal(count,n*(n-1)/2);}
  assert.equal(answer('v6-cs-4'),'n(n−1)/2');
  assert.ok(Math.abs(Number(answer('v6-finance-0').replace('元',''))-1000*1.1**2)<1e-9);
  const npv=-1000+600/1.1+600/1.1**2;assert.ok(Math.abs(Number(answer('v6-finance-4').replace('元',''))-npv)<1);
  assert.equal(Number(answer('v6-psychology-3')),12/Math.sqrt(36));
  assert.ok(Math.abs(Number(answer('v6-psychology-4'))-(1-.9**2))<1e-12);
  assert.equal(answer('v6-mechanical-4'),(20-19.993).toFixed(3)+' mm');
  assert.equal(answer('v6-math-4'),'6/7');assert.ok(Math.abs((.6*.8)/(.6*.8+.4*.2)-6/7)<1e-12);
});
