/* Ngũ Âm sound engine. Every sound is synthesised with the Web Audio API,
   so nothing has to be loaded from a file (file:// blocks fetch()).
   - pluck(): Karplus-Strong plucked string, used for the đàn tranh.
   - bauPhrase(): a short đàn bầu phrase, a pure harmonic tone whose pitch is
     bent up and down by the rod, with a little vibrato. */
(function () {
  "use strict";

  var ctx = null;
  var master = null;
  var muted = localStorage.getItem("nguam.muted") === "1";
  var cache = {};

  // The five tones of the Vietnamese pentatonic scale, tuned on C as in the phone version.
  var TONES = [
    { id: "ho",   vi: "Hò",   west: "C", freq: 261.63 },
    { id: "xu",   vi: "Xự",   west: "D", freq: 293.66 },
    { id: "xang", vi: "Xang", west: "F", freq: 349.23 },
    { id: "xe",   vi: "Xê",   west: "G", freq: 392.0 },
    { id: "cong", vi: "Cống", west: "A", freq: 440.0 }
  ];

  function context() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    master.connect(comp);
    comp.connect(ctx.destination);
    return ctx;
  }

  // Call from inside a click, tap or key handler: browsers only allow sound after a user gesture.
  function unlock() {
    var c = context();
    if (c && c.state === "suspended") return c.resume();
    return Promise.resolve();
  }
  function ready() { return !!ctx && ctx.state === "running"; }

  function stringBuffer(freq, damping) {
    var key = freq + ":" + damping;
    if (cache[key]) return cache[key];
    var rate = ctx.sampleRate, length = Math.floor(rate * 2.6);
    var buffer = ctx.createBuffer(1, length, rate), data = buffer.getChannelData(0);
    var period = Math.max(2, Math.round(rate / freq)), ring = new Float32Array(period), i, n, pos = 0;
    for (i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
    for (n = 0; n < length; n++) {
      var next = (pos + 1) % period, value = ring[pos];
      ring[pos] = damping * 0.5 * (ring[pos] + ring[next]);
      data[n] = value;
      pos = next;
    }
    cache[key] = buffer;
    return buffer;
  }

  function pluck(freq, volume) {
    if (!ready()) return false;
    var src = ctx.createBufferSource();
    src.buffer = stringBuffer(freq, 0.996);
    var tone = ctx.createBiquadFilter();
    tone.type = "lowpass"; tone.frequency.value = 3800;
    var gain = ctx.createGain();
    gain.gain.value = volume == null ? 0.5 : volume;
    src.connect(tone); tone.connect(gain); gain.connect(master);
    src.start();
    return true;
  }

  function bauNote(t, freq, dur, bendCents, bendAt, vibrato) {
    var out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.42, t + 0.012);
    out.gain.exponentialRampToValueAtTime(0.16, t + 0.35);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    out.connect(master);

    var oscs = [[1, 1], [2, 0.12], [3, 0.04]].map(function (h) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq * h[0]; g.gain.value = h[1];
      o.connect(g); g.connect(out);
      o.detune.setValueAtTime(0, t);
      if (bendCents) {
        o.detune.setValueAtTime(0, t + dur * bendAt);
        o.detune.linearRampToValueAtTime(bendCents, t + dur * bendAt + 0.22);
      }
      return o;
    });

    if (vibrato) {
      var lfo = ctx.createOscillator(), depth = ctx.createGain();
      lfo.frequency.value = 5.4; depth.gain.setValueAtTime(0, t);
      depth.gain.linearRampToValueAtTime(14, t + dur * 0.5);
      lfo.connect(depth);
      oscs.forEach(function (o) { depth.connect(o.detune); });
      lfo.start(t); lfo.stop(t + dur);
    }
    oscs.forEach(function (o) { o.start(t); o.stop(t + dur + 0.05); });
    return oscs;
  }

  // A short phrase: rise into a bend, fall back, then a long note that sings.
  function bauPhrase(onEnd) {
    if (!ready()) return null;
    var t = ctx.currentTime + 0.05, nodes = [];
    nodes = nodes.concat(bauNote(t, 392.0, 1.3, 200, 0.42, false));
    nodes = nodes.concat(bauNote(t + 1.25, 440.0, 1.0, -200, 0.35, false));
    nodes = nodes.concat(bauNote(t + 2.2, 329.63, 2.2, 0, 0, true));
    var timer = setTimeout(function () { if (onEnd) onEnd(); }, 4500);
    return function stop() {
      clearTimeout(timer);
      nodes.forEach(function (n) { try { n.stop(); } catch (e) { /* already stopped */ } });
      if (onEnd) onEnd();
    };
  }

  function setMuted(value) {
    muted = !!value;
    localStorage.setItem("nguam.muted", muted ? "1" : "0");
    if (master) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.03);
    document.dispatchEvent(new CustomEvent("nguam:sound", { detail: { muted: muted } }));
  }

  window.NguAmSound = {
    TONES: TONES,
    unlock: unlock,
    ready: ready,
    pluck: pluck,
    bauPhrase: bauPhrase,
    setMuted: setMuted,
    isMuted: function () { return muted; }
  };
})();
