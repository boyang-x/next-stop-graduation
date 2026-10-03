import {option as o,event as e,chain} from './round12-content-kit.js';
const pre=(id,title,text,choices)=>e('meet-'+id,'romance',title,text,'social',choices,{single:true,candidate:true,storyScope:'candidate',duration:2});
const post=(id,title,text,choices)=>e('couple-'+id,'romance',title,text,'social',choices,{dating:true,storyScope:'relationship',duration:2});
const know=(text,result,delta=4,effects={})=>o(text,result,{energy:-5,mood:3,...effects},{candidateDelta:{familiarity:delta,trust:2,interest:2}});
const together=(text,result,intimacy=4,effects={})=>o(text,result,{energy:-5,mood:3,intimacy,...effects},{effectsMemory:true});
export const RELATIONSHIP_EXPANSION_12=[
 pre('route','第一次一起走哪条路','对方提议课后散步。操场更热闹，图书馆旁的步道更安静，都不需要消费。',[
 know('商量去安静步道，聊聊各自的一天','你们选了双方愿意去的地方，听到了具体近况。'),know('提议绕操场一圈，按原计划结束','你们完成了一次短时相处，没有打乱之后的安排。',3),know('这次时间不够，约好下次的具体地点','你们重新确认了约定，不让对方一直猜测。',2,{energy:-2})]),
 pre('meal','第一次吃饭先问偏好','你们准备一起吃午饭，食堂两种套餐分别20元和28元。对方的饮食偏好还不清楚。',[
 know('问清偏好，各付20元选普通套餐','你支付20元，和对方完成了一次自然的午餐。',5,{balance:-20}),know('双方确认后，各付28元尝试另一窗口','你支付28元，消费经过双方确认。',5,{balance:-28}),know('今天各自吃饭，饭后约十分钟聊天','你们保留了各自饭点，也留了一小段了解时间。',3,{energy:-3})]),
 pre('hobby','对方的兴趣你并不熟悉','对方提到常参加的一项兴趣活动。你有好奇，也不想装作自己已经很懂。',[
 know('问一个具体问题，请对方介绍','你听到了对方喜欢它的原因，没有假装同样精通。'),know('分享自己的兴趣，比较各自喜欢什么','你们了解了差异，不要求爱好完全一致。'),know('先看对方推荐的公开介绍，再约着聊','你完成了一段了解，联系有了具体的新话题。',3,{study:1})]),
 pre('message','一句简短消息怎样理解','对方回复“今天有点忙”。你不知道忙到什么时候，也不需要马上推断对方的心意。',[
 know('表示理解，约一个方便确认的时间','你们保留了具体联系安排，没有连续催问。',3,{energy:-2}),know('说明自己的空档，等对方选择','你给出可行时间，对方有选择空间。',3,{energy:-2}),o('本周先专注自己的安排，下周再联系','你说明了之后联系的时间，没有突然失联。',{mood:2},{candidateDelta:{trust:2}})]),
 pre('help','帮助之前先问需要什么','对方提到要整理一次活动材料，你愿意帮忙，但不知道是否已经有人负责。',[
 know('先问具体缺口，只帮核对一页材料','你完成了对方需要的小帮助，没有把协助当作恋爱承诺。',5,{energy:-7}),know('分享已有整理方法，让对方自己选择','你提供了方法，不替对方接管任务。',3),know('说明自己时间有限，约忙完再聊','你没有接受做不到的工作，相处仍有明确安排。',2,{energy:-2})]),
 pre('expectations','你们对联系频率的期待','相处几次后，对方问你平时希望怎样保持联系。课表和工作安排会影响回应速度。',[
 know('讨论方便联系的时段，不承诺随时在线','你们说清了能做到的事，减少了误解。',5),know('先保持现在的节奏，下周再看看是否合适','你们把试行时间说清楚，不把观察变成无限等待。',4),o('坦诚希望保持普通朋友关系','你说明了自己的方向，不继续发展恋爱。',{mood:1},{action:'clearCandidate'})]),
 post('budget','这次约会花多少钱','你和{partner}想周末见面。免费散步、各自30元的简单餐食、只短时见面都可以选择。',[
 together('约一次免费散步，留出双方方便的时间','你们完成了散步，消费没有成为相处的门槛。'),together('商量后支付自己的30元餐费，一起吃饭','你支付30元，安排经过双方确认。',4,{balance:-30}),together('本周短时见面，另约一次较长相处','你们确认了本周和下次的时间，没有无解释地取消。',2,{energy:-3})]),
 post('choosing','送礼先考虑能否用得上','你想为{partner}准备小礼物。对方最近提过需要一个普通笔记本，校内商店售价25元。',[
 together('确认需要后，买25元的笔记本','你支付25元，礼物对应了真实需要。',4,{balance:-25}),together('写一张祝福卡，分享最近的一件小事','你用已有纸张表达关心，没有额外消费。',3,{energy:-4}),together('先不送礼，约好一起整理近期安排','你们完成了具体交流，不用礼物替代沟通。',3)]),
 post('different-rest','你们休息的方式不同','你想安静待一会儿，{partner}想去热闹的公共活动。双方都需要休息，不必每次一起行动。',[
 together('先各自休息，晚些时候碰面','你们保留了各自恢复方式，也兑现了之后的联系。',3,{energy:6}),together('选一个安静的免费公共空间，短时相处','双方接受了方案，没有勉强参加不想去的活动。',4,{energy:-3}),together('这次各自安排，约好明天聊近况','你们说明了时间，不把分开休息当作关系变差。',2,{energy:5})]),
 post('reading','同一篇文章读出了不同意思','你和{partner}看了一篇公开文章，关注的段落不同。讨论可以有差异，也可以适时结束。',[
 together('各说一处具体依据，再听对方解释','你们比较了理解，没有要求喜好或结论一致。',4,{study:2}),together('问对方为什么在意那一段','你了解了对方的关注点，保留了自己的理解。',4),together('说明今天有些累，下次再接着聊','你们约好了继续交流的时间，没有把暂停当作否定。',2,{energy:4})]),
 post('new-stage','新阶段的课表换了','你的课程或工作安排变化了，原来的固定见面时间不再方便。{partner}也有自己的日程。',[
 together('核对两人的空档，重新定一个可兑现的时间','你们更新了约定，不继续使用已经失效的安排。'),together('先保持短时联系，月底再确认长期安排','你们给过渡安排设了期限，保留了关心。',3),together('这周各自处理新安排，下周固定通话','你们说明了联系时间，没有把忙碌变成失联。',3,{energy:-3})]),
 post('friends','朋友聚会是否一起参加','{partner}邀请你参加食堂小聚，每人餐费25元。你们可以一起去，也可以各自保留安排。',[
 together('接受邀请，支付自己的25元餐费','你支付25元，参加了一次双方愿意的聚餐。',4,{balance:-25}),together('说明已有安排，这次不参加','你提前告知，不影响对方按原计划见朋友。',2,{energy:-2}),together('饭后在校园碰面，听对方讲聚会近况','你们保留了各自饭点，也安排了联系。',3,{energy:-3})]),
];
RELATIONSHIP_EXPANSION_12.push(...chain('romance','couple-outing',[
 {title:'把共同出游缩到可完成的范围',text:'你和{partner}想在校内免费展览开放日一起参观，还没有确定路线和时间。',category:'social',duration:2,choices:[together('确认开放时间，约好一起看一个展区','你们完成了必要确认，后续按约见面。',3),together('只留一小时，先安排集合与结束时间','你们确定了较短的安排，没有承诺一整天。',3),together('这次先各自安排，不接受共同出游','你们在确定前说明情况，本轮不进入出游后续。',2)]},
 {title:'出发前一处安排需要调整',text:'你们已约好看展，对方临时多了一项必要任务。原来的时间不再合适。',category:'social',duration:1,choices:[together('双方确认后改到晚一点','你们重新确认了时间，准备按新安排见面。',3),together('减少一个展区，保留关键参观','双方同意缩小范围，时间不再勉强。',3),together('取消这次共同参观，约好另一次联系','你们明确取消，不让任何一方空等。',2)]},
 {title:'一次调整之后的见面',text:'你们按调整后的时间参观了展览，想聊聊哪些安排适合以后继续用。',category:'social',duration:1,choices:[together('说说各自喜欢的部分和方便的节奏','你们留下了具体回忆，不要求每次安排都一样。',5),together('感谢对方说明变化，按约结束','你们完成了相处，也尊重各自之后的时间。',4),together('各自回去休息，晚上简短报平安','你们完成了本次见面，保留了后续联系。',3,{energy:4})]},
],{dating:true,storyScope:'relationship',maxSem:13}));
RELATIONSHIP_EXPANSION_12.push(...chain('romance','couple-graduation',[
 {title:'毕业后的距离先说清楚',text:'你和{partner}开始讨论毕业后的城市安排。双方尚未确认所有去向，不能提前许诺必然同城。',category:'social',duration:2,choices:[together('列出已经确定和仍待确认的事项','你们完成了第一轮讨论，之后再核对变化。',3),together('先谈各自能接受的联系和见面频率','你们说明了现实条件，不要求对方放弃自己的方向。',3),together('目前信息不足，约好下月再谈','双方确认了讨论时间，本轮不进入后续决策。',2)]},
 {title:'去向变化之后再核对约定',text:'你们讨论过毕业安排，现在有一项时间或城市信息比之前更明确，需要更新原来的设想。',category:'social',duration:2,choices:[together('按已知情况调整联系与预算','你们形成了可执行的过渡安排，不承诺尚未确认的费用。',4),together('先确认各自的重要日期，再安排见面','你们明确了时间，保留后续调整空间。',4),together('说明仍有一项未确定，暂不增加承诺','双方知道了缺少的信息，本轮不进入最终计划。',2)]},
 {title:'把未来安排落实到下一次联系',text:'你们已有一份现实的过渡安排，现在只需要确认下一次联系，不用一次解决全部未来。',category:'social',duration:1,choices:[together('确认下一次通话与可行的见面计划','你们兑现了一个具体约定，长期结果仍由之后的相处决定。',5),together('先安排固定通话，等去向稳定再见面','你们保留了可持续联系，没有提前扣除旅费。',4),together('本周先整理各自事项，按约报平安','你们完成了过渡安排，不把各自忙碌理解为疏远。',3)]},
],{dating:true,storyScope:'relationship',semesters:[6,7,12,13]}));

const cadre=(id,title,text,roles,choices)=>e('cadre-'+id,'cadre',title,text,'social',choices,{cadre:true,roles,storyScope:'cadre',maxSem:7,duration:3});
const duty=(text,result,effects={},performance=1)=>o(text,result,{energy:-9,...effects},{cadreEffect:performance});
export const CADRE_EXPANSION=[
 cadre('homework','作业通知有两种版本','你负责学业通知，两份截止时间不同，需要先向任课教师核实。',['class-study','union-study'],[
 duty('核实后发一条完整更正','同学收到了确认过的时间，你保留了原通知的更正说明。',{study:2}),duty('先标明待核实，收到确认后统一回复','你说明了不确定部分，没有让同学按猜测提交。',{energy:-8}),duty('请教师直接发布确认，你协助提醒','你完成了协调，不替教师决定截止时间。',{energy:-6})]),
 cadre('borrow','借用活动物品先留记录','你协助管理一次活动借用，归还时间和责任人尚未登记。',['class-life','union-service'],[
 duty('核对物品与责任人，完成借还登记','你留下了真实记录，活动结束后按约核对。'),duty('减少借用范围，只登记必要物品','你控制了工作量，必要记录仍完整。',{energy:-7}),duty('联系负责人确认流程，再协助交接','你按确认的流程工作，不独自承担未说明的责任。',{energy:-7})]),
 cadre('venue','同一场地有两项活动','你负责文体协调，两项活动的申请时间重叠，场地还未最终确认。',['class-culture','year-culture','union-culture'],[
 duty('核对申请，协商错开时段','双方确认了可用时间，没有把场地重复承诺出去。',{energy:-12}),duty('调整自己负责活动的范围与时间','你完成了可执行安排，参与者收到更新。',{energy:-10}),duty('请场地负责人确认，再统一通知','你完成了协调，不越过场地管理流程。',{energy:-8})]),
 cadre('feedback','同学的意见需要分清事项','你收集了一轮班级意见，其中有课程、设施和个人安排三类问题。',['class-leader'],[
 duty('分类后送到对应负责人，记录回复','你完成了反馈交接，不承诺自己无权决定的结果。'),duty('先处理最紧急的一项，再排其余事项','你说明了顺序和后续时间，没有让意见消失。',{energy:-8}),duty('与同学确认事实，再提交较小范围反馈','你核对了信息，避免把转述当作所有人的意见。',{energy:-8})]),
 cadre('cross-course','跨班复习安排撞到课程','你负责年级学习协调，两个班的空档不同，不能只按一个班排时间。',['year-study','year-leader'],[
 duty('收集空档，分两场安排互助','你协调了可参加的时间，没有替同学取消课程。',{energy:-13,study:2}),duty('先提供材料，另约一次短答疑','你完成了较小安排，时间冲突被明确说明。',{energy:-9,study:2}),duty('各班自行安排，你核对公共材料','你完成了协调材料的职责，不把分散活动算成一场完整讲座。',{energy:-8})]),
 cadre('access','活动参加方式需要调整','一位同学说明当前场地不方便参加，你负责联系组织者核对可行方式。',['class-culture','year-culture','union-culture'],[
 duty('核对替代场地，调整参加方式','组织者确认了可行方案，你完成了协调。',{energy:-12}),duty('提供允许的线上材料，确认能否参与讨论','你说明了材料与现场活动的差别，不宣称两者完全等同。',{energy:-8}),duty('请负责人直接沟通需求，你负责后续通知','你保持了明确分工，没有擅自替同学决定需要什么。',{energy:-7})]),
 cadre('service-list','校园服务清单先核实','你负责生活服务汇总，一条办事窗口信息已经过期。',['class-life','union-service'],[
 duty('核实时间与地点，更新清单','你修正了具体信息，标明核实日期。'),duty('先删除未确认信息，再补充可核实部分','你没有继续传播过期安排。',{energy:-7}),duty('联系管理人员确认，转发正式说明','你提供了准确来源，不自行承诺服务结果。',{energy:-6})]),
 cadre('head-work','部门分工需要重新确认','你担任部门负责人，一位干事的课程安排变化了，原任务不再适合。',['union-head'],[
 duty('调整任务与期限，分别确认','你完成了分工更新，没有把全部工作交给一人。',{energy:-13}),duty('缩小本次活动范围，保留关键任务','你把工作量控制在可以完成的范围内。',{energy:-10}),duty('先接手紧急部分，再安排正式交接','你完成了应急协调，也为后续设了明确边界。',{energy:-15})]),
 cadre('president','跨部门活动先明确接口','你负责统筹学生会活动，各部门对材料交接时间理解不同。',['union-president'],[
 duty('核对交付物和时间，完成共同确认','各部门知道了谁交什么、何时交，活动安排更清楚。',{energy:-15}),duty('减少一项非必要内容，降低交接负担','你保留关键活动，避免把目标扩大到无法完成。',{energy:-11}),duty('分开试行一个环节，再确认完整流程','你完成了限定范围的核查，不直接宣布整场活动已成功。',{energy:-12})]),
 cadre('year-notice','年级通知怎样覆盖各班','你负责年级事务，一条已确认的通知需要传达，但各班的班会时间不同。',['year-leader'],[
 duty('统一材料，各班按方便时间说明','你完成了准确传达，不要求所有班临时改课。',{energy:-12}),duty('发正式说明并保留问答时段','你提供了可查阅内容，也留出具体答疑方式。',{energy:-9}),duty('请班级负责人确认收到，再处理遗漏','你完成了逐班核对，没有把群消息发送当作所有人已经看懂。',{energy:-10})]),
 cadre('evidence','学业活动记录不能只看签到','你协助学习活动核对参加记录，记录应对应真实到场与任务。',['class-study','union-study','year-study'],[
 duty('按实际参加情况核对并提交','你完成了记录，不替缺席者填完成证明。',{study:2}),duty('指出一处漏记，请负责人复核','你帮助更正记录，不自行增加任何人的成绩。',{energy:-8}),duty('整理材料交负责人决定，自己不越权评分','你完成了职责范围内的工作。',{energy:-7})]),
 cadre('handover','下一任需要哪些资料','任期接近交接，你需要整理已经处理的事项和仍待负责人回复的问题。',['class-leader','class-study','class-life','class-culture','year-leader','year-study','year-culture','union-study','union-culture','union-service','union-head','union-president'],[
 duty('列出已完成与未完成事项，逐项交接','你完成了明确交接，不把未解决问题藏起来。',{energy:-12}),duty('先交接关键材料，约好补充说明','接手者知道了材料范围和后续时间。',{energy:-9}),duty('请指导老师一起确认交接边界','你按确认范围移交，没有擅自公开个人材料。',{energy:-8})]),
];
CADRE_EXPANSION.at(-1).months=[6,7,8];
CADRE_EXPANSION.at(-1).duration=2;
if(RELATIONSHIP_EXPANSION_12.length!==18||CADRE_EXPANSION.length!==12)throw Error('Relationship/cadre expansion mismatch');
