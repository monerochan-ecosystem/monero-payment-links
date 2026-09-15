# Monero Payment Links

This Bun server creates checkout pages with Monero QR codes and a dashboard to manage wallets and payment links.

```bash
bun install
bun run dev          # hot reload on http://localhost:3003
bun run production   # production mode
```

### code overview 
`server.ts` sets routes. `checkout.ts` renders payment pages. `db.ts` stores sessions and links in SQLite (`monero_payments.db`).

`dashboard/` contains login, payment-link admin dashboard CRUD, and wallet APIs. `ws.ts` pushes live updates to dashboard. `rates.ts` converts fiat. `theme/` sets style (edit this yourself & add more themes). `wallet-caches/` stores scan files.
