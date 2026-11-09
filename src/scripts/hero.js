import {$,$$,RM,E} from './core.js';

/* ===== HERO BEHAVIOUR =====
   Markup + scene texts are rendered per language (src/lib/views.js, config in src/data/site.js → HERO) and passed via data-hero.
   Parts: initHero > load/play (video) · text (content) · go + progress (state) */
const heroTitle=l=>l.map(x=>`<span>${x}</span>`).join('');
let heroCtl;
function initHero(){heroCtl&&heroCtl.abort();const hero=$('#hero');if(!hero)return;const H=JSON.parse(hero.dataset.hero);
heroCtl=new AbortController();const sg={signal:heroCtl.signal},sc=$$('.hs',hero),btn=$$('.hp button',hero),ht=$('#ht'),N=sc.length,mq=matchMedia('(max-width:760px)'),lite=navigator.connection&&navigator.connection.saveData;let cur=0,fadeT;
const vid=i=>$('video',sc[i]),src=i=>H.base+H.scenes[i].v+(mq.matches?'-mobile':'')+'.mp4';
// video layer: staged loading, play only the active scene, poster stays underneath until a frame is ready
const load=i=>{const v=vid(i),u=src(i);if(lite||v.dataset.u===u)return;v.dataset.u=u;sc[i].classList.remove('rdy');v.preload=i==cur?'auto':'metadata';v.src=u;v.load()};
const play=i=>{const v=vid(i);if(!RM&&v.dataset.u&&!hero.classList.contains('off')&&!hero.classList.contains('pz'))v.play().catch(()=>{})};
sc.forEach((s,i)=>{const v=vid(i);v.addEventListener('loadeddata',()=>{s.classList.add('rdy');if(i==cur)play(i);if(i<N-1)load(i+1)},sg);v.addEventListener('error',()=>{s.classList.remove('rdy');if(i<N-1)load(i+1)},sg)});
// content layer: out (-15px) then in (+30px), same motion every time
const text=i=>{const s=H.scenes[i],set=()=>{$('#he').textContent=s.e;$('#hh').innerHTML=heroTitle(s.l)};if(RM||!ht.animate){set();return}
ht.getAnimations().forEach(a=>a.cancel());const o=ht.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-15px)'}],{duration:450,easing:E,fill:'forwards'});
o.onfinish=()=>{set();o.cancel();ht.animate([{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'none'}],{duration:800,easing:E})}};
// state: crossfade is CSS (.on); progress restarts because aria-current moves to another button
const go=n=>{const to=(n+N)%N;if(to==cur)return;cur=to;sc.forEach((s,k)=>s.classList.toggle('on',k==cur));sc.forEach((s,k)=>s.classList.toggle('wipe',k==cur));btn.forEach((b,k)=>b.setAttribute('aria-current',k==cur));
load(cur);try{vid(cur).currentTime=0}catch(e){}play(cur);clearTimeout(fadeT);fadeT=setTimeout(()=>sc.forEach((s,k)=>k!=cur&&vid(k).pause()),1300);text(cur)};
btn.forEach((b,k)=>b.addEventListener('click',()=>go(k),sg));
$('#pv').addEventListener('click',()=>go(cur-1),sg);$('#nx').addEventListener('click',()=>go(cur+1),sg);
$('.hp',hero).addEventListener('animationend',()=>go(cur+1),sg);
$('#ps').addEventListener('click',e=>{const b=e.currentTarget,p=hero.classList.toggle('pz');b.setAttribute('aria-pressed',p);b.setAttribute('aria-label',p?b.dataset.playA:b.dataset.pauseA);b.textContent=p?b.dataset.play:b.dataset.pause;p?vid(cur).pause():play(cur)},sg);
$('#hsc').addEventListener('click',()=>hero.nextElementSibling&&hero.nextElementSibling.scrollIntoView({behavior:RM?'auto':'smooth'}),sg);
mq.addEventListener('change',()=>{sc.forEach((s,i)=>vid(i).dataset.u='');load(cur)},sg);
const io=new IntersectionObserver(([e])=>{hero.classList.toggle('off',!e.isIntersecting);e.isIntersecting?play(cur):vid(cur).pause()},{threshold:.1});io.observe(hero);
sg.signal.addEventListener('abort',()=>{io.disconnect();clearTimeout(fadeT)});
if(RM)vid(0).autoplay=false;load(0)}

export {initHero};
