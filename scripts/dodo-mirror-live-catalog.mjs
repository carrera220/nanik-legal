#!/usr/bin/env node
/**
 * Mirror Nanik Plus test products into Dodo live mode.
 *
 * Usage:
 *   DODO_LIVE_API_KEY=... node scripts/dodo-mirror-live-catalog.mjs
 *
 * Optional:
 *   DODO_TEST_API_KEY=...  (defaults to reading supabase/.env.dodo.local)
 *   WRITE_ENV=1            (writes supabase/.env.dodo.live with new IDs; key not overwritten if file exists)
 *
 * Creates:
 *   - Nanik plus monthly  ($9.99 / month, 3-day trial)  — matches current test catalog
 *   - Nanik plus yearly   ($59.99 / year, 3-day trial)
 *   - Nanik Plus collection containing both
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const TEST_BASE = "https://test.dodopayments.com";
const LIVE_BASE = "https://live.dodopayments.com";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    out[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
  return out;
}

async function api(base, key, method, pathname, body) {
  const res = await fetch(base + pathname, {
    method,
    headers: {
      Authorization: "Bearer " + key,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const err = new Error((data && (data.message || data.error)) || res.statusText || "request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function recurringFromTest(product) {
  const price = product.price && typeof product.price === "object" ? product.price : product.price_detail;
  if (!price || price.type !== "recurring_price") {
    throw new Error("Expected recurring_price on " + product.product_id);
  }
  return {
    name: product.name,
    description: product.description || undefined,
    tax_category: product.tax_category || "digital_products",
    price: {
      type: "recurring_price",
      currency: price.currency || "USD",
      price: price.price,
      discount: price.discount || 0,
      purchasing_power_parity: !!price.purchasing_power_parity,
      tax_inclusive: !!price.tax_inclusive,
      payment_frequency_count: price.payment_frequency_count,
      payment_frequency_interval: price.payment_frequency_interval,
      subscription_period_count: price.subscription_period_count,
      subscription_period_interval: price.subscription_period_interval,
      trial_period_days: price.trial_period_days || 0,
      trial_apply_discounts: !!price.trial_apply_discounts,
      trial_payment_method_optional: !!price.trial_payment_method_optional,
      zero_amount_payment_method_optional: !!price.zero_amount_payment_method_optional,
    },
  };
}

async function main() {
  const local = loadEnvFile(path.join(root, "supabase/.env.dodo.local"));
  const testKey = process.env.DODO_TEST_API_KEY || local.DODO_PAYMENTS_API_KEY;
  const liveKey = process.env.DODO_LIVE_API_KEY || process.env.DODO_PAYMENTS_API_KEY_LIVE;
  const monthlyId = process.env.DODO_PRODUCT_PLUS_MONTHLY || local.DODO_PRODUCT_PLUS_MONTHLY;
  const yearlyId = process.env.DODO_PRODUCT_PLUS_YEARLY || local.DODO_PRODUCT_PLUS_YEARLY;
  const collectionId = process.env.DODO_PRODUCT_COLLECTION_ID || local.DODO_PRODUCT_COLLECTION_ID;

  if (!testKey) throw new Error("Missing test API key (DODO_TEST_API_KEY or supabase/.env.dodo.local)");
  if (!liveKey) {
    throw new Error(
      "Missing live API key. Create one in Dodo dashboard (Live mode → Developer → API Keys), then run:\n" +
        "  DODO_LIVE_API_KEY=dodo_live_... node scripts/dodo-mirror-live-catalog.mjs"
    );
  }
  if (!monthlyId || !yearlyId) throw new Error("Missing test product IDs in .env.dodo.local");

  console.log("Fetching test products…");
  const monthlyTest = await api(TEST_BASE, testKey, "GET", "/products/" + monthlyId);
  const yearlyTest = await api(TEST_BASE, testKey, "GET", "/products/" + yearlyId);
  let collectionName = "Nanik Plus";
  if (collectionId) {
    try {
      const col = await api(TEST_BASE, testKey, "GET", "/product-collections/" + collectionId);
      if (col && col.name) collectionName = col.name;
    } catch {
      /* keep default */
    }
  }

  console.log("Creating live monthly…", monthlyTest.name, monthlyTest.price?.price ?? monthlyTest.price);
  const monthlyLive = await api(LIVE_BASE, liveKey, "POST", "/products", recurringFromTest(monthlyTest));
  console.log("  →", monthlyLive.product_id);

  console.log("Creating live yearly…", yearlyTest.name, yearlyTest.price?.price ?? yearlyTest.price);
  const yearlyLive = await api(LIVE_BASE, liveKey, "POST", "/products", recurringFromTest(yearlyTest));
  console.log("  →", yearlyLive.product_id);

  console.log("Creating live collection…", collectionName);
  const collectionLive = await api(LIVE_BASE, liveKey, "POST", "/product-collections", {
    name: collectionName,
    description: "Nanik Plus monthly and yearly plans",
    groups: [
      {
        status: true,
        products: [
          { product_id: monthlyLive.product_id, status: true },
          { product_id: yearlyLive.product_id, status: true },
        ],
      },
    ],
  });
  console.log("  →", collectionLive.id);

  const lines = [
    "# Live Dodo Payments — do not commit secrets",
    "DODO_PAYMENTS_API_KEY=" + liveKey,
    "DODO_PAYMENTS_WEBHOOK_KEY=",
    "DODO_PAYMENTS_ENVIRONMENT=live_mode",
    "DODO_PRODUCT_PLUS_MONTHLY=" + monthlyLive.product_id,
    "DODO_PRODUCT_PLUS_YEARLY=" + yearlyLive.product_id,
    "DODO_PRODUCT_COLLECTION_ID=" + collectionLive.id,
    "NANIK_WEB_APP_URL=" + (local.NANIK_WEB_APP_URL || "https://nanik.app"),
    "",
  ];

  console.log("\nLive catalog ready:");
  console.log(lines.filter((l) => !l.startsWith("DODO_PAYMENTS_API_KEY=") && !l.startsWith("#")).join("\n"));

  if (process.env.WRITE_ENV === "1") {
    const outPath = path.join(root, "supabase/.env.dodo.live");
    fs.writeFileSync(outPath, lines.join("\n"), { mode: 0o600 });
    console.log("\nWrote", outPath);
  } else {
    console.log("\nTo save locally: WRITE_ENV=1 DODO_LIVE_API_KEY=... node scripts/dodo-mirror-live-catalog.mjs");
  }
}

main().catch((err) => {
  console.error("Failed:", err.message);
  if (err.data) console.error(JSON.stringify(err.data, null, 2));
  process.exit(1);
});
