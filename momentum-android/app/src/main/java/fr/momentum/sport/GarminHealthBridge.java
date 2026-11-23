package fr.momentum.sport;

import android.Manifest;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.health.connect.HealthConnectException;
import android.health.connect.HealthConnectManager;
import android.health.connect.HealthPermissions;
import android.health.connect.ReadRecordsRequestUsingFilters;
import android.health.connect.ReadRecordsResponse;
import android.health.connect.TimeInstantRangeFilter;
import android.health.connect.datatypes.ActiveCaloriesBurnedRecord;
import android.health.connect.datatypes.DataOrigin;
import android.health.connect.datatypes.DistanceRecord;
import android.health.connect.datatypes.ExerciseSessionRecord;
import android.health.connect.datatypes.ExerciseSessionType;
import android.health.connect.datatypes.HeartRateRecord;
import android.health.connect.datatypes.Record;
import android.os.Build;
import android.os.OutcomeReceiver;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

/**
 * Garmin Connect -> Android Santé Connect -> carnet Momentum Sport.
 * L'intégration lit des données locales uniquement et ne les transmet pas sur Internet.
 * Requiert Android 14+. Garmin n'écrit pas nécessairement des ExerciseSessionRecord.
 */
@TargetApi(34)
public final class GarminHealthBridge {
    static final String GARMIN_PACKAGE="com.garmin.android.apps.connectmobile";
    static final int PERMISSION_REQUEST=1510;
    private static final long AUTO_INTERVAL_MS=30*60*1000L;
    private static final int MAX_SESSIONS_PER_SYNC=120;
    static final String[] READ_PERMISSIONS={
        HealthPermissions.READ_EXERCISE,
        HealthPermissions.READ_HEART_RATE,
        HealthPermissions.READ_DISTANCE,
        HealthPermissions.READ_ACTIVE_CALORIES_BURNED
    };
    final MainActivity activity;
    final SportStore store;
    final SharedPreferences preferences;
    final DataOrigin garmin=new DataOrigin.Builder().setPackageName(GARMIN_PACKAGE).build();
    final AtomicBoolean busy=new AtomicBoolean(false);
    HealthConnectManager manager;
    GarminHealthBridge(MainActivity activity,SportStore store){
        this.activity=activity;
        this.store=store;
        this.preferences=activity.getSharedPreferences("garmin_health_sync",Context.MODE_PRIVATE);
        manager=activity.getSystemService(HealthConnectManager.class);
    }
    boolean available(){return Build.VERSION.SDK_INT>=34&&manager!=null;}
    boolean canReadExercise(){
        return available()&&activity.checkSelfPermission(HealthPermissions.READ_EXERCISE)
            ==PackageManager.PERMISSION_GRANTED;
    }
    boolean permission(String name){
        return activity.checkSelfPermission(name)==PackageManager.PERMISSION_GRANTED;
    }
    boolean autoEnabled(){return preferences.getBoolean("enabled",false);}
    void setAutoEnabled(boolean enabled){
        preferences.edit().putBoolean("enabled",enabled).apply();
    }
    long lastSync(){return preferences.getLong("last_success",0);}
    void requestOrSync(){
        if(!available()){
            activity.toast("Santé Connect nécessite Android 14 ou plus sur ce téléphone.");
            return;
        }
        List<String> missing=new ArrayList<>();
        for(String perm:READ_PERMISSIONS)if(!permission(perm))missing.add(perm);
        if(!missing.isEmpty()){
            activity.requestPermissions(missing.toArray(new String[0]),PERMISSION_REQUEST);
            return;
        }
        sync(false);
    }
    void afterPermissionResponse(){
        if(canReadExercise()){
            // Synchronisation automatique activée uniquement après autorisation explicite
            // de l'utilisateur sur la demande de connexion.
            setAutoEnabled(true);
            sync(false);
        }else{
            activity.toast("Autorise la lecture des séances dans Santé Connect pour importer Garmin.");
        }
    }
    void maybeAutoSync(){
        if(!autoEnabled()||!canReadExercise()||busy.get())return;
        long lastAttempt=preferences.getLong("last_attempt",0);
        if(System.currentTimeMillis()-lastAttempt<AUTO_INTERVAL_MS)return;
        sync(true);
    }
    void sync(boolean automatic){
        if(!canReadExercise()){
            if(!automatic)requestOrSync();
            return;
        }
        if(!busy.compareAndSet(false,true))return;
        preferences.edit().putLong("last_attempt",System.currentTimeMillis()).apply();
        if(!automatic)activity.toast("Lecture des séances Garmin (30 jours)...");
        Instant end=Instant.now();
        Instant start=end.minus(Duration.ofDays(30));
        readAll(ExerciseSessionRecord.class,start,end,new ArrayList<>(),-1L,0,
            rows->{
                ArrayList<ExerciseSessionRecord> relevant=new ArrayList<>();
                for(ExerciseSessionRecord item:rows){
                    if(item.getEndTime().isAfter(item.getStartTime()) &&
                        !item.getStartTime().isAfter(end) &&
                        item.getStartTime().isAfter(start))
                        relevant.add(item);
                }
                if(relevant.isEmpty()){
                    explainEmpty(start,end);
                    return;
                }
                importNext(relevant,0,0,0,0);
            },
            error->finish("Lecture Garmin impossible : "+shortError(error),false));
    }
    interface ErrorHandler {void handle(Exception error);}
    <T extends Record> void readAll(Class<T> type,Instant start,Instant end,
            ArrayList<T> collected,long token,int pages,
            Consumer<ArrayList<T>> success,ErrorHandler failure){
        if(!busy.get())return;
        try{
            ReadRecordsRequestUsingFilters.Builder<T> query=
                new ReadRecordsRequestUsingFilters.Builder<>(type)
                    .addDataOrigins(garmin)
                    .setTimeRangeFilter(new TimeInstantRangeFilter.Builder()
                        .setStartTime(start).setEndTime(end).build())
                    .setPageSize(500);
            if(token>=0)query.setPageToken(token);
            else query.setAscending(false);
            manager.readRecords(query.build(),activity.getMainExecutor(),
                new OutcomeReceiver<ReadRecordsResponse<T>,HealthConnectException>(){
                @Override public void onResult(ReadRecordsResponse<T> response){
                    collected.addAll(response.getRecords());
                    long next=response.getNextPageToken();
                    if(next>=0&&pages<9&&collected.size()<5000){
                        readAll(type,start,end,collected,next,pages+1,success,failure);
                    }else success.accept(collected);
                }
                @Override public void onError(HealthConnectException err){
                    failure.handle(err);
                }
            });
        }catch(Exception e){
            failure.handle(e);
        }
    }
    void importNext(List<ExerciseSessionRecord> records,int index,int added,int existing,int errors){
        if(index>=records.size()||index>=MAX_SESSIONS_PER_SYNC){
            finish(added+" séance(s) Garmin ajoutée(s) · "+existing+" déjà présentes"
                +(errors>0?" · "+errors+" erreur(s)":"")
                +(records.size()>MAX_SESSIONS_PER_SYNC?" · import limité à "+MAX_SESSIONS_PER_SYNC:""),true);
            return;
        }
        ExerciseSessionRecord record=records.get(index);
        SportStore.Session item=convert(record);
        if(item==null){
            importNext(records,index+1,added,existing,errors+1);
            return;
        }
        loadHr(item,record,()->loadDistance(item,record,()->
            loadCalories(item,record,()->{
                try{
                    boolean created=store.upsertImported(item);
                    importNext(records,index+1,added+(created?1:0),existing+(created?0:1),errors);
                }catch(Exception e){
                    importNext(records,index+1,added,existing,errors+1);
                }
            })));
    }
    SportStore.Session convert(ExerciseSessionRecord record){
        long start=record.getStartTime().toEpochMilli(),end=record.getEndTime().toEpochMilli();
        if(start<=0||end<=start)return null;
        SportStore.Session item=new SportStore.Session();
        item.time=start;
        long mins=Math.round((end-start)/60000.0);
        item.duration=(int)Math.min(1440,Math.max(1,mins));
        item.sport=mapSport(record.getExerciseType());
        item.note="";
        item.source="Garmin Connect";
        String id=record.getMetadata().getId();
        if(id==null||id.isEmpty()){
            id="time-"+start+"-"+end+"-"+record.getExerciseType();
        }
        item.sourceKey=GARMIN_PACKAGE+":"+id;
        return item;
    }
    static String mapSport(int type){
        switch(type){
            case ExerciseSessionType.EXERCISE_SESSION_TYPE_BADMINTON:return "Badminton";
            case ExerciseSessionType.EXERCISE_SESSION_TYPE_BIKING:
            case ExerciseSessionType.EXERCISE_SESSION_TYPE_BIKING_STATIONARY:return "Vélo";
            case ExerciseSessionType.EXERCISE_SESSION_TYPE_STRENGTH_TRAINING:
            case ExerciseSessionType.EXERCISE_SESSION_TYPE_WEIGHTLIFTING:return "Musculation";
            case ExerciseSessionType.EXERCISE_SESSION_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING:
            case ExerciseSessionType.EXERCISE_SESSION_TYPE_BOOT_CAMP:return "WOD";
            default:return "Autre";
        }
    }
    void loadHr(SportStore.Session item,ExerciseSessionRecord record,Runnable next){
        if(!permission(HealthPermissions.READ_HEART_RATE)){next.run();return;}
        readAll(HeartRateRecord.class,record.getStartTime(),record.getEndTime(),
            new ArrayList<>(),-1L,0,
            rows->{
                long sum=0,count=0;
                for(HeartRateRecord h:rows)
                    for(HeartRateRecord.HeartRateSample sample:h.getSamples()){
                        long bpm=sample.getBeatsPerMinute();
                        if(bpm>=35&&bpm<=240 &&
                           !sample.getTime().isBefore(record.getStartTime()) &&
                           !sample.getTime().isAfter(record.getEndTime())){
                            sum+=bpm;count++;
                        }
                    }
                if(count>0)item.hr=(int)Math.round((double)sum/count);
                next.run();
            },err->next.run());
    }
    void loadDistance(SportStore.Session item,ExerciseSessionRecord record,Runnable next){
        if(!permission(HealthPermissions.READ_DISTANCE)){next.run();return;}
        readAll(DistanceRecord.class,record.getStartTime(),record.getEndTime(),
            new ArrayList<>(),-1L,0,
            rows->{
                double meters=0;
                for(DistanceRecord dist:rows){
                    // Éviter de comptabiliser des intervalles qui dépassent la séance.
                    if(!dist.getStartTime().isBefore(record.getStartTime()) &&
                       !dist.getEndTime().isAfter(record.getEndTime()))
                        meters+=dist.getDistance().getInMeters();
                }
                if(meters>0)item.distance=Math.round(meters/10.0)/100.0;
                next.run();
            },err->next.run());
    }
    void loadCalories(SportStore.Session item,ExerciseSessionRecord record,Runnable next){
        if(!permission(HealthPermissions.READ_ACTIVE_CALORIES_BURNED)){next.run();return;}
        readAll(ActiveCaloriesBurnedRecord.class,record.getStartTime(),record.getEndTime(),
            new ArrayList<>(),-1L,0,
            rows->{
                double calories=0;
                for(ActiveCaloriesBurnedRecord c:rows){
                    if(!c.getStartTime().isBefore(record.getStartTime()) &&
                       !c.getEndTime().isAfter(record.getEndTime()))
                        calories+=c.getEnergy().getInCalories();
                }
                if(calories>0)item.calories=(int)Math.round(calories);
                next.run();
            },err->next.run());
    }
    void explainEmpty(Instant start,Instant end){
        if(!permission(HealthPermissions.READ_HEART_RATE)){
            finish("0 séance Garmin détectée dans Santé Connect. Vérifie que Garmin partage les séances.",true);
            return;
        }
        readAll(HeartRateRecord.class,end.minus(Duration.ofDays(2)),end,
            new ArrayList<>(),-1L,0,
            hr->{
                if(hr.size()>0)
                    finish("Garmin partage des mesures cardiaques, mais aucune séance exploitable. Vérifie « Séances d'exercice » dans Santé Connect.",true);
                else
                    finish("Aucune séance ni mesure Garmin récente dans Santé Connect. Synchronise ta montre dans Garmin Connect.",true);
            },
            error->finish("0 séance Garmin détectée. Données cardio non vérifiables.",true));
    }
    void finish(String message,boolean success){
        busy.set(false);
        if(success)preferences.edit().putLong("last_success",System.currentTimeMillis()).apply();
        activity.onGarminSyncFinished(message);
    }
    static String shortError(Exception error){
        String name=error.getClass().getSimpleName();
        return name+(error.getMessage()==null?"":" ("+error.getMessage()+")");
    }
}