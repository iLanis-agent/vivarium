'use strict';
/* global Vivarium */
(function () {
  const $ = (id) => document.getElementById(id);
  const presets = [
    { n: 'Nano 30x20x20', d: [30, 20, 20] },
    { n: 'Cube 45', d: [45, 45, 45] },
    { n: 'Dart 60x45x60', d: [60, 45, 60] },
    { n: 'Wide 90x45x45', d: [90, 45, 45] }
  ];
  const prow = $('presets');
  presets.forEach((p) => {
    const b = document.createElement('button');
    b.textContent = p.n;
    b.addEventListener('click', () => {
      $('len').value = p.d[0]; $('wid').value = p.d[1]; $('hei').value = p.d[2];
      run();
    });
    prow.appendChild(b);
  });

  function esc (v) { return v == null ? 'n/a' : String(v); }

  function run () {
    const L = parseFloat($('len').value), W = parseFloat($('wid').value), H = parseFloat($('hei').value);
    const t = parseFloat($('thick').value);
    const g = Vivarium.glass(L, W, H, t);
    $('glassOut').innerHTML = g === null
      ? '<p>Enter a positive length, width, height and thickness.</p>'
      : '<table><tr><th>Panel</th><th>Area (m2)</th></tr>' +
        [['Bottom', g.panels.bottom], ['Front', g.panels.front], ['Back', g.panels.back],
         ['Left', g.panels.left], ['Right', g.panels.right]]
          .map((r) => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>').join('') +
        '</table><p class="big">Total ' + g.areaM2 + ' m2 of glass, about ' + g.weightKg +
        ' kg at ' + esc(t) + ' mm.</p>';

    const drain = parseFloat($('drain').value), soil = parseFloat($('soil').value);
    const hp = parseFloat($('hard').value) || 0;
    const s = Vivarium.substrate(L, W, drain, soil, hp);
    $('subOut').innerHTML = s === null
      ? '<p>Depths must be zero or more, hardscape between 0 and 90%.</p>'
      : '<p class="big">Drainage layer ' + s.drainLiters + ' L, soil ' + s.soilLiters + ' L' +
        (hp > 0 ? ' after ' + hp + '% hardscape (' + s.soilBeforeHardscape + ' L before)' : '') + '.</p>' +
        '<table><tr><th>ABG-style part</th><th>Liters</th></tr>' +
        s.mix.map((m) => '<tr><td>' + m.part + '</td><td>' + m.liters + '</td></tr>').join('') +
        '</table>';

    const a = Vivarium.air(L, W, H);
    $('airOut').innerHTML = a === null
      ? '<p>Enter a positive length, width and height.</p>'
      : '<p class="big">Air volume ' + a.liters + ' L.</p>' +
        '<p>Misting rule of thumb: wet 2-5% of air volume per session, roughly ' +
        a.mistMinMl + ' to ' + a.mistMaxMl + ' ml.</p>';
  }

  ['len', 'wid', 'hei', 'thick', 'drain', 'soil', 'hard'].forEach((id) =>
    $(id).addEventListener('input', run));
  run();
})();
