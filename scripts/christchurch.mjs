import {readFileSync} from 'node:fs';
const buy=JSON.parse(readFileSync(new URL('../src/data/buy.json',import.meta.url),'utf8'));
export function christchurchBody(lang='en'){
 const en=lang==='en',sample=en?'/livro/sample/?region=NZ':'/livro/amostra/',map=en?'/en/world-map-of-signals/':'/mapa-dos-sinais/';
 return `<article class="christchurch-page container">
 <section class="cc-hero" aria-labelledby="cc-title">
  <div><span class="kicker">${en?'Brazilian speculative fiction':'Ficção especulativa brasileira'}</span>
   <h1 id="cc-title">${en?'SIGNAL':'SINAL'}<span>/</span><br>${en?'NOISE':'RUÍDO'}</h1>
   <p class="cc-lead">${en?'An independent novel created in Rio Grande do Sul, in southern Brazil. A story of signals, technology and human questions, finding readers across the ocean.':'Um romance independente criado no Rio Grande do Sul. Uma história de sinais, tecnologia e questões humanas, encontrando leitores do outro lado do oceano.'}</p>
   <p class="cc-route"><i aria-hidden="true"></i><span>Rio Grande do Sul, ${en?'Brazil':'Brasil'}</span><span aria-hidden="true">→</span><span>Christchurch, ${en?'New Zealand':'Nova Zelândia'}</span></p>
   <div class="cc-actions"><a class="btn btn--primary" href="${sample}">${en?'Read 3 free chapters':'Ler 3 capítulos grátis'} →</a><a class="cc-text-link" href="#cc-amazon">${en?'Continue on Amazon Australia':'Continuar na Amazon Austrália'} ↓</a></div>
  </div>
  <figure class="cc-cover"><img src="/livro/${en?'capa-en.jpg':'capa.jpg'}" width="1280" height="2048" alt="${en?'SIGNAL/NOISE, by Alex Jr. Kich':'SINAL/RUÍDO, de Alex Jr. Kich'}" fetchpriority="high"></figure>
 </section>
 <section class="cc-section" aria-labelledby="cc-journey-title">
  <span class="kicker">${en?'The journey':'A jornada'}</span><h2 id="cc-journey-title">${en?'From Rio Grande do Sul to Christchurch':'Do Rio Grande do Sul a Christchurch'}</h2>
  <p class="cc-intro">${en?'A signal from southern Brazil reaches a library network in New Zealand. Christchurch City Libraries has accepted the project; installation and a photograph of the poster are still pending.':'Um sinal do sul do Brasil chega a uma rede de bibliotecas na Nova Zelândia. A Christchurch City Libraries aceitou participar do projeto; a instalação e a fotografia do cartaz ainda estão pendentes.'}</p>
  <div class="cc-route-grid">
   <div class="cc-map-card">
    <div class="cc-route-map" data-christchurch-map data-lang="${lang}" aria-label="${en?'Map linking Rio Grande do Sul and Christchurch':'Mapa ligando Rio Grande do Sul a Christchurch'}" hidden></div>
    <div class="cc-map-fallback" data-christchurch-fallback><div class="cc-globe"><span class="cc-connection" aria-hidden="true"></span><span class="cc-fallback-origin">Rio Grande do Sul</span><span class="cc-fallback-destination">Christchurch</span></div></div>
    <p class="cc-map-note">${en?'Origin and destination of the signal · approximate locations':'Origem e destino do sinal · localizações aproximadas'}</p>
   </div>
   <aside class="cc-store-card" id="cc-amazon" aria-labelledby="cc-store-title">
    <span class="cc-store-badge">${en?'For readers in New Zealand':'Para leitores na Nova Zelândia'}</span><h3 id="cc-store-title">Amazon ${en?'Australia':'Austrália'}</h3>
    <p>${en?'Read the first chapters. When you are ready to continue, choose your format in the English edition.':'Leia os primeiros capítulos. Quando quiser continuar, escolha o formato da edição em inglês.'}</p>
    <div class="cc-store-links"><a class="btn btn--primary" href="https://www.amazon.com.au/dp/${buy.asins.kindle}" target="_blank" rel="noopener noreferrer"><span>${en?'English ebook · Kindle':'Ebook em inglês · Kindle'}</span><span aria-hidden="true">↗</span></a><a class="btn" href="https://www.amazon.com.au/dp/${buy.asins.paperback}" target="_blank" rel="noopener noreferrer"><span>${en?'English paperback':'Livro impresso em inglês'}</span><span aria-hidden="true">↗</span></a></div>
    <p class="cc-store-note">${en?'Both links open Amazon Australia. Check price and availability in the store.':'Os dois links abrem a Amazon Austrália. Consulte o preço e a disponibilidade na loja.'}</p>
   </aside>
  </div>
  <div class="cc-library"><div><span class="signal-status signal-status--accepted">📡 ${en?'Signal accepted':'Sinal aceito'}</span><h3>Christchurch City Libraries<br><span lang="mi">Ngā Kete Wānanga o Ōtautahi</span></h3><p>${en?'Public libraries, reading, learning and community in Christchurch.':'Bibliotecas públicas, leitura, aprendizagem e comunidade em Christchurch.'}</p></div><div class="cc-library-links"><a class="cc-text-link" href="https://my.christchurchcitylibraries.com/" target="_blank" rel="noopener noreferrer">${en?'Visit the library website':'Visitar o site das bibliotecas'} ↗</a><a class="cc-text-link" href="${map}">${en?'Explore the World Map of Signals':'Explorar o Mapa dos Sinais'} →</a></div></div>
  <ol class="cc-flow"><li><span>01</span><h3>${en?'Find the signal':'Encontre o sinal'}</h3><p>${en?'A poster and its QR code connect the physical space to the story.':'Um cartaz e seu QR conectam o espaço físico à história.'}</p></li><li><span>02</span><h3>${en?'Follow the first clues':'Siga as primeiras pistas'}</h3><p>${en?'Read three chapters in the free online sample, one page at a time.':'Leia três capítulos na amostra gratuita, uma página de cada vez.'}</p></li><li><span>03</span><h3>${en?'Continue the story':'Continue a história'}</h3><p>${en?'Choose Kindle or paperback on Amazon Australia.':'Escolha Kindle ou livro impresso na Amazon Austrália.'}</p></li></ol>
  <a class="btn btn--primary cc-final-read" href="${sample}">${en?'Start reading':'Começar a leitura'} →</a>
 </section></article>`;
}
