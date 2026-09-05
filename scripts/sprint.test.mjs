import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initialState, taggedUrl, transition, validateState, validateRecord, totalSpend, recommendation } from '../public/sprint/core.js';
const data=JSON.parse(readFileSync(new URL('../public/sprint/campaigns-v01.json',import.meta.url),'utf8'));
const record={id:'a',campaignId:'cf-free-visit',date:'2026-09-05',evidence:'CRM daily export',visits:10,conversations:1,bookings:1,trials:0,customers:0,ours:3,spend:12.5,revenue:0};
test('five companies, authorized budget, unique campaign links, correct domains',()=>{
 assert.equal(data.campaigns.length,5);assert.equal(data.campaigns.reduce((s,c)=>s+c.budget,0),100);
 const domains=['traincloudforest.com','dojozeus.com','joinlyceum.com','rigboss.app','mechcorrect.com'];const urls=new Set();
 data.campaigns.forEach((c,i)=>c.assets.forEach(a=>{const u=new URL(taggedUrl(c,a));assert.equal(u.hostname,domains[i]);assert.ok(u.searchParams.get('utm_campaign'));assert.ok(!urls.has(u.href));urls.add(u.href);}));
 assert.match(data.campaigns[1].blocker,/HOLD/);
});
test('approval and publication cannot be inferred',()=>{
 const s={stage:'draft',checked:false,proof:''};assert.throws(()=>transition(s,'live',0));assert.throws(()=>transition({...s,checked:true},'live',0));
 const approved=transition({...s,checked:true},'approved',0);assert.throws(()=>transition(approved,'live',0));
 assert.equal(transition({...approved,proof:'Meta ad reference'},'live',0).stage,'live');assert.throws(()=>transition({...approved,proof:'Meta'},'live',100));
});
test('results reject invalid values and count real and test visits separately',()=>{
 assert.equal(validateRecord(record,['cf-free-visit']).visits,10);
 for(const patch of [{spend:-1},{spend:.001},{customers:1.5},{visits:NaN},{date:'2026-09-12'},{campaignId:'unknown'},{evidence:''}])assert.throws(()=>validateRecord({...record,...patch},['cf-free-visit']));
 assert.equal(totalSpend([record,record]),25);
});
test('backup validation preserves valid evidence and rejects duplicates and forged statuses',()=>{
 const s={...initialState(),records:[record]};assert.deepEqual(validateState(s,data.campaigns).records,[record]);
 assert.throws(()=>validateState({...s,records:[record,record]},data.campaigns));
 assert.throws(()=>validateState({...s,campaigns:{'cf-free-visit':{stage:'live',checked:false,proof:''}}},data.campaigns));
});
test('recommendations never invent wins from visits',()=>{
 assert.match(recommendation([]),/No results/);
 assert.match(recommendation([{...record,conversations:0,bookings:0,spend:40}]),/Pause paid/);
 assert.match(recommendation([record]),/Follow up/);
});
