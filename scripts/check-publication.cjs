const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=process.argv[2],origin=process.argv[3];
if(!root||!origin)throw Error('Indicar artefacto y URL anterior');
const changed=new Set(['programas/inspiraccion-nivel-2/index.html','programas/inspiraccion-nivel-2/nivel2.css']);
const list=[];function scan(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,f.name);if(f.isDirectory())scan(full);else list.push(path.relative(root,full).replaceAll('\\','/'));}}scan(root);
const old=list.filter(p=>!p.startsWith('legal/')&&!p.startsWith('arrepentimiento/')&&!changed.has(p));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let index=0;const failures=[];
async function check(){while(index<old.length){const p=old[index++];try{const res=await fetch(origin+'/'+p,{signal:AbortSignal.timeout(25000)});if(!res.ok||hash(Buffer.from(await res.arrayBuffer()))!==hash(fs.readFileSync(path.join(root,p))))failures.push(p);}catch{failures.push(p);}}}
Promise.all(Array.from({length:6},check)).then(()=>{console.log(JSON.stringify({totalFiles:list.length,unchangedChecked:old.length,failures}));if(failures.length)process.exitCode=1;});
