# 第八轮系统内容审读

范围为引擎自动生成的节点、空闲活动、界面说明与总结；300个配置事件和190道题分别另有逐项清单。本表记录实际源内容审读与处置，页面和整局运行证据以完成审计为准。

| 内容 | 审读与处置 | 对应实现/验证 |
| --- | --- | --- |
| 开局、学期重点 | 学校专业、性别、姓名、特质；人人同收入。重点只调整概率，正文不承诺必出内容 | createGame/startSemester/chooseFocus；开局与全组合测试 |
| 学年干部安排、岗位菜单 | 新参选、续任、换岗、退出；12岗位按年级与真实经历开放，明确一学年、一主岗 | committeeCard/cadreAvailable；任期与岗位测试 |
| 竞选与续任 | 岗位基础、实际经历、岗位匹配、魅力、心情、履职影响概率；概率百分点与属性点数分开 | cadreElection/probability；概率详情UI与回归 |
| 推免公布、提醒、资格 | 大二公布稳定规则、大三末综合排名与课程条件筛选；占位成绩不伪装正式成绩 | policyResult/qualification/ensureCard；公布/资格测试 |
| 毕业方向、择校 | 资格存在才有推免路线；提供院校范围内择校必录，删除接收失败与分流 | routeCard/selectTarget；全部目标与读研测试 |
| 考研答题、初试播报、复试 | 分科短卷；玩家答题与准备折算分开，未达线不进入复试；复试各答法与经历匹配 | exam-rules/startQuiz/nextQuestion/examInterview；题库审读、考试回归与页面 |
| 一战失败、二战 | 二战/就业/结束可选；二战保留本科档案，不再虚构在校课、宿舍检查。补10个备考场景 | examFallback/completeGraduation/round8-content；二战与整局池统计 |
| 研究生入学、期末与招聘 | 新院校专业特色、研究生学期独立累计；研三招聘，不用本科排名冒充硕士排名 | endSemester/endSemesterTransition/aggregateAcademics；读研路线测试 |
| 挂科补救、毕业暂缓 | 必须有真实未通过课程；补救不提高综测，原始成绩保留；两次毕业补救仍失败可暂缓 | remediationCard/beginGraduation/repairAcademicCourse；补救与毕业条件测试 |
| 低心情恢复 | 心情0首次触发，有休息、聊天、继续熟悉学习；精力0不锁学习、兼职、答题 | recoveryNeeded/ensureCard/wellbeing；0精力测试与UI |
| 日常收入、缺口与资助 | 自然月唯一键，全年12次；资助/额外家庭支持学期限次，临时工作可补缺 | settleCalendarMonth/livingShortfallCard；自然年及保存后继续测试 |
| 月度账目文案 | 显示真实游戏学年和月份，避免上/下学期都写“第1月”；假期不创造额外月 | calendar/monthLabel/main.stats；年度账单和人物页面 |
| 恋爱断点 | 亲密度0有挽留/接受/冷静；接受后单身，新对象不继承旧争执或旧约定 | breakupCard/applyAction/story.scopeKey；分手、修复、再恋爱测试 |
| 自然争执及清理 | 自然事件降低20，有冷却和处理接续；完成/退出/换身份/过期清临时状态。本轮补全遗漏标记、修复同节点再次排期 | maybeRelationshipConflict/story；自然争执过期、候选对象延后、序列化回归 |
| 新朋友与已有对象 | 单身相识后继续联系；有对象则普通朋友圈，不直接生成新恋人 | ensureCard(newFriends)/activities/候选人接续；性别与相识测试 |
| 日常休息/散步/学习/运动 | 下午、周末、假期措辞与收益不同；暑假不称午觉；持续学习说明实际高位递减 | activitiesFor/freeAction；假期文字、状态、学习反馈测试 |
| 兼职/旅行/实习 | 报酬对应完成的短班、假期工作；实习申请、实际工作、交接分开，净工资到账一次 | activities/economy/internshipTerms；实习成功与失败测试 |
| 约会/礼物 | 仅当前关系、足够余额可选；礼物受偏好、重复和失约影响；不冒充已解决争执 | activitiesFor/freeAction/changeIntimacy；礼物与未兑现约定测试 |
| 假期回家 | 选择回家才显示票价，买票后恢复/家庭场景；留校免费，取消回原假期无重复恢复入账 | homePlan/homeTicket/homeArrive/homeCancel；源事件清单与实际UI |
| 彩票选择、刮擦、兑奖 | 六价格与完整奖表；购票即锁定、刷新不重抽、发奖一次；一千万才开放特殊结局，普通小奖继续 | lottery/buyTicket/revealTicket/scratch；参数边界、实际鼠标刮擦与刷新 |
| 大奖继续/结束 | 二选一为特殊终局菜单，沿用确认设计；终局清理接续，总结保留票款及已领奖金 | jackpot/finish/summary；继续与结束测试 |
| 城市/岗位、全选、提交 | 全选当前可投岗位，跨城市保留已有选项；低准备无法只靠广投获得高要求岗位 | main.jobsCard/jobEligibility/submitJobs；全选与学历/准备门槛测试、整局UI |
| 招聘面试与结果 | 真实经历才可声称项目/活动；准备匹配影响概率和岗位薪资，同公司部分共享评价；低档机会保留 | recruitBatch/jobReadiness；同分同种子准备对照、公司相关性测试 |
| offer/无offer/尾声 | 整批出结果再自选；无offer不因一家公司失败提前结束；尾声学期明确沿用求职档案，未毕业不能虚构完成学历 | selectOffer/acceptNoOffer/epilogueCard/closeGraduation；各终局与账目一致性测试 |
| 人物、习惯、经历 | 学校专业一行；当前身份与历史区分；首次习惯阈值通知一次，普通行为不堆成特殊标签 | stats/recordRoutine/importantExperiences；习惯、关系/干部作用域、UI |
| 玩法说明 | 更新推免必录、回家开启方式、六面值与大奖概率；删除旧价格及含混的“小奖也能结束”表述 | main.modalView；当前规则文档 |
| 本局记录、结果与总结 | 正文先讲因果，真实变化与概率分别记录；终局选择也保留概率；记录可回看、总结可下载、旧通知不常驻 | choose/notice/recordText/describeRun/summaryText；末次选择记录、实际下载与手机页面 |

这些检查覆盖配置与可控运行场景，不宣称穷尽玩家所有随机序列。现实考试难度、主观幽默和整局时长仍应通过真实试玩继续校准。
