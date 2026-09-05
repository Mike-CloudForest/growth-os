import { KEY, METRICS, STAGES, initialState, taggedUrl, totalSpend, totals, recommendation, validateState, validateRecord, transition } from './core.js';
import { DEFAULT_POLICY, validatePolicy, evaluateSpend } from './budget.js';
let policy = { ...DEFAULT_POLICY };
const POLICY_KEY = 'growth-os-budget-draft-v1';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(n);
let data, state = initialState(), selected = 'all', view = 'campaigns', storageReady = true;
const notice = message => { $('#notice').textContent = message; };
function save() {
  if (!storageReady) throw new Error('Storage could not be loaded. Export the current work before restoring a valid backup.');
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { throw new Error('Browser storage is unavailable or full. Export a backup now; these changes are only in memory.'); }
}
function rows() { return data.campaigns.filter(c => selected === 'all' || c.id === selected); }
function status(c) { return state.campaigns[c.id] ?? {stage:'draft',checked:false,proof:''}; }
function records() { return state.records.filter(r => selected === 'all' || r.campaignId === selected); }
function renderMetrics() {
  const t = totals(records());
  $('#metrics').innerHTML = [['Real visits',t.visits],['Conversations',t.conversations],['Bookings / trials',`${t.bookings} / ${t.trials}`],['Paid customers',t.customers],['Recorded revenue',money(t.revenue)]].map(([label,value]) => `<div class="metric"><span>${label}</span><strong>${records().length ? value : '—'}</strong></div>`).join('');
  const spent = totalSpend(state.records);
  $('#budget-status').textContent = `${money(spent)} recorded in this browser · $40 approved pilot cap · $60 on hold. Actual delivery spend requires provider verification.`;
  $('#budget-bar').style.width = `${Math.min(100,spent)}%`;
  $('#budget-bar').style.background = spent >= 100 ? 'var(--amber)' : 'var(--lime)';
}
function renderCampaigns() {
  $('#content').innerHTML = `<div class="campaign-grid">${rows().map(c => {
    const s = status(c);
    return `<article class="card"><div class="card-head"><span class="mark">${esc(c.mark)} / PRIORITY ${c.priority}</span><span class="pill">${esc(s.stage)}</span></div><h2>${esc(c.company)}</h2><p>${esc(c.offer)}</p><p><b>Buyer:</b> ${esc(c.audience)}</p><p class="goal">${esc(c.goal)}</p><div class="warning">${esc(c.blocker)}</div><div class="actions"><a class="button" href="${esc(c.destination)}" target="_blank" rel="noopener">Check destination ↗</a><button data-action="drafts" data-id="${c.id}" class="primary">${c.assets.length} campaign drafts</button></div><details id="launch-${c.id}"><summary>Launch checks & status</summary><label class="check"><input type="checkbox" data-check="${c.id}" ${s.checked?'checked':''}>I verified the offer, destination, confirmation, available class or demo, and follow-up owner.</label><label for="proof-${c.id}">Published post URL or ad reference (no private contact data)</label><input id="proof-${c.id}" data-proof="${c.id}" value="${esc(s.proof)}" maxlength="500"><label for="stage-${c.id}">Campaign status</label><select id="stage-${c.id}" data-stage="${c.id}">${STAGES.map(v=>`<option ${s.stage===v?'selected':''}>${v}</option>`).join('')}</select><p>Approval here records your review. Publish in the channel account, then add its reference and mark live.</p></details><details id="drafts-${c.id}"><summary>Drafts, links & follow-up</summary>${c.assets.map(a=>{ const key=`${c.id}-${a.id}`;return `<div class="asset"><span class="eyebrow">${esc(a.channel)} / ${esc(a.medium)}</span><h3>${esc(a.title)}</h3><label for="copy-${key}">Editable draft</label><textarea id="copy-${key}" data-draft="${key}" maxlength="5000">${esc(state.drafts[key]??a.body)}</textarea><div class="url">${esc(taggedUrl(c,a))}</div><div class="actions"><button data-action="copy" data-id="${c.id}" data-asset="${a.id}">Copy draft + link</button><button data-action="link" data-id="${c.id}" data-asset="${a.id}">Copy link</button></div></div>`}).join('')}<div class="asset"><h3>Follow-up draft</h3><p>${esc(c.followup)}</p><p>Replace placeholders with verified details before sending. Contact only people whose reply or permission supports this follow-up.</p></div></details></article>`;
  }).join('')}</div>`;
}
function renderToday() {
  $('#content').innerHTML = `<h2 class="section-title">The work for each day</h2><p class="truth-note">Dates are September 5 through 11. Confirm the Labor Day class schedule before promising a Monday visit.</p>` + Array.from({length:7},(_,day)=>{ const items=rows().flatMap(c=>c.tasks.map((t,i)=>({...t,c,i})).filter(t=>t.day===day));const date=new Date(Date.UTC(2026,8,5+day));return `<h3 class="day">${date.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric',timeZone:'UTC'})}</h3>${items.map(t=>`<div class="task"><label class="check"><input type="checkbox" data-task="${t.c.id}-${t.i}" ${state.tasks[`${t.c.id}-${t.i}`]?'checked':''}><span>${esc(t.text)}</span></label><small>${esc(t.c.company)}</small></div>`).join('')||'<p class="empty">Use this day for replies and follow-up.</p>'}`;}).join('');
}
function renderResults() {
  const t=totals(records());
  $('#content').innerHTML=`<h2 class="section-title">Record the source, then the result</h2><p class="truth-note">${esc(recommendation(records()))} Owner/test visits recorded separately: ${t.ours}. ${t.customers?`Cost per paid customer: ${money(t.spend/t.customers)}.`:''}</p><div class="split" style="margin-top:22px"><form id="result-form" class="card"><h3>Add a daily increment</h3><p>Enter new counts since your previous entry, not cumulative totals. Count each customer once. The source report should exclude owner/test traffic.</p><div class="form-grid"><div class="wide"><label for="result-company">Company</label><select id="result-company" name="campaignId">${rows().map(c=>`<option value="${c.id}">${esc(c.company)}</option>`).join('')}</select></div><div class="wide"><label for="result-date">Date</label><input id="result-date" name="date" type="date" min="2026-09-05" max="2026-09-11" value="2026-09-05" required></div>${METRICS.map(k=>`<div><label for="result-${k}">${{visits:'Real visits',ours:'Our/test visits',customers:'Paid customers',revenue:'Revenue ($)',spend:'Spend ($)'}[k]??k}</label><input id="result-${k}" name="${k}" type="number" min="0" max="100000000" step="${['spend','revenue'].includes(k)?'.01':'1'}" value="0" required></div>`).join('')}<div class="wide"><label for="evidence">Evidence reference</label><input id="evidence" name="evidence" placeholder="CRM daily report / channel export / invoice reference" minlength="5" maxlength="500" required><p>Use report names or internal references. Keep customer names, email addresses, and payment details in the CRM.</p></div></div><button class="primary" type="submit">Save result</button></form><div class="card"><h3>Evidence log</h3>${records().length?records().slice().reverse().map(r=>`<div class="result-row"><b>${esc(data.campaigns.find(c=>c.id===r.campaignId).company)} · ${esc(r.date)}</b><p>${r.visits} real visits · ${r.conversations} conversations · ${r.bookings} bookings · ${r.trials} trials · ${r.customers} paid</p><p>${money(r.spend)} spent · ${money(r.revenue)} revenue</p><small>${esc(r.evidence)}</small></div>`).join(''):'<p class="empty">No results have been entered. Nothing here is connected to live analytics yet.</p>'}</div></div>`;
}
function renderPaid() {
  const c=data.campaigns[0],a=c.assets.find(a=>a.medium==='paid_social');
  $('#content').innerHTML=`<div class="split"><article class="card plan"><span class="eyebrow">ONE CAMPAIGN / $100 MAXIMUM</span><h2>Cloud Forest free visit</h2><p>Proposed Meta campaign. Budget authorized; this campaign has not been created or launched in Meta.</p><ol><li><b>Destination:</b> the free visit form, with the tagged link below. Verify confirmation delivery and the school's follow-up process.</li><li><b>Audience:</b> adults 25 to 60 within 10 miles of 719 W Gate City Blvd, Greensboro. Use local geographic targeting; do not target children.</li><li><b>Creative:</b> the approved parent copy, with a real training-hall image or the existing Cloud Forest film. Check the actual asset before upload.</li><li><b>First allocation:</b> $40 lifetime budget over two days. Optimize for landing-page views if a verified booking conversion event is unavailable.</li><li><b>Remaining allocation:</b> hold $60. Release only after at least one attributable qualified conversation or booking and a functioning confirmation path.</li><li><b>Hard stop:</b> September 11. Set the platform's lifetime budget and end date. Include any fees in the $100 total; do not use an uncapped daily budget.</li><li><b>Review:</b> stop if $40 produces no qualified conversation or booking, or immediately if the form fails. A booked visit still needs attendance and enrollment follow-up.</li></ol></article><article class="card"><span class="eyebrow">DRAFT FOR APPROVAL</span><h2>${esc(a.title)}</h2><p style="white-space:pre-line">${esc(state.drafts[`${c.id}-${a.id}`]??a.body)}</p><div class="url">${esc(taggedUrl(c,a))}</div><div class="actions"><button data-action="copy" data-id="${c.id}" data-asset="${a.id}" class="primary">Copy ad + link</button><a class="button" href="https://adsmanager.facebook.com/" target="_blank" rel="noopener">Open Meta Ads Manager ↗</a></div><div class="warning">Launch needs the correct school page and ad account, the reviewed creative, and the completed booking-path check. The $100 authorization is not a claim that money has been spent.</div><h3>After a booking</h3><p>Confirm the chosen class by the next business day. Check whether the visitor attended, then record any paid enrollment. Use the school CRM for these conversations.</p></article></div>`;
}
function render() {
  $('#companies').innerHTML=[{id:'all',company:'All companies'},...data.campaigns].map(c=>`<button data-company="${c.id}" class="${c.id===selected?'active':''}" aria-pressed="${c.id===selected}">${esc(c.company)}</button>`).join('');
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===view)));
  renderMetrics();
  ({campaigns:renderCampaigns,today:renderToday,results:renderResults,paid:renderPaid,budget:renderBudget})[view]();
}
function renderBudget() {
  $('#content').innerHTML=`<div class="truth-note"><b>Autonomous spending is OFF.</b> These are draft rules saved in this browser. A private spending service and vendor connection must enforce them before activation. Your current $100 total authorization remains unchanged.</div><div class="split" style="margin-top:22px"><form id="budget-form" class="card"><span class="eyebrow">PROPOSED WEEKLY POLICY</span><h2>Your limits</h2><p>USD. Weeks run Monday through Sunday in New York time. Unused budget does not roll over.</p><div class="form-grid">${[['weeklyCents','Weekly cap ($)'],['dailyCents','Daily cap ($)'],['transactionCents','Per-purchase cap ($)']].map(([k,label])=>`<div class="wide"><label for="budget-${k}">${label}</label><input id="budget-${k}" name="${k}" type="number" min="0" max="10000" step=".01" value="${policy[k]/100}" required></div>`).join('')}</div><label>Allowed vendors</label>${[['meta','Meta ads'],['google','Google ads']].map(([id,label])=>`<label class="check"><input type="checkbox" name="vendor" value="${id}" ${policy.vendors.includes(id)?'checked':''}>${label}</label>`).join('')}<label>Allowed companies</label>${data.campaigns.map(c=>{const id={CF:'cloudforest',DZ:'dojozeus',LY:'lyceum',RB:'rigboss',MC:'mechcorrect'}[c.mark];return `<label class="check"><input type="checkbox" name="company" value="${id}" ${policy.companies.includes(id)?'checked':''}>${esc(c.company)}</label>`}).join('')}<label class="check"><input type="checkbox" name="requireApproval" ${policy.requireApproval?'checked':''}>Require my approval for each purchase</label><label class="check"><input type="checkbox" name="recurring" ${policy.recurring?'checked':''}>Propose repeating this budget weekly</label><p>Changing these options creates a proposal. It does not authorize spending or enable a recurring charge.</p><div class="actions"><button type="submit" class="primary">Save draft rules</button><button type="button" data-action="policy-export">Export rules</button><button type="button" data-action="pause-draft">Pause draft policy</button></div></form><div><article class="card"><span class="eyebrow">CARD STAYS WITH THE PROVIDER</span><h2>Connect billing safely</h2><p>Enter your card directly on Meta or Google's secure billing page. Growth OS should receive an approved account connection, never your card number or security code.</p><div class="actions"><a class="button" href="https://adsmanager.facebook.com/" target="_blank" rel="noopener">Meta account & billing ↗</a><a class="button" href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads billing ↗</a></div><div class="warning">No provider is connected to this desk. The buttons open the provider; they do not save a card here. A saved Stripe payment method cannot be used as a general-purpose spending card.</div><h3>Rules for live activation</h3><ul><li>Approved companies and vendors only.</li><li>Subscriptions need separate approval.</li><li>Every campaign needs approved content.</li><li>Reserve money before each purchase.</li><li>Keep uncertain charges reserved until reconciled.</li><li>Agents cannot raise limits or approve their own purchases.</li></ul></article><form id="simulate-form" class="card" style="margin-top:20px"><span class="eyebrow">DRY RUN / NO PAYMENT</span><h3>Test a proposed purchase</h3><label for="simulate-amount">Meta / Cloud Forest amount ($)</label><input id="simulate-amount" name="amount" type="number" min=".01" max="10000" step=".01" value="20" required><label class="check"><input type="checkbox" name="approved">Assume purchase approval for this simulation</label><p>Tests the draft with spending unpaused and no prior reservations. Live evaluation must use the actual server ledger.</p><button type="submit">Check the rules</button><p id="simulation-result" role="status"></p></form></div></div>`;
}
function download(value,name) {
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener('click',async event=>{
  const el=event.target.closest('button'); if(!el||!data)return;
  try {
    if(el.dataset.company){selected=el.dataset.company;render();}
    if(el.dataset.view){view=el.dataset.view;render();}
    if(el.id==='export'){download(state,`growth-os-backup-${Date.now()}.json`);notice('Backup downloaded. Keep it private; it contains your local work.');}
    if(el.dataset.action==='policy-export'){download({kind:'draft-only',policy},`growth-os-spending-rules-${Date.now()}.json`);notice('Draft rules exported. No spending was activated.');}
    if(el.dataset.action==='pause-draft'){policy={...policy,paused:true};localStorage.setItem(POLICY_KEY,JSON.stringify(policy));notice('Draft policy paused. This does not stop ads already running in a provider account.');}
    if(el.dataset.action==='drafts'){$(`#drafts-${el.dataset.id}`).open=true;$(`#drafts-${el.dataset.id}`).scrollIntoView({behavior:'smooth',block:'start'});}
    if(['copy','link'].includes(el.dataset.action)){
      const c=data.campaigns.find(c=>c.id===el.dataset.id),a=c.assets.find(a=>a.id===el.dataset.asset);
      await navigator.clipboard.writeText(el.dataset.action==='link'?taggedUrl(c,a):`${state.drafts[`${c.id}-${a.id}`]??a.body}\n${taggedUrl(c,a)}`);
      notice('Copied. Review the text and publish from the correct channel account.');
    }
  }catch(error){notice(error.message);}
});
document.addEventListener('change',async event=>{
  const el=event.target;
  try{
    if(el.dataset.task){state.tasks[el.dataset.task]=el.checked;save();}
    if(el.dataset.draft){state.drafts[el.dataset.draft]=el.value;const c=data.campaigns.find(c=>c.assets.some(a=>`${c.id}-${a.id}`===el.dataset.draft));state.campaigns[c.id]={...status(c),stage:'draft'};save();notice('Draft saved. Campaign returned to draft because its copy changed.');}
    if(el.dataset.check){const c=data.campaigns.find(c=>c.id===el.dataset.check);state.campaigns[c.id]={...status(c),checked:el.checked,stage:'draft'};save();notice('Launch check updated. Campaign returned to draft for review.');}
    if(el.dataset.proof){const c=data.campaigns.find(c=>c.id===el.dataset.proof);const current=status(c);state.campaigns[c.id]={...current,proof:el.value,stage:el.value.trim()?current.stage:'draft'};save();}
    if(el.dataset.stage){const c=data.campaigns.find(c=>c.id===el.dataset.stage);state.campaigns[c.id]=transition(status(c),el.value,totalSpend(state.records),c.budget>0);save();render();notice('Status saved locally. No post or ad was sent.');}
    if(el.id==='import'&&el.files[0]){
      if(el.files[0].size>2000000)throw new Error('Backup is too large.');
      const clean=validateState(JSON.parse(await el.files[0].text()),data.campaigns);
      download(state,`growth-os-before-restore-${Date.now()}.json`);
      state=clean;storageReady=true;save();render();notice('Backup restored. The previous local state was downloaded first.');
    }
  }catch(error){notice(error.message);if(el.dataset.stage)el.value=status(data.campaigns.find(c=>c.id===el.dataset.stage)).stage;}
});
document.addEventListener('submit',event=>{
  if(event.target.id==='budget-form'){
    event.preventDefault();try{const f=new FormData(event.target);const next={...DEFAULT_POLICY,vendors:f.getAll('vendor'),companies:f.getAll('company'),requireApproval:f.has('requireApproval'),recurring:f.has('recurring'),paused:true};for(const k of ['weeklyCents','dailyCents','transactionCents'])next[k]=Math.round(Number(f.get(k))*100);policy=validatePolicy(next);localStorage.setItem(POLICY_KEY,JSON.stringify(policy));notice('Draft rules saved. Autonomous spending remains off; no recurring budget has been activated.');}catch(error){notice(error.message);}return;
  }
  if(event.target.id==='simulate-form'){
    event.preventDefault();try{const f=new FormData(event.target);const verdict=evaluateSpend({...policy,paused:false},{cents:Math.round(Number(f.get('amount'))*100),currency:'USD',vendor:'meta',company:'cloudforest',subscription:false,campaignApproved:true,purchaseApproved:f.has('approved')},[]);$('#simulation-result').textContent=`${verdict.allowed?'PASS':'BLOCKED'}: ${verdict.reason}`;}catch(error){notice(error.message);}return;
  }
  if(event.target.id!=='result-form')return;event.preventDefault();
  try{
    const form=new FormData(event.target),r={id:crypto.randomUUID(),campaignId:form.get('campaignId'),date:form.get('date'),evidence:form.get('evidence').trim()};
    METRICS.forEach(k=>r[k]=Number(form.get(k)));validateRecord(r,data.campaigns.map(c=>c.id));
    state.records.push(r);save();render();notice(totalSpend(state.records)>=100?'Result saved. Spend has reached the $100 limit. Pause paid delivery in the ad account.':'Result saved with its evidence reference.');
  }catch(error){notice(error.message);}
});
try {
  const response=await fetch('./campaigns-v02.json');if(!response.ok)throw new Error('Campaign data could not be loaded.');data=await response.json();
  try{const draft=localStorage.getItem(POLICY_KEY);if(draft)policy=validatePolicy(JSON.parse(draft));}catch{notice('The saved spending draft could not be read. Defaults loaded with spending paused.');}
  try{const stored=localStorage.getItem(KEY);if(stored)state=validateState(JSON.parse(stored),data.campaigns);}
  catch{storageReady=false;notice('Saved data could not be read. It has been preserved in browser storage. Restore a valid backup before saving new work.');}
  render();
}catch(error){notice(error.message);}
