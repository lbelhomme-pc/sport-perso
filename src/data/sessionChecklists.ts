import type { EnergyLevel, PlannedSession, SessionChecklistItem } from "../types";

function item(group: string, id: string, label: string): SessionChecklistItem {
  return { group, id, label };
}

const beforeSession = [
  item("Avant séance", "before-energy", "État du jour choisi : fatigué / normal / en forme"),
  item("Avant séance", "before-pain", "Douleur vérifiée : mollet, genou, tendon d'Achille, dos"),
  item("Avant séance", "before-duration", "Durée cible confirmée"),
  item("Avant séance", "before-rpe", "RPE cible relu"),
  item("Avant séance", "before-water", "Eau prête")
];

const afterSession = [
  item("Après séance", "after-completed", "Séance marquée réalisée ou modifiée dans l'application"),
  item("Après séance", "after-duration", "Durée saisie"),
  item("Après séance", "after-calories", "Calories saisies ou estimées"),
  item("Après séance", "after-hr", "FC moyenne / max saisies si disponibles"),
  item("Après séance", "after-rpe", "RPE saisi"),
  item("Après séance", "after-notes", "Notes ajoutées : énergie, douleur, sommeil, ajustements")
];

const badmintonChecklist = [
  item("Badminton", "bad-start-time", "Heure de début renseignée"),
  item("Badminton", "bad-duration", "Durée renseignée"),
  item("Badminton", "bad-intensity", "Intensité choisie : loisir / technique / match / tournoi / courte"),
  item("Échauffement badminton", "bad-warmup-walk", "Marche rapide ou corde très douce - 3 min"),
  item("Échauffement badminton", "bad-warmup-squats", "Squats poids du corps - 2 x 10"),
  item("Échauffement badminton", "bad-warmup-lunges", "Fentes arrière - 2 x 8/jambe"),
  item("Échauffement badminton", "bad-warmup-calves", "Montées mollets - 2 x 15"),
  item("Échauffement badminton", "bad-warmup-side-steps", "Pas chassés - 3 x 20 s"),
  item("Échauffement badminton", "bad-warmup-accels", "Accélérations progressives - 3 x 15 s"),
  item("Séance", "bad-session", "Séance réalisée"),
  item("Retour au calme", "bad-cooldown-walk", "Marche lente - 3 à 5 min"),
  item("Retour au calme", "bad-cooldown-calves", "Mollets doux - 2 x 30 s/côté"),
  item("Retour au calme", "bad-cooldown-adductors", "Adducteurs doux - 2 x 30 s/côté"),
  item("Retour au calme", "bad-cooldown-breath", "Respiration lente - 2 min")
];

const strengthWarmup = [
  item("Échauffement force", "strength-warmup-cardio", "Rameur, vélo ou tapis incliné - 6 min"),
  item("Échauffement force", "strength-warmup-ankles", "Mobilité chevilles - 2 x 30 s/côté"),
  item("Échauffement force", "strength-warmup-hips", "Mobilité hanches - 2 x 30 s/côté"),
  item("Échauffement force", "strength-warmup-squats", "Squats poids du corps - 2 x 10"),
  item("Échauffement force", "strength-warmup-lunges", "Fentes arrière - 2 x 8/jambe"),
  item("Échauffement force", "strength-warmup-carry", "Farmer carry léger - 2 x 20 m"),
  item("Échauffement force", "strength-warmup-sled", "Sled à vide ou très léger - 2 x 12,5 m")
];

const strengthNormal = [
  item("Bloc force", "strength-sled-push", "A1 - Sled Push : séries selon progression, 12,5 m, RPE 7-8"),
  item("Bloc force", "strength-sled-pull", "A2 - Sled Pull : séries selon progression, 12,5 m, RPE 7-8"),
  item("Bloc force", "strength-main-lift", "B - Trap bar deadlift ou front squat : 4-5 séries de 4-6 reps"),
  item("Bloc force", "strength-split-squat", "C - Bulgarian split squat : 3 x 8/jambe"),
  item("Bloc force", "strength-rdl", "D - Soulevé de terre roumain haltères : 3 x 8-10 reps"),
  item("Bloc force", "strength-farmer", "E - Farmer carry : 3-5 x 60-120 m"),
  item("Bloc force", "strength-wall-balls", "F - Wall balls technique : 4-6 x 10-25 reps"),
  item("Bloc force", "strength-side-plank", "G - Gainage latéral : 3 x 30-45 s/côté")
];

const strengthFatigue = [
  item("Version fatigué", "strength-fatigue-zone2", "Zone 2 vélo ou rameur - 10 min"),
  item("Version fatigué", "strength-fatigue-sled-push", "Sled Push léger - 4 x 12,5 m"),
  item("Version fatigué", "strength-fatigue-sled-pull", "Sled Pull léger - 3 x 12,5 m"),
  item("Version fatigué", "strength-fatigue-goblet", "Goblet squat - 3 x 8"),
  item("Version fatigué", "strength-fatigue-row", "Rowing poulie - 3 x 10"),
  item("Version fatigué", "strength-fatigue-carry", "Farmer carry modéré - 3 x 40 m"),
  item("Version fatigué", "strength-fatigue-wall-balls", "Wall balls légers - 4 x 8-10"),
  item("Version fatigué", "strength-fatigue-mobility", "Mobilité hanches/mollets - 8 min")
];

const strengthStrong = [
  item("Bonus en forme", "strength-bonus-a", "Bonus A - 4 tours : 400 m course + 15 wall balls"),
  item("Bonus en forme", "strength-bonus-b", "Bonus B - Farmer carry lourd 4 x 100 m"),
  item("Bonus en forme", "strength-bonus-c", "Bonus C - Sled Push + Pull : +1 à +2 séries")
];

const runWarmup = [
  item("Échauffement course", "run-warmup-jog", "Footing facile ou tapis - 8 min"),
  item("Échauffement course", "run-warmup-knees", "Montées de genoux légères - 2 x 20 s"),
  item("Échauffement course", "run-warmup-heels", "Talons-fesses légers - 2 x 20 s"),
  item("Échauffement course", "run-warmup-squats", "Squats poids du corps - 2 x 10"),
  item("Échauffement course", "run-warmup-lunges", "Fentes marchées - 2 x 10 pas"),
  item("Échauffement course", "run-warmup-accels", "Accélérations progressives - 3 x 20 s")
];

const runNormal = [
  item("Bloc moteur", "run-fraction", "A - Course fractionnée HYROX : volume selon progression"),
  item("Bloc moteur", "run-erg", "B - Rameur ou SkiErg : 250 à 500 m après course"),
  item("Bloc moteur", "run-bbj", "C - Burpee broad jumps technique : 5 x 10 m"),
  item("Bloc moteur", "run-farmer", "D - Farmer carry modéré : 3 x 60-80 m"),
  item("Bloc moteur", "run-cooldown", "E - Retour au calme : 8-10 min")
];

const runFatigue = [
  item("Version fatigué", "run-fatigue-zone2", "Zone 2 vélo, rameur ou tapis incliné - 35-45 min"),
  item("Version fatigué", "run-fatigue-easy-run", "Course facile - 3 x 500 m"),
  item("Version fatigué", "run-fatigue-wall-balls", "Wall balls légers - 3 x 10"),
  item("Version fatigué", "run-fatigue-farmer", "Farmer carry modéré - 3 x 40 m"),
  item("Version fatigué", "run-fatigue-mobility", "Mobilité - 8 min")
];

const runStrong = [
  item("Bonus en forme", "run-strong-extra-block", "+1 bloc course + station vs normal"),
  item("Bonus en forme", "run-strong-farmer", "Farmer carry lourd - 4 x 100 m"),
  item("Bonus en forme", "run-strong-core", "Gainage - 3 x 45 s")
];

const hyroxWarmup = [
  item("Échauffement HYROX", "hyrox-warmup-jog", "Footing ou rameur - 8 min"),
  item("Échauffement HYROX", "hyrox-warmup-mobility", "Mobilité chevilles/hanches/épaules - 5 min"),
  item("Échauffement HYROX", "hyrox-warmup-squats", "Squats poids du corps - 2 x 10"),
  item("Échauffement HYROX", "hyrox-warmup-lunges", "Fentes marchées - 2 x 10 pas"),
  item("Échauffement HYROX", "hyrox-warmup-wall-balls", "Wall balls légers - 2 x 8"),
  item("Échauffement HYROX", "hyrox-warmup-carry", "Farmer carry léger - 2 x 30 m"),
  item("Échauffement HYROX", "hyrox-warmup-accels", "Accélérations progressives - 3 x 20 s")
];

const hyroxBlocks = [
  item("Stations HYROX", "hyrox-block-1", "Bloc 1 - 1 km course + SkiErg"),
  item("Stations HYROX", "hyrox-block-2", "Bloc 2 - 1 km course + Sled Push"),
  item("Stations HYROX", "hyrox-block-3", "Bloc 3 - 1 km course + Sled Pull"),
  item("Stations HYROX", "hyrox-block-4", "Bloc 4 - 1 km course + Burpee Broad Jumps"),
  item("Stations HYROX", "hyrox-block-5", "Bloc 5 - 1 km course + Rameur"),
  item("Stations HYROX", "hyrox-block-6", "Bloc 6 - 1 km course + Farmer Carry"),
  item("Stations HYROX", "hyrox-block-7", "Bloc 7 - 1 km course + Sandbag Lunges"),
  item("Stations HYROX", "hyrox-block-8", "Bloc 8 - 1 km course + Wall Balls")
];

const hyroxFatigue = [
  item("Version fatigué", "hyrox-fatigue-cardio", "Course facile ou vélo - 4-5 x 2 min"),
  item("Version fatigué", "hyrox-fatigue-row", "Rameur - 4-5 x 250 m"),
  item("Version fatigué", "hyrox-fatigue-wall-balls", "Wall balls légers - 4 x 10"),
  item("Version fatigué", "hyrox-fatigue-farmer", "Farmer carry - 4 x 20 m"),
  item("Version fatigué", "hyrox-fatigue-lunges", "Fentes sans charge - 3 x 10/jambe"),
  item("Version fatigué", "hyrox-fatigue-mobility", "Mobilité - 8 min")
];

function getHyroxBlockCount(session: PlannedSession): number {
  const blockTag = session.tags.find((tag) => tag.includes("blocs"));
  const parsed = blockTag?.match(/\d+/)?.[0];
  return parsed ? Math.min(8, Math.max(1, Number(parsed))) : 8;
}

export function getSessionChecklist(session: PlannedSession, energy: EnergyLevel): SessionChecklistItem[] {
  if (session.type === "rest") {
    return [
      item("Repos", "rest-real", "Repos réellement protégé"),
      item("Repos", "rest-walk", "Marche douce uniquement si utile"),
      item("Repos", "rest-mobility", "Mobilité légère optionnelle"),
      item("Repos", "rest-sleep", "Sommeil/récupération priorisés")
    ];
  }

  if (session.type === "badminton") {
    return [...beforeSession, ...badmintonChecklist, ...afterSession];
  }

  if (session.type === "strength") {
    return [
      ...beforeSession,
      ...strengthWarmup,
      ...(energy === "fatigue" ? strengthFatigue : strengthNormal),
      ...(energy === "strong" ? strengthStrong : []),
      ...afterSession
    ];
  }

  if (session.type === "run") {
    return [
      ...beforeSession,
      ...runWarmup,
      ...(energy === "fatigue" ? runFatigue : runNormal),
      ...(energy === "strong" ? runStrong : []),
      ...afterSession
    ];
  }

  if (session.type === "hyrox") {
    return [
      ...beforeSession,
      ...hyroxWarmup,
      ...(energy === "fatigue" ? hyroxFatigue : hyroxBlocks.slice(0, getHyroxBlockCount(session))),
      ...(energy === "strong" ? [item("Bonus en forme", "hyrox-strong-transitions", "Transitions raccourcies, sans aller à l'échec")] : []),
      item("Stations HYROX", "hyrox-transitions-note", "Transitions notées : propres / moyennes / à améliorer"),
      ...afterSession
    ];
  }

  return [
    ...beforeSession,
    item("Récupération", "recovery-walk", "15 à 20 min marche facile si fatigué"),
    item("Récupération", "recovery-zone2", "30 à 45 min zone 2 très facile si normal"),
    item("Récupération", "recovery-mobility", "Mobilité longue"),
    item("Récupération", "recovery-breath", "Respiration / retour au calme"),
    ...afterSession
  ];
}

