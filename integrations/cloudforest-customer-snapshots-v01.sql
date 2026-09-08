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
 'brand','cloudforest','range_start','2026-09-05T00:00:00-04:00','range_end',now(),
 'verified_paid_customers',null,'paid_verification','unavailable: payment ledger does not preserve Stripe livemode',
 'leads_created',(select count(*) from public.leads where created_at>='2026-09-05T00:00:00-04:00' and created_at<=now() and deleted_at is null),
 'enrollment_funnel',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (
 select coalesce(nullif(utm_campaign,''),'unattributed') as campaign,count(*) as enrollment_sessions,
 count(distinct converted_student_id) as converted_students
 from public.enrollment_sessions where created_at>='2026-09-05T00:00:00-04:00' and created_at<=now() group by 1)x),
 'payment_events_observed',(select count(*) from public.school_events where event='payment.succeeded' and created_at>='2026-09-05T00:00:00-04:00' and created_at<=now()),
 'latest_payment_event_at',(select max(created_at) from public.school_events where event='payment.succeeded'),
 'latest_enrollment_event_at',(select max(created_at) from public.school_events where event='enrollment.completed')
)
on conflict(captured_hour) do update set captured_at=excluded.captured_at,report=excluded.report;
$fn$;
revoke all on function growth_private.capture_customers() from public,anon,authenticated;
select growth_private.capture_customers();
select cron.schedule('growth-os-customer-snapshot','12 * * * *','select growth_private.capture_customers()');

