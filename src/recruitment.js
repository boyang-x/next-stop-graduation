import {offerPackage} from './offer-package.js';
const bound=n=>Math.max(0,Math.min(1,n));
export function jobReadiness(s,job,{hasTag,major}){
  const general=job.category==='general';
  const academic=bound((s.gpa-65)/30);
  const portfolio=hasTag(s,major.tag)||general&&(hasTag(s,'学生干部经历')||hasTag(s,'公益项目')||hasTag(s,'志愿服务'))?1:0;
  const internship=hasTag(s,'实习经历')?1:0;
  const communication=hasTag(s,'公共表达')||general&&hasTag(s,'校园活动')?1:0;
  const certificate=hasTag(s,'英语证书')||s.major==='accounting'&&hasTag(s,'财会证书')?1:0;
  const fitTags={research:['科研经历','发表成果','政策调研'],engineering:['工程项目','竞赛获奖'],software:['软件项目','实习经历'],teaching:['教学实践','教育实习','普通话证书'],writing:['创作经历','公共表达'],business:['商业分析','财会证书'],service:['学生干部经历','志愿服务','公共表达']}[job.preparation]||[];
  const strengths=fitTags.filter(t=>hasTag(s,t));
  const value=bound((academic*.4+portfolio*.25+internship*.2+communication*.1+certificate*.05)*.9+Math.min(.1,strengths.length*.05));
  return {value,label:value>=.7?'准备匹配充分':value>=.4?'已有相关准备':'基础准备',academic,portfolio,internship,strengths};
}
export function recruitBatch(s,jobs,{hasTag,major,probability,random,scoreFor}){
  const companies=new Map();
  for(const company of [...new Set(jobs.map(j=>j.company))].sort())companies.set(company,{shared:random(s)<.65,roll:random(s)});
  return jobs.map(job=>{
    const score=scoreFor(job),readiness=jobReadiness(s,job,{hasTag,major});
    if(score<job.examLine)return {id:job.id,offer:false,reason:`笔试 ${score} 分，要求 ${job.examLine} 分`,score,match:readiness.label};
    const style=s.interviewStyle==='interviewCase'&&(readiness.portfolio||readiness.internship)?.08:s.interviewStyle==='interviewStudy'&&hasTag(s,'规律复习')?.08:s.interviewStyle==='interviewCampus'&&(hasTag(s,'学生干部经历')||hasTag(s,'校园活动'))?.08:0;
    const match=readiness.value*.18;
    const p=probability(s,{base:[0,.58,.35,.18][job.tier]+style+match,charm:.001,grade:.002,tags:{实习经历:.10,[major.tag]:.10,英语证书:.03,校友联系:.04},reasons:[`岗位准备匹配：成功概率 +${Math.round(match*1000)/10} 个百分点`,...(style?['回答方式与经历匹配：成功概率 +8 个百分点']:[])]});
    const company=companies.get(job.company),offer=(company.shared?company.roll:random(s))<p.value;
    const pack=offer?offerPackage(s,job,score,readiness.value,hasTag,random(s)):null;
    return {id:job.id,offer,score,match:readiness.label,readiness:readiness.value,probability:p.value,reasons:p.reasons,companyShared:company.shared,
      reason:offer?'笔试通过，面试获得录用；'+readiness.label+(readiness.strengths.length?'，岗位相关经历：'+readiness.strengths.join('、'):''):`笔试通过；面试未获录用（本次录用概率 ${Math.round(p.value*100)}%）；${readiness.label}`,
      salary:null,...pack};
  });
}
