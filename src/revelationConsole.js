export class RevelationConsole extends FormApplication {
  constructor(revelation) {
    super();
    this.revelation = revelation;

  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: 'auto',
      id: 'revelation-console',
      template: 'modules/deepnight/src/templates/console.hbs',
      title: 'Revelation Console',
      userId: game.userId,
    };

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  getData(options) {
    return this.revelation.templateData();
  }

}
