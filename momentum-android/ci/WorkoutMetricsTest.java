package fr.momentum.sport;

public final class WorkoutMetricsTest {
    static void expected(boolean condition,String message) {
        if(!condition)throw new AssertionError(message);
    }
    public static void main(String[] args) {
        expected(WorkoutMetrics.toKilocalories(379000)==379.0,
            "379000 petites calories doit donner 379 kcal");
        expected(Math.abs(WorkoutMetrics.toKilocalories(379)-0.379)<0.0000001,
            "Unité cal/kcal");
        expected(WorkoutMetrics.normalizeStoredKcal(379000,"Garmin Connect")==379,
            "Correction d'une valeur Garmin v1.5.0");
        expected(WorkoutMetrics.normalizeStoredKcal(379,"Garmin Connect")==379,
            "Ne pas corriger deux fois");
        expected(WorkoutMetrics.normalizeStoredKcal(379000,"Autre source")==379000,
            "Ne pas modifier des valeurs non Garmin");
        expected(WorkoutMetrics.normalizeStoredKcal(-500,"Garmin Connect")==0,
            "Une valeur négative est invalide");
        final long now=1763900000000L;
        expected(WorkoutMetrics.likelySameWorkout(now,0,now+30*60*1000L,60),
            "Deux séances proches dans le temps peuvent être rapprochées");
        expected(WorkoutMetrics.likelySameWorkout(now,58,now+5*60*60*1000L,60),
            "Durées similaires si heure manuelle imprécise");
        expected(!WorkoutMetrics.likelySameWorkout(now,0,now+5*60*60*1000L,60),
            "Ne pas rapprocher sans horaire ni durée");
        expected(!WorkoutMetrics.likelySameWorkout(now,20,now+5*60*60*1000L,60),
            "Ne pas fusionner des séances distinctes");
        System.out.println("PASS: kcal, anciennes valeurs et déduplication prudente");
    }
}
