import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyRecord,validateRecord,validateBackup,trackingUrl,report} from '../public/sprint/segment-core.js';
const data=JSON.parse(readFileSync(new URL('../public/sprint/segments-v01.json',import.meta.url),'utf8'));
test('seven draft segments cover five companies without invented results',()=>{
 assert.equal(data.segments.length,7);assert.equal(new Set(data.segments.map(s=>s.company)).size,5);
 assert.equal(new Set(data.segments.map(s=>s.id)).size,7);
 for(const s of data.segments){assert.ok(s.proofNeeded);assert.ok(s.hypothesis);assert.equal(s.reasons.length,4);assert.ok(s.primary);assert.ok(s.downstream);assert.equal(new URL(s.destination).protocol,'https:');}
});
test('tracking preserves query parameters and distinguishes arms on the correct company domain',()=>{
 const s=data.segments[0];const u=new URL(trackingUrl(s,'https://traincloudforest.com/parents?ref=visit','variant'));
 assert.equal(u.searchParams.get('ref'),'visit');assert.equal(u.searchParams.get('utm_content'),'variant');assert.equal(u.searchParams.get('utm_campaign'),'segment_cf-parent');
 for(const page of ['http://traincloudforest.com/','https://traincloudforest.com.evil.test/','https://user:pass@traincloudforest.com/','javascript:alert(1)'])assert.throws(()=>trackingUrl(s,page,'variant'));
 assert.throws(()=>trackingUrl(s,s.destination,'winner'));
});
test('backups reject invalid counts and preserve evidence',()=>{
 const valid={...emptyRecord(),evidence:'Anonymized CRM reference, September 5',controlVisits:8,controlConversions:2,controlSpend:10};
 assert.deepEqual(validateBackup({version:1,records:{'cf-parent':valid}},['cf-parent']).records['cf-parent'],valid);
 for(const patch of [{controlVisits:1.2},{controlSpend:-1},{controlVisits:NaN},{variantConversions:1},{notes:4},{page:'javascript:bad'}])assert.throws(()=>validateRecord({...valid,...patch}));
 assert.throws(()=>validateBackup({version:1,records:{unknown:valid}},['cf-parent']));
 assert.match(report(valid),/cost per customer not available/);assert.match(report(valid),/cannot establish a reliable winner/);
 assert.equal(valid.controlConversions,2);
});
