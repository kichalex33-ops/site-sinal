import assert from 'node:assert/strict';import {onRequest} from '../functions/_middleware.js';
let handlers=[];globalThis.HTMLRewriter=class{on(selector,handler){handlers.push([selector,handler]);return this;}transform(response){return response;}};
async function run(country,path){handlers=[];return onRequest({request:{url:'https://sinalruido.com.br'+path,cf:{country}},next:async()=>new Response('<html></html>',{headers:{'content-type':'text/html'}})});}
let r=await run('NZ','/');assert.equal(r.status,302);assert.equal(r.headers.get('location'),'https://sinalruido.com.br/en/christchurch/');assert.equal((await run('NZ','/?lang=pt')).status,200);assert.equal((await run('BR','/')).status,200);
await run('NZ','/livro/sample/');let attrs={hidden:'', 'data-signal-edition':'kindle',href:'old'};const el={getAttribute:k=>attrs[k],setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k]};handlers.find(([s])=>s==='a[data-signal-edition]')[1].element(el);assert.equal(attrs.href,'https://www.amazon.com.au/dp/B0HJP3HM7J');handlers.find(([s])=>s==='[data-region-entry]')[1].element(el);assert.equal(attrs.hidden,undefined);
await run('NZ','/buy/');assert.ok(handlers.some(([s])=>s==='section.buy-market'));
await run('BR','/livro/sample/');assert.ok(!handlers.some(([s])=>s==='[data-region-entry]'));
console.log('NZ home routing, Portuguese choice, Kindle AU, reader banner, buying market and Brazil preserved: passed.');
