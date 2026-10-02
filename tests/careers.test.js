import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {JOBS,MAJORS} from '../src/content.js';
import {PUBLIC_POSTS,publicEligibility} from '../src/career-content.js';
import {offerPackage} from '../src/offer-package.js';
import {recruitBatch} from '../src/recruitment.js';
const ready=()=>{const s=E.createGame({},71);s.card=null;s.feedback=null;s.notices=[];s.deferred=null;s.phase='events';s.policy.published=true;return s;};
test('all employer roles have distinct duties, work context, perks and coherent salary bands',()=>{
 assert.equal(JOBS.length,62);assert.equal(new Set(JOBS.map(j=>j.company)).size,31);
 for(const j of JOBS){assert.ok(j.employerType&&j.description&&j.benefits&&j.preparation);assert.ok(j.salary>0&&j.salaryMax>=j.salary);if(j.bigTech)assert.ok(j.salary>=30);}
 for(const company of new Set(JOBS.map(j=>j.company))){const jobs=JOBS.filter(j=>j.company===company);assert.equal(new Set(jobs.map(j=>j.role)).size,jobs.length);assert.equal(new Set(jobs.map(j=>j.description)).size,jobs.length);}
 assert.ok(JOBS.some(j=>j.employerType.includes('研究所')));
});
test('top tech offer has attainable million-package rating but requires actual achievements and preparation',()=>{
 const s=ready(),j=JOBS.find(j=>j.premium&&j.degree==='本科');s.gpa=96;
 for(const tag of ['软件项目','实习经历','英语证书','公共表达','科研经历','竞赛获奖'])E.addHistory(s,tag);
 const ctx={hasTag:E.hasTag,major:MAJORS.cs,probability:E.probability,random:E.random,scoreFor:()=>100};
 const results=[];for(let seed=1;seed<=300;seed++){s.rng=seed*39157;results.push(recruitBatch(s,[j],ctx)[0]);}
 const top=results.filter(r=>r.offer&&r.rating==='SSP');assert.ok(top.length>0&&top.length<results.length/3);
 for(const r of top){assert.ok(r.salary>=100&&r.salary<=120);assert.ok(Math.abs(r.salary-r.compensation.cash-r.compensation.bonus-r.compensation.equity)<1e-8);}
 const noAchievement={...s,history:s.history.filter(h=>h.tag!=='竞赛获奖'&&h.tag!=='发表成果')};
 assert.notEqual(offerPackage(noAchievement,j,100,.98,E.hasTag,.01).rating,'SSP');
 for(const [score,gpa,readiness] of [[94,96,.98],[100,93,.98],[100,96,.84]]){const weak={...s,gpa};assert.notEqual(offerPackage(weak,j,score,readiness,E.hasTag,.01).rating,'SSP');}
});
test('S, SS and ordinary ratings differ; non-tech employers never receive stock or SSP',()=>{
 const s=ready(),big=JOBS.find(j=>j.premium);s.gpa=96;
 assert.equal(offerPackage(s,big,70,.5,E.hasTag,.5).rating,'普通');
 assert.equal(offerPackage(s,big,85,.65,E.hasTag,.5).rating,'S');
 assert.equal(offerPackage(s,big,93,.85,E.hasTag,.5).rating,'SS');
 for(const j of JOBS.filter(j=>!j.bigTech)){const p=offerPackage(s,j,100,.98,E.hasTag,.01);assert.notEqual(p.rating,'SSP');assert.ok(p.salary>=j.salary&&p.salary<=j.salaryMax);assert.equal(p.compensation.equity,0);}
});
test('public application chooses one post and is saved before the existing exam stage',()=>{
 const s=ready();s.sem=6;s.month=0;s.deferred='publicTargets';E.ensureCard(s);assert.ok(s.card.publicTargets);
 assert.equal(s.card.choices.length,PUBLIC_POSTS.length);const index=PUBLIC_POSTS.findIndex(p=>p.id==='municipal');
 const month=s.month,sem=s.sem;assert.ok(E.choose(s,index));assert.equal(s.publicTarget,'municipal');
 assert.equal(s.sem,sem);assert.equal(s.month,month);assert.equal(E.migrateSave(JSON.parse(JSON.stringify(s))).publicTarget,'municipal');
 assert.equal(E.choose(s,index),false); // cannot change the application while its result is pending
});
test('selection route checks existing academic and service experience without inventing new identities',()=>{
 const s=ready(),p=PUBLIC_POSTS.find(p=>p.selection);s.gpa=79;E.addHistory(s,'学生干部经历');assert.equal(publicEligibility(s,p,E.hasTag).ok,false);
 s.gpa=80;assert.equal(publicEligibility(s,p,E.hasTag).ok,true);s.history=[];assert.equal(publicEligibility(s,p,E.hasTag).ok,false);
 for(let i=0;i<3;i++)E.addHistory(s,'志愿服务');assert.equal(publicEligibility(s,p,E.hasTag).ok,true);assert.ok(p.description.includes('基层'));
});
test('every public post uses its own written cutoff; passing one does not pass all',()=>{
 for(const p of PUBLIC_POSTS){const s=ready();s.sem=7;s.month=1;s.route='civil';s.publicTarget=p.id;s.civilScore=p.examLine-1;E.ensureCard(s);assert.ok(s.civilFailure.includes('未达到'+p.examLine+'分'));}
 const s=ready();s.sem=7;s.month=1;s.route='civil';s.publicTarget='township';s.civilScore=60;E.ensureCard(s);assert.equal(s.card.id,'civil-interview');
});
test('public offers retain chosen institution, route and cash basis in ending and summaries',()=>{
 for(const p of PUBLIC_POSTS){let winner=null;for(let seed=1;seed<200&&!winner;seed++){
  const s=ready();Object.assign(s,{sem:7,month:1,route:'civil',publicTarget:p.id,civilScore:100,gpa:95,rng:seed*997});E.ensureCard(s);E.choose(s,2);if(s.publicOffer)winner=s;
 }assert.ok(winner,p.id);assert.equal(winner.publicOffer.company,p.company);assert.equal(winner.publicOffer.track,p.track);assert.equal(winner.publicOffer.salaryBasis,'税前年现金收入');
 E.continueFeedback(winner);assert.equal(winner.card.id,'epilogue');E.choose(winner,0);assert.ok(winner.ending);assert.ok(winner.ending.text.includes(p.role));assert.equal(E.summary(winner).offer.company,p.company);assert.ok(E.summaryText(winner).includes('税前年现金收入'));
 }
});
