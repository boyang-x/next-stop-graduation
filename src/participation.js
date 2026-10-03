import {awardCredit,AWARD_POINTS,CERTIFICATE_POINTS} from './score-ledger.js';
import {academicYear} from './calendar.js';
import {changeMood} from './balance-rules.js';
export const PROGRAM_TYPES={
  english:{name:'英语能力考试',certificate:'英语证书',base:.54,fee:80},
  mandarin:{name:'普通话测试',certificate:'普通话证书',base:.62,fee:60},
  accounting:{name:'财会专业证书考试',certificate:'财会证书',base:.48,fee:180},
  campus:{name:'校级实践竞赛',level:'campus',base:.62,fee:80},
  province:{name:'省级专业竞赛',level:'province',base:.42,fee:160},
  national:{name:'全国专业竞赛',level:'national',base:.24,fee:260},
};
export function registerProgram(s,type,roll,{ready=false,family=null}={}){
  const requested=type;
  if(type==='relevant')type=['finance','accounting'].includes(s.major)?'accounting':s.major==='language'||s.major==='education'?'mandarin':'english';
  const spec=PROGRAM_TYPES[type];if(!spec||!ready&&s.programs?.some(p=>p.type===type&&['preparing','awaiting'].includes(p.status)))return null;
  const paid=ready?0:Math.abs(s.card?.choices?.find(c=>c.action==='program:'+requested||c.action==='programUpgrade:'+requested)?.effects?.balance??spec.fee);
  s.programs??=[];const record={id:'program-'+(++s.sequence),type,name:spec.name,sem:s.sem,year:academicYear(s),status:ready?'awaiting':'preparing',prepared:ready?1+(s.plotFlags?.competitionPrepared?1:0):0,due:s.eventClock+1,roll,feePaid:paid,family};record.family??=record.id;s.programs.push(record);return record;
}
export function programAvailable(s,type){
  if(type==='relevant')type=['finance','accounting'].includes(s.major)?'accounting':s.major==='language'||s.major==='education'?'mandarin':'english';
  return !s.programs?.some(p=>p.type===type&&['preparing','awaiting'].includes(p.status));
}
export function programAction(s,action){
  const p=s.programs?.find(x=>x.id===s.card?.programId);if(!p||p.status!=='preparing')return;
  if(action==='programWithdraw'){p.status='withdrawn';p.result='主动退出，报名费已支付，不退费，不获得证书或综测分。';return;}
  p.prepared=action==='programPrepare'?2:1;p.status='awaiting';p.due=s.eventClock+1;
}
export function nextProgramCard(s,{random,addHistory,updateRanks,log}){
  const p=s.programs?.find(x=>['preparing','awaiting'].includes(x.status)&&(s.programFinalizing||x.due<=s.eventClock||s.month>=5));if(!p)return null;
  const spec=PROGRAM_TYPES[p.type];
  if(p.status==='preparing')return {id:'program-prepare',programId:p.id,kind:'choice',group:'milestone',category:spec.level?'project':'study',consume:!s.programFinalizing&&s.month<5,duration:Math.min(2,Math.max(1,20-s.month*4-(s.week||0))),title:p.name+' · 准备阶段',text:'报名已记录，费用已支付。接下来需要实际准备并参加，才会公布结果。主动退出不退报名费。',choices:[
    {text:spec.level?'整理作品，完成一次答辩演练':'完成专项复习和一套模拟题',effects:{study:3,energy:spec.level?-16:-12,mood:-2},action:'programPrepare',result:'你完成了针对性的准备，下一阶段按时参加并等待结果。'},
    {text:spec.level?'完成基本作品，按时提交并参赛':'核查考试要求，按现有准备参加',effects:{energy:-8},action:'programBasic',result:'你完成基本准备并按时参加，接下来等待结果。'},
    {text:'退出本次报名，把时间留给其他安排',effects:{mood:-2},action:'programWithdraw',result:'本次报名已退出，报名费不退，不领取证书、奖项或综测分。'},
  ]};
  const probability=Math.max(.05,Math.min(.9,spec.base+p.prepared*.08+(s.gpa-78)*.008+(s.energy-50)*.001));
  p.probability=probability;p.status='settled';p.settledSem=s.sem;
  let points=0;
  if(spec.certificate){
    p.passed=p.roll<probability;p.score=Math.round(p.passed?60+(1-p.roll/probability)*35:35+(1-p.roll)*24);
    if(p.passed){addHistory(s,spec.certificate,p.name+' · '+p.score+'分');points=awardCredit(s,{key:'certificate:'+spec.certificate,category:'certificate',points:CERTIFICATE_POINTS[spec.certificate],label:p.name+'通过',year:p.year});}
    p.result=`模拟成绩 ${p.score} 分，${p.passed?'通过，获得'+spec.certificate:'未通过；可以根据薄弱项再次准备'}。`;
  }else{
    p.rank=p.roll<probability?(p.roll<probability*.15?1:p.roll<probability*.45?2:3):null;
    if(p.rank){addHistory(s,'竞赛获奖',p.name+' · '+['一等奖','二等奖','三等奖'][p.rank-1]);points=awardCredit(s,{key:p.id,category:'competition',points:AWARD_POINTS[spec.level][p.rank-1],label:p.name+' · '+['一等奖','二等奖','三等奖'][p.rank-1],year:p.year,family:p.family||p.id});}
    p.result=p.rank?'获得'+['一等奖','二等奖','三等奖'][p.rank-1]+'。':'作品完成参赛，未获奖。评审反馈已记录，参赛本身不增加综测。';
  }
  p.credit=points;const beforeMood=s.mood;changeMood(s,p.passed||p.rank?6:-8);updateRanks(s);
  const text=p.result+(points?`本学年综测 +${points} 分。`:'本次综测不增加（未通过、未获奖、重复证书或已达到分类上限）。');log(s,p.name+' · 结果',text,'notice',{effects:{credit:points,mood:Math.round((s.mood-beforeMood)*10)/10}});
  return {id:'program-result',programId:p.id,kind:'notice',title:p.name+' · 结果公布',text};
}
export function nextCompetitionUpgrade(s){
 if(s.programFinalizing||s.sem>=14||s.month>=4)return null;
 const p=s.programs?.find(x=>x.status==='settled'&&x.rank&&['campus','province'].includes(x.type)&&!x.upgradeOffered&&x.sem===s.sem);if(!p)return null;
 p.upgradeOffered=true;const type=p.type==='campus'?'province':'national',spec=PROGRAM_TYPES[type];
 return {id:'program-advance',programId:p.id,kind:'choice',group:'milestone',category:'project',consume:true,duration:1,title:'获奖作品，可以继续参赛吗',text:`${p.name}的获奖作品获得了报名${spec.name}的机会。沿用同一作品，报名费${spec.fee}元；后续仍有准备和结果。获更高奖项只增加超过该作品已计分数的差额，未获奖保留原奖项。`,choices:[
  {text:'支付报名费，用这份作品参加进阶赛',effects:{balance:-spec.fee,energy:-3},action:'programUpgrade:'+type,result:'同一作品的进阶报名已记录，之后准备并等待正式结果。'},
  {text:'本次不继续参赛，保留原来的奖项',effects:{mood:1},result:'你保留了已获得的奖项与综测，把时间留给其他安排。'},
  {text:'先根据反馈改进作品，暂不继续报名',effects:{study:2,energy:-8},result:'你完成了一次改进，不新增报名费，也不把修改本身算作新奖项。'},
 ]};
}
export function installParticipation(events){
  const conversion={'english':[0,'english'],'normal-language':[0,'mandarin'],'acc-cert':[0,'accounting'],'year-certificate':[0,'relevant'],'competition':[0,'campus']};
  for(const [id,[index,type]] of Object.entries(conversion)){
    const event=events.find(e=>e.id===id);if(!event)continue;const c=event.choices[index],spec=PROGRAM_TYPES[type];
    c.text=type==='relevant'?'报名一项与专业相关的证书考试，等待准备安排':'支付报名费，报名'+spec.name;
    c.effects={balance:-(spec?.fee||180),energy:-3};
    // Relevant exam uses one explicit registration fee, regardless of the selected certificate.
    c.action='program:'+type;c.note='报名后有准备和结果公布；通过或获奖才按规则增加综测。';c.result='报名已确认，接下来安排准备和结果公布。';
    delete c.probability;delete c.success;delete c.failure;delete c.followUp;
    event.text=type==='relevant'?'学校公布了与专业相关的证书考试报名。游戏中报名费180元，报名后需要实际准备并参加；首次通过才加综测，重复证书不重复计分。':`${spec.name}开始报名，报名费${spec.fee}元。报名之后还有实际准备和结果公布；${spec.level?'正式获奖':'首次通过'}才按规则加综测。`;
  }
  const final=events.find(e=>e.id==='competition-final');
  if(final)for(const c of final.choices){
    c.action='programReady:campus';c.note='完成答辩后等待正式结果，获奖级别与综测分在公布时结算。';
    c.result='你完成了答辩，评审意见已经提交，下一阶段公布正式结果。';
    delete c.probability;delete c.success;delete c.failure;
    for(const key of ['tags','activity','mood'])if(c.effects)delete c.effects[key];
    c.setFlags={competitionActive:false};
  }
  const services={'volunteer':1,'sports-day':1,'year-sports-day':1,'scholarship-plan':.5,'normal-child':1,'support-follow':.5,'student-show':.5,'public-project':1};
  for(const [id,points] of Object.entries(services))for(const c of events.find(e=>e.id===id)?.choices||[])if(c.effects?.tags?.includes('志愿服务')){c.credit={category:'service',points,label:'完成正式志愿服务'};c.note=(c.note?c.note+' · ':'')+'完成后综测 +'+points+'分，正式服务每学年最高5分';}
  const leader=events.find(e=>e.id==='club-leader')?.choices[0];if(leader){leader.credit={category:'organization',points:1.5,label:'完成社团活动组织'};leader.note='完成组织工作后综测 +1.5分，活动组织每学年最高6分';}
  events.push({id:'tiered-competition',group:'common',category:'project',undergraduateOnly:true,storyScope:'run',repeat:false,title:'选择一项正式赛事',text:'学校公布了本年度实践竞赛。报名费含材料与评审安排；报名之后还有准备和结果公布。级别越高，竞争越激烈。',choices:['campus','province','national'].map((type,i)=>({text:'报名'+PROGRAM_TYPES[type].name+'（¥'+PROGRAM_TYPES[type].fee+'）',effects:{balance:-PROGRAM_TYPES[type].fee,energy:-3},action:'program:'+type,result:'报名已记录，你开始安排作品准备。',note:'获奖综测：'+AWARD_POINTS[type].slice().reverse().join('／')+'分（三／二／一等奖）',...(i===2?{requiresAnyTags:['竞赛获奖']}:{} )}))});
}
