Hooks.once("init", () => {
  console.log('deepnight|settings')
  game.settings.register("deepnight", "year", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 1105,
  });

  game.settings.register("deepnight", "day", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 17,
  });

  game.settings.register("deepnight", "watch", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 1,
  });

  game.settings.register("deepnight", "daysOnMission", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 0,
  });

  game.settings.register("deepnight", "morale", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 0,
  });

  game.settings.register("deepnight", "supplies", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 200000,
  });

  game.settings.register("deepnight", "rareMaterials", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 0,
  });

  game.settings.register("deepnight", "rareBiologicals", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 0,
  });

  game.settings.register("deepnight", "exoticMaterials", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 0,
  });

  game.settings.register("deepnight", "cfi", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 0,
  });

  game.settings.register("deepnight", "cei", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 7,
  });

  game.settings.register("deepnight", "ceim", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: 0,
  });

  game.settings.register("deepnight", "flight", {
    scope: "world",
    config: false,
    type: Object,
    restricted: true,
    default: {
      dei: 7,
      crew: 57,
    },
  });

  game.settings.register("deepnight", "mission", {
    scope: "world",
    config: false,
    type: Object,
    restricted: true,
    default: {
      dei: 7,
      crew: 92,
    },
  });

  game.settings.register("deepnight", "operations", {
    scope: "world",
    config: false,
    type: Object,
    restricted: true,
    default: {
      dei: 7,
      crew: 132,
    },
  });

  game.settings.register("deepnight", "engineering", {
    scope: "world",
    config: false,
    type: Object,
    restricted: true,
    default: {
      dei: 7,
      crew: 195,
    },
    onchange: () => window.deepnightRevelation.loadFromSettings(),
  });

  // this.command = {
  //   missionCommander: null,
  //   captain: null,
  //   xo: null,
  //   chiefMissionOfficer: null,
  //   chiefOperationsOfficer: null,
  //   chiefFlightOfficer: null,
  //   chiefEngineeringOfficer: null,
  // }

});
