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
