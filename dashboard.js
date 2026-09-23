(function () {
  "use strict";

  var STORIES_KEY = "nanik-web-stories";
  var AGE_MIN = 2;
  var AGE_MAX = 16;
  var AGE_CHIPS = [2, 3, 4, 5, 6];
  var TOP_LANG_CODES = ["hy", "en", "ru", "es", "fr", "de", "ar"];
  var STORY_LANGS = window.NANIK_STORY_LANGS || [];
  var COPY = {
    en: {
      other: "Other",
      kid: "My kid",
      toy: "Favorite toy",
      skip: "Skip",
      of: "of",
      somethingElse: "Something else",
      intro: "I'd love to help with that! Let me ask a few quick questions to shape the story.",
      qAge: "How old is the child this story is for?",
      qHero: "Who is the hero?",
      qHeroConfirm: "Is the hero {hero}?",
      confirmHero: "Yes — {hero}",
      anotherHero: "Type another hero",
      qPhoto: "Add a photo for the illustration?",
      photoUpload: "Upload",
      photoCamera: "Camera",
      qSupport: "What should the story gently support?",
      qLang: "What language should the story be told in?",
      moreLangs: "More languages",
      fewerLangs: "Fewer languages",
      babyHero: "My baby is the hero",
      photoKid: "Upload a photo of my kid",
      photoToy: "Upload a photo of a toy",
      heroPool: ["Teddy bear", "Toy dinosaur", "Bunny", "Little dragon", "Kitten", "Puppy", "Robot", "Unicorn"],
      yes: "Yes",
      no: "No",
      years: " years old",
      thinking: "Thinking…",
      ph: "Describe the story you want to tell…",
      phRotate: [
        "A story about my daughter’s teddy bear…",
        "Help my son feel brave tonight…",
        "A calm bedtime tale for twins…",
        "Make our toy dinosaur the hero…",
      ],
      phAge: "Or type an age…",
      phSupport: "Or type something else…",
      phHero: "Or describe the hero…",
      phOther: "Type what to support…",
      voiceNote: "Tell this story with your voice in the Nanik iOS app.",
      summaryTitle: "Tonight’s story",
      sumInsight: "What we heard",
      sumWow: "The little wow",
      shaping: "Shaping tonight’s story…",
      sumHero: "Hero",
      sumAbout: "Story",
      sumImageYes: "Your photo will be used for the illustration.",
      sumImageNo: "No photo — Nanik will imagine the illustration.",
      sumSupport: "Support",
      sumSupportNone: "A gentle bedtime",
      sumLang: "Language",
      changeLang: "Change language",
      sumPrompt: "If this feels right, create the story.",
      langHy: "Armenian",
      langEn: "English",
      langRu: "Russian",
      createStory: "Create story",
      preparing: "Your story is preparing…",
      readyLibrary: "Your story is ready in My Library.",
      openLibrary: "Open library",
      voiceWhile: "While your story is creating, would you like to tell it with your own voice?",
      bedtime: "a gentle bedtime",
      welcomeTitle: "Let’s create something magical together",
      welcomeLead: "Just describe what story you would like to tell your kid",
      tabLibrary: "Library",
      tabCreate: "Create",
      tabVoices: "Voices",
      libraryTitle: "Library",
      noStoriesYet: "No stories yet",
      noStoriesSub: "Your generated stories will appear here",
      noImage: "No image",
      createFirstStory: "Create a new story",
      summaryHeroLabel: "Hero",
      summarySettingLabel: "World",
      summaryHelpsLabel: "Help",
      tellWithVoice: "Tell with my voice",
      continueStory: "New chapter",
      tellWithYourVoice: "Tell with voice",
      voiceIntroTitle: "Test my voice",
      voiceIntroBody: "Record your voice to hear how stories will sound",
      voiceIntroContinue: "Continue",
      skip: "Skip",
      readerFontSmaller: "Smaller text",
      readerFontBigger: "Bigger text",
      musicVolume: "Music volume",
      musicPlay: "Play music",
      musicDisable: "Turn off background music",
      appStoreUrl: "https://apps.apple.com/app/id6762894314",
      telegramUrl: "https://t.me/nanikappp",
      supportEmail: "info@nanik.app",
      tryNanikPlus: "Try Nanik Plus for free",
      libraryStartFreeTrial: "Start free trial",
      getPlus: "Get Plus",
      freeStoryLeft: "1 story",
      freeStoriesLeft: "{n} stories",
      includedStoryLeft: "1 story",
      includedStoriesLeft: "{n} stories",
      accountTitle: "Account",
      accountBack: "← Back",
      accountLanguage: "Language",
      upgrade: "Upgrade",
      managePayment: "Manage payment",
      childProfile: "Kids",
      kidsTitle: "Kids profiles",
      kidsLead: "Profiles used for personalized stories",
      childName: "Name",
      childAge: "Age",
      childYears: "{n} years",
      childLikes: "Interests",
      childLikesHint: "Separate with commas, e.g. dinosaurs, drawing",
      childPhoto: "Photo (optional)",
      childGender: "Gender",
      childGenderGirl: "Girl",
      childGenderBoy: "Boy",
      childGenderUnspecified: "Prefer not to say",
      kidsAdd: "Add new profile",
      kidsEdit: "Edit profile",
      kidsSave: "Save",
      kidsBack: "Back",
      kidsEmpty: "No child profiles yet",
      childDelete: "Delete kid profile",
      joinTelegram: "Join Telegram",
      provideFeedback: "Provide Feedback",
      logOut: "Log out",
      logOutTitle: "Log out",
      logOutMessage: "Are you sure you want to log out?",
      deleteAccount: "Delete account",
      deleteAccountTitle: "You’re about to delete your stories",
      deleteAccountMessage:
        "This permanently deletes your Nanik account, stories, and associated data. Subscriptions must be cancelled separately in the App Store, Google Play, or payment portal.",
      deleteAccountCancel: "Cancel",
      deleteAccountConfirm: "Delete account",
      deleteAccountFailed: "Could not delete your account. Please try again or email info@nanik.app.",
      accountPlanLabel: "Plan",
      accountEmailLabel: "Email",
      accountIdLabel: "Account ID",
      accountPlanPlus: "Plus",
      accountPlanFree: "Freemium",
      guestAccount: "Guest",
      profileSubFallback: "Stories, voices, and settings are connected.",
      voicesTitle: "Voices",
      pickTheVoice: "Pick the voice",
      addMyVoice: "Add my voice",
      askSomeoneToRecord: "Invite to record",
      voiceSamplesSectionTitle: "Voice samples",
      myVoicesSection: "My voices",
      createdVoice: "Created voice",
      sharedVoice: "Shared voice",
      useThisVoice: "Use",
      playVoiceSample: "Play",
      myVoiceFallback: "My voice",
      useVoiceGoToStoriesBody: "Go to your stories, select or create a new story to use this voice.",
      voiceoverGenerating: "Generating voiceover…",
      voiceoverGeneratingPct: "Generating voiceover… {percent}%",
      voiceoverReady: "Voiceover is ready",
      voiceoverFailed: "Could not generate voiceover. Please try again.",
      stayInBrowser: "Please keep this page open — don’t leave the browser.",
      playVoiceover: "Play",
      pauseVoiceover: "Pause",
      voicesLoading: "Loading voices…",
      voiceCloneDemoFailed: "Couldn’t play this voice. Try again.",
      delete: "Delete",
      cancel: "Cancel",
      deleteVoiceTitle: "Delete this voice?",
      deleteVoiceBody: 'This removes "{name}" from your account.',
      deleteVoiceFailed: "Could not delete voice",
      voiceCloneLimitReached: "Your voices are full. Delete one of the voices to add a new one.",
      unlockMoreVoices: "Unlock more voices",
      readerBack: "← Library",
      storeCta: "Download on the App Store",
      libraryDownloadApp: "Download in App Store",
      status: ["Reading your idea…", "Finding the hero…", "Writing the story…", "Choosing the world…", "Painting the cover…", "Almost ready…"],
      fallbacks: {
        age: "How old is the child this story will be told to?",
        hero: "Should the illustration be of your child, or their favorite toy? You can take a photo or skip.",
        support: "Anything you’d like the story to gently support tonight?",
        voice: "Would you like to tell this story with your own voice?",
      },
      tags: [
        { emoji: "🤖", label: "Teach AI", value: "Teach what AI is…" },
        { emoji: "📚", label: "Help with today's lesson", value: "Help with today's lesson about…" },
        { emoji: "🎹", label: "Dreaming about piano", value: "dreaming about the piano" },
        { emoji: "💬", label: "Conflict with…", value: "Conflict with…" },
        { emoji: "⭐", label: "Confidence", value: "needs confidence" },
        { emoji: "🌙", label: "Fear of dark", value: "fears the dark" },
        { emoji: "🤝", label: "Friends", value: "making friends" },
        { emoji: "💛", label: "Kindness", value: "learning kindness" },
        { emoji: "🕰️", label: "Patience", value: "practicing patience" },
        { emoji: "🥗", label: "Healthy food", value: "tell about healthy food" },
        { emoji: "🌙", label: "Bedtime", value: "a calm bedtime routine" },
        { emoji: "👶", label: "New sibling", value: "welcoming a new sibling" },
        { emoji: "🎒", label: "First day", value: "first day of school" },
        { emoji: "👂", label: "Listening", value: "learning to listen" },
        { emoji: "🎁", label: "Sharing", value: "learning to share" },
        { emoji: "🦷", label: "Doctor visit", value: "a visit to the doctor" },
        { emoji: "👋", label: "Goodbye", value: "saying goodbye without tears" },
        { emoji: "🌟", label: "Trying new things", value: "trying something new" },
        { emoji: "🧸", label: "Siblings", value: "getting along with siblings" },
        { emoji: "🌧️", label: "Big feelings", value: "naming big feelings" },
      ],
    },
    hy: {
      other: "Այլ",
      kid: "Իմ երեխան",
      toy: "Սիրելի խաղալիք",
      skip: "Բաց թողնել",
      of: "ից",
      somethingElse: "Այլ բան",
      intro: "Սիրով կօգնեմ։ Մի քանի արագ հարց կտամ՝ հեքիաթը ձևավորելու համար։",
      qAge: "Քանի՞ տարեկան է երեխան, ում համար է այս հեքիաթը։",
      qHero: "Ո՞վ է հերոսը։",
      qHeroConfirm: "Հերոսը {hero} է՞։",
      confirmHero: "Այո — {hero}",
      anotherHero: "Գրիր այլ հերոս",
      qPhoto: "Ավելացնե՞լ լուսանկար նկարի համար։",
      photoUpload: "Վերբեռնել",
      photoCamera: "Տեսախցիկ",
      qSupport: "Ի՞նչը պիտի հեքիաթը մեղմ աջակցի։",
      qLang: "Ո՞ր լեզվով պատմել հեքիաթը։",
      moreLangs: "Ավելի շատ լեզուներ",
      fewerLangs: "Պակաս լեզուներ",
      babyHero: "Հերոսը իմ փոքրիկն է",
      photoKid: "Վերբեռնել երեխայիս լուսանկարը",
      photoToy: "Վերբեռնել խաղալիքի լուսանկարը",
      heroPool: ["Արջուկ", "Խաղալիք դինոզավր", "Նապաստակ", "Փոքր վիշապ", "Կատվիկ", "Շնիկ", "Ռոբոտ", "Միաեղջյուր"],
      yes: "Այո",
      no: "Ոչ",
      years: " տարեկան",
      thinking: "Մտածում է…",
      ph: "Նկարագրիր, թե ինչ հեքիաթ ես ուզում պատմել քո երեխային",
      phRotate: [
        "Նկարագրիր, թե ինչ հեքիաթ ես ուզում պատմել քո երեխային",
      ],
      phAge: "Կամ գրիր տարիքը…",
      phSupport: "Կամ գրիր այլ բան…",
      phHero: "Կամ նկարագրիր հերոսին…",
      phOther: "Գրիր, թե ինչ աջակցել…",
      voiceNote: "Հեքիաթը քո ձայնով պատմիր Nanik հավելվածում։",
      summaryTitle: "Այս երեկոյի հեքիաթը",
      sumInsight: "Ինչ լսեցինք",
      sumWow: "Փոքրիկ հրաշք",
      shaping: "Ձևավորում եմ այս երեկոյի հեքիաթը…",
      sumHero: "Հերոս",
      sumAbout: "Հեքիաթ",
      sumImageYes: "Ձեր լուսանկարը կօգտագործվի նկարի համար։",
      sumImageNo: "Լուսանկար չկա — Nanik-ը կպատկերացնի նկարը։",
      sumSupport: "Աջակցություն",
      sumSupportNone: "Հանգիստ քնելու պահ",
      sumLang: "Լեզու",
      changeLang: "Փոխել լեզուն",
      sumPrompt: "Եթե սա ճիշտ է թվում, ստեղծիր հեքիաթը։",
      langHy: "Հայերեն",
      langEn: "Անգլերեն",
      langRu: "Ռուսերեն",
      createStory: "Ստեղծել հեքիաթ",
      preparing: "Հեքիաթդ պատրաստվում է…",
      readyLibrary: "Հեքիաթդ պատրաստ է Գրադարանում։",
      openLibrary: "Բացել գրադարանը",
      voiceWhile: "Մինչ հեքիաթը ստեղծվում է, կցանկանա՞ս այն պատմել քո ձայնով։",
      bedtime: "հանգիստ քուն",
      welcomeTitle: "Եկեք միասին ստեղծենք մի կախարդական հեքիաթ",
      welcomeLead: "Նկարագրիր, թե ինչ հեքիաթ ես ուզում պատմել քո երեխային",
      tabLibrary: "Գրադարան",
      tabCreate: "Ստեղծել",
      tabVoices: "Ձայներ",
      libraryTitle: "Գրադարան",
      noStoriesYet: "Դեռ հեքիաթներ չկան",
      noStoriesSub: "Ձեր ստեղծած հեքիաթները կհայտնվեն այստեղ",
      noImage: "Նկար չկա",
      createFirstStory: "Ստեղծել նոր հեքիաթ",
      summaryHeroLabel: "Հերոս",
      summarySettingLabel: "Աշխարհ",
      summaryHelpsLabel: "Օգնում է",
      tellWithVoice: "Ձայնագրել իմ ձայնով",
      continueStory: "Նոր գլուխ",
      tellWithYourVoice: "Պատմիր քո ձայնով",
      voiceIntroTitle: "Փորձել իմ ձայնով",
      voiceIntroBody: "Ձայնագրեք Ձեր ձայնը տեսնելու համար թե ինչպես կհնչեն հեքիաթները",
      voiceIntroContinue: "Շարունակել",
      skip: "Բաց թողնել",
      readerFontSmaller: "Փոքրացնել տառատեսակը",
      readerFontBigger: "Մեծացնել տառատեսակը",
      musicVolume: "Երաժշտության ձայնը",
      musicPlay: "Նվագարկել երաժշտությունը",
      musicDisable: "Անջատել ֆոնային երաժշտությունը",
      tryNanikPlus: "Փորձել Nanik Plus-ը անվճար",
      libraryStartFreeTrial: "Սկսել անվճար փորձաշրջանը",
      getPlus: "Ստանալ Plus",
      freeStoryLeft: "1 հեքիաթ",
      freeStoriesLeft: "{n} հեքիաթ",
      includedStoryLeft: "1 հեքիաթ",
      includedStoriesLeft: "{n} հեքիաթ",
      accountTitle: "Հաշիվ",
      accountBack: "← Հետ",
      accountLanguage: "Լեզու",
      upgrade: "Ստանալ Plus",
      managePayment: "Կառավարել վճարումը",
      childProfile: "Երեխաներ",
      kidsTitle: "Երեխաների պրոֆիլներ",
      kidsLead: "Պրոֆիլներ անհատականացված պատմությունների համար",
      childName: "Անուն",
      childAge: "Տարիք",
      childYears: "{n} տարեկան",
      childLikes: "Հետաքրքրություններ",
      childLikesHint: "Բաժանիր ստորակետով, օր.` դինոզավրեր, նկարել",
      childPhoto: "Լուսանկար (ըստ ցանկության)",
      childGender: "Սեռ",
      childGenderGirl: "Աղջիկ",
      childGenderBoy: "Տղա",
      childGenderUnspecified: "Նախընտրում եմ չասել",
      kidsAdd: "Ավելացնել նոր պրոֆիլ",
      kidsEdit: "Խմբագրել պրոֆիլը",
      kidsSave: "Պահել",
      kidsBack: "Հետ",
      kidsEmpty: "Դեռ երեխայի պրոֆիլ չկա",
      childDelete: "Ջնջել երեխայի պրոֆիլը",
      joinTelegram: "Միանալ Telegram-ին",
      provideFeedback: "Տրամադրել արձագանք",
      logOut: "Դուրս գալ",
      logOutTitle: "Դուրս գալ",
      logOutMessage: "Վստա՞հ եք, որ ցանկանում եք դուրս գալ։",
      deleteAccount: "Ջնջել հաշիվը",
      deleteAccountTitle: "Դուք մոտ եք ջնջելու ձեր հեքիաթները",
      deleteAccountMessage:
        "Սա ընդմիշտ կջնջի ձեր Nanik հաշիվը, հեքիաթները և կապված տվյալները։ Բաժանորդագրությունը պետք է առանձին չեղարկել App Store-ում, Google Play-ում կամ վճարման պորտալում։",
      deleteAccountCancel: "Չեղարկել",
      deleteAccountConfirm: "Ջնջել հաշիվը",
      deleteAccountFailed: "Հաշիվը չհաջողվեց ջնջել։ Փորձիր նորից կամ գրիր info@nanik.app։",
      accountPlanLabel: "Պլան",
      accountEmailLabel: "Էլ. փոստ",
      accountIdLabel: "Հաշվի ID",
      accountPlanPlus: "Plus",
      accountPlanFree: "Freemium",
      guestAccount: "Հյուր",
      profileSubFallback: "Հեքիաթները, ձայներն ու կարգավորումները միացված են։",
      voicesTitle: "Ձայներ",
      pickTheVoice: "Ընտրիր ձայնը",
      addMyVoice: "Ավելացնել իմ ձայնը",
      askSomeoneToRecord: "Հրավիրել ձայնագրվելու",
      voiceSamplesSectionTitle: "Պատրաստի ձայներ",
      myVoicesSection: "Իմ ձայները",
      createdVoice: "Ստեղծված ձայն",
      sharedVoice: "Կիսված ձայն",
      useThisVoice: "Օգտագործել",
      playVoiceSample: "Նվագարկել",
      myVoiceFallback: "Իմ ձայնը",
      useVoiceGoToStoriesBody: "Գնացեք ձեր հեքիաթներին, ընտրեք կամ ստեղծեք նոր հեքիաթ՝ այս ձայնով պատմելու համար։",
      voiceoverGenerating: "Ձայնագրում ենք…",
      voiceoverGeneratingPct: "Ձայնագրում ենք… {percent}%",
      voiceoverReady: "Ձայնագրությունը պատրաստ է",
      voiceoverFailed: "Ձայնագրությունը չհաջողվեց։ Փորձիր նորից։",
      stayInBrowser: "Խնդրում ենք մնալ այս էջում — մի լքեք բրաուզերը։",
      playVoiceover: "Նվագարկել",
      pauseVoiceover: "Դադար",
      voicesLoading: "Ձայները բեռնվում են…",
      voiceCloneDemoFailed: "Չհաջողվեց նվագարկել այս ձայնը։ Փորձիր նորից։",
      delete: "Ջնջել",
      cancel: "Չեղարկել",
      deleteVoiceTitle: "Ջնջե՞լ այս ձայնը",
      deleteVoiceBody: "Սա կհեռացնի «{name}» ձայնը ձեր հաշվից։",
      deleteVoiceFailed: "Ձայնը չհաջողվեց ջնջել",
      voiceCloneLimitReached: "Ձայների ցանկը լիքն է։ Ջնջեք մեկ ձայն՝ նորն ավելացնելու համար։",
      unlockMoreVoices: "Բացել ավելի շատ ձայներ",
      readerBack: "← Գրադարան",
      storeCta: "Բեռնել App Store-ից",
      libraryDownloadApp: "Բեռնել App Store-ից",
      status: ["Կարդում եմ գաղափարը…", "Գտնում եմ հերոսին…", "Գրում եմ հեքիաթը…", "Ընտրում եմ աշխարհը…", "Նկարում եմ շապիկը…", "Գրեթե պատրաստ է…"],
      fallbacks: {
        age: "Քանի՞ տարեկան է երեխան, ում համար է այս հեքիաթը։",
        hero: "Նկարը լինի՞ ձեր երեխան, թե՞ սիրելի խաղալիքը։ Կարող եք լուսանկարել կամ բաց թողնել։",
        support: "Կա՞ ինչ-որ բան, որ հեքիաթը մեղմ աջակցի այսօր։",
        voice: "Ցանկանու՞մ եք հեքիաթը պատմել ձեր ձայնով։",
      },
      tags: [
        { emoji: "🤖", label: "Սովորեցնել AI", value: "Սովորեցնել, թե ինչ է արհեստական բանականությունը…" },
        { emoji: "📚", label: "Օգնություն այսօրվա դասին", value: "Օգնություն այսօրվա դասին…" },
        { emoji: "🎹", label: "Երազում է դաշնամուրի մասին", value: "երազում է դաշնամուրի մասին" },
        { emoji: "💬", label: "Կոնֆլիկտ…", value: "Կոնֆլիկտ…" },
        { emoji: "⭐", label: "Ինքնավստահություն", value: "վստահության կարիք" },
        { emoji: "🌙", label: "Մթության վախ", value: "վախենում է մթից" },
        { emoji: "🤝", label: "Ընկերներ", value: "նոր ընկերներ" },
        { emoji: "💛", label: "Բարություն", value: "սովորում է բարություն" },
        { emoji: "🕰️", label: "Համբերություն", value: "համբերություն է մարզում" },
        { emoji: "🥗", label: "Առողջ սնունդ", value: "պատմել առողջ սննդի մասին" },
        { emoji: "🌙", label: "Քուն", value: "հանգիստ քնելու ռուտին" },
        { emoji: "👶", label: "Նոր եղբայր/քույր", value: "նոր եղբոր կամ քրոջ ընդունում" },
        { emoji: "🎒", label: "Առաջին օր", value: "դպրոցի առաջին օրը" },
        { emoji: "👂", label: "Լսել", value: "սովորել լսել" },
        { emoji: "🎁", label: "Կիսվել", value: "սովորել կիսվել" },
        { emoji: "🦷", label: "Բժիշկ", value: "այցելություն բժշկին" },
        { emoji: "👋", label: "Ցտեսություն", value: "հանգիստ հրաժեշտ" },
        { emoji: "🌟", label: "Նոր բաներ", value: "փորձել նոր բան" },
        { emoji: "🧸", label: "Եղբայրներ", value: "համերաշխություն եղբայրների հետ" },
        { emoji: "🌧️", label: "Մեծ զգացումներ", value: "անվանել մեծ զգացումները" },
      ],
    },
    ru: {
      other: "Другое",
      kid: "Мой ребёнок",
      toy: "Любимая игрушка",
      skip: "Пропустить",
      of: "из",
      somethingElse: "Что-то ещё",
      intro: "С радостью помогу! Задам несколько быстрых вопросов, чтобы сформировать сказку.",
      qAge: "Сколько лет ребёнку, для которого эта сказка?",
      qHero: "Кто герой?",
      qHeroConfirm: "Герой — {hero}?",
      confirmHero: "Да — {hero}",
      anotherHero: "Написать другого героя",
      qPhoto: "Добавить фото для иллюстрации?",
      photoUpload: "Загрузить",
      photoCamera: "Камера",
      qSupport: "Что сказка могла бы мягко поддержать?",
      qLang: "На каком языке рассказать сказку?",
      moreLangs: "Больше языков",
      fewerLangs: "Меньше языков",
      babyHero: "Герой — мой малыш",
      photoKid: "Загрузить фото ребёнка",
      photoToy: "Загрузить фото игрушки",
      heroPool: ["Плюшевый мишка", "Игрушечный динозавр", "Зайчик", "Маленький дракон", "Котёнок", "Щенок", "Робот", "Единорог"],
      yes: "Да",
      no: "Нет",
      years: " лет",
      thinking: "Думаю…",
      ph: "Опишите сказку, которую хотите рассказать…",
      phRotate: [
        "Сказка про плюшевого мишку дочки…",
        "Помоги сыну сегодня быть смелым…",
        "Спокойная сказка на ночь для близнецов…",
        "Сделай героем нашего игрушечного динозавра…",
      ],
      phAge: "Или введите возраст…",
      phSupport: "Или напишите своё…",
      phHero: "Или опишите героя…",
      phOther: "Напишите, что поддержать…",
      voiceNote: "Расскажите сказку своим голосом в приложении Nanik.",
      summaryTitle: "Сказка на этот вечер",
      sumInsight: "Что мы услышали",
      sumWow: "Маленькое чудо",
      shaping: "Собираю сказку на этот вечер…",
      sumHero: "Герой",
      sumAbout: "Сюжет",
      sumImageYes: "Ваше фото будет использовано для иллюстрации.",
      sumImageNo: "Без фото — Nanik придумает иллюстрацию.",
      sumSupport: "Поддержка",
      sumSupportNone: "Спокойный сон",
      sumLang: "Язык",
      changeLang: "Сменить язык",
      sumPrompt: "Если это откликается — создайте сказку.",
      langHy: "Армянский",
      langEn: "Английский",
      langRu: "Русский",
      createStory: "Создать сказку",
      preparing: "Ваша сказка готовится…",
      readyLibrary: "Сказка готова в библиотеке.",
      openLibrary: "Открыть библиотеку",
      voiceWhile: "Пока сказка создаётся, хотите рассказать её своим голосом?",
      bedtime: "спокойный сон",
      welcomeTitle: "Давайте создадим что-то волшебное вместе",
      welcomeLead: "Опишите сказку, которую хотите рассказать ребёнку",
      tabLibrary: "Библиотека",
      tabCreate: "Создать",
      tabVoices: "Голоса",
      libraryTitle: "Библиотека",
      noStoriesYet: "Историй пока нет",
      noStoriesSub: "Созданные истории появятся здесь",
      noImage: "Нет изображения",
      createFirstStory: "Создать новую сказку",
      summaryHeroLabel: "Герой",
      summarySettingLabel: "Мир",
      summaryHelpsLabel: "Помогает",
      tellWithVoice: "Рассказать моим голосом",
      continueStory: "Новая глава",
      tellWithYourVoice: "Рассказать своим голосом",
      voiceIntroTitle: "Проверить мой голос",
      voiceIntroBody: "Запишите голос, чтобы услышать, как будут звучать сказки",
      voiceIntroContinue: "Продолжить",
      skip: "Пропустить",
      readerFontSmaller: "Уменьшить текст",
      readerFontBigger: "Увеличить текст",
      musicVolume: "Громкость музыки",
      musicPlay: "Включить музыку",
      musicDisable: "Выключить фоновую музыку",
      tryNanikPlus: "Попробовать Nanik Plus бесплатно",
      libraryStartFreeTrial: "Начать пробный период",
      getPlus: "Получить Plus",
      freeStoryLeft: "1 история",
      freeStoriesLeft: "{n} историй",
      includedStoryLeft: "1 история",
      includedStoriesLeft: "{n} историй",
      accountTitle: "Аккаунт",
      accountBack: "← Назад",
      accountLanguage: "Язык",
      upgrade: "Получить Plus",
      managePayment: "Управление оплатой",
      childProfile: "Дети",
      kidsTitle: "Профили детей",
      kidsLead: "Профили для персонализированных историй",
      childName: "Имя",
      childAge: "Возраст",
      childYears: "{n} лет",
      childLikes: "Интересы",
      childLikesHint: "Через запятую, напр. динозавры, рисование",
      childPhoto: "Фото (необязательно)",
      childGender: "Пол",
      childGenderGirl: "Девочка",
      childGenderBoy: "Мальчик",
      childGenderUnspecified: "Предпочитаю не указывать",
      kidsAdd: "Добавить новый профиль",
      kidsEdit: "Редактировать профиль",
      kidsSave: "Сохранить",
      kidsBack: "Назад",
      kidsEmpty: "Пока нет профилей детей",
      childDelete: "Удалить профиль ребёнка",
      joinTelegram: "Telegram-канал",
      provideFeedback: "Оставить отзыв",
      logOut: "Выйти",
      logOutTitle: "Выйти",
      logOutMessage: "Вы уверены, что хотите выйти?",
      deleteAccount: "Удалить аккаунт",
      deleteAccountTitle: "Вы почти удаляете свои истории",
      deleteAccountMessage:
        "Это навсегда удалит ваш аккаунт Nanik, истории и связанные данные. Подписку нужно отдельно отменить в App Store, Google Play или платёжном портале.",
      deleteAccountCancel: "Отмена",
      deleteAccountConfirm: "Удалить аккаунт",
      deleteAccountFailed: "Не удалось удалить аккаунт. Попробуйте ещё раз или напишите на info@nanik.app.",
      accountPlanLabel: "План",
      accountEmailLabel: "Email",
      accountIdLabel: "ID аккаунта",
      accountPlanPlus: "Plus",
      accountPlanFree: "Freemium",
      guestAccount: "Гость",
      profileSubFallback: "Истории, голоса и настройки связаны.",
      voicesTitle: "Голоса",
      pickTheVoice: "Выбери голос",
      addMyVoice: "Добавить мой голос",
      askSomeoneToRecord: "Попросить записать",
      voiceSamplesSectionTitle: "Примеры голосов",
      myVoicesSection: "Мои голоса",
      createdVoice: "Созданный голос",
      sharedVoice: "Общий голос",
      useThisVoice: "Выбрать",
      playVoiceSample: "Слушать",
      myVoiceFallback: "Мой голос",
      useVoiceGoToStoriesBody: "Перейдите к своим историям, выберите или создайте новую, чтобы использовать этот голос.",
      voiceoverGenerating: "Создаём озвучку…",
      voiceoverGeneratingPct: "Создаём озвучку… {percent}%",
      voiceoverReady: "Озвучка готова",
      voiceoverFailed: "Не удалось создать озвучку. Попробуйте ещё раз.",
      stayInBrowser: "Пожалуйста, не закрывайте эту страницу — не уходите из браузера.",
      playVoiceover: "Слушать озвучку",
      pauseVoiceover: "Пауза",
      voicesLoading: "Загрузка голосов…",
      voiceCloneDemoFailed: "Не удалось воспроизвести этот голос. Попробуйте ещё раз.",
      delete: "Удалить",
      cancel: "Отмена",
      deleteVoiceTitle: "Удалить этот голос?",
      deleteVoiceBody: "Это удалит «{name}» из вашего аккаунта.",
      deleteVoiceFailed: "Не удалось удалить голос",
      voiceCloneLimitReached: "Список голосов заполнен. Удалите один голос, чтобы добавить новый.",
      unlockMoreVoices: "Открыть больше голосов",
      readerBack: "← Библиотека",
      storeCta: "Скачать в App Store",
      libraryDownloadApp: "Скачать в App Store",
      status: ["Читаю идею…", "Ищу героя…", "Пишу сказку…", "Выбираю мир…", "Рисую обложку…", "Почти готово…"],
      fallbacks: {
        age: "Сколько лет ребёнку, для которого эта сказка?",
        hero: "Иллюстрация — ваш ребёнок или любимая игрушка? Можно фото или пропустить.",
        support: "Есть что-то, что сказка могла бы мягко поддержать?",
        voice: "Хотите рассказать сказку своим голосом?",
      },
      tags: [
        { emoji: "🤖", label: "Объяснить ИИ", value: "Объяснить, что такое ИИ…" },
        { emoji: "📚", label: "Помочь с уроком", value: "Помочь с уроком о…" },
        { emoji: "🎹", label: "Мечтает о пианино", value: "мечтает о пианино" },
        { emoji: "💬", label: "Конфликт с…", value: "Конфликт с…" },
        { emoji: "⭐", label: "Уверенность", value: "нужна уверенность" },
        { emoji: "🌙", label: "Страх темноты", value: "боится темноты" },
        { emoji: "🤝", label: "Друзья", value: "заводит друзей" },
        { emoji: "💛", label: "Доброта", value: "учится доброте" },
        { emoji: "🕰️", label: "Терпение", value: "учится терпению" },
        { emoji: "🥗", label: "Здоровая еда", value: "рассказать о здоровой еде" },
        { emoji: "🌙", label: "Сон", value: "спокойный ритуал сна" },
        { emoji: "👶", label: "Новый малыш", value: "появление младшего брата или сестры" },
        { emoji: "🎒", label: "Первый день", value: "первый день в школе" },
        { emoji: "👂", label: "Слушать", value: "учиться слушать" },
        { emoji: "🎁", label: "Делиться", value: "учиться делиться" },
        { emoji: "🦷", label: "Врач", value: "визит к врачу" },
        { emoji: "👋", label: "До свидания", value: "спокойно прощаться" },
        { emoji: "🌟", label: "Новое", value: "попробовать что-то новое" },
        { emoji: "🧸", label: "Братья и сёстры", value: "ладить с братьями и сёстрами" },
        { emoji: "🌧️", label: "Большие чувства", value: "называть большие чувства" },
      ],
    },
    es: {
      other: "Otro",
      kid: "Mi hijo",
      toy: "Juguete favorito",
      skip: "Omitir",
      of: "de",
      somethingElse: "Otra cosa",
      intro: "¡Me encantará ayudar! Te haré unas preguntas rápidas para dar forma al cuento.",
      qAge: "¿Cuántos años tiene el niño o la niña para quien es este cuento?",
      qHero: "¿Quién es el héroe?",
      qHeroConfirm: "¿El héroe es {hero}?",
      confirmHero: "Sí — {hero}",
      anotherHero: "Escribir otro héroe",
      qPhoto: "¿Añadir una foto para la ilustración?",
      photoUpload: "Galería",
      photoCamera: "Cámara",
      qSupport: "¿Qué debería apoyar el cuento con suavidad?",
      qLang: "¿En qué idioma contar el cuento?",
      moreLangs: "Más idiomas",
      fewerLangs: "Menos idiomas",
      babyHero: "El héroe es mi bebé",
      photoKid: "Subir una foto de mi hijo",
      photoToy: "Subir una foto de un juguete",
      heroPool: ["Osito", "Dinosaurio de juguete", "Conejito", "Pequeño dragón", "Gatito", "Perrito", "Robot", "Unicornio"],
      yes: "Sí",
      no: "No",
      years: " años",
      thinking: "Pensando…",
      ph: "Describe el cuento que quieres contar…",
      phRotate: [
        "Un cuento sobre el osito de mi hija…",
        "Ayuda a mi hijo a sentirse valiente esta noche…",
        "Un cuento tranquilo para gemelos…",
        "Que el dinosaurio de juguete sea el héroe…",
      ],
      phAge: "O escribe la edad…",
      phSupport: "O escribe otra cosa…",
      phHero: "O describe al héroe…",
      phOther: "Escribe qué apoyar…",
      voiceNote: "Cuenta este cuento con tu voz en la app Nanik.",
      summaryTitle: "El cuento de esta noche",
      sumInsight: "Lo que escuchamos",
      sumWow: "La pequeña maravilla",
      shaping: "Dando forma al cuento de esta noche…",
      sumHero: "Héroe",
      sumAbout: "Cuento",
      sumImageYes: "Tu foto se usará para la ilustración.",
      sumImageNo: "Sin foto — Nanik imaginará la ilustración.",
      sumSupport: "Apoyo",
      sumSupportNone: "Un momento dulce para dormir",
      sumLang: "Idioma",
      changeLang: "Cambiar idioma",
      sumPrompt: "Si esto se siente bien, crea el cuento.",
      langHy: "Armenio",
      langEn: "Inglés",
      langRu: "Ruso",
      createStory: "Crear cuento",
      preparing: "Tu cuento se está preparando…",
      readyLibrary: "Tu cuento está listo en la biblioteca.",
      openLibrary: "Abrir biblioteca",
      voiceWhile: "Mientras se crea el cuento, ¿quieres contarlo con tu voz?",
      bedtime: "un momento dulce para dormir",
      welcomeTitle: "Creemos juntos algo mágico",
      welcomeLead: "Describe el cuento que quieres contar a tu hijo",
      tabLibrary: "Biblioteca",
      tabCreate: "Crear",
      tabVoices: "Voces",
      libraryTitle: "Biblioteca",
      voicesTitle: "Mis voces",
      voicesEmpty: "Clona una voz en la app Nanik para iOS y los cuentos podrán narrarse con esa voz.",
      readerBack: "← Biblioteca",
      storeCta: "Descargar en el App Store",
      status: ["Leyendo tu idea…", "Buscando al héroe…", "Escribiendo el cuento…", "Eligiendo el mundo…", "Pintando la portada…", "Casi listo…"],
      fallbacks: {
        age: "¿Cuántos años tiene el niño o la niña para quien es este cuento?",
        hero: "¿La ilustración es de tu hijo o de su juguete favorito? Puedes hacer una foto u omitir.",
        support: "¿Hay algo que el cuento deba apoyar con suavidad esta noche?",
        voice: "¿Quieres contar este cuento con tu propia voz?",
      },
      tags: [
        { emoji: "⭐", label: "Confianza", value: "necesita confianza" },
        { emoji: "🌙", label: "Miedo a la oscuridad", value: "miedo a la oscuridad" },
        { emoji: "🤝", label: "Amigos", value: "hacer amigos" },
        { emoji: "💛", label: "Bondad", value: "aprender bondad" },
        { emoji: "🌟", label: "Probar cosas nuevas", value: "probar algo nuevo" },
        { emoji: "🎁", label: "Compartir", value: "aprender a compartir" },
        { emoji: "🥗", label: "Comida sana", value: "hablar de comida sana" },
        { emoji: "🌧️", label: "Emociones grandes", value: "nombrar emociones grandes" },
        { emoji: "🎒", label: "Primer día", value: "primer día de colegio" },
        { emoji: "🌙", label: "Hora de dormir", value: "una rutina tranquila para dormir" },
      ],
    },
    fr: {
      other: "Autre",
      kid: "Mon enfant",
      toy: "Jouet préféré",
      skip: "Passer",
      of: "sur",
      somethingElse: "Autre chose",
      intro: "Avec plaisir ! Je vais poser quelques questions rapides pour façonner l’histoire.",
      qAge: "Quel âge a l’enfant pour qui est cette histoire ?",
      qHero: "Qui est le héros ?",
      qHeroConfirm: "Le héros est-il {hero} ?",
      confirmHero: "Oui — {hero}",
      anotherHero: "Écrire un autre héros",
      qPhoto: "Ajouter une photo pour l’illustration ?",
      photoUpload: "Galerie",
      photoCamera: "Appareil photo",
      qSupport: "Que l’histoire devrait-elle soutenir tout en douceur ?",
      qLang: "Dans quelle langue raconter l’histoire ?",
      moreLangs: "Plus de langues",
      fewerLangs: "Moins de langues",
      babyHero: "Le héros est mon bébé",
      photoKid: "Ajouter une photo de mon enfant",
      photoToy: "Ajouter une photo d’un jouet",
      heroPool: ["Ours en peluche", "Dinosaure jouet", "Lapin", "Petit dragon", "Chaton", "Chiot", "Robot", "Licorne"],
      yes: "Oui",
      no: "Non",
      years: " ans",
      thinking: "Je réfléchis…",
      ph: "Décrivez l’histoire que vous voulez raconter…",
      phRotate: [
        "Une histoire sur l’ours de ma fille…",
        "Aide mon fils à se sentir courageux ce soir…",
        "Un conte calme pour des jumeaux…",
        "Que le dinosaure jouet soit le héros…",
      ],
      phAge: "Ou tapez un âge…",
      phSupport: "Ou écrivez autre chose…",
      phHero: "Ou décrivez le héros…",
      phOther: "Écrivez ce qu’il faut soutenir…",
      voiceNote: "Racontez cette histoire avec votre voix dans l’app Nanik.",
      summaryTitle: "L’histoire de ce soir",
      sumInsight: "Ce que nous avons entendu",
      sumWow: "La petite merveille",
      shaping: "Je façonne l’histoire de ce soir…",
      sumHero: "Héros",
      sumAbout: "Histoire",
      sumImageYes: "Votre photo servira pour l’illustration.",
      sumImageNo: "Pas de photo — Nanik imaginera l’illustration.",
      sumSupport: "Soutien",
      sumSupportNone: "Un coucher tout doux",
      sumLang: "Langue",
      changeLang: "Changer de langue",
      sumPrompt: "Si cela vous parle, créez l’histoire.",
      langHy: "Arménien",
      langEn: "Anglais",
      langRu: "Russe",
      createStory: "Créer l’histoire",
      preparing: "Votre histoire se prépare…",
      readyLibrary: "Votre histoire est prête dans la bibliothèque.",
      openLibrary: "Ouvrir la bibliothèque",
      voiceWhile: "Pendant la création, voulez-vous la raconter avec votre voix ?",
      bedtime: "un coucher tout doux",
      welcomeTitle: "Créons ensemble quelque chose de magique",
      welcomeLead: "Décrivez l’histoire que vous voulez raconter à votre enfant",
      tabLibrary: "Bibliothèque",
      tabCreate: "Créer",
      tabVoices: "Voix",
      libraryTitle: "Bibliothèque",
      voicesTitle: "Mes voix",
      voicesEmpty: "Clonez une voix dans l’app Nanik iOS, puis les histoires pourront être racontées avec cette voix.",
      readerBack: "← Bibliothèque",
      storeCta: "Télécharger sur l’App Store",
      status: ["Lecture de votre idée…", "Recherche du héros…", "Écriture de l’histoire…", "Choix du monde…", "Peinture de la couverture…", "Presque prêt…"],
      fallbacks: {
        age: "Quel âge a l’enfant pour qui est cette histoire ?",
        hero: "L’illustration est-elle votre enfant ou son jouet préféré ? Photo ou passer.",
        support: "Y a-t-il quelque chose que l’histoire devrait soutenir ce soir ?",
        voice: "Voulez-vous raconter cette histoire avec votre voix ?",
      },
      tags: [
        { emoji: "⭐", label: "Confiance", value: "a besoin de confiance" },
        { emoji: "🌙", label: "Peur du noir", value: "peur du noir" },
        { emoji: "🤝", label: "Amis", value: "se faire des amis" },
        { emoji: "💛", label: "Gentillesse", value: "apprendre la gentillesse" },
        { emoji: "🌟", label: "Essayer du nouveau", value: "essayer quelque chose de nouveau" },
        { emoji: "🎁", label: "Partager", value: "apprendre à partager" },
        { emoji: "🥗", label: "Manger sain", value: "parler de nourriture saine" },
        { emoji: "🌧️", label: "Grandes émotions", value: "nommer les grandes émotions" },
        { emoji: "🎒", label: "Premier jour", value: "premier jour d’école" },
        { emoji: "🌙", label: "Au dodo", value: "un rituel de coucher calme" },
      ],
    },
    de: {
      other: "Andere",
      kid: "Mein Kind",
      toy: "Lieblingsspielzeug",
      skip: "Überspringen",
      of: "von",
      somethingElse: "Etwas anderes",
      intro: "Gern! Ich stelle ein paar kurze Fragen, um die Geschichte zu formen.",
      qAge: "Wie alt ist das Kind, für das diese Geschichte ist?",
      qHero: "Wer ist der Held?",
      qHeroConfirm: "Ist der Held {hero}?",
      confirmHero: "Ja — {hero}",
      anotherHero: "Anderen Helden schreiben",
      qPhoto: "Ein Foto für die Illustration hinzufügen?",
      photoUpload: "Mediathek",
      photoCamera: "Kamera",
      qSupport: "Was soll die Geschichte behutsam unterstützen?",
      qLang: "In welcher Sprache soll die Geschichte erzählt werden?",
      moreLangs: "Mehr Sprachen",
      fewerLangs: "Weniger Sprachen",
      babyHero: "Der Held ist mein Baby",
      photoKid: "Foto meines Kindes hochladen",
      photoToy: "Foto eines Spielzeugs hochladen",
      heroPool: ["Teddybär", "Spielzeugdinosaurier", "Häschen", "Kleiner Drache", "Kätzchen", "Welpe", "Roboter", "Einhorn"],
      yes: "Ja",
      no: "Nein",
      years: " Jahre",
      thinking: "Ich denke nach…",
      ph: "Beschreibe die Geschichte, die du erzählen möchtest…",
      phRotate: [
        "Eine Geschichte über den Teddy meiner Tochter…",
        "Hilf meinem Sohn, heute Abend mutig zu sein…",
        "Eine ruhige Gute-Nacht-Geschichte für Zwillinge…",
        "Mach unseren Spielzeugdinosaurier zum Helden…",
      ],
      phAge: "Oder Alter eingeben…",
      phSupport: "Oder etwas anderes schreiben…",
      phHero: "Oder den Helden beschreiben…",
      phOther: "Schreibe, was unterstützt werden soll…",
      voiceNote: "Erzähle diese Geschichte mit deiner Stimme in der Nanik-App.",
      summaryTitle: "Die Geschichte für heute Abend",
      sumInsight: "Was wir gehört haben",
      sumWow: "Das kleine Wunder",
      shaping: "Ich forme die Geschichte für heute Abend…",
      sumHero: "Held",
      sumAbout: "Geschichte",
      sumImageYes: "Dein Foto wird für die Illustration verwendet.",
      sumImageNo: "Kein Foto — Nanik stellt sich die Illustration vor.",
      sumSupport: "Unterstützung",
      sumSupportNone: "Ein sanfter Schlafensabend",
      sumLang: "Sprache",
      changeLang: "Sprache ändern",
      sumPrompt: "Wenn sich das richtig anfühlt, erstelle die Geschichte.",
      langHy: "Armenisch",
      langEn: "Englisch",
      langRu: "Russisch",
      createStory: "Geschichte erstellen",
      preparing: "Deine Geschichte wird vorbereitet…",
      readyLibrary: "Deine Geschichte ist in der Bibliothek bereit.",
      openLibrary: "Bibliothek öffnen",
      voiceWhile: "Möchtest du die Geschichte mit deiner Stimme erzählen, während sie entsteht?",
      bedtime: "ein sanfter Schlafensabend",
      welcomeTitle: "Lass uns zusammen etwas Magisches erschaffen",
      welcomeLead: "Beschreibe die Geschichte, die du deinem Kind erzählen möchtest",
      tabLibrary: "Bibliothek",
      tabCreate: "Erstellen",
      tabVoices: "Stimmen",
      libraryTitle: "Bibliothek",
      voicesTitle: "Meine Stimmen",
      voicesEmpty: "Klone eine Stimme in der Nanik-iOS-App, dann können Geschichten mit dieser Stimme erzählt werden.",
      readerBack: "← Bibliothek",
      storeCta: "Im App Store laden",
      status: ["Idee lesen…", "Held finden…", "Geschichte schreiben…", "Welt wählen…", "Cover malen…", "Gleich fertig…"],
      fallbacks: {
        age: "Wie alt ist das Kind, für das diese Geschichte ist?",
        hero: "Soll die Illustration dein Kind oder das Lieblingsspielzeug sein? Foto oder überspringen.",
        support: "Gibt es etwas, das die Geschichte heute Abend behutsam unterstützen soll?",
        voice: "Möchtest du diese Geschichte mit deiner eigenen Stimme erzählen?",
      },
      tags: [
        { emoji: "⭐", label: "Selbstvertrauen", value: "braucht Selbstvertrauen" },
        { emoji: "🌙", label: "Angst im Dunkeln", value: "Angst vor der Dunkelheit" },
        { emoji: "🤝", label: "Freunde", value: "Freunde finden" },
        { emoji: "💛", label: "Freundlichkeit", value: "Freundlichkeit lernen" },
        { emoji: "🌟", label: "Neues ausprobieren", value: "etwas Neues ausprobieren" },
        { emoji: "🎁", label: "Teilen", value: "teilen lernen" },
        { emoji: "🥗", label: "Gesundes Essen", value: "über gesundes Essen sprechen" },
        { emoji: "🌧️", label: "Große Gefühle", value: "große Gefühle benennen" },
        { emoji: "🎒", label: "Erster Tag", value: "erster Schultag" },
        { emoji: "🌙", label: "Schlafenszeit", value: "eine ruhige Abendroutine" },
      ],
    },
    ar: {
      other: "آخر",
      kid: "طفلي",
      toy: "اللعبة المفضلة",
      skip: "تخطي",
      of: "من",
      somethingElse: "شيء آخر",
      intro: "يسعدني المساعدة! سأطرح بعض الأسئلة السريعة لتشكيل القصة.",
      qAge: "كم عمر الطفل الذي تُروى له هذه القصة؟",
      qHero: "من هو البطل؟",
      qHeroConfirm: "هل البطل {hero}؟",
      confirmHero: "نعم — {hero}",
      anotherHero: "اكتب بطلاً آخر",
      qPhoto: "إضافة صورة للرسمة؟",
      photoUpload: "المعرض",
      photoCamera: "الكاميرا",
      qSupport: "ماذا يجب أن تدعم القصة بلطف؟",
      qLang: "بأي لغة تُروى القصة؟",
      moreLangs: "مزيد من اللغات",
      fewerLangs: "لغات أقل",
      babyHero: "البطل هو طفلي",
      photoKid: "رفع صورة لطفلي",
      photoToy: "رفع صورة للعبة",
      heroPool: ["دبدوب", "ديناصور لعبة", "أرنوب", "تنين صغير", "هرة", "جرو", "روبوت", "وحيد القرن"],
      yes: "نعم",
      no: "لا",
      years: " سنوات",
      thinking: "أفكر…",
      ph: "صف القصة التي تريد روايتها…",
      phRotate: [
        "قصة عن دبدوب ابنتي…",
        "ساعد ابني ليشعر بالشجاعة الليلة…",
        "حكاية هادئة قبل النوم للتوأم…",
        "اجعل ديناصور اللعبة هو البطل…",
      ],
      phAge: "أو اكتب العمر…",
      phSupport: "أو اكتب شيئاً آخر…",
      phHero: "أو صف البطل…",
      phOther: "اكتب ماذا ندعم…",
      voiceNote: "اروِ هذه القصة بصوتك في تطبيق Nanik.",
      summaryTitle: "قصة هذه الليلة",
      sumInsight: "ما سمعناه",
      sumWow: "الدهشة الصغيرة",
      shaping: "أشكل قصة هذه الليلة…",
      sumHero: "البطل",
      sumAbout: "القصة",
      sumImageYes: "ستُستخدم صورتك للرسمة.",
      sumImageNo: "لا صورة — ستتخيل Nanik الرسمة.",
      sumSupport: "الدعم",
      sumSupportNone: "نوم هادئ",
      sumLang: "اللغة",
      changeLang: "تغيير اللغة",
      sumPrompt: "إذا كان هذا مناسباً، أنشئ القصة.",
      langHy: "الأرمنية",
      langEn: "الإنجليزية",
      langRu: "الروسية",
      createStory: "إنشاء القصة",
      preparing: "قصتك تُجهَّز…",
      readyLibrary: "قصتك جاهزة في المكتبة.",
      openLibrary: "فتح المكتبة",
      voiceWhile: "بينما تُنشأ القصة، هل تريد روايتها بصوتك؟",
      bedtime: "نوم هادئ",
      welcomeTitle: "لنصنع معاً شيئاً سحرياً",
      welcomeLead: "صف القصة التي تريد روايتها لطفلك",
      tabLibrary: "المكتبة",
      tabCreate: "إنشاء",
      tabVoices: "الأصوات",
      libraryTitle: "المكتبة",
      voicesTitle: "أصواتي",
      voicesEmpty: "استنسخ صوتاً في تطبيق Nanik على iOS، ثم يمكن رواية القصص بذلك الصوت.",
      readerBack: "← المكتبة",
      storeCta: "التنزيل من App Store",
      status: ["أقرأ فكرتك…", "أبحث عن البطل…", "أكتب القصة…", "أختار العالم…", "أرسم الغلاف…", "أوشكت…"],
      fallbacks: {
        age: "كم عمر الطفل الذي تُروى له هذه القصة؟",
        hero: "هل الرسمة لطفلك أم لعبته المفضلة؟ يمكنك التقاط صورة أو التخطي.",
        support: "هل هناك شيء تريد أن تدعمه القصة بلطف الليلة؟",
        voice: "هل تريد رواية هذه القصة بصوتك؟",
      },
      tags: [
        { emoji: "⭐", label: "الثقة", value: "يحتاج ثقة" },
        { emoji: "🌙", label: "الخوف من الظلام", value: "يخاف من الظلام" },
        { emoji: "🤝", label: "الأصدقاء", value: "تكوين صداقات" },
        { emoji: "💛", label: "اللطف", value: "تعلم اللطف" },
        { emoji: "🌟", label: "تجربة الجديد", value: "تجربة شيء جديد" },
        { emoji: "🎁", label: "المشاركة", value: "تعلم المشاركة" },
        { emoji: "🥗", label: "طعام صحي", value: "الحديث عن الطعام الصحي" },
        { emoji: "🌧️", label: "مشاعر كبيرة", value: "تسمية المشاعر الكبيرة" },
        { emoji: "🎒", label: "اليوم الأول", value: "اليوم الأول في المدرسة" },
        { emoji: "🌙", label: "وقت النوم", value: "روتين نوم هادئ" },
      ],
    },
    it: {
      other: "Altro",
      kid: "Mio figlio",
      toy: "Giocattolo preferito",
      skip: "Salta",
      of: "di",
      somethingElse: "Qualcos’altro",
      intro: "Con piacere! Farò qualche domanda veloce per dare forma alla storia.",
      qAge: "Quanti anni ha il bambino o la bambina per cui è questa storia?",
      qHero: "Chi è l’eroe?",
      qHeroConfirm: "L’eroe è {hero}?",
      confirmHero: "Sì — {hero}",
      anotherHero: "Scrivi un altro eroe",
      qPhoto: "Aggiungere una foto per l’illustrazione?",
      photoUpload: "Galleria",
      photoCamera: "Fotocamera",
      qSupport: "Cosa dovrebbe sostenere la storia con delicatezza?",
      qLang: "In che lingua raccontare la storia?",
      moreLangs: "Altre lingue",
      fewerLangs: "Meno lingue",
      babyHero: "L’eroe è il mio bambino",
      photoKid: "Carica una foto di mio figlio",
      photoToy: "Carica una foto di un giocattolo",
      heroPool: ["Orsetto", "Dinosauro giocattolo", "Coniglietto", "Piccolo drago", "Gattino", "Cucciolo", "Robot", "Unicorno"],
      yes: "Sì",
      no: "No",
      years: " anni",
      thinking: "Sto pensando…",
      ph: "Descrivi la storia che vuoi raccontare…",
      phRotate: [
        "Una storia sull’orsetto di mia figlia…",
        "Aiuta mio figlio a sentirsi coraggioso stasera…",
        "Una fiaba tranquilla per gemelli…",
        "Il dinosauro giocattolo sia l’eroe…",
      ],
      phAge: "Oppure scrivi l’età…",
      phSupport: "Oppure scrivi altro…",
      phHero: "Oppure descrivi l’eroe…",
      phOther: "Scrivi cosa sostenere…",
      voiceNote: "Racconta questa storia con la tua voce nell’app Nanik.",
      summaryTitle: "La storia di stasera",
      sumInsight: "Quello che abbiamo sentito",
      sumWow: "La piccola meraviglia",
      shaping: "Sto dando forma alla storia di stasera…",
      sumHero: "Eroe",
      sumAbout: "Storia",
      sumImageYes: "La tua foto sarà usata per l’illustrazione.",
      sumImageNo: "Nessuna foto — Nanik immaginerà l’illustrazione.",
      sumSupport: "Sostegno",
      sumSupportNone: "Una nanna dolce",
      sumLang: "Lingua",
      changeLang: "Cambia lingua",
      sumPrompt: "Se ti sembra giusto, crea la storia.",
      langHy: "Armeno",
      langEn: "Inglese",
      langRu: "Russo",
      createStory: "Crea storia",
      preparing: "La tua storia si sta preparando…",
      readyLibrary: "La tua storia è pronta in libreria.",
      openLibrary: "Apri libreria",
      voiceWhile: "Mentre la storia si crea, vuoi raccontarla con la tua voce?",
      bedtime: "una nanna dolce",
      welcomeTitle: "Creiamo insieme qualcosa di magico",
      welcomeLead: "Descrivi la storia che vuoi raccontare a tuo figlio",
      tabLibrary: "Libreria",
      tabCreate: "Crea",
      tabVoices: "Voci",
      libraryTitle: "Libreria",
      voicesTitle: "Le mie voci",
      voicesEmpty: "Clona una voce nell’app Nanik per iOS, poi le storie potranno essere raccontate con quella voce.",
      readerBack: "← Libreria",
      storeCta: "Scarica sull’App Store",
      status: ["Leggo la tua idea…", "Cerco l’eroe…", "Scrivo la storia…", "Scelgo il mondo…", "Dipingo la copertina…", "Quasi pronto…"],
      fallbacks: {
        age: "Quanti anni ha il bambino o la bambina per cui è questa storia?",
        hero: "L’illustrazione è tuo figlio o il suo giocattolo preferito? Puoi fare una foto o saltare.",
        support: "C’è qualcosa che la storia dovrebbe sostenere con delicatezza stasera?",
        voice: "Vuoi raccontare questa storia con la tua voce?",
      },
      tags: [
        { emoji: "⭐", label: "Fiducia", value: "ha bisogno di fiducia" },
        { emoji: "🌙", label: "Paura del buio", value: "paura del buio" },
        { emoji: "🤝", label: "Amici", value: "farsi degli amici" },
        { emoji: "💛", label: "Gentilezza", value: "imparare la gentilezza" },
        { emoji: "🌟", label: "Provare cose nuove", value: "provare qualcosa di nuovo" },
        { emoji: "🎁", label: "Condividere", value: "imparare a condividere" },
        { emoji: "🥗", label: "Cibo sano", value: "parlare di cibo sano" },
        { emoji: "🌧️", label: "Grandi emozioni", value: "dare un nome alle grandi emozioni" },
        { emoji: "🎒", label: "Primo giorno", value: "primo giorno di scuola" },
        { emoji: "🌙", label: "Nanna", value: "una routine tranquilla per la nanna" },
      ],
    },
    pt: {
      other: "Outro",
      kid: "Meu filho",
      toy: "Brinquedo favorito",
      skip: "Pular",
      of: "de",
      somethingElse: "Outra coisa",
      intro: "Vou adorar ajudar! Vou fazer algumas perguntas rápidas para moldar o conto.",
      qAge: "Quantos anos tem a criança para quem é este conto?",
      qHero: "Quem é o herói?",
      qHeroConfirm: "O herói é {hero}?",
      confirmHero: "Sim — {hero}",
      anotherHero: "Escrever outro herói",
      qPhoto: "Adicionar uma foto para a ilustração?",
      photoUpload: "Galeria",
      photoCamera: "Câmera",
      qSupport: "O que o conto deve apoiar com suavidade?",
      qLang: "Em que idioma contar o conto?",
      moreLangs: "Mais idiomas",
      fewerLangs: "Menos idiomas",
      babyHero: "O herói é o meu bebé",
      photoKid: "Enviar uma foto do meu filho",
      photoToy: "Enviar uma foto de um brinquedo",
      heroPool: ["Ursinho", "Dinossauro de brinquedo", "Coelhinho", "Dragãozinho", "Gatinho", "Cachorrinho", "Robô", "Unicórnio"],
      yes: "Sim",
      no: "Não",
      years: " anos",
      thinking: "A pensar…",
      ph: "Descreve o conto que queres contar…",
      phRotate: [
        "Um conto sobre o ursinho da minha filha…",
        "Ajuda o meu filho a sentir-se corajoso esta noite…",
        "Um conto calmo para gémeos…",
        "Que o dinossauro de brinquedo seja o herói…",
      ],
      phAge: "Ou escreve a idade…",
      phSupport: "Ou escreve outra coisa…",
      phHero: "Ou descreve o herói…",
      phOther: "Escreve o que apoiar…",
      voiceNote: "Conta este conto com a tua voz na app Nanik.",
      summaryTitle: "O conto desta noite",
      sumInsight: "O que ouvimos",
      sumWow: "O pequeno encanto",
      shaping: "A moldar o conto desta noite…",
      sumHero: "Herói",
      sumAbout: "Conto",
      sumImageYes: "A tua foto será usada na ilustração.",
      sumImageNo: "Sem foto — a Nanik vai imaginar a ilustração.",
      sumSupport: "Apoio",
      sumSupportNone: "Uma hora de dormir suave",
      sumLang: "Idioma",
      changeLang: "Mudar idioma",
      sumPrompt: "Se isto parecer certo, cria o conto.",
      langHy: "Arménio",
      langEn: "Inglês",
      langRu: "Russo",
      createStory: "Criar conto",
      preparing: "O teu conto está a ser preparado…",
      readyLibrary: "O teu conto está pronto na biblioteca.",
      openLibrary: "Abrir biblioteca",
      voiceWhile: "Enquanto o conto é criado, queres contá-lo com a tua voz?",
      bedtime: "uma hora de dormir suave",
      welcomeTitle: "Vamos criar juntos algo mágico",
      welcomeLead: "Descreve o conto que queres contar ao teu filho",
      tabLibrary: "Biblioteca",
      tabCreate: "Criar",
      tabVoices: "Vozes",
      libraryTitle: "Biblioteca",
      voicesTitle: "As minhas vozes",
      voicesEmpty: "Clona uma voz na app Nanik para iOS e os contos poderão ser narrados com essa voz.",
      readerBack: "← Biblioteca",
      storeCta: "Descarregar na App Store",
      status: ["A ler a tua ideia…", "A encontrar o herói…", "A escrever o conto…", "A escolher o mundo…", "A pintar a capa…", "Quase pronto…"],
      fallbacks: {
        age: "Quantos anos tem a criança para quem é este conto?",
        hero: "A ilustração é do teu filho ou do brinquedo favorito? Podes tirar uma foto ou pular.",
        support: "Há algo que o conto deva apoiar com suavidade esta noite?",
        voice: "Queres contar este conto com a tua voz?",
      },
      tags: [
        { emoji: "⭐", label: "Confiança", value: "precisa de confiança" },
        { emoji: "🌙", label: "Medo do escuro", value: "medo do escuro" },
        { emoji: "🤝", label: "Amigos", value: "fazer amigos" },
        { emoji: "💛", label: "Gentileza", value: "aprender gentileza" },
        { emoji: "🌟", label: "Tentar coisas novas", value: "tentar algo novo" },
        { emoji: "🎁", label: "Partilhar", value: "aprender a partilhar" },
        { emoji: "🥗", label: "Comida saudável", value: "falar sobre comida saudável" },
        { emoji: "🌧️", label: "Grandes sentimentos", value: "nomear grandes sentimentos" },
        { emoji: "🎒", label: "Primeiro dia", value: "primeiro dia de escola" },
        { emoji: "🌙", label: "Hora de dormir", value: "uma rotina calma para dormir" },
      ],
    },
  };

  var step = "idle";
  var answers = { idea: "", childName: "", childGender: "", age: null, heroKind: "", heroName: "", image: "", support: "", likes: "", setting: "", voice: null, lang: "en", clarify: {}, planner: null };
  var turnAbort = null;
  var loadingTurn = false;
  var waitingOther = false;
  var pendingHeroKind = "";
  var sending = false;
  var qQueue = [];
  var qIndex = 0;
  var langMoreOpen = false;
  var summaryLangOpen = false;
  var sessionSupport = [];
  var sessionHeroes = [];
  var ideaHero = { hero: "", kind: "", suggestions: [] };
  var ideaBrief = {
    used: false,
    understood: "",
    reply: "",
    photoRelevant: true,
    languageClear: false,
  };
  var parentBrief = { insight: "", wow: "", recap: "" };
  var clarifyQs = [];
  var aiQuestions = [];
  var chatCopy = {};
  var phTimer = 0;
  var phIdx = 0;
  var PH_ROTATE_MS = 3200;
  var guidedCreateHooks = null;

  function notifyGuidedCreate(type, payload) {
    if (!guidedCreateHooks || typeof guidedCreateHooks[type] !== "function") return;
    try {
      guidedCreateHooks[type](payload);
    } catch (e) {}
  }

  function wordScore(text, words) {
    var hay = " " + String(text || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ") + " ";
    if (hay === "  ") {
      hay = " " + String(text || "").toLowerCase().replace(/[^a-zà-ÿäöüßñãõç]+/gi, " ") + " ";
    }
    var n = 0;
    (words || []).forEach(function (word) {
      if (hay.indexOf(" " + word + " ") >= 0) n += 1;
    });
    return n;
  }

  function looksLikeArmenianTranslit(text) {
    var sample = String(text || "").trim();
    if (!sample || /[\u0531-\u058F\uFB13-\uFB17]/.test(sample)) return false;
    if (!/[A-Za-z]/.test(sample)) return false;
    var lower = sample.toLowerCase();
    if (/\b(yerevan|erevan|hayk|hayastan|hayeren|gerox|heros|heqiat|heqyat|heqiyat|patmvac|patmvaq|ashkharh|dproc|yerekoyan|gisher|gisherayin|erexa|yerexa|yerekha|axjik|aghjik|axchik|aghjikner|tgha|txa|pokrik|poqrik|arjuk|xaxaliq|khaxaliq|mayrik|hayrik|ynker|barekam|uzum|stexcel|masin|hamar|inchpes|aysor|mtutyan|qajutyun|talantavor|mardu|shunik|vishap|qnel|qunel|sovorel)\b/i.test(lower)) {
      return true;
    }
    var words = lower.split(/\s+/).filter(function (word) {
      return /[a-z]/.test(word);
    });
    var english = 0;
    var stops = { the: 1, a: 1, an: 1, and: 1, my: 1, in: 1, on: 1, with: 1, for: 1, about: 1, little: 1, child: 1, story: 1, is: 1, are: 1, to: 1, of: 1, at: 1, this: 1, that: 1, will: 1, help: 1 };
    words.forEach(function (word) {
      if (stops[word.replace(/[^a-z]/g, "")]) english += 1;
    });
    var clusters = lower.match(/\b\w*(gh|kh|ts|dz|tch|dj|evo|yan)\w*\b/gi);
    return (clusters ? clusters.length : 0) >= 2 && english < 2;
  }

  function detectLang(text) {
    var s = String(text || "");
    if (/[\u0531-\u058F\uFB13-\uFB17]/.test(s)) return "hy";
    if (looksLikeArmenianTranslit(s)) return "hy";
    if (/[\u0400-\u04FF]/.test(s)) return "ru";
    if (/[\u0600-\u06FF]/.test(s)) return "ar";
    if (/[\u10A0-\u10FF]/.test(s)) return "ka";
    if (/[\u0590-\u05FF]/.test(s)) return "he";
    if (/[\u4E00-\u9FFF]/.test(s)) return "zh";
    if (/[\u3040-\u30FF]/.test(s)) return "ja";
    if (/[\uAC00-\uD7AF]/.test(s)) return "ko";
    if (/[\u0370-\u03FF]/.test(s)) return "el";
    var scores = [
      { code: "es", n: wordScore(s, ["el", "la", "de", "que", "una", "para", "con", "por", "los", "las", "del", "mi", "cuento", "historia", "niño", "niña", "hijo", "hija", "quiero", "noche"]) + (/[ñ¿¡]/.test(s) ? 2 : 0) },
      { code: "pt", n: wordScore(s, ["uma", "para", "com", "não", "você", "história", "criança", "quero", "noite", "meu", "minha"]) + (/[ãõ]/.test(s) ? 2 : 0) },
      { code: "fr", n: wordScore(s, ["le", "les", "une", "des", "pour", "avec", "dans", "histoire", "enfant", "conte", "nuit", "je", "mon", "ma"]) + (/[àâèéêëïôùûç]/.test(s) ? 1 : 0) },
      { code: "de", n: wordScore(s, ["der", "die", "das", "und", "ein", "eine", "für", "mit", "kind", "geschichte", "nacht", "ich", "mein"]) + (/[äöüß]/.test(s) ? 2 : 0) },
      { code: "it", n: wordScore(s, ["il", "una", "per", "con", "che", "storia", "bambino", "bambina", "voglio", "notte", "mio", "mia"]) },
      { code: "en", n: wordScore(s, ["the", "and", "for", "with", "story", "about", "tonight", "help", "child", "my", "a", "to"]) },
    ];
    scores.sort(function (a, b) { return b.n - a.n; });
    if (scores[0].n >= 2 && scores[0].n > (scores[1] ? scores[1].n : 0)) return scores[0].code;
    return "en";
  }

  function uiLang() {
    try {
      var stored = localStorage.getItem("nanik-site-lang");
      if (stored === "hy" || stored === "en" || stored === "ru") return stored;
    } catch (e) {}
    var html = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    return html === "hy" || html === "ru" ? html : "en";
  }

  function ui() {
    return COPY[uiLang()] || COPY.en;
  }

  function stripSlots(text) {
    return String(text || "")
      .replace(/\{[a-zA-Z0-9_]+\}/g, "")
      .replace(/\s*:\s*$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function fillSlots(text) {
    return String(text || "")
      .replace(/\{hero\}/gi, heroLabel())
      .replace(/\{support\}/gi, answers.support || "")
      .replace(/\{language\}/gi, langLabel(findLang(answers.lang)))
      .replace(/\{[a-zA-Z0-9_]+\}/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function yearsSuffix() {
    var raw = String((t().years != null ? t().years : " years old") || " years old");
    if (/year/i.test(raw)) return " years old";
    raw = raw.replace(/\s+/g, " ").trim();
    return raw ? " " + raw : " years old";
  }

  function tidyChatCopy(raw) {
    var keepSlot = { qHeroConfirm: true, confirmHero: true };
    var out = {};
    if (!raw || typeof raw !== "object") return out;
    Object.keys(raw).forEach(function (key) {
      var value = String(raw[key] || "").replace(/\s+/g, " ").trim();
      if (!value) return;
      if (!keepSlot[key]) value = stripSlots(value);
      if (key === "years") {
        if (/year/i.test(value)) value = " years old";
        else value = value ? " " + value.replace(/^\s+/, "") : " years old";
      }
      if (value) out[key] = value;
    });
    return out;
  }

  function t() {
    // Create-flow chrome follows site/app language, not detected story language.
    var base = COPY[uiLang()] || COPY.en;
    if (!chatCopy || !Object.keys(chatCopy).length) return base;
    var merged = {};
    Object.keys(base).forEach(function (key) {
      merged[key] = base[key];
    });
    Object.keys(chatCopy).forEach(function (key) {
      if (chatCopy[key]) merged[key] = chatCopy[key];
    });
    return merged;
  }

  function siteLang() {
    return uiLang();
  }

  function rotateCopy() {
    return ui();
  }

  function readerBackLabel(pack) {
    // Copy ships with a leading arrow ("← Library"); the button draws its own chevron.
    return String((pack && pack.readerBack) || COPY.en.readerBack || "")
      .replace(/^[\s←<]+/, "")
      .trim();
  }

  function paintChrome() {
    var pack = ui();
    var map = [
      ["dash-welcome-title", pack.welcomeTitle],
      ["dash-welcome-lead", pack.welcomeLead],
      ["dash-reader-back-label", readerBackLabel(pack)],
      ["dash-reader-volume-title", pack.musicVolume || COPY.en.musicVolume],
      ["dash-account-title", pack.accountTitle || COPY.en.accountTitle],
      ["dash-account-page-heading", pack.accountTitle || COPY.en.accountTitle],
      ["dash-account-open-label", pack.accountTitle || COPY.en.accountTitle],
      ["dash-account-lang-label", pack.accountLanguage || COPY.en.accountLanguage],
      ["dash-menu-child-label", pack.childProfile || COPY.en.childProfile],
      ["dash-header-child-label", pack.childProfile || COPY.en.childProfile],
      ["dash-tab-pill-kids-label", pack.childProfile || COPY.en.childProfile],
      ["dash-kids-title", pack.kidsTitle || pack.childProfile || COPY.en.kidsTitle],
      ["dash-kids-lead", pack.kidsLead || COPY.en.kidsLead],
      ["dash-account-upgrade", pack.upgrade || COPY.en.upgrade],
      ["dash-kids-add-label", pack.kidsAdd || COPY.en.kidsAdd],
      ["dash-account-billing-label", pack.managePayment || COPY.en.managePayment],
      ["dash-account-telegram-label", pack.joinTelegram || COPY.en.joinTelegram],
      ["dash-account-feedback-label", pack.provideFeedback || COPY.en.provideFeedback],
      ["dash-account-logout-label", pack.logOut || COPY.en.logOut],
      ["dash-account-delete-label", pack.deleteAccount || COPY.en.deleteAccount],
      ["dash-account-detail-email-label", pack.accountEmailLabel || COPY.en.accountEmailLabel],
    ];
    map.forEach(function (item) {
      var el = document.getElementById(item[0]);
      if (el && item[1]) el.textContent = item[1];
    });
    var readerBackBtn = document.getElementById("dash-reader-back");
    if (readerBackBtn) readerBackBtn.setAttribute("aria-label", readerBackLabel(pack));
    paintVoicesTitle();
    document.querySelectorAll("[data-ui]").forEach(function (el) {
      var key = el.getAttribute("data-ui");
      if (key && pack[key]) el.textContent = pack[key];
    });
    document.documentElement.lang = uiLang();
    paintAccountLangValue();
    paintAccountProfile();
    paintChildProfile();
    paintStoriesCapsule();
    var fontDown = document.getElementById("dash-reader-font-down");
    var fontUp = document.getElementById("dash-reader-font-up");
    var smaller = pack.readerFontSmaller || COPY.en.readerFontSmaller;
    var bigger = pack.readerFontBigger || COPY.en.readerFontBigger;
    if (fontDown) fontDown.setAttribute("aria-label", smaller);
    if (fontUp) fontUp.setAttribute("aria-label", bigger);
    syncReaderMusicButton();
    syncReaderVoiceButton();
    var telegram = document.getElementById("dash-account-telegram");
    if (telegram) telegram.href = pack.telegramUrl || COPY.en.telegramUrl || "https://t.me/nanikappp";
    var feedback = document.getElementById("dash-account-feedback");
    if (feedback) {
      var email = pack.supportEmail || COPY.en.supportEmail || "info@nanik.app";
      feedback.href = "mailto:" + email + "?subject=" + encodeURIComponent("Nanik feedback");
    }
  }

  var UI_LANGS = [
    { code: "hy", flag: "🇦🇲", name: "Armenian", nativeName: "Հայերեն" },
    { code: "en", flag: "🇺🇸", name: "English", nativeName: "English" },
    { code: "ru", flag: "🇷🇺", name: "Russian", nativeName: "Русский" },
  ];

  function setUiLang(code) {
    var next = code === "hy" || code === "ru" ? code : "en";
    try {
      localStorage.setItem("nanik-site-lang", next);
    } catch (e) {}
    if (window.NanikGeoLang && typeof window.NanikGeoLang.markUserChoice === "function") {
      window.NanikGeoLang.markUserChoice();
    }
    document.documentElement.lang = next;
    window.dispatchEvent(new CustomEvent("nanik:langchange", { detail: { lang: next } }));
  }

  var DASH_UI_LANGS = ["hy", "en", "ru"];

  function bootUiLangFromGeo() {
    var boot = window.__nanikGeoLangBoot;
    if (!boot && window.NanikGeoLang) {
      boot = window.NanikGeoLang.bootstrap(DASH_UI_LANGS);
    }
    if (boot && boot.shouldRefine && window.NanikGeoLang) {
      window.NanikGeoLang.refineFromCountry(DASH_UI_LANGS, function (next) {
        if (next === "hy" || next === "en" || next === "ru") {
          document.documentElement.lang = next;
          paintChrome();
        }
      });
    }
  }

  function currentUiLangMeta() {
    var code = uiLang();
    for (var i = 0; i < UI_LANGS.length; i++) {
      if (UI_LANGS[i].code === code) return UI_LANGS[i];
    }
    return UI_LANGS[1];
  }

  function paintAccountLangValue() {
    var el = document.getElementById("dash-account-lang-value");
    if (!el) return;
    var meta = currentUiLangMeta();
    el.textContent = meta.flag + " " + meta.nativeName;
  }

  function paintAccountLangList() {
    var box = document.getElementById("dash-account-langs");
    if (!box) return;
    var active = uiLang();
    box.innerHTML = UI_LANGS.map(function (lang) {
      var on = lang.code === active;
      return (
        '<button type="button" class="dash-account-lang-opt' +
        (on ? " is-on" : "") +
        '" data-lang="' +
        lang.code +
        '">' +
        '<span class="dash-account-lang-flag">' +
        lang.flag +
        "</span>" +
        '<span class="dash-account-lang-copy">' +
        '<span class="dash-account-lang-name">' +
        escapeHtml(lang.nativeName) +
        "</span>" +
        '<span class="dash-account-lang-sub">' +
        escapeHtml(lang.name) +
        "</span></span>" +
        (on ? '<span class="dash-account-lang-check">✓</span>' : "") +
        "</button>"
      );
    }).join("");
    box.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setUiLang(btn.getAttribute("data-lang"));
        paintAccountLangList();
        setLangExpanded(false);
      });
    });
  }

  function setLangExpanded(on) {
    var list = document.getElementById("dash-account-langs");
    var btn = document.getElementById("dash-account-lang");
    if (list) list.hidden = !on;
    if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
    if (on) paintAccountLangList();
  }

  function positionAccountSheet() {
    var sheet = document.getElementById("dash-account-sheet");
    var avatar = document.getElementById("dash-avatar");
    if (!sheet || !avatar) return;
    var rect = avatar.getBoundingClientRect();
    var gap = 8;
    var width = Math.min(320, window.innerWidth - 28);
    var left = Math.min(
      Math.max(14, rect.right - width),
      window.innerWidth - width - 14
    );
    sheet.style.top = Math.round(rect.bottom + gap) + "px";
    sheet.style.right = "auto";
    sheet.style.left = Math.round(left) + "px";
    sheet.style.width = width + "px";
  }

  function mountAccountRoot(mode) {
    var root = document.getElementById("dash-account-root");
    if (!root) return;
    var sheet = document.getElementById("dash-account-sheet");
    var pageHost = document.getElementById("dash-account-page-host");
    var openWrap = document.getElementById("dash-account-open-wrap");
    var sheetOnly = document.getElementById("dash-account-sheet-only");
    var pageOnly = document.getElementById("dash-account-page-only");
    var onPage = mode === "page" && !!pageHost;
    root.classList.toggle("is-page", onPage);
    root.classList.toggle("is-sheet", !onPage);
    if (openWrap) openWrap.hidden = onPage;
    if (sheetOnly) sheetOnly.hidden = onPage;
    if (pageOnly) pageOnly.hidden = !onPage;
    if (onPage) {
      pageHost.appendChild(root);
      return;
    }
    if (sheet) sheet.appendChild(root);
  }

  function isAccountSheetOpen() {
    var sheet = document.getElementById("dash-account-sheet");
    return !!(sheet && !sheet.hidden);
  }

  function openAccountSheet(opts) {
    var accountPanel = document.getElementById("panel-account");
    if (accountPanel && !accountPanel.hidden) {
      // Prefer the account page when that section is already open.
      return;
    }
    var sheet = document.getElementById("dash-account-sheet");
    var backdrop = document.getElementById("dash-account-backdrop");
    var avatar = document.getElementById("dash-avatar");
    mountAccountRoot("sheet");
    positionAccountSheet();
    if (sheet) sheet.hidden = false;
    if (backdrop) backdrop.hidden = false;
    if (avatar) avatar.setAttribute("aria-expanded", "true");
    paintAccountLangValue();
    paintAccountProfile();
    setLangExpanded(false);
    void refreshQuotaStatus();
  }

  function closeAccountSheet() {
    var sheet = document.getElementById("dash-account-sheet");
    var backdrop = document.getElementById("dash-account-backdrop");
    var avatar = document.getElementById("dash-avatar");
    if (sheet) sheet.hidden = true;
    if (backdrop) backdrop.hidden = true;
    if (avatar) avatar.setAttribute("aria-expanded", "false");
    setLangExpanded(false);
  }

  function leaveAccountPage() {
    closeAccountSheet();
    setLangExpanded(false);
    showPanel("library");
  }

  function openAccountPage() {
    closeAccountSheet();
    showPanel("account");
  }

  function savedChild() {
    var draft = window.NANIK_DRAFT || {};
    return draft.getChild ? draft.getChild() : null;
  }

  function allChildren() {
    var draft = window.NANIK_DRAFT || {};
    if (typeof draft.getChildren === "function") return draft.getChildren() || [];
    var one = savedChild();
    return one ? [one] : [];
  }

  var editingChildId = "";
  /** Kids added via “Add” but not confirmed with Save yet — hide Delete until then. */
  var pendingNewChildIds = Object.create(null);

  function childYearsLabel(age) {
    var pack = ui();
    var n = parseInt(age, 10);
    if (!(n >= 2 && n <= 16)) return "";
    if (uiLang() === "hy") return n + " տարեկան";
    if (uiLang() === "ru") {
      var template = pack.childYears || COPY.en.childYears || "{n} years";
      return String(template).replace("{n}", String(n));
    }
    return n === 1 ? "1 year old" : n + " years old";
  }

  function setKidsExpanded(on) {
    // Kids live on their own panel now (not a menu dropdown).
    if (on) showPanel("kids");
  }

  function paintKidsPage() {
    var kidsPanel = document.getElementById("panel-kids");
    if (!kidsPanel || kidsPanel.hidden) return;
    paintKidsList();
    paintKidsAddChrome();
  }

  var FREE_KIDS_PROFILES = 1;
  var MAX_KIDS_PROFILES = 10;

  function kidsProfileCount() {
    return allChildren().length;
  }

  function needsPlusForNextKid() {
    return kidsProfileCount() >= FREE_KIDS_PROFILES && !quotaState.isPlus;
  }

  function canAddChildProfile() {
    if (kidsProfileCount() >= MAX_KIDS_PROFILES) return false;
    if (needsPlusForNextKid()) return false;
    return true;
  }

  function paintKidsAddChrome() {
    var kidsAdd = document.getElementById("dash-kids-add");
    var guidedAdd = document.getElementById("guided-profile-add");
    var atLimit = kidsProfileCount() >= MAX_KIDS_PROFILES;
    var locked = needsPlusForNextKid();
    var editing = !!editingChildId;
    if (kidsAdd) {
      // Hide while a profile creation/edit card is open.
      kidsAdd.hidden = atLimit || editing;
      kidsAdd.setAttribute("aria-hidden", kidsAdd.hidden ? "true" : "false");
      kidsAdd.classList.toggle("is-locked", locked && !atLimit && !editing);
    }
    if (guidedAdd) {
      guidedAdd.hidden = atLimit;
      guidedAdd.setAttribute("aria-hidden", atLimit ? "true" : "false");
      guidedAdd.classList.toggle("is-locked", locked && !atLimit);
    }
  }

  function requestAddChildProfile() {
    if (kidsProfileCount() >= MAX_KIDS_PROFILES) {
      paintKidsAddChrome();
      return false;
    }
    if (needsPlusForNextKid()) {
      openWebPaywall({ title: "Unlock more child profiles" });
      return false;
    }
    addChildProfile();
    paintKidsAddChrome();
    return true;
  }

  function ageOptionsHtml(selected) {
    var html = "";
    var n = parseInt(selected, 10);
    for (var age = 2; age <= 16; age++) {
      html +=
        '<option value="' +
        age +
        '"' +
        (age === n ? " selected" : "") +
        ">" +
        escapeHtml(childYearsLabel(age)) +
        "</option>";
    }
    return html;
  }

  function parseLikesTokens(raw) {
    return String(raw || "")
      .split(",")
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);
  }

  function kidsLikesTokens(card) {
    if (!card) return [];
    var box = card.querySelector("[data-kids-likes-chips]");
    if (!box) return [];
    return Array.prototype.map
      .call(box.querySelectorAll("[data-like-chip]"), function (chip) {
        return (chip.getAttribute("data-like-chip") || "").trim();
      })
      .filter(Boolean);
  }

  function kidsLikesValue(card) {
    var tokens = kidsLikesTokens(card);
    var input = card && card.querySelector("[data-kids-likes]");
    var typing = input ? input.value.trim().replace(/,$/, "") : "";
    if (typing) tokens = tokens.concat([typing]);
    return tokens.join(", ");
  }

  function paintKidsLikesChips(card, tokens) {
    if (!card) return;
    var box = card.querySelector("[data-kids-likes-chips]");
    if (!box) return;
    var list = (tokens || kidsLikesTokens(card)).filter(Boolean);
    box.innerHTML = list
      .map(function (item) {
        return (
          '<button type="button" class="guided-hero-like-chip" data-like-chip="' +
          escapeHtml(item) +
          '" aria-label="' +
          escapeHtml(item) +
          '">' +
          escapeHtml(item) +
          '<span aria-hidden="true">×</span></button>'
        );
      })
      .join("");
  }

  function commitKidsLikeToken(card) {
    if (!card) return;
    var input = card.querySelector("[data-kids-likes]");
    if (!input) return;
    var next = input.value.trim().replace(/,$/, "");
    if (!next) {
      input.value = "";
      return;
    }
    var tokens = kidsLikesTokens(card);
    var key = next.toLowerCase();
    if (
      !tokens.some(function (item) {
        return item.toLowerCase() === key;
      })
    ) {
      tokens.push(next);
    }
    paintKidsLikesChips(card, tokens);
    input.value = "";
  }

  function kidsGenderLabel(value, pack) {
    var en = COPY.en;
    if (value === "girl") return pack.childGenderGirl || en.childGenderGirl || "Girl";
    if (value === "boy") return pack.childGenderBoy || en.childGenderBoy || "Boy";
    if (value === "unspecified") {
      return pack.childGenderUnspecified || en.childGenderUnspecified || "Prefer not to say";
    }
    return "";
  }

  function kidsGenderValue(card) {
    var on = card && card.querySelector("[data-kids-gender].is-on");
    var value = on && on.getAttribute("data-kids-gender");
    if (value === "girl" || value === "boy" || value === "unspecified") return value;
    return "";
  }

  function syncKidsGenderButtons(card, value) {
    if (!card) return;
    var selected = value === "girl" || value === "boy" || value === "unspecified" ? value : "";
    card.querySelectorAll("[data-kids-gender]").forEach(function (button) {
      var on = selected && button.getAttribute("data-kids-gender") === selected;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-checked", on ? "true" : "false");
    });
  }

  function saveKidFromFlipCard(card) {
    if (!card) return;
    var draft = window.NANIK_DRAFT || {};
    if (!draft.setChild) return;
    var id = card.getAttribute("data-kid-id") || "";
    var nameInput = card.querySelector("[data-kids-name]");
    var ageSelect = card.querySelector("[data-kids-age]");
    var kid = allChildren().find(function (k) {
      return k.id === id;
    });
    commitKidsLikeToken(card);
    draft.setChild({
      id: id || undefined,
      name: nameInput ? nameInput.value : (kid && kid.name) || "",
      age: ageSelect ? ageSelect.value : (kid && kid.age) || 5,
      likes: kidsLikesValue(card) || (kid && kid.likes) || "",
      gender: kidsGenderValue(card) || (kid && kid.gender) || "unspecified",
      photo: (kid && kid.photo) || "",
    });
    paintChildProfileSummary();
  }

  function deleteKidFromFlipCard(card) {
    if (!card) return;
    var draft = window.NANIK_DRAFT || {};
    var id = card.getAttribute("data-kid-id") || "";
    var pack = ui();
    var title = pack.childDelete || COPY.en.childDelete || "Delete kid profile";
    if (!id || !window.confirm(title + "?")) return;
    if (draft.removeChild) draft.removeChild(id);
    else if (draft.setChild) draft.setChild(null);
    editingChildId = "";
    paintKidsList();
    paintKidsAddChrome();
    paintChildProfileSummary();
  }

  function closeKidsFlipCard(card, opts) {
    opts = opts || {};
    if (!card) {
      editingChildId = "";
      paintKidsList();
      paintKidsAddChrome();
      paintChildProfileSummary();
      return;
    }
    var kidId = card.getAttribute("data-kid-id") || "";
    if (opts.discardPending && kidId && pendingNewChildIds[kidId]) {
      var draft = window.NANIK_DRAFT || {};
      if (draft.removeChild) draft.removeChild(kidId);
      delete pendingNewChildIds[kidId];
      editingChildId = "";
      paintKidsList();
      paintKidsAddChrome();
      paintChildProfileSummary();
      return;
    }
    if (card.getAttribute("data-kids-closing") === "1") return;
    card.setAttribute("data-kids-closing", "1");
    saveKidFromFlipCard(card);
    if (opts.confirm && kidId) delete pendingNewChildIds[kidId];
    var list = card.parentElement;
    var inner = card.querySelector(".guided-hero-flip-inner");
    var rect = card.getBoundingClientRect();
    card.style.height = rect.height + "px";
    card.style.minHeight = rect.height + "px";
    card.style.maxWidth = rect.width + "px";
    card.style.flexBasis = rect.width + "px";
    card.style.flexGrow = "0";
    if (inner) {
      inner.style.height = rect.height + "px";
      inner.style.minHeight = rect.height + "px";
    }
    if (list) {
      list.classList.add("is-kid-closing");
      list.classList.remove("is-kid-focus");
    }
    void card.offsetWidth;
    card.classList.remove("is-flipped");
    window.requestAnimationFrame(function () {
      card.style.height = "";
      card.style.minHeight = "";
      card.style.maxWidth = "";
      card.style.flexBasis = "";
      card.style.flexGrow = "";
      if (inner) {
        inner.style.height = "";
        inner.style.minHeight = "";
      }
    });
    var finish = function () {
      if (card.getAttribute("data-kids-closing") !== "1") return;
      card.removeAttribute("data-kids-closing");
      editingChildId = "";
      paintKidsList();
      paintKidsAddChrome();
      paintChildProfileSummary();
    };
    var done = false;
    var complete = function () {
      if (done) return;
      done = true;
      if (inner) inner.removeEventListener("transitionend", onEnd);
      finish();
    };
    var onEnd = function (e) {
      if (e.target !== inner) return;
      if (e.propertyName && e.propertyName !== "transform") return;
      complete();
    };
    if (inner) inner.addEventListener("transitionend", onEnd);
    window.setTimeout(complete, 700);
  }

  function paintKidsList() {
    var list = document.getElementById("dash-kids-list");
    if (!list) return;
    var kids = allChildren();
    var active = savedChild();
    var pack = ui();
    var hy = uiLang() === "hy";
    var ru = uiLang() === "ru";
    list.innerHTML = "";
    list.className =
      "dash-kids-list dash-kids-hero-cards" +
      (editingChildId ? " is-kid-focus" : "");
    if (!kids.length) {
      editingChildId = "";
      list.className = "dash-kids-list dash-kids-hero-cards";
      paintKidsAddChrome();
      return;
    }
    kids.forEach(function (kid, index) {
      var isOn = active && active.id === kid.id;
      var isEdit = editingChildId === kid.id;
      var desc = childYearsLabel(kid.age);
      var genderLabel = kidsGenderLabel(kid.gender, pack);
      if (genderLabel) desc += " · " + genderLabel;
      if (kid.likes) desc += " · " + kid.likes;
      var title = kid.name ? kid.name : childYearsLabel(kid.age);
      var card = document.createElement("div");
      card.className =
        "dash-kids-flip-card guided-hero-flip-card" +
        (isOn ? " is-active" : "") +
        (isEdit ? " is-on is-flipped" : "");
      card.setAttribute("data-kid-id", kid.id);
      card.setAttribute("role", "listitem");
      if (index === 1) card.classList.add("dash-kids-flip-alt");
      else if (index === 2) card.classList.add("dash-kids-flip-pink");
      else if (index === 3) card.classList.add("dash-kids-flip-green");
      else if (index === 4) card.classList.add("dash-kids-flip-yellow");
      else if (index >= 5) card.classList.add("dash-kids-flip-peach");
      var media = kid.photo
        ? '<img src="' +
          String(kid.photo).replace(/"/g, "&quot;") +
          '" alt="" loading="lazy" decoding="async">'
        : '<img src="images/intent-cards/my-child-transparent.png?v=20260915alpha" alt="" width="1024" height="1024" loading="lazy" decoding="async">';
      var genderAria = escapeHtml(pack.childGender || COPY.en.childGender || "Gender");
      card.innerHTML =
        '<div class="guided-hero-flip-inner">' +
        '<button type="button" class="guided-hero-flip-face guided-hero-flip-front dash-kids-flip-front">' +
        '<span class="dash-kids-hero-media guided-hero-card-media" aria-hidden="true">' +
        media +
        "</span>" +
        '<span class="dash-kids-hero-copy">' +
        '<strong class="dash-kids-hero-title"></strong>' +
        '<span class="dash-kids-hero-desc"></span>' +
        "</span>" +
        '<span class="dash-kids-hero-arrow" aria-hidden="true">&#8594;</span>' +
        "</button>" +
        '<div class="guided-hero-flip-face guided-hero-flip-back dash-kids-flip-back">' +
        '<div class="dash-kids-flip-fields">' +
        '<button type="button" class="dash-kids-flip-back-btn" data-kids-back>' +
        "← " +
        escapeHtml(pack.kidsBack || COPY.en.kidsBack || "Back") +
        "</button>" +
        '<label class="guided-hero-child-name guided-floating-field">' +
        '<input data-kids-name type="text" maxlength="40" autocomplete="given-name" placeholder=" " value="">' +
        '<span class="guided-floating-label">' +
        escapeHtml(pack.childName || COPY.en.childName || "Name") +
        "</span></label>" +
        '<label class="dash-kids-age-field">' +
        '<span class="dash-kids-age-label">' +
        escapeHtml(pack.childAge || COPY.en.childAge || "Age") +
        "</span>" +
        '<select data-kids-age aria-label="' +
        escapeHtml(pack.childAge || COPY.en.childAge || "Age") +
        '">' +
        ageOptionsHtml(kid.age) +
        "</select></label>" +
        '<div class="guided-hero-gender dash-kids-gender" role="radiogroup" aria-label="' +
        genderAria +
        '">' +
        '<button type="button" class="guided-choice" role="radio" aria-checked="false" data-kids-gender="girl"><strong>' +
        escapeHtml(pack.childGenderGirl || COPY.en.childGenderGirl || "Girl") +
        "</strong></button>" +
        '<button type="button" class="guided-choice" role="radio" aria-checked="false" data-kids-gender="boy"><strong>' +
        escapeHtml(pack.childGenderBoy || COPY.en.childGenderBoy || "Boy") +
        "</strong></button>" +
        '<button type="button" class="guided-choice" role="radio" aria-checked="false" data-kids-gender="unspecified"><strong>' +
        escapeHtml(
          pack.childGenderUnspecified || COPY.en.childGenderUnspecified || "Prefer not to say"
        ) +
        "</strong></button>" +
        "</div>" +
        '<div class="guided-hero-chip-field dash-kids-likes-chip-field" data-kids-likes-field>' +
        '<span class="guided-floating-label">' +
        escapeHtml(pack.childLikes || COPY.en.childLikes || "Interests") +
        "</span>" +
        '<span class="guided-hero-child-likes-chips" data-kids-likes-chips aria-live="polite"></span>' +
        '<input data-kids-likes type="text" maxlength="40" value="" placeholder=" " aria-label="' +
        escapeHtml(pack.childLikes || COPY.en.childLikes || "Interests") +
        '">' +
        "</div>" +
        '<p class="dash-kids-likes-hint">' +
        escapeHtml(
          pack.childLikesHint ||
            COPY.en.childLikesHint ||
            "Separate with commas, e.g. dinosaurs, drawing"
        ) +
        "</p>" +
        "</div>" +
        '<div class="dash-kids-flip-actions">' +
        '<button type="button" class="dash-kids-flip-done" data-kids-done>' +
        escapeHtml(
          pack.kidsSave ||
            COPY.en.kidsSave ||
            (hy ? "Պահել" : ru ? "Сохранить" : "Save")
        ) +
        "</button>" +
        (pendingNewChildIds[kid.id]
          ? ""
          : '<button type="button" class="dash-kids-flip-delete" data-kids-delete>' +
            escapeHtml(pack.childDelete || COPY.en.childDelete || "Delete kid profile") +
            "</button>") +
        "</div>" +
        "</div></div>";
      var titleEl = card.querySelector(".dash-kids-hero-title");
      var descEl = card.querySelector(".dash-kids-hero-desc");
      var nameInput = card.querySelector("[data-kids-name]");
      var likesInput = card.querySelector("[data-kids-likes]");
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = kid.name ? desc : kid.likes || genderLabel || "";
      if (nameInput) nameInput.value = kid.name || "";
      syncKidsGenderButtons(card, kid.gender || "");
      paintKidsLikesChips(card, parseLikesTokens(kid.likes));
      var front = card.querySelector(".dash-kids-flip-front");
      if (front) {
        front.addEventListener("click", function () {
          var draft = window.NANIK_DRAFT || {};
          if (draft.selectChild) draft.selectChild(kid.id);
          editingChildId = kid.id;
          paintKidsList();
          paintKidsAddChrome();
          paintChildProfileSummary();
        });
      }
      var ageSelect = card.querySelector("[data-kids-age]");
      if (ageSelect) {
        ageSelect.addEventListener("change", function () {
          saveKidFromFlipCard(card);
        });
      }
      card.querySelectorAll("[data-kids-gender]").forEach(function (button) {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          syncKidsGenderButtons(card, button.getAttribute("data-kids-gender") || "");
          saveKidFromFlipCard(card);
        });
      });
      if (nameInput) {
        nameInput.addEventListener("change", function () {
          saveKidFromFlipCard(card);
        });
      }
      if (likesInput) {
        likesInput.addEventListener("input", function () {
          if (!/,/.test(likesInput.value)) return;
          var parts = likesInput.value.split(",");
          var remainder = parts.pop();
          parts.forEach(function (part) {
            var token = part.trim();
            if (!token) return;
            var tokens = kidsLikesTokens(card);
            var key = token.toLowerCase();
            if (
              !tokens.some(function (item) {
                return item.toLowerCase() === key;
              })
            ) {
              tokens.push(token);
            }
            paintKidsLikesChips(card, tokens);
          });
          likesInput.value = remainder || "";
        });
        likesInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commitKidsLikeToken(card);
            return;
          }
          if (e.key === "Backspace" && !likesInput.value) {
            var tokens = kidsLikesTokens(card);
            if (tokens.length) {
              tokens.pop();
              paintKidsLikesChips(card, tokens);
            }
          }
        });
        likesInput.addEventListener("change", function () {
          commitKidsLikeToken(card);
          saveKidFromFlipCard(card);
        });
      }
      var likesChips = card.querySelector("[data-kids-likes-chips]");
      if (likesChips) {
        likesChips.addEventListener("click", function (e) {
          var chip = e.target.closest("[data-like-chip]");
          if (!chip || !likesChips.contains(chip)) return;
          e.preventDefault();
          e.stopPropagation();
          var remove = (chip.getAttribute("data-like-chip") || "").toLowerCase();
          paintKidsLikesChips(
            card,
            kidsLikesTokens(card).filter(function (item) {
              return item.toLowerCase() !== remove;
            })
          );
          saveKidFromFlipCard(card);
        });
      }
      var backBtn = card.querySelector("[data-kids-back]");
      if (backBtn) {
        backBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          closeKidsFlipCard(card, { discardPending: true });
        });
      }
      var doneBtn = card.querySelector("[data-kids-done]");
      if (doneBtn) {
        doneBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          closeKidsFlipCard(card, { confirm: true });
        });
      }
      var deleteBtn = card.querySelector("[data-kids-delete]");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          deleteKidFromFlipCard(card);
        });
      }
      list.appendChild(card);
    });
  }

  function paintChildProfileSummary() {
    var child = savedChild();
    var kids = allChildren();
    var text = "";
    if (child) {
      text = child.name ? child.name + " · " + childYearsLabel(child.age) : childYearsLabel(child.age);
    } else if (kids.length) {
      text = String(kids.length);
    }
    ["dash-menu-child-value"].forEach(function (id) {
      var value = document.getElementById(id);
      if (value) value.textContent = text;
    });
    layoutTopNav();
  }

  function paintChildProfile() {
    paintChildProfileSummary();
    paintKidsPage();
    paintKidsAddChrome();
  }

  function addChildProfile() {
    if (kidsProfileCount() >= MAX_KIDS_PROFILES) {
      paintKidsAddChrome();
      return;
    }
    if (needsPlusForNextKid()) {
      openWebPaywall({ title: "Unlock more child profiles" });
      return;
    }
    var draft = window.NANIK_DRAFT || {};
    if (!draft.setChild) return;
    var saved = draft.setChild({
      name: "",
      age: 5,
      likes: "",
      gender: "unspecified",
      photo: "",
    });
    editingChildId = saved && saved.id ? saved.id : "";
    if (editingChildId) pendingNewChildIds[editingChildId] = true;
    showPanel("kids");
    paintKidsList();
    paintChildProfileSummary();
    paintKidsAddChrome();
  }

  var voicesPickMode = false;
  var voiceoverPickStoryId = "";
  var voiceoverJob = null;
  var voiceoverAudio = null;
  var voiceoverReadyTimer = 0;
  var voiceoverProgressPercent = null;
  // Blob voiceovers live only for this tab; keep them here so a cloud library refresh
  // cannot wipe the Play button back to "Tell with your voice".
  var voiceoverUrlByStoryId = {};
  var VOICEOVER_RATE_KEY = "nanik-voiceover-rate";
  var MIN_PLAYBACK_RATE = 0.8;
  var MAX_PLAYBACK_RATE = 2;
  var PLAYBACK_RATE_STEP = 0.1;
  var DEFAULT_PLAYBACK_RATE = 1;
  var voiceoverPlaybackRate = loadVoiceoverPlaybackRate();
  var voiceoverScrubbing = false;

  function snapPlaybackRate(rate) {
    var clamped = Math.min(MAX_PLAYBACK_RATE, Math.max(MIN_PLAYBACK_RATE, Number(rate) || DEFAULT_PLAYBACK_RATE));
    var snapped =
      Math.round((clamped - MIN_PLAYBACK_RATE) / PLAYBACK_RATE_STEP) * PLAYBACK_RATE_STEP +
      MIN_PLAYBACK_RATE;
    return Math.round(snapped * 100) / 100;
  }

  function formatPlaybackRateLabel(rate) {
    var rounded = snapPlaybackRate(rate);
    var value = Number.isInteger(rounded)
      ? String(rounded)
      : String(rounded.toFixed(2)).replace(/0$/, "").replace(/\.$/, "");
    return value + "x";
  }

  function loadVoiceoverPlaybackRate() {
    try {
      return snapPlaybackRate(localStorage.getItem(VOICEOVER_RATE_KEY));
    } catch (e) {
      return DEFAULT_PLAYBACK_RATE;
    }
  }

  function saveVoiceoverPlaybackRate(rate) {
    voiceoverPlaybackRate = snapPlaybackRate(rate);
    try {
      localStorage.setItem(VOICEOVER_RATE_KEY, String(voiceoverPlaybackRate));
    } catch (e) {}
    return voiceoverPlaybackRate;
  }

  function playbackRateToSliderIndex(rate) {
    return Math.round((snapPlaybackRate(rate) - MIN_PLAYBACK_RATE) / PLAYBACK_RATE_STEP);
  }

  function playbackRateFromSliderIndex(index) {
    return snapPlaybackRate(MIN_PLAYBACK_RATE + Number(index) * PLAYBACK_RATE_STEP);
  }

  function formatPlayerTime(seconds) {
    var total = Math.max(0, Math.floor(Number(seconds) || 0));
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function isDurableVoiceoverUrl(url) {
    return /^https?:\/\//i.test(String(url || "").trim());
  }

  function preferVoiceoverUrl(a, b) {
    var left = String(a || "").trim();
    var right = String(b || "").trim();
    if (isDurableVoiceoverUrl(left) && !isDurableVoiceoverUrl(right)) return left;
    if (isDurableVoiceoverUrl(right) && !isDurableVoiceoverUrl(left)) return right;
    if (left) return left;
    return right;
  }

  function paintVoicesTitle() {
    var pack = ui();
    var en = COPY.en;
    var el = document.getElementById("dash-voices-title");
    if (el) {
      el.textContent = voicesPickMode
        ? pack.pickTheVoice || en.pickTheVoice || "Pick the voice"
        : pack.voicesTitle || en.voicesTitle || "Voices";
    }
    var pick = document.getElementById("dash-voice-pick-title");
    if (pick) pick.textContent = pack.pickTheVoice || en.pickTheVoice || "Pick the voice";
  }

  function closeVoicePick() {
    var modal = document.getElementById("dash-voice-pick");
    var panel = document.getElementById("panel-voices");
    var voices = document.getElementById("dash-voices");
    var wasOpen = !!(modal && !modal.hidden);
    if (panel && voices && voices.parentNode !== panel) panel.appendChild(voices);
    if (modal) modal.hidden = true;
    if (wasOpen) {
      voicesPickMode = false;
      stopVoicesAudio();
    }
  }

  function openVoicesForPick(story) {
    if (story && story.id) {
      activeReaderStory = story;
      voiceoverPickStoryId = storyIdKey(story.id);
    } else if (activeReaderStory && activeReaderStory.id) {
      voiceoverPickStoryId = storyIdKey(activeReaderStory.id);
    } else {
      voiceoverPickStoryId = "";
    }
    voicesPickMode = true;
    var modal = document.getElementById("dash-voice-pick");
    var body = document.getElementById("dash-voice-pick-body");
    var voices = document.getElementById("dash-voices");
    if (!modal || !body || !voices) {
      showPanel("voices");
      return;
    }
    body.appendChild(voices);
    paintVoicesTitle();
    paintVoices();
    modal.hidden = false;
    refreshVoices();
  }

  function resolveVoiceoverStory() {
    var id = storyIdKey(voiceoverPickStoryId || (activeReaderStory && activeReaderStory.id) || "");
    if (!id) return null;
    if (activeReaderStory && storyIdKey(activeReaderStory.id) === id) return activeReaderStory;
    return (
      readStories().find(function (item) {
        return storyIdKey(item.id) === id;
      }) || null
    );
  }

  function storyVoiceoverUrl(story) {
    if (!story) return "";
    var id = storyIdKey(story.id);
    var fromStory = String(story.voiceoverUrl || "").trim();
    var cached = id && voiceoverUrlByStoryId[id] ? String(voiceoverUrlByStoryId[id]) : "";
    return preferVoiceoverUrl(fromStory, cached);
  }

  function patchStoryVoiceover(storyId, voiceoverUrl) {
    var id = storyIdKey(storyId);
    if (!id) return;
    var url = String(voiceoverUrl || "").trim();
    if (url) voiceoverUrlByStoryId[id] = url;
    else delete voiceoverUrlByStoryId[id];
    cloudStoriesCache = cloudStoriesCache.map(function (story) {
      if (storyIdKey(story.id) !== id) return story;
      return Object.assign({}, story, { voice: !!url, voiceoverUrl: url });
    });
    var locals = readLocalStories().map(function (story) {
      if (storyIdKey(story.id) !== id) return story;
      return Object.assign({}, story, { voice: !!url, voiceoverUrl: url });
    });
    var foundLocal = locals.some(function (story) {
      return storyIdKey(story.id) === id;
    });
    if (!foundLocal) {
      var fromCloud = cloudStoriesCache.find(function (story) {
        return storyIdKey(story.id) === id;
      });
      if (fromCloud) locals.unshift(Object.assign({}, fromCloud, { voice: !!url, voiceoverUrl: url }));
    }
    writeStories(locals);
    if (activeReaderStory && storyIdKey(activeReaderStory.id) === id) {
      activeReaderStory = Object.assign({}, activeReaderStory, {
        voice: !!url,
        voiceoverUrl: url,
      });
    }
    // Persist only durable URLs; blob: links die with the tab.
    if (isDurableVoiceoverUrl(url)) {
      var patched = readStories().find(function (story) {
        return storyIdKey(story.id) === id;
      });
      if (patched) void upsertCloudStory(patched);
    }
    syncReaderVoiceButton();
  }

  function uploadStoryVoiceover(storyId, blob) {
    var id = storyIdKey(storyId);
    var s = session();
    var base = supabaseUrl();
    var userId = sessionUserId();
    if (!id || !blob || !s || !s.access_token || !base || !userId) {
      return Promise.reject(new Error("Cannot save voiceover."));
    }
    var path = userId + "/" + id + ".wav";
    var endpoint = base + "/storage/v1/object/story-audio/" + path;
    function putOnce() {
      return fetch(endpoint + "?upsert=true", {
        method: "POST",
        headers: {
          apikey: anonKey(),
          Authorization: "Bearer " + s.access_token,
          "Content-Type": "audio/wav",
          "x-upsert": "true",
        },
        body: blob,
      }).then(function (res) {
        if (res.ok || res.status === 200) return true;
        return res.text().then(function (raw) {
          throw new Error(raw || "Voiceover upload failed (" + res.status + ")");
        });
      });
    }
    return putOnce()
      .catch(function () {
        return putOnce();
      })
      .then(function () {
        return base + "/storage/v1/object/public/story-audio/" + path;
      });
  }

  function setVoiceoverBar(state) {
    var bar = document.getElementById("dash-voiceover-bar");
    if (!bar) return;
    state = state || {};
    if (state.hidden) {
      bar.hidden = true;
      bar.classList.remove("is-ready");
      return;
    }
    var pack = ui();
    var en = COPY.en;
    var pct = Math.max(0, Math.min(100, Math.round(Number(state.percent) || 0)));
    var title = document.getElementById("dash-voiceover-bar-title");
    var pctEl = document.getElementById("dash-voiceover-bar-pct");
    var fill = document.getElementById("dash-voiceover-bar-fill");
    bar.hidden = false;
    if (state.ready) {
      bar.classList.add("is-ready");
      if (title) title.textContent = pack.voiceoverReady || en.voiceoverReady || "Voiceover is ready";
      if (pctEl) pctEl.textContent = "100%";
      if (fill) fill.style.width = "100%";
      return;
    }
    bar.classList.remove("is-ready");
    if (title) {
      title.textContent = pack.voiceoverGenerating || en.voiceoverGenerating || "Generating voiceover…";
    }
    var stay = document.getElementById("dash-voiceover-bar-stay");
    if (stay) {
      stay.textContent =
        pack.stayInBrowser ||
        en.stayInBrowser ||
        "Please keep this page open — don’t leave the browser.";
    }
    if (pctEl) pctEl.textContent = pct + "%";
    if (fill) fill.style.width = pct + "%";
  }

  function readerVoiceIcon(kind) {
    if (kind === "pause") {
      return '<svg class="dash-reader-voice-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
    }
    if (kind === "play") {
      return '<svg class="dash-reader-voice-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
    }
    return '<svg class="dash-reader-voice-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"/></svg>';
  }

  function readerPlayerPlayIcon(playing) {
    if (playing) {
      return '<svg class="dash-reader-player-play-ico" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
    }
    return '<svg class="dash-reader-player-play-ico" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
  }

  function applyVoiceoverPlaybackRate() {
    if (!voiceoverAudio) return;
    try {
      voiceoverAudio.playbackRate = voiceoverPlaybackRate;
    } catch (e) {}
  }

  function syncReaderPlayerUi() {
    var cta = document.getElementById("dash-reader-voice");
    var player = document.getElementById("dash-reader-player");
    var scroll = document.querySelector("#dash-reader .dash-reader-scroll");
    var story = activeReaderStory;
    var audioUrl = storyVoiceoverUrl(story);
    var hasAudio = !!audioUrl;
    var generating = voiceoverProgressPercent != null;
    var showPlayer = !!(hasAudio && !generating);
    if (cta) cta.hidden = showPlayer;
    if (player) player.hidden = !showPlayer;
    if (scroll) scroll.classList.toggle("has-player", showPlayer);
    if (!showPlayer) return;

    var playing = !!(voiceoverAudio && !voiceoverAudio.paused);
    var playBtn = document.getElementById("dash-reader-play");
    if (playBtn) {
      playBtn.classList.toggle("is-playing", playing);
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
      var ico = playBtn.querySelector(".dash-reader-player-play-ico") || playBtn.querySelector("svg");
      if (ico) {
        var wrap = document.createElement("span");
        wrap.innerHTML = readerPlayerPlayIcon(playing);
        var next = wrap.firstChild;
        if (next) ico.replaceWith(next);
      }
    }

    var duration = voiceoverAudio && Number.isFinite(voiceoverAudio.duration) ? voiceoverAudio.duration : 0;
    var current = voiceoverAudio ? voiceoverAudio.currentTime || 0 : 0;
    var curEl = document.getElementById("dash-reader-time-cur");
    var durEl = document.getElementById("dash-reader-time-dur");
    if (curEl) curEl.textContent = formatPlayerTime(current);
    if (durEl) durEl.textContent = formatPlayerTime(duration);
    var scrub = document.getElementById("dash-reader-scrub");
    if (scrub && !voiceoverScrubbing) {
      scrub.value = String(duration > 0 ? Math.round((current / duration) * 1000) : 0);
    }

    var speedLabel = formatPlaybackRateLabel(voiceoverPlaybackRate);
    var speedBtnLabel = document.getElementById("dash-reader-speed-label");
    var speedValue = document.getElementById("dash-reader-speed-value");
    var speedSlider = document.getElementById("dash-reader-speed-slider");
    if (speedBtnLabel) speedBtnLabel.textContent = speedLabel;
    if (speedValue) speedValue.textContent = speedLabel;
    if (speedSlider) speedSlider.value = String(playbackRateToSliderIndex(voiceoverPlaybackRate));
  }

  function syncReaderVoiceButton() {
    var btn = document.getElementById("dash-reader-voice");
    var label = document.getElementById("dash-reader-voice-label");
    var note = document.getElementById("dash-reader-note");
    var pack = ui();
    var en = COPY.en;
    var story = activeReaderStory;
    var audioUrl = storyVoiceoverUrl(story);
    var hasAudio = !!audioUrl;
    if (story && hasAudio && story.voiceoverUrl !== audioUrl) {
      activeReaderStory = Object.assign({}, story, { voice: true, voiceoverUrl: audioUrl });
      story = activeReaderStory;
    }
    var generating = voiceoverProgressPercent != null;
    var playing = !!(hasAudio && voiceoverAudio && !voiceoverAudio.paused);
    var iconKind = "mic";
    if (label) {
      if (generating) {
        var template =
          pack.voiceoverGeneratingPct ||
          en.voiceoverGeneratingPct ||
          "Generating voiceover… {percent}%";
        label.textContent = String(template).replace(
          "{percent}",
          String(voiceoverProgressPercent || 0)
        );
      } else if (playing) {
        label.textContent = pack.pauseVoiceover || en.pauseVoiceover || "Pause";
        iconKind = "pause";
      } else if (hasAudio) {
        label.textContent = pack.playVoiceover || en.playVoiceover || pack.playVoiceSample || "Play";
        iconKind = "play";
      } else {
        label.textContent = pack.tellWithYourVoice || en.tellWithYourVoice || "Tell with voice";
      }
    }
    if (btn) {
      var ico = btn.querySelector(".dash-reader-voice-ico") || btn.querySelector("svg");
      if (ico) {
        var wrap = document.createElement("span");
        wrap.innerHTML = readerVoiceIcon(iconKind);
        var next = wrap.firstChild;
        if (next) ico.replaceWith(next);
      }
      btn.classList.toggle("is-playing", playing);
      btn.classList.toggle("is-busy", !!generating);
      btn.disabled = !!generating;
      btn.setAttribute("aria-busy", generating ? "true" : "false");
    }
    if (note) {
      if (generating) {
        note.hidden = true;
      } else if (hasAudio) {
        note.hidden = false;
        note.textContent = pack.voiceoverReady || en.voiceoverReady || "Voiceover is ready";
      } else {
        note.hidden = !!(story && story.voice);
        note.textContent = story && story.voice ? t().voiceNote : "";
      }
    }
    syncReaderPlayerUi();
    if (generating) {
      setVoiceoverBar({ percent: voiceoverProgressPercent || 0 });
    } else if (!hasAudio) {
      setVoiceoverBar({ hidden: true });
    }
  }

  function ensureVoiceoverAudio(audioUrl) {
    if (!audioUrl) return null;
    if (voiceoverAudio && voiceoverAudio.getAttribute("data-src") === audioUrl) {
      applyVoiceoverPlaybackRate();
      return voiceoverAudio;
    }
    if (voiceoverAudio) {
      try {
        voiceoverAudio.pause();
      } catch (e) {}
    }
    voiceoverAudio = new Audio(audioUrl);
    voiceoverAudio.setAttribute("data-src", audioUrl);
    voiceoverAudio.preload = "metadata";
    applyVoiceoverPlaybackRate();
    voiceoverAudio.addEventListener("ended", function () {
      syncReaderVoiceButton();
    });
    voiceoverAudio.addEventListener("pause", function () {
      syncReaderVoiceButton();
    });
    voiceoverAudio.addEventListener("play", function () {
      syncReaderVoiceButton();
    });
    voiceoverAudio.addEventListener("timeupdate", function () {
      syncReaderPlayerUi();
    });
    voiceoverAudio.addEventListener("loadedmetadata", function () {
      applyVoiceoverPlaybackRate();
      syncReaderPlayerUi();
    });
    return voiceoverAudio;
  }

  function stopStoryVoiceoverPlayback() {
    if (voiceoverAudio) {
      try {
        voiceoverAudio.pause();
      } catch (e) {}
    }
    closeSpeedModal();
    syncReaderVoiceButton();
  }

  function seekVoiceoverBy(deltaSeconds) {
    var audio = voiceoverAudio;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    var resume = !audio.paused;
    var next = Math.max(0, Math.min(audio.duration, (audio.currentTime || 0) + deltaSeconds));
    try {
      audio.currentTime = next;
    } catch (e) {}
    syncReaderPlayerUi();
    if (resume) audio.play().catch(function () {});
  }

  function seekVoiceoverToRatio(ratio) {
    var audio = voiceoverAudio;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    var next = Math.max(0, Math.min(1, Number(ratio) || 0)) * audio.duration;
    try {
      audio.currentTime = next;
    } catch (e) {}
    syncReaderPlayerUi();
  }

  function playStoryVoiceover() {
    var story = activeReaderStory;
    var audioUrl = storyVoiceoverUrl(story);
    if (!story || !audioUrl) return;
    if (story.voiceoverUrl !== audioUrl) {
      activeReaderStory = Object.assign({}, story, { voice: true, voiceoverUrl: audioUrl });
      story = activeReaderStory;
    }
    var audio = ensureVoiceoverAudio(audioUrl);
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    audio.play().catch(function () {});
  }

  function openSpeedModal() {
    var modal = document.getElementById("dash-reader-speed-modal");
    var speedBtn = document.getElementById("dash-reader-speed");
    if (!modal) return;
    modal.hidden = false;
    if (speedBtn) speedBtn.classList.add("is-open");
    syncReaderPlayerUi();
  }

  function closeSpeedModal() {
    var modal = document.getElementById("dash-reader-speed-modal");
    var speedBtn = document.getElementById("dash-reader-speed");
    if (modal) modal.hidden = true;
    if (speedBtn) speedBtn.classList.remove("is-open");
  }

  function setVoiceoverPlaybackRate(rate) {
    saveVoiceoverPlaybackRate(rate);
    applyVoiceoverPlaybackRate();
    syncReaderPlayerUi();
  }

  function startStoryVoiceover(voiceId, languageCode) {
    var story = resolveVoiceoverStory();
    var pack = ui();
    var en = COPY.en;
    if (!story || !String(story.body || "").trim()) {
      window.alert(pack.useVoiceGoToStoriesBody || en.useVoiceGoToStoriesBody);
      showPanel("library");
      return Promise.resolve(false);
    }
    if (!window.NanikTts || typeof window.NanikTts.synthesizeStoryVoiceover !== "function") {
      window.alert(pack.voiceoverFailed || en.voiceoverFailed);
      return Promise.resolve(false);
    }
    var s = session();
    if (!s || !s.access_token) {
      window.alert(pack.voiceoverFailed || en.voiceoverFailed);
      return Promise.resolve(false);
    }
    if (voiceoverJob && voiceoverJob.abort) {
      try {
        voiceoverJob.abort();
      } catch (e) {}
    }
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    voiceoverJob = ctrl;
    voicesPickMode = false;
    voiceoverPickStoryId = storyIdKey(story.id);
    paintVoicesTitle();
    showPanel("library");
    openStory(story);
    if (voiceoverReadyTimer) {
      clearTimeout(voiceoverReadyTimer);
      voiceoverReadyTimer = 0;
    }
    setVoiceoverBar({ percent: 0 });
    voiceoverProgressPercent = 0;
    syncReaderVoiceButton();

    return window.NanikTts.synthesizeStoryVoiceover({
      text: story.body,
      voiceId: voiceId,
      languageCode: languageCode || uiLang() || "en",
      accessToken: s.access_token,
      anonKey: anonKey(),
      signal: ctrl ? ctrl.signal : undefined,
      onProgress: function (info) {
        voiceoverProgressPercent =
          info && info.percent != null ? info.percent : voiceoverProgressPercent || 0;
        setVoiceoverBar({ percent: voiceoverProgressPercent });
        syncReaderVoiceButton();
      },
    })
      .then(function (result) {
        voiceoverJob = null;
        if (!result || !result.url) throw new Error("empty voiceover");
        var previousUrl = story.voiceoverUrl;
        // Play immediately from the blob, then promote to a durable Storage URL.
        patchStoryVoiceover(story.id, result.url);
        voiceoverProgressPercent = null;
        setVoiceoverBar({ ready: true, percent: 100 });
        if (voiceoverReadyTimer) clearTimeout(voiceoverReadyTimer);
        voiceoverReadyTimer = setTimeout(function () {
          voiceoverReadyTimer = 0;
          setVoiceoverBar({ hidden: true });
        }, 1800);
        syncReaderVoiceButton();
        paintLibrary();
        if (result.blob) {
          uploadStoryVoiceover(story.id, result.blob)
            .then(function (publicUrl) {
              if (previousUrl && String(previousUrl).indexOf("blob:") === 0) {
                try {
                  URL.revokeObjectURL(previousUrl);
                } catch (e) {}
              }
              if (result.url && String(result.url).indexOf("blob:") === 0 && result.url !== previousUrl) {
                try {
                  URL.revokeObjectURL(result.url);
                } catch (e) {}
              }
              patchStoryVoiceover(story.id, publicUrl);
              paintLibrary();
            })
            .catch(function (err) {
              console.warn("[voiceover] upload failed; keeping session blob", err);
            });
        }
        return true;
      })
      .catch(function (err) {
        voiceoverJob = null;
        voiceoverProgressPercent = null;
        setVoiceoverBar({ hidden: true });
        console.warn("[voiceover]", err);
        syncReaderVoiceButton();
        window.alert((err && err.message) || pack.voiceoverFailed || en.voiceoverFailed);
        return false;
      });
  }

  function useVoiceForVoiceover(btn) {
    if (!btn) return;
    var cloneId = btn.getAttribute("data-use-clone") || "";
    var catalogId = btn.getAttribute("data-use") || "";
    var voiceId = "";
    var languageCode = uiLang();
    if (cloneId) {
      voiceId = cloneId;
    } else if (catalogId) {
      var sample = catalogVoicesCache.find(function (item) {
        return item.id === catalogId;
      });
      voiceId = sample && sample.ttsVoiceId ? sample.ttsVoiceId : "";
      if (sample && sample.languageCode) languageCode = sample.languageCode;
    }
    if (!voicesPickMode && !resolveVoiceoverStory()) {
      var body = ui().useVoiceGoToStoriesBody || COPY.en.useVoiceGoToStoriesBody;
      if (body) window.alert(body);
      showPanel("library");
      return;
    }
    if (!voiceId) {
      window.alert(ui().voiceoverFailed || COPY.en.voiceoverFailed);
      return;
    }
    startStoryVoiceover(voiceId, languageCode);
  }

  function clearAuthSession() {
    try {
      localStorage.removeItem("nanik-web-auth-session");
    } catch (e) {}
  }

  function signOutAccount() {
    var pack = ui();
    var en = COPY.en;
    var title = pack.logOutTitle || en.logOutTitle;
    var message = pack.logOutMessage || en.logOutMessage;
    if (!window.confirm(title + "\n\n" + message)) return;
    closeAccountSheet();
    stopVoicesAudio();
    stopReaderMusic(true);
    var s = session();
    var token = s && s.access_token;
    var base = supabaseUrl();
    var done =
      token && base
        ? fetch(base + "/auth/v1/logout", {
            method: "POST",
            headers: {
              apikey: anonKey(),
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }).catch(function () {})
        : Promise.resolve();
    done.finally(function () {
      clearAuthSession();
      userVoicesCache = [];
      cloudStoriesCache = [];
      catalogVoicesCache = [];
      clonePreviewCache = {};
      quotaState = {
        isPlus: false,
        storiesRemaining: FREEMIUM_LIFETIME_STORIES,
      };
      location.replace("/");
    });
  }

  function wireAccountChrome() {
    var avatar = document.getElementById("dash-avatar");
    var backdrop = document.getElementById("dash-account-backdrop");
    var capsule = document.getElementById("dash-stories-capsule");
    var kidsAdd = document.getElementById("dash-kids-add");
    var upgradeBtn = document.getElementById("dash-account-upgrade");
    var billingBtn = document.getElementById("dash-account-billing");
    var langBtn = document.getElementById("dash-account-lang");
    var logoutBtn = document.getElementById("dash-account-logout");
    var deleteBtn = document.getElementById("dash-account-delete");
    if (avatar) {
      avatar.addEventListener("click", function () {
        if (isAccountSheetOpen()) {
          closeAccountSheet();
          return;
        }
        var accountPanel = document.getElementById("panel-account");
        if (accountPanel && !accountPanel.hidden) leaveAccountPage();
        openAccountSheet();
      });
    }
    if (backdrop) backdrop.addEventListener("click", closeAccountSheet);
    var openPageBtn = document.getElementById("dash-account-open");
    if (openPageBtn) {
      openPageBtn.addEventListener("click", function () {
        openAccountPage();
      });
    }
    if (upgradeBtn) {
      upgradeBtn.addEventListener("click", function () {
        closeAccountSheet();
        openWebPaywall();
      });
    }
    function openSubscribedBilling() {
      if (!quotaState.isPlus) return;
      closeAccountSheet();
      if (window.NanikPayments && typeof window.NanikPayments.openPortal === "function") {
        window.NanikPayments.openPortal().catch(function (err) {
          console.warn("[billing portal]", err);
          window.alert((err && err.message) || "Could not open payment management.");
        });
      }
    }
    if (billingBtn) billingBtn.addEventListener("click", openSubscribedBilling);
    var billingPageBtn = document.getElementById("dash-account-billing-page");
    if (billingPageBtn) billingPageBtn.addEventListener("click", openSubscribedBilling);
    if (capsule) {
      capsule.addEventListener("click", function () {
        if (quotaState.isPlus) return;
        openWebPaywall();
      });
    }
    if (kidsAdd) kidsAdd.addEventListener("click", requestAddChildProfile);
    window.addEventListener("nanik:child-profile", function () {
      // While a flip card is open, only refresh chrome/summary — rebuilding the list
      // would remount the card and look like it closed on every field tap.
      if (editingChildId) {
        paintChildProfileSummary();
        paintKidsAddChrome();
        return;
      }
      paintChildProfile();
      paintKidsAddChrome();
    });
    window.addEventListener("nanik:quota", paintKidsAddChrome);
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        var list = document.getElementById("dash-account-langs");
        var open = !!(list && list.hidden);
        setLangExpanded(open);
      });
    }
    if (logoutBtn) {
      logoutBtn.addEventListener("click", signOutAccount);
    }
    if (deleteBtn) {
      deleteBtn.addEventListener("click", deleteAccount);
    }
    var deletePopup = document.getElementById("dash-delete-account-popup");
    var deleteCancel = document.getElementById("dash-delete-account-cancel");
    var deleteConfirm = document.getElementById("dash-delete-account-confirm");
    if (deletePopup) {
      deletePopup.addEventListener("click", function (e) {
        var closeEl = e.target && e.target.closest ? e.target.closest("[data-delete-account-close]") : null;
        if (closeEl) closeDeleteAccountPopup();
      });
    }
    if (deleteCancel) deleteCancel.addEventListener("click", closeDeleteAccountPopup);
    if (deleteConfirm) deleteConfirm.addEventListener("click", performDeleteAccount);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var popup = document.getElementById("dash-delete-account-popup");
      if (popup && !popup.hidden) {
        closeDeleteAccountPopup();
        return;
      }
      if (isAccountSheetOpen()) {
        closeAccountSheet();
        return;
      }
      var accountPanel = document.getElementById("panel-account");
      if (accountPanel && !accountPanel.hidden) leaveAccountPage();
    });
    window.addEventListener("resize", function () {
      if (isAccountSheetOpen()) positionAccountSheet();
    });
  }

  var FREEMIUM_LIFETIME_STORIES = 3;
  var PLUS_MONTHLY_STORIES = 60;
  var FREE_VOICE_CLONE_LIMIT = 1;
  var PLUS_VOICE_CLONE_LIMIT = 3;
  var quotaState = {
    isPlus: false,
    storiesRemaining: FREEMIUM_LIFETIME_STORIES,
  };
  var quotaSyncPromise = null;

  function starSvg(size) {
    return (
      '<svg viewBox="0 0 24 24" width="' +
      size +
      '" height="' +
      size +
      '" aria-hidden="true"><path fill="#FFE566" d="M12 2.6l2.4 6.9h7.2l-5.8 4.3 2.2 7-6-4.4-6 4.4 2.2-7-5.8-4.3h7.2z"/></svg>'
    );
  }

  function storiesLabel(n, isPlus) {
    var pack = ui();
    var en = COPY.en;
    if (n === 1) {
      return isPlus
        ? pack.includedStoryLeft || en.includedStoryLeft
        : pack.freeStoryLeft || en.freeStoryLeft;
    }
    var template = isPlus
      ? pack.includedStoriesLeft || en.includedStoriesLeft
      : pack.freeStoriesLeft || en.freeStoriesLeft;
    return String(template).replace("{n}", String(n));
  }

  function paintStoriesCapsule() {
    var btn = document.getElementById("dash-stories-capsule");
    var inner = document.getElementById("dash-stories-capsule-inner");
    if (!btn || !inner) return;
    var pack = ui();
    var en = COPY.en;
    var n = Math.max(0, Math.floor(quotaState.storiesRemaining));
    var label = storiesLabel(n, quotaState.isPlus);
    var getPlus = pack.getPlus || en.getPlus || "Get Plus";
    var leftLabel = n === 1 ? "1 left" : n + " left";
    btn.classList.toggle("is-plus", quotaState.isPlus);
    btn.classList.toggle("is-free", !quotaState.isPlus);
    btn.type = "button";
    if (quotaState.isPlus) {
      btn.setAttribute("aria-label", "Nanik Plus, " + label);
      inner.innerHTML =
        '<span class="dash-stories-plus-chip">Plus</span>' +
        '<span class="dash-stories-plus-left">' +
        escapeHtml(leftLabel) +
        "</span>";
    } else {
      btn.setAttribute("aria-label", label + ". " + getPlus);
      inner.innerHTML =
        '<span class="dash-stories-plus-left">' +
        escapeHtml(leftLabel) +
        "</span>" +
        '<span class="dash-stories-get-plus">' +
        '<svg class="dash-stories-get-plus-magic" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">' +
        '<path fill="#fff" d="M12 2.2l1.05 3.55L16.6 6.8l-3.55 1.05L12 11.4l-1.05-3.55L7.4 6.8l3.55-1.05L12 2.2zm7.2 6.1l.72 2.42 2.42.72-2.42.72-.72 2.42-.72-2.42-2.42-.72 2.42-.72.72-2.42zM6.2 12.4l.86 2.9 2.9.86-2.9.86-.86 2.9-.86-2.9-2.9-.86 2.9-.86.86-2.9zM14.6 14.1l1.2 4.05 4.05 1.2-4.05 1.2-1.2 4.05-1.2-4.05-4.05-1.2 4.05-1.2 1.2-4.05z"/>' +
        "</svg>" +
        "<span>" +
        escapeHtml(getPlus) +
        "</span>" +
        "</span>";
    }
    window.NANIK_QUOTA_STATE = {
      isPlus: quotaState.isPlus,
      storiesRemaining: Math.max(0, Math.floor(quotaState.storiesRemaining)),
    };
    window.dispatchEvent(new CustomEvent("nanik:quota", {
      detail: window.NANIK_QUOTA_STATE,
    }));
  }

  function applyQuotaPayload(raw) {
    if (!raw || typeof raw !== "object") return;
    var planCode = String(raw.planCode || "freemium");
    var hasActive = Boolean(raw.hasActiveSubscription);
    var forceFreemium = Boolean(raw.forceFreemium);
    var isPlus = !forceFreemium && planCode === "nanik_plus" && hasActive;
    var storiesRemaining;
    if (typeof raw.storiesRemaining === "number" && Number.isFinite(raw.storiesRemaining)) {
      storiesRemaining = Math.max(0, Math.floor(raw.storiesRemaining));
    } else if (isPlus) {
      if (typeof raw.monthlyStoriesRemaining === "number") {
        var monthly = Math.max(0, Math.floor(raw.monthlyStoriesRemaining));
        var topup =
          typeof raw.topupStoriesRemaining === "number"
            ? Math.max(0, Math.floor(raw.topupStoriesRemaining))
            : 0;
        storiesRemaining = monthly + topup;
      } else {
        storiesRemaining = PLUS_MONTHLY_STORIES;
      }
    } else if (typeof raw.freeStoriesRemaining === "number") {
      storiesRemaining = Math.max(0, Math.floor(raw.freeStoriesRemaining));
    } else if (typeof raw.lifetimeStoriesRemaining === "number") {
      storiesRemaining = Math.max(0, Math.floor(raw.lifetimeStoriesRemaining));
    } else {
      storiesRemaining = FREEMIUM_LIFETIME_STORIES;
    }
    quotaState = { isPlus: isPlus, storiesRemaining: storiesRemaining };
    paintStoriesCapsule();
    paintAccountProfile();
  }

  function refreshQuotaStatus() {
    var s = session();
    var base = supabaseUrl();
    if (!s || !s.access_token || !base) {
      paintStoriesCapsule();
      paintAccountProfile();
      return Promise.resolve(quotaState);
    }
    if (quotaSyncPromise) return quotaSyncPromise;
    // Keep headers CORS-simple: no Prefer / Content-Type on GET
    // (those trigger a preflight that Edge corsHeaders reject).
    quotaSyncPromise = fetch(base + "/functions/v1/quota-status", {
      method: "GET",
      headers: {
        apikey: anonKey(),
        Authorization: "Bearer " + s.access_token,
      },
    })
      .then(function (res) {
        if (!res.ok) throw new Error("quota " + res.status);
        return res.json();
      })
      .then(function (data) {
        applyQuotaPayload(data);
        return quotaState;
      })
      .catch(function (err) {
        console.warn("[quota] fetch failed", err);
        paintStoriesCapsule();
        paintAccountProfile();
        return quotaState;
      })
      .finally(function () {
        quotaSyncPromise = null;
      });
    return quotaSyncPromise;
  }

  window.addEventListener("nanik:checkout-complete", function () {
    var sync = window.NanikPayments && window.NanikPayments.syncSubscription;
    var run = sync ? sync() : Promise.resolve(null);
    run.finally(function () {
      window.setTimeout(function () { void refreshQuotaStatus(); }, 400);
    });
  });

  function supportTags() {
    return t().tags;
  }

  function api() {
    return window.NANIK_API || {};
  }
  function supabaseUrl() {
    return String(api().supabaseUrl || "").replace(/\/$/, "");
  }
  function anonKey() {
    return api().supabaseAnonKey || "";
  }
  function draft() {
    return window.NANIK_DRAFT || {};
  }
  function session() {
    return draft().readSession ? draft().readSession() : null;
  }
  function authHeaders() {
    var s = session();
    var token = (s && s.access_token) || anonKey();
    return {
      apikey: anonKey(),
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
  }

  /** Same Supabase `user_stories` table as the iOS app — signed-in library sync. */
  var cloudStoriesCache = [];
  var cloudSyncPromise = null;

  function storyIdKey(id) {
    return String(id == null ? "" : id);
  }

  function jwtPayload(token) {
    try {
      var part = String(token || "").split(".")[1] || "";
      part = part.replace(/-/g, "+").replace(/_/g, "/");
      while (part.length % 4) part += "=";
      return JSON.parse(atob(part));
    } catch (e) {
      return null;
    }
  }

  function jwtUserId(token) {
    var payload = jwtPayload(token);
    return payload && payload.sub ? String(payload.sub) : null;
  }

  function getAccountIdentity() {
    var pack = ui();
    var en = COPY.en;
    var s = session();
    var token = s && s.access_token;
    var user = (s && s.user) || null;
    var payload = token ? jwtPayload(token) : null;
    var userMeta = {};
    if (user && user.user_metadata && typeof user.user_metadata === "object") {
      userMeta = user.user_metadata;
    } else if (payload && payload.user_metadata && typeof payload.user_metadata === "object") {
      userMeta = payload.user_metadata;
    }
    var email =
      (user && user.email) ||
      (payload && payload.email) ||
      userMeta.email ||
      null;
    if (email) email = String(email).trim() || null;
    var given = String(userMeta.given_name || "").trim();
    var family = String(userMeta.family_name || "").trim();
    var fullName = [given, family].filter(Boolean).join(" ").trim();
    var isAnonymous = Boolean(
      (user && user.is_anonymous) || (payload && payload.is_anonymous === true)
    );
    var displayName = isAnonymous
      ? pack.guestAccount || en.guestAccount || "Guest"
      : String(
          userMeta.full_name ||
            userMeta.name ||
            fullName ||
            email ||
            pack.accountTitle ||
            en.accountTitle ||
            "Account"
        ).trim();
    var avatarUrl = null;
    ["avatar_url", "picture"].forEach(function (key) {
      if (avatarUrl) return;
      var raw = String(userMeta[key] || "").trim();
      if (/^https?:\/\//i.test(raw)) avatarUrl = raw;
    });
    return {
      userId: (user && user.id) || (payload && payload.sub) || null,
      email: email,
      displayName: displayName,
      avatarUrl: avatarUrl,
      isAnonymous: isAnonymous,
    };
  }

  function getPlaceholderAvatarUrl(seed) {
    var files = [
      "images/avatars/avatar-fish.png",
      "images/avatars/avatar-rabbit.png",
      "images/avatars/avatar-bird.png",
      "images/avatars/avatar-dog.png",
      "images/avatars/avatar-cat.png",
    ];
    if (!seed) return files[0];
    var hash = 0;
    var text = String(seed);
    for (var i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return files[Math.abs(hash) % files.length];
  }

  function resolveAccountAvatarUrl(identity) {
    if (identity && identity.avatarUrl) return identity.avatarUrl;
    return getPlaceholderAvatarUrl((identity && identity.userId) || "guest");
  }

  function paintAccountProfile() {
    var nameEl = document.getElementById("dash-account-profile-name");
    var emailEl = document.getElementById("dash-account-profile-email");
    var badgeEl = document.getElementById("dash-account-plan-badge");
    var upgradeBtn = document.getElementById("dash-account-upgrade");
    var avatarEl = document.getElementById("dash-account-profile-avatar");
    var headerBtn = document.getElementById("dash-avatar");
    var headerImg = document.getElementById("dash-avatar-img");
    var emailValue = document.getElementById("dash-account-detail-email-value");
    var emailRow = document.getElementById("dash-account-detail-email-row");
    var pack = ui();
    var en = COPY.en;
    var identity = getAccountIdentity();
    var avatarSrc = resolveAccountAvatarUrl(identity);
    var planLabel = quotaState.isPlus
      ? pack.accountPlanPlus || en.accountPlanPlus || "Plus"
      : pack.accountPlanFree || en.accountPlanFree || "Freemium";
    if (nameEl) nameEl.textContent = identity.displayName;
    if (emailEl) {
      emailEl.textContent =
        identity.email ||
        pack.profileSubFallback ||
        en.profileSubFallback ||
        "";
    }
    if (emailValue) emailValue.textContent = identity.email || "—";
    if (emailRow) emailRow.hidden = false;
    if (badgeEl) {
      badgeEl.hidden = false;
      badgeEl.textContent = planLabel;
      badgeEl.classList.toggle("is-plus", !!quotaState.isPlus);
      badgeEl.classList.toggle("is-freemium", !quotaState.isPlus);
    }
    if (upgradeBtn) {
      upgradeBtn.hidden = !!quotaState.isPlus;
      upgradeBtn.textContent = pack.upgrade || en.upgrade || "Upgrade";
    }
    var showBilling = !!quotaState.isPlus;
    var billingSection = document.getElementById("dash-account-billing-section");
    var billingPageBtn = document.getElementById("dash-account-billing-page");
    var billingSheetBtn = document.getElementById("dash-account-billing");
    if (billingSheetBtn) billingSheetBtn.hidden = !showBilling;
    if (billingSection) billingSection.hidden = !showBilling;
    if (billingPageBtn) billingPageBtn.hidden = !showBilling;
    if (avatarEl) {
      avatarEl.classList.toggle("is-plus", !!quotaState.isPlus);
      avatarEl.classList.remove("is-empty");
      avatarEl.style.backgroundImage = 'url("' + String(avatarSrc).replace(/"/g, "") + '")';
    }
    if (headerBtn && headerImg) {
      headerImg.hidden = false;
      headerImg.src = avatarSrc;
      headerBtn.classList.add("has-image");
      headerBtn.classList.toggle("is-plus", !!quotaState.isPlus);
    }
  }

  function wipeLocalAccountData() {
    clearAuthSession();
    try {
      localStorage.removeItem(STORIES_KEY);
    } catch (e) {}
    var d = draft();
    if (d.setChild) d.setChild(null);
    if (d.setPrompt) d.setPrompt("");
    if (d.setImage) d.setImage("");
    userVoicesCache = [];
    cloudStoriesCache = [];
    catalogVoicesCache = [];
    clonePreviewCache = {};
    quotaState = {
      isPlus: false,
      storiesRemaining: FREEMIUM_LIFETIME_STORIES,
    };
  }

  function paintDeleteAccountPopup() {
    var pack = ui();
    var en = COPY.en;
    var title = document.getElementById("dash-delete-account-title");
    var message = document.getElementById("dash-delete-account-message");
    var cancel = document.getElementById("dash-delete-account-cancel");
    var confirm = document.getElementById("dash-delete-account-confirm");
    if (title) {
      title.textContent =
        pack.deleteAccountTitle ||
        en.deleteAccountTitle ||
        "You’re about to delete your stories";
    }
    if (message) {
      message.textContent =
        pack.deleteAccountMessage ||
        en.deleteAccountMessage ||
        "This permanently deletes your Nanik account, stories, and associated data.";
    }
    if (cancel) {
      cancel.textContent = pack.deleteAccountCancel || en.deleteAccountCancel || "Cancel";
    }
    if (confirm) {
      confirm.textContent =
        pack.deleteAccountConfirm || en.deleteAccountConfirm || pack.deleteAccount || "Delete account";
    }
  }

  function closeDeleteAccountPopup() {
    var popup = document.getElementById("dash-delete-account-popup");
    if (popup) popup.hidden = true;
  }

  function openDeleteAccountPopup() {
    paintDeleteAccountPopup();
    var popup = document.getElementById("dash-delete-account-popup");
    if (popup) popup.hidden = false;
  }

  function performDeleteAccount() {
    var pack = ui();
    var en = COPY.en;
    var s = session();
    var token = s && s.access_token;
    var base = supabaseUrl();
    if (!token || !base) {
      wipeLocalAccountData();
      location.replace("/");
      return;
    }
    var deleteBtn = document.getElementById("dash-account-delete");
    var confirmBtn = document.getElementById("dash-delete-account-confirm");
    var cancelBtn = document.getElementById("dash-delete-account-cancel");
    [deleteBtn, confirmBtn, cancelBtn].forEach(function (btn) {
      if (!btn) return;
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
    });
    fetch(base + "/functions/v1/delete-account", {
      method: "POST",
      headers: {
        apikey: anonKey(),
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: "{}",
    })
      .then(function (res) {
        return res.json().catch(function () {
          return {};
        }).then(function (data) {
          if (!res.ok || (data && data.error)) {
            throw new Error(
              (data && data.error) ||
                pack.deleteAccountFailed ||
                en.deleteAccountFailed ||
                "Could not delete your account."
            );
          }
        });
      })
      .then(function () {
        closeDeleteAccountPopup();
        closeAccountSheet();
        stopVoicesAudio();
        stopReaderMusic(true);
        wipeLocalAccountData();
        location.replace("/");
      })
      .catch(function (err) {
        console.warn("[delete-account]", err);
        window.alert(
          (err && err.message) ||
            pack.deleteAccountFailed ||
            en.deleteAccountFailed ||
            "Could not delete your account."
        );
      })
      .finally(function () {
        [deleteBtn, confirmBtn, cancelBtn].forEach(function (btn) {
          if (!btn) return;
          btn.disabled = false;
          btn.removeAttribute("aria-busy");
        });
      });
  }

  function deleteAccount() {
    openDeleteAccountPopup();
  }

  function sessionUserId() {
    var s = session();
    if (s && s.user && s.user.id) return String(s.user.id);
    return s && s.access_token ? jwtUserId(s.access_token) : null;
  }

  /** Same Supabase `children` table — signed-in kids profiles sync across accounts/devices. */
  var cloudChildrenSyncPromise = null;

  function likesToInterests(likes) {
    return String(likes || "")
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean)
      .slice(0, 24);
  }

  function interestsToLikes(interests) {
    if (!Array.isArray(interests)) return "";
    return interests
      .map(function (item) {
        return String(item || "").trim();
      })
      .filter(Boolean)
      .join(", ");
  }

  function mapCloudChildRow(row) {
    if (!row || typeof row !== "object") return null;
    var age = parseInt(row.age, 10);
    if (!(age >= 2 && age <= 16)) return null;
    var gender = String(row.gender || "").trim().toLowerCase();
    if (gender !== "girl" && gender !== "boy") gender = "unspecified";
    return {
      id: String(row.id || "").trim(),
      name: String(row.name || "").trim().slice(0, 40),
      age: age,
      gender: gender,
      likes: interestsToLikes(row.interests),
      photo: "",
    };
  }

  function fetchCloudChildren() {
    var s = session();
    var base = supabaseUrl();
    if (!s || !s.access_token || !base) return Promise.resolve([]);
    return fetch(
      base +
        "/rest/v1/children?select=id,name,age,gender,interests,created_at&order=created_at.asc",
      { headers: authHeaders() }
    )
      .then(function (res) {
        if (!res.ok) throw new Error("cloud children " + res.status);
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows)) return [];
        return rows.map(mapCloudChildRow).filter(Boolean);
      })
      .catch(function (err) {
        console.warn("[kids] cloud fetch failed", err);
        return [];
      });
  }

  function upsertCloudChild(kid) {
    var s = session();
    var base = supabaseUrl();
    var userId = sessionUserId();
    if (!s || !s.access_token || !base || !userId || !kid || !kid.id) {
      return Promise.resolve();
    }
    var age = parseInt(kid.age, 10);
    if (!(age >= 2 && age <= 16)) return Promise.resolve();
    var gender = String(kid.gender || "").trim().toLowerCase();
    if (gender !== "girl" && gender !== "boy") gender = "unspecified";
    var name = String(kid.name || "").trim().slice(0, 40) || "Child";
    return fetch(base + "/rest/v1/children?on_conflict=id", {
      method: "POST",
      headers: Object.assign({}, authHeaders(), {
        Prefer: "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify([
        {
          id: String(kid.id),
          user_id: userId,
          name: name,
          age: age,
          gender: gender,
          interests: likesToInterests(kid.likes),
        },
      ]),
    })
      .then(function (res) {
        if (!res.ok) console.warn("[kids] cloud upsert failed", res.status);
      })
      .catch(function (err) {
        console.warn("[kids] cloud upsert failed", err);
      });
  }

  function deleteCloudChild(id) {
    var s = session();
    var base = supabaseUrl();
    var kidId = String(id || "").trim();
    if (!s || !s.access_token || !base || !kidId) return Promise.resolve();
    return fetch(
      base + "/rest/v1/children?id=eq." + encodeURIComponent(kidId),
      {
        method: "DELETE",
        headers: Object.assign({}, authHeaders(), { Prefer: "return=minimal" }),
      }
    )
      .then(function (res) {
        if (!res.ok) console.warn("[kids] cloud delete failed", res.status);
      })
      .catch(function (err) {
        console.warn("[kids] cloud delete failed", err);
      });
  }

  function refreshCloudChildren() {
    if (cloudChildrenSyncPromise) return cloudChildrenSyncPromise;
    var d = draft();
    if (!sessionUserId()) return Promise.resolve([]);
    cloudChildrenSyncPromise = fetchCloudChildren()
      .then(function (cloudKids) {
        var localKids = typeof d.getChildren === "function" ? d.getChildren() || [] : [];
        var cloudIds = {};
        cloudKids.forEach(function (kid) {
          cloudIds[kid.id] = true;
        });
        // First sign-in on this browser: push any local-only kids up, then re-pull.
        var localOnly = localKids.filter(function (kid) {
          return kid && kid.id && !cloudIds[kid.id];
        });
        var uploads = localOnly.map(function (kid) {
          return upsertCloudChild(kid);
        });
        return Promise.all(uploads).then(function () {
          if (!uploads.length) return cloudKids;
          return fetchCloudChildren();
        });
      })
      .then(function (kids) {
        var active = typeof d.getChild === "function" ? d.getChild() : null;
        if (typeof d.replaceChildren === "function") {
          d.replaceChildren(kids, active && active.id);
        } else {
          kids.forEach(function (kid) {
            if (d.setChild) d.setChild(kid);
          });
        }
        paintKidsPage();
        paintChildProfileSummary();
        return kids;
      })
      .finally(function () {
        cloudChildrenSyncPromise = null;
      });
    return cloudChildrenSyncPromise;
  }

  function wrapChildDraftCloudSync() {
    var d = window.NANIK_DRAFT;
    if (!d || d.__cloudKidsWrapped) return;
    var origSet = d.setChild;
    var origRemove = d.removeChild;
    var origGet = d.getChildren;
    if (typeof origSet === "function") {
      d.setChild = function (profile) {
        var previous = typeof origGet === "function" ? origGet() || [] : [];
        var result = origSet(profile);
        if (!profile) {
          previous.forEach(function (kid) {
            if (kid && kid.id) void deleteCloudChild(kid.id);
          });
          return result;
        }
        if (result) void upsertCloudChild(result);
        return result;
      };
    }
    if (typeof origRemove === "function") {
      d.removeChild = function (id) {
        var result = origRemove(id);
        if (id) void deleteCloudChild(id);
        return result;
      };
    }
    d.__cloudKidsWrapped = true;
  }

  function cleanLead(value) {
    var trimmed = String(value || "")
      .trim()
      .replace(/^a\s+|^an\s+|^the\s+/i, "");
    if (!trimmed) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  function storyHeroText(story) {
    if (!story) return "";
    if (story.hero && typeof story.hero === "object") {
      return cleanLead(story.hero.name || story.hero.visualDescription || "");
    }
    return cleanLead(story.heroName || story.hero || "");
  }

  function storySettingText(story) {
    return cleanLead((story && (story.setting || story.world)) || "");
  }

  function storyHelpsText(story) {
    return String((story && (story.helpsWith || story.support)) || "").trim();
  }

  function mapCloudRowToWeb(row) {
    var raw = row && row.story_payload;
    if (!raw || typeof raw !== "object") return null;
    var id = String(raw.id || row.story_id || "").trim();
    var title = String(raw.title || "").trim();
    var body = String(raw.bodyText || raw.body || "").trim();
    if (!id || !title || !body) return null;
    var cover = String(row.fal_cover_url || "").trim();
    if (!cover && Array.isArray(raw.illustrations) && raw.illustrations[0]) {
      cover = String(raw.illustrations[0].remoteUrl || raw.illustrations[0].url || "").trim();
    }
    var createdAt =
      (typeof raw.generatedAt === "string" && raw.generatedAt) ||
      row.generated_at ||
      new Date().toISOString();
    var heroName = "";
    if (raw.hero && typeof raw.hero === "object") {
      heroName = String(raw.hero.name || "").trim();
    } else if (typeof raw.heroName === "string") {
      heroName = raw.heroName.trim();
    } else if (typeof raw.childName === "string") {
      heroName = raw.childName.trim();
    }
    var mapped = {
      id: id,
      title: title,
      body: body,
      cover: /^https?:\/\//i.test(cover) ? cover : "",
      voice: Boolean(raw.hasVoiceover || raw.voiceoverUrl || raw.audioUrl),
      voiceoverUrl: String(raw.voiceoverUrl || raw.audioUrl || "").trim(),
      heroName: heroName,
      setting: String(raw.setting || raw.settingHint || "").trim(),
      helpsWith: String(raw.helpsWith || raw.therapeuticMechanism || "").trim(),
      createdAt: createdAt,
      fromCloud: true,
    };
    return isLibraryReadyStory(mapped) ? mapped : null;
  }

  function fetchCloudStories() {
    var s = session();
    var base = supabaseUrl();
    if (!s || !s.access_token || !base) return Promise.resolve([]);
    return fetch(
      base +
        "/rest/v1/user_stories?select=story_id,story_payload,fal_cover_url,generated_at,updated_at&order=generated_at.desc&limit=100",
      { headers: authHeaders() }
    )
      .then(function (res) {
        if (!res.ok) throw new Error("cloud stories " + res.status);
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows)) return [];
        return rows.map(mapCloudRowToWeb).filter(Boolean);
      })
      .catch(function (err) {
        console.warn("[library] cloud fetch failed", err);
        return [];
      });
  }

  function upsertCloudStory(story) {
    var s = session();
    var base = supabaseUrl();
    var userId = sessionUserId();
    if (!s || !s.access_token || !base || !userId || !story) return Promise.resolve();
    var id = storyIdKey(story.id);
    var cover = String(story.cover || "").trim();
    var falCover = /^https?:\/\//i.test(cover) ? cover : null;
    var generatedAt = story.createdAt || new Date().toISOString();
    var heroName = storyHeroText(story);
    var payload = {
      id: id,
      title: story.title || "Untitled story",
      bodyText: story.body || "",
      generatedAt: generatedAt,
      ownerUserId: userId,
      hero: heroName ? { name: heroName } : undefined,
      setting: storySettingText(story) || undefined,
      helpsWith: storyHelpsText(story) || undefined,
      hasVoiceover: !!(story.voice || storyVoiceoverUrl(story)),
      voiceoverUrl: isDurableVoiceoverUrl(storyVoiceoverUrl(story))
        ? storyVoiceoverUrl(story)
        : undefined,
      illustrations: falCover
        ? [
            {
              id: id + "_cover",
              prompt: "",
              url: falCover,
              remoteUrl: falCover,
              scene: "opening",
            },
          ]
        : [],
      isGenerating: false,
      isTextGenerating: false,
      isIllustrationGenerating: false,
    };
    return fetch(base + "/rest/v1/user_stories?on_conflict=user_id,story_id", {
      method: "POST",
      headers: Object.assign({}, authHeaders(), {
        Prefer: "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify([
        {
          user_id: userId,
          story_id: id,
          story_payload: payload,
          fal_cover_url: falCover,
          generated_at: generatedAt,
          updated_at: new Date().toISOString(),
        },
      ]),
    })
      .then(function (res) {
        if (!res.ok) console.warn("[library] cloud upsert failed", res.status);
      })
      .catch(function (err) {
        console.warn("[library] cloud upsert failed", err);
      });
  }

  /**
   * Unfinished stories must not appear in Library. Length is not judged here: the
   * server owns quality and now saves a short story with a quality flag rather than
   * failing, so filtering on word count would hide a story the user was told is ready.
   */
  function isLibraryReadyStory(story) {
    if (!story) return false;
    return !!String(story.title || "").trim() && !!String(story.body || "").trim();
  }

  function readLocalStories() {
    try {
      var raw = localStorage.getItem(STORIES_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter(isLibraryReadyStory) : [];
    } catch (e) {
      return [];
    }
  }

  function readStories() {
    var byId = {};
    cloudStoriesCache.forEach(function (story) {
      if (!isLibraryReadyStory(story)) return;
      byId[storyIdKey(story.id)] = story;
    });
    readLocalStories().forEach(function (story) {
      var key = storyIdKey(story.id);
      if (!byId[key]) {
        byId[key] = story;
        return;
      }
      // Cloud wins for text/cover. Prefer a durable https voiceover over blob/empty.
      var localUrl = String(story.voiceoverUrl || "").trim();
      var cloudUrl = String(byId[key].voiceoverUrl || "").trim();
      var bestUrl = preferVoiceoverUrl(localUrl, cloudUrl);
      if (bestUrl && bestUrl !== cloudUrl) {
        byId[key] = Object.assign({}, byId[key], {
          voice: true,
          voiceoverUrl: bestUrl,
        });
      } else if (story.voice && !byId[key].voice) {
        byId[key] = Object.assign({}, byId[key], { voice: true });
      }
    });
    return Object.keys(byId)
      .map(function (k) {
        var story = byId[k];
        var cached = voiceoverUrlByStoryId[k];
        var best = preferVoiceoverUrl(story.voiceoverUrl, cached);
        if (best && best !== String(story.voiceoverUrl || "").trim()) {
          return Object.assign({}, story, { voice: true, voiceoverUrl: best });
        }
        if (cached && !String(story.voiceoverUrl || "").trim()) {
          return Object.assign({}, story, { voice: true, voiceoverUrl: cached });
        }
        return story;
      })
      .sort(function (a, b) {
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      });
  }

  function writeStories(list) {
    try {
      var ready = (Array.isArray(list) ? list : []).filter(isLibraryReadyStory);
      localStorage.setItem(STORIES_KEY, JSON.stringify(ready.slice(0, 40)));
    } catch (e) {}
  }

  function refreshCloudLibrary() {
    if (cloudSyncPromise) return cloudSyncPromise;
    cloudSyncPromise = fetchCloudStories()
      .then(function (list) {
        cloudStoriesCache = list;
        paintLibrary();
        return list;
      })
      .finally(function () {
        cloudSyncPromise = null;
      });
    return cloudSyncPromise;
  }

  var catalogVoicesCache = [];
  var userVoicesCache = [];
  var voicesSyncPromise = null;
  var voicesAudio = null;
  var voicesPlayingId = null;
  var clonePreviewCache = {};
  var clonePreviewRequestId = 0;

  function voiceClonePreviewLine(languageCode) {
    var code = String(languageCode || "")
      .trim()
      .toLowerCase();
    if (code === "hy" || code.indexOf("hy-") === 0 || code === "hye" || code === "arm") {
      return "Ես քեզ կպատմեմ մի անուշ հեքիաթ";
    }
    return "I will tell you a tale";
  }

  function higgsProxyBase() {
    var cfg = api();
    var fromCfg = String(cfg.higgsProxy || "").replace(/\/$/, "");
    if (fromCfg) return fromCfg;
    var base = supabaseUrl();
    return base ? base + "/functions/v1/higgs-proxy" : "";
  }

  function decodeBase64Bytes(b64) {
    var raw = atob(String(b64 || ""));
    var bytes = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return bytes;
  }

  function wrapPcm16InWav(pcmBytes, sampleRate) {
    var even = pcmBytes.byteLength - (pcmBytes.byteLength % 2);
    var pcm = new Int16Array(pcmBytes.buffer, pcmBytes.byteOffset, even / 2);
    var dataBytes = pcm.length * 2;
    var buffer = new ArrayBuffer(44 + dataBytes);
    var view = new DataView(buffer);
    function writeStr(offset, str) {
      for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + dataBytes, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, dataBytes, true);
    var out = new Uint8Array(buffer);
    out.set(new Uint8Array(pcm.buffer, pcm.byteOffset, dataBytes), 44);
    return out;
  }

  function audioUrlFromTtsResponse(data) {
    var b64 = data && data.audioBase64;
    if (!b64) throw new Error("missing audio");
    var bytes = decodeBase64Bytes(b64);
    var mime = String((data && data.mimeType) || "").toLowerCase();
    var fmt = String((api().higgs && api().higgs.responseFormat) || "pcm").toLowerCase();
    if (mime.indexOf("mpeg") >= 0 || mime.indexOf("mp3") >= 0) {
      return URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }));
    }
    if (mime.indexOf("wav") >= 0 && fmt !== "pcm") {
      return URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
    }
    var sampleRate = Number((api().higgs && api().higgs.sampleRate) || 24000) || 24000;
    var wav = wrapPcm16InWav(bytes, sampleRate);
    return URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
  }

  function synthesizeClonePreview(voiceId) {
    var s = session();
    var proxy = higgsProxyBase();
    if (!s || !s.access_token || !proxy) {
      return Promise.reject(new Error("not signed in"));
    }
    var lang = uiLang();
    var h = api().higgs || {};
    var payload = {
      text: voiceClonePreviewLine(lang),
      voiceId: voiceId,
      modelId: h.modelId || "higgs-tts-3",
      responseFormat: h.responseFormat || "pcm",
      temperature: Number.isFinite(Number(h.temperature)) ? Number(h.temperature) : 0.75,
      maxNewTokens: Number.isFinite(Number(h.maxNewTokens)) ? Number(h.maxNewTokens) : 2047,
      topK: Number.isFinite(Number(h.topK)) ? Number(h.topK) : 50,
      topP: Number.isFinite(Number(h.topP)) ? Number(h.topP) : 0.95,
      languageCode: lang,
      speakingRate: Number.isFinite(Number(h.speakingRate)) ? Number(h.speakingRate) : 1,
    };
    return fetch(proxy + "/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey(),
        Authorization: "Bearer " + s.access_token,
      },
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.text().then(function (raw) {
        var data = {};
        if (raw) {
          try {
            data = JSON.parse(raw);
          } catch (e) {
            data = { error: raw.slice(0, 240) };
          }
        }
        if (!res.ok) {
          throw new Error((data && (data.error || data.message)) || "tts " + res.status);
        }
        return audioUrlFromTtsResponse(data);
      });
    });
  }

  function pickLocalizedJson(value, languageCode, fallback) {
    if (!value || typeof value !== "object") return fallback || "";
    var lang = String(languageCode || "en").toLowerCase().split("-")[0];
    if (value[lang] && String(value[lang]).trim()) return String(value[lang]).trim();
    if (value.en && String(value.en).trim()) return String(value.en).trim();
    var keys = Object.keys(value);
    for (var i = 0; i < keys.length; i++) {
      var text = String(value[keys[i]] || "").trim();
      if (text) return text;
    }
    return fallback || "";
  }

  function pickByLangMap(byLang, languageCode) {
    if (!byLang || typeof byLang !== "object") return null;
    var lang = String(languageCode || "en").toLowerCase().split("-")[0];
    if (lang && String(byLang[lang] || "").trim()) return String(byLang[lang]).trim();
    if (String(byLang.en || "").trim()) return String(byLang.en).trim();
    var keys = Object.keys(byLang);
    for (var i = 0; i < keys.length; i++) {
      var text = String(byLang[keys[i]] || "").trim();
      if (text) return text;
    }
    return null;
  }

  function catalogAudioPublicUrl(audioPath) {
    var base = supabaseUrl();
    if (!base || !audioPath) return "";
    return base + "/storage/v1/object/public/app-assets/" + String(audioPath).replace(/^\/+/, "");
  }

  function langFlag(code) {
    var lang = findLang(code);
    return lang && lang.flag ? lang.flag : "";
  }

  function fetchCatalogVoices() {
    var base = supabaseUrl();
    if (!base || !anonKey()) return Promise.resolve([]);
    var lang = uiLang();
    return fetch(
      base +
        "/rest/v1/catalog_voice_samples?select=id,slug,title,subtitle,audio_path,audio_paths,duration_ms,language_code,tts_provider,tts_voice_id,tts_voice_ids,sort_order&is_active=eq.true&order=sort_order.asc,created_at.asc",
      {
        headers: {
          apikey: anonKey(),
          Authorization: "Bearer " + anonKey(),
        },
      }
    )
      .then(function (res) {
        if (!res.ok) throw new Error("catalog " + res.status);
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows)) return [];
        return rows
          .map(function (row) {
            var id = String(row.id || "").trim();
            var slug = String(row.slug || "").trim();
            var audioPath =
              pickByLangMap(row.audio_paths, lang) || String(row.audio_path || "").trim();
            if (!id || !slug || !audioPath) return null;
            var ttsVoiceId =
              pickByLangMap(row.tts_voice_ids, lang) || String(row.tts_voice_id || "").trim() || null;
            var sampleLang =
              String(lang || "").toLowerCase().split("-")[0] ||
              String(row.language_code || "").trim().toLowerCase() ||
              null;
            return {
              id: id,
              slug: slug,
              title: pickLocalizedJson(row.title, lang, slug),
              subtitle: pickLocalizedJson(row.subtitle, lang, ""),
              audioUrl: catalogAudioPublicUrl(audioPath),
              languageCode: sampleLang,
              ttsVoiceId: ttsVoiceId,
              flag: langFlag(sampleLang),
            };
          })
          .filter(Boolean);
      })
      .catch(function (err) {
        console.warn("[voices] catalog fetch failed", err);
        return [];
      });
  }

  function fetchUserVoices() {
    var s = session();
    var base = supabaseUrl();
    if (!s || !s.access_token || !base) return Promise.resolve([]);
    return fetch(
      base +
        "/rest/v1/voice_clones?select=elevenlabs_voice_id,display_name,sample_language_code,created_at,invite_id,recorded_by_user_id&order=created_at.desc",
      { headers: authHeaders() }
    )
      .then(function (res) {
        if (!res.ok) throw new Error("clones " + res.status);
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows)) return [];
        return rows
          .map(function (row) {
            var voiceId = String(row.elevenlabs_voice_id || "").trim();
            if (!voiceId) return null;
            var label = String(row.display_name || "").trim() || (ui().myVoiceFallback || COPY.en.myVoiceFallback);
            var sampleLang = String(row.sample_language_code || "").trim() || null;
            return {
              voiceId: voiceId,
              label: label,
              languageCode: sampleLang,
              flag: langFlag(sampleLang),
              isShared: Boolean(row.invite_id || row.recorded_by_user_id),
            };
          })
          .filter(Boolean);
      })
      .catch(function (err) {
        console.warn("[voices] clones fetch failed", err);
        return [];
      });
  }

  function stopVoicesAudio() {
    if (voicesAudio) {
      try {
        voicesAudio.pause();
        voicesAudio.removeAttribute("src");
        voicesAudio.load();
      } catch (e) {}
    }
    voicesPlayingId = null;
    document.querySelectorAll(".dash-voice-play.is-playing, .dash-voice-play.is-loading").forEach(function (btn) {
      btn.classList.remove("is-playing");
      btn.classList.remove("is-loading");
      btn.disabled = false;
      btn.innerHTML = voicePlayIcon(false);
    });
  }

  function voicePlayIcon(playing) {
    if (playing) {
      return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 5h3v14H7zm7 0h3v14h-3z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
  }

  function voiceLoadingIcon() {
    return '<span class="dash-voice-spinner" aria-hidden="true"></span>';
  }

  function findVoicePlayButton(id) {
    var btn = null;
    document.querySelectorAll(".dash-voice-play[data-play]").forEach(function (el) {
      if (el.getAttribute("data-play") === id) btn = el;
    });
    return btn;
  }

  function setVoicePlayLoading(id, on) {
    var btn = findVoicePlayButton(id);
    if (!btn) return;
    if (on) {
      btn.classList.add("is-loading");
      btn.classList.remove("is-playing");
      btn.disabled = true;
      btn.innerHTML = voiceLoadingIcon();
    } else {
      btn.classList.remove("is-loading");
      btn.disabled = false;
      btn.innerHTML = voicePlayIcon(false);
    }
  }

  function voicePlusIcon() {
    return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>';
  }

  function voiceShareIcon() {
    return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M18 16.1a2.9 2.9 0 0 0-2.3 1.1l-7.1-3.6a2.9 2.9 0 0 0 0-2.2l7.1-3.6A2.9 2.9 0 1 0 15 6a2.8 2.8 0 0 0 .1.7L8 10.3a2.9 2.9 0 1 0 0 3.4l7.1 3.6a2.8 2.8 0 0 0-.1.7 2.9 2.9 0 1 0 2.9-2.9z"/></svg>';
  }

  function playVoiceSample(id, url) {
    if (!url) return;
    if (!voicesAudio) voicesAudio = new Audio();
    if (voicesPlayingId === id && !voicesAudio.paused) {
      stopVoicesAudio();
      return;
    }
    stopVoicesAudio();
    voicesPlayingId = id;
    voicesAudio.src = url;
    var btn = findVoicePlayButton(id);
    if (btn) {
      btn.classList.add("is-playing");
      btn.innerHTML = voicePlayIcon(true);
    }
    voicesAudio.onended = function () {
      stopVoicesAudio();
    };
    voicesAudio.onerror = function () {
      stopVoicesAudio();
    };
    var playPromise = voicesAudio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        stopVoicesAudio();
      });
    }
  }

  function playMyCloneVoice(voiceId) {
    var id = String(voiceId || "").trim();
    if (!id) return;
    var sampleKey = "clone:" + id;
    if (voicesPlayingId === sampleKey && voicesAudio && !voicesAudio.paused) {
      stopVoicesAudio();
      return;
    }
    var lang = uiLang();
    var cacheKey = id + ":" + lang;
    var cached = clonePreviewCache[cacheKey];
    if (cached) {
      playVoiceSample(sampleKey, cached);
      return;
    }
    var requestId = ++clonePreviewRequestId;
    stopVoicesAudio();
    setVoicePlayLoading(sampleKey, true);
    synthesizeClonePreview(id)
      .then(function (url) {
        if (requestId !== clonePreviewRequestId) return;
        clonePreviewCache[cacheKey] = url;
        setVoicePlayLoading(sampleKey, false);
        playVoiceSample(sampleKey, url);
      })
      .catch(function (err) {
        console.warn("[voices] clone preview failed", err);
        if (requestId !== clonePreviewRequestId) return;
        setVoicePlayLoading(sampleKey, false);
        var pack = ui();
        window.alert(pack.voiceCloneDemoFailed || COPY.en.voiceCloneDemoFailed);
      });
  }

  function voiceTrashIcon() {
    return (
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 3a1 1 0 0 0-1 1v1H4.75a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H16V4a1 1 0 0 0-1-1H9zm1.5 1.5h3V5h-3V4.5zM7.75 8.25a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 0 .75.75h5.5a.75.75 0 0 0 .75-.75V9a.75.75 0 0 1 1.5 0v9.5A2.25 2.25 0 0 1 14.75 20.75h-5.5A2.25 2.25 0 0 1 7 18.5V9a.75.75 0 0 1 .75-.75zm2.5 2a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75zm3 0a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75z"/></svg>'
    );
  }

  function deleteUserVoiceClone(voiceId) {
    var id = String(voiceId || "").trim();
    var s = session();
    var base = supabaseUrl();
    if (!id) return Promise.reject(new Error("Voice id is required."));
    if (!s || !s.access_token || !base) {
      return Promise.reject(new Error("Sign in required to delete a saved voice."));
    }
    var endpoint =
      base +
      "/rest/v1/voice_clones?elevenlabs_voice_id=eq." +
      encodeURIComponent(id);
    return fetch(endpoint, {
      method: "DELETE",
      headers: Object.assign({}, authHeaders(), { Prefer: "return=representation" }),
    }).then(function (res) {
      return res.text().then(function (raw) {
        if (!res.ok) {
          throw new Error(raw || "Could not delete saved voice.");
        }
        var deleted = [];
        if (raw) {
          try {
            deleted = JSON.parse(raw);
          } catch (e) {
            deleted = [];
          }
        }
        if (Array.isArray(deleted) && deleted.length > 0) return;
        return fetch(
          endpoint + "&select=elevenlabs_voice_id",
          { headers: authHeaders() }
        ).then(function (check) {
          if (!check.ok) return;
          return check.json().then(function (rows) {
            if (Array.isArray(rows) && rows.length > 0) {
              throw new Error("Could not delete saved voice from your account. Please try again.");
            }
          });
        });
      });
    });
  }

  function confirmDeleteSavedVoice(voiceId, voiceName) {
    var id = String(voiceId || "").trim();
    if (!id) return;
    var pack = ui();
    var en = COPY.en;
    var name = String(voiceName || "").trim() || pack.myVoiceFallback || en.myVoiceFallback;
    var title = pack.deleteVoiceTitle || en.deleteVoiceTitle;
    var body = String(pack.deleteVoiceBody || en.deleteVoiceBody).replace("{name}", name);
    if (!window.confirm(title + "\n\n" + body)) return;
    var btn = null;
    document.querySelectorAll(".dash-voice-delete[data-delete]").forEach(function (el) {
      if (el.getAttribute("data-delete") === id) btn = el;
    });
    if (btn) {
      btn.disabled = true;
      btn.classList.add("is-busy");
    }
    deleteUserVoiceClone(id)
      .then(function () {
        Object.keys(clonePreviewCache).forEach(function (key) {
          if (key.indexOf(id + ":") === 0) {
            try {
              URL.revokeObjectURL(clonePreviewCache[key]);
            } catch (e) {}
            delete clonePreviewCache[key];
          }
        });
        if (voicesPlayingId === "clone:" + id) stopVoicesAudio();
        userVoicesCache = userVoicesCache.filter(function (voice) {
          return voice.voiceId !== id;
        });
        paintVoices();
      })
      .catch(function (err) {
        console.warn("[voices] delete failed", err);
        if (btn) {
          btn.disabled = false;
          btn.classList.remove("is-busy");
        }
        window.alert(
          (pack.deleteVoiceFailed || en.deleteVoiceFailed) +
            (err && err.message ? "\n" + err.message : "")
        );
      });
  }

  function voiceRowHtml(opts) {
    var canPlay = Boolean(opts.audioUrl || opts.cloneVoiceId);
    var deleteBtn = opts.cloneVoiceId
      ? '<button type="button" class="dash-voice-delete" data-delete="' +
        escapeHtml(opts.cloneVoiceId) +
        '" data-name="' +
        escapeHtml(opts.title || "") +
        '" aria-label="' +
        escapeHtml(opts.deleteLabel || "Delete") +
        '">' +
        voiceTrashIcon() +
        "</button>"
      : "";
    return (
      '<div class="dash-voice-row' +
      (opts.active ? " is-active" : "") +
      '">' +
      '<button type="button" class="dash-voice-play" data-play="' +
      escapeHtml(opts.id) +
      '"' +
      (opts.audioUrl ? ' data-url="' + escapeHtml(opts.audioUrl) + '"' : "") +
      (opts.cloneVoiceId ? ' data-clone="' + escapeHtml(opts.cloneVoiceId) + '"' : "") +
      (canPlay ? "" : " disabled") +
      ' aria-label="' +
      escapeHtml(opts.playLabel) +
      '">' +
      voicePlayIcon(false) +
      "</button>" +
      '<div class="dash-voice-copy">' +
      '<div class="dash-voice-title-row">' +
      (opts.flag ? '<span class="dash-voice-flag">' + opts.flag + "</span>" : "") +
      '<p class="dash-voice-title">' +
      escapeHtml(opts.title) +
      "</p></div>" +
      (opts.subtitle
        ? '<p class="dash-voice-sub' +
          (opts.shared ? " is-shared" : "") +
          '">' +
          escapeHtml(opts.subtitle) +
          "</p>"
        : "") +
      "</div>" +
      '<button type="button" class="dash-voice-use" data-use="' +
      escapeHtml(opts.id) +
      '"' +
      (opts.cloneVoiceId ? ' data-use-clone="' + escapeHtml(opts.cloneVoiceId) + '"' : "") +
      ">" +
      escapeHtml(opts.useLabel) +
      "</button>" +
      deleteBtn +
      "</div>"
    );
  }

  function paintVoices() {
    var box = document.getElementById("dash-voices");
    if (!box) return;
    var pack = ui();
    var en = COPY.en;
    var html = "";
    html +=
      '<div class="dash-voices-glow">' +
      '<button type="button" class="dash-voices-add" id="dash-voices-add">' +
      '<span class="dash-voice-plus">' +
      voicePlusIcon() +
      "</span>" +
      "<span class=\"dash-voice-title\">" +
      escapeHtml(pack.addMyVoice || en.addMyVoice) +
      "</span></button></div>";
    html +=
      '<button type="button" class="dash-voices-invite" id="dash-voices-invite">' +
      voiceShareIcon() +
      "<span>" +
      escapeHtml(pack.askSomeoneToRecord || en.askSomeoneToRecord) +
      "</span></button>";

    if (userVoicesCache.length) {
      html +=
        '<h2 class="dash-voices-section">' +
        escapeHtml(pack.myVoicesSection || en.myVoicesSection) +
        "</h2><div class=\"dash-voices-list\">";
      userVoicesCache.forEach(function (voice, index) {
        html += voiceRowHtml({
          id: "clone:" + voice.voiceId,
          title: voice.label || pack.myVoiceFallback || en.myVoiceFallback,
          subtitle: voice.isShared
            ? pack.sharedVoice || en.sharedVoice
            : pack.createdVoice || en.createdVoice,
          shared: voice.isShared,
          flag: voice.flag || "",
          cloneVoiceId: voice.voiceId,
          active: index === 0,
          playLabel: pack.playVoiceSample || en.playVoiceSample,
          useLabel: pack.useThisVoice || en.useThisVoice,
          deleteLabel: pack.delete || en.delete,
        });
      });
      html += "</div>";
    }

    html +=
      '<h2 class="dash-voices-section">' +
      escapeHtml(pack.voiceSamplesSectionTitle || en.voiceSamplesSectionTitle) +
      "</h2><div class=\"dash-voices-list\">";
    if (!catalogVoicesCache.length && voicesSyncPromise) {
      html +=
        '<p class="dash-voices-loading">' +
        escapeHtml(pack.voicesLoading || en.voicesLoading) +
        "</p>";
    } else {
      catalogVoicesCache.forEach(function (sample) {
        html += voiceRowHtml({
          id: sample.id,
          title: sample.title,
          subtitle: sample.subtitle,
          flag: sample.flag || "",
          audioUrl: sample.audioUrl,
          playLabel: pack.playVoiceSample || en.playVoiceSample,
          useLabel: pack.useThisVoice || en.useThisVoice,
        });
      });
    }
    html += "</div>";
    box.innerHTML = html;

    var addBtn = document.getElementById("dash-voices-add");
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        openAddMyVoice();
      });
    }
    var inviteBtn = document.getElementById("dash-voices-invite");
    if (inviteBtn) {
      inviteBtn.addEventListener("click", function () {
        window.open(appStoreUrl(), "_blank", "noopener");
      });
    }
    box.querySelectorAll(".dash-voice-play").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cloneId = btn.getAttribute("data-clone");
        if (cloneId) {
          playMyCloneVoice(cloneId);
          return;
        }
        playVoiceSample(btn.getAttribute("data-play"), btn.getAttribute("data-url"));
      });
    });
    box.querySelectorAll(".dash-voice-use").forEach(function (btn) {
      btn.addEventListener("click", function () {
        useVoiceForVoiceover(btn);
      });
    });
    box.querySelectorAll(".dash-voice-delete").forEach(function (btn) {
      btn.addEventListener("click", function () {
        confirmDeleteSavedVoice(btn.getAttribute("data-delete"), btn.getAttribute("data-name"));
      });
    });
  }

  function refreshVoices() {
    if (voicesSyncPromise) return voicesSyncPromise;
    voicesSyncPromise = Promise.all([fetchCatalogVoices(), fetchUserVoices()])
      .then(function (parts) {
        catalogVoicesCache = parts[0] || [];
        userVoicesCache = parts[1] || [];
        paintVoices();
        return parts;
      })
      .finally(function () {
        voicesSyncPromise = null;
      });
    paintVoices();
    return voicesSyncPromise;
  }

  function voiceCloneLimit() {
    return quotaState.isPlus ? PLUS_VOICE_CLONE_LIMIT : FREE_VOICE_CLONE_LIMIT;
  }

  function atVoiceCloneLimit(cloneCount) {
    var count = Number.isFinite(Number(cloneCount))
      ? Math.max(0, Math.floor(Number(cloneCount)))
      : userVoicesCache.length;
    return count >= voiceCloneLimit();
  }

  /**
   * Freemium has 1 slot, Plus has more (3). Gate before the record flow so users do not
   * record a full sample only to be told the slot is full on save.
   */
  function assertVoiceCloneSlot() {
    if (!atVoiceCloneLimit()) return Promise.resolve(true);
    if (!quotaState.isPlus) {
      openWebPaywall({
        title: (ui().unlockMoreVoices || COPY.en.unlockMoreVoices || "Unlock more voices"),
      });
      return Promise.resolve(false);
    }
    var pack = ui();
    var en = COPY.en;
    window.alert(pack.voiceCloneLimitReached || en.voiceCloneLimitReached);
    return Promise.resolve(false);
  }

  function openAddMyVoice() {
    return refreshVoices()
      .catch(function () {
        return null;
      })
      .then(function () {
        return assertVoiceCloneSlot();
      })
      .then(function (ok) {
        if (!ok) return false;
        if (window.NanikRecordVoice && typeof window.NanikRecordVoice.open === "function") {
          window.NanikRecordVoice.open();
          return true;
        }
        window.open(appStoreUrl(), "_blank", "noopener");
        return false;
      });
  }
  window.__nanikRefreshVoices = refreshVoices;
  window.__nanikAssertVoiceCloneSlot = assertVoiceCloneSlot;
  window.__nanikOpenAddMyVoice = openAddMyVoice;

  var menuCloseTimer = 0;

  function closeDashMenu() {
    var sheet = document.getElementById("dash-menu-sheet");
    var backdrop = document.getElementById("dash-menu-backdrop");
    var btn = document.getElementById("dash-menu-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-menu-open");
    if (sheet) sheet.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    if (menuCloseTimer) window.clearTimeout(menuCloseTimer);
    menuCloseTimer = window.setTimeout(function () {
      menuCloseTimer = 0;
      if (sheet && !sheet.classList.contains("is-open")) sheet.hidden = true;
      if (backdrop && !backdrop.classList.contains("is-open")) backdrop.hidden = true;
    }, 320);
  }

  function openDashMenu() {
    var sheet = document.getElementById("dash-menu-sheet");
    var backdrop = document.getElementById("dash-menu-backdrop");
    var btn = document.getElementById("dash-menu-btn");
    if (menuCloseTimer) {
      window.clearTimeout(menuCloseTimer);
      menuCloseTimer = 0;
    }
    if (sheet) {
      sheet.hidden = false;
      void sheet.offsetWidth;
      sheet.classList.add("is-open");
    }
    if (backdrop) {
      backdrop.hidden = false;
      void backdrop.offsetWidth;
      backdrop.classList.add("is-open");
    }
    if (btn) btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-menu-open");
    paintChildProfile();
  }

  function syncTabPillSelection() {
    var pill = document.getElementById("dash-tab-pill");
    var row = document.getElementById("dash-tab-pill-row");
    var selection = document.getElementById("dash-tab-pill-selection");
    if (!pill || pill.hidden || !row || !selection) return;
    var active = row.querySelector(".dash-tab-pill-btn.is-on");
    if (!active) {
      selection.classList.remove("is-on");
      selection.style.width = "0px";
      return;
    }
    var rowRect = row.getBoundingClientRect();
    var btnRect = active.getBoundingClientRect();
    var left = Math.round(btnRect.left - rowRect.left);
    var width = Math.round(btnRect.width);
    selection.style.left = left + "px";
    selection.style.width = Math.max(1, width) + "px";
    selection.classList.add("is-on");
  }

  function setTabPillMode(on) {
    var pill = document.getElementById("dash-tab-pill");
    document.body.classList.toggle("has-tab-pill", !!on);
    if (pill) pill.hidden = !on;
    if (on) {
      requestAnimationFrame(function () {
        syncTabPillSelection();
      });
    }
  }

  function layoutTopNav() {
    var nav = document.getElementById("dash-top-nav");
    var menuBtn = document.getElementById("dash-menu-btn");
    var account = document.getElementById("dash-account-bar");
    var left = document.querySelector(".dash-top-left");
    if (!nav || !menuBtn || !account || !left) return;
    var items = Array.prototype.slice.call(nav.querySelectorAll(".dash-top-nav-btn"));
    if (!items.length) return;

    nav.classList.add("is-on");
    menuBtn.hidden = false;
    menuBtn.classList.remove("is-compact-only");
    items.forEach(function (btn) {
      btn.hidden = false;
    });
    setTabPillMode(false);

    var edgeGap = 16;
    var leftRight = left.getBoundingClientRect().right;
    var accountLeft = account.getBoundingClientRect().left;
    var menuWidth = menuBtn.getBoundingClientRect().width || 40;
    var rowGap = 10;
    var centerX = window.innerWidth / 2;
    var halfWithoutMenu = Math.max(
      0,
      Math.min(centerX - (leftRight - menuWidth - rowGap), accountLeft - centerX) - edgeGap
    );
    var availableWithoutMenu = halfWithoutMenu * 2;

    var total = 0;
    items.forEach(function (btn, index) {
      total += Math.ceil(btn.getBoundingClientRect().width) + (index > 0 ? 2 : 0);
    });

    var allFit = total <= availableWithoutMenu;
    items.forEach(function (btn) {
      btn.hidden = !allFit;
    });

    if (allFit) {
      menuBtn.hidden = true;
      menuBtn.classList.add("is-compact-only");
      nav.classList.add("is-on");
      setTabPillMode(false);
      closeDashMenu();
    } else {
      // Compact: floating bottom pill (app parity) instead of left sheet menu.
      menuBtn.hidden = true;
      menuBtn.classList.add("is-compact-only");
      nav.classList.remove("is-on");
      setTabPillMode(true);
      closeDashMenu();
    }
  }

  function wireSafariShell() {
    function lockScroll() {
      if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
      if (document.documentElement.scrollTop) document.documentElement.scrollTop = 0;
      if (document.body.scrollTop) document.body.scrollTop = 0;
    }
    function setAppHeight() {
      var h = window.visualViewport && window.visualViewport.height
        ? window.visualViewport.height
        : window.innerHeight;
      document.documentElement.style.setProperty("--app-height", Math.round(h) + "px");
      lockScroll();
      layoutTopNav();
    }
    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.addEventListener("orientationchange", function () {
      setTimeout(setAppHeight, 50);
      setTimeout(setAppHeight, 300);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setAppHeight);
      window.visualViewport.addEventListener("scroll", function () {
        lockScroll();
        setAppHeight();
      });
    }
    document.addEventListener(
      "gesturestart",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    );
    document.addEventListener(
      "gesturechange",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    );
    document.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches && e.touches.length > 1) e.preventDefault();
      },
      { passive: false }
    );
  }

  function wireMenuChrome() {
    var btn = document.getElementById("dash-menu-btn");
    var backdrop = document.getElementById("dash-menu-backdrop");
    if (btn) {
      btn.addEventListener("click", function () {
        var sheet = document.getElementById("dash-menu-sheet");
        if (sheet && sheet.classList.contains("is-open")) closeDashMenu();
        else openDashMenu();
      });
    }
    if (backdrop) backdrop.addEventListener("click", closeDashMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDashMenu();
    });
    window.addEventListener("resize", function () {
      layoutTopNav();
    });
    if (window.ResizeObserver) {
      var account = document.getElementById("dash-account-bar");
      var left = document.querySelector(".dash-top-left");
      var ro = new ResizeObserver(function () {
        layoutTopNav();
      });
      if (account) ro.observe(account);
      if (left) ro.observe(left);
    }
    requestAnimationFrame(function () {
      layoutTopNav();
    });
  }

  function showPanel(name) {
    closeVoicePick();
    document.querySelectorAll(".dash-panel").forEach(function (el) {
      el.hidden = el.id !== "panel-" + name;
      el.classList.toggle("is-on", !el.hidden);
    });
    document.querySelectorAll(".dash-nav-btn").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-panel") === name);
    });
    document.querySelectorAll(".dash-tab-pill-btn").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-panel") === name);
    });
    document.body.classList.toggle("is-create-panel", name === "create");
    document.body.classList.remove("is-reader-open");
    closeDashMenu();
    closeAccountSheet();
    syncTabPillSelection();
    if (name !== "voices") voicesPickMode = false;
    paintVoicesTitle();
    if (name === "library") {
      closeReader();
      paintLibrary();
      refreshCloudLibrary();
      void refreshQuotaStatus();
    }
    if (name === "voices") {
      stopVoicesAudio();
      paintVoices();
      refreshVoices();
    }
    if (name === "kids") {
      paintKidsPage();
      setLangExpanded(false);
    }
    if (name === "account") {
      mountAccountRoot("page");
      paintAccountLangValue();
      paintAccountProfile();
      setLangExpanded(false);
      void refreshQuotaStatus();
    } else {
      mountAccountRoot("sheet");
    }
  }

  function closeReader() {
    var listWrap = document.getElementById("dash-library-list");
    var reader = document.getElementById("dash-reader");
    if (listWrap) listWrap.hidden = false;
    if (reader) reader.hidden = true;
    document.body.classList.remove("is-reader-open");
    stopReaderMusic(true);
    stopStoryVoiceoverPlayback();
    hideReaderVolume();
    syncTabPillSelection();
  }

  var READER_FONT_MIN = 13;
  var READER_FONT_MAX = 24;
  var READER_FONT_STEP = 1;
  var READER_FONT_DEFAULT = 15;
  var READER_MUSIC_VOL_MAX = 0.6;
  var READER_MUSIC_VOL_DEFAULT = 0.22;
  var readerFontSize = READER_FONT_DEFAULT;
  var readerMusic = null;
  var readerMusicEnabled = false;
  var readerMusicVolume = READER_MUSIC_VOL_DEFAULT;
  var activeReaderStory = null;

  function clampReaderFont(size) {
    return Math.min(READER_FONT_MAX, Math.max(READER_FONT_MIN, Math.round(size)));
  }

  function applyReaderFont() {
    var body = document.getElementById("dash-reader-body");
    if (body) {
      body.style.fontSize = readerFontSize + "px";
      body.style.lineHeight = String(Math.round(readerFontSize * 1.6)) + "px";
    }
    var atMin = readerFontSize <= READER_FONT_MIN;
    var atMax = readerFontSize >= READER_FONT_MAX;
    var fontDown = document.getElementById("dash-reader-font-down");
    var fontUp = document.getElementById("dash-reader-font-up");
    if (fontDown) fontDown.disabled = atMin;
    if (fontUp) fontUp.disabled = atMax;
  }

  function volumeToProgress(vol) {
    return Math.round((Math.max(0, Math.min(READER_MUSIC_VOL_MAX, vol)) / READER_MUSIC_VOL_MAX) * 100);
  }

  function progressToVolume(progress) {
    var p = Math.max(0, Math.min(100, Number(progress) || 0)) / 100;
    return p * READER_MUSIC_VOL_MAX;
  }

  function syncReaderMusicButton() {
    var on = readerMusicEnabled && readerMusicVolume > 0.001;
    var pack = ui();
    var label = on
      ? pack.musicDisable || COPY.en.musicDisable
      : pack.musicPlay || COPY.en.musicPlay;
    ["dash-reader-music", "dash-reader-player-music"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", label);
      var onIcon = btn.querySelector(".dash-reader-music-on");
      var offIcon = btn.querySelector(".dash-reader-music-off");
      if (onIcon) onIcon.hidden = !on;
      if (offIcon) offIcon.hidden = on;
    });
  }

  function ensureReaderMusic() {
    if (!readerMusic) {
      readerMusic = new Audio("audio/story-background-music.mp3");
      readerMusic.loop = true;
      readerMusic.preload = "auto";
    }
    readerMusic.volume = Math.max(0, Math.min(1, readerMusicVolume));
    return readerMusic;
  }

  function stopReaderMusic(disable) {
    if (disable) readerMusicEnabled = false;
    if (readerMusic) {
      try {
        readerMusic.pause();
      } catch (e) {}
    }
    syncReaderMusicButton();
  }

  function playReaderMusic() {
    if (readerMusicVolume <= 0.001) {
      stopReaderMusic(true);
      return;
    }
    readerMusicEnabled = true;
    var audio = ensureReaderMusic();
    var playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        readerMusicEnabled = false;
        syncReaderMusicButton();
      });
    }
    syncReaderMusicButton();
  }

  function hideReaderVolume() {
    var box = document.getElementById("dash-reader-volume");
    if (box) box.hidden = true;
  }

  function showReaderVolume() {
    var box = document.getElementById("dash-reader-volume");
    var slider = document.getElementById("dash-reader-volume-slider");
    if (slider) slider.value = String(volumeToProgress(readerMusicVolume));
    if (box) box.hidden = false;
  }

  function formatReaderBody(text) {
    return String(text || "")
      .replace(/<\|[^|]+:[^|]+\|>/g, "")
      .replace(/\s*(?:\[SCENE[_\s-]?BREAKS?\]|\[Scenebreaks?\]|\[scene\s*breaks?\])\s*/gi, "\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function coverLoadingLabel() {
    var lang = uiLang();
    if (lang === "hy") return "Ստեղծում եմ շապիկը…";
    if (lang === "ru") return "Создаём обложку…";
    return "Creating cover…";
  }

  function noImageLabel() {
    var pack = ui();
    return pack.noImage || COPY.en.noImage || "No image";
  }

  function emptyCoverHtml(ariaLabel) {
    return (
      '<div class="dash-story-cover-ph is-empty" aria-label="' +
      escapeHtml(ariaLabel || noImageLabel()) +
      '">' +
      '<img src="images/feature-library.jpg" alt="" aria-hidden="true">' +
      "<span>" +
      escapeHtml(ariaLabel || noImageLabel()) +
      "</span></div>"
    );
  }

  function setReaderCoverState(story) {
    var wrap = document.getElementById("dash-reader-cover-wrap");
    var cover = document.getElementById("dash-reader-cover");
    var loading = document.getElementById("dash-reader-cover-loading");
    var empty = document.getElementById("dash-reader-cover-empty");
    var emptyLabel = document.getElementById("dash-reader-cover-empty-label");
    var label = document.getElementById("dash-reader-cover-loading-label");
    var url = story && String(story.cover || "").trim();
    var pending = !!(story && story.coverPending);
    var showEmpty = !pending && !url;
    if (wrap) wrap.hidden = !(pending || url || showEmpty);
    if (label) label.textContent = coverLoadingLabel();
    if (loading) loading.hidden = !pending;
    if (emptyLabel) emptyLabel.textContent = noImageLabel();
    if (empty) empty.hidden = !showEmpty;
    if (cover) {
      if (url && !pending) {
        if (cover.getAttribute("src") !== url) cover.src = url;
        cover.hidden = false;
      } else {
        cover.removeAttribute("src");
        cover.hidden = true;
      }
    }
  }

  function patchStoryCover(storyId, coverUrl, options) {
    var opts = options || {};
    var id = storyIdKey(storyId);
    if (!id) return;
    var cover = String(coverUrl || "").trim();
    var pending = !!opts.pending && !cover;
    var list = readLocalStories().map(function (item) {
      if (storyIdKey(item.id) !== id) return item;
      return Object.assign({}, item, {
        cover: cover || "",
        coverPending: pending,
      });
    });
    writeStories(list);
    cloudStoriesCache = cloudStoriesCache.map(function (item) {
      if (storyIdKey(item.id) !== id) return item;
      return Object.assign({}, item, {
        cover: cover || "",
        coverPending: pending,
      });
    });
    var updated = list.find(function (item) {
      return storyIdKey(item.id) === id;
    });
    if (activeReaderStory && storyIdKey(activeReaderStory.id) === id) {
      activeReaderStory = Object.assign({}, activeReaderStory, {
        cover: cover || "",
        coverPending: pending,
      });
      setReaderCoverState(activeReaderStory);
    }
    paintLibrary();
    if (updated && cover) void upsertCloudStory(updated);
  }

  function openStory(story) {
    var listWrap = document.getElementById("dash-library-list");
    var reader = document.getElementById("dash-reader");
    var title = document.getElementById("dash-reader-title");
    var body = document.getElementById("dash-reader-body");
    var note = document.getElementById("dash-reader-note");
    var summary = document.getElementById("dash-reader-summary");
    if (!story || !reader) return;
    var merged = readStories().find(function (item) {
      return storyIdKey(item.id) === storyIdKey(story.id);
    });
    if (merged) story = Object.assign({}, merged, story);
    var audioUrl = storyVoiceoverUrl(story);
    if (audioUrl && story.voiceoverUrl !== audioUrl) {
      story = Object.assign({}, story, { voice: true, voiceoverUrl: audioUrl });
    }
    if (
      activeReaderStory &&
      storyIdKey(activeReaderStory.id) !== storyIdKey(story.id)
    ) {
      stopStoryVoiceoverPlayback();
    }
    activeReaderStory = story;
    if (listWrap) listWrap.hidden = true;
    reader.hidden = false;
    document.body.classList.add("is-reader-open");
    if (title) title.textContent = story.title || "Untitled story";
    if (body) body.textContent = formatReaderBody(story.body || "");
    applyReaderFont();
    setReaderCoverState(story);
    if (summary) {
      summary.innerHTML = storySummaryHtml(story);
      summary.hidden = !summary.innerHTML;
    }
    if (note) {
      if (storyVoiceoverUrl(story)) {
        note.hidden = false;
        note.textContent = ui().voiceoverReady || COPY.en.voiceoverReady || "Voiceover is ready";
      } else {
        note.hidden = !story.voice;
        note.textContent = story.voice ? t().voiceNote : "";
      }
    }
    hideReaderVolume();
    syncReaderMusicButton();
    syncReaderVoiceButton();
    if (storyVoiceoverUrl(story)) {
      ensureVoiceoverAudio(storyVoiceoverUrl(story));
      syncReaderPlayerUi();
    }
  }

  function shareActiveStory() {
    if (!activeReaderStory) return;
    var text = (activeReaderStory.title || "Nanik story") + "\n\n" + formatReaderBody(activeReaderStory.body || "");
    if (navigator.share) {
      navigator.share({ title: activeReaderStory.title || "Nanik story", text: text }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var button = document.getElementById("dash-reader-share");
        if (!button) return;
        var previous = button.textContent;
        button.textContent = "Copied";
        window.setTimeout(function () { button.textContent = previous; }, 1600);
      }).catch(function () {});
    }
  }

  function wireReaderChrome() {
    var slider = document.getElementById("dash-reader-volume-slider");
    function bumpFont(delta) {
      readerFontSize = clampReaderFont(readerFontSize + delta);
      applyReaderFont();
    }
    function onMusicClick() {
      var box = document.getElementById("dash-reader-volume");
      if (box && !box.hidden) {
        hideReaderVolume();
        return;
      }
      if (readerMusicVolume > 0.001 && !readerMusicEnabled) {
        playReaderMusic();
      }
      showReaderVolume();
      syncReaderMusicButton();
    }
    var fontDown = document.getElementById("dash-reader-font-down");
    var fontUp = document.getElementById("dash-reader-font-up");
    if (fontDown) {
      fontDown.addEventListener("click", function () {
        bumpFont(-READER_FONT_STEP);
      });
    }
    if (fontUp) {
      fontUp.addEventListener("click", function () {
        bumpFont(READER_FONT_STEP);
      });
    }
    ["dash-reader-music", "dash-reader-player-music"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", onMusicClick);
    });
    var readerScroll = document.querySelector("#dash-reader .dash-reader-scroll");
    if (readerScroll) {
      readerScroll.addEventListener("click", function () {
        hideReaderVolume();
      });
    }
    if (slider) {
      slider.value = String(volumeToProgress(readerMusicVolume));
      slider.addEventListener("input", function () {
        readerMusicVolume = progressToVolume(slider.value);
        if (readerMusic) readerMusic.volume = Math.max(0, Math.min(1, readerMusicVolume));
        if (readerMusicVolume <= 0.001) {
          stopReaderMusic(true);
        } else if (readerMusicEnabled) {
          playReaderMusic();
        } else {
          playReaderMusic();
        }
        syncReaderMusicButton();
      });
    }
    applyReaderFont();
    syncReaderMusicButton();
  }

  function storySummaryHtml(story) {
    var pack = ui();
    var en = COPY.en;
    var rows = [
      {
        icon: "location",
        label: pack.summarySettingLabel || en.summarySettingLabel,
        value: storySettingText(story),
      },
      {
        icon: "heart",
        label: pack.summaryHelpsLabel || en.summaryHelpsLabel,
        value: storyHelpsText(story),
      },
    ].filter(function (row) {
      return (row.value || "").trim().length > 0;
    });
    if (!rows.length) return "";
    return rows
      .map(function (row) {
        return (
          '<div class="dash-story-row">' +
          summaryIcon(row.icon) +
          "<div><strong>" +
          escapeHtml(row.label) +
          ": </strong><span>" +
          escapeHtml(row.value) +
          "</span></div></div>"
        );
      })
      .join("");
  }

  function summaryIcon(name) {
    if (name === "person") {
      return '<svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true"><path fill="currentColor" d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12zm0 2c-4 0-7.5 2-7.5 4.5V20h15v-1.5C19.5 16 16 14 12 14z"/></svg>';
    }
    if (name === "location") {
      return '<svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4 5.3 5.3 0 0 1 12 6.09 5.3 5.3 0 0 1 17.5 4 4.5 4.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>';
  }

  function pillIcon(name) {
    if (name === "mic") {
      return '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"/></svg>';
    }
    if (name === "play") {
      return '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
    }
    if (name === "download") {
      return '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L11 12.6V4a1 1 0 0 1 1-1zM5 18a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M4 5v14l8-7-8-7zm9 0v14h2V5h-2zm4 0v14h2V5h-2z"/></svg>';
  }

  function appleStoreIcon() {
    return '<svg viewBox="0 0 384 512" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';
  }

  function appStoreUrl() {
    return (ui().appStoreUrl || COPY.en.appStoreUrl || "https://apps.apple.com/app/id6762894314");
  }

  function paintLibrary() {
    var box = document.getElementById("dash-library");
    if (!box) return;
    var list = readStories();
    var pack = ui();
    var en = COPY.en;
    if (!list.length) {
      box.innerHTML =
        '<div class="dash-library-empty-wrap">' +
        '<img src="images/library-empty-state.png?v=20260922alpha1" alt="">' +
        "<h2>" +
        escapeHtml(pack.noStoriesYet || en.noStoriesYet) +
        "</h2>" +
        "<p>" +
        escapeHtml(pack.noStoriesSub || en.noStoriesSub) +
        "</p>" +
        '<button type="button" class="dash-library-create" id="dash-library-create">' +
        escapeHtml(pack.createFirstStory || en.createFirstStory) +
        "</button></div>";
      var createBtn = document.getElementById("dash-library-create");
      if (createBtn) {
        createBtn.addEventListener("click", function () {
          showPanel("create");
        });
      }
      return;
    }
    box.innerHTML = list
      .map(function (story, index) {
        var img = story.cover
          ? '<img src="' + escapeHtml(story.cover) + '" alt="">'
          : story.coverPending
            ? '<div class="dash-story-cover-ph is-loading" aria-label="' +
              escapeHtml(coverLoadingLabel()) +
              '"></div>'
            : emptyCoverHtml();
        var summary = storySummaryHtml(story);
        var divider =
          index + 1 < list.length ? '<div class="dash-story-divider" aria-hidden="true"></div>' : "";
        var hasAudio = !!storyVoiceoverUrl(story);
        var voiceLabel = hasAudio
          ? pack.playVoiceover || en.playVoiceover || pack.playVoiceSample || "Play"
          : pack.tellWithVoice || en.tellWithVoice;
        var voiceAction = hasAudio ? "play" : "voice";
        var voiceIco = hasAudio ? "play" : "mic";
        return (
          '<article class="dash-story" data-story="' +
          escapeHtml(story.id) +
          '">' +
          '<div class="dash-story-cover">' +
          img +
          "</div>" +
          '<div class="dash-story-meta">' +
          '<h3 class="dash-story-title">' +
          escapeHtml(story.title || "Untitled story") +
          "</h3>" +
          (summary ? '<div class="dash-story-summary">' + summary + "</div>" : "") +
          "</div>" +
          '<div class="dash-story-actions">' +
          '<button type="button" class="dash-story-pill is-voice" data-action="' +
          voiceAction +
          '">' +
          pillIcon(voiceIco) +
          escapeHtml(voiceLabel) +
          "</button>" +
          '<a class="dash-story-pill dash-story-store" data-action="download-app" href="' +
          escapeHtml(appStoreUrl()) +
          '" target="_blank" rel="noopener">' +
          appleStoreIcon() +
          "<span>" +
          escapeHtml(pack.storeCta || en.storeCta || "Download on the App Store") +
          "</span></a>" +
          "</div>" +
          divider +
          "</article>"
        );
      })
      .join("");
    box.querySelectorAll("[data-story]").forEach(function (card) {
      card.addEventListener("click", function (ev) {
        var actionEl = ev.target && ev.target.closest ? ev.target.closest("[data-action]") : null;
        if (actionEl) {
          ev.preventDefault();
          ev.stopPropagation();
          var action = actionEl.getAttribute("data-action");
          if (action === "voice" || action === "play") {
            var voiceStory = readStories().find(function (item) {
              return storyIdKey(item.id) === storyIdKey(card.getAttribute("data-story"));
            });
            if (voiceStory) openStory(voiceStory);
            if (action === "play" && voiceStory && storyVoiceoverUrl(voiceStory)) {
              playStoryVoiceover();
              return;
            }
            openVoicesForPick(voiceStory || activeReaderStory);
            return;
          }
          if (action === "download-app") {
            window.open(appStoreUrl(), "_blank", "noopener");
            return;
          }
        }
        var id = storyIdKey(card.getAttribute("data-story"));
        var story = readStories().find(function (item) {
          return storyIdKey(item.id) === id;
        });
        if (story) openStory(story);
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function threadEl() {
    return document.getElementById("dash-thread");
  }

  function scrollThread() {
    var thread = threadEl();
    if (thread) thread.scrollTop = thread.scrollHeight;
  }

  function setComposerStop(on) {
    var sendBtn = document.getElementById("dash-send");
    if (!sendBtn) return;
    sendBtn.classList.toggle("is-stop", on);
    sendBtn.setAttribute("aria-label", on ? "Stop" : "Send");
    sendBtn.disabled = !on && sending;
  }

  function phEl() {
    return document.getElementById("dash-input-ph");
  }

  function setFilled() {
    var form = document.getElementById("dash-composer");
    var input = document.getElementById("dash-input");
    if (form && input) form.classList.toggle("is-filled", !!input.value.trim());
  }

  function stopPhRotate() {
    if (phTimer) clearInterval(phTimer);
    phTimer = 0;
  }

  function showPh(text) {
    var el = phEl();
    if (!el) return;
    el.textContent = text || "";
    el.classList.remove("is-out");
  }

  function startPhRotate() {
    stopPhRotate();
    var input = document.getElementById("dash-input");
    var el = phEl();
    if (!input || !el || step !== "idle") return;
    el.classList.remove("is-off");
    var pack = rotateCopy();
    var list = pack.phRotate || [];
    if (!list.length) return;
    showPh(list[0]);
    setFilled();
    if (list.length < 2) return;
    phTimer = setInterval(function () {
      if (step !== "idle" || (input.value && input.value.trim())) return;
      phIdx = (phIdx + 1) % list.length;
      el.classList.add("is-out");
      setTimeout(function () {
        if (step !== "idle" || (input.value && input.value.trim())) return;
        showPh(list[phIdx]);
      }, 280);
    }, PH_ROTATE_MS);
  }

  function setPlaceholder() {
    var input = document.getElementById("dash-input");
    var el = phEl();
    if (!input) return;
    var pack = t();
    if (step === "idle" && !waitingOther) {
      input.placeholder = "";
      startPhRotate();
      return;
    }
    stopPhRotate();
    if (el) {
      el.textContent = "";
      el.classList.add("is-off");
    }
    if (waitingOther) input.placeholder = pack.phOther;
    else if (step === "age") input.placeholder = pack.phAge;
    else if (step === "support") input.placeholder = pack.phSupport;
    else if (isClarifyStep(step) || isAiStep(step)) input.placeholder = pack.phOther;
    else if (step === "hero") input.placeholder = pack.phHero;
    else if (step === "photo") input.placeholder = pack.ph;
    else input.placeholder = pack.ph;
  }

  function addUserBubble(text, image) {
    var thread = threadEl();
    if (!thread) return;
    var el = document.createElement("div");
    el.className = "dash-msg is-user";
    var html = "";
    if (image) html += '<img src="' + image + '" alt="">';
    if (text) html += escapeHtml(text);
    el.innerHTML = html || "…";
    thread.appendChild(el);
    scrollThread();
  }

  /** Questionnaire picks stay off the chat thread. */
  function noteAnswer() {}

  function suggestEl() {
    return document.getElementById("dash-suggest");
  }

  function askbarEl() {
    return document.getElementById("dash-askbar");
  }

  function clearSuggest() {
    var bar = askbarEl();
    var box = suggestEl();
    var q = document.getElementById("dash-askbar-q");
    var card = document.getElementById("dash-qcard");
    if (bar) bar.hidden = true;
    if (box) box.innerHTML = "";
    if (q) q.textContent = "";
    if (card && step !== "age" && step !== "hero" && step !== "photo" && step !== "support") {
      card.hidden = true;
    }
  }

  function showAskbar(question, chips) {
    var bar = askbarEl();
    var box = suggestEl();
    var q = document.getElementById("dash-askbar-q");
    if (q) q.textContent = question || "";
    if (box) {
      box.innerHTML = chips || "";
      box.hidden = false;
    }
    if (bar) bar.hidden = false;
  }

  function stopTurn() {
    if (turnAbort) {
      try {
        turnAbort.abort();
      } catch (e) {}
    }
    turnAbort = null;
    loadingTurn = false;
    var card = document.getElementById("dash-qcard");
    if (card && !card.hidden && !sending) {
      hideQcard();
      return;
    }
    setComposerStop(false);
    var thinking = document.getElementById("dash-thinking");
    if (thinking) thinking.remove();
  }

  function addThinking() {
    var thread = threadEl();
    var existing = document.getElementById("dash-thinking");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.id = "dash-thinking";
    el.className = "dash-msg is-ai";
    el.innerHTML =
      '<div class="dash-think-line"><span class="dash-spark"></span><span class="dash-think-text">' +
      escapeHtml(t().thinking) +
      "</span></div>";
    thread.appendChild(el);
    scrollThread();
    return el;
  }

  function parseAge(value) {
    var n = parseInt(value, 10);
    return n >= AGE_MIN && n <= AGE_MAX ? n : null;
  }

  function shuffle(list) {
    var a = (list || []).slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function locHero(map) {
    if (!map) return "";
    return map[answers.lang] || map.en || "";
  }

  function uniqueNames(list) {
    var seen = {};
    return (list || []).filter(function (name) {
      var key = String(name || "").trim().toLowerCase();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function themeSuggestions(text) {
    var s = String(text || "").toLowerCase();
    var out = [];
    function add(map) {
      var name = locHero(map);
      if (name) out.push(name);
    }
    if (/(talent|gifted|տաղանդ|талант|talant)/i.test(s)) {
      add({ en: "A little pianist", hy: "Փոքրիկ դաշնակահար", ru: "Маленький пианист" });
      add({ en: "A young painter", hy: "Փոքրիկ նկարիչ", ru: "Юный художник" });
      add({ en: "A backyard inventor", hy: "Բակի գյուտարար", ru: "Дворовый изобретатель" });
    }
    if (/(brave|courage|խիզախ|смел|qaj)/i.test(s)) add({ en: "A brave little fox", hy: "Քաջ աղվեսիկ", ru: "Храбрый лисёнок" });
    if (/(dark|night|մթ|темн|ноч|mtutyun)/i.test(s)) add({ en: "A glowing firefly friend", hy: "Լուսատտիկ ընկեր", ru: "Светлячок-друг" });
    if (/(piano|դաշնամուր|пианин)/i.test(s)) add({ en: "A tiny piano mouse", hy: "Փոքրիկ դաշնամուրային մուկ", ru: "Мышонок-пианист" });
    if (/(friend|ընկեր|друз|ynker)/i.test(s)) add({ en: "A new puppy friend", hy: "Նոր շնիկ ընկեր", ru: "Новый друг-щенок" });
    if (/(school|դպրոց|школ|lesson|դաս|урок|dproc)/i.test(s)) add({ en: "A curious bookworm", hy: "Հետաքրքրասեր գրքային որդ", ru: "Любопытный книжный червячок" });
    if (/(bedtime|sleep|քուն|сон|heqiat|heqyat)/i.test(s)) add({ en: "A sleepy moon bunny", hy: "Քնկոտ լուսնային նապաստակ", ru: "Сонный лунный зайка" });
    if (/(kind|բար|добр)/i.test(s)) add({ en: "A kind little bear", hy: "Բարի արջուկ", ru: "Добрый мишка" });
    return out;
  }

  function analyzeIdea(text) {
    var raw = String(text || "").replace(/\s+/g, " ").trim();
    var toys = [
      { re: /teddy|teddy bear|արջուկ|արջ|плюшев|мишк/i, name: { en: "Teddy bear", hy: "Արջուկ", ru: "Плюшевый мишка" }, kind: "toy" },
      { re: /dinosaur|դինոզավր|динозавр/i, name: { en: "Toy dinosaur", hy: "Խաղալիք դինոզավր", ru: "Игрушечный динозавр" }, kind: "toy" },
      { re: /bunny|rabbit|նապաստակ|зай/i, name: { en: "Bunny", hy: "Նապաստակ", ru: "Зайчик" }, kind: "toy" },
      { re: /dragon|վիշապ|дракон/i, name: { en: "Little dragon", hy: "Փոքր վիշապ", ru: "Маленький дракон" }, kind: "toy" },
      { re: /kitten|kitty|cat|կատվ|кот/i, name: { en: "Kitten", hy: "Կատվիկ", ru: "Котёнок" }, kind: "toy" },
      { re: /puppy|dog|շնիկ|щенок|пёс|пес/i, name: { en: "Puppy", hy: "Շնիկ", ru: "Щенок" }, kind: "toy" },
      { re: /robot|ռոբոտ|робот/i, name: { en: "Robot", hy: "Ռոբոտ", ru: "Робот" }, kind: "toy" },
      { re: /unicorn|միաեղջյուր|единорог/i, name: { en: "Unicorn", hy: "Միաեղջյուր", ru: "Единорог" }, kind: "toy" },
      { re: /doll|տիկնիկ|кукл/i, name: { en: "Favorite doll", hy: "Սիրելի տիկնիկ", ru: "Любимая кукла" }, kind: "toy" },
      { re: /toy|խաղալիք|игруш/i, name: { en: "Favorite toy", hy: "Սիրելի խաղալիք", ru: "Любимая игрушка" }, kind: "toy" },
    ];
    var kids = [
      { re: /\bdaughters?\b|աղջիկ|дочк|девочк/i, name: { en: "Your daughter", hy: "Ձեր աղջիկը", ru: "Ваша дочка" }, kind: "kid" },
      { re: /\bsons?\b|\bсын\b|տղա|мальчик/i, name: { en: "Your son", hy: "Ձեր տղան", ru: "Ваш сын" }, kind: "kid" },
      { re: /\bbaby\b|փոքրիկ|малыш/i, name: { en: "Your baby", hy: "Ձեր փոքրիկը", ru: "Ваш малыш" }, kind: "kid" },
      { re: /\b(my )?kid\b|\bchild\b|երեխ|ребён|ребен/i, name: { en: "Your child", hy: "Ձեր երեխան", ru: "Ваш ребёнок" }, kind: "kid" },
      { re: /\bgirl\b/i, name: { en: "Your girl", hy: "Ձեր աղջիկը", ru: "Ваша девочка" }, kind: "kid" },
      { re: /\bboy\b/i, name: { en: "Your boy", hy: "Ձեր տղան", ru: "Ваш мальчик" }, kind: "kid" },
    ];
    var toy = toys.find(function (item) { return item.re.test(raw); });
    var kid = kids.find(function (item) { return item.re.test(raw); });
    var named = "";
    var namedMatch = raw.match(/(?:make|made|let)\s+(.{2,40}?)\s+the hero/i)
      || raw.match(/(.{2,40}?)\s+is the hero/i)
      || raw.match(/(?:հերոս(?:ը)?)\s+(.{2,40})/i)
      || raw.match(/герой(?:\s*[—\-]\s*|\s+)(.{2,40})/i);
    if (namedMatch) named = namedMatch[1].replace(/[.!?].*$/, "").trim();

    var hero = "";
    var kind = "";
    if (toy && kid && toy.re.source.indexOf("toy|") === -1) {
      hero = locHero(kid.name) + " — " + locHero(toy.name);
      kind = "toy";
    } else if (named && named.length < 48) {
      hero = named;
      kind = "named";
    } else if (toy) {
      hero = locHero(toy.name);
      kind = "toy";
    } else if (kid) {
      hero = locHero(kid.name);
      kind = "kid";
    }

    var suggestions = [];
    if (kid) suggestions.push(locHero(kid.name));
    if (toy) suggestions.push(locHero(toy.name));
    suggestions = suggestions.concat(themeSuggestions(raw));
    if (!suggestions.length) {
      suggestions = suggestions.concat(shuffle(t().heroPool || []).slice(0, 3));
    }
    if (!hero) suggestions.unshift(t().babyHero);
    suggestions = uniqueNames(suggestions.filter(function (name) {
      return !hero || name.toLowerCase() !== hero.toLowerCase();
    })).slice(0, 5);

    return { hero: hero, kind: kind, suggestions: suggestions };
  }

  function analyzeSupport(text) {
    var s = String(text || "");
    if (!s.trim()) return "";
    var rules = [
      { re: /talent|gifted|\bgift\b|տաղանդ|талант|talentos|talentueux|begabt|موهب/i, name: { en: "growing their talent", hy: "զարգացնել տաղանդը", ru: "растить талант", es: "hacer crecer su talento", fr: "faire grandir leur talent", de: "ihr Talent wachsen lassen", it: "far crescere il loro talento", pt: "fazer crescer o talento", ar: "تنمية موهبتهم" } },
      { re: /brave|courage|խիզախ|смел|valent|courageux|mutig|coraj|شجاع/i, name: { en: "feeling brave", hy: "խիզախ զգալ", ru: "чувствовать себя смелым", es: "sentirse valiente", fr: "se sentir courageux", de: "sich mutig fühlen", it: "sentirsi coraggioso", pt: "sentir-se corajoso", ar: "الشعور بالشجاعة" } },
      { re: /confiden|վստահ|уверен|confianza|confiance|selbstvertrau|fiducia|ثقة/i, name: { en: "needs confidence", hy: "վստահության կարիք", ru: "нужна уверенность", es: "necesita confianza", fr: "a besoin de confiance", de: "braucht Selbstvertrauen", it: "ha bisogno di fiducia", pt: "precisa de confiança", ar: "يحتاج ثقة" } },
      { re: /dark|մթ|темн|oscur|noir|dunkel|buio|escuro|ظلام/i, name: { en: "fears the dark", hy: "վախենում է մթից", ru: "боится темноты", es: "miedo a la oscuridad", fr: "peur du noir", de: "Angst vor der Dunkelheit", it: "paura del buio", pt: "medo do escuro", ar: "الخوف من الظلام" } },
      { re: /friend|ընկեր|друз|amig|ami\b|freund|amic|صديق/i, name: { en: "making friends", hy: "նոր ընկերներ", ru: "заводит друзей", es: "hacer amigos", fr: "se faire des amis", de: "Freunde finden", it: "farsi degli amici", pt: "fazer amigos", ar: "تكوين صداقات" } },
      { re: /kind|բար|добр|amab|gentil|freundlichkeit|gentilezz|لطف/i, name: { en: "learning kindness", hy: "սովորում է բարություն", ru: "учится доброте", es: "aprender bondad", fr: "apprendre la gentillesse", de: "Freundlichkeit lernen", it: "imparare la gentilezza", pt: "aprender gentileza", ar: "تعلم اللطف" } },
      { re: /share|կիսվ|делит|compart|partag|teilen|condivid|مشارك/i, name: { en: "learning to share", hy: "սովորել կիսվել", ru: "учиться делиться", es: "aprender a compartir", fr: "apprendre à partager", de: "teilen lernen", it: "imparare a condividere", pt: "aprender a partilhar", ar: "تعلم المشاركة" } },
      { re: /piano|music|դաշնամուր|пианин|música|musique|musik|musica|موسيقى/i, name: { en: "dreaming about music", hy: "երազում է երաժշտության մասին", ru: "мечтает о музыке", es: "sueña con la música", fr: "rêve de musique", de: "träumt von Musik", it: "sogna la musica", pt: "sonha com música", ar: "يحلم بالموسيقى" } },
      { re: /school|lesson|դպրոց|դաս|школ|урок|escuela|école|schule|scuola|escola|مدرس/i, name: { en: "help with today's lesson", hy: "օգնություն այսօրվա դասին", ru: "помочь с уроком", es: "ayuda con la lección de hoy", fr: "aider avec la leçon d’aujourd’hui", de: "Hilfe beim heutigen Unterricht", it: "aiuto con la lezione di oggi", pt: "ajuda com a lição de hoje", ar: "مساعدة في درس اليوم" } },
      { re: /sibling|եղբայր|քույր|брат|сестр|herman|frère|schwester|fratell|irmão|أخ/i, name: { en: "getting along with siblings", hy: "համերաշխություն եղբայրների հետ", ru: "ладить с братьями и сёстрами", es: "llevarse bien con hermanos", fr: "s’entendre avec frères et sœurs", de: "mit Geschwistern klarkommen", it: "andare d’accordo con i fratelli", pt: "dar-se bem com irmãos", ar: "التفاهم مع الإخوة" } },
    ];
    var hit = rules.find(function (rule) {
      return rule.re.test(s);
    });
    return hit ? locHero(hit.name) : "";
  }

  function fillSupportFromIdea() {
    if (answers.support) return;
    var guessed = analyzeSupport(answers.idea);
    if (guessed) answers.support = guessed;
  }

  function isClarifyStep(key) {
    return String(key || "").indexOf("clarify:") === 0;
  }

  function clarifyStepIndex(key) {
    var n = parseInt(String(key || "").split(":")[1], 10);
    return isFinite(n) ? n : -1;
  }

  function currentClarify() {
    return clarifyQs[clarifyStepIndex(step)] || null;
  }

  function clarifyDetails() {
    return (clarifyQs || []).map(function (item) {
      var picked = answers.clarify && answers.clarify[item.id];
      if (!picked || !picked.value) return "";
      return (item.question || item.label || "") + " " + picked.value;
    }).filter(Boolean).join("; ");
  }

  function isAiStep(key) {
    return String(key || "").indexOf("ai:") === 0;
  }

  function aiStepIndex(key) {
    var n = parseInt(String(key || "").split(":")[1], 10);
    return isFinite(n) ? n : -1;
  }

  function currentAiQuestion() {
    return aiQuestions[aiStepIndex(step)] || null;
  }

  function buildQueue() {
    if (aiQuestions && aiQuestions.length) {
      return aiQuestions.map(function (_item, i) {
        return "ai:" + i;
      });
    }
    var q = [];
    (clarifyQs || []).forEach(function (_item, i) {
      q.push("clarify:" + i);
    });
    if (!answers.heroName || ideaHero.hero) q.push("hero");
    if (!answers.image && ideaBrief.photoRelevant !== false) q.push("photo");
    if (!answers.support) q.push("support");
    if (!answers.age) q.push("age");
    return q;
  }

  function findLang(code) {
    return STORY_LANGS.find(function (lang) {
      return lang.code === code;
    }) || { code: code || "en", name: "English", nativeName: "English", flag: "🇺🇸" };
  }

  function topLangs() {
    return TOP_LANG_CODES.map(findLang);
  }

  function moreLangs() {
    var top = {};
    TOP_LANG_CODES.forEach(function (code) {
      top[code] = true;
    });
    return STORY_LANGS.filter(function (lang) {
      return !top[lang.code];
    }).sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  function langLabel(lang) {
    if (!lang) return "";
    return (lang.flag ? lang.flag + " " : "") + lang.nativeName;
  }

  function pickSupport() {
    if (sessionSupport.length) return sessionSupport;
    sessionSupport = shuffle(t().tags).slice(0, 10);
    return sessionSupport;
  }

  function pickHeroes() {
    if (!ideaBrief.used) {
      ideaHero = analyzeIdea(answers.idea);
    } else if (!ideaHero.suggestions.length && !ideaHero.hero) {
      ideaHero.suggestions = analyzeIdea(answers.idea).suggestions;
    }
    sessionHeroes = ideaHero.suggestions.slice();
    return sessionHeroes;
  }

  function hideQcard() {
    var card = document.getElementById("dash-qcard");
    if (card) card.hidden = true;
    waitingOther = false;
    if (!sending) setComposerStop(false);
  }

  function isGenericHeroAsk(text) {
    var s = String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!s) return true;
    return /^(who is the hero\??|who'?s the hero\??|who should be the hero\??|ո՞վ է հերոսը\.?|ով է հերոսը\.?|кто герой\??|quién es el héroe\??|qui est le héros\s*\??|wer ist der held\??|من هو البطل\??|chi è l’eroe\??|chi e l'eroe\??|quem é o herói\??)$/i.test(s);
  }

  function contextualHeroQuestion() {
    var idea = String(answers.idea || "");
    var lang = answers.lang || "en";
    var map = null;
    if (/(talent|gifted|տաղանդ|талант|talant)/i.test(idea)) {
      map = {
        en: "Who should be the talented hero of this story?",
        hy: "Ո՞վ լինի այս տաղանդավոր հեքիաթի հերոսը։",
        ru: "Кто будет талантливым героем этой сказки?",
        es: "¿Quién debería ser el héroe talentoso de este cuento?",
        fr: "Qui devrait être le héros talentueux de cette histoire ?",
        de: "Wer soll der talentierte Held dieser Geschichte sein?",
        it: "Chi dovrebbe essere l’eroe talentuoso di questa storia?",
        pt: "Quem deve ser o herói talentoso desta história?",
        ar: "من يجب أن يكون البطل الموهوب في هذه القصة؟",
      };
    } else if (/(brave|courage|խիզախ|смел|qaj)/i.test(idea)) {
      map = {
        en: "Who should be the brave little hero in this story?",
        hy: "Ո՞վ լինի այս հեքիաթի քաջ փոքրիկ հերոսը։",
        ru: "Кто будет храбрым маленьким героем этой сказки?",
      };
    } else if (/(dark|night|մթ|темн|ноч|mtutyun)/i.test(idea)) {
      map = {
        en: "Who should gently face the dark in this bedtime story?",
        hy: "Ո՞վ պիտի նրբորեն հանդիպի մթին այս գիշերային հեքիաթում։",
        ru: "Кто мягко встретит темноту в этой сказке на ночь?",
      };
    } else if (/(friend|ընկեր|друз|ynker)/i.test(idea)) {
      map = {
        en: "Who should make a new friend in this story?",
        hy: "Ո՞վ պիտի նոր ընկեր գտնի այս հեքիաթում։",
        ru: "Кто найдёт нового друга в этой сказке?",
      };
    } else if (/(school|դպրոց|школ|lesson|դաս|урок|dproc)/i.test(idea)) {
      map = {
        en: "Who should be the curious hero of this school story?",
        hy: "Ո՞վ լինի այս դպրոցական հեքիաթի հետաքրքրասեր հերոսը։",
        ru: "Кто будет любопытным героем этой школьной сказки?",
      };
    } else if (/(axjik|աղջիկ|daughter|girl|дочк|девочк)/i.test(idea)) {
      map = {
        en: "Should your girl be the hero of this story?",
        hy: "Ձեր աղջի՞կը լինի այս հեքիաթի հերոսը։",
        ru: "Ваша девочка будет героиней этой сказки?",
      };
    } else if (/(tgha|տղա|son|boy|\bсын\b|мальчик)/i.test(idea)) {
      map = {
        en: "Should your boy be the hero of this story?",
        hy: "Ձեր տղա՞ն լինի այս հեքիաթի հերոսը։",
        ru: "Ваш мальчик будет героем этой сказки?",
      };
    } else if (ideaBrief.understood) {
      var bit = String(ideaBrief.understood).replace(/\s+/g, " ").trim();
      if (bit.length > 72) bit = bit.slice(0, 69).replace(/\s+\S*$/, "") + "…";
      if (lang === "hy") return "Ո՞վ լինի հերոսը այս գաղափարի համար՝ «" + bit + "»։";
      if (lang === "ru") return "Кто будет героем для идеи «" + bit + "»?";
      return "Who should be the hero for “" + bit + "”?";
    }
    if (map) return map[lang] || map.en;
    return "";
  }

  function questionTitle(key) {
    var pack = t();
    if (isAiStep(key)) {
      var aq = aiQuestions[aiStepIndex(key)];
      return aq && aq.question ? aq.question : "";
    }
    if (key === "age") return pack.qAge;
    if (key === "hero") {
      if (ideaHero.hero) return pack.qHeroConfirm.replace("{hero}", ideaHero.hero);
      if (pack.qHero && !isGenericHeroAsk(pack.qHero)) return pack.qHero;
      return contextualHeroQuestion() || pack.qHero;
    }
    if (key === "photo") return pack.qPhoto;
    if (key === "support") return pack.qSupport;
    if (key === "lang") return pack.qLang;
    if (key === "voice") return pack.voiceWhile;
    if (isClarifyStep(key)) {
      var item = clarifyQs[clarifyStepIndex(key)];
      return item && item.question ? item.question : "";
    }
    return "";
  }

  function questionOptions(key) {
    if (isAiStep(key)) {
      var aq = aiQuestions[aiStepIndex(key)];
      if (!aq) return [];
      if (aq.kind === "photo") {
        return [
          { id: "ai:" + aiStepIndex(key) + ":photo:upload", label: t().photoUpload, icon: "upload" },
          { id: "ai:" + aiStepIndex(key) + ":photo:camera", label: t().photoCamera, icon: "camera" },
          { id: "ai:" + aiStepIndex(key) + ":photo:skip", label: t().skip },
        ];
      }
      if (aq.kind === "age") {
        var ages = (aq.options && aq.options.length ? aq.options : AGE_CHIPS.map(function (n) {
          return { label: String(n), value: String(n) };
        }));
        return ages.map(function (opt, i) {
          return { id: "ai:" + aiStepIndex(key) + ":opt:" + i, label: String(opt.label || opt.value || "") };
        });
      }
      var rows = ((aq.options) || []).map(function (opt, i) {
        var mark = opt.emoji ? String(opt.emoji) + " " : "";
        return { id: "ai:" + aiStepIndex(key) + ":opt:" + i, label: mark + opt.label };
      });
      if (aq.skippable) rows.push({ id: "ai:" + aiStepIndex(key) + ":skip", label: t().skip });
      return rows;
    }
    if (key === "age") {
      return AGE_CHIPS.map(function (n) {
        return { id: "age:" + n, label: String(n) };
      });
    }
    if (key === "hero") {
      if (ideaHero.hero) {
        return [
          { id: "hero:confirm", label: t().confirmHero.replace("{hero}", ideaHero.hero) },
          { id: "hero:another", label: t().anotherHero },
        ];
      }
      var rows = [];
      (sessionHeroes.length ? sessionHeroes : pickHeroes()).forEach(function (name, i) {
        rows.push({ id: "hero:named:" + i, label: name });
      });
      rows.push({ id: "hero:another", label: t().anotherHero });
      return rows;
    }
    if (key === "photo") {
      return [
        { id: "photo:upload", label: t().photoUpload, icon: "upload" },
        { id: "photo:camera", label: t().photoCamera, icon: "camera" },
        { id: "photo:skip", label: t().skip },
      ];
    }
    if (key === "lang") {
      var rows = topLangs().map(function (lang) {
        return { id: "lang:" + lang.code, label: langLabel(lang), on: answers.lang === lang.code };
      });
      rows.push({ id: "lang:more", label: langMoreOpen ? t().fewerLangs : t().moreLangs });
      if (langMoreOpen) {
        moreLangs().forEach(function (lang) {
          rows.push({ id: "lang:" + lang.code, label: langLabel(lang), on: answers.lang === lang.code });
        });
      }
      return rows;
    }
    if (key === "support") {
      var tags = sessionSupport.length ? sessionSupport : pickSupport();
      return tags.map(function (tag, i) {
        return { id: "support:" + i, label: tag.emoji + " " + tag.label };
      });
    }
    if (key === "voice") {
      return [
        { id: "voice:yes", label: t().yes },
        { id: "voice:no", label: t().no },
      ];
    }
    if (isClarifyStep(key)) {
      var item = clarifyQs[clarifyStepIndex(key)];
      var rows = ((item && item.options) || []).map(function (opt, i) {
        var mark = opt.emoji ? String(opt.emoji) + " " : "";
        return { id: "clarify:" + clarifyStepIndex(key) + ":" + i, label: mark + opt.label };
      });
      rows.push({ id: "clarify:" + clarifyStepIndex(key) + ":skip", label: t().skip });
      return rows;
    }
    return [];
  }

  function photoIcon(kind) {
    if (kind === "upload" || kind === "library") {
      return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4 7.5A2.5 2.5 0 0 1 6.5 5h9A2.5 2.5 0 0 1 18 7.5V16a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 15.5v-8zm2.2 9.3 3.1-3.8 2.2 2.6 3-3.7 3.3 4.9H6.2zM8 4h10.5A2.5 2.5 0 0 1 21 6.5V15h-1.5V6.5a1 1 0 0 0-1-1H8V4z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M9 3.8 8 5H5.2A2.2 2.2 0 0 0 3 7.2v11.6A2.2 2.2 0 0 0 5.2 21h13.6A2.2 2.2 0 0 0 21 18.8V7.2A2.2 2.2 0 0 0 18.8 5H16l-1-1.2A2 2 0 0 0 13.4 3H10.6A2 2 0 0 0 9 3.8zM12 18a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>';
  }

  function photoOptionsHtml(prefix) {
    var p = prefix || "photo";
    return (
      '<div class="dash-qphoto">' +
      '<button type="button" class="dash-qphoto-btn" data-opt="' + p + ':upload" aria-label="' +
      escapeHtml(t().photoUpload) +
      '">' +
      photoIcon("upload") +
      "</button>" +
      '<button type="button" class="dash-qphoto-btn" data-opt="' + p + ':camera" aria-label="' +
      escapeHtml(t().photoCamera) +
      '">' +
      photoIcon("camera") +
      "</button>" +
      '<button type="button" class="dash-qphoto-skip" data-opt="' + p + ':skip">' +
      escapeHtml(t().skip) +
      "</button></div>"
    );
  }

  function paintQcard() {
    var card = document.getElementById("dash-qcard");
    var title = document.getElementById("dash-qcard-title");
    var count = document.getElementById("dash-qcard-count");
    var opts = document.getElementById("dash-qcard-opts");
    var elseLabel = document.getElementById("dash-q-else-label");
    var elseBtn = document.getElementById("dash-q-else");
    var insert = document.getElementById("dash-q-insert");
    var insertInput = document.getElementById("dash-q-insert-input");
    var prev = document.getElementById("dash-q-prev");
    var next = document.getElementById("dash-q-next");
    if (!card || !qQueue.length) return;
    var key = qQueue[qIndex] || "";
    step = key;
    waitingOther = false;
    setPlaceholder();
    setComposerStop(true);
    var aq = isAiStep(key) ? aiQuestions[aiStepIndex(key)] : null;
    var effectiveKind = aq ? aq.kind : key;
    if (title) title.textContent = questionTitle(key);
    if (count) count.textContent = qIndex + 1 + " " + t().of + " " + qQueue.length;
    if (opts) {
      opts.classList.toggle("is-tall", key === "lang" && langMoreOpen);
      opts.classList.toggle("is-photo", effectiveKind === "photo");
      opts.innerHTML = effectiveKind === "photo"
        ? photoOptionsHtml(isAiStep(key) ? ("ai:" + aiStepIndex(key) + ":photo") : "photo")
        : questionOptions(key)
        .map(function (opt, i) {
          var hideNum = effectiveKind === "age" || opt.id === "lang:more" || opt.id === "hero:another" || opt.id === "hero:confirm" || /:skip$/.test(opt.id);
          var mark = hideNum ? "" : '<span class="dash-qnum">' + (i + 1) + "</span>";
          return (
            '<button type="button" class="dash-qopt' +
            (opt.on ? " is-on" : "") +
            '" data-opt="' +
            escapeHtml(opt.id) +
            '">' +
            mark +
            "<span>" +
            escapeHtml(effectiveKind === "age" ? opt.label + yearsSuffix() : opt.label) +
            "</span></button>"
          );
        })
        .join("");
      opts.querySelectorAll("[data-opt]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          chooseOption(btn.getAttribute("data-opt"));
        });
      });
    }
    if (elseLabel) elseLabel.textContent = effectiveKind === "hero" ? t().anotherHero : t().somethingElse;
    if (elseBtn) {
        elseBtn.hidden =
        effectiveKind === "photo" ||
        effectiveKind === "support" ||
        effectiveKind === "likes" ||
        effectiveKind === "lang" ||
        effectiveKind === "voice" ||
        effectiveKind === "hero" ||
        effectiveKind === "detail" ||
        isClarifyStep(key) ||
        isAiStep(key);
    }
    if (insert) insert.hidden = true;
    if (insertInput) insertInput.value = "";
    if (prev) prev.disabled = qIndex <= 0;
    if (next) next.disabled = false;
    card.hidden = false;
  }

  function acceptAiAnswer(index, label, value) {
    var aq = aiQuestions[index];
    if (!aq) {
      advanceQ();
      return;
    }
    var text = String(label || value || "").trim();
    var val = String(value || label || "").trim();
    if (aq.kind === "hero") {
      answers.heroKind = "named";
      answers.heroName = val || text;
      if (text) noteAnswer(text);
      advanceQ();
      return;
    }
    if (aq.kind === "support") {
      answers.support = val || text;
      if (text) noteAnswer(text);
      advanceQ();
      return;
    }
    if (aq.kind === "likes") {
      answers.likes = val || text;
      if (text) noteAnswer(text);
      advanceQ();
      return;
    }
    if (aq.kind === "age") {
      var age = parseAge(val || text);
      if (age) {
        acceptAge(age);
        return;
      }
      if (text) noteAnswer(text);
      advanceQ();
      return;
    }
    if (!answers.clarify) answers.clarify = {};
    answers.clarify[aq.id] = { label: text || t().skip, value: val };
    if (!clarifyQs.some(function (item) { return item.id === aq.id; })) {
      clarifyQs.push({ id: aq.id, label: aq.label, question: aq.question, options: aq.options || [] });
    }
    noteAnswer(text || t().skip);
    advanceQ();
  }

  function captureComposerAi() {
    var input = document.getElementById("dash-input");
    var text = input ? input.value.trim() : "";
    if (!text) return false;
    var aq = currentAiQuestion();
    if (!aq || aq.kind === "photo") return false;
    acceptAiAnswer(aiStepIndex(step), text, text);
    if (input) input.value = "";
    setFilled();
    return true;
  }

  function chooseOption(id) {
    var parts = String(id || "").split(":");
    var kind = parts[0];
    if (kind === "ai") {
      var qi = parseInt(parts[1], 10);
      var aq = aiQuestions[qi];
      if (!aq) return;
      if (parts[2] === "skip") {
        acceptAiAnswer(qi, t().skip, "");
        return;
      }
      if (parts[2] === "photo") {
        if (parts[3] === "skip") {
          noteAnswer(t().skip);
          advanceQ();
          return;
        }
        pendingHeroKind = "photo";
        openHeroPhoto(parts[3] === "camera");
        return;
      }
      if (parts[2] === "opt") {
        var opt = aq.options && aq.options[parseInt(parts[3], 10)];
        if (opt) acceptAiAnswer(qi, opt.label, opt.value || opt.label);
      }
      return;
    }
    if (kind === "age") {
      acceptAge(parseAge(parts[1]));
      return;
    }
    if (kind === "hero") {
      if (parts[1] === "another") {
        elseQ();
        var field = document.getElementById("dash-q-insert-input");
        if (field) field.placeholder = t().phHero;
        return;
      }
      if (parts[1] === "confirm" && ideaHero.hero) {
        answers.heroKind = ideaHero.kind || "named";
        answers.heroName = ideaHero.hero;
        noteAnswer(ideaHero.hero);
        advanceQ();
        return;
      }
      if (parts[1] === "baby") {
        answers.heroKind = "kid";
        answers.heroName = t().babyHero;
        noteAnswer(t().babyHero);
        advanceQ();
        return;
      }
      if (parts[1] === "named") {
        var name = sessionHeroes[parseInt(parts[2], 10)] || "";
        answers.heroKind = "named";
        answers.heroName = name;
        noteAnswer(name);
        advanceQ();
      }
      return;
    }
    if (kind === "photo") {
      if (parts[1] === "skip") {
        noteAnswer(t().skip);
        advanceQ();
        return;
      }
      pendingHeroKind = "photo";
      openHeroPhoto(parts[1] === "camera");
      return;
    }
    if (kind === "support") {
      var tag = sessionSupport[parseInt(parts[1], 10)];
      if (tag) acceptSupport(tag.label, tag.value);
      return;
    }
    if (kind === "lang") {
      if (parts[1] === "more") {
        langMoreOpen = !langMoreOpen;
        paintQcard();
        return;
      }
      answers.lang = parts[1] || answers.lang || "en";
      noteAnswer(langLabel(findLang(answers.lang)));
      advanceQ();
      return;
    }
    if (kind === "voice") acceptVoice(parts[1] === "yes");
    if (kind === "clarify") {
      var qi = parseInt(parts[1], 10);
      if (parts[2] === "skip") {
        acceptClarify(qi, t().skip, "");
        return;
      }
      var item = clarifyQs[qi];
      var opt = item && item.options ? item.options[parseInt(parts[2], 10)] : null;
      if (opt) acceptClarify(qi, opt.label, opt.value || opt.label);
    }
  }

  function acceptClarify(index, label, value) {
    var item = clarifyQs[index];
    if (!item) {
      advanceQ();
      return;
    }
    if (!answers.clarify) answers.clarify = {};
    answers.clarify[item.id] = { label: label || value || "", value: value || "" };
    noteAnswer(label || value || t().skip);
    advanceQ();
  }

  function captureComposerSupport() {
    var input = document.getElementById("dash-input");
    var text = input ? input.value.trim() : "";
    if (text && !answers.support) {
      answers.support = text;
      noteAnswer(text);
      if (input) input.value = "";
      setFilled();
    }
  }

  function captureComposerClarify() {
    var input = document.getElementById("dash-input");
    var text = input ? input.value.trim() : "";
    if (!text) return;
    var item = currentClarify();
    if (!item) return;
    if (!answers.clarify) answers.clarify = {};
    answers.clarify[item.id] = { label: text, value: text };
    noteAnswer(text);
    if (input) input.value = "";
  }

  function fallbackParentBrief() {
    var pack = t();
    var hero = heroLabel();
    var support = answers.support || pack.sumSupportNone;
    var recap = ideaBrief.understood || answers.idea || pack.bedtime;
    var age = answers.age;
    var young = age && age <= 4;
    var early = age && age <= 7;
    if (uiLang() === "hy") {
      var hyMind = young
        ? "Նրանց աշխարհը դեռ մոտիկությունից է կառուցվում. միտքը նկարներով է աշխատում, ու նոր բան փորձելուց առաջ ստուգում են՝ դու կողքին ես։"
        : early
          ? "Մտքում հիմա «կարո՞ղ եմ» հարցն է, ու նրանք կարդում են քո դեմքը պատասխանի համար։ Հպարտությունն ու անհանգստությունը կողք կողքի են։"
          : "Նրանք սկսում են իրեն համեմատել ու երկու զգացում միասին պահել, բայց դեռ պետք է իմանան, որ դու հավատում ես իրենց։";
      return {
        insight: hyMind + " «" + support + "» թեման սովորում են հարաբերության միջով, ոչ դասով։ Դու արդեն հոյակապ ծնող ես. այս հեքիաթը խնդրելը նշանակում է, որ կանգնում ես երեխադ կողքին։",
        wow: hero + "-ի հետ մի տաք հեքիաթ կբացի այդ զգացումը խաղով, ոչ դասով։",
        recap: recap,
      };
    }
    if (uiLang() === "ru") {
      var ruMind = young
        ? "Их мир ещё строится из близости: мысль идёт картинками, и перед новым шагом они проверяют, что вы рядом."
        : early
          ? "В голове сейчас вопрос «смогу ли я?» — и они читают ваш взгляд в поисках ответа. Гордость и тревога живут рядом."
          : "Они уже сравнивают себя и держат два чувства сразу, но им всё ещё нужно знать, что вы в них верите.";
      return {
        insight: ruMind + " Тема «" + support + "» усваивается через связь, не через лекцию. Вы уже замечательный родитель: попросить эту сказку — значит встать рядом с ребёнком.",
        wow: "С героем «" + hero + "» тёплая сказка откроет это чувство через игру, не через урок.",
        recap: recap,
      };
    }
    var mind = young
      ? "Inside, their world is still built from closeness: they think in pictures and body-feelings, and they check that you are near before they try something new."
      : early
        ? "Inside, their mind is rehearsing “can I do this?” and reading your face for the answer. Pride and worry sit very close together."
        : age && age <= 12
          ? "Inside, they are starting to compare themselves, hold two feelings at once, and care how they look to others — while still needing to know you believe in them."
          : "Inside, they are building a self that is not only yours. They still need to feel your belief without feeling hovered over.";
    return {
      insight: mind + " Psychology calls this a secure base: children learn “" + support + "” through relationship, not a lecture. Asking for this story already makes you one of the great ones — a parent who shows up.",
      wow: "With " + hero + ", a warm adventure will open that feeling through play, not a lesson.",
      recap: recap,
    };
  }

  function fetchStoryBrief(signal) {
    return fetch(supabaseUrl() + "/functions/v1/claude-proxy/web-story-brief", {
      method: "POST",
      headers: authHeaders(),
      signal: signal,
      body: JSON.stringify({
        idea: answers.idea || "",
        understood: ideaBrief.understood || "",
        hero: heroLabel(),
        support: answers.support || "",
        age: answers.age || undefined,
        language: answers.lang || "en",
        hasPhoto: !!answers.image,
        details: clarifyDetails(),
      }),
    }).then(function (res) {
      if (!res.ok) throw new Error("brief " + res.status);
      return res.json();
    }).then(function (data) {
      return data && data.brief ? data.brief : null;
    });
  }

  function finishQuestionnaire() {
    hideQcard();
    clearSuggest();
    loadParentBrief();
  }

  function loadParentBrief() {
    var existing = document.getElementById("dash-summary");
    if (existing) existing.remove();
    addThinking();
    var think = document.getElementById("dash-thinking");
    if (think) {
      var label = think.querySelector(".dash-think-text");
      if (label) label.textContent = t().shaping || t().thinking;
    }
    loadingTurn = true;
    setComposerStop(true);
    turnAbort = typeof AbortController === "function" ? new AbortController() : null;
    fetchStoryBrief(turnAbort ? turnAbort.signal : undefined)
      .then(function (brief) {
        var thinking = document.getElementById("dash-thinking");
        if (thinking) thinking.remove();
        paintParentBrief(brief || fallbackParentBrief());
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") return;
        var thinking = document.getElementById("dash-thinking");
        if (thinking) thinking.remove();
        paintParentBrief(fallbackParentBrief());
      })
      .then(function () {
        loadingTurn = false;
        turnAbort = null;
        setComposerStop(false);
      });
  }

  function setStoryLanguage(code) {
    var next = String(code || "en").toLowerCase();
    answers.lang = next;
    summaryLangOpen = false;
    langMoreOpen = false;
    loadParentBrief();
  }

  function goNext() {
    var key = qQueue[qIndex];
    if (key === "support") captureComposerSupport();
    if (isClarifyStep(key)) captureComposerClarify();
    if (isAiStep(key)) {
      if (captureComposerAi()) return;
    }
    if (qIndex >= qQueue.length - 1) {
      finishQuestionnaire();
      return;
    }
    advanceQ();
  }

  function advanceQ() {
    if (qIndex < qQueue.length - 1) {
      qIndex += 1;
      if (qQueue[qIndex] === "support") pickSupport();
      if (qQueue[qIndex] === "hero") pickHeroes();
      paintQcard();
      return;
    }
    finishQuestionnaire();
  }

  function closeQ() {
    hideQcard();
  }

  function elseQ() {
    waitingOther = true;
    setPlaceholder();
    var elseBtn = document.getElementById("dash-q-else");
    var insert = document.getElementById("dash-q-insert");
    var field = document.getElementById("dash-q-insert-input");
    if (elseBtn) elseBtn.hidden = true;
    if (insert) insert.hidden = false;
    if (field) {
      field.placeholder = step === "age" ? t().phAge : step === "hero" ? t().phHero : t().phOther;
      field.focus();
    }
  }

  function applyCustomAnswer(text) {
    if (!text) return;
    if (isAiStep(step)) {
      var aq = currentAiQuestion();
      if (aq && aq.kind === "photo") {
        noteAnswer(text);
        advanceQ();
        return;
      }
      acceptAiAnswer(aiStepIndex(step), text, text);
      return;
    }
    if (step === "age") {
      var age = parseAge(text);
      if (age) acceptAge(age);
      return;
    }
    if (step === "hero") {
      answers.heroKind = "described";
      answers.heroName = text;
      noteAnswer(text);
      advanceQ();
      return;
    }
    if (step === "photo") {
      noteAnswer(text);
      advanceQ();
      return;
    }
    if (step === "support") acceptSupport(text, text);
    if (isClarifyStep(step)) acceptClarify(clarifyStepIndex(step), text, text);
  }

  function resetIdeaBrief() {
    ideaBrief = {
      used: false,
      understood: "",
      reply: "",
      photoRelevant: true,
      languageClear: false,
    };
    ideaHero = { hero: "", kind: "", suggestions: [] };
    sessionHeroes = [];
    sessionSupport = [];
    clarifyQs = [];
    aiQuestions = [];
    chatCopy = {};
  }

  function applyIdeaBrief(brief) {
    if (!brief || typeof brief !== "object") return false;
    ideaBrief.used = true;
    ideaBrief.understood = String(brief.understood || "").trim();
    ideaBrief.reply = String(brief.reply || "").trim();
    ideaBrief.photoRelevant = brief.photoRelevant !== false;
    ideaBrief.languageClear = brief.languageClear === true && !!brief.language;

    var hero = String(brief.hero || "").trim();
    var suggestions = Array.isArray(brief.heroSuggestions) ? brief.heroSuggestions : [];
    ideaHero = {
      hero: brief.heroClear && hero ? hero : "",
      kind: brief.heroKind === "kid" || brief.heroKind === "toy" || brief.heroKind === "named" ? brief.heroKind : "",
      suggestions: suggestions.map(function (name) { return String(name || "").trim(); }).filter(Boolean).slice(0, 5),
    };
    sessionHeroes = ideaHero.suggestions.slice();
    if (brief.heroClear && hero) {
      answers.heroName = hero;
      answers.heroKind = ideaHero.kind || "named";
    }

    if (brief.support) {
      answers.support = String(brief.support).trim();
    }
    if (Array.isArray(brief.supportSuggestions) && brief.supportSuggestions.length) {
      sessionSupport = brief.supportSuggestions.map(function (tag) {
        if (typeof tag === "string") return { emoji: "", label: tag, value: tag };
        return {
          emoji: String((tag && tag.emoji) || ""),
          label: String((tag && (tag.label || tag.value)) || "").trim(),
          value: String((tag && (tag.value || tag.label)) || "").trim(),
        };
      }).filter(function (tag) { return tag.label; }).slice(0, 8);
    }

    var age = parseAge(brief.age);
    if (age) {
      answers.age = age;
      if (draft().setAge) draft().setAge(age);
    }
    if (brief.language) {
      answers.lang = String(brief.language).toLowerCase();
    }
    if (looksLikeArmenianTranslit(answers.idea)) answers.lang = "hy";
    // Only adopt model-generated chat copy when it matches the app UI language.
    // Typing Armenian may set story language to hy without rewriting English UI.
    if (brief.copy && typeof brief.copy === "object") {
      var briefLang = String(brief.language || "").toLowerCase().split("-")[0];
      if (!briefLang || briefLang === uiLang()) {
        chatCopy = tidyChatCopy(brief.copy);
      }
    }
    clarifyQs = Array.isArray(brief.clarify) ? brief.clarify.map(function (item, i) {
      if (!item || typeof item !== "object") return null;
      var question = String(item.question || "").trim();
      var options = Array.isArray(item.options) ? item.options.map(function (opt) {
        if (typeof opt === "string") return { emoji: "", label: opt, value: opt };
        return {
          emoji: String((opt && opt.emoji) || ""),
          label: String((opt && (opt.label || opt.value)) || "").trim(),
          value: String((opt && (opt.value || opt.label)) || "").trim(),
        };
      }).filter(function (opt) { return opt.label; }).slice(0, 6) : [];
      if (!question || options.length < 2) return null;
      return {
        id: String(item.id || ("detail" + (i + 1))).toLowerCase().replace(/[^a-z0-9_-]+/g, "") || ("detail" + (i + 1)),
        label: String(item.label || "").trim() || question.split(/\s+/).slice(0, 3).join(" "),
        question: question,
        options: options,
      };
    }).filter(Boolean).slice(0, 2) : [];

    aiQuestions = Array.isArray(brief.questions) ? brief.questions.map(function (item, i) {
      if (!item || typeof item !== "object") return null;
      var kind = String(item.kind || "detail").toLowerCase();
      if (kind === "like" || kind === "interest" || kind === "interests") kind = "likes";
      if (["hero", "support", "age", "photo", "detail", "likes"].indexOf(kind) < 0) kind = "detail";
      var question = String(item.question || "").trim();
      if (!question) return null;
      var options = Array.isArray(item.options) ? item.options.map(function (opt) {
        if (typeof opt === "string") return { emoji: "", label: opt, value: opt };
        return {
          emoji: String((opt && opt.emoji) || ""),
          label: String((opt && (opt.label || opt.value)) || "").trim(),
          value: String((opt && (opt.value || opt.label)) || "").trim(),
        };
      }).filter(function (opt) { return opt.label; }).slice(0, kind === "age" ? 8 : 6) : [];
      if (kind === "age" && options.length < 2) {
        options = AGE_CHIPS.map(function (n) {
          return { emoji: "", label: String(n), value: String(n) };
        });
      }
      if (kind !== "photo" && kind !== "age" && options.length < 2) {
        if (kind === "hero" && ideaHero.suggestions.length) {
          options = ideaHero.suggestions.map(function (name) {
            return { emoji: "", label: name, value: name };
          });
        } else if (kind === "support" && sessionSupport.length) {
          options = sessionSupport.slice(0, 6);
        } else {
          return null;
        }
      }
      if (kind === "hero" && answers.heroName && brief.heroClear) return null;
      if (kind === "support" && answers.support && brief.supportClear) return null;
      if (kind === "likes" && answers.likes) return null;
      if (kind === "age" && answers.age) return null;
      if (kind === "photo" && (answers.image || brief.photoRelevant === false)) return null;
      return {
        id: String(item.id || (kind + (i + 1))).toLowerCase().replace(/[^a-z0-9_-]+/g, "") || (kind + (i + 1)),
        kind: kind,
        label: String(item.label || "").trim() || question.split(/\s+/).slice(0, 3).join(" "),
        question: question,
        options: options,
        skippable: item.skippable === true || kind === "photo" || kind === "detail" || kind === "likes",
      };
    }).filter(Boolean).slice(0, 6) : [];

    if (!aiQuestions.length && clarifyQs.length) {
      aiQuestions = clarifyQs.map(function (item) {
        return {
          id: item.id,
          kind: "detail",
          label: item.label,
          question: item.question,
          options: item.options,
          skippable: true,
        };
      });
    }
    if (aiQuestions.length && !answers.age && !aiQuestions.some(function (q) { return q.kind === "age"; })) {
      aiQuestions.push({
        id: "age",
        kind: "age",
        label: "Age",
        question: (chatCopy && chatCopy.qAge) || t().qAge,
        options: AGE_CHIPS.map(function (n) {
          return { emoji: "", label: String(n), value: String(n) };
        }),
        skippable: false,
      });
    }
    // Age is always last.
    if (aiQuestions.length) {
      var ageQs = aiQuestions.filter(function (q) { return q.kind === "age"; });
      var otherQs = aiQuestions.filter(function (q) { return q.kind !== "age"; });
      aiQuestions = ageQs.length ? otherQs.concat([ageQs[0]]) : otherQs;
    }
    return true;
  }

  function fetchIdeaBrief(idea, hasPhoto, signal) {
    return fetch(supabaseUrl() + "/functions/v1/claude-proxy/web-idea-brief", {
      method: "POST",
      headers: authHeaders(),
      signal: signal,
      body: JSON.stringify({
        idea: idea || "",
        hasPhoto: !!hasPhoto,
        language: answers.lang || "en",
      }),
    }).then(function (res) {
      if (!res.ok) throw new Error("brief " + res.status);
      return res.json();
    }).then(function (data) {
      return data && data.brief ? data.brief : null;
    });
  }

  function openQuestionnaire(intro) {
    qQueue = buildQueue();
    qIndex = 0;
    pickHeroes();
    pickSupport();
    addAiBubble(intro || ideaBrief.reply || t().intro);
    if (!qQueue.length) {
      finishQuestionnaire();
      return;
    }
    paintQcard();
  }

  function askStep(nextStep) {
    if (nextStep === "summary") {
      paintSummary();
      return;
    }
    if (nextStep === "create") {
      startStory();
      return;
    }
    var idx = qQueue.indexOf(nextStep);
    if (idx >= 0) {
      qIndex = idx;
      paintQcard();
      return;
    }
    qQueue = [nextStep];
    qIndex = 0;
    if (nextStep === "hero") pickHeroes();
    if (nextStep === "support") pickSupport();
    paintQcard();
  }

  function addAiBubble(text) {
    var thread = threadEl();
    if (!thread) return;
    var el = document.createElement("div");
    el.className = "dash-msg is-ai";
    el.textContent = text;
    thread.appendChild(el);
    scrollThread();
  }

  function paintAsk(question, forStep) {
    addAiBubble(question);
    showAskbar(question, chipsHtml(forStep));
    var box = suggestEl();
    if (box) bindAsk(box, forStep);
    scrollThread();
  }

  function chipsHtml(forStep) {
    if (forStep === "age") {
      return (
        '<div class="dash-chips">' +
        AGE_CHIPS.map(function (n) {
          return '<button type="button" class="dash-chip" data-age="' + n + '">' + n + "</button>";
        }).join("") +
        '<button type="button" class="dash-chip" data-age="other">' + escapeHtml(t().other) + "</button></div>"
      );
    }
    if (forStep === "hero") {
      return (
        '<div class="dash-chips">' +
        '<button type="button" class="dash-chip" data-hero="kid">' + escapeHtml(t().kid) + "</button>" +
        '<button type="button" class="dash-chip" data-hero="toy">' + escapeHtml(t().toy) + "</button>" +
        '<button type="button" class="dash-chip dash-chip-cam" data-hero="photo" aria-label="Take photo">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 3.8 8 5H5.2A2.2 2.2 0 0 0 3 7.2v11.6A2.2 2.2 0 0 0 5.2 21h13.6A2.2 2.2 0 0 0 21 18.8V7.2A2.2 2.2 0 0 0 18.8 5H16l-1-1.2A2 2 0 0 0 13.4 3H10.6A2 2 0 0 0 9 3.8zM12 18a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>' +
        "</button>" +
        '<button type="button" class="dash-chip" data-hero="skip">' + escapeHtml(t().skip) + "</button></div>"
      );
    }
    if (forStep === "support") {
      return (
        '<div class="dash-chips">' +
        supportTags().map(function (tag, i) {
          return (
            '<button type="button" class="dash-chip dash-tag" data-support="' +
            i +
            '">' +
            tag.emoji +
            " " +
            escapeHtml(tag.label) +
            "</button>"
          );
        }).join("") +
        '<button type="button" class="dash-chip" data-support="other">' + escapeHtml(t().other) + "</button></div>"
      );
    }
    if (forStep === "voice") {
      return (
        '<div class="dash-chips">' +
        '<button type="button" class="dash-chip" data-voice="yes">' + escapeHtml(t().yes) + "</button>" +
        '<button type="button" class="dash-chip" data-voice="no">' + escapeHtml(t().no) + "</button></div>"
      );
    }
    return "";
  }

  function langName(code) {
    var pack = t();
    if (code === "hy") return pack.langHy;
    if (code === "ru") return pack.langRu;
    return pack.langEn;
  }

  function heroLabel() {
    if (answers.heroName) return answers.heroName;
    if (answers.heroKind === "kid") return t().babyHero;
    if (answers.heroKind === "toy") return t().toy;
    if (answers.idea) return answers.idea;
    return t().babyHero;
  }

  function summaryPhotoHtml() {
    if (answers.image) {
      return '<img class="dash-summary-photo" src="' + answers.image + '" alt="">';
    }
    return (
      '<div class="dash-summary-photo-actions">' +
      '<button type="button" class="dash-summary-photo-btn" data-sum-photo="upload" aria-label="' +
      escapeHtml(t().photoUpload) +
      '">' +
      photoIcon("library") +
      "</button>" +
      '<button type="button" class="dash-summary-photo-btn" data-sum-photo="camera" aria-label="' +
      escapeHtml(t().photoCamera) +
      '">' +
      photoIcon("camera") +
      "</button></div>"
    );
  }

  function summaryLangPickerHtml() {
    var buttons = topLangs().map(function (lang) {
      return (
        '<button type="button" class="dash-summary-langbtn' +
        (answers.lang === lang.code ? " is-on" : "") +
        '" data-sum-lang="' +
        escapeHtml(lang.code) +
        '">' +
        escapeHtml(langLabel(lang)) +
        "</button>"
      );
    });
    buttons.push(
      '<button type="button" class="dash-summary-langbtn" data-sum-lang="more">' +
        escapeHtml(langMoreOpen ? t().fewerLangs : t().moreLangs) +
        "</button>"
    );
    if (langMoreOpen) {
      moreLangs().forEach(function (lang) {
        buttons.push(
          '<button type="button" class="dash-summary-langbtn' +
            (answers.lang === lang.code ? " is-on" : "") +
            '" data-sum-lang="' +
            escapeHtml(lang.code) +
            '">' +
            escapeHtml(langLabel(lang)) +
            "</button>"
        );
      });
    }
    return '<div class="dash-summary-langs">' + buttons.join("") + "</div>";
  }

  function summaryHtml(brief) {
    brief = brief || parentBrief || {};
    var pack = t();
    return (
      '<article class="dash-summary">' +
      '<p class="dash-summary-kicker"><span class="dash-spark"></span>' + escapeHtml(pack.summaryTitle) + "</p>" +
      (brief.insight ? '<p class="dash-summary-insight">' + escapeHtml(fillSlots(brief.insight)) + "</p>" : "") +
      (brief.wow
        ? '<p class="dash-summary-wow"><strong>' + escapeHtml(stripSlots(pack.sumWow)) + "</strong>" + escapeHtml(fillSlots(brief.wow)) + "</p>"
        : "") +
      "<dl>" +
      "<div><dt>" + escapeHtml(stripSlots(pack.sumHero)) + "</dt><dd>" + escapeHtml(heroLabel()) + "</dd></div>" +
      "<div><dt>" + escapeHtml(stripSlots(pack.sumSupport)) + "</dt><dd>" + escapeHtml(answers.support || pack.sumSupportNone) + "</dd></div>" +
      (answers.likes
        ? "<div><dt>" + escapeHtml(uiLang() === "hy" ? "Սիրում է" : uiLang() === "ru" ? "Любит" : "Likes") + "</dt><dd>" + escapeHtml(answers.likes) + "</dd></div>"
        : "") +
      (clarifyQs || []).map(function (item) {
        var picked = answers.clarify && answers.clarify[item.id];
        if (!picked || !picked.label) return "";
        return "<div><dt>" + escapeHtml(item.label) + "</dt><dd>" + escapeHtml(picked.label) + "</dd></div>";
      }).join("") +
      '<div class="dash-summary-langrow"><dt>' +
      escapeHtml(stripSlots(pack.sumLang)) +
      "</dt><dd><span>" +
      escapeHtml(langLabel(findLang(answers.lang))) +
      '</span><button type="button" class="dash-lang-change" data-lang-toggle>' +
      escapeHtml(pack.changeLang) +
      "</button></dd></div>" +
      "</dl>" +
      (summaryLangOpen ? summaryLangPickerHtml() : "") +
      summaryPhotoHtml() +
      '<button type="button" class="dash-create-btn" data-create="1">' + escapeHtml(pack.createStory) + "</button>" +
      "</article>"
    );
  }

  function bindSummaryActions(wrap) {
    if (!wrap) return;
    var createBtn = wrap.querySelector("[data-create]");
    if (createBtn) {
      createBtn.addEventListener("click", function () {
        if (sending) return;
        noteAnswer(t().createStory);
        startStory();
      });
    }
    wrap.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        summaryLangOpen = !summaryLangOpen;
        langMoreOpen = false;
        paintSummary();
      });
    });
    wrap.querySelectorAll("[data-sum-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-sum-lang") || "";
        if (code === "more") {
          langMoreOpen = !langMoreOpen;
          paintSummary();
          return;
        }
        setStoryLanguage(code || "en");
      });
    });
    wrap.querySelectorAll("[data-sum-photo]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openHeroPhoto(btn.getAttribute("data-sum-photo") === "camera");
      });
    });
  }

  function paintParentBrief(brief) {
    parentBrief = {
      insight: String((brief && brief.insight) || "").trim(),
      wow: String((brief && brief.wow) || "").trim(),
      recap: String((brief && brief.recap) || "").trim(),
    };
    hideQcard();
    clearSuggest();
    step = "summary";
    waitingOther = false;
    setPlaceholder();
    var existing = document.getElementById("dash-summary");
    if (existing) existing.remove();
    var thread = threadEl();
    var wrap = document.createElement("div");
    wrap.id = "dash-summary";
    wrap.innerHTML = summaryHtml(parentBrief);
    if (thread) {
      thread.appendChild(wrap);
      scrollThread();
    }
    bindSummaryActions(wrap);
  }

  function paintSummary() {
    paintParentBrief(parentBrief.insight ? parentBrief : fallbackParentBrief());
  }

  function setPin(text, ready) {
    var pin = document.getElementById("dash-pin");
    var label = document.getElementById("dash-pin-text");
    var go = document.getElementById("dash-pin-go");
    if (!pin) return;
    pin.hidden = !text;
    pin.classList.toggle("is-ready", !!ready);
    if (label) label.textContent = text || "";
    if (go) {
      go.hidden = !ready;
      go.textContent = t().openLibrary;
    }
  }

  function bindAsk(card, forStep) {
    card.querySelectorAll("[data-age]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (loadingTurn || sending) return;
        var key = btn.getAttribute("data-age");
        if (key === "other") {
          waitingOther = true;
          setPlaceholder();
          var input = document.getElementById("dash-input");
          if (input) input.focus();
          return;
        }
        acceptAge(parseAge(key));
      });
    });
    card.querySelectorAll("[data-hero]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (loadingTurn || sending) return;
        var kind = btn.getAttribute("data-hero");
        if (kind === "skip") {
          if (pendingHeroKind === "kid" || pendingHeroKind === "toy") {
            answers.heroKind = pendingHeroKind;
            pendingHeroKind = "";
            clearSuggest();
            noteAnswer(t().skip);
            askStep("support");
            return;
          }
          acceptHero("skip", answers.image || "");
          return;
        }
        if (kind === "photo") {
          pendingHeroKind = pendingHeroKind || "photo";
          openHeroPhoto(true);
          return;
        }
        pendingHeroKind = kind;
        clearSuggest();
        noteAnswer(kind === "kid" ? t().kid : t().toy);
        paintHeroFollowup();
        openHeroPhoto(false);
      });
    });
    card.querySelectorAll("[data-support]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (loadingTurn || sending) return;
        var key = btn.getAttribute("data-support");
        if (key === "other") {
          waitingOther = true;
          setPlaceholder();
          var input = document.getElementById("dash-input");
          if (input) input.focus();
          return;
        }
        var tag = supportTags()[parseInt(key, 10)];
        if (tag) acceptSupport(tag.label, tag.value);
      });
    });
    card.querySelectorAll("[data-voice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (loadingTurn && !sending) return;
        acceptVoice(btn.getAttribute("data-voice") === "yes");
      });
    });
    card.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setStoryLanguage(btn.getAttribute("data-lang") || "en");
      });
    });
    card.querySelectorAll("[data-create]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (sending) return;
        noteAnswer(t().createStory);
        startStory();
      });
    });
  }

  function acceptAge(age) {
    if (!age) return;
    answers.age = age;
    if (draft().setAge) draft().setAge(age);
    clearSuggest();
    noteAnswer(age + yearsSuffix());
    advanceQ();
  }

  function paintHeroFollowup() {
    var chips =
      '<button type="button" class="dash-chip dash-chip-cam" data-hero="photo" aria-label="Take photo">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 3.8 8 5H5.2A2.2 2.2 0 0 0 3 7.2v11.6A2.2 2.2 0 0 0 5.2 21h13.6A2.2 2.2 0 0 0 21 18.8V7.2A2.2 2.2 0 0 0 18.8 5H16l-1-1.2A2 2 0 0 0 13.4 3H10.6A2 2 0 0 0 9 3.8zM12 18a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>' +
      "</button>" +
      '<button type="button" class="dash-chip" data-hero="skip">' + escapeHtml(t().skip) + "</button>";
    showAskbar(t().fallbacks.hero, chips);
    var box = suggestEl();
    if (box) bindAsk(box, "hero");
  }

  function acceptHero(kind, image) {
    answers.heroKind = kind;
    if (image) {
      answers.image = image;
      if (draft().setImage) draft().setImage(image);
    }
    clearSuggest();
    var label =
      kind === "kid" ? t().kid : kind === "toy" ? t().toy : kind === "skip" ? t().skip : t().kid;
    noteAnswer(label, image || "");
    advanceQ();
  }

  function acceptSupport(label, value) {
    answers.support = value || label || "";
    waitingOther = false;
    noteAnswer(label || value);
    advanceQ();
  }

  function acceptVoice(yes) {
    answers.voice = yes;
    hideQcard();
    noteAnswer(yes ? t().yes : t().no);
    var list = readStories();
    if (list[0] && step === "done") {
      list[0].voice = yes;
      writeStories(list);
    }
    clearSuggest();
  }

  function openHeroPhoto(preferCapture) {
    var capture = document.getElementById("dash-photo-capture");
    var photo = document.getElementById("dash-photo");
    var target = preferCapture && capture ? capture : photo || capture;
    if (target) target.click();
  }

  function handlePhotoFile(file) {
    if (!file || !draft().compressImage) return;
    draft()
      .compressImage(file)
      .then(function (dataUrl) {
        if (step === "photo" || step === "hero" || (isAiStep(step) && currentAiQuestion() && currentAiQuestion().kind === "photo")) {
          answers.image = dataUrl;
          if (draft().setImage) draft().setImage(dataUrl);
          if (pendingHeroKind === "kid" || pendingHeroKind === "toy") {
            if (!answers.heroKind) answers.heroKind = pendingHeroKind;
            if (!answers.heroName) answers.heroName = pendingHeroKind === "toy" ? t().toy : t().babyHero;
          }
          pendingHeroKind = "";
          noteAnswer("", dataUrl);
          advanceQ();
          return;
        }
        if (step === "summary") {
          answers.image = dataUrl;
          if (draft().setImage) draft().setImage(dataUrl);
          paintSummary();
          return;
        }
        answers.image = dataUrl;
        if (draft().setImage) draft().setImage(dataUrl);
        paintThumbs();
      })
      .catch(function () {});
  }

  function paintThumbs() {
    var thumbs = document.getElementById("dash-thumbs");
    var src = answers.image || (draft().getImage ? draft().getImage() : "");
    if (!thumbs) return;
    if (!src || (step !== "idle" && step !== "done")) {
      thumbs.hidden = true;
      thumbs.innerHTML = "";
      return;
    }
    thumbs.hidden = false;
    thumbs.innerHTML =
      '<div class="dash-thumb"><img src="' +
      src +
      '" alt=""><button type="button" class="dash-thumb-x" aria-label="Remove">&times;</button></div>';
    var x = thumbs.querySelector(".dash-thumb-x");
    if (x) {
      x.addEventListener("click", function () {
        answers.image = "";
        if (draft().setImage) draft().setImage("");
        paintThumbs();
      });
    }
  }

  function addStatus() {
    var thread = threadEl();
    var el = document.createElement("div");
    el.className = "dash-msg is-ai";
    el.innerHTML =
      '<div class="dash-think">' +
      '<div class="dash-think-line"><span class="dash-spark"></span><span class="dash-think-text">' +
      t().status[0] +
      "</span></div>" +
      '<div class="dash-stream" hidden></div></div>';
    thread.appendChild(el);
    scrollThread();
    return el;
  }

  function setStatus(el, i, extra) {
    var label = el.querySelector(".dash-think-text");
    if (label) label.textContent = extra || t().status[Math.min(i, t().status.length - 1)];
  }

  function finishBubble(el, title, body, cover) {
    el.className = "dash-msg is-ai";
    var img = cover ? '<img class="dash-cover" src="' + cover + '" alt="">' : "";
    var voiceNote = answers.voice ? "\n\n" + t().voiceNote : "";
    el.innerHTML =
      img +
      "<strong>" +
      escapeHtml(title || "Your story") +
      "</strong>\n\n" +
      escapeHtml(body || "") +
      (voiceNote ? "<em>" + voiceNote + "</em>" : "");
    scrollThread();
  }

  function commaList(value) {
    return String(value || "")
      .split(",")
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  /**
   * The one request object the server reads (schemaVersion 2). Guided create supplies a
   * full summary plan; the chat flow has no plan, so its answers are mapped to the same
   * shape here instead of being posted as loose fields.
   */
  function storyRequestPayload() {
    var plan = answers.summaryPlan;
    var lang = plan ? plan.storyLanguage || answers.lang : answers.lang;
    var chosen = findLang(lang);
    var payload = {
      schemaVersion: 2,
      uiLanguage: (plan && plan.uiLanguage) || siteLang(),
      storyLanguage: { code: chosen.code || lang || "en", name: chosen.name || "" },
      childProfileId: (plan && plan.childProfileId) || answers.childProfileId || "",
    };
    if (plan) {
      payload.audience = { age: (plan.audience && plan.audience.age) || answers.age || null };
      payload.child = {
        gender: (plan.child && plan.child.gender) || answers.childGender || "",
        interests: (plan.child && Array.isArray(plan.child.interests)) ? plan.child.interests : [],
      };
      payload.storyKind = plan.storyKind || "custom";
      payload.storyHelp = {
        mode: plan.purpose || "fun",
        value: (plan.direction && plan.direction.answer) || "",
        source: (plan.direction && plan.direction.source) || "selection",
      };
      payload.hero = Object.assign({}, plan.hero || {});
      if (/child|kid/i.test(String(payload.hero.mode || answers.heroKind || ""))) {
        payload.hero.mode = "child";
        payload.hero.characterType = payload.hero.characterType || "human child";
        payload.hero.description = payload.hero.description ||
          humanChildHeroLabel(payload.child.gender || answers.childGender);
      }
      payload.additionalContext = plan.additionalContext || "";
      return payload;
    }
    var heroMode = answers.heroKind === "kid"
      ? "child"
      : answers.heroKind === "madeup"
      ? "created"
      : "decide";
    var context = [answers.idea, answers.setting].filter(Boolean).join(". ");
    payload.audience = { age: answers.age || null };
    payload.child = { gender: answers.childGender || "", interests: commaList(answers.likes) };
    // No intent chip in the chat flow: the typed idea still drives the story type.
    payload.storyKind = answers.idea || "custom";
    payload.storyHelp = {
      mode: answers.support ? "support" : "fun",
      value: answers.support || "",
      source: "text",
    };
    payload.hero = {
      mode: heroMode,
      // Child name is audience-only unless the child is explicitly the hero.
      name: heroMode === "child"
        ? (answers.heroName || answers.childName || "")
        : (answers.heroName || ""),
      characterType: heroMode === "child" ? "human child" : "",
      description: heroMode === "child" ? humanChildHeroLabel(answers.childGender) : "",
      photoProvided: !!answers.image,
      interests: commaList(answers.likes),
    };
    payload.additionalContext = context;
    return payload;
  }

  function createStoryJob(signal) {
    var base = supabaseUrl();
    var s = session();
    if (!base || !s || !s.access_token) return Promise.reject(new Error("Sign in to create a story."));
    return fetch(base + "/functions/v1/story-creation/jobs", {
      method: "POST",
      headers: authHeaders(),
      signal: signal,
      body: JSON.stringify(storyRequestPayload()),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var quotaExceeded =
            res.status === 402 ||
            data.code === "STORY_QUOTA_EXCEEDED" ||
            /no stories remaining/i.test(String(data.error || ""));
          var error = new Error(
            quotaExceeded
              ? "You have no stories remaining. Upgrade to create more."
              : data.error || "Could not start story creation."
          );
          error.quotaExceeded = quotaExceeded;
          throw error;
        }
        return data;
      });
    });
  }

  function waitForStoryJob(jobId, signal) {
    var base = supabaseUrl();
    function poll() {
      if (signal && signal.aborted) return Promise.reject(new DOMException("Aborted", "AbortError"));
      return fetch(base + "/functions/v1/story-creation/jobs/" + encodeURIComponent(jobId), {
        headers: authHeaders(),
        signal: signal,
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.error || "Could not check story creation.");
          if (data.status === "completed") {
            if (data.result) return data.result;
            // A completed job with no result used to poll forever, leaving the UI stuck
            // on "writing" with no story and no error.
            throw new Error("The story finished without any text. Please try again.");
          }
          if (data.status === "failed" || data.status === "cancelled") {
            var rawErr = String(data.error || "Story creation did not finish.");
            var checkFailed = /WRITER_OUTPUT_INVALID/i.test(rawErr);
            var err = new Error(
              checkFailed
                ? "The story came back unreadable. Please try again."
                : rawErr
            );
            err.storyCheckFailed = checkFailed;
            throw err;
          }
          return new Promise(function (resolve) { window.setTimeout(resolve, 1400); }).then(poll);
        });
      });
    }
    return poll();
  }

  function cancelStoryJob(jobId) {
    if (!jobId || !supabaseUrl()) return Promise.resolve();
    return fetch(supabaseUrl() + "/functions/v1/story-creation/jobs/" + encodeURIComponent(jobId) + "/cancel", {
      method: "POST",
      headers: authHeaders(),
      body: "{}",
    }).catch(function () {});
  }

  /**
   * Writer returns a short English cover beat only. This assembler builds the final fal
   * prompt as Style → Scene → Composition (same contract as the app).
   */
  var ILLUSTRATION_ART_STYLE =
    "Authentic claymation stop-motion film still, whimsical character design. Tactile polymer clay and plasticine, sculpted with visible fingerprints, surface imperfections, and soft smudges. Handcrafted miniature diorama set with real-world materials. Shot with macro photography, shallow depth of field (bokeh), and cinematic miniature studio lighting";
  var ILLUSTRATION_COMPOSITION_DEFAULT = "dynamic action shot, sense of the action";
  var HERO_REFERENCE_FACE_PHRASE = "with the face of the reference image";

  function normalizePromptText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function resolvedChildGender() {
    var plan = answers.summaryPlan;
    var fromPlan = plan && plan.child && plan.child.gender;
    return String(answers.childGender || fromPlan || "").trim().toLowerCase();
  }

  /** Kid-as-hero covers must stay a human child with the right gender — never an animal/toy morph. */
  function humanChildHeroLabel(gender) {
    var g = String(gender || "").trim().toLowerCase();
    if (g === "girl") return "a human girl";
    if (g === "boy") return "a human boy";
    return "a human child";
  }

  function isKidHeroKind(kind) {
    return /^(kid|child)$/i.test(String(kind || "").trim());
  }

  function isStoryDecidesHero() {
    var kind = String(answers.heroKind || "").trim().toLowerCase();
    if (/^(surprise|decide|story_decides)$/i.test(kind)) return true;
    var plan = answers.summaryPlan;
    if (plan && plan.hero && /decide/i.test(String(plan.hero.mode || ""))) return true;
    var name = String(answers.heroName || "").trim().toLowerCase();
    return /let the story decide|story (will )?decide|թող հեքիաթը որոշի|пусть сказка решит/i.test(name);
  }

  function illustrationSummaryHero() {
    // Child name is audience ("for whom") — only use it when the child is the hero.
    if (isKidHeroKind(answers.heroKind)) {
      return humanChildHeroLabel(resolvedChildGender());
    }
    var plan = answers.summaryPlan;
    if (plan && plan.hero && /child/i.test(String(plan.hero.mode || ""))) {
      return humanChildHeroLabel(resolvedChildGender());
    }
    if (isStoryDecidesHero()) return "a whimsical story hero";
    var heroName = String(answers.heroName || "").trim();
    if (heroName && !/let the story decide|story (will )?decide|թող հեքիաթը որոշի|пусть сказка решит/i.test(heroName)) {
      return heroName;
    }
    if (plan && plan.hero) {
      var created = [plan.hero.characterType, plan.hero.description].filter(Boolean).join(", ");
      if (created) return created;
    }
    return "a whimsical story hero";
  }

  function heroLabelForScene(summaryHero, hasPhoto) {
    var label = normalizePromptText(summaryHero)
      .replace(/\bthe hero\b/gi, "")
      .replace(/\bhero\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!label) label = "a child";
    if (!/^(a|an|the)\s+/i.test(label)) {
      label = /^[aeiou]/i.test(label) ? "an " + label : "a " + label;
    }
    if (hasPhoto && !new RegExp(HERO_REFERENCE_FACE_PHRASE, "i").test(label)) {
      return label + " " + HERO_REFERENCE_FACE_PHRASE;
    }
    return label;
  }

  function actionFromCoverBeat(beat) {
    var cleaned = normalizePromptText(beat)
      .replace(/^cinematic,?\s*wide-angle\s*movie\s*still\.?\s*/i, "")
      .replace(/\b(claymation|stop-motion|watercolor|composition|camera|lens|bokeh|no text)\b/gi, "")
      .replace(/,?\s*[\w\s-]+\s+emotion[.!]?$/i, "")
      .trim();
    cleaned = cleaned.replace(
      /^(?:a|an|the)\s+[\w'-]+(?:\s+[\w'-]+){0,3}\s+(?=(?:is|are|was|were)\s+\w+|[\w'-]+ing\b)/i,
      ""
    );
    cleaned = cleaned.replace(/^(?:is|are|was|were)\s+/i, "");
    cleaned = normalizePromptText(cleaned).replace(/[.!]+$/, "");
    return cleaned || "mid-action";
  }

  function emotionFromSupport(supportTheme) {
    var lower = String(supportTheme || "").toLowerCase();
    if (/\b(fear|afraid|scared|anxiety|anxious|worry|worried|nightmare)\b/i.test(lower)) return "Brave";
    if (/\b(anger|angry|hit|hitting|rage|frustrat)\b/i.test(lower)) return "Calm";
    if (/\b(sad|grief|loss|lonely|loneliness|miss)\b/i.test(lower)) return "Hopeful";
    if (/\b(sleep|bedtime|night|rest)\b/i.test(lower)) return "Peaceful";
    if (/\b(friend|share|kind|kindness|help)\b/i.test(lower)) return "Joyful";
    if (/\b(curious|adventure|explore|brave)\b/i.test(lower)) return "Curious";
    if (/\b(surpris|shock|awe|amaz)\b/i.test(lower)) return "Surprised";
    if (lower) return "Warm";
    return "Surprised";
  }

  function buildIllustrationPrompt(options) {
    var hasPhoto = !!options.hasHeroReferencePhoto;
    var hero = heroLabelForScene(options.summaryHero || "", hasPhoto);
    var world = normalizePromptText(options.summaryWorld || "");
    var action = actionFromCoverBeat(options.storyCoreAction || "");
    var emotion = emotionFromSupport(options.supportTheme || "");
    var scene = world
      ? hero + " " + action + ", in " + world + ", " + emotion + " emotion"
      : hero + " " + action + ", " + emotion + " emotion";
    return normalizePromptText(
      "Style: " + ILLUSTRATION_ART_STYLE +
      " Scene: " + scene +
      " Composition: " + ILLUSTRATION_COMPOSITION_DEFAULT
    );
  }

  function coverBeatFallback(title, heroName) {
    var who = normalizePromptText(heroName) || "a kind child";
    var what = normalizePromptText(title) || "a gentle adventure";
    return who + " discovering something wonderful in " + what;
  }

  function heroReferenceFromDataUrl(imageDataUrl) {
    var src = String(imageDataUrl || "").trim();
    var match = src.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return null;
    return {
      base64: match[2],
      mime: match[1] === "image/png" ? "image/png" : "image/jpeg",
    };
  }

  function generateCover(assembledPrompt, imageDataUrl) {
    var ref = heroReferenceFromDataUrl(imageDataUrl);
    var body = {
      prompt: assembledPrompt || buildIllustrationPrompt({
        summaryHero: "a kind child",
        storyCoreAction: "discovering something wonderful",
        supportTheme: "",
        hasHeroReferencePhoto: !!ref,
      }),
      output_format: "jpeg",
    };
    // Same contract as the app: fal-proxy switches to gemini-25-flash-image/edit
    // and sends image_urls[0] when reference_image_base64 is present.
    if (ref) {
      body.reference_image_base64 = ref.base64;
      body.reference_mime_type = ref.mime;
    }
    console.log("[cover] fal generate-image", {
      hasReference: !!ref,
      promptChars: String(body.prompt || "").length,
    });
    return fetch(supabaseUrl() + "/functions/v1/fal-proxy/generate-image", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    })
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (text) {
            console.warn("[cover] fal failed", res.status, String(text || "").slice(0, 240));
            return null;
          });
        }
        return res.json();
      })
      .then(function (data) {
        var url = (data && (data.imageUrl || data.url)) || "";
        if (!url) console.warn("[cover] fal returned no imageUrl", data && data.model);
        else console.log("[cover] fal ok", { model: data && data.model, requestId: data && data.requestId });
        return url;
      })
      .catch(function (err) {
        console.warn("[cover] fal error", err);
        return "";
      });
  }

  function startStory() {
    if (sending) return;
    sending = true;
    loadingTurn = true;
    step = "create";
    setComposerStop(true);
    setPin(t().preparing, false);
    hideQcard();
    qQueue = [];
    qIndex = 0;
    turnAbort = typeof AbortController === "function" ? new AbortController() : null;
    notifyGuidedCreate("status", "writing");

    var activeJobId = "";
    createStoryJob(turnAbort ? turnAbort.signal : undefined)
      .then(function (job) {
        activeJobId = String(job && job.jobId || "");
        if (!activeJobId) throw new Error("Story job did not return an id.");
        return waitForStoryJob(activeJobId, turnAbort ? turnAbort.signal : undefined);
      })
      .then(function (result) {
        var serverStoryId = result && result.storyId ? String(result.storyId).trim() : "";
        var coverBeat = String(result && result.imagePrompt || "").trim() ||
          coverBeatFallback(
            result && result.title,
            illustrationSummaryHero()
          );
        var hasPhoto = !!heroReferenceFromDataUrl(answers.image);
        var assembledPrompt = buildIllustrationPrompt({
          summaryHero: illustrationSummaryHero(),
          summaryWorld: answers.setting || "",
          storyCoreAction: coverBeat,
          supportTheme: answers.support || "",
          hasHeroReferencePhoto: hasPhoto,
        });
        var parsed = {
          title: String(result && result.title || "Your story"),
          body: formatReaderBody(String(result && result.story || "")),
          imagePrompt: assembledPrompt,
        };
        var candidate = {
          id: serverStoryId || "web_" + Date.now(),
          title: parsed.title,
          body: parsed.body,
        };
        if (!isLibraryReadyStory(candidate)) {
          var checkErr = new Error(
            "The story came back empty. Please try again."
          );
          checkErr.storyCheckFailed = true;
          throw checkErr;
        }
        var story = {
          id: candidate.id,
          title: parsed.title,
          body: parsed.body,
          cover: "",
          coverPending: true,
          voice: !!answers.voice,
          heroName: answers.heroName || "",
          childName: answers.childName || "",
          setting: answers.setting || "",
          helpsWith: answers.support || "",
          createdAt: new Date().toISOString(),
        };
        var list = readLocalStories().filter(function (item) {
          return storyIdKey(item.id) !== storyIdKey(story.id);
        });
        list.unshift(story);
        writeStories(list);
        cloudStoriesCache = [story].concat(
          cloudStoriesCache.filter(function (item) {
            return storyIdKey(item.id) !== storyIdKey(story.id);
          })
        );
        paintLibrary();
        void upsertCloudStory(story);
        void refreshQuotaStatus();
        if (draft().setPrompt) draft().setPrompt("");
        step = "done";
        setPin(t().readyLibrary, true);
        if (answers.voice != null) clearSuggest();
        // Open the reader as soon as the text is ready; paint cover in the background.
        notifyGuidedCreate("complete", story);
        guidedCreateHooks = null;
        generateCover(parsed.imagePrompt, answers.image).then(function (cover) {
          if (cover) patchStoryCover(story.id, cover);
          else patchStoryCover(story.id, "", { pending: false });
        });
        return story;
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") {
          void cancelStoryJob(activeJobId);
          setPin("", false);
          clearSuggest();
          notifyGuidedCreate("cancel", null);
          guidedCreateHooks = null;
          return;
        }
        if (err && err.quotaExceeded) {
          applyQuotaPayload({
            planCode: quotaState.isPlus ? "nanik_plus" : "freemium",
            hasActiveSubscription: !!quotaState.isPlus,
            storiesRemaining: 0,
            freeStoriesRemaining: 0,
            lifetimeStoriesRemaining: 0,
          });
          void refreshQuotaStatus();
          // Guided create opens paywall from its error hook; chat flow opens here.
          if (!guidedCreateHooks) openWebPaywall({ title: "Unlock more stories" });
        }
        var message =
          err && err.message
            ? err.message
            : "Could not create the story. Please try again.";
        setPin(message, false);
        notifyGuidedCreate("error", err || new Error(message));
        guidedCreateHooks = null;
      })
      .then(function () {
        sending = false;
        loadingTurn = false;
        setComposerStop(false);
      });
  }

  function prefersReduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setWelcomeMode(on) {
    var chat = document.getElementById("dash-chat");
    var welcome = document.getElementById("dash-welcome");
    var lead = document.getElementById("dash-welcome-lead");
    if (chat) chat.classList.toggle("is-welcome", on);
    if (welcome) welcome.classList.toggle("is-leaving", !on && !welcome.hidden);
    if (lead) lead.classList.toggle("is-out", !on);
    if (on && welcome) welcome.classList.remove("is-leaving");
    if (on && lead) lead.classList.remove("is-out");
  }

  function showWelcome() {
    var welcome = document.getElementById("dash-welcome");
    var thread = threadEl();
    if (welcome) welcome.hidden = false;
    if (thread) thread.hidden = true;
    setWelcomeMode(true);
    setPin("", false);
    hideQcard();
    clearSuggest();
  }

  function beginChat() {
    var welcome = document.getElementById("dash-welcome");
    var thread = threadEl();
    if (welcome) {
      welcome.hidden = true;
      welcome.classList.remove("is-leaving");
    }
    if (thread) thread.hidden = false;
    setWelcomeMode(false);
  }

  function measureWelcomeComposer() {
    var chat = document.getElementById("dash-chat");
    var form = document.getElementById("dash-composer");
    if (!chat || !form || !chat.classList.contains("is-welcome")) return null;
    return form.getBoundingClientRect();
  }

  function playComposerDock(first) {
    var form = document.getElementById("dash-composer");
    if (!form || !first || prefersReduceMotion()) return;
    var last = form.getBoundingClientRect();
    var dy = first.top - last.top;
    if (Math.abs(dy) < 6) return;
    form.style.transition = "none";
    form.style.transform = "translateY(" + dy + "px)";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        form.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
        form.style.transform = "translateY(0)";
      });
    });
    form.addEventListener("transitionend", function clearDock(e) {
      if (e && e.propertyName && e.propertyName !== "transform") return;
      form.removeEventListener("transitionend", clearDock);
      form.style.transition = "";
      form.style.transform = "";
    });
  }

  function startFromComposer() {
    var input = document.getElementById("dash-input");
    var text = input ? input.value.trim() : "";
    var image = answers.image || (draft().getImage ? draft().getImage() : "");
    if (!text && !image) return;
    resetIdeaBrief();
    summaryLangOpen = false;
    langMoreOpen = false;
    parentBrief = { insight: "", wow: "", recap: "" };
    var oldSummary = document.getElementById("dash-summary");
    if (oldSummary) oldSummary.remove();
    answers.lang = detectLang(text || answers.idea);
    answers.idea = text || answers.idea || (answers.lang === "hy" ? "Հեքիաթ այս լուսանկարից։" : answers.lang === "ru" ? "Сказка по этому фото." : "A bedtime story from this photo.");
    answers.image = image;
    answers.age = null;
    answers.heroKind = "";
    answers.heroName = "";
    answers.support = "";
    answers.likes = "";
    answers.clarify = {};
    if (draft().setPrompt) draft().setPrompt(text);
    setPin("", false);
    var dockFrom = measureWelcomeComposer();
    var chat = document.getElementById("dash-chat");
    var welcome = document.getElementById("dash-welcome");
    var lead = document.getElementById("dash-welcome-lead");
    if (lead) lead.classList.add("is-out");
    if (welcome) welcome.classList.add("is-leaving");
    var thread = threadEl();
    if (thread) thread.hidden = false;
    if (chat) chat.classList.remove("is-welcome");
    addUserBubble(text, image);
    if (input) input.value = "";
    paintThumbs();
    addThinking();
    playComposerDock(dockFrom);
    if (welcome) {
      window.setTimeout(function () {
        welcome.hidden = true;
        welcome.classList.remove("is-leaving");
      }, prefersReduceMotion() ? 0 : 420);
    }
    loadingTurn = true;
    setComposerStop(true);
    turnAbort = typeof AbortController === "function" ? new AbortController() : null;
    fetchIdeaBrief(answers.idea, !!answers.image, turnAbort ? turnAbort.signal : undefined)
      .then(function (brief) {
        var thinking = document.getElementById("dash-thinking");
        if (thinking) thinking.remove();
        if (brief) applyIdeaBrief(brief);
        fillSupportFromIdea();
        openQuestionnaire(brief && brief.reply ? brief.reply : t().intro);
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") return;
        var thinking = document.getElementById("dash-thinking");
        if (thinking) thinking.remove();
        resetIdeaBrief();
        fillSupportFromIdea();
        openQuestionnaire(t().intro);
      })
      .then(function () {
        loadingTurn = false;
        turnAbort = null;
        if (document.getElementById("dash-qcard") && !document.getElementById("dash-qcard").hidden) {
          setComposerStop(true);
        } else if (!sending) {
          setComposerStop(false);
        }
      });
  }

  function onComposerSubmit(e) {
    if (e) e.preventDefault();
    var qcard = document.getElementById("dash-qcard");
    if (qcard && !qcard.hidden && !sending) {
      return;
    }
    if (loadingTurn || sending) {
      stopTurn();
      return;
    }
    var input = document.getElementById("dash-input");
    var text = input ? input.value.trim() : "";
    if (step === "idle") {
      startFromComposer();
      return;
    }
    if (waitingOther || step === "age" || step === "hero" || step === "photo" || step === "support" || isClarifyStep(step) || isAiStep(step)) {
      if (!text) return;
      if (input) input.value = "";
      applyCustomAnswer(text);
      return;
    }
    if (step === "voice" && text) {
      var yes = /^(y|yes|yeah|sure|ok)\b/i.test(text);
      var no = /^(n|no|nope)\b/i.test(text);
      if (yes || no) {
        if (input) input.value = "";
        acceptVoice(yes);
      }
    }
  }

  function openWebPaywall(options) {
    var opts = options || {};
    if (window.NanikPayments && typeof window.NanikPayments.openPaywall === "function") {
      return window.NanikPayments.openPaywall({
        planId: opts.planId || "yearly",
        title: opts.title,
      });
    }
    if (window.NanikPayments && typeof window.NanikPayments.startCheckout === "function") {
      return window.NanikPayments.startCheckout("yearly", {
        returnPath: "dashboard.html",
        loadingMessage: "Opening Nanik Plus…",
      }).catch(function (err) {
        console.warn("[paywall]", err);
        window.location.href = "pricing.html";
      });
    }
    window.location.href = "pricing.html";
    return Promise.resolve(null);
  }
  window.openWebPaywall = openWebPaywall;

  window.NANIK_GUIDED_CREATE = {
    start: function (payload, hooks) {
      if (sending || loadingTurn) return false;
      if (quotaState.storiesRemaining <= 0) {
        openWebPaywall({ title: "Unlock more stories" });
        return false;
      }
      payload = payload || {};
      answers.summaryPlan = payload.summaryPlan && Number(payload.summaryPlan.schemaVersion) >= 1
        ? JSON.parse(JSON.stringify(payload.summaryPlan)) : null;
      guidedCreateHooks = hooks || {};
      resetIdeaBrief();
      parentBrief = { insight: "", wow: "", recap: "" };
      answers.planner = payload.planner && typeof payload.planner === "object"
        ? JSON.parse(JSON.stringify(payload.planner))
        : null;
      answers.idea = String(payload.idea || "").trim() || "A gentle bedtime story.";
      answers.childName = String(payload.childName || "").trim();
      answers.childGender = String(
        payload.childGender
        || (payload.summaryPlan && payload.summaryPlan.child && payload.summaryPlan.child.gender)
        || ""
      ).trim().toLowerCase();
      answers.age = parseAge(payload.age);
      answers.lang = String(payload.lang || "en").toLowerCase();
      answers.heroKind = String(payload.heroKind || "imaginary");
      answers.heroName = String(payload.heroName || "").trim();
      answers.image = String(payload.image || "");
      answers.likes = String(payload.likes || "").trim();
      answers.setting = String(payload.setting || "").trim();
      answers.support = String(payload.support || "").trim();
      answers.voice = false;
      answers.clarify = {};
      if (draft().setAge && answers.age) draft().setAge(answers.age);
      if (draft().setPrompt) draft().setPrompt(answers.idea);
      if (draft().setImage) draft().setImage(answers.image);
      startStory();
      return true;
    },
    cancel: function () {
      stopTurn();
    },
    openStory: function (story) {
      if (!story) return;
      showPanel("library");
      openStory(story);
    },
  };

  function init() {
    var s = session();
    var returned = draft().authReturn;
    if (returned && returned.error) {
      location.replace("signin.html?next=" + encodeURIComponent("dashboard.html"));
      return;
    }
    if ((!s || !s.access_token) && returned && returned.session) s = returned.session;
    if (!s || !s.access_token) {
      location.replace("signin.html?next=" + encodeURIComponent("dashboard.html"));
      return;
    }

    answers.idea = draft().getPrompt ? draft().getPrompt() : "";
    if (/something magical|algo m[aá]gico|quelque chose de magique|etwas magisches|qualcosa di magico|شيئاً سحرياً|что-то волшебное|կախարդական հեքիաթ/i.test(answers.idea)) {
      answers.idea = "";
      answers.summaryPlan = null;
      if (draft().setPrompt) draft().setPrompt("");
    }
    answers.image = draft().getImage ? draft().getImage() : "";
    answers.lang = detectLang(answers.idea);
    var input = document.getElementById("dash-input");
    if (input && answers.idea) {
      input.value = answers.idea;
      input.style.height = "auto";
      input.style.height = Math.min(110, input.scrollHeight) + "px";
    }

    wireSafariShell();
    wireMenuChrome();
    bootUiLangFromGeo();
    document.querySelectorAll(".dash-nav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        voicesPickMode = false;
        showPanel(btn.getAttribute("data-panel"));
      });
    });
    document.querySelectorAll(".dash-tab-pill-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        voicesPickMode = false;
        showPanel(btn.getAttribute("data-panel"));
      });
    });
    var pinGo = document.getElementById("dash-pin-go");
    if (pinGo) {
      pinGo.addEventListener("click", function () {
        showPanel("library");
        var latest = readStories()[0];
        if (latest) openStory(latest);
      });
    }
    var readerBack = document.getElementById("dash-reader-back");
    if (readerBack) readerBack.addEventListener("click", closeReader);
    var voicePickClose = document.getElementById("dash-voice-pick-close");
    var voicePickBackdrop = document.getElementById("dash-voice-pick-backdrop");
    if (voicePickClose) voicePickClose.addEventListener("click", closeVoicePick);
    if (voicePickBackdrop) voicePickBackdrop.addEventListener("click", closeVoicePick);
    document.addEventListener("keydown", function (ev) {
      var modal = document.getElementById("dash-voice-pick");
      if (ev.key === "Escape" && modal && !modal.hidden) closeVoicePick();
    });
    var readerVoice = document.getElementById("dash-reader-voice");
    if (readerVoice) {
      readerVoice.addEventListener("click", function () {
        if (voiceoverProgressPercent != null) return;
        if (activeReaderStory && storyVoiceoverUrl(activeReaderStory)) {
          playStoryVoiceover();
          return;
        }
        openVoicesForPick(activeReaderStory);
      });
    }
    var readerPlay = document.getElementById("dash-reader-play");
    if (readerPlay) {
      readerPlay.addEventListener("click", function () {
        playStoryVoiceover();
      });
    }
    var readerSkipBack = document.getElementById("dash-reader-skip-back");
    if (readerSkipBack) {
      readerSkipBack.addEventListener("click", function () {
        seekVoiceoverBy(-10);
      });
    }
    var readerSkipFwd = document.getElementById("dash-reader-skip-fwd");
    if (readerSkipFwd) {
      readerSkipFwd.addEventListener("click", function () {
        seekVoiceoverBy(10);
      });
    }
    var readerScrub = document.getElementById("dash-reader-scrub");
    if (readerScrub) {
      readerScrub.addEventListener("pointerdown", function () {
        voiceoverScrubbing = true;
      });
      readerScrub.addEventListener("pointerup", function () {
        voiceoverScrubbing = false;
      });
      readerScrub.addEventListener("change", function () {
        voiceoverScrubbing = false;
        seekVoiceoverToRatio(Number(readerScrub.value || 0) / 1000);
      });
      readerScrub.addEventListener("input", function () {
        var curEl = document.getElementById("dash-reader-time-cur");
        if (!curEl || !voiceoverAudio || !Number.isFinite(voiceoverAudio.duration)) return;
        curEl.textContent = formatPlayerTime(
          (Number(readerScrub.value || 0) / 1000) * voiceoverAudio.duration
        );
      });
    }
    var readerSpeed = document.getElementById("dash-reader-speed");
    if (readerSpeed) {
      readerSpeed.addEventListener("click", function () {
        openSpeedModal();
      });
    }
    var speedModal = document.getElementById("dash-reader-speed-modal");
    if (speedModal) {
      speedModal.querySelectorAll("[data-speed-close]").forEach(function (el) {
        el.addEventListener("click", closeSpeedModal);
      });
    }
    var speedSlider = document.getElementById("dash-reader-speed-slider");
    if (speedSlider) {
      speedSlider.addEventListener("input", function () {
        setVoiceoverPlaybackRate(playbackRateFromSliderIndex(speedSlider.value));
      });
    }
    wireReaderChrome();

    var form = document.getElementById("dash-composer");
    if (form) form.addEventListener("submit", onComposerSubmit);
    var sendBtn = document.getElementById("dash-send");
    if (sendBtn) {
      sendBtn.addEventListener("click", function (e) {
        var card = document.getElementById("dash-qcard");
        if ((card && !card.hidden && !sending) || loadingTurn || sending) {
          e.preventDefault();
          stopTurn();
        }
      });
    }
    ["dash-photo", "dash-photo-capture"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", function () {
        var file = el.files && el.files[0];
        el.value = "";
        handlePhotoFile(file);
      });
    });
    if (input) {
      input.addEventListener("input", function () {
        input.style.height = "auto";
        input.style.height = Math.min(110, input.scrollHeight) + "px";
        setFilled();
        if (step === "idle") {
          if (input.value.trim()) stopPhRotate();
          else startPhRotate();
        }
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onComposerSubmit(e);
        }
      });
    }
    var prev = document.getElementById("dash-q-prev");
    var next = document.getElementById("dash-q-next");
    var close = document.getElementById("dash-q-close");
    var elseBtn = document.getElementById("dash-q-else");
    var insertForm = document.getElementById("dash-q-insert");
    if (prev) {
      prev.addEventListener("click", function () {
        if (qIndex <= 0) return;
        qIndex -= 1;
        paintQcard();
      });
    }
    if (next) {
      next.addEventListener("click", goNext);
    }
    if (close) close.addEventListener("click", closeQ);
    if (elseBtn) elseBtn.addEventListener("click", elseQ);
    if (insertForm) {
      insertForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var field = document.getElementById("dash-q-insert-input");
        var text = field ? field.value.trim() : "";
        applyCustomAnswer(text);
      });
    }
    showPanel("library");
    paintChrome();
    wireAccountChrome();
    paintStoriesCapsule();
    paintKidsAddChrome();
    // Always load server quota immediately — do not block on Dodo sync
    // (a slow/hanging sync left the UI stuck on freemium defaults).
    void refreshQuotaStatus();
    var sync = window.NanikPayments && window.NanikPayments.syncSubscription;
    if (typeof sync === "function") {
      sync()
        .then(function (result) {
          if (result && result.isPlus) void refreshQuotaStatus();
        })
        .catch(function () {});
    }
    wrapChildDraftCloudSync();
    showWelcome();
    paintThumbs();
    setFilled();
    setPlaceholder();
    void refreshCloudLibrary();
    void refreshCloudChildren();
    window.addEventListener("nanik:langchange", function () {
      paintChrome();
      paintVoices();
      paintLibrary();
      paintStoriesCapsule();
      phIdx = 0;
      if (step === "idle") startPhRotate();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
