/* Items a hero can own (names, slots) and the bonuses drawn gear gives. */
'use strict';

/* Items named by the careers. Fill in stats and descriptions in the gear spreadsheet, then they move here. */
var ITEMS={
  sword:{n:'Sword',slot:'Main hand'},shield:{n:'Shield',slot:'Off hand'},axe:{n:'Axe',slot:'Main hand'},halberd:{n:'Halberd',slot:'Main hand'},
  leather_armor:{n:'Leather armor',slot:'Body'},healing_elixir:{n:'Healing elixir',slot:'Consumable'},
  backpack:{n:'Backpack',slot:'Traveling gear'},bedroll:{n:'Bedroll',slot:'Traveling gear'},rope:{n:'Rope',slot:'Traveling gear'},
  flint:{n:'Flint and steel',slot:'Traveling gear'},torches:{n:'Torches (3)',slot:'Traveling gear'},waterskin:{n:'Waterskin (empty)',slot:'Traveling gear'},
  bow:{n:'Bow',slot:'Main hand'},light_spear:{n:'Light spear',slot:'Main hand'},dagger:{n:'Dagger',slot:'Main hand'},
  herbs:{n:'Herbs of healing',slot:'Consumable'},climbing_gear:{n:'Climbing gear',slot:'Carried'},winter_clothing:{n:'Winter clothing',slot:'Body'},
  alchemists_kit:{n:"Alchemists' kit",slot:'Carried'},lantern:{n:'Lantern',slot:'Carried'},fine_cloak:{n:'Fine cloak',slot:'Cloak'}
};
var TRAVEL={l:'Traveling gear',i:[['backpack',1],['bedroll',1],['rope',1],['flint',1],['torches',1],['waterskin',1]]};

var ITEM_FX={helm:{soak:1},mail:{soak:2},leather:{soak:1},shield:{def:1},buckler:{def:1},
  orb:{boost:'Arcana'},staff:{boost:'Arcana',wpn:{skill:'Melee',base:'BR',add:1}},holysymbol:{boost:'Discipline'},lute:{boost:'Charm'},scroll:{boost:'Negotiation'},
  sword:{wpn:{skill:'Melee',base:'BR',add:3}},mace:{wpn:{skill:'Melee',base:'BR',add:2}},stick:{wpn:{skill:'Melee',base:'BR',add:1}},bow:{wpn:{skill:'Ranged',base:null,add:7}}};
