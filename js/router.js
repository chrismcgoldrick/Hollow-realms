/* Screen switching: which screens exist and go(name) to show one. */
'use strict';

var VIEWS=['screen-home','screen-campaigns','screen-dev','screen-create','screen-play'];
var screens={
  home:{id:'screen-home',menu:true,enter:function(){}},
  campaigns:{id:'screen-campaigns',menu:true,enter:function(){renderCampaigns();}},
  dev:{id:'screen-dev',enter:function(){devRender();}},
  create:{id:'screen-create',stepper:1,enter:function(){$('step1').hidden=false;$('step2').hidden=true;$('step3').hidden=true;buildSpeciesChips();refresh();resizeStage();}},
  train:{id:'screen-create',stepper:2,enter:function(){$('step1').hidden=true;$('step2').hidden=false;$('step3').hidden=true;refresh();resizeStage();}},
  gear:{id:'screen-create',stepper:3,enter:function(){$('step1').hidden=true;$('step2').hidden=true;$('step3').hidden=false;refresh();applyGearMode(false);resizeStage();}},
  world:{id:'screen-play',play:true,enter:function(){renderPlay();resizeBg();}}
};
function go(name){
  var s=screens[name];
  if(!s){toast('That screen is not built yet.');return;}
  state.screen=name;
  VIEWS.forEach(function(v){$(v).hidden=(v!==s.id);});
  document.body.classList.toggle('menu',!!s.menu);document.body.classList.toggle('play',!!s.play);
  var st=$('stepper');st.hidden=!s.stepper;
  $('st1').className=s.stepper===1?'on':(s.stepper>1?'done':'');
  $('st2').className=s.stepper===2?'on':(s.stepper===3?'done':'');
  $('st3').className=s.stepper===3?'on':'';
  $('who').hidden=!(s.stepper||name==='dev');
  s.enter();
  if(s.menu||s.play)resizeBg();
}
