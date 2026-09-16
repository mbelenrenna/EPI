const fs=require('fs'),path=require('path');
const template=fs.readFileSync('templates/nivel2.html','utf8');
const content=JSON.parse(fs.readFileSync('content/nivel2/textos.json','utf8'));
function escape(text){return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
const html=template.replace(/\{\{copy\.([a-z]+)\.(texto\d+)\}\}/g,(_,section,key)=>{
 const text=content.copy?.[section]?.[key];
 if(typeof text!=='string')throw Error('Contenido faltante '+section+'.'+key);
 return escape(text);
});
if(/\{\{copy\./.test(html))throw Error('Hay variables sin resolver');
const output=process.argv[2];
if(!output)throw Error('Indicar ruta de salida; no sobrescribir la landing sin revisión.');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,html);
console.log('HTML generado: '+output);
