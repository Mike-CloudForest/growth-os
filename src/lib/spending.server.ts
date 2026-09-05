import { Pool } from 'pg';
import { createHash } from 'node:crypto';
// Shared browser/server policy engine is covered by Node tests.
import { evaluateSpend, validatePolicy } from '../../public/sprint/budget.js';

type SpendRequest = { key: string; cents: number; currency: string; vendor: string; company: string; subscription: boolean; campaignApproved: boolean; purchaseApproved: boolean };

/** This module is not an exposed API. Only a verified owner service may call it.
 * Approval booleans must come from persisted owner approvals, never model input.
 * Provider execution is deliberately absent until credentials and reconciliation exist.
 */
function assertConfigured(ownerId: string) {
  if (!process.env.SPENDING_DATABASE_URL || !process.env.SPENDING_OWNER_ID || ownerId !== process.env.SPENDING_OWNER_ID) {
    throw new Error('Private spending service is not configured for this owner.');
  }
}

export async function reserveSpend(ownerId: string, request: SpendRequest) {
  assertConfigured(ownerId);
  if (!/^[a-zA-Z0-9_-]{16,100}$/.test(request.key)) throw new Error('A stable idempotency key is required.');
  const pool = new Pool({ connectionString: process.env.SPENDING_DATABASE_URL, max: 1 });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // One owner row serializes all jobs and policy changes for this budget.
    const result = await client.query('SELECT * FROM growth_spend_policy WHERE owner_id=$1 FOR UPDATE', [ownerId]);
    const row = result.rows[0];
    if (!row || !row.enabled) throw new Error('Autonomous spending is disabled.');
    const hash = createHash('sha256').update(JSON.stringify([
      request.cents, request.currency, request.vendor, request.company,
      request.subscription, request.campaignApproved, request.purchaseApproved,
    ])).digest('hex');
    const existing = await client.query('SELECT * FROM growth_spend_ledger WHERE owner_id=$1 AND idempotency_key=$2', [ownerId, request.key]);
    if (existing.rows[0]) {
      if (existing.rows[0].request_hash !== hash) throw new Error('Idempotency key was reused with a different request.');
      await client.query('COMMIT');
      return { reservation: existing.rows[0], reused: true, executable: false };
    }
    const ledger = await client.query("SELECT cents,status,to_char(week,'YYYY-MM-DD') AS week,to_char(day,'YYYY-MM-DD') AS day FROM growth_spend_ledger WHERE owner_id=$1", [ownerId]);
    const verdict = evaluateSpend(validatePolicy(row.policy), request, ledger.rows, new Date());
    if (!verdict.allowed) throw new Error(verdict.reason);
    const saved = await client.query("INSERT INTO growth_spend_ledger(owner_id,idempotency_key,request_hash,vendor,company,cents,week,day,status,policy_revision) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'reserved',$9) RETURNING *", [ownerId,request.key,hash,request.vendor,request.company,request.cents,verdict.week,verdict.day,row.revision]);
    await client.query("INSERT INTO growth_spend_audit(owner_id,action,detail) VALUES($1,'reserved',$2)", [ownerId,JSON.stringify({key:request.key,cents:request.cents,revision:row.revision})]);
    await client.query('COMMIT');
    return { reservation: saved.rows[0], reused: false, executable: false };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); await pool.end(); }
}

/** Owner pause records the policy change. A connected provider must separately
 * acknowledge pausing active ads; this function does not claim to pause those ads.
 */
export async function pauseSpending(ownerId: string) {
  assertConfigured(ownerId);
  const pool = new Pool({ connectionString: process.env.SPENDING_DATABASE_URL, max: 1 });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE growth_spend_policy SET enabled=false, revision=revision+1, updated_at=now() WHERE owner_id=$1', [ownerId]);
    await client.query("INSERT INTO growth_spend_audit(owner_id,action,detail) VALUES($1,'paused','{}')", [ownerId]);
    await client.query('COMMIT');
    return { paused: true, providerPauseConfirmed: false };
  } catch(error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); await pool.end(); }
}
