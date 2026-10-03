// Fictional game admissions. Written answers determine the written score;
// preparation and relevant lived experience determine the interview score.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const ADMISSION_TARGETS={
  aero:{writtenLine:72,combinedLine:80},
  finance:{writtenLine:62,combinedLine:72},
  normal:{writtenLine:52,combinedLine:65},
};
export const INTERVIEW_STYLES=[
  {id:'results',text:'用具体成果说明过程',base:65,tags:{科研经历:10,竞赛获奖:8,软件项目:6,工程项目:6,教育实习:6}},
  {id:'reflection',text:'坦诚讲学习与反思',base:68,tags:{规律复习:8,深度阅读:8,备考经验:6}},
  {id:'plan',text:'围绕研究计划说明下一步',base:65,tags:{政策调研:8,深度阅读:8,科研接触:5,科研经历:8}},
];
export function admissionChance(score,line){
  const difference=score-line;
  if(difference>=8)return 1;
  if(difference>=4)return .95+(difference-4)*.0075;
  if(difference>=0)return .85+difference*.025;
  if(difference>=-8)return .3+(difference+8)*(.55/8);
  return 0;
}
export function interviewAssessment(s,styleId,hasTag){
  const style=INTERVIEW_STYLES.find(x=>x.id===styleId);
  if(!style)throw new Error('Unknown interview style');
  const target=ADMISSION_TARGETS[s.target]||ADMISSION_TARGETS.normal;
  const matches=Object.entries(style.tags).filter(([tag])=>hasTag(s,tag));
  const experience=Math.min(15,matches.reduce((n,[,points])=>n+points,0));
  const preparation=clamp((s.gpa-65)*.25+(hasTag(s,'备考经验')?3:0),0,10);
  const expression=clamp((s.charm-50)*.05,-2,2);
  const interviewScore=Math.round(clamp(style.base+experience+preparation+expression,60,100));
  const writtenScore=clamp(s.examScore??0,0,100);
  const combinedScore=Math.round((writtenScore*.7+interviewScore*.3)*10)/10;
  const value=writtenScore<target.writtenLine?0:admissionChance(combinedScore,target.combinedLine);
  return {style:style.id,writtenScore,interviewScore,combinedScore,writtenLine:target.writtenLine,
    combinedLine:target.combinedLine,guaranteedLine:target.combinedLine+8,value,
    reasons:[`初试 ${writtenScore}×70% ＋ 复试 ${interviewScore}×30% ＝ 综合 ${combinedScore}`,
      `目标综合参考线 ${target.combinedLine}，稳录取线 ${target.combinedLine+8}`,
      `相关经历 +${experience} 分${matches.length?'（'+matches.map(([tag])=>tag).join('、')+'）':''}`,
      `学业与备考准备 +${Math.round(preparation*10)/10} 分；表达修正 ${expression>=0?'+':''}${Math.round(expression*10)/10} 分`]};
}
