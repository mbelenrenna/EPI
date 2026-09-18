const PAGES='https://escuela-pensamiento-intuitivo.pages.dev';
const LANDING='/inspiraccion/nivel-2/';
const LEGAL_ENDPOINT='https://script.google.com/macros/s/AKfycbx3x1fWyfwaeHGXQa4GN0QI9bIVDLVTVak6mUMB3SOpHqEbaudkqre6y_zggHMpRASf/exec';
async function boundedText(stream,limit){
 const reader=stream.getReader(),chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw Error('Payload too large');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return new TextDecoder().decode(bytes);
}
export async function submitRevocation(request){
 const headers={'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 if(request.method!=='POST')return new Response(JSON.stringify({ok:false}),{status:405,headers});
 if(request.headers.get('Origin')&&request.headers.get('Origin')!==new URL(request.url).origin)return new Response(JSON.stringify({ok:false}),{status:403,headers});
 try{
  const payload=JSON.parse(await boundedText(request.body,8192));
  if(payload.action!=='revocation'||payload.website||!/^[-a-f0-9]{36}$/.test(payload.requestId||''))return new Response(JSON.stringify({ok:false}),{status:400,headers});
  const response=await fetch(LEGAL_ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow',signal:AbortSignal.timeout(60000)});
  const result=JSON.parse(await boundedText(response.body,16384));
  if(!response.ok||!result.ok||typeof result.code!=='string')throw Error('Unconfirmed');
  return new Response(JSON.stringify({ok:true,code:result.code,emailSent:result.emailSent===true}),{headers});
 }catch{return new Response(JSON.stringify({ok:false,error:'No pudimos confirmar el registro.'}),{status:502,headers});}
}
export function originPath(path){
 if(path===LANDING)return '/programas/inspiraccion-nivel-2/';
 if(path.startsWith(LANDING))return '/programas/inspiraccion-nivel-2/'+path.slice(LANDING.length);
 if(path.startsWith('/legal/')||path.startsWith('/arrepentimiento/'))return path;
 return null;
}
export default {
 async fetch(request){
  const url=new URL(request.url);
  if(url.pathname==='/arrepentimiento/enviar')return submitRevocation(request);
  if(url.pathname==='/inspiraccion/nivel-2'||url.pathname.startsWith('/programas/inspiraccion-nivel-2'))return Response.redirect('https://www.escueladelpensamientointuitivo.com'+LANDING+url.search,301);
  if(url.pathname==='/arrepentimiento')return Response.redirect(url.origin+'/arrepentimiento/',301);
  const path=originPath(url.pathname);
  if(!path)return new Response('Página no encontrada',{status:404});
  if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Método no permitido',{status:405});
  try{
   const originUrl=PAGES+path+url.search;
   const response=await fetch(originUrl,{method:request.method,redirect:'manual'});
   const headers=new Headers(response.headers);headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','strict-origin-when-cross-origin');
   const output=new Response(response.body,{status:response.status,headers});
   if(!response.headers.get('Content-Type')?.includes('text/html'))return output;
   return new HTMLRewriter().on('[src]',{element(el){const src=el.getAttribute('src');if(src&&!/^(https?:|data:|\/)/.test(src))el.setAttribute('src',new URL(src,originUrl).href);}}).on('link[href]',{element(el){const href=el.getAttribute('href');if(href&&!/^(https?:|\/)/.test(href))el.setAttribute('href',new URL(href,originUrl).href);}}).transform(output);
  }catch{return new Response('No pudimos cargar esta página. Contacto: info@escueladelpensamientointuitivo.com',{status:502});}
 }
};
