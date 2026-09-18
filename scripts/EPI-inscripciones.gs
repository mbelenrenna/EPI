const CONFIG = Object.freeze({
  SHEET_ID: '1nujKWSiQd-gNAHxU9D8QWXZ-kctzQBWa_Jmvpe7QIiM',
  SHEET_NAME: 'Seguimiento', FIRST_DATA_ROW: 8,
  SYSTEME_TAG: 'NIVEL 2 - G4', SYSTEME_BASE: 'https://api.systeme.io/api'
});

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if(e && e.parameter && e.parameter.action === 'confirmAcceptance') return confirmarAceptacionV2_(e.parameter);
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if(payload.action === 'revocation') return registrarArrepentimiento_(payload);
    validate_(payload);
    registrarAceptacion_(payload);
    ['name','email','whatsapp','country','generation','paymentMethod'].forEach(function(key){payload[key]=String(payload[key]).trim();});
    payload.email = payload.email.toLowerCase();
    const pricing = pricingFor_(new Date());
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    lock.waitLock(20000);
    const records = sheet.getRange(8, 1, 200, 3).getValues();
    const existing = records.findIndex(function(record) { return record[0] && String(record[2]).toLowerCase() === payload.email.toLowerCase(); });
    if (existing >= 0) {
      if (payload.formationInterest === 'yes') {
        sheet.getRange(existing+8,33).setValue('Sí');
        sheet.getRange(existing+8,30).setValue('Pendiente');
      }
      const record = sheet.getRange(existing+8,1,1,32).getValues()[0];
      if (record[14] !== 'Sí' && record[20] !== 'Sí') sheet.getRange(existing+8,9,1,2).setValues([[pricing.value,pricing.reserve]]);
      const amounts = sheet.getRange(existing + 8, 9, 1, 2).getValues()[0];
      lock.releaseLock();
      syncRow_(sheet, existing + 8);
      return json_({ ok: true, value: amounts[0], reserve: amounts[1], existing: true, quote: quoteSafe_() });
    }
    const index = records.findIndex(function(record) { return !record[0] && !record[2]; });
    if (index < 0) throw new Error('Contactá a José para completar tu reserva.');
    const row = CONFIG.FIRST_DATA_ROW + index;
    sheet.getRange(row, 1, 1, 32).setValues([buildRow_(payload, pricing)]);
    sheet.getRange(row,33).setValue(payload.formationInterest === 'yes' ? 'Sí' : 'No');
    restoreFormulas_(sheet, row);
    lock.releaseLock();
    const quote = payload.paymentMethod === 'ARS_GALICIA' ? quoteSafe_() : null;
    if (quote) {
      sheet.getRange(row,13).setValue(quote.sell);
      sheet.getRange(row,29).setValue('Cotización mostrada: blue venta DólarHoy ARS ' + quote.sell + ' · Actualización de fuente: ' + quote.updatedAt);
    }
    syncRow_(sheet, row);
    return json_({ ok: true, value: pricing.value, reserve: pricing.reserve, stage: pricing.stage, quote: quote });
  } catch (err) { return json_({ ok: false, error: 'No pudimos registrar tus datos. Intentá nuevamente o contactá a José.' }); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}

function doGet(e) {
 if(e && e.parameter && e.parameter.action === 'confirmAcceptance') return paginaConfirmacionV2_(e.parameter);
 return json_({ ok: true, service: 'InspirAcción Nivel 2 · Generación 4', legalVersion: '2026-09-18', revocationReady: true, acceptanceVersion: 2 });
}
function legalSheet_(name,headers) {
  const book=SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet=book.getSheetByName(name)||book.insertSheet(name);
  if(!sheet.getLastRow())sheet.appendRow(headers);
  return sheet;
}
function legalText_(value,max) {
  const text=String(value||'').trim();
  if(!text||text.length>max)throw new Error('Dato inválido');
  return /^[=+@-]/.test(text)?"'"+text:text;
}
function registrarAceptacion_(p) {
  return guardarAceptacionV2_(p);
}
function registrarArrepentimiento_(p) {
  if(p.website||!/^[-a-f0-9]{36}$/.test(p.requestId||'')||!/^\S+@\S+\.\S+$/.test(p.email||'')||!/^\d{4}-\d{2}-\d{2}$/.test(p.enrollmentDate||''))throw new Error('Datos inválidos');
  const values=[legalText_(p.name,150),legalText_(p.document,40),legalText_(p.email,200),legalText_(p.program,150),p.enrollmentDate];
  const sheet=legalSheet_('Arrepentimientos',['Código','Fecha/hora servidor','Nombre','Documento','Email','Programa','Fecha inscripción','Estado','Aviso a EPI','Constancia al participante','ID solicitud']);
  const lock=LockService.getScriptLock();lock.waitLock(20000);let row,code;
  try{
    const records=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,11).getValues():[];
    const index=records.findIndex(function(r){return r[10]===p.requestId;});
    if(index>=0){row=index+2;code=records[index][0];}
    else{code='EPI-'+Utilities.getUuid();sheet.appendRow([code,new Date()].concat(values,['Pendiente','','',p.requestId]));row=sheet.getLastRow();}
  }finally{lock.releaseLock();}
  notificarArrepentimiento_(sheet,row);
  return json_({ok:true,code:code,emailSent:sheet.getRange(row,10).getValue()==='Enviado'});
}
function notificarArrepentimiento_(sheet,row) {
  const r=sheet.getRange(row,1,1,11).getValues()[0];
  const body='Código de gestión: '+r[0]+'\nFecha/hora: '+Utilities.formatDate(r[1],'America/Argentina/Buenos_Aires','yyyy-MM-dd HH:mm:ss')+' (Argentina)\nNombre: '+r[2]+'\nDocumento: '+r[3]+'\nEmail: '+r[4]+'\nPrograma: '+r[5]+'\nFecha de inscripción: '+r[6]+'\n\nEsta constancia confirma la recepción del pedido, no la ejecución del reintegro.';
  if(r[8]!=='Enviado')try{MailApp.sendEmail({to:'info@escueladelpensamientointuitivo.com',subject:'EPI · Solicitud de arrepentimiento · '+r[0],body:body});sheet.getRange(row,9).setValue('Enviado');}catch(e){sheet.getRange(row,9).setValue('Pendiente de reintento');}
  if(r[9]!=='Enviado')try{MailApp.sendEmail({to:String(r[4]).replace(/^'/,''),subject:'EPI · Constancia de solicitud · '+r[0],body:body,replyTo:'info@escueladelpensamientointuitivo.com'});sheet.getRange(row,10).setValue('Enviado');}catch(e){sheet.getRange(row,10).setValue('Pendiente de reintento');}
}
function procesarNotificacionesLegales(){
  procesarAceptacionesV2_();
  const sheet=SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName('Arrepentimientos');if(!sheet||sheet.getLastRow()<2)return;
  const records=sheet.getRange(2,1,sheet.getLastRow()-1,11).getValues();let count=0;
  records.forEach(function(r,i){if(count<10&&(r[8]!=='Enviado'||r[9]!=='Enviado')){notificarArrepentimiento_(sheet,i+2);count++;}});
}
function instalarLegal(){
  MailApp.getRemainingDailyQuota();
  legalSheet_('Arrepentimientos',['Código','Fecha/hora servidor','Nombre','Documento','Email','Programa','Fecha inscripción','Estado','Aviso a EPI','Constancia al participante','ID solicitud']);
  if(!ScriptApp.getProjectTriggers().some(function(t){return t.getHandlerFunction()==='procesarNotificacionesLegales';}))ScriptApp.newTrigger('procesarNotificacionesLegales').timeBased().everyMinutes(5).create();
  console.log('Registro legal y reintentos instalados. Actualizar la implementación web a una nueva versión.');
}
function comprobarConexion() {
  SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME).getRange('A7').getValue();
  systemeFetch_('/tags?limit=10');
  console.log('Google Sheets y Systeme: conexión correcta.');
  console.log('DólarHoy:', quoteSafe_() ? 'cotización disponible' : 'cotización no disponible');
}
function quoteSafe_() {
  try {
    const response = UrlFetchApp.fetch('https://dolarhoy.com/cotizaciondolarblue', { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) return null;
    const html = response.getContentText();
    if (html.length > 1000000) return null;
    const sale = html.match(/<div class="topic">\s*Venta\s*<\/div>\s*<div class="value">\s*\$([\d.,]+)\s*<\/div>/);
    const updated = html.match(/Actualizado por última vez:\s*([^<]+)/);
    if (!sale || !updated) return null;
    const sell = Number(sale[1].replace(/\./g,'').replace(',','.'));
    if (!Number.isFinite(sell) || sell <= 0) return null;
    return { sell: sell, updatedAt: updated[1].trim(), source: 'https://dolarhoy.com/cotizaciondolarblue' };
  } catch (err) { return null; }
}
function stateFor_(record) {
  if (/cancelad/i.test(record[25])) return 'Cancelado';
  if (/no continu|se cayó|se cayo/i.test(record[25])) return 'No continuó';
  if (record[24] === 'Pago completo') return 'Inscripción completa';
  if (record[24] === 'Reserva confirmada') return 'Pago confirmado';
  return 'Reserva iniciada';
}
function syncRow_(sheet, row) {
  const payment = sheet.getRange(row,15,1,2).getValues()[0];
  if (payment[0] === 'Sí' && payment[1] instanceof Date && !isNaN(payment[1].getTime())) {
    const agreed = pricingFor_(payment[1]);
    sheet.getRange(row,9,1,2).setValues([[agreed.value,agreed.reserve]]);
    SpreadsheetApp.flush();
  }
  const record = sheet.getRange(row,1,1,33).getValues()[0];
  if (!record[0] || !record[2]) return;
  const state = stateFor_(record);
  try {
    const contact = upsertSystemeContact_({email:String(record[2]),name:String(record[1]),whatsapp:String(record[3])});
    assignTag_(contact.id, CONFIG.SYSTEME_TAG);
    if (record[32] === 'Sí') assignTag_(contact.id, 'N2 G4 · Interés en Formación');
    assignTag_(contact.id, 'N2 G4 · ' + state);
    const previous = String(record[29]);
    if (previous && previous !== 'Error' && previous !== 'Pendiente' && previous !== state) {
      const previousTag = getOrCreateTag_('N2 G4 · ' + previous);
      systemeFetch_('/contacts/' + contact.id + '/tags/' + previousTag.id, {method:'delete'});
    }
    sheet.getRange(row,30,1,3).setValues([[state,new Date(),'']]);
  } catch (err) {
    sheet.getRange(row,30,1,3).setValues([['Error',new Date(),String(err.message||err).slice(0,500)]]);
  }
}
function sincronizarSeguimiento() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    SpreadsheetApp.flush();
    const records = sheet.getRange(8,1,200,32).getValues();
    let count = 0;
    records.forEach(function(record,index) {
      if (count < 5 && record[0] && record[2] && record[29] !== stateFor_(record)) {
        syncRow_(sheet,index+8); count++;
      }
    });
  } finally { lock.releaseLock(); }
}
function instalarSeguimiento() {
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
  if (sheet.getMaxColumns()<33) sheet.insertColumnsAfter(sheet.getMaxColumns(),33-sheet.getMaxColumns());
  sheet.getRange(7,33).setValue('Interés en Formación');
  const exists = ScriptApp.getProjectTriggers().some(function(trigger){return trigger.getHandlerFunction()==='sincronizarSeguimiento';});
  if (!exists) ScriptApp.newTrigger('sincronizarSeguimiento').timeBased().everyMinutes(5).create();
  sincronizarSeguimiento();
  console.log('Seguimiento instalado: sincronización cada 5 minutos.');
}
function restoreFormulas_(sheet, r) {
  sheet.getRange(r,14).setFormula('=IF(K'+r+'="","",IF(L'+r+'="USD",K'+r+',IF(AND(L'+r+'="ARS",M'+r+'>0),K'+r+'/M'+r+',"")))');
  sheet.getRange(r,20).setFormula('=IF(Q'+r+'="","",IF(R'+r+'="USD",Q'+r+',IF(AND(R'+r+'="ARS",S'+r+'>0),Q'+r+'/S'+r+',"")))');
  sheet.getRange(r,23).setFormula('=IF(O'+r+'="Sí",N(N'+r+'),0)+IF(U'+r+'="Sí",N(T'+r+'),0)');
  sheet.getRange(r,24).setFormula('=MAX(0,I'+r+'-W'+r+')');
  sheet.getRange(r,25).setFormula('=IF(W'+r+'>=I'+r+',"Pago completo",IF(W'+r+'>=J'+r+',"Reserva confirmada",IF(W'+r+'>0,"Reserva incompleta","Sin pago")))');
}
function validate_(p) { ['name','email','whatsapp','country','generation','paymentMethod'].forEach(function(k){ if(!String(p[k]||'').trim() || String(p[k]).length > 254) throw new Error('Dato inválido: '+k); }); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) throw new Error('El email no es válido'); if(['ARS_GALICIA','USD_GALICIA','WISE','PAYPAL','OTHER'].indexOf(p.paymentMethod)<0) throw new Error('Medio de pago inválido'); if(!p.consent) throw new Error('Falta consentimiento'); }
function pricingFor_(date) { const key=Number(Utilities.formatDate(date,'America/Argentina/Buenos_Aires','yyyyMMdd')); if(key<=20261015)return{stage:'Early bird',value:300,reserve:150}; if(key<=20261105)return{stage:'Segunda etapa',value:350,reserve:175}; return{stage:'Valor de lista',value:400,reserve:400}; }
function safeCell_(value){const text=String(value);return /^[=+@-]/.test(text) ? "'"+text : text;}
function buildRow_(p,pricing){ const row=new Array(32).fill(''); row[0]=new Date();row[1]=safeCell_(p.name);row[2]=safeCell_(p.email.toLowerCase());row[3]=safeCell_(p.whatsapp);row[4]=safeCell_(p.country);row[5]=safeCell_(p.generation);row[6]=paymentLabel_(p.paymentMethod);row[7]=p.paymentMethod==='ARS_GALICIA'?'ARS':'USD';row[8]=pricing.value;row[9]=pricing.reserve;row[25]=p.paymentMethod==='OTHER'?'Consulta de pago':'Esperando comprobante';row[28]='Medio elegido: '+paymentLabel_(p.paymentMethod);row[29]='Pendiente';return row; }
function paymentLabel_(m){return({ARS_GALICIA:'Transferencia ARS · Galicia',USD_GALICIA:'Transferencia USD · Galicia',WISE:'Wise',PAYPAL:'PayPal',OTHER:'Asesoramiento personalizado'})[m]||m;}
function systemeFetch_(path,options){const key=PropertiesService.getScriptProperties().getProperty('SYSTEME_API_KEY');if(!key)throw new Error('Falta configurar SYSTEME_API_KEY');const response=UrlFetchApp.fetch(CONFIG.SYSTEME_BASE+path,Object.assign({muteHttpExceptions:true,headers:{'X-API-Key':key,'Content-Type':'application/json'}},options||{}));const code=response.getResponseCode(),body=response.getContentText();if(code<200||code>=300)throw new Error('Systeme '+code+': '+body.slice(0,300));return body?JSON.parse(body):{};}
function upsertSystemeContact_(p){const found=systemeFetch_('/contacts?email='+encodeURIComponent(p.email)+'&limit=10');if(found.items&&found.items.length)return found.items[0];return systemeFetch_('/contacts',{method:'post',payload:JSON.stringify({email:p.email.toLowerCase(),locale:'es',fields:[{slug:'first_name',value:p.name},{slug:'phone_number',value:p.whatsapp}]})});}
function getOrCreateTag_(name){const result=systemeFetch_('/tags?query='+encodeURIComponent(name)+'&limit=100');const match=(result.items||[]).find(function(tag){return tag.name===name;});return match||systemeFetch_('/tags',{method:'post',payload:JSON.stringify({name:name})});}
function assignTag_(contactId,tagName){const tag=getOrCreateTag_(tagName);systemeFetch_('/contacts/'+contactId+'/tags',{method:'post',payload:JSON.stringify({tagId:tag.id})});}
function json_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
