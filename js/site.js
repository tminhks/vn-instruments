/* Shared behaviour for every page: English / Vietnamese switch, sound toggle,
   and the saved-instruments counter in the navigation. */
(function () {
  "use strict";

  var LANG_KEY = "nguam.lang";

  // Elements carry their Vietnamese text in data-vi; the English text is the
  // element's own content, remembered in data-en the first time we switch.
  // data-vi-label and data-vi-alt do the same for aria-label and alt.
  function applyLanguage(lang) {
    document.documentElement.lang = lang === "vi" ? "vi" : "en";
    document.querySelectorAll("[data-vi]").forEach(function (el) {
      if (el.dataset.en == null) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === "vi" ? el.dataset.vi : el.dataset.en;
    });
    [["data-vi-label", "aria-label"], ["data-vi-alt", "alt"], ["data-vi-title", "title"]].forEach(function (pair) {
      document.querySelectorAll("[" + pair[0] + "]").forEach(function (el) {
        var store = "en" + pair[1];
        if (!el.hasAttribute("data-" + store)) el.setAttribute("data-" + store, el.getAttribute(pair[1]) || "");
        el.setAttribute(pair[1], lang === "vi" ? el.getAttribute(pair[0]) : el.getAttribute("data-" + store));
      });
    });
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === lang));
    });
    var title = document.querySelector("meta[name='title-vi']");
    if (title) {
      if (!document.documentElement.dataset.titleEn) document.documentElement.dataset.titleEn = document.title;
      document.title = lang === "vi" ? title.content : document.documentElement.dataset.titleEn;
    }
    localStorage.setItem(LANG_KEY, lang);
    document.dispatchEvent(new CustomEvent("nguam:lang", { detail: { lang: lang } }));
  }

  function currentLanguage() { return localStorage.getItem(LANG_KEY) === "vi" ? "vi" : "en"; }

  function initLanguage() {
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLanguage(btn.getAttribute("data-lang-btn")); });
    });
    if (currentLanguage() === "vi") applyLanguage("vi");
  }

  function initSoundToggle() {
    var btn = document.getElementById("sound-toggle");
    if (!btn || !window.NguAmSound) return;
    function sync() { btn.setAttribute("aria-pressed", String(!NguAmSound.isMuted())); }
    btn.addEventListener("click", function () {
      NguAmSound.unlock();
      NguAmSound.setMuted(!NguAmSound.isMuted());
    });
    document.addEventListener("nguam:sound", sync);
    sync();
  }

  function initSavedCount() {
    var badge = document.getElementById("saved-count");
    if (!badge) return;
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem("nguam.saved") || "[]"); } catch (e) { saved = []; }
    badge.textContent = saved.length;
    badge.hidden = saved.length === 0;
  }

  window.NguAm = { applyLanguage: applyLanguage, lang: currentLanguage };

  document.addEventListener("DOMContentLoaded", function () {
    initLanguage();
    initSoundToggle();
    initSavedCount();
  });
})();
