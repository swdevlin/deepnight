import {structureLookup} from "./lookups/structureLookup.js";
import {sensorsAndElectronicsLookup} from "./lookups/sensorsAndElectronicsLookup.js";
import {generalLookup} from "./lookups/generalLookup.js";
import {drivesAndPowerSystemsLookup} from "./lookups/drivesAndPowerSystemsLookup.js";
import {weaponsAndDefensiveSystemsLookup} from "./lookups/weaponsAndDefensiveSystemsLookup.js";

export class Problem {
  constructor(severity) {
    this.severity = severity;
    this.subsystem = null;
    this.effect = null;
    this.description = null;
    this.hours = 0;
    this.su = 0;
    this.rareMaterials = 0;
    this.exoticMaterials = 0;
    this.personnel = 0;
  }
}

export const subsystems = async (severity) => {
  const problem = new Problem(severity);
  let roller = new Roll('1d6');
  await roller.evaluate({async: true});
  switch (roller.total) {
    case 1:
    case 2:
      return await structureLookup(problem);
    case 3:
      return await sensorsAndElectronicsLookup(problem);
    case 4:
      return await drivesAndPowerSystemsLookup(problem);
    case 5:
      return await weaponsAndDefensiveSystemsLookup(problem);
    case 6:
      return await generalLookup(problem);
  }

}

// TODO: Handle ALL
export const maintenanceLookup = async (total) => {
  const results= [];

  let problem;
  if (total >= 46) {
    problem = new Problem('Defect');
    problem.description = 'X';
    results.push(problem);

    problem = new Problem('Breakdown');
    problem.description = 'X';
    results.push(problem);

    problem = new Problem('Failure');
    problem.description = 'All';
    results.push(problem);
  } else
    switch (total) {
      case 4:
      case 5:
      case 6:
        results.push(await subsystems('Defect'));
        break;
      case 7:
      case 8:
      case 9:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        break;
      case 10:
      case 11:
      case 12:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        break;
      case 13:
      case 14:
      case 15:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        break;
      case 16:
      case 17:
      case 18:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        break;
      case 19:
      case 20:
      case 21:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        break;
      case 22:
      case 23:
      case 24:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        break;
      case 25:
      case 26:
      case 27:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Failure'));
        break;
      case 28:
      case 29:
      case 30:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Failure'));
        break;
      case 31:
      case 32:
      case 33:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Failure'));
        break;
      case 34:
      case 35:
      case 36:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Failure'));
        results.push(await subsystems('Failure'));
        break;
      case 37:
      case 38:
      case 39:
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Defect'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Failure'));
        results.push(await subsystems('Failure'));
        break;
      case 40:
      case 41:
      case 42:
        problem = new Problem('Defect');
        problem.description = 'All';
        results.push(problem);

        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Breakdown'));
        results.push(await subsystems('Failure'));
        results.push(await subsystems('Failure'));
        break;
      case 43:
      case 44:
      case 45:
        problem = new Problem('Defect');
        problem.description = 'All';
        results.push(problem);

        problem = new Problem('Breakdown');
        problem.description = 'All';
        results.push(problem);

        results.push(await subsystems('Failure'));
        results.push(await subsystems('Failure'));
        break;
    }

  return results;
}
