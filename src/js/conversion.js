/* Bridge only: no collector, cookies or personal data. A configured provider must
   explicitly grant analytics consent and handle sinalruido:analytics. */
import books from '../data/books.json';
let consent = false;
export function setAnalyticsConsent(value) { consent = value === true; }
export function track(name, extra = {}) {
  if (!consent || navigator.globalPrivacyControl || navigator.doNotTrack === '1') return false;
  const detail = {event:name, book_id:extra.book_id, book_title:extra.book_title,
    store:extra.store, format:extra.format, page:location.pathname};
  try { window.dispatchEvent(new CustomEvent('sinalruido:analytics', {detail})); return true; } catch { return false; }
}
window.addEventListener('sinalruido:consent', e => setAnalyticsConsent(e.detail?.analytics));
const origin = books.find(b => b.slug === 'sinal-ruido');
const current = books.find(b => b.slug === document.querySelector('[data-book-id]')?.dataset.bookId || location.pathname === `/livros/${b.slug}/`) ||
  (['/livro/','/livro/amostra/','/livro/sample/','/en/signal-noise/'].includes(location.pathname) ? origin : null);
const payload = b => ({book_id:b?.slug,book_title:document.documentElement.lang.startsWith('en') ? b?.titleEn || (b?.slug === 'sinal-ruido' ? 'SIGNAL/NOISE' : b?.title) : b?.title});
let viewed = false;
window.addEventListener('sinalruido:consent', () => {
  if (viewed || !consent) return;
  viewed = true;
  if(current && !document.querySelector('[data-reading-sample]')) track('view_book',payload(current));
  if(['/autor/','/en/author/'].includes(location.pathname)) track('view_author');
});
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]'); if(!a) return;
  const url = new URL(a.href,location.href);
  if(['/livro/amostra/','/livro/sample/'].includes(url.pathname) && url.origin === location.origin) track('start_sample',payload(origin));
  if(url.origin === location.origin) return;
  const match = books.find(b => Object.entries(b).some(([key,value])=> key.startsWith('purchaseUrl') && value === a.href));
  const store = /(^|\.)amazon\./.test(url.hostname) ? 'Amazon' : url.hostname === 'loja.uiclap.com' ? 'UICLAP' : /clubedeautores/.test(url.hostname) ? 'Clube de Autores' : null;
  if(!store) return;
  const book = match || current || (location.pathname === '/buy/' ? origin : null);
  if(!book) {track("click_book_store",{store,format:"unspecified"}); return;}
  const format = store === 'UICLAP' || /paperback|hardcover|impresso/i.test(a.textContent) || a.href === book.purchaseUrlEnUk ? 'print' : book.slug === 'sinal-ruido' ? 'kindle' : 'unspecified';
  const data = {...payload(book),store,format};
  if (format !== 'unspecified') track(format === 'print' ? 'click_buy_print' : 'click_buy_kindle',data);
  track('click_book_store',data);
}, {capture:true});
const ending = document.querySelector('[data-sample-finish]');
if(ending) {
  let finished = false;
  const observer = new IntersectionObserver(entries=> {
    if(entries.some(e=>e.isIntersecting) && !ending.closest('[hidden]')) {
      if (!finished && track('finish_sample',payload(origin))) {finished = true;observer.disconnect();}
    }
  },{threshold:0.1});
  observer.observe(ending);
  window.addEventListener('sinalruido:consent', () => { if(consent && !finished) {observer.unobserve(ending); observer.observe(ending);} });
}
