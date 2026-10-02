// Canvas uses local fonts only; no uploaded names, remote images or dependencies.
const FONT='"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';
export function wrapText(ctx,value,width,maxLines=3){
  const lines=[];let line='';
  for(const ch of Array.from(String(value??''))){
    if(ch==='\n'){lines.push(line);line='';continue;}
    if(line&&ctx.measureText(line+ch).width>width){lines.push(line);line=ch;}else line+=ch;
  }
  if(line)lines.push(line);
  if(lines.length>maxLines){lines.length=maxLines;let last=lines.at(-1);while(last&&ctx.measureText(last+'…').width>width)last=Array.from(last).slice(0,-1).join('');lines[maxLines-1]=last+'…';}
  return lines;
}
export async function createSummaryImage(r){
  await document.fonts?.ready;
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1640;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('当前浏览器无法生成图片');
  const ink='#203e37',green='#2e6954',muted='#6e8076';
  ctx.fillStyle='#f4f5ed';ctx.fillRect(0,0,1080,1640);
  ctx.fillStyle='#fffef8';ctx.fillRect(48,48,984,1544);
  ctx.fillStyle=green;ctx.fillRect(48,48,984,14);
  const font=(size,bold=false)=>{ctx.font=`${bold?'700':'400'} ${size}px ${FONT}`;ctx.textBaseline='top';};
  const text=(value,x,y,size=30,color=ink,width=900,maxLines=2,lineHeight=size*1.5)=>{
    font(size,size>=40);ctx.fillStyle=color;const lines=wrapText(ctx,value,width,maxLines);lines.forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight));return y+lines.length*lineHeight;
  };
  const rule=y=>{ctx.strokeStyle='#d9e1d4';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(90,y);ctx.lineTo(990,y);ctx.stroke();};
  text('下一站，毕业',90,103,32,green);
  text('我的大学生涯',90,174,64);
  text(r.name+' · '+r.personality,90,272,30,muted);
  rule(340);
  text(r.school,90,380,40);text(r.major+' · '+r.ending.degree,90,447,29,muted);
  if(r.originSchool!==r.school)text('本科起点：'+r.originSchool,90,493,25,muted);
  ctx.fillStyle='#eaf0e3';ctx.fillRect(90,555,900,360);
  text('这一局的下一站',122,585,25,green,836);
  if(r.offer){
    text(r.offer.company,122,637,42,ink,836,2,55);
    text(r.offer.city+' · '+r.offer.role,122,755,28,ink,836,2,40);
    const label=r.offer.rating?r.offer.rating+' · ':'';
    text(label+r.offer.salary+' 万 / 年',122,848,35,green,836,1);
  }else{
    text(r.ending.title,122,646,44,ink,836,2,60);
    text(r.ending.text,122,775,27,muted,836,3,37);
  }
  text(r.offer?(r.offer.salaryBasis||'税前年总包')+' · 游戏设定':r.ending.at+' · 游戏结局',90,936,23,muted);
  text('学业成绩',90,1000,25,muted,420);text(String(r.grade)+(r.grade==='未结算'?'':' 分'),90,1040,39,ink,420);
  text('综合排名',565,1000,25,muted,420);text(String(r.combinedRank),565,1040,39,ink,420);
  rule(1120);
  text('校园里的你',90,1151,26,green);
  const relationship=r.relationship==='单身'?'毕业或收尾时单身':'与'+r.relationship+'继续相处';
  text(relationship+' · '+r.romances.length+' 段恋爱经历',90,1200,27,ink,900,2,40);
  const posts=[...new Set(r.recap.posts.map(p=>p.name))];
  text(posts.length?'任职：'+posts.join('、'):'时间留给了自己的学习、生活与相遇',90,1288,26,muted,900,2,39);
  const keywords=r.keywords.slice(0,4);
  text(keywords.length?'留下的经历：'+keywords.join(' · '):'平凡也有自己的故事',90,1375,25,green,900,2,38);
  rule(1480);
  text('每一次选择，都写进了这段人生。',90,1508,25,muted);
  text('虚构模拟 · 岗位、薪酬与录取结果为游戏设定',90,1555,19,muted);
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('图片导出失败')),'image/png'));
  return {blob,width:canvas.width,height:canvas.height};
}
