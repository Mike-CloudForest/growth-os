-- Opt-in only: apply to a dedicated persistent Postgres database after owner auth.
-- This nested file is intentionally excluded from the public app's automatic migrations.
CREATE TABLE IF NOT EXISTS growth_spend_policy (
  owner_id text PRIMARY KEY,
  policy jsonb NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  revision integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS growth_spend_ledger (
  owner_id text NOT NULL REFERENCES growth_spend_policy(owner_id),
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  vendor text NOT NULL,
  company text NOT NULL,
  cents integer NOT NULL CHECK (cents > 0),
  week date NOT NULL,
  day date NOT NULL,
  status text NOT NULL CHECK (status IN ('reserved','settled','uncertain','released')),
  policy_revision integer NOT NULL,
  provider_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (owner_id, idempotency_key)
);
CREATE TABLE IF NOT EXISTS growth_spend_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id text NOT NULL,
  action text NOT NULL,
  detail jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON growth_spend_policy, growth_spend_ledger, growth_spend_audit FROM PUBLIC;
