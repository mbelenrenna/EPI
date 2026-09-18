const fs=require('fs');
const document=fs.readFileSync('content/nivel2/reglamento-2026-09-18.txt','utf8');
const combined=fs.readFileSync('scripts/EPI-inscripciones.gs','utf8')+'\nconst ACCEPTANCE_DOCUMENT_TEXT='+JSON.stringify(document)+';\n'+fs.readFileSync('scripts/EPI-aceptaciones.gs','utf8');
fs.mkdirSync('output',{recursive:true});fs.writeFileSync('output/EPI-AppsScript-completo.gs',combined);
new Function(combined);
console.log('Código completo generado y sintaxis verificada: output/EPI-AppsScript-completo.gs');
