/* Gear as it is DRAWN on the character (helmets, robes, swords...) and the gear slots. */
'use strict';

var NAMES={helm:'Steel Helm',hood:'Ranger Hood',wizhat:'Pointed Hat',circlet:'Gold Circlet',featherhat:'Feathered Cap',cap:'Plain Cap',
  mail:'Mail Shirt',leather:'Leather Vest',robe:'Wizard Robe',tabard:'Sun Tabard',suit:'Formal Suit',doublet:'Minstrel Doublet',tunic:'Plain Tunic',
  trousers:'Trousers',boots:'Boots',tall:'Tall Boots',shoes:'Shoes',cape:'Cape',cloak:'Cloak',
  sword:'Longsword',shield:'Round Shield',bow:'Shortbow',quiver:'Quiver',staff:'Staff',orb:'Arcane Orb',mace:'Mace',
  holysymbol:'Holy Symbol',scroll:'Scroll',lute:'Lute',stick:'Wooden Stick',buckler:'Buckler'};

var CLASSES={
  fighter:{name:'Warrior',pose:'fighter',gear:{head:{id:'helm',col:'#9aa2aa'},body:{id:'mail',col:'#7d848c'},legs:{id:'trousers',col:'#3d4350'},feet:{id:'boots',col:'#3a2a1f'},
      cloak:{id:'cape',col:'#8c2a2e'},main:{id:'sword'},off:{id:'shield',col:'#8c2a2e'}}},
  ranger:{name:'Scout',pose:'ranger',gear:{head:{id:'hood',col:'#3f5d3a'},body:{id:'leather',col:'#6a5233'},legs:{id:'trousers',col:'#4a4a32'},feet:{id:'boots',col:'#4a3524'},
      cloak:{id:'cloak',col:'#3f5d3a'},main:{id:'bow'},off:{id:'quiver'}}},
  wizard:{name:'Wizard',pose:'wizard',gear:{head:{id:'wizhat',col:'#2d3f8a'},body:{id:'robe',col:'#33479c'},legs:{id:'trousers',col:'#2a2a3a'},feet:{id:'shoes',col:'#2a2220'},
      cloak:null,main:{id:'staff'},off:{id:'orb'}}},
  cleric:{name:'Healer',pose:'cleric',gear:{head:{id:'circlet',col:'#d5b255'},body:{id:'tabard',col:'#ece6d4'},legs:{id:'trousers',col:'#7d838c'},feet:{id:'boots',col:'#4a3a2a'},
      cloak:null,main:{id:'mace',col:'#aeb4ba'},off:{id:'holysymbol'}}},
  politician:{name:'Scholar',pose:'politician',gear:{head:null,body:{id:'suit',col:'#23324f'},legs:{id:'trousers',col:'#23324f'},feet:{id:'shoes',col:'#14110f'},
      cloak:null,main:{id:'scroll'},off:null}},
  bard:{name:'Socialite',pose:'bard',gear:{head:{id:'featherhat',col:'#2f7f78'},body:{id:'doublet',col:'#7b3a8c'},legs:{id:'trousers',col:'#b0473a'},feet:{id:'tall',col:'#5a3a22'},
      cloak:null,main:{id:'lute'},off:null}}
};

var PLAIN={head:{id:'cap',col:'#7a6a4f'},body:{id:'tunic',col:'#8a7a5a'},legs:{id:'trousers',col:'#5a4c3a'},feet:{id:'boots',col:'#4a3524'},
  cloak:{id:'cloak',col:'#4a4540'},main:{id:'stick'},off:{id:'buckler',col:'#7d838c'}};

var SLOTS=[['head','Head'],['body','Body'],['legs','Legs'],['feet','Feet'],['cloak','Cloak'],['main','Main hand'],['off','Off hand']];
