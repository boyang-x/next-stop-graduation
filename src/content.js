import {enrichCareers} from './career-content.js';
import {applyRound8Content} from './round8-content.js';
import {routeQuestions} from './question-routing.js';
import {polishContent,polishQuestions} from './text-polish.js';
import {applyCharacterContent} from './character-content.js';
import { PROFESSIONAL_QUESTIONS } from './professional-questions.js';
import { PUBLIC_QUESTIONS } from './public-questions.js';
import { YEAR_EVENTS } from './year-events.js';
import { applyEconomyContent, ECONOMY_EVENTS } from './economy-content.js';
import { RELATIONSHIP_EVENTS } from './relationship-events.js';
import { EXTENDED_STORIES } from './extended-stories.js';
import { STORY_EVENTS } from './story-content.js';
import { upgradeContent } from './content-upgrade.js';
import { EXTRA_QUESTIONS } from './questions.js';
export const SCHOOLS = [
  { id: 'aero', name: '京华航宇大学', short: '航宇', city: '京州', type: '航空工科', icon: '↗', motto: '仰望星空，也要交实验报告', description: '实验室灯火通明。大家说自己没复习，凌晨两点却在讨论最后一道大题。', majors: ['cs', 'aerospace', 'mechanical'], cohortMean: 86, quota: .2 },
  { id: 'normal', name: '江城师范大学', short: '江师', city: '江城', type: '师范', icon: '✳', motto: '在讲台之外，认识整个世界', description: '试讲、校园演出与教育实习交错。热闹的活动里，总有一张似曾相识的脸。', majors: ['education', 'language', 'psychology', 'cs'], cohortMean: 81, quota: .15 },
  { id: 'finance', name: '海州财经大学', short: '海财', city: '海州', type: '财经', icon: '◈', motto: '人生的收益，未必写在报表里', description: '寝室群聊从食堂价格聊到实习消息。模拟投资亏了，现实的晚饭还是要吃。', majors: ['finance', 'accounting', 'cs'], cohortMean: 83, quota: .16 },
];
export const MAJORS = {
  cs: { name: '计算机科学', category: 'tech', tag: '软件项目' },
  aerospace: { name: '航空航天工程', category: 'engineering', tag: '工程项目' },
  mechanical: { name: '机械工程', category: 'engineering', tag: '工程项目' },
  education: { name: '教育学', category: 'education', tag: '教育实习' },
  language: { name: '汉语言文学', category: 'education', tag: '创作经历' },
  psychology: { name: '心理学', category: 'education', tag: '科研经历' },
  finance: { name: '金融学', category: 'business', tag: '商业分析' },
  accounting: { name: '会计学', category: 'business', tag: '财会证书' },
};
export const FOCUSES = [
  { id: 'study', name: '认真学习', icon: '📖', description: '复习、课程、成绩与升学机会' },
  { id: 'project', name: '项目与竞赛', icon: '🛠', description: '留下具体成果，给未来多一个选项' },
  { id: 'social', name: '校园与关系', icon: '☀', description: '参加活动，认识人，经营关系' },
  { id: 'work', name: '实践与兼职', icon: '▤', description: '增加余额，积累实习与工作经历' },
  { id: 'rest', name: '照顾自己', icon: '☁', description: '恢复精力，留一点生活给自己' },
];
export const TAGS = Object.fromEntries([
  ['规律复习','学习'], ['深度阅读','学习'], ['英语证书','资格'], ['普通话证书','资格'], ['财会证书','资格'],
  ['竞赛获奖','成果'], ['软件项目','成果'], ['工程项目','成果'], ['商业分析','成果'], ['科研经历','成果'], ['发表成果','成果'], ['创作经历','成果'],
  ['实习经历','实践'], ['教育实习','实践'], ['兼职经历','实践'], ['校友联系','社交'], ['跨校社交','社交'],
  ['班委经历','校园'], ['社团骨干','校园'], ['校园活动','校园'], ['志愿服务','校园'], ['公益项目','校园'], ['运动习惯','生活'], ['奖学金','成果'],
  ['共同回忆','关系'], ['分手经历','关系'], ['远距离相处','关系'], ['富裕恋人','彩蛋'], ['彩票中奖','彩蛋'], ['彩票大奖','彩蛋'],
  ['保研资格','升学'], ['保研落选','升学'], ['备考经验','升学'], ['考研失利','升学'], ['二战经历','升学'], ['求职经历','求职'],
].map(([name, type]) => [name, { name, type }]));

const op = (text, effects = {}, result = '这次选择成为了你大学生活的一部分。', extra = {}) => ({ text, effects, result, ...extra });
const risk = (text, effects, probability, success, failure, extra = {}) => ({ text, effects, probability, success, failure, ...extra });
const out = (text, effects = {}, action) => ({ text, effects, action });
const ev = (id, group, title, text, choices, extra = {}) => ({ id, group, title, text, choices, weight: 1, ...extra });
const study = (text = '踏实准备', amount = 4) => op(text, { study: amount, energy: -9, mood: -2, tags: ['规律复习'] }, '你的准备留在了本学期的学习积累里，期末会一起结算。');
const rest = (text = '给自己休息一下') => op(text, { energy: 13, mood: 7 }, '生活不是只有冲刺。今天睡得比昨天好。');
const social = (text = '参与其中') => op(text, { energy: -6, mood: 6, activity: 2, tags: ['校园活动'] }, '你记住了几个新名字，也留下了一段校园经历。');
const project = (text = '把它认真做完', tag = '科研经历') => risk(text, { energy: -13, study: 1 }, { base: .58, tags: { [tag]: .12, '规律复习': .08 }, energy: .0015 }, out('成果完成了。以后遇到相关机会，你有真实的经历可以讲。', { activity: 5, tags: [tag] }), out('这次成果还不够完整，但你学到了东西。', { study: 2, mood: -4 }));

export const EVENTS = [
  ev('dorm-first','common','寝室第一次夜谈','熄灯之后，大家从家乡聊到理想。有人已经写好了四年计划，有人说先找到食堂。',[social('聊一会儿，认识室友'),study('整理明天的课程表',2),rest('困了，明天再聊')],{ maxSem: 1, focus: 'social' }),
  ev('morning','common','八点的课与七点五十九分的你','闹钟响了三次。你的被子似乎比任何课程都懂你。',[study('起床去上课',3),op('再睡一会儿',{ study:-2,absence:1,energy:10,mood:3 },'你睡够了，也错过了一部分课程。')],{ repeat:true,focus:'study' }),
  ev('library-seat','common','图书馆的座位战争','最后一个靠窗的位置空着。旁边的同学已经摊开五本书。',[study('坐下，按自己的计划学习',5),op('去另一层安静学习',{study:4,energy:-6},'换了地方，效率反而不错。'),rest('今天先去散步')],{focus:'study'}),
  ev('groupwork','common','小组作业：五个人，四个已读','截止日期越来越近，群聊里只有你和表情包在工作。',[project('协调分工，做出成果'),op('完成自己那一部分',{study:3,energy:-6},'你的部分交上去了，整体效果比较普通。'),op('和大家一起赶最后一晚',{study:1,energy:-18,mood:-5},'交是交了。你暂时不想再看这个群。')],{focus:'project'}),
  ev('english','common','英语考试报名','同学问你要不要一起准备英语考试。证书可能在后面的申请里派上用场。',[risk('报名并认真准备',{balance:-220,energy:-8,study:3},{base:.55,tags:{'规律复习':.15},grade:.002},out('考试通过。',{tags:['英语证书'],mood:5}),out('差了一点，复习经验留下来了。',{tags:['备考经验'],mood:-3})),op('这学期先专注课程',{study:2},'你调整了准备顺序。')],{focus:'study',notTags:['英语证书']}),
  ev('canteen','common','食堂新品测评','新品窗口排着长队。室友说，这可能是本学期最重要的研究课题。',[op('加入测评小队',{balance:-35,mood:7},'你们给它打了一个很难解释的分数。'),op('照常吃饭',{balance:-15,energy:5},'今天的普通套餐发挥稳定。')],{repeat:true,focus:'rest'}),
  ev('club','common','社团招新摊位','一排摊位都说自己不忙。你看到某社团的活动照片，凌晨还有灯亮着。',[social('加入一个真正感兴趣的社团'),study('先摸清课程节奏',3),op('帮摊位做一次宣传',{activity:2,energy:-5,tags:['志愿服务']},'你没有急着加入，先体验了一次。')],{maxSem:3,focus:'social'}),
  ev('volunteer','common','周末志愿活动','社区需要一些学生帮忙。这个周末，你也原本打算复习。',[op('参加活动',{activity:4,energy:-9,mood:4,tags:['志愿服务']},'一天很累，结束时你觉得值得。'),study('留校复习',4)],{focus:'social',repeat:true}),
  ev('parttime','common','校内兼职的消息','勤工助学岗位正在招人。时间和你的空闲课表基本吻合。',[op('接下这段兼职',{balance:600,energy:-12,study:-1,tags:['兼职经历']},'余额增加了，也更能理解劳动的时间成本。'),op('不接，腾出时间',{energy:5,study:2},'这次你选择保留时间。')],{focus:'work',repeat:true}),
  ev('tutoring','common','第一次家教','家长说孩子很乖。你打开课本，孩子打开了十万个为什么。',[risk('认真备课，再去试一次',{energy:-10},{base:.65,tags:{'教育实习':.15,'深度阅读':.08}},out('家教顺利完成，拿到了报酬。',{balance:800,tags:['兼职经历'],mood:4}),out('课程不太合适，对方仍支付了试课费用。',{balance:100,mood:-3})),rest('这次不接')],{focus:'work'}),
  ev('campus-run','common','操场的晚风','跑道上有人冲刺，有人散步。你可以用自己的速度过完今晚。',[op('慢跑几圈',{energy:7,mood:8,tags:['运动习惯']},'回寝室的时候，脑子清楚了一点。'),op('和同学散步',{mood:8,energy:4},'聊了一些没有标准答案的话题。'),study('回去完成今天的复习',3)],{focus:'rest',repeat:true}),
  ev('budget','common','月底余额提醒','手机里显示的余额，让外卖购物车突然变得很有哲学意味。',[op('自己制定省钱计划',{balance:180,mood:-2},'你减少了几笔可选消费。'),op('问问校内兼职',{balance:450,energy:-10,tags:['兼职经历']},'一段兼职缓解了压力。'),op('照常生活，接受一点波动',{balance:-100,mood:3},'你决定暂时不为每一笔小钱纠结。')],{focus:'work',repeat:true}),
  ev('openclass','common','一堂意外好听的公开课','你原本只是躲雨，却被一个问题吸引着坐了下来。',[op('留下听完',{study:3,mood:3,tags:['深度阅读']},'那个问题后来又在别的课程里出现。'),social('课后与同学交流'),op('雨停了就走',{energy:4},'你赶上了自己的安排。')],{focus:'study'}),
  ev('competition','common','比赛报名截止前一天','同学拉你组队。没有人说能赢，但每个人都有一点期待。',[risk('认真准备并参赛',{energy:-16,balance:-80},{base:.38,tags:{'软件项目':.1,'工程项目':.1,'商业分析':.1,'规律复习':.07}},out('团队获得了一个奖项。',{activity:8,tags:['竞赛获奖'],mood:9}),out('没有获奖，但完成了参赛。',{study:3,mood:1})),study('这次专注课程',4),social('帮他们组织展示')],{focus:'project'}),
  ev('intern-info','common','学长发来的实习消息','岗位描述写得很长，学长只补了一句：有兴趣就试试。',[risk('整理材料，投一次',{energy:-10},{base:.5,tags:{'软件项目':.14,'工程项目':.14,'商业分析':.14,'教育实习':.14,'英语证书':.06}},out('你完成了一段实习。',{tags:['实习经历'],balance:1800,mood:6,study:1}),out('这次没有匹配上，但认识了一位愿意提供建议的学长。',{tags:['校友联系'],mood:-2})),op('请学长讲讲岗位',{tags:['校友联系'],mood:2},'你多知道了几个选择。'),study('先把课程基础补好',4)],{minSem:2,focus:'work'}),
  ev('mentor-chat','common','办公室门口的犹豫','你有一个课程问题，也想问问未来。老师的办公室门开着。',[op('带着具体问题去请教',{study:4,tags:['科研经历'],energy:-5},'问题没有一下全解决，但下一步清楚了。'),study('先自行查资料',3),rest('今天状态不好，下次再说')],{focus:'study'}),
  ev('student-show','common','晚会缺一个救场的人','节目单临时空了一格。组织者看向了你。',[risk('勇敢上台',{energy:-8},{base:.62,mood:.002,tags:{'校园活动':.08}},out('演出完成，台下的掌声比你想象中响。',{activity:5,mood:9,tags:['校园活动']}),out('有点紧张，但大家仍为你鼓掌。',{activity:2,mood:2})),op('做幕后协助',{activity:3,energy:-6,tags:['志愿服务']},'你把这场演出稳稳送到了结束。')],{focus:'social'}),
  ev('lost-card','common','校园卡不见了','你回想了一遍今天走过的路。最清晰的记忆，是食堂那碗面。',[op('按流程补办',{balance:-25,energy:-3},'你顺便记住了办事窗口的位置。'),risk('先去失物招领看看',{}, {base:.7},out('有人把卡送来了。',{mood:5}),out('没找到，最后还是补办了。',{balance:-25,mood:-2}))]),
  ev('room-clean','common','寝室卫生突击检查','平时看不见的角落，今天全都看见了。',[social('一起收拾，顺便聊天'),op('迅速整理自己的区域',{energy:-4,mood:2},'至少你的桌面恢复了可使用状态。'),op('负责公共区域',{activity:2,energy:-9,tags:['志愿服务']},'室友决定请你喝一瓶饮料。')],{repeat:true}),
  ev('rain','common','一场突如其来的大雨','你没带伞，离下一堂课还有十分钟。',[op('借伞去上课',{study:2,mood:2},'同学提醒你，下次在寝室放一把备用伞。'),op('冒雨跑过去',{study:2,energy:-8},'课程赶上了，鞋子没赶上干燥。'),rest('等雨小一点')]),
  ev('photography','common','校园摄影征集','你手机里有一张晚霞，还有一张室友睡着的照片。',[risk('整理作品参加',{energy:-5},{base:.45,tags:{'创作经历':.15}},out('作品入选了。',{activity:5,tags:['创作经历'],mood:5}),out('没入选，你仍保留了那张喜欢的照片。',{mood:3})),op('只发给朋友看',{mood:5},'朋友认真夸了你的晚霞。')],{focus:'social'}),
  ev('reading','common','一本意外读完的书','原本想翻两页，回过神已经错过了晚饭高峰。',[op('写下自己的想法',{study:3,mood:3,tags:['深度阅读']},'这次阅读留下了可以反复回看的东西。'),op('和朋友分享',{mood:6,tags:['校园活动']},'你们对同一个结尾有不同理解。')],{focus:'study'}),
  ev('family-call','common','家里打来电话','家人问你最近怎么样。你发现这句话并不好回答。',[op('认真聊聊最近的事',{mood:9,energy:4},'有些压力说出来之后轻了一点。'),op('报个平安，继续手头安排',{mood:3,study:1},'电话那头叮嘱你按时吃饭。')],{repeat:true,focus:'rest'}),
  ev('travel','common','短途旅行邀请','朋友想趁周末看看另一座城市。你的余额和课表都在旁边。',[op('安排一次预算内的旅行',{balance:-450,energy:7,mood:13,tags:['跨校社交']},'照片里你笑得比平时自然。',{minBalance:450}),study('留校完成自己的计划',4),op('一起规划，但这次不去',{mood:3},'你参与了讨论，也保留了自己的安排。')],{focus:'rest'}),
  ev('research-open','common','实验室开放日','一位研究生介绍项目时说：第一版也很粗糙。',[project('参与一个小任务','科研经历'),op('认真听完并提问',{study:2,tags:['科研经历']},'你对研究生活多了一点具体认识。'),rest('先去看看其他活动')],{minSem:2,focus:'project'}),
  ev('sports-day','common','运动会报名表','没人报名的项目空着。室友说，你看起来很适合。',[risk('试着参加',{energy:-12},{base:.4,tags:{'运动习惯':.22}},out('你取得了不错的名次。',{activity:6,mood:8,tags:['校园活动']}),out('名次一般，大家把你接回了看台。',{activity:2,mood:4})),op('当志愿者',{activity:3,energy:-7,tags:['志愿服务']},'你认识了场地边很多忙碌的人。')],{focus:'social'}),
  ev('old-friend','common','高中同学来访','你们聊起当年的高考，又发现如今关心的事情不一样了。',[op('陪朋友逛校园',{mood:10,energy:-3,tags:['跨校社交']},'有些话仍然不用解释。'),op('吃顿饭再回去做事',{balance:-60,mood:5,study:1},'见面很短，但足够开心。')],{focus:'social'}),
  ev('secondhand','common','二手书摊','一本旧教材的边角写着：这道题真的会考。',[op('买下来认真看',{balance:-35,study:4,tags:['规律复习']},'批注有用，最后仍要自己理解。'),op('借同学的书',{study:2,mood:2},'你答应把书好好还回去。')],{focus:'study'}),
  ev('weekend-sleep','common','连续忙碌后的周末','你已经好几天没有自然醒了。今天的日历终于空了一格。',[rest('睡饱，再做喜欢的事'),study('趁空闲再复习一轮',4)],{repeat:true,focus:'rest'}),
  ev('intern-return','common','实习之后的课程讨论','老师问有没有人见过类似情况。你想起实习时遇到的问题。',[op('分享具体案例',{study:3,activity:2,mood:4},'理论与经历终于接上了。'),op('课后整理自己的笔记',{study:4,tags:['深度阅读']},'你发现当时还有一些没想明白的地方。')],{tags:['实习经历'],focus:'study'}),
  ev('club-leader','common','社团希望你接一届','你熟悉活动流程，也知道组织一次活动要付出多少时间。',[op('接受并认真组织',{activity:6,energy:-14,study:-2,tags:['社团骨干']},'社团留下了你组织的一场活动。'),study('婉拒，专注这一学期',4)],{tags:['校园活动'],minSem:2,focus:'social'}),
  ev('alumni-meet','common','校友分享会','台上没有成功学，只有几段绕路和一次次修改简历。',[op('会后交流',{energy:-5,tags:['校友联系'],mood:3},'你获得了一些岗位信息，也知道了该问什么。'),op('记下有用的建议',{study:2,mood:2},'你开始更具体地想未来。')],{minSem:3,focus:'work'}),
  ev('hackathon','common','连续一天的创意挑战','题目刚公布，小组已经开始分工。作品不需要完美，但要能运行。',[project('参加并完成展示','软件项目'),social('负责活动协助'),rest('保持自己的节奏')],{focus:'project'}),
  ev('public-project','common','社区的小问题','社区想改善信息公告。有同学提议做一个简单方案。',[project('一起解决问题','公益项目'),op('参与调研',{activity:3,tags:['志愿服务'],energy:-6},'真正的需求比最初设想复杂一点。')],{focus:'project'}),
  ev('essay','common','写作比赛的主题','题目叫“下一站”。你想起自己还没确定的方向。',[project('写一篇认真表达的作品','创作经历'),op('只写给自己',{mood:7,tags:['深度阅读']},'你把一些想法写清楚了。')],{focus:'social'}),
  ev('fresh-help','common','新生向你问路','你突然意识到，自己已经很熟悉这所学校了。',[op('带对方过去',{mood:5,activity:2,tags:['志愿服务']},'你也曾站在同一个路口。'),op('详细说明路线',{mood:3},'对方道谢后朝正确的方向去了。')],{minSem:2}),
  ev('exam-panic','common','复习群里的神秘重点','群文件突然出现一份“终极重点”。没人知道作者是谁。',[study('对照教材核查',5),risk('把希望寄托在重点上',{energy:-4},{base:.4},out('有一些内容碰巧对上了。',{study:4}),out('方向偏了，还是补回基础。',{study:-3,mood:-3})),rest('按原计划，不跟风')],{focus:'study',repeat:true}),
  ev('workload','common','两件事撞到了一起','课程报告和活动筹备都在这周。你需要确定一个重点。',[study('优先完成课程报告',5),op('优先活动筹备',{activity:5,study:-2,energy:-10,tags:['校园活动']},'活动顺利了，课程准备少了一些。'),op('压缩范围，两件都做一点',{study:2,activity:2,energy:-15},'都推进了一些，今晚需要好好睡。')],{repeat:true}),
  ev('coffee','common','校园里的安静角落','这里没有绩点讨论。窗外的树叶动得很慢。',[op('坐一会儿',{balance:-20,mood:9,energy:6},'你允许自己拥有一个普通下午。'),study('带书来读一章',3)],{focus:'rest'}),
  ev('course-choice','common','选修课最后一个名额','有趣的课和轻松的课都剩下一个位置。',[op('选真正好奇的课',{study:3,mood:4,tags:['深度阅读']},'你对一个新领域产生了兴趣。'),op('选安排更宽松的课',{energy:8,study:1},'空出来的时间可以自己使用。')],{focus:'study'}),
  ev('room-conflict','common','寝室里的生活习惯冲突','有人想早睡，有人刚准备开始一局。大家都觉得自己有理由。',[op('一起商量安静时间',{mood:5,energy:3},'你们找到了一份可以遵守的安排。'),op('暂时去自习室',{study:3,energy:-5},'今天先解决眼前问题。')]),
  ev('scholarship-plan','common','奖学金申请说明会','说明里的成绩和活动要求，让你重新看了自己的学期记录。',[study('优先补学业短板',4),op('参加一项有意义的活动',{activity:4,energy:-8,tags:['志愿服务']},'你为这学期增加了一段经历。')],{focus:'study'}),
  ev('summer-plan','common','暑假安排的分岔口','回家、实习、项目、休息，每个选项都有它的理由。',[risk('尝试短期实习',{energy:-12},{base:.58,tags:{'校友联系':.1,'软件项目':.1,'工程项目':.1}},out('完成了实习。',{balance:1500,tags:['实习经历']}),out('岗位没匹配上，你改为整理材料。',{tags:['求职经历'],study:2})),project('留校完成项目','科研经历'),rest('回家休息')],{minSem:1,focus:'work'}),
  ev('certificate-talk','common','大家都在考证吗','群聊突然被证书报名刷屏。你查了一下它与自己方向的关系。',[op('先研究真正需要的证书',{study:3,tags:['备考经验']},'你避免了盲目报名。'),study('先完成课程基础',4),rest('今天不跟风')],{focus:'study'}),
  ev('ticket-home','common','回家的车票','便宜的车次很早，舒服的车次贵一点。',[op('选便宜车次',{balance:-120,energy:-3,mood:6},'清晨的站台，也有熟悉的归途。',{minBalance:120}),op('选舒服的车次',{balance:-260,energy:6,mood:6},'你在路上睡了一个好觉。',{minBalance:260}),op('留校视频通话',{mood:5,study:2},'家里把晚饭照片发给了你。')],{focus:'rest'}),
  ev('study-friend','common','复习搭子邀请','同学问你要不要每天约一个小时学习。',[op('建立稳定的小计划',{study:5,energy:-8,tags:['规律复习']},'有人一起，开始变得容易了。'),study('保持自己的安排',3)],{focus:'study'}),
  ev('recruit-talk','common','招聘宣讲的第一排','你还没到毕业年，先来看看真实的岗位都问什么。',[op('认真听，记录要求',{tags:['求职经历'],study:2},'你发现有些准备可以提前开始。'),op('与校友交流',{tags:['校友联系'],mood:3},'你问到了简历上没有写出的工作日常。')],{minSem:3,maxSem:5,focus:'work'}),
  ev('book-exchange','common','交换一本书','你带来的书和对方带来的书，刚好是两种不同的世界。',[op('交换并读完',{study:3,mood:4,tags:['深度阅读']},'你多了一种看问题的角度。'),social('聊聊各自喜欢的段落')],{focus:'social'}),
  ev('pet-cat','common','校园猫的临时名字','几个人给同一只猫取了四个名字。猫看起来一个都不准备回应。',[op('远远陪它待一会儿',{mood:9,energy:5},'今天最简单的快乐，来自一次没有回应的呼唤。'),op('和同学一起做文明喂养宣传',{activity:3,energy:-5,tags:['公益项目']},'你们把喜欢变成了一件可持续的小事。')],{focus:'rest'}),
  ev('campus-market','common','校园跳蚤市场','你找到了闲置很久的东西，也看到了自己曾经冲动买下的决定。',[op('卖掉闲置物品',{balance:220,mood:3},'物品找到了新的主人。'),op('参与摊位组织',{activity:3,energy:-6,tags:['校园活动']},'一下午认识了不少人。')],{focus:'work'}),
  ev('health-day','common','身体提醒你慢一点','这几天你总在赶路。今天醒来，发现自己真的累了。',[rest('调整作息，认真休息'),op('减少活动，保留必要学习',{energy:8,study:2,mood:3},'你重新安排了优先级。')],{maxEnergy:45,focus:'rest',repeat:true}),
  ev('community-talk','common','一场关于未来的讨论','有人想留在大城市，有人想回家。你第一次把这些想法说给别人听。',[op('认真表达自己的目标',{mood:5,tags:['求职经历']},'你的方向还可以改变，但现在更具体了。'),op('多听听其他人的理由',{mood:4,tags:['深度阅读']},'每一种选择背后都有不同生活。')],{minSem:4,focus:'social'}),
  ev('lottery','easter','路边的刮刮乐','便利店老板说今天有人中了五十。你知道故事里总省略了没中的那几张。',[{text:'花 20 元试一张',effects:{balance:-20},action:'lottery',minBalance:20},op('不买，余额留给自己',{mood:2},'你带着一瓶水离开。')],{repeat:true,weight:.65}),
  ev('free-meal','easter','你是今天的幸运顾客','食堂活动随机抽到你的号码。奖品是一顿免费套餐。',[op('开心收下',{balance:25,mood:8},'你把照片发进了寝室群。')],{weight:.4}),
  ev('mystery-envelope','easter','旧书里的信封','二手书里夹着一封多年前写下的毕业留言。',[op('读完，再放回书里',{mood:9,tags:['深度阅读']},'纸上写着：你不需要在今天解决一生。'),op('交给图书馆保管',{activity:2,mood:5,tags:['志愿服务']},'它也许还能等到原来的主人。')],{weight:.4}),
  ev('unexpected-award','easter','表情包意外获奖','你为活动做的表情包，竟然被评为最佳校园创意。',[op('领取小奖励',{balance:300,mood:10,activity:3,tags:['创作经历']},'室友说以后发你的表情包要标注作者。')],{tags:['校园活动'],weight:.35}),
];

const schoolRows = {
  aero: [
    ['aero-roll','寝室的“没复习”联盟','大家都说没复习，凌晨两点却有人在讨论证明的第三种方法。',study('按自己的进度复习',5),rest('不比较，先睡好')],
    ['aero-lab','实验室的灯还亮着','项目演示在明天。一位同学说问题只剩最后一点点。',project('加入调试，完成模型','工程项目'),study('先完成课程，再帮一小段',3)],
    ['aero-flight','模型第一次离地','操场边，一群人盯着刚装好的模型。没有人愿意眨眼。',project('参与测试和记录','工程项目'),social('帮忙组织安全区域')],
    ['aero-social','跨校联谊报名','室友把报名表发给你：别总在寝室讨论螺丝了。',op('报名参加',{balance:-60,mood:6,tags:['跨校社交']},'你认识了一些来自不同专业的人。'),study('这次先复习',4)],
    ['aero-museum','航空展厅里的周末','你看见课本上的结构，变成了眼前的实物。',op('认真参观并做记录',{study:4,mood:5,tags:['深度阅读']},'有几处课程内容突然清楚了。'),rest('慢慢逛，享受周末')],
    ['aero-presentation','项目汇报的追问','老师问：如果条件变了，你的方案还成立吗？',project('补上验证再展示','工程项目'),study('回去查清基础假设',4)],
    ['aero-talent','工科晚会的神秘节目','有人准备用模型和灯光做一个节目。大家担心它只会亮一次。',project('把装置做稳定','工程项目'),social('负责演出协调')],
    ['aero-gym','实验报告之外的球场','室友说今天去打球。你们终于讨论了一次和课程无关的配合。',op('一起运动',{energy:8,mood:8,tags:['运动习惯']},'球技一般，心情不错。'),study('写完报告再去',3)],
    ['aero-senior','学长说他也重做过','你以为每个人的项目都一次成功，学长翻出了自己的失败照片。',op('请教复盘方法',{study:3,tags:['校友联系','科研经历']},'你的问题有了新的解决方向。'),project('改进自己的实验','工程项目')],
    ['aero-countdown','课程设计倒计时','群里最安静的同学突然发来一个完整的演示视频。',project('把自己的版本收尾','工程项目'),study('理解原理，避免照抄',4)],
  ],
  normal: [
    ['normal-demo','第一次站上讲台','面对同学，你发现“讲清楚”比“自己会”更难。',project('练习并完成试讲','教育实习'),study('先整理教学逻辑',4)],
    ['normal-language','普通话练习室','你们把同一句话读了六遍，每一遍都笑在不同地方。',risk('认真练习并参加测试',{energy:-8,balance:-80},{base:.65,tags:{'规律复习':.1}},out('测试通过。',{tags:['普通话证书'],activity:3}),out('还有进步空间。',{study:2,mood:1})),social('先和同学一起练习')],
    ['normal-stage','排练室里的新朋友','晚会排练中，大家轮流介绍自己。你的名字被认真记住了。',social('留下参与排练'),study('帮忙一会儿，回去学习',3)],
    ['normal-school','中小学见习','学生问的问题，超出了你昨晚准备的教案。',project('认真完成见习','教育实习'),op('观察并整理笔记',{study:4,tags:['深度阅读']},'课堂比课本更丰富。')],
    ['normal-class','模拟班会','主题是“未来”。你发现自己还没完全想好怎么回答。',op('设计并主持班会',{activity:5,energy:-10,tags:['校园活动','教育实习']},'同学的回应让你调整了原来的设计。'),study('先做主题研究',4)],
    ['normal-love-letter','室友的情书求助','你帮室友改了一封信，对方却想认识写得这么好的“朋友”。',op('坦诚说明，认识一下',{mood:6,tags:['跨校社交']},'误会解开后，大家都笑了。'),op('把消息转回室友',{mood:3},'你把故事的主角还给了室友。')],
    ['normal-child','周末公益课堂','孩子们的想象力，让你准备好的材料变成了另一种作品。',project('完成这次教学活动','教育实习'),op('做活动志愿者',{activity:4,energy:-8,tags:['志愿服务']},'你学会了先听孩子说完。')],
    ['normal-books','书展的旧诗集','摊主问你最喜欢哪一句。你想起了很久没读的那本书。',op('读一下午',{study:3,mood:6,tags:['深度阅读']},'你又找到一种愿意慢下来的理由。'),social('与同学交流')],
    ['normal-job','教师岗位分享会','学长讲了备课、课堂和下班之后的工作。你听到了宣传册之外的日常。',op('提问并记录',{tags:['求职经历','校友联系'],mood:3},'你对这个方向有了更具体的认识。'),study('先补专业基础',4)],
    ['normal-music','琴房外的旋律','有人邀请你参与朗读与音乐的小演出。',social('一起准备节目'),rest('坐在旁边听一会儿')],
  ],
  finance: [
    ['finance-stock','模拟投资大赛','你的模拟账户绿了。现实里，食堂窗口没有打折。',project('研究并写复盘','商业分析'),op('按规则完成记录',{study:3,mood:1},'你把一次波动变成了一份笔记。')],
    ['finance-intern','全寝室都说没准备','你发现每个人都知道宣讲会的时间，只是不知道彼此知道。',op('整理信息并交流',{tags:['求职经历','校友联系'],mood:3},'信息共享之后，焦虑小了一点。'),study('把自己的准备做好',4)],
    ['finance-case','商业案例赛','案例里所有数字都有解释，唯独客户为什么这样想没有。',project('调研后做分析','商业分析'),study('认真核查数据',4)],
    ['finance-account','报表里不平的一分钱','你已经看了三遍。那一分钱似乎也在看你。',project('找到原因并整理方法','商业分析'),op('请同学共同核对',{study:3,mood:2},'你们终于找到了一处录入错误。')],
    ['finance-coffee','咖啡店里的实习讨论','隔壁桌在聊岗位，你们在算这杯咖啡占生活费的比例。',op('交流实习信息',{balance:-25,tags:['校友联系'],mood:4},'你获得了几个值得调查的方向。'),rest('今天只聊生活')],
    ['finance-budget','寝室的预算挑战','大家约定记录一周支出。结果最难分类的是“突然想吃”。',op('认真记账',{balance:200,tags:['商业分析'],study:2},'你减少了一些自己也不太想要的消费。'),social('分享省钱办法')],
    ['finance-fair','商业创意集市','有人卖产品，有人卖服务。你们需要把想法讲给真正的顾客。',project('完成一次小规模尝试','商业分析'),op('帮摊位记账',{activity:3,balance:100,tags:['兼职经历']},'你第一次看到了真实的一天流水。')],
    ['finance-audit','模拟审计的异常数据','一条记录看起来很正常，和其他记录放在一起却很奇怪。',project('核查证据并汇报','商业分析'),study('学习核查方法',4)],
    ['finance-invite','校友的岗位问答','校友说，不要只看职位名称，要问一天到底做什么。',op('带具体问题交流',{tags:['校友联系','求职经历'],mood:3},'你删掉了一个不适合自己的方向。'),study('继续课程准备',4)],
    ['finance-pitch','三分钟路演','你的方案有十五页，时间只有三分钟。',project('压缩并完成路演','商业分析'),op('协助团队展示',{activity:3,energy:-6,tags:['校园活动']},'你更理解怎样让一个想法被听见。')],
  ],
};
for (const [school, rows] of Object.entries(schoolRows)) for (const [id,title,text,...choices] of rows) EVENTS.push(ev(id,'school',title,text,choices,{school,focus:id.includes('intern')||id.includes('job')?'work':'project'}));

const majorRows = {
  cs: [['cs-bug','程序在你电脑上能运行','展示电脑却给了你一行陌生的错误。','定位环境差异','软件项目'],['cs-git','小组仓库的合并冲突','大家同时改了同一个文件，版本历史突然很热闹。','整理协作流程','软件项目'],['cs-user','第一位真实用户','用户没有点你最得意的按钮，而是问能不能撤销。','根据反馈改进','软件项目'],['cs-data','数据里的一条异常','漂亮的结果背后，有一条明显不该出现的数据。','核查并修正','科研经历'],['cs-release','上线前的最后一晚','你可以继续加功能，也可以把现有功能做稳定。','完成稳定版本','软件项目']],
  aerospace: [['space-wind','风洞实验前的准备','老师让你先解释测量误差从哪里来。','完成实验验证','工程项目'],['space-model','模型与理论不一致','模型转了一个你不期待的角度。','查清假设再改进','工程项目'],['space-control','控制参数的取舍','更快的响应不总是更稳定。','完成对比实验','工程项目'],['space-show','工程展示的现场','参观者问的问题比报告题目更直接。','完成展示与记录','工程项目'],['space-paper','读懂第一篇专业论文','摘要读懂了，正文却像另一门语言。','拆解实验方法','科研经历']],
  mechanical: [['mech-drawing','图纸的最后一处尺寸','你发现一处尺寸和结构装配对不上。','修正并验证','工程项目'],['mech-shop','第一次加工实践','纸面设计终于变成了手上的零件。','完成实践作品','工程项目'],['mech-print','打印件的意外裂纹','外观看起来成功，实际受力却暴露问题。','改进结构再测试','工程项目'],['mech-robot','小车开始绕圈','代码说直行，轮子说各有想法。','完成调试','工程项目'],['mech-safety','实践前的安全检查','一个细节没有确认，实验不能开始。','认真完成检查和实践','工程项目']],
  education: [['edu-plan','教案的留白','你写满了每一分钟，却没有给学生提问留时间。','修改并试讲','教育实习'],['edu-question','学生问了个好问题','答案不在你准备的材料里。','查证后完成教学','教育实习'],['edu-observe','课堂观察记录','安静的学生也有自己的参与方式。','整理观察报告','科研经历'],['edu-design','同一个知识点的两种教法','你准备看看哪种更容易理解。','完成小规模教学尝试','教育实习'],['edu-family','模拟家校沟通','对方最关心的问题和你准备讲的不一样。','完成沟通演练','教育实习']],
  language: [['lang-poem','朗读中的停顿','同一句诗，不同停顿听起来像不同故事。','准备公开朗读','创作经历'],['lang-edit','校刊的一篇稿件','句子漂亮，但读者可能不明白作者想说什么。','编辑并完成刊发','创作经历'],['lang-interview','校园人物采访','对方的答案让你放下了原来准备的问题。','整理真实访谈','创作经历'],['lang-archive','旧报纸里的校园','你发现了几十年前同样的考试抱怨。','完成资料研究','科研经历'],['lang-story','短篇的最后一页','你给角色准备了结局，角色似乎还有话说。','完成并投稿','创作经历']],
  psychology: [['psy-survey','问卷的问题','一个问题同时问了两件事，回答很难解释。','修改并完成调研','科研经历'],['psy-stat','看起来显著的结果','老师问你：样本是怎么来的？','核查并重新分析','科研经历'],['psy-listen','倾听练习','你发现自己一直急着给建议。','完成课程练习','教育实习'],['psy-lab','行为实验的流程','一个提示词可能改变参与者的反应。','完善实验设计','科研经历'],['psy-report','研究报告的边界','数据支持一部分结论，其他部分还需要证据。','完成审慎报告','科研经历']],
  finance: [['fin-rate','利率变化的案例','你需要解释数字改变之后，不同人的选择如何变化。','完成案例分析','商业分析'],['fin-risk','收益之外的风险','最漂亮的曲线没有写最坏的一天。','补完整风险分析','商业分析'],['fin-value','估值模型的假设','结果很精确，假设却不一定可靠。','核查假设并汇报','商业分析'],['fin-field','一次行业访谈','对方描述的日常和你的想象不同。','完成访谈报告','商业分析'],['fin-tool','表格里的模型','公式拖到底之后，最后一行多了一个零。','审查并完成模型','商业分析']],
  accounting: [['acc-balance','借贷为什么不平','你终于发现漏记的那条记录。','整理核查过程','商业分析'],['acc-tax','课堂里的税务案例','不同条件对应不同处理方式。','查清规则完成作业','商业分析'],['acc-cert','专业证书的准备','课程和考试内容有重叠，也有新的部分。','完成模拟考与复习','财会证书'],['acc-evidence','凭证与记录不一致','每条证据都需要回到具体业务。','完成案例核查','商业分析'],['acc-intern','办公室的一摞资料','导师让你先把来源与日期整理清楚。','完成实践任务','商业分析']],
};
for (const [major, rows] of Object.entries(majorRows)) for (const [id,title,text,label,tag] of rows) EVENTS.push(ev(id,'major',title,text,[project(label,tag),study('先补课程基础',4),rest('这次保持原安排')],{major,focus:'project'}));

const gradRows = [
  ['grad-first','研究生第一次组会','师兄说报告不需要长，但要知道自己在问什么。','科研经历'],['grad-direction','研究方向的选择','感兴趣的题目和能完成的题目，需要找到交集。','科研经历'],['grad-paper','第一篇论文的笔记','你终于能解释作者为什么做这个实验。','深度阅读'],['grad-reproduce','复现实验的差异','原文里没有写出的设置，成了你今天的主要工作。','科研经历'],['grad-data','数据清理的一周','最花时间的一步，没有一张漂亮的图。','科研经历'],['grad-meeting','会议上的追问','有人对你的假设提出了不同解释。','科研经历'],['grad-submit','投稿前的核查','你发现结论需要更谨慎地表达。','发表成果'],['grad-revise','修改意见到了','每一条意见都值得判断，不是每一条都要照做。','发表成果'],['grad-intern','研究与实习的安排','岗位机会不错，你的研究也到了关键阶段。','科研经历'],['grad-teaching','助教第一次答疑','你在解释时发现自己还有一处没懂透。','教育实习'],['grad-team','同组项目的分工','各自擅长的事情不同，接口需要一起约定。','科研经历'],['grad-poster','海报展示的三分钟','你需要把很长的工作讲成一个清楚的问题。','科研经历'],['grad-course','研究生课程报告','老师更关心论证过程，而不是页数。','深度阅读'],['grad-alumni','毕业师兄回来聊天','他讲起工作后哪些研究习惯仍然有用。','校友联系'],['grad-thesis','论文初稿里的红字','修改不是一次完成，章节之间需要互相解释。','科研经历'],['grad-balance','生活与课题的节奏','日历里全是研究，你想留一点别的生活。','规律复习'],['grad-grant','项目申请的预算','每一笔支出都要对应一个真实任务。','商业分析'],['grad-review','同学请你读一遍稿件','指出问题，也要帮助对方找到修改方向。','科研经历'],['grad-method','换一种方法试试','新方法有潜力，也需要时间检验。','科研经历'],['grad-demo','成果展示日','你终于能把几个月的工作讲给非本专业的人。','科研经历'],
];
for (const [id,title,text,tag] of gradRows) EVENTS.push(ev(id,'graduate',title,text,[project('认真推进这次工作',tag),study('补充基础与证据',4),rest('调整节奏，先恢复状态')],{graduateOnly:true,focus:'project'}));

EVENTS.push(
  ev('love-meet','romance','一次自然的相识','活动结束后，有个人和你一起收拾。你们聊得比预想中久。',[risk('继续聊聊，交换联系方式',{energy:-4},{base:.68,tags:{'跨校社交':.1,'校园活动':.08},mood:.001},out('你们开始联系。', {mood:6},'meet'),out('聊得愉快，但这次没有进一步发展。',{mood:2})),op('友好道别',{mood:3},'你保留了一段轻松的相遇。')],{single:true,noCandidate:true,focus:'social',weight:1.8}),
  ev('love-invite','romance','要不要约一次见面','你们已经聊过几次。对方最近提到了一场想看的展览。',[risk('认真邀请，尊重对方安排',{balance:-60},{base:.6,tags:{'校园活动':.07,'跨校社交':.09},mood:.001},out('对方答应了。关系开始有了新的名字。',{mood:12},'date'),out('对方更愿意保持朋友关系。',{mood:-4},'clearCandidate')),op('继续普通朋友的相处',{mood:3},'你们都没有急着下结论。')],{single:true,candidate:true,focus:'social',weight:2}),
  ev('love-walk','romance','两个人的晚间散步','今天没什么大事。你们聊起各自不太愿意对别人说的烦恼。',[op('认真听，也说说自己',{mood:9,energy:4,tags:['共同回忆']},'平常的一晚，也让关系更稳定。',{action:'strengthen'}),op('坦诚说明今天有点累',{energy:8,mood:3},'对方理解了你的状态。')],{dating:true,repeat:true,focus:'social'}),
  ev('love-conflict','romance','约定与临时安排','你们原本约好见面，但你突然多了一件重要的事。',[risk('解释情况，一起重新安排',{energy:-4},{base:.68,tags:{'共同回忆':.12},mood:.001},out('你们找到了可以接受的新安排。',{mood:5},'strengthen'),out('误会没有解开，关系出现裂痕。',{mood:-8},'strain')),op('把自己的安排放在前面',{study:3,mood:-5},'这件事留下了一些距离。',{action:'strain'}),op('取消其他安排，赴约',{study:-2,mood:8,tags:['共同回忆']},'你把这次见面放在了优先位置。',{action:'strengthen'})],{dating:true,focus:'social'}),
  ev('love-break','romance','对方提出分开','你们之间有一些没有解决的分歧。对方说，想认真谈谈关系。',[risk('真诚挽留，讨论能否改变',{}, {base:.32,tags:{'共同回忆':.12,'远距离相处':.04},mood:.001},out('双方愿意再尝试一次。',{mood:5},'reconcile'),out('对方仍决定结束。你尊重了这个决定。',{mood:-9,tags:['分手经历']},'breakup')),op('接受分手，认真告别',{mood:-5,tags:['分手经历']},'关系结束了，生活还会继续。',{action:'breakup'})],{dating:true,strained:true,weight:4}),
  ev('love-gift','romance','一份不太贵的礼物','你想送一份能表达心意的礼物，也知道关系不是价格的比赛。',[op('挑一份合适的礼物',{balance:-120,mood:7,tags:['共同回忆']},'对方记住了你挑选它的理由。',{action:'strengthen',minBalance:120}),op('写一封认真表达的信',{mood:7,tags:['共同回忆']},'有些话写出来更清楚。',{action:'strengthen'})],{dating:true,focus:'social'}),
  ev('love-rich','easter','优惠券背后的故事','你以为对方和你一起拼单是为了省钱。后来发现，那家店是对方家开的。',[op('继续按原来的方式相处',{mood:8,tags:['富裕恋人','共同回忆']},'对方说，喜欢的是一起挑选晚饭的时间。',{action:'revealRich'}),op('坦诚聊聊消费差异',{mood:6,tags:['富裕恋人']},'你们约定不让花钱方式替彼此作决定。',{action:'revealRich'})],{dating:true,richPartner:true,notTags:['富裕恋人'],weight:5}),
  ev('love-trip','romance','一起出游的计划','时间、预算和想去的地方，都需要两个人商量。',[op('安排一次双方能接受的旅行',{balance:-400,mood:12,energy:5,tags:['共同回忆']},'这次旅行留下了几张很普通但很喜欢的照片。',{action:'strengthen',minBalance:400}),op('先留在校园约会',{balance:-40,mood:6,tags:['共同回忆']},'有时候熟悉的地方也很好。',{action:'strengthen'})],{dating:true,focus:'social'}),
  ev('love-support','romance','考试前的一条消息','对方说：忙的时候不用马上回复，考完一起吃饭。',[op('表达感谢，按计划准备',{study:4,mood:7,tags:['共同回忆']},'你感受到一种不打断你的支持。',{action:'strengthen'}),op('腾一点时间互相分享近况',{study:2,mood:8},'你们都知道对方最近在做什么。')],{dating:true,focus:'study'}),
  ev('single-after','romance','重新安排自己的周末','分手后，你第一次发现空出来的时间可以有很多种用法。',[rest('先照顾自己'),study('投入一个自己的目标',4),social('参加新的活动')],{single:true,tags:['分手经历'],focus:'rest'}),
  ev('single-choice','romance','朋友问你为什么不谈恋爱','你想了一下，这件事可以有很多答案。',[op('现在更想过好自己的生活',{mood:7,energy:5},'你不需要给每个阶段安排同样的目标。'),social('有合适的相遇就认识看看')],{single:true,focus:'social'}),
  ev('old-love','romance','偶然遇见旧人','你们都比以前更平静，也各自有了新的安排。',[op('友好问候后继续生活',{mood:5},'过去仍然是过去的一部分。'),op('聊聊近况',{mood:6,tags:['共同回忆']},'这次交流没有急着定义关系。')],{single:true,tags:['分手经历']}),
);

const firmRows = [
  ['星河科技','京州','tech',3,'大型技术团队，流程清晰，竞争较强'],['云桥网络','海州','tech',3,'互联网产品，重视项目与笔试'],['青禾软件','江城','tech',1,'本地软件团队，提供入门岗位'],['远帆数科','海州','tech',2,'数据与企业服务'],['松果互动','江城','tech',2,'游戏与数字内容'],['北辰智算','京州','tech',3,'技术研发与计算平台'],
  ['天穹航空','京州','engineering',3,'航空工程与研发'],['苍翼制造','江城','engineering',2,'装备制造与工程实践'],['启航机电','海州','engineering',1,'机械与生产技术'],['长川工程','江城','engineering',2,'工程设计与项目交付'],['环宇测控','京州','engineering',2,'控制与测试'],['海岳设备','海州','engineering',1,'设备技术支持'],
  ['知行学园','江城','education',2,'教学与课程支持'],['春禾教育','海州','education',1,'教育服务与教研'],['京州文教中心','京州','education',3,'教研与公共文化岗位'],['墨川出版','江城','education',2,'编辑与内容工作'],['晴空成长','海州','education',2,'学习产品与课程设计'],['溪桥书院','江城','education',1,'本地教育与课堂实践'],
  ['海川银行','海州','business',3,'金融服务与业务分析'],['京华证券','京州','business',3,'研究支持与金融业务'],['恒禾咨询','海州','business',2,'商业分析与咨询'],['江城财务服务','江城','business',1,'财务与业务支持'],['远山审计','京州','business',2,'审计与核查'],['蓝港商业','海州','business',1,'运营与市场分析'],
  ['京州城市服务','京州','general',2,'综合行政与公共服务'],['江城人才发展','江城','general',1,'运营与组织支持'],['海州新途集团','海州','general',2,'综合管理与企业服务'],['星桥文化','京州','general',1,'内容运营与活动策划'],
];
const roles = {tech:['软件开发','测试与技术支持'],engineering:['工程研发','工程技术支持'],education:['教学与教研','课程与内容'],business:['财务与分析','业务运营'],general:['综合管理','活动运营']};
export const JOBS = firmRows.flatMap(([company,city,category,tier,description],i) => roles[category].map((role,j) => ({id:`job-${i}-${j}`,company,city,category,role,tier:j===1?Math.max(1,tier-1):tier,description,degree:tier===3&&j===0&&i%3===0?'硕士':'本科',examLine:[0,38,57,72][Math.max(1,tier-j)],salary:[0,8,15,24][Math.max(1,tier-j)]+(i%4),salaryMax:[0,12,22,36][Math.max(1,tier-j)]+(i%4),hours:tier===3?'节奏较快':tier===1?'相对规律':'随项目变化'})));

export const QUESTIONS = [
  ['g1','general','一件商品原价 100 元，先打八折，再减 10 元，最终价格是多少？',['70 元','72 元','80 元','90 元'],0,'100 × 0.8 − 10 = 70。'],
  ['g2','general','数列 2、4、8、16 的下一项是什么？',['20','24','32','36'],2,'每一项是前一项的两倍。'],
  ['g3','general','一项任务，甲需 6 小时，乙需 3 小时。合作且效率不变，需要多久？',['1 小时','2 小时','3 小时','4 小时'],1,'合作效率为 1/6 + 1/3 = 1/2，每小时完成一半。'],
  ['g4','general','所有 A 都是 B。以下哪项一定成立？',['所有 B 都是 A','存在 B 不是 A','不存在 A 不是 B','A 与 B 没有交集'],2,'A 属于 B，因此不存在属于 A 而不属于 B 的对象。'],
  ['g5','general','某组人数从 40 增加到 50，增长率是多少？',['10%','20%','25%','50%'],2,'增长率是增加量除以原值：10/40 = 25%。'],
  ['g6','general','材料写道：“部分参加活动的学生也参加了竞赛。”可以确定什么？',['所有学生都参赛','至少有学生同时参加两者','所有参赛者都参加活动','没有学生参加两者'],1,'“部分”说明存在同时参加两者的学生。'],
  ['g7','general','三份文件必须按 A 在 B 前、B 在 C 前处理，顺序是？',['B、A、C','C、B、A','A、C、B','A、B、C'],3,'两条约束共同确定 A → B → C。'],
  ['g8','general','平均分为 80 的四次考试，总分是多少？',['160','240','320','400'],2,'总分等于平均分乘以次数。'],
  ['g9','general','某计划列出了多个备选方案，比较时最合理的做法是什么？',['只看最好结果','按同一组目标与约束比较','选名字最长的方案','忽略成本'],1,'统一比较维度才能判断取舍。'],
  ['g10','general','一次调查只询问了某社团成员。要描述全校学生，应首先注意什么？',['问卷颜色','样本代表性','成员姓名长度','调查员人数一定要偶数'],1,'样本范围可能不能代表全校。'],
  ['g11','general','一个班有 30 人，18 人选 A，选 A 的比例是多少？',['40%','50%','60%','70%'],2,'18/30 = 60%。'],
  ['g12','general','从 1 到 5 的整数中等概率抽一个，抽到偶数的概率是？',['1/5','2/5','3/5','1/2'],1,'偶数有 2、4，共两种。'],
  ['t1','tech','为了防止用户输入被当作 SQL 语句执行，应优先采用什么？',['参数化查询','只改输入框颜色','把密码写进代码','关闭日志'],0,'参数化查询将输入值与 SQL 结构分开。'],
  ['t2','tech','程序测试时，哪个边界最值得一起检查？',['仅正常输入','空输入、最小值、最大值及异常输入','只看代码行数','只测试界面颜色'],1,'边界与异常输入经常暴露真实问题。'],
  ['t3','tech','版本控制中的提交最适合表达什么？',['可说明的一组相关变化','整个硬盘备份','所有密码','一次鼠标移动'],0,'相关变化便于理解、审查与回退。'],
  ['t4','tech','二分查找的前提通常是什么？',['数据已按查找依据排序','数据必须只有两个','每次随机查找','禁止比较元素'],0,'排序使每次比较能够排除一半范围。'],
  ['e1','engineering','重复测量同一物理量，主要有助于评估什么？',['随机波动','物体颜色','单位名称长度','实验室楼层'],0,'重复测量可以观察随机误差与波动。'],
  ['e2','engineering','工程测试发现异常，首先应做什么？',['确认安全并记录条件','直接删数据','只改结论','隐瞒异常'],0,'先确保安全，并保留定位问题所需的信息。'],
  ['e3','engineering','图纸与实际零件不一致，合理处理是？',['核对尺寸、版本与测量方法','忽略不一致','任意修改单位','只重命名文件'],0,'核对来源和测量方式，再判断如何修正。'],
  ['e4','engineering','模型结论依赖一个假设，应怎样表达？',['说明假设与适用范围','写成任何情况都成立','省略全部条件','只增加小数位'],0,'结论需要有明确的适用条件。'],
  ['d1','education','学生回答错误时，哪种做法更有助于学习？',['先了解思路，再指出具体问题','只说不对','公开羞辱','完全不回应'],0,'了解思路能定位误解并提供反馈。'],
  ['d2','education','教学目标应尽量写成什么形式？',['能够观察或检验的学习结果','一句口号','教师讲话时长','教案页数'],0,'可观察的结果有助于安排与评价教学。'],
  ['d3','education','修改文章时，发现论据不支持结论，应怎样处理？',['核查论据并调整结论','只换字体','增加感叹号','删去出处'],0,'内容关系比形式修饰更重要。'],
  ['d4','education','观察学生行为时，应区分什么？',['实际观察与自己的解释','椅子与桌子数量','字体大小','书包品牌'],0,'记录事实与解释分开，能避免过度推断。'],
  ['b1','business','收入 1000 元，成本 700 元，简化利润是多少？',['300 元','700 元','1000 元','1700 元'],0,'简化利润为收入减成本。'],
  ['b2','business','比较投资方案时，收益之外还应关注什么？',['风险与资金期限','名称是否好听','宣传图片数量','只看最好的一天'],0,'风险与期限会影响方案是否适合。'],
  ['b3','business','报表数字异常时，合理的第一步是什么？',['核查来源与计算过程','直接修改到好看','只换单位','删除原始记录'],0,'需要回到来源和计算过程核查。'],
  ['b4','business','某指标同比增长，是与什么比较？',['上年同一时期','昨天','下一年','任意挑的最低值'],0,'同比比较相同时间段的跨年变化。'],
].map(([id,category,text,options,answer,explanation],i)=>{const shift=i%options.length;return {id,category,text,options:[...options.slice(shift),...options.slice(0,shift)],answer:(answer-shift+options.length)%options.length,explanation};});
export const PEOPLE = [
  {id:'lin',name:'林晚',city:'江城',rich:false}, {id:'zhou',name:'周知夏',city:'海州',rich:false},
  {id:'xu',name:'许星遥',city:'京州',rich:false}, {id:'shen',name:'沈予晴',city:'海州',rich:true},
  {id:'lu',name:'陆青禾',city:'江城',rich:false}, {id:'cheng',name:'程映秋',city:'京州',rich:false},
];
upgradeContent({SCHOOLS,MAJORS,TAGS,EVENTS,PEOPLE,JOBS,QUESTIONS});
QUESTIONS.push(...EXTRA_QUESTIONS);

EVENTS.push(...STORY_EVENTS,...EXTENDED_STORIES);

for(const e of EVENTS)if(e.duration===undefined)e.duration=e.category==='project'?3:e.category==='study'||e.category==='work'?2:1;

EVENTS.push(...RELATIONSHIP_EVENTS);

EVENTS.push(...ECONOMY_EVENTS);
applyEconomyContent(EVENTS);

EVENTS.push(...YEAR_EVENTS);

QUESTIONS.push(...PROFESSIONAL_QUESTIONS,...PUBLIC_QUESTIONS);

applyCharacterContent(EVENTS);

polishContent(EVENTS);

polishQuestions(QUESTIONS);
routeQuestions(QUESTIONS);

applyRound8Content(EVENTS);

TAGS['教学实践']={...TAGS['教育实习'],description:'课程试讲、课堂见习与实际教学活动形成的专业实践；不等于已完成有工资的岗位实习。'};
enrichCareers(JOBS);
