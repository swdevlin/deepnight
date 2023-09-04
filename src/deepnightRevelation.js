import {RevelationConsole} from "./revelationConsole.js";

export class DeepnightRevelation extends Application {
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
      cei: 7,
      ceim: 0,
      dei: 0,
      crew: 0,
    };

    this.mission = {
      cei: 7,
      ceim: 0,
      dei: 0,
      crew: 0,
    };

    this.operations = {
      cei: 7,
      ceim: 0,
      dei: 0,
      crew: 0,
    };

    this.engineering = {
      cei: 7,
      ceim: 0,
      dei: 0,
      crew: 0,
    };

    /** @type {Event} */
    // this.eventListener;
  }

  displayConsole() {
    const console = new RevelationConsole(this);
    console.render(true);
  }

  templateData() {
    return {
      year: this.year,
      day: this.day,
      watch: this.watch,
      daysOnMission: this.daysOnMission,
      supplies: this.supplies.toLocaleString(),
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
    this.logTime();
  }

  async logTime() {
    console.log(this.year, this.day, this.watch, this.daysOnMission);
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
  }

  dayPasses() {
    this.incDay();
    this.postTime();
  }

  incWatch() {
    if (this.watch === 3) {
      this.watch = 1;
      this.incDay();
    } else
      this.watch++;
    this.logTime();
  }

  watchPasses() {
    this.incWatch();
    this.postTime();
  }
}
