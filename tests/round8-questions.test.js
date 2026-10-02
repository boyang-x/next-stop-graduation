import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,MAJORS,JOBS,SCHOOLS} from '../src/content.js';
import {createGame,random} from '../src/engine.js';
import {buildPaper,CIVIL_TOPICS} from '../src/exam-rules.js';
test('reviewed legacy questions have executable major and exam routes',()=>{
 const seen=new Set();
 for(const major of Object.keys(MAJORS))for(const purpose of ['jobs','exam','civil'])for(let seed=1;seed<=300;seed++){
  const s=createGame({major,school:SCHOOLS.find(x=>x.majors.includes(major)).id},seed*1193);s.target=seed%2?'aero':'normal';s.selectedJobs=JOBS.filter(j=>j.category===MAJORS[major].category).map(j=>j.id);
  const p=buildPaper(s,purpose,()=>random(s));for(const q of p.questions)seen.add(q.id);
  assert.ok(p.questions.filter(q=>q.category!=='general').every(q=>q.majors.includes(major)));
  if(purpose==='civil')assert.deepEqual(new Set(p.questions.filter(q=>q.topic).map(q=>q.topic)),new Set(CIVIL_TOPICS));
 }
 assert.deepEqual(QUESTIONS.filter(q=>!seen.has(q.id)).map(q=>q.id),[]);
});
test('Chinese argument reasoning is not presented as postgraduate English, and rank variants differ',()=>{
 for(const id of ['exam-lang-3','exam-lang-5'])assert.ok(!QUESTIONS.find(q=>q.id===id).purposes.includes('exam'));
 const q=QUESTIONS.find(q=>q.id==='v6-math-1');assert.equal(q.options[q.answer],'2');assert.notEqual(q.text,QUESTIONS.find(q=>q.id==='exam-math-3').text);
 assert.match(QUESTIONS.find(q=>q.id==='v6-cs-5').options[QUESTIONS.find(q=>q.id==='v6-cs-5').answer],/线程T/);
});
