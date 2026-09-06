import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const write=(p,s)=>writeFileSync(new URL(p,root),s);
const ledger=JSON.parse(read('public/sprint/allocations-v02.json'));
const pages={Lyceum:'https://www.facebook.com/profile.php?id=61594221926196',DojoZeus:'https://www.facebook.com/profile.php?id=61594283693591'};
for(const a of ledger.allocations) if(pages[a.company]) Object.assign(a,{page:pages[a.company],status:'Published; Meta Processing verified after reload on September 5. Delivery and spend not yet verified.',endAt:'2026-09-08T15:52:00-04:00'});
write('public/sprint/allocations-v02.json',JSON.stringify(ledger,null,2)+'\n');
const data=JSON.parse(read('public/sprint/campaigns-v03.json'));
for(const c of data.campaigns){
 if(pages[c.company]){
  c.page=pages[c.company];
  c.publicationStatus='Published; Meta Processing verified September 5. Delivery and customer results are not yet verified.';
  c.blocker=`The $${c.budget} lifetime pilot is published and Meta showed Processing after reload. Ends September 8 at 3:52 PM Eastern. Verify delivery and signup results before increasing spend.`;
 }
 if(c.mark==='CF') c.publicationStatus='Previously verified Active with a $40 lifetime cap. Current delivery and spend have not been rechecked.';
 if(c.mark==='DZ') c.assets.find(a=>a.id==='paid-office').utmCampaign='growth_20260905_dz-school-owner';
}
write('public/sprint/campaigns-v03.json',JSON.stringify(data,null,2)+'\n');
let app=read('public/sprint/app.js');
app=app.replace("c.id==='cf-free-visit'?'Cloud Forest was verified active with a $40 lifetime cap. See the September 5 launch log for the published configuration.':'Authorized. Brand Page and ad setup are in progress; no launch has been verified.'","esc(c.publicationStatus)");
app=app.replace('<p>${esc(c.conversion)}</p>${c.assets.filter','${c.page?`<p><a href="${esc(c.page)}" target="_blank" rel="noopener">Open ${esc(c.company)} Facebook Page</a></p>`:\'\'}<p>${esc(c.conversion)}</p>${c.assets.filter');
app=app.replace('Current authorization record','Current authorization and publication record');
write('public/sprint/app.js',app);
let core=read('public/sprint/core.js').replace('`growth_20260905_${campaign.id}`','asset.utmCampaign ?? `growth_20260905_${campaign.id}`');
write('public/sprint/core.js',core);
const note='\nBrand Pages created September 5: Lyceum https://www.facebook.com/profile.php?id=61594221926196 ; DojoZeus https://www.facebook.com/profile.php?id=61594283693591 . Existing Lyceum and DojoZeus campaigns were edited in place to $40 lifetime each, not duplicated. After reload on September 5 both showed Active, $40.00 Lifetime, Not shared, with Facebook and Instagram placements. Instagram identity is @cloudforestchinwoo only. Do not create brand Instagram accounts. End dates last verified September 5: Cloud Forest September 7 at 2:14 PM Eastern; Lyceum and DojoZeus September 8 at 3:52 PM Eastern. Current customer results, spend, and Instagram delivery remain unverified. DojoZeus paid-office uses utm_campaign=growth_20260905_dz-school-owner; map it to dz-owner in reports. Use allocations-v02.json for current authorization.\n';
for(const p of ['docs/llms.txt','public/llms.txt','docs/GEMINI.md']) if(!read(p).includes('edited in place to $40 lifetime each'))write(p,read(p)+note);
const prose='brand-pilot-status-v01.txt';
if(existsSync(new URL(prose,root)))throw new Error('Version already exists');
write(prose,data.campaigns.filter(c=>pages[c.company]).map(c=>c.blocker+'\n'+c.publicationStatus).join('\n')+note);
