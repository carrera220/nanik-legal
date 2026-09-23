(function (root) {
  "use strict";
  function text(value) { return String(value || "").trim() || null; }
  function list(value) {
    var items = String(value || "").split(",").map(function (item) { return item.trim(); }).filter(Boolean);
    return items.filter(function (item, index) {
      return items.findIndex(function (other) { return other.toLowerCase() === item.toLowerCase(); }) === index;
    });
  }
  function humanChildDescription(gender) {
    var g = String(gender || "").trim().toLowerCase();
    if (g === "girl") return "a human girl";
    if (g === "boy") return "a human boy";
    return "a human child";
  }
  function build(planner, state, history, uiLanguage, storyLanguage) {
    var pick = state.heroPick || state.heroKind || "";
    var mode = pick === "kid" || pick === "child" ? "child" : pick === "madeup" ? "created" : "decide";
    var purpose = planner.intentKey === "surprise" ? "fun" : planner.purposeKey === "today" ? "support" : planner.purposeKey || "fun";
    var field = purpose === "support" ? "support" : "topic";
    var answer = purpose === "fun" ? null : (history || []).filter(function (item) { return item.field === field; }).slice(-1)[0];
    var interests = list(planner.likes);
    var childGender = text(planner.gender) || text(state.childGender);
    return {
      schemaVersion: 2,
      uiLanguage: uiLanguage,
      storyLanguage: storyLanguage,
      audience: { age: Number(planner.age) || null },
      // Who the story is told to. Kept separate from the hero so it survives a made-up
      // or story-decides hero, which is when the old hero-only gender was lost.
      child: {
        gender: childGender,
        interests: interests
      },
      storyKind: planner.intentKey || "custom",
      purpose: purpose,
      direction: answer ? { field: field, question: text(answer.question), answer: text(answer.answer), source: answer.source || "chip" } : null,
      hero: {
        mode: mode,
        name: mode === "child" ? text(planner.name) : mode === "created" ? text(state.madeUpName) : null,
        characterType: mode === "created" ? text(state.madeUpType) : mode === "child" ? "human child" : null,
        description: mode === "created"
          ? text(state.madeUpDescription)
          : mode === "child"
          ? humanChildDescription(childGender)
          : null,
        photoProvided: !!state.image
      },
      additionalContext: text(planner.idea || planner.context || state.about),
      summary: null
    };
  }
  var api = { build: build };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NANIK_STORY_PLAN = api;
})(typeof window !== "undefined" ? window : globalThis);
