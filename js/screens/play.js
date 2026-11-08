/* Gameplay screen: story text, choices, HUD and side drawer. */
'use strict';

/* ---- gameplay screen ---- */
var playTab=null;

function renderPortrait(){
  var cv=$('portrait'),x=cv.getContext('2d'),h=state.hero;
  x.clearRect(0,0,96,96);
  var g=x.createLinearGradient(0,0,0,96);g.addColorStop(0,'#5d6f86');g.addColorStop(1,'#2b3a2c');x.fillStyle=g;x.fillRect(0,0,96,96);
  try{drawHero(x,h,1,48,PORTRAIT.y,PORTRAIT.k);}catch(e){}
}
var PORTRAIT={y:262,k:2.7};
function renderPlay(){
  var h=state.hero,C=compute(h);
  $('hudName').textContent=h.name.trim()||'Your hero';
  $('barW').style.width='100%';$('barS').style.width='100%';
  $('barWt').textContent=C.der.wound+' / '+C.der.wound;$('barSt').textContent=C.der.strain+' / '+C.der.strain;
  $('sceneTitle').textContent=SAMPLE.scene;$('narrText').textContent=SAMPLE.text;
  var ch=$('choices');ch.textContent='';
  SAMPLE.choices.forEach(function(c,i){
    var b=el('button','choice');b.type='button';
    var l=el('span');l.appendChild(el('span','n',String(i+1)));l.appendChild(document.createTextNode(c[0]));
    b.appendChild(l);b.appendChild(el('span','tag',c[1]));
    b.dataset.tip=c[1];b.addEventListener('click',function(){toast('Story choices are not wired up yet.');});ch.appendChild(b);
  });
  renderPortrait();openTab(null);
}
function drow(a,b){var r=el('div','drow');r.appendChild(el('span',null,a));r.appendChild(el('b',null,b));return r;}
function openTab(t){
  var d=$('drawer'),B=$('drawerBody'),h=state.hero;
  if(t===playTab)t=null;playTab=t;
  Array.prototype.forEach.call($('rail').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.t===t));});
  d.classList.toggle('open',!!t);if(!t)return;
  B.textContent='';
  if(t==='char'){
    $('drawerTitle').textContent=(h.name.trim()||'Your hero')+' · '+SPECIES[h.species].name+' '+CLASSES[h.cls].name;
    var C=compute(h);
    B.appendChild(el('h3',null,'Characteristics'));CHARS.forEach(function(c){B.appendChild(drow(c[1],String(C.chr[c[0]].v)));});
    B.appendChild(el('h3',null,'Vitals'));[['Soak',C.der.soak],['Wounds',C.der.wound],['Strain',C.der.strain],['Defense',C.der.def]].forEach(function(p){B.appendChild(drow(p[0],String(p[1])));});
    B.appendChild(el('h3',null,'Skills with ranks'));var any=false;
    SKILLS.forEach(function(s){var k=C.skills[s[0]];if(k.rank>0){any=true;B.appendChild(drow(s[0],'Rank '+k.rank));}});
    if(!any)B.appendChild(el('p','note','No trained skills yet.'));
  }else if(t==='map'){
    $('drawerTitle').textContent='Map';var m=el('div','mapph','Map coming soon');B.appendChild(m);
  }else{
    $('drawerTitle').textContent='Inventory';
    var gv=h.goldRolls[h.cls];var gr=el('div','drow');gr.appendChild(el('span',null,'Gold'));var gb=el('b');gb.innerHTML=goldIcon(16)+' '+(gv==null?0:gv);gr.appendChild(gb);B.appendChild(gr);
    B.appendChild(el('h3',null,'Items'));
    if(!h.inv.length)B.appendChild(el('p','note','Nothing carried yet.'));
    h.inv.forEach(function(it){B.appendChild(drow(ITEMS[it.id]?ITEMS[it.id].n:it.id,it.qty>1?'×'+it.qty:''));});
  }
}
function wireGtip(){
  var t=el('div','gtip');t.hidden=true;document.body.appendChild(t);
  var root=$('screen-play');
  root.addEventListener('mouseover',function(e){
    var n=e.target.closest&&e.target.closest('[data-tip]');if(!n||!root.contains(n)){t.hidden=true;return;}
    var title=n.classList.contains('choice')?'Skill check':(n.querySelector('span')?n.querySelector('span').textContent:'');
    t.innerHTML='';var b=el('b',null,title);t.appendChild(b);t.appendChild(document.createTextNode(n.dataset.tip));
    t.appendChild(el('span','h',n.classList.contains('choice')?'Click to select':'Click to open'));
    t.hidden=false;var r=n.getBoundingClientRect();
    var x=n.classList.contains('choice')?r.left+40:r.left-t.offsetWidth-10,y=n.classList.contains('choice')?r.top-t.offsetHeight-8:r.top;
    t.style.left=Math.max(8,x)+'px';t.style.top=Math.max(8,y)+'px';
  });
  root.addEventListener('mouseout',function(e){var n=e.relatedTarget;if(!n||!n.closest||!n.closest('[data-tip]'))t.hidden=true;});
  root.addEventListener('click',function(){t.hidden=true;});
}
function wirePlay(){
  Array.prototype.forEach.call($('rail').children,function(b){b.addEventListener('click',function(){openTab(b.dataset.t);});});
  $('drawerClose').addEventListener('click',function(){openTab(null);});
  $('hud').addEventListener('click',function(){openTab('char');});
  document.addEventListener('keydown',function(e){
    if(state.screen!=='world'||e.ctrlKey||e.metaKey||e.altKey)return;
    var k=e.key.toLowerCase();
    if(k==='c')openTab('char');else if(k==='m')openTab('map');else if(k==='i')openTab('inv');else if(k==='escape')openTab(null);
    else if(k>='1'&&k<='3'){var b=$('choices').children[+k-1];if(b)b.click();}
  });
}
