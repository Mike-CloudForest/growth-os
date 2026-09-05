export const KEY='growth-os-segments-v1';
export function validateRecord(value) {
  if(!value || typeof value!=='object' || Array.isArray(value)) throw Error('Invalid segment record.');
  const out={};
  for(const key of ['evidence','page','notes']) { if(typeof value[key]!=='string'||value[key].length>5000) throw Error('Invalid '+key);out[key]=value[key]; }
  for(const key of ['controlVisits','controlConversions','controlCustomers','variantVisits','variantConversions','variantCustomers','controlSpend','variantSpend']) {
    const n=value[key];if(typeof n!=='number'||!Number.isFinite(n)||n<0||n>1e9||(!key.endsWith('Spend')&&!Number.isSafeInteger(n))) throw Error('Invalid '+key);
    out[key]=n;
  }
  for(const arm of ['control','variant']) if(out[arm+'Conversions']>out[arm+'Visits']||out[arm+'Customers']>out[arm+'Visits']) throw Error('Use unique people from the same cohort; conversions cannot exceed visitors.');
  if(out.page && !/^https:\/\//.test(out.page)) throw Error('Use an HTTPS page URL.');
  return out;
}
export const emptyRecord=()=>({evidence:'',page:'',notes:'',controlVisits:0,controlConversions:0,controlCustomers:0,variantVisits:0,variantConversions:0,variantCustomers:0,controlSpend:0,variantSpend:0});
export function validateBackup(data,ids){
  if(data?.version!==1||!data.records||typeof data.records!=='object'||Array.isArray(data.records)) throw Error('Invalid backup.');
  const records={};for(const [id,row] of Object.entries(data.records)){if(!ids.includes(id)) throw Error('Unknown segment.');records[id]=validateRecord(row);}return {version:1,records};
}
export function trackingUrl(segment,page,arm){
  const url=new URL(page);const brand=new URL(segment.destination);
  if(url.protocol!=='https:'||url.hostname!==brand.hostname||url.username||url.password) throw Error('Use a verified HTTPS landing page on '+brand.hostname+'.');
  if(!['control','variant'].includes(arm)) throw Error('Unknown test arm.');
  url.searchParams.set('utm_source','facebook');url.searchParams.set('utm_medium','paid_social');url.searchParams.set('utm_campaign','segment_'+segment.id);url.searchParams.set('utm_content',arm);return url.href;
}
export function report(record){
  const stats=arm=>{const n=record[arm+'Visits'],c=record[arm+'Conversions'],paid=record[arm+'Customers'],spend=record[arm+'Spend'];return `${arm}: ${n} visitors, ${c} primary conversions (${n?(100*c/n).toFixed(1)+'%':'no rate yet'}), ${paid} customers; cost per customer ${paid?'$'+(spend/paid).toFixed(2):'not available'}.`;};
  return stats('control')+'\n'+stats('variant')+'\nDescriptive totals only. Check dates, attribution, comparable traffic, and refunds. A small pilot cannot establish a reliable winner. Spend increases require a separate review.';
}
