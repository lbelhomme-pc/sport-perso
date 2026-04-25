# HYROX Prep Tracker

## Objectif du projet

`HYROX Prep Tracker` est une PWA locale, mobile-first, pour suivre une préparation HYROX personnalisée jusqu'à Paris Porte de Versailles en décembre.

L'application sert à piloter :

- Le planning d'entraînement semaine par semaine.
- Les séances réalisées.
- Les repas et les apports nutritionnels.
- Le poids et la progression vers -6 kg.
- Les statistiques globales.
- Les réglages de préparation, vacances incluses.

La V1 fonctionne sans backend. Toutes les données sont stockées dans le navigateur, avec export/import JSON.

## Stack technique

- Vite
- React
- TypeScript
- Tailwind CSS
- vite-plugin-pwa
- lucide-react
- recharts
- date-fns
- zod

## Arborescence

```txt
src/
  app/
    App.tsx
    routes.tsx
  components/
    charts/
      ComparisonBarChart.tsx
      MetricBarChart.tsx
      MetricLineChart.tsx
    forms/
      MealForm.tsx
      SessionForm.tsx
      WeightForm.tsx
    layout/
      AppLayout.tsx
    ui/
      EmptyState.tsx
      MetricCard.tsx
      PageHeader.tsx
      ProgressBar.tsx
      SectionCard.tsx
  data/
    commonFoods.ts
    defaults.ts
    phases.ts
    trainingPlan.ts
  hooks/
    useDailyContext.ts
    useDashboard.ts
    useMeals.ts
    useSessions.ts
    useSettings.ts
    useStoredData.ts
    useWeight.ts
  pages/
    DashboardPage.tsx
    MealsPage.tsx
    PlanningPage.tsx
    SessionsPage.tsx
    SettingsPage.tsx
    StatsPage.tsx
    WeightPage.tsx
  services/
    exportService.ts
    favoriteFoodsService.ts
    openFoodFactsService.ts
    recommendationService.ts
    storageService.ts
  types/
    index.ts
  utils/
    calories.ts
    dates.ts
    nutrition.ts
    training.ts
```

## Pages du site

### Dashboard `/`

Vue rapide du jour :

- Séance prévue.
- Boutons rapides pour marquer une séance réalisée, ajouter une séance ou ajouter un repas.
- Ressenti du jour : fatigué, normal, en forme.
- Pas réalisés et calories NEAT estimées.
- Calories mangées.
- Calories sport.
- Objectif à manger ajusté.
- Protéines.
- Poids.
- Reste à manger et déficit réel estimé.
- Alertes intelligentes.
- Résumé de la semaine.

### Planning `/planning`

Permet de choisir :

- La semaine.
- La configuration badminton.
- Le niveau d'énergie.

Affiche les séances prévues jour par jour :

- Repos.
- Badminton.
- Salle force.
- Course.
- HYROX spécifique.
- Récupération.

Chaque séance possède une version fatigué, normale et en forme.

Chaque carte de séance possède aussi une checklist persistante avec cases à cocher :

- Préparation avant séance.
- Échauffement.
- Blocs principaux.
- Bonus en forme si applicable.
- Retour au calme.
- Données à saisir après séance.

### Séances `/sessions`

Historique des séances réalisées avec :

- Date.
- Type.
- Durée.
- FC moyenne.
- FC max.
- Calories.
- RPE.
- Notes.

Les séances peuvent être ajoutées, modifiées ou supprimées.

### Repas `/meals`

Journal alimentaire par jour :

- Ajout rapide de repas.
- Plusieurs aliments dans un même repas.
- Quantité en grammes, millilitres ou dose/portion selon l'aliment, avec virgule acceptée.
- Totaux calories, protéines, glucides, lipides.
- Reste à manger, déficit réel estimé et calories NEAT liées aux pas.
- Recherche Open Food Facts.
- Liste locale d'aliments simples.
- Favoris personnels par catégorie.
- Brouillon automatique.
- Modification des aliments déjà ajoutés.

### Poids `/weight`

Suivi du poids :

- Ajout du poids du jour.
- Graphique.
- Moyenne hebdomadaire.
- Progression vers -6 kg.
- Tendance 7 jours et 30 jours.

### Statistiques `/stats`

Graphiques et cartes :

- Volume d'entraînement par semaine.
- Calories sport par semaine.
- Calories alimentaires par jour.
- Protéines par jour.
- Pas quotidiens.
- Calories NEAT estimées via les pas.
- Poids.
- Séances prévues vs réalisées.
- Total séances, badminton, salle, calories sport, FC moyenne, RPE moyen.
- Total pas et calories NEAT sur les 21 derniers jours.

### Réglages `/settings`

Configuration locale :

- Date cible HYROX.
- Début de préparation.
- Poids de départ.
- Poids actuel par défaut.
- Objectif de perte de poids.
- Protéines en g/kg.
- Taille, âge, sexe et calcul automatique du métabolisme basal.
- Métabolisme basal manuel si le calcul automatique est désactivé.
- Déficit cible kcal/jour.
- Semaines de vacances.
- Export JSON.
- Import JSON.
- Reset des données.

## Modèle de données principal

Les types sont centralisés dans `src/types/index.ts`.

Données suivies :

- `Settings`
- `PlannedSession`
- `CompletedSession`
- `Meal`
- `MealFoodItem`
- `WeightEntry`
- `DailyContext`

`DailyContext` stocke le ressenti du jour et les pas réalisés pour ajuster les calories :

```ts
type DailyContext = {
  date: string;
  energyLevel: "fatigue" | "normal" | "strong";
  steps?: number;
};
```

## Objectif à manger ajusté et déficit journalier

Le métabolisme basal est calculé automatiquement avec la formule Mifflin-St Jeor, à partir du poids, de la taille, de l'âge et du sexe.

```txt
Homme : 10 x poids + 6,25 x taille - 5 x âge + 5
Femme : 10 x poids + 6,25 x taille - 5 x âge - 161
```

L'app utilise le dernier poids saisi quand il existe, sinon le poids actuel par défaut des réglages. Une valeur manuelle reste disponible uniquement si le calcul automatique est désactivé.

Le champ `Déficit cible kcal/jour` vaut `400 kcal` par défaut.

L'objectif à manger affiché dans Dashboard et Repas est maintenant ajusté selon :

- La séance prévue du jour.
- Les calories sport déjà saisies.
- Le ressenti du jour.
- Les pas réalisés dans la journée.

La dépense estimée est calculée ainsi :

```txt
Dépense estimée = base métabolique + ajustement activité + ajustement ressenti + NEAT pas
```

L'objectif à manger est calculé ainsi :

```txt
Objectif à manger = dépense estimée - déficit cible
```

Le déficit réel estimé est calculé ainsi :

```txt
Déficit réel = dépense estimée - calories mangées
```

Le reste à manger est calculé ainsi :

```txt
Reste à manger = objectif à manger - calories mangées
```

Logique actuelle :

- Jour repos : +0 kcal.
- Récupération : +100 kcal.
- Salle force : +250 kcal.
- Badminton : +300 kcal.
- Course : +350 kcal.
- HYROX : +500 kcal.
- Si des calories sport sont déjà saisies, l'app utilise environ 60 % de ces calories comme ajustement.
- Ressenti fatigué : +150 kcal.
- Ressenti normal : +0 kcal.
- Ressenti en forme : +75 kcal.
- NEAT pas, estimation basse : `pas × poids(kg) × 0,0004`.
- Déficit cible par défaut : -400 kcal.

Exemple :

```txt
Métabolisme basal : 1800
Badminton prévu : +300
Ressenti fatigué : +150
8500 pas à 80 kg : +272
Déficit cible : -400
Objectif à manger : 2122 kcal
```

L'idée est de garder la perte de poids progressive, sans créer un déficit trop agressif les jours où la charge sportive ou la fatigue augmente.

La base locale d'aliments contient aussi les aliments fitness courants pour limiter les échecs de recherche Open Food Facts : dinde, poulet, boeuf maigre, thon, saumon, cabillaud, crevettes, tofu, légumineuses, riz, pâtes, quinoa, pommes de terre, pain complet, whey, protéines Nutripure/MyProtein/Bulk/Foodspring/Aptonia, laitages, fromages, légumes, fruits et bonnes graisses.

## Stockage local

Les données sont stockées via `src/services/storageService.ts`.

Le stockage local contient :

- Réglages.
- Séances.
- Repas.
- Poids.
- Contextes journaliers.
- Checklists de validation des séances prévues.

Les favoris alimentaires sont gérés séparément dans `src/services/favoriteFoodsService.ts`.

## Services importants

- `storageService.ts` : lecture/écriture locale, validation zod, reset.
- `exportService.ts` : export/import JSON.
- `openFoodFactsService.ts` : recherche Open Food Facts + normalisation nutritionnelle.
- `favoriteFoodsService.ts` : favoris alimentaires personnels.
- `recommendationService.ts` : alertes intelligentes.

## Commandes utiles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## État actuel

Le projet compile avec `npm run build`.

Il reste un avertissement de taille de bundle côté Vite, lié aux dépendances graphiques et PWA. Ce n'est pas bloquant pour la V1.
