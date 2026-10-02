export function upgradeContent({SCHOOLS,MAJORS,TAGS,EVENTS,PEOPLE,JOBS,QUESTIONS}) {
  Object.assign(SCHOOLS[0],{majors:['cs','aerospace','mechanical','humanities'],cohortMean:82,quota:.2});
  Object.assign(SCHOOLS[1],{name:'京师文理大学',short:'京师',type:'师范综合',cohortMean:82,quota:.2});
  Object.assign(SCHOOLS[2],{name:'华京人文大学',short:'华人',type:'人文经管',majors:['finance','accounting','language','humanities','cs'],cohortMean:82,quota:.2});
  MAJORS.humanities={name:'精品文科 · 人文与公共管理',category:'humanities',tag:'政策调研'};
  for(const [name,type] of [['科研接触','学习'],['政策调研','成果'],['公共表达','校园'],['资助经历','生活'],['学业互助','学习'],['毕业论文','成果']])TAGS[name]={name,type};
  TAGS['学生干部经历']={name:'学生干部经历',type:'校园'};
  for(const p of PEOPLE)p.gender='female';
  PEOPLE.push(...[['yan','严知远','京州',false],['chen','陈向晨','江城',false],['jiang','江予川','海州',false],['shen-m','沈景舟','海州',true],['he','何星野','京州',false],['xu-m','许清和','江城',false]].map(([id,name,city,rich])=>({id,name,city,rich,gender:'male'})));
  const op=(text,effects,result,extra={})=>({text,effects,result,...extra});
  const spare=(text,result)=>op(text,{},result,{freeTimeGain:1});
  // Each missing option has an authored intent and consequence; attitude choices do not earn time.
  const thirds=[
    ['morning','给室友发消息，课后补上笔记',{study:1,energy:3},'没有赶上开头，但你约好了课后补学。'],
    ['english','和同学一起做一套诊断卷',{study:3,energy:-5},'先弄清薄弱点，再决定下次报名。'],
    ['canteen','跳过新品测评，把空档留给自己',{},'你吃完日常套餐，下午少了一段排队。',{freeTimeGain:1}],
    ['volunteer','这次不参加，也不安排复习',{},'你没有获得志愿经历，腾出了一个下午。',{freeTimeGain:1}],
    ['parttime','先体验一次短班',{balance:180,energy:-5,tags:['兼职经历']},'你了解了工作，不必马上承担长期排班。'],
    ['tutoring','旁听同学的试课，暂不接单',{study:2,energy:-4},'你看见了备课之外还需要什么。'],
    ['student-show','不参与这次演出，留出晚上',{},'舞台继续热闹，你把这段时间留给自己。',{freeTimeGain:1}],
    ['lost-card','请室友一起回忆路线，再补办',{balance:-25,mood:3},'卡没有立即找到，但有人陪你处理麻烦。'],
    ['photography','放弃投稿，保留这个空档',{},'照片仍在相册，这次没有参赛。',{freeTimeGain:1}],
    ['reading','把不同意见整理成读书会问题',{activity:2,study:1,energy:-4},'你把一个人的阅读变成了共同讨论。'],
    ['family-call','约定周末长聊，今天先说明近况',{mood:4},'你没有敷衍，也守住了今天的安排。'],
    ['sports-day','这次不报名，把时间留出来',{},'你不承担比赛或志愿排班。',{freeTimeGain:1}],
    ['old-friend','提前说清安排，改约下次',{mood:2},'对方知道了你的时间，没有白跑一趟。'],
    ['secondhand','先翻目录，再去图书馆核对版本',{study:3,energy:-3},'旧书的重点有用，但新版课程也需要确认。'],
    ['weekend-sleep','约朋友做一次轻松运动',{energy:9,mood:6,tags:['运动习惯']},'你没有加班复习，也没有整天躺着。'],
    ['intern-return','核查实习案例中的保密边界',{study:2,tags:['求职经历']},'你只讨论可公开的部分，保留了职业边界。'],
    ['club-leader','不接任，也不安排额外任务',{},'你交接了材料，空出了这一段时间。',{freeTimeGain:1}],
    ['alumni-meet','跳过分享会，留出晚上',{},'你暂时错过了岗位信息，但安排变宽松了。',{freeTimeGain:1}],
    ['public-project','只帮一次资料整理',{activity:1,energy:-3},'你的参与很有限，任务边界却很清楚。'],
    ['essay','不写这次参赛稿，腾出周末',{},'你没有交作品，保留了一段空闲。',{freeTimeGain:1}],
    ['fresh-help','帮对方联系班级志愿者',{activity:1,mood:2},'对方找到了更熟悉具体安排的人。'],
    ['coffee','离开咖啡店，不给下午安排任务',{},'你没有消费，也没有把休息变成学习任务。',{freeTimeGain:1}],
    ['course-choice','先旁听，再决定下学期是否选修',{study:2,mood:2},'这次没有抢名额，但你了解了课程。'],
    ['room-conflict','请寝室长主持一次具体协商',{mood:3,tags:['校园活动']},'你们把问题写成了可执行的约定。'],
    ['scholarship-plan','整理往年的评选材料',{study:2,activity:1},'你分清了成绩与活动各自的作用。'],
    ['study-friend','约一次互相讲题',{study:3,energy:-4,tags:['学业互助']},'你们没有长期绑定，先试一次互相解释。'],
    ['recruit-talk','对照职位要求修改一版简历',{study:1,energy:-5,tags:['求职经历']},'要求变成了可以准备的具体事情。'],
    ['book-exchange','不交换，记下书名以后再读',{mood:2},'你没有为了加入活动打乱自己的阅读。'],
    ['pet-cat','联系已有的校园动物志愿组',{activity:2,tags:['志愿服务']},'照顾有了连续安排，而不只是一时投喂。'],
    ['campus-market','不摆摊，留出这个周末',{},'闲置物品还在，你换来了一段空闲。',{freeTimeGain:1}],
    ['health-day','找朋友陪你调整一周安排',{energy:11,mood:8},'你删掉了不必要的任务，也找到支持。'],
    ['community-talk','把意见整理成匿名建议',{activity:2,tags:['公共表达']},'表达离开了现场，仍进入了讨论。'],
    ['mystery-envelope','把发现写成校刊短文',{study:1,tags:['创作经历']},'你隐去私人信息，留下了对校园旧日的想象。'],
    ['aero-roll','发起一次互相讲题',{study:4,energy:-7,tags:['学业互助']},'大家讲不明白的地方，才是需要补的地方。'],
    ['aero-lab','不参与这次调试，腾出晚上',{},'你没有获得模型成果，晚上仍属于自己。',{freeTimeGain:1}],
    ['aero-flight','只做误差分析，不承担现场工作',{study:3,energy:-4},'你从记录里练习了工程判断。'],
    ['aero-social','不报名，也不给周末安排任务',{},'这次没有认识跨校同学，但你保留了空闲。',{freeTimeGain:1}],
    ['aero-museum','做一份展品背后的政策小报告',{study:2,tags:['公共表达'],energy:-5},'技术展品也有历史和公共决策背景。'],
    ['aero-presentation','缩小结论，先提交可靠的部分',{study:2,activity:2},'你没有夸大成果，讨论变得更具体。'],
    ['aero-talent','不参加筹备，空出这次排练',{},'装置由别人接手，你没有拿到活动经历。',{freeTimeGain:1}],
    ['aero-gym','改约下次，今天不再加任务',{},'你保留了这段时间，不需要每次都赶满。',{freeTimeGain:1}],
    ['aero-senior','整理自己的失败记录再提问',{study:4,energy:-5},'问题越具体，得到的建议越有用。'],
    ['aero-countdown','提交简化但可验证的方案',{study:3,activity:1,energy:-4},'范围变小，论证没有打折。'],
    ['normal-demo','旁听同学试讲并给具体反馈',{study:2,activity:2,tags:['学业互助']},'你学到了不同的课堂组织方式。'],
    ['normal-language','推迟报名，先建立练习计划',{study:2},'你没有拿到证书，准备仍然继续。'],
    ['normal-stage','不参加排练，腾出这次晚上',{},'你错过了新朋友，也留下了自己的时间。',{freeTimeGain:1}],
    ['normal-school','只完成一次观察访谈',{study:2,tags:['科研接触']},'接触学校与真正承担教学仍有区别。'],
    ['normal-class','收集参与者反馈后修改方案',{activity:3,study:1,tags:['公共表达']},'主题终于回应了学生真正关心的问题。'],
    ['normal-love-letter','征得双方同意后组织一次介绍',{activity:1,mood:4},'你没有替任何人决定感情。'],
    ['normal-child','这次不参加，空出周末',{},'课堂由其他同学接手，你没有获得实践。',{freeTimeGain:1}],
    ['normal-books','离开书展，把下午留给自己',{},'喜欢的书可以下次再找。',{freeTimeGain:1}],
    ['normal-job','对照岗位写一份准备清单',{study:2,tags:['求职经历']},'证书、试讲与学业要求分清了先后。'],
    ['normal-music','不加入节目，留出排练时段',{},'你祝他们演出顺利，保留了自己的空档。',{freeTimeGain:1}],
    ['finance-stock','只研究风险，不参加排名赛',{study:3,energy:-4},'你认识了收益之外的代价。'],
    ['finance-intern','筛掉不合适岗位，少投但认真准备',{study:2,tags:['求职经历']},'你没有把投递数量当成唯一成绩。'],
    ['finance-case','担任资料核验，缩小参与范围',{study:2,activity:2},'你的工作有限，却保证了材料可信。'],
    ['finance-account','从原始凭证重新追踪',{study:4,energy:-5},'你没有用一个调整数字掩盖差异。'],
    ['finance-coffee','不参加讨论，腾出这个空档',{},'你少了一次信息交流，也省下一段时间。',{freeTimeGain:1}],
    ['finance-budget','停止预算比赛，保留基本记账',{mood:4},'消费不必每一笔都与别人比较。'],
    ['finance-fair','不参加摆摊，留出周末',{},'没有营业收入，也没有筹备负担。',{freeTimeGain:1}],
    ['finance-audit','写出异常解释的备选假设',{study:3,tags:['深度阅读']},'异常还不是结论，需要证据区分假设。'],
    ['finance-invite','只听不投，先确认工作内容',{study:1,mood:3},'你允许自己暂时没有答案。'],
    ['finance-pitch','只展示验证过的核心结论',{study:2,activity:2},'三分钟里没有夸大的承诺。'],
    ['love-meet','一起完成收尾，暂不交换联系方式',{activity:1,mood:4},'相遇留在校园日常里，未必必须变成恋爱。'],
    ['love-invite','明确暂时不考虑恋爱',{mood:2},'你说明了自己的意愿，回到普通朋友的关系。',{action:'clearCandidate'}],
    ['love-walk','一起商量各自独处的时间',{mood:5,tags:['共同回忆']},'亲密也可以包含彼此的空间。',{action:'strengthen'}],
    ['love-break','再听清分歧，不强求改变决定',{mood:-3,tags:['分手经历']},'你理解了结束的原因，关系正式结束。',{action:'breakup'}],
    ['love-gift','一起做一顿简单的饭',{balance:-35,mood:6,tags:['共同回忆']},'礼物变成了两个人共同完成的事情。',{minBalance:35,action:'strengthen'}],
    ['love-rich','约定大额支出必须先商量',{mood:5,tags:['富裕恋人','共同回忆']},'家境没有替你们决定关系的边界。',{action:'revealRich'}],
    ['love-trip','各自出游，回来分享见闻',{mood:4},'不同的安排没有自动变成感情分歧。'],
    ['love-support','考完再约，暂时减少聊天',{study:3,energy:3},'你说清了时间，对方不必猜测沉默。'],
    ['single-choice','不解释，把话题转回朋友的近况',{mood:4},'你的感情安排不需要公开答辩。'],
    ['old-love','点头致意，不再重新打开旧事',{mood:3},'你没有否认过去，也没有重复过去。'],
  ];
  for(const [id,text,effects,result,extra] of thirds){const e=EVENTS.find(e=>e.id===id);if(e)e.choices.push(op(text,effects,result,extra));}
  for(const id of ['free-meal','unexpected-award']){const e=EVENTS.find(e=>e.id===id);e.choices.push(op('把这份好运分享给朋友',{mood:5},'你没有把所有幸运都留给自己。'),op('礼貌拒绝，按原计划继续',{mood:2},'没有额外奖励，你仍然过自己的生活。'));}
  const lottery=EVENTS.find(e=>e.id==='lottery');lottery.choices=[op('去柜台看看不同面值的票',{},'你留出了一点时间，准备看看票种。',{freeTimeGain:1,action:'browseLottery'}),op('不买，和朋友聊聊中奖故事',{mood:3},'你们都知道故事常常只说中奖的那几张。'),spare('不买，把这个空档留给自己','你没有消费，剩下的时间仍可以自己安排。')];
  const part=EVENTS.find(e=>e.id==='parttime').choices[1];part.effects={};part.freeTimeGain=1;
  // Exposure is not a completed research project.
  for(const id of ['mentor-chat','research-open']){const e=EVENTS.find(e=>e.id===id);for(const c of e.choices)if(!c.probability&&c.effects?.tags)c.effects.tags=c.effects.tags.map(t=>t==='科研经历'?'科研接触':t);}
  const add=(id,group,title,text,choices,extra={})=>EVENTS.push({id,group,title,text,choices,weight:1,...extra});
  const research=(text,tag='政策调研')=>({text,effects:{study:2,energy:-11},probability:{base:.57,tags:{[tag]:.12,'深度阅读':.1},energy:.002,mood:.001},success:{text:'你完成了有依据的成果，材料中既有事实也有边界。',effects:{activity:4,tags:[tag],mood:5}},failure:{text:'结论还不充分，你记录了问题，继续补证据。',effects:{study:2,mood:-2}}});
  const humanities=[
    ['hu-first','理工校园里的文科新生','迎新群问你实验室在哪。你回复：我的实验材料可能在访谈录音里。','解释自己的研究方向','公共表达'],
    ['hu-stat','文科生的统计作业','你以为选文科就告别了数字，老师递来了一份调查数据。','检验样本与结论','政策调研'],
    ['hu-interview','访谈对象没有按提纲回答','对方最在意的问题，你的提纲里一句都没有。','调整提纲并完成访谈','政策调研'],
    ['hu-debate','辩论赛里的证据之战','气势赢了掌声，评委却问那个数字的出处。','核查材料再进行辩论','公共表达'],
    ['hu-tech','跨学科小组的第一场会','工程同学说模型已经最优。你问：最优是对谁而言？','共同讨论技术的使用场景','政策调研'],
    ['hu-policy','政策报告的第五次修改','老师圈出了“大家都认为”：大家到底是谁？','区分观察与推断','政策调研'],
    ['hu-classic','经典文本的两种解释','同一段话，两个同学读出了相反的意思。','用上下文支持解释','深度阅读'],
    ['hu-public','公共听证会模拟','每个角色的诉求都合理，预算却只够一半。','整理约束与折中方案','政策调研'],
    ['hu-media','给技术团队写一篇报道','标题很吸睛，但里面一个术语让工程同学沉默了。','核验事实并改写报道','创作经历'],
    ['hu-field','社区调研的最后一天','回收率很好，住得最远的那片社区却几乎没有回答。','补充缺失群体的访谈','政策调研'],
    ['hu-admit','升学陈述里的研究问题','你写了喜欢人文，老师问具体想解决哪个问题。','把兴趣转成研究计划','科研经历'],
    ['hu-job','岗位名称不叫精品文科','招聘页面没有你的培养方向，却有研究、咨询与公共事务。','用调研成果解释自己的准备','求职经历'],
  ];
  for(const [id,title,text,verb,tag] of humanities)add(id,'major',title,text,[research(verb,tag),op('先阅读材料，暂不承担成果',{study:3,energy:-5,tags:['深度阅读']},'你积累了基础，接触不等于已完成项目。'),spare('这次不参与，留出时间','你没有获得这次成果，保留了一个空档。')],{major:'humanities',focus:id.includes('job')?'work':'project',minSem:id.includes('admit')||id.includes('job')?4:0});
  const states=[
    ['energy-low','你的闹钟开始替你请假','连续忙碌之后，你读了三遍题目才发现看错了行。',[op('认真休息，取消可选安排',{energy:22,mood:5},'恢复本身也是今天完成的事情。'),op('保留必要课程，放慢其他事',{energy:12,study:1},'你减少了投入，守住必要安排。'),op('请朋友帮忙整理本周计划',{energy:15,mood:8},'有人提醒你，并非每件事都需要今天完成。')],{maxEnergy:35}],
    ['mood-low','今天不太想见人','消息弹出又被划走，你知道自己最近有点低落。',[op('找信任的人聊聊',{mood:18,energy:4},'你没有立刻解决全部问题，但不再独自背着。'),op('做一点熟悉的兴趣活动',{mood:14,energy:5},'完成一件小事，让今天变得可接受。'),op('给自己安静的一天',{mood:9,energy:12},'你允许今天暂时不表现得很好。')],{maxMood:35}],
    ['balance-low','报名费与月底余额','一项机会需要费用，你先看了看自己的余额。',[op('询问学校资助渠道',{balance:400,tags:['资助经历'],energy:-3},'申请材料通过，你获得了一次生活支持。'),op('接一次短期工作',{balance:450,energy:-10,tags:['兼职经历']},'收入解决了眼前的紧张，也占用了精力。'),op('暂缓付费活动，留出空档',{},'你没有勉强支出，下一次机会再考虑。',{freeTimeGain:1})],{maxBalance:600}],
    ['grade-high','同学来问你的复习方法','成绩公布后，同学想知道你是怎么理解那章内容的。',[op('约一次互相讲题',{study:3,activity:2,energy:-6,tags:['学业互助']},'解释也检验了你的理解。'),op('整理可共享的笔记',{study:2,activity:1},'笔记留下了具体的方法。'),spare('说明这次不参与，保留时间','成绩没有让你必须接受每一次邀请。')],{minGrade:88}],
    ['grade-low','成绩单上的一个提醒','一门课暴露了基础问题，好在还有调整的时间。',[op('先补最薄弱的一章',{study:6,energy:-7,tags:['规律复习']},'你没有一口气补全部，而是先开始。'),op('向老师请教错题',{study:5,energy:-5,tags:['学业互助']},'你找到了一处反复出现的误解。'),op('加入同学的基础复习小组',{study:4,mood:5,tags:['学业互助']},'一起学，让调整容易坚持。')],{maxGrade:77}],
    ['memory-project','曾经做过的项目又被提起','新项目里的问题，和你过去处理过的很像。',[op('拿出旧记录解释方法',{study:3,activity:3,energy:-6},'经历成为了真正可复用的方法。'),op('先核查旧方法是否仍适用',{study:4,energy:-5},'你没有把一次成功当成万能答案。'),spare('这次不加入，保留空档','你有经验，但可以选择不承担新的工作。')],{tags:['科研经历']}],
    ['money-family','家人问你要不要额外支持','一次跨城实践可能需要交通费。你们认真聊了预算。',[op('申请必要的交通支持',{balance:350,mood:3},'这笔支持对应具体用途。'),op('先接一段兼职自己准备',{balance:500,energy:-11,tags:['兼职经历']},'你为这次机会承担了一部分成本。'),op('改找本地机会',{study:2,tags:['求职经历']},'地点变了，准备没有停止。')],{minSem:2}],
  ];
  for(const [id,title,text,choices,extra] of states)add(id,'common',title,text,choices,{repeat:true,focus:id.startsWith('grade')?'study':id.startsWith('balance')?'work':'rest',...extra});
  add('device-cost','common','旧电脑的最后一次风扇起飞','课程软件开始吃力。新设备不便宜，你需要决定怎样继续。',[
    op('花 4500 元换一台合适的电脑',{balance:-4500,study:4,energy:5},'设备改善了效率，预算也明显减少。',{minBalance:4500}),
    op('花 300 元维修，继续用旧设备',{balance:-300,study:2},'你核对了故障，修复够用的部分。',{minBalance:300}),
    op('预约学校机房，调整工作时间',{study:2,energy:-4,tags:['学业互助']},'没有大额支出，但需要配合机房时间。'),
  ],{minSem:2,focus:'study'});
  add('city-intern','common','跨城实习的住宿预算','岗位提供实践机会，短期住宿与交通却需要自己安排。',[
    {text:'准备 2400 元，认真参加实践',effects:{balance:-2400,energy:-12},minBalance:2400,probability:{base:.72,tags:{'求职经历':.08,'校友联系':.08},energy:.002},success:{text:'实践完成，你有了一段可以具体描述的实习经历。',effects:{tags:['实习经历'],study:3}},failure:{text:'项目安排临时变化，住宿退回一部分费用。',effects:{balance:1200,tags:['求职经历'],mood:-3}}},
    op('改找本地短期实践',{energy:-8,study:2,tags:['求职经历']},'你减少了成本，也缩小了可选范围。'),
    spare('暂时放弃，把这段时间留给自己','你没有这次实习经历，也没有额外支出。'),
  ],{minSem:3,focus:'work'});
  add('support-follow','common','资助材料的一次回访','学校想知道这笔生活支持是否解决了实际困难。',[
    op('如实反馈需要与使用情况',{mood:4,tags:['公共表达']},'你的经历进入了资助流程改进的讨论。'),
    op('参加一次面向新生的经验分享',{activity:3,energy:-6,tags:['志愿服务']},'你解释了申请的步骤，也尊重了私人信息。'),
    spare('只完成必要反馈，不参加分享','你完成了必要材料，保留了其他时间。'),
  ],{tags:['资助经历'],focus:'social'});
  for(const id of ['love-meet','love-invite','love-conflict','love-break'])EVENTS.find(e=>e.id===id).repeat=true;
  // Stronger school identity without rebuilding parallel story trees.
  for(const [school,title,text,tag] of [['aero','航宇校园的科技伦理讨论','模型回答得很快，文科同学追问数据里的遗漏。','公共表达'],['normal','京师校园的课前十分钟','大家排练的不只是开场白，还有怎样倾听学生。','教育实习'],['finance','华人校园的公共预算模拟','每组都说自己的支出最重要，财政表却不能同时答应。','政策调研']])add(`${school}-cross`,'school',title,text,[research('组织一次有材料依据的讨论',tag),op('参加旁听，记录问题',{study:3,tags:['深度阅读']},'你学到了不同方向如何理解问题。'),spare('不参加这次活动，留出时间','你没有获得活动成果，保留了自己的安排。')],{school,focus:'project'});
  for(const [i,company,city] of [[0,'京州公共事务研究院','京州'],[1,'华京政策咨询','海州'],[2,'江城社会调查中心','江城']])JOBS.push(...['政策研究助理','公共事务专员'].map((role,j)=>({id:`hu-job-${i}-${j}`,company,city,category:'humanities',role,tier:j?1:2,description:'调研、材料分析与公共事务沟通',degree:'本科',examLine:j?38:57,salary:j?9:16,salaryMax:j?14:24,hours:'随项目变化'})));
  for(const e of EVENTS){e.category=e.group==='romance'?'social':e.group==='easter'?'life':e.focus==='study'?'study':e.focus==='project'?'project':e.focus==='work'?'work':e.focus==='social'?'social':'life';if(e.maxEnergy!==undefined||e.maxMood!==undefined||e.maxBalance!==undefined||e.minGrade!==undefined||e.maxGrade!==undefined)e.weight=2.5;}
  for(const q of QUESTIONS){q.purposes=['jobs'];q.difficulty='基础';q.section=q.category==='general'?'通用基础':'专业基础';q.source='原创简化题';}
}
