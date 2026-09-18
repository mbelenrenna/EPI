const fs=require('fs'),assert=require('assert'),path=require('path');
const base='programas/inspiraccion-nivel-2/';
const html=fs.readFileSync(base+'index.html','utf8');
const copy=JSON.parse(fs.readFileSync('content/nivel2/textos.json','utf8')).copy;
assert(html.includes(copy.sesiones.texto003));
assert(html.includes(copy.sesiones.texto004));
assert(!html.includes('Guadalupe F · N1'));
assert(html.includes(copy.preguntas.terapiaPregunta));
assert(html.includes(copy.preguntas.terapiaRespuesta));
assert(html.includes('Copyright © 2026 Escuela del Pensamiento Intuitivo'));
assert(!html.includes('{{copy.'));
const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
for(const m of html.matchAll(/href="#([^"]+)"/g))assert(ids.has(m[1]),'Ancla inexistente '+m[1]);
for(const m of html.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)){
 if(/^(https?:|mailto:|#|\/)/.test(m[1]))continue;
 assert(fs.existsSync(path.resolve(base,m[1])),'Recurso local faltante '+m[1]);
}
const legal=JSON.parse(fs.readFileSync('content/nivel2/legal.json','utf8'));
if(!legal.aprobado){
 assert(html.includes('name="consent" required'),'Checkbox habilitado y obligatorio');
 assert(html.includes('He leído y acepto el '),'Texto de aceptación visible');
 assert(html.includes('data-reglamento-link'),'Lugar del enlace preparado');
 assert(!html.includes('href=""'),'No publicar enlaces vacíos');
}
new Function(fs.readFileSync(base+'nivel2.js','utf8'));
console.log('PASS: textos, FAQ, testimonios, footer, nota, checkbox habilitado, anclas, recursos y sintaxis. Documento y evidencia legal pendientes.');
