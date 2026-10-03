# 下一站，毕业

大学到毕业模拟器的网页版本，原生 JavaScript 模块，无运行时第三方依赖。

官方游戏站点：[下一站，毕业](https://college-life-simulator.space)，通过阿里云 ESA 发布。作者：[boyang-x](https://github.com/boyang-x)，GitHub 分支：`feat/pixel-campus`。原创与使用权限见 [COPYRIGHT.md](COPYRIGHT.md)。

当前分支版本 **0.13.3 · 首次加载优化**，位于 `feat/pixel-campus`。正式构建合并压缩为2个首屏脚本和1份样式，哈希命名并预加载；结局图片生成按需加载，保留现有保存图片功能。本轮没有新增朋友圈分享或存档功能，详见 [ROUND13_LOADING.md](ROUND13_LOADING.md)。手机余额增加像素金币，心情统一显示当前值/100；首页、玩法说明与生涯总结保留 boyang-x 署名及官方来源。手机左上角打开人物档案覆盖层；主游戏固定在一屏，长文本在正文内部滚动，选择区固定在下方。电脑恢复右侧常驻人物档案，记录和说明使用像素图标按钮，移除重复入口。电脑专用样式单独放在仅大屏生效的文件中。两端都取消批量课余安排，长事件跨月时逐月由玩家亲自选择；暑假七月—八月只选择一次。考研采用笔试70%＋面试30%，笔试满分三种面试方式均可录取。最新布局修正见 [ROUND13_LAYOUT_FIX.md](ROUND13_LAYOUT_FIX.md)，考研计分见 [ROUND13_RELEASE_NOTES.md](ROUND13_RELEASE_NOTES.md)。上一轮新增159个事件节点，合计520个；研究生新增48个，共68个（起步16、中期18、毕业14）。延长课程与项目日程，保留教学月自由活动；增加既有选择的后续、男女服饰与仪容事件、小猫像素形象和毕业照彩蛋，修订不合理主动选项与综测分值，并提高彩票中奖概率。范围见 [ROUND12_PLAN.md](ROUND12_PLAN.md)，逐条内容见 [ROUND12_CONTENT_REVIEW.md](ROUND12_CONTENT_REVIEW.md)，验收见 [ROUND12_COMPLETION_AUDIT.md](ROUND12_COMPLETION_AUDIT.md)，当前规则见 [GAME_DESIGN.md](GAME_DESIGN.md)。

结局页可保存1080×1640生涯总结PNG，并保留文字总结。31家单位62个岗位区分具体职责、单位性质、工作节奏、福利与待遇；大厂30万起，核心研发岗位可获得S/SS/SSP，满足突出准备条件后可开100—120万游戏总包。考公先选择国考、省考或定向选调的8类去向，各有笔试线、竞争与匹配经历。薪酬、股权估值、录取线和条件是游戏设定。匿名统计与反馈入口尚未实施。

上一轮修复事件前置条件、接续清理和自然月账目；假期选择回家后才有车票与家庭剧情，有推免资格择校必录。学习改为高位递减，岗位准备影响招聘档位、概率与薪资，同公司部分共享评价。彩票改为10—1000元六档，本轮1000元档一千万概率1/100。逐场景审读300个事件、190道题和系统内容，补足二战事件与旧题归属；保留精力0可学习、五特质、魅力、综合排名、自由活动和简洁界面。

## 运行

在本目录运行 `npm run dev`，打开 http://127.0.0.1:5188 。仅监听本机；这是本地预览。可用 `node server.mjs 其他端口` 指定端口。

`npm ci --include=dev` 安装锁定的构建依赖；`npm run build` 将浏览器脚本及样式合并压缩到 `dist/assets/`，生成带哈希和预加载引用的 `dist/index.html`，供静态托管。图片生成模块按需加载；不发布源码目录、开发服务器、测试或审计文档。阿里云 ESA 的安装命令为 `npm ci --include=dev`、构建命令为 `npm run build`、输出目录为 `dist`；若手动上传，上传 `dist` 内的文件（入口 `index.html` 位于根目录）。历史 Sites 配置保留在 `.openai/hosting.json`，当前官方站点以 ESA 为准。

以**新开局**体验完整的新事件与规则。当前存档版本6，支持版本4、5迁移；仅根据已确认成果和实际履职重建综测，旧档未结算事件更新文案，已结算结果、随机进度、彩票和剧情接续保留。存档仅在当前浏览器本地保存。

## 验证

- `npm test`：状态、概率、特质、经济、排名、剧情、考试、存档与终局回归。
- `npm run check`：520事件、44标签、190题、31企业、62岗位，检查未知条件、引用、概率和题目归属。
- `node scripts/round12-calibration.mjs`：1872条多特质、院校专业、性别、策略和路线模拟，检查终局、报名结算、每月自由活动、研究生链、疲劳与关系重复，输出 `output/round12-calibration.json`。
- 历史第八轮脚本 `node scripts/round8-route-audit.mjs`：五特质×13院校专业组合×两性别×四路线×四种子，共2080次整局模拟，输出 `output/round8-route-audit.json`。
- `node scripts/round8-quality-calibration.mjs`：六策略1800局到秋招、3600批同分招聘，以及三组经济900局，输出 `output/round8-quality-calibration.json`；报告见 [ROUND8_CALIBRATION.md](ROUND8_CALIBRATION.md)。
- `node scripts/round8-review-manifest.mjs`：全事件前后原文、条件、选择、结果和接续，见 [ROUND8_EVENT_REVIEW.md](ROUND8_EVENT_REVIEW.md)。
- `node scripts/round8-question-review.mjs`：190题前后原文及32400张实际组卷覆盖，见 [ROUND8_QUESTION_REVIEW.md](ROUND8_QUESTION_REVIEW.md)。
- `node scripts/round8-pool-capacity.mjs`：8320个阶段/身份/余额场景的新池容量检查；整局耗尽另由路线审计验证。
- `scripts/ui-v8-*.cjs`：真实浏览器的开局、记录、概率、考试、假期回家、刮擦、刷新及新开局通关；定向注入场景与自然通关分别记录。

自动策略会读取配置中的收益与答案，用于检查规则和可达性，不能代替玩家统计、真实难度或主观体验评估。最新结果统一见 [VALIDATION.md](VALIDATION.md)。

## 主要文件

| 文件 | 用途 |
| --- | --- |
| `src/content.js`及内容模块 | 学校、专业、阶段事件、人物、标签和岗位 |
| `src/engine.js` | 时间、概率、效果、升学、招聘、结局与记录 |
| `src/personality.js`、`src/character-content.js` | 五种特质、精力上限和倍率、魅力成长及学习消耗 |
| `src/academics.js`、`src/life-rules.js` | 独立综测、综合排名、推免、干部与关系 |
| `src/economy.js`、`src/economy-content.js` | 固定生活费、基本开销、工资与消费事件 |
| `src/story.js`及故事模块 | 前次选择的接续、岗位/对象记忆、到期和取消 |
| `src/activities.js`、`src/lottery.js`、`src/scratch.js` | 周末/假期活动、六面值彩票和刮开效果 |
| `src/exam-rules.js`及题库模块 | 专业招聘、分科考研、行测与简化材料分析 |
| `src/text-polish.js`、`src/round8-content.js` | 逐场景修订、触发条件、接续清理、家庭与二战内容 |
| `src/calendar.js`、`src/event-conditions.js` | 唯一自然月份、可审计的条件判定 |
| `src/question-routing.js` | 旧题具体专业、科目和考试类型归属 |
| `src/main.js`及样式 | 界面、本地存档、事件区域确认反馈、记录和总结下载 |
| `src/career-content.js`、`src/offer-package.js` | 岗位特色、公共报岗、录用定级与收入拆分 |
| `src/summary-image.js` | 本地生涯总结PNG生成 |
| `src/pixel-art.js`、`src/pixel.css` | 无随机数副作用的男女像素人物、场景与统一样式 |
| `ROUND8_SYSTEM_REVIEW.md` | 系统节点、活动、界面及总结的内容审读 |

手机人物档案由左上角按钮打开覆盖层，包含状态、学业和经历三个页签；主游戏固定在一屏，正文与复杂列表可在内部滚动。电脑在右侧常驻人物档案，记录/说明配像素图标；通过独立的大屏样式与手机布局分开控制。固定时间节点、条件事件池、干部和恋爱接续继续保留。玩家可主动在周末/假期认识新朋友；同批多offer自选，读研后也可招聘；彩票大奖可结束或继续。

学校、公司、城市、薪酬、概率与录取线均为虚构游戏设定。在线玩家榜与账号同步属于后续独立工作。
