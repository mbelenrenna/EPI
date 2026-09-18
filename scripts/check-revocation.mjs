import assert from 'node:assert/strict';
import {submitRevocation,originPath} from '../infra/routing/worker.mjs';
const url='https://www.escueladelpensamientointuitivo.com/arrepentimiento/enviar';
const payload={action:'revocation',requestId:'2c57bdf7-c9ef-4c44-bdfa-0b92b3617899',website:''};
const realFetch=globalThis.fetch;let calls=0;
globalThis.fetch=async()=>{calls++;return Response.json({ok:true,code:'EPI-TEST',emailSent:true});};
const request=()=>new Request(url,{method:'POST',headers:{Origin:new URL(url).origin},body:JSON.stringify(payload)});
try{
 assert.deepEqual(await (await submitRevocation(request())).json(),{ok:true,code:'EPI-TEST',emailSent:true});
 assert.equal((await submitRevocation(new Request(url))).status,405);
 assert.equal((await submitRevocation(new Request(url,{method:'POST',headers:{Origin:'https://example.com'},body:'{}'}))).status,403);
 assert.equal((await submitRevocation(new Request(url,{method:'POST',body:'{}'}))).status,400);
 assert.equal(calls,1);
 globalThis.fetch=async()=>new Response('<html>Error</html>');
 assert.equal((await submitRevocation(request())).status,502);
 assert.equal(originPath('/school/course/inspiraccion2'),null);
 console.log('PASS: confirmación, rechazo de otros orígenes, errores sin falso éxito, cursos sin cambios. Sin registros reales creados.');
}finally{globalThis.fetch=realFetch;}
