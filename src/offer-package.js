const round=n=>Math.round(n*10)/10;
const bound=n=>Math.max(0,Math.min(1,n));
export function offerPackage(s,job,score,readiness,hasTag,roll){
  let rating=readiness>=.7?'优选录用':'普通录用',min=job.salary,max=job.salaryMax;
  if(job.bigTech){
    rating='普通';max=job.premium?40:Math.min(job.salaryMax,38);
    if(score>=80&&readiness>=.6){rating='S';min=40;max=job.premium?55:job.salaryMax;}
    if(job.premium&&score>=90&&readiness>=.8){rating='SS';min=55;max=Math.max(75,job.regularMax);}
    const achievement=hasTag(s,'竞赛获奖')||hasTag(s,'发表成果');
    if(job.premium&&score>=95&&s.gpa>=94&&readiness>=.85&&hasTag(s,'实习经历')&&achievement&&roll<.15){rating='SSP';min=100;max=120;}
    min=Math.min(min,max);
  }
  const fraction=bound(.12+readiness*.75+(roll-.5)*.12);
  const salary=round(min+(max-min)*fraction);
  const cash=round(salary*(job.bigTech ? .72 : .85));
  const bonus=job.bigTech?round(salary*.13):round(salary-cash);
  const equity=job.bigTech?round(salary-cash-bonus):0;
  return {salary,rating,salaryBasis:'税前年总包',compensation:{cash,bonus,equity},packageText:job.bigTech?`固定现金 ${cash} 万 · 浮动奖金 ${bonus} 万 · 股权估值 ${equity} 万`:`固定现金 ${cash} 万 · 浮动奖金 ${round(salary-cash)} 万`};
}
