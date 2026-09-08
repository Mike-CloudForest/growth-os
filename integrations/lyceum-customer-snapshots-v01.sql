create schema if not exists growth_private;
revoke all on schema growth_private from public, anon, authenticated;
create table if not exists growth_private.customer_snapshots (
 captured_hour timestamptz primary key,
 captured_at timestamptz not null default now(),
 report jsonb not null
);
alter table growth_private.customer_snapshots enable row level security;
revoke all on growth_private.customer_snapshots from public, anon, authenticated;
create extension if not exists pg_cron;
create or replace function growth_private.capture_customers()
returns void language sql security invoker set search_path = '' as $fn$
insert into growth_private.customer_snapshots(captured_hour,captured_at,report)
select date_trunc('hour',now()),now(),jsonb_build_object(
 'range_start','2026-09-05T00:00:00-04:00',
 'range_end',now(),
 'paid_attribution','unavailable: no authenticated campaign-to-customer link',
 'real_vs_ours','unclassified: internal sessions may be included',
 'campaign_funnel',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (
 select utm_campaign, count(distinct session_id) filter(where event='page_view') as visiting_sessions,
 count(distinct session_id) filter(where event='signup_code_requested') as code_requests,
 count(distinct session_id) filter(where event='signup_verified') as browser_reported_verifications
 from public.site_events where created_at >= '2026-09-05T00:00:00-04:00' and created_at<=now()
 and utm_campaign like 'growth_%' group by utm_campaign)x),
 'schools',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (
 select brand,count(*) as schools_created from public.communities where created_at>='2026-09-05T00:00:00-04:00' and created_at<=now() and deleted_at is null group by brand)x),
 'payment_feed',(select jsonb_build_object(
 'latest_live_event_at',max(created_at) filter(where payload->>'livemode'='true'),
 'test_invoice_events_excluded',count(*) filter(where type='invoice.paid' and payload->>'livemode'='false'),
 'failed_events',count(*) filter(where status='failed')) from public.stripe_webhook_events where source='platform'),
 'first_paid_schools',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (
 select coalesce(c.brand,'unmapped') as brand,count(*) as first_paid_schools_observed from (
 select ps.community_id,min(to_timestamp((w.payload->>'created')::double precision)) as first_paid_at
 from public.stripe_webhook_events w
 join public.platform_subscriptions ps on ps.stripe_subscription_id=coalesce(
 w.payload#>>'{data,object,subscription}',w.payload#>>'{data,object,parent,subscription_details,subscription}')
 where w.source='platform' and w.type='invoice.paid' and w.status='done'
 and w.payload->>'livemode'='true' and w.payload#>>'{data,object,status}'='paid'
 and (w.payload#>>'{data,object,amount_paid}')::numeric>0
 group by ps.community_id
 ) paid left join public.communities c on c.id=paid.community_id
 where first_paid_at>='2026-09-05T00:00:00-04:00' and first_paid_at<=now() group by c.brand)x),
 'unmapped_live_paid_invoices',(select count(distinct w.payload#>>'{data,object,id}')
 from public.stripe_webhook_events w where w.source='platform' and w.type='invoice.paid' and w.status='done'
 and w.payload->>'livemode'='true' and (w.payload#>>'{data,object,amount_paid}')::numeric>0
 and not exists(select 1 from public.platform_subscriptions ps where ps.stripe_subscription_id=coalesce(
 w.payload#>>'{data,object,subscription}',w.payload#>>'{data,object,parent,subscription_details,subscription}')))
)
on conflict(captured_hour) do update set captured_at=excluded.captured_at,report=excluded.report;
$fn$;
revoke all on function growth_private.capture_customers() from public,anon,authenticated;
select growth_private.capture_customers();
select cron.schedule('growth-os-customer-snapshot','7 * * * *','select growth_private.capture_customers()');

