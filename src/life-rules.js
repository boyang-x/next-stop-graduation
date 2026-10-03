import {academicMonth,vacationAt} from './calendar.js';
import { MONTHLY_ALLOWANCE } from './economy.js';
import {settleCadreCredits} from './score-ledger.js';

// All values here describe the fictional game, not real admission or living costs.
export const CADRE_ROLES = [
  {id:'class-leader',name:'班长',group:'小班委',duty:'协调班级事务与同学意见',minYear:1,chance:.64},
  {id:'class-study',name:'学习委员',group:'小班委',duty:'收集作业与组织学业互助',minYear:1,chance:.67},
  {id:'class-life',name:'生活委员',group:'小班委',duty:'处理宿舍与生活事务',minYear:1,chance:.69},
  {id:'class-culture',name:'文体委员',group:'小班委',duty:'组织班级比赛与文体活动',minYear:1,chance:.68},
  {id:'year-leader',name:'年级负责人',group:'大班委',duty:'跨班协调与年级事务',minYear:2,chance:.48},
  {id:'year-study',name:'年级学业负责人',group:'大班委',duty:'协调跨班学习与材料汇总',minYear:2,chance:.53},
  {id:'year-culture',name:'年级文体负责人',group:'大班委',duty:'统筹年级活动与场地',minYear:2,chance:.55},
  {id:'union-study',name:'学生会学业部干事',group:'学生会',duty:'参与讲座与学习活动执行',minYear:1,chance:.63},
  {id:'union-culture',name:'学生会文体部干事',group:'学生会',duty:'参与演出与赛事执行',minYear:1,chance:.65},
  {id:'union-service',name:'学生会生活服务部干事',group:'学生会',duty:'收集同学意见与服务校园',minYear:1,chance:.67},
  {id:'union-head',name:'学生会部门负责人',group:'学生会',duty:'部门分工与跨部门合作',minYear:2,experience:true,chance:.48},
  {id:'union-president',name:'学生会负责人',group:'学生会',duty:'统筹学生会与交接工作',minYear:3,experience:true,chance:.37},
];
export const cadreRole = id => CADRE_ROLES.find(r=>r.id===id);
const bounded = (n,a=0,b=100) => Math.min(b,Math.max(a,n));
const ROUTINES = {规律复习:4,深度阅读:3,运动习惯:3,兼职经历:3,志愿服务:3,校园活动:2,公共表达:2,学业互助:2,科研接触:1,校友联系:1,跨校社交:1,备考经验:1,求职经历:1};
export const ROUTINE_NOTES={
  规律复习:'已形成规律复习习惯，相关学习、升学和面试选择可以识别这份准备。',
  深度阅读:'阅读积累已达到门槛，相关研究与材料分析选择可以获得经历加成。',
  运动习惯:'已形成运动习惯，运动相关剧情可以识别这份积累。',
  兼职经历:'兼职积累已达到经历门槛，后续选择可以识别你的工作经验。',
  志愿服务:'已积累足够的志愿服务经历，可以用于相关服务和面试选择。',
  校园活动:'活动积累已达到门槛，可用于相关竞选与校园经历回答。',
  公共表达:'已积累公共表达经验，可用于相关展示和面试选择。',
  学业互助:'已积累学业互助经验，相关剧情可以识别这份准备。',
  科研接触:'已记录科研接触；这仍不等于完成一项研究成果。',
  校友联系:'已建立校友联系，配置了该经历的实习与求职选择可以获得加成。',
  跨校社交:'已记录跨校社交经历，相关相识选择可以获得加成。',
  备考经验:'已记录备考准备，可以用于考试提示等相关选择。',
  求职经历:'已记录求职准备，相关剧情可以识别你的求职方向。',
};
const SPECIAL = new Set(['英语证书','普通话证书','财会证书','竞赛获奖','软件项目','工程项目','商业分析','科研经历','发表成果','创作经历','实习经历','教育实习','教学实践','学生干部经历','班委经历','社团骨干','公益项目','奖学金','分手经历','远距离相处','富裕恋人','彩票大奖','保研资格','保研落选','考研失利','二战经历','资助经历','政策调研','毕业论文']);
export const canonicalTag = tag => tag==='班委经历'?'学生干部经历':tag==='教育实习'?'教学实践':tag;
export function recordRoutine(s,tag,detail='') {
  if(tag==='共同回忆'&&s.relationship){normalizeRelationship(s);s.relationship.memories=(s.relationship.memories||0)+1;return true;}
  if(!ROUTINES[tag])return false;
  s.traits??={};const before=s.traits[tag]||0;s.traits[tag]=before+1;s.routineUnlocks??=[];if(before<ROUTINES[tag]&&s.traits[tag]>=ROUTINES[tag])s.routineUnlocks.push({tag,note:ROUTINE_NOTES[tag],sem:s.sem});return true;
}
export function routinePresent(s,tag) {
  if(tag==='共同回忆')return !!s.relationship&&(s.relationship.memories>0||s.history.some(h=>h.tag===tag&&h.detail===s.relationship.person.name&&s.relationship.legacy));
  return (s.traits?.[tag]||0)>=(ROUTINES[tag]||Infinity);
}
export function importantExperiences(s) {
  const groups=new Map();
  for(const h of s.history){if(!SPECIAL.has(h.tag)&&!(h.tag==='彩票中奖'&&/¥([\d,]+)/.test(h.detail||'')&&Number((h.detail||'').match(/¥([\d,]+)/)[1].replaceAll(',',''))>=1000))continue;
    const tag=canonicalTag(h.tag);if(!groups.has(tag))groups.set(tag,{tag,count:0,entries:[]});const item=groups.get(tag);item.count++;item.entries.push({...h,tag});
  }
  return [...groups.values()];
}
function seedNumber(seed,text) {let x=seed>>>0;for(const c of text)x=Math.imul(x^c.charCodeAt(0),16777619)>>>0;return x/4294967296;}
export function createPolicy(s) {
  const base={aero:.22,normal:.20,finance:.20}[s.originSchool||s.school]||.2;
  const adjustment={cs:0,aerospace:.025,mechanical:.01,humanities:-.02,education:.025,language:-.01,psychology:.01,finance:-.01,accounting:0}[s.major]||0;
  const rate=Number(bounded(base+adjustment+(seedNumber(s.worldSeed,'quota-'+s.major)-.5)*.06,.12,.30).toFixed(3));
  return {school:s.originSchool||s.school,major:s.major,cohort:s.cohort,rate,places:Math.max(1,Math.floor(s.cohort*rate)),metric:'combinedRank',metricName:'综合排名',minGpa:78,noOutstandingFailures:true,published:false,announcedAt:null,settlement:'大三学年结束'};
}
export function normalizeRelationship(s) {
  const r=s.relationship;if(!r)return;
  r.id??=`legacy-${r.person.id||r.person.name}-${r.started??s.sem}`;
  if(r.intimacy===undefined){r.intimacy=r.stage==='strained'?25:r.stage==='steady'?78:55;r.legacy=true;}
  r.preference??=r.person.rich||String(r.person.id||'').length%2===0?'shared':'thoughtful';r.intimacy=bounded(r.intimacy);r.memories??=0;r.flags??={};r.lastContact??=s.calendarTick||0;
}
export function changeIntimacy(s,delta,{contact=false}={}) {
  if(!s.relationship)return;
  normalizeRelationship(s);const r=s.relationship;
  // Good everyday choices still matter; high intimacy is a peak, not an idle state.
  const gain=delta>0?delta*(r.intimacy>=95?.12:r.intimacy>=85?.3:r.intimacy>=75?.65:1):delta;
  r.intimacy=bounded(Math.round((r.intimacy+gain)*10)/10);
  r.stage=r.intimacy<35?'strained':r.intimacy>=75?'steady':'dating';
  if(contact)r.lastContact=s.calendarTick||0;
}
export function initializeLife(s) {
  const fresh=s.rulesRevision!==5;
  s.week??=0;s.weekendDue??=false;s.academicFailures??=[];s.neglectStreak??=0;
  s.worldSeed??=s.rng;s.traits??={};s.finances??=[];s.unpaidLiving??=0;s.cadreHistory??=[];s.termBehavior??={studyActions:0,missed:0};
  s.policy??=createPolicy(s);s.cadre??=null;
  if(fresh&&s.committee&&s.sem<8&&!s.cadre){const start=Math.floor(s.sem/2)*2;s.cadre={role:'class-leader',startSem:start,endSem:start+2,performance:0,tasks:0,legacy:true};s.cadreHistory.push({...s.cadre});}
  if(s.cadre&&(s.sem>=s.cadre.endSem||s.sem>=8)){settleCadreCredits(s);s.previousCadre=structuredClone(s.cadre);s.cadre=null;}
  s.committee=!!s.cadre;normalizeRelationship(s);s.rulesRevision=5;
}
export function cadreAvailable(s,r) {
  const year=Math.floor(s.sem/2)+1;
  if(s.sem>=8||year<r.minYear)return {ok:false,reason:`大${r.minYear}起开放`};
  if(r.experience&&!s.cadreHistory?.length&&!s.history.some(h=>['班委经历','学生干部经历'].includes(h.tag)))return {ok:false,reason:'需要学生干部经历'};
  return {ok:true,reason:''};
}
export function monthlyBudget(s,{holiday=null}={}) {
  const gap=s.sem>=14;holiday??=vacationAt(academicMonth(s));
  const income=MONTHLY_ALLOWANCE;
  const cost=holiday?850:gap?1050:({aero:1500,normal:1430,finance:1450}[s.school]||1400);
  return {income,cost};
}
export function policyResult(s) {
  const p=s.policy;
  const outstanding=(s.academicFailures||[]).filter(f=>!f.resolved);
  return {eligible:s[p.metric]<=p.places&&s.gpa>=p.minGpa&&outstanding.length===0,rank:s[p.metric],outstanding:outstanding.length};
}
