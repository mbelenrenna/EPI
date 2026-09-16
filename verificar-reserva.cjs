const fs=require('fs'),vm=require('vm'),assert=require('assert');
const js=fs.readFileSync('programas/inspiraccion-nivel-2/nivel2.js','utf8');
const script=js.slice(js.indexOf("(() => {\n  const ENDPOINT"),js.indexOf("(() => {\n  const button = document.querySelector('.menu-toggle')"));
async function run(paymentMethod,payload){
 const element=()=>({children:[],hidden:false,textContent:'',innerHTML:'',setAttribute(){},querySelectorAll(){return[]},addEventListener(type,fn){this[type]=fn},append(...items){this.children.push(...items)},scrollIntoView(options){this.scroll=options}});
 const status=element(),instructions=element(),receipt=element(),button=element(),result=element(),feedback=element();
 result.hidden=true;result.querySelector=s=>s==='[data-payment-instructions]'?instructions:s==='.copy-feedback'?feedback:receipt;
 const data={name:'Prueba local',email:'test@example.com',whatsapp:'000',country:'Prueba',generation:'Generación 4',paymentMethod,formationInterest:'yes',consent:'on'};
 const form={hidden:false,elements:{paymentMethod:{selectedOptions:[{textContent:paymentMethod}]}},querySelector:s=>s==='.form-status'?status:button,addEventListener(type,fn){this.submit=fn}};
 let sent,copied,copyFailure=false;
 vm.runInNewContext(script,{navigator:{clipboard:{writeText:async value=>{if(copyFailure)throw Error('Bloqueado');copied=value}}},document:{querySelector:s=>s==='#enrollment-form'?form:result,createElement:element},window:{matchMedia:()=>({matches:true})},FormData:class{entries(){return Object.entries(data)}},fetch:async(url,request)=>{sent=JSON.parse(request.body);return{json:async()=>payload}},Intl,Number,Math,encodeURIComponent,Error});
 for(const [value,label] of [['Epi.arg','Copiar alias'],['0070267830004086914782','Copiar CBU'],['0070267831004062922717','Copiar CBU']]){
  const copyButton={dataset:{copyBank:value},getAttribute:()=>label};
  await result.click({target:{closest:()=>copyButton}});
  assert.equal(copied,value);assert(feedback.textContent.includes('copiado'));
 }
 copyFailure=true;
 await result.click({target:{closest:()=>({dataset:{copyBank:'Epi.arg'}})}});
 assert(feedback.textContent.includes('No se pudo copiar'));
 await form.submit({preventDefault(){}});
 assert.equal(sent.formationInterest,'yes');
 if(!payload.ok){assert(!form.hidden);assert(!button.disabled);assert(status.textContent.includes('Podés consultar a Jose'));return;}
 assert(form.hidden&&!result.hidden);assert.equal(result.scroll.behavior,'auto');assert.equal(result.scroll.block,'start');
 const message=new URL(receipt.href).searchParams.get('text');
 assert(message.startsWith('Hola Jose, soy Prueba local.'));assert(message.includes('También me interesa la Formación'));
 if(paymentMethod==='ARS_GALICIA'&&payload.quote){
  const block=instructions.children[1];
  assert.equal(block.children[0].textContent,'Importe a transferir: ARS 180.000');
  assert.equal(block.children[1].textContent,'Cotización del dólar: ARS 1.200');
  assert.equal(block.children[2].textContent,'Cotización actualizada: 16/09/2026 12:30');
  assert(message.includes('blue venta ARS 1200'));assert.equal(receipt.textContent,'Enviar comprobante por WhatsApp');
 }else if(paymentMethod==='ARS_GALICIA'||paymentMethod==='OTHER'){
  assert.equal(receipt.textContent,'Consultar el pago por WhatsApp');assert(message.includes('Quisiera consultar las opciones de pago.'));
 }else if(paymentMethod==='PAYPAL')assert(instructions.children[1].textContent.endsWith('USD 157.50'));
 console.log('PASS reserva local: '+paymentMethod+(payload.quote?' con cotización':''));
}
(async()=>{
 await run('ARS_GALICIA',{ok:true,reserve:150,quote:{sell:1200,updatedAt:'16/09/2026 12:30'}});
 await run('ARS_GALICIA',{ok:true,reserve:150,quote:null});
 for(const method of ['USD_GALICIA','WISE','PAYPAL','OTHER'])await run(method,{ok:true,reserve:150});
 await run('USD_GALICIA',{ok:false,error:'Error de prueba'});
 console.log('PASS: importe, fecha, recargo, comprobante, consulta, interés y error. Sin enviar datos reales.');
})().catch(error=>{console.error(error);process.exitCode=1});
