# Spending service implementation status

The public campaign desk offers a draft weekly policy and a dry-run evaluator. It cannot hold a card, activate a policy, authorize a purchase, or stop a provider's running ads. No payment details are requested, collected, or stored. The one-time $100 campaign authorization does not authorize a recurring $100 weekly charge.

## Payment model

For Meta and Google ads, Mike adds his payment method directly in the provider's billing UI. Growth OS will manage the approved ad account through its API. A Stripe saved payment method is a merchant payment token, not a general-purpose card that can be used to pay arbitrary vendors. Do not build a raw card vault into this application.

Vendor-restricted virtual cards may add issuer-level limits if Mike's issuer supports them. That is optional and not integrated here. No issuer or credit product is being opened.

## Implemented

- Shared integer-cent evaluator: company/vendor allowlists, per-purchase/daily/weekly caps, campaign and purchase approvals, USD only, subscriptions blocked, global pause.
- Monday-to-Sunday periods in America/New_York, tested across the DST boundary. No unused-budget rollover. Uncertain or reserved amounts from previous periods continue to consume capacity.
- Opt-in PostgreSQL schema in `migrations/spending/001_spending.sql` for policies, reservations, and audit entries. It is not auto-migrated into the public app.
- Server-only reservation function with an owner-row transaction lock, stable request hash, idempotency constraint, and audit entry. It always returns `executable: false`. No provider execution adapter or HTTP entry point exists yet.
- A server pause function that disables new reservations. It explicitly reports that provider-side ad pausing is not confirmed.

## Required before live activation

1. Deploy a private service with real owner authentication and persistent Postgres. Never use the public app's development identity or browser storage as financial authority.
2. Configure `SPENDING_DATABASE_URL` and `SPENDING_OWNER_ID` in the private server secret store; apply the opt-in schema with a restricted server DB role. The service must derive the owner from a verified session, never an incoming owner ID.
3. Add CSRF-protected, owner-only policy approval endpoints. Validate against the shared policy schema, lock the owner row, and create an immutable revision/audit entry. Agents cannot raise caps, change vendors, enable recurring spending, or approve their own purchases.
4. Connect Meta first using its official authorization flow. Store tokens only in the private secret store. Match the approved account and campaign IDs. Fetch actual spend and reconcile pre-existing active campaigns before any new reservation.
5. Build provider adapters for bounded campaign budgets, end dates, publishing, status checks, and pausing. Give a reservation one execution claimant; do not let a reused reservation initiate another provider request. If a response is uncertain, retain the reservation and reconcile the same operation before retrying. Never release uncertain money automatically.
6. Verify provider-side lifetime caps and platform/account spending limits. Reserve the maximum commitment including fees, not a hoped-for actual spend. Do not rely on eventually consistent analytics as the only cap.
7. Persist approvals for exact creative, destination, account, and amount. An AI-provided approval boolean is never authority.
8. Add receipt reconciliation and notifications at 50%, 80%, 100%, provider failure, or pause failure. Settled charges count gross; refunds do not automatically replenish the weekly budget.
9. Add a scheduler that operates only within an explicitly approved recurring policy. No weekly renewal is enabled by this change. Test concurrent reservations, provider timeouts, repeated jobs, owner pause during execution, changed policies, and cross-week settlement against actual Postgres and a provider sandbox.

## Verification boundaries

`scripts/budget.test.mjs` verifies the pure policy evaluator. The PostgreSQL reservation code has been typechecked but has not been integration-tested against a configured database. The UI's pause button affects only its draft policy. Until the service and providers are connected, spending and pauses must be performed directly in the provider UI.

References: https://docs.stripe.com/payments/setup-intents and the provider's current account/billing controls. Always verify current API permissions before implementing the adapter.
