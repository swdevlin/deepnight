Hooks.once("init", async () => {
  await game.settings.register("deepnight", 'status', {
    scope: "world",
    config: false,
    type: Object,
    restricted: true,
    default: {
      year: 1105,
      day: 1,
      watch: 1,
      daysOnMission: 0,
      morale: 0,
      supplies: 200000,
      rareMaterials: 0,
      rareBiologicals: 0,
      exoticMaterials: 0,
      cfi: 0,
      cei: 7,
      ceim: 0,
      fatigue: 'not',
      flight: { dei: 7, crew: 57},
      mission: { dei: 7, crew: 92},
      operations: { dei: 7, crew: 132},
      engineering: { dei: 7, crew: 195},
      cfiInterval: 0,
      ceiInterval: 0,
      ceimInterval: 0,
      damagedSystems: []
    }
  });

  await game.settings.register("deepnight", "refuelTime", {
    name: game.i18n.localize('DEEPNIGHT.refuelSettingName'),
    hint: game.i18n.localize('DEEPNIGHT.refuelSettingHint'),
    scope: "world",
    config: true,
    type: String,
    restricted: true,
    default: '2d 1w'
  });

  await game.settings.register("deepnight", "cfiInterval", {
    name: game.i18n.localize('DEEPNIGHT.Settings.cfiIntervalName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.cfiIntervalHint'),
    scope: "world",
    config: true,
    type: String,
    restricted: true,
    default: '6d6'
  });

  await game.settings.register("deepnight", "deiTraining", {
    name: game.i18n.localize('DEEPNIGHT.Settings.deiTrainingName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.deiTrainingHint'),
    scope: "world",
    config: true,
    type: String,
    restricted: true,
    default: '4d6'
  });

  await game.settings.register("deepnight", "ceiInterval", {
    name: game.i18n.localize('DEEPNIGHT.Settings.ceiIntervalName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.ceiIntervalHint'),
    scope: "world",
    config: true,
    type: String,
    restricted: true,
    default: '2d6*30'
  });

  await game.settings.register("deepnight", "ceiTraining", {
    name: game.i18n.localize('DEEPNIGHT.Settings.ceiTrainingName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.ceiTrainingHint'),
    scope: "world",
    config: true,
    type: String,
    restricted: true,
    default: '4d6'
  });

  await game.settings.register("deepnight", "ceimInterval", {
    name: game.i18n.localize('DEEPNIGHT.Settings.ceimIntervalName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.ceimIntervalHint'),
    scope: "world",
    config: true,
    type: String,
    restricted: true,
    default: '2d6*7'
  });

  await game.settings.register("deepnight", "suppliesPerDay", {
    name: game.i18n.localize('DEEPNIGHT.Settings.suppliesPerDayName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.suppliesPerDayHint'),
    scope: "world",
    config: true,
    type: Number,
    restricted: true,
    default: 1000
  });

  await game.settings.register("deepnight", "reachJumps", {
    name: game.i18n.localize('DEEPNIGHT.Settings.reachJumpsName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.reachJumpsHint'),
    scope: "world",
    config: true,
    type: Number,
    restricted: true,
    default: 4
  });

  await game.settings.register("deepnight", "suStorage", {
    name: game.i18n.localize('DEEPNIGHT.Settings.suStorageName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.suStorageHint'),
    scope: "world",
    config: true,
    type: Number,
    restricted: true,
    default: 200000
  });

  await game.settings.register("deepnight", "suCargoSpace", {
    name: game.i18n.localize('DEEPNIGHT.Settings.suCargoSpaceName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.suCargoSpaceHint'),
    scope: "world",
    config: true,
    type: Number,
    restricted: true,
    default: 100
  });

  await game.settings.register("deepnight", "maxCargoSpace", {
    name: game.i18n.localize('DEEPNIGHT.Settings.maxCargoSpaceName'),
    hint: game.i18n.localize('DEEPNIGHT.Settings.maxCargoSpaceHint'),
    scope: "world",
    config: true,
    type: Number,
    restricted: true,
    default: 149 + 419.8*2 + 14.4*2 + 841.6*2
  });

  // TODO: convert game time to watches

  await game.settings.register("deepnight", "history", {
    scope: "world",
    config: false,
    type: Array,
    restricted: true,
    default: []
  });

});
