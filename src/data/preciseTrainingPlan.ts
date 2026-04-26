import type { ExercisePrescription } from "../types";

export type PreciseSessionSlot = "rest" | "badminton" | "strength" | "run" | "recovery" | "hyrox";

export type PreciseSessionPlan = {
  title: string;
  objective: string;
  durationMin: number;
  rpeTarget: string;
  fatigueVersion: string;
  normalVersion: string;
  strongVersion: string;
  tags: string[];
  sourceDay?: string;
  exercises: ExercisePrescription[];
};

export type PreciseWeekPlan = {
  week: number;
  dateRange: string;
  phaseTitle: string;
  note?: string;
  status?: string;
  sessions: Partial<Record<PreciseSessionSlot, PreciseSessionPlan>>;
};

export const PRECISE_WEEK_PLANS: Record<number, PreciseWeekPlan> = {
  "1": {
    "week": 1,
    "dateRange": "27 avr. au 3 mai",
    "phaseTitle": "Phase 1 — Reprise, calibration, base technique",
    "note": "semaine de test/calibration. Comme l’hypoglycémie a coupé la séance, on ne charge pas inutilement la fin de semaine.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Reprise, calibration, base technique",
          "semaine de test/calibration"
        ],
        "exercises": [
          {
            "id": "rest-w1-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w1-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w1-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — post-calibration / technique contrôlée",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 75,
        "rpeTarget": "RPE 6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 4 × 10 m à 200 kg, repos 2 min, RPE 6. • Sled Pull : 4 × 10 m à 140-150 kg, repos 2 min, RPE 6. • Presse à cuisses : 3 × 8 à 120-130 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Reprise, calibration, base technique",
          "semaine de test/calibration"
        ],
        "exercises": [
          {
            "id": "strength-w1-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w1-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 200 kg, repos 2 min, RPE 6.",
            "targetLoadText": "200 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w1-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 140-150 kg, repos 2 min, RPE 6.",
            "targetLoadText": "140-150 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w1-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "3 × 8 à 120-130 kg, repos 2 min.",
            "targetLoadText": "120-130 kg",
            "restText": "2 min",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w1-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 20 kg total, repos 90 s.",
            "targetLoadText": "20 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w1-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 24 kg, repos 90 s.",
            "targetLoadText": "2 × 24 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w1-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 20 kg, repos 90 s, poignet gauche neutre.",
            "targetLoadText": "2 × 20 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w1-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "Calibration courte : 3 × 12 reps à 6 kg, repos 75 s. Pas de max test cette semaine.",
            "targetLoadText": "6 kg",
            "restText": "75 s",
            "sets": 3,
            "reps": 12
          },
          {
            "id": "strength-w1-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "75 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Reprise, calibration, base technique",
          "semaine de test/calibration"
        ],
        "exercises": [
          {
            "id": "badminton-w1-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w1-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w1-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w1-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w1-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w1-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 8",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : Course test déjà faite : 1 km en 4'40, FC moy 162, FC max 175, RPE 8. Pour cette semaine, seulement footing facile ou rameur. • Substitut SkiErg : 3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur. • Burpee Broad Jumps : 4 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Reprise, calibration, base technique",
          "semaine de test/calibration",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w1-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w1-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "Course test déjà faite : 1 km en 4'40, FC moy 162, FC max 175, RPE 8. Pour cette semaine, seulement footing facile ou rameur.",
            "rpeTarget": "RPE 8"
          },
          {
            "id": "run-w1-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur.",
            "restText": "90 s après le rameur",
            "rpeTarget": "RPE 6"
          },
          {
            "id": "run-w1-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "4 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "run-w1-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w1-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w1-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Reprise, calibration, base technique",
          "semaine de test/calibration"
        ],
        "exercises": [
          {
            "id": "recovery-w1-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w1-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w1-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 4. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Reprise, calibration, base technique",
          "semaine de test/calibration",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w1-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w1-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "4."
          },
          {
            "id": "hyrox-w1-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w1-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w1-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w1-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur.",
            "restText": "90 s après le rameur",
            "rpeTarget": "RPE 6"
          },
          {
            "id": "hyrox-w1-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 190 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "190 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w1-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 130 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "130 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w1-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 40 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w1-10-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 10,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w1-11-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 11,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w1-12-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 12,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w1-13-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 13,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w1-14-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 14,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w1-15-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 15,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w1-16-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 16,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "2": {
    "week": 2,
    "dateRange": "4 mai au 10 mai",
    "phaseTitle": "Phase 1 — Reprise, calibration, base technique",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Reprise, calibration, base technique"
        ],
        "exercises": [
          {
            "id": "rest-w2-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w2-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w2-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 215 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 155 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 135 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Reprise, calibration, base technique"
        ],
        "exercises": [
          {
            "id": "strength-w2-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w2-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 215 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "215 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w2-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 155 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "155 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w2-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 135 kg, repos 2 min 30.",
            "targetLoadText": "135 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w2-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 22 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "22 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w2-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 26 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 26 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w2-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 20 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 20 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w2-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 15 à 6 kg, repos 75-90 s.",
            "targetLoadText": "6 kg",
            "restText": "75-90 s",
            "sets": 4,
            "reps": 15
          },
          {
            "id": "strength-w2-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w2-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Reprise, calibration, base technique"
        ],
        "exercises": [
          {
            "id": "badminton-w2-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w2-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w2-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w2-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w2-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w2-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 5 × 800 m à 5'20-5'40/km, repos 90 s. • Substitut SkiErg : 3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur. • Burpee Broad Jumps : 4 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Reprise, calibration, base technique",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w2-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w2-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "5 × 800 m à 5'20-5'40/km, repos 90 s.",
            "restText": "90 s",
            "sets": 5,
            "distanceM": 800
          },
          {
            "id": "run-w2-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur.",
            "restText": "90 s après le rameur",
            "rpeTarget": "RPE 6"
          },
          {
            "id": "run-w2-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "4 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "run-w2-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w2-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w2-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Reprise, calibration, base technique"
        ],
        "exercises": [
          {
            "id": "recovery-w2-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w2-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w2-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 4. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Reprise, calibration, base technique",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w2-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w2-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "4."
          },
          {
            "id": "hyrox-w2-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w2-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w2-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w2-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur.",
            "restText": "90 s après le rameur",
            "rpeTarget": "RPE 6"
          },
          {
            "id": "hyrox-w2-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 195 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "195 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w2-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 135 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "135 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w2-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 40 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w2-10-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 10,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w2-11-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 11,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w2-12-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 12,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w2-13-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 13,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w2-14-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 14,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w2-15-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 15,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w2-16-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 16,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "3": {
    "week": 3,
    "dateRange": "11 mai au 17 mai",
    "phaseTitle": "Phase 1 — Reprise, calibration, base technique",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Reprise, calibration, base technique"
        ],
        "exercises": [
          {
            "id": "rest-w3-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w3-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w3-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 220 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 160 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 140 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Reprise, calibration, base technique"
        ],
        "exercises": [
          {
            "id": "strength-w3-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w3-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 220 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "220 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w3-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 160 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "160 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w3-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 140 kg, repos 2 min 30.",
            "targetLoadText": "140 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w3-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 24 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "24 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w3-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 26 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 26 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w3-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 20 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 20 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w3-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "5 × 15 à 6 kg, repos 75-90 s.",
            "targetLoadText": "6 kg",
            "restText": "75-90 s",
            "sets": 5,
            "reps": 15
          },
          {
            "id": "strength-w3-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w3-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Reprise, calibration, base technique"
        ],
        "exercises": [
          {
            "id": "badminton-w3-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w3-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w3-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w3-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w3-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w3-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 4 × 1 km à 5'20-5'40/km, repos 2 min. • Substitut SkiErg : 3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur. • Burpee Broad Jumps : 4 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Reprise, calibration, base technique",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w3-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w3-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "4 × 1 km à 5'20-5'40/km, repos 2 min.",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 1000
          },
          {
            "id": "run-w3-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur.",
            "restText": "90 s après le rameur",
            "rpeTarget": "RPE 6"
          },
          {
            "id": "run-w3-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "4 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "run-w3-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w3-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w3-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Reprise, calibration, base technique"
        ],
        "exercises": [
          {
            "id": "recovery-w3-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w3-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w3-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Reprise, calibration, base technique",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w3-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w3-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w3-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w3-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w3-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w3-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur.",
            "restText": "90 s après le rameur",
            "rpeTarget": "RPE 6"
          },
          {
            "id": "hyrox-w3-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 200 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "200 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w3-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 140 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "140 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w3-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 40 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w3-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w3-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w3-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w3-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w3-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w3-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w3-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w3-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "4": {
    "week": 4,
    "dateRange": "18 mai au 24 mai",
    "phaseTitle": "Phase 1 — Reprise, calibration, base technique",
    "status": "semaine allégée. Volume réduit, technique propre, pas de dette de fatigue.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Reprise, calibration, base technique",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "rest-w4-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w4-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w4-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 190 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 135 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 120 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Reprise, calibration, base technique",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "strength-w4-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w4-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 190 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "190 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w4-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 135 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "135 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w4-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 120 kg, repos 2 min.",
            "targetLoadText": "120 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w4-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 18 kg total, repos 90 s.",
            "targetLoadText": "18 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w4-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 22 kg, repos 90 s.",
            "targetLoadText": "2 × 22 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w4-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 18 kg, repos 90 s.",
            "targetLoadText": "2 × 18 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w4-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 10 à 6 kg, repos 75-90 s.",
            "targetLoadText": "6 kg",
            "restText": "75-90 s",
            "sets": 3,
            "reps": 10
          },
          {
            "id": "strength-w4-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Reprise, calibration, base technique",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "badminton-w4-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w4-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w4-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w4-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w4-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w4-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 30-40 min zone 2 + 4 × 20 s accélérations. • Substitut SkiErg : 3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur. • Burpee Broad Jumps : 4 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Reprise, calibration, base technique",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w4-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w4-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "30-40 min zone 2 + 4 × 20 s accélérations.",
            "sets": 4,
            "durationSec": 20
          },
          {
            "id": "run-w4-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur.",
            "restText": "90 s après le rameur",
            "rpeTarget": "RPE 6"
          },
          {
            "id": "run-w4-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "4 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "run-w4-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w4-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w4-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Reprise, calibration, base technique",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "recovery-w4-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w4-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w4-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 70,
        "rpeTarget": "RPE 6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 3. • Intensité : 60-70 %. • Repos : 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Reprise, calibration, base technique",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w4-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w4-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "3."
          },
          {
            "id": "hyrox-w4-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "60-70 %."
          },
          {
            "id": "hyrox-w4-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "2 min entre blocs."
          },
          {
            "id": "hyrox-w4-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w4-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 3 tours : poulie bras tendus 15 reps RPE 6 + rameur 500 m RPE 7 ; repos 90 s après le rameur.",
            "restText": "90 s après le rameur",
            "rpeTarget": "RPE 6"
          },
          {
            "id": "hyrox-w4-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 170 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "170 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w4-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 120 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "120 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w4-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w4-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "60-70 min."
          },
          {
            "id": "hyrox-w4-11-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 11,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w4-12-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 12,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w4-13-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 13,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w4-14-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 14,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w4-15-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 15,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "5": {
    "week": 5,
    "dateRange": "25 mai au 31 mai",
    "phaseTitle": "Phase 2 — Base aérobie + force propre",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "rest-w5-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w5-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w5-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 220 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 160 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 140 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "strength-w5-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w5-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 220 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "220 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w5-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 160 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "160 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w5-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 140 kg, repos 2 min 30.",
            "targetLoadText": "140 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w5-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 24 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "24 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w5-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 26 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 26 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w5-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 20 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 20 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w5-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "5 × 15 à 6 kg, repos 75-90 s.",
            "targetLoadText": "6 kg",
            "restText": "75-90 s",
            "sets": 5,
            "reps": 15
          },
          {
            "id": "strength-w5-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w5-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "badminton-w5-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w5-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w5-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w5-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w5-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w5-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 5 × 1 km à 5'20-5'40/km + 250 m rameur entre blocs, repos 90 s. • Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s. • Burpee Broad Jumps : 4 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Base aérobie + force propre",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w5-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w5-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "5 × 1 km à 5'20-5'40/km + 250 m rameur entre blocs, repos 90 s.",
            "restText": "90 s",
            "sets": 5,
            "distanceM": 1000
          },
          {
            "id": "run-w5-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "run-w5-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "4 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "run-w5-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w5-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w5-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "recovery-w5-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w5-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w5-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Base aérobie + force propre",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w5-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w5-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w5-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w5-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w5-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w5-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "hyrox-w5-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 200 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "200 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w5-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 140 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "140 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w5-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 40 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w5-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w5-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w5-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w5-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w5-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w5-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w5-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w5-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "6": {
    "week": 6,
    "dateRange": "1 juin au 7 juin",
    "phaseTitle": "Phase 2 — Base aérobie + force propre",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "rest-w6-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w6-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w6-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 225 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 165 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 145 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "strength-w6-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w6-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 225 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "225 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w6-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 165 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "165 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w6-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 145 kg, repos 2 min 30.",
            "targetLoadText": "145 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w6-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 24 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "24 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w6-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 28 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 28 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w6-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 20 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 20 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w6-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 20 à 6 kg, repos 75-90 s.",
            "targetLoadText": "6 kg",
            "restText": "75-90 s",
            "sets": 4,
            "reps": 20
          },
          {
            "id": "strength-w6-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w6-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "badminton-w6-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w6-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w6-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w6-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w6-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w6-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 5 × 1 km à 5'15-5'35/km + 250 m rameur, repos 90 s. • Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s. • Burpee Broad Jumps : 4 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Base aérobie + force propre",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w6-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w6-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "5 × 1 km à 5'15-5'35/km + 250 m rameur, repos 90 s.",
            "restText": "90 s",
            "sets": 5,
            "distanceM": 1000
          },
          {
            "id": "run-w6-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "run-w6-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "4 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "run-w6-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w6-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w6-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "recovery-w6-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w6-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w6-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Base aérobie + force propre",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w6-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w6-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w6-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w6-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w6-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w6-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "hyrox-w6-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 205 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "205 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w6-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 145 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "145 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w6-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 40 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w6-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w6-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w6-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w6-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w6-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w6-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w6-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w6-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "7": {
    "week": 7,
    "dateRange": "8 juin au 14 juin",
    "phaseTitle": "Phase 2 — Base aérobie + force propre",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "rest-w7-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w7-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w7-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 230 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 170 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "strength-w7-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w7-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 230 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "230 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w7-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 170 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "170 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w7-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w7-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 26 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "26 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w7-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 28 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 28 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w7-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 22 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 22 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w7-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "5 × 20 à 6 kg, repos 75-90 s.",
            "targetLoadText": "6 kg",
            "restText": "75-90 s",
            "sets": 5,
            "reps": 20
          },
          {
            "id": "strength-w7-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w7-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "badminton-w7-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w7-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w7-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w7-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w7-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w7-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 6 × 1 km à 5'15-5'35/km, repos 75-90 s. • Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s. • Burpee Broad Jumps : 4 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Base aérobie + force propre",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w7-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w7-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "6 × 1 km à 5'15-5'35/km, repos 75-90 s.",
            "restText": "75-90 s",
            "sets": 6,
            "distanceM": 1000
          },
          {
            "id": "run-w7-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "run-w7-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "4 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "run-w7-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w7-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w7-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Base aérobie + force propre"
        ],
        "exercises": [
          {
            "id": "recovery-w7-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w7-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w7-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 6. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Base aérobie + force propre",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w7-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w7-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "6."
          },
          {
            "id": "hyrox-w7-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w7-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w7-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w7-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "hyrox-w7-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 210 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "210 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w7-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 150 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "150 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w7-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 40 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w7-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w7-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 100 m à 2 × 22 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 22 kg",
            "sets": 2,
            "reps": 22
          },
          {
            "id": "hyrox-w7-12-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 12,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w7-13-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 13,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w7-14-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 14,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w7-15-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 15,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w7-16-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 16,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w7-17-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 17,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w7-18-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 18,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "8": {
    "week": 8,
    "dateRange": "15 juin au 21 juin",
    "phaseTitle": "Phase 2 — Base aérobie + force propre",
    "status": "semaine allégée. Volume réduit, technique propre, pas de dette de fatigue.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Base aérobie + force propre",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "rest-w8-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w8-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w8-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 200 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 140 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 125 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Base aérobie + force propre",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "strength-w8-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w8-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 200 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "200 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w8-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 140 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "140 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w8-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 125 kg, repos 2 min.",
            "targetLoadText": "125 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w8-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 20 kg total, repos 90 s.",
            "targetLoadText": "20 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w8-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 24 kg, repos 90 s.",
            "targetLoadText": "2 × 24 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w8-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 18 kg, repos 90 s.",
            "targetLoadText": "2 × 18 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w8-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 12 à 6 kg, repos 75-90 s.",
            "targetLoadText": "6 kg",
            "restText": "75-90 s",
            "sets": 3,
            "reps": 12
          },
          {
            "id": "strength-w8-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Base aérobie + force propre",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "badminton-w8-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w8-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w8-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w8-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w8-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w8-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 40 min zone 2 + 3 × 500 m souples. • Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s. • Burpee Broad Jumps : 4 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Base aérobie + force propre",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w8-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w8-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "40 min zone 2 + 3 × 500 m souples.",
            "sets": 3,
            "distanceM": 500
          },
          {
            "id": "run-w8-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "run-w8-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "4 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "run-w8-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w8-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w8-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Base aérobie + force propre",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "recovery-w8-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w8-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w8-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 70,
        "rpeTarget": "RPE 7-8",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 4. • Intensité : 60-70 %. • Repos : 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Base aérobie + force propre",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w8-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w8-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "4."
          },
          {
            "id": "hyrox-w8-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "60-70 %."
          },
          {
            "id": "hyrox-w8-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "2 min entre blocs."
          },
          {
            "id": "hyrox-w8-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w8-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "hyrox-w8-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 180 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "180 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w8-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 120 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "120 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w8-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 40 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w8-10-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 10,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w8-11-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 11,
            "repsText": "60-70 min."
          },
          {
            "id": "hyrox-w8-12-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 12,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w8-13-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 13,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w8-14-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 14,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w8-15-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 15,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w8-16-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 16,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "9": {
    "week": 9,
    "dateRange": "22 juin au 28 juin",
    "phaseTitle": "Phase 3 — Force spécifique + perte de poids contrôlée",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "rest-w9-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w9-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w9-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 6 × 10 m à 230 kg, repos 2 min 30, RPE 7. • Sled Pull : 6 × 10 m à 170 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "strength-w9-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w9-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "6 × 10 m à 230 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "230 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w9-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "6 × 10 m à 170 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "170 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w9-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w9-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 26 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "26 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w9-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 28 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 28 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w9-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 22 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 22 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w9-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 25 à 6 kg, repos 90 s.",
            "targetLoadText": "6 kg",
            "restText": "90 s",
            "sets": 4,
            "reps": 25
          },
          {
            "id": "strength-w9-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w9-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "badminton-w9-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w9-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w9-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w9-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w9-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w9-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 5 × 1 km à 5'10-5'30/km + 10 wall balls, repos 90 s. • Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s. • Burpee Broad Jumps : 5 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Force spécifique + perte de poids contrôlée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w9-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w9-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "5 × 1 km à 5'10-5'30/km + 10 wall balls, repos 90 s.",
            "restText": "90 s",
            "sets": 5,
            "distanceM": 1000
          },
          {
            "id": "run-w9-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "run-w9-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "5 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "run-w9-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w9-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w9-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "recovery-w9-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w9-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w9-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Force spécifique + perte de poids contrôlée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w9-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w9-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w9-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w9-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w9-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w9-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "hyrox-w9-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 210 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "210 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w9-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 150 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "150 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w9-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 60 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w9-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w9-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w9-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w9-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w9-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w9-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w9-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w9-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "10": {
    "week": 10,
    "dateRange": "29 juin au 5 juil.",
    "phaseTitle": "Phase 3 — Force spécifique + perte de poids contrôlée",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "rest-w10-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w10-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w10-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 6 × 10 m à 235 kg, repos 2 min 30, RPE 7. • Sled Pull : 6 × 10 m à 175 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 155 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "strength-w10-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w10-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "6 × 10 m à 235 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "235 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w10-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "6 × 10 m à 175 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "175 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w10-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 155 kg, repos 2 min 30.",
            "targetLoadText": "155 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w10-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w10-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w10-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 22 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 22 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w10-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "5 × 25 à 6 kg, repos 90 s.",
            "targetLoadText": "6 kg",
            "restText": "90 s",
            "sets": 5,
            "reps": 25
          },
          {
            "id": "strength-w10-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w10-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "badminton-w10-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w10-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w10-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w10-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w10-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w10-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 6 × 1 km à 5'10-5'30/km, repos 75 s. • Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s. • Burpee Broad Jumps : 5 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Force spécifique + perte de poids contrôlée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w10-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w10-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "6 × 1 km à 5'10-5'30/km, repos 75 s.",
            "restText": "75 s",
            "sets": 6,
            "distanceM": 1000
          },
          {
            "id": "run-w10-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "run-w10-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "5 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "run-w10-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w10-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w10-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "recovery-w10-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w10-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w10-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 6. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Force spécifique + perte de poids contrôlée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w10-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w10-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "6."
          },
          {
            "id": "hyrox-w10-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w10-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w10-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w10-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "hyrox-w10-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 215 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "215 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w10-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 155 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "155 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w10-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 60 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w10-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w10-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 150 m à 2 × 22 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 22 kg",
            "sets": 2,
            "reps": 22
          },
          {
            "id": "hyrox-w10-12-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 12,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w10-13-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 13,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w10-14-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 14,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w10-15-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 15,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w10-16-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 16,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w10-17-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 17,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w10-18-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 18,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "11": {
    "week": 11,
    "dateRange": "6 juil. au 12 juil.",
    "phaseTitle": "Phase 3 — Force spécifique + perte de poids contrôlée",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "rest-w11-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w11-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w11-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 6 × 10 m à 240 kg, repos 2 min 30, RPE 7. • Sled Pull : 6 × 10 m à 180 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 160 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "strength-w11-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w11-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "6 × 10 m à 240 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "240 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w11-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "6 × 10 m à 180 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "180 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w11-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 160 kg, repos 2 min 30.",
            "targetLoadText": "160 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w11-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w11-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w11-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w11-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 30 à 6 kg, repos 90 s.",
            "targetLoadText": "6 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 30
          },
          {
            "id": "strength-w11-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w11-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "badminton-w11-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w11-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w11-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w11-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w11-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w11-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 6 × 1 km à 5'10-5'25/km + 250 m rameur, repos 75 s. • Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s. • Burpee Broad Jumps : 5 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Force spécifique + perte de poids contrôlée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w11-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w11-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "6 × 1 km à 5'10-5'25/km + 250 m rameur, repos 75 s.",
            "restText": "75 s",
            "sets": 6,
            "distanceM": 1000
          },
          {
            "id": "run-w11-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "run-w11-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "5 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "run-w11-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w11-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w11-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Force spécifique + perte de poids contrôlée"
        ],
        "exercises": [
          {
            "id": "recovery-w11-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w11-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w11-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 6. • Intensité : 70-75 %. • Repos : 90 s à 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Force spécifique + perte de poids contrôlée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w11-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w11-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "6."
          },
          {
            "id": "hyrox-w11-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "70-75 %."
          },
          {
            "id": "hyrox-w11-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s à 2 min entre blocs."
          },
          {
            "id": "hyrox-w11-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w11-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "hyrox-w11-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 220 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "220 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w11-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 160 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "160 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w11-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 60 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w11-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w11-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 150 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w11-12-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 12,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w11-13-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 13,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w11-14-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 14,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w11-15-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 15,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w11-16-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 16,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w11-17-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 17,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w11-18-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 18,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "12": {
    "week": 12,
    "dateRange": "13 juil. au 19 juil.",
    "phaseTitle": "Phase 3 — Force spécifique + perte de poids contrôlée",
    "status": "semaine allégée. Volume réduit, technique propre, pas de dette de fatigue.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Force spécifique + perte de poids contrôlée",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "rest-w12-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w12-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w12-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 205 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 145 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 130 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Force spécifique + perte de poids contrôlée",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "strength-w12-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w12-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 205 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "205 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w12-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 145 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "145 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w12-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 130 kg, repos 2 min.",
            "targetLoadText": "130 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w12-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 22 kg total, repos 90 s.",
            "targetLoadText": "22 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w12-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 24 kg, repos 90 s.",
            "targetLoadText": "2 × 24 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w12-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 20 kg, repos 90 s.",
            "targetLoadText": "2 × 20 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w12-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 15 à 6 kg, repos 90 s.",
            "targetLoadText": "6 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 15
          },
          {
            "id": "strength-w12-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Force spécifique + perte de poids contrôlée",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "badminton-w12-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w12-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w12-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w12-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w12-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w12-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 45 min zone 2, aucune intensité. • Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s. • Burpee Broad Jumps : 5 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Force spécifique + perte de poids contrôlée",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w12-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w12-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "45 min zone 2, aucune intensité."
          },
          {
            "id": "run-w12-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "run-w12-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "5 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "run-w12-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w12-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w12-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Force spécifique + perte de poids contrôlée",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "recovery-w12-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w12-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w12-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 70,
        "rpeTarget": "RPE 7-8",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 4. • Intensité : 60-70 %. • Repos : 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Force spécifique + perte de poids contrôlée",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w12-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w12-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "4."
          },
          {
            "id": "hyrox-w12-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "60-70 %."
          },
          {
            "id": "hyrox-w12-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "2 min entre blocs."
          },
          {
            "id": "hyrox-w12-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w12-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 4 tours : poulie bras tendus 12-15 reps + rameur 250 m ; transitions 20-30 s."
          },
          {
            "id": "hyrox-w12-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 185 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "185 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w12-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 125 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "125 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w12-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 60 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w12-10-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 10,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w12-11-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 11,
            "repsText": "60-70 min."
          },
          {
            "id": "hyrox-w12-12-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 12,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w12-13-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 13,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w12-14-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 14,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w12-15-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 15,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w12-16-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 16,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "13": {
    "week": 13,
    "dateRange": "20 juil. au 26 juil.",
    "phaseTitle": "Phase 4 — Endurance de force",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "rest-w13-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w13-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w13-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 6 × 10 m à 225 kg, repos 2 min 30, RPE 7. • Sled Pull : 6 × 10 m à 170 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "strength-w13-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w13-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "6 × 10 m à 225 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "225 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w13-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "6 × 10 m à 170 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "170 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w13-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w13-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 26 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "26 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w13-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 28 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 28 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w13-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 22 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 22 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w13-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 25 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 4,
            "reps": 25
          },
          {
            "id": "strength-w13-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w13-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "badminton-w13-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w13-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w13-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w13-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w13-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w13-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 6 × (800 m course + 500 m rameur), repos 75 s. • Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides. • Burpee Broad Jumps : 5 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Endurance de force",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w13-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w13-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "6 × (800 m course + 500 m rameur), repos 75 s.",
            "restText": "75 s"
          },
          {
            "id": "run-w13-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "run-w13-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "5 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "run-w13-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w13-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w13-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "recovery-w13-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w13-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w13-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 6. • Intensité : 75-80 %. • Repos : 75-90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Endurance de force",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w13-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w13-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "6."
          },
          {
            "id": "hyrox-w13-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w13-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "75-90 s entre blocs."
          },
          {
            "id": "hyrox-w13-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w13-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "hyrox-w13-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 205 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "205 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w13-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 150 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "150 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w13-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 60 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w13-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w13-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 150 m à 2 × 22 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 22 kg",
            "sets": 2,
            "reps": 22
          },
          {
            "id": "hyrox-w13-12-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 12,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w13-13-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 13,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w13-14-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 14,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w13-15-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 15,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w13-16-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 16,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w13-17-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 17,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w13-18-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 18,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "14": {
    "week": 14,
    "dateRange": "27 juil. au 2 août",
    "phaseTitle": "Phase 4 — Endurance de force",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "rest-w14-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w14-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w14-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 6 × 10 m à 235 kg, repos 2 min 30, RPE 7. • Sled Pull : 6 × 10 m à 175 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "strength-w14-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w14-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "6 × 10 m à 235 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "235 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w14-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "6 × 10 m à 175 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "175 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w14-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w14-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w14-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w14-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w14-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 35 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "strength-w14-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w14-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "badminton-w14-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w14-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w14-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w14-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w14-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w14-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 6 × (1 km course + 12 burpees broad jumps), repos 90 s. • Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides. • Burpee Broad Jumps : 5 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Endurance de force",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w14-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w14-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "6 × (1 km course + 12 burpees broad jumps), repos 90 s.",
            "restText": "90 s"
          },
          {
            "id": "run-w14-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "run-w14-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "5 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "run-w14-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w14-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w14-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "recovery-w14-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w14-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w14-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 6. • Intensité : 75-80 %. • Repos : 75-90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Endurance de force",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w14-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w14-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "6."
          },
          {
            "id": "hyrox-w14-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w14-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "75-90 s entre blocs."
          },
          {
            "id": "hyrox-w14-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w14-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "hyrox-w14-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 215 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "215 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w14-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 155 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "155 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w14-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 60 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w14-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w14-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 150 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w14-12-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 12,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w14-13-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 13,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w14-14-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 14,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w14-15-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 15,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w14-16-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 16,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w14-17-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 17,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w14-18-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 18,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "15": {
    "week": 15,
    "dateRange": "3 août au 9 août",
    "phaseTitle": "Phase 4 — Endurance de force",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "rest-w15-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w15-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w15-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 6 × 10 m à 240 kg, repos 2 min 30, RPE 7. • Sled Pull : 6 × 10 m à 180 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 155 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "strength-w15-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w15-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "6 × 10 m à 240 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "240 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w15-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "6 × 10 m à 180 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "180 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "strength-w15-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 155 kg, repos 2 min 30.",
            "targetLoadText": "155 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w15-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w15-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w15-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w15-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "2 × 40 + 1 × 20 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 2,
            "reps": 40
          },
          {
            "id": "strength-w15-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w15-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "badminton-w15-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w15-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w15-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w15-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w15-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w15-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 7 × 1 km à 5'15-5'35/km, repos 60-75 s. • Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides. • Burpee Broad Jumps : 5 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Endurance de force",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w15-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w15-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "7 × 1 km à 5'15-5'35/km, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 7,
            "distanceM": 1000
          },
          {
            "id": "run-w15-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "run-w15-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "5 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "run-w15-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w15-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w15-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Endurance de force"
        ],
        "exercises": [
          {
            "id": "recovery-w15-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w15-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w15-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 7. • Intensité : 75-80 %. • Repos : 75-90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Endurance de force",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w15-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w15-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "7."
          },
          {
            "id": "hyrox-w15-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w15-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "75-90 s entre blocs."
          },
          {
            "id": "hyrox-w15-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w15-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "hyrox-w15-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 220 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "220 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w15-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 160 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "160 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w15-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 60 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w15-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w15-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 150 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w15-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 40 m à 15 kg, repos debout si besoin.",
            "targetLoadText": "15 kg"
          },
          {
            "id": "hyrox-w15-13-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 13,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w15-14-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 14,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w15-15-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 15,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w15-16-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 16,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w15-17-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 17,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w15-18-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 18,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w15-19-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 19,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "16": {
    "week": 16,
    "dateRange": "10 août au 16 août",
    "phaseTitle": "Phase 4 — Endurance de force",
    "status": "semaine allégée. Volume réduit, technique propre, pas de dette de fatigue.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Endurance de force",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "rest-w16-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w16-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w16-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 205 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 145 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 130 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Endurance de force",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "strength-w16-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w16-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 205 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "205 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w16-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 145 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "145 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w16-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 130 kg, repos 2 min.",
            "targetLoadText": "130 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w16-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 22 kg total, repos 90 s.",
            "targetLoadText": "22 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w16-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 24 kg, repos 90 s.",
            "targetLoadText": "2 × 24 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w16-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 20 kg, repos 90 s.",
            "targetLoadText": "2 × 20 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w16-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 15 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 3,
            "reps": 15
          },
          {
            "id": "strength-w16-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Endurance de force",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "badminton-w16-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w16-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w16-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w16-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w16-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w16-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 4 × 600 m facile + mobilité longue. • Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides. • Burpee Broad Jumps : 5 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Endurance de force",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w16-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w16-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "4 × 600 m facile + mobilité longue.",
            "sets": 4,
            "distanceM": 600
          },
          {
            "id": "run-w16-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "run-w16-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "5 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "run-w16-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w16-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w16-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Endurance de force",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "recovery-w16-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w16-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w16-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 70,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 60-70 %. • Repos : 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Endurance de force",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w16-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w16-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w16-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "60-70 %."
          },
          {
            "id": "hyrox-w16-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "2 min entre blocs."
          },
          {
            "id": "hyrox-w16-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w16-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "hyrox-w16-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 185 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "185 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w16-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 125 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "125 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w16-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 60 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w16-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w16-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w16-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "60-70 min."
          },
          {
            "id": "hyrox-w16-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w16-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w16-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w16-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w16-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "17": {
    "week": 17,
    "dateRange": "17 août au 23 août",
    "phaseTitle": "Phase 5 — Spécifique HYROX 1",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "rest-w17-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w17-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w17-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 230 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 170 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 145 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "strength-w17-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w17-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 230 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "230 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w17-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 170 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "170 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w17-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 145 kg, repos 2 min 30.",
            "targetLoadText": "145 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w17-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 26 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "26 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w17-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 28 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 28 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w17-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w17-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 30 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 4,
            "reps": 30
          },
          {
            "id": "strength-w17-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w17-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "badminton-w17-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w17-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w17-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w17-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w17-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w17-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 6 × (1 km course + station courte), repos 75 s. • Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Spécifique HYROX 1",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w17-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w17-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "6 × (1 km course + station courte), repos 75 s.",
            "restText": "75 s"
          },
          {
            "id": "run-w17-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "run-w17-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w17-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w17-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w17-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "recovery-w17-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w17-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w17-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 6. • Intensité : 75-80 %. • Repos : 75-90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Spécifique HYROX 1",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w17-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w17-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "6."
          },
          {
            "id": "hyrox-w17-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w17-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "75-90 s entre blocs."
          },
          {
            "id": "hyrox-w17-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w17-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "hyrox-w17-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 210 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "210 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w17-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 150 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "150 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w17-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w17-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w17-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w17-12-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 12,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w17-13-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 13,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w17-14-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 14,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w17-15-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 15,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w17-16-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 16,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w17-17-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 17,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w17-18-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 18,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "18": {
    "week": 18,
    "dateRange": "24 août au 30 août",
    "phaseTitle": "Phase 5 — Spécifique HYROX 1",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "rest-w18-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w18-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w18-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 240 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 180 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "strength-w18-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w18-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 240 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "240 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w18-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 180 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "180 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w18-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w18-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w18-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w18-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w18-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 40 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 3,
            "reps": 40
          },
          {
            "id": "strength-w18-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w18-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "badminton-w18-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w18-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w18-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w18-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w18-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w18-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 7 × (1 km course + station courte), repos 75 s. • Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Spécifique HYROX 1",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w18-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w18-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "7 × (1 km course + station courte), repos 75 s.",
            "restText": "75 s"
          },
          {
            "id": "run-w18-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "run-w18-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w18-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w18-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w18-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "recovery-w18-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w18-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w18-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 7. • Intensité : 75-80 %. • Repos : 75-90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Spécifique HYROX 1",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w18-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w18-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "7."
          },
          {
            "id": "hyrox-w18-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w18-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "75-90 s entre blocs."
          },
          {
            "id": "hyrox-w18-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w18-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "hyrox-w18-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 220 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "220 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w18-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 160 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "160 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w18-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w18-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w18-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w18-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 60 m à 15 kg, repos debout si besoin.",
            "targetLoadText": "15 kg"
          },
          {
            "id": "hyrox-w18-13-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 13,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w18-14-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 14,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w18-15-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 15,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w18-16-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 16,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w18-17-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 17,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w18-18-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 18,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w18-19-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 19,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "19": {
    "week": 19,
    "dateRange": "31 août au 6 sept.",
    "phaseTitle": "Phase 5 — Spécifique HYROX 1",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "rest-w19-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w19-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w19-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 240 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 180 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "strength-w19-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w19-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 240 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "240 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w19-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 180 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "180 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w19-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w19-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w19-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w19-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w19-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 30 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 4,
            "reps": 30
          },
          {
            "id": "strength-w19-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w19-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "badminton-w19-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w19-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w19-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w19-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w19-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w19-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 7 × 1 km allure HYROX compromise 5'20-5'45/km, repos 60 s. • Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Spécifique HYROX 1",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w19-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w19-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "7 × 1 km allure HYROX compromise 5'20-5'45/km, repos 60 s.",
            "restText": "60 s",
            "sets": 7,
            "distanceM": 1000
          },
          {
            "id": "run-w19-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "run-w19-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w19-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w19-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w19-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Spécifique HYROX 1"
        ],
        "exercises": [
          {
            "id": "recovery-w19-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w19-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w19-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 7. • Intensité : 75-80 %. • Repos : 75-90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Spécifique HYROX 1",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w19-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w19-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "7."
          },
          {
            "id": "hyrox-w19-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w19-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "75-90 s entre blocs."
          },
          {
            "id": "hyrox-w19-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w19-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "hyrox-w19-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 220 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "220 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w19-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 160 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "160 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w19-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w19-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w19-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w19-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 60 m à 15 kg, repos debout si besoin.",
            "targetLoadText": "15 kg"
          },
          {
            "id": "hyrox-w19-13-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 13,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w19-14-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 14,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w19-15-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 15,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w19-16-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 16,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w19-17-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 17,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w19-18-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 18,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w19-19-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 19,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "20": {
    "week": 20,
    "dateRange": "7 sept. au 13 sept.",
    "phaseTitle": "Phase 5 — Spécifique HYROX 1",
    "status": "semaine allégée. Volume réduit, technique propre, pas de dette de fatigue.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Spécifique HYROX 1",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "rest-w20-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w20-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w20-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 210 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 150 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 125 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Spécifique HYROX 1",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "strength-w20-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w20-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 210 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "210 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w20-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 150 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "150 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w20-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 125 kg, repos 2 min.",
            "targetLoadText": "125 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w20-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 22 kg total, repos 90 s.",
            "targetLoadText": "22 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w20-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 24 kg, repos 90 s.",
            "targetLoadText": "2 × 24 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w20-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 20 kg, repos 90 s.",
            "targetLoadText": "2 × 20 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w20-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 40 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 3,
            "reps": 40
          },
          {
            "id": "strength-w20-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Spécifique HYROX 1",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "badminton-w20-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w20-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w20-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w20-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w20-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w20-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 45 min zone 2 + 3 lignes droites. • Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Spécifique HYROX 1",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w20-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w20-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "45 min zone 2 + 3 lignes droites."
          },
          {
            "id": "run-w20-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "run-w20-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w20-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w20-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w20-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Spécifique HYROX 1",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "recovery-w20-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w20-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w20-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 70,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 60-70 %. • Repos : 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Spécifique HYROX 1",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w20-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w20-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w20-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "60-70 %."
          },
          {
            "id": "hyrox-w20-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "2 min entre blocs."
          },
          {
            "id": "hyrox-w20-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w20-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation : 4 × (250 m rameur + 12 tirages bras tendus), transitions rapides."
          },
          {
            "id": "hyrox-w20-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 190 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "190 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w20-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 130 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "130 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w20-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w20-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w20-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w20-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "60-70 min."
          },
          {
            "id": "hyrox-w20-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w20-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w20-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w20-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w20-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "21": {
    "week": 21,
    "dateRange": "14 sept. au 20 sept.",
    "phaseTitle": "Phase 6 — Spécifique HYROX 2",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "rest-w21-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w21-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w21-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 235 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 175 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 145 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "strength-w21-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w21-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 235 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "235 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w21-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 175 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "175 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w21-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 145 kg, repos 2 min 30.",
            "targetLoadText": "145 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w21-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 26 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "26 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w21-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 28 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 28 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w21-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w21-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 30 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 4,
            "reps": 30
          },
          {
            "id": "strength-w21-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w21-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "badminton-w21-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w21-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w21-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w21-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w21-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w21-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 7 × (1 km + 250 m rameur), repos 60-75 s. • Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Spécifique HYROX 2",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w21-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w21-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "7 × (1 km + 250 m rameur), repos 60-75 s.",
            "restText": "60-75 s"
          },
          {
            "id": "run-w21-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "run-w21-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w21-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w21-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w21-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "recovery-w21-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w21-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w21-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 7. • Intensité : 80-85 %. • Repos : 60-75 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Spécifique HYROX 2",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w21-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w21-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "7."
          },
          {
            "id": "hyrox-w21-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "80-85 %."
          },
          {
            "id": "hyrox-w21-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "60-75 s entre blocs."
          },
          {
            "id": "hyrox-w21-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w21-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "hyrox-w21-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 215 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "215 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w21-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 155 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "155 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w21-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w21-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w21-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w21-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 60 m à 20 kg, repos debout si besoin.",
            "targetLoadText": "20 kg"
          },
          {
            "id": "hyrox-w21-13-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 13,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w21-14-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 14,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w21-15-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 15,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w21-16-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 16,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w21-17-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 17,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w21-18-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 18,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w21-19-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 19,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "22": {
    "week": 22,
    "dateRange": "21 sept. au 27 sept.",
    "phaseTitle": "Phase 6 — Spécifique HYROX 2",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "rest-w22-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w22-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w22-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 240 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 180 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "strength-w22-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w22-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 240 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "240 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w22-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 180 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "180 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w22-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w22-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w22-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w22-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w22-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 40 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 3,
            "reps": 40
          },
          {
            "id": "strength-w22-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w22-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "badminton-w22-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w22-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w22-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w22-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w22-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w22-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 7 × (1 km + 10 BBJ), repos 60-75 s. • Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Spécifique HYROX 2",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w22-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w22-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "7 × (1 km + 10 BBJ), repos 60-75 s.",
            "restText": "60-75 s"
          },
          {
            "id": "run-w22-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "run-w22-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w22-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w22-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w22-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "recovery-w22-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w22-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w22-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 7. • Intensité : 80-85 %. • Repos : 60-75 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Spécifique HYROX 2",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w22-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w22-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "7."
          },
          {
            "id": "hyrox-w22-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "80-85 %."
          },
          {
            "id": "hyrox-w22-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "60-75 s entre blocs."
          },
          {
            "id": "hyrox-w22-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w22-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "hyrox-w22-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 220 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "220 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w22-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 160 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "160 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w22-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w22-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w22-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w22-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 60 m à 20 kg, repos debout si besoin.",
            "targetLoadText": "20 kg"
          },
          {
            "id": "hyrox-w22-13-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 13,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w22-14-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 14,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w22-15-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 15,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w22-16-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 16,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w22-17-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 17,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w22-18-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 18,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w22-19-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 19,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "23": {
    "week": 23,
    "dateRange": "28 sept. au 4 oct.",
    "phaseTitle": "Phase 6 — Spécifique HYROX 2",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "rest-w23-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w23-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w23-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 245 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 185 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "strength-w23-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w23-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 245 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "245 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w23-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 185 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "185 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w23-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w23-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w23-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w23-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w23-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 30 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 4,
            "reps": 30
          },
          {
            "id": "strength-w23-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w23-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "badminton-w23-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w23-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w23-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w23-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w23-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w23-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 8 × 1 km à 5'20-5'45/km, repos 60 s. • Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Spécifique HYROX 2",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w23-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w23-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "8 × 1 km à 5'20-5'45/km, repos 60 s.",
            "restText": "60 s",
            "sets": 8,
            "distanceM": 1000
          },
          {
            "id": "run-w23-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "run-w23-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w23-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w23-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w23-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Spécifique HYROX 2"
        ],
        "exercises": [
          {
            "id": "recovery-w23-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w23-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w23-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 8. • Intensité : 80-85 %. • Repos : 60-75 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Spécifique HYROX 2",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w23-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w23-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "8."
          },
          {
            "id": "hyrox-w23-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "80-85 %."
          },
          {
            "id": "hyrox-w23-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "60-75 s entre blocs."
          },
          {
            "id": "hyrox-w23-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w23-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "hyrox-w23-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 225 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "225 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w23-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 165 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "165 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w23-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w23-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w23-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w23-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 60 m à 20 kg, repos debout si besoin.",
            "targetLoadText": "20 kg"
          },
          {
            "id": "hyrox-w23-13-bloc-8",
            "block": "Blocs HYROX",
            "name": "Bloc 8",
            "order": 13,
            "repsText": "1 km course + Wall Balls : 60 reps à 6 kg, fractionner proprement.",
            "targetLoadText": "6 kg"
          },
          {
            "id": "hyrox-w23-14-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 14,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w23-15-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 15,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w23-16-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 16,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w23-17-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 17,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w23-18-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 18,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w23-19-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 19,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w23-20-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 20,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "24": {
    "week": 24,
    "dateRange": "5 oct. au 11 oct.",
    "phaseTitle": "Phase 6 — Spécifique HYROX 2",
    "status": "semaine allégée. Volume réduit, technique propre, pas de dette de fatigue.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Spécifique HYROX 2",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "rest-w24-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w24-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w24-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 210 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 150 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 125 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Spécifique HYROX 2",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "strength-w24-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w24-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 210 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "210 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w24-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 150 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "150 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w24-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 125 kg, repos 2 min.",
            "targetLoadText": "125 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w24-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 22 kg total, repos 90 s.",
            "targetLoadText": "22 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w24-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 24 kg, repos 90 s.",
            "targetLoadText": "2 × 24 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w24-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 20 kg, repos 90 s.",
            "targetLoadText": "2 × 20 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w24-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 40 à 6 kg, repos 90-120 s.",
            "targetLoadText": "6 kg",
            "restText": "90-120 s",
            "sets": 3,
            "reps": 40
          },
          {
            "id": "strength-w24-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Spécifique HYROX 2",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "badminton-w24-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w24-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w24-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w24-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w24-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w24-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 5 × 500 m facile + 250 m rameur. • Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Spécifique HYROX 2",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w24-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w24-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "5 × 500 m facile + 250 m rameur.",
            "sets": 5,
            "distanceM": 500
          },
          {
            "id": "run-w24-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "run-w24-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w24-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w24-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w24-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Spécifique HYROX 2",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "recovery-w24-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w24-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w24-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 70,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 60-70 %. • Repos : 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Spécifique HYROX 2",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w24-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w24-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w24-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "60-70 %."
          },
          {
            "id": "hyrox-w24-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "2 min entre blocs."
          },
          {
            "id": "hyrox-w24-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w24-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "hyrox-w24-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 190 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "190 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w24-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 130 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "130 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w24-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w24-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w24-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w24-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "60-70 min."
          },
          {
            "id": "hyrox-w24-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w24-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w24-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w24-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w24-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "25": {
    "week": 25,
    "dateRange": "12 oct. au 18 oct.",
    "phaseTitle": "Phase 7 — Simulations progressives",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "rest-w25-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w25-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w25-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 230 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 170 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 140 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "strength-w25-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w25-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 230 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "230 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w25-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 170 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "170 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w25-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 140 kg, repos 2 min 30.",
            "targetLoadText": "140 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w25-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 24 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "24 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w25-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 26 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 26 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w25-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w25-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "50 reps fractionnées 25/15/10, repos court selon simulation."
          },
          {
            "id": "strength-w25-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w25-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "badminton-w25-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w25-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w25-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w25-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w25-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w25-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 8 × 1 km progressifs, 5'35 vers 5'15/km, repos 60 s. • Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Simulations progressives",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w25-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w25-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "8 × 1 km progressifs, 5'35 vers 5'15/km, repos 60 s.",
            "restText": "60 s",
            "sets": 8,
            "distanceM": 1000
          },
          {
            "id": "run-w25-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "run-w25-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w25-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w25-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w25-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "recovery-w25-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w25-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w25-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 8. • Intensité : 80-85 %. • Repos : 60-75 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Simulations progressives",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w25-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w25-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "8."
          },
          {
            "id": "hyrox-w25-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "80-85 %."
          },
          {
            "id": "hyrox-w25-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "60-75 s entre blocs."
          },
          {
            "id": "hyrox-w25-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w25-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "hyrox-w25-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 210 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "210 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w25-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 150 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "150 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w25-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w25-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w25-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w25-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 80 m à 20 kg, repos debout si besoin.",
            "targetLoadText": "20 kg"
          },
          {
            "id": "hyrox-w25-13-bloc-8",
            "block": "Blocs HYROX",
            "name": "Bloc 8",
            "order": 13,
            "repsText": "1 km course + Wall Balls : 80 reps à 6 kg, fractionner proprement.",
            "targetLoadText": "6 kg"
          },
          {
            "id": "hyrox-w25-14-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 14,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w25-15-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 15,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w25-16-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 16,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w25-17-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 17,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w25-18-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 18,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w25-19-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 19,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w25-20-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 20,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "26": {
    "week": 26,
    "dateRange": "19 oct. au 25 oct.",
    "phaseTitle": "Phase 7 — Simulations progressives",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "rest-w26-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w26-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w26-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 240 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 180 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 145 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "strength-w26-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w26-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 240 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "240 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w26-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 180 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "180 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w26-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 145 kg, repos 2 min 30.",
            "targetLoadText": "145 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w26-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 26 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "26 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w26-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 28 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 28 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w26-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w26-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "60 reps fractionnées, repos court selon simulation."
          },
          {
            "id": "strength-w26-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w26-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "badminton-w26-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w26-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w26-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w26-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w26-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w26-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 6 × (1 km + station), transitions rapides. • Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Simulations progressives",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w26-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w26-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "6 × (1 km + station), transitions rapides."
          },
          {
            "id": "run-w26-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "run-w26-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w26-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w26-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w26-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "recovery-w26-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w26-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w26-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 8. • Intensité : 80-85 %. • Repos : 60-75 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Simulations progressives",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w26-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w26-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "8."
          },
          {
            "id": "hyrox-w26-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "80-85 %."
          },
          {
            "id": "hyrox-w26-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "60-75 s entre blocs."
          },
          {
            "id": "hyrox-w26-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w26-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "hyrox-w26-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 220 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "220 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w26-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 160 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "160 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w26-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w26-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w26-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w26-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 80 m à 20 kg, repos debout si besoin.",
            "targetLoadText": "20 kg"
          },
          {
            "id": "hyrox-w26-13-bloc-8",
            "block": "Blocs HYROX",
            "name": "Bloc 8",
            "order": 13,
            "repsText": "1 km course + Wall Balls : 80 reps à 6 kg, fractionner proprement.",
            "targetLoadText": "6 kg"
          },
          {
            "id": "hyrox-w26-14-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 14,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w26-15-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 15,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w26-16-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 16,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w26-17-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 17,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w26-18-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 18,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w26-19-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 19,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w26-20-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 20,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "27": {
    "week": 27,
    "dateRange": "26 oct. au 1 nov.",
    "phaseTitle": "Phase 7 — Simulations progressives",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "rest-w27-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w27-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w27-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 245 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 185 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 150 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "strength-w27-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w27-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 245 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "245 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w27-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 185 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "185 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w27-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 150 kg, repos 2 min 30.",
            "targetLoadText": "150 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w27-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 28 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "28 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w27-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 30 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 30 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w27-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w27-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "80 reps fractionnées, repos court selon simulation."
          },
          {
            "id": "strength-w27-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w27-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "badminton-w27-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w27-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w27-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w27-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w27-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w27-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : Simulation run : 8 × 1 km à allure course contrôlée. • Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Simulations progressives",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w27-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w27-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "Simulation run : 8 × 1 km à allure course contrôlée.",
            "sets": 8,
            "distanceM": 1000
          },
          {
            "id": "run-w27-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "run-w27-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w27-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w27-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w27-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Simulations progressives"
        ],
        "exercises": [
          {
            "id": "recovery-w27-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w27-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w27-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 8. • Intensité : 80-85 %. • Repos : 60-75 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Simulations progressives",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w27-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w27-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "8."
          },
          {
            "id": "hyrox-w27-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "80-85 %."
          },
          {
            "id": "hyrox-w27-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "60-75 s entre blocs."
          },
          {
            "id": "hyrox-w27-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w27-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "hyrox-w27-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 225 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "225 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w27-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 165 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "165 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w27-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w27-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w27-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w27-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 80 m à 20 kg, repos debout si besoin.",
            "targetLoadText": "20 kg"
          },
          {
            "id": "hyrox-w27-13-bloc-8",
            "block": "Blocs HYROX",
            "name": "Bloc 8",
            "order": 13,
            "repsText": "1 km course + Wall Balls : 80 reps à 6 kg, fractionner proprement.",
            "targetLoadText": "6 kg"
          },
          {
            "id": "hyrox-w27-14-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 14,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w27-15-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 15,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w27-16-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 16,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w27-17-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 17,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w27-18-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 18,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w27-19-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 19,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w27-20-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 20,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "28": {
    "week": 28,
    "dateRange": "2 nov. au 8 nov.",
    "phaseTitle": "Phase 7 — Simulations progressives",
    "status": "semaine allégée. Volume réduit, technique propre, pas de dette de fatigue.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Simulations progressives",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "rest-w28-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w28-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w28-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 205 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 145 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 120 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Simulations progressives",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "strength-w28-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w28-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 205 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "205 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w28-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 145 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "145 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w28-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 120 kg, repos 2 min.",
            "targetLoadText": "120 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w28-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 20 kg total, repos 90 s.",
            "targetLoadText": "20 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w28-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 22 kg, repos 90 s.",
            "targetLoadText": "2 × 22 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w28-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 20 kg, repos 90 s.",
            "targetLoadText": "2 × 20 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w28-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "30 reps faciles, repos court selon simulation."
          },
          {
            "id": "strength-w28-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Simulations progressives",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "badminton-w28-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w28-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w28-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w28-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w28-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w28-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 40 min zone 2 + mobilité. • Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Simulations progressives",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w28-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w28-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "40 min zone 2 + mobilité."
          },
          {
            "id": "run-w28-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "run-w28-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w28-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w28-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w28-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Simulations progressives",
          "semaine allégée"
        ],
        "exercises": [
          {
            "id": "recovery-w28-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w28-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w28-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 70,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 60-70 %. • Repos : 2 min entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Simulations progressives",
          "semaine allégée",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w28-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w28-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w28-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "60-70 %."
          },
          {
            "id": "hyrox-w28-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "2 min entre blocs."
          },
          {
            "id": "hyrox-w28-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w28-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : Station simulation complète : 1000 m équivalent = 4 × 250 m rameur + 4 × 12 tirages bras tendus.",
            "sets": 4,
            "distanceM": 250
          },
          {
            "id": "hyrox-w28-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 185 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "185 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w28-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 125 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "125 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w28-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w28-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w28-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w28-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "60-70 min."
          },
          {
            "id": "hyrox-w28-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w28-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w28-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w28-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w28-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "29": {
    "week": 29,
    "dateRange": "9 nov. au 15 nov.",
    "phaseTitle": "Phase 8 — Pic de forme",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "rest-w29-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w29-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w29-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 230 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 170 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 140 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "strength-w29-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w29-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 230 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "230 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w29-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 170 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "170 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w29-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 140 kg, repos 2 min 30.",
            "targetLoadText": "140 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w29-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 24 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "24 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w29-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 26 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 26 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w29-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w29-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "4 × 20 à 6 kg, propre.",
            "targetLoadText": "6 kg",
            "sets": 4,
            "reps": 20
          },
          {
            "id": "strength-w29-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w29-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "badminton-w29-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w29-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w29-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w29-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w29-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w29-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 5 × 1 km allure course contrôlée, repos 90 s. • Substitut SkiErg : 3 × (250 m rameur + 10 tirages bras tendus), facile à modéré. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Pic de forme",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w29-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w29-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "5 × 1 km allure course contrôlée, repos 90 s.",
            "restText": "90 s",
            "sets": 5,
            "distanceM": 1000
          },
          {
            "id": "run-w29-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "3 × (250 m rameur + 10 tirages bras tendus), facile à modéré."
          },
          {
            "id": "run-w29-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w29-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w29-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w29-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "recovery-w29-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w29-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w29-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 6. • Intensité : 75-80 %. • Repos : 90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Pic de forme",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w29-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w29-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "6."
          },
          {
            "id": "hyrox-w29-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w29-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s entre blocs."
          },
          {
            "id": "hyrox-w29-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w29-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 3 × (250 m rameur + 10 tirages bras tendus), facile à modéré."
          },
          {
            "id": "hyrox-w29-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 210 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "210 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w29-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 150 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "150 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w29-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w29-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w29-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w29-12-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 12,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w29-13-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 13,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w29-14-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 14,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w29-15-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 15,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w29-16-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 16,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w29-17-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 17,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w29-18-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 18,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "30": {
    "week": 30,
    "dateRange": "16 nov. au 22 nov.",
    "phaseTitle": "Phase 8 — Pic de forme",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "rest-w30-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w30-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w30-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 240 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 180 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 145 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "strength-w30-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w30-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 240 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "240 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w30-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 180 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "180 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w30-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 145 kg, repos 2 min 30.",
            "targetLoadText": "145 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w30-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 26 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "26 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w30-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 28 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 28 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w30-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 24 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 24 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w30-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 25 à 6 kg, propre.",
            "targetLoadText": "6 kg",
            "sets": 3,
            "reps": 25
          },
          {
            "id": "strength-w30-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w30-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "badminton-w30-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w30-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w30-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w30-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w30-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w30-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 4 × 1 km à 5'15-5'30/km, repos 90 s. • Substitut SkiErg : 3 × (250 m rameur + 10 tirages bras tendus), facile à modéré. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Pic de forme",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w30-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w30-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "4 × 1 km à 5'15-5'30/km, repos 90 s.",
            "restText": "90 s",
            "sets": 4,
            "distanceM": 1000
          },
          {
            "id": "run-w30-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "3 × (250 m rameur + 10 tirages bras tendus), facile à modéré."
          },
          {
            "id": "run-w30-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w30-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w30-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w30-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "recovery-w30-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w30-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w30-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 7. • Intensité : 75-80 %. • Repos : 90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Pic de forme",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w30-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w30-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "7."
          },
          {
            "id": "hyrox-w30-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w30-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s entre blocs."
          },
          {
            "id": "hyrox-w30-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w30-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 3 × (250 m rameur + 10 tirages bras tendus), facile à modéré."
          },
          {
            "id": "hyrox-w30-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 220 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "220 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w30-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 160 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "160 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w30-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w30-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w30-11-bloc-6",
            "block": "Blocs HYROX",
            "name": "Bloc 6",
            "order": 11,
            "repsText": "1 km course + Farmer Carry : 200 m à 2 × 24 kg, fractionner si poignet gauche.",
            "targetLoadText": "2 × 24 kg",
            "sets": 2,
            "reps": 24
          },
          {
            "id": "hyrox-w30-12-bloc-7",
            "block": "Blocs HYROX",
            "name": "Bloc 7",
            "order": 12,
            "repsText": "1 km course + Sandbag Lunges : 80 m à 20 kg, repos debout si besoin.",
            "targetLoadText": "20 kg"
          },
          {
            "id": "hyrox-w30-13-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 13,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w30-14-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 14,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w30-15-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 15,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w30-16-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 16,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w30-17-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 17,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w30-18-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 18,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w30-19-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 19,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "31": {
    "week": 31,
    "dateRange": "23 nov. au 29 nov.",
    "phaseTitle": "Phase 8 — Pic de forme",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "rest-w31-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w31-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w31-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — Force + sled",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Sled Push : 5 × 10 m à 220 kg, repos 2 min 30, RPE 7. • Sled Pull : 5 × 10 m à 160 kg, repos 2 min 30, RPE 7. • Presse à cuisses : 4 × 8 à 130 kg, repos 2 min 30.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "strength-w31-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "strength-w31-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "5 × 10 m à 220 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "220 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w31-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "5 × 10 m à 160 kg, repos 2 min 30, RPE 7.",
            "targetLoadText": "160 kg",
            "restText": "2 min 30",
            "rpeTarget": "RPE 7",
            "sets": 5,
            "distanceM": 10
          },
          {
            "id": "strength-w31-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "4 × 8 à 130 kg, repos 2 min 30.",
            "targetLoadText": "130 kg",
            "restText": "2 min 30",
            "sets": 4,
            "reps": 8
          },
          {
            "id": "strength-w31-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "3 × 8/jambe à 22 kg total, repos 30-45 s entre jambes, 90 s entre séries.",
            "targetLoadText": "22 kg total",
            "restText": "30-45 s entre jambes",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w31-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "3 × 8 à 2 × 24 kg, tempo 3 s descente, repos 90 s.",
            "targetLoadText": "2 × 24 kg",
            "restText": "90 s",
            "sets": 3,
            "reps": 8
          },
          {
            "id": "strength-w31-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "4 × 80 m à 2 × 20 kg, repos 2 min. Si poignet gauche > 3/10 : 3 × 60 m.",
            "targetLoadText": "2 × 20 kg",
            "restText": "2 min",
            "sets": 4,
            "distanceM": 80
          },
          {
            "id": "strength-w31-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 15 à 6 kg, propre.",
            "targetLoadText": "6 kg",
            "sets": 3,
            "reps": 15
          },
          {
            "id": "strength-w31-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "5-8 min."
          },
          {
            "id": "strength-w31-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-90 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "badminton-w31-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w31-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w31-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w31-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w31-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w31-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 3 × 1 km à 5'20-5'40/km, récupération complète. • Substitut SkiErg : 3 × (250 m rameur + 10 tirages bras tendus), facile à modéré. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Pic de forme",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w31-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w31-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "3 × 1 km à 5'20-5'40/km, récupération complète.",
            "sets": 3,
            "distanceM": 1000
          },
          {
            "id": "run-w31-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "3 × (250 m rameur + 10 tirages bras tendus), facile à modéré."
          },
          {
            "id": "run-w31-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w31-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w31-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w31-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Pic de forme"
        ],
        "exercises": [
          {
            "id": "recovery-w31-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w31-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w31-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 5. • Intensité : 75-80 %. • Repos : 90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Pic de forme",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w31-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w31-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "5."
          },
          {
            "id": "hyrox-w31-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w31-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s entre blocs."
          },
          {
            "id": "hyrox-w31-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w31-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 3 × (250 m rameur + 10 tirages bras tendus), facile à modéré."
          },
          {
            "id": "hyrox-w31-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 200 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "200 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w31-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 140 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "140 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w31-09-bloc-4",
            "block": "Blocs HYROX",
            "name": "Bloc 4",
            "order": 9,
            "repsText": "1 km course + Burpee Broad Jumps : 80 m, fractionner en 10 m, repos 15-20 s si besoin.",
            "restText": "15-20 s si besoin"
          },
          {
            "id": "hyrox-w31-10-bloc-5",
            "block": "Blocs HYROX",
            "name": "Bloc 5",
            "order": 10,
            "repsText": "1 km course + Rameur : 1000 m RPE 7, cadence régulière.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w31-11-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 11,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w31-12-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 12,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w31-13-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 13,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w31-14-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 14,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w31-15-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 15,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w31-16-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 16,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w31-17-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 17,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "32": {
    "week": 32,
    "dateRange": "30 nov. au 6 déc.",
    "phaseTitle": "Phase 9 — Affûtage",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Affûtage"
        ],
        "exercises": [
          {
            "id": "rest-w32-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w32-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w32-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 180 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 130 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 110 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Affûtage"
        ],
        "exercises": [
          {
            "id": "strength-w32-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w32-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 180 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "180 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w32-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 130 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "130 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w32-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 110 kg, repos 2 min.",
            "targetLoadText": "110 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w32-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 18 kg total, repos 90 s.",
            "targetLoadText": "18 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w32-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 20 kg, repos 90 s.",
            "targetLoadText": "2 × 20 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w32-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 18 kg, repos 90 s.",
            "targetLoadText": "2 × 18 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w32-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "3 × 12 à 6 kg, facile.",
            "targetLoadText": "6 kg",
            "sets": 3,
            "reps": 12
          },
          {
            "id": "strength-w32-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Affûtage"
        ],
        "exercises": [
          {
            "id": "badminton-w32-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w32-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w32-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w32-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w32-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w32-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : 3 × 1 km allure course, repos 2 min, puis 10 min cool. • Substitut SkiErg : 2 × (250 m rameur + 8 tirages bras tendus), activation. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Affûtage",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w32-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w32-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "3 × 1 km allure course, repos 2 min, puis 10 min cool.",
            "restText": "2 min",
            "sets": 3,
            "distanceM": 1000
          },
          {
            "id": "run-w32-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "2 × (250 m rameur + 8 tirages bras tendus), activation."
          },
          {
            "id": "run-w32-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w32-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w32-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w32-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Affûtage"
        ],
        "exercises": [
          {
            "id": "recovery-w32-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w32-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w32-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Salle 3 — Spécifique HYROX",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 95,
        "rpeTarget": "RPE 7-8",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 12 min. • Nombre de blocs : 3. • Intensité : 75-80 %. • Repos : 90 s entre blocs. • Blocs :",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Affûtage",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w32-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "12 min."
          },
          {
            "id": "hyrox-w32-02-nombre-de-blocs",
            "block": "Nombre de blocs",
            "name": "Nombre de blocs",
            "order": 2,
            "repsText": "3."
          },
          {
            "id": "hyrox-w32-03-intensite",
            "block": "Intensité",
            "name": "Intensité",
            "order": 3,
            "repsText": "75-80 %."
          },
          {
            "id": "hyrox-w32-04-repos",
            "block": "Repos",
            "name": "Repos",
            "order": 4,
            "repsText": "90 s entre blocs."
          },
          {
            "id": "hyrox-w32-05-blocs",
            "block": "Blocs :",
            "name": "Blocs :",
            "order": 5,
            "repsText": "Blocs :"
          },
          {
            "id": "hyrox-w32-06-bloc-1",
            "block": "Blocs HYROX",
            "name": "Bloc 1",
            "order": 6,
            "repsText": "1 km course + Substitut SkiErg : 2 × (250 m rameur + 8 tirages bras tendus), activation."
          },
          {
            "id": "hyrox-w32-07-bloc-2",
            "block": "Blocs HYROX",
            "name": "Bloc 2",
            "order": 7,
            "repsText": "1 km course + Sled Push : 4 × 10 m à 160 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "160 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w32-08-bloc-3",
            "block": "Blocs HYROX",
            "name": "Bloc 3",
            "order": 8,
            "repsText": "1 km course + Sled Pull : 4 × 10 m à 120 kg, repos 30-45 s entre longueurs.",
            "targetLoadText": "120 kg",
            "restText": "30-45 s entre longueurs",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w32-09-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 9,
            "repsText": "8-10 min."
          },
          {
            "id": "hyrox-w32-10-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 10,
            "repsText": "80-95 min."
          },
          {
            "id": "hyrox-w32-11-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 11,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w32-12-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 12,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w32-13-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 13,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w32-14-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 14,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w32-15-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 15,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  },
  "33": {
    "week": 33,
    "dateRange": "7 déc. au 12 déc.",
    "phaseTitle": "Phase 9 — Affûtage",
    "status": "semaine course. On cherche la fraîcheur, pas la progression.",
    "sessions": {
      "rest": {
        "title": "Repos complet / mobilité douce",
        "objective": "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
        "durationMin": 0,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Repos",
          "Affûtage",
          "semaine course"
        ],
        "exercises": [
          {
            "id": "rest-w33-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "rest-w33-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "rest-w33-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Lundi"
      },
      "strength": {
        "title": "Salle 1 — force allégée / deload",
        "objective": "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
        "durationMin": 70,
        "rpeTarget": "RPE 5-6",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min. • Sled Push : 4 × 10 m à 120 kg, repos 2 min, RPE 5-6. • Sled Pull : 4 × 10 m à 90 kg, repos 2 min, RPE 5-6. • Presse à cuisses : 2 × 8 à 80 kg, repos 2 min.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 1",
          "Affûtage",
          "semaine course"
        ],
        "exercises": [
          {
            "id": "strength-w33-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min."
          },
          {
            "id": "strength-w33-02-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 2,
            "repsText": "4 × 10 m à 120 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "120 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w33-03-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 3,
            "repsText": "4 × 10 m à 90 kg, repos 2 min, RPE 5-6.",
            "targetLoadText": "90 kg",
            "restText": "2 min",
            "rpeTarget": "RPE 5-6",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "strength-w33-04-presse-a-cuisses",
            "block": "Presse à cuisses",
            "name": "Presse à cuisses",
            "order": 4,
            "repsText": "2 × 8 à 80 kg, repos 2 min.",
            "targetLoadText": "80 kg",
            "restText": "2 min",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w33-05-bulgarian-split-squat",
            "block": "Bulgarian split squat",
            "name": "Bulgarian split squat",
            "order": 5,
            "repsText": "2 × 8/jambe à 0 kg total, repos 90 s.",
            "targetLoadText": "0 kg total",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w33-06-rdl-halteres",
            "block": "RDL haltères",
            "name": "RDL haltères",
            "order": 6,
            "repsText": "2 × 8 à 2 × 0 kg, repos 90 s.",
            "targetLoadText": "2 × 0 kg",
            "restText": "90 s",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w33-07-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 7,
            "repsText": "3 × 60 m à 2 × 0 kg, repos 90 s.",
            "targetLoadText": "2 × 0 kg",
            "restText": "90 s",
            "sets": 3,
            "distanceM": 60
          },
          {
            "id": "strength-w33-08-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 8,
            "repsText": "2 × 8 à 6 kg, activation seulement.",
            "targetLoadText": "6 kg",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "strength-w33-09-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 9,
            "repsText": "60-70 min."
          }
        ],
        "sourceDay": "Mardi"
      },
      "badminton": {
        "title": "Badminton — séance modifiable dans l’app",
        "objective": "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
        "durationMin": 90,
        "rpeTarget": "RPE 6-7",
        "fatigueVersion": "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon.",
        "normalVersion": "Prescription du fichier : Durée par défaut : 75-90 min. • Échauffement obligatoire : 8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s. • Intensité cible : RPE 6-7. • Si match très intense : noter FC, calories, RPE, douleur mollet/adducteurs/tendon.",
        "strongVersion": "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité.",
        "tags": [
          "Badminton",
          "Affûtage",
          "semaine course"
        ],
        "exercises": [
          {
            "id": "badminton-w33-01-duree-par-defaut",
            "block": "Durée par défaut",
            "name": "Durée par défaut",
            "order": 1,
            "repsText": "75-90 min."
          },
          {
            "id": "badminton-w33-02-echauffement-obligatoire",
            "block": "Échauffement obligatoire",
            "name": "Échauffement obligatoire",
            "order": 2,
            "repsText": "8-10 min : squats 15, fentes 8/jambe, mollets 20, pas chassés 2 × 20 s, accélérations 2 × 20 s.",
            "sets": 2,
            "durationSec": 20
          },
          {
            "id": "badminton-w33-03-intensite-cible",
            "block": "Intensité cible",
            "name": "Intensité cible",
            "order": 3,
            "repsText": "RPE 6-7.",
            "rpeTarget": "RPE 6-7"
          },
          {
            "id": "badminton-w33-04-si-match-tres-intense",
            "block": "Si match très intense",
            "name": "Si match très intense",
            "order": 4,
            "repsText": "noter FC, calories, RPE, douleur mollet/adducteurs/tendon."
          },
          {
            "id": "badminton-w33-05-si-fatigue",
            "block": "Si fatigue",
            "name": "Si fatigue",
            "order": 5,
            "repsText": "jouer technique, limiter les matchs longs, durée 45-60 min."
          },
          {
            "id": "badminton-w33-06-dans-la-pwa",
            "block": "Dans la PWA",
            "name": "Dans la PWA",
            "order": 6,
            "repsText": "durée, activité, intensité, calories et notes restent modifiables."
          }
        ],
        "sourceDay": "Jeudi"
      },
      "run": {
        "title": "Salle 2 — Course + moteur sans SkiErg",
        "objective": "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Échauffement : 10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s. • Bloc principal : Semaine course : 20-25 min très facile + 3 × 20 s accélérations. • Substitut SkiErg : 2 × (250 m rameur + 8 tirages bras tendus), activation. • Burpee Broad Jumps : 6 × 10 m, repos 60-75 s.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 2",
          "Affûtage",
          "semaine course",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "run-w33-01-echauffement",
            "block": "Échauffement",
            "name": "Échauffement",
            "order": 1,
            "repsText": "10-12 min : 8 min footing facile + 3 × 20 s progressif, repos 40 s.",
            "restText": "40 s",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w33-02-bloc-principal",
            "block": "Bloc principal",
            "name": "Bloc principal",
            "order": 2,
            "repsText": "Semaine course : 20-25 min très facile + 3 × 20 s accélérations.",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "run-w33-03-substitut-skierg",
            "block": "Substitut SkiErg",
            "name": "Substitut SkiErg",
            "order": 3,
            "repsText": "2 × (250 m rameur + 8 tirages bras tendus), activation."
          },
          {
            "id": "run-w33-04-burpee-broad-jumps",
            "block": "Burpee Broad Jumps",
            "name": "Burpee Broad Jumps",
            "order": 4,
            "repsText": "6 × 10 m, repos 60-75 s.",
            "restText": "60-75 s",
            "sets": 6,
            "distanceM": 10
          },
          {
            "id": "run-w33-05-gainage",
            "block": "Gainage",
            "name": "Gainage",
            "order": 5,
            "repsText": "3 × 35-45 s, repos 45 s.",
            "restText": "45 s",
            "sets": 3,
            "reps": 35
          },
          {
            "id": "run-w33-06-retour-au-calme",
            "block": "Retour au calme",
            "name": "Retour au calme",
            "order": 6,
            "repsText": "8 min."
          },
          {
            "id": "run-w33-07-duree-max",
            "block": "Durée max",
            "name": "Durée max",
            "order": 7,
            "repsText": "75-90 min."
          }
        ],
        "sourceDay": "Vendredi"
      },
      "recovery": {
        "title": "Récupération active / mobilité",
        "objective": "Faire circuler sans ajouter de dette de fatigue.",
        "durationMin": 45,
        "rpeTarget": "RPE 3-4",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Option 1 : 30-45 min marche ou vélo zone 2, RPE 3-4. • Option 2 : mobilité 20 min : hanches, chevilles, mollets, fessiers, dos. • Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Récupération",
          "Affûtage",
          "semaine course"
        ],
        "exercises": [
          {
            "id": "recovery-w33-01-option-1",
            "block": "Option 1",
            "name": "Option 1",
            "order": 1,
            "repsText": "30-45 min marche ou vélo zone 2, RPE 3-4.",
            "rpeTarget": "RPE 3-4"
          },
          {
            "id": "recovery-w33-02-option-2",
            "block": "Option 2",
            "name": "Option 2",
            "order": 2,
            "repsText": "mobilité 20 min : hanches, chevilles, mollets, fessiers, dos."
          },
          {
            "id": "recovery-w33-03-pas-de-fractionne-pas-de-seance-cachee-oui",
            "block": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "name": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte.",
            "order": 3,
            "repsText": "Pas de fractionné. Pas de séance cachée. Oui, le repos compte."
          }
        ],
        "sourceDay": "Samedi"
      },
      "hyrox": {
        "title": "Course / activation uniquement",
        "objective": "Enchaîner course et stations avec un pacing régulier et des transitions propres.",
        "durationMin": 90,
        "rpeTarget": "RPE 7",
        "fatigueVersion": "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.",
        "normalVersion": "Prescription du fichier : Lundi : repos. • Mardi ou mercredi : 20-25 min footing très facile + 3 × 20 s accélérations. • Jeudi : mobilité + 2 × 8 wall balls + 2 × 250 m rameur facile. • Vendredi : repos. • Samedi : course HYROX.",
        "strongVersion": "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.",
        "tags": [
          "Salle 3",
          "Affûtage",
          "semaine course",
          "Sans SkiErg"
        ],
        "exercises": [
          {
            "id": "hyrox-w33-01-lundi",
            "block": "Lundi",
            "name": "Lundi",
            "order": 1,
            "repsText": "repos."
          },
          {
            "id": "hyrox-w33-02-mardi-ou-mercredi",
            "block": "Mardi ou mercredi",
            "name": "Mardi ou mercredi",
            "order": 2,
            "repsText": "20-25 min footing très facile + 3 × 20 s accélérations.",
            "sets": 3,
            "durationSec": 20
          },
          {
            "id": "hyrox-w33-03-jeudi",
            "block": "Jeudi",
            "name": "Jeudi",
            "order": 3,
            "repsText": "mobilité + 2 × 8 wall balls + 2 × 250 m rameur facile.",
            "sets": 2,
            "reps": 8
          },
          {
            "id": "hyrox-w33-04-vendredi",
            "block": "Vendredi",
            "name": "Vendredi",
            "order": 4,
            "repsText": "repos."
          },
          {
            "id": "hyrox-w33-05-samedi",
            "block": "Samedi",
            "name": "Samedi",
            "order": 5,
            "repsText": "course HYROX."
          },
          {
            "id": "hyrox-w33-06-plan-recommande",
            "block": "Plan recommandé",
            "name": "Plan recommandé",
            "order": 6,
            "repsText": "mardi Salle 1, mercredi badminton, jeudi badminton, vendredi Salle 2, samedi récupération, dimanche Salle 3."
          },
          {
            "id": "hyrox-w33-07-si-tu-fais-badminton-mardi",
            "block": "Si tu fais badminton mardi",
            "name": "Si tu fais badminton mardi",
            "order": 7,
            "repsText": "mardi badminton, vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w33-08-si-tu-fais-badminton-vendredi",
            "block": "Si tu fais badminton vendredi",
            "name": "Si tu fais badminton vendredi",
            "order": 8,
            "repsText": "vendredi badminton, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w33-09-si-tu-fais-3-badmintons-mardi-mercredi-jeu",
            "block": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "name": "Si tu fais 3 badmintons mardi/mercredi/jeudi",
            "order": 9,
            "repsText": "vendredi Salle 1, samedi Salle 2, dimanche Salle 3."
          },
          {
            "id": "hyrox-w33-10-si-douleur-ou-sommeil-6-h",
            "block": "Si douleur ou sommeil < 6 h",
            "name": "Si douleur ou sommeil < 6 h",
            "order": 10,
            "repsText": "version fatiguée, pas de rattrapage sauvage le lendemain."
          },
          {
            "id": "hyrox-w33-11-reduire-les-charges-de-15-a-25",
            "block": "Réduire les charges de 15 à 25 %.",
            "name": "Réduire les charges de 15 à 25 %.",
            "order": 11,
            "repsText": "Réduire les charges de 15 à 25 %."
          },
          {
            "id": "hyrox-w33-12-enlever-1-a-2-series-sur-sled-force-et-wal",
            "block": "Enlever 1 à 2 séries sur sled, force et wall balls.",
            "name": "Enlever 1 à 2 séries sur sled, force et wall balls.",
            "order": 12,
            "repsText": "Enlever 1 à 2 séries sur sled, force et wall balls."
          },
          {
            "id": "hyrox-w33-13-garder-la-seance-a-45-65-min",
            "block": "Garder la séance à 45-65 min.",
            "name": "Garder la séance à 45-65 min.",
            "order": 13,
            "repsText": "Garder la séance à 45-65 min."
          },
          {
            "id": "hyrox-w33-14-remplacer-course-intense-par-velo-rameur-o",
            "block": "Remplacer course intense par vélo, rameur ou marche inclinée zone 2.",
            "name": "Remplacer course intense par vélo, rameur ou marche inclinée zone 2.",
            "order": 14,
            "repsText": "Remplacer course intense par vélo, rameur ou marche inclinée zone 2."
          },
          {
            "id": "hyrox-w33-15-suivre-la-prescription",
            "block": "Suivre la prescription.",
            "name": "Suivre la prescription.",
            "order": 15,
            "repsText": "Suivre la prescription."
          },
          {
            "id": "hyrox-w33-16-rpe-cible",
            "block": "RPE cible",
            "name": "RPE cible",
            "order": 16,
            "repsText": "6-7 la majorité du temps, 8 maximum sur les blocs spécifiques."
          },
          {
            "id": "hyrox-w33-17-ajouter-seulement-une-option",
            "block": "Ajouter seulement une option :",
            "name": "Ajouter seulement une option :",
            "order": 17,
            "repsText": "Ajouter seulement une option :"
          },
          {
            "id": "hyrox-w33-18-ne-jamais-tout-ajouter-en-meme-temps-l-ent",
            "block": "Ne jamais tout ajouter en même temps. L’enthousiasme, c’est bien ; le tendon d’Achille, c’est mieux.",
            "name": "Ne jamais tout ajouter en même temps. L’enthousiasme, c’est bien ; le tendon d’Achille, c’est mieux.",
            "order": 18,
            "repsText": "Ne jamais tout ajouter en même temps. L’enthousiasme, c’est bien ; le tendon d’Achille, c’est mieux."
          },
          {
            "id": "hyrox-w33-19-1-km-course-rpe-7",
            "block": "1 km course RPE 7",
            "name": "1 km course RPE 7",
            "order": 19,
            "repsText": "temps + FC.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w33-20-sled-push",
            "block": "Sled Push",
            "name": "Sled Push",
            "order": 20,
            "repsText": "4 × 10 m charge de base, temps moyen.",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w33-21-sled-pull",
            "block": "Sled Pull",
            "name": "Sled Pull",
            "order": 21,
            "repsText": "4 × 10 m charge de base, temps moyen.",
            "sets": 4,
            "distanceM": 10
          },
          {
            "id": "hyrox-w33-22-farmer-carry",
            "block": "Farmer carry",
            "name": "Farmer carry",
            "order": 22,
            "repsText": "distance sans poser à 2 × 20 ou 2 × 24 kg.",
            "targetLoadText": "2 × 20 ou 2 × 24 kg",
            "sets": 2,
            "reps": 20
          },
          {
            "id": "hyrox-w33-23-wall-balls",
            "block": "Wall balls",
            "name": "Wall balls",
            "order": 23,
            "repsText": "max reps propres en 90 s."
          },
          {
            "id": "hyrox-w33-24-rameur",
            "block": "Rameur",
            "name": "Rameur",
            "order": 24,
            "repsText": "500 m RPE 7.",
            "rpeTarget": "RPE 7"
          },
          {
            "id": "hyrox-w33-25-poids-moyen-hebdomadaire",
            "block": "Poids moyen hebdomadaire.",
            "name": "Poids moyen hebdomadaire.",
            "order": 25,
            "repsText": "Poids moyen hebdomadaire."
          },
          {
            "id": "hyrox-w33-26-douleur-fatigue",
            "block": "Douleur / fatigue.",
            "name": "Douleur / fatigue.",
            "order": 26,
            "repsText": "Douleur / fatigue."
          },
          {
            "id": "hyrox-w33-27-poulie-bras-tendus-rameur",
            "block": "poulie bras tendus + rameur ;",
            "name": "poulie bras tendus + rameur ;",
            "order": 27,
            "repsText": "poulie bras tendus + rameur ;"
          },
          {
            "id": "hyrox-w33-28-battle-rope-rameur",
            "block": "battle rope + rameur ;",
            "name": "battle rope + rameur ;",
            "order": 28,
            "repsText": "battle rope + rameur ;"
          },
          {
            "id": "hyrox-w33-29-assault-bike",
            "block": "Assault Bike ;",
            "name": "Assault Bike ;",
            "order": 29,
            "repsText": "Assault Bike ;"
          },
          {
            "id": "hyrox-w33-30-rameur-seul",
            "block": "rameur seul.",
            "name": "rameur seul.",
            "order": 30,
            "repsText": "rameur seul."
          },
          {
            "id": "hyrox-w33-31-duree-modifiable",
            "block": "durée modifiable ;",
            "name": "durée modifiable ;",
            "order": 31,
            "repsText": "durée modifiable ;"
          },
          {
            "id": "hyrox-w33-32-activite-modifiable",
            "block": "activité modifiable ;",
            "name": "activité modifiable ;",
            "order": 32,
            "repsText": "activité modifiable ;"
          },
          {
            "id": "hyrox-w33-33-intensite-modifiable",
            "block": "intensité modifiable ;",
            "name": "intensité modifiable ;",
            "order": 33,
            "repsText": "intensité modifiable ;"
          },
          {
            "id": "hyrox-w33-34-calories-fc-rpe-notes-modifiables",
            "block": "calories/FC/RPE/notes modifiables.",
            "name": "calories/FC/RPE/notes modifiables.",
            "order": 34,
            "repsText": "calories/FC/RPE/notes modifiables."
          }
        ],
        "sourceDay": "Dimanche"
      }
    }
  }
};

export function getPreciseWeekPlan(week: number): PreciseWeekPlan | undefined {
  return PRECISE_WEEK_PLANS[week];
}
