import {repairMajorSystem} from "../repairs/repairMajorSystem.js";

export const drivesAndPowerSystemsLookup = async (problem) => {
  let roller = new Roll('1d6');
  await roller.evaluate({async: true});
  switch (roller.total) {
    case 1:
      problem.subsystem = 'Jump Drive, Minor';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks involving the jump drive';
      await repairMajorSystem(problem);
      break;
    case 2:
      problem.subsystem = 'Jump Drive, Major';
      problem.effect = -1;
      problem.description = 'Jump score reduced by 1';
      await repairMajorSystem(problem);
      break;
    case 3:
      problem.subsystem = 'Power Plant, Minor';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks involving the power plant, including reallocation of power between systems';
      await repairMajorSystem(problem);
      break;
    case 4:
      problem.subsystem = 'Power Plant, Major';
      problem.effect = -15;
      problem.description = 'Power plant output reduced by 15%';
      await repairMajorSystem(problem);
      break;
    case 5:
      problem.subsystem = 'Manoeuvre Drive, Minor';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks requiring thrust';
      await repairMajorSystem(problem);
      break;
    case 6:
      problem.subsystem = 'Manoeuvre Drive, Major';
      problem.effect = -1;
      problem.description = 'Thrust reduced by 1';
      await repairMajorSystem(problem);
      break;
  }

  return problem;
}
