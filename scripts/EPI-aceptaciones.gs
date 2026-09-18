// Electronic acceptance evidence, NOT a certified digital signature or immutable storage.
const ACCEPTANCE_HEADERS=['Fecha/hora servidor','Nombre','Email','Documento','Programa','Versión reglamento','Hash documento','URL documento','Aceptación','ID aceptación','Respaldo privado Drive','Sello técnico servidor','Constancia participante','Aviso EPI','Fecha confirmación email','Estado evidencia'];
const ACCEPTANCE_EMAIL='info@escueladelpensamientointuitivo.com';
const ACCEPTANCE_VERSION='2026-09-18';
const ACCEPTANCE_CLAUSE='Una vez vencido el plazo legal de revocación aplicable, no se realizan devoluciones por cancelación voluntaria del participante.';
function hexV2_(bytes){return bytes.map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');}
function hashV2_(text){return hexV2_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8));}
function sealV2_(text){const secret=PropertiesService.getScriptProperties().getProperty('ACCEPTANCE_SEAL_KEY');if(!secret)throw Error('Ejecutar instalarAceptaciones');return hexV2_(Utilities.computeHmacSha256Signature(text,secret,Utilities.Charset.UTF_8));}
function folderV2_(){const id=PropertiesService.getScriptProperties().getProperty('ACCEPTANCE_FOLDER_ID');if(!id)throw Error('Falta instalación de aceptaciones');return DriveApp.getFolderById(id);}
function acceptanceSheetV2_(){
 const sheet=legalSheet_('Aceptaciones',ACCEPTANCE_HEADERS);
 if(sheet.getMaxColumns()<16)sheet.insertColumnsAfter(sheet.getMaxColumns(),16-sheet.getMaxColumns());
 sheet.getRange(1,1,1,16).setValues([ACCEPTANCE_HEADERS]);return sheet;
}
function privateFileV2_(folder,name,text,mime){return folder.createFile(Utilities.newBlob(text,mime,name)).setSharing(DriveApp.Access.PRIVATE,DriveApp.Permission.NONE);}
function instalarAceptaciones(){
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const props=PropertiesService.getScriptProperties();
  if(!props.getProperty('ACCEPTANCE_SEAL_KEY'))props.setProperty('ACCEPTANCE_SEAL_KEY',Utilities.getUuid()+Utilities.getUuid()+Utilities.getUuid());
  if(!props.getProperty('ACCEPTANCE_FOLDER_ID'))props.setProperty('ACCEPTANCE_FOLDER_ID',DriveApp.createFolder('EPI · Evidencias privadas de aceptación').getId());
  const folder=folderV2_(),name='Reglamento-'+ACCEPTANCE_VERSION+'.txt';
  const files=folder.getFilesByName(name);
  if(files.hasNext()){if(hashV2_(files.next().getBlob().getDataAsString('UTF-8'))!==hashV2_(ACCEPTANCE_DOCUMENT_TEXT))throw Error('La copia archivada fue alterada. No sobrescribir: investigar.');}
  else privateFileV2_(folder,name,ACCEPTANCE_DOCUMENT_TEXT,'text/plain');
  acceptanceSheetV2_();MailApp.getRemainingDailyQuota();
 }finally{lock.releaseLock();}
 instalarLegal();
 console.log('Aceptaciones instaladas. Carpeta privada: '+folderV2_().getUrl()+'. Actualizar implementación a una nueva versión. Las filas antiguas NO se certificaron retroactivamente.');
}
function guardarAceptacionV2_(p){
 if(p.consent!=='on'||p.reglamentoVersion!==ACCEPTANCE_VERSION||p.reglamentoHash!==hashV2_(ACCEPTANCE_DOCUMENT_TEXT))throw Error('Reglamento incorrecto o sin aceptación');
 const email=String(p.email||'').trim().toLowerCase();if(!/^\S+@\S+\.\S+$/.test(email)||email.length>200)throw Error('Email inválido');
 legalText_(p.name,150);legalText_(p.document,40);
 const lock=LockService.getScriptLock();lock.waitLock(20000);let sheet,row;
 try{
  sheet=acceptanceSheetV2_();
  // Retry after an interrupted checkout reuses the latest identical acceptance for 30 minutes.
  const records=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,16).getValues():[];
  for(let i=records.length-1;i>=0;i--){const r=records[i];if(r[9]&&String(r[2]).replace(/^'/,'').toLowerCase()===email&&r[5]===ACCEPTANCE_VERSION&&String(r[3]).replace(/^'/,'')===String(p.document).trim()&&String(r[1]).replace(/^'/,'')===String(p.name).trim()&&Date.now()-new Date(r[0]).getTime()<1800000){row=i+2;break;}}
  if(!row){
   const id='EPI-ACE-'+Utilities.getUuid(),date=new Date();
   const record={id:id,acceptedAt:date.toISOString(),timeZone:'America/Argentina/Buenos_Aires',name:String(p.name).trim(),email:email,document:String(p.document).trim(),program:'InspirAcción Nivel 2 · G4',documentVersion:ACCEPTANCE_VERSION,documentHash:hashV2_(ACCEPTANCE_DOCUMENT_TEXT),documentUrl:'https://www.escueladelpensamientointuitivo.com/legal/reglamento-interno/'+ACCEPTANCE_VERSION+'/',consent:'He leído y acepto el Reglamento Interno y Términos de Participación de EPI.',programCancellation:ACCEPTANCE_CLAUSE,emailVerified:false};
   const body=JSON.stringify(record),signature=sealV2_(body);
   const file=privateFileV2_(folderV2_(),id+'.json',JSON.stringify({record:record,signature:signature}), 'application/json');
   sheet.appendRow([date,legalText_(p.name,150),email,legalText_(p.document,40),record.program,ACCEPTANCE_VERSION,record.documentHash,record.documentUrl,record.consent,id,file.getUrl(),signature,'Pendiente','Pendiente','','Registrada · email sin confirmar']);row=sheet.getLastRow();
  }
 }finally{lock.releaseLock();}
 enviarAceptacionV2_(sheet,row);return sheet.getRange(row,10).getValue();
}
function archivedV2_(id){
 if(!/^EPI-ACE-[-a-f0-9]{36}$/.test(id||''))throw Error('Identificador inválido');
 const files=folderV2_().getFilesByName(id+'.json');if(!files.hasNext())throw Error('Respaldo no encontrado');
 const file=files.next(),archive=JSON.parse(file.getBlob().getDataAsString('UTF-8'));
 if(archive.record.id!==id||sealV2_(JSON.stringify(archive.record))!==archive.signature)throw Error('Respaldo alterado');
 return {file:file,archive:archive};
}
function tokenV2_(id){return sealV2_('confirm-email:'+id);}
function enviarAceptacionV2_(sheet,row){
 const r=sheet.getRange(row,1,1,16).getValues()[0];if(!r[9])return;
 try{
  const data=archivedV2_(r[9]),record=data.archive.record;
  const verification=ScriptApp.getService().getUrl()+'?action=confirmAcceptance&id='+encodeURIComponent(record.id)+'&token='+tokenV2_(record.id);
  const body='Hola '+record.name+',\n\nRegistramos tu aceptación del Reglamento Interno y Términos de Participación de EPI.\nID: '+record.id+'\nFecha/hora (Argentina): '+Utilities.formatDate(new Date(record.acceptedAt),'America/Argentina/Buenos_Aires','yyyy-MM-dd HH:mm:ss')+'\nPrograma: '+record.program+'\nVersión: '+record.documentVersion+'\nTexto aceptado: '+record.consent+'\nCondiciones particulares: '+record.programCancellation+'\n\nAdjuntamos la copia exacta del reglamento y tu constancia. Esta constancia no confirma el pago ni el cupo.\nSi no realizaste esta solicitud, avisá a '+ACCEPTANCE_EMAIL+'.';
  const attachments=[Utilities.newBlob(ACCEPTANCE_DOCUMENT_TEXT,'text/plain','Reglamento-'+ACCEPTANCE_VERSION+'.txt'),Utilities.newBlob(JSON.stringify(data.archive,null,2),'application/json',record.id+'.json')];
  if(r[12]!=='Enviado')try{MailApp.sendEmail({to:record.email,subject:'EPI · Constancia de aceptación · '+record.id,body:body+'\n\nPara confirmar tu correo, abrí este enlace y presioná Confirmar:\n'+verification,attachments:attachments,replyTo:ACCEPTANCE_EMAIL});sheet.getRange(row,13).setValue('Enviado');}catch(e){sheet.getRange(row,13).setValue('Pendiente de reintento');}
  if(r[13]!=='Enviado')try{MailApp.sendEmail({to:ACCEPTANCE_EMAIL,subject:'EPI · Nueva aceptación · '+record.id,body:body+'\n\nEmail pendiente de confirmación. Respaldo privado: '+data.file.getUrl(),attachments:attachments});sheet.getRange(row,14).setValue('Enviado');}catch(e){sheet.getRange(row,14).setValue('Pendiente de reintento');}
 }catch(e){sheet.getRange(row,16).setValue('Error de integridad o respaldo · revisar');}
}
function procesarAceptacionesV2_(){
 const sheet=SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName('Aceptaciones');if(!sheet||sheet.getLastRow()<2||sheet.getLastColumn()<16)return;
 const rows=sheet.getRange(2,1,sheet.getLastRow()-1,16).getValues();let count=0;
 rows.forEach(function(r,i){if(count<10&&r[9]&&(r[12]!=='Enviado'||r[13]!=='Enviado')&&r[15]!=='Error de integridad o respaldo · revisar'){enviarAceptacionV2_(sheet,i+2);count++;}});
}
function pageV2_(text,extra){return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EPI · Confirmación de correo</title><body style="font:16px/1.6 Arial,sans-serif;color:#302b2e;background:#faf7f5;padding:24px"><main style="max-width:600px;margin:auto"><h1 style="font-size:24px">Escuela del Pensamiento Intuitivo</h1><p>'+text+'</p>'+(extra||'')+'<p>Contacto: '+ACCEPTANCE_EMAIL+'</p></main></body></html>');}
function validConfirmationV2_(p){return /^EPI-ACE-[-a-f0-9]{36}$/.test(p.id||'')&&/^[a-f0-9]{64}$/.test(p.token||'')&&tokenV2_(p.id)===p.token;}
function paginaConfirmacionV2_(p){
 if(!validConfirmationV2_(p))return pageV2_('El enlace no es válido. Contactá a la Escuela.');
 return pageV2_('Confirmá que usaste este correo para aceptar el reglamento de InspirAcción Nivel 2. Si no hiciste la solicitud, no confirmes y avisá a la Escuela.','<form method="post" target="_top" action="'+ScriptApp.getService().getUrl()+'"><input type="hidden" name="action" value="confirmAcceptance"><input type="hidden" name="id" value="'+p.id+'"><input type="hidden" name="token" value="'+p.token+'"><button style="background:#70265f;color:white;border:0;border-radius:24px;padding:12px 20px;font:inherit">Confirmar mi correo y aceptación</button></form>');
}
function confirmarAceptacionV2_(p){
 if(!validConfirmationV2_(p))return pageV2_('El enlace no es válido. Contactá a la Escuela.');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const archived=archivedV2_(p.id),folder=folderV2_(),name=p.id+'-confirmacion.json',files=folder.getFilesByName(name);let event;
  if(files.hasNext()){const existing=JSON.parse(files.next().getBlob().getDataAsString('UTF-8'));if(sealV2_(JSON.stringify(existing.record))!==existing.signature)throw Error('Confirmación alterada');event=existing.record;}
  else{event={id:p.id,email:archived.archive.record.email,confirmedAt:new Date().toISOString(),method:'Enlace privado y confirmación explícita POST'};privateFileV2_(folder,name,JSON.stringify({record:event,signature:sealV2_(JSON.stringify(event))}),'application/json');}
  const sheet=acceptanceSheetV2_(),rows=sheet.getRange(2,1,sheet.getLastRow()-1,16).getValues(),index=rows.findIndex(function(r){return r[9]===p.id;});
  if(index<0)throw Error('No encontramos la fila de seguimiento');
  sheet.getRange(index+2,15,1,2).setValues([[new Date(event.confirmedAt),'Registrada · email confirmado']]);
  return pageV2_('Tu correo quedó confirmado y la confirmación se agregó al respaldo de tu aceptación. Conservá la constancia que recibiste por email. Esto no confirma el pago ni el cupo.');
 }catch(e){return pageV2_('No pudimos confirmar tu correo. No se mostró una confirmación exitosa. Contactá a la Escuela.');}
 finally{lock.releaseLock();}
}
