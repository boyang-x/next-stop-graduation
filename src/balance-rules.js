// Event effects are calibrated once at load time. Outcome costs are incremental,
// rather than charging the same full workload twice on a failed attempt.
export const BALANCE_REVIEW=[];
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const restful=/睡|休息|休整|补觉|早.*休|早点.*睡|放松|暂停额外|调整作息/;
export function calibrateEvents(events){
  for(const event of events){
    for(const [index,choice] of event.choices.entries()){
      const before=structuredClone(choice);const effects=choice.effects??={};
      const text=choice.text||'',rest=restful.test(text)&&!(/熬夜|通宵|不休息/.test(text));
      if(rest&&effects.energy>0)effects.energy=clamp(effects.energy,18,25);
      else if(effects.energy>0)effects.energy=clamp(effects.energy,1,4);
      else if(effects.energy<0){
        const [min,max]=event.category==='project'?[12,22]:event.category==='work'?[10,18]:event.category==='study'?[8,15]:[4,10];
        effects.energy=-clamp(Math.round(Math.abs(effects.energy)*1.5),min,max);
      }else if((effects.study||0)>=3&&!rest)effects.energy=-8;
      if(effects.tags?.includes('运动习惯')){effects.energy=-8;effects.mood=6;effects.exercise=true;delete effects.charm;}
      if(effects.mood>0)effects.mood=clamp(Math.round(effects.mood*.65),1,rest?6:8);
      if(effects.mood<0)effects.mood=clamp(effects.mood,-15,-1);
      if(effects.charm>0)effects.charm=clamp(effects.charm*.5,.2,1.5);
      if(effects.charm<0)effects.charm=clamp(effects.charm,-3,-.5);
      for(const outcome of [choice.success,choice.failure].filter(Boolean)){
        if(outcome.effects?.energy>0)outcome.effects.energy=clamp(outcome.effects.energy,1,4);
        if(outcome.effects?.energy<0)outcome.effects.energy=clamp(outcome.effects.energy,-6,-1);
        if(outcome.effects?.mood>0)outcome.effects.mood=clamp(Math.round(outcome.effects.mood*.65),1,10);
        if(outcome.effects?.mood<0)outcome.effects.mood=clamp(outcome.effects.mood,-18,-2);
        if(outcome.effects?.charm>0)outcome.effects.charm=clamp(outcome.effects.charm*.5,.2,1.5);
      }
      BALANCE_REVIEW.push({id:event.id,choice:index,before:{effects:before.effects,success:before.success?.effects,failure:before.failure?.effects},after:{effects:structuredClone(effects),success:structuredClone(choice.success?.effects),failure:structuredClone(choice.failure?.effects)}});
    }
  }
}
export function applyExercise(s){
  s.lastExerciseSem=s.sem;s.lastExerciseClock=s.eventClock||0;
  s.exerciseTerms??={};const key=s.sem,record=s.exerciseTerms[key]??={sessions:0,charm:0};record.sessions++;
  const bonus=.5+(record.sessions===3?1:0),gain=Math.min(bonus,Math.max(0,3-record.charm));record.charm+=gain;
  s.charm=Math.min(100,Math.round((s.charm+gain)*10)/10);
  return gain;
}
export function workloadCost(s,delta){return delta<0&&(s.traits?.运动习惯||0)>=3?Math.round(delta*.95*10)/10:delta;}
export function naturalMood(s){s.mood=Math.round((s.mood+Math.max(-2,Math.min(2,(55-s.mood)*.08)))*10)/10;}
export function changeMood(s,delta){
  const factor=delta<=0?1:s.mood>=90?.05:s.mood>=80?.18:s.mood>=65?.5:1;
  s.mood=Math.round(Math.max(0,Math.min(100,s.mood+delta*factor))*10)/10;
}
