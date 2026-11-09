const { gsap, ScrollTrigger } = window;


gsap.registerPlugin(ScrollTrigger);
const root = document.querySelector('[data-cinematic]');
if (root) {
  const scenes = [...root.querySelectorAll('.cine-scene')];
  const finale = document.querySelector('#cine-finale');
  const media = gsap.matchMedia();
  let timeline;
  const loadScene = (index) => {
    // Warm only the current and next composition, including reverse scrolling.
    [index - 1, index, index + 1].forEach(i => {
      scenes[i]?.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    });
  };
  function skip(event) {
    event?.preventDefault();
    window.scrollTo({ top: finale.getBoundingClientRect().top + scrollY - 80, behavior: 'instant' });
    finale.focus({ preventScroll: true });
  }
  root.querySelector('.cine-skip').addEventListener('click', skip);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.querySelector('.nav.open') && root.getBoundingClientRect().bottom > 0 && root.getBoundingClientRect().top <= 0) skip();
  });
  document.querySelector('[data-cine-replay]')?.addEventListener('click', event => {
    event.preventDefault(); window.scrollTo({ top: 0, behavior: 'instant' });
    root.querySelector('.cine-skip').focus({ preventScroll: true });
  });
  media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 700px)' }, context => {
    if (!context.conditions.motion) return;
    root.classList.add('is-enhanced');
    let active = -1;
    const setScene = index => {
      if (index === active) return;
      active = index; loadScene(index);
      root.querySelector('[data-cine-count]').textContent = `${String(index + 1).padStart(2, '0')} / 10`;
      scenes.forEach((scene, i) => scene.setAttribute('aria-hidden', String(i !== index)));
    };
    gsap.set(scenes, { autoAlpha: 0 });
    gsap.set(scenes[0], { autoAlpha: 1 });
    timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      id: 'cinematic-hero', trigger: root, pin: root.querySelector('.cine-stage'), start: 'top top',
      end: () => `+=${Math.round(innerHeight * (context.conditions.mobile ? 8 : 10))}`,
      scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1,
    }});
    scenes.forEach((scene, i) => {
      const at = i * 1.5;
      const picture = scene.querySelector('.cine-picture');
      if (i > 0) {
        timeline.to(scenes[i - 1], { autoAlpha: 0, duration: .35 }, at);
        timeline.to(scene, { autoAlpha: 1, duration: .45 }, at);
      }
      timeline.fromTo(picture, { scale: i === 3 ? 1.14 : 1.04, yPercent: 2 }, { scale: i === 2 ? 1.28 : 1.13, yPercent: -3, duration: 1.85 }, at);
      const caption = scene.querySelector('.cine-caption');
      timeline.fromTo(caption, { y: 22, opacity: i === 0 ? 1 : 0 }, { y: 0, opacity: 1, duration: .55 }, at + (i ? .25 : 0));
      if (i === 0) timeline.to(scene.querySelector('.cine-foreground'), { scale: 1.22, yPercent: 7, duration: 1.85 }, at);
      if (i === 1) timeline.to(scene.querySelector('.cine-alternate'), { opacity: 1, scale: 1.09, duration: .8 }, at + .65);
      if (i === 4) timeline.set(picture, { opacity: 0 }, at + .8).set(scene.querySelector('.cine-alternate'), { opacity: 1 }, at + .8);
      if (i === 2) timeline.to(root.querySelector('.cine-flare'), { opacity: .6, duration: .35 }, at + 1.15).to(root.querySelector('.cine-flare'), { opacity: 0, duration: .5 }, at + 1.5);
      if (i === 8) timeline.to(scene.querySelector('.cine-reveal-cover'), { opacity: 1, duration: .8 }, at + .3);
      if (i === 6) timeline.to(picture, { opacity: .15, duration: .7 }, at + .65).to(scene.querySelector('.cine-data'), { opacity: 1, y: -20, duration: .8 }, at + .7);
    });
    timeline.to(root.querySelector('.cine-interference'), { opacity: .25, duration: .15 }, 12.2)
      .to(root.querySelector('.cine-interference'), { opacity: 0, duration: .4 }, 12.35)
      .to(scenes.at(-1), { autoAlpha: 0, duration: .55 }, 13.15);
    timeline.to(root.querySelector('.cine-meter i'), { scaleX: 1, duration: timeline.duration() }, 0);
    timeline.eventCallback('onUpdate', () => setScene(Math.min(8, Math.floor(timeline.time() / 1.5))));
    setScene(0);
    return () => {
      root.classList.remove('is-enhanced');
      scenes.forEach(scene => scene.removeAttribute('aria-hidden'));
    };
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('pagehide', event => { if (!event.persisted) media.revert(); });
}


