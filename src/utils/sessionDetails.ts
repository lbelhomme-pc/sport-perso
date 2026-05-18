import type { CompletedSessionType, SessionDetailValue } from "../types";

export type SessionDetailField = {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  placeholder?: string;
  unit?: string;
  options?: string[];
};

type SessionDetailConfig = {
  title: string;
  hint: string;
  fields: SessionDetailField[];
};

const cardioFields: SessionDetailField[] = [
  { key: "cardioFocus", label: "Objectif", type: "select", options: ["Endurance facile", "Tempo / seuil", "Intervalles", "Sortie longue", "Test"] },
  { key: "distanceKm", label: "Distance", type: "number", unit: "km", placeholder: "Ex : 6.5" },
  { key: "paceOrSpeed", label: "Allure / vitesse", type: "text", placeholder: "Ex : 5:40/km ou 28 km/h" },
  { key: "elevationM", label: "D+", type: "number", unit: "m", placeholder: "Ex : 120" },
  { key: "intervals", label: "Intervalles", type: "text", placeholder: "Ex : 6 x 400 m, r. 1 min" }
];

const strengthFields: SessionDetailField[] = [
  { key: "strengthFocus", label: "Cible", type: "select", options: ["Full body", "Bas du corps", "Haut du corps", "Force", "Hypertrophie", "Puissance"] },
  { key: "mainLift", label: "Mouvement clé", type: "text", placeholder: "Ex : squat, DC, tractions" },
  { key: "topSet", label: "Meilleure série", type: "text", placeholder: "Ex : 5 x 80 kg @ RPE 8" },
  { key: "totalSets", label: "Séries utiles", type: "number", placeholder: "Ex : 18" },
  { key: "failureSets", label: "Séries à l'échec", type: "number", placeholder: "Ex : 0" }
];

const racketFields: SessionDetailField[] = [
  { key: "racketFormat", label: "Format", type: "select", options: ["Technique", "Matchs", "Mixte", "Tournoi", "Double", "Simple"] },
  { key: "matches", label: "Matchs", type: "number", placeholder: "Ex : 3" },
  { key: "games", label: "Sets / jeux", type: "number", placeholder: "Ex : 6" },
  { key: "movementQuality", label: "Déplacements", type: "select", options: ["Fluides", "Normaux", "Lourds", "Explosifs", "Gênés"] },
  { key: "technicalFocus", label: "Point technique", type: "text", placeholder: "Ex : revers, service, appuis" }
];

const hybridFields: SessionDetailField[] = [
  { key: "hybridFormat", label: "Format", type: "select", options: ["Circuit", "EMOM", "AMRAP", "Stations", "Simulation course", "Test"] },
  { key: "rounds", label: "Tours", type: "number", placeholder: "Ex : 4" },
  { key: "stations", label: "Stations clés", type: "text", placeholder: "Ex : rameur, farmer, wall balls" },
  { key: "transitions", label: "Transitions", type: "select", options: ["Propres", "Correctes", "Lentes", "Subies"] },
  { key: "runFeeling", label: "Course sous fatigue", type: "select", options: ["Fluide", "Tenue", "Subie", "Remplacée"] }
];

const recoveryFields: SessionDetailField[] = [
  { key: "recoveryFocus", label: "Contenu", type: "select", options: ["Mobilité", "Marche", "Vélo facile", "Respiration", "Repos actif"] },
  { key: "mobilityArea", label: "Zone travaillée", type: "text", placeholder: "Ex : hanches, mollets, épaules" },
  { key: "recoveryQuality", label: "Après séance", type: "select", options: ["Mieux", "Identique", "Plus raide", "Plus douloureux"] },
  { key: "painEvolution", label: "Douleur", type: "select", options: ["Aucune", "Stable", "Diminuée", "Augmentée"] }
];

const freeFields: SessionDetailField[] = [
  { key: "sessionGoal", label: "But", type: "text", placeholder: "Ex : reprise, test, plaisir, technique" },
  { key: "keyResult", label: "Résultat clé", type: "text", placeholder: "Ex : 20 min faciles, PR, bonne tolérance" },
  { key: "nextAdjustment", label: "À ajuster", type: "text", placeholder: "Ex : garder, augmenter, réduire" }
];

export function getSessionDetailConfig(type: CompletedSessionType): SessionDetailConfig {
  if (type === "strength") {
    return {
      title: "Détails muscu / force",
      hint: "Note le mouvement clé, la meilleure série et le volume utile.",
      fields: strengthFields
    };
  }

  if (type === "run" || type === "bike" || type === "swim") {
    return {
      title: "Détails cardio",
      hint: "Distance, allure, dénivelé ou structure d'intervalles.",
      fields: cardioFields
    };
  }

  if (type === "badminton" || type === "racket") {
    return {
      title: "Détails raquette",
      hint: "Format, volume de jeu, appuis et point technique du jour.",
      fields: racketFields
    };
  }

  if (type === "hybrid" || type === "hyrox" || type === "test") {
    return {
      title: "Détails hybride / test",
      hint: "Stations, tours, transitions et course sous fatigue.",
      fields: hybridFields
    };
  }

  if (type === "mobility" || type === "recovery") {
    return {
      title: "Détails récupération",
      hint: "Contenu doux, zone travaillée et évolution des sensations.",
      fields: recoveryFields
    };
  }

  return {
    title: "Détails libres",
    hint: "Garde le but, le résultat clé et l'ajustement pour la suite.",
    fields: freeFields
  };
}

export function detailsToFormValues(details?: Record<string, SessionDetailValue>): Record<string, string> {
  return Object.fromEntries(Object.entries(details ?? {}).map(([key, value]) => [key, String(value)]));
}

export function normalizeSessionDetails(type: CompletedSessionType, values: Record<string, string>): Record<string, SessionDetailValue> | undefined {
  const fields = getSessionDetailConfig(type).fields;
  const entries: Array<readonly [string, SessionDetailValue]> = [];

  fields.forEach((field) => {
    const raw = values[field.key]?.trim();
    if (!raw) return;
    if (field.type === "number") {
      const parsed = Number(raw.replace(",", "."));
      if (Number.isFinite(parsed)) entries.push([field.key, parsed]);
      return;
    }
    entries.push([field.key, raw]);
  });

  return entries.length ? Object.fromEntries(entries) : undefined;
}

export function formatSessionDetails(type: CompletedSessionType, details?: Record<string, SessionDetailValue>) {
  if (!details) return [];
  const fields = getSessionDetailConfig(type).fields;
  return fields
    .map((field) => {
      const value = details[field.key];
      if (value === undefined || value === "") return null;
      return {
        label: field.label,
        value: `${value}${field.unit ? ` ${field.unit}` : ""}`
      };
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));
}
