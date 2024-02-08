import {logToStatus} from "./helpers.js";

export class HistoryDialog extends Application {
  static ID = 'deepnight-history';

  constructor(src, options = {}) {
    super(src, options);
    this.page = 0;
    this.resetTo = null;
    this.pageSize = 20;
    this.history = [];
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "deepnight-history",
      template: 'modules/deepnight/src/templates/history.hbs',
      minimizable: true,
      resizable: false,
      width: 450,
      height: 610,
      title: "Deepnight History"
    })
  }

  redraw(force) {
    this.render(force)
  }

  async getData() {
    this.history = await game.settings.get('deepnight', 'history');
    const start = this.pageSize * this.page;
    const end = start + this.pageSize;
    const lines = this.history.slice(start, end);
    return {
      history: lines,
      is_gm: game.user.isGM,
      page: this.page,
      pageSize: this.pageSize,
      start: start,
      end: end,
      columns: {
        year: 0,
        day: 1,
        watch: 2,
        daysOnMission: 3,
        morale: 4,
        supplies: 5,
        rareMaterials: 6,
        rareBiologicals: 7,
        exoticMaterials: 8,
        cfi: 9,
        cei: 10,
        ceim: 11,
        flight_dei: 12,
        flight_crew: 13,
        mission_dei: 14,
        mission_crew: 15,
        operations_dei: 16,
        operations_crew: 17,
        engineering_dei: 18,
        engineering_crew: 19,
        fatigue: 20,
        ceiInterval: 21,
        ceimInterval: 22,
        cfiInterval: 23,
        supplyUnitsPerDay: 24,
      }
    };
  }

  activateListeners(html) {
    super.activateListeners(html)

    html.on('click', '#first', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.page = 0;
      this.redraw();
    });

    html.on('click', '#previous', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      if (this.page > 0) {
        this.page--;
        this.redraw();
      }
    });

    html.on('click', '#next', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      if ((this.page+1)*this.pageSize < this.history.length) {
        this.page++;
        this.redraw();
      }
    });

    html.on('click', '#last', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      const newPage = Math.floor(this.history.length / this.pageSize);
      if (newPage !== this.page) {
        this.page = Math.floor(this.history.length / this.pageSize);
        this.redraw();
      }
    });

    html.on('click', '.logview', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.viewEntry(evt);
    });

    // track reset
    html.on('click', '.logreset', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.resetEntry(evt);
    });

  }

  async viewEntry(evt) {
    const index = parseInt(evt.currentTarget.dataset.index, 10);
    const offset = this.page * this.pageSize + index;
    const data = {
      log: this.history[offset],
    };
    const dialogContent = await renderTemplate('modules/deepnight/src/templates/logEntry.hbs', data);
    const dialogOptions = {
      title: "Log Entry",
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "OK",
        },
      },
      default: "ok",
    };

    new Dialog(dialogOptions).render(true);
  }

  async resetEntry(evt) {
    const index = parseInt(evt.currentTarget.dataset.index, 10);
    const offset = this.page * this.pageSize + index;
    const data = this.history[offset];
    this.history.unshift(data);
    this.page = 0;
    const status = await game.settings.get('deepnight', 'status');
    logToStatus(status, data);
    await game.settings.set('deepnight', 'history', this.history);
    await game.settings.set('deepnight', 'status', status);
    this.redraw();
  }
}
