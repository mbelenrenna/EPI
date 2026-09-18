(() => {
 const form=document.querySelector('#revocation-form'),status=document.querySelector('#request-status');
 const endpoint='/arrepentimiento/enviar';
 let requestId=crypto.randomUUID();
 form.addEventListener('submit',async event=>{
  event.preventDefault();const button=form.querySelector('button');button.disabled=true;status.textContent='Registrando tu solicitud…';
  try{
   const data={...Object.fromEntries(new FormData(form)),action:'revocation',requestId};
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data),signal:AbortSignal.timeout(70000)});
   const result=await response.json();
   if(!response.ok || !result.ok || !result.code)throw Error();
   status.textContent='Solicitud registrada. Código de gestión: '+result.code+'. '+(result.emailSent?'Enviamos una constancia a tu correo.':'Conservá este código. Si no recibís el correo, contactá a la Escuela.');
   form.reset();requestId=crypto.randomUUID();
  }catch{status.textContent='No pudimos confirmar el registro. Intentá nuevamente o escribí a info@escueladelpensamientointuitivo.com. No se mostró una confirmación de envío.';}
  finally{button.disabled=false;}
 });
})();
