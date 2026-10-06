// Ambiência de fundo inspirada na capa: estrelas cintilando, pixels acendendo perto do
// cursor em qualquer lugar do site, névoa girando devagar, e, nas páginas de livro, a
// contracapa daquele livro emergindo de um canto da tela com um glitch rápido, depois voltando pra sombra. Sem áudio.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Não repetir toda hora: só deixa aparecer de novo depois de um tempo desde a última vez.
const LAST_SEEN_KEY = "sr_verso_last_seen:" + location.pathname;
const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6h
function alienIsDue() {
  try {
    const last = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
    return Date.now() - last > COOLDOWN_MS;
  } catch {
    return true; // sem acesso a localStorage (modo privado etc.) — deixa aparecer normalmente
  }
}
function markAlienSeen() {
  try { localStorage.setItem(LAST_SEEN_KEY, String(Date.now())); } catch {}
}

if (!reduceMotion && !document.querySelector("[data-reading-sample], .book-sheet")) {
  const layer = document.createElement("div");
  layer.className = "ambience-layer";
  layer.setAttribute("aria-hidden", "true");

  // ---- Névoa ----
  const nebula = document.createElement("div");
  nebula.className = "ambience-nebula";

  // ---- Estrelas cintilando ----
  const starsWrap = document.createElement("div");
  starsWrap.className = "ambience-stars";
  const STAR_COUNT = 70;
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("span");
    star.className = "ambience-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = 1 + Math.random() * 1.4;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${3 + Math.random() * 5}s`;
    star.style.animationDelay = `-${Math.random() * 8}s`;
    starsWrap.appendChild(star);
  }

  // ---- Overlay de glitch/estática, tela cheia — pisca rápido bem no instante em que ele "chega" ----
  const glitch = document.createElement("div");
  glitch.className = "ambience-glitch";

  // ---- Pixels reativos ao mouse, em tela cheia ----
  const pixelsCanvas = document.createElement("canvas");
  pixelsCanvas.className = "ambience-pixels";
  layer.append(nebula, pixelsCanvas, starsWrap, glitch);
  document.body.prepend(layer);
  document.body.classList.add("js-ambience");
  setupPixelHover(pixelsCanvas);

  // Só nas páginas de livro: o elemento com data-verso traz a contracapa daquele livro.
  const versoHolder = document.querySelector("[data-verso]");
  if (versoHolder) {
  // ---- Contracapa do livro: canto aleatório. Aparece sozinho (se o cooldown já passou) ou
  // sob demanda, quando algo em outra parte do site "chama" ele (ver evento sr:uap-found). ----
  const alien = document.createElement("div");
  alien.className = "ambience-alien";
  alien.style.backgroundImage = `url("${versoHolder.dataset.verso}")`;
  const SPAWNS = [
    { top: "2%", right: "2%", restX: "20vw", restY: "-20vh", midX: "-30vw", midY: "28vh" },   // topo-direita
    { top: "2%", left: "2%", restX: "-20vw", restY: "-20vh", midX: "30vw", midY: "28vh" },    // topo-esquerda
    { bottom: "2%", right: "2%", restX: "20vw", restY: "20vh", midX: "-30vw", midY: "-28vh" }, // baixo-direita
    { bottom: "2%", left: "2%", restX: "-20vw", restY: "20vh", midX: "30vw", midY: "-28vh" },  // baixo-esquerda
    { top: "50%", right: "2%", restX: "26vw", restY: "-50%", midX: "-34vw", midY: "-50%" },    // espiando pela lateral direita
    { top: "50%", left: "2%", restX: "-26vw", restY: "-50%", midX: "34vw", midY: "-50%" },     // espiando pela lateral esquerda
  ];
  const corner = SPAWNS[Math.floor(Math.random() * SPAWNS.length)];
  alien.style.top = corner.top || "auto";
  alien.style.bottom = corner.bottom || "auto";
  alien.style.left = corner.left || "auto";
  alien.style.right = corner.right || "auto";
  const { restX, restY, midX, midY } = corner;
  layer.appendChild(alien);

  // rastreia o cursor pra ele "notar" a direção de quem olha, de leve, perto do pico
  let mouseNX = 0, mouseNY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseNX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let encounterRunning = false;
  function trigger() {
    if (encounterRunning) return;
    encounterRunning = true;
    runEncounter(alien, glitch, { restX, restY, midX, midY }, () => mouseNX, () => mouseNY, () => { encounterRunning = false; });
  }

  // ---- Aparição espontânea: só se o cooldown normal já passou, 5s depois que a página abre. ----
  if (alienIsDue()) setTimeout(trigger, 5000);

  // ---- Aparição sob demanda: qualquer script do site pode disparar isso (ex.: achar a UAP escondida
  // no sistema solar), sem depender do cooldown — é uma recompensa por achar, não repetição chata. ----
  }
}

// Curva de "proximidade": 0 -> 1 (aproximando) -> platô -> 1 -> 0 (afastando).
function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function closenessAt(t, approachFrac, holdEndFrac) {
  if (t < approachFrac) return smoothstep(0, approachFrac, t);
  if (t < holdEndFrac) return 1;
  // recuo com "ease-out": some devagar, indo mais lento ainda perto do fim
  const u = Math.min(1, Math.max(0, (t - holdEndFrac) / (1 - holdEndFrac)));
  return Math.pow(1 - u, 2);
}

function consoleEasterEgg() {
  console.log(
    "%c6EQUJ5%c\nalgo está olhando de volta.",
    "font-family:monospace;font-size:20px;color:#e8541d;font-weight:bold",
    "font-family:monospace;font-size:12px;color:#8b949e"
  );
}

function runEncounter(alien, glitch, path, getMouseNX, getMouseNY, onDone) {
  const PREROLL_MS = 1200;
  // aproximação lenta (~7s) -> para um instante no pico (~3s) -> recua devagar, como andando de costas (~9s)
  const APPROACH_MS = 7000;
  const HOLD_MS = 3000;
  const RETREAT_MS = 9000;
  const DURATION_MS = APPROACH_MS + HOLD_MS + RETREAT_MS;
  const APPROACH_FRAC = APPROACH_MS / DURATION_MS;
  const HOLD_END_FRAC = (APPROACH_MS + HOLD_MS) / DURATION_MS;

  setTimeout(() => {
    markAlienSeen();
    consoleEasterEgg();
    glitch.animate(
      [{ opacity: 0 }, { opacity: 0.5, offset: 0.2 }, { opacity: 0.1, offset: 0.4 }, { opacity: 0.4, offset: 0.6 }, { opacity: 0 }],
      { duration: 420, easing: "steps(6, end)" }
    );

    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const c = closenessAt(t, APPROACH_FRAC, HOLD_END_FRAC);
      applyTransform(alien, path, c, getMouseNX(), getMouseNY());
      if (t < 1) requestAnimationFrame(frame);
      else {
        alien.style.opacity = "0";
        if (onDone) onDone();
      }
    }
    requestAnimationFrame(frame);
  }, PREROLL_MS);
}

// Posição + leve "olhar" na direção do cursor (só perceptível perto do pico, quando c é alto).
function applyTransform(alien, path, c, mouseNX, mouseNY) {
  const x = `calc(${path.restX} + (${path.midX} - ${path.restX}) * ${c})`;
  const y = `calc(${path.restY} + (${path.midY} - ${path.restY}) * ${c})`;
  const tilt = mouseNX * 3 * c;
  const lean = mouseNY * 2 * c;
  alien.style.transform = `translate(${x}, ${y}) scale(${0.75 + c * 0.5}) rotate(${tilt}deg) translateY(${lean}px)`;
  alien.style.opacity = String(c * 0.55);
}

function setupPixelHover(canvas) {
  const ctx = canvas.getContext("2d");
  const GAP = 14;
  const RADIUS = 100;
  const DECAY = 0.045;
  const RGB = "232, 84, 29";
  const MAX_ALPHA = 0.5;

  let cols = 0, rows = 0, energy = [];
  let raf = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width / GAP);
    rows = Math.ceil(canvas.height / GAP);
    energy = new Float32Array(cols * rows);
  }

  function ignite(x, y) {
    const cx = Math.floor(x / GAP);
    const cy = Math.floor(y / GAP);
    const reach = Math.ceil(RADIUS / GAP);
    for (let j = -reach; j <= reach; j++) {
      for (let i = -reach; i <= reach; i++) {
        const gx = cx + i, gy = cy + j;
        if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue;
        const dist = Math.hypot(i * GAP, j * GAP);
        if (dist > RADIUS) continue;
        const idx = gy * cols + gx;
        energy[idx] = Math.max(energy[idx], 1 - dist / RADIUS);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const idx = gy * cols + gx;
        const e = energy[idx];
        if (e <= 0.01) continue;
        active = true;
        energy[idx] = Math.max(0, e - DECAY);
        const size = 2 + e * 3;
        ctx.fillStyle = `rgba(${RGB}, ${e * MAX_ALPHA})`;
        ctx.fillRect(gx * GAP + (GAP - size) / 2, gy * GAP + (GAP - size) / 2, size, size);
      }
    }
    raf = active ? requestAnimationFrame(draw) : null;
  }

  function wake() { if (!raf) raf = requestAnimationFrame(draw); }

  window.addEventListener("mousemove", (e) => { ignite(e.clientX, e.clientY); wake(); });
  window.addEventListener("resize", resize);
  resize();
}
