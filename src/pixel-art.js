import {energyPercent} from './personality.js';

// Presentation only: never consumes randomness or changes a player's state.
export function pixelState(s = {}, context = 'campus') {
  const energy = Number.isFinite(s.energy) ? (s.energyMax ? Math.max(0,Math.min(100,s.energy/s.energyMax*100)) : energyPercent(s)) : 80;
  const mood = Number.isFinite(s.mood) ? s.mood : 75;
  const celebrating = s.feedback?.probability?.success === true ||
    ((s.feedback?.ticketComplete || s.card?.id === 'jackpot' || s.ending) &&
      (s.lotteryTransactions || []).some(t => t.revealed && t.prize >= 10000000)) ||
    Boolean(s.ending && (s.selectedOffer || s.publicOffer));
  const expression = mood < 35 ? 'sad' : energy < 25 ? 'sleepy' : celebrating ? 'joy' : mood >= 80 ? 'happy' : 'calm';
  return {gender:s.gender === 'female' ? 'female' : 'male', expression,
    tired:energy < 25, love:Boolean(s.relationship), celebrating:celebrating && mood >= 35,
    prop:s.ending && ['本科','硕士'].includes(s.ending.degree) ? 'cap' : ['study','exam','lab'].includes(context) ? 'book' : context === 'career' ? 'resume' : 'bag',
    label:(mood < 35 ? '有些低落' : energy < 25 ? '有点疲惫' : celebrating ? '开心庆祝' : mood >= 80 ? '心情很好' : '状态平稳') + (s.relationship ? ' · 恋爱中' : '')};
}

const rect=(x,y,w,h,color)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`;
const ink='#34453f',skin='#f4c89f';
export function characterSVG(s = {}, context = 'campus') {
  const v=pixelState(s,context),female=v.gender==='female',lift=v.celebrating?-9:0;
  const hairBase='#614535',hairLight='#7d5a43',hairShade='#4d392f';
  // Reference silhouette: broad swept fringe, restrained shading, original body.
  const backHair=female?`<path d="M8 10h25v4h4v16h-1v4h6v9H32v-5h-5V29H15v9H7v-4H5V16h3z" fill="${hairBase}"/>`+`<path d="M32 17h5v13h-1v4h6v9h-7v-7h-4z" fill="${hairShade}"/>`+rect(6,23,2,9,hairLight):'';
  const hairstyle=female
    ?`<path d="M7 25V12h2V9h3V7h4V5h15v2h4v3h2v5h1v10h-5v-5h-3v-4h-2v-4h-3v3h-3v3h-4v2h-4v-4h-3v4H9v5z" fill="${hairBase}"/>`+`<path d="M10 12V10h4V8h5V7h8v2h-6v2h-5v3h-4v2h-2z" fill="${hairLight}"/>`+`<path d="M32 10h3v3h2v12h-4v-5h-3v-4h-2v-3h4z" fill="${hairShade}"/>`+rect(33,18,5,2,hairShade)+rect(33,17,5,2,'#d8b977')
    :`<path d="M6 24V18H4v-3h2v-5h2V8h4V6h3V4h15v2h4v3h2v4h2v4h-2v8h-3v-5h-3v-4h-2v-3h-3v2h-4v2h-4v2h-4v-2h-3v6H8v2H6z" fill="${hairBase}"/>`+`<path d="M9 12v-2h4V8h5V6h8v2h-5v3h-5v2h-4v2H8v-3z" fill="${hairLight}"/>`+`<path d="M30 8h4v3h2v4h2v2h-2v8h-3v-5h-3v-5h-2v-3h2z" fill="${hairShade}"/>`;
  const eyes=v.expression==='happy'||v.expression==='joy'
    ?`<path d="M13 22v-2h4v2M26 22v-2h4v2" fill="none" stroke="${ink}" stroke-width="2"/>`
    :v.expression==='sleepy'?rect(13,22,5,2,ink)+rect(26,22,5,2,ink)
    :rect(14,20,3,5,ink)+rect(27,20,3,5,ink);
  const mouth=v.expression==='sad'?`<path d="M20 30v-2h5v2" fill="none" stroke="${ink}" stroke-width="1"/>`
    :v.expression==='joy'?rect(19,27,7,5,ink)+rect(20,30,5,2,'#dc8d91')
    :v.expression==='happy'?`<path d="M20 27v2h5v-2" fill="none" stroke="${ink}" stroke-width="1"/>`:rect(20,28,5,1,ink);
  const prop=v.prop==='book'?rect(28,41,13,13,ink)+rect(29,42,11,11,'#e3b85e')+rect(31,45,7,2,'#fff0be')
    :v.prop==='resume'?rect(28,39,13,17,ink)+rect(29,40,11,15,'#fff7dc')+rect(31,44,7,2,'#83998c')+rect(31,48,6,2,'#83998c')
    :v.prop==='bag'?rect(29,42,9,14,'#b17a58')+rect(30,40,6,3,'#836148'):'';
  const heart=v.love?`<g class="pixel-heart">${rect(36,9,3,3,'#c77680')+rect(41,9,3,3,'#c77680')+rect(35,12,10,3,'#c77680')+rect(37,15,6,3,'#c77680')+rect(39,18,2,2,'#c77680')}</g>`:'';
  const sparkle=v.celebrating?`<g class="pixel-sparkle"><path d="M4 19v8M0 23h8M45 30v8M41 34h8" stroke="#d6a24c" stroke-width="2"/></g>`:'';
  const fatigue=v.tired?`<path d="M2 6h6l-6 6h6M8 0h5L8 5h5" fill="none" stroke="#7d8b8b" stroke-width="1.5"/>`:'';
  const cap=v.prop==='cap'?rect(6,6,31,5,ink)+rect(11,4,22,3,ink)+rect(37,10,2,10,'#d8b556')+rect(36,19,4,4,'#d8b556'):'';
  const legs=rect(11,56,9,10,'#536379')+rect(23,56,9,10,'#536379')+rect(10,65,11,3,ink)+rect(23,65,11,3,ink);
  const torso=rect(9,35,26,23,ink)+rect(11,37,22,19,female?'#d38a83':'#73999a')+rect(18,33,8,7,skin)+rect(19,40,6,15,'#f6ebce');
  const arms=rect(5,39+lift,5,14,ink)+rect(6,40+lift,4,12,skin)+rect(35,39+lift,5,14,ink)+rect(35,40+lift,4,12,skin);
  const face=`<path d="${female?'M10 12h25v18h-2v4h-3v2H13v-2h-3v-3H9V20h1z':'M9 12h27v18h-2v4h-3v2H13v-2H9v-3H7V20h2z'}" fill="${skin}"/>`+rect(female?9:6,23,female?2:3,6,'#e4ad7e')+rect(female?34:36,23,female?2:3,6,'#e4ad7e')+rect(female?10:8,26,1,5,'#e4ad7e')+rect(34,26,2,5,'#e4ad7e');
  const emotion=(v.expression==='sad'?`<path d="M12 19l6-2M25 17l6 2" stroke="${ink}" stroke-width="1"/>`:'')+eyes+mouth+rect(12,26,4,2,'#e3a09a')+rect(29,26,4,2,'#e3a09a');
  return `<svg class="pixel-person" viewBox="0 0 48 72" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${v.label}" shape-rendering="crispEdges"><title>${v.label}</title>${rect(9,67,32,3,'#30463722')}<g class="pixel-body" transform="translate(0 ${v.tired?2:0})">${backHair}${legs}${torso}${arms}${face}${hairstyle}${emotion}${prop}${cap}</g>${heart}${sparkle}${fatigue}</svg>`;
}

export function sceneFor(s = {}) {
  const c=s.card || {}, id=c.id || '';
  if(s.ending)return 'ending';
  if(['jobs','offers'].includes(c.kind)||c.publicTargets)return 'career';
  if(c.kind==='quiz'||c.kind==='target')return 'exam';
  if(['lottery','scratch'].includes(c.kind))return 'shop';
  if(c.homeVisit||id==='ticket-home'||s.freeTime?.holiday)return 'holiday';
  if(c.group==='romance'||c.group==='relationship'||c.category==='romance')return 'social';
  if(['study','academic'].includes(c.category)||['academic','major'].includes(c.group))return 'study';
  if(c.category==='research'||c.category==='internship')return 'lab';
  if(c.kind==='free')return 'rest';
  return 'campus';
}

const labels={campus:'校园日常',study:'图书馆',lab:'实践与探索',social:'校园里的相遇',rest:'课余时光',holiday:'假期',exam:'认真作答',career:'人生下一站',shop:'便利店',ending:'这段人生，留个纪念'};
const windows=(xs,y,rows=1)=>xs.map(x=>Array.from({length:rows},(_,i)=>rect(x,y+i*22,18,13,'#789b9c')+rect(x+8,y+i*22,2,13,'#e3d3ad')).join('')).join('');
const tree=(x,y)=>rect(x+18,y+27,8,45,'#957254')+rect(x+4,y+12,36,31,'#769961')+rect(x+10,y,24,15,'#8ca967')+rect(x,y+23,46,13,'#648959');
function backdrop(context,school='aero') {
  const base=rect(0,0,800,192,'#d8e9dc')+rect(0,143,800,49,'#b9cd91')+rect(0,174,800,18,'#dfcda8')+rect(45,27,70,12,'#fff9e6')+rect(59,20,41,9,'#fff9e6')+rect(685,32,67,10,'#fff9e6')+rect(702,23,32,9,'#fff9e6');
  if(['study','lab','exam'].includes(context))return rect(0,0,800,192,'#efe3c6')+rect(0,158,800,34,'#cbb997')+rect(68,27,152,112,'#819c99')+rect(72,31,144,104,'#c5e2d9')+rect(142,31,5,104,'#fff4d7')+rect(72,80,144,5,'#fff4d7')+rect(595,32,144,107,'#8a7159')+[0,1,2].map(i=>rect(600,36+i*33,134,27,'#bd9b73')+[0,1,2,3,4,5,6,7].map(j=>rect(605+j*15,40+i*33,10,21,['#80948d','#c88778','#d3b45f'][j%3])).join('')).join('')+rect(299,137,223,9,'#927657')+rect(312,146,8,35,'#927657')+rect(496,146,8,35,'#927657')+rect(380,127,37,10,'#c89f54')+(context==='exam'?rect(437,123,37,14,'#fff9e6'):rect(444,99,43,31,'#58696d')+rect(446,102,39,24,'#c7e1d6'));
  if(context==='shop')return base+rect(232,42,339,122,'#efe0ba')+rect(219,34,365,20,'#668872')+rect(219,54,365,13,'#d9b368')+rect(252,82,94,59,'#91b0a0')+rect(461,82,94,59,'#91b0a0')+rect(368,76,74,88,'#728f83')+rect(374,82,62,80,'#bfdbcd')+rect(383,51,41,5,'#fff2c9')+tree(79,81)+tree(665,84);
  const building=context==='career'?rect(270,35,269,132,'#e9dab8')+rect(277,21,255,17,'#7d8d88')+windows([292,327,362,397,432,467,502],53,4):rect(230,73,351,94,'#e9dab8')+rect(217,58,377,15,'#7b8f80')+rect(367,46,82,119,'#f4e6c6')+rect(357,35,102,12,'#697f75')+windows([250,287,324,471,508,545],92,2)+rect(389,109,38,58,'#78968e')+rect(400,117,4,44,'#b0cdc0');
  const schoolMark=school==='aero'?`<path d="M625 41l47-12-13 13 16 8-22-3-10 13-2-16-16-3" fill="#879e92"/>`:school==='normal'?rect(627,39,24,15,'#95ab98')+rect(653,39,24,15,'#95ab98'):rect(640,31,22,22,'#d7b36b')+rect(647,25,8,34,'#d7b36b');
  return base+building+tree(65,87)+tree(664,83)+rect(143,151,61,6,'#aa8260')+rect(150,157,5,17,'#aa8260')+rect(191,157,5,17,'#aa8260')+schoolMark+(context==='social'?rect(596,147,28,7,'#bc877b'):'');
}

export function sceneSVG(s = {}, context = sceneFor(s), compact = false) {
  // Character markup is inline so state styles never cross SVG <use> shadow trees.
  const character=characterSVG(s,context).replace('<svg class="pixel-person"','<svg x="352" y="87" width="67" height="100" class="pixel-person"');
  const showCat=(s.card?.id||'').includes('cat-')||!!currentCatPhoto(s);
  const cat=showCat?catSVG(s.card?.id==='r12-cat-meet'?'sleeping':'sitting').replace('<svg class="pixel-cat"','<svg x="428" y="139" width="58" height="45" class="pixel-cat"'):'';
  return `<svg class="pixel-scene-art" viewBox="${compact?'0 72 800 120':'0 0 800 192'}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">${backdrop(context,s.school)}${character}${cat}</svg>`;
}

export function pixelScene(s = {}, context = sceneFor(s), compact = false) {
  return `<div class="pixel-scene ${compact?'compact':''}" data-scene="${context}">${sceneSVG(s,context,compact)}<span class="scene-caption">${labels[context]||labels.campus}</span></div>`;
}

export function pixelPortrait(s = {}, context = sceneFor(s)) {
  const v=pixelState(s,context);
  return `<div class="pixel-portrait" data-expression="${v.expression}">${characterSVG(s,context)}<span>${v.label.replace(' · ','<br>')}</span></div>`;
}

export function pixelIcon(id) {
  const shapes={
    log:rect(5,3,14,19,ink)+rect(7,5,10,15,'#f3e6bc')+rect(9,1,6,5,'#819b74')+rect(9,8,6,2,'#758f90')+rect(9,12,6,2,'#758f90')+rect(9,16,4,2,'#758f90'),
    rules:rect(3,4,8,16,'#758f90')+rect(13,4,8,16,'#819b74')+rect(5,6,5,11,'#fff2cf')+rect(14,6,5,11,'#fff2cf')+rect(11,5,2,17,ink)+rect(6,8,3,1,ink)+rect(6,11,3,1,ink)+rect(15,8,3,1,ink)+rect(15,11,3,1,ink),
    study:rect(3,5,8,14,'#758f90')+rect(13,5,8,14,'#758f90')+rect(5,7,5,10,'#fff2cf')+rect(14,7,5,10,'#fff2cf')+rect(11,6,2,15,ink),
    project:rect(4,4,16,14,'#759187')+rect(6,6,12,9,'#d3e2c4')+rect(11,18,2,3,ink)+rect(7,21,10,2,ink),
    social:rect(5,4,5,6,'#d5a878')+rect(15,7,5,6,'#d5a878')+rect(3,11,9,9,'#9b8781')+rect(13,14,9,7,'#809b88'),
    work:rect(8,3,8,5,ink)+rect(4,7,16,13,'#bd955f')+rect(4,11,16,2,ink)+rect(11,11,2,4,'#f5e9c9'),
    rest:rect(9,3,6,6,'#e3bd65')+rect(5,8,14,5,'#e3bd65')+rect(3,15,18,5,'#819b74')+rect(5,20,14,2,'#819b74')
  };
  return `<svg class="pixel-icon" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges">${shapes[id]||shapes.study}</svg>`;
}
import {catSVG,currentCatPhoto} from './campus-cat.js';
