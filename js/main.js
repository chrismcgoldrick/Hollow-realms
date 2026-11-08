/* Starts the game. Must be the LAST script loaded. */
'use strict';

/* ---- boot ---- */
loadSp();applySp();
buildCreate();wireHome();devWire();wirePlay();wireGtip();wireDev();
go(window.__start||'home');
if(window.ResizeObserver)new ResizeObserver(resizeStage).observe(stage);
window.addEventListener('resize',function(){resizeStage();if(document.body.classList.contains('menu'))resizeBg();});
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var last=0;
function frame(now){
  requestAnimationFrame(frame);
  if(reduce||now-last<62)return;   /* about 15 frames per second */
  var sc=state.screen;
  if(sc==='create'||sc==='train'||sc==='gear'){last=now;time=now/1000;renderStage();}
  else if(sc==='home'||sc==='devlogin'||sc==='world'){last=now;time=now/1000;drawBg();}
}
requestAnimationFrame(frame);
if(window.__test)window.__api={drawHero:drawHero,HAIR:HAIR,SPECIES:SPECIES,CLASSES:CLASSES,state:state};
