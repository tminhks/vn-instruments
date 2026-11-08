/* Identify page: take a picture, run it through the small model that ships with the site,
   and show an honest answer: sure, not sure (with options to choose from) or not found. */
(function () {
  "use strict";

  var DATA = window.NGUAM_DATA, S = window.NguAmSound, SAMPLES = window.NGUAM_SAMPLES || [];
  var $ = function (id) { return document.getElementById(id); };
  var byId = {};
  DATA.instruments.forEach(function (i) { byId[i.id] = i; });

  // How the answer is read (written in PRODUCT.md): sure only when the top answer is at
  // least 60% AND at least 40 points ahead of the next one.
  var SURE_MIN = 0.6, SURE_GAP = 0.4, NONE_MIN = 0.5, MAX_BYTES = 15 * 1024 * 1024;

  var UI = {
    add: { en: "Add a picture", vi: "Thêm một bức ảnh" },
    kinds: { en: "A photo, a painting or a film screenshot.", vi: "Ảnh chụp, tranh vẽ hoặc ảnh chụp màn hình phim." },
    choose: { en: "Choose a picture", vi: "Chọn ảnh" },
    camera: { en: "Take a photo", vi: "Chụp ảnh" },
    howMouse: { en: "Or drag a picture here, or paste one with Ctrl+V.", vi: "Hoặc kéo ảnh vào đây, hoặc dán ảnh bằng Ctrl+V." },
    howTouch: { en: "Screenshots from your gallery work too.", vi: "Ảnh chụp màn hình trong thư viện máy cũng dùng được." },
    privacy: { en: "Your picture stays on your device.", vi: "Ảnh của bạn ở lại trên máy bạn." },
    aboutT: { en: "How sure is the answer?", vi: "Câu trả lời chắc đến đâu?" },
    aboutP: { en: "Ngũ Âm never pretends. It tells you how sure it is, and when it is not sure it shows you the choices.", vi: "Ngũ Âm không nói quá. Web cho bạn biết mức chắc chắn, và khi chưa chắc thì đưa ra các lựa chọn." },
    sureHi: { en: "Sure", vi: "Chắc chắn" },
    sureMid: { en: "Fairly sure", vi: "Khá chắc" },
    sureLo: { en: "Not sure", vi: "Chưa chắc" },
    aboutHi: { en: "60% or more, and clearly ahead of the next answer", vi: "Từ 60% và hơn hẳn đáp án thứ hai" },
    aboutMid: { en: "close answers: you pick", vi: "các đáp án sát nhau: bạn chọn" },
    aboutLo: { en: "no instrument found: try a clearer picture", vi: "không thấy nhạc cụ: thử ảnh rõ hơn" },
    yours: { en: "Your picture", vi: "Ảnh của bạn" },
    another: { en: "Try another picture", vi: "Thử ảnh khác" },
    looking: { en: "Looking at your picture…", vi: "Đang xem ảnh của bạn…" },
    thisLooks: { en: "This looks like the {name}", vi: "Đây có vẻ là {name}" },
    notSure: { en: "Not sure. Which one is it?", vi: "Chưa chắc. Đây là cây nào?" },
    notSureOne: { en: "Not sure. Is it the {name}?", vi: "Chưa chắc. Có phải {name} không?" },
    whyClose: { en: "The top answers are close, so please check.", vi: "Các đáp án đầu rất sát nhau, bạn hãy kiểm tra giúp." },
    whyLow: { en: "The best answer is below {n}%, so please check.", vi: "Đáp án tốt nhất dưới {n}%, bạn hãy kiểm tra giúp." },
    chosen: { en: "You picked the {name}", vi: "Bạn đã chọn {name}" },
    chosenWhy: { en: "The model's own answer was {x}.", vi: "Đáp án của mô hình là {x}." },
    thisOne: { en: "This one", vi: "Cây này" },
    yesThis: { en: "Yes, this one", vi: "Đúng, cây này" },
    notThis: { en: "Not this one?", vi: "Không phải cây này?" },
    none: { en: "No instrument found", vi: "Không thấy nhạc cụ" },
    noneWhy: { en: "This picture looks like something else. It may help to:", vi: "Ảnh này có vẻ là thứ khác. Bạn có thể thử:" },
    tip1: { en: "get closer, so the instrument fills most of the picture", vi: "chụp gần hơn để nhạc cụ chiếm phần lớn khung ảnh" },
    tip2: { en: "use good light, and one instrument per picture", vi: "đủ sáng, và mỗi ảnh chỉ một nhạc cụ" },
    tip3: { en: "crop the picture if there are many instruments", vi: "cắt ảnh nếu có nhiều nhạc cụ" },
    tip4: { en: "know it is an instrument? Choose it from the list.", vi: "biết đó là nhạc cụ? Hãy chọn từ danh sách." },
    fromList: { en: "None of these: choose from the list", vi: "Không cây nào: chọn từ danh sách" },
    listT: { en: "Choose from the list", vi: "Chọn từ danh sách" },
    listP: { en: "These are the instruments Ngũ Âm can recognise.", vi: "Đây là các nhạc cụ Ngũ Âm nhận diện được." },
    browse: { en: "Browse all instruments", vi: "Xem tất cả nhạc cụ" },
    cmpT: { en: "Compare with your picture", vi: "So sánh với ảnh của bạn" },
    tellT: { en: "How to tell it", vi: "Cách nhận ra" },
    listen: { en: "Listen", vi: "Nghe thử" },
    stop: { en: "Stop", vi: "Dừng" },
    play: { en: "Play it", vi: "Chơi thử" },
    story: { en: "Read its story", vi: "Đọc câu chuyện" },
    save: { en: "Save", vi: "Lưu" },
    saved: { en: "Saved", vi: "Đã lưu" },
    all: { en: "Show all scores", vi: "Xem điểm của mọi lớp" },
    noneClass: { en: "Not an instrument", vi: "Không phải nhạc cụ" },
    err: {
      notImage: { en: "That file is not a picture. Choose a JPG, PNG or WebP picture.", vi: "Tệp đó không phải ảnh. Hãy chọn ảnh JPG, PNG hoặc WebP." },
      tooBig: { en: "That picture is too large (over 15 MB). Choose a smaller one.", vi: "Ảnh này quá lớn (trên 15 MB). Hãy chọn ảnh nhỏ hơn." },
      decode: { en: "This picture could not be opened. Try another one.", vi: "Không mở được ảnh này. Hãy thử ảnh khác." },
      model: { en: "The recognition model could not start in this browser. You can still choose the instrument from the list.", vi: "Mô hình nhận diện không khởi động được trên trình duyệt này. Bạn vẫn chọn nhạc cụ từ danh sách được." }
    },
    liveSure: { en: "Result: {name}, {n} percent sure.", vi: "Kết quả: {name}, chắc chắn {n} phần trăm." },
    liveUnsure: { en: "Not sure. Choices: {names}.", vi: "Chưa chắc. Các lựa chọn: {names}." },
    liveNone: { en: "No instrument found in this picture.", vi: "Không thấy nhạc cụ trong ảnh này." },
    liveSaved: { en: "{name} saved.", vi: "Đã lưu {name}." },
    liveUnsaved: { en: "{name} removed from saved.", vi: "Đã bỏ lưu {name}." }
  };

  var state = { phase: "empty", pic: null, result: null, chosen: null, error: null, listOpen: false, token: 0 };
  var model = null, modelError = false, modelPromise = null, stopAudio = null;

  function lang() { return window.NguAm ? NguAm.lang() : "en"; }
  function t(o) { return o ? (o[lang()] || o.en || "") : ""; }
  function fill(s, map) { return s.replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pct(p) { return Math.round(p * 100); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function name(i) { return cap(i.vi); }
  function say(msg) { var el = $("idf-live"); el.textContent = ""; setTimeout(function () { el.textContent = msg; }, 60); }

  /* ---------------- the model ---------------- */

  function loadModel() {
    if (modelPromise) return modelPromise;
    modelPromise = new Promise(function (resolve, reject) {
      if (!window.tf || !window.NGUAM_MODEL) { reject(new Error("model files missing")); return; }
      var M = window.NGUAM_MODEL;
      var bytes = Uint8Array.from(atob(M.weightsBase64), function (c) { return c.charCodeAt(0); });
      // The processor is used rather than the graphics card: the graphics card takes about ten
      // seconds to start the first time on some machines, the processor answers in about a second
      // and a half every time, which is what a visitor needs to be able to count on.
      Promise.resolve(tf.setBackend("cpu")).then(function () {
        return tf.loadLayersModel(tf.io.fromMemory(M.modelTopology, M.weightSpecs, bytes.buffer));
      }).then(function (m) {
        // The first prediction prepares the graphics card and is slow; do it now, on a blank
        // picture, so that the visitor's own picture is answered at once.
        var warm = tf.tidy(function () { return m.predict(tf.zeros([1, 224, 224, 3])); });
        warm.data().then(function () { warm.dispose(); model = m; resolve(m); }, reject);
      }, reject);
    });
    modelPromise.catch(function () { modelError = true; });
    return modelPromise;
  }

  // Returns one probability per label, in the order of NGUAM_MODEL.labels.
  function predict(img) {
    return loadModel().then(function (m) {
      var s = Math.min(img.naturalWidth, img.naturalHeight), c = document.createElement("canvas");
      c.width = c.height = 224;
      c.getContext("2d").drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, 224, 224);
      var out = tf.tidy(function () { return m.predict(tf.browser.fromPixels(c).toFloat().div(127.5).sub(1).expandDims()); });
      return out.data().then(function (d) { out.dispose(); return Array.prototype.slice.call(d); });
    });
  }

  // Turn the probabilities into one of three honest outcomes.
  function interpret(probs) {
    var labels = window.NGUAM_MODEL.labels;
    var all = labels.map(function (l, k) { return { id: l === "khong-phai-nhac-cu" ? "none" : l, p: probs[k] }; })
      .sort(function (a, b) { return b.p - a.p; });
    var inst = all.filter(function (r) { return r.id !== "none" && byId[r.id]; });
    var noneP = (all.filter(function (r) { return r.id === "none"; })[0] || { p: 0 }).p;
    var top = all[0], second = all[1];
    var r = { all: all, inst: inst, noneP: noneP };
    if (top.id === "none" && top.p >= NONE_MIN) r.kind = "none";
    else if (top.id !== "none" && top.p >= SURE_MIN && top.p - second.p >= SURE_GAP) r.kind = "sure";
    else r.kind = "unsure";
    r.best = inst[0];
    r.options = inst.filter(function (o, k) { return k < 3 && o.p >= 0.05; });
    if (!r.options.length) r.options = inst.slice(0, 2);
    r.why = (top.id !== "none" && top.p < SURE_MIN) ? "low" : "close";
    return r;
  }

  /* ---------------- loading a picture ---------------- */

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("decode")); };
      img.src = url;
    });
  }

  function analyse(url, label, isFile) {
    var token = ++state.token;
    if (state.pic && state.pic.revoke) URL.revokeObjectURL(state.pic.url);
    state.pic = { url: url, label: label, revoke: isFile };
    state.phase = "loading"; state.result = null; state.chosen = null; state.error = null; state.listOpen = false;
    render();
    var started = Date.now();
    loadImage(url).then(function (img) {
      return predict(img);
    }).then(function (probs) {
      // keep the "looking" state long enough to be seen, never longer than needed
      var wait = Math.max(0, 600 - (Date.now() - started));
      setTimeout(function () {
        if (token !== state.token) return;
        state.result = interpret(probs); state.phase = "done";
        render(true);
        announce();
      }, wait);
    }).catch(function (e) {
      if (token !== state.token) return;
      state.phase = "empty"; state.pic = null;
      state.error = (e && e.message === "decode") ? "decode" : "model";
      if (state.error === "model") { state.phase = "done"; state.result = { kind: "failed", inst: [], options: [] }; state.pic = { url: url, label: label, revoke: isFile }; }
      render(true);
    });
  }

  function takeFile(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) { state.error = "notImage"; if (state.phase !== "done") state.phase = "empty"; render(true); return; }
    if (file.size > MAX_BYTES) { state.error = "tooBig"; if (state.phase !== "done") state.phase = "empty"; render(true); return; }
    analyse(URL.createObjectURL(file), { en: file.name, vi: file.name }, true);
  }

  function announce() {
    var r = state.result; if (!r) return;
    if (r.kind === "sure") say(fill(t(UI.liveSure), { name: name(byId[r.best.id]), n: pct(r.best.p) }));
    else if (r.kind === "unsure") say(fill(t(UI.liveUnsure), { names: r.options.map(function (o) { return name(byId[o.id]) + " " + pct(o.p) + "%"; }).join(", ") }));
    else if (r.kind === "none") say(t(UI.liveNone));
  }

  /* ---------------- saved instruments (shared with the other pages) ---------------- */

  function getSaved() { try { return JSON.parse(localStorage.getItem("nguam.saved") || "[]"); } catch (e) { return []; } }
  function toggleSaved(id) {
    var list = getSaved(), k = list.indexOf(id), on = k < 0;
    if (on) list.push(id); else list.splice(k, 1);
    localStorage.setItem("nguam.saved", JSON.stringify(list));
    var badge = $("saved-count");
    if (badge) { badge.textContent = list.length; badge.hidden = list.length === 0; }
    say(fill(t(on ? UI.liveSaved : UI.liveUnsaved), { name: name(byId[id]) }));
    return on;
  }

  /* ---------------- sound ---------------- */

  function listen(id, btn) {
    if (stopAudio) { var s = stopAudio; stopAudio = null; s(); if (btn.getAttribute("aria-pressed") === "true") return; }
    if (!S) return;
    S.unlock().then(function () {
      function done() { stopAudio = null; render(false, true); }
      if (id === "dan-bau") { stopAudio = S.bauPhrase(done); }
      else {
        var timers = [];
        S.TONES.forEach(function (tone, k) { timers.push(setTimeout(function () { S.pluck(tone.freq, 0.5); }, k * 260)); });
        timers.push(setTimeout(done, 1700));
        stopAudio = function () { timers.forEach(clearTimeout); };
      }
      btn.setAttribute("aria-pressed", "true");
      var span = btn.querySelector("span"); if (span) span.textContent = t(UI.stop);
    });
  }

  /* ---------------- drawing the page ---------------- */

  function shapeFor(id) {
    var i = byId[id];
    return window.NGUAM_SHAPES && NGUAM_SHAPES.has(id) ? NGUAM_SHAPES.svg(id, esc(t(i.telling))) : "";
  }

  function sureBar(p) {
    var cls = p >= 0.9 ? "high" : (p >= SURE_MIN ? "" : "low");
    var word = p >= 0.9 ? UI.sureHi : (p >= SURE_MIN ? UI.sureMid : UI.sureLo);
    return '<div class="sure ' + cls + '"><div class="sure-label"><span>' + esc(t(word)) + "</span><span>" + pct(p) + '%</span></div>' +
      '<div class="meter" role="img" aria-label="' + pct(p) + '%"><i data-w="' + pct(p) + '"></i></div></div>';
  }

  function emptyLeft() {
    var err = state.error ? '<p class="idf-error" role="alert">' + esc(t(UI.err[state.error])) + "</p>" : "";
    return '<div class="dropzone" id="dropzone">' +
      '<img class="dz-mark" src="assets/img/logo.png" alt="" width="74" height="74">' +
      "<h2>" + esc(t(UI.add)) + "</h2>" +
      '<p class="dz-kinds">' + esc(t(UI.kinds)) + "</p>" +
      '<div class="btn-row" style="justify-content:center">' +
        '<button type="button" class="idf-btn seal-btn" data-act="choose">' + esc(t(UI.choose)) + "</button>" +
        '<button type="button" class="idf-btn ghost on-touch" data-act="camera">' + esc(t(UI.camera)) + "</button>" +
      "</div>" +
      '<p class="dz-how"><span class="on-mouse">' + esc(t(UI.howMouse)) + '</span><span class="on-touch">' + esc(t(UI.howTouch)) + "</span></p>" +
      '<p class="dz-privacy"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>' + esc(t(UI.privacy)) + "</p>" +
      err + "</div>";
  }

  function emptyRight() {
    return '<div class="about-card"><h2 id="idf-result-title">' + esc(t(UI.aboutT)) + "</h2><p>" + esc(t(UI.aboutP)) + "</p><ul>" +
      "<li><b>" + esc(t(UI.sureHi)) + "</b><span>" + esc(t(UI.aboutHi)) + "</span></li>" +
      "<li><b>" + esc(t(UI.sureLo)) + "</b><span>" + esc(t(UI.aboutMid)) + "</span></li>" +
      "<li><b>" + esc(t(UI.none)) + "</b><span>" + esc(t(UI.aboutLo)) + "</span></li></ul></div>";
  }

  function pictureLeft() {
    var p = state.pic, err = state.error ? '<p class="idf-error" role="alert">' + esc(t(UI.err[state.error])) + "</p>" : "";
    return '<figure class="pic"><img src="' + esc(p.url) + '" alt="' + esc(t(UI.yours)) + '">' +
      "<figcaption>" + esc(t(p.label)) + "</figcaption></figure>" +
      '<div class="pic-actions btn-row"><button type="button" class="idf-btn ghost" data-act="choose">' + esc(t(UI.another)) + "</button>" +
      '<button type="button" class="idf-btn ghost on-touch" data-act="camera">' + esc(t(UI.camera)) + "</button></div>" + err;
  }

  function looking() {
    var paths = ""; for (var k = 0; k < 5; k++) paths += '<path d="M2 ' + (10 + k * 12) + 'c14-8 28 8 42 0s28-8 42 0 26 8 32 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>';
    return '<div class="looking"><h2 id="idf-result-title" class="visually-hidden">' + esc(t(UI.looking)) + '</h2><svg viewBox="0 0 120 70" aria-hidden="true">' + paths + "</svg><p>" + esc(t(UI.looking)) + "</p></div>";
  }

  function summaryCard(id, headline, sureHtml, extra) {
    var i = byId[id], saved = getSaved().indexOf(id) >= 0;
    var listen = i.playable ? '<button type="button" class="idf-btn ghost" data-act="listen" data-id="' + id + '" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-sound-on"/></svg><span>' + esc(t(UI.listen)) + "</span></button>" : "";
    return '<div class="res-card"><div class="res-top"><span class="seal" lang="vi" aria-hidden="true"><span>' + esc(i.seal[0]) + "</span><span>" + esc(i.seal[1]) + "</span></span>" +
      "<div><p class=\"res-name\" lang=\"vi\">" + esc(name(i)) + '</p><p class="res-sub">' + esc(i.en) + " · " + esc(lang() === "vi" ? "đọc là" : "say it") + " “" + esc(i.say) + "”</p></div></div>" +
      (sureHtml || "") +
      '<p class="res-sum">' + esc(t(i.summary)) + "</p>" +
      '<p class="res-tell"><b>' + esc(t(UI.tellT)) + ":</b> " + esc(t(i.telling)) + "</p>" +
      (extra || "") +
      '<div class="btn-row">' + listen +
        '<a class="idf-btn" href="instrument.html?id=' + id + '">' + esc(t(UI.play)) + "</a>" +
        '<a class="idf-btn ghost" href="library.html#' + id + '">' + esc(t(UI.story)) + "</a>" +
        '<button type="button" class="idf-btn ghost" data-act="save" data-id="' + id + '" aria-pressed="' + saved + '"><svg class="icon" aria-hidden="true"><use href="#i-star"/></svg><span>' + esc(t(saved ? UI.saved : UI.save)) + "</span></button>" +
      "</div></div>";
  }

  function allScores(r) {
    var rows = r.all.map(function (a) {
      var label = a.id === "none" ? t(UI.noneClass) : name(byId[a.id]);
      return "<li><span>" + esc(label) + '</span><div class="meter"><i data-w="' + pct(a.p) + '"></i></div><b>' + pct(a.p) + "%</b></li>";
    }).join("");
    return '<details class="all-scores"><summary>' + esc(t(UI.all)) + '</summary><ul class="score-list">' + rows + "</ul></details>";
  }

  function pickList() {
    var items = DATA.instruments.filter(function (i) { return i.recognisable; }).map(function (i) {
      return '<li><button type="button" data-act="pick" data-id="' + i.id + '"><span class="seal" lang="vi" aria-hidden="true"><span>' + esc(i.seal[0]) + "</span><span>" + esc(i.seal[1]) + "</span></span><span>" + esc(name(i)) + "</span></button></li>";
    }).join("");
    return '<div class="pick" id="pick"><h3>' + esc(t(UI.listT)) + "</h3><p class=\"res-why\">" + esc(t(UI.listP)) + '</p><ul class="pick-list">' + items + '</ul><p><a class="ink-link" href="library.html"><span>' + esc(t(UI.browse)) + '</span><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a></p></div>';
  }

  function compareTable(opts) {
    var cols = opts.length + 1;
    var head = '<div class="cmp-head" style="--cols:' + cols + '"><div><img src="' + esc(state.pic.url) + '" alt=""><span>' + esc(t(UI.yours)) + "</span></div>" +
      opts.map(function (o) { return "<div lang=\"vi\">" + esc(name(byId[o.id])) + "</div>"; }).join("") + "</div>";
    var rows = DATA.compareRows.map(function (row) {
      return '<dl class="cmp-row" style="--cols:' + cols + '"><dt>' + esc(t(row)) + '</dt><dd class="mine">' + (row.id === "body" ? esc(lang() === "vi" ? "Nhìn ảnh của bạn" : "Look at your picture") : "") + "</dd>" +
        opts.map(function (o) { return '<dd data-name="' + esc(name(byId[o.id])) + '">' + esc(t(byId[o.id].compare[row.id])) + "</dd>"; }).join("") + "</dl>";
    }).join("");
    return '<section class="cmp" aria-labelledby="cmp-t"><h3 id="cmp-t">' + esc(t(UI.cmpT)) + "</h3>" + head + rows + "</section>";
  }

  function resultRight() {
    var r = state.result, out = "";
    if (state.chosen) {
      var c = byId[state.chosen];
      var ownAnswer = r.kind === "none" ? t(UI.noneClass) : (r.best ? name(byId[r.best.id]) + " " + pct(r.best.p) + "%" : "");
      var chosenNote = r.kind === "failed" ? "" : '<p class="res-why">' + esc(fill(t(UI.chosenWhy), { x: ownAnswer })) + "</p>";
      return '<div class="res"><h2 id="idf-result-title" tabindex="-1">' + esc(fill(t(UI.chosen), { name: c.vi })) + "</h2>" + chosenNote +
        summaryCard(state.chosen, "", "", "") + '<p><button type="button" class="idf-text-btn" data-act="reopen">' + esc(t(UI.notThis)) + "</button></p></div>";
    }
    if (r.kind === "failed") {
      return '<div class="res"><h2 id="idf-result-title" tabindex="-1">' + esc(t(UI.listT)) + '</h2><p class="idf-error" role="alert">' + esc(t(UI.err.model)) + "</p>" + pickList() + "</div>";
    }
    if (r.kind === "sure") {
      var b = r.best;
      out = '<div class="res"><h2 id="idf-result-title" tabindex="-1">' + esc(fill(t(UI.thisLooks), { name: byId[b.id].vi })) + "</h2>" +
        summaryCard(b.id, "", sureBar(b.p), "") + allScores(r) +
        '<p><button type="button" class="idf-text-btn" data-act="reopen">' + esc(t(UI.notThis)) + "</button></p>" +
        (state.listOpen ? optionsBlock(r) : "") + "</div>";
      return out;
    }
    if (r.kind === "none") {
      out = '<div class="res"><h2 id="idf-result-title" tabindex="-1">' + esc(t(UI.none)) + "</h2><p class=\"res-why\">" + esc(t(UI.noneWhy)) + "</p>" +
        '<ul class="tips"><li>' + esc(t(UI.tip1)) + "</li><li>" + esc(t(UI.tip2)) + "</li><li>" + esc(t(UI.tip3)) + "</li><li>" + esc(t(UI.tip4)) + "</li></ul>" +
        pickList() + allScores(r) + "</div>";
      return out;
    }
    return '<div class="res">' + optionsBlock(r) + "</div>";
  }

  // "Not sure": picture options, a comparison with the user's own picture, and a way out.
  function optionsBlock(r) {
    var one = r.options.length === 1, first = byId[r.options[0].id];
    var title = one ? fill(t(UI.notSureOne), { name: first.vi }) : t(UI.notSure);
    var why = r.why === "low" ? fill(t(UI.whyLow), { n: pct(SURE_MIN) }) : t(UI.whyClose);
    var cards = r.options.map(function (o) {
      var i = byId[o.id];
      return '<article class="opt"><div class="shape-box" aria-hidden="true">' + shapeFor(o.id) + "</div>" +
        '<h3 lang="vi">' + esc(name(i)) + '</h3><p class="res-sub">' + esc(i.en) + "</p>" + sureBar(o.p) +
        '<p class="res-tell">' + esc(t(i.telling)) + '</p><button type="button" class="idf-btn" data-act="pick" data-id="' + o.id + '">' + esc(t(one ? UI.yesThis : UI.thisOne)) + "</button></article>";
    }).join("");
    return '<h2 id="idf-result-title" tabindex="-1">' + esc(title) + "</h2><p class=\"res-why\">" + esc(why) + '</p><div class="opts">' + cards + "</div>" +
      (r.options.length > 1 ? compareTable(r.options) : "") +
      '<p><button type="button" class="idf-text-btn" data-act="list">' + esc(t(UI.fromList)) + "</button></p>" +
      (state.listOpen ? pickList() : "") + allScores(r);
  }

  function renderSamples() {
    $("sample-row").innerHTML = SAMPLES.map(function (s) {
      return '<li><button type="button" data-act="sample" data-id="' + s.id + '"><img src="' + s.src + '" alt="" loading="lazy"><span>' + esc(t(s.label)) + "</span></button></li>";
    }).join("");
  }

  function render(moveFocus, keepScroll) {
    var left = $("idf-left"), right = $("idf-right"), stage = $("idf-stage");
    stage.setAttribute("data-phase", state.phase);
    if (state.phase === "empty") { left.innerHTML = emptyLeft(); right.innerHTML = emptyRight(); }
    else if (state.phase === "loading") { left.innerHTML = pictureLeft(); right.innerHTML = looking(); }
    else { left.innerHTML = pictureLeft(); right.innerHTML = resultRight(); }
    // grow the bars after they are in the page so the change is seen
    requestAnimationFrame(function () {
      Array.prototype.forEach.call(document.querySelectorAll(".meter i[data-w]"), function (el) { el.style.width = el.getAttribute("data-w") + "%"; });
    });
    renderSamples();
    if (moveFocus && state.phase === "done") {
      var h = $("idf-result-title"); if (h) { h.focus({ preventScroll: true }); if (window.innerWidth < 960) right.scrollIntoView({ block: "start", behavior: "smooth" }); }
    }
  }

  /* ---------------- events ---------------- */

  function onClick(e) {
    var el = e.target.closest("[data-act]"); if (!el) return;
    var act = el.getAttribute("data-act"), id = el.getAttribute("data-id");
    if (act === "choose") $("file-input").click();
    else if (act === "camera") $("camera-input").click();
    else if (act === "sample") { var s = SAMPLES.filter(function (x) { return x.id === id; })[0]; if (s) analyse(s.src, s.label, false); }
    else if (act === "pick") { state.chosen = id; state.listOpen = false; render(true); say(fill(t(UI.chosen), { name: byId[id].vi })); }
    else if (act === "list") { state.listOpen = true; render(false); var p = $("pick"); if (p) { p.scrollIntoView({ block: "nearest", behavior: "smooth" }); var b = p.querySelector("button"); if (b) b.focus({ preventScroll: true }); } }
    else if (act === "reopen") { state.chosen = null; state.listOpen = true; if (state.result.kind === "sure") state.result = Object.assign({}, state.result, { kind: "unsure", why: "close", options: state.result.inst.slice(0, 3) }); render(true); }
    else if (act === "save") { var on = toggleSaved(id); el.setAttribute("aria-pressed", String(on)); el.querySelector("span").textContent = t(on ? UI.saved : UI.save); }
    else if (act === "listen") listen(id, el);
  }

  function init() {
    document.addEventListener("click", onClick);
    $("file-input").addEventListener("change", function (e) { takeFile(e.target.files[0]); e.target.value = ""; });
    $("camera-input").addEventListener("change", function (e) { takeFile(e.target.files[0]); e.target.value = ""; });

    // drag a picture onto the page; paste a screenshot
    var depth = 0;
    window.addEventListener("dragover", function (e) { e.preventDefault(); });
    window.addEventListener("dragenter", function (e) { e.preventDefault(); depth++; var z = $("dropzone"); if (z) z.classList.add("is-over"); });
    window.addEventListener("dragleave", function () { depth = Math.max(0, depth - 1); if (!depth) { var z = $("dropzone"); if (z) z.classList.remove("is-over"); } });
    window.addEventListener("drop", function (e) { e.preventDefault(); depth = 0; var z = $("dropzone"); if (z) z.classList.remove("is-over"); if (e.dataTransfer && e.dataTransfer.files.length) takeFile(e.dataTransfer.files[0]); });
    document.addEventListener("paste", function (e) {
      var t0 = e.target; if (t0 && (t0.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t0.tagName))) return;
      var items = (e.clipboardData && e.clipboardData.items) || [];
      for (var k = 0; k < items.length; k++) if (items[k].kind === "file" && /^image\//.test(items[k].type)) { takeFile(items[k].getAsFile()); e.preventDefault(); return; }
    });

    document.addEventListener("nguam:lang", function () { render(false); });
    render(false);
    // start the model quietly once the page has settled, so the first answer is quick
    setTimeout(function () { loadModel().catch(function () {}); }, 800);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
