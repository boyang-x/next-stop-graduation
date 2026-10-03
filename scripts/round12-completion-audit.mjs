import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {EVENTS} from '../src/content.js';
import {GRADUATE_BANDS} from '../src/round12-graduate.js';
import {OPTION_REVIEW} from '../src/round12-rules.js';
import {AWARD_POINTS,CADRE_POINTS} from '../src/score-ledger.js';
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const browser=p=>{const text=read(p);assert.ok(text.startsWith('### Result'),p);return JSON.parse(text.split('\n')[1]);};
const tests=read('output/round12-tests-final.txt');assert.match(tests,/tests 231/);assert.match(tests,/pass 231/);assert.match(tests,/fail 0/);
const configText=read('output/round12-config-final.txt'),config=JSON.parse(configText.slice(configText.indexOf('{')));assert.deepEqual(config.errors,[]);
const calibration=json('output/round12-calibration.json');assert.equal(calibration.runs,1872);assert.ok(calibration.cases.every(c=>c.ending&&c.pending===0&&c.duplicates===0&&c.graduateTruncated.length===0&&c.regularMonths.every(m=>c.freeMonths.includes(m))));
const latestSimulation=fs.statSync('output/round12-calibration.json').mtimeMs;
const fingerprints={};for(const name of fs.readdirSync('src').filter(n=>n.endsWith('.js'))){const p='src/'+name;assert.ok(fs.statSync(p).mtimeMs<=latestSimulation,'simulation predates '+p);fingerprints[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}
assert.equal(EVENTS.length,520);assert.equal(EVENTS.filter(e=>e.id.startsWith('r12-')).length,159);assert.equal(EVENTS.filter(e=>e.group==='graduate').length,68);assert.deepEqual(Object.values(GRADUATE_BANDS).map(es=>es.length),[16,18,14]);
assert.equal(EVENTS.filter(e=>e.arrivalEffects&&e.id.startsWith('incident-')).length,12);assert.ok(EVENTS.filter(e=>e.arrivalEffects).every(e=>!e.arrivalEffects.charm));
assert.deepEqual(AWARD_POINTS,{campus:[3,2,1],province:[6,4,2],national:[10,7,4]});assert.equal(Math.max(...Object.values(CADRE_POINTS)),6);
const pacing=json('output/round12-pacing-comparison.json');assert.ok(pacing.find(x=>x.stage==='undergraduate').reductionPercent>=25&&pacing.find(x=>x.stage==='undergraduate').reductionPercent<=35);assert.ok(pacing.find(x=>x.stage==='graduate').reductionPercent>=30&&pacing.find(x=>x.stage==='graduate').reductionPercent<=40);
const baseline=json('output/round12-baseline-verification.json');assert.deepEqual(baseline.differingIds,[]);assert.equal(baseline.matchedRouteRuns,36);
const focused=browser('output/round12-browser-final.txt'),undergraduate=browser('output/round12-browser-full.txt'),graduate=browser('output/round12-browser-graduate-final.txt');assert.equal(focused.cases,10);assert.deepEqual(focused.errors,[]);assert.ok(undergraduate.passed&&undergraduate.ending.degree==='本科');assert.ok(graduate.passed&&graduate.ending.degree==='硕士');assert.deepEqual(graduate.errors,[]);
const images={};for(const p of ['round12-cat-summary.png','round12-summary.png','round12-grad-summary.png']){const b=fs.readFileSync('output/playwright/'+p);assert.equal(b.subarray(1,4).toString(),'PNG');images[p]={width:b.readUInt32BE(16),height:b.readUInt32BE(20)};assert.deepEqual(images[p],{width:1080,height:1640});}
const result={version:'0.12.0',branch:'feat/pixel-campus',tests:231,events:520,newEvents:159,graduateEvents:68,graduateBands:[16,18,14],reviewedOptionChanges:OPTION_REVIEW.length,simulationRuns:calibration.runs,groups:calibration.groups,pacing,browser:{focused,undergraduate,graduate},images,fingerprints};
fs.writeFileSync('output/round12-completion-audit.json',JSON.stringify(result,null,2));console.log(JSON.stringify({passed:true,tests:231,events:520,runs:calibration.runs,pacing},null,2));
