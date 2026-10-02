import {energyPercent} from './personality.js';
const tenth=n=>Math.round(n*10)/10;
export const coCurricularScore=activity=>tenth(Math.max(0,Math.min(100,50+activity*2.5)));
export const combinedScore=(grade,comp)=>tenth(grade*.8+comp*.2);
// Early preparation remains effective. Later practice still accumulates, with
// a smooth marginal return instead of truncating an entire action at 36.
export function studyGain(current,amount){
  if(amount<=0)return amount;
  const first=Math.min(amount,Math.max(0,18-current)),rest=amount-first;
  return first+(rest>0?14*Math.log1p(rest/(14+Math.max(0,current+first-18))):0);
}
export function studyContribution(study){return study<=18?study*.58:18*.58+10*(1-Math.exp(-(study-18)/24));}
export function aggregateAcademics(s){
  const degree=s.grades.filter(g=>s.sem>=8&&s.sem<14?g.sem>=8&&g.sem<14:g.sem<8);
  if(degree.length){s.gpa=tenth(degree.reduce((n,g)=>n+g.grade,0)/degree.length);s.comp=tenth(degree.reduce((n,g)=>n+g.comp,0)/degree.length);}
  s.combined=combinedScore(s.gpa,s.comp);
}
export function semesterGrade(s,roll=.5){
  const missed=s.termBehavior?.missed||0;
  const neglect=missed>0&&(s.termBehavior?.studyActions||0)<2?(s.neglectStreak||0)+1:0;
  const value=77+studyContribution(s.study)+(energyPercent(s)-50)*.025+(s.mood-50)*.015-missed*3.5-Math.min(6,neglect*1.5)+(roll-.5)*3;
  return Math.round(Math.max(0,Math.min(100,value))*10)/10;
}
export function outstandingCourses(s){return (s.academicFailures||[]).filter(f=>!f.resolved);}
export function degreeCourses(s){const grad=s.sem>=8&&s.sem<14;return outstandingCourses(s).filter(f=>grad?f.sem>=8:f.sem<8);}
export function recordAcademicFailure(s){
  s.academicFailures??=[];if(s.grade>=60)return null;
  const id='course-'+s.sem;if(s.academicFailures.some(f=>f.id===id))return null;
  const f={id,sem:s.sem,original:s.grade,resolved:false,attempts:0};s.academicFailures.push(f);return f;
}
export function repairAcademicCourse(s,id){
  const f=s.academicFailures.find(f=>f.id===id);if(!f||f.resolved)return false;
  f.resolved=true;const g=s.grades.find(g=>g.sem===f.sem);if(g){g.originalGrade??=g.grade;g.grade=Math.max(60,g.grade);g.remediated=true;}
  aggregateAcademics(s);
  if(f.sem===s.sem&&g)s.grade=g.grade;return true;
}
