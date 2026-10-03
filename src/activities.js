const item=(id,title,note,effects,result,extra={})=>({id,title,note,effects,result,...extra});
export const AFTERNOON_ACTIVITIES=[
  item('rest','睡个午觉','让身体慢下来',{energy:22,mood:4},'你睡了一个安稳的午觉，醒来精神好了些。'),
  item('walk','去校园散步','给心情换个风景',{energy:-3,mood:6},'你绕着校园走了一圈，树影和开阔的路让心情轻松下来。'),
  item('study','找个座位自习','整理最近学过的内容',{study:3,energy:-10,tags:['规律复习']},'你做完一组练习，补上了几个没弄懂的知识点。'),
  item('meet-new','认识新朋友','社团、聚会或运动 · 自己争取相识机会',{},'',{action:'meetNew'}),
  item('social','约朋友在食堂吃饭','个人餐费 ¥25 · 聊聊近况',{balance:-25,mood:6,energy:-4},'你支付25元个人餐费，和朋友在食堂聊起最近的烦恼和小事。'),
  item('work','接一份短时兼职','完成一次短班 · 报酬 ¥100',{balance:100,energy:-14,tags:['兼职经历']},'你完成了一份临时工作，领到了 ¥100。'),
  item('exercise','去运动场活动','精力 −8 · 心情 +6 · 持续运动改善魅力',{energy:-8,mood:6,exercise:true,tags:['运动习惯']},'你以舒服的强度活动了一会儿。'),
  item('date','和对象去校外公园散步','交通与餐点 ¥80 · 一起度过下午',{balance:-80,energy:-7,mood:7,tags:['共同回忆']},'你们在校外公园散步，买了餐点；这次交通与餐点共花80元。',{dating:true}),
  item('gift','挑一份小礼物','花费 ¥120 · 记住对方的喜好',{balance:-120,mood:4,tags:['共同回忆']},'你根据对方的喜好选了一份小礼物。',{dating:true}),
];
export function activitiesFor(s){
  if(!s.freeTime?.holiday)return AFTERNOON_ACTIVITIES.map(a=>a.id==='rest'&&s.freeTime?.leisure?{...a,title:'好好休息一天',result:'你给周末留出休息时间，身体慢慢恢复了精神。'}:{...a});
  const winter=s.freeTime.holiday==='寒假',gap=s.sem>=14;
  const plans=[
    item('rest',winter?'回家过年，慢慢休整':'回家休整，恢复生活节奏','先选择车票，确认回家后休整',{},'',{action:'homePlan'}),
    item('campus-rest',gap?'留在备考地，好好休整':'留校休整，照顾好自己','不额外花钱 · 调整作息',{energy:30,mood:9},gap?'你留在备考地，给睡眠和日常生活留出时间，慢慢恢复自己的节奏。':'你留在学校，给睡眠和日常生活留出时间，慢慢恢复自己的节奏。'),
    item('walk','安排几次附近的短途出行','花费 ¥120 · 换个环境',{balance:-120,energy:-8,mood:10},'你走了几段平时很少经过的路，生活不再只有课程与考试。'),
    item('study',winter?'制定并执行假期复习计划':'系统预习，补齐薄弱课程','为下学期留下准备',{study:10,energy:-22,mood:-5,tags:['规律复习']},'你按计划复习了一段时间，准备会带入新学期。'),
    item('meet-new','参加假期交流活动','认识新朋友，也可以继续了解最近认识的人',{},'',{action:'meetNew'}),
    item('social','联系附近的朋友，安排几次见面','花费 ¥100 · 留出相处时间',{balance:-100,mood:9,energy:-8},'你见到了附近的朋友，也听到了各自生活里的新故事。'),
    item('work',winter?'做一段课后辅导兼职':'做一段暑期资料整理兼职','完成约定排班 · 报酬 ¥'+(winter?550:900),{balance:winter?550:900,energy:-25,mood:-4,tags:['兼职经历']},winter?'你按约完成了一段课后辅导，获得 ¥550 报酬。':'你按排班完成了暑期资料整理，获得 ¥900 报酬。'),
    item('exercise','坚持假期运动','整个假期安排 · 精力 −12 · 心情 +8 · 改善魅力',{energy:-12,mood:8,exercise:true,tags:['运动习惯']},'你在假期坚持活动，没有把运动变成另一种压力。'),
    item('travel',winter?'安排一次短途旅行':'计划一次假期旅行','花费 ¥650 · 看看校园之外',{balance:-650,energy:-15,mood:12},'这段旅程留下了具体的风景，也提醒你安排好剩余预算。'),
    item('date',winter?'和对象保持联系，安排见面':'和对象计划一次共同出游','花费 ¥'+(winter?180:380)+' · 商量彼此的安排',{balance:winter?-180:-380,mood:10,energy:-12,tags:['共同回忆']},'你们在假期里协调了距离和时间，认真经营这段关系。',{dating:true}),
    item('gift',winter?'准备一份新年礼物':'挑一份适合对方的假期礼物','花费 ¥120 · 在意彼此的小习惯',{balance:-120,mood:4,tags:['共同回忆']},'你没有只比较价格，而是记住了对方在意的事情。',{dating:true}),
  ];
  if(!winter&&s.sem>=2&&s.sem<=12)plans.push(item('internship','申请一段专业实习','先申请，再经历工作与交接',{},'',{action:'summerInternship'}));
  return plans;
}
