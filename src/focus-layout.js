// DOM presentation only. The engine owns all time, scoring and save transitions.
export function prepareFocusSurface(){
  const paper=document.querySelector('.focus-game .event-paper');
  if(!paper)return;
  const outcome=paper.querySelector(':scope > .outcome-box');
  const source=outcome||paper;
  const reader=document.createElement('div');reader.className='event-reader';
  const actions=document.createElement('div');actions.className='event-actions';
  const next=source.querySelector('.quiz-result .primary');
  if(next)next.remove();
  for(const element of [...source.children]){
    if(element.matches('.choices,.primary,.job-submit,.free-skip,.lottery-back,.leisure-manual'))actions.append(element);
    else if(element.matches('.event-text')&&!element.textContent.trim())element.remove();
    else reader.append(element);
  }
  if(next)actions.append(next);
  paper.replaceChildren(reader,actions);
  if(!actions.childElementCount)actions.hidden=true;
  paper.dataset.view=paper.querySelector('.free-picker')?'free':paper.querySelector('.leisure-plan')?'plan':outcome?'result':'event';
}

export function profileSections(markup,activeTab){
  const template=document.createElement('template');template.innerHTML=markup;
  const content=template.content.querySelector('.character-content');
  const groups={state:[],academic:[],memory:[]};
  for(const element of [...content.children]){
    const text=element.querySelector('summary')?.textContent||'';
    const group=/习惯与准备|特殊经历/.test(text)?'memory':
      element.matches('.academic-heading,.academic-grid,.academic-empty,.academic-warning,.policy-summary,.credit-details')||text.includes('学业计算')?'academic':'state';
    groups[group].push(element.outerHTML);
  }
  return `<nav class="profile-tabs" aria-label="档案分类">${[['state','当前状态'],['academic','学业'],['memory','经历']].map(([id,name])=>`<button data-action="profile-tab" data-id="${id}" aria-selected="${activeTab===id}">${name}</button>`).join('')}</nav>`+
    Object.entries(groups).map(([key,nodes])=>`<section class="profile-section" ${key===activeTab?'':'hidden'} aria-label="${{state:'当前状态',academic:'学业',memory:'经历'}[key]}">${nodes.join('')}</section>`).join('');
}
