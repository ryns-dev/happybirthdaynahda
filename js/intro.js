// Loading -> hujan huruf biru neon -> hitung mundur 3 2 1 -> teks dot-matrix -> love
(() => {
  const $ = id => document.getElementById(id), wait = ms => new Promise(r => setTimeout(r, ms));
  const rain = $('rain'), dots = $('dots'), rc = rain.getContext('2d'), dc = dots.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2), FS = 16, L = CFG.rainLetters;
  let W, H, cols, drops, run = false, STEP = 6, P = [], T0 = 0, DUR = 1, done = null, last = 0;

  function size() {
    W = innerWidth; H = innerHeight;
    for (const c of [rain, dots]) { c.width = W * dpr; c.height = H * dpr; }
    rc.setTransform(dpr, 0, 0, dpr, 0, 0); dc.setTransform(dpr, 0, 0, dpr, 0, 0);
    rc.fillStyle = '#02040c'; rc.fillRect(0, 0, W, H);
    cols = Math.ceil(W / FS); drops = Array.from({ length: cols }, () => -Math.random() * 40);
    STEP = Math.max(5, Math.round(W / 64));
  }
  size(); addEventListener('resize', size);

  function rainLoop(t) {
    if (!run) return; requestAnimationFrame(rainLoop);
    if (t - last < 48) return; last = t;
    rc.fillStyle = 'rgba(2,4,12,.17)'; rc.fillRect(0, 0, W, H);
    rc.font = '700 ' + FS + 'px "Courier New",monospace';
    for (let i = 0; i < cols; i++) {
      const y = drops[i] * FS; if (y < 0) { drops[i]++; continue; }
      rc.fillStyle = 'rgba(56,200,255,.6)'; rc.fillText(L[(Math.random() * L.length) | 0], i * FS, y - FS);
      rc.fillStyle = 'rgba(205,245,255,.95)'; rc.fillText(L[(Math.random() * L.length) | 0], i * FS, y);
      if (y > H && Math.random() > .975) drops[i] = 0; else drops[i]++;
    }
  }

  // ambil titik dari bentuk yang digambar, lalu jadikan partikel
  function build(fn) {
    const o = document.createElement('canvas'); o.width = W; o.height = H;
    const c = o.getContext('2d'); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; fn(c);
    const d = c.getImageData(0, 0, W, H).data, a = [];
    for (let y = 0; y < H; y += STEP) for (let x = 0; x < W; x += STEP) if (d[(y * W + x) * 4 + 3] > 128)
      a.push({ tx: x, ty: y, sx: x + (Math.random() - .5) * W * .7, sy: y + (Math.random() - .5) * H * .5,
        ex: x + (Math.random() - .5) * W * .4, ey: y + (Math.random() - .5) * H * .4, d: Math.random() * .15 });
    return a;
  }
  const E = u => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3);
  function frame(now) {
    requestAnimationFrame(frame); if (!P.length) return;
    const p = (now - T0) / DUR;
    if (p >= 1) { P = []; dc.clearRect(0, 0, W, H); done && done(); return; }
    dc.clearRect(0, 0, W, H);
    const o = E((p - .78) / .22), al = Math.min(1, p / .12) * (1 - o), r = STEP * .42;
    for (let pass = 0; pass < 2; pass++) {           // pass 0 = glow, pass 1 = titik utama
      dc.globalAlpha = pass ? al : al * .2; dc.fillStyle = pass ? '#9be9ff' : '#38c8ff';
      const R = pass ? r : r * 2.2; dc.beginPath();
      for (const q of P) {
        const e = E((p - q.d) / .3);
        const x = q.sx + (q.tx - q.sx) * e + (q.ex - q.tx) * o, y = q.sy + (q.ty - q.sy) * e + (q.ey - q.ty) * o;
        dc.moveTo(x + R, y); dc.arc(x, y, R, 0, 6.283);
      }
      dc.fill();
    }
  }
  requestAnimationFrame(frame);
  const show = (fn, ms) => new Promise(r => { P = build(fn); T0 = performance.now(); DUR = ms; done = r; });
  const F = '900 100px Poppins,"Arial Black",sans-serif';
  const word = (s, cap) => c => {
    c.font = F; const w = c.measureText(s).width, fs = Math.min(100 * W * .86 / w, cap);
    c.font = F.replace('100px', fs + 'px'); c.fillText(s, W / 2, H / 2);
  };
  const heart = c => {
    const s = Math.min(W * .021, H * .02); c.beginPath();
    for (let t = 0; t <= 6.29; t += .03) {
      const x = 16 * Math.sin(t) ** 3, y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const px = W / 2 + x * s, py = H / 2 + (y - 2.5) * s; t ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.fill();
  };

  (async () => {
    await Promise.race([Promise.all([document.fonts.load('900 100px Poppins'), wait(2400)]), wait(4500)]);
    $('loader').classList.add('gone'); run = true; rain.classList.add('on'); requestAnimationFrame(rainLoop);
    await wait(1400);
    for (const n of ['3', '2', '1']) await show(word(n, W * .7), 950);
    for (const w of CFG.words) await show(word(w, W * .3), 1250);
    await show(heart, 1600);
    run = false; Story.start();
  })();
})();
