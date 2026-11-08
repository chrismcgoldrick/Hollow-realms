/* Species edits saved in the browser by the developer tools. */
'use strict';

/* ---- species data: built-ins plus anything saved from the developer tools ---- */
var BASE_ART=['human','elf','dwarf','dragonborn'];
var DEF_SPECIES=JSON.parse(JSON.stringify(SPECIES)),DEF_RULES=JSON.parse(JSON.stringify(SP_RULES));
var STORE_KEY='hollow.species.v1';
var spData={};   /* key -> {name,blurb,look,c,w,st,xp,custom} : only changed or custom entries */
function loadSp(){try{var t=localStorage.getItem(STORE_KEY);if(t)spData=JSON.parse(t)||{};}catch(e){spData={};}}
function saveSp(){try{localStorage.setItem(STORE_KEY,JSON.stringify(spData));return true;}catch(e){return false;}}
function applySp(){
  Object.keys(SPECIES).forEach(function(k){if(BASE_ART.indexOf(k)<0){delete SPECIES[k];delete SP_RULES[k];}});
  BASE_ART.forEach(function(k){SPECIES[k]=JSON.parse(JSON.stringify(DEF_SPECIES[k]));SP_RULES[k]=JSON.parse(JSON.stringify(DEF_RULES[k]));SPECIES[k].look=k;});
  Object.keys(spData).forEach(function(k){
    var d=spData[k];if(!d||typeof d!=='object')return;
    var look=BASE_ART.indexOf(d.look)>=0?d.look:'human';
    var base=BASE_ART.indexOf(k)>=0?SPECIES[k]:JSON.parse(JSON.stringify(DEF_SPECIES[look]));
    if(BASE_ART.indexOf(k)<0)delete base.info;
    base.name=String(d.name||k).slice(0,24);base.blurb=String(d.blurb||'').slice(0,240);base.look=BASE_ART.indexOf(k)>=0?k:look;
    SPECIES[k]=base;
    var c={};CHARS.forEach(function(ch){var v=d.c&&+d.c[ch[0]];c[ch[0]]=Math.max(1,Math.min(5,v||2));});
    var rl=BASE_ART.indexOf(k)>=0?SP_RULES[k]:{};rl.c=c;rl.w=Math.max(1,+d.w||10);rl.st=Math.max(1,+d.st||10);rl.xp=Math.max(0,+d.xp||100);SP_RULES[k]=rl;
  });
  if(!SPECIES[state.hero.species]){state.hero.species='human';state.hero.skin=0;}
}
function slug(n){return String(n).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'species';}
function allSpeciesList(){
  return Object.keys(SPECIES).map(function(k){var r=SP_RULES[k];return {key:k,name:SPECIES[k].name,blurb:SPECIES[k].blurb,look:SPECIES[k].look,c:r.c,w:r.w,st:r.st,xp:r.xp,custom:BASE_ART.indexOf(k)<0};});
}
