# Payment links

Start this app with `bun run production` in the repo root. The server listens on `http://localhost:3003`.


The payment site and the wallet do not trust each other. The site proves a payment by scanning the chain. The wallet spends only after you move the slider to fire and click SEND.

## Login

Open `http://localhost:3003/login`.

**Admin password.** Type the `ADMIN_SECRET` value from `.env` into the password field. Click the login button to reach the dashboard. The first start writes `ADMIN_SECRET` into `.env` and prints that it was created to the console.

## Dashboard

Open `http://localhost:3003/dashboard` after login.

**Payment link.** Create a link with an amount and a title. Open `http://localhost:3003/pay/<payment_link_id>` to reach the checkout page. The page makes one checkout session and one integrated address.

**Add wallet.** On the wallets area, click `Add Wallet` to send a view-key request to the browser wallet. The link hash is `monerochan002_create_and_share_viewkey_slot_<n>`. The wallet shows this on the wallets plate.

## Checkout

The pay page shows the amount, the address, and a button.

**Pay with browser wallet.** Click `pay with browser wallet` to send a spend request to the wallet. The link hash is `monerochan001_amount_<amount>_address_<address>`. The content script blocks navigation. It sends `toolCall` and `openSidebar` to the wallet.

## Where the two meet

**Tool 001 on the send plate.** After the pay click, click `#send` on the side panel. The plate shows the tool address, the amount, and the check result. Click `#send-action` only if the slider is on fire and you want that payment sent. With this tool call open, SEND posts `execute`. The worker runs tool `001`. 

**Address check.** The wallet fetches `http://localhost:3003/monerochan001/<address>`. The site returns `valid_address: true` only for a live checkout address. `valid` means this host claims the address. It does not check the amount. The site checks the amount later, when the scan shows the output.

**Tool 002 on the wallets plate.** After the Add Wallet click, click `#wallets`. The plate shows the share request. Click `#acceptShareWallet` only if you want the view key posted to `http://localhost:3003/monerochan002/`. Click `#dismissShareWallet` to refuse. Accept does not give the spend key.

**Same site check.** Tool `002` is `valid` only when the page host and the link host reduce to the same name. A checkout on `localhost` and a link to `localhost` pass. The view key is posted to the link destination origin.

**Action log.** Click `#openActionLog` on the send plate or the wallets plate to access the action log tab. The page lists these tool calls and their states.

## What the site stores

The site keeps its own view key so it can scan. It does not receive the payer spend key from tool `001`. A paid invoice is a scanned output for that session address, with enough confirmations, and with an amount at least the invoice amount.
