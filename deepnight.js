// CONFIG.debug.hooks = true;

import "./settings.js";
import {DeepnightRevelation} from "./src/deepnightRevelation.js";

window.deepnightHistory = null;

window.deepnightDamagedSystemsDialog = null;

window.deepnightRevelation = new DeepnightRevelation({});

Hooks.on('init', async function() {
  console.log(`Deepnight | init`);
  await loadTemplates([
    "modules/deepnight/src/templates/player/main-content.hbs",
    "modules/deepnight/src/templates/referee/main-content.hbs",
  ]);

});

Handlebars.registerHelper('padHexAddress', (num) => {
  return num < 10 ? '0' + num : num;
});

Handlebars.registerHelper('padDay', (num) => {
  if (num < 10)
    return '00' + num;
  else if (num < 100)
    return '0' + num;
  else
    return num;
});

Hooks.on('ready', async function() {
  window.deepnightRevelation.loadFromSettings();
});

//noinspection JSUnusedLocalSymbols
Hooks.on('updateSetting', async (setting, value, options) => {
  console.log('Deepnight', setting.key);
  if (setting.key.startsWith('deepnight.'))
    await window.deepnightRevelation.loadFromSettings();

  if (!setting.key.includes('history'))
    window.deepnightRevelation.redraw();

  if (setting.key.includes('history') && window.deepnightHistory)
    window.deepnightHistory.redraw();
});

//noinspection JSUnusedLocalSymbols
Hooks.on('renderActorDirectory', async (app, html, data) => {
  let button = await renderTemplate(
    'modules/deepnight/src/templates/actors_button.hbs'
  )

  html.find('.directory-header')
    .prepend(button)
    .promise()
    .done(() => {
      $('#btn-deepnight').on('click', (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        window.deepnightRevelation.redraw(true);
      });
    })
});
