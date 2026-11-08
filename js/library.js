/* Instruments page: filter, search (with or without accents), save, listen,
   read more and compare two instruments side by side. */
(function () {
  "use strict";

  var DATA = window.NGUAM_DATA;
  var SAVED_KEY = "nguam.saved";
  var state = { q: "", family: "all", region: "all", playable: false, saved: false };
  var stopSound = null;
  var playingId = null;

  var UI = {
    all: { en: "All", vi: "Tất cả" },
    allFamilies: { en: "All families", vi: "Mọi họ" },
    allRegions: { en: "All regions", vi: "Mọi vùng" },
    showing: { en: "Showing {n} of {t} instruments", vi: "Đang hiện {n} trên {t} nhạc cụ" },
    showingAll: { en: "All {t} instruments", vi: "Cả {t} nhạc cụ" },
    title: { en: "The instruments", vi: "Các nhạc cụ" },
    savedTitle: { en: "Your saved instruments", vi: "Nhạc cụ bạn đã lưu" },
    openPageLink: { en: "Open the instrument page", vi: "Mở trang nhạc cụ" },
    openPagePlay: { en: "Open the page and play", vi: "Mở trang và chơi thử" },
    showN: { en: "Show {n} instruments", vi: "Xem {n} nhạc cụ" },
    showOne: { en: "Show 1 instrument", vi: "Xem 1 nhạc cụ" },
    showNone: { en: "No instruments to show", vi: "Không có nhạc cụ để xem" },
    plays: { en: "Plays on screen", vi: "Chơi được trên màn hình" },
    readMore: { en: "Read more", vi: "Đọc thêm" },
    listen: { en: "Listen", vi: "Nghe thử" },
    stop: { en: "Stop", vi: "Dừng" },
    save: { en: "Save", vi: "Lưu" },
    saved: { en: "Saved", vi: "Đã lưu" },
    compare: { en: "Compare", vi: "So sánh" },
    source: { en: "Source", vi: "Nguồn" },
    people: { en: "Played by", vi: "Dân tộc" },
    close: { en: "Close", vi: "Đóng" },
    drawing: { en: "Outline drawing of the {name}.", vi: "Hình vẽ nét của {name}." },
    pairLede: { en: "The đàn nguyệt and the đàn tỳ bà are the pair people mix up most. Pick any two to compare them row by row.", vi: "Đàn nguyệt và đàn tỳ bà là cặp dễ nhầm nhất. Chọn hai nhạc cụ bất kỳ để so từng hàng." },
    anyLede: { en: "Comparing the {a} and the {b}, row by row. The shaded row shows how to tell them apart.", vi: "So sánh {a} và {b} theo từng hàng. Hàng tô màu cho biết cách phân biệt." },
    emptySavedTitle: { en: "Nothing saved yet", vi: "Chưa lưu nhạc cụ nào" },
    emptyQueryTitle: { en: "No instrument here is called “{q}”", vi: "Không có nhạc cụ nào tên “{q}”" },
    emptyFiltersTitle: { en: "No instrument fits all of these", vi: "Không có nhạc cụ nào khớp tất cả" },
    whyQuery2: { en: "Search looks at names in Vietnamese and English, families and regions. Try one of these:", vi: "Ô tìm xem tên tiếng Việt, tên tiếng Anh, họ nhạc cụ và vùng. Thử một trong số này:" },
    whyComing: { en: "The {name} ({en}) is coming in the full version. Meanwhile, try one of these:", vi: "{name} ({en}) sẽ có ở bản đầy đủ. Trong lúc chờ, thử một trong số này:" },
    whyFilters2: { en: "Drop one filter to see more:", vi: "Bỏ bớt một bộ lọc để xem thêm:" },
    dropFilter: { en: "Remove “{f}” ({n})", vi: "Bỏ “{f}” ({n})" },
    clearSearch: { en: "Clear the search", vi: "Xóa ô tìm" },
    showAll: { en: "Show all instruments", vi: "Hiện tất cả nhạc cụ" },
    undo: { en: "Undo", vi: "Hoàn tác" },
    removedSaved: { en: "{name} removed from saved.", vi: "Đã bỏ lưu {name}." },
    comingTitle: { en: "Coming in the full version", vi: "Có ở bản đầy đủ" },
    comingText: { en: "A real photograph and recording, recognition from pictures, playing on screen and a first lesson.", vi: "Ảnh và bản thu thật, nhận diện từ ảnh, chơi thử trên màn hình và bài học đầu tiên." },
    tellApart: { en: "How to tell them apart", vi: "Cách phân biệt" },
    sameTwice: { en: "Pick two different instruments to compare.", vi: "Hãy chọn hai nhạc cụ khác nhau để so sánh." },
    whySaved: { en: "You have not saved any instrument yet. Press Save on a card to keep it here.", vi: "Bạn chưa lưu nhạc cụ nào. Bấm Lưu trên một thẻ để giữ nó ở đây." },
    soundOff: { en: "Sound is off. Turn it on with the Sound button in the menu.", vi: "Đang tắt tiếng. Bật lại bằng nút Âm thanh trên menu." },
    noAudio: { en: "This browser cannot play sound.", vi: "Trình duyệt này không phát được âm thanh." },
    nowSaved: { en: "{name} saved.", vi: "Đã lưu {name}." },
    nowUnsaved: { en: "{name} removed from saved.", vi: "Đã bỏ lưu {name}." },
    nowCompare: { en: "{a} and {b} are now side by side below.", vi: "Đã đặt {a} và {b} cạnh nhau ở bên dưới." },
    placeholder: { en: "e.g. dan bau, flute, drum", vi: "ví dụ: dan bau, sáo, trống" },
    inTray: { en: "In compare", vi: "Đang so sánh" },
    remove: { en: "Remove", vi: "Bỏ" },
    pickOne: { en: "Pick one more instrument to compare with it.", vi: "Chọn thêm một nhạc cụ để so với nó." },
    added: { en: "{name} added. Pick one more to compare.", vi: "Đã thêm {name}. Chọn thêm một nhạc cụ để so sánh." },
    ready: { en: "{a} and {b} are ready. Press Compare these two.", vi: "Đã có {a} và {b}. Bấm So sánh hai cây này." },
    replaced: { en: "Two is the limit, so {old} was swapped for {name}.", vi: "Khay chỉ chứa hai, nên {old} được đổi thành {name}." },
    removed: { en: "{name} removed from compare.", vi: "Đã bỏ {name} khỏi so sánh." }
  };

  function lang() { return window.NguAm ? NguAm.lang() : "en"; }
  function t(o) { return o ? (o[lang()] || o.en) : ""; }
  function fill(s, map) { return s.replace(/\{(\w+)\}/g, function (_, k) { return map[k]; }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function byId(id) { return DATA.instruments.filter(function (i) { return i.id === id; })[0]; }
  function familyName(id) { return t(DATA.families.filter(function (f) { return f.id === id; })[0]); }
  function regionName(id) { return t(DATA.regions.filter(function (r) { return r.id === id; })[0]); }

  // "Đàn Bầu" and "dan bau" both become "dan bau".
  function fold(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/['’]/g, "").replace(/[-_.,/]+/g, " ").replace(/\s+/g, " ").trim();
  }
  var index = {};
  DATA.instruments.forEach(function (i) {
    // names, plus family and region names in both languages; summaries are left out
    // because they are full of common words ("trong" means "in")
    var fam = DATA.families.filter(function (f) { return f.id === i.family; })[0];
    var reg = DATA.regions.filter(function (r) { return r.id === i.region; })[0];
    index[i.id] = " " + fold([i.vi, i.en, i.aliases.join(" "), fam.en, fam.vi, reg.en, reg.vi].join(" ")) + " ";
  });
  // Instruments promised for the full version, so a search for them gets a real answer.
  var COMING = [
    { words: ["cong chieng", "gong", "gongs"], name: "cồng chiêng", en: "gongs" },
    { words: ["dan da", "lithophone"], name: "đàn đá", en: "stone lithophone" }
  ];
  function comingFor(q) {
    var f = fold(q);
    return COMING.filter(function (c) { return c.words.some(function (w) { return f && (w.indexOf(f) === 0 || f.indexOf(w) === 0); }); })[0];
  }

  /* ---------- saved ---------- */
  var memorySaved = null; // used only when the browser blocks localStorage (private mode, some file:// setups)
  function savedIds() {
    if (memorySaved) return memorySaved.slice();
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch (e) { return []; }
  }
  function isSaved(id) { return savedIds().indexOf(id) !== -1; }
  function toggleSaved(id) {
    var list = savedIds(), at = list.indexOf(id);
    if (at === -1) list.push(id); else list.splice(at, 1);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch (e) { memorySaved = list; }
    var badge = document.getElementById("saved-count");
    if (badge) { badge.textContent = list.length; badge.hidden = list.length === 0; }
    return at === -1;
  }

  /* ---------- filtering ---------- */
  function matches(i) {
    if (state.family !== "all" && i.family !== state.family) return false;
    if (state.region !== "all" && i.region !== state.region) return false;
    if (state.playable && !i.playable) return false;
    if (state.saved && !isSaved(i.id)) return false;
    if (state.q) {
      var words = fold(state.q).split(" ");
      // each word must start a word in the index: "lute" no longer matches "flute"
      for (var w = 0; w < words.length; w++) if (index[i.id].indexOf(" " + words[w]) === -1) return false;
    }
    return true;
  }
  function anyFilter() { return state.q || state.family !== "all" || state.region !== "all" || state.playable || state.saved; }

  /* ---------- chips ---------- */
  function buildChips() {
    [["f-family", "family", DATA.families, UI.allFamilies], ["f-region", "region", DATA.regions, UI.allRegions]].forEach(function (g) {
      var box = document.getElementById(g[0]);
      box.querySelectorAll(".chip").forEach(function (c) { c.remove(); });
      [{ id: "all" }].concat(g[2]).forEach(function (opt) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "chip";
        b.setAttribute("data-" + g[1], opt.id);
        b.setAttribute("aria-pressed", String(state[g[1]] === opt.id));
        b.textContent = opt.id === "all" ? t(g[3]) : t(opt);
        b.addEventListener("click", function () { state[g[1]] = opt.id; update(); });
        box.appendChild(b);
      });
    });
  }
  function syncChips() {
    document.querySelectorAll("[data-family]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-family") === state.family)); });
    document.querySelectorAll("[data-region]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-region") === state.region)); });
    document.querySelectorAll("[data-toggle]").forEach(function (b) { b.setAttribute("aria-pressed", String(state[b.getAttribute("data-toggle")])); });
  }

  /* ---------- cards ---------- */
  function drawing(i, cls) {
    var label = fill(t(UI.drawing), { name: i.vi }) + (i.telling ? " " + t(i.telling) : "");
    return '<div class="' + cls + ' has-shape">' + NGUAM_SHAPES.svg(i.id, esc(label)) + "</div>";
  }
  function visual(i, cls) {
    if (!i.image && window.NGUAM_SHAPES && NGUAM_SHAPES.has(i.id)) return drawing(i, cls);
    if (i.image) {
      return '<figure class="' + cls + ' has-photo"><picture>' +
        (i.image.webp ? '<source type="image/webp" srcset="' + i.image.webp + '">' : "") +
        '<img src="' + i.image.file + '" width="' + i.image.w + '" height="' + i.image.h + '" alt="' + esc(t(i.image.alt)) + '" loading="lazy"></picture>' +
        '<figcaption>' + esc(i.image.credit) + '</figcaption></figure>';
    }
    return '<div class="' + cls + '"><span class="seal big" lang="vi" aria-hidden="true">' +
      i.seal.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</span></div>";
  }

  // The instrument's name, heard by screen readers after the visible words, so a list of
  // buttons reads "Save đàn bầu", "Save đàn tranh" and the visible label stays inside the name.
  function who(i) { return '<span class="visually-hidden" lang="vi"> ' + esc(i.vi) + "</span>"; }

  // English gloss, plus a respelling only for English readers.
  function gloss(i) {
    return lang() === "en"
      ? '<p class="inst-en">' + esc(i.en) + ' · <span class="say">say “' + esc(i.say) + "”</span></p>"
      : '<p class="inst-en"><span class="say">tiếng Anh:</span> <span lang="en">' + esc(i.en) + "</span></p>";
  }
  function meta(i, extra) {
    var bits = [familyName(i.family), regionName(i.region)].concat(extra || []);
    if (i.playable) bits.push('<span class="plays"><svg class="icon" aria-hidden="true"><use href="#i-play"/></svg>' + t(UI.plays) + "</span>");
    return '<p class="inst-meta">' + bits.join(" · ") + "</p>";
  }

  function card(i) {
    var saved = isSaved(i.id), playing = playingId === i.id;
    // Every card does the same thing: open the reading panel. Instruments with their own page
    // link to it from inside the panel, so "Read more" never leads somewhere unexpected.
    var open = '<button type="button" class="ink-link" data-detail="' + i.id + '"><span>' + t(UI.readMore) + "</span>" + who(i) + '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></button>';
    var listen = i.playable && i.id !== "sao-truc"
      ? '<button type="button" class="act" data-listen="' + i.id + '" aria-pressed="' + playing + '">' +
        '<svg class="icon" aria-hidden="true"><use href="#i-' + (playing ? "stop" : "play") + '"/></svg><span>' + t(playing ? UI.stop : UI.listen) + "</span>" + who(i) + "</button>"
      : "";
    return '<li><article class="inst-card" aria-labelledby="name-' + i.id + '">' +
      visual(i, "inst-visual") +
      '<div class="inst-body">' +
        '<h3 class="inst-name" id="name-' + i.id + '" lang="vi">' + esc(i.vi) + "</h3>" +
        gloss(i) + meta(i) +
        '<p class="inst-summary">' + esc(t(i.summary)) + "</p>" +
        '<div class="inst-actions">' + open +
          '<div class="acts">' + listen +
            '<button type="button" class="act" data-save="' + i.id + '" aria-pressed="' + saved + '">' +
              '<svg class="icon star" aria-hidden="true"><use href="#i-star"/></svg><span>' + t(saved ? UI.saved : UI.save) + "</span>" + who(i) + "</button>" +
            '<button type="button" class="act" data-compare="' + i.id + '" aria-pressed="' + inTray(i.id) + '">' +
              '<svg class="icon" aria-hidden="true"><use href="#i-compare"/></svg><span>' + t(inTray(i.id) ? UI.inTray : UI.compare) + "</span>" + who(i) + "</button>" +
          "</div>" +
        "</div>" +
      "</div></article></li>";
  }

  function render() {
    var list = DATA.instruments.filter(matches), total = DATA.instruments.length;
    document.getElementById("lib-grid").innerHTML = list.map(card).join("");
    document.getElementById("lib-count").textContent = anyFilter()
      ? fill(t(UI.showing), { n: list.length, t: total })
      : fill(t(UI.showingAll), { t: total });
    document.getElementById("lib-reset").hidden = !anyFilter();
    document.getElementById("filter-apply").textContent = !list.length ? t(UI.showNone) : list.length === 1 ? t(UI.showOne) : fill(t(UI.showN), { n: list.length });
    document.getElementById("filter-apply").disabled = !list.length;
    var empty = document.getElementById("lib-empty");
    empty.hidden = list.length > 0;
    if (!list.length) renderEmpty();
  }

  // How many instruments would show if one filter were dropped.
  function countWithout(key, value) {
    var keep = state[key]; state[key] = value;
    var n = DATA.instruments.filter(matches).length;
    state[key] = keep; return n;
  }
  function renderEmpty() {
    var title, why = "", acts = [];
    var btn = function (act, label) { return '<button type="button" class="chip" data-empty="' + act + '">' + label + "</button>"; };
    if (state.saved && !savedIds().length) {
      title = t(UI.emptySavedTitle); why = t(UI.whySaved);
      acts.push(btn("unsaved", t(UI.showAll)));
    } else if (state.q && countWithout("q", "") > 0) {
      var soon = comingFor(state.q);
      title = fill(t(UI.emptyQueryTitle), { q: esc(state.q) });
      why = soon ? fill(t(UI.whyComing), { name: '<span lang="vi">' + soon.name + "</span>", en: soon.en }) : t(UI.whyQuery2);
      acts.push(btn("q", t(UI.clearSearch)));
      ["dan-bau", "dan-tranh", "dan-nguyet"].forEach(function (id) {
        acts.push('<button type="button" class="chip" data-try="' + id + '" lang="vi">' + esc(byId(id).vi) + "</button>");
      });
    } else {
      title = t(UI.emptyFiltersTitle); why = t(UI.whyFilters2);
      if (state.q) acts.push(btn("q", t(UI.clearSearch)));
      if (state.family !== "all") acts.push(btn("family", fill(t(UI.dropFilter), { f: familyName(state.family), n: countWithout("family", "all") })));
      if (state.region !== "all") acts.push(btn("region", fill(t(UI.dropFilter), { f: regionName(state.region), n: countWithout("region", "all") })));
      if (state.playable) acts.push(btn("playable", fill(t(UI.dropFilter), { f: t(UI.plays), n: countWithout("playable", false) })));
      if (state.saved) acts.push(btn("saved", fill(t(UI.dropFilter), { f: t(UI.saved), n: countWithout("saved", false) })));
    }
    document.getElementById("lib-empty-title").innerHTML = title;
    document.getElementById("lib-empty-why").innerHTML = why;
    document.getElementById("lib-empty-acts").innerHTML = acts.join("");
  }

  var undoTimer = null;
  function offerUndo(id) {
    var bar = document.getElementById("lib-undo");
    bar.innerHTML = fill(t(UI.removedSaved), { name: '<span lang="vi">' + esc(byId(id).vi) + "</span>" }) +
      ' <button type="button" class="text-btn" data-undo="' + id + '">' + t(UI.undo) + "</button>";
    bar.hidden = false;
    bar.querySelector("button").focus();
    say(fill(t(UI.removedSaved), { name: byId(id).vi }));
    clearTimeout(undoTimer);
    undoTimer = setTimeout(function () { if (!bar.contains(document.activeElement)) bar.hidden = true; }, 8000);
  }

  /* ---------- URL: library.html?family=percussion&region=highlands&q=...#saved ---------- */
  function readUrl() {
    var p = new URLSearchParams(location.search);
    if (p.get("family") && DATA.families.some(function (f) { return f.id === p.get("family"); })) state.family = p.get("family");
    if (p.get("region") && DATA.regions.some(function (r) { return r.id === p.get("region"); })) state.region = p.get("region");
    if (p.get("q")) state.q = p.get("q");
    if (p.get("playable") === "1") state.playable = true;
    // library.html?compare=dan-nguyet,dan-ty-ba#compare opens with that pair in the table
    var pair = (p.get("compare") || "").split(",");
    if (pair.length === 2 && byId(pair[0]) && byId(pair[1]) && pair[0] !== pair[1]) { cmp.a = pair[0]; cmp.b = pair[1]; }
    if (location.hash === "#saved") state.saved = true;
  }
  function writeUrl() {
    var p = new URLSearchParams();
    if (state.family !== "all") p.set("family", state.family);
    if (state.region !== "all") p.set("region", state.region);
    if (state.q) p.set("q", state.q);
    if (state.playable) p.set("playable", "1");
    var url = location.pathname + (p.toString() ? "?" + p : "") + (state.saved ? "#saved" : "");
    try { history.replaceState(null, "", url); } catch (e) { /* some browsers refuse this on file:// */ }
  }

  // On phones the chip groups sit behind one "Filters" button; its badge says how many are on.
  function syncFilterCount() {
    var n = (state.family !== "all") + (state.region !== "all") + state.playable + state.saved;
    var badge = document.getElementById("filter-count");
    badge.hidden = n === 0;
    badge.innerHTML = n + '<span class="visually-hidden"> ' + (lang() === "vi" ? "đang bật" : "on") + "</span>";
  }

  function syncWhere() {
    var h1 = document.querySelector(".lib-head h1"), key = state.saved ? UI.savedTitle : UI.title;
    h1.setAttribute("data-vi", key.vi); h1.dataset.en = key.en; h1.textContent = t(key);
    var inst = document.querySelector('.site-nav a[href="library.html"]'), saved = document.getElementById("nav-saved");
    [[inst, !state.saved], [saved, state.saved]].forEach(function (p) {
      p[0].classList.toggle("active", p[1]);
      if (p[1]) p[0].setAttribute("aria-current", "page"); else p[0].removeAttribute("aria-current");
    });
  }

  // The count is announced once the visitor pauses, not on every keystroke.
  var countTimer = null;
  function announceCount() {
    clearTimeout(countTimer);
    countTimer = setTimeout(function () { say(document.getElementById("lib-count").textContent); }, 600);
  }

  function update() { syncChips(); syncFilterCount(); syncWhere(); render(); writeUrl(); announceCount(); }

  // Somewhere sensible to put focus after a list change. On touch screens the
  // search box would open the keyboard, so the result count takes it instead.
  function parkFocus() {
    var target = matchMedia("(pointer: coarse)").matches ? document.getElementById("lib-count") : document.getElementById("lib-q");
    target.focus({ preventScroll: true });
  }

  /* ---------- sound ---------- */
  function say(msg) { var live = document.getElementById("lib-live"); live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 30); }

  function stopPlaying() {
    if (stopSound) { var s = stopSound; stopSound = null; s(); }
    playingId = null;
  }
  function refreshPlaying() { render(); renderCompare(); }
  function listen(id, where) {
    var S = window.NguAmSound;
    function refocus() { var b = document.querySelector((where || "#lib-grid") + ' [data-listen="' + id + '"]'); if (b) b.focus(); }
    if (playingId === id) { stopPlaying(); refreshPlaying(); refocus(); return; }
    stopPlaying();
    if (!S) { say(t(UI.noAudio)); return; }
    S.unlock().then(function () {
      if (!S.ready()) { say(t(UI.noAudio)); return; }
      if (S.isMuted()) say(t(UI.soundOff));
      playingId = id;
      if (id === "dan-bau") {
        stopSound = S.bauPhrase(function () { if (playingId === id) { playingId = null; stopSound = null; refreshPlaying(); } });
      } else {
        // đàn tranh: run up the five tones and back down
        var timers = [], seq = [0, 1, 2, 3, 4, 3, 2, 1, 0];
        seq.forEach(function (n, k) { timers.push(setTimeout(function () { S.pluck(S.TONES[n].freq, 0.5); }, k * 260)); });
        timers.push(setTimeout(function () { if (playingId === id) { playingId = null; stopSound = null; refreshPlaying(); } }, seq.length * 260 + 600));
        stopSound = function () { timers.forEach(clearTimeout); };
      }
      refreshPlaying();
      refocus();
    });
  }

  /* ---------- detail dialog ---------- */
  function rows(i) {
    return DATA.compareRows.map(function (r) {
      return "<dt>" + t(r) + "</dt><dd>" + esc(t(i.compare[r.id])) + "</dd>";
    }).join("");
  }
  function openDetail(id, opener) {
    var i = byId(id), dlg = document.getElementById("detail");
    document.getElementById("detail-body").innerHTML =
      '<button type="button" class="detail-close" data-close aria-label="' + t(UI.close) + '"><svg class="icon" aria-hidden="true"><use href="#i-close"/></svg></button>' +
      visual(i, "detail-visual") +
      '<h2 id="detail-title" lang="vi">' + esc(i.vi) + "</h2>" +
      gloss(i) + meta(i, [t(UI.people) + ": " + esc(t(i.people))]) +
      '<p class="detail-summary">' + esc(t(i.summary)) + "</p>" +
      i.facts.map(function (f) { return "<p>" + esc(t(f)) + "</p>"; }).join("") +
      '<dl class="detail-rows">' + rows(i) + "</dl>" +
      (i.page
        ? '<p class="detail-page"><a class="ink-link" href="instrument.html?id=' + i.id + '"><span>' + t(i.playable ? UI.openPagePlay : UI.openPageLink) + '</span><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a></p>'
        : '<div class="coming-note"><p class="coming-title">' + t(UI.comingTitle) + "</p><p>" + t(UI.comingText) + "</p></div>") +
      '<p class="detail-source">' + t(UI.source) + ': <a href="' + i.source.url + '">' + esc(i.source.label) + "</a></p>" +
      '<div class="detail-acts">' +
        '<button type="button" class="act" data-dsave="' + i.id + '" aria-pressed="' + isSaved(i.id) + '"><svg class="icon star" aria-hidden="true"><use href="#i-star"/></svg><span>' + t(isSaved(i.id) ? UI.saved : UI.save) + "</span></button>" +
        '<button type="button" class="act" data-dcompare="' + i.id + '" aria-pressed="' + inTray(i.id) + '"><svg class="icon" aria-hidden="true"><use href="#i-compare"/></svg><span>' + t(inTray(i.id) ? UI.inTray : UI.compare) + "</span></button>" +
      "</div>";
    dlg.dataset.id = id;
    dlg._opener = opener;
    if (!dlg.open) dlg.showModal();
    dlg.querySelector("[data-close]").focus();
  }
  function closeDetail() {
    var dlg = document.getElementById("detail");
    if (dlg.open) dlg.close();
  }

  /* ---------- compare ---------- */
  var cmp = { a: "dan-nguyet", b: "dan-ty-ba" };
  var narrowQuery = matchMedia("(max-width: 639.98px)");
  function fillSelects() {
    ["a", "b"].forEach(function (k) {
      var sel = document.getElementById("cmp-" + k);
      sel.innerHTML = DATA.instruments.map(function (i) {
        return '<option value="' + i.id + '" lang="vi"' + (cmp[k] === i.id ? " selected" : "") + ">" + esc(i.vi) + " (" + esc(i.en) + ")</option>";
      }).join("");
    });
  }
  function renderCompare() {
    var a = byId(cmp.a), b = byId(cmp.b), box = document.getElementById("cmp-table");
    if (a.id === b.id) { box.innerHTML = '<p class="cmp-note">' + t(UI.sameTwice) + "</p>"; return; }
    // On narrow screens each row label sits above its two cells, so both
    // instruments stay in view without scrolling sideways.
    var narrow = narrowQuery.matches, lead = narrow ? "" : "<td></td>";
    function row(label, cells, cls) {
      var tds = cells.map(function (c) { return "<td>" + c + "</td>"; }).join("");
      return narrow
        ? '<tr class="cmp-label' + (cls ? " " + cls : "") + '"><th scope="colgroup" colspan="2">' + label + '</th></tr><tr' + (cls ? ' class="' + cls + '"' : "") + ">" + tds + "</tr>"
        : "<tr" + (cls ? ' class="' + cls + '"' : "") + '><th scope="row">' + label + "</th>" + tds + "</tr>";
    }
    var head = "<tr>" + lead + [a, b].map(function (i) {
      var playing = playingId === i.id;
      var hear = i.playable && i.id !== "sao-truc"
        ? '<button type="button" class="act cmp-listen" data-listen="' + i.id + '" aria-pressed="' + playing + '">' +
          '<svg class="icon" aria-hidden="true"><use href="#i-' + (playing ? "stop" : "play") + '"/></svg><span>' + t(playing ? UI.stop : UI.listen) + "</span>" + who(i) + "</button>"
        : "";
      return '<th scope="col"><span class="cmp-name" lang="vi">' + esc(i.vi) + '</span><span class="cmp-en">' + esc(i.en) + "</span>" + hear + "</th>";
    }).join("") + "</tr>";
    var pics = '<tr class="cmp-pics">' + lead + [a, b].map(function (i) { return "<td>" + drawing(i, "cmp-visual") + "</td>"; }).join("") + "</tr>";
    var tell = (a.telling && b.telling) ? row(t(UI.tellApart), [esc(t(a.telling)), esc(t(b.telling))], "cmp-tell") : "";
    var body = DATA.compareRows.map(function (r) {
      return row(t(r), [a, b].map(function (i) { return esc(t(i.compare[r.id])); }));
    }).join("");
    var mixed = [a.id, b.id].sort().join() === "dan-nguyet,dan-ty-ba";
    document.getElementById("cmp-lede").textContent = mixed ? t(UI.pairLede) : fill(t(UI.anyLede), { a: a.vi, b: b.vi });
    box.innerHTML = '<table class="' + (narrow ? "is-narrow" : "") + '"><caption class="visually-hidden">' + esc(a.vi + " / " + b.vi) + "</caption><thead>" + head + "</thead><tbody>" + pics + tell + body + "</tbody></table>";
  }
  /* ---------- compare tray: collect two cards without leaving the list ---------- */
  var tray = [];
  var cameFrom = null; // where "Back to the list" returns to
  function inTray(id) { return tray.indexOf(id) !== -1; }

  function renderTray() {
    var box = document.getElementById("tray");
    box.hidden = tray.length === 0;
    document.body.classList.toggle("has-tray", tray.length > 0);
    document.getElementById("tray-slots").innerHTML = tray.map(function (id) {
      var i = byId(id);
      return '<li><span class="tray-name" lang="vi">' + esc(i.vi) + "</span>" +
        '<button type="button" class="tray-remove" data-untray="' + id + '">' +
        '<svg class="icon" aria-hidden="true"><use href="#i-close"/></svg><span class="visually-hidden">' + t(UI.remove) + " " + esc(i.vi) + "</span></button></li>";
    }).join("");
    document.getElementById("tray-hint").hidden = tray.length !== 1;
    document.getElementById("tray-hint").textContent = t(UI.pickOne);
    document.getElementById("tray-go").hidden = tray.length !== 2;
  }

  function toggleTray(id) {
    var name = byId(id).vi;
    if (inTray(id)) {
      tray.splice(tray.indexOf(id), 1);
      say(fill(t(UI.removed), { name: name }));
    } else if (tray.length < 2) {
      tray.push(id);
      say(tray.length === 1 ? fill(t(UI.added), { name: name }) : fill(t(UI.ready), { a: byId(tray[0]).vi, b: name }));
    } else {
      var old = byId(tray[1]).vi;
      tray[1] = id;
      say(fill(t(UI.replaced), { old: old, name: name }));
    }
    renderTray(); render();
    var again = document.querySelector('[data-compare="' + id + '"]');
    if (again) again.focus();
  }

  function showCompare(a, b, from) {
    cmp.a = a; cmp.b = b; cameFrom = from || null;
    fillSelects(); renderCompare();
    var h = document.getElementById("compare-title");
    h.focus({ preventScroll: true });
    document.getElementById("cmp-table").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    say(fill(t(UI.nowCompare), { a: byId(a).vi, b: byId(b).vi }));
  }

  function backToList() {
    var target = cameFrom && document.querySelector(cameFrom);
    if (!target) target = document.getElementById("lib-count");
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    if (target.focus) target.focus({ preventScroll: true });
  }

  /* ---------- wiring ---------- */
  function relabel() {
    document.getElementById("lib-q").placeholder = t(UI.placeholder);
    buildChips(); syncChips(); syncFilterCount(); syncWhere(); render(); fillSelects(); renderCompare(); renderTray();
    var dlg = document.getElementById("detail");
    if (dlg.open) openDetail(dlg.dataset.id, dlg._opener);
  }

  document.addEventListener("DOMContentLoaded", function () {
    readUrl();
    var q = document.getElementById("lib-q");
    q.value = state.q;
    relabel();
    writeUrl();

    q.addEventListener("input", function () { state.q = q.value.trim(); update(); });
    document.getElementById("lib-tools").addEventListener("submit", function (e) { e.preventDefault(); });
    document.querySelectorAll("[data-toggle]").forEach(function (b) {
      b.addEventListener("click", function () { var k = b.getAttribute("data-toggle"); state[k] = !state[k]; update(); });
    });
    document.getElementById("lib-reset").addEventListener("click", function () {
      state = { q: "", family: "all", region: "all", playable: false, saved: false };
      q.value = ""; update(); parkFocus();
    });

    document.getElementById("lib-grid").addEventListener("click", function (e) {
      var el = e.target.closest("button");
      if (!el) return;
      var id;
      if ((id = el.getAttribute("data-save"))) {
        var now = toggleSaved(id);
        render();
        var again = document.querySelector('[data-save="' + id + '"]');
        if (again) { again.focus(); say(fill(t(now ? UI.nowSaved : UI.nowUnsaved), { name: byId(id).vi })); }
        else offerUndo(id);
      } else if ((id = el.getAttribute("data-listen"))) {
        listen(id);
      } else if ((id = el.getAttribute("data-compare"))) {
        toggleTray(id);
      } else if ((id = el.getAttribute("data-detail"))) {
        openDetail(id, el);
      }
    });

    ["a", "b"].forEach(function (k) {
      document.getElementById("cmp-" + k).addEventListener("change", function (e) { cmp[k] = e.target.value; renderCompare(); });
    });

    document.getElementById("tray").addEventListener("click", function (e) {
      var rm = e.target.closest("[data-untray]");
      if (rm) {
        var id = rm.getAttribute("data-untray");
        toggleTray(id);
        var next = document.querySelector("[data-untray]") || document.querySelector('[data-compare="' + id + '"]');
        if (next) next.focus();
      } else if (e.target.closest("#tray-go")) {
        showCompare(tray[0], tray[1], '[data-compare="' + tray[1] + '"]');
      }
    });
    document.getElementById("pair-shortcut").addEventListener("click", function (e) {
      e.preventDefault();
      showCompare("dan-nguyet", "dan-ty-ba", "#pair-shortcut");
    });
    document.getElementById("cmp-back").addEventListener("click", backToList);
    document.querySelectorAll("[data-skip]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.getElementById(a.getAttribute("data-skip"));
        target.scrollIntoView({ block: "start" }); target.focus({ preventScroll: true });
      });
    });
    document.getElementById("cmp-table").addEventListener("click", function (e) {
      var b = e.target.closest("[data-listen]");
      if (b) listen(b.getAttribute("data-listen"), "#cmp-table");
    });

    function closeFilters() {
      document.getElementById("filter-toggle").setAttribute("aria-expanded", "false");
      document.getElementById("lib-tools").classList.remove("is-open");
    }
    document.getElementById("filter-apply").addEventListener("click", function () {
      closeFilters();
      var c = document.getElementById("lib-count");
      c.scrollIntoView({ block: "start" }); c.focus({ preventScroll: true });
    });
    var toggle = document.getElementById("filter-toggle");
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      document.getElementById("lib-tools").classList.toggle("is-open", open);
      if (open) document.querySelector("#filter-groups .chip").focus();
    });

    // The tray would cover the table it leads to, so it steps aside while Compare is on screen.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        document.body.classList.toggle("compare-in-view", entries[0].isIntersecting);
      }, { rootMargin: "0px 0px -30% 0px" }).observe(document.getElementById("compare"));
    }

    var dlg = document.getElementById("detail");
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-close]")) { closeDetail(); return; }
      var s = e.target.closest("[data-dsave]"), c = e.target.closest("[data-dcompare]");
      if (s) { var id = s.getAttribute("data-dsave"), now = toggleSaved(id); render(); openDetail(id, dlg._opener); dlg.querySelector("[data-dsave]").focus(); say(fill(t(now ? UI.nowSaved : UI.nowUnsaved), { name: byId(id).vi })); }
      if (c) { var cid = c.getAttribute("data-dcompare"); toggleTray(cid); openDetail(cid, dlg._opener); dlg.querySelector("[data-dcompare]").focus(); }
    });
    dlg.addEventListener("close", function () {
      if (dlg._opener && document.contains(dlg._opener)) dlg._opener.focus();
      else { var same = document.querySelector('[data-detail="' + dlg.dataset.id + '"]'); if (same) same.focus(); }
    });

    // The Saved link in the menu points at this page: switch the filter without reloading.
    function closeMenu() {
      var menu = document.getElementById("nav-menu");
      if (window.bootstrap && menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
    function showSaved() {
      state.saved = true; update(); closeMenu();
      var h1 = document.querySelector(".lib-head h1");
      h1.setAttribute("tabindex", "-1");
      h1.scrollIntoView({ block: "start" }); h1.focus({ preventScroll: true });
    }
    document.getElementById("nav-saved").addEventListener("click", function (e) { e.preventDefault(); showSaved(); });
    window.addEventListener("hashchange", function () {
      if (location.hash === "#saved") showSaved(); else { state.saved = false; update(); }
    });

    // Buttons inside the empty state and the undo bar.
    document.getElementById("lib-empty").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var act = b.getAttribute("data-empty"), go = b.getAttribute("data-try");
      if (act === "q") { state.q = ""; q.value = ""; }
      else if (act === "family" || act === "region") state[act] = "all";
      else if (act === "playable" || act === "saved" || act === "unsaved") state[act === "unsaved" ? "saved" : act] = false;
      else if (go) { state.q = byId(go).vi; q.value = state.q; }
      update(); parkFocus();
    });
    document.getElementById("lib-undo").addEventListener("click", function (e) {
      var b = e.target.closest("[data-undo]");
      if (!b) return;
      var id = b.getAttribute("data-undo");
      toggleSaved(id); render();
      document.getElementById("lib-undo").hidden = true;
      var card = document.querySelector('[data-save="' + id + '"]');
      if (card) card.focus(); else parkFocus();
      say(fill(t(UI.nowSaved), { name: byId(id).vi }));
    });

    document.addEventListener("nguam:lang", relabel);
    if (narrowQuery.addEventListener) narrowQuery.addEventListener("change", renderCompare);
  });
})();
