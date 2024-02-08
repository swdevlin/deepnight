export const computeDM = (score) => {
  const dms = [-3, -2, -2, -1, -1, -1, 0, 0, 0, 1, 1, 1, 2, 2, 2];
  if (score < 0 )
    return -3;
  if (score > 14)
    return 3;
  return dms[score];
}

export const Difficulties= {
  Simple: { mod: 6, target: 2, label: 'Simple' },
  Easy: { mod: 4, target: 4, label: 'Easy'  },
  Routine: { mod: 2, target: 6, label: 'Routine'  },
  Average: { mod: 0, target: 8, label: 'Average'  },
  Difficult: { mod: -2, target: 10, label: 'Difficult'  },
  VeryDifficult: { mod: -4, target: 12, label: 'Very Difficult'  },
  Formidable: { mod: -6, target: 14, label: 'Formidable'  },
  Impossible: { mod: -8, target: 16, label: 'Impossible'  }
};

export const effect = (difficulty, roll) => {
  return roll - Difficulties[difficulty].target;
}

export const ceiTaskDM = (cei) => {
  if (cei < 0)
    return -6;
  if (cei > 15)
    return 6;
  switch (cei) {
    case 0:
      return -6;
    case 1:
      return -5;
    case 2:
      return -4;
    case 3:
      return -3;
    case 4:
      return -2;
    case 5:
    case 6:
      return -1;
    case 7:
    case 8:
      return 0;
    case 9:
    case 10:
      return 1;
    case 11:
      return 2;
    case 12:
      return 3;
    case 13:
      return 4;
    case 14:
      return 5;
    case 15:
      return 6;
  }
}

export const RollTypes= {
  boon: { dice: "3d6k2", label: "Boon" },
  normal: { dice: "2d6", label: "Normal" },
  bane: { dice: "3d6kl2", label: "Bane" },
};

export const CEIRollModifiers = [
  { id: 'specialist', label: "Specialist/expert", dm: 2},
  { id: 'equipment', label: "Equipment/Resources", dm: 1},
  { id: 'pressure', label: "Under pressure", dm: -1},
  { id: 'extremepressure', label: "Under extreme pressure", dm: -2},
  { id: 'distractions', label: "Distractions", dm: -1},
  { id: 'difficult', label: "Difficult circumstances", dm: -3},
  { id: 'reluctance', label: "Reluctance", dm: -1},
  { id: 'division', label: "Internal divisions", dm: -3},
];

export const FatigueLevels = {
  not: {label: 'Not fatigued', dm: 0},
  fatigued: {label: 'Fatigued', dm: 0},
  highly: {label: 'Highly fatigued', dm: -1},
  dangerously: {label: 'Dangerously fatigued', dm: -2},
  exhausted: {label: 'Exhausted fatigued', dm: -3},
  incapable: {label: 'Incapable', dm: -4},
};

export const logToStatus = (status, log) => {
  status.year = log[0];
  status.day = log[1];
  status.watch = log[2];
  status.daysOnMission = log[3];
  status.morale = log[4];
  status.supplies = log[5];
  status.rareMaterials = log[6];
  status.rareBiologicals = log[7];
  status.exoticMaterials = log[8];
  status.cfi = log[9];
  status.cei = log[10];
  status.ceim = log[11];
  status.flight.dei = log[12];
  status.flight.crew = log[13];
  status.mission.dei = log[14];
  status.mission.crew = log[15];
  status.operations.dei = log[16];
  status.operations.crew = log[17];
  status.engineering.dei = log[18];
  status.engineering.crew = log[19];
  status.fatigue = log[20];
  status.ceiInterval = log[21];
  status.ceimInterval = log[22];
  status.cfiInterval = log[23];

  if (log[24])
    status.damagedSystems = log[24];
  else
    status.damagedSystems = [];
}

export const statusToLog = (status) => {
  return [
    status.year,
    status.day,
    status.watch,
    status.daysOnMission,
    status.morale,
    status.supplies,
    status.rareMaterials,
    status.rareBiologicals,
    status.exoticMaterials,
    status.cfi,
    status.cei,
    status.ceim,
    status.flight.dei,
    status.flight.crew,
    status.mission.dei,
    status.mission.crew,
    status.operations.dei,
    status.operations.crew,
    status.engineering.dei,
    status.engineering.crew,
    status.fatigue,
    status.ceiInterval,
    status.ceimInterval,
    status.cfiInterval,
    status.damagedSystems
  ];
}
