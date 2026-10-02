// The prize is fixed at purchase. This canvas only controls the visual reveal.
export function initScratch(canvas,onComplete){
  if(!canvas)return ()=>{};
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const ratio=Math.min(window.devicePixelRatio||1,2),rect=canvas.getBoundingClientRect();
  const width=rect.width,height=rect.height;
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  ctx.scale(ratio,ratio);ctx.fillStyle='#b8c5bc';ctx.fillRect(0,0,width,height);
  ctx.strokeStyle='#d8e1d9';ctx.lineWidth=3;
  for(let x=-height;x<width;x+=12){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+height,height);ctx.stroke();}
  ctx.fillStyle='#365547';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='600 23px "Microsoft YaHei UI",sans-serif';ctx.fillText('刮开这一刻的运气',width/2,height/2-8);
  ctx.font='15px "Microsoft YaHei UI",sans-serif';ctx.fillText('按住鼠标或用手指来回刮',width/2,height/2+27);
  let previous=null,active=null,done=false,timer=null,lastCheck=0;
  const label=document.querySelector('#scratch-progress');
  const point=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*width/r.width,y:(e.clientY-r.top)*height/r.height};};
  function check(){
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0,total=0;
    for(let i=3;i<data.length;i+=64){total++;if(data[i]<64)clear++;}
    const pct=Math.round(clear/total*100);label.textContent=`已刮开 ${pct}%`;
    if(pct>=55&&!done){done=true;ctx.clearRect(0,0,width,height);label.textContent='刮开了！正在兑奖…';timer=setTimeout(onComplete,750);}
  }
  function erase(e){
    if(done||e.pointerId!==active)return;e.preventDefault();const p=point(e);
    ctx.globalCompositeOperation='destination-out';ctx.lineWidth=42;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(previous?.x??p.x,previous?.y??p.y);ctx.lineTo(p.x,p.y);ctx.stroke();
    ctx.beginPath();ctx.arc(p.x,p.y,21,0,Math.PI*2);ctx.fill();previous=p;
    if(performance.now()-lastCheck>90){check();lastCheck=performance.now();}
  }
  const down=e=>{if(done||e.button!==0)return;active=e.pointerId;previous=null;canvas.setPointerCapture(active);erase(e);};
  const up=e=>{if(e.pointerId!==active)return;check();previous=null;active=null;};
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',erase);
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  return ()=>{clearTimeout(timer);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',erase);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);};
}
