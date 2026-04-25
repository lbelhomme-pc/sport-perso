# Planning HYROX complet — version précise avec cases à cocher

> Version modifiée à partir de `C:/Users/ludov/Downloads/planning_hyrox_complet_precis.md`.
> Les cases `- [ ]` servent de suivi visuel : tu peux cocher dans l'éditeur Markdown sans modifier la logique de l'application.


**Objectif :** préparation HYROX jusqu’à décembre + perte progressive de 6 kg.  
**Contraintes :** lundi impossible, 2 à 3 badmintons par semaine, 3 séances salle, variantes *fatigué / normal / en forme*.  
**Philosophie :** progresser sans exploser. Le badminton compte comme une vraie séance intense, surtout pour les mollets, adducteurs, genoux et tendons d’Achille.

> Hypothèse de travail : départ semaine 1 fin avril, objectif HYROX en décembre.  
> Dans l’application, la date cible doit rester modifiable dans les réglages.

---

## 1. Variables modifiables pour Codex

Ces paramètres doivent rester éditables dans la PWA.

```yaml
targetDate: "2026-12-12"
startDate: "2026-04-27"

defaultWeeklyStructure:
  monday: "rest"
  tuesday: "gym_or_badminton"
  wednesday: "badminton"
  thursday: "badminton"
  friday: "gym_or_badminton"
  saturday: "recovery_or_gym"
  sunday: "hyrox_specific"

badmintonEditable:
  canEditDuration: true
  canEditStartTime: true
  canEditIntensity: true
  canEditActivityType: true
  canReplaceByRest: true
  canReplaceByGym: true
  defaultDurationMin: 90
  defaultIntensity: "normal"

energyLevels:
  fatigue:
    label: "Fatigué"
    rule: "réduire volume 30 à 50 %, garder technique, RPE max 6"
  normal:
    label: "Normal"
    rule: "faire séance prévue, RPE cible"
  strong:
    label: "En forme"
    rule: "ajouter bonus uniquement si sommeil et jambes OK"

nutritionGoal:
  weightLossKg: 6
  weeklyLossTargetKg: 0.25
  proteinPerKgMin: 1.8
  proteinPerKgMax: 2.1
```

---

## 2. RPE et règles de décision

| RPE | Sensation | Utilisation |
|---:|---|---|
| 4-5 | facile | récupération, technique, fatigue |
| 6 | contrôlé | séance allégée, reprise |
| 7 | dur mais propre | majorité des séances normales |
| 8 | très dur mais maîtrisé | blocs spécifiques, force lourde |
| 9 | presque max | rare, uniquement tests ou simulation |
| 10 | max | à éviter à l’entraînement |

### Feu vert / orange / rouge

| Statut | Critères | Décision |
|---|---|---|
| Vert | sommeil OK, jambes OK, pas de douleur | séance normale ou en forme |
| Orange | jambes lourdes, sommeil moyen, RPE élevé récemment | séance normale prudente ou fatiguée |
| Rouge | douleur ≥ 5/10, sommeil très mauvais, grosse fatigue | récupération ou version fatiguée |

---

## 3. Structures hebdomadaires possibles

### Option A — 2 badmintons, meilleure option pour progresser

| Jour | Séance |
|---|---|
| Lundi | Repos complet |
| Mardi | Salle 1 — Force + sled |
| Mercredi | Badminton |
| Jeudi | Badminton |
| Vendredi | Salle 2 — Course + moteur |
| Samedi | Récupération active |
| Dimanche | Salle 3 — Spécifique HYROX |

### Option B — 3 badmintons avec mardi

| Jour | Séance |
|---|---|
| Lundi | Repos complet |
| Mardi | Badminton |
| Mercredi | Badminton |
| Jeudi | Badminton |
| Vendredi | Salle 1 — Force + sled |
| Samedi | Salle 2 — Course + moteur |
| Dimanche | Salle 3 — Spécifique HYROX |

### Option C — 3 badmintons avec vendredi

| Jour | Séance |
|---|---|
| Lundi | Repos complet |
| Mardi | Salle 1 — Force + sled |
| Mercredi | Badminton |
| Jeudi | Badminton |
| Vendredi | Badminton |
| Samedi | Salle 2 — Course + moteur |
| Dimanche | Salle 3 — Spécifique HYROX |

---

## Suivi à cocher par semaine et configuration

Coche uniquement la configuration réellement choisie pour la semaine. Les cases servent à voir vite ce qui a été validé, sans remplacer les données détaillées saisies dans l'application.

### Configuration A — 2 badmintons mercredi + jeudi

Salle le mardi, course/moteur le vendredi, récupération active le samedi.

#### Semaine 1 — 27 avr. - 03/05
- [ ] lundi 27 avr. — Repos complet
- [ ] mardi 28 avr. — Salle 1 — Force + sled
- [ ] mercredi 29 avr. — Badminton
- [ ] jeudi 30 avr. — Badminton
- [ ] vendredi 1 mai — Salle 2 — Tests course/moteur
- [ ] samedi 2 mai — Récupération active
- [ ] dimanche 3 mai — Salle 3 — HYROX 4 blocs

#### Semaine 2 — 4 mai - 10/05
- [ ] lundi 4 mai — Repos complet
- [ ] mardi 5 mai — Salle 1 — Force + sled
- [ ] mercredi 6 mai — Badminton
- [ ] jeudi 7 mai — Badminton
- [ ] vendredi 8 mai — Salle 2 — 5 x 600 m
- [ ] samedi 9 mai — Récupération active
- [ ] dimanche 10 mai — Salle 3 — HYROX 4 blocs

#### Semaine 3 — 11 mai - 17/05
- [ ] lundi 11 mai — Repos complet
- [ ] mardi 12 mai — Salle 1 — Force + sled
- [ ] mercredi 13 mai — Badminton
- [ ] jeudi 14 mai — Badminton
- [ ] vendredi 15 mai — Salle 2 — 5 x 800 m
- [ ] samedi 16 mai — Récupération active
- [ ] dimanche 17 mai — Salle 3 — HYROX 4 blocs

#### Semaine 4 — 18 mai - 24/05
- [ ] lundi 18 mai — Repos complet
- [ ] mardi 19 mai — Salle 1 — Force allégée
- [ ] mercredi 20 mai — Badminton
- [ ] jeudi 21 mai — Badminton
- [ ] vendredi 22 mai — Salle 2 — Deload zone 2
- [ ] samedi 23 mai — Récupération active
- [ ] dimanche 24 mai — Salle 3 — HYROX 3 blocs allégés

#### Semaine 5 — 25 mai - 31/05
- [ ] lundi 25 mai — Repos complet
- [ ] mardi 26 mai — Salle 1 — Force + sled
- [ ] mercredi 27 mai — Badminton
- [ ] jeudi 28 mai — Badminton
- [ ] vendredi 29 mai — Salle 2 — 5 x 800 m + rameur
- [ ] samedi 30 mai — Récupération active
- [ ] dimanche 31 mai — Salle 3 — HYROX 5 blocs

#### Semaine 6 — 1 juin - 07/06
- [ ] lundi 1 juin — Repos complet
- [ ] mardi 2 juin — Salle 1 — Force + sled
- [ ] mercredi 3 juin — Badminton
- [ ] jeudi 4 juin — Badminton
- [ ] vendredi 5 juin — Salle 2 — 5 x 800 m + rameur
- [ ] samedi 6 juin — Récupération active
- [ ] dimanche 7 juin — Salle 3 — HYROX 5 blocs

#### Semaine 7 — 8 juin - 14/06
- [ ] lundi 8 juin — Repos complet
- [ ] mardi 9 juin — Salle 1 — Force + sled
- [ ] mercredi 10 juin — Badminton
- [ ] jeudi 11 juin — Badminton
- [ ] vendredi 12 juin — Salle 2 — 5 x 800 m + rameur
- [ ] samedi 13 juin — Récupération active
- [ ] dimanche 14 juin — Salle 3 — HYROX 5 blocs

#### Semaine 8 — 15 juin - 21/06
- [ ] lundi 15 juin — Repos complet
- [ ] mardi 16 juin — Salle 1 — Force allégée
- [ ] mercredi 17 juin — Badminton
- [ ] jeudi 18 juin — Badminton
- [ ] vendredi 19 juin — Salle 2 — Deload zone 2
- [ ] samedi 20 juin — Récupération active
- [ ] dimanche 21 juin — Salle 3 — HYROX 3 blocs allégés

#### Semaine 9 — 22 juin - 28/06
- [ ] lundi 22 juin — Repos complet
- [ ] mardi 23 juin — Salle 1 — Force lourde + sled
- [ ] mercredi 24 juin — Badminton
- [ ] jeudi 25 juin — Badminton
- [ ] vendredi 26 juin — Salle 2 — 5 x 1 km + SkiErg
- [ ] samedi 27 juin — Récupération active
- [ ] dimanche 28 juin — Salle 3 — HYROX 6 blocs

#### Semaine 10 — 29 juin - 05/07
- [ ] lundi 29 juin — Repos complet
- [ ] mardi 30 juin — Salle 1 — Force lourde + sled
- [ ] mercredi 1 juil. — Badminton
- [ ] jeudi 2 juil. — Badminton
- [ ] vendredi 3 juil. — Salle 2 — 5 x 1 km + SkiErg
- [ ] samedi 4 juil. — Récupération active
- [ ] dimanche 5 juil. — Salle 3 — HYROX 6 blocs

#### Semaine 11 — 6 juil. - 12/07
- [ ] lundi 6 juil. — Repos complet
- [ ] mardi 7 juil. — Salle 1 — Force lourde + sled
- [ ] mercredi 8 juil. — Badminton
- [ ] jeudi 9 juil. — Badminton
- [ ] vendredi 10 juil. — Salle 2 — 5 x 1 km + SkiErg
- [ ] samedi 11 juil. — Récupération active
- [ ] dimanche 12 juil. — Salle 3 — HYROX 6 blocs

#### Semaine 12 — 13 juil. - 19/07
- [ ] lundi 13 juil. — Repos complet
- [ ] mardi 14 juil. — Salle 1 — Force allégée
- [ ] mercredi 15 juil. — Badminton
- [ ] jeudi 16 juil. — Badminton
- [ ] vendredi 17 juil. — Salle 2 — Deload zone 2
- [ ] samedi 18 juil. — Récupération active
- [ ] dimanche 19 juil. — Salle 3 — HYROX 4 blocs allégés

#### Semaine 13 — 20 juil. - 26/07
- [ ] lundi 20 juil. — Repos complet
- [ ] mardi 21 juil. — Salle 1 — Endurance de force
- [ ] mercredi 22 juil. — Badminton
- [ ] jeudi 23 juil. — Badminton
- [ ] vendredi 24 juil. — Salle 2 — 6 x 1 km + station courte
- [ ] samedi 25 juil. — Récupération active
- [ ] dimanche 26 juil. — Salle 3 — HYROX 7 blocs

#### Semaine 14 — 27 juil. - 02/08
- [ ] lundi 27 juil. — Repos complet
- [ ] mardi 28 juil. — Salle 1 — Endurance de force
- [ ] mercredi 29 juil. — Badminton
- [ ] jeudi 30 juil. — Badminton
- [ ] vendredi 31 juil. — Salle 2 — 6 x 1 km + station courte
- [ ] samedi 1 août — Récupération active
- [ ] dimanche 2 août — Salle 3 — HYROX 7 blocs

#### Semaine 15 — 3 août - 09/08
- [ ] lundi 3 août — Repos complet
- [ ] mardi 4 août — Salle 1 — Endurance de force
- [ ] mercredi 5 août — Badminton
- [ ] jeudi 6 août — Badminton
- [ ] vendredi 7 août — Salle 2 — 6 x 1 km + station courte
- [ ] samedi 8 août — Récupération active
- [ ] dimanche 9 août — Salle 3 — HYROX 7 blocs

#### Semaine 16 — 10 août - 16/08
- [ ] lundi 10 août — Repos complet
- [ ] mardi 11 août — Salle 1 — Force allégée
- [ ] mercredi 12 août — Badminton
- [ ] jeudi 13 août — Badminton
- [ ] vendredi 14 août — Salle 2 — Deload zone 2
- [ ] samedi 15 août — Récupération active
- [ ] dimanche 16 août — Salle 3 — HYROX 5 blocs allégés

#### Semaine 17 — 17 août - 23/08
- [ ] lundi 17 août — Repos complet
- [ ] mardi 18 août — Salle 1 — Spécifique force HYROX
- [ ] mercredi 19 août — Badminton
- [ ] jeudi 20 août — Badminton
- [ ] vendredi 21 août — Salle 2 — 6 x 1 km allure HYROX
- [ ] samedi 22 août — Récupération active
- [ ] dimanche 23 août — Salle 3 — HYROX 8 blocs

#### Semaine 18 — 24 août - 30/08
- [ ] lundi 24 août — Repos complet
- [ ] mardi 25 août — Salle 1 — Spécifique force HYROX
- [ ] mercredi 26 août — Badminton
- [ ] jeudi 27 août — Badminton
- [ ] vendredi 28 août — Salle 2 — 6 x 1 km allure HYROX
- [ ] samedi 29 août — Récupération active
- [ ] dimanche 30 août — Salle 3 — HYROX 8 blocs

#### Semaine 19 — 31 août - 06/09
- [ ] lundi 31 août — Repos complet
- [ ] mardi 1 sept. — Salle 1 — Spécifique force HYROX
- [ ] mercredi 2 sept. — Badminton
- [ ] jeudi 3 sept. — Badminton
- [ ] vendredi 4 sept. — Salle 2 — 6 x 1 km allure HYROX
- [ ] samedi 5 sept. — Récupération active
- [ ] dimanche 6 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 20 — 7 sept. - 13/09
- [ ] lundi 7 sept. — Repos complet
- [ ] mardi 8 sept. — Salle 1 — Force allégée
- [ ] mercredi 9 sept. — Badminton
- [ ] jeudi 10 sept. — Badminton
- [ ] vendredi 11 sept. — Salle 2 — Deload zone 2
- [ ] samedi 12 sept. — Récupération active
- [ ] dimanche 13 sept. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 21 — 14 sept. - 20/09
- [ ] lundi 14 sept. — Repos complet
- [ ] mardi 15 sept. — Salle 1 — Charge course / sled
- [ ] mercredi 16 sept. — Badminton
- [ ] jeudi 17 sept. — Badminton
- [ ] vendredi 18 sept. — Salle 2 — 7 x 1 km + station courte
- [ ] samedi 19 sept. — Récupération active
- [ ] dimanche 20 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 22 — 21 sept. - 27/09
- [ ] lundi 21 sept. — Repos complet
- [ ] mardi 22 sept. — Salle 1 — Charge course / sled
- [ ] mercredi 23 sept. — Badminton
- [ ] jeudi 24 sept. — Badminton
- [ ] vendredi 25 sept. — Salle 2 — 7 x 1 km + station courte
- [ ] samedi 26 sept. — Récupération active
- [ ] dimanche 27 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 23 — 28 sept. - 04/10
- [ ] lundi 28 sept. — Repos complet
- [ ] mardi 29 sept. — Salle 1 — Charge course / sled
- [ ] mercredi 30 sept. — Badminton
- [ ] jeudi 1 oct. — Badminton
- [ ] vendredi 2 oct. — Salle 2 — 7 x 1 km + station courte
- [ ] samedi 3 oct. — Récupération active
- [ ] dimanche 4 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 24 — 5 oct. - 11/10
- [ ] lundi 5 oct. — Repos complet
- [ ] mardi 6 oct. — Salle 1 — Force allégée
- [ ] mercredi 7 oct. — Badminton
- [ ] jeudi 8 oct. — Badminton
- [ ] vendredi 9 oct. — Salle 2 — Deload zone 2
- [ ] samedi 10 oct. — Récupération active
- [ ] dimanche 11 oct. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 25 — 12 oct. - 18/10
- [ ] lundi 12 oct. — Repos complet
- [ ] mardi 13 oct. — Salle 1 — Force entretien
- [ ] mercredi 14 oct. — Badminton
- [ ] jeudi 15 oct. — Badminton
- [ ] vendredi 16 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] samedi 17 oct. — Récupération active
- [ ] dimanche 18 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 26 — 19 oct. - 25/10
- [ ] lundi 19 oct. — Repos complet
- [ ] mardi 20 oct. — Salle 1 — Force entretien
- [ ] mercredi 21 oct. — Badminton
- [ ] jeudi 22 oct. — Badminton
- [ ] vendredi 23 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] samedi 24 oct. — Récupération active
- [ ] dimanche 25 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 27 — 26 oct. - 01/11
- [ ] lundi 26 oct. — Repos complet
- [ ] mardi 27 oct. — Salle 1 — Force entretien
- [ ] mercredi 28 oct. — Badminton
- [ ] jeudi 29 oct. — Badminton
- [ ] vendredi 30 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] samedi 31 oct. — Récupération active
- [ ] dimanche 1 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 28 — 2 nov. - 08/11
- [ ] lundi 2 nov. — Repos complet
- [ ] mardi 3 nov. — Salle 1 — Force allégée
- [ ] mercredi 4 nov. — Badminton
- [ ] jeudi 5 nov. — Badminton
- [ ] vendredi 6 nov. — Salle 2 — Deload zone 2
- [ ] samedi 7 nov. — Récupération active
- [ ] dimanche 8 nov. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 29 — 9 nov. - 15/11
- [ ] lundi 9 nov. — Repos complet
- [ ] mardi 10 nov. — Salle 1 — Pic de forme
- [ ] mercredi 11 nov. — Badminton
- [ ] jeudi 12 nov. — Badminton
- [ ] vendredi 13 nov. — Salle 2 — 4 à 5 x 1 km contrôlés
- [ ] samedi 14 nov. — Récupération active
- [ ] dimanche 15 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 30 — 16 nov. - 22/11
- [ ] lundi 16 nov. — Repos complet
- [ ] mardi 17 nov. — Salle 1 — Grosse simulation contrôlée
- [ ] mercredi 18 nov. — Badminton
- [ ] jeudi 19 nov. — Badminton
- [ ] vendredi 20 nov. — Salle 2 — 5 x 1 km allure course
- [ ] samedi 21 nov. — Récupération active
- [ ] dimanche 22 nov. — Salle 3 — HYROX 8 blocs 85-90 %

#### Semaine 31 — 23 nov. - 29/11
- [ ] lundi 23 nov. — Repos complet
- [ ] mardi 24 nov. — Salle 1 — Pic de forme
- [ ] mercredi 25 nov. — Badminton
- [ ] jeudi 26 nov. — Badminton
- [ ] vendredi 27 nov. — Salle 2 — 4 à 5 x 1 km contrôlés
- [ ] samedi 28 nov. — Récupération active
- [ ] dimanche 29 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 32 — 30 nov. - 06/12
- [ ] lundi 30 nov. — Repos complet
- [ ] mardi 1 déc. — Salle 1 — Activation légère
- [ ] mercredi 2 déc. — Badminton
- [ ] jeudi 3 déc. — Badminton
- [ ] vendredi 4 déc. — Salle 2 — Deload zone 2
- [ ] samedi 5 déc. — Récupération active
- [ ] dimanche 6 déc. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 33 — 7 déc. - 13/12
- [ ] lundi 7 déc. — Repos complet
- [ ] mardi 8 déc. — Salle 1 — Activation légère
- [ ] mercredi 9 déc. — Badminton léger
- [ ] jeudi 10 déc. — Badminton léger
- [ ] vendredi 11 déc. — Salle 2 — 20 à 30 min facile
- [ ] samedi 12 déc. — HYROX Paris
- [ ] dimanche 13 déc. — Récupération post-course

### Configuration B — 3 badmintons mardi + mercredi + jeudi

Badminton trois soirs d'affilée, salle compacte le vendredi, course/moteur le samedi.

#### Semaine 1 — 27 avr. - 03/05
- [ ] lundi 27 avr. — Repos complet
- [ ] mardi 28 avr. — Badminton
- [ ] mercredi 29 avr. — Badminton
- [ ] jeudi 30 avr. — Badminton
- [ ] vendredi 1 mai — Salle 1 — Force + sled
- [ ] samedi 2 mai — Salle 2 — Tests course/moteur
- [ ] dimanche 3 mai — Salle 3 — HYROX 4 blocs

#### Semaine 2 — 4 mai - 10/05
- [ ] lundi 4 mai — Repos complet
- [ ] mardi 5 mai — Badminton
- [ ] mercredi 6 mai — Badminton
- [ ] jeudi 7 mai — Badminton
- [ ] vendredi 8 mai — Salle 1 — Force + sled
- [ ] samedi 9 mai — Salle 2 — 5 x 600 m
- [ ] dimanche 10 mai — Salle 3 — HYROX 4 blocs

#### Semaine 3 — 11 mai - 17/05
- [ ] lundi 11 mai — Repos complet
- [ ] mardi 12 mai — Badminton
- [ ] mercredi 13 mai — Badminton
- [ ] jeudi 14 mai — Badminton
- [ ] vendredi 15 mai — Salle 1 — Force + sled
- [ ] samedi 16 mai — Salle 2 — 5 x 800 m
- [ ] dimanche 17 mai — Salle 3 — HYROX 4 blocs

#### Semaine 4 — 18 mai - 24/05
- [ ] lundi 18 mai — Repos complet
- [ ] mardi 19 mai — Badminton
- [ ] mercredi 20 mai — Badminton
- [ ] jeudi 21 mai — Badminton
- [ ] vendredi 22 mai — Salle 1 — Force allégée
- [ ] samedi 23 mai — Salle 2 — Deload zone 2
- [ ] dimanche 24 mai — Salle 3 — HYROX 3 blocs allégés

#### Semaine 5 — 25 mai - 31/05
- [ ] lundi 25 mai — Repos complet
- [ ] mardi 26 mai — Badminton
- [ ] mercredi 27 mai — Badminton
- [ ] jeudi 28 mai — Badminton
- [ ] vendredi 29 mai — Salle 1 — Force + sled
- [ ] samedi 30 mai — Salle 2 — 5 x 800 m + rameur
- [ ] dimanche 31 mai — Salle 3 — HYROX 5 blocs

#### Semaine 6 — 1 juin - 07/06
- [ ] lundi 1 juin — Repos complet
- [ ] mardi 2 juin — Badminton
- [ ] mercredi 3 juin — Badminton
- [ ] jeudi 4 juin — Badminton
- [ ] vendredi 5 juin — Salle 1 — Force + sled
- [ ] samedi 6 juin — Salle 2 — 5 x 800 m + rameur
- [ ] dimanche 7 juin — Salle 3 — HYROX 5 blocs

#### Semaine 7 — 8 juin - 14/06
- [ ] lundi 8 juin — Repos complet
- [ ] mardi 9 juin — Badminton
- [ ] mercredi 10 juin — Badminton
- [ ] jeudi 11 juin — Badminton
- [ ] vendredi 12 juin — Salle 1 — Force + sled
- [ ] samedi 13 juin — Salle 2 — 5 x 800 m + rameur
- [ ] dimanche 14 juin — Salle 3 — HYROX 5 blocs

#### Semaine 8 — 15 juin - 21/06
- [ ] lundi 15 juin — Repos complet
- [ ] mardi 16 juin — Badminton
- [ ] mercredi 17 juin — Badminton
- [ ] jeudi 18 juin — Badminton
- [ ] vendredi 19 juin — Salle 1 — Force allégée
- [ ] samedi 20 juin — Salle 2 — Deload zone 2
- [ ] dimanche 21 juin — Salle 3 — HYROX 3 blocs allégés

#### Semaine 9 — 22 juin - 28/06
- [ ] lundi 22 juin — Repos complet
- [ ] mardi 23 juin — Badminton
- [ ] mercredi 24 juin — Badminton
- [ ] jeudi 25 juin — Badminton
- [ ] vendredi 26 juin — Salle 1 — Force lourde + sled
- [ ] samedi 27 juin — Salle 2 — 5 x 1 km + SkiErg
- [ ] dimanche 28 juin — Salle 3 — HYROX 6 blocs

#### Semaine 10 — 29 juin - 05/07
- [ ] lundi 29 juin — Repos complet
- [ ] mardi 30 juin — Badminton
- [ ] mercredi 1 juil. — Badminton
- [ ] jeudi 2 juil. — Badminton
- [ ] vendredi 3 juil. — Salle 1 — Force lourde + sled
- [ ] samedi 4 juil. — Salle 2 — 5 x 1 km + SkiErg
- [ ] dimanche 5 juil. — Salle 3 — HYROX 6 blocs

#### Semaine 11 — 6 juil. - 12/07
- [ ] lundi 6 juil. — Repos complet
- [ ] mardi 7 juil. — Badminton
- [ ] mercredi 8 juil. — Badminton
- [ ] jeudi 9 juil. — Badminton
- [ ] vendredi 10 juil. — Salle 1 — Force lourde + sled
- [ ] samedi 11 juil. — Salle 2 — 5 x 1 km + SkiErg
- [ ] dimanche 12 juil. — Salle 3 — HYROX 6 blocs

#### Semaine 12 — 13 juil. - 19/07
- [ ] lundi 13 juil. — Repos complet
- [ ] mardi 14 juil. — Badminton
- [ ] mercredi 15 juil. — Badminton
- [ ] jeudi 16 juil. — Badminton
- [ ] vendredi 17 juil. — Salle 1 — Force allégée
- [ ] samedi 18 juil. — Salle 2 — Deload zone 2
- [ ] dimanche 19 juil. — Salle 3 — HYROX 4 blocs allégés

#### Semaine 13 — 20 juil. - 26/07
- [ ] lundi 20 juil. — Repos complet
- [ ] mardi 21 juil. — Badminton
- [ ] mercredi 22 juil. — Badminton
- [ ] jeudi 23 juil. — Badminton
- [ ] vendredi 24 juil. — Salle 1 — Endurance de force
- [ ] samedi 25 juil. — Salle 2 — 6 x 1 km + station courte
- [ ] dimanche 26 juil. — Salle 3 — HYROX 7 blocs

#### Semaine 14 — 27 juil. - 02/08
- [ ] lundi 27 juil. — Repos complet
- [ ] mardi 28 juil. — Badminton
- [ ] mercredi 29 juil. — Badminton
- [ ] jeudi 30 juil. — Badminton
- [ ] vendredi 31 juil. — Salle 1 — Endurance de force
- [ ] samedi 1 août — Salle 2 — 6 x 1 km + station courte
- [ ] dimanche 2 août — Salle 3 — HYROX 7 blocs

#### Semaine 15 — 3 août - 09/08
- [ ] lundi 3 août — Repos complet
- [ ] mardi 4 août — Badminton
- [ ] mercredi 5 août — Badminton
- [ ] jeudi 6 août — Badminton
- [ ] vendredi 7 août — Salle 1 — Endurance de force
- [ ] samedi 8 août — Salle 2 — 6 x 1 km + station courte
- [ ] dimanche 9 août — Salle 3 — HYROX 7 blocs

#### Semaine 16 — 10 août - 16/08
- [ ] lundi 10 août — Repos complet
- [ ] mardi 11 août — Badminton
- [ ] mercredi 12 août — Badminton
- [ ] jeudi 13 août — Badminton
- [ ] vendredi 14 août — Salle 1 — Force allégée
- [ ] samedi 15 août — Salle 2 — Deload zone 2
- [ ] dimanche 16 août — Salle 3 — HYROX 5 blocs allégés

#### Semaine 17 — 17 août - 23/08
- [ ] lundi 17 août — Repos complet
- [ ] mardi 18 août — Badminton
- [ ] mercredi 19 août — Badminton
- [ ] jeudi 20 août — Badminton
- [ ] vendredi 21 août — Salle 1 — Spécifique force HYROX
- [ ] samedi 22 août — Salle 2 — 6 x 1 km allure HYROX
- [ ] dimanche 23 août — Salle 3 — HYROX 8 blocs

#### Semaine 18 — 24 août - 30/08
- [ ] lundi 24 août — Repos complet
- [ ] mardi 25 août — Badminton
- [ ] mercredi 26 août — Badminton
- [ ] jeudi 27 août — Badminton
- [ ] vendredi 28 août — Salle 1 — Spécifique force HYROX
- [ ] samedi 29 août — Salle 2 — 6 x 1 km allure HYROX
- [ ] dimanche 30 août — Salle 3 — HYROX 8 blocs

#### Semaine 19 — 31 août - 06/09
- [ ] lundi 31 août — Repos complet
- [ ] mardi 1 sept. — Badminton
- [ ] mercredi 2 sept. — Badminton
- [ ] jeudi 3 sept. — Badminton
- [ ] vendredi 4 sept. — Salle 1 — Spécifique force HYROX
- [ ] samedi 5 sept. — Salle 2 — 6 x 1 km allure HYROX
- [ ] dimanche 6 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 20 — 7 sept. - 13/09
- [ ] lundi 7 sept. — Repos complet
- [ ] mardi 8 sept. — Badminton
- [ ] mercredi 9 sept. — Badminton
- [ ] jeudi 10 sept. — Badminton
- [ ] vendredi 11 sept. — Salle 1 — Force allégée
- [ ] samedi 12 sept. — Salle 2 — Deload zone 2
- [ ] dimanche 13 sept. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 21 — 14 sept. - 20/09
- [ ] lundi 14 sept. — Repos complet
- [ ] mardi 15 sept. — Badminton
- [ ] mercredi 16 sept. — Badminton
- [ ] jeudi 17 sept. — Badminton
- [ ] vendredi 18 sept. — Salle 1 — Charge course / sled
- [ ] samedi 19 sept. — Salle 2 — 7 x 1 km + station courte
- [ ] dimanche 20 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 22 — 21 sept. - 27/09
- [ ] lundi 21 sept. — Repos complet
- [ ] mardi 22 sept. — Badminton
- [ ] mercredi 23 sept. — Badminton
- [ ] jeudi 24 sept. — Badminton
- [ ] vendredi 25 sept. — Salle 1 — Charge course / sled
- [ ] samedi 26 sept. — Salle 2 — 7 x 1 km + station courte
- [ ] dimanche 27 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 23 — 28 sept. - 04/10
- [ ] lundi 28 sept. — Repos complet
- [ ] mardi 29 sept. — Badminton
- [ ] mercredi 30 sept. — Badminton
- [ ] jeudi 1 oct. — Badminton
- [ ] vendredi 2 oct. — Salle 1 — Charge course / sled
- [ ] samedi 3 oct. — Salle 2 — 7 x 1 km + station courte
- [ ] dimanche 4 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 24 — 5 oct. - 11/10
- [ ] lundi 5 oct. — Repos complet
- [ ] mardi 6 oct. — Badminton
- [ ] mercredi 7 oct. — Badminton
- [ ] jeudi 8 oct. — Badminton
- [ ] vendredi 9 oct. — Salle 1 — Force allégée
- [ ] samedi 10 oct. — Salle 2 — Deload zone 2
- [ ] dimanche 11 oct. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 25 — 12 oct. - 18/10
- [ ] lundi 12 oct. — Repos complet
- [ ] mardi 13 oct. — Badminton
- [ ] mercredi 14 oct. — Badminton
- [ ] jeudi 15 oct. — Badminton
- [ ] vendredi 16 oct. — Salle 1 — Force entretien
- [ ] samedi 17 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] dimanche 18 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 26 — 19 oct. - 25/10
- [ ] lundi 19 oct. — Repos complet
- [ ] mardi 20 oct. — Badminton
- [ ] mercredi 21 oct. — Badminton
- [ ] jeudi 22 oct. — Badminton
- [ ] vendredi 23 oct. — Salle 1 — Force entretien
- [ ] samedi 24 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] dimanche 25 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 27 — 26 oct. - 01/11
- [ ] lundi 26 oct. — Repos complet
- [ ] mardi 27 oct. — Badminton
- [ ] mercredi 28 oct. — Badminton
- [ ] jeudi 29 oct. — Badminton
- [ ] vendredi 30 oct. — Salle 1 — Force entretien
- [ ] samedi 31 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] dimanche 1 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 28 — 2 nov. - 08/11
- [ ] lundi 2 nov. — Repos complet
- [ ] mardi 3 nov. — Badminton
- [ ] mercredi 4 nov. — Badminton
- [ ] jeudi 5 nov. — Badminton
- [ ] vendredi 6 nov. — Salle 1 — Force allégée
- [ ] samedi 7 nov. — Salle 2 — Deload zone 2
- [ ] dimanche 8 nov. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 29 — 9 nov. - 15/11
- [ ] lundi 9 nov. — Repos complet
- [ ] mardi 10 nov. — Badminton
- [ ] mercredi 11 nov. — Badminton
- [ ] jeudi 12 nov. — Badminton
- [ ] vendredi 13 nov. — Salle 1 — Pic de forme
- [ ] samedi 14 nov. — Salle 2 — 4 à 5 x 1 km contrôlés
- [ ] dimanche 15 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 30 — 16 nov. - 22/11
- [ ] lundi 16 nov. — Repos complet
- [ ] mardi 17 nov. — Badminton
- [ ] mercredi 18 nov. — Badminton
- [ ] jeudi 19 nov. — Badminton
- [ ] vendredi 20 nov. — Salle 1 — Grosse simulation contrôlée
- [ ] samedi 21 nov. — Salle 2 — 5 x 1 km allure course
- [ ] dimanche 22 nov. — Salle 3 — HYROX 8 blocs 85-90 %

#### Semaine 31 — 23 nov. - 29/11
- [ ] lundi 23 nov. — Repos complet
- [ ] mardi 24 nov. — Badminton
- [ ] mercredi 25 nov. — Badminton
- [ ] jeudi 26 nov. — Badminton
- [ ] vendredi 27 nov. — Salle 1 — Pic de forme
- [ ] samedi 28 nov. — Salle 2 — 4 à 5 x 1 km contrôlés
- [ ] dimanche 29 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 32 — 30 nov. - 06/12
- [ ] lundi 30 nov. — Repos complet
- [ ] mardi 1 déc. — Badminton
- [ ] mercredi 2 déc. — Badminton
- [ ] jeudi 3 déc. — Badminton
- [ ] vendredi 4 déc. — Salle 1 — Activation légère
- [ ] samedi 5 déc. — Salle 2 — Deload zone 2
- [ ] dimanche 6 déc. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 33 — 7 déc. - 13/12
- [ ] lundi 7 déc. — Repos complet
- [ ] mardi 8 déc. — Badminton léger
- [ ] mercredi 9 déc. — Badminton léger
- [ ] jeudi 10 déc. — Badminton léger
- [ ] vendredi 11 déc. — Salle 1 — Activation légère
- [ ] samedi 12 déc. — HYROX Paris
- [ ] dimanche 13 déc. — Récupération post-course

### Configuration C — 3 badmintons mercredi + jeudi + vendredi

Salle le mardi, badminton trois soirs d'affilée, course/moteur le samedi.

#### Semaine 1 — 27 avr. - 03/05
- [ ] lundi 27 avr. — Repos complet
- [ ] mardi 28 avr. — Salle 1 — Force + sled
- [ ] mercredi 29 avr. — Badminton
- [ ] jeudi 30 avr. — Badminton
- [ ] vendredi 1 mai — Badminton
- [ ] samedi 2 mai — Salle 2 — Tests course/moteur
- [ ] dimanche 3 mai — Salle 3 — HYROX 4 blocs

#### Semaine 2 — 4 mai - 10/05
- [ ] lundi 4 mai — Repos complet
- [ ] mardi 5 mai — Salle 1 — Force + sled
- [ ] mercredi 6 mai — Badminton
- [ ] jeudi 7 mai — Badminton
- [ ] vendredi 8 mai — Badminton
- [ ] samedi 9 mai — Salle 2 — 5 x 600 m
- [ ] dimanche 10 mai — Salle 3 — HYROX 4 blocs

#### Semaine 3 — 11 mai - 17/05
- [ ] lundi 11 mai — Repos complet
- [ ] mardi 12 mai — Salle 1 — Force + sled
- [ ] mercredi 13 mai — Badminton
- [ ] jeudi 14 mai — Badminton
- [ ] vendredi 15 mai — Badminton
- [ ] samedi 16 mai — Salle 2 — 5 x 800 m
- [ ] dimanche 17 mai — Salle 3 — HYROX 4 blocs

#### Semaine 4 — 18 mai - 24/05
- [ ] lundi 18 mai — Repos complet
- [ ] mardi 19 mai — Salle 1 — Force allégée
- [ ] mercredi 20 mai — Badminton
- [ ] jeudi 21 mai — Badminton
- [ ] vendredi 22 mai — Badminton
- [ ] samedi 23 mai — Salle 2 — Deload zone 2
- [ ] dimanche 24 mai — Salle 3 — HYROX 3 blocs allégés

#### Semaine 5 — 25 mai - 31/05
- [ ] lundi 25 mai — Repos complet
- [ ] mardi 26 mai — Salle 1 — Force + sled
- [ ] mercredi 27 mai — Badminton
- [ ] jeudi 28 mai — Badminton
- [ ] vendredi 29 mai — Badminton
- [ ] samedi 30 mai — Salle 2 — 5 x 800 m + rameur
- [ ] dimanche 31 mai — Salle 3 — HYROX 5 blocs

#### Semaine 6 — 1 juin - 07/06
- [ ] lundi 1 juin — Repos complet
- [ ] mardi 2 juin — Salle 1 — Force + sled
- [ ] mercredi 3 juin — Badminton
- [ ] jeudi 4 juin — Badminton
- [ ] vendredi 5 juin — Badminton
- [ ] samedi 6 juin — Salle 2 — 5 x 800 m + rameur
- [ ] dimanche 7 juin — Salle 3 — HYROX 5 blocs

#### Semaine 7 — 8 juin - 14/06
- [ ] lundi 8 juin — Repos complet
- [ ] mardi 9 juin — Salle 1 — Force + sled
- [ ] mercredi 10 juin — Badminton
- [ ] jeudi 11 juin — Badminton
- [ ] vendredi 12 juin — Badminton
- [ ] samedi 13 juin — Salle 2 — 5 x 800 m + rameur
- [ ] dimanche 14 juin — Salle 3 — HYROX 5 blocs

#### Semaine 8 — 15 juin - 21/06
- [ ] lundi 15 juin — Repos complet
- [ ] mardi 16 juin — Salle 1 — Force allégée
- [ ] mercredi 17 juin — Badminton
- [ ] jeudi 18 juin — Badminton
- [ ] vendredi 19 juin — Badminton
- [ ] samedi 20 juin — Salle 2 — Deload zone 2
- [ ] dimanche 21 juin — Salle 3 — HYROX 3 blocs allégés

#### Semaine 9 — 22 juin - 28/06
- [ ] lundi 22 juin — Repos complet
- [ ] mardi 23 juin — Salle 1 — Force lourde + sled
- [ ] mercredi 24 juin — Badminton
- [ ] jeudi 25 juin — Badminton
- [ ] vendredi 26 juin — Badminton
- [ ] samedi 27 juin — Salle 2 — 5 x 1 km + SkiErg
- [ ] dimanche 28 juin — Salle 3 — HYROX 6 blocs

#### Semaine 10 — 29 juin - 05/07
- [ ] lundi 29 juin — Repos complet
- [ ] mardi 30 juin — Salle 1 — Force lourde + sled
- [ ] mercredi 1 juil. — Badminton
- [ ] jeudi 2 juil. — Badminton
- [ ] vendredi 3 juil. — Badminton
- [ ] samedi 4 juil. — Salle 2 — 5 x 1 km + SkiErg
- [ ] dimanche 5 juil. — Salle 3 — HYROX 6 blocs

#### Semaine 11 — 6 juil. - 12/07
- [ ] lundi 6 juil. — Repos complet
- [ ] mardi 7 juil. — Salle 1 — Force lourde + sled
- [ ] mercredi 8 juil. — Badminton
- [ ] jeudi 9 juil. — Badminton
- [ ] vendredi 10 juil. — Badminton
- [ ] samedi 11 juil. — Salle 2 — 5 x 1 km + SkiErg
- [ ] dimanche 12 juil. — Salle 3 — HYROX 6 blocs

#### Semaine 12 — 13 juil. - 19/07
- [ ] lundi 13 juil. — Repos complet
- [ ] mardi 14 juil. — Salle 1 — Force allégée
- [ ] mercredi 15 juil. — Badminton
- [ ] jeudi 16 juil. — Badminton
- [ ] vendredi 17 juil. — Badminton
- [ ] samedi 18 juil. — Salle 2 — Deload zone 2
- [ ] dimanche 19 juil. — Salle 3 — HYROX 4 blocs allégés

#### Semaine 13 — 20 juil. - 26/07
- [ ] lundi 20 juil. — Repos complet
- [ ] mardi 21 juil. — Salle 1 — Endurance de force
- [ ] mercredi 22 juil. — Badminton
- [ ] jeudi 23 juil. — Badminton
- [ ] vendredi 24 juil. — Badminton
- [ ] samedi 25 juil. — Salle 2 — 6 x 1 km + station courte
- [ ] dimanche 26 juil. — Salle 3 — HYROX 7 blocs

#### Semaine 14 — 27 juil. - 02/08
- [ ] lundi 27 juil. — Repos complet
- [ ] mardi 28 juil. — Salle 1 — Endurance de force
- [ ] mercredi 29 juil. — Badminton
- [ ] jeudi 30 juil. — Badminton
- [ ] vendredi 31 juil. — Badminton
- [ ] samedi 1 août — Salle 2 — 6 x 1 km + station courte
- [ ] dimanche 2 août — Salle 3 — HYROX 7 blocs

#### Semaine 15 — 3 août - 09/08
- [ ] lundi 3 août — Repos complet
- [ ] mardi 4 août — Salle 1 — Endurance de force
- [ ] mercredi 5 août — Badminton
- [ ] jeudi 6 août — Badminton
- [ ] vendredi 7 août — Badminton
- [ ] samedi 8 août — Salle 2 — 6 x 1 km + station courte
- [ ] dimanche 9 août — Salle 3 — HYROX 7 blocs

#### Semaine 16 — 10 août - 16/08
- [ ] lundi 10 août — Repos complet
- [ ] mardi 11 août — Salle 1 — Force allégée
- [ ] mercredi 12 août — Badminton
- [ ] jeudi 13 août — Badminton
- [ ] vendredi 14 août — Badminton
- [ ] samedi 15 août — Salle 2 — Deload zone 2
- [ ] dimanche 16 août — Salle 3 — HYROX 5 blocs allégés

#### Semaine 17 — 17 août - 23/08
- [ ] lundi 17 août — Repos complet
- [ ] mardi 18 août — Salle 1 — Spécifique force HYROX
- [ ] mercredi 19 août — Badminton
- [ ] jeudi 20 août — Badminton
- [ ] vendredi 21 août — Badminton
- [ ] samedi 22 août — Salle 2 — 6 x 1 km allure HYROX
- [ ] dimanche 23 août — Salle 3 — HYROX 8 blocs

#### Semaine 18 — 24 août - 30/08
- [ ] lundi 24 août — Repos complet
- [ ] mardi 25 août — Salle 1 — Spécifique force HYROX
- [ ] mercredi 26 août — Badminton
- [ ] jeudi 27 août — Badminton
- [ ] vendredi 28 août — Badminton
- [ ] samedi 29 août — Salle 2 — 6 x 1 km allure HYROX
- [ ] dimanche 30 août — Salle 3 — HYROX 8 blocs

#### Semaine 19 — 31 août - 06/09
- [ ] lundi 31 août — Repos complet
- [ ] mardi 1 sept. — Salle 1 — Spécifique force HYROX
- [ ] mercredi 2 sept. — Badminton
- [ ] jeudi 3 sept. — Badminton
- [ ] vendredi 4 sept. — Badminton
- [ ] samedi 5 sept. — Salle 2 — 6 x 1 km allure HYROX
- [ ] dimanche 6 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 20 — 7 sept. - 13/09
- [ ] lundi 7 sept. — Repos complet
- [ ] mardi 8 sept. — Salle 1 — Force allégée
- [ ] mercredi 9 sept. — Badminton
- [ ] jeudi 10 sept. — Badminton
- [ ] vendredi 11 sept. — Badminton
- [ ] samedi 12 sept. — Salle 2 — Deload zone 2
- [ ] dimanche 13 sept. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 21 — 14 sept. - 20/09
- [ ] lundi 14 sept. — Repos complet
- [ ] mardi 15 sept. — Salle 1 — Charge course / sled
- [ ] mercredi 16 sept. — Badminton
- [ ] jeudi 17 sept. — Badminton
- [ ] vendredi 18 sept. — Badminton
- [ ] samedi 19 sept. — Salle 2 — 7 x 1 km + station courte
- [ ] dimanche 20 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 22 — 21 sept. - 27/09
- [ ] lundi 21 sept. — Repos complet
- [ ] mardi 22 sept. — Salle 1 — Charge course / sled
- [ ] mercredi 23 sept. — Badminton
- [ ] jeudi 24 sept. — Badminton
- [ ] vendredi 25 sept. — Badminton
- [ ] samedi 26 sept. — Salle 2 — 7 x 1 km + station courte
- [ ] dimanche 27 sept. — Salle 3 — HYROX 8 blocs

#### Semaine 23 — 28 sept. - 04/10
- [ ] lundi 28 sept. — Repos complet
- [ ] mardi 29 sept. — Salle 1 — Charge course / sled
- [ ] mercredi 30 sept. — Badminton
- [ ] jeudi 1 oct. — Badminton
- [ ] vendredi 2 oct. — Badminton
- [ ] samedi 3 oct. — Salle 2 — 7 x 1 km + station courte
- [ ] dimanche 4 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 24 — 5 oct. - 11/10
- [ ] lundi 5 oct. — Repos complet
- [ ] mardi 6 oct. — Salle 1 — Force allégée
- [ ] mercredi 7 oct. — Badminton
- [ ] jeudi 8 oct. — Badminton
- [ ] vendredi 9 oct. — Badminton
- [ ] samedi 10 oct. — Salle 2 — Deload zone 2
- [ ] dimanche 11 oct. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 25 — 12 oct. - 18/10
- [ ] lundi 12 oct. — Repos complet
- [ ] mardi 13 oct. — Salle 1 — Force entretien
- [ ] mercredi 14 oct. — Badminton
- [ ] jeudi 15 oct. — Badminton
- [ ] vendredi 16 oct. — Badminton
- [ ] samedi 17 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] dimanche 18 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 26 — 19 oct. - 25/10
- [ ] lundi 19 oct. — Repos complet
- [ ] mardi 20 oct. — Salle 1 — Force entretien
- [ ] mercredi 21 oct. — Badminton
- [ ] jeudi 22 oct. — Badminton
- [ ] vendredi 23 oct. — Badminton
- [ ] samedi 24 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] dimanche 25 oct. — Salle 3 — HYROX 8 blocs

#### Semaine 27 — 26 oct. - 01/11
- [ ] lundi 26 oct. — Repos complet
- [ ] mardi 27 oct. — Salle 1 — Force entretien
- [ ] mercredi 28 oct. — Badminton
- [ ] jeudi 29 oct. — Badminton
- [ ] vendredi 30 oct. — Badminton
- [ ] samedi 31 oct. — Salle 2 — 8 x 1 km progressifs
- [ ] dimanche 1 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 28 — 2 nov. - 08/11
- [ ] lundi 2 nov. — Repos complet
- [ ] mardi 3 nov. — Salle 1 — Force allégée
- [ ] mercredi 4 nov. — Badminton
- [ ] jeudi 5 nov. — Badminton
- [ ] vendredi 6 nov. — Badminton
- [ ] samedi 7 nov. — Salle 2 — Deload zone 2
- [ ] dimanche 8 nov. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 29 — 9 nov. - 15/11
- [ ] lundi 9 nov. — Repos complet
- [ ] mardi 10 nov. — Salle 1 — Pic de forme
- [ ] mercredi 11 nov. — Badminton
- [ ] jeudi 12 nov. — Badminton
- [ ] vendredi 13 nov. — Badminton
- [ ] samedi 14 nov. — Salle 2 — 4 à 5 x 1 km contrôlés
- [ ] dimanche 15 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 30 — 16 nov. - 22/11
- [ ] lundi 16 nov. — Repos complet
- [ ] mardi 17 nov. — Salle 1 — Grosse simulation contrôlée
- [ ] mercredi 18 nov. — Badminton
- [ ] jeudi 19 nov. — Badminton
- [ ] vendredi 20 nov. — Badminton
- [ ] samedi 21 nov. — Salle 2 — 5 x 1 km allure course
- [ ] dimanche 22 nov. — Salle 3 — HYROX 8 blocs 85-90 %

#### Semaine 31 — 23 nov. - 29/11
- [ ] lundi 23 nov. — Repos complet
- [ ] mardi 24 nov. — Salle 1 — Pic de forme
- [ ] mercredi 25 nov. — Badminton
- [ ] jeudi 26 nov. — Badminton
- [ ] vendredi 27 nov. — Badminton
- [ ] samedi 28 nov. — Salle 2 — 4 à 5 x 1 km contrôlés
- [ ] dimanche 29 nov. — Salle 3 — HYROX 8 blocs

#### Semaine 32 — 30 nov. - 06/12
- [ ] lundi 30 nov. — Repos complet
- [ ] mardi 1 déc. — Salle 1 — Activation légère
- [ ] mercredi 2 déc. — Badminton
- [ ] jeudi 3 déc. — Badminton
- [ ] vendredi 4 déc. — Badminton
- [ ] samedi 5 déc. — Salle 2 — Deload zone 2
- [ ] dimanche 6 déc. — Salle 3 — HYROX 6 blocs allégés

#### Semaine 33 — 7 déc. - 13/12
- [ ] lundi 7 déc. — Repos complet
- [ ] mardi 8 déc. — Salle 1 — Activation légère
- [ ] mercredi 9 déc. — Badminton léger
- [ ] jeudi 10 déc. — Badminton léger
- [ ] vendredi 11 déc. — Badminton léger
- [ ] samedi 12 déc. — HYROX Paris
- [ ] dimanche 13 déc. — Récupération post-course


---

## 4. Badminton — séance volontairement modifiable

Le badminton doit rester modifiable par l’utilisateur dans l’app.  
La PWA doit permettre de modifier :

- l’heure de début ;
- la durée ;
- l’intensité ;
- le type : loisir, technique, match, tournoi, séance courte ;
- la charge ressentie ;
- les calories ;
- la FC moyenne et max ;
- une note douleur ou fatigue.

### Modèle conseillé pour Codex

```ts
export type PlannedSessionOverride = {
  plannedSessionId: string;
  date: string;
  customTitle?: string;
  customStartTime?: string;
  customDurationMin?: number;
  customActivityType?: string;
  customIntensity?: "easy" | "normal" | "hard";
  customNotes?: string;
  replacedBy?: "rest" | "recovery" | "gym" | "badminton" | "other";
};
```

### Badminton — recommandations par état

| État | Durée conseillée | Intensité | Consigne |
|---|---:|---|---|
| Fatigué | 45-60 min | RPE 5-6 | technique, déplacements propres, pas de matchs à rallonge |
| Normal | 75-90 min | RPE 6-7 | séance classique, échauffement obligatoire |
| En forme | 90-110 min | RPE 7-8 | possible, mais pas deux jours de suite à très haute intensité |

### Échauffement badminton précis

| Exercice | Volume | Repos |
|---|---:|---:|
| Marche rapide ou corde très douce | 3 min | — |
| Squats poids du corps | 2 × 10 | 30 s |
| Fentes arrière | 2 × 8/jambe | 30 s |
| Montées mollets | 2 × 15 | 30 s |
| Pas chassés | 3 × 20 s | 20 s |
| Accélérations progressives | 3 × 15 s | 30 s |

### Retour au calme badminton

| Exercice | Durée |
|---|---:|
| Marche lente | 3-5 min |
| Mollets doux | 2 × 30 s/côté |
| Adducteurs doux | 2 × 30 s/côté |
| Respiration lente | 2 min |

---

## Checklists détaillées par séance

Ces cases sont faites pour valider les blocs importants d'une séance, surtout quand tu es fatigué et que tu veux savoir exactement ce qui a été fait.

### Checklist commune avant séance

- [ ] État du jour choisi : fatigué / normal / en forme.
- [ ] Douleur vérifiée : mollet, genou, tendon d'Achille, dos.
- [ ] Durée cible confirmée.
- [ ] RPE cible relu.
- [ ] Eau prête.
- [ ] Notes de séance ouvertes dans l'application.

### Badminton — validation

- [ ] Heure de début renseignée.
- [ ] Durée renseignée.
- [ ] Intensité prévue choisie : loisir / technique / match / tournoi / courte.
- [ ] Échauffement terminé.
- [ ] Séance réalisée.
- [ ] RPE noté.
- [ ] FC moyenne / max saisies si disponibles.
- [ ] Calories saisies si disponibles.
- [ ] Note douleur/fatigue ajoutée.
- [ ] Retour au calme terminé.

#### Badminton — échauffement à cocher

- [ ] Marche rapide ou corde très douce — 3 min.
- [ ] Squats poids du corps — 2 x 10.
- [ ] Fentes arrière — 2 x 8/jambe.
- [ ] Montées mollets — 2 x 15.
- [ ] Pas chassés — 3 x 20 s.
- [ ] Accélérations progressives — 3 x 15 s.

#### Badminton — retour au calme à cocher

- [ ] Marche lente — 3 à 5 min.
- [ ] Mollets doux — 2 x 30 s/côté.
- [ ] Adducteurs doux — 2 x 30 s/côté.
- [ ] Respiration lente — 2 min.

### Salle 1 — Force + sled

#### Échauffement commun

- [ ] Rameur, vélo ou tapis incliné — 6 min.
- [ ] Mobilité chevilles — 2 x 30 s/côté.
- [ ] Mobilité hanches — 2 x 30 s/côté.
- [ ] Squats poids du corps — 2 x 10.
- [ ] Fentes arrière — 2 x 8/jambe.
- [ ] Farmer carry léger — 2 x 20 m.
- [ ] Sled à vide ou très léger — 2 x 12,5 m.

#### Version normale

- [ ] A1 — Sled Push : séries selon progression, 12,5 m, RPE 7-8.
- [ ] A2 — Sled Pull : séries selon progression, 12,5 m, RPE 7-8.
- [ ] B — Trap bar deadlift ou front squat : 4-5 séries de 4-6 reps.
- [ ] C — Bulgarian split squat : 3 x 8/jambe.
- [ ] D — Soulevé de terre roumain haltères : 3 x 8-10 reps.
- [ ] E — Farmer carry : 3-5 x 60-120 m.
- [ ] F — Wall balls technique : 4-6 x 10-25 reps.
- [ ] G — Gainage latéral : 3 x 30-45 s/côté.
- [ ] Retour au calme / mobilité fait.
- [ ] RPE, durée, calories et notes saisis.

#### Version fatigué

- [ ] Zone 2 vélo ou rameur — 10 min.
- [ ] Sled Push léger — 4 x 12,5 m.
- [ ] Sled Pull léger — 3 x 12,5 m.
- [ ] Goblet squat — 3 x 8.
- [ ] Rowing poulie — 3 x 10.
- [ ] Farmer carry modéré — 3 x 40 m.
- [ ] Wall balls légers — 4 x 8-10.
- [ ] Mobilité hanches/mollets — 8 min.

#### Bonus en forme, un seul maximum

- [ ] Bonus A — 4 tours : 400 m course + 15 wall balls.
- [ ] Bonus B — Farmer carry lourd 4 x 100 m.
- [ ] Bonus C — Sled Push + Pull : +1 à +2 séries.

### Salle 2 — Course + moteur HYROX

#### Échauffement commun

- [ ] Footing facile ou tapis — 8 min.
- [ ] Montées de genoux légères — 2 x 20 s.
- [ ] Talons-fesses légers — 2 x 20 s.
- [ ] Squats poids du corps — 2 x 10.
- [ ] Fentes marchées — 2 x 10 pas.
- [ ] Accélérations progressives — 3 x 20 s.

#### Version normale

- [ ] A — Course fractionnée HYROX : volume selon progression.
- [ ] B — Rameur ou SkiErg : 250 à 500 m après course.
- [ ] C — Burpee broad jumps technique : 5 x 10 m.
- [ ] D — Farmer carry modéré : 3 x 60-80 m.
- [ ] E — Retour au calme : 8-10 min.
- [ ] RPE, durée, calories et notes saisis.

#### Version fatigué

- [ ] Zone 2 vélo, rameur ou tapis incliné — 35-45 min.
- [ ] Course facile — 3 x 500 m.
- [ ] Wall balls légers — 3 x 10.
- [ ] Farmer carry modéré — 3 x 40 m.
- [ ] Mobilité — 8 min.

#### Version en forme

- [ ] +1 bloc course + station vs normal.
- [ ] Farmer carry lourd — 4 x 100 m.
- [ ] Gainage — 3 x 45 s.

### Salle 3 — Spécifique HYROX

#### Échauffement commun

- [ ] Footing ou rameur — 8 min.
- [ ] Mobilité chevilles/hanches/épaules — 5 min.
- [ ] Squats poids du corps — 2 x 10.
- [ ] Fentes marchées — 2 x 10 pas.
- [ ] Wall balls légers — 2 x 8.
- [ ] Farmer carry léger — 2 x 30 m.
- [ ] Accélérations progressives — 3 x 20 s.

#### Stations à cocher selon le nombre de blocs prévu

- [ ] Bloc 1 — 1 km course + SkiErg.
- [ ] Bloc 2 — 1 km course + Sled Push.
- [ ] Bloc 3 — 1 km course + Sled Pull.
- [ ] Bloc 4 — 1 km course + Burpee Broad Jumps.
- [ ] Bloc 5 — 1 km course + Rameur.
- [ ] Bloc 6 — 1 km course + Farmer Carry.
- [ ] Bloc 7 — 1 km course + Sandbag Lunges.
- [ ] Bloc 8 — 1 km course + Wall Balls.
- [ ] Transitions notées : propres / moyennes / à améliorer.
- [ ] RPE, durée, calories et notes saisis.

#### Version fatigué

- [ ] Course facile ou vélo — 4-5 x 2 min.
- [ ] Rameur — 4-5 x 250 m.
- [ ] Wall balls légers — 4 x 10.
- [ ] Farmer carry — 4 x 20 m.
- [ ] Fentes sans charge — 3 x 10/jambe.
- [ ] Mobilité — 8 min.

### Après chaque séance

- [ ] Séance marquée réalisée ou modifiée dans l'application.
- [ ] Durée saisie.
- [ ] Calories saisies ou estimées.
- [ ] FC moyenne / max saisies si disponibles.
- [ ] RPE saisi.
- [ ] Notes ajoutées : énergie, douleur, sommeil, ajustements.
- [ ] Repas post-séance ou protéines prévus.


---

## 5. Séance Salle 1 — Force + sled

**Objectif :** construire la force utile HYROX : poussée, tirage, jambes, gainage, grip, wall balls.  
**Durée normale :** 70 à 85 min.  
**RPE cible :** 7 à 8 selon phase.  
**Repos entre blocs :** 2 à 3 min.

### Échauffement commun

| Exercice | Volume | Repos |
|---|---:|---:|
| Rameur, vélo ou tapis incliné | 6 min | — |
| Mobilité chevilles | 2 × 30 s/côté | 15 s |
| Mobilité hanches | 2 × 30 s/côté | 15 s |
| Squats poids du corps | 2 × 10 | 30 s |
| Fentes arrière | 2 × 8/jambe | 30 s |
| Farmer carry léger | 2 × 20 m | 45 s |
| Sled à vide ou très léger | 2 × 12,5 m | 60 s |

### Version normale — structure détaillée

| Bloc | Exercice | Séries | Répétitions / distance | Intensité | Repos |
|---|---|---:|---:|---|---:|
| A1 | Sled Push | voir progression | 12,5 m | RPE 7-8 | 90-120 s |
| A2 | Sled Pull | voir progression | 12,5 m | RPE 7-8 | 90-120 s |
| B | Trap bar deadlift ou front squat | 4-5 | 4-6 reps | RPE 7-8 | 2 min 30 à 3 min |
| C | Bulgarian split squat | 3 | 8/jambe | RPE 7 | 90 s après les deux jambes |
| D | Soulevé de terre roumain haltères | 3 | 8-10 reps | RPE 7 | 90 s |
| E | Farmer carry | 3-5 | 60-120 m | lourd propre | 90 s |
| F | Wall balls technique | 4-6 | 10-25 reps | propre | 45-75 s |
| G | Gainage latéral | 3 | 30-45 s/côté | propre | 30 s |

### Version fatigué

| Exercice | Séries | Volume | Intensité | Repos |
|---|---:|---:|---|---:|
| Zone 2 vélo ou rameur | 1 | 10 min | RPE 4-5 | — |
| Sled Push léger | 4 | 12,5 m | RPE 5 | 90 s |
| Sled Pull léger | 3 | 12,5 m | RPE 5 | 90 s |
| Goblet squat | 3 | 8 reps | RPE 6 | 90 s |
| Rowing poulie | 3 | 10 reps | RPE 6 | 75 s |
| Farmer carry modéré | 3 | 40 m | RPE 6 | 75 s |
| Wall balls légers | 4 | 8-10 reps | RPE 5 | 45 s |
| Mobilité hanches/mollets | 1 | 8 min | facile | — |

### Version en forme

Faire la version normale, puis ajouter **un seul bonus** :

| Bonus | Contenu | Repos |
|---|---|---:|
| Bonus A | 4 tours : 400 m course + 15 wall balls | 60 s entre tours |
| Bonus B | Farmer carry lourd 4 × 100 m | 90 s |
| Bonus C | Sled Push + Pull : +1 à +2 séries | 90-120 s |

**Règle :** pas de bonus si badminton intense la veille ou sommeil < 6 h.

---

## 6. Séance Salle 2 — Course + moteur HYROX

**Objectif :** courir avec de la fatigue musculaire, améliorer le cardio spécifique HYROX.  
**Durée normale :** 60 à 80 min.  
**RPE cible :** 7.  
**Repos entre blocs :** 60 à 120 s selon phase.

### Échauffement commun

| Exercice | Volume | Repos |
|---|---:|---:|
| Footing facile ou tapis | 8 min | — |
| Montées de genoux légères | 2 × 20 s | 30 s |
| Talons-fesses légers | 2 × 20 s | 30 s |
| Squats poids du corps | 2 × 10 | 30 s |
| Fentes marchées | 2 × 10 pas | 30 s |
| Accélérations progressives | 3 × 20 s | 40 s |

### Version normale — structure type

| Bloc | Exercice | Volume | Intensité | Repos |
|---|---|---:|---|---:|
| A | Course fractionnée HYROX | voir progression | RPE 7 | 60-90 s |
| B | Rameur ou SkiErg | 250 à 500 m après course | RPE 6-7 | inclus dans bloc |
| C | Burpee broad jumps technique | 5 × 10 m | propre | 60 s |
| D | Farmer carry modéré | 3 × 60-80 m | RPE 7 | 90 s |
| E | Retour au calme | 8-10 min | RPE 3 | — |

### Version fatigué

| Exercice | Volume | Intensité | Repos |
|---|---:|---|---:|
| Zone 2 vélo, rameur ou tapis incliné | 35-45 min | RPE 4-5 | — |
| Course facile | 3 × 500 m | RPE 5 | 90 s |
| Wall balls légers | 3 × 10 | RPE 5 | 45 s |
| Farmer carry modéré | 3 × 40 m | RPE 5-6 | 75 s |
| Mobilité | 8 min | facile | — |

### Version en forme

| Exercice | Volume | Intensité | Repos |
|---|---:|---|---:|
| Blocs course + station | +1 bloc vs normal | RPE 7-8 | 60-75 s |
| Farmer carry lourd | 4 × 100 m | RPE 8 | 90 s |
| Gainage | 3 × 45 s | propre | 30 s |

---

## 7. Séance Salle 3 — Spécifique HYROX

**Objectif :** apprendre à enchaîner course + station, gérer les transitions, améliorer le pacing.  
**Durée normale :** 70 à 95 min.  
**RPE cible :** 7 à 8.  
**Repos :** selon phase, de 2 min à transitions quasi course.

### Ordre des stations

1. 1 km course + SkiErg  
2. 1 km course + Sled Push  
3. 1 km course + Sled Pull  
4. 1 km course + Burpee Broad Jumps  
5. 1 km course + Rameur  
6. 1 km course + Farmer Carry  
7. 1 km course + Sandbag Lunges  
8. 1 km course + Wall Balls  

### Échauffement commun

| Exercice | Volume | Repos |
|---|---:|---:|
| Footing ou rameur | 8 min | — |
| Mobilité chevilles/hanches/épaules | 5 min | — |
| Squats poids du corps | 2 × 10 | 30 s |
| Fentes marchées | 2 × 10 pas | 30 s |
| Wall balls légers | 2 × 8 | 45 s |
| Farmer carry léger | 2 × 30 m | 45 s |
| Accélérations progressives | 3 × 20 s | 40 s |

### Repos selon phase

| Phase | Repos après chaque bloc course + station |
|---|---:|
| Semaines 1-4 | 2 min |
| Semaines 5-8 | 90 s |
| Semaines 9-16 | 75-90 s |
| Semaines 17-24 | 60-75 s |
| Semaines 25-28 | 45-60 s |
| Semaines 29-31 | transitions rapides, 30-60 s |
| Semaines 32-33 | 90 s, volume réduit |

### Gestion des stations

| Station | Volume normal | Découpage conseillé | Repos interne |
|---|---:|---|---:|
| SkiErg | 1000 m | continu | — |
| Sled Push | 4 × 12,5 m | 4 longueurs | 15-30 s entre longueurs si besoin |
| Sled Pull | 4 × 12,5 m | 4 longueurs | 15-30 s entre longueurs si besoin |
| Burpee Broad Jumps | 40 à 80 m | 5 à 10 m par séquence | 10-20 s si technique se dégrade |
| Rameur | 1000 m | continu | — |
| Farmer Carry | 100 à 200 m | 50 m + 50 m si besoin | 15-30 s si besoin |
| Sandbag Lunges | 50 à 100 m | 10 à 20 pas par séquence | 15-30 s si besoin |
| Wall Balls | 40 à 100 reps | séries de 10 à 25 | 10-25 s |

### Version fatigué

| Exercice | Volume | Intensité | Repos |
|---|---:|---|---:|
| Course facile ou vélo | 4-5 × 2 min | RPE 5 | 60 s |
| Rameur | 4-5 × 250 m | RPE 5 | 60 s |
| Wall balls légers | 4 × 10 | RPE 5 | 45 s |
| Farmer carry | 4 × 20 m | RPE 5 | 60 s |
| Fentes sans charge | 3 × 10/jambe | RPE 5 | 60 s |
| Mobilité | 8 min | facile | — |

### Version en forme

Faire la séance normale avec :

- +1 bloc si la phase le permet ;
- transitions plus courtes ;
- charges proches course ;
- mais aucune station à l’échec.

---

## 8. Progression semaine par semaine

| Semaine | Phase | Particularité | Salle 1 — Force + sled | Salle 2 — Course + moteur | Salle 3 — Spécifique HYROX |
|---:|---|---|---|---|---|
| 1 | Reprise/tests | Tests légers | Push 5×12,5 m / Pull 4×12,5 m / force 4×5 | Test 1 km + 1000 m rameur + 20 min Z2 | 4 blocs à 70 %, repos 2 min |
| 2 | Reprise/tests | Volume doux | Push 6×12,5 / Pull 5×12,5 / wall balls 5×12 | 5×600 m + 500 m rameur, repos 90 s | 4 blocs à 70 %, repos 2 min |
| 3 | Reprise/tests | Consolidation | Push 6×12,5 / Pull 5×12,5 / farmer 3×80 m | 5×800 m + 500 m rameur, repos 90 s | 5 blocs à 70 %, repos 2 min |
| 4 | Deload | -40 % volume | Push 4×12,5 léger / Pull 3×12,5 | 40 min Z2 + 4 accélérations | 3-4 blocs faciles |
| 5 | Base aérobie | Reprise charge | Push 6×12,5 / Pull 5×12,5 / force 4×6 | 5×800 m + 500 m rameur, repos 90 s | 5 blocs à 75 %, repos 90 s |
| 6 | Base aérobie | Progression | Push 7×12,5 / Pull 5×12,5 / farmer 4×80 m | 5×900 m + 500 m SkiErg, repos 90 s | 5 blocs à 75 %, repos 90 s |
| 7 | Base aérobie | Sled stable | Push 7×12,5 / Pull 6×12,5 | 5×1 km + 500 m rameur, repos 90 s | 6 blocs à 75 %, repos 90 s |
| 8 | Deload | -40 % volume | Push 5×12,5 modéré / Pull 4×12,5 | 40-45 min Z2 | 4 blocs faciles |
| 9 | Force | Charge + | Push 7×12,5 lourd / Pull 6×12,5 | 5×1 km + 500 m SkiErg, repos 75-90 s | 5 blocs à 78 %, repos 75-90 s |
| 10 | Force | Jambes fortes | Push 8×12,5 / Pull 6×12,5 / force 5×4 | 5×1 km + 10 burpees, repos 75 s | 6 blocs à 78 %, repos 75-90 s |
| 11 | Force | Wall balls + | Push 8×12,5 / Pull 7×12,5 / wall balls 6×15 | 6×1 km + 250 m SkiErg, repos 75 s | 6 blocs à 80 %, repos 75 s |
| 12 | Deload | -40 % volume | Push 5×12,5 / Pull 4×12,5 | 45 min Z2 | 4 blocs faciles |
| 13 | Endurance force | Enchaînements | Push 8×12,5 / Pull 7×12,5 | 6×1 km + station courte, repos 75 s | 6 blocs à 80 %, repos 75 s |
| 14 | Endurance force | Lunges + | Push 8×12,5 / Pull 7×12,5 / lunges 3×20 m | 6×1 km + 15 wall balls, repos 75 s | 6 blocs à 80 %, repos 75 s |
| 15 | Endurance force | Farmer + | Push 8×12,5 / Pull 7×12,5 / farmer 5×100 m | 6×1 km + 10 BBJ, repos 60-75 s | 7 blocs à 80 %, repos 75 s |
| 16 | Deload | -40 % volume | Push 5×12,5 technique / Pull 5×12,5 | 4×600 m facile + rameur | 5 blocs faciles |
| 17 | Spécifique 1 | HYROX pace | Push 8×12,5 / Pull 7×12,5 proche course | 6×1 km + station courte, repos 60-75 s | 6 blocs à 82 %, repos 60-75 s |
| 18 | Spécifique 1 | Transitions | Push 8×12,5 / Pull 7×12,5 | 6×1 km + station, transitions rapides | 7 blocs à 82 %, repos 60-75 s |
| 19 | Spécifique 1 | Wall balls + | Push 8×12,5 / Pull 8×12,5 / wall balls 5×20 | 7×1 km + station courte | 7 blocs à 85 %, repos 60 s |
| 20 | Deload | -40 % volume | Push 5×12,5 / Pull 5×12,5 | 45 min Z2 | 5 blocs faciles |
| 21 | Spécifique 2 | Charge spécifique | Push 8×12,5 charge course / Pull 7×12,5 | 7×1 km + station, repos 60 s | 7 blocs à 85 %, repos 60 s |
| 22 | Spécifique 2 | Gros bloc | Push 8×12,5 / Pull 8×12,5 | 7×1 km progressifs | 7 blocs à 85 %, repos 45-60 s |
| 23 | Spécifique 2 | 8 blocs approche | Push 8×12,5 / Pull 8×12,5 / farmer lourd | 8×1 km contrôlés | 8 blocs à 85 %, repos 45-60 s |
| 24 | Deload | -40 % volume | Push 5×12,5 / Pull 5×12,5 | 5×500 m facile + rameur | 5 blocs faciles |
| 25 | Simulation | 8 blocs | Force entretien 3×5 + sled technique | 8×1 km progressifs | 8 blocs à 85 %, repos 45-60 s |
| 26 | Simulation | Pacing | Force entretien 3×5 + farmer | 6×1 km allure course + stations | 8 blocs à 85-88 %, transitions rapides |
| 27 | Simulation | Grosse semaine | Sled proche course + wall balls 5×25 | 8×1 km contrôlés | 8 blocs à 88 %, transitions rapides |
| 28 | Deload | -40 % volume | Force légère + sled technique | 40 min Z2 + 3 accélérations | 5 blocs faciles |
| 29 | Pic | Qualité | Sled dynamique / force 3×3-5 | 4-5×1 km contrôlés | 6 blocs à 80 %, propre |
| 30 | Pic | Dernière grosse simulation | Sled charge course, volume réduit | 5×1 km allure course | 8 blocs à 85-90 %, dernière grosse séance |
| 31 | Pic | Réduction volume | Force entretien légère | 4×1 km contrôlés | 5-6 blocs à 75-80 % |
| 32 | Affûtage | Fraîcheur | Sled 3×12,5 facile / activation | 3×1 km allure course, repos complet | 4 blocs faciles |
| 33 | Course | Activation | 20-30 min facile + 3 accélérations | mobilité + 3×10 wall balls | HYROX / repos selon date |

---

## 9. Détail des blocs de progression par phase

### Semaines 1 à 4 — reprise + tests

Objectif : repères, technique, volume contrôlé.

#### Salle 1

| Exercice | Semaines 1-3 | Semaine 4 |
|---|---:|---:|
| Sled Push | 5-6 × 12,5 m, repos 90 s | 4 × 12,5 m léger |
| Sled Pull | 4-5 × 12,5 m, repos 90 s | 3 × 12,5 m léger |
| Trap bar/front squat | 4 × 5, repos 2 min 30 | 3 × 6 léger |
| Split squat | 3 × 8/jambe, repos 90 s | 2 × 8/jambe |
| Farmer carry | 3 × 60-80 m, repos 90 s | 2 × 40 m |
| Wall balls | 5 × 10-12, repos 45-60 s | 4 × 8 |

#### Salle 2

| Exercice | Semaines 1-3 | Semaine 4 |
|---|---:|---:|
| Course | 5 × 600-800 m, repos 90 s | 35-40 min Z2 |
| Rameur/SkiErg | 500 m après chaque course | optionnel 3×250 m |
| Burpee broad jumps | 5 × 10 m, repos 60 s | 3 × 8 m |
| Retour au calme | 8-10 min | 10 min |

#### Salle 3

| Paramètre | Semaines 1-3 | Semaine 4 |
|---|---:|---:|
| Nombre de blocs | 4 à 5 | 3 à 4 |
| Intensité | 70 % | 60 % |
| Repos entre blocs | 2 min | 2 min 30 |
| Objectif | technique | récupération active |

---

### Semaines 5 à 8 — base aérobie + force

Objectif : renforcer moteur et jambes.

| Exercice clé | Volume normal | Repos |
|---|---:|---:|
| Sled Push | 6-7 × 12,5 m | 90-120 s |
| Sled Pull | 5-6 × 12,5 m | 90-120 s |
| Force jambes | 4 × 6 | 2 min 30 |
| Course | 5 × 800 m à 1 km | 90 s |
| Rameur/SkiErg | 500 m par bloc | inclus |
| HYROX spécifique | 5-6 blocs | 90 s |

Semaine 8 = deload : réduire volume de 40 %.

---

### Semaines 9 à 12 — force + perte de poids

Objectif : sled plus lourd, force, protéines hautes.

| Exercice clé | Volume normal | Repos |
|---|---:|---:|
| Sled Push lourd | 7-8 × 12,5 m | 120 s |
| Sled Pull lourd | 6-7 × 12,5 m | 120 s |
| Trap bar deadlift | 5 × 4 | 3 min |
| Split squat | 3 × 8/jambe | 90 s |
| Wall balls | 6 × 15 | 60 s |
| Course | 5-6 × 1 km | 75-90 s |
| Simulation | 5-6 blocs | 75-90 s |

Semaine 12 = deload.

---

### Semaines 13 à 16 — endurance de force

Objectif : supporter la fatigue musculaire.

| Exercice clé | Volume normal | Repos |
|---|---:|---:|
| Sled Push | 8 × 12,5 m | 90-120 s |
| Sled Pull | 7 × 12,5 m | 90-120 s |
| Lunges chargés | 3 × 20 m | 90 s |
| Farmer carry | 4-5 × 100 m | 90 s |
| Wall balls | 5-6 × 18-20 | 60 s |
| Course + station | 6 × 1 km | 60-75 s |
| Simulation | 6-7 blocs | 75 s |

Semaine 16 = deload.

---

### Semaines 17 à 24 — spécifique HYROX

Objectif : transitions, allure HYROX, charges proches course.

| Exercice clé | Volume normal | Repos |
|---|---:|---:|
| Sled Push proche course | 8 × 12,5 m | 90 s |
| Sled Pull proche course | 7-8 × 12,5 m | 90 s |
| Farmer carry lourd | 4 × 100-120 m | 90 s |
| Sandbag lunges | 4 × 20 m | 90 s |
| Wall balls | 5 × 20-25 | 60 s |
| Course + station | 6-7 × 1 km | 60 s |
| Simulation | 7-8 blocs | 45-75 s |

Semaines 20 et 24 = deload.

---

### Semaines 25 à 28 — simulations

Objectif : apprendre à finir propre.

| Exercice clé | Volume normal | Repos |
|---|---:|---:|
| Force | 3 × 5 entretien | 2 min |
| Sled | charge course, volume contrôlé | 90 s |
| Wall balls | 5 × 25 | 60 s |
| Course | 8 × 1 km progressifs | 45-75 s |
| Simulation | 8 blocs | 45-60 s |

Semaine 28 = deload.

---

### Semaines 29 à 33 — pic + affûtage

Objectif : fraîcheur, vitesse, confiance.

| Semaine | Consigne |
|---:|---|
| 29 | volume réduit, qualité, pas d’échec |
| 30 | dernière grosse simulation 8 blocs à 85-90 % |
| 31 | réduction nette, 5-6 blocs max |
| 32 | affûtage, 3×1 km, 4 blocs faciles |
| 33 | activation + course |

---

## 10. Repos précis entre séries — résumé rapide

| Exercice | Repos normal | Repos fatigué | Repos en forme |
|---|---:|---:|---:|
| Sled Push | 90-120 s | 120 s | 90 s |
| Sled Pull | 90-120 s | 120 s | 90 s |
| Trap bar/front squat | 2 min 30 à 3 min | 2 min | 2 min 30 |
| Presse | 2 min | 90 s | 2 min |
| Split squat | 90 s | 90 s | 75-90 s |
| Soulevé de terre roumain | 90 s | 90 s | 75-90 s |
| Farmer carry | 90 s | 75-90 s | 90 s |
| Wall balls | 45-75 s | 60 s | 30-60 s |
| Burpee broad jumps | 60-90 s | 90 s | 60 s |
| Course 1 km | 60-90 s | 90-120 s | 45-75 s |
| Rameur/SkiErg 500 m | 60-90 s | 90 s | 60 s |
| Gainage | 30-45 s | 45 s | 30 s |

---

## 11. Adaptations automatiques à prévoir dans la PWA

### Si l’utilisateur déclare “fatigué”

- réduire les séries de 30 à 50 % ;
- garder RPE ≤ 6 ;
- augmenter les repos de 20 à 30 % ;
- remplacer les sprints par zone 2 ;
- garder la technique.

### Si l’utilisateur déclare “en forme”

- ajouter un bonus court ;
- ne pas ajouter plus d’un bonus ;
- ne jamais ajouter de bonus si douleur, mauvais sommeil ou 3 séances intenses récentes.

### Si badminton intense la veille

- Salle 1 : pas de bonus jambes ;
- Salle 2 : version normale prudente ou fatiguée ;
- Salle 3 : réduire d’un bloc si jambes lourdes.

### Si douleur tendon/mollet/genou

- éviter course intense ;
- remplacer par vélo, rameur ou SkiErg ;
- garder mobilité et renforcement léger ;
- afficher recommandation rouge si douleur ≥ 6/10.

---

## 12. Prompt Codex — rendre les séances prévues modifiables

```md
# Mission Codex : rendre les séances prévues modifiables

Le planning HYROX génère des séances prévues automatiquement, mais l’utilisateur doit pouvoir modifier les séances prévues sans casser le plan général.

## Objectif

Ajouter un système d’overrides pour les séances prévues.

L’utilisateur doit pouvoir modifier :
- date,
- heure,
- durée,
- titre,
- type,
- intensité,
- notes,
- remplacement de la séance par repos/récupération/badminton/salle/autre.

Ce besoin est particulièrement important pour le badminton, car l’utilisateur veut pouvoir changer lui-même :
- le temps,
- l’activité,
- l’intensité,
- la présence ou non de badminton.

## Type à ajouter

```ts
export type PlannedSessionOverride = {
  id: string;
  plannedSessionId: string;
  date: string;
  customTitle?: string;
  customStartTime?: string;
  customDurationMin?: number;
  customActivityType?: string;
  customIntensity?: "easy" | "normal" | "hard";
  customNotes?: string;
  replacedBy?: "rest" | "recovery" | "gym" | "badminton" | "other";
  updatedAt: string;
};
```

## Stockage

Ajouter dans storageService :
- getPlannedSessionOverrides
- savePlannedSessionOverride
- updatePlannedSessionOverride
- deletePlannedSessionOverride
- resetPlannedSessionOverrides

## Logique

Créer une fonction :

```ts
applyPlannedSessionOverrides(
  plannedSessions: PlannedSession[],
  overrides: PlannedSessionOverride[]
): PlannedSession[]
```

Elle doit retourner le planning généré + les modifications utilisateur.

## UX

Sur chaque carte de séance prévue, ajouter :
- bouton “modifier”,
- bouton “remplacer”,
- bouton “réinitialiser”.

Pour badminton, ajouter une édition rapide :
- durée,
- heure,
- intensité,
- activité,
- note.

## Contraintes

- Ne pas modifier directement les données générées du plan.
- Stocker uniquement les overrides.
- L’export/import JSON doit inclure ces overrides.
- Le reset doit pouvoir supprimer seulement les modifications du planning.
- Le design doit rester mobile-first et sobre.
```

---

## 13. Notes de sécurité et récupération

Ce plan est une base de coaching sportif général. Il doit être adapté selon :

- douleur ;
- fatigue ;
- sommeil ;
- disponibilité réelle ;
- niveau de départ ;
- antécédents de blessure ;
- charge badminton.

Si une douleur augmente pendant la séance, la séance change immédiatement : réduction, remplacement ou arrêt.  
Le but n’est pas d’être un héros du mardi soir. Le but est d’arriver prêt en décembre.
