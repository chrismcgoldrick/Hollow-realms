/* Rules: characteristics, species starting stats, skills. */
'use strict';

/* ---- rules: narrative dice (own wording and numbers) ---- */
var CHARS=[['BR','Brawn'],['AG','Agility'],['INT','Intellect'],['CUN','Cunning'],['WIL','Willpower'],['PRE','Presence']];
var SP_RULES={ /* starting characteristics, wound base, strain base, starting XP */
  human:{c:{BR:2,AG:2,INT:2,CUN:2,WIL:2,PRE:2},w:10,st:10,xp:100,fs:2},
  elf:{c:{BR:1,AG:3,INT:2,CUN:2,WIL:2,PRE:2},w:8,st:12,xp:95,fixed:['Knowledge'],choice:{n:1,from:['Deception','Stealth']}},
  dwarf:{c:{BR:3,AG:1,INT:2,CUN:2,WIL:3,PRE:1},w:11,st:10,xp:90,fixed:['Resilience']},
  dragonborn:{c:{BR:3,AG:2,INT:1,CUN:2,WIL:2,PRE:2},w:12,st:8,xp:100,fixed:['Coercion']}
};
var SKILLS=[ /* name, linked characteristic, group */
  ['Alchemy','INT','General'],['Athletics','BR','General'],['Cool','PRE','General'],['Coordination','AG','General'],['Discipline','WIL','General'],
  ['Knowledge','INT','General'],['Mechanics','INT','General'],['Medicine','INT','General'],['Perception','CUN','General'],['Resilience','BR','General'],['Riding','AG','General'],
  ['Skulduggery','CUN','General'],['Stealth','AG','General'],['Streetwise','CUN','General'],['Survival','CUN','General'],['Vigilance','WIL','General'],
  ['Brawl','BR','Combat'],['Melee','BR','Combat'],['Melee (Heavy)','BR','Combat'],['Melee (Light)','BR','Combat'],['Ranged','AG','Combat'],
  ['Charm','PRE','Social'],['Coercion','WIL','Social'],['Deception','CUN','Social'],['Leadership','PRE','Social'],['Negotiation','PRE','Social'],
  ['Arcana','INT','Magic'],['Runes','INT','Magic']];
var CAREER_FREE=4;   /* a hero picks four career skills to start with one free rank */
