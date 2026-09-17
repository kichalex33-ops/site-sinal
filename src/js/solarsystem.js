import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Distâncias, tamanhos e velocidades não estão em escala real (o sistema solar real
// não caberia numa tela, nem uma órbita real seria visível em segundos) — a ordem,
// as texturas e os fatos em cada card são reais.
const BODIES = [
  { id: "sun", nome: "Sol", tipo: "ESTRELA", raio: 26, distancia: 0, textura: "/sistema-solar/sun.jpg", emissive: true,
    fato: "Estrela do tipo G2V. Praticamente toda a luz e o calor do sistema vêm dela.", fonte: "NASA Solar System Exploration.",
    dados: { "Diâmetro": "1.392.700 km", "Temperatura de superfície": "≈ 5.500 °C", "Idade": "≈ 4,6 bilhões de anos" } },
  { id: "mercury", nome: "Mercúrio", tipo: "PLANETA", raio: 3.2, distancia: 50, velocidade: 0.0022, textura: "/sistema-solar/mercury.jpg",
    fato: "O planeta mais próximo do Sol. Sem atmosfera relevante — a face iluminada passa de 400°C, a face escura cai a -180°C.", fonte: "NASA/JPL.",
    dados: { "Diâmetro": "4.879 km", "Distância média do Sol": "57,9 milhões km", "Ano (órbita)": "88 dias terrestres", "Dia (rotação)": "59 dias terrestres", "Luas": "0" } },
  { id: "venus", nome: "Vênus", tipo: "PLANETA", raio: 5.4, distancia: 70, velocidade: 0.0016, textura: "/sistema-solar/venus.jpg",
    fato: "O planeta mais quente do sistema (efeito estufa por CO₂), apesar de mais distante do Sol que Mercúrio.", fonte: "NASA Venus Facts.",
    dados: { "Diâmetro": "12.104 km", "Distância média do Sol": "108,2 milhões km", "Ano (órbita)": "225 dias terrestres", "Dia (rotação)": "243 dias terrestres, retrógrado", "Luas": "0" } },
  { id: "earth", nome: "Terra", tipo: "PLANETA", raio: 5.6, distancia: 94, velocidade: 0.0013, textura: "/sistema-solar/earth.jpg",
    fato: "Até hoje o único corpo do sistema com vida confirmada.", fonte: "NASA Astrobiology.",
    dados: { "Diâmetro": "12.742 km", "Distância média do Sol": "149,6 milhões km (1 UA)", "Ano (órbita)": "365,25 dias", "Dia (rotação)": "24h", "Luas": "1 (a Lua)" },
    luas: [
      { id: "moon", nome: "Lua", tipo: "LUA", raio: 1.5, distancia: 10, velocidade: 0.03, textura: "/sistema-solar/moon.jpg",
        fato: "A única lua da Terra e o único corpo além da Terra já pisado por humanos (missões Apollo, 1969-1972). Provável origem: colisão entre a Terra jovem e um corpo do tamanho de Marte, há ≈ 4,5 bilhões de anos.", fonte: "NASA Apollo / Lunar Science.",
        dados: { "Diâmetro": "3.474 km", "Distância da Terra": "≈ 384.400 km", "Órbita em torno da Terra": "27,3 dias" } },
    ] },
  { id: "mars", nome: "Marte", tipo: "PLANETA", raio: 4.0, distancia: 122, velocidade: 0.001, textura: "/sistema-solar/mars.jpg",
    fato: "Marte já teve vida? Em aberto. Há evidência forte de água líquida e rios antigos (deltas, argilas, sulfatos mapeados pelos rovers) e moléculas orgânicas detectadas pelo Curiosity — nenhuma dessas descobertas confirma vida passada por si só. A missão Mars Sample Return deve trazer amostras à Terra para análise mais conclusiva.", fonte: "NASA Mars Science Laboratory / Perseverance.",
    dados: { "Diâmetro": "6.779 km", "Distância média do Sol": "227,9 milhões km", "Ano (órbita)": "687 dias terrestres", "Dia (rotação)": "24h 37min", "Luas": "2 (Fobos e Deimos)" },
    luas: [
      { id: "phobos", nome: "Fobos", tipo: "LUA", raio: 0.9, distancia: 8, velocidade: 0.05, cor: 0x8a8478,
        fato: "A maior e mais interna das duas luas de Marte, com formato irregular (não é esférica de verdade — o modelo aqui é simplificado). Está em órbita decadente: deve se romper ou colidir com Marte em dezenas de milhões de anos.", fonte: "NASA/JPL Mars Moons." },
      { id: "deimos", nome: "Deimos", tipo: "LUA", raio: 0.6, distancia: 12, velocidade: 0.035, cor: 0x9c948a,
        fato: "A menor e mais externa das luas de Marte, também de formato irregular. Provável origem: asteroide capturado pela gravidade de Marte.", fonte: "NASA/JPL Mars Moons." },
    ] },
  { id: "jupiter", nome: "Júpiter", tipo: "PLANETA", raio: 16, distancia: 168, velocidade: 0.00045, textura: "/sistema-solar/jupiter.jpg",
    fato: "O maior planeta do sistema — sua massa é maior que a de todos os outros planetas somados. Tem ao menos 95 luas conhecidas; clique em Europa, orbitando ao seu redor, para o que interessa de verdade.",
    fonte: "NASA Jupiter Facts.",
    dados: { "Diâmetro": "139.820 km", "Distância média do Sol": "778,5 milhões km", "Ano (órbita)": "≈ 11,9 anos terrestres", "Dia (rotação)": "9h 56min", "Luas conhecidas": "95+" },
    luas: [
      { id: "europa", nome: "Europa", tipo: "LUA", raio: 2.4, distancia: 26, velocidade: 0.012, textura: "/sistema-solar/europa.jpg",
        fato: "O que tem sob o gelo de Europa? Uma casca de gelo sobre um oceano subterrâneo de água salgada — uma das apostas mais fortes de habitabilidade do sistema. A sonda Europa Clipper (NASA, lançada em 2024) está a caminho pra estudar essa habitabilidade, não pra detectar vida diretamente.", fonte: "NASA Europa Clipper.",
        dados: { "Diâmetro": "3.122 km", "Distância de Júpiter": "≈ 671.000 km", "Órbita em torno de Júpiter": "3,55 dias" } },
    ] },
  { id: "saturn", nome: "Saturno", tipo: "PLANETA", raio: 14, distancia: 214, velocidade: 0.00033, textura: "/sistema-solar/saturn.jpg", anel: "/sistema-solar/saturn-ring.png",
    fato: "Conhecido pelos anéis, feitos majoritariamente de gelo de água. Duas de suas luas — Encélado e Titã, orbitando ao redor — estão entre os alvos mais promissores de astrobiologia do sistema.",
    fonte: "NASA Cassini-Huygens.",
    dados: { "Diâmetro": "116.460 km", "Distância média do Sol": "1,43 bilhão km", "Ano (órbita)": "≈ 29,4 anos terrestres", "Dia (rotação)": "10h 33min", "Luas conhecidas": "146+" },
    luas: [
      { id: "enceladus", nome: "Encélado", tipo: "LUA", raio: 1.8, distancia: 20, velocidade: 0.016, textura: "/sistema-solar/enceladus.jpg",
        fato: "A sonda Cassini atravessou as plumas de gêiseres no polo sul e detectou vapor d'água, moléculas orgânicas e grãos de sílica — sinal possível de atividade hidrotermal no oceano interno, sob a crosta de gelo.", fonte: "NASA Cassini-Huygens.",
        dados: { "Diâmetro": "504 km", "Distância de Saturno": "≈ 238.000 km", "Órbita em torno de Saturno": "1,37 dias" } },
      { id: "titan", nome: "Titã", tipo: "LUA", raio: 2.6, distancia: 28, velocidade: 0.009, cor: 0xd9a15c,
        fato: "A única lua do sistema com atmosfera densa. Tem lagos e rios de metano/etano líquido na superfície — química prebiótica ativa, mas muito fria pra água líquida. Em visível, aparece só como uma esfera laranja lisa: a superfície fica escondida sob a neblina, só visível em radar/infravermelho. Será visitada pela missão Dragonfly (NASA) na década de 2030.", fonte: "NASA Cassini-Huygens / Dragonfly.",
        dados: { "Diâmetro": "5.150 km", "Distância de Saturno": "≈ 1,2 milhão km", "Órbita em torno de Saturno": "15,95 dias" } },
    ] },
  { id: "uranus", nome: "Urano", tipo: "PLANETA", raio: 9, distancia: 250, velocidade: 0.00019, textura: "/sistema-solar/uranus.jpg",
    fato: "Gira praticamente deitado — seu eixo de rotação está inclinado ≈98°, provavelmente por uma colisão antiga. Um dia em cada polo passa por décadas seguidas de luz ou escuridão contínua.", fonte: "NASA Uranus Facts.",
    dados: { "Diâmetro": "50.724 km", "Distância média do Sol": "2,87 bilhões km", "Ano (órbita)": "≈ 84 anos terrestres", "Dia (rotação)": "17h 14min", "Luas conhecidas": "28" } },
  { id: "neptune", nome: "Netuno", tipo: "PLANETA", raio: 8.7, distancia: 284, velocidade: 0.00012, textura: "/sistema-solar/neptune.jpg",
    fato: "O planeta com os ventos mais rápidos já medidos no sistema solar, chegando a quase 2.100 km/h. Foi previsto por cálculo matemático (perturbações na órbita de Urano) antes de ser observado.", fonte: "NASA Neptune Facts.",
    dados: { "Diâmetro": "49.244 km", "Distância média do Sol": "4,50 bilhões km", "Ano (órbita)": "≈ 165 anos terrestres", "Dia (rotação)": "16h 6min", "Luas conhecidas": "16" } },
  { id: "pluto", nome: "Plutão", tipo: "PLANETA ANÃO", raio: 2.2, distancia: 312, velocidade: 0.00008, textura: "/sistema-solar/pluto.jpg",
    fato: "Classificado como planeta até 2006, quando a União Astronômica Internacional criou a categoria \"planeta anão\" após a descoberta de outros corpos do mesmo porte no Cinturão de Kuiper. A sonda New Horizons (NASA) sobrevoou Plutão em 2015 e fez o mapa usado nesta textura — revelou montanhas de gelo de água e uma planície de nitrogênio congelado (a \"Tombaugh Regio\", o formato de coração).", fonte: "NASA New Horizons.",
    dados: { "Diâmetro": "2.377 km", "Distância média do Sol": "≈ 5,9 bilhões km", "Ano (órbita)": "≈ 248 anos terrestres", "Dia (rotação)": "6,4 dias terrestres", "Luas conhecidas": "5 (a maior: Caronte)" } },
];

const ZOOM_MARGIN = 4.2;

export function initSolarSystem(container) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 3000);
  camera.position.set(0, 130, 280);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 6;
  controls.maxDistance = 800;

  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const sunLight = new THREE.PointLight(0xffffff, 2.4, 0, 0);
  scene.add(sunLight);

  const loader = new THREE.TextureLoader();
  const clickable = [];
  const orbitals = []; // planetas ao redor do Sol
  const moonOrbitals = []; // luas ao redor do planeta-pai

  function buildBody(bodyDef, parentGroup) {
    const geo = new THREE.SphereGeometry(bodyDef.raio, 48, 48);
    const mat = bodyDef.emissive
      ? new THREE.MeshBasicMaterial({ map: loader.load(bodyDef.textura) })
      : bodyDef.textura
        ? new THREE.MeshStandardMaterial({ map: loader.load(bodyDef.textura), roughness: 1 })
        : new THREE.MeshStandardMaterial({ color: bodyDef.cor, roughness: 1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.body = bodyDef;
    parentGroup.add(mesh);
    clickable.push(mesh);
    return mesh;
  }

  for (const body of BODIES) {
    const mesh = buildBody(body, scene);
    mesh.position.set(body.distancia, 0, 0);

    if (body.anel) {
      const ringTex = loader.load(body.anel);
      const ringGeo = new THREE.RingGeometry(body.raio * 1.3, body.raio * 2.2, 64);
      const pos = ringGeo.attributes.position;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        ringGeo.attributes.uv.setXY(i, v3.length() < body.raio * 1.75 ? 0 : 1, 1);
      }
      const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, side: THREE.DoubleSide, transparent: true });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3;
      mesh.add(ring);
    }

    if (body.distancia > 0) {
      const orbitGeo = new THREE.RingGeometry(body.distancia - 0.15, body.distancia + 0.15, 128);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x3a4152, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
      orbitals.push({ mesh, distancia: body.distancia, velocidade: body.velocidade, angulo: Math.random() * Math.PI * 2 });
    }

    for (const lua of body.luas || []) {
      const luaMesh = buildBody(lua, mesh);
      luaMesh.position.set(lua.distancia, 0, 0);

      const moonOrbitGeo = new THREE.RingGeometry(lua.distancia - 0.08, lua.distancia + 0.08, 64);
      const moonOrbitMat = new THREE.MeshBasicMaterial({ color: 0x4a5266, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
      const moonOrbit = new THREE.Mesh(moonOrbitGeo, moonOrbitMat);
      moonOrbit.rotation.x = Math.PI / 2;
      mesh.add(moonOrbit);

      moonOrbitals.push({ mesh: luaMesh, distancia: lua.distancia, velocidade: lua.velocidade, angulo: Math.random() * Math.PI * 2 });
    }
  }

  // ---- Easter egg: nave-mãe escondida + naves pequenas indo e vindo ----
  // Não é dado real. É brincadeira — a própria ficha, ao clicar, deixa isso explícito.
  const EASTER_EGG_BODY = {
    raio: 4,
    tipo: "UAP",
    nome: "??? (você achou)",
    fato: "Isso não é um dado real do sistema solar — é um easter egg escondido de propósito. Nenhum objeto como esse foi observado ou catalogado por nenhuma agência espacial. \"Não identificado\" não significa extraterrestre — e \"escondido pelo site\" significa exatamente isso: uma brincadeira.",
    fonte: "Easter egg do SINAL/RUÍDO.",
  };

  // Luzes piscantes nos cantos — como nos relatos e fotos de "triângulo preto"
  // (o próprio caso Onda Belga / Petit-Rechain do arquivo descreve isso).
  const blinkLights = [];
  function addBlinkLight(parent, position, color, speed) {
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color, transparent: true }));
    light.position.copy(position);
    parent.add(light);
    blinkLights.push({ mesh: light, phase: Math.random() * Math.PI * 2, speed });
    return light;
  }

  function buildMothership() {
    const group = new THREE.Group();
    const R = 4; // pequena de propósito — menor que Mercúrio, pra não competir com os planetas
    const shape = new THREE.Shape();
    shape.moveTo(0, R);
    shape.lineTo(-R * 0.62, -R * 0.72);
    shape.lineTo(R * 0.62, -R * 0.72);
    shape.closePath();
    const hullGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.6, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 });
    hullGeo.rotateX(Math.PI / 2);
    hullGeo.translate(0, -0.3, 0);
    const hull = new THREE.Mesh(hullGeo, new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.2, roughness: 0.85 }));
    group.add(hull);

    const bridge = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 1, 4),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.15, roughness: 0.9 })
    );
    bridge.position.set(0, 0.45, R * 0.1);
    bridge.rotation.y = Math.PI / 4;
    group.add(bridge);

    // três luzes de canto (clássico "triângulo preto") + uma central pulsando devagar
    addBlinkLight(group, new THREE.Vector3(0, 0.15, R * 0.85), 0xffffff, 2.2);
    addBlinkLight(group, new THREE.Vector3(-R * 0.55, 0.15, -R * 0.6), 0xffffff, 1.7);
    addBlinkLight(group, new THREE.Vector3(R * 0.55, 0.15, -R * 0.6), 0xffffff, 1.9);
    addBlinkLight(group, new THREE.Vector3(0, 0.15, -R * 0.15), 0xe8541d, 0.8);

    group.traverse((c) => { if (c.isMesh) c.userData.body = EASTER_EGG_BODY; });
    group.userData.body = EASTER_EGG_BODY;
    return group;
  }

  function buildFighter() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.2, roughness: 0.85 })
    );
    body.rotation.x = Math.PI / 2;
    group.add(body);
    addBlinkLight(group, new THREE.Vector3(0, 0, -0.7), 0xffffff, 1.5);
    group.traverse((c) => { if (c.isMesh) c.userData.body = EASTER_EGG_BODY; });
    group.userData.body = EASTER_EGG_BODY;
    return group;
  }

  const mothership = buildMothership();
  const shipHome = new THREE.Vector3();
  // trajeto lento e discreto, numa órbita grande e inclinada, cruzando o sistema aos poucos
  const motherOrbit = { radius: 205, tilt: 0.42, angulo: Math.random() * Math.PI * 2, velocidade: 0.00006 };
  function updateMothershipPosition() {
    shipHome.set(
      Math.cos(motherOrbit.angulo) * motherOrbit.radius,
      Math.sin(motherOrbit.angulo * 0.7) * motherOrbit.radius * motherOrbit.tilt * 0.3,
      Math.sin(motherOrbit.angulo) * motherOrbit.radius * Math.cos(motherOrbit.tilt)
    );
    mothership.position.copy(shipHome);
  }
  updateMothershipPosition();
  scene.add(mothership);
  clickable.push(mothership);

  const planetTargets = orbitals; // reaproveita as posições (mundiais) dos planetas já calculadas por frame
  const SHIP_COUNT = 3; // poucas, de propósito — isso é um easter egg, não um efeito chamativo
  const ships = [];
  for (let i = 0; i < SHIP_COUNT; i++) {
    const mesh = buildFighter();
    mesh.visible = false;
    scene.add(mesh);
    clickable.push(mesh);
    ships.push({
      mesh,
      role: i === 0 ? "wander" : "shuttle", // 1 vagando à toa, o resto fazendo idas e vindas raras
      state: "docked",
      from: shipHome.clone(),
      to: shipHome.clone(),
      timer: 6 + Math.random() * 20, // atraso inicial — nada acontece assim que a página abre
      duration: 1,
    });
  }

  function randomPointNear(center, spread) {
    return center.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 0.4,
      (Math.random() - 0.5) * spread
    ));
  }

  function updateShips() {
    for (const ship of ships) {
      ship.timer -= 1 / 60;
      if (ship.timer > 0) continue;

      if (ship.role === "wander") {
        ship.mesh.visible = true;
        ship.from.copy(ship.mesh.position.length() ? ship.mesh.position : shipHome);
        ship.to.copy(randomPointNear(shipHome, 120));
        ship.duration = 8 + Math.random() * 8;
        ship.timer = ship.duration + Math.random() * 12; // pausa entre um trecho e outro
        ship._start = performance.now();
        ship.state = "wandering";
        continue;
      }

      // shuttle: docked -> pousando num planeta -> pousado -> voltando -> docked
      if (ship.state === "docked") {
        const target = planetTargets[Math.floor(Math.random() * planetTargets.length)];
        if (!target) { ship.timer = 10; continue; }
        ship.mesh.visible = true;
        ship.mesh.position.copy(shipHome);
        ship.from.copy(shipHome);
        ship.to.copy(target.mesh.position).add(new THREE.Vector3(0, target.mesh.geometry?.parameters?.radius ? target.mesh.geometry.parameters.radius + 1.5 : 4, 0));
        ship.duration = 6 + Math.random() * 5;
        ship.timer = ship.duration;
        ship._start = performance.now();
        ship.state = "toPlanet";
      } else if (ship.state === "toPlanet") {
        ship.state = "landed";
        ship.timer = 4 + Math.random() * 6;
      } else if (ship.state === "landed") {
        ship.from.copy(ship.mesh.position);
        ship.to.copy(shipHome);
        ship.duration = 6 + Math.random() * 5;
        ship.timer = ship.duration;
        ship._start = performance.now();
        ship.state = "toMothership";
      } else if (ship.state === "toMothership") {
        ship.mesh.visible = false; // "entrou" na nave-mãe
        ship.state = "docked";
        ship.timer = 20 + Math.random() * 40; // fica bastante tempo parada antes da próxima saída
      }
    }
  }

  function frameShips() {
    for (const ship of ships) {
      if (ship.state !== "wandering" && ship.state !== "toPlanet" && ship.state !== "toMothership") continue;
      const t = Math.min(1, (performance.now() - ship._start) / (ship.duration * 1000));
      const e = t * t * (3 - 2 * t); // smoothstep
      const arc = Math.sin(t * Math.PI) * 10;
      ship.mesh.position.lerpVectors(ship.from, ship.to, e);
      ship.mesh.position.y += arc * 0.15;
      ship.mesh.lookAt(ship.to);
    }
  }

  // ---- Cinturão de asteroides: banda de rochas entre Marte (122) e Júpiter (168) ----
  const ASTEROID_COUNT = 900;
  const asteroidPositions = new Float32Array(ASTEROID_COUNT * 3);
  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const r = 132 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 5;
    asteroidPositions[i * 3] = Math.cos(theta) * r;
    asteroidPositions[i * 3 + 1] = y;
    asteroidPositions[i * 3 + 2] = Math.sin(theta) * r;
  }
  const asteroidGeo = new THREE.BufferGeometry();
  asteroidGeo.setAttribute("position", new THREE.BufferAttribute(asteroidPositions, 3));
  scene.add(new THREE.Points(asteroidGeo, new THREE.PointsMaterial({ color: 0x9c8f7a, size: 0.7, opacity: 0.8, transparent: true })));

  // ---- Campo de fundo: estrelas ----
  const STAR_COUNT = 1800;
  const starPositions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 900 + Math.random() * 500;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xe6edf3, size: 1.3, opacity: 0.7, transparent: true })));

  const panel = document.createElement("div");
  panel.className = "starmap__panel";
  panel.hidden = true;
  container.appendChild(panel);

  function showPanel(body) {
    panel.hidden = false;
    panel.innerHTML = `
      <span class="mono starmap__panel-type">${body.tipo}</span>
      <h3>${body.nome}</h3>
      ${body.dados ? `<dl class="starmap__panel-data">${Object.entries(body.dados).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>` : ""}
      <p>${body.fato}</p>
      <p class="mono starmap__panel-source">${body.fonte}</p>
      <button type="button" class="starmap__panel-close" aria-label="Fechar">×</button>
    `;
    panel.querySelector(".starmap__panel-close").addEventListener("click", () => { panel.hidden = true; });
  }

  // ---- Zoom suave até o corpo clicado ----
  let flyTo = null;
  function focusOn(mesh, bodyDef) {
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);
    const dist = Math.max(bodyDef.raio * ZOOM_MARGIN, 14);
    const offset = camera.position.clone().sub(controls.target).normalize().multiplyScalar(dist);
    flyTo = {
      fromTarget: controls.target.clone(),
      toTarget: worldPos.clone(),
      fromPos: camera.position.clone(),
      toPos: worldPos.clone().add(offset),
      start: performance.now(),
      duration: reduceMotion ? 0 : 900,
    };
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  renderer.domElement.addEventListener("pointerdown", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickable, true);
    if (hits.length) {
      const found = findBody(hits[0].object);
      if (found) {
        showPanel(found.body);
        focusOn(found.mesh, found.body);
        if (found.body === EASTER_EGG_BODY) window.dispatchEvent(new CustomEvent("sr:uap-found"));
      }
    }
  });

  function findBody(object) {
    let o = object;
    while (o) {
      if (o.userData && o.userData.body) return { mesh: o, body: o.userData.body };
      o = o.parent;
    }
    return null;
  }

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  function frame() {
    if (!reduceMotion) {
      for (const o of orbitals) {
        o.angulo += o.velocidade;
        o.mesh.position.set(Math.cos(o.angulo) * o.distancia, 0, Math.sin(o.angulo) * o.distancia);
        o.mesh.rotation.y += 0.004;
      }
      for (const o of moonOrbitals) {
        o.angulo += o.velocidade;
        o.mesh.position.set(Math.cos(o.angulo) * o.distancia, 0, Math.sin(o.angulo) * o.distancia);
      }
      motherOrbit.angulo += motherOrbit.velocidade;
      updateMothershipPosition();
      updateShips();
      frameShips();

      for (const b of blinkLights) {
        b.phase += b.speed / 60;
        const pulse = Math.max(0, Math.sin(b.phase)) ** 6; // pisca rápido, fica apagada a maior parte do tempo
        b.mesh.material.opacity = 0.08 + pulse * 0.85;
      }
    }

    if (flyTo) {
      const t = flyTo.duration === 0 ? 1 : Math.min(1, (performance.now() - flyTo.start) / flyTo.duration);
      const e = 1 - Math.pow(1 - t, 3); // ease-out
      camera.position.lerpVectors(flyTo.fromPos, flyTo.toPos, e);
      controls.target.lerpVectors(flyTo.fromTarget, flyTo.toTarget, e);
      if (t >= 1) flyTo = null;
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
