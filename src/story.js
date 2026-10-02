import { internshipTerms } from './economy.js';
import { STORY_TOPICS } from './extended-stories.js';
import { EVENTS } from './content.js';
import { cadreRole } from './life-rules.js';

export function initializeStory(s){s.eventClock??=0;s.storyQueue??=[];s.scopedSeen??={};s.plotFlags??={};s.storyResults??=[];}
export function scopeKey(s,scope='run'){
  if(scope==='relationship')return s.relationship?.id||null;
  if(scope==='candidate')return !s.relationship?(s.candidate?.meetingId||s.candidate?.id||null):null;
  if(scope==='cadre')return s.cadre?s.cadre.role+'-'+s.cadre.startSem:null;
  return 'run';
}
export function flagsFor(s,scope='run'){
  if(scope==='relationship')return s.relationship?(s.relationship.flags??={}):{};
  if(scope==='candidate')return s.candidate?(s.candidate.flags??={}):{};
  if(scope==='cadre')return s.cadre?(s.cadre.flags??={}):{};
  return s.plotFlags??={};
}
export const eventExposureKey=(s,e)=>(scopeKey(s,e.storyScope||'run')||'run')+':'+e.id+':'+Math.floor(s.sem/2);
const contextKey=(s,e)=>scopeKey(s,e.storyScope||'run')+':'+e.id+':'+Math.floor(s.sem/2)+':'+(e.variants?.find(v=>flagsFor(s,e.storyScope||'run')[v.flag])?.flag||'ordinary');
export function scopedEligible(s,e,follow=false){
  const scope=e.storyScope||'run',key=scopeKey(s,scope),flags=flagsFor(s,scope);
  if(scope!=='run'&&!key)return false;
  if(e.followOnly&&!follow)return false;
  if((e.requiresFlags||[]).some(f=>!flags[f])||(e.notFlags||[]).some(f=>flags[f]))return false;
  if(e.storyScope&&!follow&&s.eventContexts?.[contextKey(s,e)])return false;
  if(e.storyScope&&!follow){const last=s.scopedSeen?.[key+':'+e.id];if(last!==undefined&&(!e.repeat||s.eventClock-last<(e.cooldown??4)))return false;}
  return true;
}
function cadreTask(s){const role=s.cadre?.role;
  if(role==='class-study')return 'cadre-homework';if(['class-life','union-service'].includes(role))return 'cadre-dorm';
  if(['class-culture','year-culture','union-culture'].includes(role))return 'cadre-match';if(role==='class-leader')return 'cadre-feedback';
  if(['year-leader','year-study'].includes(role))return 'cadre-cross';return 'cadre-stage';
}
function sameQueuedNode(a,b){return !!a&&!!b&&(a.queueId&&b.queueId?a.queueId===b.queueId:a===b||a.id===b.id&&a.key===b.key&&a.queuedAt===b.queuedAt&&a.due===b.due&&a.expires===b.expires);}
export function queueFollowUp(s,spec,defaultScope='run'){
  initializeStory(s);if(!spec)return;
  const scope=spec.scope||defaultScope,key=scopeKey(s,scope);if(!key)return;
  const id=spec.id==='$cadreTask'?cadreTask(s):spec.id;
  if(!EVENTS.some(e=>e.id===id))throw new Error('Unknown follow-up '+id);
  // A node can intentionally schedule another occurrence of itself. The node
  // currently resolving is removed below, so it must not suppress the new link.
  if(s.storyQueue.some(q=>!sameQueuedNode(q,s.card?._follow)&&q.id===id&&q.key===key))return;
  const inherited=s.card?._follow?.scope===scope&&s.card._follow.key===key?s.card._follow.clearFlags||[]:[];
  s.storyQueue.push({queueId:'follow-'+(s.sequence=(s.sequence||0)+1),id,scope,key,due:s.eventClock+(s.freeTime?.program?0:(spec.after??1)),expires:s.eventClock+(spec.expires??8),untilSem:spec.untilSem??s.sem+1,priority:spec.priority??1,clearFlags:[...new Set([...inherited,...spec.clearFlags||[]])],queuedAt:s.eventClock,who:scope==='relationship'?s.relationship.person.name:scope==='cadre'?cadreRole(s.cadre.role).name:'你',source:spec.source||s.card?.title||'之前的选择'});
}
export function clearQueuedFlags(s,q){if(scopeKey(s,q.scope)===q.key)for(const flag of q.clearFlags||[])flagsFor(s,q.scope)[flag]=false;}
export function pruneStories(s){
  initializeStory(s);const removed=[];
  s.storyQueue=s.storyQueue.filter(q=>{let reason='';if(scopeKey(s,q.scope)!==q.key)reason=q.scope==='relationship'?'这段关系已经结束':q.scope==='candidate'?'你们的相处方向已经改变':'原来的岗位任期已经结束';else if(s.eventClock>q.expires||s.sem>q.untilSem)reason='合适的时间窗口已经过去';
    if(!reason)return true;clearQueuedFlags(s,q);const text=q.source+'留下的后续不再继续：'+reason+'。';removed.push(text);s.storyResults.push({id:q.id,status:'cancelled',text,sem:s.sem});return false;});return removed;
}
export function nextFollowUp(s,eligible){
  const qs=s.storyQueue.filter(q=>q.due<=s.eventClock).sort((a,b)=>b.priority-a.priority||a.expires-b.expires||a.queuedAt-b.queuedAt);
  for(const q of qs){const e=EVENTS.find(e=>e.id===q.id);if(e&&eligible(s,e,true))return {...e,_follow:q};}return null;
}
export function rememberChoice(s,card,choice,outcome){
  initializeStory(s);const scope=card.storyScope||'run';Object.assign(flagsFor(s,scope),choice.setFlags||{},outcome?.setFlags||{});
  if(s.relationship&&choice.relationshipFlags)Object.assign(s.relationship.flags,choice.relationshipFlags);
  const performance=(choice.cadreEffect||0)+(outcome?.cadreEffect||0);
  if(s.cadre&&card.group==='cadre'){s.cadre.tasks=(s.cadre.tasks||0)+1;s.cadre.performance=Math.max(-8,Math.min(8,(s.cadre.performance||0)+performance));const record=s.cadreHistory.findLast(r=>r.role===s.cadre.role&&r.startSem===s.cadre.startSem);if(record)Object.assign(record,{tasks:s.cadre.tasks,performance:s.cadre.performance});}
  if(card.group==='romance'&&s.relationship)s.relationship.lastContact=s.calendarTick||0;
  if(choice.effectsMemory&&s.relationship)s.relationship.memories++;
  const spec=outcome?.followUp||choice.followUp;if(spec)queueFollowUp(s,{...spec,source:card.title},scope);
  if(card._follow){if(!spec)clearQueuedFlags(s,card._follow);s.storyQueue=s.storyQueue.filter(q=>!sameQueuedNode(q,card._follow));s.storyResults.push({id:card.id,status:'resolved',sem:s.sem,text:outcome?.text||choice.result});}
}
export function prepareStoryEvent(s,e){
  const card=structuredClone(e);const job=s.internship||internshipTerms(s),role=cadreRole(s.cadre?.role),words={internWeeks:job.weeks,internGross:job.gross,internCost:job.extraCost,internNet:job.net,...{partner:s.relationship?.person.name||'对方',role:role?.name||'学生干部',duty:role?.duty||'学生事务',competition:STORY_TOPICS[s.major]?.[0]||'校园实践赛',internship:STORY_TOPICS[s.major]?.[1]||'岗位实践',policyLine:(s.policy?.metricName||'排名')+'前 '+s.policy?.places+' 名',currentRank:s[s.policy?.metric]||s.rank}};
  if(s.sem>=14&&e.id==='ticket-home'){card.text='你选择了假期回家。早班车便宜一些，舒服的车次更贵；也可以改变安排，留在备考地。';card.choices[2].text='改为留在备考地，重新安排假期';card.choices[2].result='你没有购买车票，回家安排已取消。接下来重新选择假期活动。';}
  if(e.repeat&&e.storyScope&&s.scopedSeen[scopeKey(s,e.storyScope)+':'+e.id]!==undefined){const stage=s.sem<8?'大'+['一','二','三','四'][Math.floor(s.sem/2)]:'研究生第'+(Math.floor((s.sem-8)/2)+1)+'年';card.text=stage+'的安排已经不同。'+(e.storyScope==='relationship'?'你们目前的亲密度是'+s.relationship.intimacy+'，之前的沟通和承诺仍会影响相处。':e.storyScope==='cadre'?'你继续承担这一学年的职责，过去的反馈会影响同学的信任。':'这一次，你可以结合现在的安排重新选择。')+card.text;}
  const flags=flagsFor(s,e.storyScope||'run');const variant=e.variants?.find(v=>flags[v.flag]);if(variant)card.text=variant.text;
  const walk=x=>{if(typeof x==='string')return x.replace(/\{(partner|role|duty|competition|internship|policyLine|currentRank|internWeeks|internGross|internCost|internNet)\}/g,(_,k)=>words[k]);if(Array.isArray(x))return x.map(walk);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,walk(v)]));return x;};return walk(card);
}
export function markEventShown(s,e){
  initializeStory(s);s.eventContexts??={};s.eventContexts[contextKey(s,e)]=true;s.recentEvents=[...(s.recentEvents||[]),eventExposureKey(s,e)].slice(-18);if(e.storyScope)s.scopedSeen[scopeKey(s,e.storyScope)+':'+e.id]=s.eventClock;else s.seen[e.id]=s.sem;
  if(e.group==='romance')s.lastRomanceEvent=s.eventClock;
}
