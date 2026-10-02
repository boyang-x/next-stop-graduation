import test from 'node:test';
import assert from 'node:assert/strict';
import {EVENTS,SCHOOLS} from '../src/content.js';
import {createGame,eventEligible,ensureCard,choose,continueFeedback,freeAction,advanceNotice,choiceAvailable} from '../src/engine.js';
import {prepareStoryEvent,queueFollowUp,pruneStories} from '../src/story.js';
function ready(){const s=createGame({major:'cs',school:'aero'},37);s.sem=2;s.policy.published=true;s.phase='events';s.hooks['2-0-committee']=true;s.card=null;s.notices=[];s.feedback=null;return s;}
const card=(s,id)=>s.card={...prepareStoryEvent(s,EVENTS.find(e=>e.id===id)),kind:'choice',consume:true};
function follow(s,id){for(let n=0;n<40;n++){if(s.card?.id===id)return;if(s.feedback){continueFeedback(s);continue;}if(s.card?.kind==='notice'){advanceNotice(s);continue;}if(s.card?.kind==='free'){freeAction(s,'skip');continue;}if(s.card?.kind==='choice'){choose(s,0);continue;}throw new Error(s.card?.kind);}throw new Error('Missing '+id);}
test('competition joins, faces a team problem, then the earlier cooperation opens a distinct presentation',()=>{
  const s=ready();card(s,'competition-entry');assert.ok(s.card.text.includes('校园应用开发赛'));choose(s,0);continueFeedback(s);follow(s,'competition-team');assert.ok(s.plotFlags.competitionActive);choose(s,0);continueFeedback(s);follow(s,'competition-final');assert.ok(choiceAvailable(s,s.card.choices[2]).ok);choose(s,2);assert.equal(s.plotFlags.competitionActive,false);assert.ok(!s.history.some(h=>h.tag==='竞赛获奖'));
});
test('withdrawing stops the competition instead of awarding a result or creating another episode',()=>{
  const s=ready();s.plotFlags.competitionActive=true;card(s,'competition-team');choose(s,2);assert.equal(s.plotFlags.competitionActive,false);assert.equal(s.storyQueue.length,0);assert.ok(!eventEligible(s,EVENTS.find(e=>e.id==='competition-final'),true));
});
test('expired work episodes release their active flag with an explanation',()=>{
  const s=ready();s.plotFlags.competitionActive=true;queueFollowUp(s,{id:'competition-team',clearFlags:['competitionActive']});s.eventClock=9;assert.equal(pruneStories(s).length,1);assert.equal(s.plotFlags.competitionActive,false);
});
test('summer internship plays application, work and handover inside the holiday; only completion gives experience',()=>{
  const s=ready();s.phase='start';s.policy.published=false;ensureCard(s);const tick=s.calendarTick,month=s.month;freeAction(s,'internship');continueFeedback(s);assert.equal(s.card.id,'internship-apply');s.rng=1;choose(s,0);assert.equal(s.plotFlags.internshipActive,true);assert.ok(!s.history.some(h=>h.tag==='实习经历'));continueFeedback(s);assert.equal(s.card.id,'internship-work');const restored=JSON.parse(JSON.stringify(s));choose(restored,0);continueFeedback(restored);assert.equal(restored.card.id,'internship-end');assert.equal(restored.calendarTick,tick);assert.equal(restored.month,month);const balance=restored.balance;choose(restored,0);assert.equal(restored.balance,balance+restored.internship.net);assert.ok(restored.history.some(h=>h.tag==='实习经历'));assert.equal(choose(restored,0),false);continueFeedback(restored);assert.equal(restored.card.kind,'focus');assert.equal(restored.calendarTick,tick+1);assert.equal(restored.freeTime,null);assert.ok(restored.study>0,'holiday learning carries into term');
});
test('failed internship application releases holiday without awarding a fabricated experience',()=>{
  const s=ready();s.phase='start';ensureCard(s);freeAction(s,'internship');continueFeedback(s);choose(s,2);continueFeedback(s);assert.equal(s.card.kind,'focus');assert.equal(s.freeTime,null);assert.ok(!s.history.some(h=>h.tag==='实习经历'));
});
test('published policy drives near-line and leading events, but unsettled or finished policy does not',()=>{
  const s=ready(),near=EVENTS.find(e=>e.id==='policy-near-line'),leading=EVENTS.find(e=>e.id==='policy-leading');s[s.policy.metric]=s.policy.places+8;assert.ok(eventEligible(s,near));assert.equal(eventEligible(s,leading),false);s[s.policy.metric]=s.policy.places;assert.ok(eventEligible(s,leading));assert.equal(eventEligible(s,near),false);s.hooks.qual=true;assert.equal(eventEligible(s,leading),false);s.hooks.qual=false;s.policy.published=false;assert.equal(eventEligible(s,leading),false);
});
test('every playable major and school has contextual authored work, with correct pool exclusivity',()=>{
  for(const school of SCHOOLS)for(const major of school.majors){const s=ready();s.school=school.id;s.major=major;const own=EVENTS.find(e=>e.id.startsWith('major-')&&e.major===major);assert.ok(own,major);assert.ok(eventEligible(s,own));const schoolEvent=EVENTS.find(e=>['aero-shared-language','normal-open-class','finance-valuation'].includes(e.id)&&e.school===school.id);assert.ok(eventEligible(s,schoolEvent));assert.ok(!prepareStoryEvent(s,EVENTS.find(e=>e.id==='competition-entry')).text.includes('{competition}'));}
});
test('a meaningful purchase is rejected before charging, while a non-paying workaround remains possible',()=>{
  const s=ready();s.balance=80;card(s,'budget-device');assert.equal(choose(s,0),false);assert.equal(s.balance,80);assert.ok(choiceAvailable(s,s.card.choices[2]).ok);choose(s,2);assert.equal(s.balance,80);assert.ok(s.study>0);
});
