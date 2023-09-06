import {RevelationConsole} from "./revelationConsole.js";

export class DeepnightRevelation extends Application {
  static ID = 'deepnight';
  constructor(src, options = {}) {
    super(src, options);
    this.year = 1105;
    this.day = 17;
    this.watch = 1;
    this.daysOnMission = 0;
    this.morale = 0;
    this.supplies = 200000;
    this.rareMaterials = 0;
    this.rareBiologicals = 0;
    this.exoticMaterials = 0;
    this.cfi = 0;
    this.cei = 7;
    this.ceim = 0;
    this.command = {
      missionCommander: null,
      captain: null,
      xo: null,
      chiefMissionOfficer: null,
      chiefOperationsOfficer: null,
      chiefFlightOfficer: null,
      chiefEngineeringOfficer: null,
    }
    this.flight = {
      dei: 0,
      crew: 0,
    };

    this.mission = {
      dei: 0,
      crew: 0,
    };

    this.operations = {
      dei: 0,
      crew: 0,
    };

    this.engineering = {
      dei: 0,
      crew: 0,
    };

    /** @type {Event} */
    this.eventListener;
  }

  loadFromSettings() {
    this.year = game.settings.get('deepnight', 'year');
    this.day = game.settings.get('deepnight', 'day');
    this.watch = game.settings.get('deepnight', 'watch');
    this.daysOnMission = game.settings.get('deepnight', 'daysOnMission');
    this.morale = game.settings.get('deepnight', 'morale');
    this.supplies = game.settings.get('deepnight', 'supplies');
    this.rareMaterials = game.settings.get('deepnight', 'rareMaterials');
    this.rareBiologicals = game.settings.get('deepnight', 'rareBiologicals');
    this.exoticMaterials = game.settings.get('deepnight', 'exoticMaterials');
    this.cfi = game.settings.get('deepnight', 'cfi');
    this.cei = game.settings.get('deepnight', 'cei');
    this.ceim = game.settings.get('deepnight', 'ceim');
    this.flight = game.settings.get('deepnight', 'flight');
    this.mission = game.settings.get('deepnight', 'mission');
    this.operations = game.settings.get('deepnight', 'operations');
    this.engineering = game.settings.get('deepnight', 'engineering');

    this.updatePanel();
  }

  saveDailySettings() {
    game.settings.set('deepnight', 'year', this.year);
    game.settings.set('deepnight', 'day', this.day);
    game.settings.set('deepnight', 'watch', this.watch);
    game.settings.set('deepnight', 'daysOnMission', this.daysOnMission);
    game.settings.set('deepnight', 'supplies', this.supplies);
  }

  saveSettings() {
    game.settings.set('deepnight', 'year', this.year);
    game.settings.set('deepnight', 'day', this.day);
    game.settings.set('deepnight', 'watch', this.watch);
    game.settings.set('deepnight', 'daysOnMission', this.daysOnMission);
    game.settings.set('deepnight', 'morale', this.morale);
    game.settings.set('deepnight', 'supplies', this.supplies);
    game.settings.set('deepnight', 'rareMaterials', this.rareMaterials);
    game.settings.set('deepnight', 'rareBiologicals', this.rareBiologicals);
    game.settings.set('deepnight', 'exoticMaterials', this.exoticMaterials);
    game.settings.set('deepnight', 'cfi', this.cfi);
    game.settings.set('deepnight', 'cei', this.cei);
    game.settings.set('deepnight', 'ceim', this.ceim);
    game.settings.set('deepnight', 'flight', this.flight);
    game.settings.set('deepnight', 'mission', this.mission);
    game.settings.set('deepnight', 'operations', this.operations);
    game.settings.set('deepnight', 'engineering', this.engineering);
  }

  async updatePanel() {
    const section = document.querySelector('section#deepnight');
    const role = game.user.isGM ? 'referee' : 'player';
    const status = await renderTemplate(`modules/deepnight/src/templates/${role}/sidebar-contents.hbs`, this.templateData());
    section.innerHTML = status;

    $('#dnr-jump').on('click', () => {
      this.jump();
    });
    $('#dnr-day').on('click', () => {
      this.dayPasses();
    });
    $('#dnr-watch').on('click', () => {
      this.watchPasses();
    });
    $('#dnr-save').on('click', () => {
      this.saveEdits();
    });
  }

  saveEdits() {
    this.cei = parseInt($('input#cei').val(), 10);
    this.ceim = parseInt($('input#ceim').val(), 10);
    this.mission.dei = parseInt($('input#mission-dei').val(), 10);
    this.mission.crew = parseInt($('input#mission-crew').val(), 10);
    this.operations.dei = parseInt($('input#operations-dei').val(), 10);
    this.operations.crew = parseInt($('input#operations-crew').val(), 10);
    this.engineering.dei = parseInt($('input#engineering-dei').val(), 10);
    this.engineering.crew = parseInt($('input#engineering-crew').val(), 10);
    this.flight.dei = parseInt($('input#flight-dei').val(), 10);
    this.flight.crew = parseInt($('input#flight-crew').val(), 10);
    this.saveSettings();
  }

  templateData() {
    return {
      year: this.year,
      day: this.day,
      watch: this.watch,
      daysOnMission: this.daysOnMission,
      morale: this.morale,
      cei: this.cei,
      ceim: this.ceim,
      supplies: this.supplies.toLocaleString(),
      rareMaterials: this.rareMaterials.toLocaleString(),
      exoticMaterials: this.exoticMaterials.toLocaleString(),
      rareBiologicals: this.rareBiologicals.toLocaleString(),
      mission: this.mission,
      flight: this.flight,
      operations: this.operations,
      engineering: this.engineering,
    }
  }

  incDay() {
    if (this.day === 365) {
      this.day = 1;
      this.year++;
    } else
      this.day++;
    this.daysOnMission++;
    this.supplies -= 1000;
  }

  incWatch() {
    if (this.watch === 3) {
      this.watch = 1;
      this.incDay();
    } else
      this.watch++;
  }

  async postTime() {
    const message = await renderTemplate('modules/deepnight/src/templates/timelog.hbs', this.templateData())
    console.log(message);

    let chatData = {
      user: game.userId,
      speaker: ChatMessage.getSpeaker(),
      content: message,
      whisper: []
    }
    console.log(chatData);
    ChatMessage.create(chatData, {});
  }

  async jump() {
    for (let i=0; i < 6; i++)
      this.incDay();
    this.incWatch();
    const roller = new Roll('4d2-4');
    await roller.evaluate({ async: true });
    let watches = roller.total;
    console.log(watches);
    for (let i=0; i < watches; i++)
      this.incWatch();
    this.postTime();
    this.saveDailySettings();
  }

  dayPasses() {
    this.incDay();
    this.saveDailySettings();
    this.postTime();
  }

  watchPasses() {
    this.incWatch();
    this.saveDailySettings();
    this.postTime();
  }
}
