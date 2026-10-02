import {QUESTIONS,MAJORS,JOBS} from './content.js';
export const CIVIL_TOPICS=['政治理论','常识判断','言语理解','数量关系','判断推理','资料分析'];
export function questionSubject(q,purpose){
  if(purpose==='civil')return q.section.includes('材料分析')?'材料分析':'行测';
  if(q.category!=='general')return '专业';
  return q.subject||(/数学/.test(q.section)?'数学':/英语/.test(q.section)?'英语':'通用');
}
export function buildPaper(s,purpose,roll){
  const picked=[],used=new Set(),previous=new Set((s.quizHistory||[]).flatMap(h=>h.questions||[]));
  const take=(pool,n)=>{let left=pool.filter(q=>!used.has(q.id));for(let i=0;i<n&&left.length;i++){
    const fresh=left.filter(q=>!previous.has(q.id));const candidates=fresh.length?fresh:left,q=candidates[Math.floor(roll()*candidates.length)];picked.push(q);used.add(q.id);left=left.filter(x=>x.id!==q.id);
  }};
  const eligible=QUESTIONS.filter(q=>q.purposes.includes(purpose));
  if(purpose==='civil'){
    for(const topic of CIVIL_TOPICS)take(eligible.filter(q=>q.topic===topic),1);
    take(eligible.filter(q=>q.section.includes('材料分析')),2);
    return {questions:picked,description:'行测六类各1题 · 申论思路2题（选择题简化）',title:'考公 · 行测与材料分析'};
  }
  const professional=eligible.filter(q=>q.majors?.includes(s.major));
  // Computing is the only major in the technology category, so its legacy system
  // questions are also relevant. Other broad categories never mix adjacent majors.
  if(s.major==='cs')professional.push(...eligible.filter(q=>q.category==='tech'&&!q.majors));
  if(purpose==='jobs'){
    const jobs=s.selectedJobs.map(id=>JOBS.find(j=>j.id===id)).filter(Boolean),technical=jobs.some(j=>j.category!=='general');
    const tier=Math.max(1,...jobs.map(j=>j.tier));
    const general=eligible.filter(q=>q.category==='general'&&q.section==='通用推理');take(general,technical?2:5);
    take(professional.filter(q=>q.difficulty==='基础'),2);
    if(technical){take(professional.filter(q=>q.difficulty==='中等'),tier>=3?1:3);if(tier>=3)take(professional.filter(q=>q.difficulty==='挑战'),2);}
    return {questions:picked,title:'秋招笔试 · '+MAJORS[s.major].name,description:`专业 ${picked.filter(q=>q.category!=='general').length} 题 · 通用 ${picked.filter(q=>q.category==='general').length} 题。同类岗位共享成绩，岗位档位决定计分范围。`};
  }
  const mathematics=['cs','aerospace','mechanical','finance','accounting'].includes(s.major);
  take(eligible.filter(q=>q.subject==='政治'),1);
  take(eligible.filter(q=>q.subject==='英语'||q.section.includes('英语')&&/[a-z]{3}/i.test(q.text)),1);
  if(mathematics)take(eligible.filter(q=>questionSubject(q,purpose)==='数学'),2);
  const n=mathematics?4:6;
  if(s.target==='aero'){take(professional.filter(q=>q.difficulty==='挑战'),2);take(professional.filter(q=>q.difficulty==='中等'),n-2);}
  else {take(professional.filter(q=>q.difficulty==='基础'),2);take(professional.filter(q=>q.difficulty==='中等'),n-2);}
  take(professional,n-picked.filter(q=>q.category!=='general').length);
  return {questions:picked,title:'考研初试 · '+MAJORS[s.major].name,description:mathematics?'政治1题 · 英语1题 · 数学2题 · 专业4题（原创模拟短卷）':'政治1题 · 英语1题 · 专业6题（原创模拟短卷）'};
}
export function sectionScores(quiz){
  const groups={};quiz.questions.forEach((id,i)=>{const q=QUESTIONS.find(q=>q.id===id),name=questionSubject(q,quiz.purpose);groups[name]??={correct:0,total:0};groups[name].total++;if(quiz.answers[i]===q.answer)groups[name].correct++;});
  return Object.fromEntries(Object.entries(groups).map(([key,x])=>[key,{...x,score:Math.round(x.correct/x.total*100)}]));
}
export function weightedExamScore(quiz){
  const x=quiz.sections||sectionScores(quiz),points=key=>x[key]?.score||0;
  if(quiz.purpose==='civil')return Math.round(points('行测')*.8+points('材料分析')*.2);
  if(quiz.purpose==='exam')return Math.round(x.数学?points('政治')*.1+points('英语')*.1+points('数学')*.2+points('专业')*.6:points('政治')*.2+points('英语')*.2+points('专业')*.6);
  return quiz.score;
}
export function jobPaperScore(quiz,job){
  const selected=quiz.questions.map((id,i)=>({q:QUESTIONS.find(q=>q.id===id),i}));
  const professional=selected.filter(({q})=>q.category===job.category&&(job.tier>=3||job.tier===2&&q.difficulty!=='挑战'||q.difficulty==='基础'));
  if(job.category==='general')return quiz.generalScore;
  if(!professional.length)throw new Error('Missing professional coverage for '+job.id);
  const score=professional.filter(({q,i})=>quiz.answers[i]===q.answer).length/professional.length*100;
  return Math.round(score*.8+quiz.generalScore*.2);
}
