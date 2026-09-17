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
if (counters.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
