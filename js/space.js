// Latar luar angkasa: bintang berkelip + komet (dengan jeda antar komet)
(() => {
  const c = document.getElementById('space'), x = c.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W, H, S = [], C = [], next = 1500;
  function size() {
    W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    S = Array.from({ length: Math.round(W * H / 5500) }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .4,
      p: Math.random() * 6.28, s: Math.random() * 1.4 + .5 }));
  }
  size(); addEventListener('resize', size);
  const comet = () => C.push({ x: Math.random() * W * 1.1, y: -20, vx: -(Math.random() * 2 + 2.4),
    vy: Math.random() * 2 + 3.2, l: Math.random() * 90 + 90 });
  function frame(t) {
    requestAnimationFrame(frame);
    x.clearRect(0, 0, W, H);
    x.fillStyle = '#dff6ff';
    for (const s of S) { x.globalAlpha = .3 + .7 * Math.abs(Math.sin(t / 1000 * s.s + s.p)); x.fillRect(s.x, s.y, s.r, s.r); }
    x.globalAlpha = 1;
    if (t > next) { comet(); if (Math.random() < .45) setTimeout(comet, 300); next = t + 2300 + Math.random() * 2700; }
    for (let i = C.length - 1; i >= 0; i--) {
      const k = C[i]; k.x += k.vx; k.y += k.vy;
      const m = Math.hypot(k.vx, k.vy), tx = k.x - k.vx / m * k.l, ty = k.y - k.vy / m * k.l;
      const g = x.createLinearGradient(k.x, k.y, tx, ty);
      g.addColorStop(0, 'rgba(210,246,255,.95)'); g.addColorStop(1, 'rgba(56,200,255,0)');
      x.strokeStyle = g; x.lineWidth = 2; x.beginPath(); x.moveTo(k.x, k.y); x.lineTo(tx, ty); x.stroke();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(k.x, k.y, 2, 0, 6.3); x.fill();
      if (k.y > H + 120 || k.x < -160) C.splice(i, 1);
    }
  }
  requestAnimationFrame(frame);
})();
