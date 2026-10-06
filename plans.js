/**
 * Single source of truth for Nanik plans.
 * Pricing page, support, terms, web paywall, and dashboard limits all read this.
 */
(function (root) {
  "use strict";

  var UNLIMITED = Number.POSITIVE_INFINITY;
  var MONTHLY_PRICE = 9.99;
  var YEARLY_PRICE = 59.99;
  var YEARLY_COMPARE_AT = Math.round(MONTHLY_PRICE * 12 * 100) / 100;
  var MONTHLY_FROM_YEARLY = Math.round((YEARLY_PRICE / 12) * 100) / 100;
  var SAVINGS_PERCENT = Math.round((1 - YEARLY_PRICE / YEARLY_COMPARE_AT) * 100);

  var plus = {
    stories: 60,
    storiesPeriod: "month",
    voiceClones: UNLIMITED,
    childProfiles: UNLIMITED,
  };

  var PLANS = {
    currency: "USD",
    unlimited: UNLIMITED,
    free: {
      id: "free",
      code: "freemium",
      name: "Free",
      price: 0,
      stories: 3,
      storiesPeriod: "lifetime",
      voiceClones: 1,
      childProfiles: 1,
    },
    plus: plus,
    monthly: {
      id: "monthly",
      name: "Nanik Plus Monthly",
      price: MONTHLY_PRICE,
      period: "month",
      displayPrice: "$9.99",
      displayPeriod: "/month",
      trialDays: 0,
      stories: plus.stories,
      voiceClones: plus.voiceClones,
      childProfiles: plus.childProfiles,
    },
    yearly: {
      id: "yearly",
      name: "Nanik Plus Yearly",
      price: YEARLY_PRICE,
      period: "year",
      displayPrice: "$59.99",
      displayPeriod: "/year",
      monthlyEquivalent: MONTHLY_FROM_YEARLY,
      compareAtYearly: YEARLY_COMPARE_AT,
      strikeMonthly: MONTHLY_PRICE,
      savingsPercent: SAVINGS_PERCENT,
      trialDays: 7,
      stories: plus.stories,
      voiceClones: plus.voiceClones,
      childProfiles: plus.childProfiles,
    },
  };

  function isUnlimited(n) {
    return typeof n === "number" && !isFinite(n);
  }

  function limitFor(isPlus, kind) {
    var bucket = isPlus ? PLANS.plus : PLANS.free;
    return bucket[kind];
  }

  root.NANIK_PLANS = PLANS;
  root.NANIK_PLAN_UTILS = {
    isUnlimited: isUnlimited,
    limitFor: limitFor,
  };
})(typeof window !== "undefined" ? window : this);
