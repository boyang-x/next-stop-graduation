export const INITIAL_BALANCE=2000;
export const MONTHLY_ALLOWANCE=1800;
// Amounts are fictional. Extra internship costs exclude ordinary living costs.
export function internshipTerms(s,kind='local'){
  const weeks=s.freeTime?.holiday==='暑假'?8:4;
  const weekly={cs:480,aerospace:460,mechanical:420,humanities:330,education:320,language:320,psychology:350,finance:450,accounting:380}[s.major]||350;
  const extraPerWeek=kind==='remote'?180:kind==='campus'?0:60;
  return {kind,weeks,weekly,gross:weeks*weekly,extraCost:weeks*extraPerWeek,net:weeks*(weekly-extraPerWeek)};
}
