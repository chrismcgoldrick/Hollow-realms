/* Home screen (main menu) and the Campaigns screen. */
'use strict';

function wireHome(){
  $('newCharBtn').addEventListener('click',startNewHero);
  $('campaignsBtn').addEventListener('click',function(){go('campaigns');});
  $('campBack').addEventListener('click',function(){go('home');});
  $('devBtn').addEventListener('click',function(){go('dev');});
  $('homeBtn').addEventListener('click',function(){go('home');});
  $('playHome').addEventListener('click',function(){go('home');});
}

/* One button per entry in MISSIONS (js/data/missions.js).
   Campaigns stay locked until a hero has been made. */
function renderCampaigns(){
  var list=$('campList'),ready=state.heroReady;
  list.innerHTML='';
  $('campHint').textContent=ready?'':'Create a character first, then come back here to start a campaign.';
  Object.keys(MISSIONS).forEach(function(key){
    var m=MISSIONS[key],b=el('button','camp');
    b.type='button';b.disabled=!ready;
    b.appendChild(el('b',null,m.name));
    b.appendChild(el('span',null,m.scene));
    b.addEventListener('click',function(){SAMPLE=m;go('world');});
    list.appendChild(b);
  });
}
