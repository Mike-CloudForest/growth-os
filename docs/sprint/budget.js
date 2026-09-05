export const VENDORS = ['meta', 'google'];
export const DEFAULT_POLICY = Object.freeze({version:1, currency:'USD', timezone:'America/New_York', weeklyCents:10000, transactionCents:4000, dailyCents:4000, vendors:['meta'], companies:['cloudforest'], requireApproval:true, recurring:false, paused:true});
/** @param {any} input */
export function validatePolicy(input) {
  if (!input || input.version !== 1 || input.currency !== 'USD' || input.timezone !== 'America/New_York') throw new Error('Unsupported spending policy.');
  for(const k of ['weeklyCents','transactionCents','dailyCents']) if(!Number.isSafeInteger(input[k])||input[k]<0||input[k]>1000000) throw new Error('Budget amounts must be whole cents from $0 to $10,000.');
  if(input.transactionCents>input.dailyCents||input.dailyCents>input.weeklyCents)throw new Error('Per-purchase limit must fit inside the daily limit, and daily inside weekly.');
  if(!Array.isArray(input.vendors)||input.vendors.some((/** @type {string} */ v)=>!VENDORS.includes(v)))throw new Error('Unsupported vendor.');
  const companies=['cloudforest','dojozeus','lyceum','rigboss','mechcorrect'];
  if(!Array.isArray(input.companies)||input.companies.some((/** @type {string} */ c)=>!companies.includes(c)))throw new Error('Unsupported company.');
  for(const k of ['requireApproval','recurring','paused'])if(typeof input[k]!=='boolean')throw new Error('Invalid policy flag.');
  return Object.fromEntries(Object.keys(DEFAULT_POLICY).map(k=>[k,input[k]]));
}
export function spendingDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const get=(/** @type {string} */ k)=>parts.find(p=>p.type===k)?.value;return `${get('year')}-${get('month')}-${get('day')}`;
}
export function spendingWeek(now = new Date()) {
  const date = new Date(`${spendingDay(now)}T12:00:00Z`);const offset=(date.getUTCDay()+6)%7;date.setUTCDate(date.getUTCDate()-offset);return date.toISOString().slice(0,10);
}
/**
 * @param {any} policy
 * @param {any} request
 * @param {Array<{cents:number,status:string,week:string,day:string}>} ledger
 * @returns {{allowed:false,reason:string}|{allowed:true,reason:string,remainingCents:number,week:string,day:string}}
 */
export function evaluateSpend(policy, request, ledger, now = new Date()) {
  const p=validatePolicy(policy);
  /** @param {string} reason @returns {{allowed:false,reason:string}} */
  const deny=reason=>({allowed:false,reason});
  if(p.paused)return deny('Spending is paused.');
  if(!Number.isSafeInteger(request.cents)||request.cents<=0)return deny('Amount must be a positive number of whole cents.');
  if(request.currency!=='USD')return deny('Only USD purchases are allowed.');
  if(!p.vendors.includes(request.vendor))return deny('Vendor is not approved.');
  if(!p.companies.includes(request.company))return deny('Company is not approved.');
  if(request.subscription)return deny('Subscriptions and automatic renewals require a separate approval.');
  if(!request.campaignApproved)return deny('Campaign content must be approved.');
  if(p.requireApproval&&!request.purchaseApproved)return deny('This policy requires approval for each purchase.');
  if(request.cents>p.transactionCents)return deny('Per-purchase cap exceeded.');
  const week=spendingWeek(now),day=spendingDay(now);
  if(!Array.isArray(ledger)||ledger.some(r=>!Number.isSafeInteger(r.cents)||r.cents<0||!['reserved','settled','uncertain','released'].includes(r.status)))return deny('Ledger is invalid.');
  // Unresolved prior-week reservations continue to consume capacity until reconciled.
  const outstanding=(/** @type {{status:string}} */ r)=>['reserved','uncertain'].includes(r.status);
  const used=ledger.filter(r=>outstanding(r)||(r.status==='settled'&&r.week===week)).reduce((s,r)=>s+r.cents,0);
  const daily=ledger.filter(r=>outstanding(r)||(r.status==='settled'&&r.day===day)).reduce((s,r)=>s+r.cents,0);
  if(used+request.cents>p.weeklyCents)return deny('Weekly budget would be exceeded, including outstanding reservations.');
  if(daily+request.cents>p.dailyCents)return deny('Daily budget would be exceeded, including outstanding reservations.');
  return {allowed:true,reason:'Fits the proposed rules. Provider access and a server reservation are still required.',remainingCents:p.weeklyCents-used-request.cents,week,day};
}
