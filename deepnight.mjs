import {DeepnightRevelation} from "./scripts/deepnightRevelation.js";

const ship = new DeepnightRevelation({
  // baseApplication: setting.name.trim(),
  // classes: [setting.name.trim().replace(" ", "-")],
  width: 512,
  height: 512,
  minimizable: true,
  // title: setting.name.trim(),
  // url: setting.url.trim(),
  // compat: setting.compat || false,
  // customCSS: setting.customcss,
  // properties: setting.properties,
});

Hooks.on('init', function() {
  console.log(`Deepnight | init`);

});

Hooks.on('ready', function() {
  console.log(`Deepnight | ready`);
});

Hooks.on("getSceneControlButtons", (controls) => {
  // let privateSettings = game.settings.get("inlinewebviewer", "privateWebviewersNew") || [];
  // let settings = game.settings.get("inlinewebviewer", "webviewersNew") || [];

  // check if settingsstring contains any value
  // if (!game.user.isGM && settings.length === 0 && privateSettings.length === 0) {
  //   return;
  // }

  // init tools array for buttons
  let tools = [{
      name: game.i18n.localize("DEEPNIGHT.shipButtonName"),
      title: game.i18n.localize("DEEPNIGHT.shipButtonTitle"),
      icon: "fa-regular fa-panel-ews",
      button: true,
      onClick: () => {
        ship.jump();
      },
  }];

  if (game.user.isGM) {
    tools.push({
      name: game.i18n.localize("DEEPNIGHT.jumpButtonName"),
      title: game.i18n.localize("DEEPNIGHT.jumpButtonTitle"),
      icon: "fa-regular fa-calendar-week",
      button: true,
      onClick: () => {
        ship.jump();
      },
    });
    tools.push({
      name: game.i18n.localize("DEEPNIGHT.dayButtonName"),
      title: game.i18n.localize("DEEPNIGHT.dayButtonTitle"),
      icon: "fa-regular fa-calendar-day",
      button: true,
      onClick: () => {
        ship.incDay();
      },
    });
    tools.push({
      name: game.i18n.localize("DEEPNIGHT.watchButtonName"),
      title: game.i18n.localize("DEEPNIGHT.watchButtonTitle"),
      icon: "fa-regular fa-watch",
      button: true,
      onClick: () => {
        ship.incWatch();
      },
    });
  }
  try {
    controls.push({
      name: "DEEPNIGHT.buttonName",
      title: "DEEPNIGHT.buttonTitle",
      layer: "controls",
      icon: "fa fa-star",
      visible: true,
      tools: tools,
    });
  } catch (e) {
    console.error(e);
  }
});
