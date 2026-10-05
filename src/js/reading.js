const shell = document.querySelector('[data-reading-sample]');
if (shell) {
  const tabs = [...shell.querySelectorAll('[data-chapter-tab]')];
  const panels = [...shell.querySelectorAll('[data-chapter-panel]')];
  const key = 'sinalruido.sample.chapter';
  const fontKey = 'sinalruido.sample.font';
  const themeKey = 'sinalruido.sample.theme';

  const activate = (id, { scroll = false } = {}) => {
    tabs.forEach((tab) => { tab.setAttribute('aria-selected', String(tab.dataset.chapterTab === id)); tab.tabIndex = tab.dataset.chapterTab === id ? 0 : -1; });
    panels.forEach((panel) => { panel.hidden = panel.dataset.chapterPanel !== id; });
    try { localStorage.setItem(key, id); } catch {}
    if (scroll) shell.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  tabs.forEach((tab, index) => tab.addEventListener('keydown', e => {
    let next;
    if(e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if(e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if(e.key === 'Home') next = 0;
    if(e.key === 'End') next = tabs.length - 1;
    if(next === undefined) return;
    e.preventDefault(); activate(tabs[next].dataset.chapterTab); tabs[next].focus();
  }));
  tabs.forEach((tab) => tab.addEventListener('click', () => activate(tab.dataset.chapterTab, { scroll: true })));
  shell.querySelectorAll('[data-next-chapter]').forEach((btn) => btn.addEventListener('click', () => activate(btn.dataset.nextChapter, { scroll: true })));

  let size = 18;
  try { size = Number(localStorage.getItem(fontKey) || 18); } catch {}
  size = Math.max(15, Math.min(24, size));
  shell.style.setProperty('--reading-font-size', `${size}px`);

  shell.querySelector('[data-reading-size="up"]')?.addEventListener('click', () => {
    size = Math.min(24, size + 1);
    shell.style.setProperty('--reading-font-size', `${size}px`);
    try { localStorage.setItem(fontKey, String(size)); } catch {}
  });
  shell.querySelector('[data-reading-size="down"]')?.addEventListener('click', () => {
    size = Math.max(15, size - 1);
    shell.style.setProperty('--reading-font-size', `${size}px`);
    try { localStorage.setItem(fontKey, String(size)); } catch {}
  });

  let dark = false;
  try { dark = localStorage.getItem(themeKey) === 'dark'; } catch {}
  shell.classList.toggle('is-dark', dark);
  shell.querySelector('[data-reading-theme]')?.addEventListener('click', () => {
    dark = !dark;
    shell.classList.toggle('is-dark', dark);
    try { localStorage.setItem(themeKey, dark ? 'dark' : 'light'); } catch {}
  });

  try {
    const saved = localStorage.getItem(key);
    if (saved && tabs.some((t) => t.dataset.chapterTab === saved)) activate(saved);
  } catch {}
}
