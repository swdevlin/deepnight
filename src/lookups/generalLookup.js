import {repairMajorSystem} from "../repairs/repairMajorSystem.js";

export const generalLookup = async (problem) => {
  let roller = new Roll('1d6');
  await roller.evaluate({async: true});
  switch (roller.total) {
    case 1:
      problem.subsystem = 'Life Support';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks';
      await repairMajorSystem(problem);
      break;
    case 2:
      problem.subsystem = 'Internal Gravity';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks';
      await repairMajorSystem(problem);
      break;
    case 3:
      problem.subsystem = 'Small Craft';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks involving craft handling';
      await repairMajorSystem(problem);
      break;
    case 4:
      problem.subsystem = 'Fuel Processors';
      problem.effect = 10;
      problem.description = 'Fuel skimming and processing takes 10% longer';
      await repairMajorSystem(problem);
      break;
    case 5:
      problem.subsystem = 'Mission System';
      problem.effect = -1;
      problem.description = 'DM-1 on all tasks using system such as laboratory, observatory, or similar';
      await repairMajorSystem(problem);
      break;
    case 6:
      problem.subsystem = 'General Systems';
      problem.effect = -1;
      problem.description = 'Special. MOR-1 until resolved';
      await repairMajorSystem(problem);
      break;
  }

  return problem;
}
