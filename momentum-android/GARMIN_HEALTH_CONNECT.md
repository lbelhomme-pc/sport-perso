# Momentum Sport V1.5.1 — Garmin Connect + Santé Connect

Intégration Android **en lecture seule**. Aucune connexion au compte Garmin n'est demandée par Momentum Sport.

## Préparation sur le téléphone

1. Android 14 ou plus pour l'intégration native.
2. Installer/actualiser Garmin Connect et synchroniser la montre.
3. Dans Garmin Connect, activer le partage des données vers **Santé Connect** si l'option est disponible.
4. Dans les réglages Android de Santé Connect, vérifier Garmin Connect comme application autorisée à **écrire** les informations souhaitées.
5. Dans **Momentum Sport 1.5.1**, choisir **Synchroniser Garmin**, puis autoriser en lecture les « séances d'exercice » et éventuellement fréquence cardiaque, distance et calories actives.
6. Les séances trouvées dans les 30 derniers jours apparaissent dans le journal ; toucher une séance pour ajouter les exercices, les séries et les observations dans les notes libres.

## Ce qui est réellement importé

- Les **séances d'exercice** publiées par l'application Garmin Connect dans Santé Connect uniquement.
- Si une séance est présente : sport (catégorie générique), horaire, durée, et lorsque les enregistrements sont disponibles et autorisés, moyenne de fréquence cardiaque, distance et calories actives.
- Les séances importées sont liées à l'identifiant d'origine Health Connect pour éviter les doublons lors de nouvelles synchronisations.
- Les notes et les corrections manuelles faites dans Momentum Sport ne sont jamais écrasées lors de l'actualisation.
- Les valeurs du SDK Android sont converties de petites calories (cal) en kilocalories (kcal) par division par 1 000. Les calories excessives des sauvegardes V1.5.0 Garmin sont normalisées à l'import.
- Dans cette configuration personnalisée, les séances Garmin catégorisées « Autre » sont considérées comme **HYROX** ; leur catégorie reste modifiable manuellement.

### Limitation Garmin

Garmin peut partager des données d'activité (FC, vitesse, distance, etc.) sans publier de **séance d'exercice** autonome. Dans ce cas, Momentum Sport explique qu'aucune séance n'est importable. Il n'invente pas de séances à partir de mesures isolées. Ne pas confondre la présence de mesures avec la disponibilité de séances dans Santé Connect.

## Saisir une séance sans synchronisation

1. Dans le journal Garmin, appuyer sur **« + Saisir une séance sans synchronisation »** ou sur « + SÉANCE ».
2. Choisir le sport (par exemple HYROX), la **date et l'heure de début**.
3. Ajouter la durée (facultatif) dans les détails et la description libre des exercices, séries et poids.
4. Enregistrer la séance.

Si Garmin publie ensuite cette même séance, Momentum tente un rapprochement prudent : il ne fusionne que s'il existe une seule séance manuelle du même sport le même jour, avec heure de début à 90 min près ou durée proche (±12 min ou 20 %). Les notes ne sont pas écrasées. Si aucune correspondance sûre ne se dégage, les deux entrées restent distinctes plutôt que de fusionner à tort.

## Vie privée

- Aucune écriture dans Santé Connect.
- Aucun envoi des notes ou mesures vers Garmin ou un serveur Momentum.
- Base SQLite locale et sauvegardes JSON ; les données importées restent en local.
- Permissions révocables dans Santé Connect.
- L'app fonctionne comme carnet de notes et chronomètre même sans permissions / sur les versions d'Android plus anciennes.

## Conservation des versions précédentes

La V1.5.1 possède un identifiant d'application distinct, car les APK de développement antérieurs ne disposent pas d'une clé de signature stable partagée. **Ne pas désinstaller** la V1.5.0 ou V1.4.2 : exporter un JSON via Données > Exporter, puis importer ce fichier dans Momentum Sport Garmin > Données > Restaurer. L'import JSON remplace les séances existantes de l'application cible après confirmation : à faire avant d'importer Garmin, ou après sauvegarde de l'application cible.

## Sources

- Documentation Android : https://developer.android.com/health-and-fitness/health-connect/get-started
- Documentation Android (séances) : https://developer.android.com/health-and-fitness/health-connect/experiences/workouts
- Aide Garmin : https://support.garmin.com/fr-FR/fr-fr/?faq=JToBEy0jfe6pIygark2Ui5
