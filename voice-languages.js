/**
 * Story / voice-clone languages — same order as the Nanik app
 * (hy, en, ru → featured → remaining A→Z by native name).
 * Source: src/constants/higgsStoryLanguages.ts
 */
(function (global) {
  var PRIMARY = ["hy","en","ru"];
  var LANGUAGES = [{"code":"hy","el":"hye","name":"Armenian","native":"Հայերեն","flag":"🇦🇲"},{"code":"en","el":"en","name":"English","native":"English","flag":"🇺🇸"},{"code":"ru","el":"ru","name":"Russian","native":"Русский","flag":"🇷🇺"},{"code":"de","el":"de","name":"German","native":"Deutsch","flag":"🇩🇪"},{"code":"fr","el":"fr","name":"French","native":"Français","flag":"🇫🇷"},{"code":"es","el":"es","name":"Spanish","native":"Español","flag":"🇪🇸"},{"code":"it","el":"it","name":"Italian","native":"Italiano","flag":"🇮🇹"},{"code":"pt","el":"pt","name":"Portuguese","native":"Português","flag":"🇵🇹"},{"code":"nl","el":"nl","name":"Dutch","native":"Nederlands","flag":"🇳🇱"},{"code":"pl","el":"pl","name":"Polish","native":"Polski","flag":"🇵🇱"},{"code":"uk","el":"uk","name":"Ukrainian","native":"Українська","flag":"🇺🇦"},{"code":"cs","el":"cs","name":"Czech","native":"Čeština","flag":"🇨🇿"},{"code":"ro","el":"ro","name":"Romanian","native":"Română","flag":"🇷🇴"},{"code":"el","el":"el","name":"Greek","native":"Ελληνικά","flag":"🇬🇷"},{"code":"hu","el":"hu","name":"Hungarian","native":"Magyar","flag":"🇭🇺"},{"code":"sv","el":"sv","name":"Swedish","native":"Svenska","flag":"🇸🇪"},{"code":"no","el":"no","name":"Norwegian","native":"Norsk","flag":"🇳🇴"},{"code":"da","el":"da","name":"Danish","native":"Dansk","flag":"🇩🇰"},{"code":"fi","el":"fi","name":"Finnish","native":"Suomi","flag":"🇫🇮"},{"code":"bg","el":"bg","name":"Bulgarian","native":"Български","flag":"🇧🇬"},{"code":"hr","el":"hr","name":"Croatian","native":"Hrvatski","flag":"🇭🇷"},{"code":"sk","el":"sk","name":"Slovak","native":"Slovenčina","flag":"🇸🇰"},{"code":"sl","el":"sl","name":"Slovene","native":"Slovenščina","flag":"🇸🇮"},{"code":"sr","el":"sr","name":"Serbian","native":"Српски","flag":"🇷🇸"},{"code":"ca","el":"ca","name":"Catalan","native":"Català","flag":"🇪🇸"},{"code":"lt","el":"lt","name":"Lithuanian","native":"Lietuvių","flag":"🇱🇹"},{"code":"lv","el":"lv","name":"Latvian","native":"Latviešu","flag":"🇱🇻"},{"code":"et","el":"et","name":"Estonian","native":"Eesti","flag":"🇪🇪"},{"code":"is","el":"is","name":"Icelandic","native":"Íslenska","flag":"🇮🇸"},{"code":"be","el":"be","name":"Belarusian","native":"Беларуская","flag":"🇧🇾"},{"code":"mk","el":"mk","name":"Macedonian","native":"Македонски","flag":"🇲🇰"},{"code":"sq","el":"sq","name":"Albanian","native":"Shqip","flag":"🇦🇱"},{"code":"ga","el":"ga","name":"Irish","native":"Gaeilge","flag":"🇮🇪"},{"code":"cy","el":"cy","name":"Welsh","native":"Cymraeg","flag":"🇬🇧"},{"code":"lb","el":"lb","name":"Luxembourgish","native":"Lëtzebuergesch","flag":"🇱🇺"},{"code":"ar","el":"ar","name":"Arabic","native":"العربية","flag":"🇸🇦"},{"code":"he","el":"he","name":"Hebrew","native":"עברית","flag":"🇮🇱"},{"code":"tr","el":"tr","name":"Turkish","native":"Türkçe","flag":"🇹🇷"},{"code":"fa","el":"fa","name":"Persian","native":"فارسی","flag":"🇮🇷"},{"code":"zh","el":"zh","name":"Chinese","native":"中文","flag":"🇨🇳"},{"code":"ja","el":"ja","name":"Japanese","native":"日本語","flag":"🇯🇵"},{"code":"ko","el":"ko","name":"Korean","native":"한국어","flag":"🇰🇷"},{"code":"hi","el":"hi","name":"Hindi","native":"हिन्दी","flag":"🇮🇳"},{"code":"id","el":"id","name":"Indonesian","native":"Bahasa Indonesia","flag":"🇮🇩"},{"code":"vi","el":"vi","name":"Vietnamese","native":"Tiếng Việt","flag":"🇻🇳"},{"code":"th","el":"th","name":"Thai","native":"ไทย","flag":"🇹🇭"},{"code":"tl","el":"tl","name":"Tagalog","native":"Tagalog","flag":"🇵🇭"},{"code":"ms","el":"ms","name":"Malay","native":"Melayu","flag":"🇲🇾"},{"code":"om","el":"om","name":"Oromo","native":"Afaan Oromoo","flag":"🇪🇹"},{"code":"af","el":"af","name":"Afrikaans","native":"Afrikaans","flag":"🇿🇦"},{"code":"ast","el":"ast","name":"Asturian","native":"Asturianu","flag":"🇪🇸"},{"code":"az","el":"az","name":"Azerbaijani","native":"Azərbaycan","flag":"🇦🇿"},{"code":"jv","el":"jv","name":"Javanese","native":"Basa Jawa","flag":"🇮🇩"},{"code":"bs","el":"bs","name":"Bosnian","native":"Bosanski","flag":"🇧🇦"},{"code":"ceb","el":"ceb","name":"Cebuano","native":"Cebuano","flag":"🇵🇭"},{"code":"ny","el":"ny","name":"Chichewa","native":"Chichewa","flag":"🇲🇼"},{"code":"sn","el":"sn","name":"Shona","native":"ChiShona","flag":"🇿🇼"},{"code":"luo","el":"luo","name":"Luo","native":"Dholuo","flag":"🇰🇪"},{"code":"eo","el":"eo","name":"Esperanto","native":"Esperanto","flag":"🌐"},{"code":"eu","el":"eu","name":"Basque","native":"Euskara","flag":"🇪🇸"},{"code":"gl","el":"gl","name":"Galician","native":"Galego","flag":"🇪🇸"},{"code":"ha","el":"ha","name":"Hausa","native":"Hausa","flag":"🇳🇬"},{"code":"rw","el":"rw","name":"Kinyarwanda","native":"Ikinyarwanda","flag":"🇷🇼"},{"code":"xh","el":"xh","name":"Xhosa","native":"isiXhosa","flag":"🇿🇦"},{"code":"zu","el":"zu","name":"Zulu","native":"isiZulu","flag":"🇿🇦"},{"code":"kea","el":"kea","name":"Kabuverdianu","native":"Kabuverdianu","flag":"🇨🇻"},{"code":"kam","el":"kam","name":"Kamba","native":"Kikamba","flag":"🇰🇪"},{"code":"sw","el":"sw","name":"Swahili","native":"Kiswahili","flag":"🇹🇿"},{"code":"ht","el":"ht","name":"Haitian Creole","native":"Kreyòl ayisyen","flag":"🇭🇹"},{"code":"la","el":"la","name":"Latin","native":"Latina","flag":"🇻🇦"},{"code":"ln","el":"ln","name":"Lingala","native":"Lingála","flag":"🇨🇩"},{"code":"lg","el":"lg","name":"Ganda","native":"Luganda","flag":"🇺🇬"},{"code":"mt","el":"mt","name":"Maltese","native":"Malti","flag":"🇲🇹"},{"code":"oc","el":"oc","name":"Occitan","native":"Occitan","flag":"🇫🇷"},{"code":"uz","el":"uz","name":"Uzbek","native":"Oʻzbek","flag":"🇺🇿"},{"code":"nso","el":"nso","name":"Sepedi","native":"Sepedi","flag":"🇿🇦"},{"code":"so","el":"so","name":"Somali","native":"Soomaali","flag":"🇸🇴"},{"code":"kab","el":"kab","name":"Kabyle","native":"Taqbaylit","flag":"🇩🇿"},{"code":"mi","el":"mi","name":"Māori","native":"Te Reo Māori","flag":"🇳🇿"},{"code":"umb","el":"umb","name":"Umbundu","native":"Umbundu","flag":"🇦🇴"},{"code":"ba","el":"ba","name":"Bashkir","native":"Башҡорт","flag":"🇷🇺"},{"code":"ky","el":"ky","name":"Kyrgyz","native":"Кыргызча","flag":"🇰🇬"},{"code":"kk","el":"kk","name":"Kazakh","native":"Қазақ","flag":"🇰🇿"},{"code":"mn","el":"mn","name":"Mongolian","native":"Монгол","flag":"🇲🇳"},{"code":"chm","el":"chm","name":"Eastern Mari","native":"Олык марий","flag":"🇷🇺"},{"code":"tg","el":"tg","name":"Tajik","native":"Тоҷикӣ","flag":"🇹🇯"},{"code":"ka","el":"ka","name":"Georgian","native":"ქართული","flag":"🇬🇪"},{"code":"ug","el":"ug","name":"Uyghur","native":"ئۇيغۇر","flag":"🇨🇳"},{"code":"ur","el":"ur","name":"Urdu","native":"اردو","flag":"🇵🇰"},{"code":"ps","el":"ps","name":"Pashto","native":"پښتو","flag":"🇦🇫"},{"code":"sd","el":"sd","name":"Sindhi","native":"سنڌي","flag":"🇵🇰"},{"code":"ckb","el":"ckb","name":"Central Kurdish","native":"کوردی","flag":"🇮🇶"},{"code":"ne","el":"ne","name":"Nepali","native":"नेपाली","flag":"🇳🇵"},{"code":"mr","el":"mr","name":"Marathi","native":"मराठी","flag":"🇮🇳"},{"code":"as","el":"as","name":"Assamese","native":"অসমীয়া","flag":"🇮🇳"},{"code":"bn","el":"bn","name":"Bengali","native":"বাংলা","flag":"🇧🇩"},{"code":"pa","el":"pa","name":"Punjabi","native":"ਪੰਜਾਬੀ","flag":"🇮🇳"},{"code":"gu","el":"gu","name":"Gujarati","native":"ગુજરાતી","flag":"🇮🇳"},{"code":"ta","el":"ta","name":"Tamil","native":"தமிழ்","flag":"🇮🇳"},{"code":"te","el":"te","name":"Telugu","native":"తెలుగు","flag":"🇮🇳"},{"code":"kn","el":"kn","name":"Kannada","native":"ಕನ್ನಡ","flag":"🇮🇳"},{"code":"ml","el":"ml","name":"Malayalam","native":"മലയാളം","flag":"🇮🇳"}];
  var SAMPLES = {"hy":"Այնքան լավ եղանակ է այսօր՝ արևոտ ու ջինջ...Չգիտեմ նույնիսկ՝ տանը մնամ, թե՞ դուրս գամ մի քիչ քայլելու։ Դու ի՞նչ կասես։\n- Իհարկե կմիանամ, - ասաց փոքրիկը։\n- Դե, գնացինք։","en":"Everyone thought the little dragon was fast asleep in his bed... but look up there! He's flying right over the moon! Can you see him waving?","ru":"Все думали, что маленький дракон крепко спит в своей кроватке… а посмотрите наверх! Он летит прямо над луной! Видишь, как он машет?"};
  var ENGLISH_SAMPLE = SAMPLES.en;

  function byCode(code) {
    var c = String(code || '').trim().toLowerCase();
    for (var i = 0; i < LANGUAGES.length; i++) {
      if (LANGUAGES[i].code === c) return LANGUAGES[i];
    }
    return null;
  }

  /** Codes sent to higgs-proxy /clone and /tts */
  function apiCode(code) {
    var c = String(code || '').trim().toLowerCase();
    if (c === 'hy') return 'hye';
    if (c === 'en') return 'eng';
    if (c === 'ru') return 'rus';
    var lang = byCode(c);
    return (lang && lang.el) || c || 'eng';
  }

  function curatedSample(code) {
    var c = String(code || '').trim().toLowerCase();
    return SAMPLES[c] || null;
  }

  function fillSelect(selectEl, options) {
    if (!selectEl) return;
    var opts = options || {};
    var selected = opts.selected || selectEl.value || '';
    var placeholder = opts.placeholder || 'Select language…';
    var html = '';
    if (opts.includePlaceholder !== false) {
      html += '<option value="">' + placeholder + '</option>';
    }
    html += '<optgroup label="Suggested">';
    for (var i = 0; i < PRIMARY.length; i++) {
      var p = byCode(PRIMARY[i]);
      if (!p) continue;
      html += '<option value="' + p.code + '">' + p.flag + ' ' + p.name + ' · ' + p.native + '</option>';
    }
    html += '</optgroup><optgroup label="All languages">';
    for (var j = 0; j < LANGUAGES.length; j++) {
      var lang = LANGUAGES[j];
      if (PRIMARY.indexOf(lang.code) !== -1) continue;
      html += '<option value="' + lang.code + '">' + lang.flag + ' ' + lang.name + ' · ' + lang.native + '</option>';
    }
    html += '</optgroup>';
    selectEl.innerHTML = html;
    if (selected && byCode(selected)) selectEl.value = selected;
  }

  global.NANIK_VOICE_LANGS = {
    PRIMARY: PRIMARY,
    LANGUAGES: LANGUAGES,
    SAMPLES: SAMPLES,
    ENGLISH_SAMPLE: ENGLISH_SAMPLE,
    byCode: byCode,
    apiCode: apiCode,
    curatedSample: curatedSample,
    fillSelect: fillSelect
  };
})(typeof window !== 'undefined' ? window : globalThis);
