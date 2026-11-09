const sceneData = [
  ['mountains','01 / O SILÊNCIO','Antes do sinal, o silêncio.','Montanhas sob um céu estrelado.'],
  ['telescope-wide','02 / A ESCUTA','Alguma coisa atravessa o céu.','Radiotelescópio sob as estrelas.'],
  ['star-close','03 / A ORIGEM','Um ponto na escuridão.','Uma estrela brilhante na Via Láctea.'],
  ['spacecraft','04 / O DESCONHECIDO','O que existe do outro lado?','Nave extraterrestre no espaço.'],
  ['gray-earth','05 / O OBSERVADOR','A Terra, vista de longe.','Gray observando a Terra pela janela de uma nave.'],
  ['researcher-a','06 / 1977','Wow!','Pesquisador examinando uma impressão em um observatório.'],
  ['printout','07 / O REGISTRO','O papel guarda o sinal.','Dados impressos em papel contínuo.'],
  ['laboratory','08 / HENRIQUE + ARGOS','O padrão se recusa a desaparecer.','Referência fornecida de pesquisador em laboratório contemporâneo; identidade de Henrique a confirmar.'],
  ['star-wide','09 / SINAL / RUÍDO','Entre o sinal e o ruído.','Céu estrelado antes da revelação da capa.'],
];
function picture(name, alt, first=false, extra='') {
 return `<picture class="cine-picture ${extra}"><source media="(max-width: 700px)" srcset="/home/cinematic/${name}-960.webp"><img src="/home/cinematic/${name}-1920.webp" alt="${alt}" width="1920" height="1080" ${first?'fetchpriority="high"':'loading="lazy"'} decoding="async"></picture>`;
}
export function cinematicHome(html) {
 const scenes=sceneData.map(([image,kicker,title,alt],i)=>`<article class="cine-scene" data-scene="${i}" aria-label="${kicker}">
 ${picture(image,alt,i===0)}
 ${i===0?picture('mountains','',true,'cine-foreground'):''}
 ${i===1?picture('telescope-close','',false,'cine-alternate'):''}
 ${i===4?picture('gray-window','',false,'cine-alternate'):''}
 ${i===8?'<img class="cine-reveal-cover" src="/home/capa.jpg" alt="Capa oficial de SINAL/RUÍDO" width="1050" height="1512" loading="lazy">':''}
 ${i===6?'<div class="cine-data" aria-hidden="true">6EQUJ5<br>010011 · 1420 MHz<br>72 s / 1977<br>6EQUJ5 → ARGOS</div>':''}
 <div class="cine-caption"><p class="mono">${kicker}</p><h2>${title}</h2>${i===0?'<p class="cine-instruction">Role para seguir o sinal</p>':''}${i===5?'<p class="cine-note">“Wow!” · legenda da cena; fala e gesto pendentes de produção.</p>':''}${i===7?'<p class="cine-note">Referência visual fornecida · identidade de Henrique a confirmar.</p>':''}</div>
 </article>`).join('');
 const hero=`<section class="cinematic" aria-label="A origem do sinal" data-cinematic>
 <div class="cine-stage">${scenes}<div class="cine-vignette" aria-hidden="true"></div><div class="cine-flare" aria-hidden="true"></div><div class="cine-interference" aria-hidden="true"></div>
 <div class="cine-hud mono"><span>SINAL / RUÍDO <b>●</b></span><span data-cine-count aria-hidden="true">01 / 10</span></div>
 <a class="cine-skip mono" href="#cine-finale">Pular experiência ↗</a>
 <div class="cine-meter" aria-hidden="true"><i></i></div>
 </div></section>
 <section class="cine-finale" id="cine-finale" tabindex="-1" aria-labelledby="h1"><div class="wrap cine-finale-grid"><div><p class="eyebrow mono">Ficção científica investigativa</p><h1 id="h1">SINAL<span>/</span>RUÍDO</h1><p>Em 1977, um sinal apareceu por 72 segundos.</p><p>O padrão se recusa a desaparecer.</p><div class="cta"><a class="btn btn--primary" href="/livro/amostra/">Ler os primeiros capítulos →</a><a class="btn btn--ghost" href="#cronicas">Explorar as Crônicas Cosmológicas</a></div><p class="mono">Um romance de Alex Jr. Kich</p></div><img class="cine-official-cover" src="/home/capa.jpg" alt="Capa oficial de SINAL/RUÍDO" width="1050" height="1512" loading="lazy"></div></section>`;
 return html.replace(/<div class="intro"[\s\S]*?<\/div>\s*<header/, '<header')
 .replace(/<section class="hero"[\s\S]*?<\/section>/,hero)
 .replace('<script src="/home/lenis.min.js"></script>','')
 .replace('<link rel="preload" as="image" href="/home/telescopio-poster.jpg">','<link rel="preload" as="image" href="/home/cinematic/mountains-1920.webp" media="(min-width:701px)"><link rel="preload" as="image" href="/home/cinematic/mountains-960.webp" media="(max-width:700px)">')
 .replace('</head>','<link rel="stylesheet" href="/src/css/cinematic-hero.css"><script src="/home/vendor/gsap.min.js"></script><script src="/home/vendor/ScrollTrigger.min.js"></script><script type="module" src="/src/js/cinematic-hero.js"></script></head>')
 .replace('data-replay>Rever a transmissão','data-cine-replay>Rever a experiência');
}

