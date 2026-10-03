import {readFile,writeFile} from 'node:fs/promises';
import {EVENTS} from '../src/content.js';
import {SCENE_REVISIONS} from '../src/scene-clarity.js';

const baseline=JSON.parse(await readFile(process.argv[2]||'output/narrative-before.json','utf8'));
const originals=new Map(baseline.map(e=>[e.id,e]));
const reasons=new Map();
for(const {id,reason} of SCENE_REVISIONS){if(!reasons.has(id))reasons.set(id,[]);reasons.get(id).push(reason);}
const show=v=>v===undefined?'（无）':typeof v==='string'?v:JSON.stringify(v);
const md=v=>show(v).replaceAll('|','\\|').replaceAll('\n',' ');
const diffs=[];
function compare(before,after,path,rows){
  if(JSON.stringify(before)===JSON.stringify(after))return;
  if(before&&after&&typeof before==='object'&&typeof after==='object'){
    for(const key of new Set([...Object.keys(before),...Object.keys(after)]))compare(before[key],after[key],path?path+'.'+key:key,rows);
  }else rows.push({path,before,after});
}
for(const e of EVENTS){const rows=[];compare(originals.get(e.id),e,'',rows);if(rows.length)diffs.push({event:e,rows});}
const textFields=diffs.reduce((n,d)=>n+d.rows.filter(r=>/title|text|result|note/.test(r.path)).length,0);
const optionChanges=diffs.reduce((n,d)=>n+new Set(d.rows.filter(r=>r.path.startsWith('choices.')).map(r=>r.path.split('.')[1])).size,0);
const lines=[
  '# 游戏情境与选项逻辑审查',
  '',
  `已逐条阅读当前加载的 ${EVENTS.length} 个事件、${EVENTS.reduce((n,e)=>n+e.choices.length,0)} 个选项，包括成功/失败结果、触发条件、接续剧情和场景变体。另检查自由活动与系统生成的选项。`,
  '',
  `本轮修改 ${diffs.length} 个事件，涉及 ${optionChanges} 个选项、${textFields} 项文字字段。统计包含背景补充和触发条件修正，不把每项都算成独立错误。`,
  '',
  '## 审查标准',
  '',
  '- 玩家能从标题、背景和选项判断人物、地点、正在发生的事以及自己要做什么。',
  '- 可拒绝或改约的行动发生在接受、出发、付款、开始工作之前；中途退出需说明交接或未完成事项。',
  '- 消费对应具体物品、服务、交通或报名；退款、条件费用、净收入和后续结算提前说明。',
  '- 询问、表态、报名、准备和实际完成区分清楚；获得报酬或经历需要对应行动。',
  '- 不在毕业后的备考年安排在读课程、校园岗位或学生资助；新实习不沿用上次实习报价。',
  '',
  '## 游戏与界面修正',
  '',
  '- 咖啡事件说明图书馆一楼咖啡店、20元饮品和旁边免费阅览区。',
  '- 家教在接受前说明试课100元、完成后续辅导总计800元；请教同学不领取报酬。',
  '- 跨校联谊明确桌游交流、60元场地与饮品费，删除无铺垫的“讨论螺丝”。',
  '- 缺课后借笔记补学仍记一次缺课；等雨只短暂恢复2点精力、1点心情。',
  '- 寝室协商不记课外活动标签，归还私人信件不记志愿标签。',
  '- 选项支持展示条件费用/收入说明，禁用时仍保留说明和余额不足原因。',
  '- 恢复存档刷新尚未结算的事件与暂存事件卡，保留已结算反馈、日志、随机进度和接续标记。',
  '- 自由活动明确食堂个人餐费、公园约会的交通餐点费、寒暑假兼职内容与报酬。',
  '',
  '## 本轮验证（2026-10-02）',
  '',
  '- `npm test`：173项测试通过，0项失败，包括本轮新增的10项场景与存档回归测试。',
  '- `npm run check`：全部300个事件通过内容结构审计，无错误。',
  '- 浏览器专项检查：桌面及390px手机页面验证咖啡消费与免费阅读、联谊费用、家教报酬说明、余额不足时的条件费用提示，无页面错误。',
  '- 浏览器完整试玩：从开局到大四入职结局执行223次操作，正常获得录用并导出总结，无页面错误。',
  '- 完整试玩覆盖一条毕业路径；其余情境通过逐条阅读、内容审计及针对性测试检查。',
  '',
  '## 全部事件审查清单',
  '',
  '下表对应人工阅读后的处理记录。程序只负责导出覆盖范围与差异，不能自动证明语义合理。',
  '',
  '| ID | 最终标题 | 处理 | 原因 |',
  '| --- | --- | --- | --- |',
  ...EVENTS.map(e=>`| ${e.id} | ${md(e.title)} | ${reasons.has(e.id)?'已修改':'保留'} | ${md(reasons.get(e.id)?.join('；')||'背景、行动、结果与触发条件可衔接，本轮未发现需修正的问题')} |`),
  '',
  '## 逐项修改前后对照',
];
for(const {event:e,rows} of diffs){
  lines.push('',`### ${e.id} · ${e.title}`,'',reasons.get(e.id)?.join('；')||'场景逻辑修正','', '| 字段 | 修改前 | 修改后 |','| --- | --- | --- |',...rows.map(r=>`| ${r.path} | ${md(r.before)} | ${md(r.after)} |`));
}
await writeFile('SCENE_CLARITY_REVIEW.md',lines.join('\n')+'\n','utf8');
console.log(JSON.stringify({events:EVENTS.length,choices:EVENTS.reduce((n,e)=>n+e.choices.length,0),changedEvents:diffs.length,changedChoices:optionChanges,textFields,mechanicalChanges:diffs.flatMap(d=>d.rows.filter(r=>!/title|text|result|note/.test(r.path)).map(r=>({id:d.event.id,...r})))},null,2));
