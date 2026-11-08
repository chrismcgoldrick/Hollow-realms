/* Species: names, descriptions, body shape, hair and skin colours. */
'use strict';

var HAIR=[['Red','#a9441f'],['Blonde','#dcb85c'],['Brown','#5c3b22'],['Black','#1d1b20']];

var SPECIES={
  human:{name:'Human',blurb:'Adaptable and ambitious. Humans turn up everywhere and fit in anywhere.',S:1,bw:1,eye:'#4d3320',hair:true,
    info:{perks:[
      ['Starting Skills','One rank in each of two non-career skills, gained before spending XP. Neither can go above rank 2 during character creation.'],
      ['Endurance Predator','When making a check to heal strain at the end of an encounter, heal 1 additional strain.'],
      ['Adaptable','Once per session, when making a skill check, spend a Story Point to use any skill for it. The check still uses the original characteristic.']]},
    skins:[['Light','#f0c9a4'],['Medium','#c98f61'],['Dark','#7b4a2e']]},
  elf:{name:'Elf',blurb:'Graceful and long-lived, with keen senses and a love of old places.',S:1.04,bw:0.9,eye:'#2f8a5c',hair:true,
    info:{perks:[
      ['Starting Skills','One rank in Knowledge and one rank in either Deception or Stealth, gained before spending XP. Neither can go above rank 2 during character creation.'],
      ['Always Comes Out on Top','Once per session, after an elf makes a check or is the target of a check, spend a Story Point to cancel a Triumph or Despair from the result.']]},
    skins:[['Light','#f3d9c2'],['Medium','#d0a077'],['Dark','#8a583c']]},
  dwarf:{name:'Dwarf',blurb:'Stout, stubborn and hard to kill. Mountain folk with long memories.',S:0.82,bw:1.28,eye:'#5b3d22',hair:true,
    info:{perks:[
      ['Starting Skills','One rank in Resilience, gained before spending XP. It cannot go above rank 2 during character creation.'],
      ['Dark Vision','When making skill checks, remove up to two Setback dice imposed by darkness.'],
      ['Tough as Nails','Once per session, spend a Story Point as an out-of-turn incidental right after suffering a Critical Injury and learning the result. If you do, the roll counts as 01.']]},
    skins:[['Light','#eebf9a'],['Medium','#c28659'],['Dark','#74452a']]},
  dragonborn:{name:'Orc',blurb:'Fierce and powerful. Orcs hit hard, shrug off pain and never back down.',S:1.1,bw:1.16,eye:'#f1c93d',hair:false,
    info:{perks:[
      ['Starting Skills','One rank in Coercion, gained before spending XP. It cannot go above rank 2 during character creation.'],
      ['Battle Rage','When making a melee attack, an orc may add a Setback die to the check to deal +2 damage with one hit of that attack.']]},
    skins:[['Green','#4d9650'],['Red','#b5432f'],['Sand','#cdb06a']]}
};
