export const PERSONALITIES=[
  {id:'balanced',name:'均衡型',description:'学习、活动和生活都愿意留一点时间，慢慢找到自己的节奏。',study:1,activity:1,energyMax:100,recovery:1,charm:50},
  {id:'scholar',name:'卷王型',description:'能长时间专注，学得快；透支以后，恢复需要更久。',study:1.15,activity:1,energyMax:120,recovery:.8,charm:40},
  {id:'social',name:'社交型',description:'和陌生人也能聊起来，愿意经营关系；钻研课程需要多花些时间。',study:.9,activity:1,energyMax:100,recovery:1,charm:65},
  {id:'practical',name:'实践型',description:'喜欢动手做项目、组织活动；忙起来容易累，需要兼顾课程。',study:.95,activity:1.2,energyMax:100,recovery:.9,charm:55},
  {id:'relaxed',name:'松弛型',description:'遇事能慢慢调整，恢复快；适合稳步学习，少做连续突击。',study:.95,activity:1,energyMax:90,recovery:1.25,charm:55},
];
export const personalityOf=s=>PERSONALITIES.find(p=>p.id===s.personality)||PERSONALITIES[0];
export const energyMax=s=>personalityOf(s).energyMax;
export const energyPercent=s=>Math.max(0,Math.min(100,s.energy/energyMax(s)*100));
export const roundState=v=>Math.round(v*10)/10;
export function changeEnergy(s,delta){const adjusted=delta>0?delta*personalityOf(s).recovery:delta;s.energy=roundState(Math.max(0,Math.min(energyMax(s),s.energy+adjusted)));}
