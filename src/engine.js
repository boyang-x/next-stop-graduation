import {PUBLIC_POSTS,publicPostOf,publicEligibility,publicFit} from './career-content.js';
import {recruitBatch} from './recruitment.js';
import {academicMonth,academicYear,vacationMonths,vacationAt,monthLabel} from './calendar.js';
import {matchesEventConditions} from './event-conditions.js';
import {personalityOf, PERSONALITIES, energyMax, energyPercent, changeEnergy, roundState} from './personality.js';
import { buildPaper, sectionScores, weightedExamScore, jobPaperScore } from './exam-rules.js';
import { INITIAL_BALANCE, MONTHLY_ALLOWANCE, internshipTerms } from './economy.js';
import { learningFactor, exertionAvailable, recoveryNeeded } from './wellbeing.js';
import { describeRun } from './run-summary.js';
import { SCHOOLS, MAJORS, EVENTS, JOBS, QUESTIONS, PEOPLE, TAGS, FOCUSES } from './content.js';
import { drawPrize, ticketOf } from './lottery.js';
import { CADRE_ROLES, cadreRole, cadreAvailable, initializeLife, normalizeRelationship, changeIntimacy, recordRoutine, routinePresent, importantExperiences, canonicalTag, monthlyBudget, policyResult } from './life-rules.js';
export { importantExperiences } from './life-rules.js';
import { scopeKey, clearQueuedFlags, eventExposureKey, initializeStory, scopedEligible, flagsFor, queueFollowUp, pruneStories, nextFollowUp, rememberChoice, prepareStoryEvent, markEventShown } from './story.js';

import {CADRE_POINTS,initializeCredits,migrateCredits,yearScore,lifetimeCredits,awardCredit,settleCadreCredits,refreshCreditAcademics} from './score-ledger.js';
import {applyExercise,workloadCost,naturalMood,changeMood} from './balance-rules.js';
import {registerProgram,programAvailable,programAction,nextProgramCard,nextCompetitionUpgrade} from './participation.js';
import {graduationCatCard,finishCatGraduation,currentCatPhoto} from './campus-cat.js';
import {submitProjectApplication,projectApplicationCard} from './project-application.js';
export const SAVE_VERSION = 6;
export const MONTH_UNITS = 4;
const graduateEventIds=new Set(EVENTS.filter(e=>e.group==='graduate').map(e=>e.id));
import { AFTERNOON_ACTIVITIES, activitiesFor } from './activities.js';
import { studyGain, coCurricularScore, combinedScore, aggregateAcademics, semesterGrade, outstandingCourses, degreeCourses, recordAcademicFailure, repairAcademicCourse } from './academics.js';
export { activitiesFor } from './activities.js';
export const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
export function random(s) { let x=s.rng|0; x^=x<<13; x^=x>>>17; x^=x<<5; s.rng=x>>>0; return s.rng/4294967296; }
const sample = (s, xs) => xs[Math.floor(random(s)*xs.length)];
export const schoolOf = s => SCHOOLS.find(x=>x.id===s.school);
export const hasTag = (s, tag) => tag==='共同回忆' ? routinePresent(s,tag) : routinePresent(s,tag)||s.history.some(x=>canonicalTag(x.tag)===canonicalTag(tag));
export const isGrad = s => s.sem>=8 && s.sem<14;
export const isGap = s => s.sem>=14;
export const stageName = s => isGap(s)?'二战备考年':isGrad(s)?`研${['一','二','三'][Math.floor((s.sem-8)/2)]} · ${s.sem%2?'下':'上'}学期`:`大${['一','二','三','四'][Math.floor(s.sem/2)]} · ${s.sem%2?'下':'上'}学期`;
export const dateName = s => s.freeTime?.holiday?(s.freeTime.holiday==='寒假'?'寒假 · 一月—二月':'暑假 · 七月—八月'):`${stageName(s)} · ${s.sem%2?['二月','三月','四月','五月','六月','期末'][s.month]:['九月','十月','十一月','十二月','一月','期末'][s.month]}${s.month<5?' · 第'+((s.week||0)+1)+'周':''}`;
export function addHistory(s, tag, detail='') {
  if (!TAGS[tag]) throw new Error('Unknown tag: '+tag);
  const unlocks=s.routineUnlocks?.length||0;if(recordRoutine(s,tag,detail)){if((s.routineUnlocks?.length||0)>unlocks)log(s,'习惯与准备',s.routineUnlocks.at(-1).note,'unlock');return;}tag=canonicalTag(tag);
  if (!s.history.some(x=>x.tag===tag && x.sem===s.sem && x.detail===detail)) s.history.push({tag,detail,sem:s.sem,time:s.freeTime?.holiday||stageName(s)});
}
export function log(s,title,text,kind='event',details={}) { s.log.push({title,text,kind,time:dateName(s),...details}); }
export function applyEffects(s,effects={}) {
  initializeLife(s);const initialFactor=learningFactor(s),trait=personalityOf(s);
  if(effects.intimacy)changeIntimacy(s,effects.intimacy,{contact:true});
  if(effects.tags?.includes('共同回忆')&&effects.intimacy===undefined)changeIntimacy(s,3,{contact:true});
  if(effects.study>0)s.termBehavior.studyActions++;
  if(effects.absence>0)s.termBehavior.missed+=effects.absence;
  if(effects.energy)changeEnergy(s,workloadCost(s,effects.energy));
  if(effects.exercise)applyExercise(s);
  if(effects.mood)changeMood(s,effects.mood);
  if(effects.charm)s.charm=roundState(clamp(s.charm+effects.charm));
  if (effects.balance) s.balance=Math.max(0,Math.round(s.balance+effects.balance));
  if (effects.study) {const factor=effects.study>0?initialFactor*trait.study:1;s.study=Math.max(-12,s.study+studyGain(s.study,effects.study*factor));}
  if (effects.activity) s.activity=clamp(s.activity+effects.activity*(effects.activity>0?trait.activity:1),0,20);
  for (const tag of effects.tags||[]) if(tag!=='共同回忆'||s.relationship)addHistory(s,tag,tag==='共同回忆' ? s.relationship.person.name : '');
}
export function createGame(config={}, seed=Date.now()) {
  const school=SCHOOLS.find(x=>x.id===config.school)||SCHOOLS[0];
  const major=school.majors.includes(config.major)?config.major:school.majors[0];
  const trait=PERSONALITIES.find(x=>x.id===config.personality)||PERSONALITIES[0];
  const gender=config.gender==='female'?'female':'male';
  const s={version:SAVE_VERSION,gender,romancePreference:gender==='female'?'male':'female',eventSlot:0,peers:{},freeTime:null,lotteryTransactions:[],quizHistory:[],name:String(config.name||'新同学').trim().slice(0,16)||'新同学',school:school.id,originSchool:school.id,major,personality:trait.id,charm:trait.charm,
    sem:0,month:0,phase:'start',rng:(Number(seed)>>>0)||1234567,balance:INITIAL_BALANCE,energy:roundState(trait.energyMax*.8),mood:65,grade:78,gpa:78,comp:0,combined:62.4,rank:150,combinedRank:170,cohort:300,study:0,activity:0,grades:[],history:[],log:[],seen:{},hooks:{},relationship:null,candidate:null,romances:[],focus:'study',route:'undecided',target:null,attempt:1,admission:null,examScore:null,selectedJobs:[],jobResults:[],selectedOffer:null,quiz:null,card:null,feedback:null,ending:null,deferred:null,notices:[],sequence:0};
  initializeLife(s);initializeCredits(s);s.notifications=[];updateRanks(s);
  log(s,'录取通知书',`你成为了${school.name}${MAJORS[major].name}专业的新生。特质：${trait.name}。每月家里提供 ¥${MONTHLY_ALLOWANCE} 生活费。`,'notice');
  ensureCard(s); return s;
}
export function peerCreditScore(peer,s){
  const current=Math.floor((s.sem>=8&&s.sem<14?s.sem-8:Math.min(7,s.sem))/2),month=s.sem%2?5+s.month:s.month;
  peer.creditYears??={};let sum=0;
  for(let year=0;year<=current;year++){
    if(!peer.creditYears[year]){
      const seed=Math.round((peer.activity||0)*100000)+(Math.round(peer.grade*100)||0);
      const roll=k=>{let n=Math.imul(seed^(year*7919+k*104729),1597334677)>>>0;n^=n>>>16;return (n>>>0)/4294967296;};
      const rows=[];
      for(let i=0;i<4;i++)if(roll(i)<.35)rows.push({category:'service',points:1,month:2+i*2});
      if(roll(5)<.38)rows.push({category:'certificate',points:1,month:4});
      if(roll(6)<.28)rows.push({category:'cadre',points:year>=2&&roll(7)<.12?6:year>=1&&roll(7)<.3?4:roll(7)<.5?3:2,month:10});
      if(roll(8)<.24)rows.push({category:'competition',points:roll(9)<.08?6:roll(9)<.3?3:1,month:8});
      peer.creditYears[year]=rows;
    }
    sum+=Math.min(100,peer.creditYears[year].filter(x=>year<current||x.month<=month).reduce((n,x)=>n+x.points,0));
  }
  return roundState(sum/(current+1));
}
export function nextCandidateEvent(s){
  const pool=EVENTS.filter(e=>e.storyScope==='candidate'&&!e.followOnly&&eventEligible(s,e));
  // An exhausted pool can remain a friendship. Do not replay a confession card.
  return pool.length?sample(s,pool):{id:'candidate-checkin',kind:'choice',group:'romance',category:'social',storyScope:'candidate',title:'按现在的关系，重新安排联系',text:'你们已经相处过一段时间。最近的熟悉、信任和好感仍然保留，现在可以具体安排下一次联系，也可以明确关系方向。',choices:[
    {text:'约一次免费散步，聊各自最近的新变化',effects:{energy:-5,mood:2},candidateDelta:{familiarity:2,trust:2},result:'这次相处围绕各自最近的变化展开，你没有重复催促对方确认关系。'},
    {text:'认真表达好感，接受对方自己的选择',effects:{energy:-4},probability:{base:.4,candidate:.003,charm:.001,mood:.001},success:{text:'对方愿意认真发展这段关系，你们开始交往。',action:'date'},failure:{text:'对方希望保持朋友关系，你接受了这个回答。',action:'clearCandidate'}},
    {text:'说明希望保持普通朋友，不再继续发展恋爱',effects:{mood:1},action:'clearCandidate',result:'你们明确了相处方向，各自继续自己的生活。'},
  ]};
}
export function arriveEvent(s,e){
  if(!e.arrivalEffects)return;
  s.arrivals??={};const key=(e.storyScope==='relationship'?s.relationship?.id:'run')+':'+e.id;
  if(s.arrivals[key])return;s.arrivals[key]=true;
  // Fitness reduces the cost of chosen workloads, not an accident's actual loss.
  const {energy,...otherEffects}=e.arrivalEffects;
  if(energy)changeEnergy(s,energy);applyEffects(s,otherEffects);
  log(s,e.title+' · 突发变化',e.text,'event',{effects:e.arrivalEffects});
  if(e.severity!=='relationship'){s.incidents??=[];s.incidents.push({id:e.id,sem:s.sem,severity:e.severity,clock:s.eventClock});s.lastIncidentClock=s.eventClock;}
  if(e.id==='incident-sprain'||e.id==='incident-cold')s.exercisePauseUntil=s.eventClock+3;
}
function normal(s) { return Math.sqrt(-2*Math.log(Math.max(.000001,random(s))))*Math.cos(2*Math.PI*random(s)); }
export function updateRanks(s) {
  s.peers??={};const key=`${s.school}-${isGrad(s)?'grad':'under'}`;
  if(!s.peers[key])s.peers[key]=Array.from({length:s.cohort-1},()=>({grade:clamp(schoolOf(s).cohortMean+(isGrad(s)?1:0)+normal(s)*5.5),activity:random(s)*16}));
  const peers=s.peers[key];const peerGrades=peers.map((p,i)=>clamp(p.grade+Math.sin(i+s.sem)*.6));
  s.rank=1+peerGrades.filter(x=>x>s.gpa).length;
  refreshCreditAcademics(s);s.combined=combinedScore(s.gpa,s.comp);
  s.combinedRank=1+peerGrades.filter((x,i)=>combinedScore(x,coCurricularScore(peerCreditScore(peers[i],s)))>s.combined).length;
}
export function migrateSave(raw){
  if(!raw||![4,5,SAVE_VERSION].includes(raw.version)||!PERSONALITIES.some(p=>p.id===raw.personality)||!SCHOOLS.some(x=>x.id===raw.school)||!MAJORS[raw.major]||!Array.isArray(raw.history)||!Array.isArray(raw.log))return null;
  const s=structuredClone(raw);s.romancePreference=s.gender==='female'?'male':'female';if(s.candidate?.gender!==s.romancePreference)s.candidate=null;migrateCredits(s,{events:EVENTS});initializeLife(s);initializeStory(s);s.version=SAVE_VERSION;s.notifications??=[];
  s.monthlyFreeDone??={};for(const key of Object.keys(s.hooks))if(key.startsWith('weekend-')&&s.hooks[key])s.monthlyFreeDone[key.slice(8)]=true;
  if(s.notification){s.notifications.push(s.notification);delete s.notification;}
  const migrationRng=s.rng;updateRanks(s);s.rng=migrationRng;
  // Unresolved cards store a copy of authored content. Refresh that copy without
  // replaying a choice, consuming RNG, or overwriting queue/runtime markers.
  const refresh=card=>{
    if(card?.kind!=='choice')return card;
    const source=EVENTS.find(e=>e.id===card.id);if(!source)return card;
    const current=prepareStoryEvent(s,source,{repeatContext:false});
    return {...card,title:current.title,text:current.text,choices:current.choices};
  };
  if(!s.feedback)s.card=refresh(s.card);
  if(s.freeTime?.returnCard)s.freeTime.returnCard=refresh(s.freeTime.returnCard);
  return s;
}
export function setIdentity(s,gender){if(!['male','female'].includes(gender))return false;s.gender=gender;s.romancePreference=gender==='female'?'male':'female';return true;}
export function probability(s,p) {
  if (typeof p==='number') return {value:clamp(p,0,1),reasons:[]};
  let value=p.base, reasons=[];
  for (const [tag,bonus] of Object.entries(p.tags||{})) {
    const applies=hasTag(s,tag);
    if(applies){value+=bonus;reasons.push(`${canonicalTag(tag)}：成功概率 +${roundState(bonus*100)} 个百分点`);}
  }
  const energyWeight=p.energy??(['study','project','work'].includes(s.card?.category)?.0008:0);
  const moodWeight=p.mood??(s.card?.category==='social'?.001:0);
  if(energyWeight){const delta=(energyPercent(s)-50)*energyWeight;value+=delta;if(Math.abs(delta)>.005)reasons.push(`精力状态：成功概率 ${delta>=0?'+':''}${roundState(delta*100)} 个百分点`);}
  if(moodWeight){const delta=(s.mood-50)*moodWeight;value+=delta;if(Math.abs(delta)>.005)reasons.push(`心情状态：成功概率 ${delta>=0?'+':''}${roundState(delta*100)} 个百分点`);}
  if(p.grade){const delta=(s.gpa-75)*p.grade;value+=delta;if(Math.abs(delta)>.005)reasons.push(`学业准备：成功概率 ${delta>=0?'+':''}${roundState(delta*100)} 个百分点`);}
  if(p.candidate&&s.candidate){const valueDelta=((s.candidate.familiarity??20)+(s.candidate.trust??50)+(s.candidate.interest??40)-110)*p.candidate;value+=valueDelta;reasons.push('相处积累：成功概率 '+Math.round(valueDelta*100)+' 个百分点');}
  const charmWeight=p.charm??(s.card?.category==='social'||s.card?.group==='romance'?.002:0);
  if(charmWeight){const delta=(s.charm-50)*charmWeight;value+=delta;if(Math.abs(delta)>.0001)reasons.push(`魅力：成功概率 ${delta>=0?'+':''}${roundState(delta*100)} 个百分点`);}
  if(p.reasons)reasons.push(...p.reasons);
  return {value:clamp(value,.05,.95),reasons};
}
export function eventEligible(s,e,follow=false) {
  initializeStory(s);if(!scopedEligible(s,e,follow))return false;
  initializeLife(s);
  if(!matchesEventConditions(s,e,{hasTag,energyPercent}))return false;
  if(!follow&&!e.storyScope&&s.seen[e.id]!==undefined)return false;
  if(!follow&&s.recentEvents?.includes(eventExposureKey(s,e)))return false;
  if(!follow&&!e.choices.some(c=>choiceAvailable(s,c,e).ok))return false;
  if(s.month<5&&!e.choices.some(c=>actionDuration({...e,consume:true},c,s)<=20-s.month*4-(s.week||0)))return false;
  if(isGap(s) && ['school','graduate'].includes(e.group))return false;
  if(e.severity&&e.severity!=='relationship'&&!follow){const incidents=s.incidents||[];if(s.eventClock-(s.lastIncidentClock??-10)<5||incidents.filter(x=>x.sem===s.sem).length>=2||e.severity==='severe'&&incidents.some(x=>x.sem===s.sem&&x.severity==='severe'))return false;}
  if(e.topic&&!follow&&s.eventClock-(s.topicSeen?.[scopeKey(s,e.storyScope||'run')+':'+e.topic]??-10)<3)return false;
  return true;
}
export function drawEvent(s) {
  initializeStory(s);const follow=nextFollowUp(s,eventEligible);if(follow)return follow;
  let candidates=EVENTS.filter(e=>eventEligible(s,e));
  const incidents=candidates.filter(e=>e.severity&&e.severity!=='relationship');
  if(incidents.length&&random(s)<.11)return sample(s,incidents);
  candidates=candidates.filter(e=>!e.severity||e.severity==='relationship');
  const pick=(xs,weight)=>{let roll=random(s)*xs.reduce((n,e)=>n+weight(e),0);for(const e of xs){roll-=weight(e);if(roll<=0)return e;}return xs.at(-1);};
  const eventWeight=e=>(s.scopedSeen?.[(s.relationship?.id||s.candidate?.meetingId||'run')+':'+e.id]===undefined?2:1)*(e.weight||1)*(['school','major'].includes(e.group)?1.35:1)*(isGrad(s)?e.group==='graduate'?2.4:e.group==='common'?.65:1:1)*(e.group==='romance'?(s.school==='normal'?1.25:1):1);
  if(s.relationship){const romance=candidates.filter(e=>e.group==='romance');const silence=s.eventClock-(s.lastRomanceEvent??s.eventClock);
    const chance=.29+(s.focus==='social'?.04:s.focus==='study'?-.01:0)+(silence>=5?.08:0);
    if(romance.length&&random(s)<chance)return pick(romance,eventWeight);
    candidates=candidates.filter(e=>e.group!=='romance');
  }
  if(!candidates.length)return {id:'fallback',group:'common',category:'life',duration:1,title:isGap(s)?'一段普通的备考日常':'期末之前的一段空档',text:isGap(s)?'复习、饭点和晚风组成了这一段生活。':'本阶段较长的安排已经结束，期末前还有一小段时间。',choices:[{text:'复习基础内容',duration:1,effects:{study:4,energy:-7},result:'学习准备留在这一阶段。'},{text:'恢复状态',duration:1,effects:{energy:14,mood:8},result:'你找回了自己的节奏。'},{text:'不给这段时间安排任务',duration:1,effects:{},freeTimeGain:1,result:'你留出了一段空闲。'}]};
  const categoryWeights=isGrad(s)?{study:30,project:35,work:10,social:15,life:10}:{study:24,project:19,work:15,social:23,life:19};const focus=s.focus==='rest'?'life':s.focus;categoryWeights[focus]*=1.65;
  if(energyPercent(s)<35||s.mood<35)categoryWeights.life*=1.6;if(s.balance<600)categoryWeights.work*=1.4;
  const cats=Object.keys(categoryWeights).filter(cat=>candidates.some(e=>(e.category||'life')===cat));
  const cat=pick(cats,c=>categoryWeights[c]);return pick(candidates.filter(e=>(e.category||'life')===cat),eventWeight);
}
function graduateChainDuration(card,choice,visited=new Set()){
 const own=actionDuration({...card,consume:true},choice),id=choice.followUp?.id;
 if(!id||visited.has(id))return own;
 const next=EVENTS.find(e=>e.id===id);if(next?.group!=='graduate')return own;
 const path=new Set([...visited,id]);
 const continuing=next.choices.filter(c=>graduateEventIds.has(c.followUp?.id));
 return Math.max(own,choice.followUp.afterWeeks||0)+Math.min(...(continuing.length?continuing:next.choices).map(c=>graduateChainDuration(next,c,path)));
}
export function choiceAvailable(s,c,card=s.card) {
  if(card?.consume&&s.month<5&&actionDuration(card,c,s)>20-s.month*4-(s.week||0))return {ok:false,reason:'本学期剩余时间不足以完成这段安排'};
  if(card?.consume&&card.group==='graduate'&&graduateEventIds.has(c.followUp?.id)&&graduateChainDuration(card,c)>280-(s.sem*20+s.month*4+(s.week||0)))return {ok:false,reason:'毕业前剩余日程不足以完成这条后续，可选择本轮暂不开始'};
  if(c.action?.startsWith('publicTarget:')){const post=PUBLIC_POSTS.find(p=>p.id===c.action.split(':')[1]);if(!post)return {ok:false,reason:'岗位不存在'};const eligible=publicEligibility(s,post,hasTag);if(!eligible.ok)return eligible;}
  if((c.action?.startsWith('program:')||c.action?.startsWith('programUpgrade:'))&&!programAvailable(s,c.action.split(':')[1]))return {ok:false,reason:'已有同类考试或赛事等待结果'};
  const exertion=exertionAvailable(s,c.effects,!card?.consume);if(!exertion.ok)return exertion;
  const flags=flagsFor(s,card?.storyScope||'run');if(c.requiresFlags?.some(f=>!flags[f]))return {ok:false,reason:'需要之前建立的协作关系'};
  if(c.onceKey&&s.hooks[c.onceKey.startsWith('term:')?c.onceKey+'-'+s.sem:c.onceKey])return {ok:false,reason:'本学期已使用这类应急支持'};
  if(c.minBalance&&s.balance<c.minBalance)return {ok:false,reason:'余额不足'};
  if(c.effects?.balance<0&&s.balance< -c.effects.balance)return {ok:false,reason:`需要 ¥${-c.effects.balance}，余额不足`};
  if(c.action==='sellUnused'&&s.inventory?.unusedBook===false)return {ok:false,reason:'已经卖出这件闲置物品'};
  if(c.requiresAllTags?.some(t=>!hasTag(s,t)))return {ok:false,reason:`需要经历：${c.requiresAllTags.map(canonicalTag).join('、')}`};
  if(c.requiresAnyTags?.length&&!c.requiresAnyTags.some(t=>hasTag(s,t)))return {ok:false,reason:'需要相关经历才能选择'};
  return {ok:true,reason:''};
}
function notice(s,title,text,action=null) {log(s,title,text,'notice');if(action)s.notices.push({id:`notice-${++s.sequence}`,kind:'notice',title,text,action});else {s.notifications??=[];const last=s.notifications.at(-1);if(last?.title==='本月生活账单'&&title===last.title)last.text+='\n'+text;else s.notifications.push({title,text});}}
function hook(s,key,fn) {if(s.hooks[key])return false;s.hooks[key]=true;fn();return true;}
const fixed=(s,id,title,text,choices)=>s.card={id,kind:'choice',group:'milestone',title,text,choices,consume:false};
function startSemester(s) {
  s.study=s.holidayStudy||0;s.holidayStudy=0;s.activity=0;s.eventSlot=0;s.week=0;s.weekendDue=false;s.phase='events';s.termBehavior={studyActions:0,missed:0};initializeLife(s);
  const income=MONTHLY_ALLOWANCE;
  settleMonth(s);
  notice(s,'新学期开始',`${stageName(s)}。本月支持 ¥${income.toLocaleString()}，必要开销 ¥${monthlyBudget(s).cost.toLocaleString()}。收入与开销已一起结算。你可以重新选择本学期重点，这只影响机会分布。`);
  s.card={id:`focus-${s.sem}`,kind:'focus',title:'这一学期，把精力留给什么？',text:'选择会提高相关事件出现的机会。日常上课照常进行，你仍然会遇到意外。'};
}
export function chooseFocus(s,id) {if(s.card?.kind!=='focus'||s.feedback||!FOCUSES.some(f=>f.id===id))return false;s.focus=id;s.card=null;ensureCard(s);return true;}
function committeeCard(s) {
  const previous=s.previousCadre||s.cadre;
  fixed(s,'cadre-arrange','新学年的学生工作',previous?'上一学年你担任'+cadreRole(previous.role).name+'。新一年的责任，由你重新决定。':'小班委、大班委和学生会开始招新。任期一学年，每次选择一个主要岗位。',previous?[
    {text:'申请续任'+cadreRole(previous.role).name,action:'cadreRenew',result:'你准备接受续任考核，过去的履职表现会影响结果。'},
    {text:'竞争其他学生干部岗位',action:'cadreBrowse',result:'你决定了解新的工作和要求。'},
    {text:'这一年退出任职，把时间留给自己',action:'noCommittee',freeTimeGain:1,result:'你交接了事务。曾经的任职经历仍然保留。'},
  ]:[
    {text:'报名竞选，选择具体岗位',action:'cadreBrowse',result:'你走到招新摊位前，准备选择岗位。'},
    {text:'旁听招新，帮忙布置但不任职',effects:{activity:1,energy:-3},result:'你了解了学生工作，暂时没有承担一个岗位。'},
    {text:'暂不任职，留出自己的时间',action:'noCommittee',freeTimeGain:1,result:'你保留了一个空档，也保留了自己的生活节奏。'},
  ]);
}
function cadreElection(s,id) {
  const r=cadreRole(id),previous=s.previousCadre;
  const bonus=previous?.role===id?Math.max(-.12,Math.min(.14,(previous.performance||0)*.02)):0;
  let match=0,label='';
  if(['class-study','year-study','union-study'].includes(id)){match=s.grades.length?clamp((s.gpa-75)*.003,-.04,.09):hasTag(s,'规律复习')?.04:0;label='学业准备';}
  else if(id.includes('culture')){match=hasTag(s,'校园活动')?.07:s.activity>=2?.03:0;label='文体活动经历';}
  else if(id==='class-life'||id==='union-service'){match=hasTag(s,'志愿服务')?.06:0;label='服务经历';}
  const reasons=[];if(match)reasons.push(`${label}：成功概率 ${match>0?'+':''}${roundState(match*100)} 个百分点`);if(bonus)reasons.push(`上一学年履职：成功概率 ${bonus>0?'+':''}${roundState(bonus*100)} 个百分点`);
  const p={base:r.chance+bonus+match,tags:{学生干部经历:.08,校园活动:.04},mood:.0005,charm:.002,reasons};
  const outcome=(win,text)=>({text,effects:win?{activity:.5,mood:3,charm:.5}:{mood:-2},action:win?'cadreElected:'+id:'cadreDefeated'});
  fixed(s,'cadre-election','竞选'+r.name,'工作内容：'+r.duty+'。任期一学年，合格履职结算综测'+CADRE_POINTS[id]+'分；至少完成3次事务且表现合格可获全额，履职不足或提前退出按情况折算，不因刚当选就加全年分。你准备如何介绍自己？',[
    {text:'提出一份具体可执行的工作方案',effects:{energy:-7},probability:p,success:outcome(true,'你的安排清楚可行，你当选了'+r.name+'。'),failure:outcome(false,'这次投票中，其他候选人获得了更多支持，你没有当选。')},
    {text:'和同学商量，从大家的实际需求出发',effects:{energy:-5},probability:{...p,base:p.base-.02,tags:{学生干部经历:.08,校园活动:.10}},success:outcome(true,'同学认可了你的沟通方式，你当选了'+r.name+'。'),failure:outcome(false,'这次名额有限，你没有当选。')},
    {text:'退出这次竞选，暂不承担岗位',action:'noCommittee',result:'你尊重自己的时间安排，没有勉强承担任职。'},
  ]);
}
export function selectCadre(s,id) {
  if(s.card?.kind!=='cadre'||s.feedback)return false;
  if(id==='none'){s.card=null;s.cadre=null;s.previousCadre=null;s.committee=false;ensureCard(s);return true;}
  const r=cadreRole(id);if(!r||!cadreAvailable(s,r).ok)return false;
  s.card=null;cadreElection(s,id);return true;
}
function qualification(s) {
  initializeLife(s);s.policy.published=true;
  const result=policyResult(s);s.eligible=result.eligible;s.policy.result={...result,sem:s.sem};
  addHistory(s,s.eligible?'保研资格':'保研落选');
  notice(s,'推免资格公布',(s.eligible?'你获得了游戏中的校内推免资格，可以选择提供范围内的院校，确认推免录取。':'你未获得校内推免资格，可以选择考研、就业或考公。')+'本局规则：'+s.policy.metricName+'前 '+s.policy.places+' 名，累计成绩至少 '+s.policy.minGpa+' 分，无未完成的课程补救。当前第 '+result.rank+' 名，成绩 '+s.gpa+' 分。');
}
function routeCard(s) {
  const choices=[];
  if(s.eligible)choices.push({text:'选择保研，确定目标院校',effects:{},action:'recommend',result:'进入推免择校。'});
  choices.push({text:'准备考研，选择目标院校',effects:{tags:['备考经验']},action:'exam',result:'你选择了考研方向。'},
    {text:'本科毕业直接工作',effects:{tags:['求职经历']},action:'work',result:'招聘市场将对你开放。'},
    {text:'准备考公',effects:{tags:['备考经验']},action:'civil',result:'你进入考公准备方向。'});
  fixed(s,'route','毕业方向的选择','升学、就业或考公，各有不同的准备。从现在开始，你想主要投入哪个方向？',choices);
}
function examFallback(s) {
  if(s.attempt>=2){finish(s,'二战之后','第二次考研仍未录取。你走到了这段备考人生的终点。');return;}
  fixed(s,'exam-fallback','考研结果：这次未录取','努力留下了经历，但这次结果未达到录取条件。接下来由你决定。',[
    {text:'再准备一年，二战',effects:{tags:['二战经历']},action:'retry',result:'你决定给自己第二次机会。'},
    {text:'转向就业',effects:{tags:['求职经历']},action:'workNow',result:'你打开了当前可投递的岗位。'},
    {text:'结束本局，查看总结',effects:{},action:'endExam',result:'这一段人生在这里收尾。'},
  ]);
}
function endSemester(s) {
  if(isGap(s)){
    notice(s,'备考阶段播报','你完成了这一阶段的准备。本科成绩档案保持不变，备考经历继续用于第二次考试。');
    if(s.sem===15){finish(s,'二战之后','这段备考生活结束了。');return;}
    s.sem++;s.month=0;s.phase='start';return;
  }
  const grade=semesterGrade(s,random(s));
  s.neglectStreak=(s.termBehavior.missed>0&&s.termBehavior.studyActions<2)?(s.neglectStreak||0)+1:0;
  if(s.sem%2===1){const gained=settleCadreCredits(s,{through:s.sem+1});if(gained)notice(s,'任期综测结算','完成本学年履职，本学年综测 +'+gained+' 分。');}
  const comp=yearScore(s);
  s.grade=Number(grade.toFixed(1));
  s.grades.push({sem:s.sem,grade:s.grade,comp:Number(comp.toFixed(1))});
  const degreeGrades=s.grades.filter(g=>(isGrad(s)?g.sem>=8&&g.sem<14:isGap(s)?g.sem>=14:g.sem<8));
  s.gpa=Number((degreeGrades.reduce((a,g)=>a+g.grade,0)/degreeGrades.length).toFixed(1));
  s.comp=Number((degreeGrades.reduce((a,g)=>a+g.comp,0)/degreeGrades.length).toFixed(1));
  aggregateAcademics(s);updateRanks(s);const failure=recordAcademicFailure(s);if(failure)notice(s,'学业提醒','本学期出现尚未通过的课程，毕业前需要完成补救。一次突击不能抵消长期缺课。');
  notice(s,'期末成绩公布',`本学期 ${s.grade} 分；累计 ${s.gpa} 分，成绩排名 ${s.rank}/${s.cohort}；综测 ${s.comp} 分；综合成绩 ${s.combined} 分，综合排名 ${s.combinedRank}/${s.cohort}。`);
  if(s.sem%2===1&&s.rank<=s.cohort*.15){s.balance+=1500;addHistory(s,'奖学金');notice(s,'奖学金到账','你获得了本学年奖学金 ¥1,500，每学年结算一次。');}
  if(s.sem===5&&!s.hooks.qual){s.hooks.qual=true;qualification(s);}
  if(s.sem===7 && s.admission){beginGraduation(s,'admission');return;}
  if(s.sem===7 && s.route==='exam' && s.examOutcome==='success'){s.admission={school:s.target};beginGraduation(s,'admission');return;}
  if(s.sem===13 && !s.ending){beginGraduation(s,'degree');return;}
  if(s.sem===15 && !s.ending){finish(s,'二战之后','这段备考生活结束了。');return;}
  s.sem++;s.month=0;s.phase='start';
}
function endSemesterTransition(s) {s.graduateStartYear=academicYear(s)+1;s.school=s.admission.school;s.sem=8;s.month=0;s.phase='start';s.week=0;s.weekendDue=false;s.grade=78;s.gpa=78;s.comp=0;updateRanks(s);notice(s,'研究生入学',`你考入${schoolOf(s).name}。新的阶段开始了。`);}
function remediationCard(s,course,graduation=false){
  const result={text:'补救通过，原始成绩保留在明细中，学期折算至及格水平。',action:'coursePassed'};
  const failed={text:'这次补救仍未通过。问题没有消失，之后还需要处理。',action:'courseFailed'};
  fixed(s,'course-remediation','必修课程补救',(graduation?'毕业手续需要先完成尚未通过的课程。':'此前一学期有课程未通过，老师给出了补救安排。')+'原始学期折算 '+course.original+' 分。',[
    {text:'补齐缺交内容，认真准备补救',effects:{study:3,energy:-8},probability:{base:.82,tags:{规律复习:.08},energy:.001},success:result,failure:failed},
    {text:'参加辅导，集中解决薄弱环节',effects:{balance:-180,study:4,energy:-6},probability:{base:.9,energy:.001},success:result,failure:failed},
    {text:graduation?'暂不完成补救，接受毕业暂缓':'这学期先处理其他安排',action:graduation?'deferGraduation':'courseDeferred',result:graduation?'你接受了毕业暂缓，当前去向仍以完成毕业要求为前提。':'这项问题仍会影响毕业和升学条件。'},
  ]);
  s.card.courseId=course.id;s.card.consume=!graduation;s.card.duration=Math.min(2,Math.max(1,20-s.month*4-(s.week||0)));
}
function beginGraduation(s,type){
  s.pendingFinish={type};s.graduationRetries=0;
  if(s.projectApplication?.status==='awaiting'){
    s.projectApplication.due=s.eventClock;const card=projectApplicationCard(s,EVENTS.find(e=>e.id==='incident-rejection'));
    if(card.arrivalEffects){arriveEvent(s,card);markEventShown(s,card);}s.card=card;s.phase='graduation';s.deferred='graduation-programs';return false;
  }
  if(s.programs?.some(p=>['preparing','awaiting'].includes(p.status))){s.programFinalizing=true;s.phase='graduation';s.deferred='graduation-programs';return false;}
  if(degreeCourses(s).length){s.phase='graduation';s.deferred='graduation-remediation';return false;}completeGraduation(s);return true;
}
function completeGraduation(s){
  const cat=graduationCatCard(s);if(cat){s.card=cat;s.phase='graduation';return;}
  const type=s.pendingFinish?.type;s.pendingFinish=null;
  if(type==='admission'){endSemesterTransition(s);s.route='graduate';ensureCard(s);return;}
  if(type==='retry'){closeGraduation(s);s.sem=14;s.month=0;s.week=0;s.weekendDue=false;s.eventSlot=0;s.phase='start';s.route='exam';s.attempt=2;s.target=null;s.examOutcome=null;s.deferred='target';return;}
  if(type==='offer'){closeGraduation(s);const j=s.publicOffer||JOBS.find(j=>j.id===s.selectedOffer.id);const result=s.publicOffer||s.selectedOffer;finish(s,s.publicOffer?'公共服务的新起点':'下一站，入职','你选择了'+j.city+'的'+j.company+'，职位：'+j.role+'，'+(result.rating?result.rating+' · ':'')+'游戏设定'+(result.salaryBasis||'税前年总包')+' '+result.salary+' 万元。');return;}
  closeGraduation(s);
  if(type==='no-offer')finish(s,'毕业，暂未获得 offer','本批投递已经全部出结果，未获得录用。你完成了必要课程与毕业手续。');
  else if(type==='exam-failure')finish(s,'考研之后','这次考研未被录取。你完成本科收尾，选择在这里回看这段人生。');
  else if(type==='civil-failure')finish(s,'考公之后',(s.civilFailure||'这次公共岗位选拔未获录用。')+'你完成了毕业收尾。');
  else finish(s,'毕业，继续探索','这一段校园生活结束，你暂时没有选择一份工作。');
}
function breakupCard(s) {
  const r=s.relationship;
  const end={text:'对方仍决定结束这段关系。你们认真告别，恢复单身。',effects:{tags:['分手经历'],mood:-5},action:'breakup'};
  fixed(s,'relationship-breakpoint','关系走到了岔路口',r.person.name+'说，最近的相处让自己很疲惫。你们需要认真谈一次。',[
    {text:'认真听取原因，提出具体的改变',effects:{energy:-4},probability:{base:.32,tags:{共同回忆:.12},mood:.001},success:{text:'对方愿意给这段关系一次修复的机会。承诺需要由之后的行动兑现。',action:'repairRelationship'},failure:end},
    {text:'尊重对方的决定，认真告别',effects:{tags:['分手经历'],mood:-4},action:'breakup',result:'你们结束了关系，各自重新安排生活。'},
    {text:'提出短暂冷静，约定之后再沟通',probability:{base:.25,tags:{共同回忆:.1}},success:{text:'对方同意先冷静，之后再谈。问题仍需要解决。',action:'coolRelationship'},failure:end},
  ]);
}
function livingShortfallCard(s) {
  const amount=s.unpaidLiving;
  fixed(s,'living-shortfall','这个月的生活费有点紧','必要开销还差 ¥'+amount+'。先处理这件事，再继续校园生活。',[
    {text:'申请临时生活资助',effects:{balance:amount+120,tags:['资助经历']},onceKey:'grant-'+s.sem,action:'resolveGrant',result:'你提交了情况说明，临时资助补齐开销，也留下了一点应急余额。'},
    {text:'接一份临时工作，补上缺口',effects:{balance:amount+180,energy:-14},action:'resolveLiving',result:'你用时间换来了报酬，处理了这次缺口。'},
    {text:'和家人说明情况，重新安排生活预算',effects:{balance:amount+120,mood:-2},onceKey:'family-support-'+s.sem,action:'resolveFamily',result:'家人提供了一次应急支持，你也重新核对了生活开销。'},
  ]);
}
export function ensureCard(s) {
  initializeLife(s);initializeStory(s);
  if(s.ending||s.feedback||s.card)return;
  for(const text of pruneStories(s))notice(s,'事情有了变化',text);
  if(s.notices.length){s.card=s.notices.shift();return;}
  if(s.deferred){const next=s.deferred;s.deferred=null;
    if(next==='graduation-programs'){const card=nextProgramCard(s,{random,addHistory,updateRanks,log});if(card){s.card=card;s.deferred='graduation-programs';return;}s.programFinalizing=false;s.deferred=degreeCourses(s).length?'graduation-remediation':'graduation-complete';ensureCard(s);return;}
    if(next==='newFriends'){if(s.relationship){fixed(s,'social-friends','扩大自己的朋友圈','你可以和新朋友交流兴趣，也记得尊重正在经营的关系。',[{text:'参加社团交流',effects:{energy:-4,mood:7},result:'你认识了几个有共同兴趣的朋友。'},{text:'和对象一起参加朋友聚会',effects:{balance:-50,mood:6,intimacy:3},result:'你们一起认识了新朋友。'},{text:'参加开放的运动活动',effects:{energy:-3,mood:6},result:'一场组队活动，让校园里多了几张熟悉的面孔。'}]);}else{const e=s.candidate?nextCandidateEvent(s):EVENTS.find(e=>e.id==='social-new-friends');s.card={...prepareStoryEvent(s,e),kind:'choice',consume:false};if(s.candidate)s.storyQueue=s.storyQueue.filter(q=>q.id!==e.id||q.key!==s.candidate.meetingId);}markEventShown(s,s.card);s.card.socialActivity=true;return;}

    if(next==='graduation-remediation'){const course=degreeCourses(s)[0];if(course){remediationCard(s,course,true);return;}s.deferred='graduation-complete';ensureCard(s);return;}
    if(next==='graduation-complete'){completeGraduation(s);if(!s.card&&!s.ending)ensureCard(s);return;}
    if(next==='holidayPlans'){freeCard(s);return;}
    if(next==='homeTicket'){const e=EVENTS.find(e=>e.id==='ticket-home');s.card={...prepareStoryEvent(s,e),kind:'choice',consume:false};markEventShown(s,e);return;}
    if(next==='homeScene'){const e=sample(s,EVENTS.filter(e=>e.locations?.includes('home')&&eventEligible(s,e,true)));s.card={...prepareStoryEvent(s,e),kind:'choice',consume:false,homeVisit:true};markEventShown(s,e);return;}
    if(next==='holidayInternship'){const e=EVENTS.find(e=>e.id==='internship-apply');s.card={...prepareStoryEvent(s,e),kind:'choice',consume:false};markEventShown(s,e);return;}
    if(next==='cadrePositions'){s.card={id:'cadre-positions',kind:'cadre',title:'选择这一年的岗位',text:'每个岗位有不同的职责与机会。任期一学年，同时担任一个主要岗位。'};return;}
    if(next.startsWith('cadreElection:')){cadreElection(s,next.split(':')[1]);return;}
    if(next==='fallbackExam'){examFallback(s);return;}
    if(next==='target'){s.card={id:'target',kind:'target',title:s.route==='recommend'?'选择推免目标院校':'选择考研目标院校',text:s.route==='recommend'?'你已获得推免资格。选择提供范围内的院校即可确认录取，学校会影响之后的校园生活。':'选择考研目标。院校要求不同，考试与准备共同影响录取结果。'};return;}
    if(next==='publicTargets'){fixed(s,'public-targets','选一个想去的公共岗位','国考、省考与定向选调是不同招录渠道。这局选择一个方向参加简化选拔，笔试线与面试竞争随岗位变化。',PUBLIC_POSTS.map(p=>({text:p.track+' · '+p.company+' · '+p.role,action:'publicTarget:'+p.id,result:'你选择了'+p.track+'的'+p.role+'，接下来按这个岗位准备笔试与面试。'})));s.card.publicTargets=true;return;}
    if(next==='jobs'){s.card={id:'jobs',kind:'jobs',title:'把简历投向下一站',text:'按城市和方向浏览岗位。同一批投递一起出结果，再从 offer 中选择。'};return;}
    if(next==='quiz'){s.card={id:'quiz',kind:'quiz',title:s.quiz.title,text:s.quiz.description||'答题结果会被记录；相关经历可提供一次提示。'};return;}
    if(next==='offers'){s.card={id:'offers',kind:'offers',title:'招聘结果到了',text:'这批投递已经全部结算。选择一个 offer，进入毕业尾声。'};return;}
    if(next==='jobInterview'){fixed(s,'job-interview','联合面试：用什么介绍自己？','笔试已经完成。面试官想知道，你大学里留下了什么。相关经历会影响这些回答的效果。',[
      {text:'用项目、实践或实习案例说明过程',requiresAnyTags:['软件项目','工程项目','科研经历','教育实习','商业分析','实习经历','创作经历','政策调研'],action:'interviewCase',result:'你把做过的事情和岗位要求联系了起来。'},
      {text:'用课程学习与反思说明自己的准备',action:'interviewStudy',result:'你讲清楚了自己如何学习和解决问题。'},
      {text:'讲组织活动与合作经历',requiresAnyTags:['班委经历','校园活动','志愿服务','社团骨干'],action:'interviewCampus',result:'你介绍了自己在校园中承担的角色。'},
    ]);return;}
    if(next==='jackpot'){fixed(s,'jackpot','一千万到账之后','你的余额已经更新。现在可以收下一个特殊结局，也可以继续过大学生活。',[{text:'幸运人生，在这里结束',action:'endJackpot',result:'你选择在这个难忘的瞬间收尾。'},{text:'继续玩，看看后来的人生',result:'这笔钱和这段经历会留在后面的生活里。'}]);return;}
    if(next==='epilogue'){epilogueCard(s);return;}
  }
  if(s.freeTime?.program){const e=nextFollowUp(s,eventEligible);if(e){s.card={...prepareStoryEvent(s,e),kind:'choice',consume:false};markEventShown(s,e);return;}finishFreeTime(s);}
  if(s.phase==='start'){
    if(s.sem>0&&!isGap(s)&&hook(s,`vacation-${s.sem}`,()=>{s.study=0;s.activity=0;s.freeTime={consume:false,holiday:s.sem%2?'寒假':'暑假'};settleHoliday(s,s.freeTime.holiday);freeCard(s);} ))return;
    startSemester(s);return;
  }
  if(s.unpaidLiving>0){livingShortfallCard(s);return;}
  const depleted=recoveryNeeded(s);if(depleted.length){for(const key of depleted)s.recoveryHandled[key]=true;fixed(s,'state-recovery','给自己一点恢复的时间','最近有些低落。你可以找人聊聊、休整一下，也可以先做一点熟悉的事。',[{text:'好好睡一觉，暂停额外安排',effects:{energy:40,mood:12},result:'你把这一天留给休整，恢复了一部分状态。'},{text:'找信任的人聊聊，再早点休息',effects:{energy:25,mood:32},result:'你不用立刻解决所有问题，聊完后舒服了一些。'},{text:'继续学一点熟悉的内容，再慢慢调整',effects:{study:4,energy:-3,mood:10},result:'你先做完一道熟悉的练习，给自己找回了一点把握。'}]);return;}
  if(s.relationship?.intimacy===0&&(s.relationship.breakupRetryTick??-1)<=(s.calendarTick||0)){breakupCard(s);return;}
  if(s.sem>=2&&s.sem<8&&!s.policy.published){s.policy.published=true;s.policy.announcedAt=stageName(s);notice(s,'本届推免规则公布','本专业 '+s.policy.cohort+' 人，预计名额 '+s.policy.places+' 个（'+Math.round(s.policy.rate*100)+'%）。'+s.policy.metricName+'前 '+s.policy.places+' 名，累计成绩至少 '+s.policy.minGpa+' 分，并完成课程补救。大三学年末结算；本局规则保持稳定。');ensureCard(s);return;}
  const key=`${s.sem}-${s.month}`;
  if(s.month===0 && s.sem<8 && s.sem%2===0 && hook(s,`${key}-committee`,()=>committeeCard(s)))return;
  if(s.sem===5&&s.month===2&&hook(s,'prospect',()=>notice(s,'大三的升学提醒',`当前成绩排名 ${s.rank}/${s.cohort}。本局推免按${s.policy.metricName}前 ${s.policy.places} 名，在大三学年末结算。现在仍有时间改善准备。`))){ensureCard(s);return;}
  if(s.sem===6&&s.month===0&&hook(s,'qual',()=>qualification(s))){ensureCard(s);return;}
  if(s.sem===6&&s.month===0&&s.route==='undecided'){routeCard(s);return;}
  if(s.sem===6&&s.month>=1&&s.route==='work'&&!s.hooks.recruit){s.hooks.recruit=true;s.deferred='jobs';ensureCard(s);return;}
  const graduateChainPending=s.storyQueue.some(q=>graduateEventIds.has(q.id));
  if((s.sem===12&&s.month>=1||s.sem===13)&&!s.hooks.gradRecruit&&!graduateChainPending&&!s.pendingWeeks&&!(s.weekendDue&&!s.monthlyFreeDone?.[key])){s.hooks.gradRecruit=true;s.route='work';s.deferred='jobs';ensureCard(s);return;}
  if((s.sem===6||s.sem===14)&&s.month===3&&s.route==='exam'&&hook(s,`exam-${s.attempt}`,()=>startQuiz(s,'exam'))){ensureCard(s);return;}
  if((s.sem===7||s.sem===15)&&s.month===1&&s.route==='exam'&&hook(s,`interview-${s.attempt}`,()=>examInterview(s)))return;
  if(s.sem===6&&s.month===2&&s.route==='civil'&&hook(s,'civil-exam',()=>startQuiz(s,'civil'))){ensureCard(s);return;}
  if(s.sem===7&&s.month===1&&s.route==='civil'&&hook(s,'civil-interview',()=>{
    const post=publicPostOf(s),fit=publicFit(s,post,hasTag);
    if((s.civilScore??0)<post.examLine){s.civilFailure='笔试 '+(s.civilScore??0)+' 分，未达到'+post.examLine+'分的面试参考线（'+post.track+' · '+post.role+'）。';log(s,'考公选拔结果',s.civilFailure,'notice');beginGraduation(s,'civil-failure');return;}
    const base=post.base+(clamp(s.civilScore,post.examLine,100)-post.examLine)*.009+fit.bonus;
    const outcome=(win,text)=>({text,action:win?'civilAccepted':'civilRejected'});
    fixed(s,'civil-interview','公共岗位的面试',post.track+' · '+post.company+' · '+post.role+'。笔试已达到参考线。请选择确实准备过的回答方式，经历与岗位匹配也会影响表现。',[
      {text:'用实际调研分析一个公共问题',requiresAnyTags:['政策调研','科研经历','公益项目'],effects:{mood:2},probability:{base,charm:.001,mood:.001,tags:{政策调研:.10,科研经历:.06,公益项目:.06,公共表达:.04}},success:outcome(true,'你的材料有依据，也讲清了服务对象和执行条件。面试通过，获得录用。'),failure:outcome(false,'笔试通过，但这次材料分析与回答未得到足够认可，面试未获录用。')},
      {text:'结合真实志愿或学生工作谈服务经历',requiresAnyTags:['志愿服务','学生干部经历'],effects:{mood:2},probability:{base,charm:.001,mood:.001,tags:{志愿服务:.10,学生干部经历:.07,公共表达:.04}},success:outcome(true,'你用实际处理过的事情说明服务意识和协调方法。面试通过，获得录用。'),failure:outcome(false,'笔试通过，但这次服务经历的回答未达到岗位选拔要求，面试未获录用。')},
      {text:'用课程学习和岗位准备回答问题',effects:{mood:1},probability:{base,charm:.001,mood:.001,grade:.003,tags:{规律复习:.06,公共表达:.04}},success:outcome(true,'你把学习过程和岗位要求联系起来，回答清楚具体。面试通过，获得录用。'),failure:outcome(false,'笔试通过，但这次课程与岗位准备的回答还不够充分，面试未获录用。')},
    ]);
    for(const c of s.card.choices)c.probability.reasons=['岗位：'+post.level+'；基础竞争概率 '+Math.round(post.base*100)+'%',...(fit.tags.length?['岗位相关经历：'+fit.tags.join('、')+'，成功概率 +'+Math.round(fit.bonus*100)+' 个百分点']:[])];
  } )){if(!s.card&&!s.ending)ensureCard(s);return;}
  // A real pending task can suffer an interruption before its next work card.
  // Save the check so rendering/reloading cannot repeatedly roll for an accident.
  const interruptionKey=s.sem+':'+s.eventClock;
  if(!s.pendingFinish&&s.contextIncidentCheck!==interruptionKey){
    s.contextIncidentCheck=interruptionKey;
    const interruptions=EVENTS.filter(e=>(e.taskContext||e.minActiveTasks)&&e.arrivalEffects&&eventEligible(s,e));
    if(interruptions.length&&random(s)<.06){const e=sample(s,interruptions);arriveEvent(s,e);markEventShown(s,e);s.card={...prepareStoryEvent(s,e),kind:'choice',consume:true};return;}
  }
  const applicationCard=projectApplicationCard(s,EVENTS.find(e=>e.id==='incident-rejection'));
  if(applicationCard){if(applicationCard.arrivalEffects){arriveEvent(s,applicationCard);markEventShown(s,applicationCard);}s.card=applicationCard;return;}
  const programCard=nextProgramCard(s,{random,addHistory,updateRanks,log});if(programCard){s.card=programCard;return;}
  const upgradeCard=nextCompetitionUpgrade(s);if(upgradeCard){s.card=upgradeCard;return;}
  if(s.incidentRecovery&&s.incidentRecovery.due<=s.eventClock){const recovery=s.incidentRecovery;s.incidentRecovery=null;fixed(s,'incident-recovery',recovery.title,recovery.text,[{text:'休息并逐步恢复日常节奏',effects:{energy:20,mood:6},result:'你留出恢复时间，先从低负担的安排开始。'},{text:'和信任的人复盘，寻求具体支持',effects:{energy:10,mood:10},result:'你获得了具体支持，把问题拆成了可以处理的部分。'},{text:'只做必要的轻量安排，其余任务延期',effects:{energy:-4,mood:3},result:'你减少了额外负担，接下来仍需要留出休息时间。'}]);return;}
  if(s.month===5){endSemester(s);ensureCard(s);return;}
  // Weekends are periodic leisure opportunities; no duplicate income settlement.
  s.monthlyFreeDone??={};
  if(s.weekendDue&&!s.monthlyFreeDone[key]){
    s.monthlyFreeDone[key]=true;s.hooks[`weekend-${key}`]=true;s.weekendDue=false;
    if(s.lastLeisureTick!==(s.calendarTick||0)){maybeRelationshipConflict(s);s.freeTime={consume:false,leisure:true,scheduled:true};freeCard(s);return;}
  }
  if(s.hooks['weekend-'+key])s.weekendDue=false;
  if(s.pendingWeeks>0){advancePendingWeeks(s);ensureCard(s);return;}
  const course=outstandingCourses(s).find(f=>!s.hooks['remediation-'+s.sem+'-'+f.id]);if(course){s.hooks['remediation-'+s.sem+'-'+course.id]=true;remediationCard(s,course);return;}
  const e=drawEvent(s);arriveEvent(s,e);markEventShown(s,e);s.card={...prepareStoryEvent(s,e),kind:'choice',consume:true};
}
export function advanceNotice(s) {
  if(s.card?.kind!=='notice'||s.feedback)return false;s.card=null;ensureCard(s);return true;
}
function applyAction(s,action) {
  if(!action)return;
  if(applyAdmissionAction(s,action))return;
  initializeLife(s);
  if(action==='catPhoto'||action==='catFarewell'){finishCatGraduation(s,action==='catPhoto');s.deferred='graduation-complete';return;}
  if(action==='coursePassed'||action==='courseFailed'){const course=s.academicFailures.find(f=>f.id===s.card.courseId);if(course){course.attempts++;if(action==='coursePassed'){repairAcademicCourse(s,course.id);updateRanks(s);}if(s.pendingFinish){if(action==='courseFailed')s.graduationRetries=(s.graduationRetries||0)+1;if(s.graduationRetries>=2){applyAction(s,'deferGraduation');return;}s.deferred=degreeCourses(s).length?'graduation-remediation':'graduation-complete';}}return;}
  if(action==='deferGraduation'){finish(s,'毕业暂缓','尚未完成的课程需要继续补救。已确定的去向仍以满足毕业条件为前提。');s.ending.degree=isGrad(s)?'硕士未毕业':'本科未毕业';return;}
  if(action==='courseDeferred')return;
  if(action==='cadreBrowse'){s.deferred='cadrePositions';return;}
  if(action==='cadreRenew'){s.deferred='cadreElection:'+(s.previousCadre||s.cadre).role;return;}
  if(action.startsWith('cadreElected:')){const role=action.split(':')[1];s.cadre={role,startSem:s.sem,endSem:s.sem+2,performance:0,tasks:0};s.cadreHistory.push({...s.cadre});s.previousCadre=null;s.committee=true;addHistory(s,'学生干部经历',cadreRole(role).name+' · 一学年');queueFollowUp(s,{id:'cadre-first',after:0,priority:2},'cadre');return;}
  if(action==='cadreDefeated'){s.cadre=null;s.previousCadre=null;s.committee=false;return;}
  if(action==='repairRelationship'||action==='coolRelationship'){changeIntimacy(s,action==='repairRelationship'?35:15,{contact:true});s.relationship.breakupRetryTick=(s.calendarTick||0)+1;s.relationship.flags.repair=true;return;}
  if(['resolveLiving','resolveGrant','resolveFamily'].includes(action)){if(action==='resolveGrant')s.hooks['grant-'+s.sem]=true;if(action==='resolveFamily')s.hooks['family-support-'+s.sem]=true;const amount=s.unpaidLiving;s.balance=Math.max(0,s.balance-amount);s.finances.push({type:'shortfall-resolution',key:'support-'+s.sequence,paid:amount});s.unpaidLiving=0;return;}
  const people=PEOPLE.filter(p=>s.romancePreference==='any'||p.gender===s.romancePreference);
  if(action?.startsWith('startInternship')){s.internship={...internshipTerms(s,action.split(':')[1]||'local'),startedSem:s.sem,completed:false};for(const flag of ['internshipReliable','internshipMentored','internshipFrustrated'])s.plotFlags[flag]=false;s.plotFlags.internshipActive=true;queueFollowUp(s,{id:'internship-work',after:1,expires:10,clearFlags:['internshipActive','internshipReliable','internshipMentored','internshipFrustrated']});return;}
  if(action==='finishInternship'){const job=s.internship;if(job&&!job.completed){s.balance+=job.net;job.completed=true;job.completedSem=s.sem;s.finances.push({type:'internship',gross:job.gross,extraCost:job.extraCost,net:job.net,weeks:job.weeks});addHistory(s,'实习经历',job.weeks+'周 · 实际报酬 '+job.gross+' · 额外成本 '+job.extraCost);}return;}
  if(action==='sellUnused'){s.inventory??={unusedBook:true};if(s.inventory.unusedBook){s.inventory.unusedBook=false;s.balance+=120;}return;}
  if(action==='candidateContinue'){const next=nextCandidateEvent(s);if(EVENTS.some(e=>e.id===next.id))queueFollowUp(s,{id:next.id,scope:'candidate',after:3,expires:14},'candidate');return;}
  if(action==='submitProjectApplication'){submitProjectApplication(s,random(s));return;}
  if(action.startsWith('programUpgrade:')){const parent=s.programs.find(p=>p.id===s.card.programId);registerProgram(s,action.split(':')[1],random(s),{family:parent.family||parent.id});return;}
  if(action.startsWith('program:')||action.startsWith('programReady:')){registerProgram(s,action.split(':')[1],random(s),{ready:action.startsWith('programReady:')});return;}
  if(['programPrepare','programBasic','programWithdraw'].includes(action)){programAction(s,action);return;}
  if(action==='meet'){s.candidate=structuredClone(sample(s,people));s.candidate.meetingId='candidate-'+(++s.sequence);Object.assign(s.candidate,{familiarity:20,interest:40,trust:50});}
  if(action==='date'){s.relationship={id:'relationship-'+(++s.sequence),person:s.candidate||structuredClone(sample(s,people)),stage:'dating',started:s.sem,intimacy:55,memories:0,flags:{},lastContact:s.calendarTick||0};s.candidate=null;normalizeRelationship(s);s.romances.push({name:s.relationship.person.name,start:stageName(s),end:null});}
  if(action==='clearCandidate')s.candidate=null;
  if(action==='strengthen'&&s.relationship)changeIntimacy(s,10,{contact:true});
  if(action==='strain'&&s.relationship){changeIntimacy(s,-18,{contact:true});s.relationship.flags.conflict=true;}
  if(action==='reconcile'&&s.relationship)changeIntimacy(s,15,{contact:true});
  if(action==='breakup'){if(s.relationship){const r=s.romances.findLast(r=>!r.end);if(r)r.end=stageName(s);}s.relationship=null;s.candidate=null;}
  if(action==='revealRich'&&s.relationship)s.relationship.revealed=true;
  if(action==='committee')s.committee=true;
  if(action==='noCommittee'){settleCadreCredits(s,{through:s.sem+s.month/5,exit:true});s.cadre=null;s.previousCadre=null;s.committee=false;}
  if(action==='recommend'||action==='exam'){s.route=action;s.target=null;s.deferred='target';}
  if(action==='work'){s.route='work';if(s.sem>=7){s.hooks.recruit=true;s.deferred='jobs';}}
  if(action==='workNow'){s.route='work';s.hooks.recruit=true;s.deferred='jobs';}
  if(action==='civil'){s.route='civil';s.publicTarget=null;s.deferred='publicTargets';}
  if(action?.startsWith('publicTarget:'))s.publicTarget=action.split(':')[1];
  if(['interviewCase','interviewStudy','interviewCampus'].includes(action)){
    s.interviewStyle=action;recruitResults(s);s.deferred='offers';
  }
  if(action==='homeArrive'){s.freeTime.location='home';applyEffects(s,{energy:26,mood:15});s.deferred='homeScene';return;}
  if(action==='homeCancel'){s.freeTime.program=false;s.freeTime.location='campus';s.deferred='holidayPlans';return;}
  if(action==='retry')beginGraduation(s,'retry');
  if(action==='endExam')beginGraduation(s,'exam-failure');
  if(action==='endJackpot')finish(s,'幸运人生','彩票大奖改变了生活。你选择在此刻收下这个特殊结局。');
  if(action==='epilogueTogether'){s.epilogue=s.relationship?`你与${s.relationship.person.name}商量了未来安排，决定继续这段关系。`:'毕业后，你带着自己的节奏走向下一站。';finishOffer(s);}
  if(action==='epilogueSeparate'){const name=s.relationship?.person.name;applyAction(s,'breakup');addHistory(s,'分手经历','毕业选择');s.epilogue=`你与${name}认真告别，各自安排毕业后的生活。`;finishOffer(s);}
  if(action==='civilAccepted'){const post=publicPostOf(s);const fit=publicFit(s,post,hasTag);const quality=clamp(((s.civilScore??post.examLine)-post.examLine)/Math.max(1,100-post.examLine)*.65+fit.bonus,0,1);s.publicOffer={...post,salary:Math.round((post.salary+(post.salaryMax-post.salary)*quality)*10)/10,salaryBasis:'税前年现金收入',rating:post.selection?'选调录用':'公务员录用',packageText:'现金收入估算；保障与补贴另列，无企业股权'};s.deferred='epilogue';}
  if(action==='civilRejected'){s.civilFailure='笔试已通过，面试未获录用。';beginGraduation(s,'civil-failure');}
}
export function actionDuration(card,choice={},state) {
  if(!card?.consume)return 0;
  if(choice.duration!==undefined)return clamp(choice.duration,0,10);
  if(card.duration===0)return 0;
  if(choice.freeTimeGain||choice.effects?.energy>5)return 2;
  if(choice.effects?.balance>=400)return 4;
  if(state&&isGrad(state)&&card.duration>=4&&['study','project'].includes(card.category))return Math.max(card.duration,card.category==='project'?10:8);
  if(choice.effects?.study>=5)return card.duration??4;
  return card.duration??3;
}
export function choose(s,index) {
  const card=s.card;if(s.ending||s.feedback||card?.kind!=='choice')return false;
  const choice=card.choices[index];if(!choice)return false;
  if(!choiceAvailable(s,choice).ok)return false;
  const timeCost=card.id==='internship-work'&&s.internship&&card.consume?MONTH_UNITS:actionDuration(card,choice,s);
  const p=choice.probability?probability(s,choice.probability):null;
  initializeLife(s);const unlockStart=s.routineUnlocks?.length||0;const before={intimacy:s.relationship?.intimacy||0,energy:s.energy,mood:s.mood,charm:s.charm,balance:s.balance,study:s.study,activity:s.activity,credit:yearScore(s),tags:s.history.length};applyEffects(s,choice.effects);
  let text=choice.result||'',success=null,action=choice.action,resolvedOutcome=null;
  if(p){success=random(s)<p.value;const outcome=success?choice.success:choice.failure;resolvedOutcome=outcome;applyEffects(s,outcome.effects);text=outcome.text;action=outcome.action||action;}
  if(action==='browseLottery')action=null;
  if(choice.onceKey)s.hooks[choice.onceKey.startsWith('term:')?choice.onceKey+'-'+s.sem:choice.onceKey]=true;
  const unlocked=s.routineUnlocks?.slice(unlockStart)||[];if(unlocked.length)text+=' '+unlocked.map(x=>x.note).join(' ');
  log(s,card.title,`${choice.text} → ${text}`);const selectionRecord=s.log.at(-1);
  applyAction(s,action);rememberChoice(s,card,choice,resolvedOutcome);
  s.taskContexts??={};s.activeTasks??={};
  const contextUntil=s.sem*20+s.month*4+(s.week||0)+6;
  if(/纸质|打印|纸面/.test(card.text||'')&&choice.effects?.study)s.taskContexts.materials=contextUntil;
  if(card.category==='project'&&/合作|分工|团队|队友|小组/.test(card.text||'')&&choice.followUp)s.taskContexts.collaboration=contextUntil;
  if(card.category==='social'&&(choice.effects?.tags?.includes('公共表达')||resolvedOutcome?.effects?.tags?.includes('公共表达')))s.taskContexts.expression=contextUntil;
  if(choice.candidateDelta&&s.candidate)for(const [key,delta] of Object.entries(choice.candidateDelta))s.candidate[key]=clamp((s.candidate[key]??(key==='familiarity'?20:key==='trust'?50:40))+delta);
  if(choice.credit){const gain=awardCredit(s,{...choice.credit,key:`event:${card.id}:${academicYear(s)}`,label:card.title+' · '+choice.credit.label});if(gain)text+=' 本学年综测 +'+gain+' 分。';updateRanks(s);}
  if(choice.incidentFollow)s.incidentRecovery={...card.recovery,due:s.eventClock+2};
  if(action==='meet'&&resolvedOutcome?.followUp?.scope==='candidate')queueFollowUp(s,resolvedOutcome.followUp,'candidate');
  if(card.socialActivity&&!s.freeTime?.holiday)s.lastLeisureTick=s.calendarTick||0;
  const effects=Object.fromEntries(['energy','mood','charm','balance','study','activity'].map(k=>[k,Number((s[k]-before[k]).toFixed(1))]));effects.intimacy=s.relationship?Number((s.relationship.intimacy-before.intimacy).toFixed(1)):0;effects.tags=s.history.slice(before.tags).map(h=>h.tag);effects.credit=roundState(yearScore(s)-before.credit);
  if(effects.study>0&&before.study>=18&&s.studyDiminishingNotifiedSem!==s.sem){text+=' 学习准备已较充分，继续投入仍有收益，但增长会逐渐放缓。';s.studyDiminishingNotifiedSem=s.sem;selectionRecord.text=`${choice.text} → ${text}`;}
  const inline=false;
  selectionRecord.text=`${choice.text} → ${text}`;
  Object.assign(selectionRecord, {effects,probability:p?{...p,success}:null});
  if(s.ending){notice(s,card.title+' · 结果',text);return true;}
  s.feedback={inline,source:card.title,freeTimeComplete:!!card.socialActivity||!!card.homeVisit,title:card.id==='cadre-election'?(success?'你当选了':'这次没能当选'):card.title+' · 结果',text,effects,probability:p?{...p,success}:null,consume:timeCost>0,timeCost,fromSem:s.sem,freeTimeGain:choice.freeTimeGain||0,openLottery:choice.action==='browseLottery'};
  return true;
}
export function acknowledgeNotification(s){if(!s.notifications?.length)return false;s.notifications.shift();return true;}
export function advanceRoutineResult(s){if(!s.feedback?.inline)return false;continueFeedback(s);return true;}
export function lotteryPrize(roll,id='weekend') {return drawPrize(id,roll);}
export function settleCalendarMonth(s,index,{holiday=null}={}) {
  initializeLife(s);const key='calendar-'+index;if(s.finances.some(f=>f.key===key))return null;
  const vacation=holiday||vacationAt(index),{income,cost}=monthlyBudget(s,{holiday:vacation});
  const before=s.balance,paid=Math.min(cost,before+income),shortfall=cost-paid;
  s.balance=before+income-paid;s.unpaidLiving+=shortfall;s.calendarTick=(s.calendarTick||0)+1;
  const entry={key,calendarMonth:index,type:holiday?'holiday':'month',sem:s.sem,month:s.month,holiday:vacation,income,cost,paid,shortfall,before,after:s.balance};
  s.finances.push(entry);
  log(s,'月度收支',monthLabel(index)+'：到账 ¥'+income+'，必要生活支出 ¥'+cost+(shortfall?'，尚有 ¥'+shortfall+' 需要补齐。':'。'),'notice');
  if(s.calendarTick>1){changeEnergy(s,2);naturalMood(s);}
  if(s.relationship&&(s.calendarTick-s.relationship.lastContact)>2)changeIntimacy(s,-4);
  return entry;
}
function settleMonth(s) {
  const entry=settleCalendarMonth(s,academicMonth(s));
  if(entry&&s.month>0)notice(s,'本月生活账单','到账 ¥'+entry.income+' · 必要支出 ¥'+entry.cost+(entry.shortfall?' · 缺口 ¥'+entry.shortfall:''));
}
function advanceEvent(s,units=2) {
  initializeStory(s);if(units<=0)return;
  s.eventClock++;s.eventSlot=(s.eventSlot||0)+1;s.pendingWeeks=(s.pendingWeeks||0)+units;advancePendingWeeks(s);
}
export function advancePendingWeeks(s){
 s.monthlyFreeDone??={};
 if(s.month>=5){s.pendingWeeks=0;return;}
 if(!s.monthlyFreeDone[`${s.sem}-${s.month}`]){s.weekendDue=true;return;}
 const step=Math.min(s.pendingWeeks||0,MONTH_UNITS-(s.week||0));s.week=(s.week||0)+step;s.pendingWeeks=Math.max(0,(s.pendingWeeks||0)-step);
 if(s.week>=MONTH_UNITS){s.week=0;s.eventSlot=0;s.month++;s.activeTasks={};if(s.month<5){settleMonth(s);s.weekendDue=true;}else s.pendingWeeks=0;}
}
function settleHoliday(s,holiday){
  let income=0,cost=0,newMonths=0;
  for(const index of vacationMonths(s,holiday)){const entry=settleCalendarMonth(s,index,{holiday});if(entry){income+=entry.income;cost+=entry.cost;newMonths++;}}
  log(s,holiday+'收支',newMonths?'假期尚未结算的 '+newMonths+' 个月已到账 ¥'+income+'，必要开销 ¥'+cost+'。此前已结算的月份不重复领取。':'假期所跨月份已经结算，不重复领取生活费或恢复精力。','notice');
  return {income,cost};
}
export function maybeRelationshipConflict(s){
  const r=s.relationship;if(!r||r.flags?.conflictPending||s.storyQueue?.some(q=>q.scope==='relationship')||r.lastConflictCheck===(s.calendarTick||0))return false;
  r.lastConflictCheck=s.calendarTick||0;if((s.calendarTick||0)-(r.lastConflictTick??-3)<2)return false;
  const chance=.14+(energyPercent(s)<25?.05:0)+(s.mood<25?.05:0)+(r.flags?.missed?.07:0);
  if(random(s)>=chance)return false;changeIntimacy(s,-20);r.lastConflictTick=s.calendarTick||0;r.flags.conflictPending=true;
  log(s,'相处中的意外','你们因临时安排和误解发生争执，亲密度降低20。');
  queueFollowUp(s,{id:'love-unexpected-conflict',clearFlags:['conflictPending','conflictAvoided','conflictDiscussed'],after:0,expires:10,priority:4},'relationship');return true;
}
function freeCard(s,lottery=false){const title=s.freeTime?.holiday?`${s.freeTime.holiday}，给自己一点时间`:s.freeTime?.leisure?'周末，今天想做什么？':'这个下午，你还有一点时间';s.card={id:'free-time',kind:lottery?'lottery':'free',group:'common',title:lottery?'便利店的刮刮乐柜台':title,text:lottery?'挑一张，刮开看看运气。':s.freeTime?.holiday?'选择整个假期的主要安排。假期收入与必要开销已结算，额外消费单独支付。':'选一件想做的事，把时间留给自己。'};}
export const FREE_ACTIVITIES=AFTERNOON_ACTIVITIES;
function finishFreeTime(s){
  const f=s.freeTime;if(f?.holiday)s.holidayStudy=s.study;s.freeTime=null;
  if(s.ending)return;
  if(f?.external){s.card=f.returnCard;s.deferred=f.returnDeferred;}
  else {s.card=null;if(f?.consume)advanceEvent(s,f.timeCost??2);}
}
export function freeAction(s,action){
  if(s.feedback||!s.freeTime||!['free','lottery'].includes(s.card?.kind))return false;
  if(s.freeTime.external&&action==='back'&&(s.card.kind==='free'||!s.freeTime.leisure)){finishFreeTime(s);return true;}
  if(s.freeTime.external&&!s.freeTime.leisure)return false;
  if(action==='lottery'){freeCard(s,true);return true;}
  if(action==='back'){freeCard(s);return true;}
  let activity=activitiesFor(s).find(a=>a.id===action);
  if(activity?.action==='homePlan'){s.freeTime.program=true;s.freeTime.location='planning-home';s.deferred='homeTicket';s.card=null;ensureCard(s);return true;}
  if(activity?.action==='meetNew'){s.deferred='newFriends';s.card=null;ensureCard(s);return true;}
  if(activity?.action==='summerInternship'){s.freeTime.program=true;s.deferred='holidayInternship';log(s,'假期实习申请','你留出假期时间，准备申请与专业相关的实习。');s.feedback={title:'准备申请实习',text:'接下来会经历申请、实际工作与交接。得到机会才开始工作，完成后才留下实习经历。',consume:false};s.card=null;return true;}
  if(activity?.dating&&s.relationship){normalizeRelationship(s);const r=s.relationship,gifts=r.flags.gifts||0;const base=action==='gift'?(r.preference==='shared'?5:9)+(r.flags.communicated?2:0)-(r.flags.missed?3:0):(r.preference==='shared'?9:7);activity={...activity,result:activity.result+(action==='gift'?(r.flags.missed?'但礼物没有替代上次失约需要的沟通。':r.preference==='shared'?'对方更在意一起做事情，礼物只是其中一部分。':'你记住的小细节比礼物价格更让对方开心。'):''),effects:{...activity.effects,intimacy:action==='gift'?Math.max(1,Math.round(base/(gifts+1))):base}};}
  if(!activity&&action!=='skip')return false;
  if(activity?.dating&&!s.relationship)return false;
  if(activity&&!exertionAvailable(s,activity.effects).ok)return false;
  if(activity?.effects.balance<0&&s.balance<-activity.effects.balance)return false;
  if(s.freeTime.leisure||s.freeTime.consume)s.lastLeisureTick=s.calendarTick||0;
  if(activity){const unlockStart=s.routineUnlocks?.length||0;const before={energy:s.energy,mood:s.mood,charm:s.charm,study:s.study,activity:s.activity,balance:s.balance,intimacy:s.relationship?.intimacy||0};if(action==='gift')s.relationship.flags.gifts=(s.relationship.flags.gifts||0)+1;applyEffects(s,activity.effects);if(s.freeTime.holiday)s.holidayStudy=s.study;let text=activity.result+' '+(s.routineUnlocks?.slice(unlockStart)||[]).map(x=>x.note).join(' ');if(s.study>before.study&&before.study>=18&&s.studyDiminishingNotifiedSem!==s.sem){text+=' 学习准备已较充分，继续投入仍有收益，但增长会逐渐放缓。';s.studyDiminishingNotifiedSem=s.sem;}log(s,'空闲时光',text.trim());s.feedback={title:activity.title,text:text.trim(),effects:{...Object.fromEntries(Object.keys(before).map(key=>[key,roundState((key==='intimacy'?(s.relationship?.intimacy||0):s[key])-before[key])])),tags:importantExperiences(s).filter(h=>activity.effects.tags?.map(canonicalTag).includes(h.tag)).map(h=>h.tag)},consume:false,freeTimeComplete:true};Object.assign(s.log.at(-1),{effects:s.feedback.effects});s.card=null;}
  else {log(s,'空闲时光',s.freeTime.holiday?'你没有给这个假期安排额外计划。':'你保留了一段没有安排的时间。');finishFreeTime(s);ensureCard(s);}
  return true;
}
export function buyTicket(s,id){const t=ticketOf(id);if(s.card?.kind!=='lottery'||s.feedback||!s.freeTime||s.freeTime.ticket||!t||s.balance<t.price)return false;if(s.freeTime.external&&!s.freeTime.leisure&&s.lastLotteryTick===(s.calendarTick||0))return false;const tx={id:`ticket-${++s.sequence}`,ticket:id,price:t.price,prize:drawPrize(id,random(s)),time:dateName(s),revealed:false};s.balance-=t.price;if(s.freeTime.external&&!s.freeTime.leisure)s.lastLotteryTick=s.calendarTick||0;if(s.freeTime.leisure||s.freeTime.consume)s.lastLeisureTick=s.calendarTick||0;s.lotteryTransactions.push(tx);s.freeTime.ticket=tx.id;s.card={id:'scratch',kind:'scratch',group:'easter',title:t.name,text:''};return true;}
export function revealTicket(s){if(s.card?.kind!=='scratch'||s.feedback||!s.freeTime?.ticket)return false;const tx=s.lotteryTransactions.find(x=>x.id===s.freeTime.ticket);if(!tx||tx.revealed)return false;tx.revealed=true;s.balance+=tx.prize;if(tx.prize>0)addHistory(s,'彩票中奖',`${ticketOf(tx.ticket).name} · ¥${tx.prize}`);if(tx.prize===10000000){addHistory(s,'彩票大奖');s.deferred='jackpot';}const text=tx.prize?`刮中了 ¥${tx.prize.toLocaleString()}。票价 ¥${tx.price}，本次净变化 ¥${(tx.prize-tx.price).toLocaleString()}。`:`这张没有中奖。花费 ¥${tx.price}，生活继续。`;log(s,'刮刮乐开奖',text);s.feedback={title:tx.prize>tx.price?'好运落在了这张票上':tx.prize?'这张中了小奖':'今天没有中奖',text,effects:{balance:tx.prize},consume:false,ticketComplete:true};return true;}
export function continueFeedback(s) {
  if(!s.feedback)return false;
  const f=s.feedback;s.feedback=null;s.card=null;
  if(f.ticketComplete){if(s.deferred==='jackpot'){s.freeTime.ticket=null;s.freeTime.resumeAfterJackpot=true;}else finishFreeTime(s);}
  else if(s.freeTime?.resumeAfterJackpot||f.freeTimeComplete)finishFreeTime(s);
  else if(f.freeTimeGain){s.freeTime={remaining:1,consume:f.consume,timeCost:f.timeCost,source:s.log.at(-1)?.title};freeCard(s,f.openLottery);return true;}
  else if(f.consume&&!s.ending)advanceEvent(s,f.timeCost??2);
  ensureCard(s);return true;
}
export function selectTarget(s,schoolId) {
  if(s.card?.kind!=='target'||!SCHOOLS.some(x=>x.id===schoolId)||s.route==='recommend'&&!s.eligible)return false;
  s.target=schoolId;const target=SCHOOLS.find(x=>x.id===schoolId);s.card=null;
  log(s,'升学择校',`目标：${target.name}，方向：${MAJORS[s.major].name}。`);
  if(s.route==='recommend'){
    s.admission={school:schoolId};s.route='admitted';notice(s,'推免录取确认',`你已获得推免资格，现确认进入${target.name}。完成本科阶段和毕业要求后，开始研究生生活。`);
  } else notice(s,'考研目标确定',`目标是${target.name}。备考经历与学业准备会提供帮助，初试还需要你亲自答题。`);
  ensureCard(s);return true;
}
export function startQuiz(s,purpose) {
  const paper=buildPaper(s,purpose,()=>random(s));
  s.quiz={purpose,title:paper.title,description:paper.description,questions:paper.questions.map(q=>q.id),answers:[],index:0,hintUsed:false,hintFor:null,score:null};
  s.deferred='quiz';
}
export function useHint(s) {if(s.card?.kind!=='quiz'||s.quiz.hintUsed)return false;
  if(!['规律复习','备考经验','软件项目','工程项目','教育实习','商业分析','科研经历'].some(t=>hasTag(s,t)))return false;
  s.quiz.hintUsed=true;s.quiz.hintFor=s.quiz.index;const q=QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]);s.quiz.eliminated=(q.answer+1)%q.options.length;return true;
}
export function answerQuestion(s,answer) {
  if(s.card?.kind!=='quiz'||s.quiz.reveal)return false;
  const q=QUESTIONS.find(q=>q.id===s.quiz.questions[s.quiz.index]);if(!Number.isInteger(answer)||answer<0||answer>=q.options.length)return false;
  s.quiz.answers.push(answer);s.quiz.reveal={correct:answer===q.answer,explanation:q.explanation};return true;
}
export function nextQuestion(s) {
  if(s.card?.kind!=='quiz'||!s.quiz.reveal)return false;s.quiz.reveal=null;s.quiz.index++;
  if(s.quiz.index<s.quiz.questions.length)return true;
  const quiz=s.quiz;const general=quiz.questions.map(id=>QUESTIONS.find(q=>q.id===id)).filter(q=>q.category==='general');
  const correctGeneral=general.filter(q=>quiz.answers[quiz.questions.indexOf(q.id)]===q.answer).length;
  const totalCorrect=quiz.questions.filter((id,i)=>QUESTIONS.find(q=>q.id===id).answer===quiz.answers[i]).length;
  quiz.score=Math.round(totalCorrect/quiz.questions.length*100);quiz.generalScore=Math.round(correctGeneral/general.length*100);
  quiz.sections=sectionScores(quiz);quiz.weightedScore=weightedExamScore(quiz);
  s.quizHistory.push({sections:structuredClone(quiz.sections),weightedScore:quiz.weightedScore,purpose:quiz.purpose,score:quiz.score,time:dateName(s),questions:[...quiz.questions],answers:[...quiz.answers]});
  s.card=null;
  if(quiz.purpose==='jobs'){s.deferred='jobInterview';notice(s,'笔试成绩',`通用测评 ${quiz.generalScore} 分。专业题结果按岗位类别分别计算。`);}
  if(quiz.purpose==='exam'){
    const preparation=clamp(s.gpa*.25+(hasTag(s,'备考经验')?8:0)+(hasTag(s,'规律复习')?5:0),0,35);
    s.examScore=Math.round(quiz.weightedScore*.65+preparation);notice(s,'初试成绩公布',`科目计分：${Object.entries(quiz.sections).map(([name,x])=>name+' '+x.score+' 分').join('，')}。加权短卷 ${quiz.weightedScore} 分，学业与备考折算 ${Math.round(preparation)} 分，模拟初试综合 ${s.examScore} 分。复试结果在下一学期揭晓。`);
  }
  if(quiz.purpose==='civil'){
    s.civilScore=quiz.weightedScore;notice(s,'公共岗位笔试结果',`行测 ${quiz.sections.行测.score} 分，材料分析 ${quiz.sections.材料分析.score} 分，加权短卷 ${quiz.weightedScore} 分。材料分析为申论思路的简化选择题；后续选拔在春季继续。`);
  }
  ensureCard(s);return true;
}
function examInterview(s) {
  const line=s.target==='aero'?72:s.target==='finance'?62:52;
  if((s.examScore??0)<line){addHistory(s,'考研失利',`第${s.attempt}次`);s.deferred='fallbackExam';notice(s,'考研选拔结果',`初试综合 ${s.examScore??0} 分，目标要求 ${line} 分，这次未进入录取。`);ensureCard(s);return;}
  fixed(s,'exam-interview','复试：谈谈你的经历','初试达到目标要求。老师请你讲一件自己认真完成的事情。',[
    {text:'用具体成果说明过程',probability:{base:.6,charm:.001,tags:{'科研经历':.12,'竞赛获奖':.1,'软件项目':.08,'工程项目':.08,'教育实习':.08}},success:{text:'复试通过，你获得了录取。',action:'examAccepted'},failure:{text:'这次复试未被录取。',action:'examRejected'}},
    {text:'坦诚讲学习与反思',probability:{base:.55,charm:.001,tags:{'规律复习':.12,'深度阅读':.1},grade:.003},success:{text:'你清楚地表达了自己的准备，获得录取。',action:'examAccepted'},failure:{text:'这次仍差了一点。',action:'examRejected'}},
    {text:'围绕研究计划说明下一步',probability:{base:.5,charm:.001,tags:{'政策调研':.12,'深度阅读':.1,'科研接触':.05},grade:.002},success:{text:'问题与方法足够具体，你获得了录取。',action:'examAccepted'},failure:{text:'研究计划还不充分，这次未获录取。',action:'examRejected'}},
  ]);
}
// These actions are kept separate so admissions do not silently skip remaining undergraduate time.
function applyAdmissionAction(s,action) {
  if(action==='examAccepted'){s.examOutcome='success';s.admission={school:s.target};s.route='admitted';if(isGap(s)){endSemesterTransition(s);s.route='graduate';}return true;}
  if(action==='examRejected'){addHistory(s,'考研失利',`第${s.attempt}次`);s.deferred='fallbackExam';return true;}
  return false;
}
export function resolveAdmissionAction(s,action) {return applyAdmissionAction(s,action);}
export function jobEligibility(s,j) {
  if(j.degree==='硕士'&&!isGrad(s))return {ok:false,reason:'学历要求：硕士'};
  if(j.category!=='general'&&j.category!==MAJORS[s.major].category)return {ok:false,reason:'专业方向不匹配'};
  if(j.tier===3&&s.gpa<86&&!(hasTag(s,MAJORS[s.major].tag)&&hasTag(s,'实习经历')))return {ok:false,reason:'高要求岗位：成绩至少86分，或有相关项目与实习经历'};
  return {ok:true,reason:hasTag(s,MAJORS[s.major].tag)?'专业匹配，有相关经历':'满足基本条件，可以尝试'};
}
export function submitJobs(s,ids) {
  if(s.card?.kind!=='jobs')return false;
  const valid=[...new Set(ids)].filter(id=>{const j=JOBS.find(j=>j.id===id);return j&&jobEligibility(s,j).ok;});
  if(!valid.length)return false;
  s.selectedJobs=valid;s.card=null;addHistory(s,'求职经历');log(s,'简历投递',`投递 ${valid.length} 个岗位：${valid.map(id=>JOBS.find(j=>j.id===id).company).join('、')}。`);startQuiz(s,'jobs');ensureCard(s);return true;
}
export function recruitResults(s) {
  s.jobResults=recruitBatch(s,s.selectedJobs.map(id=>JOBS.find(j=>j.id===id)),{hasTag,major:MAJORS[s.major],probability,random,scoreFor:job=>jobPaperScore(s.quiz,job)});
  log(s,'招聘批次结果',s.jobResults.map(r=>`${JOBS.find(j=>j.id===r.id).company}：${r.offer?'offer · '+r.rating+' · '+r.match+' · 税前年总包 '+r.salary+' 万元':r.reason}`).join('；'),'notice');
}
export function selectOffer(s,id) {if(s.card?.kind!=='offers')return false;const r=s.jobResults.find(x=>x.id===id&&x.offer);if(!r)return false;s.selectedOffer=r;s.card=null;s.deferred='epilogue';ensureCard(s);return true;}
export function acceptNoOffer(s) {if(s.card?.kind!=='offers'||s.jobResults.some(r=>r.offer))return false;s.card=null;beginGraduation(s,'no-offer');if(!s.ending)ensureCard(s);return true;}
function epilogueCard(s) {
  const job=s.publicOffer||JOBS.find(j=>j.id===s.selectedOffer.id);
  if(s.relationship)fixed(s,'epilogue','毕业前，谈谈下一站',`你将前往${job.city}。${s.relationship.person.name}原本倾向${s.relationship.person.city}。你们坐下来，讨论以后的生活。`,[
    {text:'一起讨论，继续这段关系',effects:{tags:s.relationship.person.city!==job.city?['远距离相处']:[]},action:'epilogueTogether',result:s.relationship.person.city!==job.city?'你们决定继续相处，并商量两地联系和见面的安排。':'你们决定继续相处，一起协调毕业后的生活安排。'},
    {text:'认真告别，各自出发',action:'epilogueSeparate',result:'你们珍惜过往，也接受不同的方向。'},
    {text:'先明确各自安排，再共同商量',action:'epilogueTogether',result:'你们没有仓促决定，约定保持沟通。'},
  ]);
  else fixed(s,'epilogue','毕业的最后一页','收拾行李时，你发现第一次入学留下的东西。工作已经确定，校园生活到了收尾的时候。',[
    {text:'和朋友告别，走向下一站',action:'epilogueTogether',result:'你把大学的记忆带进了新的生活。'},
    {text:'给过去的自己写一封信',action:'epilogueTogether',result:'你记录下了这些年真正改变的事情。'},
    {text:'和家人一起整理毕业行李',action:'epilogueTogether',result:'录取通知书旁边，终于多了一张毕业照。'},
  ]);
}
function closeGraduation(s){
  s.applicationAcademic={gpa:s.gpa,rank:s.rank,comp:s.comp,combined:s.combined,combinedRank:s.combinedRank,sem:s.sem};
  if(isGap(s)){log(s,'本科毕业档案','本科已经毕业，备考年保留原学业档案，不倒退日历补算本科课程。','notice');return;}
  const end=isGrad(s)?13:7;
  const credit=settleCadreCredits(s,{through:s.sem+s.month/5,exit:true});
  s.cadre=null;s.committee=false;
  if(credit)notice(s,'毕业任职交接','截至实际游玩时点的履职按已完成任期折算，综测 +'+credit+' 分；毕业尾声不虚构额外任职贡献。');
  for(let sem=s.sem;sem<=end;sem++)if(!s.grades.some(g=>g.sem===sem))s.grades.push({sem,grade:Math.round(clamp(s.gpa)*10)/10,comp:s.comp,epilogue:true});
  s.sem=end;s.month=5;addHistory(s,'毕业论文','毕业尾声：完成论文与必要课程，学业以求职时水平收尾');log(s,'毕业收尾','完成论文、必要课程与毕业手续。尾声补齐的学期沿用求职时学业水平，不额外随机改变已选择的去向。','notice');updateRanks(s);
}
function finishOffer(s) {beginGraduation(s,'offer');}
export function finish(s,title,text) {
  if(s.projectApplication?.status==='awaiting'){s.projectApplication.status='withdrawn';s.projectApplication.result='本局提前结束，尚未公布的小项目申请已撤回，不生成入选或完成经历。';}
  for(const p of s.programs||[])if(p.status==='preparing'){p.status='withdrawn';p.result='本局收尾时尚未完成准备，报名已取消，费用不退，不计证书、奖项或综测。';}
  s.programFinalizing=true;
  for(let i=0;i<(s.programs?.length||0);i++){const result=nextProgramCard(s,{random,addHistory,updateRanks,log});if(!result)break;notice(s,result.title,result.text);}
  s.programFinalizing=false;
  s.ending={title,text,at:stageName(s),degree:isGrad(s)?'硕士':s.sem>=7||s.selectedOffer||(s.sem===6&&s.route==='work')?'本科':'本科在读'};s.card=null;s.feedback=null;
  for(const q of s.storyQueue||[]){clearQueuedFlags(s,q);s.storyResults.push({id:q.id,status:'ended',sem:s.sem,text:q.source+'的接续随本局结束而收尾。'});}s.storyQueue=[];s.freeTime=null;log(s,title,text,'ending');
}
export function summary(s) {
  const offer=s.selectedOffer?JOBS.find(j=>j.id===s.selectedOffer.id):null;
  const experiences=importantExperiences(s);const keywords=experiences.map(h=>h.tag);
  const graded=s.grades.some(g=>isGrad(s)?g.sem>=8&&g.sem<14:g.sem<8);
  const lottery={count:s.lotteryTransactions?.length||0,spent:(s.lotteryTransactions||[]).reduce((n,t)=>n+t.price,0),won:(s.lotteryTransactions||[]).filter(t=>t.revealed).reduce((n,t)=>n+t.prize,0)};lottery.net=lottery.won-lottery.spent;
  return {recap:describeRun(s),catPhoto:currentCatPhoto(s),name:s.name,gender:s.gender,personality:personalityOf(s).name,charm:s.charm,creditLedger:s.creditLedger||[],programs:s.programs||[],lifetimeCredits:lifetimeCredits(s),energyMax:energyMax(s),applicationAcademic:s.applicationAcademic,lottery,quizHistory:s.quizHistory,ending:s.ending,school:schoolOf(s).name,originSchool:SCHOOLS.find(x=>x.id===s.originSchool).name,major:MAJORS[s.major].name,grade:graded?s.gpa:'未结算',rank:graded?`${s.rank}/${s.cohort}`:'未结算',comp:graded?s.comp:'未结算',combined:graded?s.combined:'未结算',combinedRank:graded?`${s.combinedRank}/${s.cohort}`:'未结算',balance:s.balance,energy:s.energy,mood:s.mood,keywords,experiences,cadreHistory:s.cadreHistory,finances:s.finances,policy:s.policy,intimacy:s.relationship?.intimacy??null,romances:s.romances,relationship:s.relationship?.person.name||'单身',offer:s.publicOffer|| (offer?{...offer,...s.selectedOffer}:null),epilogue:s.epilogue||'',history:s.history,log:s.log,examScore:s.examScore};
}
function recordText(x){
  const labels={energy:'精力',mood:'心情',charm:'魅力',balance:'余额',study:'学习积累',activity:'活动积累',credit:'本学年综测',intimacy:'亲密度'};
  const changes=Object.entries(x.effects||{}).filter(([key,value])=>labels[key]&&value).map(([key,value])=>`${labels[key]} ${value>0?'+':''}${roundState(value)}`);
  if(x.effects?.tags?.length)changes.push('经历：'+x.effects.tags.join('、'));
  const chance=x.probability?`本次成功率 ${Math.round(x.probability.value*100)}%${x.probability.reasons.length?'；'+x.probability.reasons.join('；'):''}`:'';
  return [`[${x.time}] ${x.title}`,x.text,changes.join(' · '),chance].filter(Boolean).join('\n');
}
export function summaryText(s) {const r=summary(s);return [`下一站，毕业 · ${r.name}的本局档案`,`结局：${r.ending?.title||'尚未结束'}`,r.ending?.text||'',r.offer?`录用：${r.offer.rating||'录用'}｜${r.offer.salaryBasis||'税前年总包'} ${r.offer.salary} 万｜${r.offer.packageText||''}｜${r.offer.benefits||''}`:'',`身份：${r.gender==='female'?'女':'男'}｜特质：${r.personality}｜魅力：${Math.round(r.charm)}`,`院校：${r.school}｜专业：${r.major}`,`累计成绩：${r.grade}｜排名：${r.rank}`,`综测：${r.comp}｜综合成绩：${r.combined}｜综合排名：${r.combinedRank}`,`余额：¥${r.balance.toLocaleString()}｜当前关系：${r.relationship}`,r.applicationAcademic?`求职时学业：${r.applicationAcademic.gpa} 分，排名 ${r.applicationAcademic.rank}/${s.cohort}；毕业尾声沿用学业水平。`:'',`彩票：${r.lottery.count} 张，支出 ¥${r.lottery.spent}，奖金 ¥${r.lottery.won}，净收益 ¥${r.lottery.net}`,r.epilogue,'','这一局的变化',...r.recap.lines,`日历生活支持：¥${r.recap.money.support}｜必要支出：¥${r.recap.money.necessary}｜其他资金净变化：¥${r.recap.money.otherNet}`,`实习工资：¥${r.recap.money.internshipGross}｜实习额外成本：¥${r.recap.money.internshipCost}`,'','模拟考试成绩',...r.quizHistory.map(h=>(h.purpose==='jobs'?'秋招':h.purpose==='exam'?'考研':'考公')+'：加权短卷 '+(h.weightedScore??h.score)+' 分；'+Object.entries(h.sections||{}).map(([name,x])=>name+' '+x.score+' 分').join('，')),`任职：${r.recap.posts.map(p=>p.name+'（'+p.period+'，履职 '+(p.tasks||0)+' 次，表现 '+(p.performance||0)+'）').join('；')||'无'}`,'','实际成绩明细',...r.recap.grades.map(g=>g.label+'：'+g.grade+' 分'+(g.remediated?'，原始 '+g.originalGrade+' 分，补救通过':'')),`人生关键词：${r.keywords.join('、')||'普通而独特的大学生活'}`,'','综测加分明细',...r.creditLedger.map(x=>'第'+(x.year+1)+'学年：'+x.label+' +'+x.points+'分'),`生涯累计综测加分：${r.lifetimeCredits}`,'','考试与赛事结果',...r.programs.map(p=>p.name+'：'+(p.result||({preparing:'已报名，准备中',awaiting:'已参加，等待结果'}[p.status]||p.status))),'','本局记录',...r.log.map(recordText),'','所有院校、企业、城市、薪酬与录取规则均为虚构游戏设定；彩票概率与奖金是游戏设定。'].join('\n');}
