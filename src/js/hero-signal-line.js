// Linha laranja que entra pela esquerda, serpenteia pela tela inteira e termina no topo, no canto direito.
const hero = document.querySelector('[data-book-hero]');
if (hero) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'hero-signal-line');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  svg.appendChild(path);
  hero.prepend(svg);

  const build = () => {
    const W = hero.clientWidth, H = hero.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const topY = 3, runStart = W;
    const pts = [];
    const N = 160;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = runStart * t;
      const base = (H - 6) * (1 - t) + topY;
      const amp = H * 0.11 * Math.sin(Math.PI * t) ** 0.7;
      const y = base + amp * (Math.sin(t * 15) * 0.65 + Math.sin(t * 6.5 + 1.3) * 0.35);
      pts.push([x, y]);
    }
    path.setAttribute('d', 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'));
    const L = path.getTotalLength();
    const D = L * 0.22;
    path.style.setProperty('--len', L.toFixed(0) + 'px');
    path.style.setProperty('--body', D.toFixed(0) + 'px');
    path.style.strokeDasharray = `${D.toFixed(0)} ${L.toFixed(0)}`;
  };
  build();
  addEventListener('resize', build);

  // so comeca a dancar quando a introducao termina (body.intro-active sai)
  const play = () => svg.classList.add('is-playing');
  if (!document.body.classList.contains('intro-active')) {
    // a intro pode ainda nao ter marcado o body; aguarda um instante antes de decidir
    setTimeout(() => (document.body.classList.contains('intro-active') ? wait() : play()), 300);
  } else wait();
  function wait() {
    const mo = new MutationObserver(() => {
      if (!document.body.classList.contains('intro-active')) { mo.disconnect(); play(); }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
}
