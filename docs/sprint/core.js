export const KEY = 'growth-os-sprint-20260905-v1';
export const MAX_BUDGET = 100;
export const STAGES = ['draft', 'approved', 'live', 'paused', 'complete'];
export const METRICS = ['visits', 'conversations', 'bookings', 'trials', 'customers', 'ours', 'spend', 'revenue'];
export function taggedUrl(campaign, asset) {
  const url = new URL(campaign.destination);
  if (url.protocol !== 'https:') throw new Error('Campaign destinations must use HTTPS.');
  url.searchParams.set('utm_source', asset.channel);
  url.searchParams.set('utm_medium', asset.medium);
  url.searchParams.set('utm_campaign', asset.utmCampaign ?? `growth_20260905_${campaign.id}`);
  url.searchParams.set('utm_content', asset.id);
  return url.href;
}
export function initialState() {
  return { version: 1, campaigns: {}, records: [], tasks: {}, drafts: {} };
}
export function totalSpend(records) {
  return Math.round(records.reduce((sum, row) => sum + row.spend, 0) * 100) / 100;
}
export function validateRecord(record, ids) {
  if (!record || !ids.includes(record.campaignId)) throw new Error('Choose a known campaign.');
  if (typeof record.id !== 'string' || record.id.length > 100) throw new Error('Invalid record ID.');
  if (!/^2026-09-(0[5-9]|1[01])$/.test(record.date)) throw new Error('Use a date from September 5 through September 11.');
  if (typeof record.evidence !== 'string' || record.evidence.trim().length < 5 || record.evidence.length > 500) throw new Error('Add a source reference, such as a CRM report name.');
  for (const metric of METRICS) {
    if (!Number.isFinite(record[metric]) || record[metric] < 0 || record[metric] > 1e8) throw new Error(`Invalid ${metric}.`);
    if (!['spend', 'revenue'].includes(metric) && !Number.isInteger(record[metric])) throw new Error(`${metric} must be a whole number.`);
    if (['spend', 'revenue'].includes(metric) && Math.abs(record[metric] * 100 - Math.round(record[metric] * 100)) > 1e-6) throw new Error(`${metric} must use cents.`);
  }
  return record;
}
export function validateState(value, campaigns) {
  if (!value || value.version !== 1 || !Array.isArray(value.records) || value.records.length > 10000) throw new Error('Unsupported backup.');
  const ids = campaigns.map(c => c.id);
  const clean = initialState();
  const seen = new Set();
  clean.records = value.records.map(record => {
    validateRecord(record, ids);
    if (seen.has(record.id)) throw new Error('Duplicate record ID.');
    seen.add(record.id);
    return Object.fromEntries(['id', 'campaignId', 'date', 'evidence', ...METRICS].map(k => [k, record[k]]));
  });
  for (const c of campaigns) {
    const status = value.campaigns?.[c.id];
    if (status) {
      if (!STAGES.includes(status.stage) || typeof status.checked !== 'boolean' || typeof status.proof !== 'string' || status.proof.length > 500) throw new Error('Invalid campaign status.');
      if (['approved', 'live', 'complete'].includes(status.stage) && !status.checked) throw new Error('Approved campaigns need a completed launch check.');
      if (['live', 'complete'].includes(status.stage) && !status.proof.trim()) throw new Error('Live campaigns need a publication reference.');
      clean.campaigns[c.id] = { stage: status.stage, checked: status.checked, proof: status.proof };
    }
    c.tasks.forEach((_, i) => { clean.tasks[`${c.id}-${i}`] = value.tasks?.[`${c.id}-${i}`] === true; });
    c.assets.forEach(a => {
      const draft = value.drafts?.[`${c.id}-${a.id}`];
      if (draft !== undefined) {
        if (typeof draft !== 'string' || draft.length > 5000) throw new Error('Invalid draft.');
        clean.drafts[`${c.id}-${a.id}`] = draft;
      }
    });
  }
  return clean;
}
export function transition(status, stage, spend, paid = true) {
  if (!STAGES.includes(stage)) throw new Error('Unknown status.');
  if (['approved', 'live', 'complete'].includes(stage) && !status.checked) throw new Error('Complete the destination, offer, and follow-up checks first.');
  if (['live', 'complete'].includes(stage) && !status.proof.trim()) throw new Error('Add the published post or ad reference first.');
  if (stage === 'live' && !['approved', 'paused', 'live'].includes(status.stage)) throw new Error('Approve the campaign before marking it live.');
  if (paid && stage === 'live' && spend >= MAX_BUDGET) throw new Error('The $100 spend limit has been reached. Review before launching another paid campaign.');
  return { ...status, stage };
}
export function totals(records) {
  return Object.fromEntries(METRICS.map(k => [k, Math.round(records.reduce((sum, r) => sum + r[k], 0) * 100) / 100]));
}
export function recommendation(records) {
  if (!records.length) return 'No results recorded. Verify the path, publish an approved campaign, and add a source report.';
  const t = totals(records);
  if (t.customers > 0) return 'A paid customer is recorded. Check the acquisition cost and attribution before repeating the campaign.';
  if (t.spend >= 40 && t.bookings === 0 && t.conversations === 0) return 'Pause paid delivery. Check the destination and audience before spending more.';
  if (t.bookings || t.trials || t.conversations) return 'Follow up with the people who responded. Record attended visits and paid customers next.';
  return 'No customer action recorded yet. Check the offer and signup path; clicks alone do not establish a win.';
}
