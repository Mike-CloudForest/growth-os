import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_POLICY,validatePolicy,evaluateSpend,spendingWeek,spendingDay} from '../public/sprint/budget.js';
const policy={...DEFAULT_POLICY,paused:false};
const request={cents:2000,currency:'USD',vendor:'meta',company:'cloudforest',subscription:false,campaignApproved:true,purchaseApproved:true};
const now=new Date('2026-09-08T17:00:00Z');
test('default policy blocks all spending',()=>assert.equal(evaluateSpend(DEFAULT_POLICY,request,[],now).allowed,false));
test('only approved vendor, company, campaign, and purchase can pass',()=>{
 assert.equal(evaluateSpend(policy,request,[],now).allowed,true);
 for(const patch of [{vendor:'unknown'},{company:'dojozeus'},{currency:'EUR'},{campaignApproved:false},{purchaseApproved:false},{subscription:true},{cents:4001},{cents:-1},{cents:1.5}])assert.equal(evaluateSpend(policy,{...request,...patch},[],now).allowed,false);
});
test('reservations prevent overspend and uncertain charges remain reserved across weeks',()=>{
 const ledger=[{cents:3000,status:'reserved',week:'2026-08-31',day:'2026-09-05'}];
 assert.equal(evaluateSpend(policy,request,ledger,now).allowed,false);
 assert.equal(evaluateSpend(policy,request,[{...ledger[0],status:'uncertain'}],now).allowed,false);
 assert.equal(evaluateSpend(policy,request,[{...ledger[0],status:'released'}],now).allowed,true);
 assert.equal(evaluateSpend({...policy,dailyCents:10000},request,[{...ledger[0],cents:9000}],now).allowed,false);
});
test('week boundary uses Eastern time including DST',()=>{
 assert.equal(spendingWeek(new Date('2026-09-07T03:59:59Z')),'2026-08-31');
 assert.equal(spendingWeek(new Date('2026-09-07T04:00:00Z')),'2026-09-07');
 assert.equal(spendingDay(new Date('2026-11-02T04:59:59Z')),'2026-11-01');
 assert.equal(spendingWeek(new Date('2026-11-02T05:00:00Z')),'2026-11-02');
});
test('policy validation strips unknown fields and rejects inconsistent budgets',()=>{
 assert.equal(validatePolicy({...policy,cardNumber:'must-not-be-stored'}).cardNumber,undefined);
 assert.throws(()=>validatePolicy({...policy,weeklyCents:100}));
 assert.throws(()=>validatePolicy({...policy,weeklyCents:Infinity}));
 assert.throws(()=>validatePolicy({...policy,vendors:['any']}));
});
