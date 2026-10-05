import {chromium} from 'file:///F:/SINAL_RUIDO/entrelinhas-site/node_modules/playwright-core/index.mjs';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
const base=process.env.SR_QA_BASE||'https://sinalruido.com.br';
const server=base.includes('127.0.0.1')?spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4188'],{windowsHide:true,stdio:'ignore'}):null;
if(server)for(let i=0;i<600;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,300));}
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try{
for(const width of [320,393,768,1440])for(const lang of ['pt','en']){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:width===393?'no-preference':'reduce'});
 await page.goto(base+(lang==='pt'?'/mapa-dos-sinais/':'/en/world-map-of-signals/'),{waitUntil:'networkidle'});
 await page.waitForSelector('.signal-marker');
 await page.waitForTimeout(250);
 const positions=await page.evaluate(()=>{
  const map=document.querySelector('[data-signal-map]').getBoundingClientRect();
  return [...document.querySelectorAll('.signal-marker')].map(el=>{const p=el.getBoundingClientRect();return {name:el.title,x:p.x-map.x,y:p.y-map.y,inside:p.left>=map.left&&p.right<=map.right&&p.top>=map.top&&p.bottom<=map.bottom};});
 });
 results.push({width,lang,positions});
 console.log(JSON.stringify({width,lang,outside:positions.filter(p=>!p.inside)}));
 if(process.env.SR_REQUIRE_VISIBLE)assert.ok(positions.every(p=>p.inside),'Every signal must be visible on initial map');
 await page.screenshot({path:`qa-conversion/map-position-${process.env.SR_REQUIRE_VISIBLE?'fixed':'before'}-${lang}-${width}.png`});
 if(process.env.SR_REQUIRE_VISIBLE){await page.locator('[data-signal-map]').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await page.locator('.signal-marker[title="The Fishbowl Open Mic / Art Gallery"]').hover();await page.waitForSelector('.leaflet-popup');const rect=await page.locator('[data-signal-map]').boundingBox();await page.mouse.move(rect.x+rect.width-8,rect.y+rect.height-8);await page.waitForTimeout(500);assert.ok(await page.locator('.leaflet-popup').isVisible(),'Hover popup stays open');assert.ok((await page.locator('.leaflet-popup').textContent()).includes('The Fishbowl'));console.log(await page.evaluate(()=>{const p=document.querySelector('.leaflet-popup'),m=document.querySelector('[data-signal-map]'),pane=document.querySelector('.leaflet-map-pane');return {popup:p.getBoundingClientRect().toJSON(),map:m.getBoundingClientRect().toJSON(),style:p.style.cssText,pane:pane.style.cssText,computed:getComputedStyle(pane).transform};}));await page.screenshot({path:'qa-conversion/map-popup-debug.png'});await page.locator('.leaflet-popup-close-button').click({timeout:1500});await page.locator('.leaflet-popup').waitFor({state:'detached'});assert.equal(await page.locator('.leaflet-popup').count(),0);}
 await page.close();
}
writeFileSync(`qa-conversion/map-position-${process.env.SR_REQUIRE_VISIBLE?'fixed':'before'}-results.json`,JSON.stringify(results,null,2)+'\n');
}finally{await browser.close();server?.kill();}
