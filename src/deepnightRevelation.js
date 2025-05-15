import {
  CEIRollModifiers,
  ceiTaskDM,
  computeDM,
  Difficulties,
  FatigueLevels,
  RollTypes, statusToLog
} from "./helpers.js";
import {maintenanceLookup} from "./maintenanceLookup.js";
import {HistoryDialog} from "./historyDialog.js";
import {RouteDialog} from "./routeDialog.js";
import {DamageSystemsDialog} from "./damageSystemsDialog.js";

export class DeepnightRevelation extends Application {
  static ID = 'deepnight';

  constructor(src, options = {}) {
    super(src, options);
    this.maxCargoSpace = 0;
    this.cargoSpaceUsed = 0;
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
      cfiInterval: 0,
      ceiInterval: 0,
      ceimInterval: 0,
      supplyUnitsPerDay: 1000,
      damagedSystems: []
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
    };
    this.sectors = [];
    this.route = [];
    this.fetchSectors();
    this.fetchRoute();
  }

  async fetchRoute() {
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
      console.error("Error fetching route:", error);
      ui.notifications.error(`Call to fetch route failed: ${error.message}`);
    }
  }

  currentSector() {
    if (this.route.length === 0) {
      return null;
    }

    const currentRoute = this.route[0];
    return this.sectors.find(sector =>
      sector.x === currentRoute.sector_x &&
      sector.y === currentRoute.sector_y
    );
  }

  currentHex() {
    if (this.route.length === 0) {
      return null;
    }

    const { hex_x, hex_y } = this.route[0];
    return (hex_x < 10 ? '0' + hex_x : hex_x) + '' + (hex_y < 10 ? '0' + hex_y : hex_y);
  }

  async fetchSectors() {
    try {
      const response = await fetch("https://radiofreewaba.net/deepnight/data/sectors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.sectors = (await response.json()).sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
      console.error("Error making REST call:", error);
      ui.notifications.error(`Call to fetch sectors Failed: ${error.message}`);
    }

  }
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "deepnight",
      template: 'modules/deepnight/src/templates/deepnight.hbs',
      minimizable: true,
      resizable: false,
      width: 750,
      height: 730,
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

    html.on('click', '#dnr-jump', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.jump();
    });

    html.on('click', '#dnr-reach', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.reach();
    });

    html.on('click', '#dnr-refuel', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.refuel();
    });

    html.on('click', '#dnr-reset', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.reset();
    });

    html.on('click', '#dnr-ceimChangeCheck', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.ceimChangeCheck();
    });

    html.on('click', '#dnr-fatigueChangeCheck', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.fatigueChangeCheck(true);
    });

    html.on('click', '#dnr-day', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.dayPasses();
    });

    html.on('click', '#dnr-watch', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.watchPasses();
    });

    html.on('click', '#dnr-save', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.saveEdits();
    });

    html.on('click', '.dei-check', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();

      if (!evt.target.className.includes('dnr-valueinput') )
        if (evt.target.className.includes('fa-up-down') || evt.target.className.includes('improvement-check'))
          this.deiImprovementCheck(evt);
        else if (evt.target.className.includes('fa-dice-d6') || evt.target.className.includes('effect-check'))
          this.deiEffectCheck(evt);
        else
          this.deiCheck(evt);
    });

    html.on('click', '.cei-check', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      if (!evt.target.className.includes('dnr-valueinput') )
        this.ceiCheck(evt);
    });

    html.on('click', '#ceim-interval', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.setCEIMInterval();
    });

    html.on('click', '#cei-interval', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.setCEIInterval();
    });

    html.on('click', '#cfi-interval', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.setCFIInterval();
    });

    html.on('click', '#history', async (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      await this.showHistory();
    });

    html.on('click', '#damagedSystems', async (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      await this.showDamagedSystems();
    });

    html.on('click', '#dnr-maintenance', async (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      await this.maintenanceCheck();
    });

    html.on('click', '#dnr-route', async (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      await this.showRoute();
    });

  }

  async showHistory() {
    if (!window.deepnightHistory)
      window.deepnightHistory = new HistoryDialog().render(true);
    window.deepnightHistory.render(true);
  }

  async showRoute() {
    if (!window.routeHistory)
      window.routeHistory = new RouteDialog().render(true);
    window.routeHistory.render(true);
  }

  async showDamagedSystems() {
    if (!window.deepnightDamagedSystemsDialog)
      window.deepnightDamagedSystemsDialog = new DamageSystemsDialog().render(true);
    else
      window.deepnightDamagedSystemsDialog.render(true);
  }

  async loadFromSettings() {
    this.status = await game.settings.get('deepnight', 'status');
    if (this.status.damagedSystems === undefined)
      this.status.damagedSystems = [];
    this.history = await game.settings.get('deepnight', 'history');
    await this.updateCargo();
  }

  get damagedSystems() { return this.status.damagedSystems; }

  get supplyUnitsPerDay() { return this.status.supplyUnitsPerDay; }
  set supplyUnitsPerDay(u) { this.status.supplyUnitsPerDay = u; }

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
    this.history.unshift(statusToLog(this.status));
    await game.settings.set('deepnight', 'history', this.history);
  }

  async updateCargo() {
    const space = await game.settings.get('deepnight', 'suCargoSpace');
    const storage = await game.settings.get('deepnight', 'suStorage');
    this.maxCargoSpace = await game.settings.get('deepnight', 'maxCargoSpace');

    let cargo = 0;
    cargo += (this.rareMaterials + this.rareBiologicals + this.exoticMaterials) / space;
    if (this.supplies > storage)
      cargo += (this.supplies - storage) / space;
    this.cargoSpaceUsed = Math.ceil(cargo);
  }

  async saveSettings() {
    await game.settings.set('deepnight', 'status', this.status);
    await this.saveHistory();
    await this.updateCargo();
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

  async deiEffectCheckResult(dei, difficulty, rollType, otherDM, rollMode, label, fatigue, flags) {
    let dice = RollTypes[rollType].dice;
    dice += `+ ${otherDM}`;
    dice += `+ ${ceiTaskDM(dei + this.ceim)}`;
    dice += `+ ${Difficulties[difficulty].mod}`;
    dice += `+ ${FatigueLevels[fatigue].dm}`;
    for (const id of Object.keys(flags))
      dice += `+ ${flags[id]}`
    let roller = new Roll(dice);
    await roller.evaluate({async: true});

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
      resolution: `Effect ${roller.total - 8}`,
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
      title: `${label}`,
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

  async deiEffectCheck(evt) {
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
      title: `${label}`,
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
            this.deiEffectCheckResult(dei, difficulty, rollType, otherDM, rollMode, label, fatigue, flags);
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

  async ceimChangeResult(leadershipEffect) {
    let dice = `2d6 + ${leadershipEffect}`;
    let roller = new Roll(dice);
    await roller.evaluate({async: true});
    const table = await fromUuid('Compendium.deepnight.ceim-changes.RollTable.mk8uoMv8lw617QI3');
    const tableLookup = await table.roll({roll: roller});
    roller = tableLookup.roll;

    const diceRolled = [];
    for (const r of roller.terms[0].results)
      if (r.active)
        diceRolled.push(r.result);
    const data = {
      label: 'CEIM Change Check',
      leadershipEffect: leadershipEffect,
      total: roller.total,
      formula: dice,
      diceRolled: diceRolled,
      resolution: tableLookup.results[0].text,
      result: roller.result,
    };
    const message = await renderTemplate('modules/deepnight/src/templates/ceimChangeMessage.hbs', data)

    const rollMode = CONST.DICE_ROLL_MODES.PUBLIC;

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

  async ceimChangeCheck() {
    const data = {
      leadershipEffect: 0,
    };
    const dialogContent = await renderTemplate('modules/deepnight/src/templates/ceimChangeDialog.hbs', data);

    const dialogOptions = {
      title: 'CEIM Change Check',
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fa-solid fa-dice"></i>',
          label: "Roll",
          callback: () => {
            let leadershipDM = parseInt(document.getElementById("leadershipEffect").value, 10);
            if (isNaN(leadershipDM))
              leadershipDM = 0;
            this.ceimChangeResult(leadershipDM);
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

  async deiImprovementResult(label, division, leadershipEffect) {
    let dice = `2d6 + ${leadershipEffect}`;
    let roller = new Roll(dice);
    await roller.evaluate({async: true});

    let m;
    if (roller.total > this[division].dei) {
      this[division].dei += 1;
      this.saveSettings();
      m = `${label} DEI increased to ${this[division].dei}`
    } else
      m = `No increase in ${label} DEI`;

    const diceRolled = [];
    for (const r of roller.terms[0].results)
      if (r.active)
        diceRolled.push(r.result);

    const data = {
      label: `${label} DEI Improvement Check`,
      leadershipEffect: leadershipEffect,
      total: roller.total,
      formula: dice,
      diceRolled: diceRolled,
      resolution: m,
      result: roller.result,
      year: this.year,
      day: this.day,
      daysOnMission: this.daysOnMission
    };
    const message = await renderTemplate('modules/deepnight/src/templates/deiImprovementMessage.hbs', data)

    const rollMode = CONST.DICE_ROLL_MODES.PUBLIC;

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

  async deiImprovementCheck(evt) {
    const label = evt.currentTarget.dataset.label;
    const division = label.toLowerCase();
    const data = {
      leadershipEffect: 0,
    };
    const dialogContent = await renderTemplate('modules/deepnight/src/templates/ceimChangeDialog.hbs', data);

    const dialogOptions = {
      title: `${label} DEI Improvement Check`,
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fa-solid fa-dice"></i>',
          label: "Roll",
          callback: async () => {
            let leadershipDM = parseInt(document.getElementById("leadershipEffect").value, 10);
            if (isNaN(leadershipDM))
              leadershipDM = 0;
            await this.deiImprovementResult(label, division, leadershipDM);
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

  async increaseFatigue() {
    if (this.fatigue === 'not')
      this.fatigue = 'fatigued';
    else if (this.fatigue === 'fatigued')
      this.fatigue = 'highly';
    else if (this.fatigue === 'highly') {
      this.fatigue = 'dangerously';
      this.morale -= 1;
    } else if (this.fatigue === 'dangerously') {
      this.fatigue = 'exhausted';
      let roller = new Roll('1d3');
      await roller.evaluate({async: true});
      this.morale -= roller.total;
    } else if (this.fatigue === 'exhausted') {
      this.fatigue = 'incapable';
      let roller = new Roll('1d5');
      await roller.evaluate({async: true});
      this.morale -= roller.total;
    }
  }

  async fatigueChangeCheck(save) {
    let dice = '2d6';
    let roller = new Roll(dice);
    await roller.evaluate({async: true});
    let m;
    if (roller.total >= this.cfi) {
      m = 'No change to fatigue';
    } else {
      if (this.fatigue !== 'incapable') {
        await this.increaseFatigue();
        if (save)
          await this.saveSettings();
        m = game.i18n.localize('DEEPNIGHT.Messages.FatigueIncrease');
        m = m.replace('${label}', FatigueLevels[this.fatigue].label);
        m = m.replace('${dm}', FatigueLevels[this.fatigue].dm);
      } else
        m = 'Fatigue is already at maximum';
    }
    const data = this.templateData();
    data.message = m;
    const message = await renderTemplate('modules/deepnight/src/templates/messages/timelog.hbs', data)

    let chatData = {
      user: game.userId,
      speaker: ChatMessage.getSpeaker(),
      content: message,
      whisper: []
    }
    ChatMessage.create(chatData, {});
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

  async calcCFIInterval() {
    const cfiIntervalRoll = await game.settings.get('deepnight', 'cfiInterval');
    const roller = new Roll(cfiIntervalRoll);
    await roller.evaluate({ async: true });
    this.cfiInterval = roller.total;
  }

  async setCFIInterval() {
    await this.calcCFIInterval();
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
    this.ceimInterval = parseInt($('#ceimInterval').val(), 10);
    this.ceiInterval = parseInt($('#ceiInterval').val(), 10);
    this.cfiInterval = parseInt($('#cfiInterval').val(), 10);
    this.cfi = parseInt($('#cfi').val(), 10);
    this.supplyUnitsPerDay = parseInt($('#supplyUnitsPerDay').val(), 10);
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
      supplyUnitsPerDay: this.supplyUnitsPerDay,
      damagedSystems: this.damagedSystems,
      maxCargoSpace: this.maxCargoSpace,
      cargoSpaceUsed: this.cargoSpaceUsed,
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
    const m = game.i18n.localize('DEEPNIGHT.Messages.CEIImprovement');
    data.message = m.replace('${time}', time);
    const message = await renderTemplate('modules/deepnight/src/templates/messages/timelog.hbs', data)

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
    data.message = game.i18n.localize('DEEPNIGHT.Messages.CEIMCheck');
    const message = await renderTemplate('modules/deepnight/src/templates/messages/timelog.hbs', data)

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
    const m = game.i18n.localize('DEEPNIGHT.Messages.CFIIncrease');
    data.message = m.replace('${cfi}', this.cfi);
    const message = await renderTemplate('modules/deepnight/src/templates/messages/timelog.hbs', data)

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
    this.supplies -= this.supplyUnitsPerDay;
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

  async postTime(msg, initialDays) {
    const data = this.templateData();
    data.message = msg;
    data.hasLapsedDays = initialDays !== undefined;
    if (initialDays)
      data.lapsedDays = this.year * 365 + this.day - initialDays;
    const message = await renderTemplate('modules/deepnight/src/templates/messages/timelog.hbs', data);

    let chatData = {
      user: game.userId,
      speaker: ChatMessage.getSpeaker(),
      content: message,
      whisper: []
    }
    ChatMessage.create(chatData, {});
  }

  async doTheJump(save=true) {
    for (let i=0; i < 6; i++)
      this.incDay();
    this.incWatch();
    const roller = new Roll('4d2-4');
    await roller.evaluate({ async: true });
    let watches = roller.total;
    for (let i=0; i < watches; i++)
      this.incWatch();
    if (save) {
      await this.postTime(game.i18n.localize('DEEPNIGHT.JumpCompleted'));
      await this.saveSettings();
    }
  }

  async updateRoute(sectorId, jumpHex) {
    const hexX = parseInt(jumpHex.slice(0, -2));
    const hexY = parseInt(jumpHex.slice(-2));
    const sector = this.sectors.find(s => s.id === sectorId);

    const url = 'https://radiofreewaba.net/deepnight/data/route';
    const data = {
      sector_x: sector.x,
      sector_y: sector.y,
      year: this.year,
      day: this.day,
      ship_id: 1,
      hex_x: hexX,
      hex_y: hexY,
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update route:', error);
      ui.notifications.error(`Failed to update route: ${error.message}`);
    }
  }

  async jump(save=true) {
    const dialogData = {
      sectors: this.sectors,
      currentSectorId: this.currentSector() ? this.currentSector().id : 0,
      jumpHex: this.currentHex()
    };

    const content = await renderTemplate("modules/deepnight/src/templates/jumpDialog.hbs", dialogData);

    new Dialog({
      title: "Jump",
      content: content,
      buttons: {
        yes: {
          icon: '<i class="fas fa-check"></i>',
          label: "Jump",
          callback: async (html) => {
            const sectorId = parseInt(html.find('#sector').val());
            const jumpHex = html.find('#jumpHex').val();
            await this.doTheJump(save);
            await this.updateRoute(sectorId, jumpHex);
            await this.fetchRoute();
          }
        },
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => {}
        }
      },
      default: "yes"
    }).render(true);
  }

  async resolveReach({jumps, supplyUnitsPerDay}) {
    const startDays = this.year * 365 + this.day;
    this.supplyUnitsPerDay = supplyUnitsPerDay;
    for (let i = 0; i < jumps; i++) {
      await this.jump(false);
      if (i < jumps -1) {
        await this.refuel(false);
        await this.systemScan(true, false);
      }
    }

    let lapsedDays = this.year * 365 + this.day - startDays;
    while (lapsedDays > 0) {
      if (lapsedDays >= this.cfiInterval) {
        lapsedDays -= this.cfiInterval;
        this.cfi++;
        await this.fatigueChangeCheck();
        await this.calcCFIInterval();
      } else {
        this.cfiInterval -= lapsedDays;
        lapsedDays = 0;
      }
    }

    await this.saveSettings();
    await this.postTime(game.i18n.localize('DEEPNIGHT.ReachTransitCompleted'), startDays);
  }

  async reach() {
    const data = {
      reachSupplyUnits: this.supplyUnitsPerDay,
      jumps: await game.settings.get('deepnight', 'reachJumps'),
    };
    const dialogContent = await renderTemplate('modules/deepnight/src/templates/reachDialog.hbs', data);

    const dialogOptions = {
      title: game.i18n.localize('DEEPNIGHT.ReachTransitDialogTitle'),
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fa-solid fa-map"></i>',
          label: "Transit",
          callback: async () => {
            let supplyUnits = parseInt(document.getElementById("reachSupplyUnits").value, 10);
            let jumps = parseInt(document.getElementById("reachJumps").value, 10);
            await this.resolveReach({supplyUnitsPerDay: supplyUnits, jumps: jumps});
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

  async resolveMaintenanceCheck({yearsDM, hullDM, otherDM, substandardMaintenance, veryLittleMaintenance, noOverhaul}) {
    let dice = `2d6 + ${yearsDM} + ${hullDM} + ${otherDM}`;
    if (substandardMaintenance)
      dice += ' +2';
    if (veryLittleMaintenance)
      dice += ' +4';
    if (noOverhaul)
      dice += ' +2';
    let roller = new Roll(dice);
    await roller.evaluate({async: true});
    const results = await maintenanceLookup(roller.total);
    if (results.length > 0) {
      this.status.damagedSystems.push(...results);
      this.saveSettings();
    }
  }

  async maintenanceCheck() {
    const data = {
      yearsInVoyage: Math.floor(this.daysOnMission / 365),
      hullDamage: 0,
    };
    const dialogContent = await renderTemplate('modules/deepnight/src/templates/maintenanceDialog.hbs', data);

    const dialogOptions = {
      title: game.i18n.localize('DEEPNIGHT.ReachMaintenanceCheckTitle'),
      content: dialogContent,
      buttons: {
        ok: {
          icon: '<i class="fa-light fa-screwdriver-wrench"></i>',
          label: "Check",
          callback: async () => {
            const maintenanceData = {
              // maintenanceEffect: parseInt(document.getElementById("maintenanceEffect").value, 10),
              yearsDM: parseInt(document.getElementById("yearsDM").value, 10) || 0,
              hullDM: parseInt(document.getElementById("hullDM").value, 10) || 0,
              otherDM: parseInt(document.getElementById("otherDM").value, 10) || 0,
              substandardMaintenance: document.getElementById('substandardMaintenance').checked,
              veryLittleMaintenance: document.getElementById('veryLittleMaintenance').checked,
              noOverhaul: document.getElementById('noOverhaul').checked,
            };
            await this.resolveMaintenanceCheck(maintenanceData);
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

  async refuel(save=true) {
    const time = this.fuelTime();
    for (let i=0; i < time.days; i++)
      this.incDay();
    for (let i=0; i < time.watches; i++)
      this.incWatch();
    if (save) {
      await this.saveSettings();
      await this.postTime(game.i18n.localize('DEEPNIGHT.HasBeenRefueled'));
    }
  }

  async systemScan(whileRefueling=true, save=true) {
    const roller = whileRefueling ? new Roll('3d2-2') : new Roll('3d2+2');
    await roller.evaluate({ async: true });
    for (let i=0; i < roller.total; i++)
      this.incWatch();
    if (save) {
      await this.saveSettings();
      await this.postTime(game.i18n.localize('DEEPNIGHT.NextSystemsScanned'));
    }
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
