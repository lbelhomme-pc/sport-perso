# Contexte projet - Sport Progress Tracker

Ce fichier sert de point de reprise pour ouvrir une nouvelle conversation Codex sans perdre le contexte.

## Projet

Application web PWA de suivi sport / nutrition / progression, initialement orientee preparation HYROX, puis generalisee pour plusieurs profils sportifs.

Repo local :

`C:\Users\ludov\Documents\Projet_Sport`

Repo GitHub :

`https://github.com/lbelhomme-pc/sport-perso`

Application en ligne :

`https://lbelhomme-pc.github.io/sport-perso/`

Stack :

- Vite
- React
- TypeScript
- Tailwind CSS
- vite-plugin-pwa
- lucide-react
- recharts
- date-fns
- zod
- stockage local navigateur, sans backend

## Intention produit

L'application doit devenir une application de suivi sportif generaliste, tout en gardant HYROX comme mode specialise / competition.

Profils vises :

- reprise du sport
- perte de poids prudente
- prise de muscle
- progression sportive
- musculation
- cardio
- badminton / sports de raquette
- sport hybride
- preparation competition
- suivi sante / regularite

Priorite UX :

- mobile-first
- interface claire, rapide, sobre
- moins de cartes visibles par defaut
- moins de texte explicatif
- actions principales visibles
- details replis / progressifs
- pas de surcharge cognitive

## Charte visuelle

Palette principale conservee :

- bleu petrole fonce : `#00354A`
- bleu tres fonce : `#00283A`
- bleu doux : `#0A4B61`
- blanc casse : `#F4F4EE`
- gris froid : `#E3E9E9`
- vert pale : `#DCEFA3`
- texte principal : `#0C3447`
- texte secondaire : `#8A9AA0`

Themes existants :

- clair
- sombre
- bleu leger

Attention recente :

- harmoniser les couleurs entre themes
- eviter les graphiques noirs en mode clair
- garder des contrastes lisibles

## Architecture importante

Structure principale :

- `src/app`
- `src/components`
- `src/components/ui`
- `src/components/layout`
- `src/components/charts`
- `src/components/forms`
- `src/data`
- `src/hooks`
- `src/pages`
- `src/services`
- `src/types`
- `src/utils`

Pages importantes :

- `DashboardPage.tsx`
- `CalendarPage.tsx`
- `PlanningPage.tsx`
- `SessionsPage.tsx`
- `MealsPage.tsx`
- `WeightPage.tsx`
- `StatsPage.tsx`
- `SettingsPage.tsx`
- `MorePage.tsx`

## Modules utilisateur

Un systeme de modules activables/desactivables existe.

Objectif :

- un module desactive ne doit pas apparaitre dans la navigation, le dashboard, les raccourcis, les stats ou les textes visibles
- l'utilisateur peut reactiver les modules dans les reglages
- maximum 5 onglets principaux

Modules possibles :

- accueil
- entrainement
- seances
- nutrition
- calendrier
- progression / stats
- poids
- recuperation
- profil / plus

## Nutrition

La nutrition doit rester prudente et non culpabilisante.

Modes nutrition prevus / utilises :

- desactive
- simple
- sans calories
- calories/macros
- avance
- performance
- perte de masse grasse prudente
- prise de muscle

Principes :

- ne pas recommander une cible alimentaire basee sur BMR moins deficit
- distinguer BMR, maintenance estimee, depense estimee et objectif alimentaire
- deficit cible prudent autour de 400 kcal si coherent avec fatigue / faim / sommeil
- proteines par defaut raisonnables mais personnalisables
- cacher calories / poids par defaut si antecedents TCA

## Entrainement / programme

Le planning HYROX a ete retravaille plusieurs fois.

Principe actuel souhaite :

- ne plus imposer une seance fixe par jour
- afficher les seances prevues dans la semaine
- l'utilisateur choisit la seance du jour selon ses contraintes
- possibilite de choisir 1, 2 ou 3 seances de badminton par semaine
- configuration badminton souple
- les seances doivent pouvoir etre repliees / developpees
- depuis le planning, on doit pouvoir saisir temps / FC / calories / RPE pour valider une seance

Points UX importants :

- bouton principal : demarrer / enregistrer
- bouton secondaire : modifier
- statut : prevue / faite / adaptee / sautee
- eviter les doublons entre checklist et blocs validates
- les exercices doivent etre clairs, sans cases inutiles
- les notes de seance doivent pouvoir reprendre automatiquement les exercices utiles

## Dashboard / Accueil

Direction souhaitee :

- carte unique "Aujourd'hui"
- une action principale
- deux actions secondaires maximum
- details replies
- le quotidien dans une case separee
- quotidien = fatigue, douleur, pas, etages
- pas de nutrition si nutrition desactivee
- pas de poids si poids desactive
- rappels visuels doux si repas absent, poids absent, proteines basses, fatigue ou douleur

A eviter :

- cockpit trop dense
- trop de cartes visibles
- expliquer sans cesse a quoi sert chaque bouton
- termes trop techniques visibles partout

Termes a rendre plus humains :

- BMR = metabolisme de base
- NEAT = mouvement quotidien / pas + etages
- EAT = sport saisi
- deficit reel = ecart estime

## Stats / Progression

Derniere demande traitee localement, non poussee sur GitHub :

- regrouper les stats par thematiques
- tout masquer / replier par defaut
- enlever les petits titres hauts
- garder seulement les grands titres

Fichiers modifies localement pour cette demande :

- `src/pages/StatsPage.tsx`
- `src/components/ui/PageHeader.tsx`
- `src/components/ui/CollapsibleSectionCard.tsx`

Nouvelle organisation Stats :

- `Vue rapide`
- `Sport`
- `Mouvement`
- `Nutrition`
- `Poids`

Toutes ces sections sont repliees par defaut.

Dans `Sport` :

- progression
- moyennes calories sport
- volume hebdomadaire
- calories sport
- programme prevu / realise

Dans `Mouvement` :

- moyennes pas et etages
- pas quotidiens
- calories via pas + etages
- etages quotidiens

Dans `Nutrition` :

- calories alimentaires
- proteines

Dans `Poids` :

- courbe

Verification effectuee apres cette modification :

`npm.cmd run build` OK

`git diff --check` OK

Important :

Ces changements Stats sont locaux et n'ont pas ete pousses sur GitHub.

## Git / etat de travail

Derniere consigne utilisateur :

Ne pas pousser sur GitHub pour les modifications Stats recentes.

Etat attendu apres la derniere intervention :

- modifications locales non committees
- build OK
- pas de push GitHub

Avant toute nouvelle action Git :

- verifier `git status --short`
- ne pas pousser sans demande explicite

## PWA / deploiement

Le deploiement se fait via GitHub Pages.

Commandes deja utilisees dans le projet :

```powershell
npm.cmd run build
git add .
git commit -m "message"
git push
```

Ne pousser que si l'utilisateur le demande explicitement.

## Points fonctionnels deja demandes

Nutrition / repas :

- recherche aliments Open Food Facts
- aliments communs en fallback quand Open Food Facts ne repond pas
- favoris aliments
- favoris repas reutilisables avec nom
- quantites en grammes, ml, dose selon aliment
- ajout de plusieurs aliments dans un repas
- le nom du repas ne doit plus etre demande comme champ obligatoire libre
- types : petit-dejeuner, dejeuner, collation, diner, autre

Aliments souvent ajoutes / a maintenir dans la recherche commune :

- banane
- skyr
- compote
- dinde
- poulet
- oeufs par calibre
- fromages classiques
- laitages
- fruits
- legumes
- poissons
- huiles d'olive / noix
- vinaigre balsamique
- moutarde / moutarde a l'ancienne
- betterave
- marron en boite
- endive
- tomate
- olives
- coeurs de palmiers
- semoule
- patate douce
- poelee de legumes
- chocolat noir par pourcentage
- whey / NutriPure / autres proteines
- barres proteinees type NXT Level

Sport / seances :

- modifier une seance directement dans son cadre
- pouvoir supprimer une seance ajoutee par erreur
- types de seance plus generiques
- remplacer "course" par "cardio" quand pertinent
- ne pas afficher tous les types en dur, preferer menu deroulant

Calendrier :

- atterrir sur le jour courant
- grille responsive sans debordement mobile
- voir sport, repas, habitudes, pas, etages
- possibilite d'enregistrer directement des repas

Quotidien :

- fatigue au reveil 1 a 10
- douleur au reveil 1 a 10
- fatigue pendant seance
- douleur pendant seance
- pas
- etages
- allergies
- duolingo
- omega-3
- creatine

## Recommandations UX importantes

Navigation cible :

- maximum 5 onglets principaux
- Aujourd'hui
- Programme
- Seance
- Nutrition si active
- Plus

Les autres sections doivent etre rangees dans `Plus`.

Stats :

- masquer les statistiques avancees tant qu'il n'y a pas assez de donnees
- empty states utiles
- regrouper par themes
- ne pas afficher un desert de graphiques vides

Dashboard :

- ne montrer que ce qui declenche une action
- eviter trop de cartes
- faire ressortir la prochaine decision

Messages :

- preferer "Ajoute une source de proteines au prochain repas"
- eviter "Objectif rate"
- rester rassurant, pas culpabilisant

## Garde-fous sante

Messages a integrer prudemment :

- douleur qui modifie la foulee ou la technique : stopper la seance intense et demander un avis pro si ca persiste
- perte rapide + fatigue + sommeil mauvais : augmenter l'apport ou reduire la charge
- grossesse, pathologie, traitement, mineur, antecedents TCA : avis medical avant objectifs nutrition / poids

Alertes utiles :

- deficit excessif
- fatigue chronique
- douleur persistante
- perte de poids trop rapide
- proteines basses
- sommeil mauvais

## Prochaines actions possibles

Priorites probables :

1. Finaliser la page Stats visuellement sur mobile.
2. Verifier que les sections Stats repliees par defaut sont agreables en mode clair, sombre et bleu leger.
3. Poursuivre la simplification du dashboard.
4. Nettoyer le vocabulaire technique visible.
5. Continuer la refonte du planning en choix hebdomadaire souple.
6. Stabiliser les favoris repas / aliments.
7. Repasser sur les modules activables pour verifier qu'aucune reference a un module desactive ne fuit dans l'interface.

## Commandes de verification

```powershell
npm.cmd run build
git diff --check
git status --short
```

## Note importante pour la prochaine conversation

Toujours commencer par lire ce fichier puis verifier l'etat Git.

Si l'utilisateur dit "pousse", faire :

1. verifier les changements
2. build
3. commit clair
4. push main
5. redonner le lien GitHub Pages

Si l'utilisateur dit "pas de GitHub" ou "ne pousse pas", rester strictement local.
