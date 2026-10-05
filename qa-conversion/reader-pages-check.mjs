import {chromium} from 'file:///F:/SINAL_RUIDO/entrelinhas-site/node_modules/playwright-core/index.mjs';
import {spawn} from 'node:child_process';import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const base=process.env.SR_QA_BASE||'http://127.0.0.1:4189',local=base.includes('127.0.0.1');
const server=local?spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4189'],{windowsHide:true,stdio:'ignore'}):null;
if(server)for(let i=0;i<600;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,300));}
const results=[];const browser=await chromium.launch({channel:'chrome',headless:true});
try{for(const width of [320,393,1440])for(const lang of ['pt','en']){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:width===393?'no-preference':'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+(lang==='pt'?'/livro/amostra/':'/livro/sample/'),{waitUntil:'networkidle'});await page.waitForSelector('.is-paginated');await page.waitForTimeout(250);
 const text=await page.locator('.reading-body').allTextContents();assert.equal(text.length,3);
 const label=()=>page.locator('[data-page-position]').textContent();
 const first=await label();assert.match(first,/1 .* 1 /);assert.ok(await page.locator('[data-page-prev]').isDisabled());
 await page.screenshot({path:`qa-conversion/reader-${local?'local':'live'}-${lang}-${width}.png`});
 await page.locator('.reading-viewport:visible').evaluate(el=>{const start=new Event('touchstart');Object.defineProperty(start,'touches',{value:[{clientX:220,clientY:300}]});el.dispatchEvent(start);const end=new Event('touchend');Object.defineProperty(end,'changedTouches',{value:[{clientX:100,clientY:302}]});el.dispatchEvent(end);});const second=await label();assert.notEqual(second,first);
 await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(250);assert.equal(await label(),second);
 await page.locator('.reading-viewport:visible').focus();await page.keyboard.press('ArrowLeft');assert.equal(await label(),first);
 await page.locator('[data-reading-size="up"]').click();assert.equal(await page.locator('[data-reading-sample]').evaluate(el=>el.style.getPropertyValue('--reading-font-size')),'19px');
 await page.locator('[data-reading-theme]').click();assert.ok(await page.locator('[data-reading-sample]').evaluate(el=>el.classList.contains('is-dark')));
 const chapters=[];
 for(let i=0;i<3;i++){
  await page.locator('[data-chapter-tab]').nth(i).click();
  const pages=await page.evaluate(()=>{
   const next=document.querySelector('[data-page-next]'),position=document.querySelector('[data-page-position]');const count=Number(position.textContent.match(/(\d+)$/)[1]);
   for(let j=1;j<count;j++)next.click();
   const panel=document.querySelector('[data-chapter-panel]:not([hidden])'),v=panel.querySelector('.reading-viewport').getBoundingClientRect(),p=panel.querySelector('.reading-body p:last-child');
   const rects=[...p.getClientRects()];return {count,label:position.textContent,endHidden:panel.querySelector('.chapter-end').hidden,viewport:{x:v.x,y:v.y,width:v.width,height:v.height},rects:rects.map(r=>({x:r.x,y:r.y,width:r.width,height:r.height})),scrollWidth:panel.querySelector('.reading-flow').scrollWidth,transition:getComputedStyle(panel.querySelector('.reading-flow')).transition,animation:getComputedStyle(panel.querySelector('.reading-flow')).animation,computed:getComputedStyle(panel.querySelector('.reading-flow')).transform,display:getComputedStyle(panel.querySelector('.reading-flow')).display,transform:panel.querySelector('.reading-flow').style.transform,lastVisible:rects.some(r=>r.right>v.left&&r.left<v.right&&r.bottom>v.top&&r.top<v.bottom)};
  });assert.ok(pages.count>1);assert.equal(pages.endHidden,false);assert.equal(pages.lastVisible,true);chapters.push(pages);
  if(i<2){await page.locator('[data-page-next]').click();assert.match(await label(),new RegExp(`^Cap[ií]tulo ${i+2}|^Chapter ${i+2}`));await page.locator('[data-page-prev]').click();assert.equal(await label(),pages.label);}
 }
 assert.ok(await page.locator('[data-page-next]').isDisabled());assert.ok(await page.locator('[data-sample-finish]:visible').isVisible());assert.deepEqual(await page.locator('.reading-body').allTextContents(),text);
 const beforeResize=await label();await page.setViewportSize({width:width===1440?1000:450,height:740});await page.waitForTimeout(300);assert.equal(await page.locator('[data-page-next]').isDisabled(),true);assert.notEqual(await label(),'');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false);assert.equal(errors.length,0);
 results.push({width,lang,chapters,beforeResize,afterResize:await label(),errors});await page.close();
}writeFileSync(`qa-conversion/reader-${local?'local':'live'}-results.json`,JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify({passed:true,checks:results.length}));}finally{await browser.close();server?.kill();}
