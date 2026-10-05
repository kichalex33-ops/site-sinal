import {translateEditorText} from './cover-editor-i18n.js';
const en=document.documentElement.lang.startsWith('en');
const t=text=>en?translateEditorText(text):text;
const inspectorEmpty=document.getElementById('inspectorEmpty'),inspectorBody=document.getElementById('inspectorBody');
/* =====================================================================
   BOOKCOVER STUDIO
   ---------------------------------------------------------------------
   Conversão cm → px a 300 DPI:
      1 polegada = 2.54 cm
      px = cm / 2.54 * 300   →   cm × 118.11023622
   ===================================================================== */

const DPI      = 300;
const CM_TO_PX = DPI / 2.54;   // 118.11023622047244 px por cm
const PX_TO_CM = 2.54 / DPI;   // 0.0084666... cm por px
const PT_TO_PX = DPI / 72;     // 4.1666... px por pt (a 300 DPI)

/* Tabela de papéis — espessura por FOLHA (a fórmula usa páginas/2) */
const PAPERS = [
  { id: 'polen90',     label: t('Pólen 90g'),          thick: 0.0130 },
  { id: 'polen80',     label: t('Pólen 80g'),          thick: 0.0115 },
  { id: 'offset75',    label: t('Offset 75g'),         thick: 0.0100 },
  { id: 'offset90',    label: t('Offset 90g'),         thick: 0.0120 },
  { id: 'sulfite75',   label: t('Sulfite 75g'),        thick: 0.0100 },
  { id: 'couche115',   label: t('Couché Matte 115g'),  thick: 0.0095 },
  { id: 'reciclato90', label: t('Reciclato 90g'),      thick: 0.0125 },
  { id: 'polen120',    label: t('Pólen 120g'),         thick: 0.0160 },
];

/* Áreas onde imagens podem ser aplicadas (independentes entre si) */
const IMG_AREAS = [
  { id: 'full',      label: t('Capa inteira (base)') },
  { id: 'flapLeft',  label: t('Orelha esquerda') },
  { id: 'back',      label: t('Contracapa') },
  { id: 'spine',     label: t('Lombada') },
  { id: 'front',     label: t('Capa (frente)') },
  { id: 'flapRight', label: t('Orelha direita') },
];

const $ = (id) => document.getElementById(id);

/* ---------------- Estado global ---------------- */
const S = {
  pageW: 14.8, pageH: 21.0, pages: 150, flap: 8.0,
  paper: 'polen90', bgColor: '#ffffff',
  bleed: 0.5,            // sangria (cm) em cada borda externa
  exportBleed: true,     // incluir sangria no arquivo exportado?
  showGuides: true, showZones: true,
  /* Cada área guarda sua própria imagem e ajuste — nenhuma substitui a outra */
  images: {
    full:      { data: null, fit: 'cover' },
    flapLeft:  { data: null, fit: 'cover' },
    back:      { data: null, fit: 'cover' },
    spine:     { data: null, fit: 'cover' },
    front:     { data: null, fit: 'cover' },
    flapRight: { data: null, fit: 'cover' },
  },
  imgTarget: 'front',    // área atualmente selecionada no painel
  zoom: 0.35,
};

const AB           = $('artboard');
const STAGE        = $('stage');
const WORKSPACE    = $('workspace');
const layerBg      = $('layerBg');
const layerZones   = $('layerZones');
const layerGuides  = $('layerGuides');
const layerContent = $('layerContent');

/* =====================================================================
   HELPERS
   ===================================================================== */
const cmToPx = (cm) => cm * CM_TO_PX;
const pxToCm = (px) => px * PX_TO_CM;

function toast(msg, ms = 2200) {
  const t = $('toast');
  t.textContent = en ? translateEditorText(msg) : msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), ms);
}

/* =====================================================================
   MÉTRICAS DO DOCUMENTO
   ===================================================================== */
function getMetrics() {
  const paper  = PAPERS.find(p => p.id === S.paper) || PAPERS[0];
  const spine  = (S.pages / 2) * paper.thick;                          // cm
  const totalW = (2 * S.bleed) + (2 * S.flap) + (2 * S.pageW) + spine; // cm
  const totalH = (2 * S.bleed) + S.pageH;                              // cm
  return { paper, spine, totalW, totalH };
}

/* Posições (em cm) das colunas horizontais, da esquerda para a direita */
function getColumns(m) {
  const x0 = 0;                       // sangria esq.
  const x1 = S.bleed;                 // início orelha esq.
  const x2 = x1 + S.flap;             // início contracapa
  const x3 = x2 + S.pageW;            // início lombada
  const x4 = x3 + m.spine;            // início capa
  const x5 = x4 + S.pageW;            // início orelha dir.
  const x6 = x5 + S.flap;             // início sangria dir.
  const x7 = x6 + S.bleed;            // fim do documento
  return { x0, x1, x2, x3, x4, x5, x6, x7 };
}

/* =====================================================================
   POPULAR O SELECT DE PAPEL
   ===================================================================== */
function initPaperSelect() {
  const sel = $('inPaper');
  sel.innerHTML = '';
  PAPERS.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.label} — ${p.thick.toFixed(4).replace('.', en ? '.' : ',')} ${en ? 'cm/sheet' : 'cm/folha'}`;
    sel.appendChild(opt);
  });
  sel.value = S.paper;
  sel.addEventListener('change', (e) => {
    S.paper = e.target.value;
    rebuild();
  });
}

/* =====================================================================
   POPULAR O SELECT DE ÁREA DE IMAGEM  (NOVO)
   ===================================================================== */
function initImgAreaSelect() {
  const sel = $('inImgArea');
  sel.innerHTML = '';
  IMG_AREAS.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.label;
    sel.appendChild(opt);
  });
  sel.value = S.imgTarget;

  sel.addEventListener('change', (e) => {
    S.imgTarget = e.target.value;
    syncImgPanel();
  });

  syncImgPanel();
}

/* Reflete o estado da área selecionada no painel */
function syncImgPanel() {
  const cur = S.images[S.imgTarget];
  $('inImgFit').value = cur.fit;
  $('inImage').value  = '';           // limpa o input (para permitir recarregar o mesmo arquivo)
  updateImgStatus();
}

/* Lista quais áreas já têm imagem carregada */
function updateImgStatus() {
  const loaded = IMG_AREAS
    .filter(a => S.images[a.id].data)
    .map(a => a.label.replace(' (base)', ''));
  $('imgStatus').textContent = loaded.length
    ? t('✓ Com imagem: ') + loaded.join(' · ')
    : t('Nenhuma imagem carregada ainda.');
}

/* =====================================================================
   CONSTRUÇÃO DA ARTBOARD (zonas + guias)
   ===================================================================== */
function rebuild() {
  const m = getMetrics();
  const Wpx = cmToPx(m.totalW);
  const Hpx = cmToPx(m.totalH);

  AB.style.width  = Wpx + 'px';
  AB.style.height = Hpx + 'px';
  AB.style.background = S.bgColor;

  STAGE.style.width  = (Wpx * S.zoom) + 'px';
  STAGE.style.height = (Hpx * S.zoom) + 'px';
  AB.style.transform = `scale(${S.zoom})`;

  buildBackground(m, Wpx, Hpx);
  buildZones(m, Wpx, Hpx);
  buildGuides(m, Wpx, Hpx);

  updateSummary(m, Wpx, Hpx);
  updateGuideScale();
}

/* ---------------- Fundo: desenha cada área com sua própria imagem ------- */
function buildBackground(m, Wpx, Hpx) {
  layerBg.innerHTML = '';
  layerBg.style.background = S.bgColor;

  const c = getColumns(m);

  /* Mapeia cada área para sua faixa horizontal (em cm) dentro do documento */
  const regionOf = (id) => {
    switch (id) {
      case 'full':      return { left: 0,     width: m.totalW };
      case 'flapLeft':  return { left: c.x1,  width: S.flap };
      case 'back':      return { left: c.x2,  width: S.pageW };
      case 'spine':     return { left: c.x3,  width: m.spine };
      case 'front':     return { left: c.x4,  width: S.pageW };
      case 'flapRight': return { left: c.x5,  width: S.flap };
    }
    return null;
  };

  /* Ordem de desenho: 'full' primeiro (base) e depois as áreas específicas
     por cima. Assim o usuário pode usar 1 imagem geral OU composições
     separadas por área. */
  const drawOrder = ['full', 'flapLeft', 'back', 'spine', 'front', 'flapRight'];

  drawOrder.forEach(id => {
    const slot = S.images[id];
    if (!slot || !slot.data) return;

    const r = regionOf(id);
    if (!r || r.width <= 0) return;

    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position:absolute;
      left:${cmToPx(r.left)}px; top:0;
      width:${cmToPx(r.width)}px; height:${Hpx}px;
      overflow:hidden;
    `;

    wrap.style.backgroundImage = 'url("'+slot.data+'")';
    wrap.style.backgroundPosition = 'center';
    wrap.style.backgroundRepeat = 'no-repeat';
    wrap.style.backgroundSize = slot.fit === 'fill' ? '100% 100%' : slot.fit;
    layerBg.appendChild(wrap);
  });
}

/* ---------------- Zonas (áreas coloridas + rótulos) ---------------- */
function buildZones(m, Wpx, Hpx) {
  layerZones.innerHTML = '';
  if (!S.showZones) return;

  const c = getColumns(m);
  const topTrim = cmToPx(S.bleed);
  const botTrim = Hpx - cmToPx(S.bleed);
  const hInner = botTrim - topTrim;

  const zones = [
    { x: c.x1, w: S.flap, cls: 'flap',  label: t('ORELHA') },
    { x: c.x2, w: S.pageW, cls: 'page', label: t('CONTRACAPA') },
    { x: c.x3, w: m.spine, cls: 'spine', label: t('LOMBADA'), vert: true },
    { x: c.x4, w: S.pageW, cls: 'page', label: t('CAPA') },
    { x: c.x5, w: S.flap, cls: 'flap',  label: t('ORELHA') },
  ];

  zones.forEach(z => {
    const el = document.createElement('div');
    el.className = `zone ${z.cls}`;
    el.style.left   = cmToPx(z.x) + 'px';
    el.style.top    = topTrim + 'px';
    el.style.width  = cmToPx(z.w) + 'px';
    el.style.height = hInner + 'px';

    const lab = document.createElement('div');
    lab.className = 'zlabel' + (z.vert ? ' vert' : '');
    lab.textContent = z.label;
    el.appendChild(lab);

    layerZones.appendChild(el);
  });
}

/* ---------------- Guias (corte + vincos) ---------------- */
function buildGuides(m, Wpx, Hpx) {
  layerGuides.innerHTML = '';
  if (!S.showGuides) return;

  const c = getColumns(m);
  const bleedPx = cmToPx(S.bleed);

  /* Linhas de CORTE (sangria) — 4 linhas tracejadas magenta */
  addGuide('v', 'trim', bleedPx);
  addGuide('v', 'trim', Wpx - bleedPx);
  addGuide('h', 'trim', bleedPx);
  addGuide('h', 'trim', Hpx - bleedPx);

  /* Linhas de VINCO (dobras) — 5 verticais tracejadas ciano */
  [c.x1, c.x2, c.x3, c.x4, c.x5].forEach(xcm => {
    if (xcm > 0.001 && xcm < m.totalW - 0.001) {
      addGuide('v', 'fold', cmToPx(xcm));
    }
  });

  function addGuide(dir, kind, pos) {
    const g = document.createElement('div');
    g.className = `guide ${kind} ${dir}`;
    if (dir === 'v') g.style.left = pos + 'px';
    else             g.style.top  = pos + 'px';
    layerGuides.appendChild(g);
  }
}

/* =====================================================================
   ZOOM
   ===================================================================== */
function updateGuideScale() {
  const z = S.zoom;
  AB.style.setProperty('--gw',   (1.5 / z) + 'px');
  AB.style.setProperty('--dash', (12  / z) + 'px');
  AB.style.setProperty('--lfs',  (11  / z) + 'px');
}

function applyZoom(newZoom) {
  S.zoom = Math.max(0.005, Math.min(4, newZoom));
  const m = getMetrics();
  const Wpx = cmToPx(m.totalW);
  const Hpx = cmToPx(m.totalH);

  STAGE.style.width  = (Wpx * S.zoom) + 'px';
  STAGE.style.height = (Hpx * S.zoom) + 'px';
  AB.style.transform = `scale(${S.zoom})`;

  $('zoomLabel').textContent = Math.round(S.zoom * 100) + '%';
  updateGuideScale();
}

function zoomToFit() {
  const m = getMetrics();
  const Wpx = cmToPx(m.totalW);
  const Hpx = cmToPx(m.totalH);
  const pad = innerWidth <= 900 ? 48 : 64;
  const zx = (WORKSPACE.clientWidth  - pad) / Wpx;
  const zy = (WORKSPACE.clientHeight - pad) / Hpx;
  applyZoom(Math.min(zx, zy, 1));
}

/* =====================================================================
   RESUMO NUMÉRICO (sidebar)
   ===================================================================== */
function updateSummary(m, Wpx, Hpx) {
  $('sPaper').textContent  = m.paper.label;
  $('sThick').textContent  = m.paper.thick.toFixed(4).replace('.', en ? '.' : ',') + ' cm';
  $('sSpine').textContent  = m.spine.toFixed(3).replace('.', en ? '.' : ',') + ' cm';
  $('sTotalW').textContent = m.totalW.toFixed(2).replace('.', en ? '.' : ',') + ' cm';
  $('sTotalH').textContent = m.totalH.toFixed(2).replace('.', en ? '.' : ',') + ' cm';
  $('sPx').textContent     = `${Math.round(Wpx)} × ${Math.round(Hpx)} px`;
}

/* =====================================================================
   BLOCOS DE TEXTO  (inalterado)
   ===================================================================== */
let blocks = [];
let nextId = 1;
let selectedId = null;

function addBlock(opts = {}) {
  const m = getMetrics();
  const c = getColumns(m);

  const b = {
    id: nextId++,
    text: opts.text ?? t('Digite aqui'),
    x: opts.x ?? cmToPx(c.x4 + S.pageW * 0.15),
    y: opts.y ?? cmToPx(S.bleed + S.pageH * 0.35),
    w: opts.w ?? cmToPx(S.pageW * 0.7),
    font: opts.font ?? "'Playfair Display', Georgia, serif",
    size: opts.size ?? 36,
    color: opts.color ?? '#111111',
    align: opts.align ?? 'center',
    bold: opts.bold ?? true,
    italic: opts.italic ?? false,
  };
  blocks.push(b);
  renderBlock(b);
  selectBlock(b.id);
  return b;
}

function renderBlock(b) {
  const el = document.createElement('div');
  el.className = 'tblock';
  el.dataset.id = b.id;
  el.tabIndex=0;el.setAttribute('role','button');
  el.setAttribute('aria-label',en?'Select text block':'Selecionar bloco de texto');
  el.addEventListener('keydown',e=>{if(e.target!==el)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();selectBlock(b.id);if(innerWidth<=900)showEditorPanel('properties');document.getElementById('pText').focus();}});

  const inner = document.createElement('div');
  inner.className = 'tb-inner';
  inner.textContent = b.text;
  el.appendChild(inner);

  layerContent.appendChild(el);
  b.el = el;
  b.inner = inner;

  applyBlockStyle(b);
  positionBlock(b);
  attachBlockEvents(b);
}

function applyBlockStyle(b) {
  const inner = b.inner;
  inner.style.fontFamily = b.font;
  inner.style.fontSize   = (b.size * PT_TO_PX) + 'px';
  inner.style.color      = b.color;
  inner.style.textAlign  = b.align;
  inner.style.fontWeight = b.bold ? '800' : '400';
  inner.style.fontStyle  = b.italic ? 'italic' : 'normal';
  inner.style.lineHeight = '1.15';
  b.el.style.width = b.w + 'px';
}

function positionBlock(b) {
  b.el.style.left = b.x + 'px';
  b.el.style.top  = b.y + 'px';
}

function selectBlock(id) {
  if (selectedId && selectedId !== id) {
    const prev = blocks.find(x => x.id === selectedId);
    if (prev && prev.el) prev.el.classList.remove('selected');
  }
  selectedId = id;

  if (id == null) {
    inspectorEmpty.hidden = false;
    inspectorBody.hidden  = true;
    return;
  }
  const b = blocks.find(x => x.id === id);
  if (!b) return;
  b.el.classList.add('selected');
  inspectorEmpty.hidden = true;
  inspectorBody.hidden  = false;
  syncInspector(b);
}

function attachBlockEvents(b) {
  b.el.addEventListener('pointerdown', (e) => {
    if (b.el.classList.contains('editing')) return;
    if (e.button !== 0) return;
    e.preventDefault();
    selectBlock(b.id);

    const startX = e.clientX, startY = e.clientY;
    const ox = b.x, oy = b.y;

    b.el.setPointerCapture(e.pointerId);

    const onMove = (ev) => {
      const dx = (ev.clientX - startX) / S.zoom;
      const dy = (ev.clientY - startY) / S.zoom;
      b.x = ox + dx;
      b.y = oy + dy;
      positionBlock(b);
      syncInspectorPosition(b);
    };
    const onUp = () => {
      try { b.el.releasePointerCapture(e.pointerId); } catch (_) {}
      b.el.removeEventListener('pointermove', onMove);
      b.el.removeEventListener('pointerup', onUp);
      b.el.removeEventListener('pointercancel', onUp);
    };
    b.el.addEventListener('pointermove', onMove);
    b.el.addEventListener('pointerup', onUp);
    b.el.addEventListener('pointercancel', onUp);
  });

  b.el.addEventListener('dblclick', (e) => {
    e.preventDefault();
    startEditing(b);
  });
}

function startEditing(b) {
  b.el.classList.add('editing');
  b.inner.contentEditable = 'true';
  b.inner.focus();

  const r = document.createRange();
  r.selectNodeContents(b.inner);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(r);

  const finish = () => {
    b.text = b.inner.innerText.replace(/\u00A0/g, ' ');
    b.inner.contentEditable = 'false';
    b.el.classList.remove('editing');
    syncInspector(b);
  };
  b.inner.addEventListener('blur', finish, { once: true });

  b.inner.addEventListener('keydown', function onKey(ev) {
    if (ev.key === 'Escape') { ev.preventDefault(); b.inner.blur(); }
  });
}

function deleteBlock(id) {
  const idx = blocks.findIndex(b => b.id === id);
  if (idx === -1) return;
  const b = blocks[idx];
  if (b.el && b.el.parentNode) b.el.parentNode.removeChild(b.el);
  blocks.splice(idx, 1);
  if (selectedId === id) selectBlock(null);
}

/* =====================================================================
   INSPECTOR (painel direito)  (inalterado)
   ===================================================================== */
function syncInspector(b) {
  $('pText').value   = b.text;
  $('pFont').value   = b.font;
  $('pSize').value   = b.size;
  $('pColor').value  = b.color;
  $('pAlign').value  = b.align;
  $('pBold').classList.toggle('active', b.bold);
  $('pItalic').classList.toggle('active', b.italic);
  syncInspectorPosition(b);
}

function syncInspectorPosition(b) {
  $('pX').value = pxToCm(b.x).toFixed(2);
  $('pY').value = pxToCm(b.y).toFixed(2);
  $('pW').value = pxToCm(b.w).toFixed(2);
}

function getSelected() {
  return blocks.find(b => b.id === selectedId) || null;
}

function bindInspector() {
  $('pText').addEventListener('input', (e) => {
    const b = getSelected(); if (!b) return;
    b.text = e.target.value;
    b.inner.textContent = b.text;
  });
  $('pFont').addEventListener('change', (e) => {
    const b = getSelected(); if (!b) return;
    b.font = e.target.value; applyBlockStyle(b);
  });
  $('pSize').addEventListener('input', (e) => {
    const b = getSelected(); if (!b) return;
    b.size = parseFloat(e.target.value) || 12; applyBlockStyle(b);
  });
  $('pColor').addEventListener('input', (e) => {
    const b = getSelected(); if (!b) return;
    b.color = e.target.value; applyBlockStyle(b);
  });
  $('pAlign').addEventListener('change', (e) => {
    const b = getSelected(); if (!b) return;
    b.align = e.target.value; applyBlockStyle(b);
  });
  $('pBold').addEventListener('click', () => {
    const b = getSelected(); if (!b) return;
    b.bold = !b.bold; applyBlockStyle(b);
    $('pBold').classList.toggle('active', b.bold);
  });
  $('pItalic').addEventListener('click', () => {
    const b = getSelected(); if (!b) return;
    b.italic = !b.italic; applyBlockStyle(b);
    $('pItalic').classList.toggle('active', b.italic);
  });
  $('pX').addEventListener('input', (e) => {
    const b = getSelected(); if (!b) return;
    b.x = cmToPx(parseFloat(e.target.value) || 0); positionBlock(b);
  });
  $('pY').addEventListener('input', (e) => {
    const b = getSelected(); if (!b) return;
    b.y = cmToPx(parseFloat(e.target.value) || 0); positionBlock(b);
  });
  $('pW').addEventListener('input', (e) => {
    const b = getSelected(); if (!b) return;
    b.w = cmToPx(parseFloat(e.target.value) || 1); applyBlockStyle(b);
  });
  $('pDelete').addEventListener('click', () => {
    const b = getSelected(); if (b) deleteBlock(b.id);
  });
}

/* =====================================================================
   EXPORTAÇÃO (JPG / PDF)
   ===================================================================== */
let exporting=false;
async function exportFile(type){
 if(exporting)return;exporting=true;selectBlock(null);
 try{const {exportCover}=await import('./cover-export.js');await exportCover(type,AB,S,getMetrics(),toast);}
 catch(error){console.error(error);toast('Falha ao gerar o arquivo. Tente novamente.');}
 finally{exporting=false;}
}

function bindUI() {

  /* --- Inputs do documento --- */
  $('inPageW').addEventListener('input', (e) => {
    S.pageW = Math.max(5, parseFloat(e.target.value) || 0); rebuild();
  });
  $('inPageH').addEventListener('input', (e) => {
    S.pageH = Math.max(5, parseFloat(e.target.value) || 0); rebuild();
  });
  $('inPages').addEventListener('input', (e) => {
    S.pages = Math.max(2, parseInt(e.target.value) || 0); rebuild();
  });
  $('inFlap').addEventListener('input', (e) => {
    S.flap = Math.max(0, parseFloat(e.target.value) || 0); rebuild();
  });

  /* --- Sangria (cm) --- */
  $('inBleed').addEventListener('input', (e) => {
    S.bleed = Math.max(0, parseFloat(e.target.value) || 0); rebuild();
  });

  /* --- Incluir sangria no arquivo exportado --- */
  $('inExportBleed').addEventListener('change', (e) => {
    S.exportBleed = e.target.checked;
  });

  /* --- Cor de fundo --- */
  $('inBgColor').addEventListener('input', (e) => {
    S.bgColor = e.target.value;
    AB.style.background = S.bgColor;
    layerBg.style.background = S.bgColor;
  });

  /* --- Mostrar / ocultar --- */
  $('inShowGuides').addEventListener('change', (e) => {
    S.showGuides = e.target.checked; rebuild();
  });
  $('inShowZones').addEventListener('change', (e) => {
    S.showZones = e.target.checked; rebuild();
  });

  /* --- Imagem: upload vai para a área selecionada (sem apagar as outras) --- */
  $('inImage').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Selecione um arquivo de imagem.'); return; }

    const target = S.imgTarget;
    const reader = new FileReader();
    reader.onload = (ev) => {
      S.images[target].data = ev.target.result;
      rebuild();
      updateImgStatus();
      const label = IMG_AREAS.find(a => a.id === target).label;
      toast('Imagem aplicada em: ' + label);
    };
    reader.readAsDataURL(file);
  });

  /* --- Ajuste: altera só a área selecionada --- */
  $('inImgFit').addEventListener('change', (e) => {
    S.images[S.imgTarget].fit = e.target.value;
    rebuild();
  });

  /* --- Remover imagem apenas da área selecionada --- */
  $('btnClearImg').addEventListener('click', () => {
    S.images[S.imgTarget].data = null;
    $('inImage').value = '';
    rebuild();
    updateImgStatus();
    toast('Imagem removida da área selecionada.');
  });

  /* --- Remover TODAS as imagens --- */
  $('btnClearAllImg').addEventListener('click', () => {
    Object.keys(S.images).forEach(k => { S.images[k].data = null; });
    $('inImage').value = '';
    rebuild();
    updateImgStatus();
    toast('Todas as imagens foram removidas.');
  });

  /* --- Adicionar texto --- */
  $('btnAddText').addEventListener('click', () => addBlock());

  /* --- Zoom --- */
  $('zoomIn').addEventListener('click',  () => applyZoom(S.zoom * 1.25));
  $('zoomOut').addEventListener('click', () => applyZoom(S.zoom * 0.8));
  $('zoomFit').addEventListener('click', zoomToFit);

  /* --- Exportação --- */
  $('btnJpg').addEventListener('click', () => exportFile('jpg'));
  $('btnPdf').addEventListener('click', () => exportFile('pdf'));

  /* --- Delete global --- */
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const editing = e.target.isContentEditable ||
                    tag === 'input' || tag === 'textarea' || tag === 'select';
    if (editing) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId != null) {
      e.preventDefault();
      deleteBlock(selectedId);
    }
  });

  /* --- Clique no vazio desmarca --- */
  WORKSPACE.addEventListener('pointerdown', (e) => {
    if (e.target === WORKSPACE || e.target === STAGE || e.target === AB ||
        e.target.classList.contains('ab-layer') ||
        e.target.classList.contains('zone') ||
        e.target.classList.contains('zlabel')) {
      selectBlock(null);
    }
  });

  /* --- Redimensionamento --- */
  window.addEventListener('resize', () => {
    applyZoom(S.zoom);
  });
}

/* =====================================================================
   BOOT
   ===================================================================== */
function boot() {
  initPaperSelect();
  initImgAreaSelect();        // ← NOVO: inicializa o seletor de área de imagem
  bindUI();
  bindInspector();
  rebuild();

  requestAnimationFrame(() => {
    zoomToFit();

    const m = getMetrics();
    const c = getColumns(m);
    addBlock({
      text: en ? 'SIGNAL/NOISE' : 'SINAL/RUÍDO',
      x: cmToPx(c.x4 + S.pageW * 0.1),
      y: cmToPx(S.bleed + S.pageH * 0.28),
      w: cmToPx(S.pageW * 0.8),
      font: 'Oswald, sans-serif', size: 32, bold: true, align: 'center',
      color: '#111111',
    });
    addBlock({text:'Alex Jr. Kich',x:cmToPx(c.x4+S.pageW*.1),y:cmToPx(S.bleed+S.pageH*.78),w:cmToPx(S.pageW*.8),size:13,font:'Montserrat, sans-serif',bold:false,color:'#111111'});
    selectBlock(null);
  });
}

if(document.readyState === 'loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();


function showEditorPanel(name){
 document.getElementById('main').dataset.panel=name;
 document.querySelectorAll('[data-editor-panel]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.editorPanel===name)));
 if(name==='preview')requestAnimationFrame(zoomToFit);
}
document.querySelectorAll('[data-editor-panel]').forEach(button=>button.addEventListener('click',()=>showEditorPanel(button.dataset.editorPanel)));
document.getElementById('btnAddText').addEventListener('click',()=>{if(innerWidth<=900)showEditorPanel('properties');});
new ResizeObserver(()=>{if(WORKSPACE.clientWidth)zoomToFit();}).observe(WORKSPACE);
