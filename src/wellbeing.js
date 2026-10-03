// Fictional gameplay rules, shared by the runtime and the visible explanations.
import {energyPercent} from './personality.js';
export function learningFactor(energy){const value=typeof energy==='object'?energyPercent(energy):energy;return value<20?.85:value<40?.93:value>=80?1.08:1;}
export function wellbeingDescription(key,value){
  if(key==='energy')return value===0?'疲惫 · 仍可学习':value<20?'疲惫 · 学习−15%':value<40?'有点累 · 学习−7%':value>=80?'充沛 · 学习+8%':'精力正常';
  return value===0?'低落 · 先调整':value<20?'低落 · 社交稍弱':value>=80?'愉快 · 社交加成':'心情平稳';
}
export function exertionAvailable(s,effects={},critical=false){
  if(critical)return {ok:true,reason:''};
  if(effects.exercise&&(s.exercisePauseUntil??-1)>s.eventClock)return {ok:false,reason:'身体恢复中，先按医嘱休整'};
  // Fatigue changes efficiency and scenes, but never locks ordinary activities.
  return {ok:true,reason:''};
}
export function recoveryNeeded(s){
  s.recoveryHandled??={};
  for(const key of ['energy','mood'])if(s[key]>=20)s.recoveryHandled[key]=false;
  return ['mood'].filter(key=>s[key]===0&&!s.recoveryHandled[key]);
}
