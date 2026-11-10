/* Character creation screen: species/career pickers, training, gear, gold. */
'use strict';

function renderTrain(){
  var h=state.hero,C=compute(h),T=$('train'),tab=state.trainTab||'chr';
  $('ptsLeft').innerHTML='XP to spend: <b>'+C.xp.left+'</b> <small>of '+C.xp.start+'</small>';
  C.reqs.forEach(function(q){$('ptsLeft').appendChild(reqRow(q));});
  var locked=C.reqs.some(function(q){return !q.done;});
  if(locked&&tab==='sk')$('ptsLeft').appendChild(el('p','note','Choose your starting skills first. Other skills unlock once every starting skill is set.'));
  Array.prototype.forEach.call($('trainTabs').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.k===tab));});
  T.textContent='';
  function row(label,star,val,cost,canDown,canUp,down,up,free){
    var r=el('div','train'),m=el('button','arrow','\u2212'),p=el('button','arrow','+');m.type='button';p.type='button';
    m.disabled=!canDown;p.disabled=!canUp;m.addEventListener('click',down);p.addEventListener('click',up);
    var l=el('span','lab',label);if(star)l.appendChild(el('small',null,'\u2605'));if(free)l.appendChild(el('small','fr','FREE'));
    r.appendChild(l);r.appendChild(m);r.appendChild(el('span','val',String(val)));r.appendChild(p);r.appendChild(el('span','cost'+(cost==='free'?' fr':''),cost==='free'?'free':(cost?cost+' xp':'max')));T.appendChild(r);
  }
  if(tab==='chr'){
    CHARS.forEach(function(c){
      var r=C.chr[c[0]];
      row(c[1],false,r.v,r.buy?'':(r.v>=5?'':r.next),r.buy>0,!r.buy&&r.v<5&&C.xp.left>=r.next,
        function(){h.chr[c[0]]=0;refresh();},function(){h.chr[c[0]]=1;refresh();});
    });
  }else{
    SKILLS.forEach(function(s){
      var k=C.skills[s[0]],R=SP_RULES[h.species],chc=R.choice,nm=s[0];
      var pickFc=!!chc&&C.fc.length<chc.n&&chc.from.indexOf(nm)>=0&&k.buy===0&&k.rank<MAX_START_RANK;
      var pickFp=!pickFc&&C.fp.length<(R.fs||0)&&!k.career&&k.rank===0&&k.buy===0;
      var pickFk=!pickFc&&!pickFp&&C.fk.length<CAREER_FREE&&k.career&&k.ck<maxPicks(h.cls,nm)&&k.buy===0&&k.rank<MAX_START_RANK;
      var canPick=pickFc||pickFp||pickFk,canUp=canPick||(!locked&&k.rank<MAX_START_RANK&&C.xp.left>=k.next);
      row(nm,k.career,k.rank,canPick?'free':(k.rank>=MAX_START_RANK?'':k.next),k.buy>0||!!k.pt||k.ck>0,canUp,
        function(){
          if(k.buy>0)h.sk[nm]=k.buy-1;
          else if(k.pt==='fc')h.fc=(h.fc||[]).filter(function(n){return n!==nm;});
          else if(k.pt==='fp')h.fp=(h.fp||[]).filter(function(n){return n!==nm;});
          else{var fl=(h.fk||[]).slice(),ix=fl.lastIndexOf(nm);if(ix>=0)fl.splice(ix,1);h.fk=fl;}
          refresh();},
        function(){
          if(pickFc)h.fc=(h.fc||[]).concat([nm]);else if(pickFp)h.fp=(h.fp||[]).concat([nm]);else if(pickFk)h.fk=(h.fk||[]).concat([nm]);else h.sk[nm]=(h.sk[nm]||0)+1;
          refresh();},k.sp>0||k.ck>0);
    });
  }
}

function buildSpeciesChips(){
  var h=state.hero,box=$('species');box.textContent='';
  if(!SPECIES[h.species]){h.species='human';h.skin=0;}
  Object.keys(SPECIES).forEach(function(key){
    var b=el('button','chip',SPECIES[key].name);b.type='button';b.dataset.k=key;
    b.addEventListener('click',function(){h.species=key;h.skin=0;resetTraining();refresh();});
    if(SPECIES[key].info){
      b.addEventListener('mouseenter',function(){showTip(key,b);});b.addEventListener('mouseleave',hideTip);
      b.addEventListener('focus',function(){showTip(key,b);});b.addEventListener('blur',hideTip);
    }
    box.appendChild(b);
  });
}
function placeTip(anchor){
  var t=$('tip');t.hidden=false;
  var ar=anchor.getBoundingClientRect(),pr=anchor.closest('.panel').getBoundingClientRect(),w=t.offsetWidth,h=t.offsetHeight,x,y;
  if(pr.left-w-14>=8){x=pr.left-w-14;y=ar.top-8;}else{x=Math.max(8,Math.min(innerWidth-w-8,ar.left));y=ar.bottom+8;}
  y=Math.max(8,Math.min(innerHeight-h-8,y));
  t.style.left=x+'px';t.style.top=y+'px';
}
function showTip(key,anchor){
  var S=SPECIES[key],R=SP_RULES[key],t=$('tip');t.textContent='';
  t.appendChild(el('div','th',S.name));
  var st=el('div','tst');
  [['Wound threshold',R.w+' + Brawn'],['Strain threshold',R.st+' + Willpower'],['Starting XP',String(R.xp)]].forEach(function(p){
    var r=el('div','tr');r.appendChild(el('span',null,p[0]));r.appendChild(el('b',null,p[1]));st.appendChild(r);
  });
  t.appendChild(st);
  S.info.perks.forEach(function(p){var d=el('div','tp');d.appendChild(el('div','tn',p[0]));d.appendChild(el('div','tt',p[1]));t.appendChild(d);});
  placeTip(anchor);
}
function optText(o){
  var names=o.i.map(function(p){return ITEMS[p[0]].n+(p[1]>1?' ×'+p[1]:'');});
  return o.l?o.l+' ('+names.join(', ')+')':names.join(' + ');
}
function showCareerTip(key,anchor){
  var C=CAREERS[key],t=$('tip');t.textContent='';
  t.appendChild(el('div','th',CLASSES[key].name));
  t.appendChild(el('div','tt it',C.desc||'Description coming soon.'));
  var d=el('div','tp');d.appendChild(el('div','tn','Career skills'));
  d.appendChild(el('div','tt',C.skills.map(function(n){var m=maxPicks(key,n);return m>1?n+' (up to '+m+' free ranks)':n;}).join(', ')));t.appendChild(d);
  d=el('div','tp');d.appendChild(el('div','tn','Starting gear'));
  if(!C.gear.length)d.appendChild(el('div','tt it','Not set yet.'));
  C.gear.forEach(function(en){
    var ln=el('div','tt gl');ln.textContent=en.map(optText).join('  — or —  ');d.appendChild(ln);
  });
  t.appendChild(d);
  d=el('div','tp');d.appendChild(el('div','tn','Starting gold'));
  d.appendChild(el('div','tt',C.coin?'Roll 1d'+C.coin.dice+(C.coin.mult>1?' × '+C.coin.mult:'')+' gold':'Not set yet.'));t.appendChild(d);
  placeTip(anchor);
}
function hideTip(){$('tip').hidden=true;}
/* ---- phase three: gear ---- */
var SHOP_CATS=[['Weapons',['sword','axe','halberd','bow','light_spear','dagger']],['Armor',['leather_armor','shield']],['Clothing',['winter_clothing','fine_cloak']],
  ['Supplies',['backpack','bedroll','rope','flint','torches','waterskin','climbing_gear','lantern','alchemists_kit']],['Consumables',['healing_elixir','herbs']]];
var gearBusy=false;
function resetGear(){var h=state.hero;h.gearMode=null;h.gearPick={};h.inv=[];}
function allPicked(){var h=state.hero;return CAREERS[h.cls].gear.every(function(en,i){return en.length===1||h.gearPick[i]!=null;});}
function renderGear3(){
  var h=state.hero,C=CAREERS[h.cls],has=C.gear.length>0,mode=h.gearMode,L=$('sgList');L.textContent='';
  if(!has)L.appendChild(el('p','note','Not available at the moment.'));
  C.gear.forEach(function(en,i){
    if(en.length===1){L.appendChild(el('div','sgfixed',optText(en[0])));return;}
    var box=el('div','sgor');box.appendChild(el('div','lbl','Choose one'));
    en.forEach(function(o,j){
      var b=el('button','chip sgo',optText(o));b.type='button';b.setAttribute('aria-pressed',String(h.gearPick[i]===j));b.disabled=!!mode;
      b.addEventListener('click',function(){h.gearPick[i]=j;renderGear3();});box.appendChild(b);
    });
    L.appendChild(box);
  });
  var acc=$('acceptGear'),shp=$('shopGear');
  acc.disabled=!has||!!mode||!allPicked();
  acc.textContent=mode==='starting'?'Starting gear accepted ✓':'Accept starting gear';
  shp.disabled=mode==='starting';shp.setAttribute('aria-pressed',String(mode==='shop'));
  $('gearUndo').hidden=mode!=='starting';
  $('gearHint').textContent=!has?'Accepting starting gear is not available for this career at the moment. You can still shop.':
    (mode==='starting'?'Starting gear accepted. Shopping is closed.':(mode==='shop'?'':(allPicked()?'Accept the package, or shop instead.':'Choose one option in each "or" group to accept.')));
  renderShop();
}
function renderShop(){
  var h=state.hero,g=h.goldRolls[h.cls],tabs=$('shopTabs'),list=$('shopList');
  $('shopGold').innerHTML=g==null?'<span class="none">Roll your starting gold above to shop.</span>':goldIcon(22)+'<b>'+g+'</b><span>gold</span>';
  tabs.textContent='';list.textContent='';
  SHOP_CATS.forEach(function(c,i){
    var b=el('button','chip',c[0]);b.type='button';b.setAttribute('aria-pressed',String((h.shopCat||0)===i));
    b.addEventListener('click',function(){h.shopCat=i;renderShop();});tabs.appendChild(b);
  });
  SHOP_CATS[h.shopCat||0][1].forEach(function(id){
    var r=el('div','shoprow');r.appendChild(el('span','nm',ITEMS[id].n));
    var p=el('span','pr');p.innerHTML=goldIcon(14)+' —';r.appendChild(p);
    var b=el('button','btn','Buy');b.type='button';b.disabled=true;b.title='Prices are placeholders for now';r.appendChild(b);list.appendChild(r);
  });
}
function collapseEl(e,cb){
  e.classList.add('anim');e.style.maxHeight=e.scrollHeight+'px';void e.offsetHeight;e.style.maxHeight='0px';e.style.opacity='0';
  setTimeout(function(){e.hidden=true;cb&&cb();},520);
}
function expandEl(e,cb){
  e.hidden=false;e.classList.add('anim');e.style.maxHeight='0px';e.style.opacity='0';void e.offsetHeight;
  e.style.maxHeight=e.scrollHeight+'px';e.style.opacity='1';
  setTimeout(function(){e.style.maxHeight='none';e.classList.remove('anim');cb&&cb();},520);
}
function applyGearMode(animate){
  var shop=state.hero.gearMode==='shop',sg=$('sgWrap'),sh=$('shopWrap');
  if(!animate){
    [sg,sh].forEach(function(e){e.classList.remove('anim');e.style.maxHeight='none';e.style.opacity='1';});
    sg.classList.remove('grey');sg.hidden=shop;sh.hidden=!shop;return;
  }
  if(gearBusy)return;gearBusy=true;
  if(shop){
    sg.classList.add('grey');
    setTimeout(function(){collapseEl(sg,function(){expandEl(sh,function(){gearBusy=false;});});},400);
  }else{
    collapseEl(sh,function(){sg.classList.remove('grey');expandEl(sg,function(){gearBusy=false;});});
  }
}
function wireGear(){
  var h=state.hero;
  $('acceptGear').addEventListener('click',function(){
    if(h.gearMode||!allPicked())return;
    h.gearMode='starting';h.inv=[];
    CAREERS[h.cls].gear.forEach(function(en,i){var o=en.length===1?en[0]:en[h.gearPick[i]];o.i.forEach(function(p){h.inv.push({id:p[0],qty:p[1]});});});
    renderGear3();
  });
  $('gearUndo').addEventListener('click',function(){h.gearMode=null;h.inv=[];renderGear3();});
  $('shopGear').addEventListener('click',function(){if(h.gearMode||gearBusy)return;h.gearMode='shop';renderGear3();applyGearMode(true);});
  $('shopBack').addEventListener('click',function(){if(gearBusy)return;h.gearMode=null;renderGear3();applyGearMode(true);});
}
/* ---- gold ---- */
function goldIcon(px){
  return '<svg class="gi" width="'+px+'" height="'+px+'" viewBox="0 0 24 24" aria-hidden="true"><polygon points="22.5,12 17.25,21.09 6.75,21.09 1.5,12 6.75,2.91 17.25,2.91" fill="#e2b441" stroke="#f7dc86" stroke-width="1" stroke-linejoin="round"/><polyline points="7.9,4.91 16.1,4.91 20.19,12" fill="none" stroke="#6b3410" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
var rolling=false;
function renderGold(){
  if(rolling)return;
  var h=state.hero,co=CAREERS[h.cls].coin,box=$('goldBox');box.className='';box.textContent='';
  if(!co){box.appendChild(el('p','note','No starting gold is set for this career yet.'));box.firstChild.style.marginTop='0';return;}
  var g=h.goldRolls[h.cls];
  if(g==null){
    var b=el('button','golddie');b.type='button';b.setAttribute('aria-label','Roll 1d'+co.dice+' for starting gold');
    b.innerHTML='<svg viewBox="0 0 100 100" width="84" height="84" aria-hidden="true"><polygon points="50,3 93,38 50,97 7,38" fill="#e2b441" stroke="#f7dc86" stroke-width="2.5" stroke-linejoin="round"/><polyline points="50,3 50,97 M7,38 93,38 M50,3 30,38 50,97 70,38 50,3" fill="none" stroke="#6b3410" stroke-width="2" stroke-linejoin="round" opacity=".55"/></svg><span class="num">d'+co.dice+'</span>';
    b.addEventListener('click',rollGold);box.appendChild(b);
    box.appendChild(el('p','note','Click the die to roll your starting gold.'));
  }else{
    var a=el('div','goldamt');a.innerHTML=goldIcon(30)+'<b>'+g+'</b><span>gold</span>';box.appendChild(a);
  }
}
function rollGold(){
  var h=state.hero,co=CAREERS[h.cls].coin,box=$('goldBox');
  if(!co||rolling||h.goldRolls[h.cls]!=null)return;
  rolling=true;box.classList.add('rolling');
  var num=box.querySelector('.num'),n=0,final=1+((Math.random()*co.dice)|0);
  var iv=setInterval(function(){
    n++;num.textContent=String(1+((Math.random()*co.dice)|0));
    if(n>=14){
      clearInterval(iv);num.textContent=String(final);
      setTimeout(function(){
        box.classList.add('done');
        setTimeout(function(){h.goldRolls[h.cls]=final*co.mult;rolling=false;refresh();},400);
      },600);
    }
  },66);   /* about 15 frames per second */
}
/* Wipe the current hero's choices and open character creation. */
function startNewHero(){
  var h=state.hero;h.name='';h.chr={};h.sk={};h.fp=[];h.fc=[];h.fk=[];h.goldRolls={};resetGear();
  $('name').value='';
  state.heroReady=false;
  go('create');
}
function buildCreate(){
  var h=state.hero;
  buildSpeciesChips();
  [['m','Male'],['f','Female']].forEach(function(o){
    var b=el('button','chip',o[1]);b.type='button';b.dataset.k=o[0];
    b.addEventListener('click',function(){h.sex=o[0];refresh();});$('sex').appendChild(b);
  });
  Object.keys(CLASSES).forEach(function(key){
    var b=el('button','chip',CLASSES[key].name);b.type='button';b.dataset.k=key;
    b.addEventListener('click',function(){h.cls=key;resetTraining();resetGear();refresh();});
    b.addEventListener('mouseenter',function(){showCareerTip(key,b);});b.addEventListener('mouseleave',hideTip);
    b.addEventListener('focus',function(){showCareerTip(key,b);});b.addEventListener('blur',hideTip);
    $('classes').appendChild(b);
  });
  $('name').addEventListener('input',function(e){h.name=e.target.value;titleText();});
  $('randomBtn').addEventListener('click',function(){
    var sk=Object.keys(SPECIES),ck=Object.keys(CLASSES);
    h.species=sk[(Math.random()*sk.length)|0];h.sex=Math.random()<0.5?'m':'f';h.skin=0;h.cls=ck[(Math.random()*ck.length)|0];
    resetTraining();resetGear();refresh();
  });
  $('nextBtn').addEventListener('click',function(){
    if(!h.name.trim()){toast('Give your hero a name first.');$('name').focus();return;}
    go('train');
  });
  $('backBtn').addEventListener('click',function(){go('create');});
  $('next2Btn').addEventListener('click',function(){go('gear');});
  $('back3Btn').addEventListener('click',function(){go('train');});
  wireGear();
  var tabs=[['chr','Characteristics'],['sk','Skills']];
  tabs.forEach(function(t){var b=el('button','chip',t[1]);b.type='button';b.dataset.k=t[0];b.addEventListener('click',function(){state.trainTab=t[0];refresh();});$('trainTabs').appendChild(b);});
  $('beginBtn').addEventListener('click',function(){if(!state.hero.gearMode){toast('Accept your starting gear or choose to shop first.');return;}state.heroReady=true;go('world');});
}


function titleText(){
  var h=state.hero;
  $('heroTitle').textContent=(h.name.trim()?h.name.trim()+' \u00b7 ':'')+SPECIES[h.species].name+' '+CLASSES[h.cls].name;
}
function refresh(){
  var h=state.hero,S=SPECIES[h.species];
  Array.prototype.forEach.call($('species').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.k===h.species));});
  Array.prototype.forEach.call($('sex').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.k===h.sex));});
  Array.prototype.forEach.call($('classes').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.k===h.cls));});
  $('speciesNote').textContent=S.blurb;$('classNote').textContent=CAREERS[h.cls].desc||'Career description coming soon.';
  titleText();$('heroBlurb').textContent=(S.blurb+' '+(CAREERS[h.cls].desc||'')).trim();
  renderSheet();renderTrain();renderGold();renderGear3();
  renderStage();
}
