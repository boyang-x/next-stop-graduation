import fs from 'node:fs';
import {EVENTS} from '../src/content.js';
import {GRADUATE_BANDS} from '../src/round12-graduate.js';
import {OPTION_REVIEW} from '../src/round12-rules.js';
const newEvents=EVENTS.filter(e=>e.id.startsWith('r12-'));
const review={version:'0.12',newEvents,oldOptionChanges:OPTION_REVIEW,allEvents:EVENTS};
fs.mkdirSync('output',{recursive:true});fs.writeFileSync('output/round12-content-review.json',JSON.stringify(review,null,2));
const lines=['# 第十二轮内容与条件审读清单','','本轮159个新增节点；以下保留实际加载后的原文、条件、每个行动与结果，方便直接复核。配置检查只证明字段与引用有效，不代替语言和情境审读。','','审读规则：明确地点和对象；费用对应真实购买；准备与完成分开；研究生专业方法分流；关系选项尊重双方日程；不以恶意行为凑选项；坏运气不扣魅力；后续有前置行动及退出路径。','',`研究生主题数量：${Object.entries(GRADUATE_BANDS).map(([k,v])=>k+' '+v.length).join('、')}；阶段交界允许已开始的后续继续。`,''];
for(const e of newEvents){
 const conditions=Object.fromEntries(Object.entries(e).filter(([k])=>!['id','title','text','choices','category','topic','weight','duration'].includes(k)));
 lines.push('## '+e.id+' · '+e.title,'',e.text,'',`情境与触发：\`${JSON.stringify(conditions)}\`；日程${e.duration}周（含正常课程）。`,'');
 for(const [i,c]of e.choices.entries()){
  lines.push(`${i+1}. ${c.text}`,`   结果：${c.result||'按成功与失败结果公布。'}`);
  for(const key of ['success','failure'])if(c[key])lines.push(`   ${key==='success'?'成功':'失败'}：${c[key].text}`);
  lines.push(`   数值与后续：\`${JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k])=>!['text','result'].includes(k))))}\``);
 }
 lines.push('');
}
lines.push('## 原有选项修订','','逐项修订不合理行为。未在此表出现的旧内容仍在完整JSON的allEvents中，前一轮场景审读记录保留在SCENE_CLARITY_REVIEW.md。','');
for(const r of OPTION_REVIEW)lines.push(`- ${r.id}${r.index===undefined?'':' / '+(r.index+1)}：${r.reason}`);
fs.writeFileSync('ROUND12_CONTENT_REVIEW.md',lines.join('\n')+'\n');
console.log(JSON.stringify({newNodes:newEvents.length,reviewedOptionChanges:OPTION_REVIEW.length}));
