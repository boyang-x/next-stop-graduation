const bank=[];
function add(prefix,purposes,section,subject,rows,topic=null){rows.forEach(([text,options,answer,explanation,difficulty='中等'],i)=>{
  const shift=(prefix.length+i)%4;
  bank.push({id:`v6-${prefix}-${i}`,category:'general',purposes,section,subject,topic,difficulty,text,options:[...options.slice(shift),...options.slice(0,shift)],answer:(answer-shift+4)%4,explanation,source:'原创公共科目模拟题'});
});}
add('politics',['exam','civil'],'思想政治理论','政治',[
  ['历史唯物主义中，社会基本矛盾通常指哪两对关系的矛盾？',['生产力与生产关系、经济基础与上层建筑','价格与数量、成本与利润','个人与爱好、计划与休息','理论与字体、材料与封面'],0,'社会基本矛盾是生产力和生产关系、经济基础和上层建筑之间的矛盾。','基础'],
  ['认识论中，检验认识真理性的标准是？',['观点是否流行','社会实践','文字是否复杂','提出者人数'],1,'实践是检验认识真理性的标准。','基础'],
  ['制定方案时，既理解一般规律，又调查不同地区的具体条件。主要体现？',['只承认个性，否认共性','共性与个性的联系、具体问题具体分析','所有地区必须完全相同','只要有理论就无需调查'],1,'一般规律应结合具体条件，不能把共性理解为抹去所有差异。'],
], '政治理论');
add('civil-common',['civil'],'行测 · 常识判断','行测',[
  ['在普通海拔、标准大气压下，纯水从20℃持续加热到沸腾。沸点通常接近？',['40℃','60℃','100℃','200℃'],2,'标准大气压下纯水的沸点约100℃；气压变化会影响沸点。','基础'],
  ['地球自转主要对应哪一种日常现象？',['昼夜交替','四季变化的全部原因','潮汐的唯一原因','月相的唯一原因'],0,'地球自转带来不同地区交替朝向太阳，产生昼夜交替。','基础'],
],'常识判断');
add('civil-verbal',['civil'],'行测 · 言语理解','行测',[
  ['材料：“新增线上渠道提高了多数人的办理效率，但部分老人不会操作，仍需线下协助。”最恰当的概括是？',['线上渠道完全无效','应在提高效率的同时保留适配服务','所有人都可以取消线下渠道','老人不需要服务'],1,'材料既肯定效率改善，也指出特定群体仍需辅助服务。'],
  ['“调查发现参与活动者更常锻炼，但未比较活动前的习惯。”以下哪项超出了材料？',['参与者更常锻炼','活动与锻炼习惯存在观察到的关联','活动必然使所有人增加锻炼','活动前习惯尚未比较'],2,'观察关联与缺少基线不能证明活动必然造成所有人的变化。'],
],'言语理解');
add('civil-quantity',['civil'],'行测 · 数量关系','行测',[
  ['甲完成一项工作需6天，乙需12天。两人效率恒定且可相加，合作需几天？',['3天','4天','6天','9天'],1,'合效率1/6+1/12=1/4，需要4天。'],
  ['从5人中选2人组成没有职位区别的小组，共有多少种？',['5','10','20','25'],1,'组合数C(5,2)=5×4/2=10。'],
],'数量关系');
add('civil-logic',['civil'],'行测 · 判断推理','行测',[
  ['所有A都是B，部分B是C。以下哪项一定成立？',['所有A都是C','部分C是B','没有A是C','所有C都是A'],1,'“部分B是C”可推出“部分C是B”；不能确定A与C的关系。'],
  ['若参加培训则收到通知。小林没有收到通知。按照给定前提可推出？',['小林参加了培训','小林没有参加培训','所有人都没培训','小林一定忘了通知'],1,'P→Q与¬Q可推出¬P，即否定后件式。'],
],'判断推理');
add('civil-data',['civil'],'行测 · 资料分析','行测',[
  ['某服务中心去年受理80万件，今年100万件。今年同比增长率是多少？',['20%','25%','80%','125%'],1,'(100−80)/80=25%。'],
  ['部门总业务200件，其中A类80件。下一期总业务250件，A类100件。A类占比的变化为？',['增加10个百分点','减少10个百分点','保持40%','从40%变为50%'],2,'80/200=40%，100/250=40%，占比不变。'],
],'资料分析');
add('english',['exam'],'考研英语 · 阅读与语法','英语',[
  ['Read: “The program improved access in large cities. Its effect in rural areas remains uncertain because few rural sites were studied.” Which conclusion is supported?',['It worked equally well everywhere.','Evidence for rural effects is limited.','It was never studied in cities.','Rural effects are certainly negative.'],1,'材料明确说农村研究点很少，效果仍不确定，支持证据有限，不能推断一定无效。'],
  ['Choose the correct form: “If the team had checked the input, it ___ the error earlier.”',['will find','would have found','finds','has found'],1,'与过去事实相反的条件句：if+过去完成时，主句would have+过去分词。'],
  ['Read: “Costs fell after the redesign. However, material prices also declined during the same period.” What is the function of “However”?',['To prove the redesign caused all savings.','To introduce another explanation that limits causal attribution.','To show costs increased.','To say material prices never changed.'],1,'转折引入同期其他变化，限制把降本全部归因于重新设计。','挑战'],
]);
add('math',['exam'],'考研数学 · 微积分与线性代数','数学',[
  ['f(x)=eˣsin x，f′(0)等于？',['0','1','2','e'],1,'乘积求导得eˣ(sin x+cos x)，在0处为1。'],
  ['矩阵[[1,2],[2,4]]的秩为？',['0','1','2','4'],1,'第二行是第一行的2倍，存在一个非零独立行，秩为1。'],
  ['在[−1,1]上积分x³，定积分为？',['−1/4','0','1/4','1/2'],1,'奇函数在关于原点对称区间上的积分为0。'],
  ['矩阵[[2,0,0],[1,3,0],[4,5,6]]的行列式为？',['11','18','36','60'],2,'下三角矩阵的行列式等于对角线乘积2×3×6=36。'],
  ['产品来自A厂的概率0.6、B厂0.4；合格率分别0.8与0.2。随机取到合格产品，它来自A厂的概率是？',['0.6','0.8','6/7','1/2'],2,'贝叶斯公式：0.6×0.8/(0.6×0.8+0.4×0.2)=0.48/0.56=6/7。','挑战'],
  ['f(x,y)=x²y+y³，求在(2,1)处对y的偏导数。',['3','4','7','9'],2,'∂f/∂y=x²+3y²，代入得4+3=7。','挑战'],
]);
export const PUBLIC_QUESTIONS=bank;
