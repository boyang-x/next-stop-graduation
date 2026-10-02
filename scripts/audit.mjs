import {eventConditionErrors} from '../src/event-conditions.js';
import {CADRE_ROLES} from '../src/life-rules.js';
import { EVENTS, TAGS, QUESTIONS, JOBS, SCHOOLS, MAJORS } from '../src/content.js';
import { LOTTERY_TICKETS, lotteryStats } from '../src/lottery.js';
import { PUBLIC_POSTS } from '../src/career-content.js';
const errors=[];const ids=new Set();
const effects=(e,at)=>{for(const tag of e?.tags||[])if(!TAGS[tag])errors.push(`${at}: 未定义标签 ${tag}`);};
const outcome=(o,at)=>{if(!o?.text)errors.push(`${at}: 缺少结果文本`);effects(o?.effects,at);};
for(const e of EVENTS){for(const problem of eventConditionErrors(e))errors.push(`${e.id}: ${problem}`);if(ids.has(e.id))errors.push(`重复事件 ${e.id}`);ids.add(e.id);if(!e.title||!e.text||e.choices?.length!==3)errors.push(`${e.id}: 普通剧情必须有三个选项`);if(!['study','project','work','social','life'].includes(e.category))errors.push(`${e.id}: 分类无效`);
  if(e.school&&!SCHOOLS.some(s=>s.id===e.school))errors.push(`${e.id}: 未知院校`);if(e.major&&!MAJORS[e.major])errors.push(`${e.id}: 未知专业`);
  for(const role of e.roles||[])if(!CADRE_ROLES.some(r=>r.id===role))errors.push(`${e.id}: 未知学生干部岗位 ${role}`);
  for(const t of [...e.tags||[],...e.notTags||[]])if(!TAGS[t])errors.push(`${e.id}: 条件标签未定义 ${t}`);
  for(const c of e.choices){effects(c.effects,e.id);for(const t of [...c.requiresAllTags||[],...c.requiresAnyTags||[]])if(!TAGS[t])errors.push(`${e.id}: 选项标签未定义 ${t}`);if(c.probability){const p=typeof c.probability==='number'?c.probability:c.probability.base;if(p<0||p>1)errors.push(`${e.id}: 概率越界`);for(const t of Object.keys(c.probability.tags||{}))if(!TAGS[t])errors.push(`${e.id}: 概率标签未定义 ${t}`);outcome(c.success,e.id);outcome(c.failure,e.id);}else if(!c.result&&c.action!=='lottery')errors.push(`${e.id}: 缺少确定结果`);}
}
for(const q of QUESTIONS){
 if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length||!q.explanation||!q.text||!q.purposes?.length||!q.section||!['基础','中等','挑战'].includes(q.difficulty))errors.push(`${q.id}: 题目配置无效`);
 if(q.majors?.some(m=>!MAJORS[m]))errors.push(`${q.id}: 未知题目专业`);
 if(q.category!=='general'&&!q.majors?.length)errors.push(`${q.id}: 专业题缺少具体专业归属`);
 if(q.purposes.some(p=>!['jobs','exam','civil'].includes(p)))errors.push(`${q.id}: 未知考试类型`);
}
for(const e of EVENTS)for(const c of e.choices)if(c.probability!==undefined){
 const p=c.probability,base=typeof p==='number'?p:p?.base;
 if(!Number.isFinite(base)||base<0||base>1)errors.push(`${e.id}: 缺少有限基础概率`);
 if(typeof p==='object'){
  for(const key of ['energy','mood','charm','grade'])if(p[key]!==undefined&&!Number.isFinite(p[key]))errors.push(`${e.id}: 概率修正 ${key} 非数值`);
  if(Object.values(p.tags||{}).some(n=>!Number.isFinite(n)))errors.push(`${e.id}: 标签概率修正非数值`);
 }
}
for(const e of EVENTS)for(const c of e.choices)for(const node of [c,c.success,c.failure])if(node?.followUp){const link=node.followUp;if(link.id!=='$cadreTask'&&!EVENTS.some(t=>t.id===link.id))errors.push(`${e.id}: 未知接续 ${link.id}`);if((link.after??1)<0||(link.expires??8)<(link.after??1))errors.push(`${e.id}: 接续时间窗口无效`);}
if(new Set(QUESTIONS.map(q=>q.id)).size!==QUESTIONS.length)errors.push('题目 ID 重复');
for(const t of LOTTERY_TICKETS){const sum=t.prizes.reduce((n,[,p])=>n+p,0);if(Math.abs(sum-1)>1e-12||!t.prizes.some(([a,p])=>a===10000000&&p>0))errors.push(`${t.id}: 彩票分布无效`);}
if(new Set(JOBS.map(j=>j.id)).size!==JOBS.length)errors.push('岗位 ID 重复');
for(const j of JOBS){if(!Number.isFinite(j.salary)||!Number.isFinite(j.salaryMax)||j.salary<=0||j.salary>j.salaryMax||j.examLine<0||j.examLine>100||!j.employerType||!j.description||!j.benefits||!j.preparation)errors.push(`${j.id}: 岗位配置无效`);if(j.premium&&(!j.bigTech||j.regularMax<j.salary||j.regularMax>j.salaryMax))errors.push(`${j.id}: 大厂薪资档位无效`);}
if(new Set(PUBLIC_POSTS.map(p=>p.id)).size!==PUBLIC_POSTS.length)errors.push('公共岗位ID重复');
for(const p of PUBLIC_POSTS)if(!Number.isFinite(p.base)||p.base<0||p.base>1||!Number.isFinite(p.examLine)||p.examLine<0||p.examLine>100||!Number.isFinite(p.salary)||!Number.isFinite(p.salaryMax)||p.salary<=0||p.salary>p.salaryMax||!p.company||!p.role||!p.track||!p.level||!p.description||!p.benefits)errors.push(`${p.id}: 公共岗位配置无效`);
const groups=Object.fromEntries([...new Set(EVENTS.map(e=>e.group))].map(g=>[g,EVENTS.filter(e=>e.group===g).length]));
console.log(JSON.stringify({events:EVENTS.length,groups,tags:Object.keys(TAGS).length,questions:QUESTIONS.length,companies:new Set(JOBS.map(j=>j.company)).size,jobs:JOBS.length,lottery:LOTTERY_TICKETS.map(t=>({price:t.price,...lotteryStats(t)})),errors},null,2));
if(errors.length)process.exitCode=1;
