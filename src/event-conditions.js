import {academicMonth,monthNumber} from './calendar.js';
// This registry is executed by the engine and inspected by the content audit.
// A new condition must have a predicate here, not just a name in an allow-list.
export const EVENT_CONDITIONS={
  policyBand:(s,v)=>{if(!s.policy.published||s.hooks.qual)return false;const diff=s[s.policy.metric]-s.policy.places;return v==='near'?diff>0&&diff<=20:v==='leading'?diff<=0:false;},
  cadre:(s,v)=>!v||!!s.cadre,
  roles:(s,v)=>v.includes(s.cadre?.role),
  minIntimacy:(s,v)=>!!s.relationship&&s.relationship.intimacy>=v,
  maxIntimacy:(s,v)=>!!s.relationship&&s.relationship.intimacy<=v,
  semesters:(s,v)=>v.includes(s.sem),
  graduateOnly:(s,v)=>!v||s.sem>=8&&s.sem<14,
  undergraduateOnly:(s,v)=>!v||s.sem<8,
  gapOnly:(s,v)=>!v||s.sem>=14&&s.sem<=15,
  school:(s,v)=>s.school===v,
  major:(s,v)=>s.major===v,
  majors:(s,v)=>v.includes(s.major),
  gender:(s,v)=>s.gender===v,
  minBalance:(s,v)=>s.balance>=v,
  recentExercise:(s,v)=>!v||s.lastExerciseSem===s.sem&&s.eventClock-(s.lastExerciseClock??-100)<=6,
  minActiveTasks:(s,v)=>(s.programs||[]).filter(p=>p.status==='preparing'&&['campus','province','national'].includes(p.type)).length+
    (s.cadre&&s.storyQueue?.some(q=>q.scope==='cadre'&&q.key===s.cadre.role+'-'+s.cadre.startSem&&['cadre-homework','cadre-dorm','cadre-match','cadre-feedback','cadre-cross','cadre-stage'].includes(q.id))?1:0)+
    (s.internship&&!s.internship.completed?1:0)+(s.storyQueue||[]).filter(q=>q.id==='r12-grad-practice-1').length>=v,
  taskContext:(s,v)=>Number.isFinite(s.taskContexts?.[v])&&s.taskContexts[v]>=s.sem*20+s.month*4+(s.week||0),
  minSem:(s,v)=>s.sem>=v,
  maxSem:(s,v)=>s.sem<=v,
  months:(s,v)=>v.includes(monthNumber(academicMonth(s))),
  weeks:(s,v)=>v.includes((s.week||0)+1),
  holidayOnly:(s,v)=>!v||!!s.freeTime?.holiday&&(v===true||s.freeTime.holiday===v),
  locations:(s,v)=>v.includes(s.freeTime?.location||'campus'),
  tags:(s,v,c)=>v.every(t=>c.hasTag(s,t)),
  notTags:(s,v,c)=>v.every(t=>!c.hasTag(s,t)),
  single:(s,v)=>!v||!s.relationship,
  dating:(s,v)=>!v||!!s.relationship,
  candidate:(s,v)=>!v||!!s.candidate,
  noCandidate:(s,v)=>!v||!s.candidate,
  strained:(s,v)=>!v||s.relationship?.stage==='strained',
  richPartner:(s,v)=>!v||!!s.relationship?.person.rich,
  maxEnergy:(s,v,c)=>c.energyPercent(s)<=v,
  maxMood:(s,v)=>s.mood<=v,
  maxBalance:(s,v)=>s.balance<=v,
  minGrade:(s,v)=>s.gpa>=v,
  maxGrade:(s,v)=>s.gpa<=v,
  minMissed:(s,v)=>(s.termBehavior?.missed||0)>=v,
};
export function matchesEventConditions(s,e,context){return Object.entries(EVENT_CONDITIONS).every(([key,predicate])=>e[key]===undefined||predicate(s,e[key],context));}
export const SCOPED_EVENT_FIELDS=['storyScope','followOnly','requiresFlags','notFlags','repeat','cooldown'];
const CONTENT_FIELDS=['id','group','title','text','choices','weight','focus','category','duration','variants','topic','arrivalEffects','severity','recovery'];
export function unknownEventFields(e){return Object.keys(e).filter(k=>!EVENT_CONDITIONS[k]&&!SCOPED_EVENT_FIELDS.includes(k)&&!CONTENT_FIELDS.includes(k));}
export function eventConditionErrors(e){
  const errors=unknownEventFields(e).map(k=>`未实现或未知字段 ${k}`);
  const numbers={minSem:[0,15],maxSem:[0,15],minMissed:[0,Infinity],minIntimacy:[0,100],maxIntimacy:[0,100],maxEnergy:[0,100],maxMood:[0,100],maxBalance:[0,Infinity],minBalance:[0,Infinity],minActiveTasks:[0,Infinity],minGrade:[0,100],maxGrade:[0,100],cooldown:[0,Infinity],duration:[0,10],weight:[0,Infinity]};
  for(const [key,[min,max]] of Object.entries(numbers))if(e[key]!==undefined&&(!Number.isFinite(e[key])||e[key]<min||e[key]>max||(['minSem','maxSem','minMissed','cooldown'].includes(key)&&!Number.isInteger(e[key]))))errors.push(`${key} 必须是范围内的有效数值`);
  for(const key of ['cadre','graduateOnly','undergraduateOnly','gapOnly','single','dating','candidate','noCandidate','strained','richPartner','followOnly','repeat'])if(e[key]!==undefined&&typeof e[key]!=='boolean')errors.push(`${key} 必须是布尔值`);
  for(const [key,min,max] of [['semesters',0,15],['months',1,12],['weeks',1,4]])if(e[key]!==undefined&&(!Array.isArray(e[key])||!e[key].length||e[key].some(v=>!Number.isInteger(v)||v<min||v>max)))errors.push(`${key} 必须是有效的时间范围数组`);
  for(const key of ['roles','locations','tags','notTags','requiresFlags','notFlags','majors'])if(e[key]!==undefined&&(!Array.isArray(e[key])||e[key].some(v=>typeof v!=='string'||!v.trim())))errors.push(`${key} 必须是名称数组`);
  if(e.holidayOnly!==undefined&&![true,false,'寒假','暑假'].includes(e.holidayOnly))errors.push('holidayOnly 必须是布尔值或寒暑假名称');
  if(e.storyScope!==undefined&&!['run','cadre','relationship','candidate','campus'].includes(e.storyScope))errors.push('storyScope 无效');
  if(e.gender!==undefined&&!['male','female'].includes(e.gender))errors.push('gender 无效');
  if(e.taskContext!==undefined&&!['application','collaboration','expression','materials'].includes(e.taskContext))errors.push('taskContext 无效');
  if(e.recentExercise!==undefined&&typeof e.recentExercise!=='boolean')errors.push('recentExercise 必须是布尔值');
  if(e.policyBand!==undefined&&!['near','leading'].includes(e.policyBand))errors.push('policyBand 无效');
  for(const [low,high] of [['minSem','maxSem'],['minIntimacy','maxIntimacy'],['minGrade','maxGrade']])if(e[low]!==undefined&&e[high]!==undefined&&e[low]>e[high])errors.push(`${low} 不得高于 ${high}`);
  return errors;
}
