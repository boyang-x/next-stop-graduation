import test from 'node:test';
import assert from 'node:assert/strict';
import {pixelState, sceneFor, characterSVG, sceneSVG} from '../src/pixel-art.js';
import {createGame} from '../src/engine.js';

test('pixel art reads real traits and composes tiredness with relationship and low mood',()=>{
  const s=createGame({personality:'scholar'},71);
  s.energy=28;s.mood=85;s.relationship={person:{name:'同学'}};
  assert.equal(pixelState(s).expression,'sleepy'); // 28 / 120, not 28 / 100
  assert.equal(pixelState(s).love,true);
  s.mood=10;assert.equal(pixelState(s).expression,'sad');assert.equal(pixelState(s).tired,true);
  assert.match(characterSVG(s),/pixel-heart/);assert.match(characterSVG(s),/有些低落/);
});
test('unrevealed lottery never leaks its result through the character',()=>{
  const s=createGame({},72);s.mood=90;s.card={id:'scratch',kind:'scratch'};
  s.lotteryTransactions=[{revealed:false,prize:10000000}];
  assert.equal(pixelState(s).celebrating,false);assert.doesNotMatch(characterSVG(s),/pixel-sparkle/);
  s.lotteryTransactions[0].revealed=true;s.feedback={ticketComplete:true};
  assert.equal(pixelState(s).celebrating,true);
  s.feedback=null;s.card={id:'ordinary'};assert.equal(pixelState(s).celebrating,false);
});
test('visual rendering preserves the entire state and the next random result',()=>{
  const s=createGame({gender:'female',personality:'social'},73),before=JSON.stringify(s);
  for(let i=0;i<10;i++){characterSVG(s,'study');sceneSVG(s);pixelState(s);sceneFor(s);}
  assert.equal(JSON.stringify(s),before);
  assert.equal(pixelState(s).gender,'female');assert.equal(pixelState({}).gender,'male');
});
test('scene routing distinguishes activities, exams, careers and confirmed endings',()=>{
  assert.equal(sceneFor({card:{kind:'quiz'}}),'exam');assert.equal(sceneFor({card:{kind:'lottery'}}),'shop');
  assert.equal(sceneFor({card:{group:'romance'}}),'social');assert.equal(sceneFor({card:{kind:'jobs'}}),'career');
  assert.equal(sceneFor({card:{id:'ticket-home'}}),'holiday');assert.equal(sceneFor({freeTime:{holiday:'暑假'}}),'holiday');
  assert.equal(sceneFor({ending:{title:'暂缓毕业'}}),'ending');
  const s={ending:{degree:'本科'},publicOffer:{},mood:90,energy:80};assert.equal(pixelState(s).celebrating,true);
  s.mood=10;assert.equal(pixelState(s).celebrating,false);assert.equal(pixelState(s).prop,'cap');
  s.ending.degree='本科在读';assert.notEqual(pixelState(s).prop,'cap');
});
