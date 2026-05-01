# AGENT.MD

## Mission Produit

Cette application doit devenir une application generaliste de suivi sportif,
nutritionnel et de progression, utilisable par tout type de sport.

HYROX reste un cas d'usage avance, conserve dans un mode competition ou un
programme specialise, mais ne doit plus piloter l'identite generale de
l'application.

## Principes UX

- Mobile-first avant desktop.
- Interface utilisable fatigue, apres une seance.
- Peu de clics, gros boutons, textes courts.
- Dashboard = synthese, pas formulaire de saisie complexe.
- Les actions de modification vivent dans les sections dediees.
- Les alertes doivent rester utiles, sobres et non culpabilisantes.
- La nutrition ne doit pas devenir une application de regime agressive.
- Les donnees sportives doivent pouvoir couvrir musculation, course, velo,
  sport de raquette, sport hybride, mobilite, recuperation et seance libre.

## Principes Sport / Sante

- Prioriser regularite, progression et recuperation.
- Eviter les recommandations extremes.
- Le deficit calorique doit etre contextualise selon objectif, energie,
  entrainement, sommeil et ressenti.
- Les douleurs, la fatigue et le sommeil sont des donnees aussi importantes
  que les calories ou les charges.
- Les programmes competition doivent accepter phases, deload, date cible et
  objectifs precis.

## Principes Techniques

- Refactoriser progressivement, sans casser les donnees locales existantes.
- Garder une compatibilite avec les sauvegardes JSON existantes.
- Versionner les donnees avant toute migration de schema.
- Isoler les contenus specialises dans des modules de programme.
- Eviter les fichiers monolithiques quand une logique devient reutilisable.
- Ne pas ajouter de backend en V1.
- Conserver le fonctionnement PWA et offline-first.

## Nommage Cible

- Session -> Workout ou Seance selon le contexte UI.
- Planning -> Programmes ou Programme.
- HYROX -> Mode competition / Programme HYROX.
- Settings -> Profil, Objectifs, Preferences, Sauvegarde.
- Calories cible -> Objectif alimentaire ou cible a manger.

## Strategie De Generalisation

Phase 1 : nettoyer l'identite generale et isoler HYROX.

Phase 2 : ajouter profil utilisateur, objectifs et sports pratiques.

Phase 3 : generaliser nutrition, hydratation, sommeil et recuperation.

Phase 4 : personnalisation avancee, programmes multi-sports, tests physiques
et recommandations.

## Regles De Modification

- Ne pas supprimer une fonctionnalite HYROX existante sans la replacer dans
  un mode specialise.
- Ne pas casser les imports, routes, build Vite ou PWA.
- Verifier la compilation apres les modifications structurantes.
- Preferer les petits changements coherents aux grosses refontes risquee.
