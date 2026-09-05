import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const fresh=(p,s)=>{if(existsSync(p))throw Error(`Already exists: ${p}`);writeFileSync(p,s);};
const json=(p,v)=>fresh(p,JSON.stringify(v,null,2)+'\n');
const status='Published to Meta with Facebook and Instagram placements under @cloudforestchinwoo. Delivery, spend, and customer results require verification in Meta.';
const note='Mike authorized $40 total for Lyceum and $40 total for DojoZeus for this sprint. Together with Cloud Forest, the authorized cap is $120. This replaces the earlier $100 limit. Each cap includes existing spend. No recurring renewal is authorized.';
const data=JSON.parse(read('public/sprint/campaigns-v03.json'));
data.version=4;data.budget=120;data.unallocatedUSD=0;
for(const c of data.campaigns.filter(c=>['dz-owner','ly-first-school'].includes(c.id))){
 c.budget=40;c.publicationStatus=status;c.instagram='https://www.instagram.com/cloudforestchinwoo/';
 c.blocker='The $40 lifetime pilot includes Facebook and Instagram. It ends September 8 at 3:52 PM Eastern. Review verified signup and customer results before increasing spend.';
}
json('public/sprint/campaigns-v04.json',data);
const ledger=JSON.parse(read('public/sprint/allocations-v02.json'));
ledger.totalLimitUSD=120;ledger.allocatedUSD=120;ledger.unallocatedUSD=0;ledger.note=note;
for(const a of ledger.allocations.filter(a=>a.company!=='Cloud Forest')){a.lifetimeCapUSD=40;a.status=status;a.instagram='https://www.instagram.com/cloudforestchinwoo/';a.platforms=['Facebook','Instagram'];}
ledger.attributionNote='Existing campaign URLs retain utm_source=facebook across Meta placements. Use the Meta platform breakdown to distinguish Instagram delivery.';
json('public/sprint/allocations-v03.json',ledger);
const edit=(p,pairs)=>{let s=read(p);for(const [a,b] of pairs){if(!s.includes(a))throw Error(`Missing ${a} in ${p}`);s=s.replaceAll(a,b);}writeFileSync(p,s);};
edit('public/sprint/core.js', [['MAX_BUDGET = 100','MAX_BUDGET = 120'],['The $100 spend limit','The $120 spend limit']]);
edit('public/sprint/app.js',[
 ['KEY, METRICS','KEY, MAX_BUDGET, METRICS'],['$20 Lyceum · $25 DojoZeus approved caps · $15 unallocated','$40 Lyceum · $40 DojoZeus approved caps · $0 unallocated'],
 ['Math.min(100,spent)','Math.min(100,spent / MAX_BUDGET * 100)'],['spent >= 100','spent >= MAX_BUDGET'],
 ['$100 total limit. $85 allocated and $15 unallocated.','$120 total limit. $40 each for Cloud Forest, Lyceum, and DojoZeus.'],
 ['allocations-v02.json','allocations-v03.json'],['campaigns-v03.json','campaigns-v04.json'],['totalSpend(state.records)>=100','totalSpend(state.records)>=MAX_BUDGET'],['the $100 limit','the $120 limit']
]);
edit('public/sprint/index.html',[['$100','$120']]);
edit('public/sprint/segments.js',[['Cloud Forest $40, Lyceum $20, DojoZeus $25. The remaining $15 is unallocated.','Cloud Forest $40, Lyceum $40, DojoZeus $40. The total cap is $120 with no recurring renewal.']]);
edit('scripts/sprint.test.mjs',[
 ['campaigns-v03.json','campaigns-v04.json'],['+data.unallocatedUSD,100','+data.unallocatedUSD,120'],['campaigns[1].budget,25','campaigns[1].budget,40'],['campaigns[2].budget,20','campaigns[2].budget,40'],['data.unallocatedUSD,15','data.unallocatedUSD,0'],["proof:'Meta'},'live',100","proof:'Meta'},'live',120"]
]);
for(const p of ['public/llms.txt','docs/llms.txt','docs/GEMINI.md'])writeFileSync(p,read(p)+'\n## September 5 Instagram and budget update\n'+note+'\n'+status+'\nCurrent ledger: https://mike-cloudforest.github.io/sprint/allocations-v03.json\nThe card-policy screen remains a paused draft, separate from the one-time platform caps.\n');
fresh('instagram-pilot-status-v01.txt',note+'\n\n'+status+'\n\n'+data.campaigns[1].blocker+'\n\n'+ledger.attributionNote+'\n');
