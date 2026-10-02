const op=(text,effects,result,extra={})=>({text,effects,result,...extra});
const link=(id,after=2)=>({id,after,expires:10,scope:'candidate'});
const encounter=(text,effects,base)=>({text,effects,probability:{base,mood:.001},success:{text:'你和一位异性同学聊得投机，互相留下了联系方式。故事可以慢慢继续。',action:'meet',followUp:link('social-new-again')},failure:{text:'这次主要是轻松聊天，没有遇到特别想进一步认识的人。你仍度过了一段不错的时光。'}});
export const RELATIONSHIP_EVENTS=[
  {id:'social-new-friends',group:'common',category:'social',followOnly:true,title:'走出熟悉的朋友圈',text:'有人组织一次校园交流。认识一个人，从一次自然的聊天开始。',choices:[
    encounter('参加社团的开放活动',{energy:-4,mood:5},.56),
    encounter('去朋友组织的小聚会',{balance:-30,energy:-3,mood:7},.67),
    encounter('参加操场上的混合组队活动',{balance:-10,energy:-5,mood:6},.59),
  ]},
  {id:'social-new-again',group:'romance',category:'social',single:true,candidate:true,storyScope:'candidate',followOnly:true,title:'最近认识的人又联系了你',text:'对方提起上次聊过的话题，还发来一场校园活动的消息。要不要再见一次？',choices:[
    op('一起参加活动，继续了解彼此',{energy:-3,mood:5},'你们发现还有一些共同兴趣，下一次聊天更自然了。',{setFlags:{familiar:true},followUp:link('social-new-invite')}),
    op('先在线聊聊，再约一次散步',{mood:3},'你没有急着给这段关系下结论，留下了一次新的约定。',{followUp:link('social-new-invite',3)}),
    op('说明想保持普通朋友关系',{mood:2},'你说清了自己的想法，你们作为普通朋友继续相处。',{action:'clearCandidate'}),
  ]},
  {id:'social-new-invite',group:'romance',category:'social',single:true,candidate:true,storyScope:'candidate',followOnly:true,title:'要不要迈出下一步？',text:'几次相处之后，你开始期待对方的消息。你的感受，也需要对方自己的回答。',choices:[
    {text:'认真表达好感，尊重对方的回答',effects:{energy:-3},probability:{base:.54,mood:.001,tags:{跨校社交:.04}},success:{text:'对方也想认真了解这段关系，你们开始交往。',action:'date'},failure:{text:'对方希望保持朋友关系。你尊重这个回答，继续自己的校园生活。',action:'clearCandidate'}},
    op('再相处一段时间，不急着表白',{mood:3},'你们约好下一次见面。这段关系还可以慢慢发展。',{followUp:link('social-new-invite',4)}),
    op('保持朋友关系，去认识更多的人',{mood:2},'你们不必成为恋人才能拥有一段愉快的相识。',{action:'clearCandidate'}),
  ]},
  {id:'love-unexpected-conflict',group:'romance',category:'social',storyScope:'relationship',followOnly:true,dating:true,title:'一场没有预料到的争执',text:'一个临时安排和一句误解碰到了一起，你和{partner}都说了重话。亲密度已降低20；现在需要决定如何处理。',choices:[
    {text:'停下来，分别讲清在意的事情',effects:{energy:-3},probability:{base:.72,mood:.001,tags:{共同回忆:.05}},success:{text:'你们听懂了彼此在意的地方，但仍需要实际行动来恢复信任。',effects:{intimacy:9},setFlags:{conflictDiscussed:true},followUp:{id:'love-conflict-follow',clearFlags:['conflictPending','conflictAvoided','conflictDiscussed'],after:2,expires:10}},failure:{text:'这次还没有说通，你们约好过两天继续谈。',effects:{intimacy:-3},followUp:{id:'love-conflict-follow',clearFlags:['conflictPending','conflictAvoided','conflictDiscussed'],after:2,expires:10}}},
    op('先冷静一天，明确约好再沟通',{intimacy:3,mood:2},'暂停没有变成失联。你们把再次沟通的时间定了下来。',{followUp:{id:'love-conflict-follow',clearFlags:['conflictPending','conflictAvoided','conflictDiscussed'],after:2,expires:10}}),
    op('觉得没必要解释，先不回复',{intimacy:-10,mood:-3},'沉默让对方开始猜测，原来的误解还在。',{setFlags:{conflictAvoided:true},followUp:{id:'love-conflict-follow',clearFlags:['conflictPending','conflictAvoided','conflictDiscussed'],after:2,expires:10}}),
  ]},
  {id:'love-conflict-follow',group:'romance',category:'social',storyScope:'relationship',followOnly:true,dating:true,title:'争执之后，承诺还算数吗？',text:'{partner}提起了上次的争执。今天的行动，会比当时一句“以后注意”更具体。',choices:[
    op('兑现约定，认真听完对方的想法',{energy:-4,intimacy:7},'你们开始重新信任彼此，不必假装争执从未发生。',{setFlags:{conflictPending:false,conflictAvoided:false}}),
    op('商量各自的边界，调整相处安排',{intimacy:4},'你们找到一项双方愿意做到的改变，关系慢慢缓和。',{setFlags:{conflictPending:false,conflictAvoided:false}}),
    op('仍然回避，认为时间会自动解决',{intimacy:-12},'时间过去了，问题没有得到回应。',{setFlags:{conflictPending:false}}),
  ]},
];
