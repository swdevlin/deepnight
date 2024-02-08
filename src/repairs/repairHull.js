export const repairHull = async (problem) => {
  let roller;
  let pointsRepaired = 0;
  while (pointsRepaired < problem.effect) {
    roller = new Roll('2d6+6');
    await roller.evaluate({async: true});
    pointsRepaired += roller.total;

    roller = new Roll('2d6*10');
    await roller.evaluate({async: true});
    problem.hours += roller.total;

    roller = new Roll('2d6*5000');
    await roller.evaluate({async: true});
    problem.su += roller.total;

    roller = new Roll('4d6*10');
    await roller.evaluate({async: true});
    problem.rareMaterials += roller.total;

    roller = new Roll('1d6*10');
    await roller.evaluate({async: true});
    problem.exoticMaterials += roller.total;
  }

  problem.personnel = 100;
}
