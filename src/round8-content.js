// Repairs that bind prose to actual prerequisites, applied after legacy content
// upgrades and polishing so earlier generic patches cannot undo the gates.
const op=(text,effects,result)=>({text,effects,result});
const home=(id,title,text,choices)=>({id,title,text,choices,group:'common',category:'life',storyScope:'run',repeat:true,followOnly:true,holidayOnly:true,locations:['home'],duration:0});
export const HOME_EVENTS=[
  home('home-family','饭桌上，家人又问起了大学','到家后的晚饭，话题从学校食堂转到了你的近况。你可以决定分享多少，也听听家里最近发生的事。',[
    op('讲一件最近的小事，也问问家里的近况',{mood:6},'你们没有只聊成绩。几件小事，让彼此的生活更具体了。'),
    op('聊聊课程和下一步安排，听听他们的想法',{study:2,mood:2},'建议不一定都适合你，但你把自己的打算讲清楚了。'),
    op('先好好吃饭，约个安静的时候再聊',{energy:5},'你没有敷衍，只是把长谈留到了双方都不赶时间的时候。'),
  ]),
  home('home-room','熟悉的房间，已经多了几只纸箱','你回到自己的房间，发现桌上放着家里临时收纳的东西。整理房间，也像整理这段假期。',[
    op('收拾桌面，留出看书的地方',{energy:-2,study:2},'你整理出一张能用的桌子，假期也可以按自己的节奏读书。'),
    op('翻翻旧照片，和家人聊聊以前',{mood:6},'照片里的人长大了，有些笑话还和当年一样。'),
    op('先安排好睡觉的地方，今晚早点休息',{energy:6,mood:2},'纸箱没有一天清完，但你终于在熟悉的房间睡了个好觉。'),
  ]),
  home('home-old-friend','老朋友问你，哪天有空见一面','你已经回家。附近的老朋友发来消息，想听听彼此这一年的变化。',[
    op('约一家能负担的小店，坐下来聊聊',{balance:-35,mood:8},'你们聊了学校，也聊了过去。生活不同了，仍有很多话可说。'),
    op('约在附近散步，不另外消费',{energy:3,mood:5},'熟悉的路走了一圈，彼此的近况也慢慢讲完了。'),
    op('这次时间不合适，认真约好以后再见',{mood:2},'你说明了安排，没有把一句“下次吧”当成结束聊天的借口。'),
  ]),
];
const gap=(id,title,text,category,choices)=>({id,title,text,group:'common',category,storyScope:'run',repeat:false,gapOnly:true,duration:2,choices});
export const GAP_EVENTS=[
  gap('gap-basics','二战复习，先从哪一章开始？','上一次考试已经结束。你翻开复习资料，发现继续做新题和补基础并不是同一件事。','study',[
    op('回到最容易卡住的章节，重新推一遍',{study:5,energy:-4,tags:['规律复习']},'你补清了一个条件，旧题里几处相同的错误终于有了原因。'),
    op('和备考同伴互相讲一道题',{study:3,energy:-2,mood:3,tags:['学业互助']},'把过程讲给别人听时，你发现自己原先跳过了两步。'),
    op('今天先整理目录，早点休息',{study:1,energy:8},'你列好了接下来要补的内容，没有把第一天排成整本书。'),
  ]),
  gap('gap-errors','错题本越来越厚，真正重做了几道？','你整理了不少错题，现在想看看自己能不能独立完成，而不是只看懂答案。','study',[
    op('遮住答案，独立重做一组题',{study:5,energy:-4},'重做暴露了几处还没掌握的步骤，你留下了自己的推导。'),
    op('按错误原因分类，先处理同一类问题',{study:4,energy:-2},'计算、概念和审题被分开，接下来不用每页都从头翻。'),
    op('只复盘一题，给今天留点空闲',{study:2,energy:3},'你弄懂了一道题，也给接下来的复习留出余地。'),
  ]),
  gap('gap-mock','计时练习，比想象中更考验取舍','一套练习卷到了最后半小时，仍有两道题没做。这里是备考练习，不会替代正式考试成绩。','study',[
    op('按时间限制完成，再复盘取舍',{study:5,energy:-5,tags:['备考经验']},'你记录了耗时和失误，下次知道哪些题值得先拿稳。'),
    op('暂停计时，弄清最卡住的一题',{study:4,energy:-3},'这次没有练完速度，但一个基础问题得到了解释。'),
    op('收好练习卷，休息后再复盘',{energy:10,mood:3},'你保存了做题过程，没有把这次练习当作录取结果。'),
  ]),
  gap('gap-family','家人问起备考近况','毕业之后，家人想知道你的准备怎样了。你可以分享具体进度，也可以说明暂时不想讨论分数。','social',[
    op('讲一个完成的目标，也说说难处',{mood:8,energy:3},'这次聊的不只有结果，家人也知道你最近实际在做什么。'),
    op('说明自己的安排，约定定期联系',{mood:5,study:1},'你们商量了联系方式，没有把关心变成每天追问。'),
    op('暂时不谈考试，聊一点日常',{mood:6},'一顿晚饭和几件小事，让话题从分数回到了生活。'),
  ]),
  gap('gap-place','备考的位置，未必还在旧教室','社区阅览室、自习室和住处都能看书。你想找到一个能长期坚持的安排。','life',[
    op('用免费的阅览室，先核对开放时间',{study:3,energy:-2},'你找到了固定的位置，也知道哪几天需要调整。'),
    op('花80元参加几次自习室体验',{balance:-80,study:3,mood:3},'你体验了环境，把费用和实际方便程度一起考虑。'),
    op('整理住处的一张桌子，不另花钱',{study:2,energy:4},'桌面清出来了，备考不必从买新装备开始。'),
  ]),
  gap('gap-peer','一起备考的人，也有自己的进度','自习时认识的同伴说，今天只完成了半份计划。你发现大家并不是每天都能保持同一种状态。','social',[
    op('互相核对一道题，之后各自继续',{study:3,mood:4,energy:-2},'讨论解决了具体问题，你们没有把时间全用来比较进度。'),
    op('约一次散步，暂时不聊分数',{energy:6,mood:8},'你们聊了备考之外的生活，回来后安排仍在自己手里。'),
    op('按自己的计划复习，不再比较',{study:4,energy:-3},'别人的进度没有替你决定今天先做什么。'),
  ]),
  {...gap('gap-review','第二次初试之后，重新看看自己的准备','初试已经结束。你想复盘做题时卡住的地方，也为下一步留出准备；复盘不会改写已经提交的答卷。','study',[
    op('整理几处没讲清楚的基础问题',{study:4,energy:-3},'你补写了推导，下一次遇到类似问题可以从条件开始解释。'),
    op('和同伴核对思路，暂不争论分数',{study:3,mood:4},'你们讲清了不同的处理方法，没有把回忆答案当作正式成绩。'),
    op('把卷子收好，先调整作息',{energy:10,mood:4},'你给这一阶段一个停顿，再决定后面的投入。'),
  ]),semesters:[15]},
  {...gap('gap-direction','现在再问一次，为什么选择这个方向？','考试准备让你接触了不少专业问题。无论最后是否达到录取要求，你都想更具体地理解这个方向。','study',[
    op('从课程中选一个具体问题，查资料',{study:4,energy:-3,tags:['深度阅读']},'你把大方向缩成一个可讨论的问题，留下了继续阅读的线索。'),
    op('联系老师，了解研究生的日常工作',{study:3,energy:-2},'你听到了课题和课程之外的实际安排，也重新考虑了自己的期待。'),
    op('先列出自己的疑问，不急着承诺',{study:2,mood:3},'你保留了几个想进一步了解的问题，没有因为等待结果就随便定方向。'),
  ]),semesters:[15]},
  {...gap('gap-information','备考群又转来一张没有出处的截图','截图写着最新消息，却没有原文。你需要分清正式通知、个人经验与猜测。','life',[
    op('回到院校通知，核对原文和日期',{study:3,energy:-2},'你找到可以核对的信息，没有把群里的转发当成录取结果。'),
    op('请转发者补来源，暂不继续传播',{mood:4},'你们发现几处消息来自往年，讨论终于有了时间背景。'),
    op('暂时退出讨论，按已有安排准备',{study:2,energy:3},'这条消息没有占满整个下午，你回到能实际完成的事情上。'),
  ]),semesters:[15]},
  {...gap('gap-waiting','等待消息的日子，也需要正常生活','结果还要按流程确认。你发现自己开始频繁刷新页面，饭点和睡觉却越来越随意。','life',[
    op('定时查看通知，其他时间做必要复习',{study:3,mood:4,energy:-2},'消息没有被错过，生活也不再跟着每次刷新走。'),
    op('约朋友见面，聊点备考之外的事',{mood:8,energy:4},'一段普通的聊天，帮你从等待里找回一点生活。'),
    op('先规律吃饭睡觉，不额外加任务',{energy:12,mood:5},'你整理了作息，等待仍然存在，但不用把一天全部交给它。'),
  ]),semesters:[15]},
];
export function applyRound8Content(events){
  const get=id=>events.find(e=>e.id===id);
  const attendance=get('attendance-hole');
  attendance.title='这一周，课程和作业怎么安排？';
  attendance.text='这周有几次课和作业截止时间。你可以按计划完成，也可以暂时把时间留给其他事；缺课与未交作业会记入本学期。';
  Object.assign(attendance.choices[0],{text:'按时上课，把这周的作业完成',result:'你完成了这一周的课程安排，把不熟悉的知识点重新核对了一遍。'});
  Object.assign(attendance.choices[2],{text:'向老师请教难点，优先完成关键内容',result:'你弄清了最重要的部分，接下来的课程准备更具体了。'});
  const ticket=get('ticket-home');
  Object.assign(ticket,{title:'回家之前，选一张车票',text:'你选择了假期回家。早班车便宜一些，舒服的车次更贵；也可以改变安排，留校度过假期。',followOnly:true,holidayOnly:true,locations:['planning-home'],duration:0});
  Object.assign(ticket.choices[0],{action:'homeArrive',result:'你坐早班车回到家，随后休整了一段时间，和家人一起度过假期。'});
  Object.assign(ticket.choices[1],{action:'homeArrive',result:'你在车上休息了一会儿，回家后调整作息，也留出时间陪家人。'});
  ticket.choices[2]={text:'改为留校，重新安排假期',effects:{},action:'homeCancel',result:'你没有购买车票，回家安排已取消。接下来重新选择假期活动。'};
  Object.assign(get('year-map'),{semesters:[0],months:[9],weeks:[1]});
  Object.assign(get('year-societies'),{months:[9,10],undergraduateOnly:true});
  Object.assign(get('hu-first'),{school:'aero',semesters:[0],months:[9,10]});
  Object.assign(get('dorm-first'),{semesters:[0],months:[9]});
  get('groupwork').choices[0].success.effects.tags=['学业互助'];
  get('tutoring').choices[0].text='认真备课，参加这次试课';
  get('budget').title='生活开销，先算一算';
  get('club').choices[0].setFlags={clubMember:true};
  get('club-leader').requiresFlags=['clubMember'];
  get('mentor-chat').text='你带着一个课程问题，也想了解老师的研究方向。办公室的门开着。';
  get('mentor-chat').choices[0].text='带着具体问题，请教课程与研究方向';
  get('lost-card').choices[1].minBalance=25;
  get('lost-card').choices[2]={text:'先挂失，申请临时凭证再安排补办',effects:{energy:-3},result:'你先保护卡里的余额，用临时凭证处理眼前的上课和用餐。正式补办留到之后。'};
  get('photography').choices[0].text='整理风景作品参加征集';
  get('reading').choices[2].text='整理几个问题，发起一次读书会';
  delete get('travel').choices[0].effects.tags;
  get('old-friend').text='高中同学从另一所大学来访。你们聊起当年的高考，也发现如今关心的事情不一样了。';
  get('weekend-sleep').title='一个不用赶早课的周末';
  get('weekend-sleep').text='今天不用赶早课。你可以好好休息，也可以给自己安排一点想做的事。';
  delete get('alumni-meet').choices[1].effects.charm;
  delete get('essay').choices[1].effects.tags;
  Object.assign(get('fresh-help'),{months:[9,2],maxSem:13});
  Object.assign(get('course-choice'),{months:[9,2],maxSem:13});
  get('summer-plan').choices[1].text='参加校内研究项目，完成一个小任务';
  get('summer-plan').choices[2].text='这次不参与，留时间休整';
  get('summer-plan').choices[2].result='你婉拒了这次机会，把这段时间留给休整，没有改变假期去向。';
  get('community-talk').text='有人想留在大城市，有人想回家。你把这些想法说给别人听，也想知道大家怎样考虑。';
  delete get('community-talk').choices[1].effects.tags;
  delete get('community-talk').choices[1].effects.charm;
  get('free-meal').text='食堂活动抽到了你的号码。奖品可以选择一顿免费套餐，也可以领取25元餐补。';
  get('free-meal').choices[0].text='领取25元餐补';
  get('free-meal').choices[0].result='你领到了25元餐补，把这份好运告诉了室友。';
  get('free-meal').choices[1].text='把免费套餐送给朋友';
  delete get('mystery-envelope').choices[0].effects.tags;
  const meme=get('unexpected-award');
  meme.title='随手做的表情包，能拿奖吗？';meme.text='校园表情包征集开始，室友提议把你们的口头禅做成一张图。';
  meme.choices[0]={text:'做一张原创表情包，提交参评',effects:{energy:-2},probability:{base:.25,tags:{创作经历:.10}},success:{text:'你的表情包获得校园创意小奖，奖金300元。室友说以后转发要标注作者。',effects:{balance:300,mood:10,activity:3,tags:['创作经历']}},failure:{text:'这次没有入选。室友仍把这张图加入聊天收藏，作品留了下来。',effects:{mood:2}}};
  meme.choices[1]={text:'帮朋友做一张，自己不投稿',effects:{mood:5,activity:1},result:'你把灵感交给朋友，一起完成了表情包。你没有参加评奖。'};
  get('aero-senior').text='学长展示了几次项目失败的记录，邀请你一起分析怎样重做。你发现，成果并不都是一次成功的。';
  get('aero-senior').choices[0].effects.tags=['校友联系','科研接触'];
  get('aero-senior').choices[1].text='和学长一起改进实验中的一个问题';
  get('aero-senior').choices[2].text='核对展示中的问题，再向学长提问';
  get('normal-love-letter').text='你帮室友改了一封信。另一所学校的收信人看出有人协助，想当面认识你这个朋友。';
  for(const [id,category] of [['aero-roll','study'],['aero-social','social'],['aero-museum','life'],['aero-gym','life'],['normal-language','study'],['normal-stage','social'],['normal-love-letter','social'],['normal-books','study']]){get(id).category=category;get(id).focus=category==='life'?'rest':category;}
  get('normal-music').category='social';get('normal-music').focus='social';
  get('normal-demo').notTags=['教学实践'];
  get('finance-intern').minSem=2;
  get('finance-intern').choices[0].text='整理消息，请分享会的校友解答疑问';
  get('finance-intern').choices[0].result='你向校友问清了几项岗位要求，也把信息分享给室友。';
  get('finance-coffee').text='几位返校校友在咖啡店聊岗位，你们想问问实习日常，也在算这杯咖啡占生活费的比例。';
  get('finance-budget').choices[0].text='分类记账，分析自己的消费结构';
  delete get('finance-budget').choices[0].effects.tags;
  get('finance-fair').choices[1].result='你帮摊位核对一天的流水，完成这段短班后收到了100元报酬。';
  for(const [id,category] of [['finance-coffee','work'],['finance-budget','life'],['finance-invite','work']]){get(id).category=category;get(id).focus=category==='life'?'rest':category;}
  get('cs-user').tags=['软件项目'];get('cs-release').tags=['软件项目'];
  get('cs-data').text='老师给出一段研究数据，请你参与核查与复算。漂亮的结果背后，有一条明显不该出现的记录。';
  const paper=get('space-paper');paper.title='专业论文里的实验方法';paper.category='study';paper.focus='study';
  paper.choices[0].probability.tags={深度阅读:.12,规律复习:.08};
  paper.choices[0].success.effects={study:3,activity:1,tags:['深度阅读']};
  get('mech-shop').title='加工实践里的一个零件';
  get('edu-plan').choices[0].success.text='试讲留出了提问时间，学生有机会把疑惑讲出来，课堂互动也更自然了。';
  get('edu-question').minSem=2;
  get('edu-question').text='见习课堂里，你在带教老师的指导下讲解一个知识点。学生问了个材料里没有准备的问题。';
  get('edu-observe').text='见习课程安排了课堂观察。你记录学生的参与方式，发现安静不一定意味着没有思考。';
  get('edu-observe').choices[0].probability.tags={教学实践:.12,规律复习:.08};
  get('edu-observe').choices[0].success.effects.tags=['教学实践'];
  delete get('edu-family').choices[1].effects.charm;
  get('lang-poem').choices[0].probability.tags={公共表达:.12,规律复习:.08};
  get('lang-poem').choices[0].success.effects.tags=['公共表达'];
  delete get('lang-interview').choices[1].effects.charm;
  get('lang-story').choices[0].success.text='你的短篇被校园刊物采用。结尾终于写完整了，编辑也给了具体反馈。';
  get('psy-listen').choices[0].probability.tags={公共表达:.12,规律复习:.08};
  get('psy-listen').choices[0].success.effects.tags=['公共表达'];
  get('psy-listen').choices[0].success.text='你听完同学的描述，再用自己的话确认理解。搭档说这次没有被急着打断。';
  get('acc-cert').notTags=['财会证书'];
  get('acc-intern').text='专业实践课安排了资料核验任务。老师请你先把来源与日期整理清楚，再核对几笔业务。';
  get('acc-intern').choices[0].success.text='资料按来源和日期排好了，几笔业务也核对清楚，老师能顺着记录查回原件。';
  Object.assign(get('grad-first'),{semesters:[8],months:[9,10]});
  get('grad-first').choices[0].success.effects.tags=['科研接触'];
  get('grad-paper').title='读懂论文之后的一页笔记';
  get('grad-paper').category='study';get('grad-paper').focus='study';get('grad-paper').choices[0].success.effects.activity=1;
  get('grad-teaching').title='助教答疑里的一处疑问';
  get('grad-teaching').text='这学期你报名了课程助教的答疑轮值。解释一道题时，你发现自己还有一处没懂透。';
  get('grad-thesis').minSem=11;
  get('grad-demo').tags=['科研经历'];
  get('grad-review').choices[0].success.effects.tags=['学业互助'];
  get('grad-review').category='study';get('grad-review').focus='study';
  get('single-after').text='分手后，你重新安排自己的周末。空出来的时间可以有很多种用法。';
  get('hu-stat').choices[0].success.effects={study:3,activity:1,tags:['规律复习'],mood:5};
  get('hu-stat').choices[0].probability.tags={规律复习:.12,深度阅读:.1};
  get('hu-stat').category='study';get('hu-stat').focus='study';
  get('hu-tech').choices[0].success.effects.tags=['公共表达'];
  get('hu-policy').title='政策报告里的一句“大家都认为”';
  get('hu-admit').choices[0].success.effects.tags=['科研接触'];
  get('hu-job').choices[0].requiresAnyTags=['政策调研','科研经历','公益项目'];
  get('balance-low').title='报名费与手头余额';
  get('grade-high').minSem=1;get('grade-low').minSem=1;
  get('memory-project').category='project';get('memory-project').focus='project';
  const transport=get('money-family');
  transport.title='校外实践，交通费怎么算？';transport.text='一次校外实践的交通需要350元。学校可按规则报销，也可以先完成一份兼职再支付，或改找本地机会。';transport.focus='work';transport.category='work';
  transport.choices[0]={text:'核对报销规则，完成实践并提交车票',effects:{energy:-3,mood:3},result:'你参加了实践，支付350元交通费后获得等额报销。余额没有净变化，也没有额外领取家庭生活费。'};
  transport.choices[1].effects.balance=150;
  transport.choices[1].result='你完成兼职获得500元，支付350元实践交通费后，净留下150元。';
  delete transport.choices[2].effects.tags;
  delete get('device-cost').choices[2].effects.tags;
  get('city-intern').choices[0].success.text='实践完成，你有了一段实习经历。这次岗位没有额外报酬，住宿和交通成本已计入。';
  get('cadre-first').title='这一学年，以{role}的身份开会';
  get('cadre-feedback').choices[2].text='采用往年的参考安排，事后收集反馈';
  get('cadre-feedback').choices[2].result='流程走完了，但几项不同意见没能在班会前讨论清楚。';
  get('cadre-fairness').text='老师请你协助汇总评优意见。熟悉的同学希望你“帮忙照顾一下”，其他人也在认真准备材料。';
  get('love-future-check').choices[1].text='讨论可能异地，约定联系和见面方式';
  delete get('love-future-check').choices[1].effects.tags;
  get('love-old-promise').requiresFlags=['missedExplained'];get('love-old-promise').repeat=false;
  for(const c of get('love-missed').choices.slice(0,2))c.setFlags.missedExplained=true;
  get('love-campus-aero').text='实验楼里的课程或交流拖了会儿，{partner}在门口等你。你们需要商量剩下的时间怎样安排。';
  get('love-campus-aero').choices[0].result='课程任务还在，相处也没有消失。你们先讲清了接下来的安排。';
  get('love-campus-aero').choices[1].result='你把今天遇到的问题讲具体，对方也分享了自己的近况。';
  get('attendance-hole').choices[1].text='缺这两次课，暂不交作业';
  get('internship-end').choices[1].text='完成交接，请本校毕业的带教分享求职经验';
  get('internship-end').choices[1].result='本校毕业的带教分享了求职经验，你们约好以后保持联系。实际工作{internWeeks}周，报酬 ¥{internGross}，额外成本 ¥{internCost}，净到账 ¥{internNet}，实习经历进入求职档案。';
  get('policy-near-line').choices[1].text='参加校内实践，完成一份资料整理';
  get('policy-near-line').choices[1].result='你完成了资料核对和整理，实践积累进入本学期综测准备。';
  get('budget-trip').choices[0].result='大家按商量好的预算完成旅行。这次支出已记入余额，后面的活动还需要按剩余资金安排。';
  delete get('major-humanities-fieldwork').choices[2].effects.tags;
  Object.assign(get('budget-graduation-move'),{months:[5,6]});
  get('year-dorm-chat').title='寝室夜聊，聊到了天亮的边缘';
  get('year-first-report').title='小组报告，标题比内容完整';
  Object.assign(get('year-home'),{title:'离家读大学后，收到一条普通的消息',semesters:[0],months:[9,10]});
  get('year-competition-chat').notFlags=['competitionActive'];
  get('year-portfolio').choices[1].requiresAnyTags=['软件项目','工程项目','科研经历','商业分析','创作经历','政策调研','公益项目','教学实践'];
  delete get('year-thesis-topic').choices[0].effects.tags;
  get('year-thesis-topic').choices[0].result='论文有了能推进的边界，你开始准备材料；这仍不等于完成毕业论文。';
  get('year-interview-replay').text='一场模拟面试刚结束，你突然想起一个更好的回答。现在需要决定如何使用这次经验。';
  Object.assign(get('year-group-photo'),{semesters:[7],months:[5,6]});
  Object.assign(get('year-last-class'),{semesters:[7],months:[4,5,6]});
  Object.assign(get('year-farewell'),{semesters:[7],months:[5,6]});
  get('year-offer-chat').title='同学聊起薪资，问得比面试还细';
  get('year-grad-reading').text='研究生课程要求介绍一篇具体论文。摘要读懂了，实验方法还有几步需要弄清楚。';
  get('year-grad-reproduce').title='复现做完了，结果还不一样';
  get('year-grad-reproduce').choices[0].text='逐项比对条件、材料与操作步骤';
  get('year-grad-reproduce').choices[0].result='你找到了一个条件差异，留下了完整的操作记录。';
  get('year-grad-lab-space').choices[0].result='你约到了可用时段，研究材料和操作安排终于有了着落。';
  // A branch owns these temporary markers; terminal resolution or cancellation
  // must not leave them influencing a later, unrelated occurrence.
  for(const e of events)for(const c of e.choices)for(const node of [c,c.success,c.failure]){
    const link=node?.followUp;if(!link)continue;
    const cleanup=link.id==='cadre-response'?['friction','supported','organized']:
      ['competition-team','competition-final'].includes(link.id)?['competitionActive','competitionPrepared','competitionCooperation','competitionHonest']:
      ['internship-work','internship-end'].includes(link.id)?['internshipActive','internshipReliable','internshipMentored','internshipFrustrated']:
      link.id==='love-rain'?['promised']:link.id==='love-missed'?['missed']:link.id==='love-repair-check'?['repairPromise']:[];
    link.clearFlags=[...new Set([...link.clearFlags||[],...cleanup])];
  }
  for(const e of events)if(['school','major'].includes(e.group))e.maxSem=Math.min(e.maxSem??13,13);
  for(const id of ['morning','library-seat','groupwork','canteen','parttime','openclass','student-show','lost-card','room-clean','photography','research-open','sports-day','weekend-sleep','intern-return','club-leader','exam-panic','coffee','room-conflict','scholarship-plan','pet-cat','campus-market','unexpected-award','free-meal','grade-high','grade-low','love-campus-aero','love-campus-normal','love-campus-finance'])get(id).maxSem=Math.min(get(id).maxSem??13,13);
  events.push(...HOME_EVENTS,...GAP_EVENTS);
}
