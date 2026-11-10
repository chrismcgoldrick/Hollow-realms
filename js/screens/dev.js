/* Developer tools: species editor and the dev jump menu. */
'use strict';

/* ---- developer tools: species editor ---- */
var dev={sel:null,draft:null,isNew:false};
function devRender(){
  if(!dev.draft&&!dev.isNew)devSelect(Object.keys(SPECIES)[0],true);
  var list=$('devList');list.textContent='';
  allSpeciesList().forEach(function(r){
    var b=el('button','chip',r.name);b.type='button';b.setAttribute('aria-pressed',String(!dev.isNew&&dev.sel===r.key));
    if(r.custom)b.appendChild(el('small',null,'CUSTOM'));
    b.addEventListener('click',function(){devSelect(r.key);});list.appendChild(b);
  });
  devForm();
}
function devSelect(key,quiet){
  var r=allSpeciesList().filter(function(x){return x.key===key;})[0];if(!r)return;
  dev.sel=key;dev.isNew=false;dev.draft=JSON.parse(JSON.stringify(r));if(!quiet)devRender();
}
function devNew(){
  dev.isNew=true;dev.sel=null;
  var c={};CHARS.forEach(function(ch){c[ch[0]]=2;});
  dev.draft={key:'',name:'',blurb:'',look:'human',c:c,w:10,st:10,xp:100,custom:true};devRender();
}
function stepRow(label,get,set,lo,hi,step){
  var r=el('div','dstep');r.appendChild(el('span','lab',label));
  var m=el('button','arrow','−'),p=el('button','arrow','+');m.type=p.type='button';
  var v=el('span','val',String(get()));
  function upd(){v.textContent=String(get());m.disabled=get()<=lo;p.disabled=get()>=hi;devSum();}
  m.addEventListener('click',function(){set(Math.max(lo,get()-step));upd();});
  p.addEventListener('click',function(){set(Math.min(hi,get()+step));upd();});
  r.appendChild(m);r.appendChild(v);r.appendChild(p);m.disabled=get()<=lo;p.disabled=get()>=hi;return r;
}
function devSum(){
  var d=dev.draft,n=0;CHARS.forEach(function(c){n+=d.c[c[0]];});
  var e=$('devSum');if(e)e.innerHTML='Characteristic total <b>'+n+'</b> &middot; Wounds <b>'+d.w+'</b> + Brawn &middot; Strain <b>'+d.st+'</b> + Willpower';
}
function devForm(){
  var box=$('devEditor'),d=dev.draft;box.textContent='';if(!d)return;
  var sec=el('section','sec');sec.appendChild(el('h2',null,dev.isNew?'New species':'Edit '+d.name));
  var l1=el('label','fl','Name'),n=el('input');n.type='text';n.maxLength=24;n.value=d.name;n.placeholder='e.g. Halfling';
  n.addEventListener('input',function(){d.name=n.value;});l1.appendChild(n);sec.appendChild(l1);
  var l2=el('label','fl','Description'),t=el('textarea');t.rows=3;t.maxLength=240;t.value=d.blurb;t.placeholder='One or two sentences shown on the creation screen.';
  t.addEventListener('input',function(){d.blurb=t.value;});l2.appendChild(t);sec.appendChild(l2);
  var l3=el('label','fl','Looks like (art for now)'),sl=el('select');
  BASE_ART.forEach(function(k){var o=el('option',null,DEF_SPECIES[k].name);o.value=k;sl.appendChild(o);});
  sl.value=d.look;sl.disabled=!d.custom;sl.addEventListener('change',function(){d.look=sl.value;});l3.appendChild(sl);sec.appendChild(l3);
  box.appendChild(sec);
  var s2=el('section','sec');s2.appendChild(el('h2',null,'Characteristics'));
  CHARS.forEach(function(c){s2.appendChild(stepRow(c[1],function(){return d.c[c[0]];},function(v){d.c[c[0]]=v;},1,5,1));});
  box.appendChild(s2);
  var s3=el('section','sec');s3.appendChild(el('h2',null,'Vitals'));
  s3.appendChild(stepRow('Wound base',function(){return d.w;},function(v){d.w=v;},4,20,1));
  s3.appendChild(stepRow('Strain base',function(){return d.st;},function(v){d.st=v;},4,20,1));
  s3.appendChild(stepRow('Starting XP',function(){return d.xp;},function(v){d.xp=v;},50,200,5));
  var sm=el('p','sum');sm.id='devSum';s3.appendChild(sm);box.appendChild(s3);
  var f=el('div','foot');
  var sv=el('button','btn go','Save species');sv.type='button';sv.addEventListener('click',devSave);f.appendChild(sv);
  var rm=el('button','btn',d.custom?'Delete':'Reset to default');rm.type='button';rm.disabled=dev.isNew;rm.addEventListener('click',devRemove);f.appendChild(rm);
  box.appendChild(f);devSum();
}
function devSave(){
  var d=dev.draft;
  if(!d.name.trim()){toast('Give the species a name first.');return;}
  var key=d.key;
  if(dev.isNew){key=slug(d.name);var base=key,i=2;while(SPECIES[key])key=base+'-'+(i++);}
  var rec={name:d.name.trim(),blurb:d.blurb.trim(),look:d.look,c:d.c,w:d.w,st:d.st,xp:d.xp,custom:BASE_ART.indexOf(key)<0};
  spData[key]=rec;applySp();var ok=saveSp();
  dev.isNew=false;dev.sel=key;devSelect(key);
  toast(ok?'Saved. The creation screen now uses it.':'Applied for this session, but this browser would not store it. Use Export.');
}
function devRemove(){
  var d=dev.draft;if(!dev.sel)return;
  var custom=BASE_ART.indexOf(dev.sel)<0;

  delete spData[dev.sel];applySp();saveSp();
  if(custom){dev.sel=null;dev.draft=null;toast('Species deleted.');}else{toast('Restored the default.');}
  if(custom)devRender();else devSelect(dev.sel);
}
function devWire(){
  $('devAdd').addEventListener('click',devNew);
  $('devExit').addEventListener('click',function(){go('home');});
  $('devExport').addEventListener('click',function(){$('devJson').value=JSON.stringify({species:allSpeciesList()},null,1);toast('Exported. Copy the text and send it to Claude to make it permanent.');});
  $('devImport').addEventListener('click',function(){
    try{
      var j=JSON.parse($('devJson').value),arr=j.species||j,next={};
      if(!Array.isArray(arr))throw 0;
      arr.forEach(function(r){
        if(!r||!r.name)return;var key=BASE_ART.indexOf(r.key)>=0?r.key:slug(r.key||r.name);
        next[key]={name:r.name,blurb:r.blurb||'',look:r.look,c:r.c,w:r.w,st:r.st,xp:r.xp,custom:BASE_ART.indexOf(key)<0};
      });
      spData=next;applySp();saveSp();dev.sel=null;dev.draft=null;dev.isNew=false;devRender();toast('Imported '+Object.keys(next).length+' species.');
    }catch(e){toast('That text could not be read as exported data.');}
  });
  $('devResetAll').addEventListener('click',function(){spData={};applySp();saveSp();dev.sel=null;dev.draft=null;dev.isNew=false;devRender();toast('Everything is back to the defaults.');});
}

function testHero(){
  var h=state.hero;
  state.heroReady=true;
  h.name='Test Hero';h.species='human';h.cls='fighter';
  h.chr={BR:1};h.sk={'Melee (Heavy)':1,'Resilience':1,'Athletics':1};
  h.fp=['Athletics','Perception'];h.fc=[];h.fk=['Melee (Heavy)','Resilience','Vigilance','Brawl'];
  h.goldRolls=h.goldRolls||{};h.goldRolls.fighter=52;
  h.gearMode='starting';h.gearPick={0:0};h.inv=[];
  CAREERS.fighter.gear.forEach(function(en,i){var o=en.length===1?en[0]:en[h.gearPick[i]];o.i.forEach(function(p){h.inv.push({id:p[0],qty:p[1]});});});
}
function devJump(j){
  $('devMenu').hidden=true;
  if(j==='create-new')startNewHero();
  else if(j==='create-keep')go('create');
  else if(j==='test'){testHero();SAMPLE=MISSIONS.test;go('world');}
  else if(j==='test-keep'){SAMPLE=MISSIONS.test;go('world');}
  else if(j==='home')go('home');
}
function wireDev(){
  var m=$('devMenu');
  Array.prototype.forEach.call(document.querySelectorAll('.devOpen'),function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      if(!m.hidden){m.hidden=true;return;}
      m.hidden=false;var r=b.getBoundingClientRect(),w=300;
      var left=Math.min(Math.max(8,r.left),window.innerWidth-w-8),top=r.bottom+6;
      if(top+m.offsetHeight>window.innerHeight-8)top=Math.max(8,r.top-m.offsetHeight-6);
      m.style.left=left+'px';m.style.top=top+'px';
    });
  });
  Array.prototype.forEach.call(m.querySelectorAll('button'),function(b){b.addEventListener('click',function(){devJump(b.dataset.j);});});
  document.addEventListener('click',function(e){if(!m.contains(e.target))m.hidden=true;});
}
