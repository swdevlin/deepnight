export const repairMajorSystem = async (problem) => {
  let hoursRoller;
  let suRoller;
  let rareRoller = null;
  let exoticRoller = null;

  if (problem.severity === 'Defect') {
    hoursRoller = new Roll('5d6');
    suRoller = new Roll('2d6*500');
  } else if (problem.severity === 'Critical') {
    hoursRoller = new Roll('10d6');
    suRoller = new Roll('4d6*500');
    rareRoller = new Roll('4d6');
    exoticRoller = new Roll('2d6');
  } else if (problem.severity === 'Breakdown') {
    hoursRoller = new Roll('20d6');
    suRoller = new Roll('6d6*500');
    rareRoller = new Roll('6d6');
    exoticRoller = new Roll('3d6');
  } else {
    hoursRoller = new Roll('30d6');
    suRoller = new Roll('8d6*500');
    rareRoller = new Roll('5d6');
    exoticRoller = new Roll('4d6');
  }

  await hoursRoller.evaluate({async: true});
  problem.hours = hoursRoller.total;

  await suRoller.evaluate({async: true});
  problem.su = suRoller.total;

  if (rareRoller) {
    await rareRoller.evaluate({async: true});
    problem.rareMaterials = rareRoller.total;
  }

  if (exoticRoller) {
    await exoticRoller.evaluate({async: true});
    problem.rareMaterials = exoticRoller.total;
  }

  problem.personnel = 50;
}
