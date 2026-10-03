const op=(text,effects,result,extra={})=>({text,effects,result,...extra});
const pre=(id,title,text,topic,choices,extra={})=>({id:'bond-'+id,title,text,topic,choices,group:'romance',category:'social',single:true,candidate:true,storyScope:'candidate',repeat:false,...extra});
const post=(id,title,text,topic,choices,extra={})=>({id:'bond-'+id,title,text,topic,choices,group:'romance',category:'social',dating:true,storyScope:'relationship',repeat:false,...extra});
const know=(text,result,delta=6,effects={})=>op(text,{energy:-5,mood:3,...effects},result,{candidateDelta:{familiarity:delta,interest:delta/2,trust:delta/2}});
const boundary=(text,result)=>op(text,{mood:1},result,{candidateDelta:{trust:4}});
const friend=()=>op('说明希望保持朋友关系',{mood:1},'你清楚地说明了自己的感受，对方也有自己的选择；你们不再继续发展恋爱关系。',{action:'clearCandidate'});
const together=(text,result,intimacy=5,effects={})=>op(text,{energy:-5,mood:3,intimacy,...effects},result,{effectsMemory:true});
const decline=(text,result,intimacy=-3,effects={})=>op(text,{intimacy,mood:-2,...effects},result);
const link=(id,scope)=>({id:'bond-'+id,scope,after:2,expires:12});

export const RELATIONSHIP_EXPANSION=[
  pre('book','对方推荐的一本书','最近认识的人发来一本书的名字，问你是否读过。你们还在了解彼此，不需要假装兴趣相同。','interests',[
    know('读一小段，再聊具体感受','你读了开头，把喜欢和不理解的地方都说了出来。'),boundary('坦诚没读过，问对方喜欢哪里','对方讲起自己的阅读经历，你没有装作已经读过。'),friend()]),
  pre('music','一张风格不同的歌单','对方分享了常听的歌，其中几首与你平时的喜好很不一样。','interests',[
    know('听两首，交流各自喜欢的部分','你们讨论了不同的喜好，而不是急着证明品味一致。'),boundary('分享自己的歌单，也尊重对方的偏好','你们保留了差异，多知道了彼此一点。'),friend()]),
  pre('pace','消息回复的节奏','对方问你为什么常常晚上才回复。白天的课程和工作让你很难随时看手机。','boundaries',[
    know('说明自己的时间，问对方习惯的联系方式','你们找到了双方都舒服的回复节奏。',5),boundary('说明忙时会晚回，重要事情可以直接约时间','你把能做到的事情说清楚，没有承诺随时在线。'),op('为了显得热情，答应随时秒回',{energy:-4,mood:-2},'你给自己增加了很难长期兑现的承诺。',{candidateDelta:{trust:-5}})]),
  pre('coffee','第一次单独见面的地点','你们准备第一次单独见面，对方提议到校门口的咖啡店。每人饮品约20元，也可以选择免费的公共空间。','invitation',[
    know('约在咖啡店，各付自己的饮品费','你支付20元，和对方聊起最近的生活。',7,{balance:-20}),know('提议到图书馆公共阅览区见面','你们选择免费公共空间，聊完后各自继续学习。',5),boundary('这周安排已满，商量下周的具体时间','你们没有把改约变成失联，确认了下周的时间。')]),
  pre('exam','对方说最近考试压力很大','你们还没有交往。对方提到一门课很难，想找人说说自己的焦虑。','support',[
    know('先听对方说完，再问是否需要一起复习','你没有替对方决定该怎么做，提供了具体且适度的支持。'),boundary('说明自己的安排，推荐适合的辅导资料','你表达了关心，也说明了自己能提供的帮助。'),op('开玩笑说这点事没什么',{mood:-1},'对方觉得自己的压力没有被认真看待。',{candidateDelta:{trust:-7,interest:-3}})]),
  pre('friends','一起见见朋友吗','对方邀请你参加三个人的小聚会，地点在食堂。你们还没有确定关系，朋友也不会替你们下结论。','friends',[
    know('参加聚餐，支付自己的25元餐费','你见到了对方的朋友，也聊了自己的日常。',6,{balance:-25}),boundary('这次不参加，另约一次单独散步','你没有把不参加聚会变成对关系的否定。'),friend()]),
  pre('choice','发现你们想法不一样','聊到假期计划时，你喜欢提前安排，对方更喜欢临时决定。差异已经具体地出现在相处中。','boundaries',[
    know('讨论哪些事要提前定，哪些可以临时决定','你们试着寻找双方都舒服的安排。'),boundary('坦诚这点对自己很重要，再观察相处','你没有急着改变对方，留下了继续了解的空间。'),friend()]),
  pre('signal','一次没有得到回应的邀约','你提出周末见面，对方说暂时没有时间，也没有给出新的日期。你无法仅凭这一条消息判断原因。','invitation',[
    boundary('表示理解，暂时不再追问','你尊重了对方的空间，把注意力放回自己的安排。'),know('只询问一次是否愿意之后再约','对方能够明确回答，你也愿意接受这个回答。',2),op('连续发消息催对方答复',{energy:-4,mood:-4},'催促让对方感到压力，联系变得疏远。',{candidateDelta:{trust:-10,interest:-8}})]),
  pre('feelings','开始期待对方的消息','几次相处之后，你意识到自己的好感。对方的感受仍需要亲自表达，熟悉并不等于已经交往。','confession',[
    {text:'认真表达好感，尊重对方的回答',effects:{energy:-5},probability:{base:.4,mood:.001,charm:.001,candidate:.003},success:{text:'对方也希望认真发展这段关系，你们开始交往。',action:'date',effects:{mood:7}},failure:{text:'对方希望保持朋友关系，你接受了这个回答。',action:'clearCandidate',effects:{mood:-8}}},
    know('再约一次相处，继续了解彼此','你们安排了新的见面，不急着要求一个结论。',3),friend()]),
  pre('task-start','一起完成一次小任务','对方提议一起整理公开讲座的笔记，结束后分享给缺席的朋友。这个任务只有一页内容。','cooperation',[
    know('先分工，各整理一半','你们确认了分工和碰面时间。',4,{study:1}),boundary('说明自己时间有限，承担核对部分','你把承诺控制在可以完成的范围内。'),friend()]),
];
// Three before-dating chains: shared work, a planned outing and a misunderstanding.
const beforeChains=[
  ['task','合作时的一处遗漏','整理笔记时，你发现自己漏掉了一段，对方已经完成了自己的部分。','cooperation',
    '承认遗漏，补齐自己的部分','你补齐了内容，没有让对方默默承担。','说明需要晚一天，重新确认提交时间','你们调整了时间，任务仍有明确的交付安排。','合作结束后的一次聊天','任务交付之后，对方提起你们合作时的感受。','聊聊哪里配合得好，也问对方的感受','你们从具体的合作了解了彼此。','感谢协助，保留各自的时间','任务结束了，你们也没有把合作当作必须交往的理由。'],
  ['outing','散步之前先确认安排','你们约好周末去校内步道，对方问具体时间和集合地点。','invitation',
    '确认下午三点在图书馆门口集合','你们把约定变成了可执行的安排。','说明天气可能变化，准备室内备选','你们约好下雨时到公共阅览区见面。','散步途中聊起的生活','你们按约见面，走到了操场旁的树荫道。对方问起你最近最期待的事。','分享一件具体的小事，也听对方说','你们知道了彼此生活里真实的期待。','聊完后按原计划结束见面','你们尊重彼此接下来的安排。'],
  ['misread','一句消息被理解错了','你的一句“随便吧”让对方以为你不想赴约，而你原本只是没有地点偏好。','communication',
    '说明原意，并承认措辞容易让人误解','对方知道了你的意思，你也意识到表达需要更具体。','问对方介意什么，再重新确认约定','你先了解了误会的来源。','解释之后的一次确认','几天后，对方再次问起见面的安排，想确认你是否真的愿意。','给出具体时间，按约见面','你用实际行动回应了上次的误解。','坦诚暂时不想见面，取消这次约定','你说清了自己的意愿，没有把对方留在猜测里。'],
];
// task-start exists above; the other two starts are separate authored scenes.
RELATIONSHIP_EXPANSION.push(
  pre('outing-start','一起散步的提议','对方问周末是否愿意一起在校内走走，你可以接受，也可以说明自己的安排。','invitation',[know('接受提议，留出一段时间','你们准备进一步确认时间与地点。',3),boundary('提出下周见面，说明本周已有安排','你们重新协调了时间。'),friend()]),
  pre('misread-start','一条不够清楚的回复','你们在线商量下次见面的地点。你回了一句“随便吧”，随后发现对方不再回复。','communication',[know('问对方是否误解了自己的意思','你主动确认这句话是否造成了误会。',2),boundary('补充说明自己没有地点偏好','你把模糊的回复讲得具体了。'),friend()]));
for(const [id,title,text,topic,a,ar,b,br,lastTitle,lastText,la,lar,lb,lbr] of beforeChains){
  const start=RELATIONSHIP_EXPANSION.find(e=>e.id==='bond-'+id+'-start');for(const c of start.choices.slice(0,2))c.followUp=link(id+'-middle','candidate');
  const middle=pre(id+'-middle',title,text,topic,[know(a,ar,5),boundary(b,br),friend()],{followOnly:true});for(const c of middle.choices.slice(0,2))c.followUp=link(id+'-end','candidate');
  RELATIONSHIP_EXPANSION.push(middle,pre(id+'-end',lastTitle,lastText,topic,[know(la,lar,7),boundary(lb,lbr),friend()],{followOnly:true}));
}

const daily=[
  ['breakfast','早课前的一顿早餐','你和{partner}都有早课，想在食堂花十五分钟一起吃早餐。每人餐费10元。','everyday','各付餐费，吃完按时去上课','你支付10元，聊完后一起走向各自的教室。',-10,'今天时间紧，改约课后见面','你说清了安排，没有让对方白等。'],
  ['hobby','试试对方喜欢的活动','{partner}邀请你一起尝试手工折纸，材料是对方已有的。你对这个爱好还不熟悉。','interests','一起试一次，问问对方喜欢哪里','你们做出了一件不太完美但有趣的小作品。',0,'坦诚自己兴趣不同，约另一项共同活动','你们接受了兴趣差异。'],
  ['photo','一张想留下来的合影','你们在校内花园散步，{partner}想拍一张合影，并问是否可以发到朋友圈。','boundaries','一起拍照，商量公开范围','你们确认了双方愿意公开的内容。',0,'拍照留作私人回忆，说明暂不公开','你们尊重了彼此对隐私的选择。'],
  ['quiet','各自安静的一个下午','{partner}想和你待在同一个公共阅览区，但各自读书，不必一直聊天。','everyday','一起去阅览区，各自做事','陪伴没有挤掉彼此的学习时间。',0,'说明想独处，另约见面时间','你们把独处和疏远区分开了。'],
  ['budget-new','这个月约会预算有点紧','你查看余额，发现这个月无法继续按以前的频率到校外吃饭。{partner}正在问周末怎么安排。','budget','说清预算，选择免费散步','你们协调了实际能承担的安排。',0,'各付20元，改在食堂吃一顿','你支付20元，没有用超出预算的消费证明感情。'],
  ['success','对方终于完成了一个目标','{partner}完成了一项准备很久的任务，想找你分享这件事。','support','听对方讲过程，再一起庆祝','你记住了对方投入的努力。',0,'发一段具体的祝贺，忙完再见面','你表达了关心，也兑现了稍后的见面。'],
  ['failure','一次努力没有换来好结果','{partner}的一次考试没有通过，对方暂时不想听“下次一定可以”。','support','问对方现在需要陪伴还是独处','你按对方的需要提供了支持。',0,'约好之后一起整理复习问题','你没有急着要求对方马上振作。'],
  ['alone','想独处的一天','{partner}说今天想自己休息。你原本想见面，双方的需求不一样。','boundaries','尊重独处，商量下次见面的时间','你们确认了安排，关系不必靠随时见面维持。',0,'说明自己的失落，但不要求对方立即见面','你表达了感受，也尊重对方的空间。'],
  ['phone','手机消息与注意力','一起吃饭时，你一直回复群消息。{partner}说希望这顿饭能专心聊一会儿。','communication','说明紧急事务，处理完后放下手机','你们商量了可以接受的等待时间。',0,'暂停非紧急消息，听对方说完','你把注意力放回了这次相处。'],
  ['friends-new','对方的朋友不太熟悉你','{partner}的朋友聚会在食堂举行，每人餐费25元。你可以参加，也可以说明自己的安排。','friends','参加聚餐，尊重彼此的朋友','你支付25元，认识了对方生活中的其他人。',-25,'这次不参加，支持对方单独赴约','你没有要求对方在朋友和恋人之间二选一。'],
  ['chores','一起整理借来的活动用品','你们参加完公共活动，需要把借来的椅子和材料归还。两个人都已经有些累。','cooperation','商量分工，归还各自负责的物品','你们完成了交接，再各自休息。',0,'联系负责人，确认可行的延期交接','物品去向和归还时间仍然明确。'],
  ['birthday','生日安排先问本人','{partner}生日快到了。对方最近很忙，你想准备祝福，但不确定是否喜欢热闹的庆祝。','celebration','先问喜好，买30元小点心一起庆祝','你支付30元，把庆祝安排成对方舒服的样子。',-30,'写一张祝福卡，约好忙完再见面','你记住了具体的愿望，而不只是日期。'],
  ['privacy','想不想共享手机密码','{partner}提到有朋友会交换手机密码。你们需要讨论自己的边界，而不是直接照搬别人的做法。','boundaries','说明隐私边界，也认真听对方的担心','你们讨论了信任和透明的具体做法。',0,'约好重要安排主动沟通，保留各自隐私','你们找到了一项双方愿意执行的约定。'],
  ['opinion','一件小事上的不同意见','看完一场免费校园演出，你喜欢其中一段，{partner}却觉得一般。意见不同不必变成谁对谁错。','interests','问问对方怎么看，再说自己的感受','你们发现了不同的观察角度。',0,'接受喜好不同，换个双方愿意聊的话题','你们没有强迫彼此给出相同评价。'],
  ['busy','连续几天都没能好好聊天','课程和工作让你们最近只互发简短消息。{partner}问是否能留出一段固定相处时间。','communication','约定一个能兑现的时间，按时见面','你们重新安排了联系的节奏。',0,'说明本周困难，约好下周并保持简短联系','你没有把忙碌变成没有期限的等待。'],
];
const avoidances={
 breakfast:['临时不去，也不通知对方','对方在食堂等了一会儿，才知道你改变了安排。'],
 hobby:['直接嘲笑这个爱好没意思','对方觉得自己的兴趣受到了轻视。'],
 photo:['没问对方就把照片公开','对方希望自己的公开范围得到尊重。'],
 quiet:['不断打断对方，要求一直聊天','原本约好的安静陪伴没有得到尊重。'],
 'budget-new':['为了面子坚持昂贵安排，要求对方承担','你没有提前商量预算，把负担转给了对方。'],
 success:['把话题转回自己，不听对方分享','对方觉得自己的努力没有被认真看见。'],
 failure:['责怪对方准备不够，不听解释','对方更加难过，也不愿继续分享。'],
 alone:['连续催促，要求今天必须见面','对方感到独处的需求被忽视了。'],
 phone:['继续刷非紧急消息，认为对方太在意','这顿饭里的沟通仍然被打断。'],
 'friends-new':['要求对方取消聚会，只陪自己','对方不希望被迫放弃自己的朋友关系。'],
 chores:['不做交接就离开，让对方处理全部物品','额外工作落在对方身上，原来的分工失去了意义。'],
 birthday:['忽略对方的安排，坚持突然拉去聚会','对方的工作和休息被打乱了。'],
 privacy:['把不交密码解释成不够爱自己','对方觉得自己的隐私边界没有得到尊重。'],
 opinion:['反复要求对方承认自己的评价才正确','喜好差异变成了一场令人疲惫的争执。'],
 busy:['继续不约时间，也不解释什么时候有空','对方仍不知道何时能得到回应。'],
};
for(const [id,title,text,topic,a,ar,cost,b,br] of daily)RELATIONSHIP_EXPANSION.push(post(id,title,text,topic,[
  together(a,ar,5,cost?{balance:cost}:{}),together(b,br,3,id==='budget-new'?{balance:-20}:{}),
  decline(...avoidances[id],-8,['photo','chores','privacy'].includes(id)?{charm:-1}:{})],{...( ['breakfast','quiet','chores','opinion'].includes(id)?{maxSem:13}:{} )}));

const coupleChains=[
  ['ill','对方身体不舒服','{partner}说自己感冒了，今天不能赴约。对方已经联系校医院，需要你们重新安排见面。','support','问清需要，协助取药并提醒休息','你按对方的需要提供了帮助，没有代替医生判断。','尊重休息，约好之后再联系','你取消了今天的见面，并确认了稍后的联系。','休息期间的一条消息','{partner}恢复得慢一些，想和你简单聊聊，也需要继续休息。','先询问状态，聊一会儿就让对方休息','陪伴没有变成额外负担。','发送关心，说明不需要立即回复','你给对方留下了恢复的空间。','身体恢复后的约定','{partner}身体恢复了，提起之前取消的见面。','重新约一次免费散步','你们按新的安排见面，也记住了彼此需要的照顾。','各自先完成积压任务，确认之后的时间','你们把恢复后的生活安排讲清楚了。'],
  ['miss','迟到之前没有说明','你比约定晚了半小时，又没有提前联系。{partner}等得有些生气。亲密度已下降12。','communication','承认失约，说明原因并认真听对方','你没有用忙碌否认对方白等的事实。','先道歉，确认今天是否还愿意见面','你尊重对方改变安排的选择。','说好的提前通知','下一次约会前，你发现任务可能拖延。上次的道歉是否兑现，取决于这次的行动。','提前说明并共同改约','你们没有重复上次的等待。','尽早调整任务，按约到达','这次约定得到了兑现。','后来再谈时间安排','{partner}提起你们最近的约定，想确认以后如何处理临时变化。','共同约定迟到和取消的通知方式','你们形成了一项可以执行的规则。','核对各自忙碌时段，减少不现实的约定','你们减少了临时变化引起的误会。'],
  ['distance','假期可能不在同一个城市','假期你们会去不同城市，{partner}想先讨论联系和见面的安排。','future','共同安排可承担的联系频率','你们没有承诺每天长时间通话，而是留出真实可用的时间。','说明预算有限，先安排线上联系','你们把距离和消费讲清楚了。','异地时的一次错过','你们约好的通话碰上了临时工作。对方没有及时接到你的解释。','说明情况，重新约一个双方有空的时间','你们没有把一次错过变成持续失联。','先听对方的不满，再解释自己的处境','你们理解了各自面对的压力。','异地之后重新见面','你们终于回到同一个城市，准备讨论假期的相处经验。','聊聊哪些安排有效，再一起散步','你们把异地经验带回了之后的生活。','各自休整，确认周末见面','重逢也尊重了旅途后的疲惫。'],
  ['work','两份安排撞到同一个周末','你有实习面试，{partner}有重要活动，原本的共同出游无法照常进行。','future','共同核对安排，取消并改约出游','你们尊重了彼此的重要事情。','分别参加各自的事，晚上简短联系','你们不必用放弃机会来证明感情。','忙碌之后还记得约定吗','面试和活动结束了。{partner}问起之前说好的补约。','给出具体日期，安排免费散步','你没有把补约停留在口头上。','说明仍有后续任务，重新确认可行日期','这次安排有明确的时间。','聊聊各自的下一步','你们都面临升学、实习或就业选择，需要把未来安排放在桌面上。','分别表达目标，再寻找能协调的部分','你们没有替彼此决定人生方向。','承认暂时难以确定，约好之后再讨论','你们接受了不确定，也保留了沟通。'],
  ['hurt','一句比较让对方难过','你把{partner}和别人比较，对方觉得自己的努力被轻视。亲密度已下降10。','communication','承认比较伤人，具体说明欣赏的地方','你没有把伤害推给对方太敏感。','先听完对方的感受，再认真道歉','你知道了这句话为什么让对方难过。','道歉之后如何表达','几天后，你们再次聊起彼此的目标。上次的道歉需要在表达中体现。','讨论各自目标，不再拿别人做标准','你尊重了对方的独立经历。','询问对方希望获得怎样的支持','你们把支持方式说得具体了。','重新建立的信任','{partner}说最近的交流舒服了一些，但不希望类似的比较再次发生。','记住边界，并继续用行动兑现','信任恢复了一部分，仍需要之后的相处。','一起确认沟通中各自介意的表达','你们找到了一项双方都愿意遵守的约定。'],
];
for(const [id,title,text,topic,a,ar,b,br,mt,mtext,ma,mar,mb,mbr,et,etext,ea,ear,eb,ebr] of coupleChains){
  const start=post(id+'-start',title,text,topic,[together(a,ar,3),together(b,br,2),decline('回避这件事，不讨论安排','问题没有得到回应，对方仍在等待解释。',-10)]);
  if(id==='miss'||id==='hurt'){start.arrivalEffects={intimacy:id==='miss'?-12:-10,mood:-5};start.severity='relationship';}
  for(const c of start.choices.slice(0,2))c.followUp=link(id+'-middle','relationship');
  const middle=post(id+'-middle',mt,mtext,topic,[together(ma,mar,5),together(mb,mbr,3),decline('仍不回应，认为以后自然会好','没有兑现的约定继续损害信任。',-9)],{followOnly:true});
  for(const c of middle.choices.slice(0,2))c.followUp=link(id+'-end','relationship');
  RELATIONSHIP_EXPANSION.push(start,middle,post(id+'-end',et,etext,topic,[together(ea,ear,6),together(eb,ebr,4),decline('不愿继续讨论，把问题搁置','这段关系仍需要处理尚未解决的问题。',-8)],{followOnly:true}));
}
export function tuneRelationshipEvents(events){
  for(const e of events.filter(e=>e.group==='romance')){
    e.topic??=e.id.includes('gift')?'celebration':e.id.includes('conflict')||e.id.includes('repair')?'communication':e.id.includes('invite')?'invitation':'everyday';
    // Once per person/relationship. A new school year must not replay the same scene.
    if(e.storyScope)e.repeat=false;
  }
  for(const id of ['social-new-invite','love-invite']){
    const e=events.find(e=>e.id===id);if(!e)continue;
    for(const c of e.choices)if(c.followUp?.id===id){delete c.followUp;c.action='candidateContinue';c.result='你们商量了新的相处机会，之后继续了解彼此。';}
    for(const c of e.choices)if(c.success?.action==='date'){c.probability.candidate=.003;c.probability.base=Math.min(.45,c.probability.base);}
  }
}
