import {logToStatus} from "./helpers.js";

export class RouteDialog extends Application {
  static ID = 'deepnight-route';

  constructor(src, options = {}) {
    super(src, options);
    this.page = 0;
    this.resetTo = null;
    this.pageSize = 20;
    this.route = [];
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "deepnight-route",
      template: 'modules/deepnight/src/templates/route.hbs',
      minimizable: true,
      resizable: false,
      width: 450,
      height: 610,
      title: "Deepnight Route"
    })
  }

  redraw(force) {
    this.render(force)
  }

  async getData() {
    try {
      const response = await fetch("https://radiofreewaba.net/deepnight/data/route", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.route = (await response.json()).reverse();

    } catch (error) {
      console.error("Error making REST call:", error);
      ui.notifications.error(`Call to fetch route failed: ${error.message}`);
    }

    const start = this.pageSize * this.page;
    const end = start + this.pageSize;
    const lines = this.route.slice(start, end);
    return {
      route: lines,
      is_gm: game.user.isGM,
      page: this.page,
      pageSize: this.pageSize,
      start: start,
      end: end,
    };
  }

  activateListeners(html) {
    super.activateListeners(html)

    html.on('click', '#route-first', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.page = 0;
      this.redraw();
    });

    html.on('click', '#route-previous', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      if (this.page > 0) {
        this.page--;
        this.redraw();
      }
    });

    html.on('click', '#route-next', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      if ((this.page+1)*this.pageSize < this.route.length) {
        this.page++;
        this.redraw();
      }
    });

    html.on('click', '#route-last', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      const newPage = Math.floor(this.route.length / this.pageSize);
      if (newPage !== this.page) {
        this.page = Math.floor(this.route.length / this.pageSize);
        this.redraw();
      }
    });
  }
}
