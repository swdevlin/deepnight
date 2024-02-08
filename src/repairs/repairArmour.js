export const repairArmour = async (problem) => {
  let roller = new Roll('2d6*50');
  await roller.evaluate({async: true});
  problem.hours = roller.total;

  roller = new Roll('2d6*2000');
  await roller.evaluate({async: true});
  problem.su = roller.total;

  roller = new Roll('2d6*100');
  await roller.evaluate({async: true});
  problem.rareMaterials = roller.total;

  roller = new Roll('1d6*100');
  await roller.evaluate({async: true});
  problem.exoticMaterials = roller.total;

  problem.personnel = 100;
}
