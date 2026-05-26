/* ════════════════════════════════════════════════
   PERSONAL BRANDING — PAC-MAN ARCADE THEME
   script.js  |  berlaku untuk semua halaman
════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. PAC-MAN CANVAS BACKGROUND
   — Delta-time based, 60fps target, smooth
══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Konfigurasi ── */
  const CELL       = 30;
  const PAC_SPEED  = 90;   /* pixel per detik */
  const GHOST_SPDS = [55, 45, 65];
  const MOUTH_SPD  = 2.2;  /* radian per detik */
  const MOUTH_MAX  = 0.38;
  const MOUTH_MIN  = 0.03;
  const TAU        = Math.PI * 2;
  const DIR_ANGLES = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; /* up right down left */

  const COLORS = {
    pacman : '#f5d800',
    ghosts : ['#ff2d78', '#00e5ff', '#ff8c00'],
    dot    : '#f5d800',
    bigDot : '#f5d800',
    wall   : 'rgba(26,26,80,0.45)',
    glow   : { pacman:'rgba(245,216,0,0.6)', g0:'rgba(255,45,120,0.5)', g1:'rgba(0,229,255,0.5)', g2:'rgba(255,140,0,0.5)' },
  };

  let W, H, cols, rows;
  let lastTime = null;

  /* Pac-Man state */
  const pac = { x:0, y:0, dir:1, mouth:0.2, mouthDir:1, changeCooldown:0 };

  /* Ghost state */
  const ghosts = [
    { x:0, y:0, vx:0, vy:0, color:COLORS.ghosts[0], glowColor:COLORS.glow.g0 },
    { x:0, y:0, vx:0, vy:0, color:COLORS.ghosts[1], glowColor:COLORS.glow.g1 },
    { x:0, y:0, vx:0, vy:0, color:COLORS.ghosts[2], glowColor:COLORS.glow.g2 },
  ];

  /* Pre-computed dot positions */
  let dots = [];

  /* Off-screen canvas for static grid (redrawn only on resize) */
  const offscreen = document.createElement('canvas');
  const offCtx    = offscreen.getContext('2d');

  /* ── Init / Resize ── */
  function resize() {
    W = canvas.width = offscreen.width = window.innerWidth;
    H = canvas.height = offscreen.height = window.innerHeight;
    cols = Math.ceil(W / CELL) + 2;
    rows = Math.ceil(H / CELL) + 2;
    buildStatic();
    initEntities();
  }

  function buildStatic() {
    /* Background gradient */
    const grad = offCtx.createRadialGradient(W/2,H/2,0, W/2,H/2, Math.max(W,H)*0.72);
    grad.addColorStop(0, '#09092e');
    grad.addColorStop(1, '#020210');
    offCtx.fillStyle = grad;
    offCtx.fillRect(0, 0, W, H);

    /* Faint maze grid */
    offCtx.strokeStyle = COLORS.wall;
    offCtx.lineWidth   = 1;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if ((c + r) % 7 === 0) {
          offCtx.strokeRect(c * CELL + 3, r * CELL + 3, CELL - 6, CELL - 6);
        }
      }
    }

    /* Pre-compute dot positions */
    dots = [];
    for (let c = 1; c < cols - 1; c++) {
      for (let r = 1; r < rows - 1; r++) {
        const sum = c + r;
        if (sum % 3 === 0) {
          dots.push({
            x   : c * CELL + CELL / 2,
            y   : r * CELL + CELL / 2,
            big : sum % 9 === 0,
          });
        }
      }
    }
  }

  function initEntities() {
    pac.x = CELL * 2.5;
    pac.y = CELL * 3.5;
    pac.dir = 1;
    pac.mouth = 0.2;
    pac.mouthDir = 1;
    pac.changeCooldown = 0;

    const speeds = GHOST_SPDS;
    const positions = [
      [W * 0.30, H * 0.25],
      [W * 0.62, H * 0.55],
      [W * 0.80, H * 0.72],
    ];
    const angles = [0.45, 2.1, -0.8];

    ghosts.forEach((g, i) => {
      g.x  = positions[i][0];
      g.y  = positions[i][1];
      g.vx = Math.cos(angles[i]) * speeds[i];
      g.vy = Math.sin(angles[i]) * speeds[i];
    });
  }

  /* ── Update (delta-time) ── */
  function update(dt) {
    /* Clamp dt to avoid spiral of death on tab-switch */
    const d = Math.min(dt, 0.05);

    /* Pac-Man movement */
    const spd = PAC_SPEED * d;
    if (pac.dir === 0) pac.y -= spd;
    if (pac.dir === 1) pac.x += spd;
    if (pac.dir === 2) pac.y += spd;
    if (pac.dir === 3) pac.x -= spd;

    /* Wrap */
    if (pac.x >  W + CELL) pac.x = -CELL;
    if (pac.x < -CELL)     pac.x =  W + CELL;
    if (pac.y >  H + CELL) pac.y = -CELL;
    if (pac.y < -CELL)     pac.y =  H + CELL;

    /* Smooth direction change on a cooldown */
    pac.changeCooldown -= d;
    if (pac.changeCooldown <= 0) {
      pac.dir = Math.floor(Math.random() * 4);
      pac.changeCooldown = 2.5 + Math.random() * 2;
    }

    /* Mouth — smooth sine-like oscillation */
    pac.mouth += MOUTH_SPD * pac.mouthDir * d;
    if (pac.mouth >= MOUTH_MAX) { pac.mouth = MOUTH_MAX; pac.mouthDir = -1; }
    if (pac.mouth <= MOUTH_MIN) { pac.mouth = MOUTH_MIN; pac.mouthDir =  1; }

    /* Ghosts */
    ghosts.forEach(g => {
      g.x += g.vx * d;
      g.y += g.vy * d;
      /* Bounce off edges */
      if (g.x < -CELL || g.x > W + CELL) { g.vx *= -1; g.x = Math.max(-CELL, Math.min(W + CELL, g.x)); }
      if (g.y < -CELL || g.y > H + CELL) { g.vy *= -1; g.y = Math.max(-CELL, Math.min(H + CELL, g.y)); }
    });
  }

  /* ── Draw helpers ── */
  function drawDots() {
    /* Draw all dots in one batch per size — fewer state changes */
    ctx.save();
    ctx.shadowBlur  = 6;
    ctx.shadowColor = COLORS.dot;
    ctx.fillStyle   = COLORS.dot;

    const small = new Path2D();
    const big   = new Path2D();
    dots.forEach(dot => {
      const r = dot.big ? 4.5 : 2;
      const p = dot.big ? big : small;
      p.moveTo(dot.x + r, dot.y);
      p.arc(dot.x, dot.y, r, 0, TAU);
    });
    ctx.fill(small);
    ctx.shadowBlur = 10;
    ctx.fill(big);
    ctx.restore();
  }

  function drawPacman() {
    const angle  = DIR_ANGLES[pac.dir];
    const radius = CELL * 0.44;

    ctx.save();
    ctx.shadowColor = COLORS.glow.pacman;
    ctx.shadowBlur  = 22;
    ctx.fillStyle   = COLORS.pacman;
    ctx.beginPath();
    ctx.moveTo(pac.x, pac.y);
    ctx.arc(pac.x, pac.y, radius, angle + pac.mouth, angle + TAU - pac.mouth);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawGhost(g) {
    const r = CELL * 0.42;
    const x = g.x;
    const y = g.y;

    ctx.save();
    ctx.shadowColor = g.glowColor;
    ctx.shadowBlur  = 20;
    ctx.fillStyle   = g.color;

    /* Body */
    ctx.beginPath();
    ctx.arc(x, y - r * 0.28, r, Math.PI, 0, false);
    ctx.lineTo(x + r, y + r * 0.9);

    /* Wavy skirt — 3 bumps */
    const segW = (r * 2) / 3;
    for (let i = 0; i < 3; i++) {
      const cx = x + r - segW * i - segW * 0.5;
      const ex = x + r - segW * (i + 1);
      ctx.quadraticCurveTo(cx, y + r * 1.38, ex, y + r * 0.9);
    }
    ctx.closePath();
    ctx.fill();

    /* Eyes */
    ctx.shadowBlur = 0;
    ctx.fillStyle  = '#fff';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.30, y - r * 0.30, r * 0.22, r * 0.26, 0, 0, TAU);
    ctx.ellipse(x + r * 0.30, y - r * 0.30, r * 0.22, r * 0.26, 0, 0, TAU);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x - r * 0.22, y - r * 0.26, r * 0.11, 0, TAU);
    ctx.arc(x + r * 0.38, y - r * 0.26, r * 0.11, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  /* ── Main loop ── */
  function loop(timestamp) {
    if (lastTime === null) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt);

    /* Blit static background */
    ctx.drawImage(offscreen, 0, 0);

    /* Dynamic elements */
    drawDots();
    ghosts.forEach(drawGhost);
    drawPacman();

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
})();


/* ══════════════════════════════════════
   2. NAVBAR — hamburger + scroll shadow
══════════════════════════════════════ */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navbar    = document.getElementById('navbar');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 24px rgba(0,0,0,0.55)'
        : 'none';
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════
   3. SKILL BARS ANIMATION
══════════════════════════════════════ */
(function () {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;
  /* Sedikit delay supaya transisi CSS terlihat saat halaman muncul */
  setTimeout(() => {
    fills.forEach(fill => {
      fill.style.width = (fill.dataset.level || 0) + '%';
    });
  }, 400);
})();


/* ══════════════════════════════════════
   4. FADE-IN SCROLL ANIMATION
══════════════════════════════════════ */
(function () {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  els.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════
   5. FALLBACK GAMBAR ERROR
══════════════════════════════════════ */
(function () {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });
})();

/* ══════════════════════════════════════
   SMOOTH PAGE SCROLL (IMPROVED)
══════════════════════════════════════ */
(function () {
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId.startsWith('#')) return;

      e.preventDefault();

      const target = document.querySelector(targetId);
      if (!target) return;

      const offset = 70; // tinggi navbar
      const top = target.offsetTop - offset;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    });
  });
})();

/* ══════════════════════════════════════
   PAGE TRANSITION (SECTION REVEAL)
══════════════════════════════════════ */
(function () {
  const pages = document.querySelectorAll('.page');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.05 });

  pages.forEach(p => observer.observe(p));
})();

