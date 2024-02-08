import {repairMinorSystem} from "../repairs/repairMinorSystem.js";

export const sensorsAndElectronicsLookup = async (problem) => {
  let roller = new Roll('1d6');
  await roller.evaluate({async: true});
  switch (roller.total) {
    case 1:
      problem.subsystem = 'Navigational Systems';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks using navigational sensors, such as piloting or plotting a jump';
      await repairMinorSystem(problem);
      break;
    case 2:
      problem.subsystem = 'Combat Systems';
      problem.effect = -1;
      problem.description = 'DM-1 on all combat-related sensor tasks such as detecting and tracking other vessels';
      await repairMinorSystem(problem);
      break;
    case 3:
      problem.subsystem = 'Mission-Related Sensors';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks using mission-related sensors such as analysing an alien relic or surveying a planet';
      await repairMinorSystem(problem);
      break;
    case 4:
      problem.subsystem = 'Computer';
      roller = new Roll('1d6');
      await roller.evaluate({async: true});
      problem.effect = roller.total;
      problem.description = `Bandwidth reduced by ${roller.total}`;
      await repairMinorSystem(problem);
      break;
    case 5:
      problem.subsystem = 'Bridge, Command';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks requiring command from bridge, other than flight operations';
      await repairMinorSystem(problem);
      break;
    case 6:
      problem.subsystem = 'Bridge, All';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks requiring command from bridge';
      await repairMinorSystem(problem);
      break;
  }

  return problem;
}
