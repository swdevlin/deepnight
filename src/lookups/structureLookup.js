import {repairHull} from "../repairs/repairHull.js";
import {repairArmour} from "../repairs/repairArmour.js";
import {repairMajorSystem} from "../repairs/repairMajorSystem.js";

export const structureLookup = async (problem) => {
  let roller = new Roll('1d6');
  await roller.evaluate({async: true});
  switch (roller.total) {
    case 1:
    case 2:
    case 3:
      problem.subsystem = 'Hull, Minor';
      roller = new Roll('3d6');
      await roller.evaluate({async: true});
      problem.effect = roller.total;
      problem.description = `${roller.total} hull points lost`;

      await repairHull(problem);
      break;
    case 4:
      problem.subsystem = 'Hull, Major';
      roller = new Roll('3d6*10');
      await roller.evaluate({async: true});
      problem.effect = roller.total
      problem.description = `${roller.total} hull points lost`;

      await repairHull(problem);
      break;
    case 5:
      problem.subsystem = 'Armour';
      problem.effect = 1;
      problem.description = '1 point of armour lost';
      await repairArmour(problem);
      break;
    case 6:
      problem.subsystem = 'Cargo';
      problem.effect = 10;
      problem.description = '10% of cargo space and supplies stowage becomes unusable';
      await repairMajorSystem(problem);
      break;
  }

  return problem;
}
