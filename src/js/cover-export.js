// JPEG density metadata must match the pixel dimensions used for print.
export function jpegAt300Dpi(dataUrl){
 const bytes=Uint8Array.from(atob(dataUrl.split(',')[1]),char=>char.charCodeAt(0));
 for(let i=2;i<bytes.length-18;){
  if(bytes[i]!==255)break;
  const marker=bytes[i+1],length=(bytes[i+2]<<8)|bytes[i+3];
  if(marker===224&&String.fromCharCode(...bytes.slice(i+4,i+9))==='JFIF\0'){
   bytes[i+11]=1;bytes[i+12]=1;bytes[i+13]=44;bytes[i+14]=1;bytes[i+15]=44;return bytes;
  }
  if(marker===218||length<2)break;i+=length+2;
 }
 const header=Uint8Array.from([255,224,0,16,74,70,73,70,0,1,1,1,1,44,1,44,0,0]);
 const result=new Uint8Array(bytes.length+header.length);result.set(bytes.slice(0,2));result.set(header,2);result.set(bytes.slice(2),2+header.length);return result;
}
export async function exportCover(type,artboard,state,metrics,toast){
 const width=Math.round(metrics.totalW*300/2.54),height=Math.round(metrics.totalH*300/2.54);
 if(width*height>50000000){toast('A capa é muito grande para exportar neste navegador. Reduza as medidas.');return;}
 const controls=[...document.querySelectorAll('#app button,#app input,#app select,#app textarea')].map(el=>({el,disabled:el.disabled}));
 controls.forEach(({el})=>el.disabled=true);artboard.setAttribute('aria-busy','true');toast('Gerando arquivo…',60000);
 let canvas;
 try{
  await document.fonts.ready;
  const {default:html2canvas}=await import('html2canvas');
  canvas=await html2canvas(artboard,{scale:1,useCORS:true,allowTaint:false,backgroundColor:state.bgColor,width,height,windowWidth:width,windowHeight:height,scrollX:0,scrollY:0,
   onclone:doc=>{const cover=doc.getElementById('artboard');doc.body.append(cover);cover.classList.add('exporting');Object.assign(cover.style,{transform:'none',position:'absolute',left:'0',top:'0',margin:'0',boxShadow:'none'});}
  });
  if(!state.exportBleed&&state.bleed>0){
   const x=Math.round(canvas.width*state.bleed/metrics.totalW),y=Math.round(canvas.height*state.bleed/metrics.totalH),cropped=document.createElement('canvas');
   cropped.width=canvas.width-2*x;cropped.height=canvas.height-2*y;cropped.getContext('2d').drawImage(canvas,x,y,cropped.width,cropped.height,0,0,cropped.width,cropped.height);canvas.width=0;canvas=cropped;
  }
  const bytes=jpegAt300Dpi(canvas.toDataURL('image/jpeg',.95));
  const filename=`sinal-ruido-capa-${Date.now()}`;
  if(type==='jpg'){
   const url=URL.createObjectURL(new Blob([bytes],{type:'image/jpeg'})),link=document.createElement('a');link.download=`${filename}.jpg`;link.href=url;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('JPG exportado com sucesso!');
  }else{
   const {jsPDF}=await import('jspdf');const w=canvas.width*2.54/300,h=canvas.height*2.54/300;
   const pdf=new jsPDF({orientation:w>h?'landscape':'portrait',unit:'cm',format:[w,h],compress:true});pdf.addImage(bytes,'JPEG',0,0,w,h);pdf.save(`${filename}.pdf`);toast('PDF exportado com sucesso!');
  }
 }catch(error){console.error(error);toast('Falha ao gerar o arquivo. Tente novamente.');}
 finally{if(canvas)canvas.width=0;controls.forEach(({el,disabled})=>el.disabled=disabled);artboard.removeAttribute('aria-busy');}
}
