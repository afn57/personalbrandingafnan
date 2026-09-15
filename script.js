/* ════════════════════════════════════════════════
   PERSONAL BRANDING — PROFESSIONAL ELEGANT THEME
   script.js  |  berlaku untuk semua halaman
════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. SUBTLE PARTICLE BACKGROUND
   — Elegant floating particles
═══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const particles = [];
  const PARTICLE_COUNT = 40;
  const COLORS = [
    'rgba(184,134,11,0.1)',
    'rgba(184,134,11,0.05)',
    'rgba(74,122,155,0.06)',
    'rgba(61,139,139,0.05)',
    'rgba(123,107,170,0.04)',
    'rgba(0,0,0,0.03)',
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(184,134,11,${0.025 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  requestAnimationFrame(animate);
})();


/* ══════════════════════════════════════
   2. NAVBAR — hamburger + scroll effect
═══════════════════════════════════════ */
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
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════
   3. SKILL BARS ANIMATION
═══════════════════════════════════════ */
(function () {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;
  setTimeout(() => {
    fills.forEach(fill => {
      fill.style.width = (fill.dataset.level || 0) + '%';
    });
  }, 500);
})();


/* ══════════════════════════════════════
   4. FADE-IN SCROLL ANIMATION
═══════════════════════════════════════ */
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
   5. IMAGE ERROR FALLBACK
═══════════════════════════════════════ */
(function () {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });
})();


/* ══════════════════════════════════════
   6. SMOOTH PAGE SCROLL
═══════════════════════════════════════ */
(function () {
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId.startsWith('#')) return;

      e.preventDefault();

      const target = document.querySelector(targetId);
      if (!target) return;

      const offset = 72;
      const top = target.offsetTop - offset;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    });
  });
})();


/* ══════════════════════════════════════
   7. PAGE TRANSITION (SECTION REVEAL)
═══════════════════════════════════════ */
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
