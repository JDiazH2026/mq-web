/* ============================================================
   MQ INGENIERÍA · JS
   ============================================================ */

// ── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── MOBILE MENU ────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

function closeMobile() {
  navMobile.classList.remove('open');
}

// ── HERO PARTICLE CANVAS ───────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const GOLD = '#c9a84c';
  const GOLD_DIM = 'rgba(201,168,76,0.18)';
  const COUNT = 55;
  const MAX_DIST = 120;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }
  }

  let mouseX = W / 2, mouseY = H / 2;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connect lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = GOLD_DIM;
          ctx.globalAlpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Mouse attraction lines
    for (const p of particles) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.beginPath();
        ctx.strokeStyle = GOLD;
        ctx.globalAlpha = (1 - dist / 180) * 0.15;
        ctx.lineWidth = 0.8;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }

    // Draw particles
    ctx.globalAlpha = 1;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Slight mouse attraction
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220) {
        p.vx += (dx / dist) * 0.004;
        p.vy += (dy / dist) * 0.004;
      }

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) { p.vx *= 0.95; p.vy *= 0.95; }

      // Bounce edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    createParticles();
    cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  start();
})();

// ── SCROLL REVEAL ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal-up').forEach(el => {
  revealObserver.observe(el);
});

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.numero-value[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ── SMOOTH ACTIVE NAV ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── CONTACT FORM ───────────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const success = document.getElementById('form-success');
  const form = document.getElementById('contact-form');

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simulación de envío (reemplazar con endpoint real cuando disponible)
  setTimeout(() => {
    form.reset();
    btn.style.display = 'none';
    success.classList.add('show');
  }, 1400);
}

// ── HERO PARALLAX ──────────────────────────────────────────
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    hero.style.transform = `translateY(${scrollY * 0.18}px)`;
    hero.style.opacity = 1 - scrollY / (window.innerHeight * 0.85);
  }
}, { passive: true });
