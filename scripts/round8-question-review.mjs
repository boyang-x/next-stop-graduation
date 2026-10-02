import fs from 'node:fs';
import assert from 'node:assert/strict';
import {QUESTIONS,MAJORS,JOBS,SCHOOLS} from '../src/content.js';
import {buildPaper} from '../src/exam-rules.js';
import {createGame,random} from '../src/engine.js';
const original=JSON.parse(fs.readFileSync('output/round8-content-before.json','utf8')).questions;
const reviewed=new Set(JSON.parse(fs.readFileSync('output/round8-reviewed-question-ids.json','utf8')));
const reached=new Map(),groups=[];
for(const major of Object.keys(MAJORS))for(const purpose of ['jobs','exam','civil'])for(const target of (purpose==='exam'?['aero','normal']:purpose==='jobs'?[1,2,3]:['normal'])){
 const seen=new Set();let min=Infinity,max=0;
 for(let seed=1;seed<=600;seed++){
  const s=createGame({school:SCHOOLS.find(x=>x.majors.includes(major)).id,major},seed*1193);s.target=target;
  s.selectedJobs=JOBS.filter(j=>(j.category===MAJORS[major].category||j.category==='general')&&j.tier<=target).map(j=>j.id);
  const paper=buildPaper(s,purpose,()=>random(s));min=Math.min(min,paper.questions.length);max=Math.max(max,paper.questions.length);
  for(const q of paper.questions){seen.add(q.id);reached.set(q.id,[...(reached.get(q.id)||[]),major+'/'+purpose+'/'+target]);}
  assert.equal(new Set(paper.questions.map(q=>q.id)).size,paper.questions.length);
  if(purpose!=='jobs')assert.equal(paper.questions.length,8);
  const pro=paper.questions.filter(q=>q.category!=='general');assert.ok(pro.every(q=>q.majors?.includes(major)));
 }
 groups.push({major,purpose,target,papers:600,minQuestions:min,maxQuestions:max,distinctQuestions:seen.size,ids:[...seen]});
}
const questions=QUESTIONS.map(q=>{const before=original.find(x=>x.id===q.id);return {id:q.id,sourceReviewed:reviewed.has(q.id),changedFields:Object.keys(q).filter(k=>JSON.stringify(q[k])!==JSON.stringify(before?.[k])),runtimeRoutes:[...new Set(reached.get(q.id)||[])],before,after:q};});
const missing=questions.filter(q=>!q.sourceReviewed||!q.runtimeRoutes.length).map(q=>q.id);
const result={scope:'All 190 stems/options/answers/explanations source reviewed; actual buildPaper reachability over deterministic seeds, not real-exam equivalence',papers:groups.reduce((n,g)=>n+g.papers,0),reviewed:questions.filter(q=>q.sourceReviewed).length,reached:questions.filter(q=>q.runtimeRoutes.length).length,missing,groups,questions};
fs.writeFileSync('output/round8-question-review.json',JSON.stringify(result,null,2));
fs.writeFileSync('ROUND8_QUESTION_REVIEW.md','# 第八轮题库审读与组卷覆盖\n\n'+result.reviewed+'/190道题逐题审读，'+result.reached+'/190道题在实际组卷器中被抽到；共'+result.papers+'张短卷。专业题按具体专业归属，通用题按考试类型和科目抽取。全部原文、修改字段和实际抽取路线见 [记录](output/round8-question-review.json)。这是原创短卷的逻辑与覆盖检查，不代表完整现实考试。\n\n| 专业 | 类型 | 目标/档位 | 短卷题数 | 可抽到的不同题目 |\n| --- | --- | --- | --- | --- |\n'+groups.map(g=>`| ${MAJORS[g.major].name} | ${g.purpose} | ${g.target} | ${g.minQuestions}—${g.maxQuestions} | ${g.distinctQuestions} |`).join('\n')+'\n');
console.log(JSON.stringify({...result,groups:undefined,questions:undefined}));assert.deepEqual(missing,[]);
