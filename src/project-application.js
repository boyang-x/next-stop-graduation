// Store the draw at submission. Reading a save cannot redraw an admission result.
export function submitProjectApplication(s,roll){
 s.projectApplication={status:'awaiting',roll,due:(s.eventClock||0)+1,school:s.school,sem:s.sem};
}
export function projectApplicationCard(s,rejection){
 const p=s.projectApplication;if(!p||p.status!=='awaiting'||p.due>s.eventClock&&s.month<5)return null;
 p.status=p.roll<.6?'accepted':'rejected';p.resultSem=s.sem;
 if(p.status==='rejected')return {...rejection,kind:'choice',consume:false};
 return {id:'project-application-result',kind:'choice',group:'milestone',consume:!s.pendingFinish&&s.month<5,duration:Math.min(3,Math.max(1,20-s.month*4-(s.week||0))),title:'小项目申请入选了',text:'你提交的校园小项目获得一次试行机会。入选本身不加综测；请确认是否实际参与。',choices:[
 {text:'与小组完成一次限定范围的试行',effects:{energy:-12,study:3,tags:['校园活动']},result:'你们按约完成了试行，记录了实际问题；没有竞赛奖项或额外综测。'},
 {text:'只承担已确认的资料核对工作',effects:{energy:-7,study:2},result:'你完成了限定范围的工作，没有承诺全程参与。'},
 {text:'说明课表冲突，在接任前放弃机会',effects:{mood:1},result:'你及时说明了安排，没有获得已完成项目经历。'},
 ]};
}
