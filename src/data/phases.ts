import type { TrainingPhase } from "../types";

const phaseBlueprints = [
  {
    key: "base",
    weeks: 4,
    title: "Phase 1 - Reprise / calibration",
    summary: "Installer les repères : course, rameur, wall balls, sled, farmer carry. Volume contrôlé.",
    focus: "Base technique, charges de départ et hypoglycémie évitée."
  },
  {
    key: "aerobie",
    weeks: 4,
    title: "Phase 2 - Base aérobie + force",
    summary: "Construire le moteur et solidifier les jambes sans casser le badminton.",
    focus: "Zone 2, force propre, récupération active."
  },
  {
    key: "force",
    weeks: 4,
    title: "Phase 3 - Force spécifique",
    summary: "Sled plus lourd, force jambes, déficit calorique raisonnable.",
    focus: "Sled, jambes, protéines et sommeil."
  },
  {
    key: "endurance",
    weeks: 4,
    title: "Phase 4 - Endurance de force",
    summary: "Courir avec les jambes entamées, tenir les stations, améliorer la résistance.",
    focus: "Stations après course, pacing stable."
  },
  {
    key: "specific1",
    weeks: 4,
    title: "Phase 5 - Spécifique HYROX 1",
    summary: "Plus d’enchaînements course + station, plus de régularité, moins de hasard.",
    focus: "Transitions, allure HYROX, station courte."
  },
  {
    key: "specific2",
    weeks: 4,
    title: "Phase 6 - Spécifique HYROX 2",
    summary: "Volume spécifique élevé, simulations sérieuses mais contrôlées.",
    focus: "Enchaînements longs, gestion de fatigue."
  },
  {
    key: "simulation",
    weeks: 4,
    title: "Phase 7 - Simulations progressives",
    summary: "8 blocs HYROX, transitions, pacing. On apprend à finir propre.",
    focus: "Répétitions de course, stations et nutrition."
  },
  {
    key: "peak",
    weeks: 3,
    title: "Phase 8 - Pic de forme",
    summary: "Moins de volume inutile, plus de qualité. Une grosse simulation maximum.",
    focus: "Qualité, fraîcheur et confiance."
  },
  {
    key: "taper",
    weeks: 2,
    title: "Phase 9 - Affûtage",
    summary: "Réduction de charge, rappel d’intensité, fraîcheur. Tu arrives avec des jambes.",
    focus: "Sommeil, mobilité, rappels courts."
  }
];

const DEFAULT_TOTAL_WEEKS = phaseBlueprints.reduce((total, phase) => total + phase.weeks, 0);

export function buildPhases(totalWeeks: number): TrainingPhase[] {
  if (totalWeeks <= 1) {
    return [
      {
        key: "race",
        from: 1,
        to: 1,
        title: "Semaine course",
        summary: "Rappel léger, sommeil et fraîcheur.",
        focus: "Arriver frais."
      }
    ];
  }

  const rawDurations = phaseBlueprints.map((phase) =>
    Math.max(1, Math.round((phase.weeks / DEFAULT_TOTAL_WEEKS) * totalWeeks))
  );

  let diff = rawDurations.reduce((total, value) => total + value, 0) - totalWeeks;
  for (let index = rawDurations.length - 1; diff > 0 && index >= 0; index -= 1) {
    const removable = Math.min(diff, rawDurations[index] - 1);
    rawDurations[index] -= removable;
    diff -= removable;
  }

  for (let index = 0; diff < 0; index = (index + 1) % rawDurations.length) {
    rawDurations[index] += 1;
    diff += 1;
  }

  let cursor = 1;
  return phaseBlueprints.map((phase, index) => {
    const from = cursor;
    const to = cursor + rawDurations[index] - 1;
    cursor = to + 1;

    return {
      key: phase.key,
      from,
      to,
      title: phase.title,
      summary: phase.summary,
      focus: phase.focus
    };
  });
}

export function getPhaseForWeek(week: number, totalWeeks: number): TrainingPhase {
  const phases = buildPhases(totalWeeks);
  return phases.find((phase) => week >= phase.from && week <= phase.to) ?? phases[phases.length - 1];
}
