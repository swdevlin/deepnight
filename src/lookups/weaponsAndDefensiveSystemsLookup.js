import {repairMajorSystem} from "../repairs/repairMajorSystem.js";
import {repairMinorSystem} from "../repairs/repairMinorSystem.js";

export const weaponsAndDefensiveSystemsLookup = async (problem) => {
  let roller = new Roll('1d6');
  await roller.evaluate({async: true});
  switch (roller.total) {
    case 1:
      problem.subsystem = 'Spinal Weapon';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks involving the spinal weapon';
      await repairMajorSystem(problem);
      break;
    case 2:
    case 3:
      problem.subsystem = 'Missile Weapon Systems';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks involving one weapon type such as lasers or missiles';
      await repairMajorSystem(problem);
      break;
    case 4:
      problem.subsystem = 'Defensive System';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks involving one defensive weapon or electronic system';
      await repairMajorSystem(problem);
      break;
    case 5:
      problem.subsystem = 'Combat Sensors';
      problem.effect = -1;
      problem.description = 'DM-1 on all combat-related sensor tasks such as detecting and tracking other vessels';
      await repairMinorSystem(problem);
      break;
    case 6:
      problem.subsystem = 'Craft Bays and Drones';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks involving the launch, recovery, or control of small craft, drones, or probes';
      await repairMajorSystem(problem);
      break;
  }

  return problem;
}
