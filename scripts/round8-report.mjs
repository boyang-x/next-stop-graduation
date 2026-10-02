import fs from 'node:fs';
const q=JSON.parse(fs.readFileSync('output/round8-quality-calibration.json','utf8'));
const names={study:'持续学习',balanced:'均衡',casual:'少额外学习',activities:'偏活动',romance:'偏恋爱',work:'偏实习兼职'};
const groups=q.groups.filter(g=>g.score===100);
const history=JSON.parse(fs.readFileSync('output/round7-calibration.json','utf8'));
const previous=Object.keys(names).slice(0,4).map(strategy=>{const xs=history.cases.filter(x=>x.strategy===strategy);return {strategy,gpa:xs.reduce((n,x)=>n+x.gpa,0)/xs.length};});
const paper=JSON.parse(fs.readFileSync('output/round8-question-review.json','utf8'));
const text=`# 第八轮数值校准报告

样本为自动策略，不是真人数据。当前脚本和原始记录见 [完整结果](output/round8-quality-calibration.json)、[脚本](scripts/round8-quality-calibration.mjs)。

## 口径

五特质×三校各自首个专业（均为计算机）×20种子×六策略，共1800局自然推进到本科秋招。选择依据效果和真实可选条件，分别偏学习、均衡、少额外学习、活动、关系、工作。相同种子、学校、专业和特质；策略会改变事件路径及随机消耗，不能把差异归因于单一公式。

每局保存招聘前状态，分别做固定每岗位100分/60分的招聘批次，共3600批。同批相同随机起点、全投所有可投岗位、统一学习面试答法；这里为隔离准备与公司评价，直接注入每岗位笔试分，不声称是玩家真实答题。准备影响可投范围，所以范围不是强行相同；同档同分的准备作用另外由规则测试验证。实际组卷和答题由${paper.papers}张覆盖短卷、规则测试与浏览器答题验证。

经济另跑均衡策略三组各300局，共900局，到秋招开始。低面值组在每次可购买空闲选择10元票，高面值组在足够余额时选择1000元票，否则按正常活动推进；无票组明确不购买，断言彩票交易为0。彩票占用原有空闲，未制造额外机会。这是固定行为的压力对照，低面值组不是已测量的真人购买频率。

## 学业与就业质量

| 策略 | 平均学习成绩 | 综测 | 推免资格/300 | 可投高档岗位 | 平均offer数（100分） | 高档offer数 | 平均offer年薪（万元） |
| --- | --- | --- | --- | --- | --- | --- | --- |
${groups.map(g=>`| ${names[g.strategy]} | ${g.gpa} | ${g.comp} | ${g.qualified} | ${g.eligibleTop} | ${g.offers} | ${g.topOffers} | ${g.meanSalary} |`).join('\n')}

继续学习没有36硬截断。持续学习组在已有18积累后仍记录${groups.find(g=>g.strategy==='study').highStudyActions}次正向学习，平均每局该阶段实际增加${groups.find(g=>g.strategy==='study').highStudyActual}点积累。数值分两层递减：行动积累渐缓，积累对成绩的高位贡献也渐缓。

准备差异主要体现在可投档位、匹配和区间内薪资。普通岗位仍允许少额外学习或偏恋爱玩家就业，没有用精力禁学或全面降低录用来制造难度。

| 策略 | 100分offer数 | 60分offer数 | 100分高档offer | 60分高档offer | 100分平均年薪 | 60分平均年薪 |
| --- | --- | --- | --- | --- | --- | --- |
${groups.map(g=>{const x=q.groups.find(x=>x.strategy===g.strategy&&x.score===60);return `| ${names[g.strategy]} | ${g.offers} | ${x.offers} | ${g.topOffers} | ${x.topOffers} | ${g.meanSalary} | ${x.meanSalary} |`;}).join('\n')}

60分已经超过普通/中档岗位的短卷线，因此部分策略的offer数没有变化；高档线仍需72分，60分不会拿到高档offer。不能把这一对照解读成笔试不重要。平均年薪先按每局获得offer均值，再对有offer局平均；不是实际市场薪酬。

实习兼职策略平均实际实习总报酬${groups.find(g=>g.strategy==='work').internshipGross}元，额外成本${groups.find(g=>g.strategy==='work').internshipCost}元。仅完成交接的岗位实习计工资；课堂试讲与见习不计已完成有工资实习。

## 普通经济与彩票经济

| 组别 | 秋招前余额均值 | 中位数 | 范围 | 大奖局数/300 | 平均票数 | 彩票净收益 |
| --- | --- | --- | --- | --- | --- | --- |
${q.econGroups.map(g=>`| ${{none:'不买彩票',low:'10元票',high:'1000元票'}[g.lotto]} | ${g.mean} | ${g.median} | ${g.min}—${g.max} | ${g.jackpotRuns} | ${g.lotteryCount} | ${g.lotteryNet} |`).join('\n')}

三组生活费平均${q.econGroups[0].support}元、必要支出${q.econGroups[0].necessary}元，对应秋招时已经过38个自然月，不是完整四年。初始2000元加生活费、减必要开销、再加其他净变化，逐局与余额对账。

| 组别 | 已记录活动支出 | 已记录行动收入 | 实习总工资/额外成本 | 除彩票外资金净变化 |
| --- | --- | --- | --- | --- |
${q.econGroups.map(g=>`| ${{none:'无票',low:'低面值',high:'高面值'}[g.lotto]} | ${g.optionalSpent} | ${g.optionalEarned} | ${g.internshipGross}/${g.internshipCost} | ${g.otherNonLotteryNet} |`).join('\n')}

活动支出/行动收入来自选择记录的实际余额变化，不把跨月结算误记成活动消费；除彩票外净变化还包括自动奖学金等，二者不是同一口径。此均衡策略没有主动实习，工资为0合理；实习策略的工资已另列。

无票组余额中位数约两万元，来自固定支持的结余、假期开销较低和奖学金，仍允许玩家存款。高面值组均值被${q.econGroups.find(g=>g.lotto==='high').jackpotRuns}局大奖拉高，中位数仍约两万元。保留已确认的1000元档1/500，不以有限模拟均值反向降低大奖概率。

| 面值 | 中奖率 | 赚钱率 | 一千万概率 | 理论返奖/票款 |
| --- | --- | --- | --- | --- |
${q.theory.map(t=>`| ${t.price} | ${(t.winChance*100).toFixed(0)}% | ${(t.profitChance*100).toFixed(0)}% | 1/${Math.round(1/t.jackpotChance)} | ${t.returnRatio.toFixed(3)}倍 |`).join('\n')}

理论包含低概率一千万，所以期望返奖可以高于票价；有限样本不必命中理论比例。分布总和、边界、每奖项可达、刷新锁奖与单次发奖另有测试。

## 历史参考与后续观察

旧第七轮1800局（30种子、四策略、到资格结算）平均学业：${previous.map(g=>names[g.strategy]+' '+g.gpa.toFixed(2)).join('，')}。当前前期四策略校准见output/round8-calibration.json；本报告则六策略20种子、到秋招且新版条件/语义/月份已改。它们是版本整体参考，不能称作仅改变学习公式的严格A/B。

持续学习、均衡与活动策略推免较宽松；普通岗位广投仍能得到较多offer。当前目标是让准备影响质量且保留轻松模拟的就业机会。下一轮通过真人的专业题正确率、毕业完成率、关系支线感受、购买频率和实际操作耗时再调，不恢复精力禁学、预算档位，也不擅自调整已确认大奖率。
`;
fs.writeFileSync('ROUND8_CALIBRATION.md',text);console.log('ROUND8_CALIBRATION.md written');
