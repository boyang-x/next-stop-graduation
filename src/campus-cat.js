export const CAT_GRADUATION_EVENT={id:'r12-cat-graduation',group:'easter',category:'life',storyScope:'campus',followOnly:true,maxSem:13,requiresFlags:['catBonded'],repeat:false,duration:0,title:'毕业照边缘的熟悉身影',text:'你在本校拍毕业纪念照时，曾在图书馆侧门见过的橘白猫走到了花坛旁。大家不追逐它，只让它自己留在画面边缘。',choices:[
 {text:'和同学一起拍照，把小猫留在画面边缘',effects:{mood:6},action:'catPhoto',result:'你们完成了毕业合影，小猫在画面角落里。它没有被抱走或强迫摆姿势。'},
 {text:'拍一张自己的毕业照，保留小猫的身影',effects:{mood:5},action:'catPhoto',result:'你的毕业照片里留下了熟悉的小猫，照片成为本局的特别纪念。'},
 {text:'这次不拍照，远远看它一会儿再告别',effects:{mood:3},action:'catFarewell',result:'你认出了它，也保留了不拍照的选择；本局不生成带小猫的毕业照片。'},
]};
export const catDegreeKey=s=>s.school+':'+(s.sem>=8&&s.sem<14?'graduate':'undergraduate');
export function graduationCatCard(s){
 if(s.sem>=14||!s.campusFlags?.[s.school]?.catBonded||s.catGraduations?.[catDegreeKey(s)])return null;
 return {...structuredClone(CAT_GRADUATION_EVENT),kind:'choice',consume:false};
}
export function finishCatGraduation(s,taken){
 s.catGraduations??={};const record={school:s.school,degree:s.sem>=8?'硕士':'本科',taken};s.catGraduations[catDegreeKey(s)]=record;
 if(taken){s.catPhotos??=[];s.catPhotos.push(record);}
}
export const currentCatPhoto=s=>(s.catPhotos||[]).findLast(p=>p.school===s.school&&p.degree===(s.sem>=8&&s.sem<14?'硕士':'本科'))||null;
export function catSVG(pose='sitting'){
 const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`,ink='#655347',orange='#c59053',cream='#f5e7c7';
 const shape=pose==='sleeping'?r(12,17,26,12,ink)+r(14,16,22,12,orange)+r(16,23,15,6,cream)+r(3,15,17,12,ink)+r(5,15,13,11,orange)+r(4,10,5,8,ink)+r(14,10,5,8,ink)+r(6,12,2,5,orange)+r(16,12,2,5,orange)+r(7,19,3,1,ink)+r(14,19,3,1,ink)+r(11,22,2,1,'#b2796c')+r(1,22,5,1,ink)+r(17,22,5,1,ink)+r(33,14,6,5,orange)+r(36,18,4,9,orange)+r(3,29,37,2,'#344c3422'):
 r(10,10,20,20,ink)+r(12,10,16,19,orange)+r(14,18,12,11,cream)+r(7,7,26,13,ink)+r(9,7,22,12,orange)+r(8,2,7,8,ink)+r(25,2,7,8,ink)+r(10,4,3,5,orange)+r(27,4,3,5,orange)+r(12,12,3,3,ink)+r(25,12,3,3,ink)+r(19,16,3,2,'#b2796c')+r(3,16,7,1,ink)+r(30,16,8,1,ink)+r(12,28,7,3,cream)+r(22,28,7,3,cream)+r(29,23,9,5,orange)+r(35,18,4,8,orange)+r(6,31,34,2,'#344c3422');
 return `<svg class="pixel-cat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 34" shape-rendering="crispEdges" role="img" aria-label="校园橘白猫"><title>校园橘白猫</title>${shape}</svg>`;
}
