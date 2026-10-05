const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const heroLines = document.querySelectorAll('[data-hero-line]');
if (heroLines.length) {
  requestAnimationFrame(() => {
    heroLines.forEach((line, index) => {
      line.style.setProperty('--hero-delay', `${120 + index * 110}ms`);
      line.classList.add('is-ready');
    });
  });
}

const counters = document.querySelectorAll('[data-count]');
if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const started = performance.now();
      const duration = 650;
      const tick = (now) => {
        const p = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => observer.observe(el));
}

// Motion editorial do hero literário: entrada da capa + stagger de texto.
// Carrega Anime.js sob demanda (só existe na Home) e nunca atrasa a interação —
// os elementos já são clicáveis antes da animação terminar (sem opacity:0 no HTML).
const bookHero = document.querySelector('[data-book-hero]');
if (bookHero && !reduceMotion) {
  import('animejs').then(({ animate, stagger }) => {
    const cover = bookHero.querySelector('[data-book-hero-cover]');
    const copy = bookHero.querySelectorAll('[data-book-hero-copy] > *');
    if (cover) animate(cover, { opacity: [0, 1], translateY: [16, 0], duration: 500, ease: 'outCubic' });
    if (copy.length) animate(copy, { opacity: [0, 1], translateY: [10, 0], duration: 350, delay: stagger(60, { start: 120 }), ease: 'outQuad' });
  }).catch(() => {});
}

const revealCards = document.querySelectorAll('[data-motion-reveal]');
if (revealCards.length && 'IntersectionObserver' in window && !reduceMotion) {
  import('animejs').then(({ animate, stagger }) => {
    const groups = new Map();
    revealCards.forEach((el) => {
      const group = el.closest('[data-motion-group]') || el.parentElement;
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(el);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = entry.target.closest('[data-motion-group]') || entry.target.parentElement;
        const siblings = groups.get(group) || [entry.target];
        animate(siblings, { opacity: [0, 1], translateY: [12, 0], duration: 320, delay: stagger(50), ease: 'outQuad' });
        siblings.forEach((el) => observer.unobserve(el));
      });
    }, { threshold: 0.2 });
    revealCards.forEach((el) => observer.observe(el));
  }).catch(() => {});
}
// Transmission interval: subtle successive entrance, with a fully static fallback.
const transmissionLines = document.querySelectorAll('[data-transmission-line]');
if (transmissionLines.length && !reduceMotion && 'IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  transmissionLines.forEach((line,index) => line.animate([{opacity:.4,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,delay:index*160,easing:'ease-out'}));
  observer.disconnect();
 },{threshold:.5});
 observer.observe(transmissionLines[0].parentElement);
}
