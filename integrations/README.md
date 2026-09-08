# Private Growth OS integrations

The customer snapshot SQL is deployed to the existing Lyceum and Cloud Forest databases. Lyceum also serves DojoZeus; reports group schools by brand. Both jobs run hourly through pg_cron and store aggregate snapshots in growth_private.customer_snapshots. This schema is private, with RLS enabled and no anon/authenticated grants. No public API or GitHub Pages data feed is exposed.

The connected Supabase tool can retrieve reports with:

```sql
select captured_at, report from growth_private.customer_snapshots
order by captured_at desc limit 1;
select status, start_time, end_time from cron.job_run_details
where jobid in (select jobid from cron.job where jobname='growth-os-customer-snapshot')
order by start_time desc limit 5;
```

Snapshots are cumulative from September 5, 2026. Do not sum successive snapshots. The hourly primary key makes retries replace a snapshot rather than duplicate it. Preserve unknown values. Browser signup signals are not authenticated customer records. Internal traffic is not classified. Payment reports exclude Stripe test events, require positive paid invoices, and deduplicate SaaS customers by school. First payment means first observed payment in available history, not proven lifetime acquisition. Ad-to-paid attribution remains unavailable. Cloud Forest's existing payment ledger does not preserve livemode, so its verified paid customer total is deliberately null until its webhook is upgraded and tested.

Meta already holds the default payment method and performs automatic billing. The private operator uses platform lifetime budgets; Growth OS never accepts card numbers. authorization-2026-09-14.json authorizes only September 14–20, $25 per brand, $75 total. It does not change historical pilot caps. Provider scheduling must be verified before marking it complete. Renewals after that week require another authorization. Check for duplicates before scheduling.

The Codex heartbeat growth-os-campaign-checks reads the reports at 09:00 and 17:00 local time and checks Meta with available authenticated access. It is not a Meta API service. The SQL jobs continue independently of Codex. Keep all raw customer records, tokens and payment identifiers out of this repository and public outputs.

To pause capture without deleting data: SELECT cron.unschedule('growth-os-customer-snapshot');
