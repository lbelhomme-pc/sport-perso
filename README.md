# Sport Progress Tracker

PWA mobile-first pour suivre sport, nutrition, progression, poids, habitudes et
programmes en local-first.

L'application vient d'une preparation HYROX personnalisee. La phase 1 de
generalisation garde HYROX comme programme competition specialise, mais
l'identite generale devient multi-sport : musculation, course, velo, natation,
sport de raquette, sport hybride, mobilite, recuperation, tests et seance libre.

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

La configuration par defaut se trouve dans `src/data/defaults.ts`.

- `appMode` : mode principal de l'application.
- `enabledSports` : sports suivis par defaut.
- `targetDate` : date cible competition si un evenement est active.
- `startDate` : debut du programme actif.
- `targetWeightLoss` : objectif de composition corporelle.
- `vacationWeeks` : semaines de vacances, avec charge automatiquement reduite.

## Donnees locales

La V1 n'utilise pas de backend. Les donnees sont stockees dans `localStorage`
avec export/import JSON depuis la page Profil. Les anciennes donnees HYROX
restent compatibles pendant la generalisation.
