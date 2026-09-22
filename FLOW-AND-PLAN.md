# Guided Flow and Proposed Summary Contract

## Current flow

1. Age: the current initializer starts at basics, even with a saved profile. Saved age/name can prefill it. Selecting an age persists the child profile.
2. Story type: bedtime, adventure, funny, animals, folklore, or surprise. Surprise proceeds directly to hero.
3. Purpose: support, learn, or fun. Fun proceeds directly to hero.
4. Support/learning: local fallback options render immediately; Gemini 2.5 Flash can replace them. The user selects one option or enters custom text. Only the selected answer becomes the story direction; offered options are history, not user preferences.
5. Hero: child, created character, or let the story decide. Child requires name and a gender selection (including unspecified); interests and photo are optional. Created character requires a name; type, description, and photo are optional.
6. Plan: a local template produces the brief. Language and interests are editable. No AI summary generation currently happens here.

## What is actually available

- Age, story type, purpose, chosen support/learning answer, hero choice, language.
- Child hero: name, gender, interests. Created hero: name/type/description are currently combined into planner.hero.
- Photo: stored separately in state.image and sent separately in the generation payload.
- Custom text may populate context, emotion, setting, companion, mood, or idea. These are not mandatory steps.
- Follow-up history includes question, answer, field, source, and offered chips.

## Cleanup implemented

Removed 22 uncalled helpers, including obsolete AI hero normalization, covered-answer handling, redundant support requests, unused hint entry points, and unused summary support copy. Removed unused hero/today prompt branches and unused hero fallback, topic hint, and question-order constants. Active text analysis and support/learning generation remain intact.

The legacy detail tree still has references from rendering and input wiring. It has no normal route in flowSteps, but removing it requires a coordinated HTML/listener cleanup. It is retained rather than treating reference count as proof that the entire subsystem can be removed.

## Gaps to address when implementing the summary

- publishStoryPlan replaces the full shared planner with just storyType, clarifyingQuestion, support, and hero. Keep a separate summary object instead of changing the shared object's shape.
- clarifyingQuestion actually contains an answer. Use question and answer as separate fields.
- Preserve created-hero name, type, and description separately instead of parsing their combined display string.
- Gender is available in plannerInput but absent from the four-field published plan and top-level storyPayload.
- The current teaser treats the selected learning answer as an opening scene. A learning goal is not necessarily a scene.
- Photo compression/storage does not prove that photo details are reflected in the plan. Do not claim visual traits without image analysis.
- UI language and story language need separate fields. User-facing summary copy should use UI language; the eventual story uses story language.

## Implemented summary contract

The versioned contract now lives in story-plan.js, with unit coverage in story-plan.test.js. The plan page displays confirmed choices and edit links, stores the contract in NANIK_STORY_SUMMARY, and sends it through storyPayload.summaryPlan into the story generation prompt. NANIK_STORY_PLANNER retains its full internal shape. Created hero fields stay separate in state.

The planner proxy has a new summary request type that validates and returns only title, premise, and goal. Deploy the updated supabase/functions/web-planner-proxy/index.ts from the Storytelling-cursor project to enable Gemini summaries on the hosted endpoint. Until then (or on malformed/failed responses), the page uses a local summary. Requests are deduplicated by confirmed input, and late results only repaint matching plans.

```json
{
  "schemaVersion": 1,
  "uiLanguage": "en",
  "storyLanguage": "en",
  "audience": { "age": 6 },
  "storyKind": "adventure",
  "purpose": "learn",
  "direction": {
    "field": "topic",
    "question": "What should they learn or explore?",
    "answer": "How plants grow",
    "source": "chip"
  },
  "hero": {
    "mode": "child",
    "name": "Mia",
    "gender": "girl",
    "characterType": null,
    "description": null,
    "photoProvided": false
  },
  "interests": ["gardening", "drawing"],
  "additionalContext": null,
  "summary": {
    "title": "A tiny garden adventure",
    "premise": "Mia follows a tiny seed on a garden adventure and discovers what helps it grow.",
    "goal": "Explore how plants grow through a playful adventure."
  }
}
```

Build audience, storyKind, purpose, direction, hero, and interests deterministically from confirmed input. Generate only summary.title, summary.premise, and summary.goal. Keep suggested fictional plot details inside summary; never write them back as child facts. Use null for omitted values and direction for one selected answer. For fun/surprise, direction and summary.goal may be null. Keep the actual image outside this display contract and attach it separately to generation.

The page can show the premise, hero, story type, optional goal, language, and optional interests. Each editable section should link to its owning step. Keep this versioned object separate from the existing generation payload until its consumers are migrated.
