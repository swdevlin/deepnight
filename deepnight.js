CONFIG.debug.hooks = true;

import "./settings.js";
import {DeepnightRevelation} from "./src/deepnightRevelation.js";

window.deepnightRevelation = new DeepnightRevelation({
  width: 512,
  height: 512,
  minimizable: true,
});

Hooks.on('init', function() {
  console.log(`Deepnight | init`);
});

Hooks.on('ready', async function() {
  window.deepnightRevelation.loadFromSettings();
  console.log(`Deepnight | ready`);
});

Hooks.on("renderSidebar", async (app, html) => {
  const tabButton = document.createElement("a");
  tabButton.classList.add("item");
  tabButton.setAttribute("data-tab", "deepnight");
  tabButton.innerHTML = '<i class="dnr-shipicon"></i>';

  tabButton.addEventListener("click", () => {
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
  console.log('deepnight|changeSidebarTab');
  window.deepnightRevelation.updatePanel()
});

Hooks.on('updateSetting', (setting, value, options) => {
  console.log('deepnight|updateSettings', setting);
  if (setting.key.startsWith('deepnight.'))
    if (!setting.key.includes('history'))
      window.deepnightRevelation.loadFromSettings();
});
