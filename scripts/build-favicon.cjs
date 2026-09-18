const fs=require('fs');
// Shows the symbol from the approved logo at tab size, preserving the original bitmap.
const logo=fs.readFileSync('assets/brand/logo-epi-oscuro.png').toString('base64');
fs.writeFileSync('programas/inspiraccion-nivel-2/favicon-epi.svg','<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="25 245 265 265"><image width="750" height="750" href="data:image/png;base64,'+logo+'"/></svg>');
console.log('Favicon SVG generado desde el logo aprobado.');
