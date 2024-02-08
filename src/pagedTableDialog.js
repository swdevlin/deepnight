export class PagedTableDialog extends Application {
  static ID = 'deepnight-damages';

  constructor(src, options = {}) {
    super(src, options);
    this.page = 0;
    this.pageSize = 20;
    this.items = [];
  }

  redraw(force) {
    this.render(force)
  }

  async getItems(start, end) {
    return [];
  }

  async getData() {
    const start = this.pageSize * this.page;
    const end = start + this.pageSize;
    return {
      items: await this.getItems(start, end),
      is_gm: game.user.isGM,
      page: this.page,
      pageSize: this.pageSize,
      start: start,
      end: end,
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
      if ((this.page+1)*this.pageSize < this.damagedSystems.length) {
        this.page++;
        this.redraw();
      }
    });

    html.on('click', '#last', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      const newPage = Math.floor(this.items.length / this.pageSize);
      if (newPage !== this.page) {
        this.page = Math.floor(this.items.length / this.pageSize);
        this.redraw();
      }
    });
  }
}
