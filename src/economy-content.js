export function applyEconomyContent(events){
  const get=id=>events.find(e=>e.id===id);
  for(const [id,index,credit] of [['budget',0,180],['finance-budget',0,200]]){
    const c=get(id)?.choices[index];if(c){delete c.effects.balance;c.effects.mood=3;c.result='你核对了接下来要买的东西，决定暂缓几笔不急用的开销。';}
  }
  const market=get('campus-market')?.choices[0];if(market){delete market.effects.balance;market.action='sellUnused';market.text='卖掉自己的一本闲置教材';market.result='这本教材以 ¥120 找到了新主人，同一件物品只能卖一次。';}
  for(const [id,index,key] of [['money-family',0,'extra-family'],['balance-low',0,'extra-grant']]){const c=get(id)?.choices[index];if(c)c.onceKey='term:'+key;}
  // Every paid internship goes through the same application/work/handover model.
  for(const id of ['intern-info','summer-plan']){
    const e=get(id);if(e){e.minSem=Math.max(2,e.minSem||0);e.maxSem=12;if(id==='summer-plan'){e.title='一段实习机会的分岔口';e.text='同学转来一段实习机会。申请之后，需要实际工作与交接才能获得报酬。';}}
    const c=e?.choices[0];if(c?.success){c.success={text:'申请得到回应，你将经历实际工作和交接，完成后才结算报酬。',action:'startInternship:local'};}
  }
  const application=get('internship-apply');if(application){
    application.text='你申请了{internship}。这次计划工作{internWeeks}周，报酬与额外通勤、住宿费用会在交接时一并结算。';
    application.choices[0].success.action='startInternship:local';
    application.choices[1]={text:'申请跨城岗位，接受额外住宿与通勤',effects:{energy:-7},probability:{base:.56,grade:.003,tags:{校友联系:.08}},success:{text:'跨城实习申请通过。额外费用按每周 ¥180 计算，交接时从工资中扣除。',action:'startInternship:remote'},failure:{text:'这次没有匹配上跨城岗位。你保留了反馈与下一次申请的空间。',effects:{study:1}}};
  }
  const work=get('internship-work');if(work)work.text='{internship}的负责人改了需求。这段实习计划工作{internWeeks}周，预计总报酬 ¥{internGross}，额外通勤、住宿 ¥{internCost}。你已经有一个初稿，需要确认交付方式。';
  const end=get('internship-end');if(end){
    for(const c of end.choices){delete c.effects.balance;c.effects.tags=(c.effects.tags||[]).filter(t=>t!=='实习经历');c.action='finishInternship';c.result='你完成了交接。实际工作{internWeeks}周，报酬 ¥{internGross}，额外成本 ¥{internCost}，净到账 ¥{internNet}，这段经历进入求职档案。';}
    end.text='工作进入交接阶段。{internship}已经完成的职责与报酬，需要最后确认。';
  }
}
const op=(text,effects,result,extra={})=>({text,effects,result,...extra});
const scene=(id,title,text,choices,extra={})=>({id,title,text,choices,group:'common',category:'life',repeat:false,storyScope:'run',minSem:0,maxSem:13,...extra});
export const ECONOMY_EVENTS=[
  scene('budget-registration','一个需要报名费的机会','同学邀请你参加一次校外实践，报名、交通和住宿分别收费。值得不值得，需要先看清自己能得到什么。',[
    op('核对内容，报名参加完整活动',{balance:-260,energy:-6,study:3},'你参加了有实际内容的实践，也记录了这次费用。'),
    op('选择免费的线上分享',{study:2,energy:-3},'你听到了同样的主题，少了现场交流，也保住了预算。'),
    op('暂不报名，自己整理相关资料',{study:2},'这次你选择用时间做准备。'),
  ],{minSem:2}),
  scene('budget-interview-trip','面试地点在另一座城市','一场面试邀请需要交通和住宿，你要同时考虑机会与预算。',[
    op('购买车票，安排一晚基础住宿',{balance:-680,energy:-8,tags:['求职经历']},'你按预算完成跨城面试，留下了一次现场交流的经历。'),
    op('询问能否先进行线上面试',{energy:-4,tags:['求职经历']},'对方安排了线上初谈，后续是否到场再决定。'),
    op('暂不远行，优先准备本地岗位',{study:2},'你把准备集中在更容易到达的机会。'),
  ],{minSem:6,maxSem:13}),
  scene('budget-graduation-move','宿舍里的东西，比想象中多','毕业临近，快递箱、行李和旧教材占满了床边。寄走、带走和留下，费用各不相同。',[
    op('打包邮寄常用物品',{balance:-220,energy:-3},'你保留了真正会继续使用的东西，支付了搬运与寄送费用。'),
    op('和朋友拼一趟车，自己搬行李',{balance:-80,energy:-8},'你们共同安排搬运，费用降低了，也花了一些力气。'),
    op('捐出闲置，轻装离开',{energy:-6,mood:3},'一些物品留给了需要的人，你只带走必要行李。'),
  ],{minSem:7,maxSem:13,semesters:[7,13]}),
];
