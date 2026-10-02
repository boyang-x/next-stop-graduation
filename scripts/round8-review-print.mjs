import {EVENTS} from '../src/content.js';
const [a,b]=process.argv.slice(2).map(Number);
const keys={effects:'Δ',probability:'P',success:'Y',failure:'N',text:'T',result:'R',followUp:'next',energy:'E',mood:'M',balance:'¥',activity:'A',study:'S',charm:'C',tags:'tags',duration:'time'};
function slim(o){if(Array.isArray(o))return o.map(slim);if(o&&typeof o==='object')return Object.fromEntries(Object.entries(o).map(([k,v])=>[keys[k]||k,slim(v)]));return o;}
for(const [n,e] of EVENTS.slice(a,b).entries()){console.log(`${a+n} ${e.id}: ${e.title}\n${e.text}\n${JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k])=>!['id','title','text','choices'].includes(k))))}`);for(const c of e.choices)console.log(JSON.stringify(slim(c)));console.log('');}
