# Dodo Payments — fill-in fields & where to find them

Use the blank template: [`supabase/.env.dodo.example`](supabase/.env.dodo.example)

Copy it locally (do not commit secrets):

```bash
cp supabase/.env.dodo.example supabase/.env.dodo.local
```

Then paste each value into **Supabase → Project → Edge Functions → Secrets**  
(or run `supabase secrets set --env-file supabase/.env.dodo.local --project-ref zljowsxavbpqfdskekwd`).

---

## Field checklist

| Field | Example shape | Where to find it |
|---|---|---|
| `DODO_PAYMENTS_API_KEY` | `dodo_test_...` or `dodo_live_...` | [Dodo dashboard](https://app.dodopayments.com) → **Developer** → **API Keys** → Create / copy key. Use **Test** while developing. |
| `DODO_PAYMENTS_WEBHOOK_KEY` | `whsec_...` | Dodo → **Developer** → **Webhooks** → open your endpoint → **Signing Secret**. Create the webhook first (see below). |
| `DODO_PAYMENTS_ENVIRONMENT` | `test_mode` or `live_mode` | Not in the dashboard — set yourself. Must match the API key type (`test` ↔ `test_mode`). |
| `DODO_PRODUCT_PLUS_MONTHLY` | `pdt_...` | Dodo → **Products** → open **Nanik Plus Monthly** → copy **Product ID**. |
| `DODO_PRODUCT_PLUS_YEARLY` | `pdt_...` | Dodo → **Products** → open **Nanik Plus Yearly** → copy **Product ID**. |
| `NANIK_WEB_APP_URL` | `https://nanik.app` | Your live site origin (already filled for production). Use `http://127.0.0.1:5500` only for local return URLs if needed. |

---

## Step-by-step in Dodo

### 1) API key
1. Open https://app.dodopayments.com and sign in.
2. Go to **Developer** → **API Keys**.
3. Create a **Test** key (or copy an existing one).
4. Paste into `DODO_PAYMENTS_API_KEY`.

### 2) Create products (if you don’t have them yet)
1. Go to **Products** → **Create product**.
2. **Monthly**
   - Name: `Nanik Plus Monthly`
   - Pricing model: **Subscription**
   - Price: `14.99` USD
   - Interval: every **1 month**
   - Trial days: `0`
3. **Yearly**
   - Name: `Nanik Plus Yearly`
   - Pricing model: **Subscription**
   - Price: `89.99` USD
   - Interval: every **1 year**
   - Trial days: `3`
4. Open each product and copy the **Product ID** (`pdt_...`) into:
   - `DODO_PRODUCT_PLUS_MONTHLY`
   - `DODO_PRODUCT_PLUS_YEARLY`

### 3) Webhook endpoint + signing secret
1. Go to **Developer** → **Webhooks** → **Create** (Test mode).
2. Endpoint URL:

```text
https://zljowsxavbpqfdskekwd.supabase.co/functions/v1/dodo-webhook
```

3. Enable at least:
   - `subscription.active`
   - `subscription.renewed`
   - `subscription.plan_changed`
   - `subscription.cancelled`
   - `subscription.expired`
   - `subscription.failed`
4. Save, then copy the **Signing Secret** into `DODO_PAYMENTS_WEBHOOK_KEY` and re-upload secrets.

Without this webhook, checkout can succeed in Dodo while Nanik still shows Free until `dodo-sync` runs (success page / dashboard now call it).

### 4) Environment
- Keep `DODO_PAYMENTS_ENVIRONMENT=test_mode` until you switch to live keys/products.
- When going live: use a `dodo_live_...` key, live product IDs, and set `live_mode`.

---

## Go live (production keys + live products)

Test and live are **separate**. Test product IDs (`pdt_…` from test) do not work with a live key.

### Current live catalog

| Plan | Live product ID |
|---|---|
| Monthly | `pdt_0Nnr0OB8YTU1SFHr6qTB0` |
| Yearly | `pdt_0Nnr0WGPr5ZQzleOMeG8S` |

### Current test catalog (reference)

| Plan | Test product ID | Price in Dodo |
|---|---|---|
| Monthly | `pdt_0NntBxQFKVcFQ7rmdtRDq` | **$9.99**/mo + 3-day trial |
| Yearly | `pdt_0NntCBN3MeBbp4YchDEil` | **$59.99**/yr + 3-day trial |
| Collection | `pdc_0NnvLMeFWdjr3hkKAifDI` | Nanik Plus (both plans) |

> Note: the marketing page still shows $14.99 / $89.99. Checkout uses the Dodo product prices above. Align the site copy before or after go-live.

### 1) Create a **live** API key

1. Open https://app.dodopayments.com and switch the toggle to **Live**.
2. **Developer** → **API Keys** → **Create**.
3. Copy the key (`dodo_live_…` or the live key format Dodo shows).

### 2) Mirror test products into live

```bash
cd /Users/gorkroyan/nanik-legal
DODO_LIVE_API_KEY='paste_live_key_here' WRITE_ENV=1 node scripts/dodo-mirror-live-catalog.mjs
```

This creates live monthly + yearly + collection and writes `supabase/.env.dodo.live` (gitignored).

### 3) Live webhook

1. Still in **Live** mode → **Developer** → **Webhooks** → **Create**.
2. URL:

```text
https://zljowsxavbpqfdskekwd.supabase.co/functions/v1/dodo-webhook
```

3. Same subscription events as test.
4. Paste the live **Signing Secret** into `DODO_PAYMENTS_WEBHOOK_KEY` in `.env.dodo.live`.

### 4) Upload live secrets to Supabase

```bash
supabase secrets set --env-file supabase/.env.dodo.live --project-ref zljowsxavbpqfdskekwd
```

Confirm `DODO_PAYMENTS_ENVIRONMENT=live_mode` and the new `pdt_…` / `pdc_…` IDs are set.

### 5) Smoke-check before announcing

- One real $ checkout (small / cancel after) or a live-mode verification with a real card.
- Confirm webhook updates the account to Plus.
- Keep a copy of test secrets so you can roll back to `test_mode` if needed.

---

## Add secrets in Supabase

1. Open https://supabase.com/dashboard/project/zljowsxavbpqfdskekwd/settings/functions  
   (or **Project Settings → Edge Functions → Secrets**).
2. Add each key/value from your filled `.env.dodo.local`.
3. No redeploy is required for new secrets on already-deployed functions; wait ~10–30s and try checkout again.

CLI alternative (from `Storytelling-cursor`):

```bash
supabase secrets set --env-file ../nanik-legal/supabase/.env.dodo.local --project-ref zljowsxavbpqfdskekwd
```

---

## Quick test

1. Sign in on the site (`signin.html`).
2. Open `pricing.html` → click **Activate 3-day trial** (yearly) or **Get Nanik Plus** (monthly).
3. Complete Dodo test checkout.
4. You should land on `checkout-success.html`, then Plus unlocks after the webhook (refresh dashboard if needed).

If checkout says a product is not configured, the `DODO_PRODUCT_PLUS_*` secret is empty or wrong.
