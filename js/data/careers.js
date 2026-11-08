/* Careers: career skills and starting gear choices. */
'use strict';

/* A hero's starting gear is a list of entries. An entry with several options is an "or" choice. */
var CAREERS={
  fighter:{desc:'',skills:['Brawl','Coercion','Leadership','Melee (Heavy)','Melee (Light)','Resilience','Riding','Vigilance'],
    coin:{dice:100,mult:1},
    gear:[[{i:[['sword',1],['shield',1]]},{i:[['axe',1],['shield',1]]},{i:[['halberd',1]]}],[{i:[['leather_armor',1]]}],[{i:[['healing_elixir',2]]}],[TRAVEL]]},
  wizard:{desc:'',skills:['Arcana','Coercion','Discipline','Knowledge','Leadership','Skulduggery','Stealth','Vigilance'],coin:{dice:100,mult:1},gear:[]},
  cleric:{desc:'',skills:['Cool','Discipline','Knowledge','Medicine','Melee','Resilience','Survival','Vigilance'],coin:{dice:100,mult:1},gear:[]},
  ranger:{desc:'',skills:['Knowledge','Perception','Ranged','Riding','Stealth','Survival','Vigilance'],multi:{Knowledge:2},
    coin:{dice:100,mult:1},
    gear:[[{i:[['bow',1]]},{i:[['light_spear',1]]}],[{i:[['dagger',1]]},{i:[['healing_elixir',2]]}],[{i:[['leather_armor',1]]}],
      [{i:[['herbs',1],['climbing_gear',1]]},{i:[['winter_clothing',1]]}],[TRAVEL]]},
  politician:{desc:'',skills:['Alchemy','Knowledge','Mechanics','Medicine','Perception','Runes'],multi:{Knowledge:3},
    coin:{dice:100,mult:1},
    gear:[[{i:[['dagger',1]]}],[{i:[['alchemists_kit',1]]},{i:[['sword',1]]}],[{i:[['lantern',1]]},{i:[['herbs',1]]}],[{i:[['fine_cloak',1]]},TRAVEL]]},
  bard:{desc:'',skills:['Charm','Cool','Deception','Knowledge','Negotiation','Perception','Streetwise','Vigilance'],coin:{dice:100,mult:1},gear:[]}
};
function careerSkills(cls){return CAREERS[cls].skills.slice();}
function maxPicks(cls,name){var m=CAREERS[cls].multi;return Math.min(MAX_START_RANK,(m&&m[name])||1);}
function countOf(arr,n){var c=0;arr.forEach(function(x){if(x===n)c++;});return c;}

var MAX_START_RANK=2;
