import {chromium} from 'file:///F:/SINAL_RUIDO/entrelinhas-site/node_modules/playwright-core/index.mjs';
import {spawn} from 'node:child_process';import {readFileSync,writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const base=process.env.SR_QA_BASE||'http://127.0.0.1:4190',local=base.includes('127.0.0.1');
const server=local?spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4190'],{windowsHide:true,stdio:'ignore'}):null;
if(server)for(let i=0;i<200;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,300));}
const results=[];
try{for(const channel of ['chrome','msedge']){
 const browser=await chromium.launch({channel,headless:true});
 for(const width of channel==='chrome'?[320,393,1440]:[1440])for(const lang of ['pt','en']){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',acceptDownloads:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+(lang==='pt'?'/editor-de-capas/':'/en/cover-editor/'),{waitUntil:'networkidle'});await page.waitForSelector('.tblock');
  assert.equal(await page.locator('.tblock').count(),2);assert.equal(await page.locator('#inPaper option').count(),8);assert.equal(await page.locator('#inImgArea option').count(),6);
  assert.equal(await page.locator('h1').textContent(),lang==='pt'?'Editor de capas':'Cover editor');
  assert.equal(await page.locator('.editor-site-nav a').last().getAttribute('href'),lang==='pt'?'/en/cover-editor/':'/editor-de-capas/');
  await page.screenshot({path:`qa-conversion/cover-${local?'local':'live'}-${channel}-${lang}-${width}.png`});
  if(width<=900)await page.locator('[data-editor-panel=document]').click();
  await page.locator('#btnAddText').click();assert.equal(await page.locator('.tblock').count(),3);await page.locator('#pText').fill(lang==='pt'?'TÍTULO DE TESTE':'TEST TITLE');
  assert.equal(await page.locator('.tblock.selected .tb-inner').textContent(),lang==='pt'?'TÍTULO DE TESTE':'TEST TITLE');
  await page.locator('#pBold').click();await page.locator('#pColor').fill('#e8541d');await page.locator('#pSize').fill('20');await page.locator('#pSize').dispatchEvent('input');
  await page.locator('#pDelete').click();assert.equal(await page.locator('.tblock').count(),2);
  if(width<=900)await page.locator('[data-editor-panel=document]').click();
  for(const [id,value] of [['inPageW','5'],['inPageH','5'],['inFlap','0'],['inPages','20'],['inBleed','0.2']]){await page.locator('#'+id).fill(value);await page.locator('#'+id).dispatchEvent('input');}
  assert.equal(await page.locator('#sSpine').textContent(),lang==='pt'?'0,130 cm':'0.130 cm');
  const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=200;c.height=100;const ctx=c.getContext('2d');ctx.fillStyle='#ff0000';ctx.fillRect(0,0,100,100);ctx.fillStyle='#0000ff';ctx.fillRect(100,0,100,100);return c.toDataURL().split(',')[1];});
  await page.locator('#inImage').setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});await page.waitForFunction(()=>document.querySelector('#layerBg').children.length===1);
  await page.locator('#inImgArea').selectOption('back');await page.locator('#inImage').setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});await page.waitForFunction(()=>document.querySelector('#layerBg').children.length===2);
  await page.locator('#inImgArea').selectOption('front');await page.locator('#inImgFit').selectOption('contain');assert.equal(await page.locator('#layerBg>div').last().evaluate(el=>el.style.backgroundSize),'contain');
  if(width<=900)await page.locator('[data-editor-panel=preview]').click();
  await page.locator('#zoomFit').click();const transform=await page.locator('#artboard').evaluate(el=>el.style.transform);
  const layout=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,work:document.querySelector('#workspace').getBoundingClientRect().toJSON(),stage:document.querySelector('#stage').getBoundingClientRect().toJSON()}));
  assert.ok(layout.scroll<=width+1);assert.ok(layout.stage.width<=layout.work.width);assert.ok(layout.stage.height<=layout.work.height);
  let exports;
  if(channel==='chrome'&&width===1440){
   await page.locator('.tblock').first().focus();await page.keyboard.press('Enter');await page.locator('#pText').fill('PRINT TEST');await page.locator('#pColor').fill('#00ff00');
   for(const [id,value] of [['pX','5.5'],['pY','0.4'],['pW','4'],['pSize','16']]){await page.locator('#'+id).fill(value);await page.locator('#'+id).dispatchEvent('input');}
   const downloadJpg=page.waitForEvent('download');await page.locator('#btnJpg').click();const jpg=await downloadJpg,bytes=readFileSync(await jpg.path());
   assert.equal(bytes[0],255);assert.equal(bytes[1],216);const jfif=bytes.indexOf(Buffer.from('JFIF\0'));assert.ok(jfif>=0);assert.equal(bytes[jfif+7],1);assert.equal(bytes.readUInt16BE(jfif+8),300);assert.equal(bytes.readUInt16BE(jfif+10),300);
   const image=await page.evaluate(async data=>{const img=new Image();img.src=data;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;c.getContext('2d').drawImage(img,0,0);const ctx=c.getContext('2d'),text=ctx.getImageData(650,30,470,110).data;let greenText=0;for(let i=0;i<text.length;i+=4)if(text[i]<100&&text[i+1]>150&&text[i+2]<100)greenText++;return {width:img.width,height:img.height,greenText,corner:[...ctx.getImageData(2,2,1,1).data],front:[...ctx.getImageData(Math.round(img.width*.85),Math.round(img.height*.5),1,1).data]};},'data:image/jpeg;base64,'+bytes.toString('base64'));
   assert.equal(image.width,Math.round(10.53*300/2.54));assert.equal(image.height,Math.round(5.4*300/2.54));assert.ok(image.corner.slice(0,3).every(v=>v>245));assert.ok(image.front[2]>200);assert.ok(image.front[0]<50);
   assert.ok(image.greenText>100,'Editable text must be painted in the exported image');
   assert.equal(await page.locator('#artboard').evaluate(el=>el.style.transform),transform);assert.ok(await page.locator('.guide').count()>0);
   if(width<=900)await page.locator('[data-editor-panel=document]').click();await page.locator('#inExportBleed').uncheck();
   const downloadPdf=page.waitForEvent('download');await page.locator('#btnPdf').click();const pdf=await downloadPdf,pdfBytes=readFileSync(await pdf.path());assert.ok(pdfBytes.toString('latin1').startsWith('%PDF-'));
   const media=pdfBytes.toString('latin1').match(/\/MediaBox\s*\[0 0 ([\d.]+) ([\d.]+)\]/);assert.ok(media);const cropX=Math.round(image.width*.2/10.53),cropY=Math.round(image.height*.2/5.4);assert.ok(Math.abs(Number(media[1])-(image.width-2*cropX)*.24)<.01);assert.ok(Math.abs(Number(media[2])-(image.height-2*cropY)*.24)<.01);
   exports={jpg:image,dpi:300,pdfMediaBox:media.slice(1)};
  }
  assert.equal(errors.length,0,JSON.stringify(errors));results.push({channel,width,lang,layout,exports,errors});await page.close();
 }await browser.close();
}writeFileSync(`qa-conversion/cover-editor-${local?'local':'live'}-results.json`,JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify({checks:results.length,passed:true}));}finally{server?.kill();}
