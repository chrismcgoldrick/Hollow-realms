/* Narrative dice: faces of each die and their symbols. */
'use strict';

/* dice: s success, f failure, a advantage, t threat, T triumph (also a success), D despair (also a failure) */
var DICE={
  ability:{col:'#3f9a4a',n:'Ability',f:[[],['s'],['s'],['s','s'],['a'],['a'],['s','a'],['a','a']]},
  proficiency:{col:'#e6c029',n:'Proficiency',f:[[],['s'],['s'],['s','s'],['s','s'],['a'],['s','a'],['s','a'],['s','a'],['a','a'],['a','a'],['T']]},
  difficulty:{col:'#7a3f9a',n:'Difficulty',f:[[],['f'],['f','f'],['t'],['t'],['t'],['f','t'],['t','t']]},
  challenge:{col:'#b4322a',n:'Challenge',f:[[],['f'],['f'],['f','f'],['f','f'],['t'],['t'],['f','t'],['f','t'],['t','t'],['t','t'],['D']]},
  boost:{col:'#58a9d8',n:'Boost',f:[[],[],['s'],['s','a'],['a','a'],['a']]},
  setback:{col:'#2a2a2e',n:'Setback',f:[[],[],['f'],['f'],['t'],['t']]}
};
var SYM={s:'\u2714',f:'\u2718',a:'\u25b2',t:'\u25bc',T:'\u2605',D:'\u2620'};
