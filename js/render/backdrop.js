/* Painted backgrounds: the creation stage and the home/menu background. */
'use strict';

/* ---- stage backdrop (storybook courtyard at dusk) ---- */
var stage=document.getElementById('stage'),sctx=stage.getContext('2d'),SW=0,SH=0,SDPR=1;
var motes=[];(function(){for(var i=0;i<26;i++)motes.push({x:Math.random(),y:Math.random(),s:0.2+Math.random()*0.6,p:Math.random()*TAU});})();
function flame(x,y,s,t,seed){
  var fl=1+0.12*Math.sin(t*11+seed)+0.08*Math.sin(t*17.3+seed*2),h=s*fl,w=s*0.3,i,cols=['rgba(255,100,28,0.92)','rgba(255,170,58,0.96)','rgba(255,236,176,0.98)'],sc=[1,0.66,0.34];
  for(i=0;i<3;i++){
    var ww=w*sc[i],hh=h*sc[i];sctx.fillStyle=cols[i];sctx.beginPath();sctx.moveTo(x-ww,y);
    sctx.bezierCurveTo(x-ww*1.15,y-hh*0.45,x-ww*0.2,y-hh*0.62,x,y-hh);sctx.bezierCurveTo(x+ww*0.3,y-hh*0.55,x+ww*1.15,y-hh*0.4,x+ww,y);
    sctx.bezierCurveTo(x+ww*0.6,y+ww*0.45,x-ww*0.6,y+ww*0.45,x-ww,y);sctx.closePath();sctx.fill();
  }
}
function hill(W,H,base,amp,f,ph,col,top){
  sctx.fillStyle=col;sctx.beginPath();sctx.moveTo(0,H);
  for(var x=0;x<=W;x+=8){var y=base+Math.sin(x*f+ph)*amp+Math.sin(x*f*2.3+ph*1.7)*amp*0.4;sctx.lineTo(x,y);}
  sctx.lineTo(W,H);sctx.closePath();sctx.fill();
}
function castle(cx,by,u,col){
  sctx.fillStyle=col;
  function tower(x,w,h,roof){sctx.fillRect(x-w/2,by-h,w,h);sctx.beginPath();sctx.moveTo(x-w*0.7,by-h);sctx.lineTo(x,by-h-roof);sctx.lineTo(x+w*0.7,by-h);sctx.closePath();sctx.fill();}
  sctx.fillRect(cx-u*3,by-u*2.2,u*6,u*2.2);
  tower(cx-u*3,u*1.3,u*4.2,u*1.8);tower(cx+u*3,u*1.3,u*4.2,u*1.8);tower(cx,u*1.6,u*5.6,u*2.3);
  for(var i=-2;i<=2;i++)sctx.fillRect(cx+i*u*1.1-u*0.3,by-u*2.2-u*0.5,u*0.6,u*0.5);
}
function backdrop(W,H,t){
  var g=sctx.createLinearGradient(0,0,0,H*0.8);
  g.addColorStop(0,'#4f6fae');g.addColorStop(0.45,'#c9a3b8');g.addColorStop(0.75,'#f2b87c');g.addColorStop(1,'#fbe0a0');
  sctx.fillStyle=g;sctx.fillRect(0,0,W,H);
  /* sun glow behind the hero */
  var sg=sctx.createRadialGradient(W/2,H*0.5,0,W/2,H*0.5,H*0.7);sg.addColorStop(0,'rgba(255,240,190,0.9)');sg.addColorStop(0.35,'rgba(255,214,140,0.4)');sg.addColorStop(1,'rgba(255,200,120,0)');
  sctx.fillStyle=sg;sctx.fillRect(0,0,W,H);
  /* soft clouds */
  sctx.fillStyle='rgba(255,236,214,0.55)';
  [[0.18,0.14,0.16],[0.62,0.1,0.2],[0.84,0.22,0.13],[0.4,0.26,0.12]].forEach(function(c,i){
    var cx=((c[0]+t*0.004*(1+i*0.3))%1.3-0.15)*W,cy=H*c[1],r=H*c[2]*0.5;
    [[cx,cy,r*1.8,r*0.5],[cx-r*0.9,cy+r*0.1,r*1.1,r*0.4],[cx+r*0.9,cy+r*0.12,r*1.2,r*0.42]].forEach(function(e){sctx.beginPath();sctx.ellipse(e[0],e[1],e[2],e[3],0,0,TAU);sctx.fill();});
  });
  var fy=H*0.78;
  hill(W,H,fy-H*0.27,H*0.035,0.004,0.5,'#8f8fb8');
  castle(W*0.72,fy-H*0.235,H*0.018,'#7c7fb0');
  hill(W,H,fy-H*0.18,H*0.04,0.006,2.1,'#6f8f86');
  hill(W,H,fy-H*0.1,H*0.035,0.008,4.0,'#4f7c52');
  /* ground */
  g=sctx.createLinearGradient(0,fy-H*0.06,0,H);g.addColorStop(0,'#5f9144');g.addColorStop(1,'#2e5a2c');
  sctx.fillStyle=g;sctx.fillRect(0,fy-H*0.04,W,H);
  /* tufts */
  sctx.strokeStyle='rgba(30,80,30,0.35)';sctx.lineWidth=1.4;sctx.beginPath();
  for(var i=0;i<60;i++){var gx=((i*0.6180339)%1)*W,gy=fy+H*0.04+((i*0.3819)%1)*(H-fy-H*0.05);sctx.moveTo(gx,gy);sctx.lineTo(gx-3,gy-7);sctx.moveTo(gx,gy);sctx.lineTo(gx+3,gy-8);}
  sctx.stroke();
  /* stone dais with a gilded ring */
  var px=W/2,pr=Math.min(W*0.18,H*0.36);
  sctx.fillStyle='rgba(20,50,20,0.45)';sctx.beginPath();sctx.ellipse(px,fy+H*0.03,pr*1.05,H*0.055,0,0,TAU);sctx.fill();
  sctx.fillStyle='#8c7f6a';sctx.beginPath();sctx.ellipse(px,fy+H*0.02,pr,H*0.05,0,0,TAU);sctx.fill();
  g=sctx.createLinearGradient(0,fy-H*0.03,0,fy+H*0.05);g.addColorStop(0,'#eadfc4');g.addColorStop(1,'#bfae8c');
  sctx.fillStyle=g;sctx.beginPath();sctx.ellipse(px,fy,pr,H*0.045,0,0,TAU);sctx.fill();
  sctx.strokeStyle='#c9a040';sctx.lineWidth=2.2;sctx.stroke();
  sctx.strokeStyle='rgba(122,90,20,0.55)';sctx.lineWidth=1.2;sctx.beginPath();sctx.ellipse(px,fy,pr*0.8,H*0.036,0,0,TAU);sctx.stroke();
  for(i=0;i<12;i++){var a=i/12*TAU;sctx.fillStyle='rgba(142,43,34,0.75)';sctx.beginPath();sctx.arc(px+Math.cos(a)*pr*0.9,fy+Math.sin(a)*H*0.041,Math.max(1.5,H*0.0035),0,TAU);sctx.fill();}
  /* torch posts */
  [[0.14,0],[0.86,1.7]].forEach(function(o){
    var x=W*o[0],y=H*0.5,pw=Math.max(3,H*0.008);
    sctx.fillStyle='#6b4423';sctx.fillRect(x-pw,y,pw*2,H*0.3);
    sctx.fillStyle='#c9a040';sctx.fillRect(x-pw*1.6,y+H*0.12,pw*3.2,pw*0.9);
    sctx.fillStyle='#3b2512';sctx.beginPath();sctx.moveTo(x-pw*3.4,y-H*0.03);sctx.lineTo(x+pw*3.4,y-H*0.03);sctx.lineTo(x+pw*1.7,y);sctx.lineTo(x-pw*1.7,y);sctx.closePath();sctx.fill();
    flame(x,y-H*0.03,H*0.075,t,o[1]*10);
  });
  /* drifting sparkles */
  sctx.fillStyle='rgba(255,246,200,0.8)';
  motes.forEach(function(m){var mx=((m.x+Math.sin(t*0.2+m.p)*0.02)%1)*W,my=((m.y-t*0.01*m.s)%1+1)%1*H;sctx.beginPath();sctx.arc(mx,my,1+m.s*1.2,0,TAU);sctx.fill();});
}
function stageLights(W,H,t){
  sctx.globalCompositeOperation='lighter';
  [[0.14,0],[0.86,1.7]].forEach(function(o){
    var x=W*o[0],y=H*0.47,fl=1+0.07*Math.sin(t*11+o[1]*10)+0.05*Math.sin(t*17.3+o[1]*20),r=H*0.45*fl;
    var g=sctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,'rgba(255,190,100,0.28)');g.addColorStop(0.5,'rgba(255,150,60,0.08)');g.addColorStop(1,'rgba(255,120,40,0)');
    sctx.fillStyle=g;sctx.fillRect(x-r,y-r,r*2,r*2);
  });
  sctx.globalCompositeOperation='source-over';
  var v=sctx.createRadialGradient(W/2,H*0.5,Math.min(W,H)*0.45,W/2,H*0.5,Math.max(W,H)*0.8);
  v.addColorStop(0,'rgba(40,20,0,0)');v.addColorStop(1,'rgba(40,20,0,0.35)');sctx.fillStyle=v;sctx.fillRect(0,0,W,H);
}
var time=0;
function renderStage(){
  if(!SW||!SH)return;
  sctx.setTransform(SDPR,0,0,SDPR,0,0);
  backdrop(SW,SH,time);
  drawHero(sctx,state.hero,time,SW/2,SH*0.78,SH*0.0054);
  stageLights(SW,SH,time);
}
function resizeStage(){
  SDPR=Math.min(window.devicePixelRatio||1,1.5);
  SW=stage.clientWidth;SH=stage.clientHeight;
  stage.width=Math.round(SW*SDPR);stage.height=Math.round(SH*SDPR);
  renderStage();
}

/* ---- home backdrop (same storybook scene, no hero) ---- */
var bgc=document.getElementById('homeBg'),bgx=bgc.getContext('2d'),BW=0,BH=0;
function resizeBg(){
  var d=Math.min(window.devicePixelRatio||1,1.25);BW=window.innerWidth;BH=window.innerHeight;
  bgc.width=Math.round(BW*d);bgc.height=Math.round(BH*d);bgx.setTransform(d,0,0,d,0,0);drawBg();
}
function drawBg(){
  if(!BW)return;var keep=sctx;sctx=bgx;
  backdrop(BW,BH,time);stageLights(BW,BH,time);
  sctx.fillStyle=document.body.classList.contains('play')?'rgba(8,6,4,0.10)':'rgba(8,6,4,0.55)';sctx.fillRect(0,0,BW,BH);
  var v=sctx.createRadialGradient(BW/2,BH/2,BH*0.25,BW/2,BH/2,BH*0.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,0.7)');sctx.fillStyle=v;sctx.fillRect(0,0,BW,BH);
  sctx=keep;
}
