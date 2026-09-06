import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
const load = async path => import('data:text/javascript;base64,'+Buffer.from(ts.transpile(read(path),{module:ts.ModuleKind.ESNext})).toString('base64'));
test('public briefings and embedded fallback match the corrected source',async()=>{
 const {BRAIN_CORPUS,PROJECT_FOR}=await load('src/lib/brain.ts');
 const data=JSON.parse(read('docs/brain.json'));
 const embedded=JSON.parse(read('docs/index.html').split('const EMBEDDED = ')[1].split('\n};')[0]+'\n}');
 assert.deepEqual(embedded,data);
 for(const row of data.notes){const source=BRAIN_CORPUS.find(n=>n.id===row.id);assert.equal(row.body,source.body);assert.equal(row.project,source.project);}
 assert.equal(PROJECT_FOR.dojozeus,'lyceum');
 for(const note of data.notes.filter(n=>n.businessId==='dojozeus')) assert.equal(note.project,'lyceum');
 const pricing=data.notes.find(n=>n.id==='sb-dz-2');
 assert.match(pricing.body,/\$99\/mo or \$990\/yr, first 20/);assert.match(pricing.body,/\$169\/mo or \$1,690\/yr/);assert.match(pricing.body,/trial requires a card/);
 assert.equal(read('public/llms.txt'),read('docs/llms.txt'));
 for(const path of ['docs/brain.json','docs/llms.txt','docs/GEMINI.md','README.md','src/lib/seed.ts']) assert.doesNotMatch(read(path),/59\.99|Founding 35|first 35|not pay until someone enrolls/);
 for(const path of ['docs/llms.txt','public/llms.txt','docs/GEMINI.md','public/sprint/app.js','public/sprint/index.html']){
  assert.match(read(path),/\$120/);
  assert.doesNotMatch(read(path),/Lyceum \$20|DojoZeus \$25|\$15 unallocated|The \$100 test/);
 }
});
test('saved seed corrections preserve user text, workflow and results',async()=>{
 const {reconcileOffers}=await load('src/lib/offer-migration.ts');
 const old='DojoZeus replaces billing, website, email, courses, and community. Founding $59.99/mo, then $149. Zeus flags students who quietly quit.';
 const state={search:[{id:'a-dz-1',answer:old,status:'published',clicks:12}],signals:[{id:'s-dz-2',draft:'My edited offer',status:'approved'}],brainNotes:[{body:'Historical note'}]};
 const next=reconcileOffers(state);
 assert.match(next.search[0].answer,/\$99\/mo, then \$169/);assert.equal(next.search[0].status,'published');assert.equal(next.search[0].clicks,12);
 assert.deepEqual(next.signals,state.signals);assert.deepEqual(next.brainNotes,state.brainNotes);assert.equal(state.search[0].answer,old);assert.deepEqual(reconcileOffers(next),next);
});

