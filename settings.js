Hooks.once("init", () => {
  console.log('deepnight|settings')
  game.settings.register("deepnight", "revelation", {
    scope: "world",
    config: false,
    type: Object,
    restricted: true,
    default: {},
  });

});
