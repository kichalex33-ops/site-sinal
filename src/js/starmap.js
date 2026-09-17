import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const RADIUS = 500;

function toVector(raDeg, decDeg, radius) {
  const ra = (raDeg * Math.PI) / 180;
  const dec = (decDeg * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(dec) * Math.cos(ra),
    radius * Math.sin(dec),
    radius * Math.cos(dec) * Math.sin(ra)
  );
}

function markerColor(point) {
  return point.provenance === "instrumental" ? 0xe8541d : 0x8b7fc7;
}

export function initStarmap(container, points) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 4000);
  camera.position.set(0, 0, 900);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 200;
  controls.maxDistance = 1600;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.35;

  // ---- Campo de fundo: estrelas aleatórias numa esfera grande ----
  const STAR_COUNT = 2400;
  const starPositions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 1400 + Math.random() * 600;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xe6edf3, size: 1.6, sizeAttenuation: true, opacity: 0.75, transparent: true });
  scene.add(new THREE.Points(starGeo, starMat));

  // ---- Marcadores dos casos ----
  const markerGroup = new THREE.Group();
  const markers = points.map((p) => {
    const pos = toVector(p.raDecimal, p.decDecimal, RADIUS);
    const geo = new THREE.SphereGeometry(6, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: markerColor(p) });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.userData.point = p;

    const glowGeo = new THREE.SphereGeometry(14, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: markerColor(p), transparent: true, opacity: 0.18 });
    mesh.add(new THREE.Mesh(glowGeo, glowMat));

    markerGroup.add(mesh);
    return mesh;
  });
  scene.add(markerGroup);

  // ---- Interação: clique/hover num marcador mostra o painel de informação ----
  const panel = document.createElement("div");
  panel.className = "starmap__panel";
  panel.hidden = true;
  container.appendChild(panel);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function showPanel(point) {
    panel.hidden = false;
    panel.innerHTML = `
      <span class="mono starmap__panel-type">${point.tipo.toUpperCase()} · ${point.constelacao}</span>
      <h3>${point.titulo}</h3>
      <p>${point.contexto}</p>
      <p class="mono starmap__panel-source">${point.fonte}</p>
      <a class="mono" href="/casos/${point.caseSlug}/">Ver dossiê do caso →</a>
      <button type="button" class="starmap__panel-close" aria-label="Fechar">×</button>
    `;
    panel.querySelector(".starmap__panel-close").addEventListener("click", () => { panel.hidden = true; });
  }

  function onPointerDown(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(markers, false);
    if (hits.length) showPanel(hits[0].object.userData.point);
  }
  renderer.domElement.addEventListener("pointerdown", onPointerDown);

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  function frame() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
