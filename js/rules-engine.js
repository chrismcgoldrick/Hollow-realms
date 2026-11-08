/* Rules engine: works out stats, rolls dice, draws the character sheet. */
'use strict';

/* ---- rules engine ---- */
function itemId(h,slot){var sel=h.gear[slot];if(sel==='none')return null;if(sel==='plain')return PLAIN[slot].id;var g=CLASSES[h.cls].gear[slot];return g?g.id:null;}
function sgn(n){return (n>=0?'+':'\u2212')+Math.abs(n);}
function skillCost(rank,career){return 5*rank+(career?0:5);}
function compute(h){
  var R=SP_RULES[h.species],cal=careerSkills(h.cls),out={chr:{},skills:{},der:{},xp:{}},spent=0;
  CHARS.forEach(function(c){
    var base=R.c[c[0]],buy=h.chr[c[0]]||0;
    if(buy)spent+=10*(base+1);
    out.chr[c[0]]={v:base+buy,base:base,buy:buy,next:10*(base+buy+1)};
  });
  var fixed=R.fixed||[],chc=R.choice||null,fs=R.fs||0;
  var fc=chc?(h.fc||[]).filter(function(n){return chc.from.indexOf(n)>=0;}).slice(0,chc.n):[];
  var fp=(h.fp||[]).filter(function(n){return cal.indexOf(n)<0&&fixed.indexOf(n)<0&&fc.indexOf(n)<0;}).slice(0,fs);
  var fk=[];(h.fk||[]).forEach(function(n){if(fk.length<CAREER_FREE&&cal.indexOf(n)>=0&&countOf(fk,n)<maxPicks(h.cls,n))fk.push(n);});
  out.fc=fc;out.fp=fp;out.fk=fk;out.reqs=[];
  fixed.forEach(function(n){out.reqs.push({have:1,need:1,done:true,text:'One rank in '+n+' (automatic)'});});
  if(chc)out.reqs.push({have:fc.length,need:chc.n,done:fc.length>=chc.n,text:'One rank in '+chc.from.join(' or ')});
  if(fs)out.reqs.push({have:fp.length,need:fs,done:fp.length>=fs,text:'One rank in '+NUMW[fs]+' non-career skill'+(fs>1?'s':'')});
  out.reqs.push({have:fk.length,need:CAREER_FREE,done:fk.length>=CAREER_FREE,text:'One rank in four career skills'});
  var fx={soak:0,def:0,boost:{},wpn:null,items:[]};
  SLOTS.forEach(function(sl){
    var id=itemId(h,sl[0]);if(!id)return;var f=ITEM_FX[id];if(!f)return;
    if(f.soak)fx.soak+=f.soak;if(f.def)fx.def+=f.def;if(f.boost)fx.boost[f.boost]=(fx.boost[f.boost]||0)+1;
    if(f.wpn&&sl[0]==='main')fx.wpn={id:id,w:f.wpn};
  });
  SKILLS.forEach(function(sk){
    var career=cal.indexOf(sk[0])>=0,ck=countOf(fk,sk[0]),pt=fc.indexOf(sk[0])>=0?'fc':(fp.indexOf(sk[0])>=0?'fp':''),sp=(fixed.indexOf(sk[0])>=0?1:0)+(pt?1:0),free=Math.min(MAX_START_RANK,ck+sp),buy=h.sk[sk[0]]||0;
    for(var r=free+1;r<=free+buy;r++)spent+=skillCost(r,career);
    var rank=free+buy,ch=out.chr[sk[1]].v;
    out.skills[sk[0]]={ch:sk[1],career:career,ck:ck,sp:sp,pt:pt,free:free,buy:buy,rank:rank,next:skillCost(rank+1,career),
      prof:Math.min(ch,rank),abil:Math.max(ch,rank)-Math.min(ch,rank),boost:fx.boost[sk[0]]||0};
  });
  var br=out.chr.BR.v,wil=out.chr.WIL.v;
  out.der={wound:R.w+br,strain:R.st+wil,soak:br+fx.soak,def:fx.def,weapon:null};
  if(fx.wpn){var w=fx.wpn.w;out.der.weapon={name:NAMES[fx.wpn.id],skill:w.skill,dmg:(w.base?out.chr[w.base].v:0)+w.add};}
  else out.der.weapon={name:'Fists',skill:'Melee',dmg:br};
  out.xp={start:R.xp,spent:spent,left:R.xp-spent};
  return out;
}
function rollDie(type){var f=DICE[type].f;return {type:type,sym:f[(Math.random()*f.length)|0]};}
function rollPool(pool){
  var dice=[],tally={s:0,f:0,a:0,t:0,T:0,D:0};
  Object.keys(pool).forEach(function(k){for(var i=0;i<pool[k];i++){var d=rollDie(k);dice.push(d);d.sym.forEach(function(x){tally[x]++;});}});
  var succ=tally.s+tally.T,fail=tally.f+tally.D;
  return {dice:dice,net:succ-fail,adv:tally.a-tally.t,tri:tally.T,des:tally.D};
}
function poolFor(sk,diff){
  return {proficiency:sk.prof,ability:sk.abil,boost:sk.boost,difficulty:diff.diff||0,challenge:diff.chal||0};
}
function describeRoll(r){
  var t=r.net>0?'Success':'Failure';
  var bits=[];if(r.adv>0)bits.push(r.adv+' advantage'+(r.adv>1?'s':''));if(r.adv<0)bits.push(-r.adv+' threat'+(r.adv<-1?'s':''));
  if(r.tri)bits.push('TRIUMPH');if(r.des)bits.push('DESPAIR');
  return t+(bits.length?' \u2014 '+bits.join(', '):'');
}
function diceHTML(pool){
  var h='';Object.keys(pool).forEach(function(k){for(var i=0;i<pool[k];i++)h+='<span class="dd" style="background:'+DICE[k].col+'" title="'+DICE[k].n+'"></span>';});
  return h||'<span class="none">no dice</span>';
}
var NUMW=['no','one','two','three','four'];
function reqRow(pk){
  var r=el('div','req'+(pk.done?' done':''));r.appendChild(el('span','mk',pk.done?'\u2713':''));
  r.appendChild(el('span','tx',pk.text));
  r.appendChild(el('b',null,pk.have+'/'+pk.need));return r;
}
function renderSheet(){
  var h=state.hero,C=compute(h),A=$('sheetChr'),D=$('sheetDer'),K=$('sheetSkills');A.textContent='';D.textContent='';K.textContent='';
  CHARS.forEach(function(c){
    var r=C.chr[c[0]],box=el('div','ch'+(r.buy?' up':''));
    box.title='Species '+r.base+(r.buy?' · Training +1':'');
    box.appendChild(el('div','orb',String(r.v)));box.appendChild(el('div','nm',c[1]));A.appendChild(box);
  });
  var d=C.der,vit=el('div','vit');
  [['Soak',d.soak],['Wounds',d.wound],['Strain',d.strain],['Defense',d.def]].forEach(function(p){
    var t=el('div','vt');t.appendChild(el('span','k',p[0]));t.appendChild(el('span','v',String(p[1])));vit.appendChild(t);
  });
  D.appendChild(vit);
  var wr=el('div','kv');wr.appendChild(el('span',null,d.weapon.name));wr.appendChild(el('em',null,d.weapon.skill));wr.appendChild(el('b',null,d.weapon.dmg+' dmg'));D.appendChild(wr);
  var xr=el('div','kv xp');xr.appendChild(el('span',null,'XP to spend'));xr.appendChild(el('b',null,String(C.xp.left)));D.appendChild(xr);
  var gv=h.goldRolls[h.cls];
  if(gv!=null){var gr=el('div','kv gold');gr.appendChild(el('span',null,'Gold'));var gb=el('b');gb.innerHTML=goldIcon(20)+' '+gv;gr.appendChild(gb);D.appendChild(gr);}
  C.reqs.forEach(function(q){D.appendChild(reqRow(q));});
  var hd=el('div','skhead');['Car','Skill','Chr','Pool','Rank'].forEach(function(t){hd.appendChild(el('span',null,t));});K.appendChild(hd);
  var lastG='';
  SKILLS.forEach(function(s){
    if(s[2]!==lastG){lastG=s[2];K.appendChild(el('div','skgrp',s[2]));}
    var sk=C.skills[s[0]],row=el('button','sk'+(sk.career?' pro':''));row.type='button';
    row.title='Roll '+s[0]+' against an Average check'+(sk.career?' (career skill)':'');
    row.appendChild(el('span','cb'));row.appendChild(el('span','nm',s[0]));row.appendChild(el('span','ab',s[1]));
    var pool=el('span','pool');pool.innerHTML=diceHTML({proficiency:sk.prof,ability:sk.abil,boost:sk.boost});row.appendChild(pool);
    var cells=el('span','cells');for(var i=1;i<=5;i++){cells.appendChild(el('u',i<=sk.free?'free':(i<=sk.rank?'buy':'')));}row.appendChild(cells);
    row.addEventListener('click',function(){testRoll(s[0]);});K.appendChild(row);
  });
}
function testRoll(name){
  var C=compute(state.hero),sk=C.skills[name],pool=poolFor(sk,{diff:2}),r=rollPool(pool);
  var box=$('rollBox'),h='<div class="rt">'+name+' <small>vs Average</small></div><div class="rd">';
  r.dice.forEach(function(d){h+='<span class="rdie" style="background:'+DICE[d.type].col+'" title="'+DICE[d.type].n+'">'+(d.sym.length?d.sym.map(function(x){return SYM[x];}).join(''):'\u00b7')+'</span>';});
  h+='</div><div class="rr '+(r.net>0?'win':'lose')+'">'+describeRoll(r)+'</div>';
  box.innerHTML=h;
}
function resetTraining(){state.hero.chr={};state.hero.sk={};state.hero.fp=[];state.hero.fc=[];state.hero.fk=[];}
