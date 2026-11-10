# The Hollow Realms

A browser game: create a hero, then play through story missions.

**To play:** open `index.html` in a browser. Nothing needs installing.

## Where things live

```
index.html            The page layout (all screens) + the list of CSS/JS files it loads
css/
  base.css            Shared look: colour variables, top bar, panels, buttons, inputs
  create.css          Character creation screen
  home.css            Home menu and Campaigns screen
  dev.css             Developer tools
  responsive.css      Small-screen tweaks
  theme.css           Plain dark theme - OVERRIDES the gold look in the files above
  play.css            Gameplay / mission screen
js/
  core.js             Tiny helpers used everywhere ($, el, toast)
  data/               Game content - edit these to add things
    species.js        Species (Human, Elf, Dwarf, Orc)
    looks.js          How gear is drawn on the hero
    rules.js          Characteristics, species starting stats, skills
    items.js          Items and their bonuses
    careers.js        Careers, career skills, starting gear
    dice.js           Narrative dice faces
    missions.js       Missions / story scenes
  state.js            The current hero and screen
  render/hero.js      Draws the hero with code
  render/backdrop.js  Draws the painted backgrounds
  router.js           Switches between screens
  species-store.js    Saves developer species edits in the browser
  rules-engine.js     Works out stats and dice rolls
  screens/            One file per screen (create, home, dev, play)
  main.js             Starts the game - always loaded LAST
assets/images/        Pictures: portraits, backgrounds, items, ui
```

## Rules of thumb

- **Script order matters.** The `<script>` tags at the bottom of `index.html`
  load in order: data first, `main.js` last. A new file goes in that list,
  before `main.js`.
- **All JS files share one set of names.** A variable or function defined in
  one file can be used in any other. That means two files must never define
  the same name.
- **Images:** lowercase names with hyphens (`elf-ranger.png`), no spaces.
  PNG for things with transparent backgrounds, WebP/JPG for big backgrounds.
  Resize to roughly the size shown on screen before adding.
