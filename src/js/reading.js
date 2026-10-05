const shell=document.querySelector('[data-reading-sample]');
if(shell){
 const en=document.documentElement.lang.startsWith('en'),tabs=[...shell.querySelectorAll('[data-chapter-tab]')],panels=[...shell.querySelectorAll('[data-chapter-panel]')];
 const key=`sinalruido.sample.position.${en?'en':'pt'}`,fontKey='sinalruido.sample.font',themeKey='sinalruido.sample.theme';
 const read=k=>{try{return localStorage.getItem(k);}catch{return null;}},save=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
 let chapter=0,page=0,count=1,size=Math.max(15,Math.min(24,Number(read(fontKey))||18)),dark=read(themeKey)==='dark';
 shell.style.setProperty('--reading-font-size',`${size}px`);shell.classList.toggle('is-dark',dark);
 const views=panels.map(panel=>{
  const end=panel.querySelector('.chapter-end'),viewport=document.createElement('div'),flow=document.createElement('div');
  viewport.className='reading-viewport';viewport.tabIndex=0;viewport.setAttribute('aria-label',en?'Book page. Use left and right arrow keys to turn pages.':'Página do livro. Use as setas para passar as páginas.');flow.className='reading-flow';
  [...panel.children].filter(el=>el!==end).forEach(el=>flow.append(el));viewport.append(flow);panel.prepend(viewport);return {viewport,flow,end};
 });
 const nav=document.createElement('nav');nav.className='reading-pagination';nav.setAttribute('aria-label',en?'Turn pages':'Passar páginas');
 nav.innerHTML=`<button type="button" data-page-prev>${en?'← Previous page':'← Página anterior'}</button><span data-page-position role="status" aria-live="polite" aria-atomic="true"></span><button type="button" data-page-next>${en?'Next page →':'Próxima página →'}</button>`;panels.at(-1).after(nav);
 const previous=nav.querySelector('[data-page-prev]'),next=nav.querySelector('[data-page-next]'),position=nav.querySelector('[data-page-position]');shell.classList.add('is-paginated');
 const render=()=>{
  const {viewport,flow,end}=views[chapter];flow.style.transform=`translateX(${-page*(viewport.getBoundingClientRect().width+40)}px)`;viewport.scrollLeft=0;if(end)end.hidden=page!==count-1;
  previous.disabled=chapter===0&&page===0;next.disabled=chapter===panels.length-1&&page===count-1;
  position.textContent=en?`Chapter ${chapter+1} · Page ${page+1} of ${count}`:`Capítulo ${chapter+1} · Página ${page+1} de ${count}`;
  save(key,JSON.stringify({chapter:panels[chapter].dataset.chapterPanel,progress:count>1?page/(count-1):0}));
 };
 const paginate=(progress=count>1?page/(count-1):0)=>{const {viewport,flow}=views[chapter];flow.style.transform='none';flow.style.columnWidth=`${viewport.getBoundingClientRect().width}px`;count=Math.max(1,Math.round((flow.scrollWidth+40)/(viewport.getBoundingClientRect().width+40)));page=Math.max(0,Math.min(count-1,Math.round(progress*(count-1))));render();};
 const activate=(index,progress=0)=>{chapter=index;tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});panels.forEach((panel,i)=>{panel.hidden=i!==index;});paginate(progress);};
 const turn=direction=>{if(direction>0&&page===count-1){if(chapter<panels.length-1)activate(chapter+1);}else if(direction<0&&page===0){if(chapter>0)activate(chapter-1,1);}else{page=Math.max(0,Math.min(count-1,page+direction));render();}};
 previous.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activate(index));tab.addEventListener('keydown',e=>{let target;if(e.key==='ArrowRight')target=(index+1)%tabs.length;if(e.key==='ArrowLeft')target=(index+tabs.length-1)%tabs.length;if(e.key==='Home')target=0;if(e.key==='End')target=tabs.length-1;if(target===undefined)return;e.preventDefault();activate(target);tabs[target].focus();});});
 shell.querySelectorAll('[data-next-chapter]').forEach(button=>button.addEventListener('click',()=>activate(panels.findIndex(p=>p.dataset.chapterPanel===button.dataset.nextChapter))));
 views.forEach(({viewport})=>{viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(e.key==='ArrowRight'?1:-1);}});let touch;viewport.addEventListener('touchstart',e=>{if(e.touches.length===1)touch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});viewport.addEventListener('touchend',e=>{if(!touch)return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;touch=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5&&!getSelection()?.toString())turn(dx<0?1:-1);},{passive:true});});
 ['up','down'].forEach(direction=>shell.querySelector(`[data-reading-size="${direction}"]`)?.addEventListener('click',()=>{const progress=count>1?page/(count-1):0;size=Math.max(15,Math.min(24,size+(direction==='up'?1:-1)));shell.style.setProperty('--reading-font-size',`${size}px`);save(fontKey,String(size));paginate(progress);}));
 shell.querySelector('[data-reading-theme]')?.addEventListener('click',()=>{dark=!dark;shell.classList.toggle('is-dark',dark);save(themeKey,dark?'dark':'light');});
 let saved;try{saved=JSON.parse(read(key));}catch{}const savedIndex=panels.findIndex(p=>p.dataset.chapterPanel===saved?.chapter);activate(savedIndex<0?0:savedIndex,Number.isFinite(saved?.progress)?saved.progress:0);
 let timer;new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>paginate(),120);}).observe(shell);document.fonts.ready.then(()=>paginate());
}
