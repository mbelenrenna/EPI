const fs=require('fs'),path=require('path'),crypto=require('crypto');
const template=fs.readFileSync('templates/nivel2.html','utf8');
const content=JSON.parse(fs.readFileSync('content/nivel2/textos.json','utf8'));
const legal=JSON.parse(fs.readFileSync('content/nivel2/legal.json','utf8'));
const documentHash=crypto.createHash('sha256').update(fs.readFileSync('content/nivel2/reglamento-2026-09-18.txt')).digest('hex');
function escape(text){return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
let html=template.replace(/\{\{copy\.([a-zA-Z0-9_.]+)\}\}/g,(_,key)=>{
 const text=key.split('.').reduce((value,part)=>value?.[part],content.copy);
 if(typeof text!=='string')throw Error('Contenido faltante '+key);
 return escape(text);
});
if(/\{\{copy\./.test(html))throw Error('Hay variables sin resolver');
html=html.replace('</head>','<link rel="icon" type="image/svg+xml" href="favicon-epi.svg?v=20260918"></head>');
const legalReady=legal.aprobado===true && Boolean(legal.reglamentoUrl) && Boolean(legal.reglamentoVersion);
if(legal.aprobado && !legalReady)throw Error('El reglamento aprobado necesita URL y versión.');
if(legal.reglamentoUrl && !/^(https:\/\/|\/(?!\/))/.test(legal.reglamentoUrl))throw Error('URL de reglamento inválida.');
const legalLink=legalReady ? '<a href="'+escape(legal.reglamentoUrl).replaceAll('"','&quot;')+'" target="_blank" rel="noopener">'+escape(legal.enlaceTexto)+'</a>' : '<span data-reglamento-link>'+escape(legal.enlaceTexto)+'</span>';
 html=html.replace('<span>'+escape(content.copy.inscripcion.texto024)+'</span>', '<span>He leído y acepto el '+legalLink+' de EPI.</span>');
if(legalReady){
 html=html.replace('<input type="checkbox" name="consent" required>', '<input type="checkbox" name="consent" required><input type="hidden" name="reglamentoVersion" value="'+escape(legal.reglamentoVersion).replaceAll('"','&quot;')+'"><input type="hidden" name="reglamentoHash" value="'+documentHash+'">');
 html=html.replace('<label class="consent formation-interest">','<label>Documento (DNI o pasaporte)<input name="document" maxlength="40" required></label><p class="legal-note">'+escape(legal.cancelacion)+' <a href="'+legal.condicionesUrl+'">Condiciones particulares de Nivel 2</a>. Tus datos se utilizan para gestionar la inscripción, conforme al reglamento.</p><label class="consent formation-interest">');
}
 html=html.replace('<p class="form-status"', '<p class="legal-note">'+escape(legal.notaPago)+'</p><p class="form-status"');
 html=html.replace('<small>'+escape(content.copy.inscripcion.texto029)+'</small>', '<p class="legal-note">'+escape(legal.notaPago)+'</p><small>'+escape(content.copy.inscripcion.texto029)+'</small>');
html=html.replace('<div class="footer-links">','<div class="footer-links"><a href="mailto:'+legal.contacto+'">'+legal.contacto+'</a>');
html=html.replace('<span>'+escape(content.copy.contacto.texto006)+'</span>', '<div class="footer-copyright"><span>Copyright © 2026 Escuela del Pensamiento Intuitivo</span><span>'+legalLink+'</span><span><a href="'+legal.condicionesUrl+'">Condiciones particulares de Nivel 2</a></span><span><a href="/arrepentimiento/">Botón de Arrepentimiento</a></span></div>');
html=html.replace('<p>'+escape(content.copy.preguntas.texto023)+'</p></details>', '<p>'+escape(content.copy.preguntas.texto023)+'</p></details><details><summary>'+escape(content.copy.preguntas.terapiaPregunta)+'<span>+</span></summary><p>'+escape(content.copy.preguntas.terapiaRespuesta)+'</p></details>');
for(const asset of ['nivel2.css','nivel2.js']){
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join('programas/inspiraccion-nivel-2',asset))).digest('hex').slice(0,10);
 html=html.replaceAll('"'+asset+'"','"'+asset+'?v='+hash+'"');
}
const output=process.argv[2];
if(!output)throw Error('Indicar ruta de salida; no sobrescribir la landing sin revisión.');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,html);
console.log('HTML generado: '+output);
