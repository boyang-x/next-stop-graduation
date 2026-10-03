import { cadreRole } from './life-rules.js';
const term=sem=>sem<8?'大'+['一','二','三','四'][Math.floor(sem/2)]+(sem%2?'下':'上'):sem<14?'研'+['一','二','三'][Math.floor((sem-8)/2)]+(sem%2?'下':'上'):'二战备考';
export function describeRun(s){
  const real=s.grades.filter(g=>!g.epilogue),ug=real.filter(g=>g.sem<8),grad=real.filter(g=>g.sem>=8&&g.sem<14),latest=grad.length?grad:ug;
  const lines=[];
  if(latest.length){const first=latest[0],last=latest.at(-1),delta=+(last.grade-first.grade).toFixed(1);lines.push(latest.length===1?`${term(first.sem)}首次结算 ${first.grade} 分。`:`${grad.length?'研究生':'本科'}实际结算成绩从 ${first.grade} 到 ${last.grade} 分，${delta>0?'提高 '+delta:delta<0?'下降 '+(-delta):'保持相同水平'}。`);}else lines.push('这局在首次期末结算前结束，学业还未形成正式成绩。');
  const posts=(s.cadreHistory||[]).map(c=>({...c,name:cadreRole(c.role)?.name||'学生干部',period:term(c.startSem)+(c.closedAt!==undefined&&c.closedAt<(c.endSem??c.startSem+2)?'起，实际任期已提前交接':'起的一学年')}));
  lines.push(posts.length?`你有 ${posts.length} 段学生干部任职，处理过 ${posts.reduce((n,p)=>n+(p.tasks||0),0)} 次履职或反馈场景。`:'你没有担任学生干部，时间留给了其他选择。');
  if(s.relationship)lines.push(`毕业或收尾时，你与${s.relationship.person.name}仍在相处，亲密度 ${s.relationship.intimacy}；这一段关系留下 ${s.relationship.memories||0} 次共同回忆。`);
  else lines.push(s.romances.length?`经历过 ${s.romances.length} 段恋爱，这次收尾时是单身。`:'这局没有进入恋爱关系，也有属于自己的校园经历。');
  if(s.policy?.result)lines.push(`大三末${s.policy.result.eligible?'获得':'未获得'}推免资格，当时按${s.policy.metricName}第 ${s.policy.result.rank} 名结算，参考线前 ${s.policy.places} 名。`);
  const failures=(s.academicFailures||[]);if(failures.length)lines.push(`出现过 ${failures.length} 次未通过课程的学期，${failures.filter(f=>f.resolved).length} 次已完成补救${failures.some(f=>!f.resolved)?'，尚有问题影响毕业条件':''}。`);
  const finances=s.finances||[],support=finances.reduce((n,f)=>n+(f.income||0),0),necessary=finances.reduce((n,f)=>n+(f.paid||0),0),initial=finances.find(f=>f.before!==undefined)?.before??s.balance;
  const internshipGross=finances.reduce((n,f)=>n+(f.type==='internship'?f.gross:0),0),internshipCost=finances.reduce((n,f)=>n+(f.type==='internship'?f.extraCost:0),0);
  const money={initial,support,necessary,internshipGross,internshipCost,otherNet:s.balance-initial-support+necessary,unpaid:s.unpaidLiving||0};
  return {lines,posts,money,grades:real.map(g=>({...g,label:term(g.sem)})),failures};
}
