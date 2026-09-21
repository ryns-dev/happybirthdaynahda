// Beruang -> buku foto -> love foto + lagu -> kotak kaca -> pesan
(() => {
  const $ = id => document.getElementById(id), wait = ms => new Promise(r => setTimeout(r, ms));
  const PAL = ['#ffd60a', '#5ac8fa', '#ff9f6e', '#a78bfa', '#7dffb2'];

  // ---------- foto (kalau file belum ada, muncul placeholder) ----------
  const ph = i => 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2b4d"/><stop offset="1" stop-color="#2a8fbf"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><text x="150" y="205" font-size="70" text-anchor="middle">🧸</text><text x="150" y="270" font-size="22" fill="#cdf3ff" text-anchor="middle" font-family="sans-serif">foto-${i + 1}.jpg</text></svg>`);
  const img = (i, cls = '') => {
    const e = new Image(); e.src = CFG.photos[i]; e.className = cls; e.draggable = false;
    e.onerror = () => { e.onerror = null; e.src = ph(i); }; return e;
  };
  const MINI = `<svg class="mini" viewBox="0 0 40 40"><circle cx="9" cy="9" r="6.5" fill="#8a5a3c"/><circle cx="31" cy="9" r="6.5" fill="#8a5a3c"/><circle cx="20" cy="22" r="15" fill="#9c6a48"/><ellipse cx="20" cy="27" rx="7" ry="5.5" fill="#f0d6b0"/><circle cx="20" cy="25" r="2" fill="#3a2418"/><circle cx="14" cy="19" r="1.7" fill="#3a2418"/><circle cx="26" cy="19" r="1.7" fill="#3a2418"/></svg>`;

  // ---------- audio: link mp3 (CFG.songUrl) atau melodi bawaan ----------
  let ctx, aud;
  const N = { G: 392, A: 440, B: 493.88, C: 523.25, D: 587.33, E: 659.25, F: 698.46, H: 783.99 };
  const SEQ = 'G.75 G.25 A1 G1 C1 B2 G.75 G.25 A1 G1 D1 C2 G.75 G.25 H1 E1 C1 B1 A1 F.75 F.25 E1 C1 D1 C2'.split(' ');
  function synth() {
    let t = ctx.currentTime + .2; const B = .6, t0 = ctx.currentTime;
    for (const s of SEQ) {
      const f = N[s[0]], d = parseFloat(s.slice(1)) * B;
      [1, 2].forEach(k => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = k > 1 ? 'sine' : 'triangle'; o.frequency.value = f * k;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(k > 1 ? .05 : .16, t + .02);
        g.gain.exponentialRampToValueAtTime(.001, t + d * 1.6);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + d * 1.7);
      });
      t += d;
    }
    return (t - t0) * 1000;
  }
  function unlock() { // dipanggil saat user mengetuk buku (izin autoplay browser)
    try {
      if (CFG.songUrl) {
        aud = new Audio(CFG.songUrl); aud.preload = 'auto'; aud.muted = true;
        aud.play().then(() => { aud.pause(); aud.currentTime = 0; aud.muted = false; }).catch(() => { aud.muted = false; });
      } else { ctx = new (window.AudioContext || window.webkitAudioContext)(); ctx.resume(); }
    } catch (e) {}
  }
  const playSong = () => new Promise(res => {
    let ok = false; const fin = () => { if (!ok) { ok = true; res(); } };
    try {
      if (aud) { aud.onended = fin; aud.onerror = () => setTimeout(fin, 12000); aud.play().catch(() => setTimeout(fin, 12000)); }
      else if (ctx) setTimeout(fin, synth() + 700);
      else setTimeout(fin, 12000);
    } catch (e) { setTimeout(fin, 12000); }
  });

  // ---------- 1. beruang main gitar ----------
  const BEAR = `<svg class="bearsvg" viewBox="0 0 200 240"><g class="bob">
<ellipse cx="100" cy="172" rx="46" ry="44" fill="#8a5a3c"/><ellipse cx="100" cy="180" rx="27" ry="27" fill="#ecd0a6"/>
<g transform="rotate(-28 100 192)"><rect x="95" y="92" width="10" height="82" rx="3" fill="#6b3f1d"/><rect x="92" y="82" width="16" height="14" rx="3" fill="#4a2a12"/><ellipse cx="100" cy="192" rx="36" ry="30" fill="#e8a33d"/><circle cx="100" cy="192" r="9" fill="#3a2418"/></g>
<path d="M60 154 L75 132" stroke="#8a5a3c" stroke-width="16" stroke-linecap="round"/>
<g class="strum"><path d="M140 154 L110 190" stroke="#8a5a3c" stroke-width="16" stroke-linecap="round"/></g>
<circle cx="58" cy="76" r="17" fill="#8a5a3c"/><circle cx="58" cy="76" r="9" fill="#ecd0a6"/><circle cx="142" cy="76" r="17" fill="#8a5a3c"/><circle cx="142" cy="76" r="9" fill="#ecd0a6"/>
<circle cx="100" cy="102" r="47" fill="#9c6a48"/><ellipse cx="100" cy="118" rx="22" ry="17" fill="#f0d6b0"/><ellipse cx="100" cy="111" rx="7" ry="5" fill="#3a2418"/>
<path d="M74 98q7-9 14 0M112 98q7-9 14 0M92 124q8 8 16 0" stroke="#3a2418" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<circle cx="68" cy="114" r="7" fill="#f7a9a8" opacity=".6"/><circle cx="132" cy="114" r="7" fill="#f7a9a8" opacity=".6"/>
<path d="M78 64L100 20L122 64Z" fill="#38c8ff"/><path d="M86 48h28M82 58h36" stroke="#fff" stroke-width="3" opacity=".7"/><circle cx="100" cy="18" r="7" fill="#ffd60a"/></g>
<text class="nf" x="150" y="130">♪</text><text class="nf" x="30" y="110" style="animation-delay:1.2s">♫</text></svg>`;
  async function bearScene() {
    const b = $('bear');
    b.innerHTML = ['HAPPY', 'BIRTHDAY'].map((w, r) => `<div class="hbd">${[...w].map((c, i) =>
      `<span style="--i:${i + r * 5};color:${PAL[(i + r * 2) % 5]}">${c}</span>`).join('')}</div>`).join('') + BEAR;
    b.classList.add('show'); await wait(3600); b.classList.remove('show'); await wait(900);
  }

  // ---------- 2. buku: 6 halaman x 2 foto ----------
  async function bookScene() {
    const st = $('stage'), n = 6;
    st.innerHTML = `<div class="note" id="note">${MINI}<span class="tx"></span><i class="ht">🩵</i></div><div class="book" id="book"></div><div class="hint" id="hint">Ketuk buku untuk membuka 📖</div>`;
    const book = $('book'), note = $('note'), hint = $('hint'), L = [];
    const face = (c, el) => { const d = document.createElement('div'); d.className = 'face ' + c; d.appendChild(el); return d; };
    const cover = () => { const d = document.createElement('div'); d.className = 'cover'; d.innerHTML = MINI + '<h2>Untuk Nahda</h2><small>🤍</small>'; return d; };
    const last = document.createElement('div'); last.className = 'leaf'; last.style.zIndex = 0; last.append(face('front', img(11))); book.append(last);
    for (let i = 0; i < n; i++) {
      const lf = document.createElement('div'); lf.className = 'leaf'; lf.style.zIndex = n - i + 1;
      lf.append(face('front', i ? img(2 * i - 1) : cover()), face('back', img(2 * i))); book.append(lf); L.push(lf);
    }
    const flip = (i, on) => {
      const l = L[i];
      if (on) { l.style.zIndex = 20 + i; l.classList.add('flip'); }
      else { l.classList.remove('flip'); setTimeout(() => l.style.zIndex = n - i + 1, 550); }
    };
    const say = t => { note.classList.add('out'); setTimeout(() => { note.querySelector('.tx').textContent = t; note.classList.remove('out'); }, 260); };
    let skip = () => {}, busy = false;
    const pause = ms => new Promise(r => { skip = r; setTimeout(r, ms); });

    st.classList.add('show');
    await new Promise(r => book.addEventListener('click', r, { once: true }));
    unlock(); hint.classList.add('hide');
    book.classList.add('open'); flip(0, true); note.classList.add('in'); say(CFG.notes[0]);
    busy = true; book.onclick = () => { if (!busy) skip(); }; await wait(1100); busy = false;
    for (let s = 1; s < n; s++) {
      await pause(4300); busy = true; flip(s, true); say(CFG.notes[s]); await wait(1100); busy = false;
    }
    await pause(4300); busy = true;
    note.classList.remove('in');
    for (let i = n - 1; i >= 0; i--) { flip(i, false); await wait(150); }
    await wait(900); book.classList.remove('open'); await wait(1300);
    st.classList.remove('show'); await wait(900);
  }

  // ---------- 3. love foto + lagu + kotak kaca + pesan ----------
  async function finale() {
    const f = $('finale'), n = 30;
    f.innerHTML = `<div class="heartbox" id="hbox"><div class="hb" id="hb"></div></div><div class="glass" id="gl"><p class="wt">Tunggu lagu nya selesai yaa🤍</p><button class="gbtn" id="gb">klik aku &gt;&lt;</button></div>`;
    const hb = $('hb');
    for (let i = 0; i < n; i++) {
      const t = Math.PI + i * 2 * Math.PI / n, x = 16 * Math.sin(t) ** 3;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const e = img(i % 12, 'pc');
      e.style.cssText = `--x:${50 + x * 2.5}%;--y:${44 + y * 2.7}%;--r:${(i * 37 % 29) - 14}deg;--i:${i}`; hb.append(e);
    }
    f.classList.add('show');
    const song = playSong();
    await wait(n * 55 + 900);
    $('hbox').classList.add('up'); $('gl').classList.add('in');
    await song; await wait(400);
    const gb = $('gb'); gb.classList.add('in');
    await new Promise(r => gb.addEventListener('click', r, { once: true }));
    const gl = $('gl'); gl.classList.add('fade'); await wait(350);
    gl.innerHTML = '<div class="msg">' + CFG.message.map((t, i) => `<p style="--i:${i}">${t}</p>`).join('') + '</div>';
    gl.classList.remove('fade'); gl.classList.add('big'); $('hbox').classList.replace('up', 'dim');
  }

  window.Story = { async start() {
    $('rain').classList.remove('on');
    await bearScene(); await bookScene(); await finale();
  } };
})();
