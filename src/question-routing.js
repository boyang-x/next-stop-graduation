// Route reviewed legacy questions by actual subject, not just a broad job category.
export function routeQuestions(questions){
  const byId=new Map(questions.map(q=>[q.id,q]));
  const assign=(ids,majors)=>ids.forEach(id=>Object.assign(byId.get(id),{majors,subject:'专业'}));
  assign(['t1','t2','t3','t4',...Array.from({length:8},(_,i)=>'tech-pro-'+i)],['cs']);
  assign(['e1','e2','e3','e4',...Array.from({length:8},(_,i)=>'engineering-pro-'+i)],['aerospace','mechanical']);
  assign(['d1','d2','d4','edu-pro-1','edu-pro-4','edu-pro-5'],['education']);
  assign(['d3','edu-pro-7'],['language']);
  assign(['edu-pro-0','edu-pro-2','edu-pro-3','edu-pro-6'],['education','psychology']);
  assign(['b1','b3','b4','business-pro-0','business-pro-1','business-pro-3','business-pro-6'],['finance','accounting']);
  assign(['b2','business-pro-2','business-pro-4','business-pro-5','business-pro-7'],['finance']);
  for(const q of questions.filter(q=>q.category==='humanities')){q.majors=['humanities'];q.subject='专业';}
  for(const q of questions.filter(q=>/^g\d+$/.test(q.id)))q.section='通用推理';
  const topics=['资料分析','资料分析','数量关系','数量关系','数量关系','判断推理','判断推理','言语理解','判断推理','资料分析','判断推理','资料分析'];
  topics.forEach((topic,i)=>Object.assign(byId.get('civil-'+i),{topic,subject:'行测',section:'行测 · '+topic}));
  // Chinese argument analysis belongs to aptitude tests, not an English exam.
  for(const id of ['exam-lang-3','exam-lang-5'])Object.assign(byId.get(id),{purposes:['jobs','civil'],section:'通用推理',topic:'判断推理',subject:'通用'});
  Object.assign(byId.get('v6-math-1'),{text:'矩阵[[1,0],[0,2]]的秩为？',answer:byId.get('v6-math-1').options.indexOf('2'),explanation:'两行线性无关，存在两个独立行，秩为2。'});
  const lock=byId.get('v6-cs-5');lock.options[lock.answer]='线程T等待自己释放L，发生自锁';
}
