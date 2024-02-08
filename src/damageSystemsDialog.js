import {PagedTableDialog} from "./pagedTableDialog.js";

export class DamageSystemsDialog extends PagedTableDialog {
  static ID = 'deepnight-damages';

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "deepnight-damages",
      template: 'modules/deepnight/src/templates/damagedSystems.hbs',
      minimizable: true,
      resizable: false,
      width: 760,
      height: 720,
      title: "Damaged Systems"
    })
  }

  activateListeners(html) {
    super.activateListeners(html)

    html.on('click', '.repair', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.repairEntry(evt);
    });

    html.on('click', '.cancel-repair', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.deleteEntry(evt);
    });
  }

  async deleteEntry(evt) {
    const index = parseInt(evt.currentTarget.dataset.index, 10);
    const offset = this.page * this.pageSize + index;
    this.items.splice(offset, 1);
    this.page = 0;
    window.deepnightRevelation.status.damagedSystems = this.items;
    await window.deepnightRevelation.saveSettings();
    this.redraw();
  }

  async repairEntry(evt) {
    const index = parseInt(evt.currentTarget.dataset.index, 10);
    const offset = this.page * this.pageSize + index;
    const damageEntry = this.items[offset];

    const data = await this.getData();
    data.damage = damageEntry;
    const dialogContent = await renderTemplate('modules/deepnight/src/templates/repairDialog.hbs', data);

    const dialogOptions = {
      title: 'Repair Damage',
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fa-regular fa-screwdriver-wrench"></i>',
          label: "Repair",
          callback: async () => {
            let timeTaken = parseInt(document.getElementById("timeTaken").value, 10);
            while (timeTaken >= 24) {
              timeTaken -= 24;
              window.deepnightRevelation.incDay()
            }
            while (timeTaken > 0) {
              timeTaken -= 8;
              window.deepnightRevelation.incWatch()
            }
            let supplyUnits = parseInt(document.getElementById("supplyUnitsUsed").value, 10);
            let rareMaterialsUsed = parseInt(document.getElementById("rareMaterialsUsed").value, 10);
            let exoticMaterialsUsed = parseInt(document.getElementById("exoticMaterialsUsed").value, 10);
            window.deepnightRevelation.supplies -= supplyUnits;
            window.deepnightRevelation.rareMaterials -= rareMaterialsUsed;
            window.deepnightRevelation.exoticMaterials -= exoticMaterialsUsed;
            await this.deleteEntry(evt);
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
        },
      },
      default: "ok",
    };

    new Dialog(dialogOptions).render(true);
  }

  async getItems(start, end) {
    const status = await game.settings.get('deepnight', 'status');
    this.items = status.damagedSystems;
    return this.items.slice(start, end);
  }

  async getData() {
    const data = await super.getData();
    const status = await game.settings.get('deepnight', 'status');
    data.supplies = status.supplies.toLocaleString();
    data.rareMaterials = status.rareMaterials.toLocaleString();
    data.exoticMaterials = status.exoticMaterials.toLocaleString();
    data.rareBiologicals = status.rareBiologicals.toLocaleString();
    return data;
  }
}
