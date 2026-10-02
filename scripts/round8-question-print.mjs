import {QUESTIONS} from '../src/content.js';
const [a,b]=process.argv.slice(2).map(Number);
QUESTIONS.slice(a,b).forEach((q,i)=>console.log(`${a+i} ${q.id} [${q.purposes}/${q.majors||q.category}/${q.section}/${q.difficulty}] ${q.text}\n${q.options.map((o,j)=>j+' '+o).join(' | ')}\n✓${q.answer} ${q.explanation}${q.hint?' H:'+q.hint:''}\n`));
