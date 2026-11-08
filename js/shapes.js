/* Outline drawings of each instrument, in the same ink line as the rest of the site.
   They show only what the sources describe (body shape, number of strings, how it is
   held), so two look-alike instruments can be told apart at a glance.
   Every drawing sits on a 240 x 120 grid and is coloured by currentColor. */
window.NGUAM_SHAPES = (function () {
  "use strict";

  function strings(n, x1, y1, x2, y2, spread) {
    var out = "";
    for (var k = 0; k < n; k++) {
      var d = (k - (n - 1) / 2) * spread;
      out += '<path class="s-string" d="M' + x1 + " " + (y1 + d) + "L" + x2 + " " + (y2 + d) + '"/>';
    }
    return out;
  }
  function frets(n, x1, x2, y, h) {
    var out = "", step = (x2 - x1) / (n - 1);
    for (var k = 0; k < n; k++) {
      var x = x1 + step * k;
      out += '<path class="s-fret" d="M' + x + " " + (y - h) + "V" + (y + h) + '"/>';
    }
    return out;
  }

  var shapes = {
    // one string, a long box, a flexible rod rising at one end with a gourd on it
    "dan-bau":
      '<rect class="s-body" x="22" y="70" width="196" height="22" rx="5"/>' +
      '<path class="s-line thick" d="M40 70C38 52 34 34 26 16"/>' +
      '<ellipse class="s-body" cx="37" cy="50" rx="9" ry="7"/>' +
      '<path class="s-string" d="M39 63L206 63"/>' +
      '<path class="s-line" d="M206 70V60"/>' +
      '<circle class="s-dot" cx="206" cy="63" r="2.6"/>',

    // long flat box, many strings over a diagonal row of small bridges
    "dan-tranh": (function () {
      // the box seen at a slant: wide, low end on the left, narrow end on the right
      var out = '<path class="s-body" d="M12 66L228 40Q234 40 234 46L234 72Q234 77 228 77L12 95Q6 95 6 89L6 72Q6 66 12 66Z"/>';
      function yAt(t, x) { var yl = 70 + t * 21, yr = 44 + t * 28; return yl + (yr - yl) * (x - 14) / 212; }
      for (var k = 0; k < 16; k++) {
        var t = k / 15;
        out += '<path class="s-string thin" d="M14 ' + yAt(t, 14).toFixed(1) + "L226 " + yAt(t, 226).toFixed(1) + '"/>';
        var bx = 56 + k * 10, by = yAt(t, bx);
        out += '<path class="s-fret" d="M' + (bx - 3.4).toFixed(1) + " " + (by + 2.4).toFixed(1) + "L" + bx.toFixed(1) + " " + (by - 3.4).toFixed(1) + "L" + (bx + 3.4).toFixed(1) + " " + (by + 2.4).toFixed(1) + '"/>';
      }
      return out;
    })(),

    // round moon body, long neck with high frets, two strings
    "dan-nguyet":
      '<circle class="s-body" cx="58" cy="62" r="40"/>' +
      '<rect class="s-body" x="96" y="56" width="112" height="12" rx="3"/>' +
      '<path class="s-body" d="M208 54L230 48L232 58L208 70Z"/>' +
      frets(9, 112, 200, 62, 8) +
      strings(2, 34, 62, 222, 58, 3) +
      '<path class="s-line" d="M216 44V40M224 42V38M218 74V78"/>',

    // pear-shaped body, short neck, four strings
    "dan-ty-ba":
      '<path class="s-body" d="M28 62C28 30 64 22 104 38C132 49 150 56 160 62C150 68 132 75 104 86C64 102 28 94 28 62Z"/>' +
      '<rect class="s-body" x="158" y="57" width="44" height="10" rx="3"/>' +
      '<path class="s-body" d="M202 55C214 52 222 46 226 40L232 44C228 54 218 64 202 69Z"/>' +
      frets(4, 166, 196, 62, 7) + frets(4, 104, 146, 62, 9).replace(/s-fret/g, "s-fret faint") +
      strings(4, 44, 62, 214, 60, 2.6),

    // a bamboo tube with a blowing hole and finger holes, held sideways
    "sao-truc": (function () {
      var out = '<rect class="s-body" x="14" y="54" width="212" height="14" rx="7"/>' +
        '<path class="s-line" d="M40 54V68M200 54V68"/>' +
        '<ellipse class="s-hole" cx="58" cy="61" rx="4" ry="3"/>';
      for (var k = 0; k < 6; k++) out += '<circle class="s-hole" cx="' + (118 + k * 14) + '" cy="61" r="2.8"/>';
      return out;
    })(),

    // small sound box, long thin neck, two strings, played with a bow
    "dan-nhi":
      '<rect class="s-body" x="96" y="92" width="38" height="20" rx="4"/>' +
      '<path class="s-line" d="M134 102H140"/>' +
      '<path class="s-line thick" d="M112 92V8"/>' +
      '<path class="s-line" d="M106 16H100M106 26H100"/>' +
      '<path class="s-string" d="M116 12V94M120 12V94"/>' +
      '<path class="s-bow" d="M40 70Q120 58 214 72"/>' +
      '<path class="s-line" d="M40 70L36 76M214 72L218 78"/>',

    // trapezoid body with no back, very long neck with ten frets, three strings
    "dan-day":
      '<path class="s-body" d="M14 40L64 50L64 76L14 86Z"/>' +
      '<rect class="s-body" x="64" y="58" width="150" height="10" rx="3"/>' +
      '<path class="s-body" d="M214 56L232 50L234 60L214 70Z"/>' +
      frets(10, 84, 206, 63, 7) +
      strings(3, 22, 63, 226, 60, 2.6),

    // barrel drum, a head at each end
    "trong-com": (function () {
      var out = '<path class="s-body" d="M44 34C100 20 140 20 196 34L196 86C140 100 100 100 44 86Z"/>' +
        '<ellipse class="s-body" cx="44" cy="60" rx="12" ry="26"/>' +
        '<ellipse class="s-body" cx="196" cy="60" rx="12" ry="26"/>';
      for (var k = 0; k < 7; k++) {
        var x = 64 + k * 19;
        out += '<path class="s-line faint" d="M' + x + " " + (34 - Math.sin((k + 1) / 8 * Math.PI) * 9).toFixed(1) + "L" + (x + 19) + " " + (86 + Math.sin((k + 1.5) / 8 * Math.PI) * 9).toFixed(1) + '"/>';
      }
      return out;
    })(),

    // a row of bamboo tubes, longest to shortest, struck
    "dan-trung": (function () {
      var out = '<path class="s-line faint" d="M20 26L224 46M20 98L224 82"/>';
      for (var k = 0; k < 12; k++) {
        var x = 28 + k * 16, top = 28 + k * 1.6, bottom = 98 - k * 1.5 - k * 0.9;
        out += '<rect class="s-body" x="' + x + '" y="' + top.toFixed(1) + '" width="10" height="' + (bottom - top).toFixed(1) + '" rx="5"/>';
      }
      return out;
    })(),

    // bamboo tubes of different lengths, open ends towards the player, sounded by clapping
    "klong-put": (function () {
      var out = "";
      for (var k = 0; k < 6; k++) {
        var y = 26 + k * 13, len = 176 - k * 18;
        out += '<rect class="s-body" x="' + (222 - len) + '" y="' + y + '" width="' + len + '" height="10" rx="5"/>' +
          '<ellipse class="s-hole" cx="' + (226 - len) + '" cy="' + (y + 5) + '" rx="2.5" ry="4"/>';
      }
      out += '<path class="s-air" d="M18 46Q10 52 18 58M26 40Q14 52 26 64"/>';
      return out;
    })()
  };

  return {
    // An outline drawing as inline SVG. The label describes what the drawing shows.
    svg: function (id, label) {
      if (!shapes[id]) return "";
      return '<svg class="shape" viewBox="0 0 240 120" role="img" aria-label="' + label + '">' + shapes[id] + "</svg>";
    },
    has: function (id) { return !!shapes[id]; }
  };
})();
