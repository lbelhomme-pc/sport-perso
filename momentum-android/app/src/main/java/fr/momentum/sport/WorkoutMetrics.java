package fr.momentum.sport;

/** Conversions d'unités sans dépendance Android, testables séparément. */
final class WorkoutMetrics {
    private WorkoutMetrics(){}

    /** L'API native Health Connect fournit des calories (cal), l'UI affiche des kcal. */
    static double toKilocalories(double calories){
        return Double.isFinite(calories) && calories>0 ? calories/1000.0 : 0;
    }

    /**
     * Corrige les valeurs persistées par Momentum 1.5.0.
     * On ne convertit que les valeurs Garmin manifestement aberrantes
     * afin de ne pas altérer des données déjà exprimées en kcal.
     */
    static boolean likelySameWorkout(long manualTime,int manualMinutes,long importedTime,int importedMinutes){
        long delta=Math.abs(manualTime-importedTime);
        boolean timeClose=delta<=90L*60*1000;
        boolean durationClose=manualMinutes>0&&importedMinutes>0
            && Math.abs(manualMinutes-importedMinutes)<=Math.max(12,importedMinutes/5);
        return timeClose||durationClose;
    }

    static int normalizeStoredKcal(int amount,String source){
        if(amount<0)return 0;
        if("Garmin Connect".equals(source)&&amount>10000)
            return (int)Math.round(toKilocalories(amount));
        return amount;
    }
}
