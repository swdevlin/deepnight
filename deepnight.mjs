CONFIG.debug.hooks = true;

import "./settings.js";
import {DeepnightRevelation} from "./src/deepnightRevelation.js";

window.deepnightRevelation = new DeepnightRevelation({
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

Hooks.on("renderSidebar", async (app, html) => {
  // Create a tab button element
  const tabButton = document.createElement("a");
  tabButton.classList.add("item");
  tabButton.setAttribute("data-tab", "deepnight");
  tabButton.innerHTML = '<i class="dnr-shipicon"></i>';

  // Add a click event listener to your tab button
  tabButton.addEventListener("click", () => {
    // Activate your tab and display its content
    html.find(".tab").removeClass("active");
    html.find(".deepnight").addClass("active");
  });

  const settingsTab = html.find('nav a[data-tab="settings"]')[0];
  settingsTab.parentNode.insertBefore(tabButton, settingsTab);

  const sections = html.find('div#sidebar');
  console.log('deepnight', sections);
  const deepnightSection = await renderTemplate('modules/deepnight/src/templates/sidebar-section.hbs', {});
  console.log('deepnight', deepnightSection);
  sections.prevObject.append(deepnightSection);
});

Hooks.on("changeSidebarTab", () => {
  window.deepnightRevelation.updatePanel()
});

// Hooks.on("getSceneControlButtons", (controls) => {
//   // let privateSettings = game.settings.get("inlinewebviewer", "privateWebviewersNew") || [];
//   // let settings = game.settings.get("inlinewebviewer", "webviewersNew") || [];
//
//   // check if settingsstring contains any value
//   // if (!game.user.isGM && settings.length === 0 && privateSettings.length === 0) {
//   //   return;
//   // }
//
//   console.log(controls);
//   console.log("sceneControls");
//
//   // init tools array for buttons
//   let tools = [
//     {
//       name: game.i18n.localize("DEEPNIGHT.shipButtonName"),
//       title: game.i18n.localize("DEEPNIGHT.shipButtonTitle"),
//       icon: "fa-solid fa-panel-ews",
//       button: true,
//       onClick: () => {
//         window.deepnightRevelation.displayConsole();
//         console.log('show status panel')
//       },
//     },
//     {
//       name: game.i18n.localize("DEEPNIGHT.commandButtonName"),
//       title: game.i18n.localize("DEEPNIGHT.commandButtonTitle"),
//       icon: "fa-solid fa-sitemap",
//       button: true,
//       onClick: () => {
//         console.log('show org chart')
//       },
//     },
//   ];
//
//   if (game.user.isGM) {
//     tools.push({
//       name: game.i18n.localize("DEEPNIGHT.jumpButtonName"),
//       title: game.i18n.localize("DEEPNIGHT.jumpButtonTitle"),
//       icon: "fa-regular fa-calendar-week",
//       button: true,
//       onClick: () => {
//         window.deepnightRevelation.jump();
//       },
//     });
//     tools.push({
//       name: game.i18n.localize("DEEPNIGHT.dayButtonName"),
//       title: game.i18n.localize("DEEPNIGHT.dayButtonTitle"),
//       icon: "fa-regular fa-calendar-day",
//       button: true,
//       onClick: () => {
//         window.deepnightRevelation.dayPasses();
//       },
//     });
//     tools.push({
//       name: game.i18n.localize("DEEPNIGHT.watchButtonName"),
//       title: game.i18n.localize("DEEPNIGHT.watchButtonTitle"),
//       icon: "fa-regular fa-watch",
//       button: true,
//       onClick: () => {
//         window.deepnightRevelation.watchPasses();
//       },
//     });
//   }
//   try {
//     controls.push({
//       name: 'deepnight',
//       title: "DEEPNIGHT.buttonTitle",
//       layer: "controls",
//       icon: "dnr-shipicon",
//       visible: true,
//       // tools: [],
//       tools: tools,
//     });
//   } catch (e) {
//     console.error(e);
//   }
// });
