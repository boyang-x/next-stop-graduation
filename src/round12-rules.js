import {option as o,link} from './round12-content-kit.js';
import {COMMON_CHAIN_SOURCES} from './round12-common.js';
export const OPTION_REVIEW=[];
export function reviseOptions(events){
 const replacements={
  'love-rain':['说明路况，改约校内有遮雨的地方','你们确认了新地点，没有让对方继续在雨中等候。'],
  'love-missed':['说明今天的困难，确认下次能做到的安排','你们讨论了具体安排，失约造成的损失仍需要后续行动修复。'],
  'love-small-habit':['说明自己需要适应，先约定一个小改变','你们确认了可以实行的调整，没有要求对方立刻接受全部习惯。'],
  'love-repair-check':['如实说明还没做到的部分，调整约定','你们核对了实际行动，未兑现的承诺没有被当成已经完成。'],
  'love-old-promise':['确认自己能承担的部分，取消不现实的约定','你提前说明了限制，双方按实际时间重新安排。'],
  'love-conflict-follow':['先把误会写清楚，约好方便时讨论','你提供了具体说明，本次没有宣称所有分歧都已解决。'],
  'bond-breakfast':['提前说明早课冲突，改约午饭','你们确认了新的安排，对方不必空等。'],
  'bond-hobby':['听对方介绍一次，说明自己想先了解','你尊重了对方的兴趣，没有承诺一定会喜欢同一种活动。'],
  'bond-quiet':['各自安静看书，结束时再聊一会儿','你们共同留出了安静的时间，也保留了交流。'],
  'bond-budget-new':['说明预算，建议一次免费的校内散步','你们选择了可以承担的安排，没有要求一方支付超出预算的费用。'],
  'bond-success':['认真听完，约好忙完后一起庆祝','你听到了对方的进展，庆祝安排仍待双方确认。'],
  'bond-phone':['说明自己要处理的事，忙完再继续聊天','你们知道这段时间的安排，没有把刷手机当成必须接受的相处方式。'],
  'bond-friends-new':['尊重聚会安排，另外约一个方便的时间','你们保留了各自朋友的聚会，也确认了之后的联系。'],
  'bond-ill-start':['询问需要什么帮助，说明自己能做的部分','你提供了具体支持，没有代替医务人员判断病情。'],
  'bond-ill-middle':['提前说明今天无法到场，帮忙联系可协助的人','对方知道了安排，必要帮助有了明确交接。'],
  'bond-ill-end':['先保持简短联系，等恢复后再见面','你尊重了恢复时间，没有把暂时少见面解释为感情结束。'],
  'bond-distance-start':['先核对双方日程，约一个可兑现的通话','你们确认了联系时间，没有承诺全天在线。'],
  'bond-distance-middle':['这周减少通话时长，提前说明原因','你们按实际负担调整联系，不用失联处理忙碌。'],
  'bond-distance-end':['明确下一阶段的安排，再观察是否合适','你们把讨论落实到时间和距离，尚未替未来作出保证。'],
  'bond-work-start':['说明自己的任务，先约一次简短联系','双方知道了这段时间的负担，保留了能够实行的安排。'],
  'bond-work-middle':['今天各自完成必要任务，晚上核对近况','你们留出了工作时间，也确认了之后的联系。'],
  'bond-work-end':['先恢复自己的作息，减少额外约会','你们共同降低安排强度，不把疲惫理解为不愿相处。'],
  'love-future-check':['先各自整理去向，约好下周再谈','你们确认了下一次讨论，不在信息不足时承诺长期安排。'],
  'love-campus-aero':['这次先各自完成任务，晚上再联系','你们说明了安排，没有让一方独自等待。'],
  'love-unexpected-conflict':['先暂停争论，约好明天再解释','你们确认了继续沟通的时间，问题还需要处理。'],
  'bond-pace':['说明白天不能随时回复，约好晚间联系','你说明了能做到的时间，没有承诺随时在线。'],
  'bond-exam':['说明自己也在备考，分享一份可用资料','你提供了有限但具体的支持，没有替对方决定该怎么做。'],
  'bond-signal':['本周先安排自己的事，下周只确认一次','你保留了明确联系时间，没有连续催问。'],
  'bond-failure':['今天先陪对方休息，明天再看反馈','你没有急着替对方解释失败，留出了恢复时间。'],
  'bond-alone':['尊重独处安排，约好方便时再联系','你们确认了下一次联系，各自保留休息空间。'],
  'bond-photo':['这次不拍合影，拍一张花园风景','你说明了自己的意愿，双方保留各自的拍照选择。'],
  'bond-chores':['说明时间冲突，联系负责人协商交接','负责人确认了交接方式，物品去向和责任仍然明确。'],
  'bond-birthday':['先送上祝福，等忙完再约一次见面','你尊重了对方当前安排，也记住了这个日子。'],
  'bond-opinion':['说明今天有些累，换个轻松话题','你们保留了不同喜好，没有把评价变成争执。'],
  'bond-busy':['这周先保持短时通话，下周再约见面','你们确认了过渡安排，不把忙碌变成无限等待。'],
  'bond-miss-start':['先说明今天难以见面，约好明天沟通','已经发生的失约损失保留，你说明了接下来能做到的安排。'],
  'bond-miss-middle':['说明任务仍未完成，提前取消并另约时间','你们确认了取消，不让对方再次空等。'],
  'bond-miss-end':['先保留较少的约定，下周核对是否能兑现','你们缩小了安排，修复仍需要之后的行动。'],
  'bond-hurt-start':['先承认措辞不合适，约好冷静后再谈','已经发生的伤害不会立即消失，你明确了继续沟通的时间。'],
  'bond-hurt-middle':['先说明自己的感受，再听对方解释','你们讨论具体误会，不继续比较谁更值得被喜欢。'],
  'bond-hurt-end':['放慢修复节奏，先兑现一个小约定','你们保留了可执行的安排，信任仍需逐步建立。'],
 };
 for(const [id,[text,result]] of Object.entries(replacements)){
  const event=events.find(e=>e.id===id);if(!event)continue;const before=structuredClone(event.choices[2]);
  event.choices[2]=o(text,result,{energy:-3,mood:1,...(event.dating?{intimacy:1}:{})},event.candidate?{candidateDelta:{trust:2}}:{});
  if(id==='love-rain'){event.choices[2].setFlags={promised:false,met:true};event.choices[2].followUp={id:'love-future-check',scope:'relationship',after:1,expires:12};}
  OPTION_REVIEW.push({id,index:2,before,after:structuredClone(event.choices[2]),reason:'改为有明确安排的正常选择，删除恶意或无解释失联选项'});
 }
 const privacy=events.find(e=>e.id==='bond-privacy');
 if(privacy){privacy.title='联系安排怎样兼顾各自日程';privacy.text='你和{partner}想协调见面与联系。双方的课程和工作安排不同，需要说明哪些信息便于共同安排。';privacy.choices=[
  o('各自列出方便见面的时段，一起确认','你们确认了可以兑现的时间，没有要求共享密码。',{energy:-5,mood:3,intimacy:4}),
  o('先约固定通话，重要安排主动说明','你们找到了可行的联系办法，保留各自私人空间。',{energy:-4,mood:3,intimacy:3}),
  o('这周先用简短联系，下周重新核对空档','你们给过渡安排设了明确期限。',{energy:-3,mood:2,intimacy:2})];OPTION_REVIEW.push({id:privacy.id,reason:'替换强求密码主题，三个方案都有可执行的联系安排'});}
 const incidentThird={
  cold:['遵医嘱处理，先请负责人协助调整任务','你按医嘱休整，把必要交接交给可以协助的人。',{energy:14,mood:2}],
  noise:['向管理人员核实结束时间，只做必要的轻量任务','你说明了睡眠受影响的情况，减少了额外负担。',{energy:6,mood:2}],
  device:['联系维修点确认问题，先借设备提交关键材料','你先完成关键交付，本次尚未付款或完成维修。',{energy:-6,mood:2}],
  teammate:['只完成原分工，说明其他部分需要重新安排','负责人知道了缺口，没有把全部新增工作交给你。',{energy:-6,mood:2}],
  wallet:['暂停非必要消费，先核对本周支出','你保留正规协商渠道，暂时按未追回资金安排预算。',{energy:-2,mood:1}],
  family:['约一个方便通话的时间，今天先完成必要安排','家人知道了你的时间，联系没有无期限地中断。',{energy:-3,mood:3}],
  friend:['把各自承担的部分写清楚，再讨论误会','你们把问题落实到分工，不继续争论谁付出更多。',{energy:-5,mood:3}],
  rejection:['保存反馈，本周先投入另一项已确定的任务','你保留了以后修改的机会，不把一次拒绝扩大为全部失败。',{energy:-5,mood:2}],
  sprain:['按医嘱减少活动，联系负责人调整必须到场的事项','你停止剧烈运动，必要事务有了明确交接。',{energy:12,mood:2}],
  deadline:['明确只能按原约定完成的部分，请负责人决定优先级','你说明了现实负担，不承诺同时完成超出能力的任务。',{energy:-7,mood:2}],
  rumor:['保存原消息，私下联系当事人核对','你提供上下文，不在群里增加新的猜测。',{energy:-4,mood:2}],
  'rain-damage':['联系接收方确认补交时间，先把电子文件保存好','你说明了情况，本次没有额外打印费。',{energy:-4,mood:1}],
 };
 for(const event of events.filter(e=>e.id.startsWith('incident-')&&e.arrivalEffects)){
  const [text,result,effects]=incidentThird[event.id.slice(9)];OPTION_REVIEW.push({id:event.id,index:2,before:event.choices[2],reason:'删除统一的勉强完成全部任务选项'});event.choices[2]=o(text,result,effects,{incidentFollow:true});
  if(event.id==='incident-friend')event.text='你和朋友对合作分工的理解不同，双方都觉得自己的时间没有被充分考虑。已发生的变化：心情−16、精力−6。';
  if(event.id==='incident-friend'){event.choices[0].text='说明自己的理解，重新讨论分工';event.choices[0].result='你们核对了各自理解，把分工写成可以实行的约定。';}
 }
}
export function installContentChains(events){
 for(const [source,id] of COMMON_CHAIN_SOURCES){
  const event=events.find(e=>e.id===source);if(!event)throw Error('Missing chain source '+source);
  const index=source==='intern-info'?1:0;event.repeat=false;event.storyScope='run';
  event.choices[index].setFlags={...event.choices[index].setFlags,['r12-'+id+'-started']:true};event.choices[index].followUp=link(id+'-0');
  event.choices[index].note=(event.choices[index].note?event.choices[index].note+' · ':'')+'这次行动之后有相关后续';
 }
 const bands={first:[8,9],direction:[8,9],paper:[8,9],reproduce:[9,10,11],data:[9,10,11],meeting:[9,10,11],submit:[10,11,12],revise:[10,11,12,13],intern:[10,11,12],teaching:[8,9,10,11],team:[9,10,11],poster:[10,11,12,13],course:[8,9],alumni:[10,11,12,13],thesis:[11,12,13],balance:[8,9,10,11,12,13],grant:[9,10,11],review:[10,11,12,13],method:[9,10,11],demo:[10,11,12,13]};
 for(const [suffix,semesters] of Object.entries(bands)){const event=events.find(e=>e.id==='grad-'+suffix);if(event)event.semesters=semesters;}
 for(const id of ['grad-reproduce','grad-data','grad-method'])events.find(e=>e.id===id).majors=['cs','aerospace','mechanical','psychology','finance','accounting'];
 const submit=events.find(e=>e.id==='grad-submit');submit.requiresFlags=['r12-manuscript'];submit.text='你已有一份整理过的稿件。本次先核对证据、署名和结论范围，投稿后仍需要等待评审，不能立刻算发表。';
 submit.choices[0]=o('核对后提交稿件，等待评审','投稿已提交，后续收到评审意见；目前没有发表成果。',{energy:-18,study:3},{setFlags:{'r12-old-submitted':true},followUp:{id:'grad-revise',after:0,afterWeeks:4,expiresWeeks:24,expires:30}});
 const revise=events.find(e=>e.id==='grad-revise');revise.followOnly=true;revise.requiresFlags=['r12-old-submitted'];revise.text='此前提交的稿件收到修改意见。你需要完成回应和修改，再查看编辑对本轮修改稿的决定。';
 revise.choices[0].success.text='你完成修改并提交，编辑确认接收稿件；完成校样核对并收到线上发表确认后，获得一份发表成果记录。';
 const stricter={
  'incident-teammate':{taskContext:'collaboration'},'incident-rejection':{taskContext:'application'},'incident-deadline':{minActiveTasks:2},
  'incident-sprain':{recentExercise:true},'incident-wallet':{minBalance:80},'incident-rumor':{taskContext:'expression'},'incident-rain-damage':{taskContext:'materials'},
 };
 for(const [id,conditions] of Object.entries(stricter))Object.assign(events.find(e=>e.id===id),conditions);
 const rejection=events.find(e=>e.id==='incident-rejection');rejection.followOnly=true;delete rejection.taskContext;
}
export function lengthenPeriods(events){
 for(const event of events){
  if(event.id.startsWith('r12-'))continue;
  if(event.duration!==0)event.duration=event.category==='project'?6:event.category==='study'?5:4;
  if(event.group==='graduate'&&event.duration!==0)event.duration=event.category==='project'?10:event.category==='study'?8:4;
  if(['dorm-first','coffee','lost-card','family-call','old-friend'].includes(event.id))event.duration=1;
  for(const choice of event.choices)if(choice.duration===undefined&&choice.effects?.energy>5)choice.duration=event.group==='graduate'?4:3;
 }
}
