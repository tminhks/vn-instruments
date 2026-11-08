/* Instrument page: one instrument, drawn the way it looks and played the way it is played.
   instrument.html?id=dan-bau | dan-tranh | dan-nguyet | dan-ty-ba | sao-truc ...

   đàn tranh: the right hand plucks to the right of each bridge (click, tap, or sweep across
   several strings); the left hand presses to the left of a bridge to raise the note.
   đàn bầu: touch a harmonic mark to pluck that harmonic; pull the rod out to raise the note,
   push it in to lower it, while the note is still ringing. */
(function () {
  "use strict";

  var DATA = window.NGUAM_DATA;
  var params = new URLSearchParams(location.search);
  var inst = DATA && DATA.instruments.filter(function (i) { return i.id === (params.get("id") || "dan-bau"); })[0];
  var SAVED_KEY = "nguam.saved";

  var UI = {
    unknownTitle: { en: "We do not know this instrument yet", vi: "Chưa có nhạc cụ này" },
    unknownText: { en: "The link may be old or mistyped. Every instrument in the prototype is in the list.", vi: "Có thể đường link đã cũ hoặc gõ nhầm. Mọi nhạc cụ của bản prototype đều có trong danh sách." },
    toList: { en: "See all instruments", vi: "Xem tất cả nhạc cụ" },
    say: { en: "say", vi: "đọc là" },
    english: { en: "", vi: "tiếng Anh:" },
    playTitle: { en: "Play it", vi: "Chơi thử" },
    listen: { en: "Listen to a sample", vi: "Nghe thử một đoạn" },
    stop: { en: "Stop", vi: "Dừng" },
    save: { en: "Save", vi: "Lưu" },
    saved: { en: "Saved", vi: "Đã lưu" },
    noSound: { en: "No sound? Turn the volume up. On an iPhone, switch off silent mode. The sound button in the menu must say Sound on.", vi: "Không nghe thấy gì? Tăng âm lượng. Trên iPhone, tắt chế độ im lặng. Nút âm thanh trên menu phải đang là Có tiếng." },
    mutedNow: { en: "Sound is off in the menu, so nothing will play. Turn it on with the Sound button.", vi: "Âm thanh đang tắt trên menu nên sẽ không có tiếng. Bật lại bằng nút Âm thanh." },
    story: { en: "Its story", vi: "Câu chuyện" },
    made: { en: "How it is made and played", vi: "Cấu tạo và cách chơi" },
    source: { en: "Source", vi: "Nguồn" },
    people: { en: "Played by", vi: "Dân tộc" },
    lesson: { en: "Start the first lesson", vi: "Bắt đầu bài học đầu tiên" },
    lessonNote: { en: "A short lesson, about 3 minutes, using hò, xự, xang, xê, cống.", vi: "Bài học ngắn, khoảng 3 phút, dùng hò, xự, xang, xê, cống." },
    phoneTitle: { en: "Play it with your fingers", vi: "Chơi bằng ngón tay" },
    phoneText: { en: "Scan the code to open the phone version: several fingers at once on the đàn tranh, and tilt the phone to bend the đàn bầu.", vi: "Quét mã để mở bản điện thoại: chơi đàn tranh nhiều ngón cùng lúc, nghiêng máy để uốn tiếng đàn bầu." },
    comingTitle: { en: "Playing it on screen is coming in the full version", vi: "Chơi thử trên màn hình sẽ có ở bản đầy đủ" },
    comingText: { en: "This prototype lets you play the đàn bầu and the đàn tranh. Here you can read about this one and compare it with the instruments it is mixed up with.", vi: "Bản prototype này cho chơi đàn bầu và đàn tranh. Ở đây bạn đọc về nhạc cụ này và so sánh nó với những nhạc cụ hay bị nhầm." },
    playBau: { en: "Play the đàn bầu", vi: "Chơi đàn bầu" },
    playTranh: { en: "Play the đàn tranh", vi: "Chơi đàn tranh" },
    compareWith: { en: "Compare it with the {b}", vi: "So sánh với {b}" },
    drawing: { en: "Outline drawing of the {name}.", vi: "Hình vẽ nét của {name}." },

    // sáo trúc
    fluteHowMouse: { en: "<b>Cover</b>: tap a hole to cover it, tap again to lift the finger. <b>Blow</b>: on a phone, press <i>Blow into the microphone</i> and blow across the bottom edge of the phone. On a computer, hold <i>Hold to blow</i>.", vi: "<b>Bịt lỗ</b>: chạm vào lỗ để bịt, chạm lần nữa để nhấc ngón. <b>Thổi</b>: trên điện thoại, bấm <i>Thổi vào micro</i> rồi thổi vào cạnh dưới điện thoại. Trên máy tính, giữ nút <i>Giữ để thổi</i>." },
    fluteHowKeys: { en: "<b>Keys</b>: <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> cover the six holes from the mouth end. Hold <kbd>Space</kbd> to blow. Blow harder for the higher octave.", vi: "<b>Bàn phím</b>: <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> bịt sáu lỗ từ đầu thổi. Giữ <kbd>Dấu cách</kbd> để thổi. Thổi mạnh hơn thì lên quãng tám." },
    fluteLabel: { en: "Bamboo flute held sideways with a blowing hole and six finger holes. Tap a hole to cover it, then blow.", vi: "Sáo trúc cầm ngang, có một lỗ thổi và sáu lỗ bấm. Chạm vào lỗ để bịt, rồi thổi." },
    holeBtn: { en: "Hole {n}: {state}", vi: "Lỗ {n}: {state}" },
    covered: { en: "covered", vi: "đang bịt" },
    open: { en: "open", vi: "đang mở" },
    blowHold: { en: "Hold to blow", vi: "Giữ để thổi" },
    micOn: { en: "Blow into the microphone", vi: "Thổi vào micro" },
    micOff: { en: "Stop listening", vi: "Ngừng nghe micro" },
    micAsk: { en: "Allow the microphone when your browser asks. The sound never leaves your device.", vi: "Hãy cho phép micro khi trình duyệt hỏi. Âm thanh không rời khỏi thiết bị của bạn." },
    micDenied: { en: "The microphone is blocked, so blowing cannot be heard. Use the Hold to blow button instead, or allow the microphone in the browser settings.", vi: "Micro đang bị chặn nên không nghe được tiếng thổi. Hãy dùng nút Giữ để thổi, hoặc cho phép micro trong cài đặt trình duyệt." },
    micMissing: { en: "This browser cannot use the microphone here. Use the Hold to blow button instead.", vi: "Trình duyệt này không dùng được micro ở đây. Hãy dùng nút Giữ để thổi." },
    micTip: { en: "Use headphones: the flute sound can otherwise leak back into the microphone.", vi: "Nên đeo tai nghe: nếu không, tiếng sáo có thể lọt ngược vào micro." },
    micReady: { en: "Listening. Blow across the bottom edge of the phone.", vi: "Đang nghe. Hãy thổi vào cạnh dưới của điện thoại." },
    breath: { en: "Breath", vi: "Hơi thổi" },

    // đàn tranh
    tranhHowMouse: { en: "<b>Pluck</b>: click a string to the right of its bridge, or sweep across several strings. <b>Bend</b>: right after plucking, press the same string to the left of its bridge and hold.", vi: "<b>Gảy</b>: bấm vào dây ở bên phải con nhạn, hoặc vuốt qua nhiều dây. <b>Nhấn luyến</b>: vừa gảy xong, nhấn giữ chính dây đó ở bên trái con nhạn." },
    tranhHowKeys: { en: "<b>Keys</b>: each string has a key, written beside it. Hold <kbd>Shift</kbd> to press the last string you plucked.", vi: "<b>Bàn phím</b>: mỗi dây một phím, chữ ghi cạnh dây. Giữ <kbd>Shift</kbd> để nhấn luyến dây vừa gảy." },
    tranhLabel: { en: "Đàn tranh with 16 strings. Use the keys written beside each string, or the string buttons that follow.", vi: "Đàn tranh 16 dây. Dùng phím ghi cạnh mỗi dây, hoặc các nút dây ở ngay sau." },
    stringBtn: { en: "String {n}: {tone} ({west})", vi: "Dây {n}: {tone} ({west})" },
    plucked: { en: "{tone}", vi: "{tone}" },
    pressed: { en: "{tone}, pressed up a tone", vi: "{tone}, nhấn lên một cung" },

    // đàn bầu
    bauHowMouse: { en: "<b>Pluck</b>: touch one of the marks on the soundboard; the player rests the edge of the hand there and plucks. <b>Bend</b>: drag the rod. Pull it out to raise the note, push it in to lower it. Let go and it springs back.", vi: "<b>Gảy</b>: chạm một chấm trên mặt đàn; người chơi đặt cạnh bàn tay ở đó rồi gảy. <b>Uốn tiếng</b>: kéo cần đàn. Kéo ra thì tiếng cao lên, đẩy vào thì thấp xuống. Buông tay thì cần bật về." },
    bauHowKeys: { en: "<b>Keys</b>: <kbd>1</kbd> to <kbd>5</kbd> pluck the five marks, <kbd>↑</kbd> pulls the rod, <kbd>↓</kbd> pushes it, <kbd>Space</kbd> plucks again.", vi: "<b>Bàn phím</b>: <kbd>1</kbd> đến <kbd>5</kbd> gảy năm điểm, <kbd>↑</kbd> kéo cần, <kbd>↓</kbd> đẩy cần, <kbd>Dấu cách</kbd> gảy lại." },
    bauLabel: { en: "Đàn bầu with one string and a flexible rod. Use keys 1 to 5 and the arrow keys, or the buttons and the slider that follow.", vi: "Đàn bầu một dây với cần mềm. Dùng phím 1 đến 5 và phím mũi tên, hoặc các nút và thanh trượt ở ngay sau." },
    markBtn: { en: "Mark {n}: {west}", vi: "Điểm {n}: {west}" },
    rod: { en: "Rod: hold the bend", vi: "Cần đàn: giữ độ uốn" },
    rodNone: { en: "straight", vi: "thẳng" },
    rodUp: { en: "+{n} semitones", vi: "+{n} nửa cung" },
    rodDown: { en: "−{n} semitones", vi: "−{n} nửa cung" }
  };

  function lang() { return window.NguAm ? NguAm.lang() : "en"; }
  function t(o) { return o ? (o[lang()] || o.en) : ""; }
  function fill(s, map) { return s.replace(/\{(\w+)\}/g, function (_, k) { return map[k]; }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function byId(id) { return DATA.instruments.filter(function (i) { return i.id === id; })[0]; }
  function family(i) { return t(DATA.families.filter(function (f) { return f.id === i.family; })[0]); }
  function region(i) { return t(DATA.regions.filter(function (r) { return r.id === i.region; })[0]); }
  function say(msg) { var l = document.getElementById("inst-live"); l.textContent = ""; setTimeout(function () { l.textContent = msg; }, 20); }

  /* ================= sound ================= */
  // A small engine of its own, because both instruments need to bend a note that is already
  // ringing. It follows the shared Sound on / off setting in the menu.
  var ctx = null, master = null;
  function isMuted() { return window.NguAmSound ? NguAmSound.isMuted() : false; }
  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = isMuted() ? 0 : 1;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    master.connect(comp); comp.connect(ctx.destination);
    return ctx;
  }
  function unlock() {
    var c = audio();
    if (!c) return Promise.resolve(false);
    if (isMuted()) say(t(UI.mutedNow));
    return (c.state === "suspended" ? c.resume() : Promise.resolve()).then(function () { return c.state === "running"; });
  }
  document.addEventListener("nguam:sound", function (e) {
    if (master) master.gain.setTargetAtTime(e.detail.muted ? 0 : 1, ctx.currentTime, 0.03);
  });

  // Plucked steel string (Karplus-Strong), pitch bendable through playbackRate.
  var buffers = {};
  function stringBuffer(freq) {
    var key = Math.round(freq * 10);
    if (buffers[key]) return buffers[key];
    var rate = ctx.sampleRate, length = Math.floor(rate * 3), buf = ctx.createBuffer(1, length, rate), data = buf.getChannelData(0);
    var period = Math.max(2, Math.round(rate / freq)), ring = new Float32Array(period), pos = 0, prev = 0;
    for (var i = 0; i < period; i++) { var r = Math.random() * 2 - 1; ring[i] = (r + prev) / 2; prev = r; } // softer pick
    for (var n = 0; n < length; n++) {
      var next = (pos + 1) % period, v = ring[pos];
      ring[pos] = 0.9965 * 0.5 * (ring[pos] + ring[next]);
      data[n] = v; pos = next;
    }
    buffers[key] = buf;
    return buf;
  }
  function pluckString(freq, volume) {
    var src = ctx.createBufferSource(), tone = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = stringBuffer(freq);
    tone.type = "lowpass"; tone.frequency.value = 4600; tone.Q.value = 0.4;
    g.gain.value = volume || 0.55;
    src.connect(tone); tone.connect(g); g.connect(master);
    src.start();
    return {
      bend: function (cents, time) { src.playbackRate.setTargetAtTime(Math.pow(2, cents / 1200), ctx.currentTime, time || 0.06); },
      started: ctx.currentTime
    };
  }

  // đàn bầu voice: a harmonic is almost a pure tone; a short pick click starts it.
  function bauVoice(freq, cents) {
    var t0 = ctx.currentTime, out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t0);
    out.gain.exponentialRampToValueAtTime(0.5, t0 + 0.012);
    out.gain.exponentialRampToValueAtTime(0.2, t0 + 0.45);
    out.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.6);
    out.connect(master);
    var oscs = [[1, 1], [2, 0.13], [3, 0.045], [4, 0.015]].map(function (h) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq * h[0]; o.detune.value = cents || 0; g.gain.value = h[1];
      o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + 3.7);
      return o;
    });
    // the singing vibrato players add once the note settles
    var lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = 5.3; depth.gain.setValueAtTime(0, t0); depth.gain.linearRampToValueAtTime(9, t0 + 1.4);
    lfo.connect(depth); oscs.forEach(function (o) { depth.connect(o.detune); }); lfo.start(t0); lfo.stop(t0 + 3.7);
    // pick click
    var n = ctx.createBufferSource(), nb = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate), d = nb.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var bp = ctx.createBiquadFilter(), ng = ctx.createGain();
    bp.type = "bandpass"; bp.frequency.value = freq * 3; ng.gain.value = 0.05;
    n.buffer = nb; n.connect(bp); bp.connect(ng); ng.connect(master); n.start(t0);
    return {
      end: t0 + 3.6,
      bend: function (c, time) { oscs.forEach(function (o) { o.detune.setTargetAtTime(c, ctx.currentTime, time || 0.05); }); }
    };
  }

  /* ================= saved ================= */
  function savedIds() { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch (e) { return []; } }
  function toggleSaved(id) {
    var list = savedIds(), at = list.indexOf(id);
    if (at === -1) list.push(id); else list.splice(at, 1);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch (e) { /* storage blocked: the state lasts this visit */ }
    var badge = document.getElementById("saved-count");
    if (badge) { badge.textContent = list.length; badge.hidden = list.length === 0; }
    return at === -1;
  }

  /* ================= đàn tranh ================= */
  var TONES = [
    { vi: "Hò", west: "C", semi: 0 }, { vi: "Xự", west: "D", semi: 2 }, { vi: "Xang", west: "F", semi: 5 },
    { vi: "Xê", west: "G", semi: 7 }, { vi: "Cống", west: "A", semi: 9 }
  ];
  var TRANH_KEYS = ["Z", "X", "C", "V", "B", "A", "S", "D", "F", "G", "Q", "W", "E", "R", "T", "Y"];
  // 16 strings tuned to the five tones, lowest (farthest from the player) first, from C3.
  var TRANH = TRANH_KEYS.map(function (k, n) {
    var tone = TONES[n % 5], octave = 3 + Math.floor(n / 5);
    return { n: n, key: k, tone: tone, west: tone.west + octave, freq: 130.81 * Math.pow(2, (tone.semi + 12 * Math.floor(n / 5)) / 12) };
  });
  var TW = 1090, TH = 380;                       // drawing grid (horizontal)
  var XL = 96, XR = 884, XP = 912;               // left bridge, right bridge, tuning pegs
  function yL(n) { return 52 + n * 17.4; }       // strings spread wider at the bass end
  function yR(n) { return 78 + n * 14.2; }
  function yAt(n, x) { return yL(n) + (yR(n) - yL(n)) * (x - XL) / (XP - XL); }
  function bridgeX(n) { return 352 + n * 22; }    // movable bridges in a diagonal line

  function tranhSVG(vertical) {
    var o = '<defs><pattern id="grain" width="120" height="14" patternUnits="userSpaceOnUse">' +
      '<path d="M0 7 C30 3 60 11 120 6" fill="none" stroke="#8a5a2e" stroke-opacity=".22" stroke-width="1.2"/></pattern></defs>';
    var body = "M44 24 L968 54 Q992 55 992 74 L992 304 Q992 323 968 324 L44 354 Q22 355 22 334 L22 44 Q22 24 44 24 Z";
    o += '<path d="' + body + '" transform="translate(4 7)" fill="#4b2f18" opacity=".18"/>';          // shadow on the paper
    o += '<path class="tr-wood" d="' + body + '"/>';
    o += '<path d="M60 36 L952 66 L952 312 L60 342 Z" class="tr-board"/>';                              // soundboard
    o += '<path d="M60 36 L952 66 L952 312 L60 342 Z" fill="url(#grain)"/>';
    o += '<path d="M24 46 Q40 30 62 34 L62 344 Q40 348 24 332 Z" class="tr-head"/>';                     // carved head
    o += '<path d="M34 140 q12 -16 22 0 q-12 16 -22 0 M34 240 q12 -16 22 0 q-12 16 -22 0" class="tr-carve"/>';
    o += '<path d="M' + XL + ' 40 L' + XL + ' 340" class="tr-fixbridge"/>';                              // left bridge
    o += '<path d="M' + XR + ' 70 Q' + (XR + 7) + ' 190 ' + XR + ' 304" class="tr-fixbridge"/>';         // right bridge
    o += '<rect x="' + (XP - 8) + '" y="66" width="40" height="244" rx="6" class="tr-pegbox"/>';
    TRANH.forEach(function (s) {
      var n = s.n, bx = bridgeX(n), w = 2.1 - n * 0.075;
      o += '<g class="tr-string" data-n="' + n + '">' +
        '<path class="tr-wire" id="tw' + n + '" style="stroke-width:' + w.toFixed(2) + '" d="' + wirePath(n, 0, 0) + '"/>' +
        '<circle class="tr-peg" cx="' + (XP + 12 + (n % 2) * 8) + '" cy="' + yAt(n, XP).toFixed(1) + '" r="3.6"/>' +
        '<path class="tr-bridge" d="M' + (bx - 7) + " " + (yAt(n, bx) + 7).toFixed(1) + "L" + bx + " " + (yAt(n, bx) - 5).toFixed(1) + "L" + (bx + 7) + " " + (yAt(n, bx) + 7).toFixed(1) + '"/>' +
        '<circle class="tr-finger" id="tf' + n + '" cx="' + ((XL + bx) / 2).toFixed(1) + '" cy="' + yAt(n, (XL + bx) / 2).toFixed(1) + '" r="8"/>' +
        '<path class="tr-hit-pluck" data-pluck="' + n + '" d="M' + (bx + 6) + " " + yAt(n, bx + 6).toFixed(1) + "L" + XR + " " + yAt(n, XR).toFixed(1) + '"/>' +
        '<path class="tr-hit-press" data-press="' + n + '" d="M' + (XL + 6) + " " + yAt(n, XL + 6).toFixed(1) + "L" + (bx - 8) + " " + yAt(n, bx - 8).toFixed(1) + '"/>' +
        label(n, vertical) +
        "</g>";
    });
    var g = vertical ? '<g transform="translate(' + TH + ' 0) rotate(90)">' + o + "</g>" : "<g>" + o + "</g>";
    return '<svg class="tranh ' + (vertical ? "is-vertical" : "") + '" viewBox="0 0 ' + (vertical ? TH + " " + TW : TW + " " + TH) + '" role="img" aria-label="' + esc(t(UI.tranhLabel)) + '">' + g + "</svg>";
  }
  function label(n, vertical) {
    var s = TRANH[n], x = XP + 46, y = yAt(n, XP) + 4;
    var rot = vertical ? ' transform="rotate(-90 ' + x + " " + (y - 4) + ')"' : "";
    return '<text class="tr-label" x="' + x + '" y="' + y.toFixed(1) + '"' + rot + ' text-anchor="' + (vertical ? "middle" : "start") + '">' +
      '<tspan class="tr-key">' + s.key + "</tspan> " + s.tone.vi + "</text>";
  }
  // The string, with its vibrating part (bridge to right bridge) bowed by `off`
  // and the left part pulled down by `press` where the left hand presses.
  function wirePath(n, off, press) {
    var bx = bridgeX(n), mx = (bx + XR) / 2, px = (XL + bx) / 2;
    return "M" + XL + " " + yAt(n, XL).toFixed(1) +
      " Q" + px.toFixed(1) + " " + (yAt(n, px) + press).toFixed(1) + " " + bx + " " + yAt(n, bx).toFixed(1) +
      " Q" + mx.toFixed(1) + " " + (yAt(n, mx) + off).toFixed(1) + " " + XR + " " + yAt(n, XR).toFixed(1) +
      " L" + XP + " " + yAt(n, XP).toFixed(1);
  }

  var tranhVoices = {}, tranhShake = {}, lastString = null, pressing = null, raf = null;
  function shake(n) {
    tranhShake[n] = performance.now();
    if (!raf) raf = requestAnimationFrame(animateTranh);
  }
  function animateTranh(now) {
    raf = null;
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, alive = false;
    Object.keys(tranhShake).forEach(function (k) {
      var n = +k, age = (now - tranhShake[n]) / 1000, el = document.getElementById("tw" + n);
      if (!el) return;
      var amp = reduce ? 0 : 5 * Math.exp(-age * 3.2) * Math.sin(age * 2 * Math.PI * 14);
      var press = pressing === n ? 3 : 0;
      el.setAttribute("d", wirePath(n, amp, press));
      el.classList.toggle("is-ringing", age < 1.4);
      if (age < 1.6) alive = true; else delete tranhShake[n];
    });
    if (alive) raf = requestAnimationFrame(animateTranh);
  }
  function pluckTranh(n) {
    unlock().then(function (ok) {
      if (!ok) return;
      tranhVoices[n] = pluckString(TRANH[n].freq, 0.5);
      lastString = n;
    });
    shake(n);
    say(fill(t(UI.plucked), { tone: TRANH[n].tone.vi + " " + TRANH[n].west }));
  }
  function pressTranh(n, on) {
    var v = tranhVoices[n];
    var finger = document.getElementById("tf" + n);
    if (finger) finger.classList.toggle("is-on", on);
    pressing = on ? n : (pressing === n ? null : pressing);
    var el = document.getElementById("tw" + n);
    if (el) el.setAttribute("d", wirePath(n, 0, on ? 3 : 0));
    if (v && ctx && ctx.currentTime - v.started < 2.6) v.bend(on ? 200 : 0, on ? 0.09 : 0.06);  // pressing raises a whole tone
    if (on) say(fill(t(UI.pressed), { tone: TRANH[n].tone.vi }));
  }

  /* ================= đàn bầu ================= */
  var BW = 1000, BH = 300;
  var ROD_BASE = { x: 176, y: 152 }, PEG = { x: 940, y: 152 };
  var MARKS = [2, 3, 4, 5, 6];                    // harmonic number of each mark
  var BAU_F0 = 130.81;                            // the open string is usually tuned near C3
  var NOTE = { 2: "C4", 3: "G4", 4: "C5", 5: "E5", 6: "G5" };
  var rodDeg = 0, holdDeg = 0, bauVoiceNow = null, lastMark = 4, springRaf = null;
  function centsFor(deg) { return Math.round(deg * 25); }      // 1° of rod ≈ a quarter semitone
  function rodTip(deg) {
    var a = (-108 - deg) * Math.PI / 180, len = 150;            // pulled out = leans further away from the string
    return { x: ROD_BASE.x + Math.cos(a) * len, y: ROD_BASE.y + Math.sin(a) * len };
  }
  function anchor(deg) {                                         // where the string is tied on the rod
    var a = (-108 - deg) * Math.PI / 180;
    return { x: ROD_BASE.x + Math.cos(a) * 26, y: ROD_BASE.y + Math.sin(a) * 26 };
  }
  function markX(h) { var a = anchor(0); return PEG.x - (PEG.x - a.x) / h; }

  function bauSVG() {
    var o = '<defs><pattern id="bgrain" width="140" height="12" patternUnits="userSpaceOnUse">' +
      '<path d="M0 6 C40 2 80 10 140 5" fill="none" stroke="#8a5a2e" stroke-opacity=".25" stroke-width="1.2"/></pattern></defs>';
    o += '<path d="M120 170 L966 170 L974 232 L112 232 Z" transform="translate(4 8)" fill="#4b2f18" opacity=".18"/>';
    o += '<path class="b-front" d="M120 170 L966 170 L974 232 L112 232 Z"/>';                          // front face of the box
    o += '<path class="b-top" d="M134 146 L958 146 L966 170 L120 170 Z"/>';                             // soundboard seen at a slant
    o += '<path d="M134 146 L958 146 L966 170 L120 170 Z" fill="url(#bgrain)"/>';
    o += '<path class="b-inlay" d="M140 200 L948 200"/>';
    o += '<path class="b-end" d="M112 232 L120 170 L134 146 L150 146 L138 170 L130 232 Z"/>';
    o += '<path class="b-end" d="M974 232 L966 170 L958 146 L944 146 L952 170 L960 232 Z"/>';
    o += '<rect class="b-peg" x="930" y="128" width="20" height="24" rx="4"/><circle class="b-peg" cx="940" cy="122" r="7"/>';
    o += '<path class="b-bridge" d="M902 146 L902 138 L912 138 L912 146"/>';
    MARKS.forEach(function (h, k) {
      var x = markX(h);
      o += '<g class="b-mark" data-mark="' + h + '">' +
        '<circle class="b-dot" cx="' + x.toFixed(1) + '" cy="160" r="5"/>' +
        '<circle class="b-ring" cx="' + x.toFixed(1) + '" cy="160" r="12"/>' +
        '<text class="b-label" x="' + x.toFixed(1) + '" y="' + (k % 2 ? 282 : 258) + '" text-anchor="middle"><tspan class="tr-key">' + (k + 1) + "</tspan> " + NOTE[h] + "</text>" +
        '<rect class="b-hit" data-mark="' + h + '" x="' + (x - 20).toFixed(1) + '" y="120" width="40" height="150"/>' +
        "</g>";
    });
    o += '<path id="b-wire" class="b-wire" d=""/>';
    o += '<g id="b-rod">' + rodMarkup() + "</g>";
    o += '<path id="b-rodhit" class="b-rodhit" d=""/>';
    return '<svg class="bau" viewBox="0 0 ' + BW + " " + BH + '" role="img" aria-label="' + esc(t(UI.bauLabel)) + '">' + o + "</svg>";
  }
  function rodMarkup() {
    // drawn standing straight up, then rotated around its base
    var bx = ROD_BASE.x, by = ROD_BASE.y;
    return '<path class="b-rod" d="M' + (bx - 4) + " " + by + " C" + (bx - 6) + " " + (by - 60) + " " + (bx - 2) + " " + (by - 110) + " " + (bx + 6) + " " + (by - 150) +
      " L" + (bx + 9) + " " + (by - 149) + " C" + (bx + 3) + " " + (by - 108) + " " + (bx + 3) + " " + (by - 60) + " " + (bx + 4) + " " + by + ' Z"/>' +
      // the gourd: two lobes and a neck, as on the real instrument
      '<ellipse class="b-gourd" cx="' + bx + '" cy="' + (by - 70) + '" rx="22" ry="25"/>' +
      '<ellipse class="b-gourd" cx="' + bx + '" cy="' + (by - 101) + '" rx="12" ry="11"/>' +
      '<path class="b-gourd-line" d="M' + (bx - 14) + " " + (by - 82) + " Q" + bx + " " + (by - 78) + " " + (bx + 14) + " " + (by - 82) + " M" + (bx - 18) + " " + (by - 62) + " Q" + bx + " " + (by - 57) + " " + (bx + 18) + " " + (by - 62) + '"/>' +
      '<circle class="b-tie" cx="' + bx + '" cy="' + (by - 26) + '" r="3"/>';
  }
  function drawBau(off) {
    var rod = document.getElementById("b-rod");
    if (!rod) return;
    rod.setAttribute("transform", "rotate(" + (-18 - rodDeg) + " " + ROD_BASE.x + " " + ROD_BASE.y + ")");
    var a = anchor(rodDeg), mx = (a.x + 906) / 2, my = (a.y + 141) / 2 + (off || 0);
    document.getElementById("b-wire").setAttribute("d", "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " 906 141 L" + PEG.x + " " + (PEG.y - 26));
    var tip = rodTip(rodDeg);
    document.getElementById("b-rodhit").setAttribute("d", "M" + ROD_BASE.x + " " + ROD_BASE.y + " L" + tip.x.toFixed(1) + " " + tip.y.toFixed(1));
  }
  var bauShake = 0, bauRaf = null;
  function animateBau(now) {
    bauRaf = null;
    var age = (now - bauShake) / 1000, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    drawBau(reduce ? 0 : 3.5 * Math.exp(-age * 1.6) * Math.sin(age * 2 * Math.PI * 11));
    if (age < 3) bauRaf = requestAnimationFrame(animateBau); else drawBau(0);
  }
  function pluckBau(h) {
    lastMark = h;
    unlock().then(function (ok) {
      if (!ok) return;
      bauVoiceNow = bauVoice(BAU_F0 * h, centsFor(rodDeg));
    });
    var mark = document.querySelector('.b-mark[data-mark="' + h + '"]');
    if (mark) { mark.classList.remove("is-on"); void mark.getBoundingClientRect(); mark.classList.add("is-on"); }
    bauShake = performance.now();
    if (!bauRaf) bauRaf = requestAnimationFrame(animateBau);
    say(NOTE[h]);
  }
  function setRod(deg, quick) {
    rodDeg = Math.max(-12, Math.min(20, deg));
    if (bauVoiceNow && ctx && ctx.currentTime < bauVoiceNow.end) bauVoiceNow.bend(centsFor(rodDeg), quick ? 0.02 : 0.05);
    if (!bauRaf) drawBau(0);
    var out = document.getElementById("rod-out");
    if (out) out.textContent = rodText(rodDeg);
  }
  function rodText(deg) {
    var semi = Math.round(centsFor(deg) / 50) / 2;
    return semi === 0 ? t(UI.rodNone) : fill(t(semi > 0 ? UI.rodUp : UI.rodDown), { n: Math.abs(semi) });
  }
  function springBack() {
    cancelAnimationFrame(springRaf);
    var from = rodDeg, start = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - start) / 260), e = 1 - Math.pow(1 - k, 3);
      setRod(from + (holdDeg - from) * e, true);
      if (k < 1) springRaf = requestAnimationFrame(step);
    })(start);
  }

  /* ================= sáo trúc ================= */
  // Six finger holes. The pitch is set by the first open hole counting from the mouth end:
  // all covered gives the lowest note, and lifting fingers one by one climbs the scale (D major).
  var FL_KEYS = ["A", "S", "D", "J", "K", "L"];
  var FL_HOLES = [430, 505, 580, 690, 765, 840];
  var FL_SCALE = [{ n: "D4", f: 293.66 }, { n: "E4", f: 329.63 }, { n: "F♯4", f: 369.99 }, { n: "G4", f: 392 }, { n: "A4", f: 440 }, { n: "B4", f: 493.88 }, { n: "C♯5", f: 554.37 }];
  var covered = [true, true, true, true, true, true];
  var FW = 1000, FH = 200;
  function fluteNote() {
    var firstOpen = -1;
    for (var i = 0; i < 6; i++) if (!covered[i]) { firstOpen = i; break; }
    return FL_SCALE[firstOpen === -1 ? 0 : 6 - firstOpen];
  }
  function fluteSVG(vert) {
    var o = '<path d="M36 124 L964 124" stroke="#4b2f18" stroke-opacity=".16" stroke-width="40" stroke-linecap="round" transform="translate(4 8)"/>';
    o += '<rect class="fl-tube" x="30" y="78" width="940" height="46" rx="23"/>';
    o += '<path class="fl-shine" d="M60 90 L940 90"/>';
    [260, 620, 930].forEach(function (x) { o += '<path class="fl-node" d="M' + x + ' 78 L' + x + ' 124"/>'; });
    o += '<ellipse class="fl-blow" cx="150" cy="101" rx="20" ry="11"/>';
    o += '<path class="fl-tassel" d="M40 101 L8 150 M40 101 L22 156 M40 101 L38 158"/>';
    FL_HOLES.forEach(function (x, k) {
      o += '<g class="fl-hole" data-hole="' + k + '">' +
        '<circle class="fl-pad" id="fp' + k + '" cx="' + x + '" cy="101" r="23"/>' +
        '<circle class="fl-dark" cx="' + x + '" cy="101" r="10"/>' +
        '<text class="tr-label" x="' + x + '" y="162" text-anchor="middle"><tspan class="tr-key">' + FL_KEYS[k] + "</tspan></text>" +
        '<circle class="fl-hit" data-hole="' + k + '" cx="' + x + '" cy="101" r="38"/></g>';
    });
    var g = vert ? '<g transform="translate(' + FH + ' 0) rotate(90)">' + o + "</g>" : "<g>" + o + "</g>";
    return '<svg class="flute ' + (vert ? "is-vertical" : "") + '" viewBox="0 0 ' + (vert ? FH + " " + FW : FW + " " + FH) + '" role="img" aria-label="' + esc(t(UI.fluteLabel)) + '">' + g + "</svg>";
  }
  function paintHoles() {
    covered.forEach(function (c, k) {
      var p = document.getElementById("fp" + k), b = document.querySelector('[data-key-hole="' + k + '"]');
      if (p) p.classList.toggle("is-on", c);
      if (b) {
        b.setAttribute("aria-pressed", String(c));
        b.setAttribute("aria-label", fill(t(UI.holeBtn), { n: k + 1, state: t(c ? UI.covered : UI.open) }));
      }
    });
    var n = document.getElementById("fl-note");
    if (n) n.textContent = fluteNote().n;
  }
  function toggleHole(k) {
    covered[k] = !covered[k];
    paintHoles();
    say(fluteNote().n);
  }

  // The voice: a soft breathy flute tone. Pitch follows the fingering, loudness follows the breath.
  var flute = null, breath = { mic: 0, key: 0, demo: 0 }, fluteRaf = null, mic = null;
  function startFlute() {
    if (flute) return flute;
    if (!audio()) return null;
    var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), o3 = ctx.createOscillator();
    var g1 = ctx.createGain(), g2 = ctx.createGain(), g3 = ctx.createGain(), out = ctx.createGain(), air = ctx.createGain();
    o1.type = o2.type = o3.type = "sine";
    g1.gain.value = 1; g2.gain.value = 0.22; g3.gain.value = 0.06; out.gain.value = 0; air.gain.value = 0;
    var nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = nb.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var noise = ctx.createBufferSource(), bp = ctx.createBiquadFilter();
    noise.buffer = nb; noise.loop = true; bp.type = "bandpass"; bp.Q.value = 1.2; bp.frequency.value = 1800;
    var lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = 5; depth.gain.value = 4; lfo.connect(depth);
    [o1, o2, o3].forEach(function (o) { depth.connect(o.detune); });
    o1.connect(g1); o2.connect(g2); o3.connect(g3); g1.connect(out); g2.connect(out); g3.connect(out);
    noise.connect(bp); bp.connect(air); air.connect(out); out.connect(master);
    [o1, o2, o3, noise, lfo].forEach(function (n) { n.start(); });
    flute = { o: [o1, o2, o3], out: out, air: air, bp: bp };
    return flute;
  }
  function fluteLoop() {
    fluteRaf = null;
    if (!flute || !document.getElementById("fl-note")) return;
    var level = Math.max(breath.mic, breath.key, breath.demo), note = fluteNote();
    var high = level > 0.82, f = note.f * (high ? 2 : 1), now = ctx.currentTime;
    flute.o.forEach(function (o, i) { o.frequency.setTargetAtTime(f * (i + 1), now, 0.035); });
    flute.bp.frequency.setTargetAtTime(f * 4, now, 0.05);
    var on = level > 0.05, amp = on ? Math.min(1, (level - 0.05) / 0.6) : 0;
    flute.out.gain.setTargetAtTime(amp * 0.42, now, on ? 0.04 : 0.09);
    flute.air.gain.setTargetAtTime(amp * 0.5, now, 0.05);
    var m = document.getElementById("fl-meter");
    if (m) m.style.width = Math.round(Math.min(1, level) * 100) + "%";
    var nn = document.getElementById("fl-note");
    if (nn) nn.textContent = note.n + (high && on ? "↑" : "");
    fluteRaf = requestAnimationFrame(fluteLoop);
  }
  function ensureFlute() {
    return unlock().then(function (ok) {
      if (!ok) return false;
      startFlute();
      if (!fluteRaf) fluteRaf = requestAnimationFrame(fluteLoop);
      return true;
    });
  }
  // Blowing into the microphone: the level of the breath noise becomes the loudness.
  function stopMic() {
    if (mic) {
      mic.stream.getTracks().forEach(function (tr) { tr.stop(); });
      try { mic.src.disconnect(); } catch (e) { /* already closed */ }
      cancelAnimationFrame(mic.raf);
      mic = null;
    }
    breath.mic = 0;
    var b = document.getElementById("mic-btn");
    if (b) { b.setAttribute("aria-pressed", "false"); b.querySelector("span").textContent = t(UI.micOn); }
  }
  function startMic() {
    var md = navigator.mediaDevices, note = document.getElementById("mic-note");
    if (!md || !md.getUserMedia) { note.textContent = t(UI.micMissing); return; }
    note.textContent = t(UI.micAsk);
    ensureFlute().then(function () {
      return md.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false } });
    }).then(function (stream) {
      var src = ctx.createMediaStreamSource(stream), an = ctx.createAnalyser(), hp = ctx.createBiquadFilter();
      hp.type = "highpass"; hp.frequency.value = 120; an.fftSize = 1024;
      src.connect(hp); hp.connect(an);                       // the microphone is never routed to the speakers
      var data = new Float32Array(an.fftSize), floor = 0.01, frames = 0, smooth = 0;
      mic = { stream: stream, src: src, raf: 0 };
      (function read() {
        an.getFloatTimeDomainData(data);
        var s = 0;
        for (var i = 0; i < data.length; i++) s += data[i] * data[i];
        var rms = Math.sqrt(s / data.length);
        if (frames < 30) { floor = Math.max(floor, rms * 1.6); frames++; }     // first half second: learn the room noise
        var raw = Math.max(0, (rms - floor * 1.8) / 0.12);
        smooth += (raw - smooth) * (raw > smooth ? 0.5 : 0.18);
        breath.mic = Math.min(1.2, smooth);
        mic.raf = requestAnimationFrame(read);
      })();
      var b = document.getElementById("mic-btn");
      b.setAttribute("aria-pressed", "true"); b.querySelector("span").textContent = t(UI.micOff);
      note.textContent = t(UI.micReady) + " " + t(UI.micTip);
      say(t(UI.micReady));
    }).catch(function (err) {
      note.textContent = err && (err.name === "NotAllowedError" || err.name === "SecurityError") ? t(UI.micDenied) : t(UI.micMissing);
    });
  }

  /* ================= page ================= */
  function gloss(i) {
    return lang() === "en"
      ? '<p class="inst-gloss">' + esc(i.en) + ' · <span class="say">' + t(UI.say) + " “" + esc(i.say) + "”</span></p>"
      : '<p class="inst-gloss"><span class="say">' + t(UI.english) + '</span> <span lang="en">' + esc(i.en) + "</span></p>";
  }
  function isSaved() { return savedIds().indexOf(inst.id) !== -1; }
  function saveBtn() {
    var on = isSaved();
    return '<button type="button" class="act inst-save" id="inst-save" aria-pressed="' + on + '"><svg class="icon star" aria-hidden="true"><use href="#i-star"/></svg><span>' + t(on ? UI.saved : UI.save) + "</span></button>";
  }
  var vertical = false, playingDemo = null;
  var phoneQuery = matchMedia("(max-width: 639.98px) and (orientation: portrait)");

  function stage() {
    if (inst.id === "dan-tranh") {
      return '<div class="stage stage-tranh" id="stage">' + tranhSVG(vertical) + "</div>" +
        '<div class="play-keys" role="group" aria-label="' + esc(t(UI.playTranh)) + '">' +
        TRANH.map(function (s) {
          return '<button type="button" class="key-btn" data-key-pluck="' + s.n + '" aria-label="' + esc(fill(t(UI.stringBtn), { n: s.n + 1, tone: s.tone.vi, west: s.west })) + '"><span lang="vi">' + s.tone.vi + "</span><small>" + s.key + "</small></button>";
        }).join("") + "</div>" +
        '<div class="how"><p>' + t(UI.tranhHowMouse) + "</p><p>" + t(UI.tranhHowKeys) + "</p></div>";
    }
    if (inst.id === "dan-bau") {
      return '<div class="stage stage-bau" id="stage">' + bauSVG() + "</div>" +
        '<div class="play-keys" role="group" aria-label="' + esc(t(UI.playBau)) + '">' +
        MARKS.map(function (h, k) {
          return '<button type="button" class="key-btn" data-key-mark="' + h + '" aria-label="' + esc(fill(t(UI.markBtn), { n: k + 1, west: NOTE[h] })) + '"><span>' + NOTE[h] + "</span><small>" + (k + 1) + "</small></button>";
        }).join("") +
        '<label class="rod-ctl"><span>' + t(UI.rod) + '</span><input type="range" id="rod-range" min="-12" max="20" step="2" value="' + holdDeg + '"><output id="rod-out" for="rod-range">' + rodText(holdDeg) + "</output></label>" +
        "</div>" +
        '<div class="how"><p>' + t(UI.bauHowMouse) + "</p><p>" + t(UI.bauHowKeys) + "</p></div>";
    }
    if (inst.id === "sao-truc") {
      return '<div class="stage stage-flute" id="stage">' + fluteSVG(vertical) + "</div>" +
        '<div class="play-keys" role="group" aria-label="' + esc(t(UI.playTitle)) + '">' +
        FL_KEYS.map(function (k, n) {
          return '<button type="button" class="key-btn" data-key-hole="' + n + '" aria-pressed="true" aria-label="' + esc(fill(t(UI.holeBtn), { n: n + 1, state: t(UI.covered) })) + '"><span>' + (n + 1) + "</span><small>" + k + "</small></button>";
        }).join("") +
        '<button type="button" class="act blow-btn" id="blow-btn"><svg class="icon" aria-hidden="true"><use href="#i-sound-on"/></svg><span>' + t(UI.blowHold) + "</span></button>" +
        '<button type="button" class="act mic-btn" id="mic-btn" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-sound-on"/></svg><span>' + t(UI.micOn) + "</span></button>" +
        '<div class="breath"><span>' + t(UI.breath) + '</span><span class="breath-bar" aria-hidden="true"><span id="fl-meter"></span></span><output class="fl-note" id="fl-note">' + fluteNote().n + "</output></div>" +
        "</div>" +
        '<p class="how" id="mic-note" aria-live="polite"></p>' +
        '<div class="how"><p>' + t(UI.fluteHowMouse) + "</p><p>" + t(UI.fluteHowKeys) + "</p></div>";
    }
    // instruments that cannot be played yet
    var pair = { "dan-nguyet": "dan-ty-ba", "dan-ty-ba": "dan-nguyet" }[inst.id];
    var label = fill(t(UI.drawing), { name: inst.vi }) + (inst.telling ? " " + t(inst.telling) : "");
    return '<div class="stage stage-still">' + (window.NGUAM_SHAPES ? NGUAM_SHAPES.svg(inst.id, esc(label)) : "") + "</div>" +
      '<div class="coming-note"><p class="coming-title">' + t(UI.comingTitle) + "</p><p>" + t(UI.comingText) + "</p>" +
      '<p class="still-links">' +
      (pair ? '<a class="ink-link" href="library.html?compare=' + inst.id + "," + pair + '#compare"><span>' + fill(t(UI.compareWith), { b: '<span lang="vi">' + byId(pair).vi + "</span>" }) + '</span><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>' : "") +
      '<a class="ink-link" href="instrument.html?id=dan-bau"><span>' + t(UI.playBau) + '</span><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
      '<a class="ink-link" href="instrument.html?id=dan-tranh"><span>' + t(UI.playTranh) + '</span><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
      "</p></div>";
  }

  function render() {
    var root = document.getElementById("inst-root");
    if (!inst) {
      root.innerHTML = '<div class="lib-empty"><h1>' + t(UI.unknownTitle) + "</h1><p>" + t(UI.unknownText) + '</p><p><a class="ink-link" href="library.html"><span>' + t(UI.toList) + "</span></a></p></div>";
      return;
    }
    document.title = inst.vi + " · Ngũ Âm";
    var playable = inst.id === "dan-bau" || inst.id === "dan-tranh" || inst.id === "sao-truc";
    root.innerHTML =
      '<header class="inst-head">' +
        '<div><h1 lang="vi">' + esc(inst.vi) + "</h1>" + gloss(inst) +
        '<p class="inst-meta">' + family(inst) + " · " + region(inst) + " · " + t(UI.people) + ": " + esc(t(inst.people)) + "</p></div>" +
        '<p class="inst-summary">' + esc(t(inst.summary)) + "</p>" +
      "</header>" +
      '<section class="play" aria-labelledby="play-title">' +
        '<div class="play-bar"><h2 id="play-title">' + t(UI.playTitle) + "</h2>" +
          '<div class="play-tools">' +
            (playable ? '<button type="button" class="act inst-listen" id="inst-listen" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-play"/></svg><span>' + t(UI.listen) + "</span></button>" : "") +
            saveBtn() +
          "</div></div>" +
        stage() +
        (playable ? '<p class="no-sound">' + t(UI.noSound) + "</p>" : "") +
      "</section>" +
      '<div class="inst-read">' +
        '<section aria-labelledby="story-title"><h2 id="story-title">' + t(UI.story) + "</h2>" +
          inst.facts.map(function (f) { return "<p>" + esc(t(f)) + "</p>"; }).join("") + "</section>" +
        '<section aria-labelledby="made-title"><h2 id="made-title">' + t(UI.made) + '</h2><dl class="detail-rows">' +
          DATA.compareRows.map(function (r) { return "<dt>" + t(r) + "</dt><dd>" + esc(t(inst.compare[r.id])) + "</dd>"; }).join("") + "</dl>" +
          '<p class="detail-source">' + t(UI.source) + ': <a href="' + inst.source.url + '">' + esc(inst.source.label) + "</a></p></section>" +
      "</div>" +
      (playable
        ? '<div class="inst-next">' +
            '<div class="next-lesson"><a class="ink-link" href="learn.html?id=' + inst.id + '"><span>' + t(UI.lesson) + '</span><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a><p>' + t(UI.lessonNote) + "</p></div>" +
            '<div class="next-phone"><img src="assets/img/qr-phone.png" width="300" height="300" alt="QR code for the phone version of Ngũ Âm" data-vi-alt="Mã QR mở bản điện thoại của Ngũ Âm"><div><h2>' + t(UI.phoneTitle) + "</h2><p>" + t(UI.phoneText) + '</p><p><a class="ink-link" href="https://tminhks.github.io/vn-instruments/">tminhks.github.io/vn-instruments</a></p></div></div>' +
          "</div>"
        : "");
    if (inst.id === "dan-bau") drawBau(0);
    if (inst.id === "sao-truc") paintHoles();
  }

  /* ---------- listen to a sample ---------- */
  function stopDemo() { if (playingDemo) { playingDemo.forEach(clearTimeout); playingDemo = null; } syncListen(false); }
  function syncListen(on) {
    var b = document.getElementById("inst-listen");
    if (!b) return;
    b.setAttribute("aria-pressed", String(on));
    b.querySelector("use").setAttribute("href", on ? "#i-stop" : "#i-play");
    b.querySelector("span").textContent = t(on ? UI.stop : UI.listen);
  }
  function demo() {
    if (playingDemo) { stopDemo(); return; }
    var steps;
    if (inst.id === "dan-tranh") {
      // a run up the five tones, a little press on Xự, then a sweep back down
      var seq = [[5, 0], [6, 260], [7, 520], [8, 780], [9, 1040], [11, 1400], [11, 1700, "press"], [11, 2150, "release"], [10, 2400]];
      for (var k = 15; k >= 0; k--) seq.push([k, 2900 + (15 - k) * 70]);
      steps = seq.map(function (s) {
        return setTimeout(function () {
          if (s[2] === "press") pressTranh(s[0], true); else if (s[2] === "release") pressTranh(s[0], false); else pluckTranh(s[0]);
        }, s[1]);
      });
      steps.push(setTimeout(stopDemo, 4300));
    } else if (inst.id === "sao-truc") {
      // a short phrase: climb with the fingers, then come back down
      ensureFlute();
      var phrase = [[0, "111111"], [500, "111110"], [1000, "111100"], [1500, "111000"], [2000, "110000"], [2600, "100000"], [3200, "110000"], [3700, "111000"], [4200, "111111"]];
      steps = phrase.map(function (s) {
        return setTimeout(function () {
          covered = s[1].split("").map(function (c) { return c === "1"; });
          breath.demo = 0.5;
          paintHoles();
        }, s[0] + 150);
      });
      steps.push(setTimeout(function () { breath.demo = 0; stopDemo(); }, 4900));
    } else {
      // pluck, then lean on the rod: the voice of the đàn bầu
      // [time ms, mark to pluck or null, rod angle to lean to]
      var p = [[0, 4, 0], [450, null, 8], [1000, null, 0], [1500, 3, 0], [1950, null, -6], [2500, 5, 0], [3000, null, 12], [3700, null, 4], [4300, 4, 0]];
      steps = p.map(function (s) {
        return setTimeout(function () {
          if (s[1]) pluckBau(s[1]);
          holdDeg = s[2]; springBack();
        }, s[0]);
      });
      steps.push(setTimeout(function () { holdDeg = +(document.getElementById("rod-range") || { value: 0 }).value; springBack(); stopDemo(); }, 6200));
    }
    playingDemo = steps;
    syncListen(true);
  }

  /* ---------- pointer play ---------- */
  function hitAt(x, y) {
    var el = document.elementFromPoint(x, y);
    return el && el.closest ? el : null;
  }
  function wireTranh(svg) {
    var down = false, lastPluck = null;
    svg.addEventListener("pointerdown", function (e) {
      var el = hitAt(e.clientX, e.clientY);
      if (!el) return;
      var p = el.getAttribute("data-pluck"), q = el.getAttribute("data-press");
      if (p !== null) { down = true; lastPluck = +p; pluckTranh(+p); svg.setPointerCapture(e.pointerId); e.preventDefault(); }
      else if (q !== null) { pressTranh(+q, true); svg.setPointerCapture(e.pointerId); down = "press:" + q; e.preventDefault(); }
    });
    svg.addEventListener("pointermove", function (e) {
      if (down !== true) return;
      var el = hitAt(e.clientX, e.clientY), p = el && el.getAttribute("data-pluck");
      if (p !== null && p !== undefined && +p !== lastPluck) { lastPluck = +p; pluckTranh(+p); }   // sweeping across strings
    });
    function up() {
      if (typeof down === "string") pressTranh(+down.split(":")[1], false);
      down = false; lastPluck = null;
    }
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", up);
    svg.addEventListener("lostpointercapture", up);
  }
  function wireBau(svg) {
    var dragging = false;
    function point(e) {
      var g = svg.querySelector("#b-rod"), m = svg.getScreenCTM().inverse(), p = svg.createSVGPoint();
      p.x = e.clientX; p.y = e.clientY;
      return p.matrixTransform(m);
    }
    svg.addEventListener("pointerdown", function (e) {
      var el = hitAt(e.clientX, e.clientY);
      if (!el) return;
      var mark = el.getAttribute("data-mark");
      if (mark !== null) { pluckBau(+mark); e.preventDefault(); return; }
      if (el.closest("#b-rod") || el.id === "b-rodhit") { dragging = true; cancelAnimationFrame(springRaf); svg.setPointerCapture(e.pointerId); svg.classList.add("is-dragging"); e.preventDefault(); }
    });
    svg.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var p = point(e), ang = Math.atan2(p.y - ROD_BASE.y, p.x - ROD_BASE.x) * 180 / Math.PI;  // straight up ≈ -90
      setRod(-108 - ang, true);
    });
    function up() { if (!dragging) return; dragging = false; svg.classList.remove("is-dragging"); springBack(); }
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", up);
    svg.addEventListener("lostpointercapture", up);
  }

  /* ---------- keyboard ---------- */
  var keysDown = {};
  function onKey(e) {
    if (!inst || e.target.closest("input, select, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (inst.id === "dan-tranh") {
      if (e.key === "Shift" && lastString !== null && !e.repeat) { pressTranh(lastString, true); return; }
      var n = TRANH_KEYS.indexOf(k);
      if (n !== -1 && !e.repeat) { pluckTranh(n); e.preventDefault(); }
    } else if (inst.id === "sao-truc") {
      var h = FL_KEYS.indexOf(k);
      if (h !== -1 && !e.repeat) { toggleHole(h); e.preventDefault(); }
      else if (e.key === " " && !e.target.closest("button, a")) { e.preventDefault(); if (!e.repeat) { breath.key = 0.55; ensureFlute(); } }
    } else if (inst.id === "dan-bau") {
      if (/^[1-5]$/.test(e.key) && !e.repeat) { pluckBau(MARKS[+e.key - 1]); e.preventDefault(); }
      else if (e.key === " " && !e.target.closest("button, a")) { if (!e.repeat) pluckBau(lastMark); e.preventDefault(); }
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        if (keysDown[e.key]) return;
        keysDown[e.key] = true;
        cancelAnimationFrame(springRaf);
        var target = e.key === "ArrowUp" ? 16 : -8, from = rodDeg, start = performance.now();
        (function lean(now) {
          if (!keysDown[e.key]) return;
          var kk = Math.min(1, (now - start) / 380);
          setRod(from + (target - from) * kk, true);
          if (kk < 1) springRaf = requestAnimationFrame(lean);
        })(start);
      }
    }
  }
  function onKeyUp(e) {
    if (!inst) return;
    if (inst.id === "dan-tranh" && e.key === "Shift" && pressing !== null) pressTranh(pressing, false);
    if (inst.id === "sao-truc" && e.key === " ") breath.key = 0;
    if (inst.id === "dan-bau" && (e.key === "ArrowUp" || e.key === "ArrowDown")) { keysDown[e.key] = false; springBack(); }
  }

  /* ---------- wiring ---------- */
  function wire() {
    var svg = document.querySelector("#stage svg");
    if (svg && inst.id === "dan-tranh") wireTranh(svg);
    if (svg && inst.id === "dan-bau") wireBau(svg);
    if (svg && inst.id === "sao-truc") {
      svg.addEventListener("pointerdown", function (e) {
        var el = e.target.closest ? e.target.closest("[data-hole]") : null;
        if (el) { toggleHole(+el.getAttribute("data-hole")); e.preventDefault(); }
      });
    }
    var blow = document.getElementById("blow-btn");
    if (blow) {
      var press = function (e) { breath.key = 0.55; ensureFlute(); e.preventDefault(); };
      var release = function () { breath.key = 0; };
      blow.addEventListener("pointerdown", press);
      blow.addEventListener("pointerup", release);
      blow.addEventListener("pointercancel", release);
      blow.addEventListener("pointerleave", release);
      blow.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { if (!e.repeat) press(e); e.preventDefault(); } });
      blow.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") release(); });
      blow.addEventListener("blur", release);
    }
  }
  function build() {
    vertical = inst && (inst.id === "dan-tranh" || inst.id === "sao-truc") && phoneQuery.matches;
    render(); wire();
  }

  document.addEventListener("DOMContentLoaded", function () {
    build();
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKeyUp);
    document.getElementById("inst-root").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.id === "inst-save") {
        var now = toggleSaved(inst.id);
        b.outerHTML = saveBtn();
        document.getElementById("inst-save").focus();
        say((now ? t(UI.saved) : t(UI.save)) + " " + inst.vi);
      } else if (b.id === "inst-listen") demo();
      else if (b.id === "mic-btn") { if (mic) stopMic(); else startMic(); }
      else if (b.hasAttribute("data-key-hole")) toggleHole(+b.getAttribute("data-key-hole"));
      else if (b.hasAttribute("data-key-pluck")) pluckTranh(+b.getAttribute("data-key-pluck"));
      else if (b.hasAttribute("data-key-mark")) pluckBau(+b.getAttribute("data-key-mark"));
    });
    document.getElementById("inst-root").addEventListener("input", function (e) {
      if (e.target.id === "rod-range") { holdDeg = +e.target.value; cancelAnimationFrame(springRaf); setRod(holdDeg); }
    });
    if (phoneQuery.addEventListener) phoneQuery.addEventListener("change", function () { if (inst && (inst.id === "dan-tranh" || inst.id === "sao-truc")) { stopDemo(); build(); } });
    document.addEventListener("nguam:lang", function () { stopDemo(); build(); });
  });
})();
