Hooks.once("init", async () => {
  console.log('deepnight|settings started');
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
    }
  });

  await game.settings.register("deepnight", "history", {
    scope: "world",
    config: false,
    type: Array,
    restricted: true,
    default: []
  });

  await game.settings.register("deepnight", "rollback", {
    scope: "world",
    config: false,
    type: Number,
    restricted: true,
    default: -1
  });
  console.log('deepnight|settings set');

});
