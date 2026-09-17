// Tela de abertura só na Home, só na primeira visita: um disco de cofre (segredo) gira,
// para em alguns pontos como se destravasse uma combinação, "abre" e revela um warp curto
// de estrelas antes do site aparecer. Tudo automático — sem precisar clicar em nada.
const SEEN_KEY = "sr_intro_seen";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function alreadySeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
function markSeen() {
  try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
}

if (location.pathname === "/" && !alreadySeen()) {
  if (reduceMotion) {
    markSeen();
  } else {
    mountIntro();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function spinTo(el, fromDeg, toDeg, duration) {
  return new Promise((resolve) => {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 4); // desacelera forte no fim, como um disco de verdade
      el.style.transform = `rotate(${fromDeg + (toDeg - fromDeg) * e}deg)`;
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
}

function ticks(count) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * 360;
    const long = i % 5 === 0;
    out += `<line x1="100" y1="${long ? 14 : 20}" x2="100" y2="28" transform="rotate(${a} 100 100)" class="intro-dial__tick${long ? " is-long" : ""}" />`;
  }
  return out;
}

async function mountIntro() {
  const screen = document.createElement("div");
  screen.className = "intro-screen";
  screen.setAttribute("role", "dialog");
  screen.setAttribute("aria-label", "Abertura do SINAL/RUÍDO");

  const canvas = document.createElement("canvas");
  canvas.className = "intro-screen__canvas";

  const content = document.createElement("div");
  content.className = "intro-screen__content";
  content.innerHTML = `
    <svg class="intro-dial" viewBox="0 0 200 200" width="180" height="180" aria-hidden="true">
      <circle cx="100" cy="100" r="96" class="intro-dial__ring" />
      ${ticks(40)}
      <g class="intro-dial__wheel">
        <circle cx="100" cy="100" r="66" class="intro-dial__face" />
        <line x1="100" y1="100" x2="100" y2="46" class="intro-dial__pointer" />
        <circle cx="100" cy="100" r="5" class="intro-dial__hub" />
      </g>
      <polygon points="94,2 106,2 100,16" class="intro-dial__marker" />
    </svg>
    <span class="intro-screen__mark">SINAL<b>/</b>RUÍDO</span>
    <p class="intro-screen__tagline">O que sabemos. O que não sabemos. O que ainda falta encontrar.</p>
    <button type="button" class="intro-screen__skip">Pular introdução</button>
  `;

  screen.append(canvas, content);
  document.body.appendChild(screen);
  document.body.classList.add("intro-active");

  let skipped = false;
  content.querySelector(".intro-screen__skip").addEventListener("click", () => { skipped = true; }, { once: true });

  const wheel = content.querySelector(".intro-dial__wheel");
  const dialWrap = content.querySelector(".intro-dial");

  // ---- Sequência da combinação: gira, para, gira, para, gira, destrava ----
  let angle = 0;
  const stops = [420 + Math.random() * 120, 210 + Math.random() * 120, 260 + Math.random() * 140];
  for (const delta of stops) {
    if (skipped) break;
    const target = angle + delta;
    await spinTo(wheel, angle, target, 700 + Math.random() * 400);
    angle = target;
    if (skipped) break;
    await sleep(260);
  }

  if (!skipped) {
    dialWrap.classList.add("is-unlocked");
    await sleep(420);
    content.classList.add("is-dial-done");
    await sleep(300);
  }

  // ---- Warp de estrelas, mesmo com skip (transição curta em vez de instantânea) ----
  const ctx = canvas.getContext("2d");
  let W, H, cx, cy;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
  }
  resize();
  window.addEventListener("resize", resize);

  const STAR_COUNT = 260;
  const stars = Array.from({ length: STAR_COUNT }, () => spawnStar());
  function spawnStar() {
    return { x: (Math.random() - 0.5) * W, y: (Math.random() - 0.5) * H, z: Math.random() * W };
  }

  let speed = 0.3;
  let raf = null;
  function frame() {
    ctx.fillStyle = "rgba(11,14,20,0.4)";
    ctx.fillRect(0, 0, W, H);
    for (const s of stars) {
      const prevZ = s.z;
      s.z -= speed * 6;
      if (s.z <= 1) { Object.assign(s, spawnStar(), { z: W }); continue; }
      const sx = cx + (s.x / s.z) * W, sy = cy + (s.y / s.z) * W;
      const px = cx + (s.x / prevZ) * W, py = cy + (s.y / prevZ) * W;
      const size = Math.max(0.4, (1 - s.z / W) * 2.4);
      ctx.strokeStyle = `rgba(230,237,243,${Math.min(1, (1 - s.z / W) * 1.4)})`;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  const rampStart = performance.now();
  const RAMP_MS = skipped ? 500 : 1400;
  function ramp(now) {
    const t = Math.min(1, (now - rampStart) / RAMP_MS);
    speed = 0.3 + t * t * 26;
    if (t < 1) requestAnimationFrame(ramp);
    else setTimeout(finish, 200);
  }
  requestAnimationFrame(ramp);

  function finish() {
    markSeen();
    screen.classList.add("is-leaving");
    setTimeout(() => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      screen.remove();
      document.body.classList.remove("intro-active");
    }, 500);
  }
}
