import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ownerSummary,ownerReport,ownerHTML} from '../public/sprint/owner.js';
const c={id:'ly-first-school',company:'Lyceum',budget:40};
const row={campaignId:c.id,date:'2026-09-07',spend:20,customers:0,visits:20,conversations:0,bookings:0,trials:0,ours:0,revenue:0};
test('missing records remain unknown and scheduled end is not live status',()=>{
 const s=ownerSummary(c,[],new Date('2026-09-08T19:52:00Z'));
 assert.equal(s.hasRecords,false);assert.equal(s.acquisitionCost,null);assert.equal(s.ended,true);
 assert.match(s.action,/Verify that Meta/);
 assert.equal(ownerSummary(c,[],new Date('2026-09-08T19:51:59Z')).ended,false);
});
test('future records and other companies are excluded; spend cap outranks follow-up',()=>{
 const s=ownerSummary(c,[{...row,spend:40,conversations:1},{...row,campaignId:'other',spend:100},{...row,date:'2026-09-10',spend:100}],new Date('2026-09-08T15:00:00Z'));
 assert.equal(s.spend,40);assert.match(s.action,/reached the cap/);assert.equal(s.lastDate,'2026-09-07');
});
test('acquisition cost uses recorded customers and export omits private evidence',()=>{
 const r=ownerReport([c],[{...row,customers:2,evidence:'private CRM note'}],new Date('2026-09-08T15:00:00Z'));
 assert.equal(r.companies[0].acquisitionCost,10);assert.ok(!JSON.stringify(r).includes('private CRM note'));
});
test('overview renders all companies with unknown metrics and actionable buttons',()=>{
 const html=ownerHTML([c],[],s=>String(s),new Date('2026-09-08T15:00:00Z'));
 assert.match(html,/No results recorded/);assert.match(html,/data-owner-company="ly-first-school"/);assert.match(html,/Live connection: none/);
});
