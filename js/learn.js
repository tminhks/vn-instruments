/* Learn page: a list of short lessons, and a step-by-step lesson view with feedback.
   learn.html            the list of lessons
   learn.html?id=dan-bau  that instrument's lesson (the Instrument page links here) */
(function () {
  "use strict";

  var DATA = window.NGUAM_DATA, LESSONS = window.NGUAM_LESSONS, S = window.NguAmSound;
  var $ = function (id) { return document.getElementById(id); };
  var byId = {}; DATA.instruments.forEach(function (i) { byId[i.id] = i; });
  var lessonById = {}; LESSONS.forEach(function (l) { lessonById[l.id] = l; });
  var KEYS = ["a", "s", "d", "f", "g"];

  var UI = {
    title: { en: "Learn", vi: "Bài học" },
    lede: { en: "Short lessons, about three minutes each. Play along and the page tells you when you get it right.", vi: "Bài học ngắn, khoảng ba phút mỗi bài. Bạn chơi theo, trang sẽ báo khi bạn chơi đúng." },
    allLessons: { en: "All lessons", vi: "Tất cả bài học" },
    steps: { en: "{n} steps", vi: "{n} bước" },
    mins: { en: "{n} min", vi: "{n} phút" },
    notStarted: { en: "Not started", vi: "Chưa bắt đầu" },
    inProgress: { en: "In progress: step {n} of {m}", vi: "Đang học: bước {n} trên {m}" },
    done: { en: "Done", vi: "Đã xong" },
    start: { en: "Start", vi: "Bắt đầu" },
    cont: { en: "Continue", vi: "Học tiếp" },
    again: { en: "Do it again", vi: "Học lại" },
    soonT: { en: "Coming in the full version", vi: "Có trong bản đầy đủ" },
    soon: { en: "A lesson for this instrument is not in the prototype yet.", vi: "Bài học cho nhạc cụ này chưa có trong bản thử." },
    soonLong: { en: "There is no lesson for the {name} in the prototype yet. These are the lessons you can try:", vi: "Bản thử chưa có bài học cho {name}. Đây là những bài bạn học được:" },
    stepOf: { en: "Step {n} of {m}", vi: "Bước {n} trên {m}" },
    progressLabel: { en: "Lesson progress", vi: "Tiến độ bài học" },
    back: { en: "Back", vi: "Quay lại" },
    replay: { en: "Replay this step", vi: "Làm lại bước này" },
    next: { en: "Next", vi: "Tiếp" },
    finish: { en: "Finish", vi: "Hoàn thành" },
    listen: { en: "Listen", vi: "Nghe" },
    listening: { en: "Listening…", vi: "Đang nghe…" },
    keysHint: { en: "Click a string, tap it, or press its key.", vi: "Bấm hoặc chạm vào dây, hay nhấn phím của dây." },
    playThis: { en: "Play this one", vi: "Gảy dây này" },
    strings: { en: "The strings of the đàn tranh", vi: "Các dây của đàn tranh" },
    ok: { en: "Right note! That was {tone}.", vi: "Đúng nốt! Đó là {tone}." },
    okNext: { en: "Right note! That was {tone}. Next: {next}.", vi: "Đúng nốt! Đó là {tone}. Tiếp theo: {next}." },
    okDone: { en: "Well done: this step is complete.", vi: "Giỏi lắm: bước này đã xong." },
    wrongBelow: { en: "That was {tone}. Try the string below.", vi: "Đó là {tone}. Thử dây phía dưới." },
    wrongAbove: { en: "That was {tone}. Try the string above.", vi: "Đó là {tone}. Thử dây phía trên." },
    heardAll: { en: "You have heard all five tones. Press Next.", vi: "Bạn đã nghe đủ năm âm. Bấm Tiếp." },
    heardBau: { en: "That is the glide. Press Next.", vi: "Đó là nốt lướt. Bấm Tiếp." },
    plucked: { en: "That is the plain note, with the rod still. Press Next.", vi: "Đó là nốt thường, khi cần đàn đứng yên. Bấm Tiếp." },
    bentOk: { en: "You bent the note up by {n} steps while it rang. Well done.", vi: "Bạn đã uốn nốt lên {n} nấc khi tiếng còn ngân. Giỏi lắm." },
    bentMore: { en: "The note moved, but not enough. Raise the rod a little more.", vi: "Nốt đã đổi nhưng chưa đủ. Hãy nâng cần đàn thêm một chút." },
    bentFirst: { en: "Pluck first, then move the rod while the note rings.", vi: "Hãy gảy trước, rồi đưa cần đàn trong lúc tiếng còn ngân." },
    pluck: { en: "Pluck", vi: "Gảy" },
    pluckKey: { en: "or press the space bar", vi: "hoặc nhấn phím cách" },
    rod: { en: "Rod: raise it to bend the note up", vi: "Cần đàn: nâng lên để uốn nốt lên" },
    rodValue: { en: "{n} steps up", vi: "cao hơn {n} nấc" },
    rodRest: { en: "at rest", vi: "đứng yên" },
    boardBau: { en: "The đàn bầu: one string, one rod", vi: "Đàn bầu: một dây, một cần đàn" },
    muted: { en: "Sound is off. Turn it on with the button in the menu.", vi: "Âm thanh đang tắt. Bật lại bằng nút trên menu." },
    doneT: { en: "Lesson complete", vi: "Bài học đã xong" },
    learnedT: { en: "What you learned", vi: "Bạn đã học được" },
    playIt: { en: "Play the instrument", vi: "Chơi thử nhạc cụ" },
    nextLesson: { en: "Next lesson", vi: "Bài tiếp theo" },
    saveNote: { en: "Your progress is saved on this device.", vi: "Tiến độ của bạn được lưu trên máy này." },
    browse: { en: "Browse all instruments", vi: "Xem tất cả nhạc cụ" },
    live: { en: "Step {n} of {m}: {title}", vi: "Bước {n} trên {m}: {title}" }
  };

  var state = { id: null, step: 0, sub: 0, stepDone: false, fb: null, listening: false, voice: null, bend: 0, maxBend: 0, rodAt: 0, plucked: 0, completed: false, timers: [] };
  var stopListen = null;

  function lang() { return window.NguAm ? NguAm.lang() : "en"; }
  function t(o) { return o ? (o[lang()] || o.en || "") : ""; }
  function fill(s, m) { return s.replace(/\{(\w+)\}/g, function (x, k) { return m[k] != null ? m[k] : x; }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function say(m) { var el = $("ln-live"); el.textContent = ""; setTimeout(function () { el.textContent = m; }, 60); }
  function tone(n) { return S.TONES[n]; }
  function toneName(n) { return tone(n).vi.toLowerCase(); }

  /* ---------------- saved progress ---------------- */

  function readProgress() { try { return JSON.parse(localStorage.getItem("nguam.lessons") || "{}"); } catch (e) { return {}; } }
  function writeProgress(id, patch) {
    var all = readProgress(); all[id] = Object.assign({ step: 0, done: false }, all[id], patch);
    localStorage.setItem("nguam.lessons", JSON.stringify(all));
  }

  /* ---------------- the đàn bầu voice (own small synth: it needs a live pitch bend) ---------------- */

  var bauCtx = null;
  function ctx() {
    if (!bauCtx) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) bauCtx = new AC(); }
    if (bauCtx && bauCtx.state === "suspended") bauCtx.resume();
    return bauCtx;
  }
  function stopVoice() { if (state.voice) { try { state.voice.stop(); } catch (e) { /* already ended */ } state.voice = null; } }
  function pluckBau() {
    var c = ctx(); if (!c) return null;
    stopVoice();
    var now = c.currentTime, out = c.createGain(), oscs = [];
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(S.isMuted() ? 0.0001 : 0.4, now + 0.015);
    out.gain.exponentialRampToValueAtTime(0.0001, now + 5);
    out.connect(c.destination);
    [[1, 1], [2, 0.12], [3, 0.04]].forEach(function (h) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = 392 * h[0]; g.gain.value = h[1];
      o.connect(g); g.connect(out); o.start(now); o.stop(now + 5.1); oscs.push(o);
    });
    var voice = {
      bend: function (semi) { oscs.forEach(function (o) { o.detune.setTargetAtTime(semi * 100, c.currentTime, 0.03); }); },
      stop: function () { out.gain.cancelScheduledValues(c.currentTime); out.gain.setTargetAtTime(0.0001, c.currentTime, 0.05); oscs.forEach(function (o) { try { o.stop(c.currentTime + 0.3); } catch (e) { /* ended */ } }); },
      born: performance.now()
    };
    state.voice = voice; state.plucked = performance.now();
    return voice;
  }
  function ringing() { return state.voice && performance.now() - state.voice.born < 4500; }

  /* ---------------- step logic ---------------- */

  function fbInner() {
    return state.fb ? '<svg class="icon" aria-hidden="true"><use href="#i-' + (state.fb.type === "ok" ? "check" : "arrow") + '"/></svg><span>' + esc(state.fb.text) + "</span>" : "";
  }
  function updateFb() {
    var fb = document.querySelector(".fb"); if (fb) { fb.className = "fb " + (state.fb ? state.fb.type : "empty"); fb.innerHTML = fbInner(); }
    var nx = document.querySelector('[data-act="next"]'); if (nx) nx.disabled = !state.stepDone;
  }
  function lesson() { return lessonById[state.id]; }
  function stepDef() { return lesson().steps[state.step]; }
  function resetStep() {
    cancelTimers(); stopVoice();
    if (stopListen) { stopListen(); stopListen = null; }
    state.sub = 0; state.stepDone = false; state.fb = null; state.listening = false; state.bend = 0; state.maxBend = 0; state.rodAt = 0;
  }
  function cancelTimers() { state.timers.forEach(clearTimeout); state.timers = []; }

  function completeStep(msg) {
    state.stepDone = true;
    state.fb = { type: "ok", text: msg || t(UI.okDone) };
    var L = lesson(), last = state.step === L.steps.length - 1;
    writeProgress(L.id, { step: Math.min(state.step + 1, L.steps.length - 1), done: last ? true : (readProgress()[L.id] || {}).done });
    say(state.fb.text);
  }

  function pressString(n) {
    if (!S) return;
    S.unlock().then(function () {
      S.pluck(tone(n).freq, 0.5);
      var def = stepDef();
      markSounding(n);
      if (def.type !== "play" || state.stepDone) { return; }
      var target = def.targets[state.sub];
      if (n === target) {
        state.sub++;
        if (state.sub >= def.targets.length) { completeStep(fill(t(UI.ok), { tone: toneName(n) }) + " " + t(UI.okDone)); }
        else { state.fb = { type: "ok", text: fill(t(UI.okNext), { tone: toneName(n), next: toneName(def.targets[state.sub]) }) }; say(state.fb.text); }
      } else {
        state.fb = { type: "try", text: fill(t(n < target ? UI.wrongBelow : UI.wrongAbove), { tone: toneName(n) }) }; say(state.fb.text);
      }
      render(false);
    });
  }
  function markSounding(n) {
    var el = document.querySelector('.zs[data-n="' + n + '"]');
    if (!el) return;
    el.classList.add("is-sounding"); setTimeout(function () { el.classList.remove("is-sounding"); }, 450);
  }

  function runListen() {
    if (state.listening) return;
    S.unlock().then(function () {
      state.listening = true; state.fb = null; render(false);
      var def = stepDef(), timers = [];
      if (def.type === "listen") {
        S.TONES.forEach(function (tn, k) {
          timers.push(setTimeout(function () { S.pluck(tn.freq, 0.5); markSounding(k); }, k * 700));
        });
        timers.push(setTimeout(finish, 5 * 700 + 300));
        stopListen = function () { timers.forEach(clearTimeout); };
        function finish() { state.listening = false; stopListen = null; completeStep(t(UI.heardAll)); render(false); }
      } else {
        // A short phrase on this page's own voice: rise, fall back, rise less, settle.
        var v = pluckBau();
        if (!v) { state.listening = false; render(false); return; }
        var steps = [[450, 2], [1300, 0], [1900, 1.2], [2500, 0], [2900, 0.5], [3300, 0]];
        steps.forEach(function (st) {
          timers.push(setTimeout(function () {
            v.bend(st[1]);
            var bar = document.querySelector(".bau-string"); if (bar) bar.style.setProperty("--tilt", (-st[1] * 2.2) + "deg");
          }, st[0]));
        });
        timers.push(setTimeout(function () { state.listening = false; stopListen = null; completeStep(t(UI.heardBau)); render(false); }, 4200));
        stopListen = function () { timers.forEach(clearTimeout); stopVoice(); };
      }
    });
  }

  function onPluckBau() {
    S.unlock().then(function () {
      ctx(); var v = pluckBau(); if (!v) return;
      state.maxBend = 0; state.bend = 0; state.rodAt = performance.now();
      var rod = $("rod"); if (rod) { rod.value = 0; syncRod(); }
      var def = stepDef();
      if (def.type === "pluck" && !state.stepDone) { completeStep(t(UI.plucked)); updateFb(); }
      else if (def.type === "bend" && !state.stepDone) { state.fb = null; updateFb(); }
    });
  }
  function onRod(e) {
    var v = parseFloat(e.target.value);
    state.bend = v; syncRod();
    var def = stepDef();
    if (state.voice && ringing()) { state.voice.bend(v); state.maxBend = Math.max(state.maxBend, v); }
    if (def.type !== "bend" || state.stepDone) return;
    if (!ringing()) { if (v > 0.2) { state.fb = { type: "try", text: t(UI.bentFirst) }; updateFb(); } return; }
    if (state.maxBend >= 1) { var n = Math.round(state.maxBend * 10) / 10; completeStep(fill(t(UI.bentOk), { n: n })); updateFb(); }
    else if (v > 0.3 && !state.fb) { state.fb = { type: "try", text: t(UI.bentMore) }; updateFb(); }
  }
  function syncRod() {
    var rod = $("rod"); if (!rod) return;
    var v = parseFloat(rod.value);
    rod.setAttribute("aria-valuetext", v < 0.05 ? t(UI.rodRest) : fill(t(UI.rodValue), { n: (Math.round(v * 10) / 10) }));
    var bar = document.querySelector(".bau-string"); if (bar) bar.style.setProperty("--tilt", (-v * 2.2) + "deg");
    var val = document.querySelector(".rod-value"); if (val) val.textContent = v < 0.05 ? t(UI.rodRest) : fill(t(UI.rodValue), { n: (Math.round(v * 10) / 10) });
  }

  function goStep(delta) {
    var L = lesson(), n = state.step + delta;
    if (n < 0) return;
    if (n >= L.steps.length) { resetStep(); state.completed = true; writeProgress(L.id, { done: true }); render(true); return; }
    resetStep(); state.step = n; state.completed = false; render(true);
    var d = stepDef(); say(fill(t(UI.live), { n: n + 1, m: L.steps.length, title: t(d.title) }));
  }

  /* ---------------- drawing ---------------- */

  function sealHtml(i) { return '<span class="seal" lang="vi" aria-hidden="true"><span>' + esc(i.seal[0]) + "</span><span>" + esc(i.seal[1]) + "</span></span>"; }

  function listView() {
    var prog = readProgress();
    var cards = LESSONS.map(function (L) {
      var i = byId[L.id], p = prog[L.id] || {}, status, action;
      if (p.done) { status = '<span class="ln-status done"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>' + esc(t(UI.done)) + "</span>"; action = UI.again; }
      else if (p.step > 0) { status = '<span class="ln-status">' + esc(fill(t(UI.inProgress), { n: p.step + 1, m: L.steps.length })) + "</span>"; action = UI.cont; }
      else { status = '<span class="ln-status">' + esc(t(UI.notStarted)) + "</span>"; action = UI.start; }
      return '<li class="ln-card">' + sealHtml(i) + '<div class="ln-body"><h2>' + esc(t(L.title)) + '</h2><p class="ln-for" lang="vi">' + esc(cap(i.vi)) + " · " + esc(i.en) + "</p><p>" + esc(t(L.blurb)) + '</p>' +
        '<p class="ln-meta">' + esc(fill(t(UI.steps), { n: L.steps.length })) + " · " + esc(fill(t(UI.mins), { n: L.minutes })) + " · " + status + "</p>" +
        '<a class="ln-btn" href="learn.html?id=' + L.id + '"' + (p.done ? ' data-fresh="1"' : "") + ">" + esc(t(action)) + "</a></div></li>";
    }).join("");
    var soon = DATA.instruments.filter(function (i) { return i.page && !lessonById[i.id]; }).map(function (i) {
      return '<li class="ln-soon">' + sealHtml(i) + '<div><p class="ln-soon-name" lang="vi">' + esc(cap(i.vi)) + '</p><p class="ln-meta">' + esc(t(UI.soonT)) + "</p></div></li>";
    }).join("");
    return '<ul class="ln-list">' + cards + "</ul>" + (soon ? '<h2 class="ln-sub">' + esc(t(UI.soonT)) + '</h2><ul class="ln-soon-list">' + soon + "</ul>" : "");
  }

  function zitherBoard(def) {
    var target = def.type === "play" && !state.stepDone ? def.targets[state.sub] : -1;
    var rows = S.TONES.map(function (tn, k) {
      var isT = k === target;
      return '<button type="button" class="zs' + (isT ? " is-target" : "") + '" data-n="' + k + '"' + (isT ? ' aria-describedby="ln-target-note"' : "") + ">" +
        '<span class="k">' + KEYS[k].toUpperCase() + '</span><span class="zn" lang="vi">' + esc(tn.vi) + '</span><span class="zw">' + esc(tn.west) + "</span>" +
        '<span class="zline" aria-hidden="true"></span>' + (isT ? '<span class="zmark"><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>' + esc(t(UI.playThis)) + "</span>" : "") + "</button>";
    }).join("");
    var seq = "";
    if (def.type === "play" && def.targets.length > 1) {
      seq = '<ol class="seq" aria-hidden="true">' + def.targets.map(function (n, k) { return '<li class="' + (k < state.sub || state.stepDone ? "done" : (k === state.sub ? "now" : "")) + '" lang="vi">' + esc(toneName(n)) + "</li>"; }).join("") + "</ol>";
    }
    var listenBtn = def.type === "listen" ? '<button type="button" class="ln-btn" data-act="listen"' + (state.listening ? " disabled" : "") + '><svg class="icon" aria-hidden="true"><use href="#i-sound-on"/></svg><span>' + esc(t(state.listening ? UI.listening : UI.listen)) + "</span></button>" : "";
    return '<div class="board"><p class="visually-hidden" id="ln-target-note">' + esc(t(UI.playThis)) + '</p>' + seq + '<div class="zither" role="group" aria-label="' + esc(t(UI.strings)) + '">' + rows + "</div>" +
      '<p class="board-hint">' + esc(t(UI.keysHint)) + "</p>" + (listenBtn ? '<div class="board-actions">' + listenBtn + "</div>" : "") + "</div>";
  }

  function bauBoard(def) {
    var listenBtn = def.type === "listen-bau" ? '<button type="button" class="ln-btn" data-act="listen"' + (state.listening ? " disabled" : "") + '><svg class="icon" aria-hidden="true"><use href="#i-sound-on"/></svg><span>' + esc(t(state.listening ? UI.listening : UI.listen)) + "</span></button>" : "";
    var play = def.type === "listen-bau" ? "" :
      '<div class="bau-controls"><button type="button" class="ln-btn" data-act="pluck"><span>' + esc(t(UI.pluck)) + '</span></button><span class="bau-key">' + esc(t(UI.pluckKey)) + "</span></div>" +
      '<div class="rod-box"><label for="rod">' + esc(t(UI.rod)) + '</label><input id="rod" type="range" min="0" max="2.5" step="0.1" value="' + state.bend + '"><span class="rod-value" aria-hidden="true"></span></div>';
    return '<div class="board"><div class="bau" role="img" aria-label="' + esc(t(UI.boardBau)) + '"><div class="bau-box"></div><div class="bau-string"></div><div class="bau-rod"></div></div>' +
      (listenBtn ? '<div class="board-actions">' + listenBtn + "</div>" : "") + play + "</div>";
  }

  function lessonView() {
    var L = lesson(), i = byId[L.id], def = stepDef(), total = L.steps.length;
    if (state.completed) return doneView(L, i);
    var segs = L.steps.map(function (s, k) { return '<li class="' + (k < state.step ? "done" : (k === state.step ? "now" : "")) + '"><span class="visually-hidden">' + esc(t(s.title)) + "</span></li>"; }).join("");
    var fb = '<p class="fb ' + (state.fb ? state.fb.type : "empty") + '">' + fbInner() + "</p>";
    var muted = S && S.isMuted() ? '<p class="idf-error-like">' + esc(t(UI.muted)) + "</p>" : "";
    var board = L.id === "dan-bau" ? bauBoard(def) : zitherBoard(def);
    var last = state.step === total - 1;
    return '<nav class="ln-crumb"><a class="ink-link" href="learn.html"><span>' + esc(t(UI.allLessons)) + '</span></a></nav>' +
      '<header class="ln-head">' + sealHtml(i) + '<div><h1>' + esc(t(L.title)) + '</h1><p class="ln-for" lang="vi">' + esc(cap(i.vi)) + "</p></div></header>" +
      '<div class="stepper"><p class="step-count">' + esc(fill(t(UI.stepOf), { n: state.step + 1, m: total })) + '</p><ol class="segs" aria-label="' + esc(t(UI.progressLabel)) + '">' + segs + "</ol></div>" +
      '<section class="step"><h2 id="ln-step-title" tabindex="-1">' + esc(t(def.title)) + "</h2><p>" + esc(t(def.text)) + "</p></section>" + muted + board + fb +
      '<div class="ln-controls"><button type="button" class="ln-btn ghost" data-act="back"' + (state.step === 0 ? " disabled" : "") + ">" + esc(t(UI.back)) + "</button>" +
      '<button type="button" class="ln-btn ghost" data-act="replay"><svg class="icon" aria-hidden="true"><use href="#i-replay"/></svg>' + esc(t(UI.replay)) + "</button>" +
      '<button type="button" class="ln-btn primary" data-act="next"' + (state.stepDone ? "" : " disabled") + ">" + esc(t(last ? UI.finish : UI.next)) + "</button></div>" +
      '<p class="ln-save">' + esc(t(UI.saveNote)) + "</p>";
  }

  function doneView(L, i) {
    var idx = LESSONS.indexOf(L), nxt = LESSONS[idx + 1];
    var learned = L.learned.map(function (x) { return "<li>" + esc(t(x)) + "</li>"; }).join("");
    return '<nav class="ln-crumb"><a class="ink-link" href="learn.html"><span>' + esc(t(UI.allLessons)) + "</span></a></nav>" +
      '<section class="finish">' + sealHtml(i) + '<h1 id="ln-step-title" tabindex="-1">' + esc(t(UI.doneT)) + '</h1><p class="ln-for">' + esc(t(L.title)) + "</p>" +
      '<h2>' + esc(t(UI.learnedT)) + '</h2><ul class="learned">' + learned + "</ul>" +
      '<div class="btn-row"><a class="ln-btn primary" href="instrument.html?id=' + L.id + '">' + esc(t(UI.playIt)) + "</a>" +
      (nxt ? '<a class="ln-btn" href="learn.html?id=' + nxt.id + '">' + esc(t(UI.nextLesson)) + ": " + esc(t(nxt.title)) + "</a>" : "") +
      '<button type="button" class="ln-btn ghost" data-act="restart">' + esc(t(UI.again)) + "</button></div>" +
      '<p class="ln-save">' + esc(t(UI.saveNote)) + "</p></section>";
  }

  function render(focus) {
    var root = $("ln-root");
    if (!state.id) {
      document.body.setAttribute("data-view", "list");
      var miss = "";
      if (state.missing) { var mi = byId[state.missing]; miss = '<p class="idf-error-like" role="status">' + esc(fill(t(UI.soonLong), { name: mi ? mi.vi : state.missing })) + "</p>"; }
      root.innerHTML = '<header class="ln-intro"><h1>' + esc(t(UI.title)) + '</h1><p class="lede">' + esc(t(UI.lede)) + "</p></header>" + miss + listView();
      return;
    }
    document.body.setAttribute("data-view", "lesson");
    var ae = document.activeElement, keep = null;
    if (!focus && ae) {
      if (ae.classList && ae.classList.contains("zs")) keep = '.zs[data-n="' + ae.getAttribute("data-n") + '"]';
      else if (ae.getAttribute && ae.getAttribute("data-act")) keep = '[data-act="' + ae.getAttribute("data-act") + '"]';
    }
    root.innerHTML = lessonView();
    syncRod();
    if (keep) { var again = root.querySelector(keep); if (again && !again.disabled) again.focus({ preventScroll: true }); }
    if (focus) { var h = $("ln-step-title"); if (h) h.focus({ preventScroll: false }); }
  }

  /* ---------------- events ---------------- */

  function onClick(e) {
    var s = e.target.closest(".zs");
    if (s) { pressString(parseInt(s.getAttribute("data-n"), 10)); return; }
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "listen") runListen();
    else if (act === "pluck") onPluckBau();
    else if (act === "next") goStep(1);
    else if (act === "back") goStep(-1);
    else if (act === "replay") { resetStep(); render(false); var d = stepDef(); say(fill(t(UI.live), { n: state.step + 1, m: lesson().steps.length, title: t(d.title) })); }
    else if (act === "restart") { resetStep(); state.step = 0; state.completed = false; writeProgress(state.id, { step: 0, done: false }); render(true); }
  }

  function onKey(e) {
    if (!state.id || state.completed || e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = e.target && e.target.tagName; if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) && e.target.type !== "range") return;
    var def = stepDef(); if (!def) return;
    if (lesson().id === "dan-tranh") {
      var n = KEYS.indexOf(e.key.toLowerCase());
      if (n >= 0) { e.preventDefault(); pressString(n); }
    } else if (e.key === " " && def.type !== "listen-bau" && !(e.target.closest && e.target.closest("button"))) { e.preventDefault(); onPluckBau(); }
  }

  function init() {
    var id = new URLSearchParams(location.search).get("id");
    if (id && lessonById[id]) {
      state.id = id;
      var p = readProgress()[id] || {};
      // coming from the Instrument page: carry on where the visitor stopped, unless it was finished
      state.step = p.done ? 0 : Math.min(p.step || 0, lessonById[id].steps.length - 1);
      if (new URLSearchParams(location.search).get("restart")) { state.step = 0; }
    } else if (id) { state.missing = id; }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    document.addEventListener("input", function (e) { if (e.target && e.target.id === "rod") onRod(e); });
    document.addEventListener("nguam:lang", function () { render(false); });
    document.addEventListener("nguam:sound", function () { if (state.id) render(false); });
    render(false);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
