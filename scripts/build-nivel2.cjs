const fs=require('fs'),path=require('path'),crypto=require('crypto');
const template=fs.readFileSync('templates/nivel2.html','utf8');
const content=JSON.parse(fs.readFileSync('content/nivel2/textos.json','utf8'));
function escape(text){return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
let html=template.replace(/\{\{copy\.([a-zA-Z0-9_.]+)\}\}/g,(_,key)=>{
 const text=key.split('.').reduce((value,part)=>value?.[part],content.copy);
 if(typeof text!=='string')throw Error('Contenido faltante '+key);
 return escape(text);
});
if(/\{\{copy\./.test(html))throw Error('Hay variables sin resolver');
for(const asset of ['nivel2.css','nivel2.js']){
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join('programas/inspiraccion-nivel-2',asset))).digest('hex').slice(0,10);
 html=html.replaceAll('"'+asset+'"','"'+asset+'?v='+hash+'"');
}
const output=process.argv[2];
if(!output)throw Error('Indicar ruta de salida; no sobrescribir la landing sin revisión.');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,html);
console.log('HTML generado: '+output);
