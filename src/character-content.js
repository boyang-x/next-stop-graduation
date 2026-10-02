// Explicit gains for practicing communication; no gain for merely browsing a menu.
export function applyCharacterContent(events){
  const communication=new Map([
    ['student-show',[0,1]],['alumni-meet',[0,1]],['community-talk',[0,1]],
    ['aero-presentation',[0]],['finance-pitch',[0]],['normal-class',[0]],
    ['lang-interview',[0,1]],['edu-family',[0,1]],['grad-poster',[0]],
    ['cadre-feedback',[0,1]],['cadre-cross',[0,1]],['cadre-stage',[0,1]],
    ['cadre-response',[0,1]],['social-new-friends',[0,1,2]],['social-new-again',[0,1]],
  ]);
  for(const e of events)for(const [i,c] of e.choices.entries()){
    for(const node of [c,c.success,c.failure])if(node?.effects?.study>0&&node.effects.energy<0&&node.effects.energy>=-10)node.effects.energy=-Math.max(2,Math.round(-node.effects.energy*.45));
    if(communication.get(e.id)?.includes(i)){
      const target=c.probability?c.success:c;target.effects??={};target.effects.charm=.6;
    }
  }
  for(const e of events)if(e.dating)for(const c of e.choices)if(typeof c.probability==='object')c.probability.charm??=.0005;
  const tired=events.find(e=>e.id==='energy-low');if(tired){
    tired.title='有点累，还想继续吗？';tired.text='今天复习时，你发现自己开始反复读同一句话。要不要调整一下？';
    tired.choices[2]={text:'继续复习一小段，先完成眼前的内容',effects:{study:4,energy:-3,mood:-1},result:'你做完了这部分练习。效率慢了些，但学习没有停下来。'};
  }
  const handsOff=events.find(e=>e.id==='cadre-first');if(handsOff)for(const c of handsOff.choices)if(c.effects?.activity>0)c.effects.activity=Math.min(1,c.effects.activity);
}
