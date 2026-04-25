# HYROX Prep Tracker

PWA mobile-first pour suivre une préparation HYROX personnalisée : planning semaine par semaine, séances, repas, calories, poids, statistiques, export/import JSON et fonctionnement hors ligne.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- vite-plugin-pwa
- lucide-react
- recharts
- date-fns
- zod

## Lancer le projet

```bash
npm install
npm run dev
```

Build production :

```bash
npm run build
npm run preview
```

## Configuration

La configuration par défaut se trouve dans `src/data/defaults.ts`.

- `targetDate` : date cible HYROX
- `startDate` : début de préparation
- `targetWeightLoss` : objectif de perte de poids
- `vacationWeeks` : semaines de vacances, avec charge automatiquement réduite

Ces réglages peuvent aussi être modifiés dans l’écran Réglages de l’application.

## Données locales

La V1 n’utilise pas de backend. Les données sont stockées dans `localStorage` avec export/import JSON depuis la page Réglages. L’architecture sépare les services pour faciliter un futur ajout Supabase ou Firebase.
