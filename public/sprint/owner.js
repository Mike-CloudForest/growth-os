import { totals } from './core.js';

// Historical schedules are evidence, never a live delivery status.
export const PILOT_ENDS = {
  'cf-free-visit': '2026-09-07T14:14:00-04:00',
  'ly-first-school': '2026-09-08T15:52:00-04:00',
  'dz-owner': '2026-09-08T15:52:00-04:00',
};
export function ownerSummary(campaign, records, now = new Date()) {
  const rows = records.filter(r => r.campaignId === campaign.id && r.date <= now.toLocaleDateString('en-CA', {timeZone:'America/New_York'}));
  const t = totals(rows);
  const lastDate = rows.map(r => r.date).sort().at(-1) ?? null;
  const ended = Boolean(PILOT_ENDS[campaign.id] && now >= new Date(PILOT_ENDS[campaign.id]));
  let action = 'Add the latest Meta report and signup results.';
  if (!campaign.budget) action = 'Use organic content. No paid budget is allocated.';
  else if (t.spend >= campaign.budget) action = 'Recorded spend has reached the cap. Check Meta and pause any delivery that is still running.';
  else if (ended) action = 'The scheduled end has passed. Verify that Meta stopped delivery and collect the final results.';
  else if (rows.length && (t.conversations || t.bookings || t.trials) && !t.customers) action = 'Follow up on recorded inquiries and trials. Check which became paid customers.';
  else if (t.customers) action = 'Verify customer attribution and acquisition cost before deciding on another campaign.';
  return { ...t, hasRecords:rows.length > 0, lastDate, ended, action,
    acquisitionCost:t.customers > 0 ? t.spend / t.customers : null };
}

export function ownerHTML(campaigns, records, escape, now = new Date()) {
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
  return `<h2>What needs my attention?</h2>
  <p>Growth OS helps you choose an offer, prepare marketing, and compare the results for your five companies. Your websites collect signups. Meta runs the paid ads. This desk keeps the plan and the results you enter.</p>
  <div class="actions"><a class="button" href="https://adsmanager.facebook.com/" target="_blank" rel="noopener">Check live ads in Meta</a><button data-view="results">Enter results</button><button data-view="today">See daily actions</button><button data-action="owner-report">Download AI review brief</button></div>
  <p class="truth-note">Live connection: none. Campaign launch checks were recorded September 5. A past Active status does not confirm delivery today. Results below come only from this browser. Missing records mean unknown.</p>
  <div class="campaign-grid">${campaigns.map(c => {
    const s = ownerSummary(c,records,now);
    return `<article class="card"><span class="eyebrow">${escape(c.company)}</span><h3>${escape(s.action)}</h3>
      <p>Approved total cap: <b>${money(c.budget)}</b>. Automatic renewal is off.</p>
      ${PILOT_ENDS[c.id]?`<p>Scheduled end: ${new Date(PILOT_ENDS[c.id]).toLocaleString('en-US',{timeZone:'America/New_York'})} Eastern. ${s.ended?'Scheduled end passed; verify in Meta.':'Verify the saved schedule in Meta.'}</p>`:''}
      <p>${s.hasRecords?`Recorded through ${escape(s.lastDate)}: ${money(s.spend)} spent, ${s.visits} visits, ${s.customers} paid customers.`:'No results recorded for this company.'}</p>
      <p>Recorded cost per customer: ${s.acquisitionCost===null?'not established':money(s.acquisitionCost)}. Revenue: ${s.hasRecords?money(s.revenue):'unknown'}.</p>
      <button data-owner-company="${escape(c.id)}">Record ${escape(c.company)} results</button></article>`;
  }).join('')}</div>
  <details class="card" style="margin-top:20px"><summary>What does each part do?</summary>
  <dl><dt>Campaigns</dt><dd>Offers, draft posts, tracked links, and launch checks for each business.</dd>
  <dt>Daily actions</dt><dd>A checklist for publishing and following up. Checking a box does not perform the action.</dd>
  <dt>Results & follow-up</dt><dd>Enter new daily counts from Meta and your customer records. Save an evidence reference with each entry.</dd>
  <dt>Paid test</dt><dd>The approved campaign caps and historical publication notes.</dd>
  <dt>Card & spending rules</dt><dd>A proposed policy. Automatic charging is off. Billing stays in the ad provider.</dd>
  <dt>Buyer segments</dt><dd>Draft pages and messages for different types of buyers. Drafts still need validation and publication.</dd>
  <dt>SuperBrain</dt><dd>Shared reference notes that help another AI continue the work. It does not grant account access or run campaigns.</dd></dl></details>
  <article class="card" style="margin-top:20px"><h3>Your daily review</h3><ol>
  <li>Open Meta and use this sprint's date range, September 5 through 11. Separate Facebook and Instagram with the platform breakdown.</li>
  <li>Check new signups and purchases in each company's records. A click is not a customer.</li>
  <li>Enter only new daily counts here, with the report reference. Export a backup before changing devices.</li>
  <li>Give the AI review brief to your assistant. Ask it to verify missing evidence before proposing changes.</li></ol>
  <p>School offer update from SuperBrain, September 7: Tiny Tigers is paused. Verify the current schedule before promoting a class.</p></article>`;
}

export function ownerReport(campaigns, records, now = new Date()) {
  return {kind:'growth-os-owner-review',generatedAt:now.toISOString(),source:'Manual browser records; not live provider analytics',
    instructions:'Verify Meta spend, platform delivery, and customer records. Preserve existing lifetime caps and end dates. No renewal or additional spending is authorized by this export. Report missing evidence before recommending changes.',
    companies:campaigns.map(c=>({company:c.company,campaignId:c.id,approvedCap:c.budget,scheduledEnd:PILOT_ENDS[c.id]??null,...ownerSummary(c,records,now)})),
    references:{desk:'https://mike-cloudforest.github.io/sprint/',brainSearch:'Growth OS marketing desk AI operator runbook'}};
}
