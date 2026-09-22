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
