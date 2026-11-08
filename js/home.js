/* Home page: the book-cover intro, the five ribbon strings and the đàn bầu "Listen" button. */
(function () {
  "use strict";

  var html = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var S = window.NguAmSound;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------- Ribbon strings ---------------- */

  var stage, svg, hits, lights, swells, tag, live, hint, lastPlayed = { index: -1, time: 0 };

  function pointOnRibbon(i, at) {
    var path = hits[i], p = path.getPointAtLength(path.getTotalLength() * at);
    var m = path.getScreenCTM(), r = stage.getBoundingClientRect();
    var x = p.x * m.a + p.y * m.c + m.e - r.left, y = p.x * m.b + p.y * m.d + m.f - r.top;
    return { x: Math.min(Math.max(x, 40), r.width - 40), y: Math.min(Math.max(y, 40), r.height - 40) };
  }

  function showTag(i, x, y) {
    var tone = S.TONES[i];
    tag.innerHTML = tone.vi + "<small>" + tone.west + "</small>";
    tag.style.transform = "translate(" + Math.round(x + 14) + "px," + Math.round(y - 52) + "px)";
    if (reduceMotion) { tag.style.opacity = 1; clearTimeout(tag._t); tag._t = setTimeout(function () { tag.style.opacity = 0; }, 900); return; }
    tag.getAnimations().forEach(function (a) { a.cancel(); });
    tag.animate([
      { opacity: 0, translate: "0 8px", scale: 0.92 },
      { opacity: 1, translate: "0 0", scale: 1, offset: 0.18 },
      { opacity: 1, translate: "0 -6px", offset: 0.7 },
      { opacity: 0, translate: "0 -14px" }
    ], { duration: 1100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
  }

  function glint(i) {
    if (reduceMotion) return;
    var light = lights[i], swell = swells[i], len = light.getTotalLength(), seg = Math.max(260, len * 0.18);
    light.style.strokeDasharray = seg + " " + (len + seg);
    light.getAnimations().forEach(function (a) { a.cancel(); });
    // The light travels from the musicians up into the sky, the way the music flows.
    light.animate([
      { strokeDashoffset: -len, opacity: 0 },
      { opacity: 0.95, offset: 0.12 },
      { opacity: 0.85, offset: 0.7 },
      { strokeDashoffset: seg, opacity: 0 }
    ], { duration: 1300, easing: "cubic-bezier(0.22, 0.8, 0.3, 1)" });
    swell.getAnimations().forEach(function (a) { a.cancel(); });
    swell.animate([{ opacity: 0 }, { opacity: 0.32, offset: 0.15 }, { opacity: 0 }], { duration: 750, easing: "ease-out" });
  }

  function play(i, x, y, announce) {
    var now = performance.now();
    if (lastPlayed.index === i && now - lastPlayed.time < 140) return;
    lastPlayed = { index: i, time: now };
    S.pluck(S.TONES[i].freq, 0.5);
    glint(i);
    if (x == null) { var p = pointOnRibbon(i, 0.42); x = p.x; y = p.y; }
    showTag(i, x, y);
    if (announce) live.textContent = S.TONES[i].vi + " (" + S.TONES[i].west + ")";
  }

  function needSound(on) { hint.classList.toggle("needs-sound", on); }

  // Pointer, tap and keyboard all play the same note. Hovering plays only once the
  // browser has allowed sound; the first click or tap turns it on.
  function initRibbons() {
    stage = $(".canvas"); svg = $(".ribbons");
    hits = $$(".ribbon-hit", svg); lights = $$(".ribbon-light", svg); swells = $$(".ribbon-swell", svg);
    tag = $(".note-tag"); live = $("#note-live"); hint = $(".ribbon-hint");

    function at(e) { var r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function ribbonUnder(e) {
      var el = document.elementFromPoint(e.clientX, e.clientY);
      return el && el.classList && el.classList.contains("ribbon-hit") ? hits.indexOf(el) : -1;
    }

    var down = false, current = -1;
    svg.addEventListener("pointerdown", function (e) {
      var i = ribbonUnder(e);
      if (i < 0) return;
      down = true; current = i;
      var p = at(e);
      S.unlock().then(function () { needSound(false); play(i, p.x, p.y); });
    });
    window.addEventListener("pointerup", function () { down = false; });
    stage.addEventListener("pointermove", function (e) {
      if (html.classList.contains("is-cover")) return;
      var i = ribbonUnder(e);
      if (i === current) return;
      current = i;
      if (i < 0) return;
      if (!S.ready()) { if (e.pointerType === "mouse") needSound(true); return; }
      var p = at(e); play(i, p.x, p.y);
    });
    stage.addEventListener("pointerleave", function () { current = -1; });

    hits.forEach(function (path, i) {
      path.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          S.unlock().then(function () { needSound(false); play(i, null, null, true); });
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (html.classList.contains("is-cover") || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      var n = "12345".indexOf(e.key);
      if (n < 0) return;
      S.unlock().then(function () { needSound(false); play(n, null, null, true); });
    });
  }

  /* ---------------- Book-cover intro ---------------- */

  function flyTitleToLogo(done) {
    var title = $(".cover-title"), word = $(".brand-name");
    var mark = $(".cover-logo"), seal = $(".brand-seal");
    if (reduceMotion || !title.animate || !title.getBoundingClientRect().width) { done(); return; }

    // The navigation is still sliding into place (it starts 8px high), so its final position is 8px lower.
    var NAV_SHIFT = 8;
    var wordBox = word.getBoundingClientRect();
    var wordStyle = getComputedStyle(word), titleStyle = getComputedStyle(title);
    var scale = parseFloat(wordStyle.fontSize) / parseFloat(titleStyle.fontSize);
    var flights = [];

    // The title, set exactly like the wordmark in the navigation (same line height and tracking),
    // so that after shrinking it sits on top of the real one.
    var tBox = title.getBoundingClientRect();
    var clone = title.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.style.cssText = "position:fixed;margin:0;z-index:1500;pointer-events:none;white-space:nowrap;transform-origin:0 0;" +
      "left:" + tBox.left + "px;top:" + tBox.top + "px;line-height:" + wordStyle.lineHeight + ";letter-spacing:" + (parseFloat(wordStyle.letterSpacing) / parseFloat(wordStyle.fontSize) * parseFloat(titleStyle.fontSize)) + "px;";
    document.body.appendChild(clone);
    var cBox = clone.getBoundingClientRect();
    title.style.visibility = "hidden";
    flights.push(clone.animate([
      { transform: "none", color: "#f2f6e4" },
      { transform: "translate(" + (wordBox.left - cBox.left) + "px," + (wordBox.top + NAV_SHIFT - cBox.top) + "px) scale(" + scale + ")", color: "#123b33", textShadow: "none" }
    ], { duration: 1250, easing: "cubic-bezier(0.65, 0, 0.2, 1)", fill: "forwards" }));

    var markClone = null;
    if (mark && seal) {
      var ma = mark.getBoundingClientRect(), mb = seal.getBoundingClientRect();
      if (ma.width) {
        markClone = mark.cloneNode(true);
        markClone.setAttribute("aria-hidden", "true");
        markClone.style.cssText = "position:fixed;margin:0;z-index:1500;pointer-events:none;left:" + ma.left + "px;top:" + ma.top + "px;width:" + ma.width + "px;height:" + ma.height + "px;transform-origin:0 0;filter:none;opacity:0.95;";
        document.body.appendChild(markClone);
        mark.style.visibility = "hidden";
        flights.push(markClone.animate([
          { transform: "none" },
          { transform: "translate(" + (mb.left - ma.left) + "px," + (mb.top + NAV_SHIFT - ma.top) + "px) scale(" + (mb.width / ma.width) + ")", opacity: 1 }
        ], { duration: 1250, easing: "cubic-bezier(0.65, 0, 0.2, 1)", fill: "forwards" }));
      }
    }
    flights[0].onfinish = function () { clone.remove(); if (markClone) markClone.remove(); done(); };
  }

  function riseHeroCopy() {
    var items = $$(".hero-copy h1, .hero-copy .lede, .hero-copy .seals li, .ribbon-hint");
    if (reduceMotion) return;
    items.forEach(function (el) { el.classList.add("rise"); el.classList.remove("in"); });
    // Wait until the flying title has reached the logo, so it never crosses the headline.
    items.forEach(function (el, k) { setTimeout(function () { el.classList.add("in"); }, 1200 + k * 80); });
    setTimeout(function () { items.forEach(function (el) { el.classList.remove("rise", "in"); }); }, 1200 + items.length * 80 + 1000);
  }

  // The ribbons light up one after another as the book opens; the notes sound when sound is allowed.
  function arpeggio() {
    S.TONES.forEach(function (tone, i) { setTimeout(function () { play(i, null, null, false); }, 1000 + i * 180); });
  }

  var opening = false;
  function openCover() {
    if (opening || !html.classList.contains("is-cover")) return;
    opening = true;
    sessionStorage.setItem("nguam.opened", "1");
    var sound = S.unlock();

    var brand = $(".brand-name"), brandSeal = $(".brand-seal");
    brand.style.opacity = 0;
    if (brandSeal) brandSeal.style.opacity = 0;
    html.classList.add("is-opening");
    html.classList.remove("is-cover");
    flyTitleToLogo(function () { brand.style.opacity = ""; if (brandSeal) brandSeal.style.opacity = ""; });
    riseHeroCopy();
    sound.catch(function () { /* sound stays off until the next tap */ });
    arpeggio();

    setTimeout(function () {
      html.classList.remove("is-opening");
      var h1 = $(".hero-copy h1");
      h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 1350);
  }

  function initCover() {
    var begin = $("#begin");
    begin.addEventListener("click", openCover);
    document.addEventListener("keydown", function (e) {
      if (!html.classList.contains("is-cover") || e.target === begin) return;
      if (["Enter", " ", "ArrowDown", "PageDown"].indexOf(e.key) >= 0) { e.preventDefault(); openCover(); }
    });
    window.addEventListener("wheel", function (e) { if (e.deltaY > 0 && html.classList.contains("is-cover")) openCover(); }, { passive: true });
    var startY = null;
    window.addEventListener("touchstart", function (e) { startY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      if (startY != null && startY - e.touches[0].clientY > 40 && html.classList.contains("is-cover")) { startY = null; openCover(); }
    }, { passive: true });
    if (html.classList.contains("is-cover")) begin.focus({ preventScroll: true });
  }

  /* ---------------- Instrument of the day ---------------- */

  function initListen() {
    var btn = $("#listen-bau"), stop = null;
    btn.addEventListener("click", function () {
      if (stop) { stop(); return; }
      S.unlock().then(function () {
        stop = S.bauPhrase(function () { stop = null; btn.setAttribute("aria-pressed", "false"); });
        if (stop) btn.setAttribute("aria-pressed", "true");
      });
    });
  }

  /* ---------------- Scenes that unroll as they come into view ---------------- */

  function initScenes() {
    var scenes = $$(".scene");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      scenes.forEach(function (s) { s.classList.add("is-unrolled"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var scene = entry.target;
        scene.classList.add("is-unrolled");
        io.unobserve(scene);
        // once the ink has spread, drop the mask so the painting is a plain image again
        setTimeout(function () { scene.classList.add("is-settled"); }, 1900);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    scenes.forEach(function (s) { io.observe(s); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initScenes();
    initRibbons();
    initCover();
    initListen();
  });
})();
