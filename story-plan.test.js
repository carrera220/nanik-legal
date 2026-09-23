const assert = require('node:assert/strict');
const test = require('node:test');
const contract = require('./story-plan.js');
test('confirmed child facts and selected direction remain separate from fiction', () => {
  const plan = contract.build({ age: '6', name: 'Mia', gender: 'girl', likes: 'Drawing, drawing, plants', purposeKey: 'learn', intentKey: 'adventure' }, { heroPick: 'kid', image: 'private-image' }, [{ field: 'topic', question: 'Explore?', answer: 'Plants', source: 'chip', offeredChips: ['Plants', 'Space'] }], 'hy', 'en');
  assert.equal(plan.schemaVersion, 2);
  assert.equal(plan.audience.age, 6);
  assert.equal(plan.hero.name, 'Mia');
  assert.equal(plan.uiLanguage, 'hy');
  assert.equal(plan.storyLanguage, 'en');
  assert.deepEqual(plan.child.interests, ['Drawing', 'plants']);
  assert.equal(plan.child.gender, 'girl');
  assert.equal(plan.direction.answer, 'Plants');
  assert(!JSON.stringify(plan).includes('private-image'));
  assert(!JSON.stringify(plan).includes('Space'));
});
test('surprise excludes previous support and child facts from hero', () => {
  const plan = contract.build({ intentKey: 'surprise', purposeKey: 'today', name: 'Old name', gender: 'girl' }, { heroPick: 'surprise' }, [{ field: 'support', answer: 'Old support' }], 'en', 'en');
  assert.equal(plan.direction, null);
  assert.equal(plan.hero.name, null);
});
test('audience gender survives a hero the child is not', () => {
  const plan = contract.build({ gender: 'boy' }, { heroPick: 'madeup', madeUpName: 'Pip' }, [], 'en', 'en');
  assert.equal(plan.child.gender, 'boy');
  assert.equal(plan.hero.mode, 'created');
});
test('audience gender falls back to the guided state when the planner has none', () => {
  const plan = contract.build({}, { heroPick: 'surprise', childGender: 'girl' }, [], 'en', 'en');
  assert.equal(plan.child.gender, 'girl');
});
test('created hero preserves structured inputs', () => {
  const plan = contract.build({}, { heroPick: 'madeup', madeUpName: 'Pip', madeUpType: 'Animal', madeUpDescription: 'Blue wings' }, [], 'en', 'en');
  assert.equal(plan.hero.name, 'Pip');
  assert.equal(plan.hero.characterType, 'Animal');
  assert.equal(plan.hero.description, 'Blue wings');
});
test('child-as-hero locks a gendered human description', () => {
  const plan = contract.build(
    { name: 'Mia', gender: 'girl' },
    { heroPick: 'kid' },
    [],
    'en',
    'en',
  );
  assert.equal(plan.hero.mode, 'child');
  assert.equal(plan.hero.characterType, 'human child');
  assert.equal(plan.hero.description, 'a human girl');
});
test('anything else about the child reaches additional context', () => {
  const plan = contract.build({}, { heroPick: 'surprise', about: 'Just started swimming lessons' }, [], 'en', 'en');
  assert.equal(plan.additionalContext, 'Just started swimming lessons');
});
