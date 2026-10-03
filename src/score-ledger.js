import {academicYear} from './calendar.js';

export const CADRE_POINTS={'class-leader':3,'class-study':2,'class-life':2,'class-culture':2,'year-leader':4,'year-study':3,'year-culture':3,'union-study':2,'union-culture':2,'union-service':2,'union-head':4,'union-president':6};
export const CADRE_NAMES={'class-leader':'班长','class-study':'学习委员','class-life':'生活委员','class-culture':'文体委员','year-leader':'年级负责人','year-study':'年级学业负责人','year-culture':'年级文体负责人','union-study':'学生会学业部干事','union-culture':'学生会文体部干事','union-service':'学生会生活服务部干事','union-head':'学生会部门负责人','union-president':'学生会负责人'};
export const AWARD_POINTS={campus:[3,2,1],province:[6,4,2],national:[10,7,4]};
export const CERTIFICATE_POINTS={'英语证书':1,'普通话证书':1,'财会证书':2};
export const CREDIT_CAPS={service:5,organization:6,certificate:6,competition:20,cadre:8};
const tenth=n=>Math.round(n*10)/10;
export const scoreYear=sem=>Math.floor(sem/2);
export function initializeCredits(s){s.creditLedger??=[];s.programs??=[];s.creditRevision??=2;}
export function yearScore(s,year=academicYear(s)){
  return tenth(Math.min(100,(s.creditLedger||[]).filter(x=>x.year===year).reduce((n,x)=>n+x.points,0)));
}
export function lifetimeCredits(s){return tenth((s.creditLedger||[]).reduce((n,x)=>n+x.points,0));}
export function awardCredit(s,{key,category,points,label,year=academicYear(s),family=null}){
  initializeCredits(s);if(s.sem>=14||!key||!CREDIT_CAPS[category]||!Number.isFinite(points)||points<=0)return 0;
  if(s.creditLedger.some(x=>x.key===key))return 0;
  const previous=family?s.creditLedger.filter(x=>x.family===family).reduce((n,x)=>n+x.points,0):0;
  const used=s.creditLedger.filter(x=>x.year===year&&x.category===category).reduce((n,x)=>n+x.points,0);
  const gain=tenth(Math.max(0,Math.min(points-previous,CREDIT_CAPS[category]-used,100-yearScore(s,year))));
  // Zero rows also consume the claim, so a capped certificate cannot be replayed next year.
  s.creditLedger.push({key,category,points:gain,requestedPoints:points,label,year,sem:s.sem,family});return gain;
}
export function settleCadreCredits(s,{through=s.sem,exit=false}={}){
  initializeCredits(s);let total=0;
  for(const post of s.cadreHistory||[]){
    if(post.creditSettled||!CADRE_POINTS[post.role])continue;
    const current=s.cadre?.role===post.role&&s.cadre.startSem===post.startSem?s.cadre:post;
    if(!exit&&through<(post.endSem??post.startSem+2))continue;
    if(exit&&current!==s.cadre)continue;
    const duration=Math.max(0,Math.min(2,through-post.startSem))/2;
    const tasks=current.tasks||0,performance=current.performance||0;
    const fulfillment=tasks===0?0:tasks<3?.5:performance<0?.5:1;
    const points=tenth(CADRE_POINTS[post.role]*duration*fulfillment);
    const year=post.startSem>=8?(s.graduateStartYear??4)+Math.floor((post.startSem-8)/2):scoreYear(post.startSem);
    const gained=awardCredit(s,{key:`cadre:${post.role}:${post.startSem}`,category:'cadre',points,label:`${CADRE_NAMES[post.role]} · 任期履职${tasks}次${exit?'（提前交接）':''}`,year});total+=gained;
    Object.assign(post,{...current,creditSettled:true,creditPoints:gained,closedAt:through});
  }
  return total;
}
export function refreshCreditAcademics(s){
  const grad=s.sem>=8&&s.sem<14;
  const rows=(s.grades||[]).filter(g=>grad?g.sem>=8&&g.sem<14:g.sem<8);
  const years=new Set(rows.map(g=>g.sem>=8?(s.graduateStartYear??4)+Math.floor((g.sem-8)/2):scoreYear(g.sem)));
  if(s.sem<14)years.add(academicYear(s));
  for(const g of s.grades||[])g.comp=yearScore(s,g.sem>=8?(s.graduateStartYear??4)+Math.floor((g.sem-8)/2):scoreYear(g.sem));
  s.comp=tenth([...years].reduce((n,y)=>n+yearScore(s,y),0)/(years.size||1));
}
export function migrateCredits(s,{events=[]}={}){
  if(s.creditRevision===2&&Array.isArray(s.creditLedger))return;
  if(s.creditRevision===1&&Array.isArray(s.creditLedger)){
    const old=s.creditLedger;s.creditLedger=[];const sem=s.sem;
    const oldRoles={'class-leader':6,'class-study':4,'class-life':4,'class-culture':4,'year-leader':10,'year-study':6,'year-culture':6,'union-study':4,'union-culture':4,'union-service':4,'union-head':10,'union-president':15};
    for(const row of old){
      s.sem=row.sem??sem;let points=0;
      if(row.category==='certificate')points=CERTIFICATE_POINTS[row.key?.replace('certificate:','')]||0;
      if(row.category==='competition'){
        const p=s.programs?.find(p=>p.id===row.key),level=p?.type||(/全国/.test(row.label)?'national':/省级/.test(row.label)?'province':'campus');
        const rank=p?.rank||(/一等奖/.test(row.label)?1:/二等奖/.test(row.label)?2:3);points=AWARD_POINTS[level]?.[rank-1]||1;
      }
      if(row.category==='cadre'){const role=row.key.split(':')[1];points=tenth(row.points/(oldRoles[role]||1)*(CADRE_POINTS[role]||0));}
      if(['service','organization'].includes(row.category)){
        const id=row.key?.split(':')[1],credit=events.find(e=>e.id===id)?.choices.find(c=>c.credit)?.credit;
        points=credit?.points??tenth(row.points*.5);
      }
      if(row.points===0||points===0)s.creditLedger.push({...row,points:0,requestedPoints:points});
      else awardCredit(s,{...row,points});
    }
    s.sem=sem;s.creditRevision=2;
    for(const p of s.programs||[])if(p.status==='settled')p.credit=s.creditLedger.find(x=>x.key===p.id)?.points??(p.credit>0?s.creditLedger.find(x=>x.key==='certificate:'+({english:'英语证书',mandarin:'普通话证书',accounting:'财会证书'}[p.type]))?.points||0:0);
    for(const post of s.cadreHistory||[])if(post.creditSettled)post.creditPoints=s.creditLedger.find(x=>x.key===`cadre:${post.role}:${post.startSem}`)?.points||0;
    for(const cohort of Object.values(s.peers||{}))for(const peer of cohort)delete peer.creditYears;
    s.notifications??=[];s.notifications.push({title:'综测规则已更新',text:'成果与任职记录保留，综测按新的小额加分规则重算。历史日志保留当时的记录，当前分数以综测明细为准；已确定的录取、录用与结局保留。'});
    refreshCreditAcademics(s);return;
  }
  s.creditLedger=[];s.programs??=[];s.creditRevision=2;
  const sem=s.sem;
  for(const h of s.history||[]){
    if(h.sem>=14)continue;s.sem=h.sem;
    if(CERTIFICATE_POINTS[h.tag])awardCredit(s,{key:'certificate:'+h.tag,category:'certificate',points:CERTIFICATE_POINTS[h.tag],label:h.tag+'（旧档已确认）'});
    if(h.tag==='竞赛获奖')awardCredit(s,{key:`legacy-award:${h.sem}:${h.detail||''}`,category:'competition',points:1,label:'已确认竞赛奖项（旧档未记录级别，按校级三等奖折算）'});
  }
  s.sem=sem;settleCadreCredits(s);refreshCreditAcademics(s);
}
