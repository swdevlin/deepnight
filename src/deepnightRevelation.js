import {
  CEIRollModifiers,
  ceiTaskDM,
  computeDM,
  Difficulties,
  FatigueLevels,
  RollTypes
} from "./helpers.js";
import {HistoryDialog} from "./historyDialog.js";

export class DeepnightRevelation extends Application {
  static ID = 'deepnight';

  constructor(src, options = {}) {
    super(src, options);
    this.status = {
      year: 1105,
      day: 17,
      watch: 1,
      daysOnMission: 0,
      morale: 0,
      supplies: 200000,
      rareMaterials: 0,
      rareBiologicals: 0,
      exoticMaterials: 0,
      fatigue: 'not',
      cfi: 0,
      cei: 7,
      ceim: 0,
      flight: {dei: 0, crew: 0,},
      mission: {dei: 0, crew: 0,},
      operations: {dei: 0, crew: 0,},
      engineering: {dei: 0, crew: 0,},
    };
    this.history = [];
    this.command = {
      missionCommander: null,
      captain: null,
      xo: null,
      chiefMissionOfficer: null,
      chiefOperationsOfficer: null,
      chiefFlightOfficer: null,
      chiefEngineeringOfficer: null,
    }

    /** @type {Event} */
    // this.eventListener;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "deepnight",
      template: 'modules/deepnight/src/templates/deepnight.hbs',
      minimizable: true,
      resizable: false,
      width: 750,
      height: 710,
      title: "Deepnight Revelation"
    })
  }

  redraw(force) {
    this.render(force)
  }

  getData() {
    return mergeObject(this.templateData(), {
      is_gm: game.user.isGM,
    })
  }


  activateListeners(html) {
    super.activateListeners(html)

    html.on('click', '#dnr-jump', (event) => {
      this.jump();
    });

    html.on('click', '#dnr-refuel', (event) => {
      this.refuel();
    });

    html.on('click', '#dnr-reset', (event) => {
      this.reset();
    });

    html.on('click', '#dnr-day', (event) => {
      this.dayPasses();
    });

    html.on('click', '#dnr-watch', (event) => {
      this.watchPasses();
    });

    html.on('click', '#dnr-save', (event) => {
      this.saveEdits();
    });

    html.on('click', '.dei-check', (evt) => {
      if (!evt.target.className.includes('dnr-valueinput') )
        this.deiCheck(evt);
    });

    html.on('click', '.cei-check', (evt) => {
      if (!evt.target.className.includes('dnr-valueinput') )
        this.ceiCheck(evt);
    });

    html.on('click', '#ceim-interval', (evt) => {
      this.setCEIMInterval();
    });

    html.on('click', '#cei-interval', (evt) => {
      this.setCEIInterval();
    });

    html.on('click', '#cfi-interval', (evt) => {
      this.setCFIInterval();
    });

    html.on('click', '#history', (evt) => {
      this.showHistory();
    });

  }

  async showHistory() {
    if (!window.deepnightHistory)
      window.deepnightHistory = new HistoryDialog().render(true);
    window.deepnightHistory.render(true);
  }

  async loadFromSettings() {
    this.status = await game.settings.get('deepnight', 'status');
    this.history = await game.settings.get('deepnight', 'history');
  }

  get year() { return this.status.year; }
  set year(y) { this.status.year = y; }

  get day() { return this.status.day; }
  set day(d) { this.status.day = d; }

  get watch() { return this.status.watch; }
  set watch(w) { this.status.watch = w; }

  get daysOnMission() { return this.status.daysOnMission; }
  set daysOnMission(d) { this.status.daysOnMission = d; }

  get morale() { return this.status.morale; }
  set morale(m) { this.status.morale = m; }

  get supplies() { return this.status.supplies; }
  set supplies(s) { this.status.supplies = s; }

  get rareMaterials() { return this.status.rareMaterials; }
  set rareMaterials(r) { this.status.rareMaterials = r; }

  get rareBiologicals() { return this.status.rareBiologicals; }
  set rareBiologicals(r) { this.status.rareBiologicals = r; }

  get exoticMaterials() { return this.status.exoticMaterials; }
  set exoticMaterials(e) { this.status.exoticMaterials = e; }

  get cfi() { return this.status.cfi; }
  set cfi(c) { this.status.cfi = c; }

  get cei() { return this.status.cei; }
  set cei(c) { this.status.cei = c; }

  get ceim() { return this.status.ceim; }
  set ceim(c) { this.status.ceim = c; }

  get flight() { return this.status.flight; }
  set flight(f) { this.status.flight = f; }

  get mission() { return this.status.mission; }
  set mission(m) { this.status.mission = m; }

  get operations() { return this.status.operations; }
  set operations(o) { this.status.operations = o; }

  get engineering() { return this.status.engineering; }
  set engineering(e) { this.status.engineering = e; }

  get fatigue() { return this.status.fatigue; }
  set fatigue(f) { this.status.fatigue = f; }

  get ceiInterval() { return this.status.ceiInterval; }
  set ceiInterval(i) { this.status.ceiInterval = i; }

  get ceimInterval() { return this.status.ceimInterval; }
  set ceimInterval(i) { this.status.ceimInterval = i; }

  get cfiInterval() { return this.status.cfiInterval; }
  set cfiInterval(i) { this.status.cfiInterval = i; }

  async saveHistory() {
    this.history.unshift([
      this.year,
      this.day,
      this.watch,
      this.daysOnMission,
      this.morale,
      this.supplies,
      this.rareMaterials,
      this.rareBiologicals,
      this.exoticMaterials,
      this.cfi,
      this.cei,
      this.ceim,
      this.flight.dei,
      this.flight.crew,
      this.mission.dei,
      this.mission.crew,
      this.operations.dei,
      this.operations.crew,
      this.engineering.dei,
      this.engineering.crew,
      this.fatigue,
      this.ceiInterval,
      this.ceimInterval,
      this.cfiInterval,
    ]);
    await game.settings.set('deepnight', 'history', this.history);
  }

  async saveSettings() {
    await game.settings.set('deepnight', 'status', this.status);
    await this.saveHistory();
  }

  async deiCheckResult(dei, difficulty, rollType, otherDM, rollMode, label, fatigue, flags) {
    let dice = RollTypes[rollType].dice;
    dice += `+ ${otherDM}`;
    dice += `+ ${ceiTaskDM(dei + this.ceim)}`;
    dice += `+ ${Difficulties[difficulty].mod}`;
    dice += `+ ${FatigueLevels[fatigue].dm}`;
    for (const id of Object.keys(flags))
      dice += `+ ${flags[id]}`
    let roller = new Roll(dice);
    await roller.evaluate({async: true});
    const table = await fromUuid('Compendium.deepnight.ei-resolution.OikUX6mMMn4RPsRA');
    const tableLookup = await table.roll({roll: roller});
    roller = tableLookup.roll;

    const resultFlags = [];
    for (const ceiMod of CEIRollModifiers)
      if (ceiMod.id in flags)
        resultFlags.push(ceiMod);

    const diceRolled = [];
    for (const r of roller.terms[0].results)
      if (r.active)
        diceRolled.push(r.result);
    const data = {
      difficulty: Difficulties[difficulty],
      label: label,
      total: roller.total,
      rollType: rollType,
      formula: dice,
      dice: RollTypes[rollType].dice,
      diceRolled: diceRolled,
      dei: dei,
      otherDM: otherDM,
      ceim: this.ceim,
      ceiDM: ceiTaskDM(dei + this.ceim),
      resolution: tableLookup.results[0].text,
      result: roller.result,
      flags: resultFlags,
      fatigue: FatigueLevels[fatigue]
    };
    const message = await renderTemplate('modules/deepnight/src/templates/eicheck.hbs', data)

    if (rollMode === "gm")
      rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
    else if (rollMode === "blind")
      rollMode = CONST.DICE_ROLL_MODES.BLIND;
    else if (rollMode === "self")
      rollMode = CONST.DICE_ROLL_MODES.SELF;
    else
      rollMode = CONST.DICE_ROLL_MODES.PUBLIC;

    await roller.toMessage(
      {
        flavor: message,
        rollMode: rollMode,
        flags: {
          "core.canPopout": true,
        }
      },
      {
        rollMode: rollMode,
      }
    );
  }

  async deiCheck(evt) {
    const label = evt.currentTarget.dataset.label;
    const dei = parseInt(evt.currentTarget.dataset.dei, 10);

    const data = {
      difficulties: Difficulties,
      dei: dei,
      difficulty: "Average",
      rollType: "normal",
      rollMode: "public",
      ceiModifiers: CEIRollModifiers,
      fatigueLevels: FatigueLevels,
      fatigue: this.fatigue,
    };
    const dialogContent = await renderTemplate('modules/deepnight/src/templates/eiCheckDialog.hbs', data);

    const dialogOptions = {
      title: label,
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fa-solid fa-dice"></i>',
          label: "Roll",
          callback: () => {
            const difficulty = document.getElementById("difficulty").value;
            let otherDM = parseInt(document.getElementById("otherDM").value, 10);
            if (isNaN(otherDM))
              otherDM = 0;
            const rollType = document.getElementById("rollType").value;
            const rollMode = document.getElementById("rollMode").value;
            const fatigue = document.getElementById("fatigue").value;
            const flags = {};
            for (const key of CEIRollModifiers)
              if (document.getElementById(`cei.${key.id}`).checked)
                flags[key.id] = key.dm;
            this.deiCheckResult(dei, difficulty, rollType, otherDM, rollMode, label, fatigue, flags);
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

  async ceiCheck(evt) {
    const label = evt.currentTarget.dataset.label;
    const dei = parseInt(evt.currentTarget.dataset.cei, 10);

    const data = {
      difficulties: Difficulties,
      dei: dei,
      difficulty: "Average",
      rollType: "normal",
      rollMode: "public",
      ceiModifiers: CEIRollModifiers,
      fatigueLevels: FatigueLevels,
      fatigue: this.fatigue,
    };
    const dialogContent = await renderTemplate('modules/deepnight/src/templates/eiCheckDialog.hbs', data)

    const dialogOptions = {
      title: label,
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fa-solid fa-dice"></i>',
          label: "Roll",
          callback: () => {
            const difficulty = document.getElementById("difficulty").value;
            let otherDM = parseInt(document.getElementById("otherDM").value, 10);
            if (isNaN(otherDM))
              otherDM = 0;
            const rollType = document.getElementById("rollType").value;
            const rollMode = document.getElementById("rollMode").value;
            const fatigue = document.getElementById("fatigue").value;
            const flags = {};
            for (const key of CEIRollModifiers)
              if (document.getElementById(`cei.${key.id}`).checked)
                flags[key.id] = key.dm;
            this.deiCheckResult(dei, difficulty, rollType, otherDM, rollMode, label, fatigue, flags);
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

  async setCEIMInterval() {
    const ceimIntervalRoll = await game.settings.get('deepnight', 'ceimInterval');
    const roller = new Roll(ceimIntervalRoll);
    await roller.evaluate({ async: true });
    this.ceimInterval = roller.total;
    this.redraw();
  }

  async setCEIInterval() {
    const ceiIntervalRoll = await game.settings.get('deepnight', 'ceiInterval');
    const roller = new Roll(ceiIntervalRoll);
    await roller.evaluate({ async: true });
    this.ceiInterval = roller.total;
    this.redraw();
  }

  async setCFIInterval() {
    const cfiIntervalRoll = await game.settings.get('deepnight', 'cfiInterval');
    const roller = new Roll(cfiIntervalRoll);
    await roller.evaluate({ async: true });
    this.cfiInterval = roller.total;
    this.redraw();
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
    this.morale = parseInt($('input#morale').val(), 10);
    this.fatigue = $('#dnr-fatigue').val();
    this.supplies = parseInt($('#supplies').val(), 10);
    this.exoticMaterials = parseInt($('#exoticMaterials').val(), 10);
    this.rareMaterials = parseInt($('#rareMaterials').val(), 10);
    this.rareBiologicals = parseInt($('#rareBiologicals').val(), 10);
    this.saveSettings();
  }

  templateData() {
    const data = {
      year: this.year,
      day: this.day,
      watch: this.watch,
      daysOnMission: this.daysOnMission,
      morale: this.morale,
      cei: this.cei,
      cfi: this.cfi,
      ceim: this.ceim,
      supplies: game.user.isGM ? this.supplies : this.supplies.toLocaleString(),
      rareMaterials: game.user.isGM ? this.rareMaterials : this.rareMaterials.toLocaleString(),
      exoticMaterials: game.user.isGM ? this.exoticMaterials : this.exoticMaterials.toLocaleString(),
      rareBiologicals: game.user.isGM ? this.rareBiologicals : this.rareBiologicals.toLocaleString(),
      mission: {...this.mission },
      flight: {...this.flight},
      operations: {...this.operations},
      engineering: {...this.engineering},
      fatigue: this.fatigue,
      fatigueLevels: FatigueLevels,
      ceiInterval: this.ceiInterval,
      ceimInterval: this.ceimInterval,
      cfiInterval: this.cfiInterval,
    };

    data.mission.deiDM = computeDM(data.mission.dei);
    data.flight.deiDM = computeDM(data.flight.dei);
    data.operations.deiDM = computeDM(data.operations.dei);
    data.engineering.deiDM = computeDM(data.engineering.dei);

    return data;
  }

  async sendCEIMessage() {
    const time = game.settings.get('deepnight', 'ceiTraining');
    const data = this.templateData();
    data.message = `CEI can be improved by spending ${time} days.`;
    const message = await renderTemplate('modules/deepnight/src/templates/timelog.hbs', data)

    let chatData = {
      user: game.userId,
      speaker: ChatMessage.getSpeaker(),
      content: message,
      whisper: []
    }
    ChatMessage.create(chatData, {});
  }

  async sendCEIMMessage() {
    const data = this.templateData();
    data.message = `It is time for a CEIM check.`;
    const message = await renderTemplate('modules/deepnight/src/templates/timelog.hbs', data)

    let chatData = {
      user: game.userId,
      speaker: ChatMessage.getSpeaker(),
      content: message,
      whisper: []
    }
    ChatMessage.create(chatData, {});
  }

  async sendCFIMessage() {
    this.cfi += 1;
    const data = this.templateData();
    data.message = `CFI has increased by 1. Roll against CFI of ${this.cfi} to see if overall fatigue increases.`;
    const message = await renderTemplate('modules/deepnight/src/templates/timelog.hbs', data)

    let chatData = {
      user: game.userId,
      speaker: ChatMessage.getSpeaker(),
      content: message,
      whisper: []
    }
    ChatMessage.create(chatData, {});
  }

  incDay() {
    if (this.day === 365) {
      this.day = 1;
      this.year++;
    } else
      this.day++;
    this.daysOnMission++;
    if (this.ceimInterval > 0) {
      this.ceimInterval -= 1;
      if (this.ceimInterval === 0)
        this.sendCEIMMessage();
    }
    if (this.ceiInterval > 0) {
      this.ceiInterval -= 1;
      if (this.ceiInterval === 0)
        this.sendCEIMessage();
    }
    if (this.cfiInterval > 0) {
      this.cfiInterval -= 1;
      if (this.cfiInterval === 0)
        this.sendCFIMessage();
    }
    this.supplies -= game.settings.get('deepnight', 'suppliesPerDay');
  }

  incWatch() {
    let dayChanged = false;
    if (this.watch === 3) {
      this.watch = 1;
      this.incDay();
      dayChanged = true;
    } else
      this.watch++;
    return dayChanged;
  }

  async postTime(msg) {
    const data = this.templateData();
    data.message = msg;
    const message = await renderTemplate('modules/deepnight/src/templates/timelog.hbs', data)

    let chatData = {
      user: game.userId,
      speaker: ChatMessage.getSpeaker(),
      content: message,
      whisper: []
    }
    ChatMessage.create(chatData, {});
  }

  async jump() {
    for (let i=0; i < 6; i++)
      this.incDay();
    this.incWatch();
    const roller = new Roll('4d2-4');
    await roller.evaluate({ async: true });
    let watches = roller.total;
    for (let i=0; i < watches; i++)
      this.incWatch();
    await this.postTime('Jump completed.');
    await this.saveSettings();
  }

  fuelTime = () => {
    let days = 0;
    let watches = 0;

    const parts = game.settings.get('deepnight', 'refuelTime').split(' ');

    parts.forEach((part) => {
      const number = parseInt(part);
      const unit = part.slice(-1).toLowerCase(); // Convert unit to lowercase

      if (unit === 'd') {
        days += number;
      } else if (unit === 'w') {
        watches += number;
      }
    });

    return { days, watches };
  };

  async refuel() {
    const time = this.fuelTime();
    for (let i=0; i<time.days; i++);
      this.incDay();
    for (let i=0; i<time.watches; i++);
      this.incWatch();
    await this.saveSettings();
    await this.postTime('Deepnight Revelation has been refueled');
  }

  async reset() {
    this.year = 1105;
    this.day = 1 ;
    this.watch = 1 ;
    this.daysOnMission = 0 ;
    this.morale = 0 ;
    this.supplies = 200000 ;
    this.rareMaterials = 0 ;
    this.rareBiologicals = 0 ;
    this.exoticMaterials = 0 ;
    this.cfi = 0 ;
    this.fatigue = 'not';
    await this.saveSettings();
    await this.postTime('Reset');
  }

  async dayPasses() {
    this.incDay();
    await this.saveSettings();
    await this.postTime();
  }

  async watchPasses() {
    const dayChanged = this.incWatch();
    await this.saveSettings();
    if (dayChanged)
      await this.postTime();
  }
}
