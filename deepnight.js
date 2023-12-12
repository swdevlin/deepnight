// CONFIG.debug.hooks = true;

import "./settings.js";
import {DeepnightRevelation} from "./src/deepnightRevelation.js";

window.deepnightHistory = null;

window.deepnightRevelation = new DeepnightRevelation({});

Hooks.on('init', async function() {
  console.log(`Deepnight | init`);
  await loadTemplates([
    "modules/deepnight/src/templates/player/main-content.hbs",
    "modules/deepnight/src/templates/referee/main-content.hbs",
  ]);

});

Hooks.on('ready', async function() {
  window.deepnightRevelation.loadFromSettings();
});

//noinspection JSUnusedLocalSymbols
Hooks.on('updateSetting', (setting, value, options) => {
  if (setting.key.startsWith('deepnight.'))
    if (!setting.key.includes('history')) {
      window.deepnightRevelation.loadFromSettings();
      window.deepnightRevelation.redraw();
    }
    if (setting.key.includes('history') && window.deepnightHistory) {
      window.deepnightHistory.redraw();
    }
});

Hooks.on('renderActorDirectory', async (app, html, data) => {
  let button = await renderTemplate(
    'modules/deepnight/src/templates/actors_button.hbs'
  )

  html.find('.directory-header')
    .prepend(button)
    .promise()
    .done(() => {
      $('#btn-deepnight').on('click', (e) => {
        window.deepnightRevelation.redraw(true);
      });
    })
});
