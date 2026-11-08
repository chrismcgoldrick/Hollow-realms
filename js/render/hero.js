/* Paper doll: draws the hero with code (body, head, gear, held items). */
'use strict';

/* hand and elbow positions per pose (screen right = main hand) */
var POSES={
  fighter:{stance:12,R:{e:[28,-60],h:[31,-49]},L:{e:[-28,-60],h:[-30,-50]}},
  ranger:{stance:10,R:{e:[30,-62],h:[32,-55]},L:{e:[-22,-64],h:[-14,-58]}},
  wizard:{stance:8,R:{e:[28,-60],h:[30,-52]},L:{e:[-31,-68],h:[-27,-80]}},
  cleric:{stance:9,R:{e:[28,-60],h:[30,-52]},L:{e:[-24,-66],h:[-17,-70]}},
  politician:{stance:8,R:{e:[29,-67],h:[30,-78]},L:{e:[-28,-60],h:[-31,-50]},
    anim:function(R,t){var w=Math.sin(t*4.2)*2;R.arm.R.h[0]+=w;R.arm.R.e[0]+=w*0.3;}},
  bard:{stance:9,R:{e:[27,-63],h:[30,-71]},L:{e:[-18,-58],h:[-7,-46]},
    anim:function(R,t){R.arm.L.h[1]+=Math.sin(t*5)*1.6;R.arm.L.e[1]+=Math.sin(t*5)*0.6;}}
};

/* ========================= 3. PAPER DOLL ========================= */
var c=null,OL='rgba(10,7,9,0.75)';

function hex2rgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function rgb2hex(r,g,b){return '#'+[r,g,b].map(function(v){return Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0');}).join('');}
function shade(h,a){var q=hex2rgb(h);return a>=0?rgb2hex(q[0]+(255-q[0])*a,q[1]+(255-q[1])*a,q[2]+(255-q[2])*a):rgb2hex(q[0]*(1+a),q[1]*(1+a),q[2]*(1+a));}
function sg(x0,x1,col){var g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,shade(col,0.2));g.addColorStop(0.55,col);g.addColorStop(1,shade(col,-0.32));return g;}
function fillPath(fill,lw){c.fillStyle=fill;c.fill();c.lineWidth=lw||0.9;c.strokeStyle=OL;c.lineJoin='round';c.stroke();}
function poly(p){c.beginPath();c.moveTo(p[0][0],p[0][1]);for(var i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);c.closePath();}
function blob(p){
  var n=p.length,i;c.beginPath();c.moveTo((p[n-1][0]+p[0][0])/2,(p[n-1][1]+p[0][1])/2);
  for(i=0;i<n;i++){var a=p[i],b=p[(i+1)%n];c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}
  c.closePath();
}
function sym(r){var l=r.slice().reverse().filter(function(p){return p[0]!==0;}).map(function(p){return [-p[0],p[1]];});return r.concat(l);}
function mirrorDo(fn){fn();c.save();c.scale(-1,1);fn();c.restore();}
function circ(x,y,r,fill,lw){c.beginPath();c.arc(x,y,r,0,TAU);if(fill)fillPath(fill,lw);}
function ellp(x,y,rx,ry,fill,lw){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);if(fill)fillPath(fill,lw);}
function limb(a,b,w,col,hi){
  c.lineCap='round';c.strokeStyle=OL;c.lineWidth=w+1.6;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
  c.strokeStyle=col;c.lineWidth=w;c.stroke();
  if(hi!==false){c.strokeStyle='rgba(255,255,255,0.16)';c.lineWidth=w*0.28;c.beginPath();c.moveTo(a[0]-w*0.2,a[1]);c.lineTo(b[0]-w*0.2,b[1]);c.stroke();}
}
function chain(pts,ws,col){
  var i;c.fillStyle=OL;for(i=0;i<pts.length;i++){c.beginPath();c.arc(pts[i][0],pts[i][1],ws[i]/2+0.8,0,TAU);c.fill();}
  c.fillStyle=col;for(i=0;i<pts.length;i++){c.beginPath();c.arc(pts[i][0],pts[i][1],ws[i]/2,0,TAU);c.fill();}
}
function star(x,y,r,col){c.fillStyle=col;poly([[x,y-r],[x+r*0.28,y-r*0.28],[x+r,y],[x+r*0.28,y+r*0.28],[x,y+r],[x-r*0.28,y+r*0.28],[x-r,y],[x-r*0.28,y-r*0.28]]);c.fill();}

function gear(spec,slot){
  var sel=spec.gear[slot];
  if(sel==='none')return null;
  if(sel==='plain')return PLAIN[slot];
  return CLASSES[spec.cls].gear[slot]||null;
}
function sleeveCol(spec){
  var b=gear(spec,'body');if(!b)return '#d6cbb1';
  if(b.id==='leather')return '#cfc3a3';if(b.id==='tabard')return '#8a9096';return b.col;
}

function buildRig(h){
  var S=SPECIES[h.species],f=h.sex==='f',bw=S.bw,R={f:f,bw:bw,sp:S.look||h.species};
  R.sw=(f?17.5:20)*bw;R.cw=(f?14.8:17.2)*bw;R.ww=(f?10.8:13.8)*bw;R.hw=(f?16.4:15.2)*bw;
  R.nw=3.4*Math.sqrt(bw);
  var P=POSES[CLASSES[h.cls].pose],kx=0.82+0.18*bw;
  function cp(a){return [a[0]*kx,a[1]];}
  R.stance=P.stance;
  R.arm={R:{s:[R.sw-2.2,-74],e:cp(P.R.e),h:cp(P.R.h)},L:{s:[-(R.sw-2.2),-74],e:cp(P.L.e),h:cp(P.L.h)}};
  R.armW=6.6*Math.pow(bw,0.8);R.handR=3.1*Math.sqrt(bw);R.legW=8.6*bw;R.rx=8.6;
  R.pose=P;
  return R;
}

/* ---- back layer ---- */
function drawTail(R,spec,t){
  var sw=Math.sin(t*1.6)*1.6,P=[[5,-47],[30+sw,-46],[36+sw,-16],[22,-3]],pts=[],ws=[],n=14,i,u,v;
  for(i=0;i<=n;i++){u=i/n;v=1-u;
    pts.push([v*v*v*P[0][0]+3*v*v*u*P[1][0]+3*v*u*u*P[2][0]+u*u*u*P[3][0],v*v*v*P[0][1]+3*v*v*u*P[1][1]+3*v*u*u*P[2][1]+u*u*u*P[3][1]]);
    ws.push((11-9*u)*Math.sqrt(R.bw));}
  chain(pts,ws,shade(spec.skin,-0.12));
}
function drawCloak(R,g,t){
  var cape=g.id==='cape',hemY=cape?-28:-8,fl=cape?7:12,pts=[[R.sw+1,-75]],n=6,i;
  for(i=0;i<=n;i++)pts.push([(R.hw+fl)*(1-2*i/n),hemY+Math.sin(i*1.7+t*1.3)*1.1+(i%2?1.8:0)]);
  pts.push([-(R.sw+1),-75]);
  poly(pts);fillPath(sg(-R.hw-fl,R.hw+fl,shade(g.col,-0.12)),0.9);
}
function drawQuiver(R){
  var x=-R.sw*0.5,i;
  c.lineCap='round';
  for(i=0;i<4;i++){
    c.strokeStyle='#d9d0b8';c.lineWidth=0.8;c.beginPath();c.moveTo(x-3+i*2.4,-90+(i%2));c.lineTo(x-1+i*2.3,-70);c.stroke();
    c.fillStyle=i%2?'#b33a35':'#e6e0cf';poly([[x-3+i*2.4,-90+(i%2)],[x-4.4+i*2.4,-93],[x-1.6+i*2.4,-93]]);c.fill();
  }
  poly([[x-6.5,-84],[x-2,-85.5],[x+5.5,-54],[x+0.6,-52]]);fillPath(sg(x-6,x+5,'#6a4426'),0.9);
}
function drawHairBack(R,spec){
  if(!R.f||R.sp==='dragonborn')return;
  var rx=R.rx,len=R.sp==='elf'?-56:R.sp==='dwarf'?-74:-64;
  blob([[0,-101.5],[rx+2.4,-97.5],[rx+3.8,-89],[rx+4.6,-77],[rx+4,len+4],[rx+2,len],[0,len+1.5],[-(rx+2),len],[-(rx+4),len+4],[-(rx+4.6),-77],[-(rx+3.8),-89],[-(rx+2.4),-97.5]]);
  fillPath(sg(-rx-4,rx+4,spec.hair),0.9);
}

/* ---- legs and feet ---- */
function drawLegs(R,spec){
  var lg=gear(spec,'legs'),ft=gear(spec,'feet'),col=lg?lg.col:'#6b5a45',i,s,hx,fx;
  for(i=0;i<2;i++){
    s=i?1:-1;hx=s*R.hw*0.48;fx=s*(R.hw*0.48+R.stance*0.3);
    limb([hx,-45],[fx,-10],R.legW,col);
    drawFoot(R,spec,ft,fx,s);
  }
}
function drawFoot(R,spec,ft,fx,s){
  var tw=5.8*Math.sqrt(R.bw);
  if(!ft){limb([fx,-11],[fx,-4],R.legW*0.62,spec.skin,false);ellp(fx+s*1.4,-1.9,tw*0.9,2.4,spec.skin,0.8);return;}
  if(ft.id==='tall')limb([fx,-27],[fx,-4],R.legW*1.02,ft.col);
  else if(ft.id==='shoes')limb([fx,-9],[fx,-4],R.legW*0.9,ft.col);
  else limb([fx,-15],[fx,-4],R.legW,ft.col);
  ellp(fx+s*1.4,-2.4,tw,2.9,shade(ft.col,-0.08),0.8);
  c.fillStyle='#16100c';c.beginPath();c.ellipse(fx+s*1.4,-0.7,tw,1.1,0,0,TAU);c.fill();
}

/* ---- torso and body gear ---- */
function torsoPath(R,e,hemY,fl){
  var r=[[R.nw,-79],[R.sw+e,-75.5],[R.cw+e,-64],[R.ww+e,-50],[R.hw+e,-43]];
  if(hemY!=null)r.push([R.hw+e+(fl||0),hemY]);
  poly(sym(r));
}
function belt(R,col){
  poly([[-R.ww-0.6,-52],[R.ww+0.6,-52],[R.hw+0.6,-46.5],[-R.hw-0.6,-46.5]]);fillPath(col,0.8);
  c.fillStyle='#d5b255';c.fillRect(-1.8,-51,3.6,3.4);
}
var BODY={
  tunic:function(R,s,col){torsoPath(R,0.7,-36,1.6);fillPath(sg(-R.cw,R.cw,col));belt(R,shade(col,-0.5));},
  mail:function(R,s,col){
    torsoPath(R,1,-33,2);fillPath(sg(-R.cw,R.cw,col));
    c.save();c.clip();c.strokeStyle='rgba(0,0,0,0.16)';c.lineWidth=0.5;
    for(var y=-74;y<-34;y+=2.6){c.beginPath();for(var x=-R.sw;x<R.sw;x+=2.6){c.moveTo(x,y);c.quadraticCurveTo(x+1.3,y+1.6,x+2.6,y);}c.stroke();}
    c.restore();belt(R,'#3a2f27');
  },
  leather:function(R,s,col){
    torsoPath(R,0.4,-40,0.6);fillPath(sg(-R.cw,R.cw,col));
    c.strokeStyle='#2c2016';c.lineWidth=0.7;c.beginPath();
    for(var y=-74;y<-54;y+=4){c.moveTo(-2.4,y);c.lineTo(2.4,y+4);c.moveTo(2.4,y);c.lineTo(-2.4,y+4);}c.stroke();
    belt(R,'#3a2a1c');
  },
  robe:function(R,s,col){
    torsoPath(R,0.8,-5,10);fillPath(sg(-R.hw-10,R.hw+10,col));
    c.save();c.clip();
    star(-8,-30,2.2,'#f2d97a');star(7,-22,1.8,'#f2d97a');star(-3,-14,2,'#f2d97a');star(11,-36,1.6,'#f2d97a');star(-13,-19,1.7,'#f2d97a');star(2,-62,1.4,'#f2d97a');
    c.fillStyle='#d5b255';c.fillRect(-R.hw-12,-9,2*R.hw+24,3);
    c.restore();
    poly([[-R.ww-0.6,-53],[R.ww+0.6,-53],[R.hw+0.6,-47],[-R.hw-0.6,-47]]);fillPath('#d5b255',0.8);
  },
  tabard:function(R,s,col){
    torsoPath(R,1,-33,2);fillPath(sg(-R.cw,R.cw,'#8a9096'));
    var pw=8.6*Math.sqrt(R.bw);
    poly(sym([[pw,-77],[pw*1.1,-24]]));fillPath(sg(-pw,pw,col),0.9);
    c.fillStyle='#d5b255';c.fillRect(-pw*1.1,-26,pw*2.2,2.2);
    circ(0,-62,4.2,'#d5b255',0.7);
    c.strokeStyle='#d5b255';c.lineWidth=1;c.beginPath();
    for(var i=0;i<8;i++){var a=i*TAU/8;c.moveTo(Math.cos(a)*5,-62+Math.sin(a)*5);c.lineTo(Math.cos(a)*7.4,-62+Math.sin(a)*7.4);}c.stroke();
    belt(R,'#b8923a');
  },
  suit:function(R,s,col){
    torsoPath(R,1,-37,1.5);fillPath(sg(-R.cw,R.cw,col));
    poly([[-4.2,-78.5],[4.2,-78.5],[0,-54]]);fillPath('#f2eee6',0.7);
    mirrorDo(function(){poly([[4.4,-78.5],[10.2,-71],[3.2,-56],[0.6,-60],[1.8,-72]]);fillPath(shade(col,0.14),0.7);});
    poly([[-1.5,-76],[1.5,-76],[2.2,-60],[0,-55],[-2.2,-60]]);fillPath('#a5242c',0.6);
    circ(0,-50,0.9,'#d5b255',0.4);circ(0,-45,0.9,'#d5b255',0.4);
    poly([[-11.5,-62],[-7.5,-62.4],[-7.3,-60],[-11.3,-59.6]]);fillPath('#f2eee6',0.5);
    circ(10,-66,3.1,'#d5b255',0.6);circ(10,-66,1.6,'#b8312f',0.4);
    poly([[8.6,-63],[7.2,-57],[9.4,-58.4]]);fillPath('#b8312f',0.4);poly([[11.4,-63],[12.8,-57],[10.6,-58.4]]);fillPath('#2d4f9a',0.4);
  },
  doublet:function(R,s,col){
    torsoPath(R,0.6,-40,1.2);fillPath(sg(-R.cw,R.cw,col));
    c.save();c.clip();c.fillStyle='#e0b94c';poly([[-30,-74],[-24,-74],[30,-38],[24,-38]]);c.fill();
    c.fillStyle='#e0b94c';poly([[-30,-62],[-24,-62],[30,-26],[24,-26]]);c.fill();c.restore();
    for(var i=0;i<4;i++)circ(0,-70+i*6,0.9,'#f2d97a',0.4);
    ellp(0,-77.6,R.nw*2.3,2.3,'#f0ece0',0.7);
    belt(R,'#3b2417');
  }
};
function drawTorso(R,spec){
  var b=gear(spec,'body'),cl=gear(spec,'cloak');
  torsoPath(R,0,-38,0.8);fillPath(sg(-R.cw,R.cw,'#d6cbb1'));
  if(b)BODY[b.id](R,spec,b.col);
  if(cl){
    c.strokeStyle='#d5b255';c.lineWidth=0.9;c.beginPath();c.moveTo(-5,-77);c.lineTo(5,-77);c.stroke();
    circ(-5,-77,1.4,'#d5b255',0.5);circ(5,-77,1.4,'#d5b255',0.5);
  }
}
function drawArms(R,spec){
  var sl=sleeveCol(spec),b=gear(spec,'body'),wide=b&&b.id==='robe',sides=['L','R'],i,a;
  for(i=0;i<2;i++){
    a=R.arm[sides[i]];
    limb(a.s,a.e,R.armW*(wide?1.25:1),sl);
    limb(a.e,a.h,R.armW*(wide?1.45:0.92),sl);
  }
  if(b&&(b.id==='mail'||b.id==='tabard')){
    mirrorDo(function(){ellp(R.sw-1.5,-74,6.6*Math.sqrt(R.bw),5.2,'#9aa0a8',0.9);});
  }
}

/* ---- head ---- */
function drawHead(R,spec,t){
  var skin=spec.skin;
  limb([0,-83],[0,-75],R.nw*2.1,shade(skin,-0.1),false);
  if(R.sp==='dragonborn')drawDragonHead(R,spec,t);else drawHumanHead(R,spec,t);
  var hg=gear(spec,'head');if(hg)HEAD[hg.id](R,spec,hg.col,t);
}
function drawHumanHead(R,spec){
  var sp=R.sp,f=R.f,skin=spec.skin,hair=spec.hair;
  var rx=(f?8:8.7)*(sp==='dwarf'?1.07:1)*(sp==='elf'?0.95:1);R.rx=rx;
  if(sp==='elf')mirrorDo(function(){poly([[rx-0.6,-91.5],[rx+10.5,-99.5],[rx+2.8,-85.5]]);fillPath(shade(skin,-0.05),0.8);});
  else mirrorDo(function(){ellp(rx-0.2,-89,1.9,2.9,shade(skin,-0.05),0.8);});
  blob(sym([[0,-99.6],[rx*0.88,-97.2],[rx,-91.2],[rx*0.93,-85],[rx*0.62,-80.4],[0,-78.8]]));
  fillPath(sg(-rx,rx,skin),0.9);
  var ey=-90.2,ex=rx*0.42;
  mirrorDo(function(){
    c.fillStyle='#f4efe6';c.beginPath();c.ellipse(ex,ey,1.9,1.25,0,0,TAU);c.fill();
    c.fillStyle=SPECIES[sp].eye;c.beginPath();c.arc(ex,ey,0.95,0,TAU);c.fill();
    c.fillStyle='#120c0a';c.beginPath();c.arc(ex,ey,0.45,0,TAU);c.fill();
    c.strokeStyle=shade(hair,-0.15);c.lineWidth=f?0.7:1.15;c.beginPath();c.moveTo(ex-2.3,ey-2.6);c.quadraticCurveTo(ex,ey-3.7,ex+2.3,ey-2.7);c.stroke();
    if(f){c.strokeStyle='#150e0c';c.lineWidth=0.6;c.beginPath();c.moveTo(ex+1.7,ey-0.9);c.lineTo(ex+2.8,ey-1.7);c.stroke();}
  });
  c.strokeStyle=shade(skin,-0.3);c.lineWidth=0.7;c.beginPath();c.moveTo(0.3,-89);c.quadraticCurveTo(1.3,-86.6,0,-85.6);c.stroke();
  c.lineWidth=0.8;c.strokeStyle=f?'#a4524f':shade(skin,-0.45);c.beginPath();c.moveTo(-2.4,-82.6);c.quadraticCurveTo(0,-81.6,2.4,-82.6);c.stroke();
  if(f){c.fillStyle='rgba(190,80,80,0.55)';c.beginPath();c.ellipse(0,-82.4,2.1,0.7,0,0,TAU);c.fill();}
  if(sp==='dwarf'&&!f){
    blob(sym([[0,-79.5],[rx*0.82,-87],[rx*1.08,-82],[rx*0.98,-73],[rx*0.55,-66.5],[0,-63]]));fillPath(sg(-rx,rx,hair),0.9);
    mirrorDo(function(){c.beginPath();c.moveTo(0,-84.6);c.quadraticCurveTo(rx*0.5,-87.2,rx*0.9,-83);c.quadraticCurveTo(rx*0.5,-82.4,0,-83.4);fillPath(shade(hair,-0.1),0.7);});
  }
  /* hair on top */
  blob(sym([[0,-101.5],[rx*0.7,-100.2],[rx+1,-95],[rx+0.9,-90.5],[rx*0.85,-93],[rx*0.5,-95],[0,-96.3]]));
  fillPath(sg(-rx,rx,hair),0.9);
  c.strokeStyle='rgba(0,0,0,0.22)';c.lineWidth=0.5;c.beginPath();
  c.moveTo(-3,-100);c.quadraticCurveTo(-1,-98,-1.5,-96.6);c.moveTo(2,-100.4);c.quadraticCurveTo(3.4,-98,2.6,-96.2);c.stroke();
  if(f&&sp!=='dwarf'){
    mirrorDo(function(){blob([[rx+0.2,-94],[rx+2.6,-86],[rx+3.4,-74],[rx+1.4,-70.5],[rx-0.2,-78],[rx-0.5,-90]]);fillPath(sg(rx-1,rx+4,hair),0.8);});
  }
  if(f&&sp==='dwarf'){
    mirrorDo(function(){
      var pts=[],ws=[],i;for(i=0;i<6;i++){pts.push([rx+3.2-(i%2)*0.8,-82+i*4.4]);ws.push(4.6-i*0.4);}
      chain(pts,ws,hair);circ(rx+2.8,-60,1.5,'#d5b255',0.5);
    });
  }
}
function drawDragonHead(R,spec){
  var skin=spec.skin,f=R.f,rx=8.6,hk=f?0.82:1.05;R.rx=rx;
  function hp(x,y){return [x*hk,-97+(y+97)*hk];}
  mirrorDo(function(){
    poly([hp(3.6,-97.5),hp(7,-106),hp(10.8,-111.5),hp(8.4,-103),hp(7.4,-96)]);fillPath('#d8ceb2',0.8);
    poly([[8.2,-95.5],[15,-93],[9.6,-89.2],[14,-87],[8.6,-84]]);fillPath(shade(skin,-0.25),0.8);
  });
  blob(sym([[0,-99.2],[rx*0.9,-96.6],[rx,-91],[rx*0.9,-86],[rx*0.78,-81.5],[0,-79]]));fillPath(sg(-rx,rx,skin),0.9);
  poly([[-2.6,-82],[2.6,-82],[3,-75],[-3,-75]]);c.fillStyle=shade(skin,0.22);c.fill();
  blob(sym([[0,-90.5],[4.6,-89.8],[6,-84.8],[5.2,-80.8],[2.6,-78.6],[0,-78.2]]));fillPath(sg(-6,6,shade(skin,0.12)),0.8);
  c.fillStyle='rgba(0,0,0,0.55)';mirrorDo(function(){c.beginPath();c.ellipse(1.8,-85.6,0.7,0.5,0,0,TAU);c.fill();});
  c.strokeStyle=shade(skin,-0.5);c.lineWidth=0.8;c.beginPath();c.moveTo(-4.4,-81.6);c.quadraticCurveTo(0,-80.4,4.4,-81.6);c.stroke();
  mirrorDo(function(){
    c.strokeStyle=shade(skin,-0.5);c.lineWidth=1.5;c.beginPath();c.moveTo(1.2,-95.6);c.lineTo(6.8,-94);c.stroke();
    c.beginPath();c.ellipse(4.7,-92.2,1.9,1.4,0,0,TAU);fillPath('#f1c93d',0.7);
    c.fillStyle='#120c0a';c.fillRect(4.35,-93.5,0.7,2.6);
  });
  c.strokeStyle='rgba(0,0,0,0.18)';c.lineWidth=0.5;
  [[-5,-96],[0,-98],[5,-96],[-6.4,-91],[6.4,-91],[-3,-86.6],[3,-86.6],[0,-93.5]].forEach(function(p){c.beginPath();c.arc(p[0],p[1],1.3,0.2,Math.PI-0.2);c.stroke();});
}

/* ---- head gear ---- */
var HEAD={
  cap:function(R,s,col){var rx=R.rx;blob(sym([[0,-102.5],[rx+1.2,-98],[rx+1.6,-93.5],[rx*0.6,-94.6],[0,-95]]));fillPath(sg(-rx,rx,col),0.9);},
  helm:function(R,s,col){
    var rx=R.rx;poly(sym([[0,-104.5],[rx+2.4,-99],[rx+2.8,-91],[rx+2,-84.5],[rx*0.84,-84.5],[rx*0.8,-93],[0,-96]]));
    fillPath(sg(-rx-2,rx+2,col),0.9);
    c.strokeStyle='rgba(0,0,0,0.25)';c.lineWidth=0.6;c.beginPath();c.moveTo(0,-104);c.lineTo(0,-96.2);c.stroke();
  },
  hood:function(R,s,col){
    var rx=R.rx;poly(sym([[0,-106],[rx*0.75,-104.5],[rx+3.6,-98],[rx+4.8,-88],[rx+4.2,-77.5],[rx*0.98,-79.5],[rx*1.02,-88],[rx*0.72,-95.8],[0,-98]]));
    fillPath(sg(-rx-4,rx+4,col),0.9);
  },
  wizhat:function(R,s,col){
    var rx=R.rx;ellp(0,-96.8,rx+7.5,2.8,shade(col,-0.2),0.9);
    c.beginPath();c.moveTo(-rx-0.4,-97.5);c.lineTo(rx+0.4,-97.5);c.quadraticCurveTo(rx*0.55,-111,5,-122);c.quadraticCurveTo(1,-118,-3.5,-110);c.quadraticCurveTo(-rx*0.6,-103,-rx-0.4,-97.5);c.closePath();
    fillPath(sg(-rx,rx,col),0.9);
    c.fillStyle='#d5b255';poly([[-rx-0.3,-99.6],[rx+0.3,-99.6],[rx+0.4,-97.4],[-rx-0.4,-97.4]]);c.fill();
    star(0,-106,2,'#f2d97a');
  },
  circlet:function(R,s,col){
    var rx=R.rx;c.strokeStyle=OL;c.lineWidth=2;c.beginPath();c.moveTo(-rx-0.2,-95.4);c.quadraticCurveTo(0,-97.8,rx+0.2,-95.4);c.stroke();
    c.strokeStyle=col;c.lineWidth=1.2;c.stroke();ellp(0,-97.1,1.4,1.5,'#6fb5e8',0.5);
  },
  featherhat:function(R,s,col){
    var rx=R.rx;blob(sym([[0,-103.5],[rx+1.6,-98.5],[rx+2.2,-93.6],[rx*0.6,-94.8],[0,-95.2]]));fillPath(sg(-rx,rx,col),0.9);
    c.beginPath();c.moveTo(rx*0.5,-100);c.quadraticCurveTo(rx+9,-114,rx+13,-104);c.quadraticCurveTo(rx+6,-107,rx*0.7,-99);c.closePath();fillPath('#e8e1cf',0.7);
    c.strokeStyle='#b33a35';c.lineWidth=0.7;c.beginPath();c.moveTo(rx*0.6,-99.6);c.quadraticCurveTo(rx+7,-109,rx+11,-104.6);c.stroke();
  }
};

/* ---- held items (h = hand position) ---- */
var ITEM={
  sword:function(R,h){
    c.save();c.translate(h[0],h[1]);c.rotate(0.08);
    c.beginPath();c.rect(-1.5,-3,3,10);fillPath('#4a2f1b',0.7);
    c.beginPath();c.rect(-6.5,-5.4,13,2.6);fillPath('#d5b255',0.7);
    var g=c.createLinearGradient(-2.4,0,2.4,0);g.addColorStop(0,'#eef2f5');g.addColorStop(0.5,'#c3ccd3');g.addColorStop(1,'#7f8a93');
    poly([[-2.4,-5.4],[2.4,-5.4],[2,-50],[0,-56],[-2,-50]]);fillPath(g,0.7);
    c.strokeStyle='rgba(255,255,255,0.5)';c.lineWidth=0.5;c.beginPath();c.moveTo(0,-8);c.lineTo(0,-50);c.stroke();
    circ(0,8,2,'#d5b255',0.7);c.restore();
  },
  shield:function(R,h,col){
    var r=13.5*Math.sqrt(R.bw),x=h[0]-3,y=h[1]-5;
    circ(x,y,r,shade(col,-0.3),1);
    var g=c.createRadialGradient(x-r*0.3,y-r*0.3,1,x,y,r);g.addColorStop(0,shade(col,0.25));g.addColorStop(1,shade(col,-0.25));
    circ(x,y,r*0.86,g,0.6);
    c.strokeStyle='#e5c76b';c.lineWidth=2;c.beginPath();c.moveTo(x,y-r*0.62);c.lineTo(x,y+r*0.62);c.moveTo(x-r*0.62,y);c.lineTo(x+r*0.62,y);c.stroke();
    circ(x,y,r*0.2,'#b8bec4',0.6);
  },
  buckler:function(R,h,col){var r=8.5*Math.sqrt(R.bw),x=h[0]-2,y=h[1]-3;circ(x,y,r,shade(col,-0.25),0.9);circ(x,y,r*0.78,col,0.5);circ(x,y,r*0.26,'#b8bec4',0.5);},
  bow:function(R,h){
    var x=h[0],y=h[1];c.lineCap='round';
    c.strokeStyle=OL;c.lineWidth=3.4;c.beginPath();c.moveTo(x+2.5,y-42);c.quadraticCurveTo(x-17,y-2,x+2.5,y+38);c.stroke();
    c.strokeStyle='#8a5a2e';c.lineWidth=1.9;c.stroke();
    c.strokeStyle='rgba(235,230,210,0.85)';c.lineWidth=0.5;c.beginPath();c.moveTo(x+2.5,y-42);c.lineTo(x+2.5,y+38);c.stroke();
    c.fillStyle='#3a2a1c';c.fillRect(x-4.4,y-4,3.4,9);
  },
  staff:function(R,h,col,t){
    var x=h[0],pulse=0.6+0.4*Math.sin(t*3);
    limb([x,1],[x,-106],2.8,'#6b4a2b',false);
    c.lineCap='round';c.strokeStyle=OL;c.lineWidth=2.6;c.beginPath();c.moveTo(x,-104);c.quadraticCurveTo(x-6.5,-108,x-3.4,-118);c.moveTo(x,-104);c.quadraticCurveTo(x+6.5,-108,x+3.4,-118);c.stroke();
    c.strokeStyle='#8a5a2e';c.lineWidth=1.4;c.stroke();
    c.save();c.globalCompositeOperation='lighter';var g=c.createRadialGradient(x,-112,0,x,-112,13);
    g.addColorStop(0,'rgba(120,210,255,'+(0.55*pulse).toFixed(3)+')');g.addColorStop(1,'rgba(120,210,255,0)');c.fillStyle=g;c.fillRect(x-14,-126,28,28);c.restore();
    poly([[x,-119],[x+3.2,-112],[x,-105],[x-3.2,-112]]);fillPath('#9fe0ff',0.6);
  },
  orb:function(R,h,col,t){
    var x=h[0]-1,y=h[1]-13+Math.sin(t*2.2)*1.2,pulse=0.65+0.35*Math.sin(t*3.4),i,a;
    c.save();c.globalCompositeOperation='lighter';var g=c.createRadialGradient(x,y,0,x,y,14);
    g.addColorStop(0,'rgba(190,140,255,'+(0.7*pulse).toFixed(3)+')');g.addColorStop(1,'rgba(190,140,255,0)');c.fillStyle=g;c.fillRect(x-15,y-15,30,30);c.restore();
    var g2=c.createRadialGradient(x-1.2,y-1.4,0.5,x,y,5);g2.addColorStop(0,'#f6eaff');g2.addColorStop(1,'#8e5ad6');circ(x,y,4.6,g2,0.6);
    for(i=0;i<3;i++){a=t*1.6+i*2.1;c.fillStyle='rgba(230,205,255,0.9)';c.beginPath();c.arc(x+Math.cos(a)*9,y+Math.sin(a)*3.5,0.8,0,TAU);c.fill();}
  },
  mace:function(R,h,col){
    var x=h[0],y=h[1],i;
    limb([x-3,y+10],[x+3.4,y-26],2.8,'#5a3a22',false);
    c.save();c.translate(x+3.6,y-31);
    for(i=0;i<6;i++){c.save();c.rotate(i*TAU/6);c.beginPath();c.rect(-1.3,-7.8,2.6,4.6);fillPath('#d5b255',0.5);c.restore();}
    circ(0,0,5.2,col,0.8);circ(-1.2,-1.4,1.6,'rgba(255,255,255,0.35)');c.restore();
  },
  holysymbol:function(R,h,col,t){
    var x=h[0]-1,y=h[1]-9,pulse=0.7+0.3*Math.sin(t*2.4),i;
    c.save();c.globalCompositeOperation='lighter';var g=c.createRadialGradient(x,y,0,x,y,14);
    g.addColorStop(0,'rgba(255,220,120,'+(0.5*pulse).toFixed(3)+')');g.addColorStop(1,'rgba(255,220,120,0)');c.fillStyle=g;c.fillRect(x-15,y-15,30,30);c.restore();
    c.strokeStyle='#e8c25a';c.lineWidth=1.2;c.lineCap='round';c.beginPath();
    for(i=0;i<8;i++){var a=i*TAU/8;c.moveTo(x+Math.cos(a)*4.6,y+Math.sin(a)*4.6);c.lineTo(x+Math.cos(a)*8,y+Math.sin(a)*8);}c.stroke();
    circ(x,y,4.4,'#e8c25a',0.7);circ(x,y,1.8,'#fff3c4',0.3);
  },
  scroll:function(R,h){
    c.save();c.translate(h[0],h[1]);c.rotate(-0.55);
    var g=c.createLinearGradient(0,-3.2,0,3.2);g.addColorStop(0,'#f1e6c6');g.addColorStop(1,'#bda97a');
    c.beginPath();c.rect(-12,-3.2,24,6.4);fillPath(g,0.8);
    ellp(-12,0,1.6,3.2,'#d9c99d',0.7);ellp(12,0,1.6,3.2,'#d9c99d',0.7);
    c.fillStyle='#a5242c';c.fillRect(-1.6,-3.5,3.2,7);c.restore();
  },
  lute:function(R,h,col,t){
    c.save();c.translate(-6,-45);c.rotate(-0.55);
    var g=c.createLinearGradient(-11,0,11,0);g.addColorStop(0,'#c98a45');g.addColorStop(1,'#7a4a20');
    ellp(0,0,11.5,8.8,g,0.9);circ(0,0,2.8,'#2a160a',0.4);
    c.strokeStyle='#d9c08a';c.lineWidth=0.5;c.beginPath();c.moveTo(-3.6,0);c.lineTo(3.6,0);c.stroke();
    c.beginPath();c.rect(10,-2.1,30,4.2);fillPath('#5a3a1c',0.8);
    c.beginPath();c.rect(39,-3.4,7,6.8);fillPath('#3a2412',0.8);
    c.strokeStyle='rgba(235,225,190,0.8)';c.lineWidth=0.4;c.beginPath();c.moveTo(-3,-1);c.lineTo(40,-1);c.moveTo(-3,1);c.lineTo(40,1);c.stroke();
    c.restore();
  },
  stick:function(R,h){limb([h[0],-2],[h[0],h[1]-30],2.6,'#7a5a36',false);}
};

function hand(R,spec,h){circ(h[0],h[1],R.handR,spec.skin,0.8);}
function drawItems(R,spec,t){
  var main=gear(spec,'main'),off=gear(spec,'off'),hR=R.arm.R.h,hL=R.arm.L.h;
  if(off&&ITEM[off.id])ITEM[off.id](R,hL,off.col,t);
  if(main&&ITEM[main.id])ITEM[main.id](R,hR,main.col,t);
  hand(R,spec,hR);
  if(!(off&&(off.id==='shield'||off.id==='buckler')))hand(R,spec,hL);
}

function drawHero(ctx,hero,t,x,baseY,k){
  c=ctx;
  var sp=SPECIES[hero.species],R=buildRig(hero);
  var spec={sp:sp.look||hero.species,f:hero.sex==='f',skin:sp.skins[Math.min(hero.skin,sp.skins.length-1)][1],hair:HAIR[hero.hair][1],cls:hero.cls,gear:hero.gear};
  c.save();c.translate(x,baseY);c.scale(k*sp.S,k*sp.S);
  c.fillStyle='rgba(0,0,0,0.5)';c.beginPath();c.ellipse(0,0,22*Math.sqrt(R.bw),4.2,0,0,TAU);c.fill();
  c.translate(0,Math.sin(t*1.8)*0.4);
  if(R.pose.anim)R.pose.anim(R,t);
  if(R.sp==='dragonborn')drawTail(R,spec,t);
  var cl=gear(spec,'cloak');if(cl)drawCloak(R,cl,t);
  var off=gear(spec,'off');if(off&&off.id==='quiver')drawQuiver(R);
  drawHairBack(R,spec);
  drawLegs(R,spec);
  drawTorso(R,spec);
  drawArms(R,spec);
  drawHead(R,spec,t);
  drawItems(R,spec,t);
  c.restore();
}
