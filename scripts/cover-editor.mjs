import {readFileSync} from 'node:fs';
import {editorEnglish} from '../src/js/cover-editor-i18n.js';
const template=readFileSync(new URL('../src/templates/cover-editor.html',import.meta.url),'utf8');
export function coverEditorPage(lang='pt'){
 const en=lang==='en',path=en?'/en/cover-editor/':'/editor-de-capas/',other=en?'/editor-de-capas/':'/en/cover-editor/';
 let body=template.replace('<div class="brand">',`<div class="editor-brand"><a class="site-brand" href="${en?'/en/':'/'}" aria-label="SINAL/RUÍDO">SINAL<b>/</b>RUÍDO</a>`)
  .replace('<div class="logo">📖</div>','').replace('<h1>BookCover Studio</h1>','<h1>Editor de capas</h1>')
  .replace('<div class="top-spacer"></div>',`<div class="top-spacer"></div><nav class="editor-site-nav" aria-label="${en?'Site navigation':'Navegação do site'}"><a href="${en?'/en/':'/'}">← Voltar ao site</a><a href="${other}" lang="${en?'pt':'en'}" hreflang="${en?'pt':'en'}">${en?'PT':'EN'}</a></nav>`)
  .replace('<div id="main">',`<nav class="editor-tabs" aria-label="${en?'Editor panels':'Painéis do editor'}"><button type="button" data-editor-panel="document" aria-pressed="false">Documento</button><button type="button" data-editor-panel="preview" aria-pressed="true">Prévia</button><button type="button" data-editor-panel="properties" aria-pressed="false">Propriedades</button></nav><div id="main" data-panel="preview">`)
  .replace('<aside class="sidebar">','<aside class="sidebar" id="documentPanel" aria-label="Documento">')
  .replace('<main id="workspace">',`<main id="workspace" aria-label="${en?'Cover preview':'Prévia da capa'}">`)
  .replace('<aside class="sidebar right">','<aside class="sidebar right" id="propertiesPanel" aria-label="Propriedades">')
  .replace('<select id="pFont">','<select id="pFont"><option value="Oswald, sans-serif">Oswald · SINAL/RUÍDO</option>')
  .replace('<div id="toast"></div>','<div id="toast" role="status" aria-live="polite" aria-atomic="true"></div>')
  .replace('<h3>Cálculo</h3>','<h3>Cálculo</h3><p class="hint">Confirme a espessura do papel e a lombada com a gráfica antes de imprimir.</p>')
  .replace('<!-- ============ /IMAGENS DE FUNDO ============ -->','<p class="hint">As imagens e os textos são editados no seu navegador. Não é necessário enviar arquivos para o site.</p>');
 // Exact user interface strings only; editable book text is never translated.
 if(en)for(const [pt,english] of Object.entries(editorEnglish).sort((a,b)=>b[0].length-a[0].length))body=body.replaceAll(pt,english);
 body=body.replaceAll('⬇ ','').replaceAll('🗑 ','');
 body=body.replace(/<div class="field">\s*<label>([^<]+)<\/label>\s*<(input|select|textarea)([^>]*\bid="([^"]+)"[^>]*)>/g,(all,label,tag,attrs,id)=>all.replace('<label>',`<label for="${id}">`));
 body=body.replace(/<button(?![^>]*type=)/g,'<button type="button"');
 const title=en?'Cover editor':'Editor de capas',description=en?'Create and export a full book cover with spine, flaps and bleed.':'Crie e exporte uma capa completa com lombada, orelhas e sangria.';
 return `<!doctype html><html lang="${en?'en':'pt-BR'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · SINAL/RUÍDO</title><meta name="description" content="${description}"><meta name="theme-color" content="#0b0e14"><link rel="canonical" href="https://sinalruido.com.br${path}"><link rel="alternate" hreflang="pt-BR" href="https://sinalruido.com.br/editor-de-capas/"><link rel="alternate" hreflang="en" href="https://sinalruido.com.br/en/cover-editor/"><link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@600;700&family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@400;600;800;900&family=Lora:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap" rel="stylesheet"><link rel="stylesheet" href="/src/css/cover-editor.css"></head><body>${body}<noscript><p class="editor-noscript">${en?'Enable JavaScript to use the cover editor.':'Ative o JavaScript para usar o editor de capas.'}</p></noscript><script type="module" src="/src/js/cover-editor.js"></script></body></html>`;
}
