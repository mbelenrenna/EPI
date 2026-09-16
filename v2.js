const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-toggle');
const reveals=[...document.querySelectorAll('.reveal')];

window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>35),{passive:true});

function updateScrollProgress(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const progress=max>0?(window.scrollY/max)*100:0;
  header?.style.setProperty('--scroll-progress',`${Math.min(100,Math.max(0,progress))}%`);
}
window.addEventListener('scroll',updateScrollProgress,{passive:true});
updateScrollProgress();

menu?.addEventListener('click',()=>{
  const open=header.classList.toggle('menu-active');
  document.body.classList.toggle('menu-open',open);
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
});

document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{
  header.classList.remove('menu-active');document.body.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');
}));

const navLinks=[...document.querySelectorAll('.main-nav a[href^="#"]')];
const navSections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window&&navSections.length){
  const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting)navLinks.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')===`#${entry.target.id}`));
  }),{rootMargin:'-25% 0px -65% 0px'});
  navSections.forEach(section=>navObserver.observe(section));
}

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
  }),{threshold:.12,rootMargin:'0px 0px -40px'});
  reveals.forEach(el=>observer.observe(el));
}else{reveals.forEach(el=>el.classList.add('visible'))}

const slides=[...document.querySelectorAll('.testimonial')];
let current=0;
function showSlide(next){
  current=(next+slides.length)%slides.length;
  slides.forEach((slide,index)=>slide.classList.toggle('active',index===current));
  const counter=document.querySelector('.slider-controls b');if(counter)counter.textContent=String(current+1);
}

const conversionDock=document.querySelector('.conversion-dock');
const hero=document.querySelector('.hero');
if(conversionDock&&hero&&'IntersectionObserver' in window){
  new IntersectionObserver(([entry])=>conversionDock.classList.toggle('is-visible',!entry.isIntersecting),{threshold:.05}).observe(hero);
}
document.querySelector('[data-next]')?.addEventListener('click',()=>showSlide(current+1));
document.querySelector('[data-prev]')?.addEventListener('click',()=>showSlide(current-1));
