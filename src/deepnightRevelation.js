import {RevelationConsole} from "./revelationConsole.js";
import {
  CEIRollModifiers,
  ceiTaskDM,
  computeDM,
  Difficulties,
  effect,
  FatigueLevels,
  RollTypes
} from "./helpers.js";

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

  saveHistory() {
    this.history.push([
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
    ]);
    game.settings.set('deepnight', 'history', this.history);
  }

  saveDailySettings() {
    game.settings.set('deepnight', {
      'year': this.year,
      'day': this.day,
      'watch': this.watch,
      'daysOnMission': this.daysOnMission,
      'supplies': this.supplies,
    });
    this.saveHistory();
  }

  saveSettings() {
    game.settings.set('deepnight', {
      'year': this.year,
      'day': this.day,
      'watch': this.watch,
      'daysOnMission': this.daysOnMission,
      'morale': this.morale,
      'supplies': this.supplies,
      'rareMaterials': this.rareMaterials,
      'rareBiologicals': this.rareBiologicals,
      'exoticMaterials': this.exoticMaterials,
      'cfi': this.cfi,
      'cei': this.cei,
      'ceim': this.ceim,
      'flight': this.flight,
      'mission': this.mission,
      'operations': this.operations,
      'engineering': this.engineering,
    });
    this.saveHistory();
  }

  async deiCheckResult(dei, difficulty, rollType, otherDM, rollMode, label, fatigue, flags) {
    let dice = RollTypes[rollType].dice;
    dice += "+" + otherDM;
    dice += "+" + ceiTaskDM(dei + this.ceim);
    dice += "+" + Difficulties[difficulty].mod;
    dice += "+" + FatigueLevels[fatigue].dm;
    console.log('deepnight', FatigueLevels[fatigue], fatigue);
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

    roller.toMessage({flavor: message},{rollMode: rollMode});
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
      fatigue: 'not',
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
    $('.dei-check').on('click', (evt) => {
      this.deiCheck(evt);
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
    const data = {
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
      mission: {...this.mission },
      flight: {...this.flight},
      operations: {...this.operations},
      engineering: {...this.engineering},
    };

    data.mission.deiDM = computeDM(data.mission.dei);
    data.flight.deiDM = computeDM(data.flight.dei);
    data.operations.deiDM = computeDM(data.operations.dei);
    data.engineering.deiDM = computeDM(data.engineering.dei);

    return data;
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
