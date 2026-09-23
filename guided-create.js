(function () {
  "use strict";

  var HERO_LABELS = {
    kid: "My child is the hero",
    child: "My child is the hero",
    toy: "Their toy",
    animal: "An animal",
    imaginary: "Create hero",
    madeup: "Create hero",
    describe: "Describe the character",
  };
  var GENERATION_COPY = [
    "Understanding your idea…",
    "Finding the right adventure…",
    "Building their story world…",
    "Bringing characters to life…",
    "Adding finishing touches…",
  ];
  var GENERATION_COPY_HY = [
    "Կարդում եմ գաղափարը…",
    "Գտնում եմ արկածը…",
    "Կառուցում եմ հեքիաթի աշխարհը…",
    "Կենդանացնում եմ հերոսներին…",
    "Վերջին շտրիխներն եմ դնում…",
  ];
  var PARTICLE_COLORS = ["#8FC0FF", "#C9A6FF", "#FFD8A6", "#FFFFFF", "#7FE3FF", "#B49BFF"];
  var PROGRESS_PARTICLE_COUNT = 110;
  var particleSpecs = null;

  var INTENT_HINTS = [
    "A story about starting school tomorrow…",
    "Something to help with being afraid of the dark…",
    "A magical adventure with a friendly dragon…",
  ];
  var INTENT_HINTS_HY = [
    "Հեքիաթ վաղվա դպրոցի մասին…",
    "Մի բան, որ մթից չվախենա…",
    "Կախարդական արկած բարի վիշապի հետ…",
  ];
  var INTENT_LABELS_HY = {
    Bedtime: "Քնելուց առաջ",
    Adventure: "Արկածային",
    Comedy: "Զվարճալի",
    "Funny & Silly": "Զվարճալի",
    "Animals & Magic": "Կենդանիներ",
    "Classic Folklore & Legends": "Ժողովրդական հեքիաթներ",
    "Surprise Me": "Անակնկալ",
  };
  var INTENT_LABELS = {
    Bedtime: "Bedtime",
    Adventure: "Adventure",
    Comedy: "Comedy",
    "Funny & Silly": "Comedy",
    "Animals & Magic": "Animals",
    "Classic Folklore & Legends": "Folklore & Legends",
    "Surprise Me": "Surprise Me",
  };
  var INTENT_DESC = {
    Bedtime: "Designed to help children wind down",
    Adventure: "Quests, mysteries, and discoveries",
    Comedy: "Stories full of laughs and surprises",
    "Funny & Silly": "Stories full of laughs and surprises",
    "Animals & Magic": "Enchanted worlds, and magical friends.",
    "Classic Folklore & Legends": "Inspired by myths, traditions, and folk stories",
    "Surprise Me": "Create something unexpected.",
  };
  var INTENT_DESC_HY = {
    Bedtime: "Երեխաներին քնելուն պատրաստելու",
    Adventure: "Որոնումներ, առեղծվածներ և բացահայտումներ",
    Comedy: "Ծիծաղով լի հեքիաթներ",
    "Funny & Silly": "Ծիծաղով լի հեքիաթներ",
    "Animals & Magic": "Կախարդական կենդանական աշխարհ",
    "Classic Folklore & Legends": "Ժողովրդական պատմություններ",
    "Surprise Me": "Ստեղծիր մի անսպասելի հեքիաթ։",
  };
  var PURPOSE_LABELS_HY = {
    "Help with something happening today": "Օգնել հասկանալ",
    "Help them learn or understand something": "Սովորել նոր բան",
    "Just create a great story": "Պարզապես ստեղծել հիանալի հեքիաթ",
  };
  var PURPOSE_DESC = {
    "Help with something happening today": "Turn a real situation or challenge into a story.",
    "Help them learn or understand something": "Explore an idea, skill, or lesson through the story.",
    "Just create a great story": "No specific goal — make it fun and engaging.",
  };
  var PURPOSE_DISPLAY_TITLES = {
    "Help with something happening today": "Gently support",
    "Help them learn or understand something": "Lear smth. new",
    "Just create a great story": "Just create a great story",
  };
  var PURPOSE_DISPLAY_DESC = {
    "Help with something happening today": "Turn a real situation or feeling into a story",
    "Help them learn or understand something": "Help learn something through the story",
    "Just create a great story": "No specific goal - make it fun, engaging, and memorable.",
  };
  var PURPOSE_DESC_HY = {
    "Help with something happening today": "Իրական իրավիճակը կամ մարտահրավերը դարձրու հեքիաթ։",
    "Help them learn or understand something": "Հեքիաթի միջոցով ուսումնասիրիր գաղափար, հմտություն կամ դաս։",
    "Just create a great story": "Առանց հատուկ նպատակի՝ զվարճալի և հետաքրքիր։",
  };
  var PURPOSE_KEYS = {
    "Help with something happening today": "today",
    "Help them learn or understand something": "learn",
    "Just create a great story": "fun",
  };
  var PURPOSE_CHIP_FALLBACKS = {
    today: [
      { emoji: "🎒", label: "Starting school" },
      { emoji: "👶", label: "A new sibling" },
      { emoji: "🏠", label: "A big change at home" },
      { emoji: "👫", label: "A hard moment with friends" },
      { emoji: "🌙", label: "Feeling worried tonight" },
    ],
    learn: [
      { emoji: "🌟", label: "Being brave" },
      { emoji: "🤝", label: "Making friends" },
      { emoji: "💬", label: "Sharing feelings" },
      { emoji: "🧠", label: "Trying something new" },
      { emoji: "❤️", label: "Being kind" },
    ],
  };
  var PURPOSE_CHIP_FALLBACKS_HY = {
    today: [
      { emoji: "🎒", label: "Դպրոց սկսելը" },
      { emoji: "👶", label: "Նոր եղբայր կամ քույր" },
      { emoji: "🏠", label: "Փոփոխություն տանը" },
      { emoji: "👫", label: "Դժվար պահ ընկերների հետ" },
      { emoji: "🌙", label: "Այսօր անհանգիստ է" },
    ],
    learn: [
      { emoji: "🌟", label: "Խիզախ լինելը" },
      { emoji: "🤝", label: "Ընկերներ ձեռք բերելը" },
      { emoji: "💬", label: "Զգացումներով կիսվելը" },
      { emoji: "🧠", label: "Նոր բան փորձելը" },
      { emoji: "❤️", label: "Բարի լինելը" },
    ],
  };
  var HERO_HINTS = [
    "A shy dragon who loves bedtime…",
    "Their favorite stuffed bunny…",
    "A brave little fox with a red cape…",
  ];
  var HERO_HINTS_HY = [
    "Ամաչկոտ վիշապ, որ սիրում է քնել…",
    "Սիրելի նապաստակը…",
    "Խիզախ փոքրիկ աղվես կարմիր թիկնոցով…",
  ];
  var ABOUT_HINTS = [
    "They just turned four…",
    "Starting school next week…",
    "Loves their little dog…",
  ];
  var ABOUT_HINTS_HY = [
    "Չորս տարեկան է…",
    "Հաջորդ շաբաթ դպրոց է գնում…",
    "Սիրում է իր շնիկին…",
  ];
  var INTEREST_HINTS = [
    "Dinosaurs and drawing…",
    "The ocean at bedtime…",
    "Building things with dad…",
  ];
  var INTEREST_HINTS_HY = [
    "Դինոզավրեր և նկարել…",
    "Ծովը քնելուց առաջ…",
    "Հայրիկի հետ կառուցել…",
  ];
  var SUPPORT_HINTS = [
    "Feeling brave at school…",
    "A calm bedtime…",
    "Making a new friend…",
  ];
  var SUPPORT_HINTS_HY = [
    "Դպրոցում համարձակ զգալ…",
    "Հանգիստ քուն…",
    "Նոր ընկեր գտնել…",
  ];
  var hintTimer = 0;
  var hintIndex = 0;

  function storyOpt(emoji, label, next) {
    var node = { emoji: emoji, label: label, value: label };
    if (next) node.next = next;
    return node;
  }

  function storyAsk(title, options) {
    return { title: title, options: options };
  }

  var STORY_TREE = {
    "Discover something new": storyAsk("What would you like them to discover?", [
      storyOpt("🐾", "Animals & nature", storyAsk("What should they explore?", [
        storyOpt("🦁", "Animals"),
        storyOpt("🐝", "Insects"),
        storyOpt("🌱", "Plants"),
        storyOpt("🌊", "Oceans"),
        storyOpt("🌦", "Weather"),
        storyOpt("🦕", "Dinosaurs"),
      ])),
      storyOpt("🌍", "The world around us", storyAsk("What should they understand better?", [
        storyOpt("🌧", "Rain & weather"),
        storyOpt("🌋", "Earth & volcanoes"),
        storyOpt("🌎", "Countries & cultures"),
        storyOpt("🏙", "Cities & communities"),
        storyOpt("🗺", "Maps & places"),
        storyOpt("🌊", "Rivers & oceans"),
      ])),
      storyOpt("🚀", "Space & science", storyAsk("What should they explore?", [
        storyOpt("🌙", "The Moon"),
        storyOpt("⭐", "Stars"),
        storyOpt("🪐", "Planets"),
        storyOpt("🚀", "Rockets"),
        storyOpt("👩‍🚀", "Astronauts"),
        storyOpt("🔬", "Experiments"),
      ])),
      storyOpt("⚙️", "How things work", storyAsk("What are they curious about?", [
        storyOpt("✈️", "Airplanes"),
        storyOpt("🚗", "Cars"),
        storyOpt("⚡", "Electricity"),
        storyOpt("⏰", "Clocks"),
        storyOpt("🏗", "Buildings"),
        storyOpt("🤖", "Robots"),
      ])),
      storyOpt("❤️", "Life skills & kindness", storyAsk("What should the story gently teach?", [
        storyOpt("🤝", "Sharing"),
        storyOpt("💛", "Kindness"),
        storyOpt("⏳", "Patience"),
        storyOpt("💪", "Trying again"),
        storyOpt("👂", "Listening"),
        storyOpt("🌟", "Confidence"),
      ])),
      storyOpt("🧠", "Body & mind", storyAsk("What should they discover?", [
        storyOpt("😴", "Why we sleep"),
        storyOpt("🍎", "Healthy food"),
        storyOpt("🫁", "Breathing"),
        storyOpt("❤️", "How the body works"),
        storyOpt("🧠", "How we learn"),
        storyOpt("😊", "Understanding emotions"),
      ])),
    ]),
    "Help with a feeling": storyAsk("What feeling should the story help with?", [
      storyOpt("😟", "Worried", storyAsk("What are they worried about?", [
        storyOpt("🌱", "Trying something new"),
        storyOpt("🏫", "School"),
        storyOpt("💛", "Being away from you"),
        storyOpt("😬", "Making a mistake"),
        storyOpt("👥", "Meeting new people"),
        storyOpt("🩺", "Doctor or dentist"),
      ])),
      storyOpt("😢", "Sad", storyAsk("What made them feel sad?", [
        storyOpt("💛", "Missing someone"),
        storyOpt("👫", "Trouble with a friend"),
        storyOpt("🚪", "Saying goodbye"),
        storyOpt("🧸", "Losing something"),
        storyOpt("🥺", "Feeling left out"),
        storyOpt("💔", "Being disappointed"),
      ])),
      storyOpt("😡", "Angry", storyAsk("What made them feel angry?", [
        storyOpt("🚫", "Being told “no”"),
        storyOpt("🧸", "Someone took something"),
        storyOpt("👫", "A problem with a friend"),
        storyOpt("👧", "A problem with a sibling"),
        storyOpt("⚖️", "Something felt unfair"),
        storyOpt("😤", "Things didn't go their way"),
      ])),
      storyOpt("🫣", "Shy", storyAsk("When do they feel shy?", [
        storyOpt("👋", "Meeting new people"),
        storyOpt("🏫", "At school"),
        storyOpt("🎤", "Speaking in front of others"),
        storyOpt("👫", "Joining a group"),
        storyOpt("💬", "Asking for something"),
        storyOpt("🎉", "At parties or events"),
      ])),
      storyOpt("🥺", "Lonely", storyAsk("When do they feel lonely?", [
        storyOpt("💛", "Missing someone"),
        storyOpt("🛝", "No one to play with"),
        storyOpt("🏫", "Being somewhere new"),
        storyOpt("🏠", "Away from family"),
        storyOpt("🥺", "Feeling left out"),
        storyOpt("🌙", "At bedtime"),
      ])),
      storyOpt("😨", "Scared", storyAsk("What feels scary?", [
        storyOpt("🌙", "The dark"),
        storyOpt("👻", "Monsters"),
        storyOpt("🌩", "Loud sounds"),
        storyOpt("🩺", "Doctor or dentist"),
        storyOpt("🐶", "Animals"),
        storyOpt("🛏", "Sleeping alone"),
      ])),
    ]),
    "Engaging adventure": storyAsk("What should make the adventure special?", [
      storyOpt("🦄", "A magical creature", storyAsk("Who should they meet?", [
        storyOpt("🐉", "Dragon"),
        storyOpt("🦄", "Unicorn"),
        storyOpt("🧚", "Fairy"),
        storyOpt("🐻", "Talking animal"),
        storyOpt("👻", "Friendly monster"),
        storyOpt("🧜", "Mermaid"),
      ])),
      storyOpt("🐾", "A favorite animal", storyAsk("Who should join them?", [
        storyOpt("🐶", "Dog"),
        storyOpt("🐱", "Cat"),
        storyOpt("🦕", "Dinosaur"),
        storyOpt("🐬", "Dolphin"),
        storyOpt("🦁", "Lion"),
        storyOpt("🦊", "Fox"),
      ])),
      storyOpt("🗺", "A mysterious place", storyAsk("Where should the adventure begin?", [
        storyOpt("🌲", "Enchanted forest"),
        storyOpt("🌊", "Under the sea"),
        storyOpt("🚀", "Outer space"),
        storyOpt("🏰", "Hidden kingdom"),
        storyOpt("🏝", "Secret island"),
        storyOpt("☁️", "City in the clouds"),
      ])),
      storyOpt("💛", "Someone they love", storyAsk("Who should join the adventure?", [
        storyOpt("👩", "Mom"),
        storyOpt("👨", "Dad"),
        storyOpt("👧", "Sibling"),
        storyOpt("👵", "Grandparent"),
        storyOpt("👫", "Friend"),
        storyOpt("👨‍👩‍👧", "Whole family"),
      ])),
      storyOpt("🔮", "A magical object", storyAsk("What should they discover?", [
        storyOpt("🗝", "Magic key"),
        storyOpt("🧹", "Flying broom"),
        storyOpt("🗺", "Secret map"),
        storyOpt("📖", "Magic book"),
        storyOpt("💎", "Wishing stone"),
        storyOpt("🚪", "Magic door"),
      ])),
      storyOpt("🏴‍☠️", "A secret mission", storyAsk("What should their mission be?", [
        storyOpt("💎", "Find a treasure"),
        storyOpt("🐉", "Rescue a creature"),
        storyOpt("🏰", "Save a kingdom"),
        storyOpt("🔍", "Solve a mystery"),
        storyOpt("⭐", "Find a lost star"),
        storyOpt("🌍", "Discover a new world"),
      ])),
    ]),
    "Something calm for bedtime": storyAsk("What would feel peaceful tonight?", [
      storyOpt("🧸", "Cozy & warm", storyAsk("What should make it cozy?", [
        storyOpt("🧸", "Favorite toy"),
        storyOpt("🐶", "Gentle pet"),
        storyOpt("🏡", "Warm little home"),
        storyOpt("🔥", "Cozy fireplace"),
        storyOpt("🌧", "Rain outside"),
        storyOpt("🛏", "Soft sleepy bed"),
      ])),
      storyOpt("🌿", "Gentle nature", storyAsk("Where should the story happen?", [
        storyOpt("🌲", "Forest"),
        storyOpt("🌼", "Meadow"),
        storyOpt("⛰", "Mountains"),
        storyOpt("🌊", "By the sea"),
        storyOpt("🌷", "Garden"),
        storyOpt("🌙", "Quiet lake"),
      ])),
      storyOpt("☁️", "A peaceful journey", storyAsk("Where should they gently travel?", [
        storyOpt("☁️", "Through the clouds"),
        storyOpt("⭐", "Across the stars"),
        storyOpt("🚤", "Along a quiet river"),
        storyOpt("🌲", "Through a sleepy forest"),
        storyOpt("🌙", "To the Moon"),
        storyOpt("🐋", "Across the ocean"),
      ])),
      storyOpt("💛", "Feeling safe", storyAsk("What should bring comfort?", [
        storyOpt("👨‍👩‍👧", "Family"),
        storyOpt("🧸", "Favorite toy"),
        storyOpt("🐶", "A pet"),
        storyOpt("🏡", "Home"),
        storyOpt("🌙", "Bedtime routine"),
        storyOpt("🤗", "A warm hug"),
      ])),
      storyOpt("🐾", "A gentle animal friend", storyAsk("Who should help them fall asleep?", [
        storyOpt("🐻", "Little bear"),
        storyOpt("🐰", "Bunny"),
        storyOpt("🦊", "Fox"),
        storyOpt("🐑", "Lamb"),
        storyOpt("🦉", "Owl"),
        storyOpt("🐋", "Whale"),
      ])),
    ]),
  };

  STORY_TREE["Learn something through a story"] = STORY_TREE["Discover something new"];
  STORY_TREE["A feeling they’re having"] = STORY_TREE["Help with a feeling"];
  STORY_TREE["A magical adventure"] = STORY_TREE["Engaging adventure"];
  STORY_TREE["A calm bedtime story"] = STORY_TREE["Something calm for bedtime"];
  STORY_TREE.Bedtime = STORY_TREE["Something calm for bedtime"];
  STORY_TREE.Adventure = STORY_TREE["Engaging adventure"];
  STORY_TREE["Animals & Magic"] = STORY_TREE["Engaging adventure"];
  STORY_TREE["Classic Folklore & Legends"] = STORY_TREE["Discover something new"];
  STORY_TREE["Surprise Me"] = STORY_TREE["Engaging adventure"];
  STORY_TREE["Fairy Tales & Magic"] = STORY_TREE["Engaging adventure"];
  STORY_TREE["Mystery & Discovery"] = STORY_TREE["Discover something new"];

  function storyBranch() {
    return STORY_TREE[planner.intentLabel || state.intent] || null;
  }

  function selectedTopic() {
    var branch = storyBranch();
    var topic = planner.intentKey === "emotional_support" ? (planner.emotion || state.topic) : (planner.topic || state.topic);
    if (!branch || !topic) return null;
    for (var i = 0; i < branch.options.length; i++) {
      if (branch.options[i].value === topic) return branch.options[i];
    }
    return null;
  }

  function rememberChild(options) {
    var opts = options || {};
    var force = !!opts.force;
    var age = parseInt(planner.age, 10);
    if (age < 2 || age > 16) return;
    var draft = window.NANIK_DRAFT || {};
    var kids = listChildProfiles();
    var hasExisting = kids.length > 0;
    var updatingKnown = !!(planner.childId && kids.some(function (kid) {
      return kid && kid.id === planner.childId;
    }));
    // First-time age selection: keep answers in memory only until a story is created.
    if (!force && !hasExisting && !updatingKnown) {
      if (draft.setAge) draft.setAge(age);
      return;
    }
    if (draft.setChild) {
      var likes = planner.likes || (state.interests && state.interests.length ? state.interests.join(", ") : "") || "";
      var photo = state.image || (draft.getImage ? draft.getImage() : "") || "";
      draft.setChild({
        id: planner.childId || "",
        name: planner.name || state.childName || "",
        age: age,
        likes: likes,
        gender: planner.gender || state.childGender || "",
        photo: photo,
      });
      var saved = draft.getChild ? draft.getChild() : null;
      if (saved && saved.id) planner.childId = saved.id;
    } else if (draft.setAge) {
      draft.setAge(age);
    }
  }

  function persistChildAfterStory() {
    var age = parseInt(planner.age, 10);
    if (!(age >= 2 && age <= 16)) return;
    rememberChild({ force: true });
  }

  function namedChildProfiles() {
    return listChildProfiles().filter(function (kid) {
      return !!(kid && String(kid.name || "").trim());
    });
  }

  var heroKidFormMode = false;

  function shouldShowHeroProfilePicker() {
    return !heroKidFormMode && namedChildProfiles().length > 0;
  }

  function applyHeroChildProfile(child) {
    if (!child) return;
    var draft = window.NANIK_DRAFT || {};
    if (draft.selectChild && child.id) draft.selectChild(child.id);
    else if (draft.setChild) draft.setChild(child);
    planner.childId = child.id || planner.childId || "";
    if (child.age) {
      planner.age = String(child.age);
      sources.age = "profile";
      state.age = planner.age;
      if (el("guided-age")) el("guided-age").value = planner.age;
      syncAgeChips(planner.age);
    }
    planner.name = child.name || "";
    sources.name = child.name ? "profile" : sources.name;
    state.childName = planner.name;
    if (el("guided-child-name")) el("guided-child-name").value = planner.name;
    planner.likes = child.likes || "";
    sources.likes = child.likes ? "profile" : sources.likes;
    state.interests = child.likes ? child.likes.split(/\s*,\s*/).filter(Boolean) : [];
    state.childGender = child.gender || state.childGender || "";
    planner.gender = state.childGender;
    sources.gender = state.childGender ? "profile" : sources.gender;
    state.image = child.photo || "";
    if (draft.setImage) draft.setImage(state.image);
    state.heroPick = "kid";
    state.heroKind = "kid";
    planner.hero = planner.name || "My child";
    sources.hero = "profile";
    syncSharedPlanner();
    rememberChild();
  }

  function openHeroChildEditor(child) {
    if (!child) return;
    applyHeroChildProfile(child);
    heroKidFormMode = true;
    paintHeroStep();
    setError("");
  }

  function listChildProfiles() {
    var draft = window.NANIK_DRAFT || {};
    if (typeof draft.getChildren === "function") return draft.getChildren() || [];
    var one = draft.getChild ? draft.getChild() : null;
    return one ? [one] : [];
  }

  function ageYearsLabel(age) {
    var n = parseInt(age, 10);
    if (!(n >= 2 && n <= 16)) return "";
    if (isArmenianUi()) return n + " տարեկան";
    return n === 1 ? "1 year old" : n + " years old";
  }

  var addingNewProfile = false;

  function shouldShowProfilePicker() {
    return listChildProfiles().length > 0 && !addingNewProfile;
  }

  function applySelectedProfile(child) {
    if (!child) return;
    var draft = window.NANIK_DRAFT || {};
    if (draft.selectChild && child.id) draft.selectChild(child.id);
    else if (draft.setChild) draft.setChild(child);
    planner.childId = child.id || "";
    planner.age = String(child.age);
    planner.name = child.name || "";
    sources.age = "profile";
    sources.name = child.name ? "profile" : "";
    state.age = planner.age;
    state.childName = planner.name;
    if (el("guided-age")) el("guided-age").value = planner.age;
    if (el("guided-child-name")) el("guided-child-name").value = planner.name;
    planner.likes = child.likes || planner.likes || "";
    if (child.likes) {
      sources.likes = "profile";
      state.interests = child.likes.split(/\s*,\s*/).filter(Boolean);
    }
    if (child.gender) {
      state.childGender = child.gender;
      planner.gender = child.gender;
      sources.gender = "profile";
    }
    if (child.photo) {
      state.image = child.photo;
      if (draft.setImage) draft.setImage(child.photo);
    }
    syncAgeChips(planner.age);
    syncSharedPlanner();
    rememberChild();
  }

  function paintProfilePicker() {
    var pick = el("guided-profile-pick");
    var form = el("guided-age-form");
    var list = el("guided-profile-list");
    var addLabel = el("guided-profile-add-label");
    var title = el("guided-step-title");
    var section = document.querySelector('[data-guided-step="basics"]');
    var kids = listChildProfiles();
    var showPicker = shouldShowProfilePicker();
    if (pick) pick.hidden = !showPicker;
    if (form) form.hidden = showPicker;
    if (addLabel) {
      addLabel.textContent = isArmenianUi() ? "Ավելացնել նոր պրոֆիլ" : "Add new profile";
    }
    var addBtn = el("guided-profile-add");
    if (addBtn) {
      var quota = window.NANIK_QUOTA_STATE;
      var isPlus = !!(quota && quota.isPlus);
      var atLimit = kids.length >= 10;
      var locked = kids.length >= 1 && !isPlus;
      addBtn.hidden = atLimit;
      addBtn.setAttribute("aria-hidden", atLimit ? "true" : "false");
      addBtn.classList.toggle("is-locked", locked && !atLimit);
    }
    if (section) {
      section.setAttribute(
        "data-guided-title",
        showPicker
          ? (isArmenianUi() ? "Ո՞ւմ համար է հեքիաթը։" : "Whose story is this?")
          : (isArmenianUi() ? "Նշեք երեխայի տարիքը" : "How old is your kid?")
      );
    }
    if (title && stepKey === "basics") {
      title.textContent = section ? section.getAttribute("data-guided-title") || "" : title.textContent;
    }
    if (!list) return;
    if (!showPicker) {
      list.innerHTML = "";
      return;
    }
    var activeId = planner.childId || (window.NANIK_DRAFT && window.NANIK_DRAFT.getChild && window.NANIK_DRAFT.getChild() && window.NANIK_DRAFT.getChild().id) || "";
    list.className = "guided-profile-list dash-kids-hero-cards";
    list.innerHTML = kids.map(function (kid) {
      var selected = kid.id === activeId || (!activeId && String(kid.age) === String(planner.age));
      var title = kid.name || ageYearsLabel(kid.age);
      var desc = kid.name ? ageYearsLabel(kid.age) : kid.likes || "";
      if (kid.name && kid.likes) desc = ageYearsLabel(kid.age);
      var media = kid.photo
        ? '<img src="' +
          String(kid.photo).replace(/"/g, "&quot;") +
          '" alt="" loading="lazy" decoding="async">'
        : '<img src="images/intent-cards/my-child-transparent.png?v=20260915alpha" alt="" width="1024" height="1024" loading="lazy" decoding="async">';
      return (
        '<button type="button" class="dash-kids-hero-card guided-profile-card' +
        (selected ? " is-on is-active" : "") +
        '" role="radio" aria-checked="' +
        (selected ? "true" : "false") +
        '" data-child-id="' +
        escapeHtml(kid.id) +
        '">' +
        '<span class="dash-kids-hero-media" aria-hidden="true">' +
        media +
        "</span>" +
        '<span class="dash-kids-hero-copy">' +
        '<strong class="dash-kids-hero-title">' +
        escapeHtml(title) +
        "</strong>" +
        (desc
          ? '<span class="dash-kids-hero-desc">' + escapeHtml(desc) + "</span>"
          : "") +
        "</span>" +
        '<span class="dash-kids-hero-arrow" aria-hidden="true">&#8594;</span>' +
        "</button>"
      );
    }).join("");
  }

  function ageChipValue(age) {
    var n = parseInt(age, 10);
    if (n >= 12 && n <= 16) return "12";
    if (n >= 2 && n <= 11) return String(n);
    return "";
  }

  function syncAgeChips(age) {
    var selected = ageChipValue(age);
    document.querySelectorAll("[data-guided-age]").forEach(function (button) {
      var on = button.getAttribute("data-guided-age") === selected;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function hasIntent() {
    return !!(planner.intentKey || planner.idea || planner.intentLabel || state.intent);
  }

  function hasChildProfile() {
    var draft = window.NANIK_DRAFT || {};
    var child = draft.getChild ? draft.getChild() : null;
    var age = child && parseInt(child.age, 10);
    return !!(age >= 2 && age <= 16);
  }


  function needsFollowup() {
    return !!(aiQuestion && aiQuestion.title && !aiQuestion.enough && !followupAnswered);
  }

  function purposeKey() {
    return planner.purposeKey || PURPOSE_KEYS[state.purpose] || "";
  }

  function isFunPurpose() {
    return purposeKey() === "fun";
  }

  function needsPurposeQuestion() {
    var key = purposeKey();
    return (key === "today" || key === "learn") && !followupAnswered;
  }

  function flowSteps() {
    var steps = ["basics", "intent"];
    if (hasIntent() || stepKey === "purpose" || history.indexOf("purpose") >= 0) steps.push("purpose");
    if (
      (hasIntent() && state.purpose && needsPurposeQuestion()) ||
      needsFollowup() ||
      stepKey === "topic" ||
      history.indexOf("topic") >= 0
    ) {
      steps.push("topic");
    }
    if (
      (hasIntent() && state.purpose && (isFunPurpose() || followupAnswered || history.indexOf("topic") >= 0)) ||
      stepKey === "hero" ||
      history.indexOf("hero") >= 0
    ) {
      steps.push("hero");
    }
    steps.push("plan");
    return steps.filter(function (key, index, list) { return list.indexOf(key) === index; });
  }

  function currentKey() {
    return stepKey || flowSteps()[stepIndex] || "";
  }

  var stepIndex = 0;
  var finished = false;
  var generationTimer = 0;
  var autoAdvanceTimer = 0;
  var choiceTransitionActive = false;
  var choiceTransitionClone = null;
  var choiceTransitionFadeTimer = 0;
  var topicChipsLoading = false;
  var generationIndex = 0;
  var generationProgress = 8;
  var state = {
    intent: "",
    purpose: "",
    childName: "",
    age: "",
    lang: "en",
    heroKind: "",
    heroPick: "",
    heroDescription: "",
    childGender: "",
    image: "",
    interests: [],
    world: "",
    topic: "",
    detail: "",
    about: "",
    discover: "",
    feeling: "",
    adventure: "",
    bedtime: "",
    support: "",
  };
  var planner = emptyPlanner();
  var sources = {};
  var stepKey = "basics";
  var history = ["basics"];
  var INTENT_KEYS = {
    Bedtime: "bedtime",
    Adventure: "adventure",
    Comedy: "funny",
    "Funny & Silly": "funny",
    "Animals & Magic": "animals",
    "Classic Folklore & Legends": "folklore",
    "Surprise Me": "surprise",
    // Legacy labels still accepted from drafts / analyzer aliases.
    Animals: "animals",
    "Fairy Tales & Magic": "animals",
    Superheroes: "adventure",
    "Mystery & Discovery": "adventure",
    "Something magical from their day": "day",
    "A feeling they’re having": "emotional_support",
    "A magical adventure": "adventure",
    "A funny story": "funny",
    "Learn something through a story": "discover",
    "Something new they’re facing": "new",
    "A calm bedtime story": "bedtime",
  };
  var INTENT_BY_KEY = {
    bedtime: "Bedtime",
    adventure: "Adventure",
    funny: "Comedy",
    animals: "Animals & Magic",
    fairy: "Animals & Magic",
    folklore: "Classic Folklore & Legends",
    superheroes: "Adventure",
    mystery: "Adventure",
    surprise: "Surprise Me",
    day: "Surprise Me",
    emotional_support: "Bedtime",
    discover: "Classic Folklore & Legends",
    new: "Adventure",
    custom: "",
  };
  var STRONG_SOURCES = { chip: 1, edit: 1, draft: 1, select: 1 };
  var analyzing = false;
  var aiQuestion = null;
  var visibleQuestion = null;
  var heroQuestion = null;
  var purposeChipPromise = null;
  var purposeChipKind = "";
  var purposeChipRequestId = 0;
  var purposeShownChips = { today: [], learn: [] };
  var toyPhotoChosen = false;
  var followupAnswered = false;
  var followupCount = 0;
  var FOLLOWUP_MAX = 2;
  var SUPPORT_CHIPS = [
    { emoji: "⭐", label: "Feeling more confident" },
    { emoji: "🌙", label: "Feeling safe at night" },
    { emoji: "🤝", label: "Making a new friend" },
    { emoji: "💛", label: "Being kind to others" },
    { emoji: "🌱", label: "Trying something new" },
  ];
  var SUPPORT_CHIPS_HY = [
    { emoji: "⭐", label: "Ավելի վստահ զգալ" },
    { emoji: "🌙", label: "Գիշերը ապահով լինել" },
    { emoji: "🤝", label: "Նոր ընկեր գտնել" },
    { emoji: "💛", label: "Բարի լինել ուրիշներին" },
    { emoji: "🌱", label: "Նոր բան փորձել" },
  ];
  var followupAnswers = [];
  var directorSequence = 0;
  var latestTypedContext = "";
  var FOLLOWUP_FIELDS = { emotion: 1, topic: 1, context: 1, setting: 1, companion: 1, mood: 1, likes: 1, support: 1 };
  var CHIP_COUNT = 5;
  var AGE_WORDS = {
    two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
    erku: 2, yereq: 3, erek: 3, chors: 4, hing: 5, vec: 6, vets: 6, yot: 7, ut: 8, inn: 9, tas: 10,
    dva: 2, tri: 3, chetyre: 4, pyat: 5, shest: 6, sem: 7, vosem: 8, devyat: 9, desyat: 10,
  };
  var ANALYZER_SYSTEM = [
    "Extract story-planner fields from a parent's free-text input.",
    "Return one JSON object and nothing else. No markdown.",
    "Keys: intentKey, name, age, hero, companion, setting, emotion, topic, context, mood, language.",
    "Use an empty string for anything not stated in the text.",
    "intentKey must be bedtime, adventure, funny, animals, folklore, surprise, fairy, day, emotional_support, discover, new, custom, or empty.",
    "language is the language of this input as an ISO 639-1 code (hy, en, ru, es, fr, de, and so on).",
    "Detect transliterated text: Armenian written in Latin letters is hy, Russian written in Latin letters is ru.",
    "Do not use the page language. Use the language the user actually wrote in.",
    "Never invent a name, age, hero, companion, or any other personal fact that is not in the text.",
    "Do not fill locked fields. Return an empty string for those keys.",
    "Keep phrases short. age is digits only, or empty.",
  ].join(" ");
  var NAME_STOP = { He: 1, She: 1, They: 1, It: 1, This: 1, That: 1, His: 1, Her: 1, The: 1, A: 1, An: 1, And: 1, Because: 1 };

  function emptyPlanner() {
    return {
      childId: "",
      name: "",
      age: "",
      hero: "",
      companion: "",
      intentKey: "",
      intentLabel: "",
      emotion: "",
      topic: "",
      context: "",
      setting: "",
      mood: "",
      language: "en",
      likes: "",
      support: "",
      idea: "",
      gender: "",
      purpose: "",
      purposeKey: "",
    };
  }

  function plannerInput() {
    return {
      intent: planner.intentKey || "custom",
      intentLabel: planner.intentLabel || "",
      age: planner.age || "",
      hero: planner.hero || "",
      companion: planner.companion || "",
      setting: planner.setting || "",
      emotion: planner.emotion || "",
      topic: planner.topic || "",
      context: planner.context || "",
      mood: planner.mood || "",
      language: planner.language || state.lang || "en",
      name: planner.name || "",
      likes: planner.likes || "",
      support: planner.support || "",
      idea: planner.idea || "",
      gender: planner.gender || state.childGender || "",
      purpose: planner.purpose || state.purpose || "",
      purposeKey: planner.purposeKey || "",
    };
  }

  function syncSharedPlanner() {
    var snapshot = plannerInput();
    window.NANIK_STORY_PLANNER = snapshot;
    try {
      window.dispatchEvent(new CustomEvent("nanik:plannerchange", { detail: snapshot }));
    } catch (e) {}
    return snapshot;
  }

  function titleWord(value) {
    return String(value || "").replace(/\b[a-z]/g, function (ch) { return ch.toUpperCase(); });
  }

  function tidyPhrase(value) {
    var text = String(value || "").replace(/\s+/g, " ").trim();
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function extractFromText(text) {
    var raw = String(text || "").replace(/\s+/g, " ").trim();
    var found = {};
    if (!raw || isWelcomePrompt(raw)) return found;
    var lower = raw.toLowerCase();
    found.idea = raw;

    var named = raw.match(/\b([A-Z][a-z]{1,20})\s+is\s+(\d{1,2})\b/);
    if (named && !NAME_STOP[named[1]]) {
      var namedAge = parseInt(named[2], 10);
      if (namedAge >= 2 && namedAge <= 16) {
        found.name = named[1];
        found.age = String(namedAge);
        found.hero = named[1];
      }
    }
    if (!found.age) {
      var ageMatch = lower.match(/\b(\d{1,2})\s*(?:years?[- ]?old|years?|yrs?|yo)\b/);
      if (ageMatch) {
        var ageNum = parseInt(ageMatch[1], 10);
        if (ageNum >= 2 && ageNum <= 16) found.age = String(ageNum);
      }
    }
    if (!found.name) {
      var yearOldName = raw.match(/\b(\d{1,2})\s*(?:years?[- ]?old|yo)\s+([A-Z][a-z]{1,20})\b/);
      if (yearOldName && !NAME_STOP[yearOldName[2]]) {
        found.name = yearOldName[2];
        if (!found.hero) found.hero = yearOldName[2];
        var yoAge = parseInt(yearOldName[1], 10);
        if (!found.age && yoAge >= 2 && yoAge <= 16) found.age = String(yoAge);
      }
    }
    if (!found.name) {
      var myChild = raw.match(/\bmy\s+(?:son|daughter|kid|child|boy|girl)\s+([A-Z][a-z]{1,20})\b/);
      if (myChild && !NAME_STOP[myChild[1]]) {
        found.name = myChild[1];
        if (!found.hero) found.hero = myChild[1];
      }
    }
    if (!found.name) {
      var called = raw.match(/\b(?:named|called)\s+([A-Z][a-z]{1,20})\b/);
      if (called && !NAME_STOP[called[1]]) {
        found.name = called[1];
        if (!found.hero) found.hero = called[1];
      }
    }

    var companionMatch = lower.match(/\b(?:his|her|their|a|the)\s+(teddy bear|teddy|stuffed animal|bunny|doll|dragon|unicorn|dog|cat|dinosaur|toy)\b/);
    if (companionMatch) found.companion = companionMatch[1] === "teddy bear" ? "teddy" : titleWord(companionMatch[1]);
    else if (/\bteddy\b/.test(lower)) found.companion = "teddy";

    if (/\b(scared|afraid|frightened|fear)\b/.test(lower)) found.emotion = "Scared";
    else if (/\b(worried|anxious|nervous)\b/.test(lower)) found.emotion = "Worried";
    else if (/\b(sad|upset)\b/.test(lower)) found.emotion = "Sad";
    else if (/\b(angry|mad)\b/.test(lower)) found.emotion = "Angry";
    else if (/\bshy\b/.test(lower)) found.emotion = "Shy";
    else if (/\blonely\b/.test(lower)) found.emotion = "Lonely";

    var context = "";
    var ofMatch = lower.match(/\b(?:scared|afraid|worried|nervous|anxious)\s+of\s+([^.,]+)/);
    if (ofMatch) context = tidyPhrase(ofMatch[1]);
    if (/\bstart(?:ing)? school\b|\bfirst day of school\b/.test(lower)) context = "Starting school";
    else if (/\bthe dark\b/.test(lower)) context = context || "The dark";
    else if (/\b(dentist|doctor)\b/.test(lower)) context = context || "Doctor or dentist";
    else if (/\bmissing (?:someone|grandma|grandpa|mum|mom|dad|you)\b/.test(lower)) context = context || "Missing someone";
    if (context) found.context = context;

    if (/\b(feel(?:ing)?\s+(?:more\s+)?brave|feel(?:ing)?\s+(?:more\s+)?confident|build(?:ing)?\s+confidence|help(?:ing)?\s+(?:her|him|them|with)\s+feel)\b/.test(lower)) {
      if (/\bbrave\b/.test(lower)) found.support = "Feeling braver";
      else if (/\bconfident|confidence\b/.test(lower)) found.support = "Feeling more confident";
    } else if (/\bhelp(?:ing)?\s+(?:her|him|them)?\s*(?:feel\s+)?safe\b/.test(lower)) {
      found.support = "Feeling safe";
    }

    if (found.emotion) {
      found.intentKey = "emotional_support";
      found.intentLabel = "Bedtime";
    } else if (/\b(funny|silly|giggle|laugh|hilarious|humor|humour)\b/.test(lower)) {
      found.intentKey = "funny";
      found.intentLabel = "Comedy";
    } else if (/\b(bedtime|fall asleep|sleepy|calm night|wind down|winding down)\b/.test(lower)) {
      found.intentKey = "bedtime";
      found.intentLabel = "Bedtime";
    } else if (/\b(folklore|legend|myth|tradition|folk tale|folk story)\b/.test(lower)) {
      found.intentKey = "folklore";
      found.intentLabel = "Classic Folklore & Legends";
    } else if (/\b(animal|puppy|kitten|dinosaur|fox|bear|zoo|enchanted|magical friend)\b/.test(lower)) {
      found.intentKey = "animals";
      found.intentLabel = "Animals & Magic";
    } else if (/\b(fairy|castle|spell|dragon|magic|magical)\b/.test(lower)) {
      found.intentKey = "animals";
      found.intentLabel = "Animals & Magic";
    } else if (/\b(adventure|treasure|quest|hero|mystery|discover)\b/.test(lower)) {
      found.intentKey = "adventure";
      found.intentLabel = "Adventure";
    } else if (/\b(their day|today|this morning|after school|surprise)\b/.test(lower)) {
      found.intentKey = "surprise";
      found.intentLabel = "Surprise Me";
    } else if (/\b(starting school|new school|new baby|new sibling|moving)\b/.test(lower)) {
      found.intentKey = "adventure";
      found.intentLabel = "Adventure";
    } else if (/\b(learn|how does|why does|how do)\b/.test(lower)) {
      found.intentKey = "folklore";
      found.intentLabel = "Classic Folklore & Legends";
    }

    if (/\bdinosaur/.test(lower)) found.topic = "Dinosaurs";
    else if (/\bmoon\b/.test(lower)) found.topic = "The Moon";
    else if (/\b(ocean|under the sea)\b/.test(lower)) found.topic = "Oceans";
    else if (/\b(space|planet)\b/.test(lower)) found.topic = "Planets";
    else if (/\brobot/.test(lower)) found.topic = "Robots";
    else if (/\bdragon/.test(lower)) found.topic = "Dragon";

    var setting = lower.match(/\b(forest|ocean|space|home|clouds|kingdom|island)\b/);
    if (setting && !(found.context && found.context.toLowerCase().indexOf(setting[1]) >= 0)) {
      found.setting = titleWord(setting[1]);
    }
    return found;
  }

  function applyExtracted(found) {
    Object.keys(found).forEach(function (key) {
      if (!found[key] || !canFillFromText(key)) return;
      planner[key] = found[key];
      sources[key] = "text";
    });
    if (found.name && sources.name === "text") state.childName = found.name;
    if (found.age && sources.age === "text") state.age = found.age;
    if (found.topic && sources.topic === "text") state.topic = found.topic;
    if (found.intentLabel && sources.intentLabel === "text") state.intent = found.intentLabel;
    if (found.language && sources.language === "text") state.lang = found.language;
    syncSharedPlanner();
  }

  function canFill(key) {
    return !STRONG_SOURCES[sources[key]];
  }

  function canFillFromText(key) {
    // Saved draft/profile defaults should not block explicit typed understanding.
    return canFill(key) || sources[key] === "draft" || sources[key] === "name-default";
  }

  function cleanPhrase(value, max) {
    var text = String(value || "").replace(/\s+/g, " ").trim();
    if (!text || /^(n\/?a|none|unknown|null|undefined)$/i.test(text)) return "";
    if (text.length > (max || 80)) return "";
    return text;
  }

  function mentioned(text, value) {
    var hay = String(text || "").toLowerCase();
    var needle = String(value || "").toLowerCase().trim();
    if (!needle || !hay) return false;
    if (hay.indexOf(needle) >= 0) return true;
    return needle.split(/\s+/).some(function (part) {
      part = part.replace(/[^a-z\u00c0-\u024f\u0400-\u04ff\u0530-\u058f]/gi, "");
      if (part.length < 3) return false;
      if (hay.indexOf(part) >= 0) return true;
      var stem = part.slice(0, Math.max(3, part.length - 1));
      return stem.length >= 3 && hay.indexOf(stem) >= 0;
    });
  }

  function groundedName(value, text) {
    var name = cleanPhrase(value, 32);
    if (!name || /^(the )?(child|kid|boy|girl|hero|friend|someone|baby|toddler|son|daughter)$/i.test(name)) return "";
    if (!mentioned(text, name) || NAME_STOP[titleWord(name)]) return "";
    return titleWord(name);
  }

  function groundedAge(value, text) {
    var digits = String(value || "").match(/\d{1,2}/);
    if (!digits) return "";
    var age = parseInt(digits[0], 10);
    if (age < 2 || age > 16) return "";
    var lower = String(text || "").toLowerCase();
    if (new RegExp("\\b" + age + "\\b").test(lower)) return String(age);
    var word;
    for (word in AGE_WORDS) {
      if (AGE_WORDS[word] === age && new RegExp("\\b" + word + "\\b").test(lower)) return String(age);
    }
    return "";
  }

  function normalizeLang(value) {
    var code = String(value || "").trim().toLowerCase().replace(/_/g, "-");
    if (!code) return "";
    var alias = {
      "hy-latn": "hy", hye: "hy", armenian: "hy", hayeren: "hy",
      "ru-latn": "ru", rus: "ru", russian: "ru",
      "en-us": "en", "en-gb": "en", english: "en",
      spanish: "es", french: "fr", german: "de", georgian: "ka",
    };
    if (alias[code]) code = alias[code];
    code = code.split("-")[0];
    if (alias[code]) code = alias[code];
    var langs = window.NANIK_STORY_LANGS || [];
    return langs.some(function (lang) { return lang.code === code; }) ? code : "";
  }

  function detectLanguageLocal(text) {
    var value = String(text || "");
    if (/[\u0530-\u058F]/.test(value)) return "hy";
    if (/[\u0400-\u04FF]/.test(value)) return "ru";
    if (/[\u10A0-\u10FF]/.test(value)) return "ka";
    if (/[\u0600-\u06FF]/.test(value)) return "ar";
    if (/[\u0590-\u05FF]/.test(value)) return "he";
    if (/[\u4E00-\u9FFF]/.test(value)) return "zh";
    if (/[\u3040-\u30FF]/.test(value)) return "ja";
    if (/[\uAC00-\uD7AF]/.test(value)) return "ko";
    if (/[\u0900-\u097F]/.test(value)) return "hi";
    if (/[\u0370-\u03FF]/.test(value)) return "el";
    var lower = value.toLowerCase();
    if (/\b(barev|vakh|vaxenum|vakhnum|dproc|heqiat|uzum em|mankik|tgha|axchik|gisher|arzuk|kanchum)\b/.test(lower)) return "hy";
    if (/\b(boitsya|skazk|malchik|devochka|privet|hochet|medved|shkoly|skazku)\b/.test(lower)) return "ru";
    return "";
  }

  function modelText(data) {
    if (!data) return "";
    if (typeof data.text === "string") return data.text;
    if (typeof data.content === "string") return data.content;
    if (Array.isArray(data.content)) {
      return data.content.map(function (part) {
        return (part && (part.text || part.content)) || "";
      }).join("");
    }
    if (data.message && typeof data.message.content === "string") return data.message.content;
    return "";
  }

  function parseAnalyzerJson(raw) {
    var text = String(raw || "").trim();
    var start = text.indexOf("{");
    var end = text.lastIndexOf("}");
    if (start < 0 || end < start) return null;
    try {
      var parsed = JSON.parse(text.slice(start, end + 1));
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function localAnalyzerJson(text) {
    var found = extractFromText(text);
    found.language = detectLanguageLocal(text);
    return found;
  }

  function applyScreenAnswer(text) {
    var key = currentKey();
    var typed = String(text || "").replace(/\s+/g, " ").trim();
    if (!typed) return;
    if (key === "topic" && !planner.emotion && !planner.topic) {
      if (planner.intentKey === "emotional_support" && canFill("emotion")) {
        planner.emotion = tidyPhrase(typed);
        sources.emotion = "text";
      } else if (canFill("topic")) {
        planner.topic = tidyPhrase(typed);
        sources.topic = "text";
        state.topic = planner.topic;
      }
    }
    if (key === "detail" && !planner.context && canFill("context")) {
      planner.context = tidyPhrase(typed);
      sources.context = "text";
      state.detail = planner.context;
    }
    if (key === "hero") {
      var heroText = el("guided-hero-description");
      var heroValue = heroText ? heroText.value.trim() : "";
      if (heroValue && !planner.hero && canFill("hero")) {
        planner.hero = tidyPhrase(heroValue);
        sources.hero = "text";
      }
    }
    if (key === "personal") {
      var interests = el("guided-interests-custom");
      var support = el("guided-support-custom");
      if (interests && interests.value.trim() && !planner.likes && canFill("likes")) {
        planner.likes = interests.value.trim();
        sources.likes = "text";
      }
      if (support && support.value.trim() && !planner.support && canFill("support")) {
        planner.support = support.value.trim();
        sources.support = "text";
      }
    }
  }

  function mergeAnalyzerResult(raw, text) {
    var data = raw && typeof raw === "object" ? raw : {};
    var idea = String(text || "").replace(/\s+/g, " ").trim();
    if (idea) latestTypedContext = idea;
    if (idea && canFillFromText("idea")) {
      planner.idea = idea;
      sources.idea = "text";
    }
    var intentKey = String(data.intentKey || "").trim();
    if (INTENT_BY_KEY[intentKey] !== undefined && intentKey && canFillFromText("intentKey")) {
      planner.intentKey = intentKey;
      sources.intentKey = "text";
      var label = INTENT_BY_KEY[intentKey];
      if (canFillFromText("intentLabel")) {
        planner.intentLabel = label || idea;
        sources.intentLabel = "text";
        if (planner.intentLabel) state.intent = planner.intentLabel;
      }
    }
    var name = groundedName(data.name, idea);
    if (name && canFillFromText("name")) {
      planner.name = name;
      sources.name = "text";
      state.childName = name;
      var nameField = el("guided-child-name");
      if (nameField && !nameField.value.trim()) nameField.value = name;
    }
    var age = groundedAge(data.age, idea);
    if (age && canFillFromText("age")) {
      planner.age = age;
      sources.age = "text";
      state.age = age;
      if (el("guided-age") && el("guided-age").querySelector('option[value="' + age + '"]')) el("guided-age").value = age;
      rememberChild();
    }
    var hero = cleanPhrase(data.hero, 40);
    if (hero && canFillFromText("hero") && (mentioned(idea, hero) || (planner.name && hero.toLowerCase() === planner.name.toLowerCase()))) {
      planner.hero = titleWord(hero);
      sources.hero = "text";
    }
    var companion = cleanPhrase(data.companion, 40);
    if (companion && canFillFromText("companion") && mentioned(idea, companion)) {
      planner.companion = titleWord(companion);
      sources.companion = "text";
    }
    ["setting", "emotion", "topic", "context", "mood", "support"].forEach(function (key) {
      var value = cleanPhrase(data[key], key === "context" || key === "setting" || key === "support" ? 80 : 40);
      if (!value || !canFillFromText(key)) return;
      planner[key] = key === "emotion" || key === "mood" ? titleWord(value) : tidyPhrase(value);
      sources[key] = "text";
    });
    if (planner.topic && sources.topic === "text") state.topic = planner.topic;
    if (planner.context && sources.context === "text") state.detail = planner.context;
    if (planner.support && sources.support === "text") state.support = planner.support;
    var language = normalizeLang(data.language) || detectLanguageLocal(idea);
    if (language && canFillFromText("language")) {
      planner.language = language;
      sources.language = "text";
      state.lang = language;
      var select = el("guided-language");
      if (select && select.querySelector('option[value="' + language + '"]')) select.value = language;
    }
    if (idea && !planner.intentKey && canFillFromText("intentKey")) {
      planner.intentKey = "custom";
      sources.intentKey = "text";
    }
    if (idea && !planner.intentLabel && canFillFromText("intentLabel")) {
      planner.intentLabel = idea;
      sources.intentLabel = "text";
      state.intent = idea;
    }
    if (planner.age) rememberChild();
    applyScreenAnswer(idea);
    syncSharedPlanner();
  }

  function readAnalyzerResponse(res) {
    var type = (res.headers.get("content-type") || "").toLowerCase();
    if (!res.body || !res.body.getReader || type.indexOf("json") >= 0) {
      return res.json().then(modelText);
    }
    var reader = res.body.getReader();
    var decoder = new TextDecoder();
    var buf = "";
    var full = "";
    function pump() {
      return reader.read().then(function (chunk) {
        if (chunk.done) return full;
        buf += decoder.decode(chunk.value, { stream: true });
        var parts = buf.split("\n\n");
        buf = parts.pop() || "";
        parts.forEach(function (block) {
          var line = block.split("\n").filter(function (item) {
            return item.indexOf("data:") === 0;
          }).pop();
          if (!line) return;
          var json = line.replace(/^data:\s*/, "");
          if (!json || json === "[DONE]") return;
          try {
            var event = JSON.parse(json);
            if (event.type === "delta" && event.text) full += event.text;
            else if (event.type === "done" && event.text) full = event.text;
            else if (event.text) full += event.text;
          } catch (e) {}
        });
        return pump();
      });
    }
    return pump();
  }

  function previousAnswersForDirector() {
    var answers = [];
    if (planner.intentLabel) answers.push({ field: "story_kind", answer: planner.intentLabel, source: sources.intentKey || "" });
    if (planner.purpose) answers.push({ field: "purpose", answer: planner.purpose, source: sources.purpose || "" });
    if (planner.hero) answers.push({ field: "hero", answer: planner.hero, source: sources.hero || "" });
    if (planner.age) answers.push({ field: "age", answer: planner.age, source: sources.age || "" });
    return answers.concat(followupAnswers.map(function (item) {
      return {
        question: item.question,
        field: item.field,
        answer: item.answer,
        source: item.source,
        offered_chips: item.offeredChips,
      };
    }));
  }

  function directorContext(text, forceQuestion, kind) {
    var support = kind === "support";
    var purposeLearn = kind === "purpose_learn";
    var armenian = isArmenian();
    var recentlyShownSupports = followupAnswers.reduce(function (all, item) {
      return all.concat(item && item.field === "support" ? (item.offeredChips || []) : []);
    }, []).filter(function (label, index, all) {
      return label && all.indexOf(label) === index;
    });
    var nativeHy = "OUTPUT LANGUAGE: Eastern Armenian (հայերեն). Generate every user-facing string in Armenian from the first word. Do not write English. Do not draft in English. Do not translate from English. Write the way an Armenian parent would say it. ";
    var rules = "";
    if (support) {
      rules = armenian
        ? nativeHy + "You generate chip options for how a children's story can gently support the child. The UI sets the question title in code — do not invent a title; focus on chips only. Generate every chip in Eastern Armenian from the first word. Generate exactly 5 support chips for this age and story context. Each chip label must be 3 to 5 Armenian words, never more than 5. Do not include Something else. Use the story type, clarifying question, clarifying answer, and age to personalize the chips when they describe a real situation. If the previous answers are broad, keep the chips general. Focus on helpful emotional or developmental directions, not plot ideas. Use simple, parent-friendly Armenian. Make the chips meaningfully different. Do not diagnose. Do not invent facts about the child. Do not create story ideas, characters, scenes, or lessons. Keep support gentle rather than corrective or preachy. Do not write the child's age. question.field must be support. Return ready_for_plan false and one question as JSON."
        : "Generate 5 ways a children's story could gently support the child. Use these inputs: child_age, story_kind, language, and recently_shown_supports (optional). The UI sets the question title in code — do not invent a title; focus on chips only. Generate exactly one short, specific, parent-friendly support option from each category: emotional_regulation, confidence_courage, relationships_belonging, resilience_coping, and self_awareness_expression. Adapt each option to the child's age and selected story kind. Do not diagnose or invent personal facts. Keep every chip short, clearly different, and avoid recently_shown_supports. Use the requested language. Return only this JSON shape: {\"field\":\"support\",\"chips\":[{\"category\":\"emotional_regulation\",\"emoji\":\"💛\",\"label\":\"\"},{\"category\":\"confidence_courage\",\"emoji\":\"🌱\",\"label\":\"\"},{\"category\":\"relationships_belonging\",\"emoji\":\"🤝\",\"label\":\"\"},{\"category\":\"resilience_coping\",\"emoji\":\"🛟\",\"label\":\"\"},{\"category\":\"self_awareness_expression\",\"emoji\":\"🗣️\",\"label\":\"\"}]}.";
    } else if (purposeLearn) {
      rules = armenian
        ? nativeHy + "The parent chose: help them learn or understand something. The UI sets the question title in code — do not invent a title; focus on chips only. Generate every chip in Eastern Armenian. Return at most 5 chips, ideally exactly 5. Each chip is a short idea, skill, or lesson to explore through the story. Use the story kind and hero when helpful. Keep chips gentle, parent-friendly, and different. 2 to 5 Armenian words each. Do not preach. Do not include Something else. Do not invent the child's name. question.field must be topic. Return ready_for_plan false and one question as JSON."
        : "The parent chose: help them learn or understand something. The UI sets the question title in code — do not invent a title; focus on chips only. Return at most 5 chips, ideally exactly 5. Each chip is a short idea, skill, or lesson to explore through the story. Use the story kind and hero when helpful. Keep chips gentle, parent-friendly, and different. 2 to 5 words each. Do not preach. Do not include Something else. Do not invent the child's name. question.field must be topic. Return ready_for_plan false and one question as JSON.";
    }
    var questionKind = support ? "support" : "purpose_learn";
    return {
      child_age: planner.age || "unknown",
      selected_story_kind: {
        key: planner.intentKey || "",
        label: planner.intentLabel || "",
      },
      previous_answers: previousAnswersForDirector(),
      typed_context: String(text || latestTypedContext || "").trim(),
      current_story_planner: plannerInput(),
      field_sources: {
        hero: sources.hero || "",
        support: sources.support || "",
        purpose: sources.purpose || "",
      },
      support_for_story: support ? {
        childAge: planner.age || "",
        storyType: planner.intentLabel || "",
        recently_shown_supports: recentlyShownSupports.concat(purposeShownChips.today || []).filter(function (label, index, all) {
          return label && all.indexOf(label) === index;
        }).slice(-12),
        clarifyingQuestion: clarifyingQuestionText(),
        clarifyingAnswer: clarifyingAnswer(),
      } : undefined,
      purpose_for_story: purposeLearn ? {
        purposeKey: purposeKey(),
        purposeLabel: planner.purpose || state.purpose || "",
        storyType: planner.intentLabel || "",
        hero: planner.hero || "",
        childAge: planner.age || "",
        recently_shown_chips: (purposeShownChips[purposeKey()] || []).slice(-12),
      } : undefined,
      output_language: storyLanguage(),
      app_language: siteUiLang(),
      product_language: productLanguageName(),
      story_kind: planner.intentLabel || "",
      custom_text: String(text || latestTypedContext || "").trim() || null,
      followup_number: followupCount + 1,
      followup_limit: FOLLOWUP_MAX,
      question_kind: questionKind,
      must_ask_question: true,
      force_question: !!forceQuestion,
      question_rules: rules,
    };
  }

  function plannerAuthToken() {
    var cfg = window.NANIK_API || {};
    var draft = window.NANIK_DRAFT || {};
    var session = draft.readSession ? draft.readSession() : null;
    var sessionToken = String((session && session.access_token) || "");
    var expiresAt = Number(session && session.expires_at) || 0;
    var expired = expiresAt > 0 && Date.now() >= expiresAt - 15000;
    var tokenParts = sessionToken.split(".");
    var validSessionShape = !expired
      && tokenParts.length === 3
      && tokenParts.every(function (part) { return part.length > 10; });
    return validSessionShape ? sessionToken : cfg.supabaseAnonKey;
  }

  function requestPlannerModel(options) {
    options = options || {};
    var cfg = window.NANIK_API || {};
    var proxy = String(options.proxy || cfg.claudeProxy || "").replace(/\/$/, "");
    if (!proxy || !cfg.supabaseAnonKey) return Promise.reject(new Error("no proxy"));
    var token = plannerAuthToken();
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = window.setTimeout(function () {
      if (controller) controller.abort();
    }, options.timeout || 12000);
    var body = options.body || {
      model: options.model,
      maxTokens: options.maxTokens || 400,
      stream: false,
      system: options.system || "",
      messages: [{ role: "user", content: JSON.stringify(options.input || {}) }],
    };
    if (!options.body && typeof options.temperature === "number") body.temperature = options.temperature;
    var endpoint = typeof options.endpoint === "string" ? options.endpoint : "/messages";
    return fetch(proxy + endpoint, {
      method: "POST",
      headers: {
        apikey: cfg.supabaseAnonKey,
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(body),
      signal: controller ? controller.signal : undefined,
    }).then(function (res) {
      if (!res.ok) throw new Error("planner model " + res.status);
      if (options.directJson) return res.json();
      return readAnalyzerResponse(res);
    }).then(function (raw) {
      var parsed = options.directJson ? raw : parseAnalyzerJson(raw);
      if (!parsed) throw new Error("planner model json");
      return parsed;
    }).then(function (parsed) {
      window.clearTimeout(timer);
      return parsed;
    }, function (err) {
      window.clearTimeout(timer);
      throw err;
    });
  }

  function analyzePlannerText(text, analyzerKind) {
    var locked = {};
    ["intentKey", "intentLabel", "name", "age", "hero", "companion", "setting", "emotion", "topic", "context", "mood", "language", "support"].forEach(function (key) {
      if (STRONG_SOURCES[sources[key]] && sources[key] !== "draft" && sources[key] !== "name-default" && planner[key]) {
        locked[key] = planner[key];
      }
    });
    var cfg = window.NANIK_API || {};
    var typed = String(text || "").replace(/\s+/g, " ").trim();
    return requestPlannerModel({
      proxy: cfg.plannerProxy,
      endpoint: "",
      body: {
        context: {
          question_kind: analyzerKind || "analyze",
          child_age: planner.age || "unknown",
          selected_story_kind: {
            key: planner.intentKey || "custom",
            label: planner.intentLabel || "",
          },
          current_story_planner: plannerInput(),
          locked: locked,
          text: typed,
          typed_context: typed,
          output_language: storyLanguage(),
          app_language: siteUiLang(),
          product_language: isArmenianUi() ? "Armenian" : "English",
        },
      },
      directJson: true,
      timeout: 20000,
    }).then(function (raw) {
      if (!raw || typeof raw !== "object") throw new Error("analyzer empty");
      if (raw.code) throw new Error(String(raw.code));
      return raw;
    });
  }

  function normalizedQuestionText(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function questionWasAlreadyAsked(title) {
    var key = normalizedQuestionText(title);
    return !!key && followupAnswers.some(function (item) {
      return normalizedQuestionText(item.question) === key;
    });
  }

  function chipWasAlreadyShown(label) {
    var key = normalizedQuestionText(label);
    return !!key && followupAnswers.some(function (item) {
      return (item.offeredChips || []).some(function (shown) {
        return normalizedQuestionText(shown) === key;
      });
    });
  }

  function chipEmoji(value) {
    var text = String(value || "").trim();
    if (!text) return "✨";
    var grapheme = text;
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      var first = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)[Symbol.iterator]().next().value;
      grapheme = first && first.segment ? first.segment : "";
    }
    if (!grapheme || /[A-Za-z0-9]/.test(grapheme) || !/\p{Extended_Pictographic}/u.test(grapheme)) return "✨";
    return grapheme;
  }

  function stripAgeMentions(text) {
    var age = "(?:\\d{1,2}|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen)\\s*[- ]?\\s*years?\\s*[- ]?\\s*olds?";
    return String(text || "")
      .replace(new RegExp("\\b(?:for|with|about)\\s+(?:an?\\s+|your\\s+|their\\s+)?" + age + "\\b", "gi"), "")
      .replace(new RegExp("\\b(?:an?\\s+|your\\s+|their\\s+)" + age + "\\b", "gi"), "they")
      .replace(new RegExp("\\b" + age + "\\b", "gi"), "")
      .replace(/\b(?:at\s+)?age[d]?\s+\d{1,2}\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/\(\s*\)/g, "")
      .trim();
  }

  function normalizeQuestion(raw, allowSupport) {
    if (!raw || typeof raw !== "object") return null;
    var title = stripAgeMentions(cleanPhrase(raw.title, 90));
    if (!title || questionWasAlreadyAsked(title)) return null;
    var field = allowSupport ? "support" : String(raw.field || "").trim();
    if (!allowSupport && (!FOLLOWUP_FIELDS[field] || field === "support")) field = "topic";
    if (!allowSupport && planner[field]) {
      field = ["topic", "emotion", "context", "setting", "companion", "mood", "likes"].filter(function (key) {
        return !planner[key];
      })[0] || "context";
    }
    var seen = {};
    var chips = (Array.isArray(raw.chips) ? raw.chips : []).map(function (item) {
      var label = stripAgeMentions(cleanPhrase(item && (item.label || item.value), 48));
      if (!label) return null;
      var key = normalizedQuestionText(label);
      if (!key || seen[key] || chipWasAlreadyShown(label)) return null;
      seen[key] = true;
      return {
        emoji: chipEmoji(item && item.emoji),
        label: label,
        value: label,
      };
    }).filter(function (chip) {
      return chip && !/^something else$/i.test(chip.label);
    }).map(function (chip) {
      if (!allowSupport) return chip;
      var words = chip.label.split(/\s+/).filter(Boolean).slice(0, 5);
      chip.label = words.join(" ");
      chip.value = chip.label;
      return chip.label ? chip : null;
    }).filter(Boolean).slice(0, CHIP_COUNT);
    if (chips.length < 3) return null;
    if (isArmenian() && !chipsAreArmenian(chips)) return null;
    if (allowSupport) title = supportTitle();
    var hints = (Array.isArray(raw.hints) ? raw.hints : []).map(function (hint) {
      return stripAgeMentions(cleanPhrase(hint, 80));
    }).filter(function (hint) { return hint && (!isArmenian() || hasArmenian(hint)); }).slice(0, 3);
    return { title: title, field: field, chips: chips, hints: hints, enough: false };
  }



  function applyFollowupChoice(value, source) {
    var field = (aiQuestion && aiQuestion.field) || "topic";
    if (!FOLLOWUP_FIELDS[field]) field = "topic";
    var answer = tidyPhrase(value);
    if (!answer) return;
    if (field === "support" || (!planner[field] && canFill(field))) {
      planner[field] = answer;
      sources[field] = source || "chip";
    }
    if (field !== "support") planner.clarifyingQuestion = answer;
    var previous = followupAnswers[followupAnswers.length - 1];
    if (!previous || previous.question !== aiQuestion.title || previous.answer !== answer) {
      followupAnswers.push({
        question: aiQuestion.title,
        field: field,
        answer: answer,
        source: source || "chip",
        offeredChips: (aiQuestion.chips || []).map(function (item) { return item.label; }),
      });
    }
    state.topic = answer;
    if (field === "context") state.detail = answer;
    if (field === "likes") planner.likes = answer;
    syncSharedPlanner();
  }

  function directPlanner(text, forceQuestion, kind) {
    var cfg = window.NANIK_API || {};
    return requestPlannerModel({
      proxy: cfg.plannerProxy,
      endpoint: "",
      body: {
        model: "gemini-2.5-flash",
        maxTokens: 500,
        temperature: 0.7,
        stream: false,
        context: directorContext(text, forceQuestion, kind),
      },
      directJson: true,
      timeout: 20000,
    });
  }

  function clearChoiceTransitionClasses() {
    var root = el("guided-create");
    var title = el("guided-title-row");
    if (root) root.classList.remove("is-choice-transitioning", "is-choice-fade-started");
    if (title) title.classList.remove("is-choice-fading", "is-choice-revealing");
    document.querySelectorAll(
      ".is-choice-exiting, .is-choice-other, .is-choice-selected, .is-choice-reveal-item"
    ).forEach(function (node) {
      node.classList.remove(
        "is-choice-exiting",
        "is-choice-other",
        "is-choice-selected",
        "is-choice-reveal-item"
      );
      node.style.removeProperty("--choice-order");
    });
  }

  function removeChoiceTransitionClone() {
    if (choiceTransitionClone && choiceTransitionClone.parentNode) {
      choiceTransitionClone.parentNode.removeChild(choiceTransitionClone);
    }
    choiceTransitionClone = null;
  }

  function cancelChoiceTransition() {
    window.clearTimeout(choiceTransitionFadeTimer);
    choiceTransitionFadeTimer = 0;
    choiceTransitionActive = false;
    clearChoiceTransitionClasses();
    removeChoiceTransitionClone();
  }

  function beginChoiceTransition(selected) {
    var root = el("guided-create");
    var card = el("guided-card");
    var title = el("guided-title-row");
    var section = document.querySelector(".guided-step.is-on");
    if (!root || !card || !section || choiceTransitionActive) return;
    choiceTransitionActive = true;
    root.classList.add("is-choice-transitioning");

    var choices = Array.prototype.slice.call(
      section.querySelectorAll(
        ".guided-choice, .guided-chips button, .guided-age-chips button, .guided-profile-card"
      )
    );
    choices.forEach(function (choice, index) {
      choice.style.setProperty("--choice-order", String(index));
      choice.classList.add(choice === selected ? "is-choice-selected" : "is-choice-other");
    });

    choiceTransitionFadeTimer = window.setTimeout(function () {
      choiceTransitionFadeTimer = 0;
      if (!choiceTransitionActive) return;
      root.classList.add("is-choice-fade-started");
      section.classList.add("is-choice-exiting");
      if (title) title.classList.add("is-choice-fading");
    }, 90);
  }

  function revealChoiceStep(section, title) {
    if (!choiceTransitionActive || !section) return;
    var root = el("guided-create");
    window.clearTimeout(choiceTransitionFadeTimer);
    choiceTransitionFadeTimer = 0;
    clearChoiceTransitionClasses();
    if (title) title.classList.add("is-choice-revealing");
    var revealItems = Array.prototype.slice.call(
      section.querySelectorAll(
        ".guided-choice, .guided-chips button, .guided-age-chips button, .guided-or, .guided-insert, .guided-plan-block, .guided-profile-card"
      )
    );
    revealItems.forEach(function (item, index) {
      item.style.setProperty("--choice-order", String(index + 1));
      item.classList.add("is-choice-reveal-item");
    });
    if (choiceTransitionClone) {
      choiceTransitionClone.classList.remove("is-staged");
      window.requestAnimationFrame(function () {
        if (choiceTransitionClone) choiceTransitionClone.classList.add("is-fading");
      });
    }
    if (root) root.classList.remove("is-choice-transitioning");
    choiceTransitionActive = false;
    window.setTimeout(function () {
      if (title) title.classList.remove("is-choice-revealing");
      revealItems.forEach(function (item) {
        item.classList.remove("is-choice-reveal-item");
        item.style.removeProperty("--choice-order");
      });
      removeChoiceTransitionClone();
    }, 1100);
  }

  function beginAdvance() {
    var root = el("guided-create");
    var pane = el("guided-advance");
    var title = el("guided-title-row");
    var current = document.querySelector(".guided-step.is-on");
    var card = el("guided-card");
    if (!root || !pane || root.classList.contains("is-advancing")) return;
    root.classList.add("is-advancing");
    if (choiceTransitionActive) {
      pane.hidden = true;
      pane.setAttribute("aria-hidden", "true");
      return;
    }
    if (current) current.classList.add("is-leaving");
    if (title) title.classList.add("is-leaving");
    if (card) card.scrollTop = 0;
    pane.style.top = (title ? title.offsetTop : 0) + "px";
    pane.hidden = false;
    pane.setAttribute("aria-hidden", "false");
  }

  function endAdvance() {
    var root = el("guided-create");
    var pane = el("guided-advance");
    if (root) root.classList.remove("is-advancing");
    document.querySelectorAll(".is-leaving").forEach(function (node) {
      node.classList.remove("is-leaving");
    });
    if (pane) {
      pane.hidden = true;
      pane.setAttribute("aria-hidden", "true");
    }
  }


  function siteUiLang() {
    try {
      var stored = localStorage.getItem("nanik-site-lang");
      if (stored === "hy" || stored === "en" || stored === "ru") return stored;
    } catch (e) {}
    return String(document.documentElement.lang || "en").split("-")[0].toLowerCase();
  }

  function productLanguageName() {
    var code = siteUiLang();
    var languages = Array.isArray(window.NANIK_STORY_LANGS) ? window.NANIK_STORY_LANGS : [];
    var language = languages.filter(function (item) { return item.code === code; })[0];
    return language ? String(language.name || language.nativeName || code) : code;
  }

  function storyLanguage() {
    var app = siteUiLang();
    if (app === "hy") return "hy";
    return String(planner.language || state.lang || app || "en").toLowerCase();
  }

  function isArmenian() {
    return storyLanguage() === "hy";
  }

  function isArmenianUi() {
    // App chrome follows the site language preference only — never flip UI
    // just because the parent typed Armenian (or any other story language).
    return siteUiLang() === "hy";
  }

  function syncLanguageFromApp() {
    var app = siteUiLang();
    state.lang = app;
    if (el("guided-language") && el("guided-language").querySelector('option[value="' + app + '"]')) {
      el("guided-language").value = app;
    }
    if (app === "hy" || (sources.language !== "select" && sources.language !== "edit")) {
      planner.language = app;
      if (sources.language !== "select" && sources.language !== "edit") sources.language = "default";
    }
  }

  function purposeTitle() {
    return isArmenianUi() ? "Կա՞ ինչ-որ բան, որում հեքիաթը կարող է օգնել։" : "What should this story help with?";
  }

  function supportTitle() {
    return isArmenianUi() ? "Ինչպե՞ս կարող է պատմությունը նրբորեն աջակցել։" : "How can the story gently support?";
  }

  function applyPurposeChip(label) {
    var nextKey = PURPOSE_KEYS[label] || "";
    if (planner.purposeKey && planner.purposeKey !== nextKey) clearPurposeChipPrefetch();
    state.purpose = label || "";
    planner.purpose = label || "";
    planner.purposeKey = nextKey;
    sources.purpose = label ? "chip" : "";
    sources.purposeKey = label ? "chip" : "";
    if (!label || nextKey === "fun") {
      aiQuestion = null;
      visibleQuestion = null;
      followupAnswered = nextKey === "fun";
    } else {
      followupAnswered = false;
    }
    syncSharedPlanner();
  }

  function paintPurposeStep(title) {
    if (title) title.textContent = purposeTitle();
    var section = document.querySelector('[data-guided-step="purpose"]');
    if (section) section.setAttribute("data-guided-title", purposeTitle());
    var hy = isArmenianUi();
    document.querySelectorAll('[data-guided-step="purpose"] [data-guided-value]').forEach(function (button) {
      var value = button.getAttribute("data-guided-value") || "";
      var titleEl = button.querySelector(".guided-intent-card-title");
      var desc = button.querySelector(".guided-intent-card-desc");
      if (titleEl) {
        titleEl.textContent = hy && PURPOSE_LABELS_HY[value]
          ? PURPOSE_LABELS_HY[value]
          : (PURPOSE_DISPLAY_TITLES[value] || value);
      }
      if (desc) {
        desc.textContent = hy && PURPOSE_DESC_HY[value]
          ? PURPOSE_DESC_HY[value]
          : (PURPOSE_DISPLAY_DESC[value] || PURPOSE_DESC[value] || desc.textContent);
      }
      var on = state.purpose === value;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-checked", on ? "true" : "false");
    });
  }

  function heroTitle() {
    return isArmenianUi() ? "Ո՞վ պետք է լինի հերոսը։" : "Who should be the hero?";
  }

  function kidChipLabel() {
    return isArmenianUi() ? "Իմ երեխան" : "My child is the hero";
  }

  function madeUpChipLabel() {
    return isArmenianUi() ? "Հորինված կերպար" : "Create hero";
  }

  function animalChipLabel() {
    return isArmenianUi() ? "Կենդանի" : "An animal";
  }



  function kidChipDesc() {
    return isArmenianUi()
      ? "Քո երեխան կլինի հեքիաթի հերոսը։"
      : "Make your child the hero.";
  }

  function madeUpChipDesc() {
    return isArmenianUi()
      ? "Եկե՛ք միասին ստեղծենք։"
      : "Let's create one together.";
  }



  function staticHeroQuestion() {
    return {
      title: heroTitle(),
      chips: [
        { emoji: "🧒", label: kidChipLabel(), value: "kid", desc: kidChipDesc() },
        { emoji: "✨", label: madeUpChipLabel(), value: "madeup", desc: madeUpChipDesc() },
      ],
      hints: [],
    };
  }

  function hasArmenian(text) {
    return /[\u0530-\u058F]/.test(String(text || ""));
  }

  function chipsAreArmenian(chips) {
    return (chips || []).filter(function (chip) { return hasArmenian(chip && chip.label); }).length >= 3;
  }


  function isToyHero(text) {
    return /\b(toy|teddy|stuffed|plush|doll)\b/i.test(String(text || ""));
  }







  function continueAfterFollowup() {
    showStep("hero");
  }

  function purposeQuestionTitle(kind) {
    if (kind === "learn") {
      return isArmenianUi() ? "Ի՞նչ պիտի սովորեն կամ հասկանան։" : "What should they learn or explore?";
    }
    return isArmenianUi() ? "Ի՞նչ է կատարվում այսօր։" : "What's happening today?";
  }

  function somethingElseChip() {
    return isArmenianUi()
      ? { emoji: "✍️", label: "Ուրիշ բան...", value: "Something else" }
      : { emoji: "✍️", label: "Something else...", value: "Something else" };
  }

  function withSomethingElseChips(chips) {
    var list = (chips || []).filter(function (chip) {
      var label = (chip && (chip.value || chip.label)) || "";
      return chip && !/^something else$/i.test(label) && !/^ուրիշ բան$/i.test(label);
    });
    list.push(somethingElseChip());
    return list;
  }

  function purposeFallbackQuestion(kind) {
    var key = kind === "learn" ? "learn" : "today";
    var list = (isArmenianUi() ? PURPOSE_CHIP_FALLBACKS_HY : PURPOSE_CHIP_FALLBACKS)[key] || [];
    return {
      title: purposeQuestionTitle(key),
      field: key === "learn" ? "topic" : "context",
      chips: withSomethingElseChips(list.slice(0, 5).map(function (item) {
        return { emoji: item.emoji, label: item.label, value: item.label };
      })),
      hints: [],
      enough: false,
    };
  }

  function supportFallbackQuestion() {
    var list = isArmenianUi() ? SUPPORT_CHIPS_HY : SUPPORT_CHIPS;
    return {
      title: supportTitle(),
      field: "support",
      chips: withSomethingElseChips(list.slice(0, 5).map(function (item) {
        return { emoji: item.emoji, label: item.label, value: item.label };
      })),
      hints: [],
      enough: false,
    };
  }

  function chipsFromRawQuestion(raw, allowSupport) {
    if (!raw || typeof raw !== "object") return [];
    var seen = {};
    return (Array.isArray(raw.chips) ? raw.chips : []).map(function (item) {
      var label = stripAgeMentions(cleanPhrase(item && (item.label || item.value), 48));
      if (!label) return null;
      var key = normalizedQuestionText(label);
      if (!key || seen[key]) return null;
      seen[key] = true;
      return {
        emoji: chipEmoji(item && item.emoji),
        label: label,
        value: label,
      };
    }).filter(function (chip) {
      return chip && !/^something else$/i.test(chip.label);
    }).map(function (chip) {
      if (!allowSupport) return chip;
      var words = chip.label.split(/\s+/).filter(Boolean).slice(0, 5);
      chip.label = words.join(" ");
      chip.value = chip.label;
      return chip.label ? chip : null;
    }).filter(Boolean).slice(0, CHIP_COUNT);
  }

  function looksLikeHeroChip(label) {
    return /^(a |an |the )?(brave|curious|friendly|daring|little|magical|kind|wise)\b/i.test(String(label || ""))
      || /\b(knight|explorer|pirate|astronaut|dragon|fox|owl|fairy|robot|wizard|princess|prince|hero|creature)\b/i.test(String(label || ""));
  }

  function rememberPurposeChips(key, chips) {
    if (key !== "today" && key !== "learn") return;
    var labels = (chips || []).map(function (chip) {
      return chip && (chip.label || chip.value);
    }).filter(Boolean);
    purposeShownChips[key] = (purposeShownChips[key] || []).concat(labels).filter(function (label, index, all) {
      return label && all.indexOf(label) === index;
    }).slice(-20);
  }

  function normalizePurposeQuestion(raw, kind) {
    var key = kind === "learn" ? "learn" : "today";
    var source = raw && raw.question && typeof raw.question === "object" ? raw.question : raw;
    var question = normalizeQuestion(source, false);
    var chips = (question && question.chips) || chipsFromRawQuestion(source, false);
    if (key === "learn") {
      chips = chips.filter(function (chip) {
        return chip && !looksLikeHeroChip(chip.label);
      });
    }
    if (!chips || chips.length < 3) return null;
    if (isArmenian() && !chipsAreArmenian(chips)) return null;
    return {
      title: purposeQuestionTitle(key),
      field: key === "learn" ? "topic" : "context",
      chips: withSomethingElseChips(chips.slice(0, 5)),
      hints: (question && question.hints) || [],
      enough: false,
    };
  }

  function normalizeSupportQuestion(raw) {
    var source = raw && raw.question && typeof raw.question === "object" ? raw.question : raw;
    var question = normalizeQuestion(source, true);
    var chips = (question && question.chips) || chipsFromRawQuestion(source, true);
    if (!chips || chips.length < 3) return null;
    if (isArmenian() && !chipsAreArmenian(chips)) return null;
    return {
      title: supportTitle(),
      field: "support",
      chips: withSomethingElseChips(chips.slice(0, 5)),
      hints: (question && question.hints) || [],
      enough: false,
    };
  }

  function clearPurposeChipPrefetch() {
    purposeChipPromise = null;
    purposeChipKind = "";
    purposeChipRequestId += 1;
  }

  function startPurposeChipPrefetch() {
    var key = purposeKey();
    if (key !== "today" && key !== "learn") {
      clearPurposeChipPrefetch();
      return null;
    }
    if (purposeChipPromise && purposeChipKind === key) return purposeChipPromise;
    purposeChipKind = key;
    var requestKind = key === "learn" ? "purpose_learn" : "support";
    var requestId = ++purposeChipRequestId;
    purposeChipPromise = directPlanner("", true, requestKind).then(function (json) {
      if (requestId !== purposeChipRequestId) return null;
      if (key === "learn") {
        return normalizePurposeQuestion(json, "learn") || normalizePurposeQuestion(
          (json && json.question) ? json : { question: json },
          "learn"
        );
      }
      return normalizeSupportQuestion(json) || normalizeSupportQuestion(
        (json && json.question) ? json : { question: json }
      );
    }).catch(function () {
      return null;
    });
    return purposeChipPromise;
  }

  function paintTopicSkeleton(container) {
    if (!container) return;
    var widths = [168, 132, 188, 146, 174];
    container.innerHTML = widths
      .map(function (width) {
        return (
          '<span class="guided-chip-skeleton" style="width:' +
          width +
          'px" aria-hidden="true"></span>'
        );
      })
      .join("");
    container.setAttribute("aria-busy", "true");
  }

  function showPurposeQuestion(question) {
    var key = purposeKey();
    var next = question || (key === "today" ? supportFallbackQuestion() : purposeFallbackQuestion(key || "learn"));
    if (key === "learn") next.title = purposeQuestionTitle("learn");
    else if (key === "today") next.title = supportTitle();
    aiQuestion = next;
    visibleQuestion = aiQuestion;
    followupAnswered = false;
    topicChipsLoading = false;
    showStep("topic");
  }

  function askPurposeQuestion() {
    var key = purposeKey();
    if (key !== "today" && key !== "learn") {
      showStep("hero");
      return;
    }
    cancelChoiceTransition();
    endAdvance();
    var fallback = key === "today" ? supportFallbackQuestion() : purposeFallbackQuestion("learn");
    var topicTitle = key === "learn" ? purposeQuestionTitle("learn") : supportTitle();
    aiQuestion = {
      title: topicTitle,
      field: key === "learn" ? "topic" : "support",
      chips: [],
      hints: [],
    };
    visibleQuestion = aiQuestion;
    followupAnswered = false;
    topicChipsLoading = true;
    analyzing = true;
    setAnalyzing(true);
    showStep("topic");
    var pending = startPurposeChipPrefetch();
    Promise.resolve(pending)
      .then(function (question) {
        if (purposeChipKind && purposeChipKind !== key) {
          analyzing = false;
          setAnalyzing(false);
          topicChipsLoading = false;
          return;
        }
        analyzing = false;
        setAnalyzing(false);
        topicChipsLoading = false;
        var finalQuestion =
          question && question.chips && question.chips.length >= 3 ? question : fallback;
        if (question && question.chips && question.chips.length >= 3) {
          rememberPurposeChips(key, question.chips);
        }
        if (key === "learn") finalQuestion.title = purposeQuestionTitle("learn");
        else if (key === "today") finalQuestion.title = supportTitle();
        aiQuestion = finalQuestion;
        visibleQuestion = aiQuestion;
        if (stepKey !== "topic") return;
        var title = el("guided-step-title");
        paintTreeStep("topic", title);
        var topicGrid = el("guided-topic-options");
        if (topicGrid) {
          Array.prototype.forEach.call(topicGrid.querySelectorAll(".guided-choice"), function (item, index) {
            item.style.setProperty("--choice-order", String(index + 1));
            item.classList.add("is-choice-reveal-item");
          });
          window.setTimeout(function () {
            Array.prototype.forEach.call(topicGrid.querySelectorAll(".guided-choice"), function (item) {
              item.classList.remove("is-choice-reveal-item");
              item.style.removeProperty("--choice-order");
            });
          }, 900);
        }
      })
      .catch(function () {
        analyzing = false;
        setAnalyzing(false);
        topicChipsLoading = false;
        showPurposeQuestion(fallback);
      });
  }



  function topicElseTitle() {
    var key = purposeKey();
    if (key === "learn") {
      return isArmenianUi() ? "Ի՞նչ պիտի սովորեն կամ հասկանան։" : "What should they learn or explore?";
    }
    return supportTitle();
  }

  function topicElsePrompt() {
    if (purposeKey() === "learn") {
      if (isArmenianUi()) {
        return {
          placeholder: "Ի՞նչ պիտի սովորեն կամ հասկանան...",
          example: "օր.` Ինչպես կիսվել ընկերների հետ։",
        };
      }
      return {
        placeholder: "What should they learn or explore...",
        example: "e.g. How to share with friends.",
      };
    }
    if (isArmenianUi()) {
      return {
        placeholder: "Ինչպե՞ս կարող է հեքիաթը աջակցել...",
        example: "օր.` Ավելի վստահ զգալ դպրոցում։",
      };
    }
    return {
      placeholder: "How can the story gently support...",
      example: "e.g. Feeling braver at school.",
    };
  }

  function syncTopicElseCounter() {
    var input = el("guided-topic-else-input");
    var count = el("guided-topic-else-count");
    var insert = el("guided-topic-else-insert");
    if (insert && input) insert.classList.toggle("is-filled", !!input.value.trim());
    if (!input || !count) return;
    count.textContent = input.value.length + "/" + (input.maxLength > 0 ? input.maxLength : 200);
  }

  function growTopicElseInput() {
    var input = el("guided-topic-else-input");
    if (!input) return;
    input.style.height = "auto";
    input.style.height = Math.min(120, Math.max(28, input.scrollHeight)) + "px";
  }

  function openTopicElsePopup() {
    var popup = el("guided-topic-else");
    var input = el("guided-topic-else-input");
    var title = el("guided-topic-else-title");
    if (!popup || !input) return;
    if (title) title.textContent = topicElseTitle();
    var prompt = topicElsePrompt();
    if (!input.value.trim()) {
      input.placeholder = prompt.placeholder;
    }
    syncTopicElseCounter();
    growTopicElseInput();
    popup.hidden = false;
    window.setTimeout(function () {
      input.focus();
    }, 40);
  }

  function closeTopicElsePopup(clearSelection) {
    var popup = el("guided-topic-else");
    var input = el("guided-topic-else-input");
    if (popup) popup.hidden = true;
    if (input) input.value = "";
    syncTopicElseCounter();
    if (clearSelection) {
      state.topic = "";
      clearTypeInsert("guided-topic-custom", "guided-topic-insert");
      setSelected(el("guided-topic-options"), "", false);
    }
    setError("");
  }

  function submitTopicElsePopup() {
    var input = el("guided-topic-else-input");
    var text = input ? input.value.trim() : "";
    if (!text) {
      setError(isArmenianUi() ? "Գրիր մի փոքր ավելին։" : "Tell us a little more in your own words.");
      if (input) input.focus();
      return;
    }
    var hidden = el("guided-topic-custom");
    if (hidden) hidden.value = text;
    state.topic = text;
    closeTopicElsePopup(false);
    goNext();
  }

  function continueAfterHero() {
    clearHeroCardFocus();
    if (!planner.age) {
      showStep("basics");
      return;
    }
    showStep("plan");
  }

  function askDirector(text) {
    if (isFunPurpose() || !needsPurposeQuestion()) {
      showStep("hero");
      return;
    }
    askPurposeQuestion();
  }

  function clearTextStoryFields() {
    ["idea", "emotion", "context", "topic", "companion", "setting"].forEach(function (key) {
      if (sources[key] === "text") {
        planner[key] = "";
        sources[key] = "";
      }
    });
    if (sources.hero === "text" && planner.hero && planner.hero !== planner.name) {
      planner.hero = planner.name || "";
      sources.hero = planner.hero ? "text" : "";
    }
    state.topic = planner.topic;
  }

  function applyIntentChip(label) {
    var nextKey = INTENT_KEYS[label] || "custom";
    if (planner.intentKey && planner.intentKey !== nextKey) {
      ["topic", "emotion", "context"].forEach(function (key) {
        if (sources[key] === "chip") {
          planner[key] = "";
          sources[key] = "";
        }
      });
    }
    if (sources.idea === "text") clearTextStoryFields();
    planner.intentLabel = label;
    planner.intentKey = nextKey;
    sources.intentLabel = "chip";
    sources.intentKey = "chip";
    state.intent = label;
    state.topic = planner.topic;
    state.purpose = "";
    applyPurposeChip("");
    clearPurposeChipPrefetch();
    aiQuestion = null;
    visibleQuestion = null;
    heroQuestion = null;
    followupAnswered = false;
    followupCount = 0;
    followupAnswers = [];
    directorSequence += 1;
    latestTypedContext = "";
    syncSharedPlanner();
  }

  function el(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  var errorTimer = 0;

  function clearFieldErrors() {
    document.querySelectorAll("#guided-create .guided-floating-field.is-invalid").forEach(function (field) {
      field.classList.remove("is-invalid");
      var tip = field.querySelector(".guided-field-error");
      if (tip) tip.remove();
    });
  }

  function setNameFieldError(inputId) {
    clearFieldErrors();
    setError("");
    var input = el(inputId);
    if (!input) return;
    var field = input.closest(".guided-floating-field");
    if (!field) return;
    field.classList.add("is-invalid");
    var tip = document.createElement("span");
    tip.className = "guided-field-error";
    tip.textContent = isArmenianUi() ? "Գրիր անունը" : "Insert name";
    field.appendChild(tip);
    try {
      input.focus();
      input.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } catch (err) {}
  }

  function setError(message, options) {
    var error = el("guided-error");
    if (!error) return;
    var opts = options || {};
    window.clearTimeout(errorTimer);
    if (!opts.keepFieldErrors) clearFieldErrors();
    error.textContent = message || "";
    error.hidden = !message;
    if (message) {
      try {
        error.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } catch (err) {}
      var holdMs = opts.holdMs || (/no stories remaining|upgrade/i.test(message) ? 12000 : 4200);
      errorTimer = window.setTimeout(function () {
        error.hidden = true;
        error.textContent = "";
      }, holdMs);
    }
  }

  function setSelected(container, value, multiple) {
    if (!container) return;
    container.querySelectorAll("[data-guided-value]").forEach(function (button) {
      var selected = button.getAttribute("data-guided-value") === value;
      if (multiple) selected = state.interests.indexOf(button.getAttribute("data-guided-value")) >= 0;
      button.classList.toggle("is-on", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      if (button.getAttribute("role") === "radio") {
        button.setAttribute("aria-checked", selected ? "true" : "false");
      }
    });
  }

  function clearVisualSelections() {
    document.querySelectorAll(
      "#guided-create button.is-on, #guided-create button[aria-pressed=\"true\"], #guided-create button[aria-checked=\"true\"]"
    ).forEach(function (button) {
      button.classList.remove("is-on");
      button.setAttribute("aria-pressed", "false");
      if (button.getAttribute("role") === "radio") button.setAttribute("aria-checked", "false");
    });
    syncAgeChips("");
  }

  function populateLanguages() {
    var select = el("guided-language");
    if (!select) return;
    var languages = Array.isArray(window.NANIK_STORY_LANGS) ? window.NANIK_STORY_LANGS.slice() : [];
    var preferred = ["hy", "en", "ru"];
    languages.sort(function (a, b) {
      var ai = preferred.indexOf(a.code);
      var bi = preferred.indexOf(b.code);
      if (ai >= 0 || bi >= 0) {
        if (ai < 0) return 1;
        if (bi < 0) return -1;
        return ai - bi;
      }
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
    select.innerHTML = languages
      .map(function (lang) {
        return (
          '<option value="' +
          escapeHtml(lang.code) +
          '">' +
          escapeHtml((lang.flag ? lang.flag + " " : "") + (lang.nativeName || lang.name || lang.code)) +
          "</option>"
        );
      })
      .join("");
    var uiLang = siteUiLang();
    state.lang = languages.some(function (lang) { return lang.code === uiLang; }) ? uiLang : "en";
    select.value = state.lang;
  }

  function intentChipValues() {
    return Array.prototype.map.call(
      document.querySelectorAll('[data-guided-step="intent"] [data-guided-value]'),
      function (button) { return button.getAttribute("data-guided-value") || ""; }
    );
  }

  function isWelcomePrompt(text) {
    var value = String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!value) return false;
    return /something magical|algo m[aá]gico|quelque chose de magique|etwas magisches|qualcosa di magico|شيئاً سحرياً|что-то волшебное|կախարդական հեքիաթ/.test(value);
  }

  function hydrateDraft() {
    var draft = window.NANIK_DRAFT || {};
    var prompt = draft.getPrompt ? String(draft.getPrompt() || "").trim() : "";
    var image = draft.getImage ? String(draft.getImage() || "") : "";
    var age = draft.getAge ? String(draft.getAge() || "") : "";
    if (draft.setPrompt) draft.setPrompt("");
    if (draft.setImage) draft.setImage("");
    if (prompt === "Learn something new" || isWelcomePrompt(prompt)) {
      prompt = "";
      if (draft.setPrompt) draft.setPrompt("");
    }
    if (prompt) {
      state.intent = prompt;
      if (intentChipValues().indexOf(prompt) >= 0) {
        setSelected(document.querySelector('[data-guided-step="intent"] .guided-choice-grid'), prompt, false);
      } else if (el("guided-intent-custom")) {
        el("guided-intent-custom").value = prompt;
      }
    }
    if (age && el("guided-age").querySelector('option[value="' + age + '"]')) {
      state.age = age;
      el("guided-age").value = age;
      planner.age = age;
      sources.age = "draft";
    }
    applySavedChildProfile();
    if (state.lang && !planner.language) planner.language = state.lang;
    if (planner.language && !sources.language) sources.language = "default";
    if (!planner.language) {
      planner.language = siteUiLang();
      sources.language = "default";
      state.lang = planner.language;
    }
    if (prompt && intentChipValues().indexOf(prompt) >= 0) applyIntentChip(prompt);
    else if (prompt) applyExtracted(extractFromText(prompt));
    if (image) {
      state.image = image;
      paintPhotoControls();
    }
    var custom = el("guided-intent-custom");
    if (custom && intentChipValues().indexOf(custom.value.trim()) >= 0) {
      state.intent = custom.value.trim();
      setSelected(document.querySelector('[data-guided-step="intent"] .guided-choice-grid'), state.intent, false);
      custom.value = "";
    }
  }

  function captureStep() {
    var key = currentKey();
    if (key === "intent") {
      var custom = el("guided-intent-custom");
      var typed = custom ? custom.value.trim() : "";
      if (typed) {
        state.intent = typed;
      } else if (state.intent && INTENT_KEYS[state.intent]) {
        applyIntentChip(state.intent);
      }
    } else if (key === "purpose") {
      if (state.purpose) applyPurposeChip(state.purpose);
    } else if (key === "topic") {
      var topicText = el("guided-topic-custom");
      var typedTopic = topicText ? topicText.value.trim() : "";
      if (!typedTopic && state.topic && state.topic !== "Something else") {
        applyFollowupChoice(state.topic, "chip");
      }
    } else if (key === "detail") {
      if (state.detail && !(el("guided-detail-custom") && el("guided-detail-custom").value.trim()) && !planner.context) {
        planner.context = state.detail;
        sources.context = "chip";
      }
    } else if (key === "hero") {
      applyHeroSelection();
    } else if (key === "basics") {
      state.childName = el("guided-child-name").value.trim();
      state.age = el("guided-age").value;
      state.lang = el("guided-language").value || "en";
      // "Anything else about them" was rendered but never stored; it now reaches the
      // story as additional context.
      if (el("guided-about-custom")) {
        state.about = el("guided-about-custom").value.trim();
      }
      if (state.childName) {
        planner.name = state.childName;
        sources.name = sources.name || "chip";
        if (!planner.hero) {
          planner.hero = state.childName;
          sources.hero = "name-default";
        }
      }
      if (state.age) {
        if (planner.age && planner.age !== state.age) {
          aiQuestion = null;
          visibleQuestion = null;
          heroQuestion = null;
          followupAnswered = false;
          followupCount = 0;
          followupAnswers = [];
          directorSequence += 1;
        }
        planner.age = state.age;
        sources.age = "chip";
        rememberChild();
      }
      if (sources.language === "select" || sources.language === "edit") planner.language = state.lang;
    } else if (key === "plan") {
      readPlanFields();
    }
    syncSharedPlanner();
  }

  function stepFreeText() {
    var ids = {
      intent: ["guided-intent-custom"],
      topic: ["guided-topic-custom"],
      detail: ["guided-detail-custom"],
      basics: ["guided-about-custom"],
      hero: ["guided-hero-description"],
      personal: ["guided-interests-custom"],
    };
    return (ids[currentKey()] || []).map(function (id) {
      var field = el(id);
      return field ? field.value.trim() : "";
    }).filter(Boolean).join("\n");
  }

  function setAnalyzing(on) {
    document.querySelectorAll(".guided-send").forEach(function (button) {
      button.disabled = !!on;
      button.setAttribute("aria-busy", on ? "true" : "false");
    });
  }


  function validateStep() {
    captureStep();
    var key = currentKey();
    var typed = stepFreeText();
    if (key === "intent" && !state.intent && !planner.intentKey && !planner.idea && !typed) {
      setError("Choose a story need to continue.");
      return false;
    }
    if (key === "purpose" && !state.purpose && !planner.purpose) {
      setError(isArmenianUi() ? "Ընտրիր՝ ինչում պիտի օգնի հեքիաթը։" : "Choose what this story should help with.");
      return false;
    }
    if (key === "topic") {
      if (topicChipsLoading || analyzing) {
        setError("");
        return false;
      }
      var topicPicked = state.topic && state.topic !== "Something else";
      var topicReady = !!typed || !!planner.topic || !!planner.emotion || !!planner.context || !!planner.support || topicPicked;
      if (!topicReady) {
        setError(state.topic === "Something else"
          ? (isArmenianUi() ? "Գրիր մի փոքր ավելին։" : "Tell us a little more in your own words.")
          : (isArmenianUi() ? "Ընտրիր մեկը՝ շարունակելու համար։" : "Choose one to continue."));
        return false;
      }
    }
    if (key === "detail" && !planner.context && !state.detail && !typed) {
      setError("Choose one to continue.");
      return false;
    }
    if (key === "hero") {
      var heroTyped = el("guided-hero-description") ? el("guided-hero-description").value.trim() : "";
      if (!heroTyped && !(state.heroPick && state.heroPick !== "photo") && !(state.heroPick === "photo" && state.image)) {
        setError(isArmenianUi() ? "Ընտրիր հերոսին կամ նկարագրիր։" : "Choose who the hero should be, or describe them.");
        return false;
      }
      if (state.heroPick === "describe" && !heroTyped) {
        setError(isArmenianUi() ? "Նկարագրիր կերպարին։" : "Describe the character to continue.");
        var heroField = el("guided-hero-description");
        if (heroField) heroField.focus();
        return false;
      }
      if (state.heroPick === "kid" && !heroTyped && !heroChildReady()) {
        paintHeroChildPanel();
        setNameFieldError("guided-hero-child-name");
        return false;
      }
      if (state.heroPick === "madeup" && !heroTyped && !madeUpHeroReady()) {
        setNameFieldError("guided-hero-madeup-name");
        return false;
      }
    }
    if (key === "basics" && !planner.age && !state.age && !typed) {
      setError(
        shouldShowProfilePicker()
          ? (isArmenianUi() ? "Ընտրիր պրոֆիլը։" : "Choose a child profile.")
          : (isArmenianUi() ? "Ընտրիր տարիքը։" : "Choose an age.")
      );
      return false;
    }
    if (key === "plan" && !planner.intentKey && !planner.idea && !planner.topic) {
      setError("Add what the story is about.");
      return false;
    }
    setError("");
    return true;
  }

  function clarifyingQuestionText() {
    var found = "";
    followupAnswers.forEach(function (item) {
      if (!item || item.field === "support" || !item.question) return;
      found = item.question;
    });
    return found;
  }

  function clarifyingAnswer() {
    var found = planner.clarifyingQuestion || "";
    followupAnswers.forEach(function (item) {
      if (!item || item.field === "support" || !item.answer) return;
      found = item.answer;
    });
    return found;
  }

  function planHeroName() {
    if (state.heroKind === "kid" || /^(my kid|my child)$/i.test(planner.hero || "")) {
      return tidyPhrase(planner.name || state.childName || "Your child");
    }
    return tidyPhrase(planner.hero || state.heroDescription || "The hero");
  }

  function storyPlanInput() {
    return {
      storyType: tidyPhrase(planner.intentLabel || state.intent || ""),
      clarifyingQuestion: tidyPhrase(clarifyingAnswer()),
      support: tidyPhrase(planner.support || ""),
      hero: planHeroName(),
    };
  }

  function publishStoryPlan() {
    var snapshot = storyPlanInput();
    syncSharedPlanner();
    window.NANIK_STORY_SUMMARY = summaryPlan();
    return snapshot;
  }

  function summaryPlan() {
    return window.NANIK_STORY_PLAN.build(planner, state, followupAnswers, siteUiLang(), storyLanguage());
  }

  function planLikes() {
    var field = el("guided-plan-likes");
    var typed = field ? field.value.trim() : "";
    return typed || planner.likes || "";
  }

  function languageOptions() {
    var select = el("guided-language");
    if (!select) return "";
    return Array.prototype.map.call(select.options, function (option) {
      var selected = option.value === (planner.language || state.lang) ? " selected" : "";
      return '<option value="' + escapeHtml(option.value) + '"' + selected + ">" + escapeHtml(option.textContent || option.value) + "</option>";
    }).join("");
  }

  function lowerLead(value) {
    var text = String(value || "").replace(/\s+/g, " ").trim().replace(/[.?!]+$/, "");
    if (!text) return "";
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function storyScene(value) {
    var text = lowerLead(value);
    if (!text) return "";
    text = text
      .replace(/^(?:feeling |being )?(?:worried|anxious|scared|afraid|nervous|sad|lonely|angry|upset|shy|unsure)(?:\s+about|\s+of)?\s+/i, "")
      .replace(/^(?:a |an )?feeling(?:\s+of)?\s+/i, "");
    return text || "";
  }

  function storyPlace(kind) {
    if (kind.indexOf("comedy") >= 0 || kind.indexOf("funny") >= 0 || kind.indexOf("silly") >= 0) return "as a playful, giggle-filled scene from there";
    if (kind.indexOf("animal") >= 0) return "as a warm animal adventure from there";
    if (kind.indexOf("superhero") >= 0) return "as a brave little hero moment from there";
    if (kind.indexOf("fairy") >= 0 || kind.indexOf("magic") >= 0) return "as a magical scene from there";
    if (kind.indexOf("mystery") >= 0 || kind.indexOf("discover") >= 0 || kind.indexOf("learn") >= 0) return "as a discovery that starts from that question";
    if (kind.indexOf("bedtime") >= 0 || kind.indexOf("calm") >= 0) return "as a quiet nighttime scene from there";
    if (kind.indexOf("surprise") >= 0) return "as an unexpected little adventure from there";
    if (kind.indexOf("adventure") >= 0) return "as an exciting quest from there";
    if (kind.indexOf("new") >= 0) return "from that first scene onward";
    return "from that opening, and the story begins there";
  }

  function planTeaser(plan) {
    var hero = plan.hero || (isArmenianUi() ? "Հերոսը" : "The hero");
    var topic = isArmenianUi() ? String(plan.clarifyingQuestion || "").replace(/\s+/g, " ").trim() : storyScene(plan.clarifyingQuestion);
    if (isArmenianUi()) {
      var opening = topic ? " Բացումը՝ " + topic + "։" : "";
      var kind = String(plan.storyType || "");
      var place = "Հեքիաթը սկսվում է այդ բացումից։";
      if (kind.indexOf("Comedy") >= 0 || kind.indexOf("Funny") >= 0 || kind.indexOf("funny") >= 0 || kind.indexOf("Silly") >= 0) place = "Այն բացվում է որպես զվարճալի, ծիծաղելի տեսարան։";
      else if (kind.indexOf("Animal") >= 0 || kind.indexOf("animal") >= 0) place = "Այն բացվում է որպես կենդանիների տաք արկած։";
      else if (kind.indexOf("Superhero") >= 0 || kind.indexOf("superhero") >= 0) place = "Այն բացվում է որպես փոքրիկ հերոսի պահ։";
      else if (kind.indexOf("Fairy") >= 0 || kind.indexOf("Magic") >= 0 || kind.indexOf("magical") >= 0) place = "Այն բացվում է որպես կախարդական տեսարան։";
      else if (kind.indexOf("Mystery") >= 0 || kind.indexOf("Discover") >= 0 || kind.indexOf("learn") >= 0 || kind.indexOf("Learn") >= 0) place = "Այն սկսվում է որպես հայտնագործություն։";
      else if (kind.indexOf("Bedtime") >= 0 || kind.indexOf("bedtime") >= 0 || kind.indexOf("calm") >= 0) place = "Այն բացվում է որպես հանգիստ գիշերային տեսարան։";
      else if (kind.indexOf("Surprise") >= 0 || kind.indexOf("surprise") >= 0) place = "Այն բացվում է որպես անսպասելի փոքր արկած։";
      else if (kind.indexOf("Adventure") >= 0 || kind.indexOf("adventure") >= 0 || kind.indexOf("magical") >= 0) place = "Այն բացվում է որպես կախարդական արկած։";
      else if (kind.indexOf("new") >= 0) place = "Այն սկսվում է այդ առաջին տեսարանից։";
      return "Հեքիաթի հերոսը " + hero + " է։" + opening + " " + place;
    }
    var placeEn = storyPlace(String(plan.storyType || "").toLowerCase());
    if (topic) {
      return "The story takes place with " + hero + ", opening on " + topic + ". It unfolds " + placeEn + ".";
    }
    return "The story takes place with " + hero + ". It unfolds " + placeEn + ".";
  }


  function paintLanguageChrome() {
    var hy = isArmenianUi();
    var intentTitle = hy ? "Ընտրեք այսօրվա հեքիաթի տեսակը։" : "Select type of the today's story?";
    var planTitle = "";
    var intent = document.querySelector('[data-guided-step="intent"]');
    var plan = document.querySelector('[data-guided-step="plan"]');
    var purpose = document.querySelector('[data-guided-step="purpose"]');
    var heroSection = document.querySelector('[data-guided-step="hero"]');
    if (intent) intent.setAttribute("data-guided-title", intentTitle);
    if (plan) plan.setAttribute("data-guided-title", planTitle);
    if (purpose) purpose.setAttribute("data-guided-title", purposeTitle());
    if (stepKey === "purpose") paintPurposeStep();
    if (heroSection) heroSection.setAttribute("data-guided-title", heroTitle());
    if (heroSection) {
      var heroAria = el("guided-hero-options");
      if (heroAria) heroAria.setAttribute("aria-label", heroTitle());
      var heroDesc = el("guided-hero-description");
      if (heroDesc) {
        heroDesc.setAttribute("aria-label", hy ? "Նկարագրիր հերոսին քո բառերով" : "Describe the hero in your own words");
      }
      if (stepKey === "hero") {
        paintHeroStep();
        paintHeroChildChrome();
      }
    }
    document.querySelectorAll('[data-guided-step="intent"] [data-guided-value]').forEach(function (button) {
      var value = button.getAttribute("data-guided-value") || "";
      var title = button.querySelector(".guided-intent-card-title");
      var desc = button.querySelector(".guided-intent-card-desc");
      if (title) title.textContent = hy && INTENT_LABELS_HY[value] ? INTENT_LABELS_HY[value] : INTENT_LABELS[value] || value;
      if (desc) {
        desc.textContent = hy && INTENT_DESC_HY[value]
          ? INTENT_DESC_HY[value]
          : (INTENT_DESC[value] || desc.textContent);
      }
      button.setAttribute("aria-checked", button.classList.contains("is-on") ? "true" : "false");
    });
    document.querySelectorAll(".guided-or > span").forEach(function (span) {
      span.textContent = hy ? "կամ գրիր" : "or type";
    });
    var elseTitle = el("guided-topic-else-title");
    if (elseTitle) {
      elseTitle.textContent = topicElseTitle();
    }
    var elseInput = el("guided-topic-else-input");
    if (elseInput) {
      elseInput.setAttribute("aria-label", hy ? "Նկարագրիր քո բառերով" : "Describe it in your own words");
      if (!elseInput.value.trim()) {
        elseInput.placeholder = topicElsePrompt().placeholder;
      }
    }
    syncTopicElseCounter();
    var elseContinue = el("guided-topic-else-continue");
    if (elseContinue) elseContinue.setAttribute("aria-label", hy ? "Ուղարկել" : "Send");
    var elseMic = el("guided-topic-else-mic");
    if (elseMic) elseMic.setAttribute("aria-label", hy ? "Ձայնային մուտք" : "Voice typing");
    var back = el("guided-back");
    if (back) {
      var backLabel = back.querySelector(".guided-back-label");
      if (backLabel) backLabel.textContent = hy ? "Հետ" : "Back";
      back.setAttribute("aria-label", hy ? "Հետ" : "Back");
    }
    document.querySelectorAll(".guided-send").forEach(function (button) {
      button.setAttribute("aria-label", hy ? "Ուղարկել" : "Send");
    });
    var planTitles = hy
      ? ["Հեքիաթի լեզուն է", "Ուրիշ ի՞նչ է սիրում երեխադ։"]
      : ["Story language is", "Anything else your child loves?"];
    document.querySelectorAll('[data-guided-step="plan"] h2').forEach(function (heading, index) {
      if (planTitles[index]) heading.textContent = planTitles[index];
    });
    var likes = el("guided-plan-likes");
    if (likes) {
      likes.placeholder = hy ? "Դինոզավրեր, շնիկը, նկարել…" : "Dinosaurs, their dog, drawing…";
      likes.setAttribute("aria-label", hy
        ? "Ուրիշ ի՞նչ է սիրում երեխադ։"
        : "Anything else your child loves?");
    }
    var create = el("guided-plan-create");
    if (create) create.textContent = hy ? "Ստեղծել հեքիաթ" : "Create story";
    var intentField = el("guided-intent-custom");
    if (intentField && !intentField.value.trim()) {
      intentField.placeholder = hy ? INTENT_HINTS_HY[0] : INTENT_HINTS[0];
    }
    var ageLead = el("guided-age-lead") || document.querySelector('[data-guided-step="basics"] .guided-age-lead');
    if (ageLead) {
      ageLead.textContent = hy
        ? "Հեքիաթը, լեզուն, թեմաներն ու հարցերը կհարմարեցնենք նրանց տարիքին։"
        : "We’ll tailor the story, language, themes, and questions to their age.";
    }
    if (stepKey === "basics") paintProfilePicker();
  }

  function planSummaryCardsHtml() {
    publishStoryPlan();
    var plan = summaryPlan();
    var hy = isArmenianUi();
    var intentAssets = {
      "Bedtime": "images/intent-cards/bedtime-felt.png?v=20260915moon",
      "Adventure": "images/intent-cards/adventure-felt.png?v=20260915map",
      "Comedy": "images/intent-cards/funny-silly-felt.png?v=20260915funnyicon",
      "Funny & Silly": "images/intent-cards/funny-silly-felt.png?v=20260915funnyicon",
      "Animals & Magic": "images/intent-cards/animals-magic-felt.png?v=20260915fox",
      "Classic Folklore & Legends": "images/intent-cards/folklore-felt.png?v=20260915storybook",
      "Surprise Me": "images/intent-cards/surprise-me-felt.png?v=20260915gift"
    };
    var storyType = (hy ? INTENT_LABELS_HY : INTENT_LABELS)[planner.intentLabel] || planner.intentLabel;
    var heroTitle = plan.hero.name || (hy ? "Հեքիաթը կընտրի հերոսին" : "The story will choose the hero");
    var heroDetails = plan.hero.mode === "created"
      ? [plan.hero.characterType, plan.hero.description].filter(Boolean).join(" · ")
      : [plan.child.gender, plan.child.interests.join(", ")].filter(Boolean).join(" · ");
    var cards = [
      {
        kind: "story",
        eyebrow: hy ? "Հեքիաթի տեսակ" : "Story type",
        title: storyType,
        detail: "",
        image: intentAssets[planner.intentLabel] || intentAssets["Surprise Me"]
      },
      {
        kind: "hero",
        eyebrow: hy ? "Հերոս" : "Hero",
        title: heroTitle,
        detail: heroDetails,
        image: state.image || (plan.hero.mode === "child"
          ? "images/intent-cards/my-child-transparent.png?v=20260915alpha"
          : "images/intent-cards/made-up-character-transparent.png?v=20260915alpha"),
        userPhoto: !!String(state.image || "").trim()
      }
    ];
    if (plan.direction && plan.direction.answer) {
      cards.push({
        kind: "help",
        eyebrow: hy ? "Ինչպես է հեքիաթն օգնում" : "How the story helps",
        title: plan.direction.answer,
        detail: "",
        image: plan.purpose === "learn"
          ? "images/intent-cards/help-learn-cutout.png?v=20260915learningbook"
          : "images/onboarding-name-voice-hero.png"
      });
    } else if (plan.purpose === "fun") {
      cards.push({
        kind: "help",
        eyebrow: hy ? "Հեքիաթի ուղղություն" : "Story direction",
        title: hy ? "Թող հեքիաթը զարմացնի ձեզ" : "Let the story surprise you",
        detail: "",
        image: "images/intent-cards/great-story-felt.png?v=20260919gift"
      });
    }
    return '<div class="guided-plan-cards">' + cards.map(function (card) {
      return '<article class="guided-plan-card is-' + card.kind + '">' +
        '<span class="guided-plan-card-media" aria-hidden="true"><img class="' +
        (card.userPhoto ? "is-user-photo" : "") +
        '" src="' + escapeHtml(card.image) + '" alt=""></span>' +
        '<span class="guided-plan-card-copy"><span class="guided-plan-card-eyebrow">' + escapeHtml(card.eyebrow) + '</span>' +
        '<strong>' + escapeHtml(card.title) + '</strong>' +
        (card.detail ? '<span class="guided-plan-card-detail">' + escapeHtml(card.detail) + '</span>' : '') +
        '</span></article>';
    }).join("") + "</div>";
  }

  function paintPlan() {
    publishStoryPlan();
    var language = el("guided-plan-language");
    var likes = el("guided-plan-likes");
    if (!planner.language) planner.language = state.lang || "en";
    var details = el("guided-plan-details");
    if (details) details.innerHTML = planSummaryCardsHtml();
    if (language) language.innerHTML = languageOptions();
    if (likes && document.activeElement !== likes) likes.value = planner.likes || "";
    paintPlanQuota();
  }

  function paintPlanQuota(raw) {
    var quota = raw && typeof raw === "object" ? raw : window.NANIK_QUOTA_STATE;
    var row = el("guided-plan-quota");
    var count = el("guided-plan-quota-count");
    if (!row || !count) return;
    var isPlus = !!(quota && quota.isPlus);
    var remaining = quota && Number.isFinite(Number(quota.storiesRemaining))
      ? Math.max(0, Math.floor(Number(quota.storiesRemaining)))
      : (isPlus ? 60 : 3);
    row.hidden = false;
    row.classList.toggle("is-plus", isPlus);
    count.textContent = isArmenianUi()
      ? (isPlus
        ? "Nanik Plus · " + remaining + " հեքիաթ է մնացել այս ամիս"
        : remaining + " հեքիաթ է մնացել")
      : (isPlus
        ? "Nanik Plus · " + remaining + (remaining === 1 ? " story left this month" : " stories left this month")
        : remaining + (remaining === 1 ? " story remaining" : " stories remaining"));
  }

  function readPlanFields() {
    var language = el("guided-plan-language");
    var likes = el("guided-plan-likes");
    if (language && language.value) {
      planner.language = language.value;
      sources.language = "select";
      state.lang = planner.language;
      if (el("guided-language")) el("guided-language").value = planner.language;
    }
    if (likes) {
      planner.likes = likes.value.trim();
      sources.likes = planner.likes ? "text" : "";
    }
    publishStoryPlan();
  }

  function hydrateStepFromPlanner(key) {
    if (key === "intent") {
      if (planner.intentLabel && INTENT_KEYS[planner.intentLabel]) {
        state.intent = planner.intentLabel;
        setSelected(document.querySelector('[data-guided-step="intent"] .guided-choice-grid'), planner.intentLabel, false);
        clearTypeInsert("guided-intent-custom", "guided-intent-insert");
      } else if (!(el("guided-intent-custom") && el("guided-intent-custom").value.trim())) {
        state.intent = "";
        setSelected(document.querySelector('[data-guided-step="intent"] .guided-choice-grid'), "", false);
      }
    }
    if (key === "topic") {
      var field = (aiQuestion && aiQuestion.field) || "topic";
      state.topic = planner[field] || "";
      clearTypeInsert("guided-topic-custom", "guided-topic-insert");
    }
    if (key === "detail") {
      state.topic = planner.topic || state.topic;
      state.detail = planner.context;
      clearTypeInsert("guided-detail-custom", "guided-detail-insert");
    }
    if (key === "basics") {
      if (planner.name && el("guided-child-name")) el("guided-child-name").value = planner.name;
      if (planner.age && el("guided-age")) el("guided-age").value = planner.age;
      if (planner.language && el("guided-language")) el("guided-language").value = planner.language;
      if (state.about && el("guided-about-custom")) el("guided-about-custom").value = state.about;
      clearTypeInsert("guided-about-custom", "guided-about-insert");
    }
    if (key === "hero") {
      clearTypeInsert("guided-hero-description", "guided-hero-insert");
    }
  }

  function showStep(key) {
    if (key !== "topic") closeTopicElsePopup(false);
    var at = history.indexOf(stepKey);
    if (at >= 0) history = history.slice(0, at + 1);
    if (key !== "plan" && history[history.length - 1] !== key) history.push(key);
    stepKey = key;
    stepIndex = Math.max(0, flowSteps().indexOf(key));
    renderStep();
  }

  function paintDots() {
    var dots = el("guided-dots");
    if (!dots) return;
    dots.innerHTML = flowSteps().map(function (_key, index) {
      var cls = "guided-dot";
      if (index < stepIndex) cls += " is-done";
      if (index === stepIndex) cls += " is-on";
      return '<span class="' + cls + '"></span>';
    }).join("");
  }

  function stopDiscoverHints() {
    window.clearInterval(hintTimer);
    hintTimer = 0;
  }

  function paintRotatingHint(fieldId, hintId, hints) {
    var field = el(fieldId);
    var hint = el(hintId);
    if (!field || field.value.trim() || document.activeElement === field) return;
    var next = hints[hintIndex % hints.length];
    hintIndex += 1;
    field.placeholder = next;
    if (!hint) return;
    if (!hint.textContent) {
      hint.textContent = next;
      return;
    }
    if (hint.textContent === next) return;
    hint.classList.remove("is-in");
    hint.classList.add("is-out");
    window.setTimeout(function () {
      hint.textContent = next;
      hint.classList.remove("is-out");
      hint.classList.add("is-in");
    }, 260);
  }


  function startHints(groups) {
    stopDiscoverHints();
    hintIndex = 0;
    var list = (groups || []).map(function (group) {
      return {
        fieldId: group.fieldId,
        hintId: group.hintId,
        hints: (group.hints || []).slice(0, 3),
      };
    }).filter(function (group) { return group.hints.length; });
    if (!list.length) return;
    function paint() {
      list.forEach(function (group) {
        paintRotatingHint(group.fieldId, group.hintId, group.hints);
      });
    }
    paint();
    hintTimer = window.setInterval(paint, 2600);
  }



  function detailHints() {
    var topic = selectedTopic();
    var options = topic && topic.next ? topic.next.options : [];
    var hints = options.slice(0, 3).map(function (option) {
      return isArmenianUi() ? option.label + "…" : "Something about " + option.label.toLowerCase() + "…";
    });
    if (hints.length) return hints;
    if (isArmenianUi()) return ["Մի բան, որ իրեն հոգ է…", "Մի փոքր մանրամասն հենց իր համար…", "Այն, ինչ հիմա մտքում է…"];
    return [
      "Something else they care about…",
      "A small detail just for them…",
      "Whatever is on their mind…",
    ];
  }

  function paintChoices(container, options, selected) {
    if (!container) return;
    container.removeAttribute("aria-busy");
    container.innerHTML = options.map(function (option) {
      var on = option.value === selected;
      var isSomethingElse = option.value === "Something else";
      return (
        '<button type="button" class="guided-choice' +
        (isSomethingElse ? " guided-something-else" : "") +
        (on ? " is-on" : "") +
        '" data-guided-value="' +
        escapeHtml(option.value) +
        '" aria-pressed="' +
        (on ? "true" : "false") +
        '"><span>' +
        option.emoji +
        "</span><strong>" +
        escapeHtml(option.label) +
        "</strong></button>"
      );
    }).join("");
  }

  function applyHeroSelection() {
    var pick = state.heroPick || "";
    var typed = el("guided-hero-description") ? el("guided-hero-description").value.trim() : "";
    var childName = el("guided-hero-child-name") ? el("guided-hero-child-name").value.trim() : "";
    var childLikes = heroChildLikesValue();
    var madeUpName = el("guided-hero-madeup-name") ? el("guided-hero-madeup-name").value.trim() : "";
    var madeUpDescription = el("guided-hero-madeup-description") ? el("guided-hero-madeup-description").value.trim() : "";
    var madeUpType = state.madeUpType || "";
    if (childName) {
      state.childName = childName;
      if (el("guided-child-name")) el("guided-child-name").value = childName;
    }
    // Selecting a saved profile skips the kid form, so its likes field reads empty. Only
    // overwrite when it actually holds something, or the profile's interests are lost.
    if (pick === "kid" && childLikes) {
      planner.likes = childLikes;
      sources.likes = "text";
      state.interests = childLikes.split(/\s*,\s*/).filter(Boolean);
    }
    if (pick === "madeup" && madeUpName) {
      state.madeUpName = madeUpName;
      state.madeUpDescription = madeUpDescription;
      planner.hero = tidyPhrase([madeUpName, madeUpType, madeUpDescription].filter(Boolean).join(", "));
      sources.hero = "text";
      state.heroKind = "madeup";
      state.heroDescription = planner.hero;
    } else if (typed && pick !== "kid") {
      planner.hero = tidyPhrase(typed);
      sources.hero = "text";
      state.heroDescription = typed;
      if (pick === "animal") state.heroKind = "animal";
      else if (pick === "madeup") state.heroKind = "madeup";
      else if (pick === "surprise") state.heroKind = "surprise";
      else state.heroKind = isToyHero(typed) ? "toy" : "imaginary";
    } else if (pick === "kid") {
      planner.name = state.childName || childName || planner.name || "";
      sources.name = planner.name ? "text" : sources.name;
      planner.hero = planner.name || "My child";
      sources.hero = "chip";
      state.heroKind = "kid";
      state.heroDescription = typed || "";
      if (typed) {
        planner.hero = tidyPhrase(planner.name ? planner.name + ", " + typed : typed);
        sources.hero = "text";
        state.heroDescription = typed;
      }
      planner.gender = state.childGender || "";
      sources.gender = state.childGender ? "chip" : "";
    } else if (pick === "madeup") {
      planner.hero = madeUpChipLabel();
      sources.hero = "chip";
      state.heroKind = "madeup";
      state.heroDescription = madeUpChipLabel();
    } else if (pick === "animal") {
      planner.hero = animalChipLabel();
      sources.hero = "chip";
      state.heroKind = "animal";
      state.heroDescription = animalChipLabel();
    } else if (pick === "surprise") {
      planner.hero = isArmenianUi() ? "Թող հեքիաթը որոշի" : "Let the story decide";
      sources.hero = "chip";
      state.heroKind = "surprise";
      state.heroDescription = planner.hero;
    } else if (pick === "photo" && state.image) {
      planner.hero = "Their hero";
      sources.hero = "photo";
      state.heroKind = "photo";
      state.heroDescription = "";
    } else if (pick && pick !== "photo") {
      planner.hero = pick;
      sources.hero = "chip";
      state.heroDescription = pick;
      state.heroKind = isToyHero(pick) ? "toy" : "imaginary";
    }
    syncSharedPlanner();
  }

  function paintPhotoControls() {
    var photo = String(state.image || "").trim();
    var hy = isArmenianUi();
    var fields = document.querySelectorAll(".guided-hero-photo-field");
    fields.forEach(function (field) {
      var upload = field.querySelector(".guided-hero-madeup-upload, .guided-hero-child-photo-upload");
      var wrap = field.querySelector(".guided-hero-photo-preview-wrap");
      var preview = field.querySelector(".guided-hero-photo-preview");
      var remove = field.querySelector(".guided-hero-photo-remove");
      var label = upload && upload.querySelector(".guided-hero-child-label");
      var hint = upload && upload.querySelector(".guided-hero-child-photo-hint");
      var input = upload && upload.querySelector("input[type='file']");
      var isChild = !!(input && input.id === "guided-hero-child-photo");
      if (!photo) {
        field.classList.remove("has-photo");
        if (upload) {
          upload.classList.remove("has-photo");
          upload.hidden = false;
        }
        if (wrap) wrap.remove();
        else if (preview) preview.remove();
        if (label) {
          label.textContent = isChild
            ? (hy ? "Ավելացնել երեխայի լուսանկար" : "Upload a photo of your child")
            : (hy ? "Ավելացնել խաղալիքի լուսանկար (ըստ ցանկության)" : "Upload a photo of the toy (optional)");
        }
        if (hint) hint.hidden = false;
        if (input) input.value = "";
        return;
      }
      field.classList.add("has-photo");
      if (upload) {
        upload.classList.add("has-photo");
        upload.hidden = true;
      }
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "guided-hero-photo-preview-wrap";
        preview = document.createElement("img");
        preview.className = "guided-hero-photo-preview";
        preview.alt = "";
        remove = document.createElement("button");
        remove.type = "button";
        remove.className = "guided-hero-photo-remove";
        remove.setAttribute("aria-label", hy ? "Հեռացնել լուսանկարը" : "Remove photo");
        remove.innerHTML = "&times;";
        wrap.appendChild(preview);
        wrap.appendChild(remove);
        field.insertBefore(wrap, upload || field.firstChild);
      } else {
        if (!preview) {
          preview = document.createElement("img");
          preview.className = "guided-hero-photo-preview";
          preview.alt = "";
          wrap.insertBefore(preview, wrap.firstChild);
        }
        if (!remove) {
          remove = document.createElement("button");
          remove.type = "button";
          remove.className = "guided-hero-photo-remove";
          remove.innerHTML = "&times;";
          wrap.appendChild(remove);
        }
        remove.setAttribute("aria-label", hy ? "Հեռացնել լուսանկարը" : "Remove photo");
      }
      if (preview.getAttribute("src") !== photo) preview.setAttribute("src", photo);
      if (hint) hint.hidden = true;
    });
    var mediaImgs = document.querySelectorAll(
      '.guided-hero-flip-card[data-guided-value="kid"] .guided-hero-card-media img, ' +
      '.guided-hero-flip-card[data-guided-value="madeup"] .guided-hero-card-media img'
    );
    mediaImgs.forEach(function (img) {
      var card = img.closest("[data-guided-value]");
      var value = card && card.getAttribute("data-guided-value");
      var fallback = value === "madeup"
        ? "images/intent-cards/made-up-character-transparent.png?v=20260915alpha"
        : "images/intent-cards/my-child-transparent.png?v=20260915alpha";
      if (!photo) {
        img.classList.remove("is-user-photo");
        if (img.getAttribute("src") !== fallback) img.setAttribute("src", fallback);
        return;
      }
      img.classList.add("is-user-photo");
      if (img.getAttribute("src") !== photo) img.setAttribute("src", photo);
    });
  }

  function clearHeroPhoto() {
    state.image = "";
    toyPhotoChosen = false;
    if (state.heroPick === "photo") state.heroPick = "";
    paintPhotoControls();
    if (state.heroPick === "kid") rememberChild({ force: true });
  }

  function heroPhotoUploadHtml(inputId, labelText, hintText, ariaLabel) {
    var photo = String(state.image || "").trim();
    var hy = isArmenianUi();
    return (
      '<div class="guided-hero-photo-field' + (photo ? " has-photo" : "") + '">' +
      (photo
        ? '<div class="guided-hero-photo-preview-wrap">' +
          '<img class="guided-hero-photo-preview" src="' + escapeHtml(photo) + '" alt="">' +
          '<button type="button" class="guided-hero-photo-remove" aria-label="' +
          (hy ? "Հեռացնել լուսանկարը" : "Remove photo") +
          '">&times;</button></div>'
        : "") +
      '<label class="guided-hero-madeup-upload guided-hero-child-photo-upload"' +
      (photo ? " hidden" : "") +
      ">" +
      '<span class="guided-hero-child-label">' + labelText + "</span>" +
      '<small class="guided-hero-child-photo-hint" id="' +
      (inputId === "guided-hero-child-photo" ? "guided-hero-child-photo-hint" : "") +
      '">' +
      hintText +
      "</small>" +
      '<input id="' +
      inputId +
      '" type="file" accept="image/*" aria-label="' +
      ariaLabel +
      '"></label></div>'
    );
  }

  function clearHeroCardFocus() {
    var grid = el("guided-hero-options");
    var step = document.querySelector('[data-guided-step="hero"]');
    var root = el("guided-create");
    if (grid) {
      grid.classList.remove("is-kid-focus");
      grid.querySelectorAll(".guided-hero-flip-card.is-flipped").forEach(function (card) {
        card.classList.remove("is-flipped");
      });
    }
    if (step) step.classList.remove("is-kid-focus");
    if (root) {
      root.classList.remove("is-kid-hero-focus");
      root.classList.remove("is-keyboard-field");
    }
  }

  function syncHeroCardFocusChrome(focused) {
    if (currentKey() !== "hero") return;
    var footer = el("guided-footer");
    var back = el("guided-back");
    if (footer) footer.hidden = !!focused;
    if (back) back.hidden = stepIndex === 0 && !focused;
  }

  function paintHeroChildPanel() {
    if (currentKey() !== "hero") {
      clearHeroCardFocus();
      return;
    }
    var flipped = state.heroPick === "kid";
    var madeUpFlipped = state.heroPick === "madeup";
    var focused = flipped || madeUpFlipped;
    var grid = el("guided-hero-options");
    var step = document.querySelector('[data-guided-step="hero"]');
    var root = el("guided-create");
    var card = grid && grid.querySelector('[data-guided-value="kid"]');
    var madeUpCard = grid && grid.querySelector('[data-guided-value="madeup"]');
    var activeCard = flipped ? card : madeUpFlipped ? madeUpCard : null;
    var wasFocused = !!(grid && grid.classList.contains("is-kid-focus"));

    if (!focused) {
      if (card) card.classList.remove("is-flipped");
      if (madeUpCard) madeUpCard.classList.remove("is-flipped");
      if (grid) grid.classList.remove("is-kid-focus");
      if (step) step.classList.remove("is-kid-focus");
      if (root) root.classList.remove("is-kid-hero-focus");
      syncHeroCardFocusChrome(false);
    } else {
      // Expand layout first, then flip on the next frame so the motions don't stack.
      if (grid) grid.classList.add("is-kid-focus");
      if (step) step.classList.add("is-kid-focus");
      if (root) root.classList.add("is-kid-hero-focus");
      syncHeroCardFocusChrome(true);
      if (card && card !== activeCard) card.classList.remove("is-flipped");
      if (madeUpCard && madeUpCard !== activeCard) madeUpCard.classList.remove("is-flipped");
      if (activeCard && !activeCard.classList.contains("is-flipped")) {
        if (!wasFocused) {
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
              if (state.heroPick !== "kid" && state.heroPick !== "madeup") return;
              var live = el("guided-hero-options") && el("guided-hero-options").querySelector(
                state.heroPick === "kid" ? '[data-guided-value="kid"]' : '[data-guided-value="madeup"]'
              );
              if (live) live.classList.add("is-flipped");
            });
          });
        } else {
          activeCard.classList.add("is-flipped");
        }
      }
    }

    var nameField = el("guided-hero-child-name");
    if (nameField && flipped && !nameField.value.trim() && (state.childName || planner.name)) {
      nameField.value = state.childName || planner.name || "";
    }
    paintHeroGender();
    paintHeroChildChrome();
  }

  function exitKidCardFocus() {
    if (state.heroPick === "kid" || state.heroPick === "madeup") {
      state.heroPick = "";
      state.heroKind = "";
      // Gender describes the child the story is for, not the hero, so it survives here.
    }
    var grid = el("guided-hero-options");
    if (grid) setSelected(grid, state.heroPick || "", false);
    setHeroKeyboardField(false);
    paintHeroChildPanel();
  }

  function setHeroKeyboardField(on) {
    var root = el("guided-create");
    if (!root) return;
    root.classList.toggle("is-keyboard-field", !!on);
  }

  function heroFieldScrollPad() {
    var vv = window.visualViewport;
    if (!vv) return 28;
    var covered = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    return Math.max(28, covered + 20);
  }

  function ensureHeroFieldVisible(field) {
    if (!field || !field.getBoundingClientRect) return;
    var root = el("guided-create");
    var card = root && root.querySelector(".guided-card");
    if (!card) return;
    var vv = window.visualViewport;
    var top = vv ? vv.offsetTop + 12 : 12;
    var bottom = vv ? vv.offsetTop + vv.height - heroFieldScrollPad() : window.innerHeight - 28;
    var rect = field.getBoundingClientRect();
    var delta = 0;
    if (rect.bottom > bottom) delta = rect.bottom - bottom;
    else if (rect.top < top) delta = rect.top - top;
    if (!delta) return;
    if (typeof card.scrollBy === "function") card.scrollBy({ top: delta, behavior: "smooth" });
    else card.scrollTop += delta;
  }

  function scheduleHeroFieldVisible(field) {
    if (!field) return;
    setHeroKeyboardField(true);
    window.setTimeout(function () { ensureHeroFieldVisible(field); }, 60);
    window.setTimeout(function () { ensureHeroFieldVisible(field); }, 280);
    window.setTimeout(function () { ensureHeroFieldVisible(field); }, 520);
  }

  function wireHeroKeyboardScroll() {
    var root = el("guided-create");
    if (!root || root.getAttribute("data-hero-keyboard-wired") === "1") return;
    root.setAttribute("data-hero-keyboard-wired", "1");
    var activeField = null;

    function isHeroFormField(node) {
      if (!node || !node.id) return false;
      return (
        node.id === "guided-hero-madeup-name" ||
        node.id === "guided-hero-madeup-description" ||
        node.id === "guided-hero-child-name" ||
        node.id === "guided-hero-child-likes" ||
        node.id === "guided-hero-child-age"
      );
    }

    root.addEventListener("focusin", function (event) {
      var field = event.target;
      if (!isHeroFormField(field)) return;
      if (!root.classList.contains("is-kid-hero-focus")) return;
      activeField = field;
      scheduleHeroFieldVisible(field);
    });

    root.addEventListener("focusout", function (event) {
      var field = event.target;
      if (!isHeroFormField(field)) return;
      window.setTimeout(function () {
        var next = document.activeElement;
        if (isHeroFormField(next) && root.contains(next)) {
          activeField = next;
          return;
        }
        activeField = null;
        setHeroKeyboardField(false);
      }, 0);
    });

    function onViewportChange() {
      if (!activeField || document.activeElement !== activeField) return;
      ensureHeroFieldVisible(activeField);
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportChange);
      window.visualViewport.addEventListener("scroll", onViewportChange);
    }
    window.addEventListener("resize", onViewportChange);
  }

  function paintHeroChildChrome() {
    var hy = isArmenianUi();
    var nameInput = el("guided-hero-child-name");
    if (nameInput) {
      nameInput.setAttribute("aria-label", hy ? "Անուն" : "Name");
      nameInput.placeholder = " ";
      var floatingLabel = nameInput.nextElementSibling;
      if (floatingLabel && floatingLabel.classList.contains("guided-floating-label")) {
        floatingLabel.textContent = hy ? "Անուն" : "Name";
      }
    }
    var ageLabel = document.querySelector("#guided-hero-child-age") && document.querySelector("#guided-hero-child-age").previousElementSibling;
    if (ageLabel) ageLabel.textContent = hy ? "Տարիք" : "Age";
    var ageSelect = el("guided-hero-child-age");
    if (ageSelect) {
      ageSelect.setAttribute("aria-label", hy ? "Տարիք" : "Age");
      var selectedAge = String(planner.age || state.age || "");
      if (selectedAge && ageSelect.value !== selectedAge) ageSelect.value = selectedAge;
    }
    var likesInput = el("guided-hero-child-likes");
    if (likesInput) {
      likesInput.setAttribute("aria-label", hy ? "Ինչ է սիրում երեխան" : "What your child likes");
      likesInput.placeholder = " ";
      var likesFloatingLabel = el("guided-hero-child-likes-field") && el("guided-hero-child-likes-field").querySelector(".guided-floating-label");
      if (likesFloatingLabel) likesFloatingLabel.textContent = hy ? "Հետաքրքրություններ" : "Interests";
    }
    var likesHint = el("guided-hero-child-likes-hint");
    if (likesHint) {
      likesHint.textContent = hy
        ? "Ավելացրու հետաքրքրություններ՝ բաժանելով ստորակետով"
        : "Add interests and separate them with commas";
    }
    var photoHint = el("guided-hero-child-photo-hint");
    if (photoHint) {
      photoHint.textContent = hy
        ? "Մենք կստեղծենք գեղեցիկ նկար ձեր երեխայի լուսանկարով"
        : "We'll create a nice illustration from your child's photo";
    }
    var photoLabel = document.querySelector(".guided-hero-child-photo-upload .guided-hero-child-label");
    if (photoLabel) photoLabel.textContent = hy ? "Ավելացնել երեխայի լուսանկար" : "Upload a photo of your child";
    var genderGroup = el("guided-hero-gender");
    if (genderGroup) genderGroup.setAttribute("aria-label", hy ? "Սեռ" : "Gender");
    var genderLabels = hy
      ? { girl: "Աղջիկ", boy: "Տղա", unspecified: "Չեմ նշում" }
      : { girl: "Girl", boy: "Boy", unspecified: "Prefer not to say" };
    genderGroup && genderGroup.querySelectorAll("[data-guided-gender]").forEach(function (button) {
      var key = button.getAttribute("data-guided-gender") || "";
      var strong = button.querySelector("strong");
      if (strong && genderLabels[key]) strong.textContent = genderLabels[key];
    });
    var next = el("guided-hero-child-next");
    if (next) next.textContent = hy ? "Հաջորդ" : "Next";
  }

  function paintHeroGender() {
    var group = el("guided-hero-gender");
    if (!group) return;
    group.querySelectorAll("[data-guided-gender]").forEach(function (button) {
      var on = button.getAttribute("data-guided-gender") === state.childGender;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-checked", on ? "true" : "false");
    });
  }

  function heroLikesTokens() {
    var box = el("guided-hero-child-likes-chips");
    if (!box) return [];
    return Array.prototype.map.call(box.querySelectorAll("[data-like-chip]"), function (chip) {
      return (chip.getAttribute("data-like-chip") || "").trim();
    }).filter(Boolean);
  }

  function heroChildLikesValue() {
    var tokens = heroLikesTokens();
    var input = el("guided-hero-child-likes");
    var typing = input ? input.value.trim().replace(/,$/, "") : "";
    if (typing) tokens = tokens.concat([typing]);
    return tokens.join(", ");
  }

  function paintHeroLikesChips(tokens) {
    var box = el("guided-hero-child-likes-chips");
    if (!box) return;
    var list = (tokens || heroLikesTokens()).filter(Boolean);
    box.innerHTML = list.map(function (item) {
      return (
        '<button type="button" class="guided-hero-like-chip" data-like-chip="' +
        escapeHtml(item) +
        '" aria-label="' +
        escapeHtml(item) +
        '">' +
        escapeHtml(item) +
        '<span aria-hidden="true">×</span></button>'
      );
    }).join("");
  }

  function commitHeroLikeToken() {
    var input = el("guided-hero-child-likes");
    if (!input) return;
    var next = input.value.trim().replace(/,$/, "");
    if (!next) {
      input.value = "";
      return;
    }
    var tokens = heroLikesTokens();
    var key = next.toLowerCase();
    if (!tokens.some(function (item) { return item.toLowerCase() === key; })) {
      tokens.push(next);
    }
    paintHeroLikesChips(tokens);
    input.value = "";
  }

  function heroChildReady() {
    var nameField = el("guided-hero-child-name");
    var name = nameField ? nameField.value.trim() : state.childName;
    return !!name;
  }

  function heroAgeOptionsHtml(selected) {
    var n = parseInt(selected, 10);
    var html = "";
    for (var age = 2; age <= 16; age++) {
      html +=
        '<option value="' + age + '"' + (age === n ? " selected" : "") + ">" +
        escapeHtml(ageYearsLabel(age)) +
        "</option>";
    }
    return html;
  }

  function madeUpHeroReady() {
    var nameField = el("guided-hero-madeup-name");
    return !!(nameField && nameField.value.trim());
  }

  function paintHeroKidCard(option, selected) {
    var on = option.value === selected;
    var hy = isArmenianUi();
    var kids = namedChildProfiles();
    var showPicker = !heroKidFormMode && kids.length > 0;
    var nameValue = escapeHtml(state.childName || planner.name || "");
    var backFace = "";
    if (showPicker) {
      backFace =
        '<div class="guided-hero-flip-face guided-hero-flip-back guided-hero-profile-back">' +
        '<p class="guided-hero-profile-lead">' +
        (hy ? "Ընտրիր երեխայի պրոֆիլը" : "Choose a child profile") +
        "</p>" +
        '<div class="guided-hero-profile-list" role="list">' +
        kids.map(function (kid) {
          var label = kid.name || (hy ? "Երեխա" : "Child");
          var meta = ageYearsLabel(kid.age);
          var avatar = kid.photo
            ? '<img class="guided-hero-profile-photo" src="' + escapeHtml(kid.photo) + '" alt="">'
            : "";
          return (
            '<div class="guided-hero-profile-row" role="listitem">' +
            '<div class="guided-hero-profile-info">' +
            avatar +
            '<span class="guided-profile-copy"><strong>' + escapeHtml(label) + "</strong>" +
            (meta ? "<span>" + escapeHtml(meta) + "</span>" : "") +
            "</span></div>" +
            '<span class="guided-hero-profile-actions">' +
            '<button type="button" class="guided-hero-profile-edit" data-hero-child-edit="' +
            escapeHtml(kid.id) +
            '">' +
            (hy ? "Խմբագրել" : "Edit") +
            "</button>" +
            '<button type="button" class="guided-hero-profile-select" data-hero-child-id="' +
            escapeHtml(kid.id) +
            '">' +
            (hy ? "Ընտրել" : "Select") +
            "</button></span></div>"
          );
        }).join("") +
        "</div>" +
        '<button type="button" class="guided-hero-profile-new" id="guided-hero-profile-new">' +
        (hy ? "Ավելացնել նոր երեխա" : "Add new kid") +
        "</button></div>";
    } else {
      backFace =
        '<div class="guided-hero-flip-face guided-hero-flip-back">' +
        (kids.length
          ? '<button type="button" class="guided-hero-profile-back-link" id="guided-hero-profile-back">' +
            (hy ? "← Պրոֆիլներ" : "← Profiles") +
            "</button>"
          : "") +
        '<label class="guided-hero-child-name guided-floating-field">' +
        '<input id="guided-hero-child-name" type="text" maxlength="40" autocomplete="given-name" value="' + nameValue + '" placeholder=" " aria-label="' + (hy ? "Անուն" : "Name") + '">' +
        '<span class="guided-floating-label">' + (hy ? "Անուն" : "Name") + '</span>' +
        "</label>" +
        '<label class="dash-kids-age-field">' +
        '<span class="dash-kids-age-label">' + (hy ? "Տարիք" : "Age") + "</span>" +
        '<select id="guided-hero-child-age" aria-label="' + (hy ? "Տարիք" : "Age") + '">' +
        heroAgeOptionsHtml(planner.age || state.age) +
        "</select></label>" +
        '<div class="guided-hero-gender" id="guided-hero-gender" role="radiogroup" aria-label="' + (hy ? "Սեռ" : "Gender") + '">' +
        '<button type="button" class="guided-choice" role="radio" aria-checked="false" data-guided-gender="girl"><strong>' + (hy ? "Աղջիկ" : "Girl") + "</strong></button>" +
        '<button type="button" class="guided-choice" role="radio" aria-checked="false" data-guided-gender="boy"><strong>' + (hy ? "Տղա" : "Boy") + "</strong></button>" +
        '<button type="button" class="guided-choice" role="radio" aria-checked="false" data-guided-gender="unspecified"><strong>' + (hy ? "Չեմ նշում" : "Prefer not to say") + "</strong></button>" +
        "</div>" +
        '<div class="guided-hero-chip-field" id="guided-hero-child-likes-field">' +
        '<span class="guided-floating-label">' + (hy ? "Հետաքրքրություններ" : "Interests") + "</span>" +
        '<span class="guided-hero-child-likes-chips" id="guided-hero-child-likes-chips" aria-live="polite"></span>' +
        '<input id="guided-hero-child-likes" type="text" maxlength="40" placeholder=" " aria-label="' + (hy ? "Ինչ է սիրում երեխան" : "What your child likes") + '">' +
        "</div>" +
        '<p class="guided-hero-child-likes-hint" id="guided-hero-child-likes-hint"></p>' +
        heroPhotoUploadHtml(
          "guided-hero-child-photo",
          hy ? "Ավելացնել երեխայի լուսանկար" : "Upload a photo of your child",
          hy
            ? "Մենք կստեղծենք գեղեցիկ նկար ձեր երեխայի լուսանկարով"
            : "We'll create a nice illustration from your child's photo",
          hy ? "Երեխայի լուսանկար" : "Child photo"
        ) +
        '<button type="button" class="guided-hero-child-next" id="guided-hero-child-next">' + (hy ? "Հաջորդ" : "Next") + "</button>" +
        "</div>";
    }
    var kidMediaSrc = String(state.image || "").trim() || "images/intent-cards/my-child-transparent.png?v=20260915alpha";
    var kidMediaClass = String(state.image || "").trim() ? " is-user-photo" : "";
    return (
      '<div class="guided-choice guided-intent-card guided-hero-flip-card guided-hero-card' +
      (on ? " is-on is-flipped" : "") +
      '" role="radio" tabindex="0" aria-checked="' +
      (on ? "true" : "false") +
      '" data-guided-value="kid">' +
      '<div class="guided-hero-flip-inner">' +
      '<div class="guided-hero-flip-face guided-hero-flip-front">' +
      '<span class="guided-intent-card-media guided-hero-card-media" aria-hidden="true">' +
      '<img class="' + kidMediaClass.trim() + '" src="' + escapeHtml(kidMediaSrc) + '" alt="" width="1024" height="1024" loading="lazy" decoding="async">' +
      "</span>" +
      '<span class="guided-intent-card-copy">' +
      '<strong class="guided-intent-card-title">' + escapeHtml(option.label) + "</strong>" +
      (option.desc ? '<span class="guided-intent-card-desc">' + escapeHtml(option.desc) + "</span>" : "") +
      "</span>" +
      '<span class="guided-intent-card-arrow" aria-hidden="true">&#8594;</span>' +
      "</div>" +
      backFace +
      "</div></div>"
    );
  }

  function paintHeroMadeUpCard(option, selected) {
    var on = option.value === selected;
    var hy = isArmenianUi();
    var madeupMediaSrc = String(state.image || "").trim() || "images/intent-cards/made-up-character-transparent.png?v=20260915alpha";
    var madeupMediaClass = String(state.image || "").trim() ? " is-user-photo" : "";
    return (
      '<div class="guided-choice guided-intent-card guided-hero-flip-card guided-hero-card guided-hero-madeup-card' +
      (on ? " is-on is-flipped" : "") +
      '" role="radio" tabindex="0" aria-checked="' +
      (on ? "true" : "false") +
      '" data-guided-value="madeup">' +
      '<div class="guided-hero-flip-inner">' +
      '<div class="guided-hero-flip-face guided-hero-flip-front">' +
      '<span class="guided-intent-card-media guided-hero-card-media" aria-hidden="true">' +
      '<img class="' + madeupMediaClass.trim() + '" src="' + escapeHtml(madeupMediaSrc) + '" alt="" width="1024" height="935" loading="lazy" decoding="async">' +
      "</span>" +
      '<span class="guided-intent-card-copy">' +
      '<strong class="guided-intent-card-title">' + escapeHtml(option.label) + "</strong>" +
      (option.desc ? '<span class="guided-intent-card-desc">' + escapeHtml(option.desc) + "</span>" : "") +
      "</span>" +
      '<span class="guided-intent-card-arrow" aria-hidden="true">&#8594;</span>' +
      "</div>" +
      '<div class="guided-hero-flip-face guided-hero-flip-back">' +
      '<label class="guided-hero-child-name guided-floating-field">' +
      '<input id="guided-hero-madeup-name" type="text" maxlength="40" autocomplete="off" placeholder=" " aria-label="' + (hy ? "Կերպարի անունը" : "Character name") + '">' +
      '<span class="guided-floating-label">' + (hy ? "Ինչպե՞ս է կոչվում կերպարը" : "What should we call them?") + '</span>' +
      "</label>" +
      '<span class="guided-hero-child-label">' + (hy ? "Ի՞նչ է դա" : "What is it?") + "</span>" +
      '<div class="guided-hero-madeup-types" id="guided-hero-madeup-types" role="radiogroup">' +
      '<button type="button" class="guided-choice" data-guided-madeup-type="Animal" role="radio"><strong>' + (hy ? "Կենդանի" : "Animal") + "</strong></button>" +
      '<button type="button" class="guided-choice" data-guided-madeup-type="Magical creature" role="radio"><strong>' + (hy ? "Կախարդական արարած" : "Magical creature") + "</strong></button>" +
      '<button type="button" class="guided-choice" data-guided-madeup-type="Other" role="radio"><strong>' + (hy ? "Այլ" : "Other") + "</strong></button>" +
      "</div>" +
      '<label class="guided-hero-madeup-description guided-floating-textarea">' +
      '<textarea id="guided-hero-madeup-description" rows="2" maxlength="160" placeholder=" " aria-label="' + (hy ? "Նկարագրիր հերոսին մի քանի բառով" : "Describe the hero with couple of words") + '"></textarea>' +
      '<span class="guided-floating-label">' + (hy ? "Նկարագրիր հերոսին մի քանի բառով" : "Describe the hero with couple of words") + '</span></label>' +
      heroPhotoUploadHtml(
        "guided-hero-madeup-photo",
        hy ? "Ավելացնել խաղալիքի լուսանկար (ըստ ցանկության)" : "Upload a photo of the toy (optional)",
        hy
          ? "Ինչ էլ վերբեռնես՝ մենք դրանով կստեղծենք գեղեցիկ նկար"
          : "Whatever you upload will be used to create a nice illustration",
        hy ? "Խաղալիքի լուսանկար" : "Toy photo"
      ) +
      '<button type="button" class="guided-hero-child-next" id="guided-hero-madeup-next">' + (hy ? "Հաջորդ" : "Next") + "</button>" +
      "</div></div></div>"
    );
  }

  function paintIntentCards(container, options, selected) {
    if (!container) return;
    container.innerHTML = options.map(function (option) {
      if (option.value === "kid") return paintHeroKidCard(option, selected);
      if (option.value === "madeup") return paintHeroMadeUpCard(option, selected);
      var on = option.value === selected;
      return (
        '<button type="button" class="guided-choice guided-intent-card' +
        (on ? " is-on" : "") +
        '" role="radio" aria-checked="' +
        (on ? "true" : "false") +
        '" data-guided-value="' +
        escapeHtml(option.value) +
        '">' +
        '<span class="guided-intent-card-radio" aria-hidden="true"></span>' +
        '<span class="guided-intent-card-copy">' +
        '<strong class="guided-intent-card-title">' +
        escapeHtml(option.label) +
        "</strong>" +
        (option.desc
          ? '<span class="guided-intent-card-desc">' + escapeHtml(option.desc) + "</span>"
          : "") +
        "</span></button>"
      );
    }).join("");
  }

  function paintHeroStep(title) {
    var question = staticHeroQuestion();
    heroQuestion = question;
    if (title) title.textContent = heroTitle();
    var grid = el("guided-hero-options");
    if (grid) grid.setAttribute("aria-label", heroTitle());
    paintIntentCards(grid, question.chips, state.heroPick);
    if (el("guided-hero-madeup-name")) el("guided-hero-madeup-name").value = state.madeUpName || "";
    if (el("guided-hero-madeup-description")) el("guided-hero-madeup-description").value = state.madeUpDescription || "";
    paintHeroLikesChips(String(planner.likes || "").split(",").map(function (item) { return item.trim(); }).filter(Boolean));
    if (grid) grid.querySelectorAll("[data-guided-madeup-type]").forEach(function (button) {
      var selected = button.getAttribute("data-guided-madeup-type") === state.madeUpType;
      button.classList.toggle("is-on", selected);
      button.setAttribute("aria-checked", selected ? "true" : "false");
    });
    var decide = el("guided-hero-decide");
    if (decide) {
      var deciding = state.heroPick === "surprise";
      decide.classList.toggle("is-on", deciding);
      decide.setAttribute("aria-pressed", deciding ? "true" : "false");
      decide.innerHTML = (isArmenianUi() ? "Թող հեքիաթը որոշի" : "Let the story decide") +
        ' <span aria-hidden="true">&#8594;</span>';
    }
    paintHeroChildPanel();
    paintPhotoControls();
  }

  function paintTreeStep(key, title) {
    if (key === "topic") {
      if (!aiQuestion) aiQuestion = visibleQuestion;
      if (!aiQuestion) return;
      var purpose = purposeKey();
      var topicTitle;
      if (purpose === "learn") topicTitle = purposeQuestionTitle("learn");
      else if (purpose === "today") topicTitle = supportTitle();
      else topicTitle = (aiQuestion && aiQuestion.title) || "";
      aiQuestion.title = topicTitle;
      if (visibleQuestion) visibleQuestion.title = topicTitle;
      if (title) title.textContent = topicTitle;
      var topicGrid = el("guided-topic-options");
      var topicStep = document.querySelector('[data-guided-step="topic"]');
      if (topicStep) topicStep.classList.toggle("is-learn-topic", purpose === "learn");
      if (topicGrid) topicGrid.setAttribute("aria-label", topicTitle);
      if (topicChipsLoading) {
        paintTopicSkeleton(topicGrid);
      } else {
        paintChoices(topicGrid, aiQuestion.chips || [], state.topic || planner[aiQuestion.field]);
      }
    } else if (key === "detail") {
      var topic = selectedTopic();
      var next = topic && topic.next;
      if (!next) return;
      if (title) title.textContent = next.title;
      var detailGrid = el("guided-detail-options");
      if (detailGrid) detailGrid.setAttribute("aria-label", next.title);
      paintChoices(detailGrid, next.options, state.detail);
    }
  }

  function renderStep() {
    var steps = flowSteps();
    var key = steps[stepIndex] || stepKey;
    stepKey = key;
    hydrateStepFromPlanner(key);
    var activeSection = null;
    document.querySelectorAll("[data-guided-step]").forEach(function (section) {
      var on = section.getAttribute("data-guided-step") === key;
      section.hidden = !on;
      section.classList.toggle("is-on", on);
      if (on) activeSection = section;
    });
    paintLanguageChrome();
    var titleRow = el("guided-title-row");
    var title = el("guided-step-title");
    var titleText = activeSection ? activeSection.getAttribute("data-guided-title") || "" : "";
    var heroCardFocused = key === "hero" && (state.heroPick === "kid" || state.heroPick === "madeup");
    var profileAddBack = key === "basics" && addingNewProfile && listChildProfiles().length > 0;
    var backHidden = stepIndex === 0 && !heroCardFocused && !profileAddBack;
    // Summary keeps only the back beside Create story — never the title-row back.
    if (key === "plan" || key === "generating") {
      if (title) {
        title.textContent = "";
        title.hidden = true;
      }
      if (titleRow) titleRow.hidden = true;
      var topBack = el("guided-back");
      if (topBack) topBack.hidden = true;
    } else {
      if (title) {
        title.textContent = titleText;
        title.hidden = false;
      }
      if (titleRow) titleRow.hidden = false;
      var stepBack = el("guided-back");
      if (stepBack) stepBack.hidden = backHidden;
    }
    if (key === "basics") {
      paintProfilePicker();
      syncAgeChips(planner.age || state.age);
    }
    paintTreeStep(key, title);
    if (key === "purpose") paintPurposeStep(title);
    if (key === "hero") paintHeroStep(title);
    else clearHeroCardFocus();
    if (key === "plan") paintPlan();
    var planBack = el("guided-plan-back");
    if (planBack) {
      planBack.setAttribute("aria-label", isArmenianUi() ? "Հետ" : "Back");
    }
    el("guided-footer").hidden = true;
    paintDots();
    el("guided-card").scrollTop = 0;
    setError("");
    revealChoiceStep(activeSection, key === "plan" || key === "generating" ? null : titleRow);
    if (key === "intent") stopDiscoverHints();
    else if (key === "purpose") stopDiscoverHints();
    else if (key === "topic") stopDiscoverHints();
    else if (key === "detail") startHints([{ fieldId: "guided-detail-custom", hintId: "guided-detail-hint", hints: detailHints() }]);
    else if (key === "basics") startHints([{ fieldId: "guided-about-custom", hintId: "guided-about-hint", hints: isArmenianUi() ? ABOUT_HINTS_HY : ABOUT_HINTS }]);
    else if (key === "hero") startHints([{ fieldId: "guided-hero-description", hintId: "guided-hero-hint", hints: isArmenianUi() ? HERO_HINTS_HY : HERO_HINTS }]);
    else if (key === "personal") {
      startHints([
        { fieldId: "guided-interests-custom", hintId: "guided-interests-hint", hints: isArmenianUi() ? INTEREST_HINTS_HY : INTEREST_HINTS },
      ]);
    }
    else if (key === "plan") stopDiscoverHints();
    else stopDiscoverHints();
  }

  function clearAutoAdvance() {
    window.clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = 0;
  }

  function scheduleAutoAdvance() {
    clearAutoAdvance();
    autoAdvanceTimer = window.setTimeout(function () {
      autoAdvanceTimer = 0;
      goNext();
    }, 430);
  }

  function goBack() {
    if (analyzing && !(topicChipsLoading && stepKey === "topic")) return;
    if (topicChipsLoading) {
      topicChipsLoading = false;
      analyzing = false;
      setAnalyzing(false);
      clearPurposeChipPrefetch();
    }
    if (el("guided-topic-else") && !el("guided-topic-else").hidden) {
      closeTopicElsePopup(true);
      return;
    }
    if (stepKey === "basics" && addingNewProfile && listChildProfiles().length) {
      clearAutoAdvance();
      addingNewProfile = false;
      planner.age = "";
      planner.name = "";
      planner.childId = "";
      state.age = "";
      state.childName = "";
      if (el("guided-age")) el("guided-age").value = "";
      if (el("guided-child-name")) el("guided-child-name").value = "";
      syncAgeChips("");
      setError("");
      renderStep();
      return;
    }
    if (stepKey === "hero" && (state.heroPick === "kid" || state.heroPick === "madeup")) {
      clearAutoAdvance();
      exitKidCardFocus();
      setError("");
      return;
    }
    if (stepIndex <= 0 && stepKey !== "plan") return;
    clearAutoAdvance();
    cancelChoiceTransition();
    endAdvance();
    var leaving = stepKey;
    if (leaving === "plan") {
      stepKey = history[history.length - 1] || "intent";
      stepIndex = Math.max(0, flowSteps().indexOf(stepKey));
      if (stepKey === "intent") clearProgressAfterIntent();
      else {
        clearTypeInsert("guided-hero-description", "guided-hero-insert");
        clearTypeInsert("guided-topic-custom", "guided-topic-insert");
      }
      renderStep();
      return;
    }
    var at = history.indexOf(stepKey);
    if (at <= 0) return;
    stepKey = history[at - 1];
    history = history.slice(0, at);
    stepIndex = Math.max(0, flowSteps().indexOf(stepKey));
    if (stepKey === "intent") {
      clearProgressAfterIntent();
    } else if (leaving === "topic") {
      clearTypeInsert("guided-topic-custom", "guided-topic-insert");
      aiQuestion = visibleQuestion || aiQuestion;
    } else if (leaving === "detail") {
      clearTypeInsert("guided-detail-custom", "guided-detail-insert");
    } else if (leaving === "hero") {
      clearTypeInsert("guided-hero-description", "guided-hero-insert");
    } else if (leaving === "basics") {
      clearTypeInsert("guided-about-custom", "guided-about-insert");
    }
    renderStep();
  }

  function goNext() {
    if (analyzing) return;
    clearAutoAdvance();
    if (stepKey === "plan") {
      readPlanFields();
      if (!planner.intentKey && !planner.idea && !planner.topic && !planner.intentLabel) {
        setError("Add what the story is about.");
        return;
      }
      startGeneration();
      return;
    }
    if (!validateStep()) {
      cancelChoiceTransition();
      return;
    }
    if (stepKey === "hero") {
      applyHeroSelection();
      if (state.heroPick === "kid") rememberChild();
      continueAfterHero();
      return;
    }
    var typed = stepFreeText();
    var hasTyped = typed && !isWelcomePrompt(typed);

    if (stepKey === "basics") {
      if (shouldShowProfilePicker() && !planner.age && !state.age) {
        setError(isArmenianUi() ? "Ընտրիր պրոֆիլը։" : "Choose a child profile.");
        return;
      }
      if (!planner.age && !state.age) {
        setError(isArmenianUi() ? "Ընտրիր տարիքը։" : "Choose an age.");
        return;
      }
      rememberChild();
      addingNewProfile = false;
      if (!hasIntent()) {
        showStep("intent");
        return;
      }
      showStep("plan");
      return;
    }

    if (stepKey === "topic") {
      followupAnswered = true;
      followupCount += 1;
      if (!hasTyped) {
        aiQuestion = null;
        continueAfterFollowup();
        return;
      }
      analyzing = true;
      setAnalyzing(true);
      beginAdvance();
      var analyzerKind = purposeKey() === "learn"
        ? "learn_custom_intent_analyzer"
        : "support_custom_intent_analyzer";
      analyzePlannerText(typed, analyzerKind).then(function (json) {
        mergeAnalyzerResult(json, typed);
      }).catch(function () {
        mergeAnalyzerResult(localAnalyzerJson(typed), typed);
      }).then(function () {
        applyFollowupChoice(typed, "text");
        aiQuestion = null;
        analyzing = false;
        setAnalyzing(false);
        endAdvance();
        continueAfterFollowup();
      });
      return;
    }

    if (!hasIntent()) {
      showStep("intent");
      return;
    }

    if (stepKey === "intent" && hasTyped) {
      analyzing = true;
      setAnalyzing(true);
      beginAdvance();
      analyzePlannerText(typed).then(function (json) {
        mergeAnalyzerResult(json, typed);
      }).catch(function () {
        mergeAnalyzerResult(localAnalyzerJson(typed), typed);
      }).then(function () {
        analyzing = false;
        setAnalyzing(false);
        showStep("purpose");
        endAdvance();
      });
      return;
    }

    if (stepKey === "intent") {
      showStep("purpose");
      return;
    }

    if (stepKey === "purpose") {
      applyPurposeChip(state.purpose);
      followupAnswered = false;
      followupCount = 0;
      aiQuestion = null;
      visibleQuestion = null;
      if (isFunPurpose()) {
        clearPurposeChipPrefetch();
        followupAnswered = true;
        showStep("hero");
        return;
      }
      askPurposeQuestion();
      return;
    }

    if (!planner.age) {
      showStep("basics");
      return;
    }

    askDirector(hasTyped ? typed : "");
  }

  function syncInsertFilled(insertId, fieldId) {
    var insert = el(insertId);
    var field = el(fieldId);
    if (!insert || !field) return;
    insert.classList.toggle("is-filled", !!field.value.trim());
  }

  function syncIntentInsertFilled() {
    syncInsertFilled("guided-intent-insert", "guided-intent-custom");
  }

  function clearTypeInsert(fieldId, insertId) {
    var field = el(fieldId);
    if (field) {
      field.value = "";
      field.placeholder = "";
      autoGrowInsert(field);
    }
    var insert = el(insertId);
    if (insert) {
      var hint = insert.querySelector(".guided-type-hint");
      if (hint) {
        hint.textContent = "";
        hint.classList.remove("is-in", "is-out");
      }
    }
    syncInsertFilled(insertId, fieldId);
  }

  function clearAllInsertFields() {
    [
      ["guided-intent-custom", "guided-intent-insert"],
      ["guided-topic-custom", "guided-topic-insert"],
      ["guided-detail-custom", "guided-detail-insert"],
      ["guided-about-custom", "guided-about-insert"],
      ["guided-hero-description", "guided-hero-insert"],
      ["guided-interests-custom", "guided-interests-insert"],
      ["guided-support-custom", "guided-support-insert"],
    ].forEach(function (pair) {
      clearTypeInsert(pair[0], pair[1]);
    });
    if (el("guided-plan-likes")) el("guided-plan-likes").value = "";
  }

  function clearProgressAfterIntent() {
    planner.idea = "";
    planner.intentKey = "";
    planner.intentLabel = "";
    planner.name = "";
    planner.age = "";
    planner.hero = "";
    planner.gender = "";
    planner.purpose = "";
    planner.purposeKey = "";
    sources.idea = "";
    sources.intentKey = "";
    sources.intentLabel = "";
    sources.name = "";
    sources.age = "";
    sources.hero = "";
    sources.gender = "";
    sources.purpose = "";
    sources.purposeKey = "";
    ["topic", "emotion", "context", "companion", "setting", "mood", "support", "likes"].forEach(function (key) {
      planner[key] = "";
      sources[key] = "";
    });
    planner.clarifyingQuestion = "";
    state.intent = "";
    state.purpose = "";
    state.childName = "";
    state.age = "";
    state.topic = "";
    state.detail = "";
    state.about = "";
    state.heroKind = "";
    state.heroPick = "";
    state.heroDescription = "";
    state.childGender = "";
    state.image = "";
    state.support = "";
    state.interests = [];
    aiQuestion = null;
    visibleQuestion = null;
    heroQuestion = null;
    clearPurposeChipPrefetch();
    purposeShownChips = { today: [], learn: [] };
    toyPhotoChosen = false;
    followupAnswered = false;
    followupCount = 0;
    followupAnswers = [];
    directorSequence += 1;
    latestTypedContext = "";
    clearAllInsertFields();
    if (el("guided-child-name")) el("guided-child-name").value = "";
    if (el("guided-hero-child-name")) el("guided-hero-child-name").value = "";
    if (el("guided-age")) el("guided-age").value = "";
    clearVisualSelections();
    paintPhotoControls();
    paintHeroChildPanel();
    applyPurposeChip("");
    syncSharedPlanner();
  }

  function autoGrowInsert(textarea) {
    if (!textarea) return;
    if (textarea.closest && textarea.closest(".guided-intent-insert")) {
      textarea.style.height = "";
      textarea.classList.remove("is-expanded");
      return;
    }
    var minHeight = window.matchMedia("(max-width: 720px)").matches ? 36 : 40;
    textarea.style.height = "auto";
    var next = Math.max(minHeight, textarea.scrollHeight);
    textarea.style.height = next + "px";
    textarea.classList.toggle("is-expanded", next > minHeight + 2);
  }

  function wireInsertGrow(id, onInput) {
    var field = el(id);
    if (!field) return;
    field.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
      event.preventDefault();
      if (field.value.trim()) beginChoiceTransition(field.closest(".guided-insert"));
      goNext();
    });
    field.addEventListener("input", function () {
      autoGrowInsert(field);
      if (typeof onInput === "function") onInput.call(field);
    });
    autoGrowInsert(field);
  }

  function particleRand(seed) {
    var v = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
  }

  function buildParticleSpecs() {
    return Array.from({ length: PROGRESS_PARTICLE_COUNT }, function (_item, index) {
      var base = ((index + 0.5) / PROGRESS_PARTICLE_COUNT) * 96;
      var x = Math.max(1, Math.min(98, base + (particleRand(index) - 0.5) * 10));
      return {
        x: x,
        y: 6 + particleRand(index * 3.3) * 82,
        size: 2 + particleRand(index * 5.1) * 4,
        color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
        threshold: base / 100,
        duration: 700 + particleRand(index * 1.7) * 900,
        delay: particleRand(index * 2.9) * 900,
        driftX: (particleRand(index * 7.3) - 0.5) * 7,
        driftY: (particleRand(index * 9.1) - 0.5) * 7,
      };
    });
  }

  function ensureParticlePill() {
    var layer = el("guided-particle-layer");
    if (!layer || layer.childElementCount) return;
    particleSpecs = buildParticleSpecs();
    var html = particleSpecs
      .map(function (particle, index) {
        return (
          '<span class="guided-particle" data-particle-index="' +
          index +
          '" style="' +
          "left:" +
          particle.x +
          "%;top:" +
          particle.y +
          "%;width:" +
          particle.size +
          "px;height:" +
          particle.size +
          "px;background-color:" +
          particle.color +
          ";color:" +
          particle.color +
          ";--twinkle-duration:" +
          particle.duration +
          "ms;--twinkle-delay:" +
          particle.delay +
          "ms;--drift-x:" +
          particle.driftX.toFixed(2) +
          "px;--drift-y:" +
          particle.driftY.toFixed(2) +
          'px"></span>'
        );
      })
      .join("");
    layer.innerHTML = html;
  }

  function setParticleProgress(percent, done) {
    ensureParticlePill();
    var fraction = done ? 1 : Math.max(0.02, Math.min(0.98, percent / 100));
    var pill = el("guided-particle-pill");
    var glow = el("guided-particle-glow");
    if (pill) {
      pill.classList.toggle("is-done", !!done);
      pill.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
    }
    if (glow) glow.style.width = fraction * 100 + "%";
    if (!particleSpecs) return;
    var nodes = el("guided-particle-layer") ? el("guided-particle-layer").children : [];
    for (var i = 0; i < nodes.length; i += 1) {
      var on = particleSpecs[i].threshold <= fraction;
      nodes[i].classList.toggle("is-on", on);
    }
  }

  function setGenerationStatus(index) {
    generationIndex = Math.min(index, GENERATION_COPY.length - 1);
    var copy = isArmenianUi() ? GENERATION_COPY_HY : GENERATION_COPY;
    el("guided-generating-status").textContent = copy[Math.min(generationIndex, copy.length - 1)];
    generationProgress = Math.min(90, Math.max(generationProgress, 13 + generationIndex * 15));
    setParticleProgress(generationProgress, false);
  }

  function beginGenerationAnimation() {
    window.clearInterval(generationTimer);
    generationIndex = 0;
    generationProgress = 8;
    ensureParticlePill();
    setGenerationStatus(0);
    generationTimer = window.setInterval(function () {
      var copy = isArmenianUi() ? GENERATION_COPY_HY : GENERATION_COPY;
      if (generationIndex < copy.length - 2) setGenerationStatus(generationIndex + 1);
      else {
        generationProgress = Math.min(88, generationProgress + 2);
        setParticleProgress(generationProgress, false);
      }
    }, 1900);
  }

  function stopGenerationAnimation() {
    window.clearInterval(generationTimer);
    generationTimer = 0;
  }

  function storyIdea() {
    var plan = storyPlanInput();
    var likes = planLikes();
    var parts = [plan.storyType, plan.clarifyingQuestion];
    if (plan.hero) parts.push("Hero: " + plan.hero);
    if (plan.support) parts.push("Support: " + plan.support);
    if (likes) parts.push("They like: " + likes);
    return parts.filter(Boolean).join(". ") || "A gentle story";
  }

  function storyPayload() {
    var heroKind = state.heroKind === "child" ? "kid" : state.heroKind;
    var heroName = planner.hero || state.heroDescription;
    if (heroKind === "kid") heroName = planner.name || state.childName || "my kid";
    if (!heroName && heroKind === "child") heroName = planner.name || state.childName || "the child";
    if (!heroName) heroName = HERO_LABELS[heroKind] || "a magical hero";
    if (!heroKind && planner.name && planner.hero === planner.name) heroKind = "kid";
    if (!heroKind && planner.companion) heroKind = "imaginary";
    return {
      planner: publishStoryPlan(),
      summaryPlan: summaryPlan(),
      idea: storyIdea(),
      childName: planner.name || state.childName,
      childGender: planner.gender || state.childGender || "",
      age: planner.age || state.age,
      lang: storyLanguage(),
      heroKind: heroKind,
      heroName: heroName,
      image: state.image,
      likes: planLikes() || state.interests.join(", "),
      setting: planner.setting || state.world,
      support: planner.support || planner.emotion || planner.context || state.support,
    };
  }

  function trackWebStoryCreated(story) {
    try {
      var plan = summaryPlan();
      var storyType =
        (INTENT_LABELS[planner.intentLabel] || planner.intentLabel || plan.storyKind || "custom");
      var purpose = plan.purpose === "today" ? "support" : plan.purpose || "fun";
      if (purpose !== "learn" && purpose !== "support" && purpose !== "fun") purpose = "fun";
      var heroMode = plan.hero && plan.hero.mode;
      var hero =
        heroMode === "child"
          ? "my_child"
          : heroMode === "created"
          ? "create_hero"
          : "story_decides";
      if (window.NanikAnalytics && typeof window.NanikAnalytics.track === "function") {
        window.NanikAnalytics.track("web_story_created", {
          story_type: String(storyType),
          purpose: String(purpose),
          hero: String(hero),
          story_id: story && (story.id || story.story_id) ? String(story.id || story.story_id) : undefined,
        });
      }
    } catch (e) {}
  }

  function openStoryReadyPaywall() {
    var hy = isArmenianUi();
    var cardsHtml = planSummaryCardsHtml();
    if (window.NanikPayments && typeof window.NanikPayments.openPaywall === "function") {
      window.NanikPayments.openPaywall({
        variant: "story",
        title: hy ? "Հեքիաթդ պատրաստ է" : "Your story is ready",
        cardsHtml: cardsHtml,
        orLabel: hy ? "կամ բաժանորդագրվիր՝ ավելի շատ հեքիաթներ ստանալու համար" : "or Subscribe to get more stories",
        ctaLabel: hy ? "Բացել հեքիաթը" : "Unlock the story",
        price: "$1.99",
      });
      return;
    }
    openCreateStoryPaywall();
  }

  function openCreateStoryPaywall() {
    if (window.NanikPayments && typeof window.NanikPayments.openPaywall === "function") {
      window.NanikPayments.openPaywall({
        planId: "yearly",
        title: "Unlock more stories",
      });
      return;
    }
    if (window.NanikPayments && typeof window.NanikPayments.startCheckout === "function") {
      window.NanikPayments.startCheckout("yearly", {
        returnPath: "dashboard.html",
      }).catch(function () {
        window.location.href = "pricing.html";
      });
      return;
    }
    window.location.href = "pricing.html";
  }

  function hasStoryQuota() {
    var quota = window.NANIK_QUOTA_STATE;
    if (!quota || typeof quota !== "object") return true;
    return Number(quota.storiesRemaining) > 0;
  }

  function returnToPlan(message) {
    stopGenerationAnimation();
    stepKey = "plan";
    stepIndex = Math.max(0, flowSteps().indexOf("plan"));
    renderStep();
    if (message) setError(message);
  }

  function startGeneration() {
    var api = window.NANIK_GUIDED_CREATE;
    if (!api || typeof api.start !== "function") {
      setError("Story creation is unavailable. Refresh the page and try again.");
      return;
    }
    if (!hasStoryQuota()) {
      openCreateStoryPaywall();
      return;
    }

    document.querySelectorAll("[data-guided-step]").forEach(function (section) {
      section.hidden = section.getAttribute("data-guided-step") !== "generating";
    });
    if (el("guided-title-row")) el("guided-title-row").hidden = true;
    el("guided-footer").hidden = true;
    el("guided-back").hidden = true;
    setError("");
    beginGenerationAnimation();

    var started = api.start(storyPayload(), {
      status: function () {},
      complete: function (story) {
        persistChildAfterStory();
        stopGenerationAnimation();
        finished = true;
        trackWebStoryCreated(story);
        setGenerationStatus(GENERATION_COPY.length - 1);
        setParticleProgress(100, true);
        var titleEl = el("guided-generating-title");
        if (titleEl) {
          titleEl.textContent = isArmenianUi() ? "Հեքիաթդ պատրաստ է" : "Your story is ready";
        }
        window.setTimeout(function () {
          try {
            if (story && api.openStory) api.openStory(story);
          } finally {
            // Leave the generating "ready" screen so Create is fresh next time.
            startCreateFlow();
          }
        }, 450);
      },
      error: function (error) {
        if (error && error.quotaExceeded) {
          openCreateStoryPaywall();
          returnToPlan("");
          return;
        }
        returnToPlan(
          (error && error.message) || "Could not create the story. Please try again."
        );
      },
      cancel: function () {
        returnToPlan("");
      },
    });
    if (!started) {
      if (!hasStoryQuota()) {
        // Paywall already opened by NANIK_GUIDED_CREATE.start
        returnToPlan("");
      } else {
        returnToPlan(
          isArmenianUi()
            ? "Հեքիաթներ չեն մնացել։ Թարմացրու՝ ավելի շատ ստեղծելու համար։"
            : "You have no stories remaining. Upgrade to create more."
        );
      }
    }
  }

  function applySavedChildProfile() {
    var draft = window.NANIK_DRAFT || {};
    var savedChild = draft.getChild ? draft.getChild() : null;
    if (savedChild && savedChild.id) planner.childId = savedChild.id;
    if (savedChild && savedChild.age && !planner.age && !shouldShowProfilePicker()) {
      planner.age = String(savedChild.age);
      sources.age = "draft";
      state.age = planner.age;
      if (el("guided-age")) el("guided-age").value = planner.age;
      syncAgeChips(planner.age);
    }
    if (savedChild && savedChild.name && !planner.name && !shouldShowProfilePicker()) {
      planner.name = savedChild.name;
      sources.name = "draft";
      state.childName = savedChild.name;
    }
    if (savedChild && savedChild.likes && !planner.likes) {
      planner.likes = savedChild.likes;
      sources.likes = "draft";
      state.interests = savedChild.likes.split(/\s*,\s*/).filter(Boolean);
    }
    if (savedChild && savedChild.gender && !state.childGender) {
      state.childGender = savedChild.gender;
      planner.gender = savedChild.gender;
      sources.gender = "draft";
    }
    if (savedChild && savedChild.photo && !state.image) {
      state.image = savedChild.photo;
      if (draft.setImage) draft.setImage(savedChild.photo);
    }
    return !!planner.age;
  }

  function startCreateFlow() {
    addingNewProfile = false;
    resetFlow();
  }

  function resetFlow() {
    cancelChoiceTransition();
    state.madeUpName = "";
    state.madeUpDescription = "";
    state.madeUpType = "";
    window.NANIK_STORY_SUMMARY = null;
    var draft = window.NANIK_DRAFT || {};
    if (draft.setPrompt) draft.setPrompt("");
    if (draft.setImage) draft.setImage("");
    finished = false;
    addingNewProfile = false;
    heroKidFormMode = false;
    stepKey = "basics";
    history = ["basics"];
    stepIndex = 0;
    planner = emptyPlanner();
    sources = {};
    aiQuestion = null;
    visibleQuestion = null;
    followupAnswered = false;
    followupCount = 0;
    followupAnswers = [];
    directorSequence += 1;
    latestTypedContext = "";
    planner.language = storyLanguage();
    syncSharedPlanner();
    state.intent = "";
    state.purpose = "";
    state.childName = "";
    state.age = "";
    state.heroKind = "";
    state.heroPick = "";
    state.heroDescription = "";
    state.childGender = "";
    state.image = "";
    heroQuestion = null;
    clearPurposeChipPrefetch();
    purposeShownChips = { today: [], learn: [] };
    toyPhotoChosen = false;
    state.interests = [];
    state.world = "";
    state.topic = "";
    state.detail = "";
    state.about = "";
    state.discover = "";
    state.feeling = "";
    state.adventure = "";
    state.bedtime = "";
    state.support = "";
    ["guided-child-name", "guided-hero-child-name"].forEach(function (id) {
      if (el(id)) el(id).value = "";
    });
    clearAllInsertFields();
    syncIntentInsertFilled();
    el("guided-age").value = "";
    paintPhotoControls();
    paintHeroChildPanel();
    clearVisualSelections();
    el("guided-generating-title").textContent = isArmenianUi() ? "Ստեղծում եմ երեխայիդ հեքիաթը…" : "Creating your child’s story…";
    stopDiscoverHints();
    setParticleProgress(8, false);
    applySavedChildProfile();
    stepKey = "basics";
    history = ["basics"];
    stepIndex = 0;
    renderStep();
  }

  var photoPromise = Promise.resolve();

  function readPhoto(file) {
    if (!file) return photoPromise;
    var compressor = window.NanikDraft && window.NanikDraft.compressImage;
    var promise = compressor
      ? compressor(file)
      : new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function () { resolve(reader.result); };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
    photoPromise = promise.then(function (dataUrl) {
      state.image = String(dataUrl || "");
      paintPhotoControls();
    }).catch(function () {
      toyPhotoChosen = false;
      setError("That photo could not be added. Please choose another.");
    });
  }

  function wireIntentMic(buttonId, fieldId, insertId) {
    var button = el(buttonId || "guided-intent-mic");
    var field = el(fieldId || "guided-intent-custom");
    var insert = el(insertId || "guided-intent-insert");
    if (!button || !field) return;
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = null;
    var listening = false;

    function setListening(on) {
      listening = on;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
      if (insert) insert.classList.toggle("is-listening", on);
    }

    function stopVoice() {
      setListening(false);
      if (rec) {
        try { rec.stop(); } catch (e) {}
      }
    }

    button.addEventListener("click", function () {
      if (!SR) {
        setError("Voice typing isn’t available in this browser.");
        return;
      }
      if (listening) {
        stopVoice();
        return;
      }
      rec = new SR();
      var lang = String(document.documentElement.lang || "en").split("-")[0].toLowerCase();
      rec.lang = lang === "hy" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US";
      rec.interimResults = true;
      rec.continuous = false;
      rec.onstart = function () { setListening(true); };
      rec.onresult = function (event) {
        var out = "";
        for (var i = 0; i < event.results.length; i++) out += event.results[i][0].transcript;
        field.value = out.trim();
        field.dispatchEvent(new Event("input", { bubbles: true }));
      };
      rec.onerror = stopVoice;
      rec.onend = stopVoice;
      try {
        rec.start();
      } catch (e) {
        stopVoice();
      }
    });
  }

  function wireChoiceGroup(selector, stateKey, multiple) {
    var container = document.querySelector(selector);
    if (!container) return;
    container.addEventListener("click", function (event) {
      var button = event.target.closest("[data-guided-value]");
      if (!button || !container.contains(button)) return;
      var value = button.getAttribute("data-guided-value") || "";
      // Clicks inside an open hero form (interests, gender, types, etc.) must not
      // re-toggle the card closed. closest(.flip-back) alone misses hits on the card shell.
      if (stateKey === "heroPick") {
        if (
          event.target.closest(".guided-hero-flip-back") ||
          event.target.closest(".guided-hero-flip-card.is-flipped") ||
          event.target.closest("#guided-hero-child-likes-field") ||
          event.target.closest("#guided-hero-madeup-types") ||
          event.target.closest("#guided-hero-gender") ||
          event.target.closest(".guided-hero-photo-field")
        ) {
          return;
        }
        if ((value === "kid" || value === "madeup") && state.heroPick === value) return;
      }
      if (multiple) {
        clearAutoAdvance();
        var index = state.interests.indexOf(value);
        if (index >= 0) state.interests.splice(index, 1);
        else state.interests.push(value);
        setSelected(container, "", true);
        clearTypeInsert("guided-interests-custom", "guided-interests-insert");
      } else if (stateKey === "heroPick" && value === "photo") {
        clearTypeInsert("guided-hero-description", "guided-hero-insert");
        clearAutoAdvance();
        if (state.heroPick === "photo" && state.image) {
          state.heroPick = "";
          state.heroKind = "";
          state.image = "";
          toyPhotoChosen = false;
          setSelected(container, "", false);
          paintPhotoControls();
        } else if (el("guided-toy-input")) {
          el("guided-toy-input").click();
        }
        setError("");
        return;
      } else {
        state[stateKey] = state[stateKey] === value ? "" : value;
        setSelected(container, state[stateKey], false);
        if (stateKey === "intent") {
          state.topic = "";
          state.detail = "";
          state.purpose = "";
          applyPurposeChip("");
          if (state[stateKey] && el("guided-intent-custom")) {
            el("guided-intent-custom").value = "";
            syncIntentInsertFilled();
          }
        }
        if (stateKey === "purpose") {
          applyPurposeChip(state.purpose);
          if (state.purpose && !isFunPurpose()) startPurposeChipPrefetch();
          else clearPurposeChipPrefetch();
        }
        if (stateKey === "topic") {
          state.detail = "";
          clearTypeInsert("guided-detail-custom", "guided-detail-insert");
          if (state.topic === "Something else") {
            clearAutoAdvance();
            clearTypeInsert("guided-topic-custom", "guided-topic-insert");
            setSelected(container, state.topic, false);
            openTopicElsePopup();
            setError("");
            return;
          }
          clearTypeInsert("guided-topic-custom", "guided-topic-insert");
          closeTopicElsePopup(false);
        }
        if (stateKey === "detail") clearTypeInsert("guided-detail-custom", "guided-detail-insert");
        if (stateKey === "heroKind" || stateKey === "heroPick") {
          if (state.image) {
            state.image = "";
            toyPhotoChosen = false;
          }
          clearTypeInsert("guided-hero-description", "guided-hero-insert");
          paintHeroChildPanel();
          if (stateKey === "heroPick" && state.heroPick === "kid") {
            clearAutoAdvance();
            var nameField = el("guided-hero-child-name");
            if (nameField) {
              // Wait for the flip to finish so focus/keyboard does not start a second motion.
              window.setTimeout(function () { nameField.focus(); }, 580);
            }
            setError("");
            return;
          }
          if (stateKey === "heroPick" && state.heroPick === "madeup") {
            clearAutoAdvance();
            var madeUpField = el("guided-hero-madeup-name");
            if (madeUpField) {
              window.setTimeout(function () { madeUpField.focus(); }, 580);
            }
            setError("");
            return;
          }
          if (stateKey === "heroPick" && state.heroPick === "describe") {
            clearAutoAdvance();
            var heroDescription = el("guided-hero-description");
            if (heroDescription) {
              window.setTimeout(function () { heroDescription.focus(); }, 40);
            }
            setError("");
            return;
          }
          if (stateKey === "heroPick" && state.heroPick !== "kid") {
            // Keep the child's gender: it belongs to the audience, not to the hero.
          }
        }
        if (stateKey === "support" && state[stateKey]) clearTypeInsert("guided-support-custom", "guided-support-insert");
        if (stateKey === "intent" && value === "Surprise Me" && state[stateKey]) {
          clearAutoAdvance();
          applyIntentChip(value);
          showStep("hero");
          setError("");
          return;
        }
        if (state[stateKey]) {
          if (stateKey === "purpose") {
            var purposeNext = PURPOSE_KEYS[state.purpose] || "";
            if (purposeNext === "today" || purposeNext === "learn") {
              beginChoiceTransition(button);
              scheduleAutoAdvance();
              setError("");
              return;
            }
          }
          beginChoiceTransition(button);
          scheduleAutoAdvance();
        } else {
          clearAutoAdvance();
          if (stateKey === "heroPick") paintHeroChildPanel();
        }
      }
      setError("");
    });
  }

  function init() {
    if (!el("guided-create")) return;
    wireHeroKeyboardScroll();
    if (el("guided-plan-likes")) el("guided-plan-likes").addEventListener("change", function () {
      readPlanFields();
      paintPlan();
    });
    window.addEventListener("nanik:quota", function (event) {
      paintPlanQuota(event.detail);
      paintProfilePicker();
    });
    window.addEventListener("nanik:child-profile", function () {
      paintProfilePicker();
    });
    populateLanguages();
    syncLanguageFromApp();
    hydrateDraft();
    syncLanguageFromApp();
    wireChoiceGroup('[data-guided-step="intent"] .guided-intent-cards', "intent", false);
    wireChoiceGroup('[data-guided-step="purpose"] .guided-purpose-cards', "purpose", false);
    wireChoiceGroup("#guided-topic-options", "topic", false);
    wireChoiceGroup("#guided-detail-options", "detail", false);
    wireChoiceGroup("#guided-hero-options", "heroPick", false);
    wireChoiceGroup("#guided-interests", "interests", true);

    var heroDecide = el("guided-hero-decide");
    if (heroDecide) {
      heroDecide.addEventListener("click", function () {
        if (currentKey() !== "hero" || analyzing) return;
        clearAutoAdvance();
        state.heroPick = "surprise";
        state.heroDescription = "";
        clearTypeInsert("guided-hero-description", "guided-hero-insert");
        setSelected(el("guided-hero-options"), "", false);
        heroDecide.classList.add("is-on");
        heroDecide.setAttribute("aria-pressed", "true");
        setError("");
        scheduleAutoAdvance();
      });
    }

    var topicElse = el("guided-topic-else");
    if (topicElse) {
      topicElse.querySelectorAll("[data-guided-else-close]").forEach(function (node) {
        node.addEventListener("click", function () {
          closeTopicElsePopup(true);
        });
      });
      el("guided-topic-else-continue") && el("guided-topic-else-continue").addEventListener("click", submitTopicElsePopup);
      el("guided-topic-else-input") && el("guided-topic-else-input").addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          submitTopicElsePopup();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          closeTopicElsePopup(true);
        }
      });
      el("guided-topic-else-input") && el("guided-topic-else-input").addEventListener("input", function () {
        syncTopicElseCounter();
        growTopicElseInput();
      });
      wireIntentMic("guided-topic-else-mic", "guided-topic-else-input", "guided-topic-else-insert");
    }

    if (el("guided-hero-options")) {
      el("guided-hero-options").addEventListener("click", function (event) {
        var likeChip = event.target.closest("[data-like-chip]");
        if (likeChip) {
          event.preventDefault();
          event.stopPropagation();
          if (currentKey() !== "hero" || analyzing) return;
          var removed = likeChip.getAttribute("data-like-chip");
          paintHeroLikesChips(heroLikesTokens().filter(function (item) {
            return item !== removed;
          }));
          setError("");
          return;
        }
        var profileEdit = event.target.closest("[data-hero-child-edit]");
        if (profileEdit) {
          event.preventDefault();
          event.stopPropagation();
          if (currentKey() !== "hero" || analyzing) return;
          var editId = profileEdit.getAttribute("data-hero-child-edit") || "";
          var editKid = namedChildProfiles().find(function (item) { return item.id === editId; });
          if (!editKid) {
            setError(isArmenianUi() ? "Ընտրիր պրոֆիլը։" : "Choose a child profile.");
            return;
          }
          openHeroChildEditor(editKid);
          return;
        }
        var profileSelect = event.target.closest("[data-hero-child-id]");
        if (profileSelect) {
          event.preventDefault();
          event.stopPropagation();
          if (currentKey() !== "hero" || analyzing) return;
          var childId = profileSelect.getAttribute("data-hero-child-id") || "";
          var kid = namedChildProfiles().find(function (item) { return item.id === childId; });
          if (!kid) {
            setError(isArmenianUi() ? "Ընտրիր պրոֆիլը։" : "Choose a child profile.");
            return;
          }
          applyHeroChildProfile(kid);
          beginChoiceTransition(profileSelect);
          goNext();
          return;
        }
        if (event.target.closest("#guided-hero-profile-back")) {
          event.preventDefault();
          event.stopPropagation();
          if (currentKey() !== "hero" || analyzing) return;
          heroKidFormMode = false;
          paintHeroStep();
          setError("");
          return;
        }
        if (event.target.closest("#guided-hero-profile-new")) {
          event.preventDefault();
          event.stopPropagation();
          heroKidFormMode = true;
          state.childName = "";
          state.childGender = "";
          state.interests = [];
          state.image = "";
          planner.name = "";
          planner.likes = "";
          planner.gender = "";
          planner.childId = "";
          var draftClear = window.NANIK_DRAFT || {};
          if (draftClear.setImage) draftClear.setImage("");
          paintHeroStep();
          setError("");
          return;
        }
        var genderButton = event.target.closest("[data-guided-gender]");
        if (genderButton) {
          event.preventDefault();
          event.stopPropagation();
          if (currentKey() !== "hero" || analyzing) return;
          var gender = genderButton.getAttribute("data-guided-gender") || "";
          state.childGender = state.childGender === gender ? "" : gender;
          paintHeroGender();
          setError("");
          return;
        }
        var madeUpTypeButton = event.target.closest("[data-guided-madeup-type]");
        if (madeUpTypeButton) {
          event.preventDefault();
          event.stopPropagation();
          state.madeUpType = madeUpTypeButton.getAttribute("data-guided-madeup-type") || "";
          var typeGroup = el("guided-hero-madeup-types");
          if (typeGroup) typeGroup.querySelectorAll("[data-guided-madeup-type]").forEach(function (button) {
            button.classList.toggle("is-on", button === madeUpTypeButton);
            button.setAttribute("aria-checked", button === madeUpTypeButton ? "true" : "false");
          });
          return;
        }
        var nextButton = event.target.closest("#guided-hero-child-next, #guided-hero-madeup-next");
        if (nextButton) {
          event.preventDefault();
          event.stopPropagation();
          if (currentKey() !== "hero" || analyzing) return;
          var isMadeUp = nextButton.id === "guided-hero-madeup-next";
          if ((isMadeUp && !madeUpHeroReady()) || (!isMadeUp && !heroChildReady())) {
            setNameFieldError(isMadeUp ? "guided-hero-madeup-name" : "guided-hero-child-name");
            return;
          }
          beginChoiceTransition(nextButton);
          goNext();
        }
        var photoRemove = event.target.closest(".guided-hero-photo-remove");
        if (photoRemove) {
          event.preventDefault();
          event.stopPropagation();
          clearHeroPhoto();
        }
      });
      el("guided-hero-options").addEventListener("input", function (event) {
        if (event.target.id === "guided-hero-child-name") {
          state.childName = event.target.value.trim();
          if (state.childName) clearFieldErrors();
        } else if (event.target.id === "guided-hero-madeup-name") {
          if (String(event.target.value || "").trim()) clearFieldErrors();
        } else if (event.target.id === "guided-hero-child-age") {
          var pickedAge = event.target.value;
          state.age = pickedAge;
          planner.age = pickedAge;
          sources.age = "profile";
          if (el("guided-age")) el("guided-age").value = pickedAge;
          syncAgeChips(pickedAge);
        } else if (event.target.id === "guided-hero-child-likes") {
          if (/,/.test(event.target.value)) {
            var parts = event.target.value.split(",");
            var remainder = parts.pop();
            parts.forEach(function (part) {
              var token = part.trim();
              if (!token) return;
              var tokens = heroLikesTokens();
              var key = token.toLowerCase();
              if (!tokens.some(function (item) { return item.toLowerCase() === key; })) {
                tokens.push(token);
              }
              paintHeroLikesChips(tokens);
            });
            event.target.value = remainder || "";
          }
        } else if (event.target.id !== "guided-hero-madeup-name") {
          return;
        }
        setError("");
      });
      el("guided-hero-options").addEventListener("keydown", function (event) {
        if (event.target.id === "guided-hero-child-likes") {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            commitHeroLikeToken();
            setError("");
            return;
          }
          if (event.key === "Backspace" && !event.target.value) {
            var tokens = heroLikesTokens();
            if (tokens.length) {
              event.preventDefault();
              tokens.pop();
              paintHeroLikesChips(tokens);
            }
          }
          return;
        }
        if (event.target.id !== "guided-hero-child-name" && event.target.id !== "guided-hero-madeup-name") return;
        if (event.key === "Enter") {
          event.preventDefault();
          if (state.heroPick === "kid" && heroChildReady()) goNext();
          if (state.heroPick === "madeup" && madeUpHeroReady()) goNext();
        }
      });
    }

    el("guided-next") && el("guided-next").addEventListener("click", goNext);
    document.querySelectorAll(".guided-send").forEach(function (button) {
      button.addEventListener("click", function () {
        var insert = button.closest(".guided-insert");
        var field = insert && insert.querySelector("textarea");
        if (field && field.value.trim()) beginChoiceTransition(insert);
        goNext();
      });
    });
    if (el("guided-language")) {
      el("guided-language").addEventListener("change", function () {
        state.lang = el("guided-language").value || "en";
        planner.language = state.lang;
        sources.language = "select";
      });
    }
    if (el("guided-age-chips")) {
      el("guided-age-chips").addEventListener("click", function (event) {
        var button = event.target.closest("[data-guided-age]");
        if (!button || currentKey() !== "basics" || analyzing) return;
        var age = button.getAttribute("data-guided-age") || "";
        if (!age || !el("guided-age")) return;
        el("guided-age").value = age;
        el("guided-age").dispatchEvent(new Event("change"));
        beginChoiceTransition(button);
      });
    }
    if (el("guided-profile-list")) {
      el("guided-profile-list").addEventListener("click", function (event) {
        var button = event.target.closest("[data-child-id]");
        if (!button || currentKey() !== "basics" || analyzing) return;
        var id = button.getAttribute("data-child-id");
        var kids = listChildProfiles();
        var child = null;
        for (var i = 0; i < kids.length; i++) {
          if (kids[i].id === id) {
            child = kids[i];
            break;
          }
        }
        if (!child) return;
        applySelectedProfile(child);
        paintProfilePicker();
        beginChoiceTransition(button);
        scheduleAutoAdvance();
      });
    }
    if (el("guided-profile-add")) {
      el("guided-profile-add").addEventListener("click", function () {
        if (currentKey() !== "basics" || analyzing) return;
        var kidsCount = listChildProfiles().length;
        if (kidsCount >= 10) {
          paintProfilePicker();
          return;
        }
        var quota = window.NANIK_QUOTA_STATE;
        var isPlus = !!(quota && quota.isPlus);
        if (kidsCount >= 1 && !isPlus) {
          if (window.NanikPayments && typeof window.NanikPayments.openPaywall === "function") {
            window.NanikPayments.openPaywall({
              planId: "yearly",
              title: isArmenianUi() ? "Բացիր ավելի շատ պրոֆիլներ" : "Unlock more child profiles",
            });
          } else if (typeof window.openWebPaywall === "function") {
            window.openWebPaywall({ title: "Unlock more child profiles" });
          } else if (window.NanikPayments && typeof window.NanikPayments.startCheckout === "function") {
            window.NanikPayments.startCheckout("yearly", { returnPath: "dashboard.html" });
          } else {
            window.location.href = "pricing.html";
          }
          return;
        }
        addingNewProfile = true;
        planner.childId = "";
        planner.age = "";
        planner.name = "";
        state.age = "";
        state.childName = "";
        if (el("guided-age")) el("guided-age").value = "";
        if (el("guided-child-name")) el("guided-child-name").value = "";
        syncAgeChips("");
        setError("");
        renderStep();
      });
    }
    if (el("guided-age")) {
      el("guided-age").addEventListener("change", function () {
        if (currentKey() !== "basics" || analyzing || !this.value) return;
        if (planner.age && planner.age !== this.value) {
          aiQuestion = null;
          visibleQuestion = null;
          heroQuestion = null;
          followupAnswered = false;
          followupCount = 0;
          followupAnswers = [];
          directorSequence += 1;
        }
        state.age = this.value;
        planner.age = this.value;
        if (addingNewProfile) planner.childId = "";
        sources.age = "chip";
        syncAgeChips(this.value);
        rememberChild();
        var about = el("guided-about-custom");
        if (about && about.value.trim()) return;
        scheduleAutoAdvance();
      });
    }
    el("guided-back").addEventListener("click", goBack);
    if (el("guided-plan-back")) {
      el("guided-plan-back").addEventListener("click", goBack);
    }
    if (el("guided-plan-create")) {
      el("guided-plan-create").addEventListener("click", goNext);
    }
    if (el("guided-plan-language")) {
      el("guided-plan-language").addEventListener("change", function () {
        readPlanFields();
        paintLanguageChrome();
        paintPlan();
      });
    }
    if (el("guided-plan-likes")) {
      el("guided-plan-likes").addEventListener("keydown", function (event) {
        if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
        event.preventDefault();
        goNext();
      });
    }
    if (el("guided-toy-input")) el("guided-toy-input").addEventListener("change", function () {
      var file = this.files && this.files[0];
      this.value = "";
      if (!file) return;
      toyPhotoChosen = true;
      state.heroPick = "photo";
      readPhoto(file);
      photoPromise.then(function () {
        if (!state.image) {
          state.heroPick = "";
          toyPhotoChosen = false;
          return;
        }
        paintHeroStep();
        beginChoiceTransition(el("guided-hero-options") && el("guided-hero-options").querySelector('[data-guided-value="photo"]'));
        scheduleAutoAdvance();
      });
    });
    document.addEventListener("change", function (event) {
      if (event.target.id !== "guided-hero-madeup-photo" && event.target.id !== "guided-hero-child-photo") return;
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      var isChildPhoto = event.target.id === "guided-hero-child-photo";
      readPhoto(file);
      photoPromise.then(function () {
        if (!state.image) return;
        paintPhotoControls();
        if (isChildPhoto) rememberChild({ force: true });
      });
    });
    wireInsertGrow("guided-interests-custom", function () {
      syncInsertFilled("guided-interests-insert", "guided-interests-custom");
      if (!this.value.trim()) return;
      clearAutoAdvance();
      state.interests = [];
      setSelected(el("guided-interests"), "", true);
    });
    wireInsertGrow("guided-hero-description", function () {
      syncInsertFilled("guided-hero-insert", "guided-hero-description");
      if (!this.value.trim()) return;
      clearAutoAdvance();
      state.heroKind = "";
      state.image = "";
      toyPhotoChosen = false;
      if (state.heroPick !== "describe") {
        state.heroPick = "";
        setSelected(el("guided-hero-options"), "", false);
      }
      paintHeroChildPanel();
    });
    wireInsertGrow("guided-topic-custom", function () {
      syncInsertFilled("guided-topic-insert", "guided-topic-custom");
      if (!this.value.trim()) return;
      clearAutoAdvance();
      state.topic = "";
      state.detail = "";
      setSelected(el("guided-topic-options"), "", false);
    });
    wireInsertGrow("guided-detail-custom", function () {
      syncInsertFilled("guided-detail-insert", "guided-detail-custom");
      if (!this.value.trim()) return;
      clearAutoAdvance();
      state.detail = "";
      setSelected(el("guided-detail-options"), "", false);
    });
    wireInsertGrow("guided-about-custom", function () {
      syncInsertFilled("guided-about-insert", "guided-about-custom");
    });
    wireInsertGrow("guided-intent-custom", function () {
      syncIntentInsertFilled();
      if (!this.value.trim()) return;
      clearAutoAdvance();
      state.intent = "";
      state.topic = "";
      state.detail = "";
      ["intentKey", "intentLabel", "topic", "emotion", "context"].forEach(function (key) {
        if (sources[key] !== "chip") return;
        planner[key] = "";
        sources[key] = "";
      });
      aiQuestion = null;
      visibleQuestion = null;
      heroQuestion = null;
      followupAnswered = false;
      followupCount = 0;
      followupAnswers = [];
      directorSequence += 1;
      setSelected(document.querySelector('[data-guided-step="intent"] .guided-choice-grid'), "", false);
      syncSharedPlanner();
    });
    syncIntentInsertFilled();
    var plan = el("guided-plan");
    if (plan) {
      plan.addEventListener("input", readPlanFields);
      plan.addEventListener("change", readPlanFields);
    }
    document.querySelectorAll('.dash-nav-btn[data-panel="create"]').forEach(function (button) {
      button.addEventListener("click", function () {
        if (!hasChildProfile() || finished) startCreateFlow();
      });
    });
    window.addEventListener("nanik:langchange", function () {
      syncLanguageFromApp();
      if (isArmenian() && aiQuestion && !hasArmenian([aiQuestion.title].concat((aiQuestion.chips || []).map(function (chip) { return chip.label; })).join(" "))) {
        aiQuestion = null;
        visibleQuestion = null;
        heroQuestion = null;
      }
      paintLanguageChrome();
      renderStep();
    });
    window.addEventListener("nanik:create-new", startCreateFlow);
    syncSharedPlanner();
    applySavedChildProfile();
    history = ["basics"];
    stepKey = "basics";
    stepIndex = 0;
    renderStep();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
