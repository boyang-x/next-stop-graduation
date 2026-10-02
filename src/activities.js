const item=(id,title,note,effects,result,extra={})=>({id,title,note,effects,result,...extra});
export const AFTERNOON_ACTIVITIES=[
  item('rest','睡个午觉','让身体慢下来',{energy:12,mood:3},'你睡了一个安稳的午觉，醒来精神好了些。'),
  item('walk','去校园散步','给心情换个风景',{energy:4,mood:9},'你绕着校园走了一圈，晚风让心情轻松下来。'),
  item('study','找个座位自习','整理最近学过的内容',{study:3,energy:-6,tags:['规律复习']},'你做完一组练习，补上了几个没弄懂的知识点。'),
  item('meet-new','认识新朋友','社团、聚会或运动 · 自己争取相识机会',{},'',{action:'meetNew'}),
  item('social','约朋友吃饭','花费 ¥25 · 聊聊近况',{balance:-25,mood:8,energy:-2},'你和朋友聊起最近的烦恼和小事。'),
  item('work','接一份短时兼职','完成一次短班 · 报酬 ¥100',{balance:100,energy:-10,tags:['兼职经历']},'你完成了一份临时工作，领到了 ¥100。'),
  item('exercise','去运动场活动','慢跑、投篮，舒展一下',{energy:8,mood:6,tags:['运动习惯']},'你以舒服的强度活动了一会儿。'),
  item('date','和对象出去玩','花费 ¥80 · 一起度过下午',{balance:-80,energy:-5,mood:12,tags:['共同回忆']},'你们在城市里找到了一个想再去一次的小地方。',{dating:true}),
  item('gift','挑一份小礼物','花费 ¥120 · 记住对方的喜好',{balance:-120,mood:7,tags:['共同回忆']},'你根据对方的喜好选了一份小礼物。',{dating:true}),
];
export function activitiesFor(s){
  if(!s.freeTime?.holiday)return AFTERNOON_ACTIVITIES.map(a=>a.id==='rest'&&s.freeTime?.leisure?{...a,title:'好好休息一天',result:'你给周末留出休息时间，身体慢慢恢复了精神。'}:{...a});
  const winter=s.freeTime.holiday==='寒假',gap=s.sem>=14;
  const plans=[
    item('rest',winter?'回家过年，慢慢休整':'回家休整，恢复生活节奏','先选择车票，确认回家后休整',{},'',{action:'homePlan'}),
    item('campus-rest',gap?'留在备考地，好好休整':'留校休整，照顾好自己','不额外花钱 · 调整作息',{energy:26,mood:12},gap?'你留在备考地，给睡眠和日常生活留出时间，慢慢恢复自己的节奏。':'你留在学校，给睡眠和日常生活留出时间，慢慢恢复自己的节奏。'),
    item('walk','安排几次附近的短途出行','花费 ¥120 · 换个环境',{balance:-120,energy:12,mood:18},'你走了几段平时很少经过的路，生活不再只有课程与考试。'),
    item('study',winter?'制定并执行假期复习计划':'系统预习，补齐薄弱课程','为下学期留下准备',{study:10,energy:-10,mood:-2,tags:['规律复习']},'你按计划复习了一段时间，准备会带入新学期。'),
    item('meet-new','参加假期交流活动','认识新朋友，也可以继续了解最近认识的人',{},'',{action:'meetNew'}),
    item('social','联系附近的朋友，安排几次见面','花费 ¥100 · 留出相处时间',{balance:-100,mood:16,energy:5},'你见到了附近的朋友，也听到了各自生活里的新故事。'),
    item('work',winter?'做一段辅导兼职':'接一段暑期工作','花费精力，获得一段实际工作报酬',{balance:winter?550:900,energy:-18,tags:['兼职经历']},winter?'你完成了一段辅导工作，获得 ¥550 报酬。':'你按排班完成了暑期工作，获得 ¥900 报酬。'),
    item('exercise','坚持假期运动','慢慢养成规律',{energy:20,mood:12,tags:['运动习惯']},'你在假期坚持活动，没有把运动变成另一种压力。'),
    item('travel',winter?'安排一次短途旅行':'计划一次假期旅行','花费 ¥650 · 看看校园之外',{balance:-650,energy:10,mood:24},'这段旅程留下了具体的风景，也提醒你安排好剩余预算。'),
    item('date',winter?'和对象保持联系，安排见面':'和对象计划一次共同出游','花费 ¥'+(winter?180:380)+' · 商量彼此的安排',{balance:winter?-180:-380,mood:18,energy:-8,tags:['共同回忆']},'你们在假期里协调了距离和时间，认真经营这段关系。',{dating:true}),
    item('gift',winter?'准备一份新年礼物':'挑一份适合对方的假期礼物','花费 ¥120 · 在意彼此的小习惯',{balance:-120,mood:7,tags:['共同回忆']},'你没有只比较价格，而是记住了对方在意的事情。',{dating:true}),
  ];
  if(!winter&&s.sem>=2&&s.sem<=12)plans.push(item('internship','申请一段专业实习','先申请，再经历工作与交接',{},'',{action:'summerInternship'}));
  return plans;
}
