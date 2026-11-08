/* The current hero and which screen is showing. */
'use strict';

/* ============================ 2. STATE ============================ */
var state={
  screen:'home',user:null,
  hero:{name:'',species:'human',sex:'m',skin:0,hair:2,cls:'fighter',chr:{},sk:{},fp:[],fc:[],fk:[],goldRolls:{},gearMode:null,gearPick:{},inv:[],shopCat:0,
    gear:{head:'class',body:'class',legs:'class',feet:'class',cloak:'class',main:'class',off:'class'}}
};
if(window.__preset){for(var pk in window.__preset)state.hero[pk]=window.__preset[pk];}
