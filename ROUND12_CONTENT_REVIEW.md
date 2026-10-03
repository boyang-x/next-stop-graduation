# 第十二轮内容与条件审读清单

本轮159个新增节点；以下保留实际加载后的原文、条件、每个行动与结果，方便直接复核。配置检查只证明字段与引用有效，不代替语言和情境审读。

审读规则：明确地点和对象；费用对应真实购买；准备与完成分开；研究生专业方法分流；关系选项尊重双方日程；不以恶意行为凑选项；坏运气不扣魅力；后续有前置行动及退出路径。

研究生主题数量：early 16、middle 18、late 14；阶段交界允许已开始的后续继续。

## r12-course-plan · 选课前先看要求

选课系统即将开放。你手里有本专业要求和课程时间，热门课程不一定都适合自己。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"undergraduateOnly":true}`；日程5周（含正常课程）。

1. 核对先修与必修，再安排选修
   结果：你排出了符合要求的课表，保留了时间冲突的备选。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
2. 请教教务老师，确认一处先修问题
   结果：你确认了要求，没有仅凭同学评价选课。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 先完成必修安排，少加一门选修
   结果：你减少了额外负担，必要课程仍然保留。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-study-partner · 互相讲题的一次约定

同学想每周一起复习一小段课程。你们需要先确认时间和各自负责的内容。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程5周（含正常课程）。

1. 每周各准备一道题，持续三周
   结果：你们按约完成了三次互相讲题，准备计入实际学习。
   数值与后续：`{"effects":{"study":6,"energy":-17,"tags":["学业互助"]}}`
2. 先试一次，确认节奏再决定
   结果：你完成了一次互助，不把试行写成长期习惯。
   数值与后续：`{"effects":{"study":3,"energy":-8},"duration":1}`
3. 交换资料，各自安排复习
   结果：你们说明了资料用途，各自完成一段复习。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`

## r12-library-request · 图书馆没有那本书

你查找的一本课程参考书暂时无可借副本。馆员介绍了预约、馆际服务和替代资料。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程5周（含正常课程）。

1. 预约借阅，先使用馆内替代资料
   结果：你完成了一段有出处的阅读，不保证预约马上到书。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
2. 询问可用的电子资源并核对版本
   结果：你使用了学校允许访问的资源，记录了版本差异。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 缩小本次阅读范围，先看已有教材
   结果：你完成了基础阅读，未把缺失资料假装成已经读过。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-desk-rearrange · 桌面挤到放不下书

课程材料和日用品混在桌上。整理可以花钱买收纳，也可以先减少不必要的物品。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 花35元买一个收纳盒，整理桌面
   结果：你支付35元，完成了整理，没有把它算成志愿服务。
   数值与后续：`{"effects":{"balance":-35,"energy":-5,"mood":4}}`
2. 用现有纸盒分类，归还借来的东西
   结果：你没有额外消费，也找回了可用的桌面。
   数值与后续：`{"effects":{"energy":-6,"mood":3}}`
3. 先整理学习区域，其余周末再做
   结果：你完成了局部整理，日用品仍留待后续处理。
   数值与后续：`{"effects":{"energy":-3,"mood":2}}`

## r12-canteen-hours · 赶课前先确认食堂时间

这周有几次课间很短。你想安排饭点，避免到窗口才发现已结束供餐。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 按课表提前吃一顿25元的套餐
   结果：你支付25元，正常吃饭后按时去上课。
   数值与后续：`{"effects":{"balance":-25,"energy":3,"mood":2}}`
2. 在另一食堂买18元的简餐
   结果：你支付18元，缩短了路程，没有省掉必要的一餐。
   数值与后续：`{"effects":{"balance":-18,"energy":2,"mood":2}}`
3. 带好已有餐食，在允许的公共区域用餐
   结果：你吃完自带餐食，没有产生本次额外费用。
   数值与后续：`{"effects":{"energy":2,"mood":1}}`

## r12-laundry-weather · 洗好的衣服遇上阴雨

晾晒区连续几天潮湿。你需要安排清洁和替换衣物，而不是一直等同一件衣服干。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 支付12元使用公共烘干设备
   结果：你支付12元，按设备说明处理了适合烘干的衣物。
   数值与后续：`{"effects":{"balance":-12,"energy":-3,"mood":3}}`
2. 换穿备用衣物，调整晾晒位置
   结果：你没有额外花钱，也保持了正常的穿着安排。
   数值与后续：`{"effects":{"energy":-4,"mood":2}}`
3. 先清洗急需的一件，其他另约时间
   结果：你缩小了本次整理范围，没有把全部衣物堆在一起。
   数值与后续：`{"effects":{"energy":-3,"mood":1}}`

## r12-dorm-guest · 室友想邀请朋友来访

室友准备邀请朋友到公共会客区。大家的学习和休息安排不同，需要先约好时间。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 商量共同方便的时段，一起见面
   结果：你们确认了地点与结束时间，没有占用寝室休息空间。
   数值与后续：`{"effects":{"energy":-5,"mood":4}}`
2. 说明自己要学习，请他们使用公共会客区
   结果：你保留了自己的安排，也给来访留下了可行空间。
   数值与后续：`{"effects":{"study":2,"energy":-4}}`
3. 这次不参加，另约一次食堂聊天
   结果：你说明了原因，不把未参加理解为不欢迎朋友。
   数值与后续：`{"effects":{"mood":2}}`

## r12-bike-route · 去新教学楼的路线

下周的课换到校内另一栋楼。步行和校园交通的时间不同，你还没实际走过。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"undergraduateOnly":true}`；日程4周（含正常课程）。

1. 提前步行一遍，确认入口
   结果：你记住了路线和所需时间，之后不必临时赶路。
   数值与后续：`{"effects":{"energy":-6,"mood":2}}`
2. 支付2元使用校内交通，确认停靠点
   结果：你支付2元并核对了站点，保留步行备选。
   数值与后续：`{"effects":{"balance":-2,"energy":-3}}`
3. 与同路同学核对地图，预留步行时间
   结果：你确认了方向，正式上课时仍会提前出发。
   数值与后续：`{"effects":{"energy":-2,"mood":1}}`

## r12-small-workshop · 只做一下午的小活动

校园工作坊开放一下午体验。材料费30元，可以旁听免费介绍，也可以暂不参加。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 支付材料费，完成一个小作品
   结果：你支付30元，完成了体验作品，本次没有竞赛奖项。
   数值与后续：`{"effects":{"balance":-30,"energy":-6,"mood":5,"tags":["创作经历"]},"duration":1}`
2. 免费听介绍，问一个具体问题
   结果：你了解了制作方式，没有领取成品或完成经历。
   数值与后续：`{"effects":{"energy":-3,"mood":3},"duration":1}`
3. 这次不报名，把下午留给休息
   结果：你没有支付材料费，留出了一段恢复时间。
   数值与后续：`{"effects":{"energy":12,"mood":3},"duration":1}`

## r12-shift-confirm · 临时兼职先确认班次

校内活动需要两次整理资料的临时班次，每次100元，完成后结算；与你的课表有一处冲突。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 只接不冲突的一次，完成后领取100元
   结果：你完成了一个班次，领取100元报酬。
   数值与后续：`{"effects":{"balance":100,"energy":-12,"tags":["兼职经历"]},"duration":2}`
2. 协商调整后完成两个班次，领取200元
   结果：负责人同意调整，你按约完成两个班次，领取200元。
   数值与后续：`{"effects":{"balance":200,"energy":-20,"tags":["兼职经历"]},"duration":4}`
3. 说明课表冲突，不接这次兼职
   结果：你在接单前拒绝，没有领取报酬。
   数值与后续：`{"effects":{"energy":4,"mood":2}}`

## r12-public-speaking · 讲座前的简短介绍

组织者请你介绍今天的讲座嘉宾，内容已核实。你可以上台，也可以承担其他现场工作。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 按提纲上台，完成两分钟介绍
   结果：按成功与失败结果公布。
   成功：介绍清楚完整，你的公开表达更自然了。
   失败：紧张让你几次停顿，嘉宾信息仍介绍完了。你记录了卡住的地方，魅力小幅下降。
   数值与后续：`{"effects":{"energy":-7},"duration":1,"probability":{"base":0.68,"charm":0.001,"mood":0.001},"success":{"text":"介绍清楚完整，你的公开表达更自然了。","effects":{"charm":0.5,"mood":4,"tags":["公共表达"]}},"failure":{"text":"紧张让你几次停顿，嘉宾信息仍介绍完了。你记录了卡住的地方，魅力小幅下降。","effects":{"charm":-0.5,"mood":-3}}}`
2. 先与搭档排练，再共同完成介绍
   结果：你们完成了有准备的介绍，你的表达有所改善。
   数值与后续：`{"effects":{"energy":-10,"charm":0.3,"tags":["公共表达"]},"duration":2}`
3. 改做签到和材料核对
   结果：组织者同意调整，你完成了明确的幕后任务。
   数值与后续：`{"effects":{"energy":-6,"mood":2},"duration":1}`

## r12-presentation-question · 课堂展示后的一次追问

你完成了课程展示，老师追问一个尚未完全解释清楚的步骤。可以说明已有证据，也可以申请补充。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程5周（含正常课程）。

1. 按现有证据解释，并说明不确定部分
   结果：按成功与失败结果公布。
   成功：你讲清了现有依据，表达更有条理。
   失败：紧张让解释有些混乱。老师要求你整理后补交，你的表达信心受到影响，魅力下降0.5。
   数值与后续：`{"effects":{"energy":-7},"duration":1,"probability":{"base":0.65,"grade":0.002},"success":{"text":"你讲清了现有依据，表达更有条理。","effects":{"charm":0.4,"study":2}},"failure":{"text":"紧张让解释有些混乱。老师要求你整理后补交，你的表达信心受到影响，魅力下降0.5。","effects":{"charm":-0.5,"mood":-3,"study":1}}}`
2. 说明现在答不完整，补交一页说明
   结果：你核查后完成了补交，没有把未知问题说成已经解决。
   数值与后续：`{"effects":{"study":3,"energy":-10}}`
3. 与老师确认问题范围，先回答能证实的部分
   结果：你完成了较小范围的说明，其他部分明确留待核查。
   数值与后续：`{"effects":{"study":2,"energy":-6},"duration":1}`

## r12-sports-schedule · 把运动安排进课表

你想在接下来几周坚持活动。课程时间不同，可以选择短时安排，也可以集中到周末。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 这次先完成一次慢跑，确认合适的时间
   结果：你完成了一次运动，没有直接把未来计划算成三次。
   数值与后续：`{"effects":{"energy":-8,"mood":6,"exercise":true,"tags":["运动习惯"]},"duration":1}`
2. 与朋友完成一次低强度活动
   结果：你按自己的强度完成运动，之后再决定是否一起坚持。
   数值与后续：`{"effects":{"energy":-8,"mood":5,"exercise":true,"tags":["运动习惯"]},"duration":1}`
3. 本周先散步，等安排稳定再加运动
   结果：你完成了一次散步，本次不记正式运动次数。
   数值与后续：`{"effects":{"energy":-3,"mood":4},"duration":1}`

## r12-museum-free · 校内展览的免费开放日

校史展览免费开放。你可以完整参观，也可以只看与自己感兴趣方向有关的部分。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 参观展览，记录两件想进一步了解的事
   结果：你完成了参观，记下了可继续查阅的资料。
   数值与后续：`{"effects":{"energy":-6,"mood":4}}`
2. 与朋友看一个展区，交换各自的观察
   结果：你们留下了一次具体的交流，没有把参观记成研究成果。
   数值与后续：`{"effects":{"energy":-4,"mood":4}}`
3. 这次不去，留出自己的安排
   结果：你没有报名或消费，保持了原来的计划。
   数值与后续：`{"effects":{"energy":4,"mood":2}}`

## r12-shared-cost · 聚餐之前先算清预算

朋友提议去校门口吃饭，预计每人45元。你也可以建议食堂25元的方案。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 接受45元方案，支付自己的餐费
   结果：你支付45元，和朋友完成了一次聚餐。
   数值与后续：`{"effects":{"balance":-45,"energy":-4,"mood":5}}`
2. 提议25元食堂方案，大家确认后一起吃
   结果：朋友们接受建议，你支付25元，没有替别人决定支出。
   数值与后续：`{"effects":{"balance":-25,"energy":-4,"mood":4}}`
3. 说明已有安排，这次不参加
   结果：你在确定人数前说明情况，没有产生餐费。
   数值与后续：`{"effects":{"mood":2}}`

## r12-quiet-space · 自习地点临时关闭

你常去的阅览区今天维护，门口列出了其他开放地点。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程5周（含正常课程）。

1. 到另一层阅览室完成复习
   结果：你换了地点，按原计划完成一段学习。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
2. 先在公共区域整理提纲，再回寝室学习
   结果：你调整了工作顺序，没有占用禁止学习的空间。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`
3. 今天改成短时阅读，减少额外安排
   结果：你完成了较小的阅读任务，保留了恢复时间。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-project-application · 校园小项目的试行申请

学院征集改善校园学习空间的小项目。申请免费，名额有限；提交后会收到是否入选的结果，入选也要实际参与才算完成。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程6周（含正常课程）。

1. 整理一个小范围方案，通过正式渠道提交
   结果：你提交了试行申请，接下来等待结果；目前没有完成经历或综测加分。
   数值与后续：`{"effects":{"energy":-12,"study":2},"action":"submitProjectApplication"}`
2. 先核对场地和时间，本轮不提交
   结果：你完成了可行性核对，没有生成报名或入选结果。
   数值与后续：`{"effects":{"energy":-7,"study":2}}`
3. 本轮不申请，保留自己的学习安排
   结果：你没有接受项目任务，也没有产生费用。
   数值与后续：`{"effects":{"mood":1}}`

## r12-weekend-call · 和家人约好联系时间

最近几次电话都碰上你正在上课。你想找一个双方方便的时段聊近况。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13}`；日程4周（含正常课程）。

1. 约定周末时间，认真聊一会儿
   结果：你按约联系了家人，分享了具体近况。
   数值与后续：`{"effects":{"energy":3,"mood":6}}`
2. 先发消息说明安排，晚上再通话
   结果：你没有让家人猜测原因，完成了简短联系。
   数值与后续：`{"effects":{"energy":2,"mood":4}}`
3. 本周只报平安，约好下周长聊
   结果：你说明了当前安排，双方确认了之后的时间。
   数值与后续：`{"effects":{"mood":3}}`

## r12-clothes-male · 男生的衣柜整理

你准备为日常见面和展示整理穿着。店里一套合身的基础衣物200元；也能用已有衣服搭配，价格不等于魅力。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"gender":"male"}`；日程4周（含正常课程）。

1. 试穿后买合身的衬衫与长裤（200元）
   结果：你支付200元，确认尺码与使用场合后完成购买，整体呈现有所改善。
   数值与后续：`{"effects":{"balance":-200,"energy":-5,"charm":1.2,"mood":3}}`
2. 用现有衣服整理一套干净的休闲搭配
   结果：你清洁、整理并试穿已有衣物，没有额外花钱，仪态有所改善。
   数值与后续：`{"effects":{"energy":-6,"charm":0.4,"mood":2}}`
3. 只列出需要替换的衣物，这次不买
   结果：你完成了清单，没有消费，也不把购物计划算成魅力提升。
   数值与后续：`{"effects":{"energy":-2}}`

## r12-grooming-male · 男生的形象准备

你想为接下来的见面整理形象。校门口理发店报价80元，也可以自行整理头发和衣物；化妆不是必须。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"gender":"male"}`；日程4周（含正常课程）。

1. 说明想保留的长度，花80元修整发型
   结果：你支付80元，沟通后完成修剪并学会日常整理，魅力增加。
   数值与后续：`{"effects":{"balance":-80,"energy":-4,"charm":0.8,"mood":3}}`
2. 自行整理头发，清洁鞋面并调整衣着
   结果：你用已有物品完成整理，没有新增消费，呈现更利落。
   数值与后续：`{"effects":{"energy":-5,"charm":0.3,"mood":2}}`
3. 今天只做必要清洁，不另外改变造型
   结果：你保持了正常自我照料，本次没有额外魅力加分。
   数值与后续：`{"effects":{"energy":-2,"mood":1}}`

## r12-clothes-female · 女生的衣柜整理

你准备为日常见面和展示整理穿着。店里一套合身的基础衣物200元；也能用已有衣服搭配，价格不等于魅力。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"gender":"female"}`；日程4周（含正常课程）。

1. 试穿后买合身的上衣与长裤（200元）
   结果：你支付200元，确认尺码与使用场合后完成购买，整体呈现有所改善。
   数值与后续：`{"effects":{"balance":-200,"energy":-5,"charm":1.2,"mood":3}}`
2. 用现有衣服整理一套舒适的日常搭配
   结果：你清洁、整理并试穿已有衣物，没有额外花钱，仪态有所改善。
   数值与后续：`{"effects":{"energy":-6,"charm":0.4,"mood":2}}`
3. 只列出需要替换的衣物，这次不买
   结果：你完成了清单，没有消费，也不把购物计划算成魅力提升。
   数值与后续：`{"effects":{"energy":-2}}`

## r12-grooming-female · 女生的形象准备

你想为接下来的见面整理形象。校门口理发店报价80元，也可以自行整理头发和衣物；化妆不是必须。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"gender":"female"}`；日程4周（含正常课程）。

1. 说明希望的长度与打理方式，花80元修整发型
   结果：你支付80元，沟通后完成修剪并学会日常整理，魅力增加。
   数值与后续：`{"effects":{"balance":-80,"energy":-4,"charm":0.8,"mood":3}}`
2. 自行整理头发，选择素颜或已有用品的简单妆容
   结果：你用已有物品完成整理，没有新增消费，呈现更利落。
   数值与后续：`{"effects":{"energy":-5,"charm":0.3,"mood":2}}`
3. 今天只做必要清洁，不另外改变造型
   结果：你保持了正常自我照料，本次没有额外魅力加分。
   数值与后续：`{"effects":{"energy":-2,"mood":1}}`

## r12-cat-meet · 图书馆外的一只小猫

图书馆侧门的花坛边，一只橘白猫正趴在阴影里。公告提示不要追逐，也不要随意投喂。

情境与触发：`{"group":"common","storyScope":"campus","repeat":false,"maxSem":13}`；日程1周（含正常课程）。

1. 在合适距离停一会儿，记住它的花色
   结果：你没有靠近打扰，记住了这只橘白猫。
   数值与后续：`{"effects":{"energy":-2,"mood":4},"setFlags":{"catKnown":true}}`
2. 远远拍一张照片，再继续走
   结果：你没有开闪光灯，也没有追逐，小猫的样子留在照片里。
   数值与后续：`{"effects":{"energy":-2,"mood":3},"setFlags":{"catKnown":true}}`
3. 赶着去上课，这次不停留
   结果：你按原计划离开，本次没有建立与小猫有关的经历。
   数值与后续：`{"effects":{}}`

## r12-cat-again · 花坛边又遇见了它

你认出了图书馆侧门那只橘白猫。它今天坐在台阶边，望着经过的人。

情境与触发：`{"group":"common","storyScope":"campus","repeat":false,"maxSem":13,"requiresFlags":["catKnown"]}`；日程1周（含正常课程）。

1. 在远处坐一会儿，让它自己决定是否靠近
   结果：你安静停留，小猫走到附近又停下，没有被抱走或追逐。
   数值与后续：`{"effects":{"energy":-2,"mood":5},"setFlags":{"catBonded":true}}`
2. 和同学认出同一只猫，远远看一会儿
   结果：你们记住了它常出现的位置，没有改变它的活动安排。
   数值与后续：`{"effects":{"energy":-2,"mood":4},"setFlags":{"catBonded":true}}`
3. 今天先去办事，不打扰它
   结果：你认出了它，仍按自己的安排离开。
   数值与后续：`{"effects":{"mood":2}}`

## r12-certificate-0 · 目标岗位到底需要什么

你整理了目标方向的要求，发现“需要了解”与“必须持证”并不是一回事。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-certificate-started"]}`；日程3周（含正常课程）。

1. 核对学校说明和岗位要求，选一个匹配项目
   结果：你明确了理由，下一步再决定是否付费报名。
   数值与后续：`{"effects":{"study":3,"energy":-8},"setFlags":{"r12-certificate-0":true},"followUp":{"id":"r12-certificate-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 比较两项要求，优先解决一个真实缺口
   结果：你完成了比较，不因为别人报名就同时报多项。
   数值与后续：`{"effects":{"study":3,"energy":-7},"setFlags":{"r12-certificate-0":true},"followUp":{"id":"r12-certificate-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 确认目前不需要证书，结束本次比较
   结果：你选择不报名，没有费用，也没有证书或综测奖励。
   数值与后续：`{"effects":{"study":2,"energy":-4}}`

## r12-certificate-1 · 比较之后，是否报名

你已经核对方向与要求。游戏中这次专业相关考试报名费180元，之后仍要准备、参加并等待结果。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-certificate-0"]}`；日程2周（含正常课程）。

1. 支付180元，报名已比较过的专业相关考试
   结果：报名已记录，接下来按考试流程安排准备和结果。
   数值与后续：`{"effects":{"balance":-180,"energy":-3},"action":"program:relevant"}`
2. 本学期先补课程基础，暂不报名
   结果：你没有支付报名费，把比较结论保留下来。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 先请教教务老师，确认后再考虑下次报名
   结果：你完成了一次咨询，本轮不生成报名、证书或综测分。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-reading-0 · 读后笔记里还剩一个问题

你之前读完并记录过一本书，现在想确认其中一个还没理解的观点。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-reading-started"]}`；日程3周（含正常课程）。

1. 回到原文，找出论证依据
   结果：你完成了核对，准备把问题带到一次交流里。
   数值与后续：`{"effects":{"study":3,"energy":-8},"setFlags":{"r12-reading-0":true},"followUp":{"id":"r12-reading-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 查两份相关评论，比较它们的依据
   结果：你保留了出处，不把评论当作作者原话。
   数值与后续：`{"effects":{"study":3,"energy":-9},"setFlags":{"r12-reading-0":true},"followUp":{"id":"r12-reading-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 只整理已有笔记，暂不继续查阅
   结果：你完成了归档，本轮不进入讨论后续。
   数值与后续：`{"effects":{"energy":-3,"mood":2}}`

## r12-reading-1 · 带着问题参加读书交流

你准备的阅读问题有了具体出处，朋友愿意一起讨论。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-reading-0"]}`；日程2周（含正常课程）。

1. 说明自己的理解，也听不同的解释
   结果：你们完成了一次有依据的交流，没有要求结论一致。
   数值与后续：`{"effects":{"study":3,"energy":-6,"mood":3}}`
2. 先问对方如何理解，再比较笔记
   结果：你发现了一个可继续阅读的差异。
   数值与后续：`{"effects":{"study":2,"energy":-5,"mood":3}}`
3. 把笔记发给愿意阅读的朋友，结束本次安排
   结果：你分享了自己的笔记，没有替别人发布私人内容。
   数值与后续：`{"effects":{"energy":-3,"mood":2}}`

## r12-mentor-0 · 请教之后先试哪一步

老师给出的建议需要通过一次小规模练习验证，并不是完整项目已经完成。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-mentor-started"]}`；日程3周（含正常课程）。

1. 按建议完成一个小例子，记录疑问
   结果：你完成了练习，准备带着具体记录反馈。
   数值与后续：`{"effects":{"study":4,"energy":-12},"setFlags":{"r12-mentor-0":true},"followUp":{"id":"r12-mentor-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 先核对所需基础，再做限定范围练习
   结果：你完成了较小的尝试，知道了哪些部分仍不懂。
   数值与后续：`{"effects":{"study":3,"energy":-9},"setFlags":{"r12-mentor-0":true},"followUp":{"id":"r12-mentor-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 暂缓练习，先补齐基础阅读
   结果：你完成了阅读，本轮不生成项目交付记录。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-mentor-1 · 把尝试结果带回去

你完成过一次按建议进行的小练习，老师想知道哪里顺利、哪里卡住。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-mentor-0"]}`；日程2周（含正常课程）。

1. 带上记录，说明问题与下一步
   结果：你完成了一次有依据的反馈，不把咨询算成科研成果。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
2. 用最小例子提问，缩小讨论范围
   结果：你弄清了一处关键问题，保留了仍需验证的部分。
   数值与后续：`{"effects":{"study":3,"energy":-6}}`
3. 先发书面记录，另约方便的讨论时间
   结果：你把反馈交给老师，未擅自承诺新的任务。
   数值与后续：`{"effects":{"energy":-4}}`

## r12-service-0 · 志愿活动之后核对记录

你完成过正式志愿活动，组织者请参与者核对实际到岗时间与任务。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-service-started"]}`；日程3周（含正常课程）。

1. 核对自己实际完成的任务，提交记录
   结果：你提交了真实记录，之后可收到组织者的反馈；本次不再重复加综测。
   数值与后续：`{"effects":{"energy":-5},"setFlags":{"r12-service-0":true},"followUp":{"id":"r12-service-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 指出一处时间误记，请组织者更正
   结果：你完成了核对，不把记录中的误差留作额外收益。
   数值与后续：`{"effects":{"energy":-5},"setFlags":{"r12-service-0":true},"followUp":{"id":"r12-service-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 只保存本次证明，不参加后续反馈交流
   结果：完成经历保留，本次整理不重复计分。
   数值与后续：`{"effects":{"energy":-3}}`

## r12-service-1 · 组织者发来的反馈

组织者说明了活动完成情况，也询问哪项安排可以改进。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-service-0"]}`；日程2周（含正常课程）。

1. 提出一个具体改进，说明当时遇到的情况
   结果：你完成了反馈，不凭建议再次领取服务分。
   数值与后续：`{"effects":{"energy":-5,"mood":3}}`
2. 感谢协作，记录下次需要提前确认的事项
   结果：你整理了服务经验，没有新增已完成活动。
   数值与后续：`{"effects":{"energy":-4,"mood":3}}`
3. 说明之后时间有限，本轮不续报名
   结果：你保留了本次经历，明确之后的安排。
   数值与后续：`{"effects":{"mood":2}}`

## r12-career-info-0 · 岗位信息还缺哪些细节

你向学长咨询后拿到了岗位介绍，但职责、地点和申请方式仍需核对。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-career-info-started"]}`；日程3周（含正常课程）。

1. 核对正式说明，整理真实经历
   结果：你完成了材料准备，之后再决定是否正式申请。
   数值与后续：`{"effects":{"study":2,"energy":-9},"setFlags":{"r12-career-info-0":true},"followUp":{"id":"r12-career-info-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 先确认地点与时间，再比较岗位
   结果：你确认了时间成本，没有把咨询当作录用。
   数值与后续：`{"effects":{"energy":-7},"setFlags":{"r12-career-info-0":true},"followUp":{"id":"r12-career-info-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 发现安排不匹配，本轮不申请
   结果：你停止本次准备，没有生成实习或报酬。
   数值与后续：`{"effects":{"mood":2}}`

## r12-career-info-1 · 准备之后如何申请

你已经核对过岗位方向，学长建议通过正式渠道申请。申请成功之后仍要实际工作。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-career-info-0"]}`；日程2周（含正常课程）。

1. 通过正式渠道提交校内岗位申请
   结果：按成功与失败结果公布。
   成功：申请获得机会，接下来进入实际实习和交接安排。
   失败：本次未匹配岗位，不领取报酬或完成的实习经历。
   数值与后续：`{"effects":{"energy":-8},"probability":{"base":0.58,"tags":{"软件项目":0.08,"工程项目":0.08,"教育实习":0.08,"商业分析":0.08}},"success":{"text":"申请获得机会，接下来进入实际实习和交接安排。","action":"startInternship:local"},"failure":{"text":"本次未匹配岗位，不领取报酬或完成的实习经历。","effects":{"mood":-4}}}`
2. 暂不申请，先补齐岗位所需基础
   结果：你完成了一段针对性学习，没有获得实习记录。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 向学长说明时间冲突，本轮不继续
   结果：你在正式接任前说明情况，没有产生费用。
   数值与后续：`{"effects":{"mood":2}}`

## r12-travel-recap-0 · 旅行回来先核对预算

你完成了此前的短途旅行，想核对已经支付的450元预算与剩余安排。本轮不再扣一次旅费。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-travel-recap-started"]}`；日程3周（含正常课程）。

1. 整理实际支出，保留下一次的预算依据
   结果：你完成了核对，之后可以整理这次旅行的照片。
   数值与后续：`{"effects":{"energy":-4,"mood":2},"setFlags":{"r12-travel-recap-0":true},"followUp":{"id":"r12-travel-recap-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 和同行朋友核对各自支付的部分
   结果：你们确认费用已经结清，不产生新的报酬或退款。
   数值与后续：`{"effects":{"energy":-4,"mood":3},"setFlags":{"r12-travel-recap-0":true},"followUp":{"id":"r12-travel-recap-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 保存已结清的记录，结束本次整理
   结果：你归档了预算，本轮不继续照片交流。
   数值与后续：`{"effects":{"energy":-2}}`

## r12-travel-recap-1 · 照片之外记住了什么

你整理的是自己拍摄的风景与已经获得分享同意的合照。

情境与触发：`{"group":"common","storyScope":"run","repeat":false,"maxSem":13,"followOnly":true,"requiresFlags":["r12-travel-recap-0"]}`；日程2周（含正常课程）。

1. 把照片发给同行朋友，聊一件具体的小事
   结果：你们分享了这次旅行的记忆，没有公开未经同意的照片。
   数值与后续：`{"effects":{"energy":-4,"mood":4}}`
2. 只保留自己的风景照片，写一小段记录
   结果：你留下了个人旅行记录，没有另收一份旅行费用。
   数值与后续：`{"effects":{"energy":-4,"mood":3}}`
3. 整理相册后回到日常安排
   结果：你完成了归档，把时间留给接下来的生活。
   数值与后续：`{"effects":{"energy":-2,"mood":2}}`

## r12-campus-aero-open · 工程展厅的模型说明

校内工程展厅开放，模型旁写明了展示比例与用途。它们不是可以直接飞行的成品。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"aero","maxSem":13}`；日程5周（含正常课程）。

1. 核对模型说明，向讲解员问一个具体问题
   结果：你弄清了一处结构用途，没有把参观算成完成工程项目。
   数值与后续：`{"effects":{"study":3,"energy":-6}}`
2. 比较两个模型，记录差异和出处
   结果：你完成了一次有依据的参观记录。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`
3. 只看自己感兴趣的展区
   结果：你完成了短时参观，保留了其他安排。
   数值与后续：`{"effects":{"energy":-3,"mood":3}}`

## r12-campus-aero-safety · 实验室开放前的安全说明

教学实验室安排开放体验，必须先参加说明；没有训练和许可，不能自行操作设备。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"aero","maxSem":13,"undergraduateOnly":true}`；日程6周（含正常课程）。

1. 参加说明后，按指导完成允许的小练习
   结果：你完成了受指导的体验，没有自行使用未获许可的设备。
   数值与后续：`{"effects":{"study":4,"energy":-13}}`
2. 只观察演示，记录操作前的检查事项
   结果：你了解了流程，本次没有实际实验成果。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`
3. 本次不参加操作，查阅公开介绍
   结果：你保持了许可边界，完成了一段阅读。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-campus-aero-team · 工程展示的讲解分工

校园展示需要介绍原理和模型限制，组织者邀请你承担一段讲解。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"aero","maxSem":13}`；日程4周（含正常课程）。

1. 核对说明后，完成自己负责的讲解
   结果：你讲清了用途与限制，表达有所改善。
   数值与后续：`{"effects":{"energy":-12,"charm":0.3,"tags":["公共表达"]}}`
2. 先与搭档排练，共同完成讲解
   结果：你们核对了易误解的部分，完成了展示。
   数值与后续：`{"effects":{"energy":-14,"charm":0.3}}`
3. 改做资料核对，交给讲解员使用
   结果：组织者确认了调整，你完成了幕后工作。
   数值与后续：`{"effects":{"energy":-8,"study":2}}`

## r12-campus-aero-alumni · 校友说起工程交付

校友分享了工作中核对需求和交接记录的经历，提醒学生项目和真实交付条件不同。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"aero","maxSem":13,"minSem":2}`；日程4周（含正常课程）。

1. 带着课程案例，问怎样描述自己的职责
   结果：你得到表达建议，不把课程作品当作独立承担真实工程。
   数值与后续：`{"effects":{"energy":-7,"study":2}}`
2. 询问团队协作与记录要求
   结果：你记下了工作方法，没有获得岗位录用。
   数值与后续：`{"effects":{"energy":-6,"mood":3}}`
3. 听完分享，整理与自己方向有关的部分
   结果：你完成了参加记录，把其他方向留给后续了解。
   数值与后续：`{"effects":{"energy":-5,"study":2}}`

## r12-campus-aero-weather · 户外展示遇到天气变化

校内模型展示临时改到室内，组织者需要重新安排空间与材料搬运。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"aero","maxSem":13}`；日程4周（含正常课程）。

1. 按组织者分工搬运允许搬动的材料
   结果：你完成了约定的协助，不触碰需要专业人员处理的设备。
   数值与后续：`{"effects":{"energy":-12,"mood":3}}`
2. 核对室内路线，更新给参与者的通知
   结果：你完成了路线和地点说明。
   数值与后续：`{"effects":{"energy":-8,"mood":2}}`
3. 告知自己时间有限，只协助签到
   结果：组织者接受限定范围，你完成了签到工作。
   数值与后续：`{"effects":{"energy":-6,"mood":2}}`

## r12-campus-aero-reading · 技术故事里的一个疑问

图书馆专题展介绍一项工程技术的发展，你发现其中有一次失败尝试。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"aero","maxSem":13}`；日程5周（含正常课程）。

1. 查阅公开资料，核对失败原因的表述
   结果：你区分了资料记载和自己的推断。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
2. 比较前后方案，记录改进的条件
   结果：你完成了学习笔记，没有据此宣称能复制整项技术。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 先读展览提供的基础说明
   结果：你弄清了背景，保留了更深入的问题。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-campus-normal-observe · 教学观摩先看什么

学校组织获准进行的教学观摩。记录需要关注课堂过程，不采集或公开学生身份。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"normal","maxSem":13,"undergraduateOnly":true}`；日程5周（含正常课程）。

1. 按指导记录提问与反馈方式
   结果：你完成了合规的观摩记录，不把观察当成独立授课。
   数值与后续：`{"effects":{"study":4,"energy":-11,"tags":["教学实践"]}}`
2. 只分析教师的一段讲解
   结果：你完成了限定范围的观察，不评价学生个人。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 先听准备说明，本次不参加现场观摩
   结果：你了解了要求，没有领取观摩完成记录。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-campus-normal-story · 面向同学的故事朗读

校园活动邀请学生朗读一段已获准使用的文字，现场不评奖。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"normal","maxSem":13}`；日程4周（含正常课程）。

1. 标注停顿，排练后完成朗读
   结果：你完成了公开朗读，表达更加自然。
   数值与后续：`{"effects":{"energy":-12,"charm":0.3,"tags":["公共表达"]}}`
2. 与搭档分段朗读，先核对衔接
   结果：你们完成了共同朗读，没有把活动算成比赛获奖。
   数值与后续：`{"effects":{"energy":-10,"charm":0.3}}`
3. 负责场次介绍和材料整理
   结果：你完成了现场辅助工作。
   数值与后续：`{"effects":{"energy":-8,"mood":3}}`

## r12-campus-normal-resources · 教学资料的使用范围

学校开放了一批授权教学资料，说明允许课程使用，但不允许随意上传全部文件。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"normal","maxSem":13}`；日程5周（含正常课程）。

1. 选择适用的一份，标注来源与用途
   结果：你完成了一次有出处的学习准备。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
2. 核对授权范围，再与同学讨论内容
   结果：你分享的是自己的理解，没有复制禁止传播的文件。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 只查阅目录，先确定自己需要什么
   结果：你完成了资料筛选，本次未领取教学成果。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-campus-normal-art · 展演的音量与排练时间

校园展演需要排练，附近还有自习与休息空间。组织者想听参与者的安排建议。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"normal","maxSem":13}`；日程4周（含正常课程）。

1. 比较可用时段，提出错开方案
   结果：组织者确认了安排，你完成了协调建议。
   数值与后续：`{"effects":{"energy":-8,"mood":3}}`
2. 协助核对场地规定，再安排自己的排练
   结果：你按允许的时间完成了排练。
   数值与后续：`{"effects":{"energy":-10,"mood":3}}`
3. 这次只参加正式演出，不加排练任务
   结果：你说明了参与范围，没有承担未完成的组织工作。
   数值与后续：`{"effects":{"energy":-5,"mood":2}}`

## r12-campus-normal-walk · 校园里的植物解说牌

学校步道新增了植物解说牌。朋友提议一起走一段，看看说明与眼前植物是否对应。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"normal","maxSem":13}`；日程4周（含正常课程）。

1. 沿步道散步，读完两个解说点
   结果：你完成了一次轻量活动，没有把它算成正式研究。
   数值与后续：`{"effects":{"energy":-3,"mood":5}}`
2. 拍摄解说牌，回去核对公开资料
   结果：你保留了出处，完成了一段兴趣阅读。
   数值与后续：`{"effects":{"energy":-4,"study":2,"mood":3}}`
3. 只走到下一个路口，再回去休息
   结果：你按自己的状态安排了短时散步。
   数值与后续：`{"effects":{"energy":-2,"mood":3}}`

## r12-campus-normal-career · 教育岗位分享会的提问

学校邀请校友谈工作。教学、教研和课程支持岗位的职责不同。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"normal","maxSem":13,"minSem":2}`；日程4周（含正常课程）。

1. 问清职责差异，再比较自己的经历
   结果：你知道了需要补充什么，没有把分享会算作录用。
   数值与后续：`{"effects":{"energy":-8,"study":2}}`
2. 向校友说明兴趣，请教准备顺序
   结果：你获得了建议，仍需要按岗位要求实际准备。
   数值与后续：`{"effects":{"energy":-6,"mood":3}}`
3. 只听与自己方向相关的部分
   结果：你完成了有限范围的了解。
   数值与后续：`{"effects":{"energy":-5,"study":2}}`

## r12-campus-finance-case · 校园案例讨论的不同口径

学校举办案例讨论，一组看营业收入，另一组看现金流。两者回答的问题不同。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"finance","maxSem":13}`；日程5周（含正常课程）。

1. 说明指标差异，再比较结论
   结果：你完成了有依据的讨论，不把单一指标当作企业全貌。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
2. 核对数据来源，先统一比较范围
   结果：你纠正了范围不同的问题。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 先听完讨论，整理自己不懂的指标
   结果：你完成了学习记录，不假装已经做出分析成果。
   数值与后续：`{"effects":{"study":2,"energy":-6}}`

## r12-campus-finance-lecture · 报告里的风险说明

校内讲座讨论经营案例，讲者强调历史表现不能直接保证未来。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"finance","maxSem":13}`；日程5周（含正常课程）。

1. 记录假设与风险，再提出一个问题
   结果：你完成了有边界的学习笔记，不据此领取投资收益。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
2. 比较两种解释使用的证据
   结果：你看到了结论背后的条件差异。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 先核对基础概念，暂不下判断
   结果：你把陌生概念列为后续学习内容。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-campus-finance-market · 校园市集先核对成本

校园公益市集公开招募学生协助，预算和剩余材料处理方式需要提前说清。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"finance","maxSem":13}`；日程4周（含正常课程）。

1. 核对材料清单，完成一个班次的协助
   结果：你完成了约定的现场工作，没有擅自替组织者垫款。
   数值与后续：`{"effects":{"energy":-12,"mood":3}}`
2. 负责价签核对与结束时的盘点
   结果：你完成了记录工作，不把市集收入算作自己的报酬。
   数值与后续：`{"effects":{"energy":-10,"study":2}}`
3. 只参加免费参观，不承担工作
   结果：你了解了活动，未领取服务完成记录。
   数值与后续：`{"effects":{"energy":-3,"mood":3}}`

## r12-campus-finance-alumni · 校友谈第一份工作的误区

校友介绍了分析、会计和运营等岗位，提醒大家区分岗位名称与具体职责。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"finance","maxSem":13,"minSem":2}`；日程4周（含正常课程）。

1. 带着岗位说明请教具体工作
   结果：你明确了职责，不根据一个名称决定全部职业方向。
   数值与后续：`{"effects":{"energy":-8,"study":2}}`
2. 核对准备要求，列出自己的证据
   结果：你完成了准备清单，没有把团队经历全部写成个人成果。
   数值与后续：`{"effects":{"energy":-7,"study":2}}`
3. 听完分享，先保留两个方向
   结果：你获得了选择信息，未被强制锁定职业。
   数值与后续：`{"effects":{"energy":-5,"mood":3}}`

## r12-campus-finance-invoice · 活动报销少了一张凭证

你协助校内活动整理材料，发现一笔费用缺少原始凭证。你不是费用审批人。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"finance","maxSem":13}`；日程4周（含正常课程）。

1. 联系经办人补齐真实凭证
   结果：你完成了材料核对，没有自行编造支出。
   数值与后续：`{"effects":{"energy":-8,"study":2}}`
2. 标明缺项，交给负责人处理
   结果：负责人知道了问题，未把不完整材料当作已批准报销。
   数值与后续：`{"effects":{"energy":-6}}`
3. 先整理其他完整材料，说明这一笔待确认
   结果：你完成了可核对部分，缺项仍被明确记录。
   数值与后续：`{"effects":{"energy":-5,"study":1}}`

## r12-campus-finance-budget · 出游预算里漏了返程

同学在校内讨论短途出游，清单只写了去程。尚未订票，可以修改安排。

情境与触发：`{"group":"school","storyScope":"run","repeat":false,"school":"finance","maxSem":13}`；日程4周（含正常课程）。

1. 补齐往返和餐费，再比较是否参加
   结果：你完成了预算核对，本轮没有支付旅费。
   数值与后续：`{"effects":{"energy":-5,"study":2}}`
2. 建议改为校内免费活动
   结果：大家确认后改了计划，没有被要求额外消费。
   数值与后续：`{"effects":{"energy":-4,"mood":3}}`
3. 说明本次预算不合适，不参加
   结果：你在付款前说明安排，没有产生票款。
   数值与后续：`{"effects":{"mood":2}}`

## r12-major-cs-tests · 程序通过了一个例子

课程程序能处理样例，但边界输入尚未检查，作业要求并不只看一次运行。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"cs","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 补上边界用例，再修正程序
   结果：你完成了作业范围内的测试，不把它算成上线产品。
   数值与后续：`{"effects":{"study":5,"energy":-18,"tags":["软件项目"]}}`
2. 先检查输入与错误处理
   结果：你完成了一部分核查，标注了尚未覆盖的情况。
   数值与后续：`{"effects":{"study":4,"energy":-13}}`
3. 请同学复核一个最小例子
   结果：你解决了一个具体问题，余下部分仍需自己完成。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`

## r12-major-cs-version · 小组代码改到了一起

课程小组的两次修改碰到同一文件，需要先比较差异，再决定怎样合并。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"cs","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 与同学逐项核对，完成合并和测试
   结果：你们完成了课程范围内的协作，保留了修改记录。
   数值与后续：`{"effects":{"study":5,"energy":-18,"tags":["软件项目"]}}`
2. 先拆开功能，各自核对后再合并
   结果：你们完成了较小范围的合并，没有覆盖未确认的修改。
   数值与后续：`{"effects":{"study":4,"energy":-14}}`
3. 暂停新增功能，先保存各自版本
   结果：你们避免了丢失工作，合并任务仍待继续。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-cs-interface · 接口说明少了一个字段

课程实践中，调用方不知道一个字段能否为空。你需要把约定写清楚。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"cs","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 补齐字段和例子，再核对实现
   结果：你完成了说明与实现的一致性检查。
   数值与后续：`{"effects":{"study":5,"energy":-13}}`
2. 与调用方确认需求，先修正关键字段
   结果：你解决了当前歧义，尚未完成全部接口整理。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 记录问题，先做一个最小演示
   结果：你确认了现有行为，没有把演示当作完整交付。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-cs-debug · 报错信息指向哪一步

程序在课程练习中出现错误，报错位置并不一定就是原因所在。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"cs","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 复现错误，逐步核对输入和状态
   结果：你定位并修复了本次错误，保留了复现例子。
   数值与后续：`{"effects":{"study":5,"energy":-14}}`
2. 先缩小输入，找最小失败条件
   结果：你找到了一处关键条件，按它完成了修正。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 整理现象，带着日志请教助教
   结果：你得到诊断建议，没有把咨询算成已经完成修复。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-aero-assumptions · 公式里的假设条件

课程推导使用了简化假设，你发现实际案例不完全满足条件。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"aerospace","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 列出假设，说明结论适用范围
   结果：你完成了有边界的推导说明。
   数值与后续：`{"effects":{"study":5,"energy":-14}}`
2. 比较一个满足条件的案例
   结果：你完成了课程范围内的验证练习，不代替真实工程试验。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 先复习推导步骤，暂不扩展案例
   结果：你补齐了基础，不对条件外的情况做保证。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`

## r12-major-aero-report · 课程报告中的单位

报告里有一张图没有标注单位，比较值看起来差了很多。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"aerospace","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 核对单位与量纲，重做比较
   结果：你修正了报告中的比较，保留了计算过程。
   数值与后续：`{"effects":{"study":5,"energy":-17,"tags":["工程项目"]}}`
2. 先检查关键图，再解释修正原因
   结果：你完成了局部核查，其他图表仍需继续检查。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
3. 请助教核对方法，暂缓交最终版
   结果：你说明了问题，没有提交未确认的结论。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-aero-range · 设计目标需要取舍

课程设计同时要求较轻和较稳，现有材料与时间不足以把两项都做到极致。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"aerospace","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 确定优先目标，完成一版可解释的方案
   结果：你完成了课程设计，说明了取舍与限制。
   数值与后续：`{"effects":{"study":5,"energy":-20,"tags":["工程项目"]}}`
2. 缩小范围，先验证一个关键条件
   结果：你完成了阶段方案，尚未把它说成完整工程设计。
   数值与后续：`{"effects":{"study":4,"energy":-14}}`
3. 与老师确认要求，再调整计划
   结果：你核对了可接受范围，避免增加不可完成的目标。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`

## r12-major-mechanical-drawing · 图纸上的一处干涉

课程装配图里两处结构在运动时可能碰到一起，需要核对尺寸与位置。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"mechanical","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 检查运动范围，修改图纸并复核
   结果：你完成了课程图纸修改，不把图纸直接当作制造成品。
   数值与后续：`{"effects":{"study":5,"energy":-18,"tags":["工程项目"]}}`
2. 先核对一个关键位置，画出检查说明
   结果：你完成了局部核查，其他位置仍需确认。
   数值与后续：`{"effects":{"study":4,"energy":-13}}`
3. 带着尺寸记录请教老师
   结果：你明确了下一步检查方法，没有自行修改未经确认的要求。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`

## r12-major-mechanical-process · 工艺选择也有成本

课程案例给出两种加工方案，精度、工时和材料利用率各有不同。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"mechanical","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 按任务要求比较工艺条件
   结果：你完成了有依据的方案比较，不只看报价。
   数值与后续：`{"effects":{"study":5,"energy":-14}}`
2. 先计算关键工序，再说明未核对部分
   结果：你完成了限定范围的分析。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 复习加工方法的适用条件
   结果：你补齐了基础，尚未做出完整工艺结论。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-mechanical-safety · 实训前先确认能做什么

教学实训安排了受指导的练习，需要按培训和许可使用设备。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"mechanical","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 完成说明，按教师指导操作允许的步骤
   结果：你完成了本次教学练习，不自行扩展设备操作。
   数值与后续：`{"effects":{"study":5,"energy":-17,"tags":["工程项目"]}}`
2. 观察示范，记录检查与停机步骤
   结果：你完成了观摩，没有领取实际加工成果。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 本次只做图纸核对，不参加操作
   结果：老师确认了调整，你完成了书面练习。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-mechanical-tolerance · 尺寸相同也未必装得上

课程案例要求考虑公差配合，名义尺寸相同并不代表实际配合合适。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"mechanical","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 核对配合要求，完成一次计算
   结果：你完成了课程计算，说明了使用条件。
   数值与后续：`{"effects":{"study":5,"energy":-13}}`
2. 比较两种配合，解释各自用途
   结果：你完成了有限范围的比较。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 先查教材定义，再向助教核对
   结果：你澄清了概念，不把未理解的结论写进报告。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-education-plan · 教案里的目标与活动

课程试讲要求活动能对应教学目标。你发现一项热闹的活动没有帮助理解内容。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"education","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 重排活动，完成一次课程试讲
   结果：你完成了受指导的试讲，不把它记为有薪岗位实习。
   数值与后续：`{"effects":{"study":5,"energy":-18,"tags":["教学实践"]}}`
2. 先修改一个环节，再听同学反馈
   结果：你完成了局部练习，尚未宣称整份教案验证有效。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
3. 向老师确认目标，减少不必要活动
   结果：你完成了教案修改，保留了试讲前的核查。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`

## r12-major-education-question · 提问之后留下多少等待

同学模拟课堂，问完问题后马上自己回答。课程老师请大家讨论等待与反馈。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"education","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 在模拟练习中调整等待和提示
   结果：你完成了课程练习，没有对真实学生做实验。
   数值与后续：`{"effects":{"study":5,"energy":-13}}`
2. 比较两种提问方式，说明适用情境
   结果：你完成了有条件的分析。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 记录老师示范，先整理自己的问题
   结果：你补充了观察，不把一次示范推广到所有课堂。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-education-feedback · 作业反馈不只写一个分数

课程案例提供匿名练习作业，你需要解释哪里已经掌握、哪里还需练习。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"education","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 按要求完成一份具体反馈
   结果：你说明了依据与建议，不给学生贴能力标签。
   数值与后续：`{"effects":{"study":5,"energy":-16,"tags":["教学实践"]}}`
2. 先核对评价标准，再修改一段反馈
   结果：你完成了限定范围的练习。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 请老师解释标准，暂不独立评分
   结果：你了解了边界，没有生成未经确认的正式成绩。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-language-close · 一段文字可以怎样细读

课程要求分析一段作品，感受需要落实到具体词句和结构。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"language","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 标出词句与结构，完成一段论证
   结果：你完成了有文本依据的分析。
   数值与后续：`{"effects":{"study":5,"energy":-13}}`
2. 比较两种解读使用的证据
   结果：你说明了差异，没有要求解释只有一种。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 先核对背景资料与版本
   结果：你补充了阅读条件，不把背景当作全部解释。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-language-edit · 校刊来稿需要删改吗

校刊邀请你协助校对，作者保留最终确认权。你发现一段表达重复。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"language","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 提出删改建议，请作者确认后校对
   结果：你完成了授权范围内的编辑，不擅自替作者改观点。
   数值与后续：`{"effects":{"study":5,"energy":-16,"tags":["创作经历"]}}`
2. 只修正错字，另列结构建议
   结果：你完成了校对，结构修改留给作者决定。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 先核对编辑要求，再处理一小段
   结果：你完成了限定任务，没有把全部稿件记为自己的作品。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-language-archive · 资料卡上的出处

课程资料卡需要记录作者、版本和页码，你的一条笔记只有一句摘录。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"language","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 找到原书，补齐出处并核对摘录
   结果：你修正了资料卡，引用可以回查。
   数值与后续：`{"effects":{"study":5,"energy":-12}}`
2. 先标为待核对，不用它支持结论
   结果：你避免使用缺少依据的引文，继续整理其他资料。
   数值与后续：`{"effects":{"study":4,"energy":-9}}`
3. 向馆员询问版本检索方式
   结果：你学会了一种查找办法，尚未假装找到原文。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-major-psychology-measure · 课程量表练习的边界

课程使用授权的匿名练习材料，老师提醒量表练习不等于对个人做诊断。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"psychology","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 核对计分与适用条件，完成练习
   结果：你完成了课程分析，保留样本限制。
   数值与后续：`{"effects":{"study":5,"energy":-14}}`
2. 先检查缺失值处理，再解释分数
   结果：你完成了局部核查，不解释未确认的差异。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 向老师确认范围，只做基础计分
   结果：你保持了练习边界，没有提供个人诊断。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-psychology-design · 相关并不直接说明原因

课程案例显示两个变量一起变化，其他因素可能同时影响它们。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"psychology","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 画出可能解释，说明不能直接推断的部分
   结果：你完成了有边界的课程论证。
   数值与后续：`{"effects":{"study":5,"energy":-14}}`
2. 比较两种设计能回答的问题
   结果：你说明了方法与问题的对应关系。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 先复习基础概念，再整理案例
   结果：你补齐了基础，没有把相关写成必然因果。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-psychology-consent · 课堂研究练习先确认流程

课程任务涉及材料使用，实际接触参与者前必须按学校要求确认许可与知情同意。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"psychology","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 按教师确认的流程完成课程练习
   结果：你只使用获准材料，完成了限定范围的分析。
   数值与后续：`{"effects":{"study":5,"energy":-16,"tags":["科研经历"]}}`
2. 改用教师提供的匿名示例
   结果：你避免自行采集，完成了方法练习。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
3. 先补齐流程说明，本次不采集材料
   结果：你没有接触参与者，也不领取研究完成记录。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-finance-cash · 利润与现金流的差别

课程案例中利润增加，现金流却没有同步增加。你需要核对形成差异的项目。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"finance","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 逐项核对案例，完成差异说明
   结果：你完成了有出处的分析，不凭一个数字判断全部经营状况。
   数值与后续：`{"effects":{"study":5,"energy":-14}}`
2. 先画出现金流路径，再比较指标
   结果：你完成了限定范围的解释。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 复习定义，向助教核对疑问
   结果：你补齐了概念，不直接作投资判断。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-finance-risk · 情景分析不是收益保证

课程练习给出几种假设情景，你需要说明结果如何依赖条件。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"finance","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 比较情景，完成带条件的分析报告
   结果：你完成了课程报告，没有把模拟结果说成真实收益。
   数值与后续：`{"effects":{"study":5,"energy":-17,"tags":["商业分析"]}}`
2. 先核对最敏感的两个假设
   结果：你完成了局部分析，其他条件仍需解释。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
3. 缩小案例范围，补齐基础说明
   结果：你保留了能负责的论证。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`

## r12-major-finance-disclosure · 公告里的关键时间

课程案例材料来自公开公告，不同文件披露的时间和事项范围不同。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"finance","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 按时间整理公告，区分事实与判断
   结果：你完成了可回查的资料记录。
   数值与后续：`{"effects":{"study":5,"energy":-13}}`
2. 只比较同一事项的两次披露
   结果：你限定了范围，不混用不同事件。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 先核对来源，不使用无法确认的转述
   结果：你保留了可靠材料，未把群聊当作公告。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-accounting-reconcile · 账目与凭证对不上

课程练习提供了一组模拟凭证，有一笔金额与账目不一致。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"accounting","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 核对凭证与账目，记录更正依据
   结果：你完成了模拟账务核对，不修改真实单位账目。
   数值与后续：`{"effects":{"study":5,"energy":-16,"tags":["商业分析"]}}`
2. 先查这一笔，再检查相关科目
   结果：你完成了局部核查，标注了其余待核对项。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
3. 向老师确认更正流程，再做练习
   结果：你按课程要求操作，没有编造凭证。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-accounting-policy · 同一事项用了不同口径

两份课程案例采用了不同的会计处理条件，数字不能直接比较。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"accounting","undergraduateOnly":true}`；日程5周（含正常课程）。

1. 核对条件，说明差异来源
   结果：你完成了限定范围的比较。
   数值与后续：`{"effects":{"study":5,"energy":-13}}`
2. 先统一可比较的项目，再分析
   结果：你明确了哪些数字可以比较。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 复习相关原则，暂不下完整结论
   结果：你补充了基础，保留了核查任务。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-major-accounting-checklist · 模拟检查需要留下依据

课程练习要求对几项模拟材料进行核查，发现问题后还要能说明检查过程。

情境与触发：`{"group":"major","storyScope":"run","repeat":false,"major":"accounting","undergraduateOnly":true}`；日程6周（含正常课程）。

1. 按清单核对，保留证据与限制
   结果：你完成了课程检查记录，不出具真实业务结论。
   数值与后续：`{"effects":{"study":5,"energy":-17,"tags":["商业分析"]}}`
2. 先检查风险较高的一项
   结果：你完成了限定任务，未把局部检查说成全部通过。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
3. 请老师核对清单，再补充检查
   结果：你完善了检查方法，记录尚未覆盖的部分。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`

## r12-grad-orientation · 研究生培养说明会

学院说明了课程、实践和论文环节。不同专业的要求不同，你拿到了本专业的培养安排。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9]}`；日程8周（含正常课程）。

1. 核对必修环节，排出第一学年的顺序
   结果：你把课程与阶段任务放到日历里，没有把其他专业的要求照搬过来。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
2. 向教务老师确认一处冲突，再选课程
   结果：老师解释了选课规则，你按自己的培养安排调整了课表。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 先选已确认的课程，留出调整时间
   结果：你完成了必要选课，尚未确认的事项另约时间咨询。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-grad-literature-map · 文献之间的关系图

几篇与你方向相关的论文使用了不同术语。直接把结论并列，容易忽略它们的条件。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9]}`；日程8周（含正常课程）。

1. 逐篇记录问题、方法和适用条件
   结果：你画出了有出处的关系图，保留了无法直接比较的部分。
   数值与后续：`{"effects":{"study":5,"energy":-15}}`
2. 挑两篇最接近的，先做细读对照
   结果：你完成了较小范围的比较，再决定是否扩大阅读。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 把不懂的术语列出来，请同学推荐基础材料
   结果：你明确了阅读障碍，尚未把未读懂的论文算作研究结论。
   数值与后续：`{"effects":{"study":3,"energy":-6}}`

## r12-grad-question-list · 与导师见面前的三件事

这次约谈只有半小时。你想讨论方向，也需要让老师知道自己已经查过哪些资料。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9]}`；日程4周（含正常课程）。

1. 带上阅读笔记，先问最关键的问题
   结果：讨论集中在具体证据和可行的下一步。
   数值与后续：`{"effects":{"study":3,"energy":-9,"charm":0.3}}`
2. 提前发一页摘要，见面时核对反馈
   结果：老师能看到你的准备，你记录了需要进一步查证的意见。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`
3. 这次只确认资料范围，另约讨论选题
   结果：你缩小了本次讨论目标，没有承诺尚不能完成的研究。
   数值与后续：`{"effects":{"study":2,"energy":-4}}`

## r12-grad-course-critique · 课堂上的方法评议

研究生课程要求评价一项方法。老师允许指出局限，但每个判断都要有依据。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9]}`；日程8周（含正常课程）。

1. 复查原文条件，再提出一项具体局限
   结果：你的评议对应了原文中的实验或论证条件。
   数值与后续：`{"effects":{"study":5,"energy":-14}}`
2. 先解释方法解决了什么，再讨论适用范围
   结果：你把贡献和局限分开，完成了有依据的课程报告。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
3. 选一个已经理解的部分，做较短评议
   结果：你减少了篇幅，保留了能够负责的论证。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-grad-seminar-record · 讲座之后需要留下什么

学院举办了与你方向相近的讲座。培养记录需要的是实际参加和理解，不只是签到截图。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9,10,11]}`；日程8周（含正常课程）。

1. 听完讲座，写下一个问题和依据
   结果：你完成参加记录，留下了可继续查阅的问题。
   数值与后续：`{"effects":{"study":4,"energy":-10}}`
2. 与同学核对笔记，标出尚未理解的内容
   结果：记录对应了实际听到的内容，没有补写不存在的结论。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 只记录本次已经听懂的部分
   结果：你提交了真实的参加记录，把难点留给后续阅读。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-grad-ta-schedule · 助教排班与自己的课程

你收到课程老师的助教邀请。答疑时间与自己的一次选修课冲突，正式接任前需要确认安排。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9]}`；日程4周（含正常课程）。

1. 确认可以调整的排班，接受两次答疑
   结果：老师同意调整，你按约完成了两次助教答疑；本次没有另设报酬。
   数值与后续：`{"effects":{"study":3,"energy":-16,"tags":["教学实践"]}}`
2. 只承担资料核对，不接受冲突的答疑班次
   结果：你完成了约定的资料核对，没有把它写成已经带班。
   数值与后续：`{"effects":{"study":3,"energy":-10}}`
3. 说明课表冲突，暂不接任
   结果：你在正式接受前说明原因，保留了课程时间。
   数值与后续：`{"effects":{"energy":4,"mood":2}}`

## r12-grad-method-cs · 代码能运行，结论能复核吗

你的研究脚本已经运行，但同学无法从输出文件判断使用了哪组参数。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"major":"cs","semesters":[8,9,10,11]}`；日程10周（含正常课程）。

1. 补齐配置与运行说明，重做一组核对
   结果：结果有了可追溯的参数记录，这不等于方法已经优于其他方案。
   数值与后续：`{"effects":{"study":5,"energy":-18,"tags":["科研经历"]}}`
2. 先固定一个最小例子，确认输出含义
   结果：你把问题缩到可核查的范围，记录了仍未验证的部分。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
3. 先归档当前版本，再与同学检查记录结构
   结果：你保存了工作，明确下一次运行需要记录什么。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-grad-method-engineering · 仿真条件不能省略

工程研究讨论中，别人问起模型边界和材料参数。曲线好看还不足以支持结论。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"majors":["aerospace","mechanical"],"semesters":[8,9,10,11]}`；日程10周（含正常课程）。

1. 补齐边界条件，做一组敏感性分析
   结果：你说明了参数变化对结果的影响，没有把仿真直接当成真实试验。
   数值与后续：`{"effects":{"study":5,"energy":-20,"tags":["科研经历"]}}`
2. 核对参数出处，再缩小结论范围
   结果：你把结论限制在已有条件内，留下了进一步验证的问题。
   数值与后续：`{"effects":{"study":4,"energy":-13}}`
3. 先与导师确认需要验证的条件
   结果：你确定了核查顺序，尚未宣称模型已经验证通过。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-grad-method-education · 课堂观察里的一处偏差

教学研究的练习材料来自获准使用的匿名课堂记录。一次课上的表现不能代表全部学生。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"major":"education","semesters":[8,9,10,11]}`；日程10周（含正常课程）。

1. 区分观察与解释，核对记录范围
   结果：你完成了较谨慎的分析，没有给个别学生贴能力标签。
   数值与后续：`{"effects":{"study":5,"energy":-16,"tags":["科研经历"]}}`
2. 比较两段记录，检查自己的判断标准
   结果：你发现了标准不一致之处，重新说明分析方法。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 先与指导老师讨论能够回答的问题
   结果：你缩小了研究问题，保留了材料的使用边界。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-grad-method-language · 不同版本里的一个字

文本研究中，同一篇作品的两个版本有一处差异。你需要先确认版本信息，再解释意义。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"major":"language","semesters":[8,9,10,11]}`；日程10周（含正常课程）。

1. 核对版本与出处，整理差异表
   结果：你记录了差异及其来源，避免把校勘问题直接当成作者意图。
   数值与后续：`{"effects":{"study":5,"energy":-16,"tags":["科研经历"]}}`
2. 先分析一处可确认的差异
   结果：你完成了范围较小的论证，没有扩大到整部作品。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 向老师请教版本问题，暂缓解释
   结果：你确认了需要继续查证的资料。
   数值与后续：`{"effects":{"study":3,"energy":-6}}`

## r12-grad-method-psychology · 量表分数之外的条件

心理学课程提供了合规的匿名练习数据。分数差异还需要结合测量工具和样本范围解释。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"major":"psychology","semesters":[9,10,11]}`；日程10周（含正常课程）。

1. 核对测量条件，报告样本与局限
   结果：你完成了方法练习，没有把课程数据用于诊断个人。
   数值与后续：`{"effects":{"study":5,"energy":-17,"tags":["科研经历"]}}`
2. 先检查缺失项和计分方法
   结果：你修正了分析前的处理问题，暂未做因果推断。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 请老师确认可使用的分析范围
   结果：你弄清了练习边界，不增加未经允许的数据。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-grad-method-business · 公开数据的口径变了

财经研究用到的公开报表跨越了几个年份，部分科目的定义发生变化。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"majors":["finance","accounting"],"semesters":[9,10,11]}`；日程10周（含正常课程）。

1. 逐年核对口径，说明不可直接比较的部分
   结果：你整理了可比范围，没有把定义变化解释成企业经营变化。
   数值与后续：`{"effects":{"study":5,"energy":-17,"tags":["科研经历"]}}`
2. 先用口径一致的年份做小范围分析
   结果：你缩小了样本，保留了出处和限制。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
3. 与导师确认比较指标，再继续收集
   结果：你确定了指标，不为扩大样本混用口径。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-grad-backup · 备份恢复也要试一次

课题资料已保存到允许使用的备份位置。你发现从来没有检查过能否恢复。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11]}`；日程4周（含正常课程）。

1. 恢复一份副本，核对文件是否齐全
   结果：你确认了恢复路径，原始资料仍被保留。
   数值与后续：`{"effects":{"energy":-8,"mood":3}}`
2. 先整理目录和命名，再抽查关键文件
   结果：你降低了资料混淆的风险，仍需要定期核查备份。
   数值与后续：`{"effects":{"energy":-6,"study":2}}`
3. 请同学帮忙检查目录，不共享敏感内容
   结果：你获得了整理建议，资料权限没有扩大。
   数值与后续：`{"effects":{"energy":-4,"mood":2}}`

## r12-grad-negative-result · 没有得到预期结果

你完成的一次分析没有支持最初的判断。这可能是条件不同，也可能说明原判断不成立。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11]}`；日程10周（含正常课程）。

1. 记录未支持的结果，核对方法与条件
   结果：你保留了完整记录，没有筛掉不符合期待的数据。
   数值与后续：`{"effects":{"study":5,"energy":-18,"tags":["科研经历"]}}`
2. 选一个关键条件做补充检验
   结果：你完成了有限的追加检验，结论仍按证据表达。
   数值与后续：`{"effects":{"study":4,"energy":-13}}`
3. 与导师讨论停止追加的边界
   结果：你明确了什么时候该调整问题，避免无限重复。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-grad-collaboration-interface · 合作材料的格式对不上

你们已经接受一次课题合作，各自完成的材料采用了不同命名和格式。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11],"requiresFlags":["r12-collaboration"]}`；日程10周（含正常课程）。

1. 列出对应关系，与合作者一起转换
   结果：你们解决了接口问题，保留了原始文件与修改记录。
   数值与后续：`{"effects":{"study":3,"energy":-16}}`
2. 先统一一个最小样例，再各自修改
   结果：你们确认了标准，按分工完成必要转换。
   数值与后续：`{"effects":{"study":3,"energy":-12}}`
3. 协商缩小本次合并范围
   结果：你们明确哪些材料先交付，剩余部分另定时间。
   数值与后续：`{"effects":{"energy":-8,"mood":2}}`

## r12-grad-authorship · 合作稿件里的贡献说明

你们已经完成一次合作稿件，准备核对署名与贡献。署名需要由实际贡献和共同约定决定。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11,12],"requiresFlags":["r12-manuscript"]}`；日程4周（含正常课程）。

1. 逐项列出贡献，和所有合作者确认
   结果：你们完成了贡献说明，没有用一次帮忙替代研究贡献。
   数值与后续：`{"effects":{"energy":-10,"mood":3}}`
2. 先核对自己负责的部分，再共同讨论
   结果：你说明了实际工作，也听取了其他人的记录。
   数值与后续：`{"effects":{"energy":-8,"mood":2}}`
3. 有分歧时请指导老师协助澄清
   结果：你们把分歧放到具体工作上，尚未跳过必要确认。
   数值与后续：`{"effects":{"energy":-6}}`

## r12-grad-practice-contract · 专业实践前的安排确认

你收到一项专业实践邀请。任务、指导方式与费用安排尚未写清，需要在接受前确认。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11]}`；日程4周（含正常课程）。

1. 确认任务与指导后，完成一段校内实践
   结果：你完成了约定的校内任务，本次无工资，也不记成有薪岗位实习。
   数值与后续：`{"effects":{"study":4,"energy":-18,"tags":["科研经历"]}}`
2. 只接受时间明确的小任务
   结果：你完成了限定范围的工作，没有承诺全期参与。
   数值与后续：`{"effects":{"study":3,"energy":-12}}`
3. 说明目前研究安排，暂不接受
   结果：你在接任前婉拒，不产生费用或完成经历。
   数值与后续：`{"effects":{"energy":4,"mood":2}}`

## r12-grad-peer-method · 同门的方法并不完全适合你

同门愿意分享自己的处理流程，但你们的材料类型和研究问题不同。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11]}`；日程8周（含正常课程）。

1. 先比较条件，只借用适用的步骤
   结果：你记录了可借鉴的部分，没有整套照搬。
   数值与后续：`{"effects":{"study":5,"energy":-13}}`
2. 拿一个小样本检验是否适用
   结果：你完成了试验性检查，再决定是否扩大使用。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 保留当前方法，请对方解释关键假设
   结果：你补充了理解，暂不更换整个流程。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-grad-thesis-outline · 论文目录还缺一座桥

你已经有论文材料，两个章节却分别回答了不同的问题，需要解释它们如何支持同一主题。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13],"requiresFlags":["r12-thesis-material"]}`；日程8周（含正常课程）。

1. 重写章节关系，删去偏离主题的内容
   结果：你完成了结构修改，没有靠增加页数补逻辑。
   数值与后续：`{"effects":{"study":5,"energy":-15}}`
2. 先画出论证链，再与导师讨论
   结果：你明确了缺少的连接，按反馈调整了提纲。
   数值与后续：`{"effects":{"study":4,"energy":-11}}`
3. 先整理已有证据，暂不增加新章节
   结果：你确认了当前材料能支持的范围。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`

## r12-grad-citation-check · 引文与原文不完全一样

写作检查时，你发现笔记中的一句概括比原作者的结论更强。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13]}`；日程8周（含正常课程）。

1. 回查原文，修改概括和引用位置
   结果：你让引用准确对应原文，不把自己的推断写成作者结论。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
2. 逐项核对这一段的出处
   结果：你完成了局部核查，记录了还需检查的章节。
   数值与后续：`{"effects":{"study":3,"energy":-9}}`
3. 向导师确认表述，先缩小这句话的范围
   结果：你保留了有依据的内容，不冒用权威结论。
   数值与后续：`{"effects":{"study":2,"energy":-6}}`

## r12-grad-figure-caption · 图能看懂，条件写全了吗

论文中的一张图缺少数据来源和条件说明。单独看图，读者容易误解。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13]}`；日程8周（含正常课程）。

1. 补齐条件、单位和来源，再核对正文
   结果：你完成了图文一致性检查，没有美化掉不利结果。
   数值与后续：`{"effects":{"study":4,"energy":-12}}`
2. 请同学只凭图注解释一次
   结果：对方指出了歧义，你据此修改图注。
   数值与后续：`{"effects":{"study":3,"energy":-8}}`
3. 先换成范围更小但信息完整的图
   结果：你降低了展示复杂度，仍保留原始记录。
   数值与后续：`{"effects":{"study":3,"energy":-7}}`

## r12-grad-defence-time · 答辩排练超时了

本次内部排练有明确时间限制。讲完背景时，你发现还没说到自己的工作。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13]}`；日程4周（含正常课程）。

1. 压缩背景，重排问题、方法与结果
   结果：你完成了一轮清楚的排练，表达更有条理。
   数值与后续：`{"effects":{"study":3,"energy":-12,"charm":0.4}}`
2. 只保留关键图，练习回答两项追问
   结果：你明确了证据和局限，避免把排练当作正式通过。
   数值与后续：`{"effects":{"study":3,"energy":-9,"charm":0.3}}`
3. 请同学计时，先练最难解释的一段
   结果：你完成了局部练习，整体仍需继续准备。
   数值与后续：`{"effects":{"study":2,"energy":-6}}`

## r12-grad-handover · 课题资料要交给谁

毕业准备中，课题组需要你交接获准共享的资料、运行说明或分析记录。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13]}`；日程10周（含正常课程）。

1. 整理交接清单，和接手同学逐项核对
   结果：你完成了可复核的交接，敏感材料仍按原权限保存。
   数值与后续：`{"effects":{"study":2,"energy":-14,"mood":3}}`
2. 先交接关键部分，确认后续联系时间
   结果：接手同学知道哪些内容已交付，哪些仍需补充。
   数值与后续：`{"effects":{"energy":-10,"mood":2}}`
3. 与导师确认归档范围，再完成交接
   结果：你按确认的范围移交，没有擅自公开资料。
   数值与后续：`{"effects":{"energy":-8}}`

## r12-grad-last-seminar · 毕业前最后一次组会

你准备汇报这几年工作的进展、限制和下一步建议。它不是把所有困难都藏起来的展示。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13]}`；日程4周（含正常课程）。

1. 讲清完成的工作与仍存在的问题
   结果：你用实际证据总结了研究，留下了可继续讨论的问题。
   数值与后续：`{"effects":{"energy":-10,"mood":5,"charm":0.4}}`
2. 展示一项最可靠的成果，说明适用范围
   结果：汇报范围较小，但结论清楚。
   数值与后续：`{"effects":{"energy":-8,"mood":4,"charm":0.3}}`
3. 整理给后来同学的建议，完成简短汇报
   结果：你说明了经验来自哪些尝试，没有许诺必然成功的方法。
   数值与后续：`{"effects":{"energy":-6,"mood":3}}`

## r12-grad-proposal-0 · 选题先回答哪一个问题

你与导师讨论后，有了一个方向，但研究问题还太大。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9]}`；日程10周（含正常课程）。

1. 缩小问题，写出已有证据和待验证部分
   结果：你形成了可讨论的提纲，之后需要核查可行性。
   数值与后续：`{"effects":{"study":4,"energy":-14},"setFlags":{"r12-grad-proposal-0":true},"followUp":{"id":"r12-grad-proposal-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 比较两种范围，带着利弊再讨论
   结果：你完成了范围比较，尚未宣布题目已经通过。
   数值与后续：`{"effects":{"study":3,"energy":-10},"setFlags":{"r12-grad-proposal-0":true},"followUp":{"id":"r12-grad-proposal-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 暂缓确定题目，先补齐关键资料
   结果：你明确了缺少的资料，本轮不进入开题准备。
   数值与后续：`{"effects":{"study":3,"energy":-8},"duration":2}`

## r12-grad-proposal-1 · 题目小了，材料够吗

导师已看过你的提纲，提醒你检查材料来源、方法和时间是否匹配。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9,10],"followOnly":true,"requiresFlags":["r12-grad-proposal-0"]}`；日程10周（含正常课程）。

1. 核对可获得的材料，完成进度计划
   结果：计划对应了实际条件，接下来可以准备开题讨论。
   数值与后续：`{"effects":{"study":4,"energy":-15},"setFlags":{"r12-grad-proposal-1":true},"followUp":{"id":"r12-grad-proposal-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 减少一项难以取得的材料，调整方案
   结果：你完成了更小但可执行的方案。
   数值与后续：`{"effects":{"study":3,"energy":-11},"setFlags":{"r12-grad-proposal-1":true},"followUp":{"id":"r12-grad-proposal-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 说明目前条件不足，暂不申请开题
   结果：你保留了准备记录，不把讨论当作开题通过。
   数值与后续：`{"effects":{"energy":4,"mood":2},"duration":2}`

## r12-grad-proposal-2 · 开题讨论后的修改

你按本专业安排参加了开题讨论，评议要求说明方法边界并调整一处进度。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9,10],"followOnly":true,"requiresFlags":["r12-grad-proposal-1"]}`；日程10周（含正常课程）。

1. 按反馈修改方案，完成本轮确认
   结果：你完成了开题修改，研究方向和下一阶段安排已确认。
   数值与后续：`{"effects":{"study":4,"energy":-14,"tags":["科研经历"]},"setFlags":{"r12-proposal-approved":true}}`
2. 先与导师确认关键意见，再修改
   结果：你完成了必要确认和修改，没有跳过评议意见。
   数值与后续：`{"effects":{"study":3,"energy":-10},"setFlags":{"r12-proposal-approved":true}}`
3. 申请继续修改，暂不进入下一阶段
   结果：当前开题事项仍未确认，不获得通过记录。
   数值与后续：`{"effects":{"study":2,"energy":-7}}`

## r12-grad-replication-0 · 复核一个已经发表的结论

你选定了一项与方向相关的研究，准备在获准使用的材料或条件下复核一部分结论。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9,10,11]}`；日程10周（含正常课程）。

1. 列出原方法与当前条件的差异
   结果：你完成了复核计划，没有默认可以完全重现原研究。
   数值与后续：`{"effects":{"study":4,"energy":-14},"setFlags":{"r12-grad-replication-0":true},"followUp":{"id":"r12-grad-replication-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 只选一个关键步骤做复核
   结果：你限定了范围，后续结果只回答这一步。
   数值与后续：`{"effects":{"study":3,"energy":-11},"setFlags":{"r12-grad-replication-0":true},"followUp":{"id":"r12-grad-replication-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 先补读方法，暂不开始复核
   结果：你保留了阅读准备，本轮不生成复核结果。
   数值与后续：`{"effects":{"study":3,"energy":-8},"duration":2}`

## r12-grad-replication-1 · 复核结果与原文不同

你按计划完成了初步复核，结果与原文有差异。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9,10,11,12],"followOnly":true,"requiresFlags":["r12-grad-replication-0"]}`；日程10周（含正常课程）。

1. 核对材料和条件，补做一个对照
   结果：你记录了差异和检查过程，准备解释能确认的部分。
   数值与后续：`{"effects":{"study":5,"energy":-19},"setFlags":{"r12-grad-replication-1":true},"followUp":{"id":"r12-grad-replication-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 先检查最可能出错的一步
   结果：你完成了局部核查，不急着否定原研究。
   数值与后续：`{"effects":{"study":4,"energy":-13},"setFlags":{"r12-grad-replication-1":true},"followUp":{"id":"r12-grad-replication-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 归档当前差异，停止继续追加
   结果：你留下了真实记录，本轮不继续扩展结论。
   数值与后续：`{"effects":{"study":2,"energy":-6},"duration":2}`

## r12-grad-replication-2 · 复核能支持什么

核查完成后，你需要写明哪些差异有证据、哪些原因仍不确定。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[8,9,10,11,12],"followOnly":true,"requiresFlags":["r12-grad-replication-1"]}`；日程10周（含正常课程）。

1. 写出条件、结果和局限，向导师汇报
   结果：你完成了一份有边界的复核报告。
   数值与后续：`{"effects":{"study":4,"energy":-14,"tags":["科研经历"]}}`
2. 先做较短报告，重点说明未确定部分
   结果：你完成了限定范围的报告，不宣称发现新的普遍规律。
   数值与后续：`{"effects":{"study":3,"energy":-10,"tags":["科研经历"]}}`
3. 仅归档核查记录，不公开推断
   结果：记录已经整理，本轮没有形成对外成果。
   数值与后续：`{"effects":{"study":2,"energy":-7}}`

## r12-grad-fieldwork-0 · 调研需要先确认许可

研究计划需要观察、访谈或材料收集。你必须先确认可用方式、知情同意及本校要求。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[9,10,11],"majors":["education","psychology","language","finance","accounting"]}`；日程10周（含正常课程）。

1. 与导师确认流程，使用获准的方案
   结果：你完成了前期确认，之后才开始接触材料。
   数值与后续：`{"effects":{"study":3,"energy":-10},"setFlags":{"r12-grad-fieldwork-0":true},"followUp":{"id":"r12-grad-fieldwork-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 缩小到允许使用的公开材料
   结果：你调整了方案，不采集未经允许的个人资料。
   数值与后续：`{"effects":{"study":3,"energy":-8},"setFlags":{"r12-grad-fieldwork-0":true},"followUp":{"id":"r12-grad-fieldwork-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 暂不开展调研，先补齐申请材料
   结果：你完成了准备，尚未取得调研记录。
   数值与后续：`{"effects":{"study":2,"energy":-6},"duration":2}`

## r12-grad-fieldwork-1 · 材料收集出现了空缺

你按已确认的方案收集材料，发现一个原定来源无法继续提供。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[9,10,11,12],"majors":["education","psychology","language","finance","accounting"],"followOnly":true,"requiresFlags":["r12-grad-fieldwork-0"]}`；日程10周（含正常课程）。

1. 记录空缺，与导师确认替代来源
   结果：你按允许的范围完成了补充，不私自扩大采集。
   数值与后续：`{"effects":{"study":4,"energy":-15},"setFlags":{"r12-grad-fieldwork-1":true},"followUp":{"id":"r12-grad-fieldwork-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 减少研究范围，保留可核实的材料
   结果：你明确了样本限制，准备在此范围内分析。
   数值与后续：`{"effects":{"study":3,"energy":-11},"setFlags":{"r12-grad-fieldwork-1":true},"followUp":{"id":"r12-grad-fieldwork-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 停止收集，归档已经获准的材料
   结果：你保留了来源记录，本轮不继续形成调研报告。
   数值与后续：`{"effects":{"study":2,"energy":-6},"duration":2}`

## r12-grad-fieldwork-2 · 调研记录怎样进入论文

材料已经整理，你需要区分事实记录、自己的解释和不能推广的部分。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[9,10,11,12],"majors":["education","psychology","language","finance","accounting"],"followOnly":true,"requiresFlags":["r12-grad-fieldwork-1"]}`；日程10周（含正常课程）。

1. 完成限定范围的分析，注明来源和局限
   结果：你形成了一份可追溯的研究记录，没有公开个人身份。
   数值与后续：`{"effects":{"study":4,"energy":-15,"tags":["科研经历"]}}`
2. 先与导师核对解释，再完成报告
   结果：你根据反馈收紧结论，完成了报告。
   数值与后续：`{"effects":{"study":3,"energy":-11,"tags":["科研经历"]}}`
3. 只整理材料目录，暂不形成结论
   结果：你保存了材料和权限说明，本轮没有增加研究成果。
   数值与后续：`{"effects":{"study":2,"energy":-7}}`

## r12-grad-submission-0 · 稿件是否已到投稿阶段

你已有一份课题稿件，导师建议先核对证据、署名和目标刊物范围，再决定是否投稿。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11,12]}`；日程10周（含正常课程）。

1. 核对证据与共同署名，正式提交稿件
   结果：你完成了稿件核对与投稿，接下来等待评审，仍未获得录用。
   数值与后续：`{"effects":{"study":4,"energy":-17},"setFlags":{"r12-manuscript":true,"r12-grad-submission-0":true},"followUp":{"id":"r12-grad-submission-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 缩小结论，向范围匹配的刊物投稿
   结果：你完成了较谨慎的投稿，之后等待评审；投稿不等于录用。
   数值与后续：`{"effects":{"study":3,"energy":-12},"setFlags":{"r12-manuscript":true,"r12-grad-submission-0":true},"followUp":{"id":"r12-grad-submission-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 先不投稿，把不足之处列为修改任务
   结果：本轮不进入投稿流程，也不获得发表记录。
   数值与后续：`{"effects":{"study":3,"energy":-9},"duration":2}`

## r12-grad-submission-1 · 提交后的评审安排

你完成了投稿，收到需要修改的评审意见。意见针对方法说明和结论范围。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11,12,13],"followOnly":true,"requiresFlags":["r12-grad-submission-0"]}`；日程10周（含正常课程）。

1. 逐条核对意见，补充已有证据
   结果：你完成了修改并重新提交，接下来等待编辑决定。
   数值与后续：`{"effects":{"study":4,"energy":-18},"setFlags":{"r12-grad-submission-1":true},"followUp":{"id":"r12-grad-submission-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 解释不能补充的部分，收紧结论后重投
   结果：你完成了有依据的回应，仍不保证被接受。
   数值与后续：`{"effects":{"study":3,"energy":-13},"setFlags":{"r12-grad-submission-1":true},"followUp":{"id":"r12-grad-submission-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 撤回本次投稿，继续内部修改
   结果：稿件没有获得录用，不增加发表经历。
   数值与后续：`{"effects":{"study":2,"energy":-7},"duration":2}`

## r12-grad-submission-2 · 修改稿的正式回复

修改稿已经送回，编辑就本次稿件作出决定。评审结果不等于对个人能力的总评价。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11,12,13],"followOnly":true,"requiresFlags":["r12-grad-submission-1"]}`；日程10周（含正常课程）。

1. 查看编辑决定，完成本次投稿的后续
   结果：按成功与失败结果公布。
   成功：修改稿被接收；你随后完成校样核对，收到线上发表确认，形成了本次发表成果记录。
   失败：本次稿件未被接受。你保留评审意见与研究记录，不获得发表成果。
   数值与后续：`{"effects":{"energy":-4},"probability":{"base":0.48,"grade":0.002,"tags":{"科研经历":0.08}},"success":{"text":"修改稿被接收；你随后完成校样核对，收到线上发表确认，形成了本次发表成果记录。","effects":{"mood":6,"tags":["发表成果"]}},"failure":{"text":"本次稿件未被接受。你保留评审意见与研究记录，不获得发表成果。","effects":{"mood":-7}}}`
2. 撤回修改稿，按内部报告归档
   结果：你主动终止本次投稿，没有领取发表成果。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`
3. 与导师共同查看决定，再处理后续
   结果：按成功与失败结果公布。
   成功：你和导师确认了稿件接收信息；完成校样核对后收到线上发表确认，保留本次发表记录。
   失败：你和导师确认本次稿件未被接收，整理了评审反馈与下一步计划；没有发表记录。
   数值与后续：`{"effects":{"study":2,"energy":-5},"probability":{"base":0.48,"grade":0.002,"tags":{"科研经历":0.08}},"success":{"text":"你和导师确认了稿件接收信息；完成校样核对后收到线上发表确认，保留本次发表记录。","effects":{"mood":6,"tags":["发表成果"]}},"failure":{"text":"你和导师确认本次稿件未被接收，整理了评审反馈与下一步计划；没有发表记录。","effects":{"mood":-7}}}`

## r12-grad-midterm-0 · 中期材料先对照开题

中期检查将按本专业安排进行，你需要说明已完成工作与开题计划的关系。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11],"requiresFlags":["r12-proposal-approved"]}`；日程10周（含正常课程）。

1. 对照原计划，列出完成与未完成事项
   结果：你形成了真实的进度说明，之后参加检查。
   数值与后续：`{"effects":{"study":4,"energy":-14},"setFlags":{"r12-grad-midterm-0":true},"followUp":{"id":"r12-grad-midterm-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 先与导师讨论偏离计划的部分
   结果：你明确了需要解释的变动，准备材料。
   数值与后续：`{"effects":{"study":3,"energy":-10},"setFlags":{"r12-grad-midterm-0":true},"followUp":{"id":"r12-grad-midterm-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 说明准备不足，申请补充材料
   结果：本轮暂不进入检查后续，不虚构已通过记录。
   数值与后续：`{"effects":{"energy":-5,"study":2},"duration":2}`

## r12-grad-midterm-1 · 中期检查问到一个风险

你参加了中期检查，评议要求具体说明材料不足会如何影响后续进度。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11,12],"requiresFlags":["r12-grad-midterm-0"],"followOnly":true}`；日程10周（含正常课程）。

1. 提交缩小范围后的计划
   结果：你完成了风险说明，等待本次检查反馈。
   数值与后续：`{"effects":{"study":4,"energy":-13},"setFlags":{"r12-grad-midterm-1":true},"followUp":{"id":"r12-grad-midterm-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 核对现有材料，提出可执行的补充
   结果：你完成了补充计划，没有承诺无法取得的数据。
   数值与后续：`{"effects":{"study":3,"energy":-10},"setFlags":{"r12-grad-midterm-1":true},"followUp":{"id":"r12-grad-midterm-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 承认当前进度不足，申请继续整改
   结果：你记录了整改要求，本轮未获得通过确认。
   数值与后续：`{"effects":{"study":2,"energy":-7},"duration":2}`

## r12-grad-midterm-2 · 中期反馈的落实

评议确认你已完成本轮必要补充，并要求保留结论范围和后期安排。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[10,11,12],"requiresFlags":["r12-grad-midterm-1"],"followOnly":true}`；日程10周（含正常课程）。

1. 记录确认结果，按计划推进下一阶段
   结果：你完成了本轮中期检查与计划更新。
   数值与后续：`{"effects":{"study":3,"energy":-10},"setFlags":{"r12-midterm-passed":true,"r12-thesis-material":true}}`
2. 与导师复核安排后，再更新计划
   结果：你完成了计划确认，保留了评议提出的限制。
   数值与后续：`{"effects":{"study":3,"energy":-8},"setFlags":{"r12-midterm-passed":true,"r12-thesis-material":true}}`
3. 先归档评议记录，安排一段休整
   结果：本轮检查已确认，你归档记录并保留后续计划。
   数值与后续：`{"effects":{"energy":12,"mood":4},"setFlags":{"r12-midterm-passed":true,"r12-thesis-material":true},"duration":4}`

## r12-grad-thesis-0 · 学位论文先整理哪些材料

你进入论文写作阶段，需要把实际完成的课程或课题工作整理成符合本专业要求的材料。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13]}`；日程10周（含正常课程）。

1. 按研究问题组织已有证据
   结果：你形成了初稿材料目录，未完成的部分明确标注。
   数值与后续：`{"effects":{"study":4,"energy":-15},"setFlags":{"r12-thesis-material":true,"r12-grad-thesis-0":true},"followUp":{"id":"r12-grad-thesis-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 先写方法与限制，再组织章节
   结果：你完成了可核查部分的初稿，准备请导师反馈。
   数值与后续：`{"effects":{"study":3,"energy":-11},"setFlags":{"r12-thesis-material":true,"r12-grad-thesis-0":true},"followUp":{"id":"r12-grad-thesis-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 先核对培养要求，暂不提交初稿
   结果：你明确了写作要求，本轮不进入评阅准备。
   数值与后续：`{"effects":{"study":2,"energy":-7},"duration":2}`

## r12-grad-thesis-1 · 初稿反馈要求补一段论证

导师读过初稿，指出一个结论缺少方法或材料说明。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13],"followOnly":true,"requiresFlags":["r12-grad-thesis-0"]}`；日程10周（含正常课程）。

1. 补足说明，核对全文一致性
   结果：你完成了一轮实质修改，准备下一次确认。
   数值与后续：`{"effects":{"study":4,"energy":-16},"setFlags":{"r12-grad-thesis-1":true},"followUp":{"id":"r12-grad-thesis-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 收紧结论，删除不能支持的部分
   结果：你完成了范围较小的修改，不使用无依据的论断。
   数值与后续：`{"effects":{"study":3,"energy":-12},"setFlags":{"r12-grad-thesis-1":true},"followUp":{"id":"r12-grad-thesis-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 说明还需补充工作，暂缓送审准备
   结果：你保留初稿，本轮不宣称论文已经通过。
   数值与后续：`{"effects":{"study":2,"energy":-7},"duration":2}`

## r12-grad-thesis-2 · 修改后准备下一环节

导师确认了本轮修改，提醒你继续按本校安排处理格式检查、评阅与答辩准备。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13],"followOnly":true,"requiresFlags":["r12-grad-thesis-1"]}`；日程10周（含正常课程）。

1. 整理材料清单，准备后续环节
   结果：你完成了本轮论文修改，不把材料齐全当作已经授予学位。
   数值与后续：`{"effects":{"study":3,"energy":-10,"tags":["科研经历"]}}`
2. 先排练问题与证据，再核对提交要求
   结果：你完成了具体准备，后续结果仍按游戏毕业流程处理。
   数值与后续：`{"effects":{"study":3,"energy":-10,"charm":0.3}}`
3. 归档修改版本，安排必要休整
   结果：你保留了已完成的修改，并确认后续提交日期。
   数值与后续：`{"effects":{"energy":14,"mood":4},"duration":4}`

## r12-grad-practice-0 · 接受一次课题合作之前

同组同学邀请你参与一项限定范围的课题任务。分工和交付时间尚未确定。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[9,10,11]}`；日程10周（含正常课程）。

1. 确认职责，接受一个可完成的部分
   结果：你们约定了范围与时间，后续需要实际交付。
   数值与后续：`{"effects":{"energy":-8},"setFlags":{"r12-collaboration":true,"r12-grad-practice-0":true},"followUp":{"id":"r12-grad-practice-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 减少任务范围，再确认分工
   结果：你承担了较小部分，不承诺全部工作。
   数值与后续：`{"effects":{"energy":-6},"setFlags":{"r12-collaboration":true,"r12-grad-practice-0":true},"followUp":{"id":"r12-grad-practice-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 说明已有安排，暂不接受合作
   结果：你在开始前婉拒，不留下完成经历。
   数值与后续：`{"effects":{"mood":2},"duration":2}`

## r12-grad-practice-1 · 合作任务到了核对阶段

你完成了自己负责部分的初稿，需要与合作者核对接口和材料。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[9,10,11,12],"followOnly":true,"requiresFlags":["r12-grad-practice-0"]}`；日程10周（含正常课程）。

1. 核对格式，补齐约定的内容
   结果：你的部分达到了约定范围，接下来做交付确认。
   数值与后续：`{"effects":{"study":4,"energy":-18},"setFlags":{"r12-grad-practice-1":true},"followUp":{"id":"r12-grad-practice-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 说明一处不足，协商缩小交付
   结果：你们重新确认了范围，没有默默转交额外工作。
   数值与后续：`{"effects":{"study":3,"energy":-12},"setFlags":{"r12-grad-practice-1":true},"followUp":{"id":"r12-grad-practice-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 申请退出后续，交接已完成部分
   结果：你完成必要交接，本轮不领取完整合作成果。
   数值与后续：`{"effects":{"energy":-7},"duration":2}`

## r12-grad-practice-2 · 一次合作的正式交付

合作者核对了最终材料，双方需要确认完成范围与后续联系。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[9,10,11,12],"followOnly":true,"requiresFlags":["r12-grad-practice-1"]}`；日程10周（含正常课程）。

1. 确认交付，写下本次分工与限制
   结果：你完成了一次真实合作，保留了职责和材料记录。
   数值与后续：`{"effects":{"study":3,"energy":-12,"tags":["科研经历"]}}`
2. 完成交付，把未完成事项单独列出
   结果：你没有把约定外的工作算入成果，交接清楚。
   数值与后续：`{"effects":{"study":2,"energy":-9,"tags":["科研经历"]}}`
3. 完成必要交接，暂不参加新增任务
   结果：本次交付已完成，你说明了之后的安排。
   数值与后续：`{"effects":{"energy":-6,"mood":3}}`

## r12-grad-career-0 · 研究经历怎样写进简历

你开始准备研究生求职材料。经历需要说明自己做过什么，而不只是课题名称。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13]}`；日程10周（含正常课程）。

1. 选择一项实际工作，写清职责与证据
   结果：你形成了可核查的经历条目，后续准备岗位表达。
   数值与后续：`{"effects":{"energy":-10,"study":2},"setFlags":{"r12-grad-career-0":true},"followUp":{"id":"r12-grad-career-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 按岗位要求整理课程与实践
   结果：你完成了方向匹配，不把团队成果都写成个人成果。
   数值与后续：`{"effects":{"energy":-8,"study":2},"setFlags":{"r12-grad-career-0":true},"followUp":{"id":"r12-grad-career-1","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 先列出经历清单，暂不投递
   结果：你完成了整理，本轮不进入模拟面试。
   数值与后续：`{"effects":{"energy":-5},"duration":2}`

## r12-grad-career-1 · 模拟面试追问到你的职责

同学帮你模拟岗位面试，问起研究或实践中的个人职责与限制。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13],"followOnly":true,"requiresFlags":["r12-grad-career-0"]}`；日程10周（含正常课程）。

1. 用实际过程解释自己承担的工作
   结果：你完成了一次有依据的练习，准备根据反馈修改。
   数值与后续：`{"effects":{"energy":-10,"charm":0.3},"setFlags":{"r12-grad-career-1":true},"followUp":{"id":"r12-grad-career-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 承认团队分工，重点讲自己能复核的部分
   结果：你没有扩大职责，练习内容更清楚。
   数值与后续：`{"effects":{"energy":-8,"charm":0.3},"setFlags":{"r12-grad-career-1":true},"followUp":{"id":"r12-grad-career-2","scope":"run","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 记录答不清的问题，结束本次练习
   结果：你知道了需要补充的内容，本轮不宣称面试通过。
   数值与后续：`{"effects":{"study":2,"energy":-5},"duration":2}`

## r12-grad-career-2 · 模拟反馈之后的第二版

同学指出了两处表达模糊的地方。模拟反馈不等于正式招聘结果。

情境与触发：`{"group":"graduate","storyScope":"run","repeat":false,"graduateOnly":true,"semesters":[12,13],"followOnly":true,"requiresFlags":["r12-grad-career-1"]}`；日程10周（含正常课程）。

1. 修改经历条目，再练一遍关键回答
   结果：你完成了具体表达改进，魅力有所提升。
   数值与后续：`{"effects":{"energy":-10,"charm":0.5}}`
2. 补齐证据，再缩短回答
   结果：你把说明控制在有依据的范围内，表达更清楚。
   数值与后续：`{"effects":{"energy":-8,"charm":0.4}}`
3. 先完成材料修改，暂不继续排练
   结果：你保留了改进后的简历，不获得模拟录用。
   数值与后续：`{"effects":{"study":2,"energy":-5}}`

## r12-meet-route · 第一次一起走哪条路

对方提议课后散步。操场更热闹，图书馆旁的步道更安静，都不需要消费。

情境与触发：`{"group":"romance","storyScope":"candidate","repeat":false,"single":true,"candidate":true}`；日程2周（含正常课程）。

1. 商量去安静步道，聊聊各自的一天
   结果：你们选了双方愿意去的地方，听到了具体近况。
   数值与后续：`{"effects":{"energy":-5,"mood":3},"candidateDelta":{"familiarity":4,"trust":2,"interest":2}}`
2. 提议绕操场一圈，按原计划结束
   结果：你们完成了一次短时相处，没有打乱之后的安排。
   数值与后续：`{"effects":{"energy":-5,"mood":3},"candidateDelta":{"familiarity":3,"trust":2,"interest":2}}`
3. 这次时间不够，约好下次的具体地点
   结果：你们重新确认了约定，不让对方一直猜测。
   数值与后续：`{"effects":{"energy":-2,"mood":3},"candidateDelta":{"familiarity":2,"trust":2,"interest":2}}`

## r12-meet-meal · 第一次吃饭先问偏好

你们准备一起吃午饭，食堂两种套餐分别20元和28元。对方的饮食偏好还不清楚。

情境与触发：`{"group":"romance","storyScope":"candidate","repeat":false,"single":true,"candidate":true}`；日程2周（含正常课程）。

1. 问清偏好，各付20元选普通套餐
   结果：你支付20元，和对方完成了一次自然的午餐。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"balance":-20},"candidateDelta":{"familiarity":5,"trust":2,"interest":2}}`
2. 双方确认后，各付28元尝试另一窗口
   结果：你支付28元，消费经过双方确认。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"balance":-28},"candidateDelta":{"familiarity":5,"trust":2,"interest":2}}`
3. 今天各自吃饭，饭后约十分钟聊天
   结果：你们保留了各自饭点，也留了一小段了解时间。
   数值与后续：`{"effects":{"energy":-3,"mood":3},"candidateDelta":{"familiarity":3,"trust":2,"interest":2}}`

## r12-meet-hobby · 对方的兴趣你并不熟悉

对方提到常参加的一项兴趣活动。你有好奇，也不想装作自己已经很懂。

情境与触发：`{"group":"romance","storyScope":"candidate","repeat":false,"single":true,"candidate":true}`；日程2周（含正常课程）。

1. 问一个具体问题，请对方介绍
   结果：你听到了对方喜欢它的原因，没有假装同样精通。
   数值与后续：`{"effects":{"energy":-5,"mood":3},"candidateDelta":{"familiarity":4,"trust":2,"interest":2}}`
2. 分享自己的兴趣，比较各自喜欢什么
   结果：你们了解了差异，不要求爱好完全一致。
   数值与后续：`{"effects":{"energy":-5,"mood":3},"candidateDelta":{"familiarity":4,"trust":2,"interest":2}}`
3. 先看对方推荐的公开介绍，再约着聊
   结果：你完成了一段了解，联系有了具体的新话题。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"study":1},"candidateDelta":{"familiarity":3,"trust":2,"interest":2}}`

## r12-meet-message · 一句简短消息怎样理解

对方回复“今天有点忙”。你不知道忙到什么时候，也不需要马上推断对方的心意。

情境与触发：`{"group":"romance","storyScope":"candidate","repeat":false,"single":true,"candidate":true}`；日程2周（含正常课程）。

1. 表示理解，约一个方便确认的时间
   结果：你们保留了具体联系安排，没有连续催问。
   数值与后续：`{"effects":{"energy":-2,"mood":3},"candidateDelta":{"familiarity":3,"trust":2,"interest":2}}`
2. 说明自己的空档，等对方选择
   结果：你给出可行时间，对方有选择空间。
   数值与后续：`{"effects":{"energy":-2,"mood":3},"candidateDelta":{"familiarity":3,"trust":2,"interest":2}}`
3. 本周先专注自己的安排，下周再联系
   结果：你说明了之后联系的时间，没有突然失联。
   数值与后续：`{"effects":{"mood":2},"candidateDelta":{"trust":2}}`

## r12-meet-help · 帮助之前先问需要什么

对方提到要整理一次活动材料，你愿意帮忙，但不知道是否已经有人负责。

情境与触发：`{"group":"romance","storyScope":"candidate","repeat":false,"single":true,"candidate":true}`；日程2周（含正常课程）。

1. 先问具体缺口，只帮核对一页材料
   结果：你完成了对方需要的小帮助，没有把协助当作恋爱承诺。
   数值与后续：`{"effects":{"energy":-7,"mood":3},"candidateDelta":{"familiarity":5,"trust":2,"interest":2}}`
2. 分享已有整理方法，让对方自己选择
   结果：你提供了方法，不替对方接管任务。
   数值与后续：`{"effects":{"energy":-5,"mood":3},"candidateDelta":{"familiarity":3,"trust":2,"interest":2}}`
3. 说明自己时间有限，约忙完再聊
   结果：你没有接受做不到的工作，相处仍有明确安排。
   数值与后续：`{"effects":{"energy":-2,"mood":3},"candidateDelta":{"familiarity":2,"trust":2,"interest":2}}`

## r12-meet-expectations · 你们对联系频率的期待

相处几次后，对方问你平时希望怎样保持联系。课表和工作安排会影响回应速度。

情境与触发：`{"group":"romance","storyScope":"candidate","repeat":false,"single":true,"candidate":true}`；日程2周（含正常课程）。

1. 讨论方便联系的时段，不承诺随时在线
   结果：你们说清了能做到的事，减少了误解。
   数值与后续：`{"effects":{"energy":-5,"mood":3},"candidateDelta":{"familiarity":5,"trust":2,"interest":2}}`
2. 先保持现在的节奏，下周再看看是否合适
   结果：你们把试行时间说清楚，不把观察变成无限等待。
   数值与后续：`{"effects":{"energy":-5,"mood":3},"candidateDelta":{"familiarity":4,"trust":2,"interest":2}}`
3. 坦诚希望保持普通朋友关系
   结果：你说明了自己的方向，不继续发展恋爱。
   数值与后续：`{"effects":{"mood":1},"action":"clearCandidate"}`

## r12-couple-budget · 这次约会花多少钱

你和{partner}想周末见面。免费散步、各自30元的简单餐食、只短时见面都可以选择。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true}`；日程2周（含正常课程）。

1. 约一次免费散步，留出双方方便的时间
   结果：你们完成了散步，消费没有成为相处的门槛。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4},"effectsMemory":true}`
2. 商量后支付自己的30元餐费，一起吃饭
   结果：你支付30元，安排经过双方确认。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4,"balance":-30},"effectsMemory":true}`
3. 本周短时见面，另约一次较长相处
   结果：你们确认了本周和下次的时间，没有无解释地取消。
   数值与后续：`{"effects":{"energy":-3,"mood":3,"intimacy":2},"effectsMemory":true}`

## r12-couple-choosing · 送礼先考虑能否用得上

你想为{partner}准备小礼物。对方最近提过需要一个普通笔记本，校内商店售价25元。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true}`；日程2周（含正常课程）。

1. 确认需要后，买25元的笔记本
   结果：你支付25元，礼物对应了真实需要。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4,"balance":-25},"effectsMemory":true}`
2. 写一张祝福卡，分享最近的一件小事
   结果：你用已有纸张表达关心，没有额外消费。
   数值与后续：`{"effects":{"energy":-4,"mood":3,"intimacy":3},"effectsMemory":true}`
3. 先不送礼，约好一起整理近期安排
   结果：你们完成了具体交流，不用礼物替代沟通。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true}`

## r12-couple-different-rest · 你们休息的方式不同

你想安静待一会儿，{partner}想去热闹的公共活动。双方都需要休息，不必每次一起行动。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true}`；日程2周（含正常课程）。

1. 先各自休息，晚些时候碰面
   结果：你们保留了各自恢复方式，也兑现了之后的联系。
   数值与后续：`{"effects":{"energy":6,"mood":3,"intimacy":3},"effectsMemory":true}`
2. 选一个安静的免费公共空间，短时相处
   结果：双方接受了方案，没有勉强参加不想去的活动。
   数值与后续：`{"effects":{"energy":-3,"mood":3,"intimacy":4},"effectsMemory":true}`
3. 这次各自安排，约好明天聊近况
   结果：你们说明了时间，不把分开休息当作关系变差。
   数值与后续：`{"effects":{"energy":5,"mood":3,"intimacy":2},"effectsMemory":true}`

## r12-couple-reading · 同一篇文章读出了不同意思

你和{partner}看了一篇公开文章，关注的段落不同。讨论可以有差异，也可以适时结束。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true}`；日程2周（含正常课程）。

1. 各说一处具体依据，再听对方解释
   结果：你们比较了理解，没有要求喜好或结论一致。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4,"study":2},"effectsMemory":true}`
2. 问对方为什么在意那一段
   结果：你了解了对方的关注点，保留了自己的理解。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4},"effectsMemory":true}`
3. 说明今天有些累，下次再接着聊
   结果：你们约好了继续交流的时间，没有把暂停当作否定。
   数值与后续：`{"effects":{"energy":4,"mood":3,"intimacy":2},"effectsMemory":true}`

## r12-couple-new-stage · 新阶段的课表换了

你的课程或工作安排变化了，原来的固定见面时间不再方便。{partner}也有自己的日程。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true}`；日程2周（含正常课程）。

1. 核对两人的空档，重新定一个可兑现的时间
   结果：你们更新了约定，不继续使用已经失效的安排。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4},"effectsMemory":true}`
2. 先保持短时联系，月底再确认长期安排
   结果：你们给过渡安排设了期限，保留了关心。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true}`
3. 这周各自处理新安排，下周固定通话
   结果：你们说明了联系时间，没有把忙碌变成失联。
   数值与后续：`{"effects":{"energy":-3,"mood":3,"intimacy":3},"effectsMemory":true}`

## r12-couple-friends · 朋友聚会是否一起参加

{partner}邀请你参加食堂小聚，每人餐费25元。你们可以一起去，也可以各自保留安排。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true}`；日程2周（含正常课程）。

1. 接受邀请，支付自己的25元餐费
   结果：你支付25元，参加了一次双方愿意的聚餐。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4,"balance":-25},"effectsMemory":true}`
2. 说明已有安排，这次不参加
   结果：你提前告知，不影响对方按原计划见朋友。
   数值与后续：`{"effects":{"energy":-2,"mood":3,"intimacy":2},"effectsMemory":true}`
3. 饭后在校园碰面，听对方讲聚会近况
   结果：你们保留了各自饭点，也安排了联系。
   数值与后续：`{"effects":{"energy":-3,"mood":3,"intimacy":3},"effectsMemory":true}`

## r12-couple-outing-0 · 把共同出游缩到可完成的范围

你和{partner}想在校内免费展览开放日一起参观，还没有确定路线和时间。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true,"maxSem":13}`；日程2周（含正常课程）。

1. 确认开放时间，约好一起看一个展区
   结果：你们完成了必要确认，后续按约见面。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true,"setFlags":{"r12-couple-outing-0":true},"followUp":{"id":"r12-couple-outing-1","scope":"relationship","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 只留一小时，先安排集合与结束时间
   结果：你们确定了较短的安排，没有承诺一整天。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true,"setFlags":{"r12-couple-outing-0":true},"followUp":{"id":"r12-couple-outing-1","scope":"relationship","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 这次先各自安排，不接受共同出游
   结果：你们在确定前说明情况，本轮不进入出游后续。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":2},"effectsMemory":true,"duration":2}`

## r12-couple-outing-1 · 出发前一处安排需要调整

你们已约好看展，对方临时多了一项必要任务。原来的时间不再合适。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true,"maxSem":13,"followOnly":true,"requiresFlags":["r12-couple-outing-0"]}`；日程1周（含正常课程）。

1. 双方确认后改到晚一点
   结果：你们重新确认了时间，准备按新安排见面。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true,"setFlags":{"r12-couple-outing-1":true},"followUp":{"id":"r12-couple-outing-2","scope":"relationship","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 减少一个展区，保留关键参观
   结果：双方同意缩小范围，时间不再勉强。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true,"setFlags":{"r12-couple-outing-1":true},"followUp":{"id":"r12-couple-outing-2","scope":"relationship","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 取消这次共同参观，约好另一次联系
   结果：你们明确取消，不让任何一方空等。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":2},"effectsMemory":true,"duration":2}`

## r12-couple-outing-2 · 一次调整之后的见面

你们按调整后的时间参观了展览，想聊聊哪些安排适合以后继续用。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true,"maxSem":13,"followOnly":true,"requiresFlags":["r12-couple-outing-1"]}`；日程1周（含正常课程）。

1. 说说各自喜欢的部分和方便的节奏
   结果：你们留下了具体回忆，不要求每次安排都一样。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":5},"effectsMemory":true}`
2. 感谢对方说明变化，按约结束
   结果：你们完成了相处，也尊重各自之后的时间。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4},"effectsMemory":true}`
3. 各自回去休息，晚上简短报平安
   结果：你们完成了本次见面，保留了后续联系。
   数值与后续：`{"effects":{"energy":4,"mood":3,"intimacy":3},"effectsMemory":true}`

## r12-couple-graduation-0 · 毕业后的距离先说清楚

你和{partner}开始讨论毕业后的城市安排。双方尚未确认所有去向，不能提前许诺必然同城。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true,"semesters":[6,7,12,13]}`；日程2周（含正常课程）。

1. 列出已经确定和仍待确认的事项
   结果：你们完成了第一轮讨论，之后再核对变化。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true,"setFlags":{"r12-couple-graduation-0":true},"followUp":{"id":"r12-couple-graduation-1","scope":"relationship","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 先谈各自能接受的联系和见面频率
   结果：你们说明了现实条件，不要求对方放弃自己的方向。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true,"setFlags":{"r12-couple-graduation-0":true},"followUp":{"id":"r12-couple-graduation-1","scope":"relationship","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 目前信息不足，约好下月再谈
   结果：双方确认了讨论时间，本轮不进入后续决策。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":2},"effectsMemory":true,"duration":2}`

## r12-couple-graduation-1 · 去向变化之后再核对约定

你们讨论过毕业安排，现在有一项时间或城市信息比之前更明确，需要更新原来的设想。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true,"semesters":[6,7,12,13,8],"followOnly":true,"requiresFlags":["r12-couple-graduation-0"]}`；日程2周（含正常课程）。

1. 按已知情况调整联系与预算
   结果：你们形成了可执行的过渡安排，不承诺尚未确认的费用。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4},"effectsMemory":true,"setFlags":{"r12-couple-graduation-1":true},"followUp":{"id":"r12-couple-graduation-2","scope":"relationship","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
2. 先确认各自的重要日期，再安排见面
   结果：你们明确了时间，保留后续调整空间。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4},"effectsMemory":true,"setFlags":{"r12-couple-graduation-1":true},"followUp":{"id":"r12-couple-graduation-2","scope":"relationship","after":0,"afterWeeks":2,"expiresWeeks":20,"expires":30,"priority":2}}`
3. 说明仍有一项未确定，暂不增加承诺
   结果：双方知道了缺少的信息，本轮不进入最终计划。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":2},"effectsMemory":true,"duration":2}`

## r12-couple-graduation-2 · 把未来安排落实到下一次联系

你们已有一份现实的过渡安排，现在只需要确认下一次联系，不用一次解决全部未来。

情境与触发：`{"group":"romance","storyScope":"relationship","repeat":false,"dating":true,"semesters":[6,7,12,13,8],"followOnly":true,"requiresFlags":["r12-couple-graduation-1"]}`；日程1周（含正常课程）。

1. 确认下一次通话与可行的见面计划
   结果：你们兑现了一个具体约定，长期结果仍由之后的相处决定。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":5},"effectsMemory":true}`
2. 先安排固定通话，等去向稳定再见面
   结果：你们保留了可持续联系，没有提前扣除旅费。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":4},"effectsMemory":true}`
3. 本周先整理各自事项，按约报平安
   结果：你们完成了过渡安排，不把各自忙碌理解为疏远。
   数值与后续：`{"effects":{"energy":-5,"mood":3,"intimacy":3},"effectsMemory":true}`

## r12-cadre-homework · 作业通知有两种版本

你负责学业通知，两份截止时间不同，需要先向任课教师核实。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["class-study","union-study"],"maxSem":7}`；日程3周（含正常课程）。

1. 核实后发一条完整更正
   结果：同学收到了确认过的时间，你保留了原通知的更正说明。
   数值与后续：`{"effects":{"energy":-9,"study":2},"cadreEffect":1}`
2. 先标明待核实，收到确认后统一回复
   结果：你说明了不确定部分，没有让同学按猜测提交。
   数值与后续：`{"effects":{"energy":-8},"cadreEffect":1}`
3. 请教师直接发布确认，你协助提醒
   结果：你完成了协调，不替教师决定截止时间。
   数值与后续：`{"effects":{"energy":-6},"cadreEffect":1}`

## r12-cadre-borrow · 借用活动物品先留记录

你协助管理一次活动借用，归还时间和责任人尚未登记。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["class-life","union-service"],"maxSem":7}`；日程3周（含正常课程）。

1. 核对物品与责任人，完成借还登记
   结果：你留下了真实记录，活动结束后按约核对。
   数值与后续：`{"effects":{"energy":-9},"cadreEffect":1}`
2. 减少借用范围，只登记必要物品
   结果：你控制了工作量，必要记录仍完整。
   数值与后续：`{"effects":{"energy":-7},"cadreEffect":1}`
3. 联系负责人确认流程，再协助交接
   结果：你按确认的流程工作，不独自承担未说明的责任。
   数值与后续：`{"effects":{"energy":-7},"cadreEffect":1}`

## r12-cadre-venue · 同一场地有两项活动

你负责文体协调，两项活动的申请时间重叠，场地还未最终确认。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["class-culture","year-culture","union-culture"],"maxSem":7}`；日程3周（含正常课程）。

1. 核对申请，协商错开时段
   结果：双方确认了可用时间，没有把场地重复承诺出去。
   数值与后续：`{"effects":{"energy":-12},"cadreEffect":1}`
2. 调整自己负责活动的范围与时间
   结果：你完成了可执行安排，参与者收到更新。
   数值与后续：`{"effects":{"energy":-10},"cadreEffect":1}`
3. 请场地负责人确认，再统一通知
   结果：你完成了协调，不越过场地管理流程。
   数值与后续：`{"effects":{"energy":-8},"cadreEffect":1}`

## r12-cadre-feedback · 同学的意见需要分清事项

你收集了一轮班级意见，其中有课程、设施和个人安排三类问题。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["class-leader"],"maxSem":7}`；日程3周（含正常课程）。

1. 分类后送到对应负责人，记录回复
   结果：你完成了反馈交接，不承诺自己无权决定的结果。
   数值与后续：`{"effects":{"energy":-9},"cadreEffect":1}`
2. 先处理最紧急的一项，再排其余事项
   结果：你说明了顺序和后续时间，没有让意见消失。
   数值与后续：`{"effects":{"energy":-8},"cadreEffect":1}`
3. 与同学确认事实，再提交较小范围反馈
   结果：你核对了信息，避免把转述当作所有人的意见。
   数值与后续：`{"effects":{"energy":-8},"cadreEffect":1}`

## r12-cadre-cross-course · 跨班复习安排撞到课程

你负责年级学习协调，两个班的空档不同，不能只按一个班排时间。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["year-study","year-leader"],"maxSem":7}`；日程3周（含正常课程）。

1. 收集空档，分两场安排互助
   结果：你协调了可参加的时间，没有替同学取消课程。
   数值与后续：`{"effects":{"energy":-13,"study":2},"cadreEffect":1}`
2. 先提供材料，另约一次短答疑
   结果：你完成了较小安排，时间冲突被明确说明。
   数值与后续：`{"effects":{"energy":-9,"study":2},"cadreEffect":1}`
3. 各班自行安排，你核对公共材料
   结果：你完成了协调材料的职责，不把分散活动算成一场完整讲座。
   数值与后续：`{"effects":{"energy":-8},"cadreEffect":1}`

## r12-cadre-access · 活动参加方式需要调整

一位同学说明当前场地不方便参加，你负责联系组织者核对可行方式。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["class-culture","year-culture","union-culture"],"maxSem":7}`；日程3周（含正常课程）。

1. 核对替代场地，调整参加方式
   结果：组织者确认了可行方案，你完成了协调。
   数值与后续：`{"effects":{"energy":-12},"cadreEffect":1}`
2. 提供允许的线上材料，确认能否参与讨论
   结果：你说明了材料与现场活动的差别，不宣称两者完全等同。
   数值与后续：`{"effects":{"energy":-8},"cadreEffect":1}`
3. 请负责人直接沟通需求，你负责后续通知
   结果：你保持了明确分工，没有擅自替同学决定需要什么。
   数值与后续：`{"effects":{"energy":-7},"cadreEffect":1}`

## r12-cadre-service-list · 校园服务清单先核实

你负责生活服务汇总，一条办事窗口信息已经过期。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["class-life","union-service"],"maxSem":7}`；日程3周（含正常课程）。

1. 核实时间与地点，更新清单
   结果：你修正了具体信息，标明核实日期。
   数值与后续：`{"effects":{"energy":-9},"cadreEffect":1}`
2. 先删除未确认信息，再补充可核实部分
   结果：你没有继续传播过期安排。
   数值与后续：`{"effects":{"energy":-7},"cadreEffect":1}`
3. 联系管理人员确认，转发正式说明
   结果：你提供了准确来源，不自行承诺服务结果。
   数值与后续：`{"effects":{"energy":-6},"cadreEffect":1}`

## r12-cadre-head-work · 部门分工需要重新确认

你担任部门负责人，一位干事的课程安排变化了，原任务不再适合。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["union-head"],"maxSem":7}`；日程3周（含正常课程）。

1. 调整任务与期限，分别确认
   结果：你完成了分工更新，没有把全部工作交给一人。
   数值与后续：`{"effects":{"energy":-13},"cadreEffect":1}`
2. 缩小本次活动范围，保留关键任务
   结果：你把工作量控制在可以完成的范围内。
   数值与后续：`{"effects":{"energy":-10},"cadreEffect":1}`
3. 先接手紧急部分，再安排正式交接
   结果：你完成了应急协调，也为后续设了明确边界。
   数值与后续：`{"effects":{"energy":-15},"cadreEffect":1}`

## r12-cadre-president · 跨部门活动先明确接口

你负责统筹学生会活动，各部门对材料交接时间理解不同。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["union-president"],"maxSem":7}`；日程3周（含正常课程）。

1. 核对交付物和时间，完成共同确认
   结果：各部门知道了谁交什么、何时交，活动安排更清楚。
   数值与后续：`{"effects":{"energy":-15},"cadreEffect":1}`
2. 减少一项非必要内容，降低交接负担
   结果：你保留关键活动，避免把目标扩大到无法完成。
   数值与后续：`{"effects":{"energy":-11},"cadreEffect":1}`
3. 分开试行一个环节，再确认完整流程
   结果：你完成了限定范围的核查，不直接宣布整场活动已成功。
   数值与后续：`{"effects":{"energy":-12},"cadreEffect":1}`

## r12-cadre-year-notice · 年级通知怎样覆盖各班

你负责年级事务，一条已确认的通知需要传达，但各班的班会时间不同。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["year-leader"],"maxSem":7}`；日程3周（含正常课程）。

1. 统一材料，各班按方便时间说明
   结果：你完成了准确传达，不要求所有班临时改课。
   数值与后续：`{"effects":{"energy":-12},"cadreEffect":1}`
2. 发正式说明并保留问答时段
   结果：你提供了可查阅内容，也留出具体答疑方式。
   数值与后续：`{"effects":{"energy":-9},"cadreEffect":1}`
3. 请班级负责人确认收到，再处理遗漏
   结果：你完成了逐班核对，没有把群消息发送当作所有人已经看懂。
   数值与后续：`{"effects":{"energy":-10},"cadreEffect":1}`

## r12-cadre-evidence · 学业活动记录不能只看签到

你协助学习活动核对参加记录，记录应对应真实到场与任务。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["class-study","union-study","year-study"],"maxSem":7}`；日程3周（含正常课程）。

1. 按实际参加情况核对并提交
   结果：你完成了记录，不替缺席者填完成证明。
   数值与后续：`{"effects":{"energy":-9,"study":2},"cadreEffect":1}`
2. 指出一处漏记，请负责人复核
   结果：你帮助更正记录，不自行增加任何人的成绩。
   数值与后续：`{"effects":{"energy":-8},"cadreEffect":1}`
3. 整理材料交负责人决定，自己不越权评分
   结果：你完成了职责范围内的工作。
   数值与后续：`{"effects":{"energy":-7},"cadreEffect":1}`

## r12-cadre-handover · 下一任需要哪些资料

任期接近交接，你需要整理已经处理的事项和仍待负责人回复的问题。

情境与触发：`{"group":"cadre","storyScope":"cadre","repeat":false,"cadre":true,"roles":["class-leader","class-study","class-life","class-culture","year-leader","year-study","year-culture","union-study","union-culture","union-service","union-head","union-president"],"maxSem":7,"months":[6,7,8]}`；日程2周（含正常课程）。

1. 列出已完成与未完成事项，逐项交接
   结果：你完成了明确交接，不把未解决问题藏起来。
   数值与后续：`{"effects":{"energy":-12},"cadreEffect":1}`
2. 先交接关键材料，约好补充说明
   结果：接手者知道了材料范围和后续时间。
   数值与后续：`{"effects":{"energy":-9},"cadreEffect":1}`
3. 请指导老师一起确认交接边界
   结果：你按确认范围移交，没有擅自公开个人材料。
   数值与后续：`{"effects":{"energy":-8},"cadreEffect":1}`

## r12-cat-graduation · 毕业照边缘的熟悉身影

你在本校拍毕业纪念照时，曾在图书馆侧门见过的橘白猫走到了花坛旁。大家不追逐它，只让它自己留在画面边缘。

情境与触发：`{"group":"easter","storyScope":"campus","followOnly":true,"maxSem":13,"requiresFlags":["catBonded"],"repeat":false}`；日程0周（含正常课程）。

1. 和同学一起拍照，把小猫留在画面边缘
   结果：你们完成了毕业合影，小猫在画面角落里。它没有被抱走或强迫摆姿势。
   数值与后续：`{"effects":{"mood":6},"action":"catPhoto"}`
2. 拍一张自己的毕业照，保留小猫的身影
   结果：你的毕业照片里留下了熟悉的小猫，照片成为本局的特别纪念。
   数值与后续：`{"effects":{"mood":5},"action":"catPhoto"}`
3. 这次不拍照，远远看它一会儿再告别
   结果：你认出了它，也保留了不拍照的选择；本局不生成带小猫的毕业照片。
   数值与后续：`{"effects":{"mood":3},"action":"catFarewell"}`

## 原有选项修订

逐项修订不合理行为。未在此表出现的旧内容仍在完整JSON的allEvents中，前一轮场景审读记录保留在SCENE_CLARITY_REVIEW.md。

- love-rain / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- love-missed / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- love-small-habit / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- love-repair-check / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- love-old-promise / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- love-conflict-follow / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-breakfast / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-hobby / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-quiet / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-budget-new / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-success / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-phone / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-friends-new / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-ill-start / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-ill-middle / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-ill-end / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-distance-start / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-distance-middle / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-distance-end / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-work-start / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-work-middle / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-work-end / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- love-future-check / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- love-campus-aero / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- love-unexpected-conflict / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-pace / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-exam / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-signal / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-failure / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-alone / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-photo / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-chores / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-birthday / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-opinion / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-busy / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-miss-start / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-miss-middle / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-miss-end / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-hurt-start / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-hurt-middle / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-hurt-end / 3：改为有明确安排的正常选择，删除恶意或无解释失联选项
- bond-privacy：替换强求密码主题，三个方案都有可执行的联系安排
- incident-cold / 3：删除统一的勉强完成全部任务选项
- incident-noise / 3：删除统一的勉强完成全部任务选项
- incident-device / 3：删除统一的勉强完成全部任务选项
- incident-teammate / 3：删除统一的勉强完成全部任务选项
- incident-wallet / 3：删除统一的勉强完成全部任务选项
- incident-family / 3：删除统一的勉强完成全部任务选项
- incident-friend / 3：删除统一的勉强完成全部任务选项
- incident-rejection / 3：删除统一的勉强完成全部任务选项
- incident-sprain / 3：删除统一的勉强完成全部任务选项
- incident-deadline / 3：删除统一的勉强完成全部任务选项
- incident-rumor / 3：删除统一的勉强完成全部任务选项
- incident-rain-damage / 3：删除统一的勉强完成全部任务选项
