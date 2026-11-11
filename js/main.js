/* I AM ISLAND — interactions */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => matchMedia('(min-width: 901px)').matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -60, duration: 1.6 }); }
      else if (id === '#top') { e.preventDefault(); lenis.scrollTo(0, { duration: 1.6 }); }
    }));
  }

  /* ---------- marquees ---------- */
  document.querySelectorAll('.marquee').forEach(m => {
    const track = m.querySelector('.marquee__track');
    const speed = +m.dataset.speed || 50;
    const w = track.scrollWidth / 2;
    const tween = gsap.to(track, { x: -w, duration: w / speed, ease: 'none', repeat: -1 });
    if (m.classList.contains('marquee--big')) {
      ScrollTrigger.create({ trigger: m, start: 'top bottom', end: 'bottom top',
        onUpdate: s => gsap.to(tween, { timeScale: 1 + Math.abs(s.getVelocity()) / 400, duration: .2, overwrite: true, onComplete: () => gsap.to(tween, { timeScale: 1, duration: 1 }) }) });
    }
  });

  /* ---------- cursor ---------- */
  const cursor = document.getElementById('cursor');
  const label = cursor.querySelector('.cursor__label');
  const cx = gsap.quickTo(cursor, 'x', { duration: .45, ease: 'power3' });
  const cy = gsap.quickTo(cursor, 'y', { duration: .45, ease: 'power3' });
  window.addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); });
  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('pointerenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-big'); });
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-big'));
  });

  /* ---------- nav hide on scroll down ---------- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
    const y = s.scroll();
    nav.classList.toggle('is-hidden', y > lastY && y > 300);
    lastY = y;
  }});

  /* ---------- split letters ---------- */
  document.querySelectorAll('[data-split]').forEach(el => {
    el.innerHTML = [...el.textContent].map(c => `<span class="ch">${c}</span>`).join('');
  });
  /* ---------- split words ---------- */
  document.querySelectorAll('[data-words]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  });

  /* ---------- loader + intro ---------- */
  const intro = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('#heroFrame', { clipPath: 'inset(12% 8% 12% 8%)', duration: 1.6, ease: 'expo.inOut' })
      .from('.hero__cell', { yPercent: i => [14, -10, 18][i], duration: 1.8, ease: 'expo.out' }, '<.1')
      .from('.hero__img', { scale: 1.4, duration: 2.2, ease: 'expo.out' }, '<')
      .from('.hero__word span', { yPercent: 110, duration: 1.3, stagger: .08 }, '-=1.3')
      .from('.hero__serif', { opacity: 0, y: 20, duration: 1 }, '<.2')
      .from('.hero__sticker', { scale: 0, rotate: -120, duration: 1.2, ease: 'back.out(1.6)' }, '<.1')
      .from('.captions p', { y: 16, opacity: 0, duration: .9, stagger: .06 }, '<')
      .from('.nav > *', { y: -20, opacity: 0, duration: .9, stagger: .06 }, '<');
  };

  const loader = document.getElementById('loader');
  const count = document.getElementById('loaderCount');
  if (reduce) { loader.remove(); }
  else {
    document.body.classList.add('is-loading');
    const o = { v: 0 };
    const tl = gsap.timeline();
    tl.fromTo('.loader__line span', { yPercent: 105 }, { yPercent: 0, duration: 1.1, stagger: .1, ease: 'expo.out' })
      .to(o, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => count.textContent = String(Math.round(o.v)).padStart(2, '0') }, 0)
      .to('.loader__line span', { yPercent: -105, duration: .7, stagger: .06, ease: 'expo.in' }, '+=.15')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=.25')
      .add(() => { document.body.classList.remove('is-loading'); intro(); }, '-=.75')
      .add(() => loader.remove());
  }

  /* ---------- hero scroll parallax ---------- */
  document.querySelectorAll('.hero__img').forEach((img, i) => {
    gsap.to(img, { yPercent: [10, 5, 13][i], ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });
  gsap.to('.hero__title', { yPercent: -40, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---------- statement ---------- */
  gsap.from('.statement__big .ch', { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: .05,
    scrollTrigger: { trigger: '.statement__row', start: 'top 80%' } });
  gsap.from('.statement__serif', { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', stagger: .2,
    scrollTrigger: { trigger: '.statement__row', start: 'top 80%' } });
  gsap.from('.card', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .12,
    scrollTrigger: { trigger: '.trio', start: 'top 85%' } });
  gsap.from('.trio__claim', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: '.trio__claim', start: 'top 90%' } });

  /* ---------- manifesto ---------- */
  gsap.from('.manifesto__head .line', { yPercent: 100, duration: 1.3, ease: 'expo.out', stagger: .1,
    scrollTrigger: { trigger: '.manifesto__head', start: 'top 80%' } });
  gsap.to('.manifesto__text .w', { opacity: 1, stagger: .05, ease: 'none',
    scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true } });
  gsap.fromTo('.manifesto__flower', { rotate: -25, yPercent: 30 }, { rotate: 20, yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.manifesto', { backgroundPosition: '0% 0%' }, { backgroundPosition: '60% 100%', ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- collections horizontal ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const track = document.getElementById('colTrack');
    const dist = () => track.scrollWidth - (window.innerWidth - track.getBoundingClientRect().left) + 40;
    const tw = gsap.to(track, { x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.collections', start: 'top top', end: () => '+=' + dist(), pin: '.collections__pin', scrub: 1, invalidateOnRefresh: true } });
    track.querySelectorAll('.col__img img').forEach(img => {
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.closest('.col'), containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
    });
  });

  /* ---------- lookbook ---------- */
  gsap.from('.lb-line > span', { yPercent: 105, duration: 1.3, ease: 'expo.out', stagger: .1,
    scrollTrigger: { trigger: '.lookbook__head', start: 'top 80%' } });
  if (isDesktop()) {
    document.querySelectorAll('.lb').forEach(f => {
      const sp = parseFloat(f.dataset.speed) || 0;
      gsap.to(f, { yPercent: sp * -100, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }
  document.querySelectorAll('.lb').forEach(f => {
    gsap.from(f, { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%' } });
    gsap.from(f.querySelector('img'), { scale: 1.3, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%' } });
  });

  /* ---------- find cards ---------- */
  gsap.from('.find__card', { y: 70, opacity: 0, rotate: i => [-3, 2, -2][i], duration: 1.2, ease: 'expo.out', stagger: .12,
    scrollTrigger: { trigger: '.find__grid', start: 'top 80%' } });

  /* ---------- drop ---------- */
  gsap.from('.drop__head', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.drop', start: 'top 70%' } });
  gsap.fromTo('.drop__turtle', { x: 200, y: 120, rotate: -40 }, { x: -60, y: -60, rotate: -10, ease: 'none',
    scrollTrigger: { trigger: '.drop', start: 'top bottom', end: 'bottom top', scrub: true } });
  document.getElementById('dropForm').addEventListener('submit', e => {
    e.preventDefault(); e.target.reset(); document.getElementById('dropOk').classList.add('is-on');
  });

  /* ---------- footer mark ---------- */
  gsap.from('.footer__mark span', { yPercent: 100, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.footer__mark', start: 'top 95%' } });

  /* =====================================================
     Halftone turtle — dots sampled from the generated art,
     they swim in, breathe like water and flee the cursor.
     ===================================================== */
  const canvas = document.getElementById('turtleCanvas');
  const ctx = canvas.getContext('2d');
  const src = new Image();
  src.src = 'assets/gen/turtle.png';
  let dots = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: -9999, y: -9999 };
  let entered = reduce, enterT = 0;

  function build() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const step = Math.max(4.5, W / 78);
    const cols = Math.floor(W / step), rows = Math.floor(H / step);
    const off = document.createElement('canvas');
    off.width = cols; off.height = rows;
    const o = off.getContext('2d', { willReadFrequently: true });
    o.drawImage(src, 0, 0, cols, rows);
    let data;
    try { data = o.getImageData(0, 0, cols, rows).data; } catch (e) { data = null; }
    dots = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      let a = 0;
      if (data) {
        const i = (y * cols + x) * 4;
        const red = Math.max(0, data[i] - (data[i + 1] + data[i + 2]) / 2) / 200;
        a = Math.min(1, (data[i + 3] / 255) * red);
      }
      if (a < .08) continue;
      const hx = x * step + step / 2, hy = y * step + step / 2;
      dots.push({ hx, hy, x: hx + (Math.random() - .5) * W * 1.6, y: hy + (Math.random() - .5) * H * 1.6,
        vx: 0, vy: 0, r: Math.max(.6, a * step * .52), d: Math.random() * 600 });
    }
    if (!data) { /* file:// fallback: draw the image itself */
      dots = null;
    }
  }

  function frame(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!dots) { ctx.drawImage(src, 0, 0, W, H); requestAnimationFrame(frame); return; }
    ctx.fillStyle = '#D7262E';
    const time = t / 1000;
    const k = entered ? Math.min(1, (t - enterT) / 1400) : 0;
    const R = W * .16;
    ctx.beginPath();
    for (const p of dots) {
      if (entered && t - enterT > p.d) {
        const wx = Math.sin(time * 1.4 + p.hy * .035) * 2.2;
        const wy = Math.cos(time * 1.1 + p.hx * .03) * 1.6;
        let ax = (p.hx + wx - p.x) * .06, ay = (p.hy + wy - p.y) * .06;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dd = dx * dx + dy * dy;
        if (dd < R * R) { const d = Math.sqrt(dd) || 1, f = (1 - d / R) * 9; ax += dx / d * f; ay += dy / d * f; }
        p.vx = (p.vx + ax) * .82; p.vy = (p.vy + ay) * .82;
        p.x += p.vx; p.y += p.vy;
      }
      const rr = p.r * (entered ? 1 : .4);
      ctx.moveTo(p.x + rr, p.y);
      ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
    }
    ctx.fill();
    requestAnimationFrame(frame);
  }

  src.onload = () => {
    build();
    requestAnimationFrame(frame);
    ScrollTrigger.create({ trigger: canvas, start: 'top 85%', once: true, onEnter: () => { entered = true; enterT = performance.now(); } });
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); entered = true; enterT = performance.now() - 2000; }, 200); });
  };
  canvas.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  canvas.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  // let the cursor push the turtle even slightly outside the canvas
  window.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); if (e.clientX > r.left - 60 && e.clientX < r.right + 60 && e.clientY > r.top - 60 && e.clientY < r.bottom + 60) { mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
