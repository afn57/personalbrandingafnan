/* ════════════════════════════════════════════════
   PERSONAL BRANDING — PROFESSIONAL ELEGANT THEME
   script.js  |  applies to all pages
   Source language: ENGLISH (translate to ID)
════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. SUBTLE PARTICLE BACKGROUND
   — Elegant floating particles
══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const particles = [];
  const PARTICLE_COUNT = 40;

  const PALETTES = {
    light: [
      'rgba(184,134,11,0.1)',
      'rgba(184,134,11,0.05)',
      'rgba(74,122,155,0.06)',
      'rgba(61,139,139,0.05)',
      'rgba(123,107,170,0.04)',
      'rgba(0,0,0,0.03)',
    ],
    dark: [
      'rgba(212,168,67,0.18)',
      'rgba(212,168,67,0.10)',
      'rgba(138,184,216,0.10)',
      'rgba(126,200,200,0.09)',
      'rgba(176,160,216,0.08)',
      'rgba(255,255,255,0.06)',
    ],
  };
  const CONN_RGB = { light: '184,134,11', dark: '212,168,67' };

  let palette = PALETTES.light;
  let connRgb = CONN_RGB.light;

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyPalette() {
    const t = currentTheme();
    palette = PALETTES[t];
    connRgb = CONN_RGB[t];
    particles.forEach(p => {
      p.color = palette[Math.floor(Math.random() * palette.length)];
    });
  }

  window.addEventListener('themechange', applyPalette);

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
      color: palette[Math.floor(Math.random() * palette.length)],
      opacity: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    resize();
    palette = PALETTES[currentTheme()];
    connRgb = CONN_RGB[currentTheme()];
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
          ctx.strokeStyle = `rgba(${connRgb},${0.025 * (1 - dist / 150)})`;
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
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════
   3. SKILL BARS ANIMATION
══════════════════════════════════════ */
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
   5. IMAGE ERROR FALLBACK
══════════════════════════════════════ */
(function () {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });
})();


/* ══════════════════════════════════════
   6. SMOOTH PAGE SCROLL
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


/* ══════════════════════════════════════
   8. THEME TOGGLE (LIGHT / DARK)
══════════════════════════════════════ */
(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function readStored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function store(mode) {
    try { localStorage.setItem('theme', mode); } catch (e) {}
  }

  let animTimer = null;

  function setTheme(mode, save) {
    // Smooth transition: briefly enable the animation class on theme switch
    root.classList.add('theme-anim');
    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(() => root.classList.remove('theme-anim'), 750);

    root.setAttribute('data-theme', mode);
    if (save) store(mode);
    window.dispatchEvent(new Event('themechange'));
  }

  if (btn) {
    btn.addEventListener('click', () => {
      setTheme(current() === 'dark' ? 'light' : 'dark', true);
    });
  }

  // Follow system changes only if user has not chosen manually
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = e => {
    if (!readStored()) setTheme(e.matches ? 'dark' : 'light', false);
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange);
})();


/* ══════════════════════════════════════
   9. LANGUAGE TOGGLE (EN ⇄ ID)
   — Static dictionary: key = normalized
     English text (source), value = Indonesian HTML
   — Default language: ENGLISH
══════════════════════════════════════ */
(function () {
  const I18N = {
    /* ── index.html ── */
    'Aspiring Web Developer | Passionate about Technology, Web Development & IoT': 'Calon Web Developer &nbsp;|&nbsp; Tertarik pada Teknologi, Web Development &amp; IoT',
    'I am a passionate student in the world of information technology and web development. I believe that every line of code is a step towards meaningful solutions. Currently, I am continuously learning and growing to become a professional ready to contribute in the workplace.': 'Saya adalah seorang pelajar yang bersemangat dalam dunia teknologi informasi dan pengembangan web. Saya percaya bahwa setiap baris kode adalah langkah menuju solusi yang bermakna. Saat ini saya terus belajar dan berkembang untuk menjadi profesional yang siap berkontribusi di dunia kerja.',
    'View My Work': 'Lihat Karya',
    'View CV': 'Lihat CV',
    'YOUR PHOTO': '<span>FOTO</span> <span>KAMU</span>',

    /* ── about.html ── */
    'FAMILY': 'KELUARGA',
    'EDUCATION': 'PENDIDIKAN',
    'HOBBIES': 'HOBI',
    'INTERESTS': 'MINAT',
    'AMBITIONS': 'CITA-CITA',
    'STRENGTHS': 'KELEBIHAN',
    'I was born in Semarang on August 9, 2008, as the first of two siblings.': 'Saya lahir di Semarang, 9 Agustus 2008 sebagai anak ke-1 dari 2 bersaudara.',
    'My father works in the private sector and my mother is a homemaker.': 'Ayah saya bekerja sebagai pegawai swasta dan ibu saya sebagai ibu rumah tangga.',
    'Family is my greatest motivation to keep growing and achieving.': 'Keluarga adalah motivasi terbesar saya untuk terus berkembang dan berprestasi.',
    '2024 – Present': '2024 – Sekarang',
    'State Vocational High School 7 Semarang': 'SMK NEGERI 7 SEMARANG',
    'Majoring in SIJA (Network and Application Information Systems)': 'Jurusan SIJA (Sistem Informasi Jaringan dan Aplikasi)',
    'State Junior High School 27 Semarang': 'SMP NEGERI 27 SEMARANG',
    'State Elementary School Sumurboto Semarang': 'SD NEGERI SUMURBOTO SEMARANG',
    'Kindergarten PGRI 33 Sumurboto Semarang': 'TK PGRI 33 SUMURBOTO SEMARANG',
    'Design': 'Desain',
    'Cooking': 'Memasak',
    'Music': 'Musik',
    'Foodie': 'Kulineran',
    'Computer Networking': 'Jaringan Komputer',
    'To become a professional Web Developer capable of creating web applications that positively impact society.': 'Menjadi seorang <strong>Web Developer</strong> profesional yang mampu menciptakan aplikasi web yang berdampak positif bagi masyarakat.',
    'I hope to work at a leading technology company and one day build my own startup.': 'Saya berharap dapat bekerja di perusahaan teknologi terkemuka dan suatu hari membangun startup sendiri.',
    'Communicative': 'Komunikatif',
    'Analytical': 'Analitik',
    'Adaptive': 'Adaptif',
    'Highly Curious': 'Keingintahuan Tinggi',

    /* ── skills.html ── */
    'Basic CSS': 'CSS Dasar',
    'Basic JavaScript': 'JavaScript Dasar',
    'Graphic Design (Canva)': 'Desain Grafis (Canva)',
    'Leadership': 'Kepemimpinan',
    'Communication': 'Komunikasi',
    'SCROLL TO SEE ALL': 'SCROLL UNTUK LIHAT SEMUA',

    /* ── portfolio.html ── */
    'PROJECTS': 'PROYEK',
    'COMPETITIONS & SEMINARS': 'LOMBA DAN SEMINAR',
    'CERTIFICATES': 'SERTIFIKAT',
    'VIEW': 'LIHAT',
    'View Work →': 'Lihat Karya →',
    'Competition': 'Lomba',
    'Certificate': 'Sertifikat',
    'Documentation': 'Dokumentasi',
    'Math': 'Matematika',
    'Online Store': 'Toko Online',
    'Social Media Link': 'Link Sosial Media',
    'KIK Project': 'Proyek KIK',
    'Poster Project': 'Projek Poster',
    'Brand Logo Project': 'Projek Brand Logo',
    'Bawanggedon Packaging Design': 'Desain Packaging Bawanggedon',
    'Tugu Muda History Website': 'Web Sejarah Tugu Muda',
    'Reform Era History Website': 'Web Sejarah Reformasi',
    'History Google Site': 'Google Site Sejarah',
    'Inverse Function Website': 'Web Fungsi Invers',
    'KIK Subject Google Site': 'Google Site Matpel KIK',
    'PPKn SWOT Analysis Website': 'Web PPKn Analisis SWOT',
    'THE AFN STUDIO Online Store': 'Toko Online THE AFN STUDIO',
    'Social Media Link (s.id/afn57)': 'Link Sosial Media (s.id/afn57)',
    'Lawphoria USM 2026 Documentation': 'Dokumentasi Lawphoria USM 2026',
    'Cisco Certificate': 'Sertifikat Cisco',
    'Senopati Academy AI Training Certificate': 'Sertifikat Pelatihan AI Senopati Academy',
    'Hours of Code Certificate': 'Sertifikat Hours of Code',
    'DIGIForward 2026 Hackathon Certificate': 'Sertifikat Hackathon DIGIForward 2026',
    'Lawphoria USM 2026 Participant Certificate': 'Sertifikat Peserta Lawphoria USM 2026',
    'Save the Children x RevoU Certificate': 'Sertifikat Save the Children x RevoU',
    'A custom-made goods project with the hope of turning it into a profitable business.': 'Projek pembuatan barang custom dengan harapan menjadi bisnis yang menghasilkan.',
    'A poster project depicting the spirit of the struggle to defend independence.': 'Projek poster yang menggambarkan semangat perjuangan mempertahankan kemerdekaan.',
    'A custom logo project with the hope of turning it into a business.': 'Projek custom logo dengan harapan dapat dijadikan bisnis.',
    'An IoT project: an automatic fish feeder integrated with Blynk.': 'Projek IoT pemberi pakan ikan otomatis yang terintegrasi dengan Blynk.',
    'An IoT project: a smart parking system integrated with Blynk.': 'Projek IoT sistem parkir cerdas yang terintegrasi dengan Blynk.',
    'Bawanggedon box packaging design with the tagline Good Smell Good Taste — from die-cut layout to the finished box mockup.': 'Desain kemasan box Bawanggedon dengan tagline Good Smell Good Taste — dari layout die-cut hingga mockup box jadi.',
    'A website about car history, engines, and futuristic technology.': 'Projek web yang berisi mengenai sejarah mobil, mesin, dan teknologi futuristik.',
    'A Tugu Muda history website that provides information to the public.': 'Web sejarah Tugu Muda yang dapat memberikan informasi kepada masyarakat.',
    'A website that provides information about Javanese culture.': 'Sebuah web yang memberikan informasi mengenai budaya Jawa.',
    'A website presenting the history of presidents within political and economic dynamics.': 'Web yang menampilkan sejarah mengenai presiden dalam dinamika politik dan ekonominya.',
    'A history article about one of the presidents in Indonesia.': 'Artikel sejarah mengenai salah satu presiden di Indonesia.',
    'A learning website for inverse function material.': 'Web pembelajaran materi fungsi invers.',
    'A Google Site for the KIK subject containing home, evaluation & targets, assignment submission, and about me.': 'Google Site mata pelajaran KIK berisi beranda, evaluasi &amp; target, pengumpulan tugas, dan tentang saya.',
    'A PPKn assignment website containing the SWOT analysis "Indonesia in the Global Era" (Group 2).': 'Web tugas PPKn berisi analisis SWOT "Indonesia di Era Global" (Kelompok 2).',
    'An online store for custom products — a creative studio that turns everyday items into personal identity.': 'Toko online produk custom — studio kreasi yang mengubah barang harian menjadi identitas diri.',
    'A personal social media link page — TikTok, Instagram, YouTube, Spotify, WhatsApp, and email in one link.': 'Halaman tautan sosial media pribadi — TikTok, Instagram, YouTube, Spotify, WhatsApp, dan email dalam satu link.',
    'A competition for developing software-based solutions with Cognitive Automation and AI.': 'Lomba pengembangan solusi berbasis software dengan Cognitive Automation dan AI.',
    'Documentation of participation in the Lawphoria USM 2026 event.': 'Dokumentasi keikutsertaan pada acara Lawphoria USM 2026.',
    'A computer networking proficiency certificate from Cisco.': 'Sertifikat keahlian jaringan komputer dari Cisco.',
    'An AI training certificate from the Semarang Regional Police.': 'Sertifikat pelatihan AI dari Kepolisian Daerah Semarang.',
    'Oracle Academy Java Fundamentals training certificate.': 'Sertifikat Pelatihan Java Fundamentals Oracle Academy.',
    'Certificate of completion of the Hours of Code activity.': 'Sertifikat penyelesaian kegiatan Hours of Code.',
    'Certificate for the DIGIForward 2026 Hackathon — photo and link coming soon.': 'Sertifikat lomba Hackathon DIGIForward 2026 — foto dan link menyusul.',
    'Certificate of participation as a participant in Lawphoria USM 2026.': 'Sertifikat keikutsertaan sebagai peserta Lawphoria USM 2026.',
    'Completion certificate for the Digital Skill & AI Training Program by Save the Children Indonesia x RevoU.': 'Sertifikat penyelesaian Digital Skill &amp; AI Training Program dari Save the Children Indonesia x RevoU.',

    /* ── cv.html ── */
    'Print / Save PDF': 'Cetak / Simpan PDF',
    'Contact': 'Kontak',
    '📍 Semarang City, Central Java': '<span class="cvp-ci">📍</span> Kota Semarang, <br> Jawa Tengah',
    'Skills': 'Keahlian',
    'Able to create semantic and well-organized web page structures.': 'Mampu membuat struktur halaman web yang semantik dan terorganisir.',
    'Applying styling, responsive layouts, and simple animations.': 'Menerapkan styling, layout responsif, dan animasi sederhana.',
    'Basic programming logic, DOM manipulation, and user interaction.': 'Logika pemrograman dasar, manipasi DOM, dan interaksi pengguna.',
    'Designing and simulating computer network topologies.': 'Merancang dan mensimulasikan topologi jaringan komputer.',
    'Creating visual content, posters, and presentation materials.': 'Membuat konten visual, poster, dan materi presentasi.',
    'Languages': 'Bahasa',
    'Indonesian': 'Bahasa Indonesia',
    'English': 'Bahasa Inggris',
    'Fluent — native language, spoken and written.': 'Fasih — bahasa ibu, lisan dan tulisan.',
    'Passive — able to read technical documentation.': 'Pasif — mampu membaca dokumentasi teknis.',
    'Aspiring Web Developer & IT Enthusiast': 'Calon Web Developer &amp; IT Enthusiast',
    'Profile Summary': 'Profil Singkat',
    'Vocational high school student majoring in SIJA (Network and Application Information Systems) with a deep interest in web development and computer networking. Accustomed to working independently and in teams with discipline and responsibility, while continuously sharpening technical skills to make a real contribution.': 'Pelajar SMK jurusan SIJA yang tertarik mendalam pada pengembangan web dan jaringan komputer. Terbiasa bekerja mandiri maupun dalam tim dengan disiplin dan tanggung jawab, serta terus mengasah kemampuan teknis untuk memberikan kontribusi nyata.',
    'Personal Data': 'Data Pribadi',
    'Full Name': 'Nama Lengkap',
    'Place, Date of Birth': 'Tempat, Tgl. Lahir',
    'Gender': 'Jenis Kelamin',
    'Address': 'Alamat',
    ': Semarang, August 9, 2008': ': Kota Semarang, 09 Agustus 2008',
    ': Male': ': Laki-laki',
    ': Tanjung Sari VIII Street, RT 001/RW 002, Sumurboto Village, Banyumanik District, Semarang City': ': Jl. Tanjung Sari VIII, RT 001/RW 002, Kel. Sumurboto, Kec. Banyumanik, Kota Semarang',
    'Education': 'Riwayat Pendidikan',
    '2024 –Present': '2024 –<br/>Sekarang',
    'SIJA (Network and Application Information Systems) — Semarang City': 'Jurusan SIJA — Kota Semarang',
    'Semarang City': 'Kota Semarang',
    'State Vocational High School 7': 'SMK Negeri 7',
    'State Junior High School 27': 'SMP Negeri 27',
    'Experience & Organizations': 'Pengalaman &amp; Organisasi',
    '2nd Place, DIGIForward 2026 Hackathon': 'Juara 2 Hackathon DIGIForward 2026',
    'A competition for developing software-based solutions with Cognitive Architecture and AI.': 'Lomba pengembangan solusi berbasis software dengan Cognitive Architecture dan AI.',
    'Student Council (MPK) — Commission A Member': 'Anggota Komisi A',
    'State Vocational High School 7 — Semarang City': 'MPK SMK Negeri 7 — Kota Semarang',
    'Responsible for revising and adjusting school regulations to keep up with the times.': 'Bertanggung jawab merevisi dan menyesuaikan aturan sekolah dengan perkembangan zaman.',
    'Mother Tongue Sprout Festival': 'Festival Tunas Bahasa Ibu',
    'State Junior High School 33 — Semarang City': 'SMP Negeri 33 — Kota Semarang',
    'City-level competition in writing and reading Javanese script.': 'Lomba menulis dan membaca aksara Jawa tingkat kota.'
  };

  const TITLE_SWAP = {
    'Afnan Fauzi Prakoso — Home': 'Afnan Fauzi Prakoso — Beranda'
  };

  const norm = s => (s || '').replace(/\s+/g, ' ').trim();
  const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  const pairs = [];
  document.body.querySelectorAll('*').forEach(el => {
    if (el.closest && el.closest('#langToggle')) return;
    const key = norm(el.textContent);
    if (!key || !has(I18N, key)) return;
    pairs.push({ el: el, key: key, orig: el.innerHTML });
  });
  const targets = pairs.filter(p => !pairs.some(q => q.el !== p.el && p.el.contains(q.el)));

  let lang = 'en';
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'id') lang = saved;
  } catch (e) {}

  const origTitle = document.title;

  function apply(l) {
    targets.forEach(p => {
      p.el.innerHTML = l === 'id' ? I18N[p.key] : p.orig;
    });
    document.documentElement.lang = l;
    if (has(TITLE_SWAP, origTitle)) {
      document.title = l === 'id' ? TITLE_SWAP[origTitle] : origTitle;
    }
    const label = document.getElementById('langLabel');
    if (label) label.textContent = (l === 'id') ? 'EN' : 'ID';
    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.title = (l === 'id') ? 'Switch to English' : 'Ganti ke Bahasa Indonesia';
      btn.setAttribute('aria-label', btn.title);
    }
  }

  apply(lang);

  const toggle = document.getElementById('langToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      lang = (lang === 'id') ? 'en' : 'id';
      try { localStorage.setItem('lang', lang); } catch (e) {}
      apply(lang);
    });
  }
})();


/* ══════════════════════════════════════
   10. PORTFOLIO CAROUSEL (COVERFLOW)
   — Arrows + swipe + dots + keyboard
══════════════════════════════════════ */
(function () {
  const roots = document.querySelectorAll('[data-carousel]');
  if (!roots.length) return;

  roots.forEach(root => {
    const viewport = root.querySelector('.carousel-viewport');
    const track    = root.querySelector('.carousel-track');
    if (!viewport || !track) return;

    const cards  = Array.from(track.children);
    const n      = cards.length;
    if (!n) return;

    const prevBtn = root.querySelector('.carousel-btn.prev');
    const nextBtn = root.querySelector('.carousel-btn.next');
    const dotsWrap = root.querySelector('.carousel-dots');

    let index = 0;
    let step  = 0;

    const dots = cards.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', () => goTo(i));
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function measure() {
      const cs = getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap) || 0;
      // offsetWidth: layout width, unaffected by CSS transforms
      step = cards[0].offsetWidth + gap;
    }

    function layout() {
      measure();
      const cardW = cards[0].offsetWidth;
      const tx = (viewport.clientWidth - cardW) / 2 - index * step;
      track.style.transform = 'translateX(' + tx + 'px)';

      cards.forEach((card, i) => {
        const d  = i - index;
        const ad = Math.abs(d);
        let sc, ty, ry, op, z;
        if (ad === 0)      { sc = 1.06; ty = -10; ry = 0;              op = 1;    z = 5; }
        else if (ad === 1) { sc = 0.86; ty = 0;   ry = d > 0 ? -30 : 30; op = 0.55; z = 4; }
        else if (ad === 2) { sc = 0.76; ty = 0;   ry = d > 0 ? -40 : 40; op = 0.35; z = 3; }
        else               { sc = 0.7;  ty = 0;   ry = 0;              op = 0;    z = 0; }

        card.style.setProperty('--tx', '0px');
        card.style.setProperty('--ty', ty + 'px');
        card.style.setProperty('--sc', sc);
        card.style.setProperty('--ry', ry + 'deg');
        card.style.setProperty('--op', op);
        card.style.setProperty('--z', z);
        card.classList.toggle('is-active', ad === 0);
        card.setAttribute('aria-hidden', ad > 2 ? 'true' : 'false');
        card.style.pointerEvents = ad > 2 ? 'none' : '';
      });

      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === n - 1;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }

    function goTo(i) {
      index = Math.max(0, Math.min(n - 1, i));
      layout();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

    viewport.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')       { e.preventDefault(); goTo(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    let dragging = false, startX = 0, moved = false;
    viewport.addEventListener('pointerdown', e => {
      dragging = true;
      moved = false;
      startX = e.clientX;
    });
    viewport.addEventListener('pointermove', e => {
      if (dragging && Math.abs(e.clientX - startX) > 10) moved = true;
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (dx < -40)      goTo(index + 1);
      else if (dx > 40)  goTo(index - 1);
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('pointerleave', endDrag);

    track.addEventListener('click', e => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);

    window.addEventListener('resize', layout);
    cards.forEach(card => {
      const img = card.querySelector('img');
      if (img && !img.complete) {
        img.addEventListener('load', layout, { once: true });
      }
    });

    layout();
  });
})();
