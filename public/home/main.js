import { animate, stagger } from "./anime.js";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => 1 - Math.pow(1 - t, 3);

const COVER = "polygon(0 0,130% 0,100% 100%,-30% 100%)";
const LEFT = "polygon(0 0,0 0,-30% 100%,-30% 100%)";
const RIGHT = "polygon(130% 0,130% 0,100% 100%,100% 100%)";

/* ---------- transição de página: cortina diagonal laranja ---------- */
const curtain = $(".curtain");
const intro = $(".intro");
let introOn = false;
try { introOn = !!intro && !reduce && !sessionStorage.getItem("sr_intro"); } catch {}
if (!introOn) intro?.remove();
if (!reduce) {
  if (!introOn) {
    curtain.style.clipPath = COVER;
    animate(curtain, { clipPath: [COVER, RIGHT], duration: 800, ease: "inOutExpo", delay: 80 });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash)) return;
    e.preventDefault();
    animate(curtain, { clipPath: [LEFT, COVER], duration: 600, ease: "inOutExpo", onComplete: () => (location.href = u.href) });
  });
  addEventListener("pageshow", (e) => { if (e.persisted) curtain.style.clipPath = RIGHT; });
}

/* ---------- rolagem suave (Lenis) ---------- */
let lenis = null;
if (window.Lenis && !reduce && matchMedia("(pointer:fine)").matches) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
}
const stopScroll = () => lenis?.stop(), startScroll = () => lenis?.start();

/* ---------- menu / cabeçalho / progresso ---------- */
const nav = $(".nav"), btn = $(".menu-btn");
btn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
nav?.addEventListener("click", (e) => e.target.closest("a") && nav.classList.remove("open"));
const bar = $(".progress"), hdr = $(".hdr");

/* ---------- abertura: radiotelescópio + título ---------- */
const vid = $(".hero__video");
if (vid) {
  const show = () => animate(vid, { opacity: [0, 1], duration: reduce ? 1 : 1800, ease: "outQuad" });
  if (reduce) { vid.pause(); show(); }
  else { vid.play().catch(() => {}); vid.readyState > 2 ? show() : vid.addEventListener("canplay", show, { once: true }); }
}
const lines = $$(".title .ln"); // (a animação do hero está em heroIn)
lines.forEach((ln) => {
  const t = ln.textContent;
  ln.setAttribute("aria-label", t);
  ln.innerHTML = [...t].map((c) => (c === "/" ? `<span class="ch slash" aria-hidden="true">/</span>` : `<span class="ch" aria-hidden="true">${c}</span>`)).join("");
});
const heroItems = ".hero .eyebrow, .hook p, .cta > *, .by, .cover-stage";
function heroIn(d0) {
  if (reduce || !document.querySelector(".hero")) return;
  animate(".title .ch", { translateY: ["110%", "0%"], rotate: [8, 0], duration: 1100, delay: stagger(45, { start: d0 }), ease: "outExpo" });
  animate(".hero .eyebrow, .hook p, .cta > *, .by", { opacity: [0, 1], translateY: [24, 0], duration: 900, delay: stagger(110, { start: d0 + 600 }), ease: "outExpo" });
  animate(".cover-stage", { opacity: [0, 1], translateY: [60, 0], rotateY: [-18, 0], duration: 1500, delay: d0 + 400, ease: "outExpo" });
}
if (!reduce && document.querySelector(".hero")) {
  $$(heroItems).forEach((n) => (n.style.opacity = 0));
  $$(".title .ch").forEach((n) => (n.style.transform = "translateY(110%)"));
  if (vid) vid.style.opacity = 0;
}

/* ---------- portal de entrada: a transmissão (som só com clique) ---------- */
function endIntro() {
  try { sessionStorage.setItem("sr_intro", "1"); } catch {}
  const v = $(".intro video"); v?.pause();
  document.body.style.overflow = ""; startScroll();
  animate(intro, { opacity: [1, 0], duration: 900, ease: "inOutQuad", onComplete: () => intro.remove() });
  heroIn(1800); // o radiotelescópio varre o céu sozinho por um instante antes do título
}
$$("[data-replay]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); try { sessionStorage.removeItem("sr_intro"); } catch {} scrollTo(0, 0); location.reload(); }));
if (introOn) {
  document.body.style.overflow = "hidden"; stopScroll();
  const v = $("video", intro), snd = $(".intro__sound", intro), playBtn = $(".intro__play", intro);
  const start = () => { intro.classList.add("run"); playBtn.hidden = true; paint(); };
  // botão único: "Silenciar" enquanto o som está ligado; se o navegador forçar o mudo, mostra "Som desligado"
  const paint = () => { snd.hidden = false; snd.textContent = v.muted ? snd.dataset.off : snd.dataset.on; snd.classList.toggle("is-off", v.muted); };
  // 1) tenta com som; 2) se o navegador bloquear, toca mudo e liga o som no primeiro toque/tecla; 3) se bloquear tudo (ex.: economia de energia), pede um toque
  v.muted = false; v.volume = 1;
  v.play().then(start).catch(() => {
    v.muted = true;
    v.play().then(start).catch(() => { playBtn.hidden = false; });
  });
  playBtn.addEventListener("click", () => { v.muted = false; v.currentTime = 0; v.play().then(start).catch(() => { v.muted = true; v.play().then(start).catch(endIntro); }); });
  snd.addEventListener("click", () => { v.muted = !v.muted; paint(); });
  const unlock = (e) => { if (e.target.closest?.(".intro__sound,.intro__skip,.intro__play")) return; if (v.muted && !v.paused) { v.muted = false; v.volume = 1; paint(); } };
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => addEventListener(ev, unlock, { once: true }));
  v.addEventListener("ended", endIntro);
  // o Gray de relance: glitch crescente antes, imagem piscando por cima, volta ao rosto
  const gray = $(".intro__gray", intro);
  const G = [[4.78, 5.3, "g1"], [5.78, 6.15, "g2"]]; // janelas de glitch
  const F = [[4.97, 5.03], [5.06, 5.13], [5.17, 5.21], [5.9, 5.97], [6.0, 6.05]]; // quadros do Gray
  (function watch() {
    if (!intro.isConnected) return;
    const t = v.currentTime, inG = G.find(([a, z]) => t >= a && t <= z);
    intro.dataset.glitch = inG ? inG[2] : "";
    gray.classList.toggle("on", F.some(([a, z]) => t >= a && t <= z));
    requestAnimationFrame(watch);
  })();
  $(".intro__skip", intro).addEventListener("click", endIntro);
  addEventListener("keydown", (e) => e.key === "Escape" && intro.isConnected && endIntro());
} else heroIn(700);

/* inclinação 3D da capa */
const stage = $(".cover-stage"), cover = $(".cover");
if (stage && !reduce && matchMedia("(pointer:fine)").matches) {
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    cover.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg) scale(1.03)`;
    cover.style.setProperty("--shine", `${100 - (x + 0.5) * 120}%`);
  });
  stage.addEventListener("pointerleave", () => { cover.style.transition = "transform .7s cubic-bezier(.2,.7,.1,1)"; cover.style.transform = ""; setTimeout(() => (cover.style.transition = ""), 700); });
}

/* ---------- revelação por rolagem ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  io.unobserve(e.target);
  const n = e.target;
  if (n.matches(".bridge__lines p")) animate($$("span", n), { translateY: ["105%", "0%"], duration: 1200, ease: "outExpo" });
  else if (n.matches(".case")) animate(n, { opacity: [0, 1], translateX: [80, 0], duration: 1000, delay: (n.dataset.i || 0) * 90, ease: "outExpo" });
  else animate(n, { opacity: [0, 1], translateY: [34, 0], duration: 1000, delay: Number(n.dataset.r) || 0, ease: "outExpo" });
}), { threshold: 0.18 });
$$("[data-r]").forEach((n) => (reduce ? (n.style.opacity = 1) : io.observe(n)));
$$(".bridge__lines p").forEach((p) => { $$("span", p).forEach((s) => (s.style.transform = reduce ? "" : "translateY(105%)")); if (!reduce) io.observe(p); });
$$(".case").forEach((c, i) => { c.dataset.i = i; c.style.opacity = reduce ? 1 : 0; if (!reduce) io.observe(c); });

/* ---------- cena do sinal (canvas ligado à rolagem) ---------- */
const scene = $(".scene"), cv = $("#wave");
const ctx = cv?.getContext("2d");
const N = 520, seed = Array.from({ length: N }, (_, i) => (Math.sin(i * 12.9898) * 43758.5453) % 1);
let W = 0, H = 0, prog = 0, wowEl = $(".wow"), facts = $$(".fact"), tHint = 0;
function fit() { if (!cv) return; const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = cv.width = r.width * d; H = cv.height = r.height * d; }
function drawWave(time) {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  const x0 = 0.62, scan = clamp(prog / 0.6);
  const mid = H * 0.62, amp = H * 0.1;
  // grade discreta
  ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 1;
  for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo((W / 8) * i, 0); ctx.lineTo((W / 8) * i, H); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
  const spikeH = H * 0.5 * ease(clamp((scan - x0 + 0.02) / 0.06));
  const pts = [];
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1); if (u > scan) break;
    const jitter = reduce ? 0 : Math.sin(time / 380 + i * 1.7) * 0.25;
    let y = mid + (seed[i] + jitter) * amp * (1 - 0.35 * ease(clamp((scan - 0.7) / 0.3)));
    const g = Math.exp(-Math.pow((u - x0) / 0.014, 2));
    y -= g * spikeH;
    pts.push([u * W, y]);
  }
  if (pts.length) {
    ctx.lineJoin = "round"; ctx.lineWidth = 1.6 * (W / 1200 + 0.6);
    ctx.strokeStyle = "rgba(220,228,236,.75)"; ctx.shadowBlur = 0;
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    const [lx, ly] = pts[pts.length - 1];
    ctx.fillStyle = "#e8541d"; ctx.shadowColor = "#e8541d"; ctx.shadowBlur = 24;
    ctx.beginPath(); ctx.arc(lx, ly, 5 * (W / 1200 + 0.6), 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    if (scan > x0) { // linha do pico em laranja
      ctx.strokeStyle = "#e8541d"; ctx.shadowColor = "#e8541d"; ctx.shadowBlur = 18; ctx.beginPath();
      let on = false; pts.forEach(([x, y]) => { const u = x / W; if (Math.abs(u - x0) < 0.03) { on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; } }); ctx.stroke(); ctx.shadowBlur = 0;
    }
  }
}
function update() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  hdr.classList.toggle("is-solid", y > 60);
  if (vid && y < innerHeight) vid.style.transform = `translateY(${y * 0.18}px) scale(1.06)`;
  if (scene) {
    const r = scene.getBoundingClientRect();
    prog = clamp(-r.top / (r.height - innerHeight));
    if (wowEl) { const o = clamp((prog / 0.6 - 0.62) / 0.12); wowEl.style.opacity = o; wowEl.style.transform = `translateX(-50%) translateY(${(1 - o) * 20}px) scale(${0.9 + o * 0.1})`; }
    facts.forEach((f, i) => f.classList.toggle("on", prog > 0.45 + i * 0.13));
  }
  // sinopse: palavras acendem
  const syn = $(".syn__txt");
  if (syn) {
    const r = syn.getBoundingClientRect(), p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35));
    const ws = $$(".w", syn), k = Math.round(p * ws.length);
    ws.forEach((w, i) => w.classList.toggle("on", reduce || i < k));
  }
  const ai = $(".author__img img");
  if (ai && !reduce) { const r = ai.parentElement.getBoundingClientRect(); ai.style.transform = `translateY(${(r.top - innerHeight / 2) * -0.06}px) scale(1.15)`; }
}
let tick = false;
addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(() => { update(); tick = false; }); } }, { passive: true });
addEventListener("resize", () => { fit(); update(); });
fit(); update();
(function loop(t) { drawWave(t); if (!reduce) requestAnimationFrame(loop); })(0);
if (reduce) { prog = 1; drawWave(0); }

/* ---------- transmissão (ficção): som só com clique ---------- */
const tx = $(".tx"), tv = $(".tx video"), tb = $(".tx__play");
tb?.addEventListener("click", () => { tx.classList.add("playing"); tv.muted = false; tv.controls = true; tv.play(); });
tv?.addEventListener("ended", () => { tx.classList.remove("playing"); tv.controls = false; tv.currentTime = 0; });

/* ---------- cenas: tocam mudas só quando visíveis ---------- */
const vio = new IntersectionObserver((es) => es.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; if (!reduce) v.play().catch(() => {}); }
  else v.pause();
}), { threshold: 0.45 });
$$(".cena video").forEach((v) => vio.observe(v));

/* ---------- o livro abre: panorâmica da capa aberta ---------- */
const livro = $(".livro"), limg = $(".livro__img"), lparts = $$(".livro__parts li");
const stops = [0.675, 0.5, 0.31, 0.09]; // centro de cada parte na capa aberta (fração da largura)
function livroUpdate() {
  if (!livro) return;
  const r = livro.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight));
  const seg = p * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(seg)), t = seg - i;
  const s = t * t * (3 - 2 * t), c = stops[i] + (stops[i + 1] - stops[i]) * (reduce ? Math.round(t) : s);
  const W = limg.offsetWidth, vw = limg.parentElement.clientWidth;
  limg.style.transform = `translate(${vw / 2 - c * W}px,-50%)`;
  const act = Math.min(stops.length - 1, Math.round(seg));
  lparts.forEach((li, k) => li.classList.toggle("on", k === act));
}

/* ---------- o fio das Crônicas ---------- */
const track = $(".cron__track"), fg = $(".thread__fg"), bg = $(".thread__bg"), vols = $$("[data-vol]");
let tlen = 0;
function buildThread() {
  if (!track || !fg) return;
  const tr = track.getBoundingClientRect(), svg = $(".thread");
  svg.setAttribute("viewBox", `0 0 ${tr.width} ${tr.height}`);
  const pts = vols.map((v) => { const b = $(".vol__book", v).getBoundingClientRect(); return [b.left - tr.left + b.width / 2, b.top - tr.top + b.height / 2]; });
  let d = `M ${pts[0][0]} 0 L ${pts[0][0]} ${pts[0][1] - 40}`;
  pts.forEach(([x, y], i) => {
    if (i === 0) { d += ` L ${x} ${y}`; return; }
    const [px, py] = pts[i - 1], my = (py + y) / 2;
    d += ` C ${px} ${py + (y - py) * 0.45}, ${x} ${y - (y - py) * 0.45}, ${x} ${y}`;
  });
  fg.setAttribute("d", d); bg.setAttribute("d", d);
  tlen = fg.getTotalLength(); fg.style.strokeDasharray = tlen;
  threadUpdate();
}
function threadUpdate() {
  if (!track || !tlen) return;
  const tr = track.getBoundingClientRect(), p = clamp((innerHeight * 0.55 - tr.top) / tr.height);
  fg.style.strokeDashoffset = reduce ? 0 : tlen * (1 - p);
  const yMid = innerHeight * 0.55;
  vols.forEach((v) => { const b = $(".vol__book", v).getBoundingClientRect(); v.classList.toggle("on", reduce || b.top + b.height / 2 < yMid + 80); });
}
addEventListener("load", buildThread);
addEventListener("resize", buildThread);
addEventListener("scroll", () => { livroUpdate(); threadUpdate(); }, { passive: true });
livroUpdate();


/* ---------- A transmissão: cortes de suspense controlados pela rolagem ---------- */
(function () {
  const sec = $(".trans"); if (!sec || reduce) return;
  const vids = $$(".trans__v"), noise = $(".trans__noise"), num = $(".trans__n");
  let cur = -1, loaded = false;
  const load = () => { if (loaded) return; loaded = true; vids.forEach((v) => { v.src = v.dataset.src; v.preload = "auto"; v.load(); }); };
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) load(); }), { rootMargin: "100% 0px" }).observe(sec);
  function go(i) {
    if (i === cur) return;
    const first = cur < 0; cur = i;
    vids.forEach((v, k) => { const on = k === i; v.classList.toggle("on", on); if (on) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause(); });
    num.textContent = String(i + 1).padStart(2, "0") + " / 0" + vids.length;
    if (!first) { noise.classList.remove("hit"); void noise.offsetWidth; noise.classList.add("hit"); }
  }
  function upd() {
    const r = sec.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { vids.forEach((v) => v.pause()); cur = -1; return; }
    const p = Math.min(0.9999, Math.max(0, -r.top / (r.height - innerHeight)));
    go(Math.floor(p * vids.length));
  }
  addEventListener("scroll", upd, { passive: true }); upd();
})();

