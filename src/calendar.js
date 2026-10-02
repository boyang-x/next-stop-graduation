// One absolute month per game year; September is index 0. A gap year follows
// the four undergraduate years rather than the unused graduate semesters.
export function academicMonth(s){
  const year=academicYear(s);
  return year*12+(s.sem%2?5:0)+Math.min(s.month,4);
}
export const monthNumber=index=>(index+8)%12+1;
export const monthLabel=index=>`第${Math.floor(index/12)+1}学年 · ${monthNumber(index)}月`;
export const vacationAt=index=>[1,2].includes(monthNumber(index))?'寒假':[7,8].includes(monthNumber(index))?'暑假':null;
export function vacationMonths(s,holiday){
  const year=academicYear(s);
  return holiday==='寒假'?[year*12+4,year*12+5]:[(year-1)*12+10,(year-1)*12+11];
}
export function academicYear(s){return s.sem>=14?4+Math.floor((s.sem-14)/2):s.sem>=8?(s.graduateStartYear??4)+Math.floor((s.sem-8)/2):Math.floor(s.sem/2);}
