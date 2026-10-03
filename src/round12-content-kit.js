// Authored options carry their own action, cost and result. These helpers only
// assemble the data; they do not invent a generic third choice or award success.
export const option=(text,result,effects={},extra={})=>({text,result,effects,...extra});
export const event=(id,group,title,text,category,choices,extra={})=>({id:'r12-'+id,group,title,text,category,choices,storyScope:'run',repeat:false,weight:1,topic:'r12-'+id,duration:category==='project'?6:category==='study'?5:4,...extra});
export const link=(id,scope='run',weeks=2)=>({id:'r12-'+id,scope,after:0,afterWeeks:weeks,expiresWeeks:20,expires:30,priority:2});
export function chain(group,id,stages,extra={}){
 return stages.map((stage,index)=>{
  const flag='r12-'+id+'-'+index;
  const choices=stage.choices.map((c,i)=>({...c,...(index<stages.length-1&&i<2?{setFlags:{...c.setFlags,[flag]:true},followUp:link(id+'-'+(index+1),extra.storyScope||'run',stage.afterWeeks??2)}:{}),...(index<stages.length-1&&i===2?{duration:c.duration??2}:{})}));
  return event(id+'-'+index,group,stage.title,stage.text,stage.category||'project',choices,{...extra,...stage.conditions,...(index?{followOnly:true,requiresFlags:[flag.replace(/\d+$/,String(index-1))],...(extra.semesters?{semesters:[...new Set([...extra.semesters,...extra.semesters.map(s=>s+1).filter(s=>s<14)])]}:{})}:{}),duration:stage.duration??(index?4:5)});
 });
}
