package fr.momentum.sport;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Base de données locale hors-ligne compatible avec le format Momentum Sport v1. */
public final class SportStore extends SQLiteOpenHelper {
    private static final String TABLE="sessions";
    public static class Session {
        long id, time;
        String sport="Musculation", note="", exercise="";
        int duration, hr, rpe, sets, reps;
        double distance, weight;
        int calories;
        String source="",sourceKey="";
        Session(){time=System.currentTimeMillis();}
        JSONObject toJson() throws Exception {
            JSONObject j=new JSONObject();
            j.put("id",id);j.put("time",time);j.put("sport",sport);j.put("note",note);
            j.put("duration",duration);j.put("hr",hr);j.put("rpe",rpe);
            j.put("distance",distance);j.put("exercise",exercise);j.put("sets",sets);
            j.put("reps",reps);j.put("weight",weight);
            j.put("source",source);j.put("sourceKey",sourceKey);j.put("calories",calories);return j;
        }
        static Session fromJson(JSONObject j){
            Session s=new Session();
            s.id=j.optLong("id",0);s.time=j.optLong("time",System.currentTimeMillis());
            s.sport=j.optString("sport","Autre");s.note=j.optString("note","");
            s.duration=j.optInt("duration",0);s.hr=j.optInt("hr",0);s.rpe=j.optInt("rpe",0);
            s.distance=j.optDouble("distance",0);s.exercise=j.optString("exercise","");
            s.sets=j.optInt("sets",0);s.reps=j.optInt("reps",0);s.weight=j.optDouble("weight",0);
            s.source=j.optString("source","");s.sourceKey=j.optString("sourceKey","");
            s.calories=correctGarminKcal(j.optInt("calories",0),s.source);
            if("Garmin Connect".equals(s.source)&&"Autre".equals(s.sport))s.sport="HYROX";
            return s;
        }
        void detectFromNote(){
            if(note==null)note="";
            String n=note.replace('×','x').replace(',','.');
            Matcher m;
            if(duration==0){
                m=Pattern.compile("(?i)(\\d{1,3})\\s*(?:min|minutes|mn)(?![a-z])").matcher(n);
                if(m.find())duration=limit(integer(m.group(1)),0,1440);
            }
            if(hr==0){
                m=Pattern.compile("(?i)(\\d{2,3})\\s*(?:bpm|batt(?:ements)?/min)").matcher(n);
                if(m.find())hr=limit(integer(m.group(1)),0,250);
            }
            if(rpe==0){
                m=Pattern.compile("(?i)\\brpe\\s*[:=]?\\s*(10|[1-9])\\b").matcher(n);
                if(m.find())rpe=integer(m.group(1));
            }
            if(distance==0){
                m=Pattern.compile("(?i)(\\d+(?:\\.\\d+)?)\\s*km\\b").matcher(n);
                if(m.find())distance=number(m.group(1));
            }
            // Les notes peuvent contenir plusieurs exercices et des charges par main.
            // Un seul couple séries/répétitions/charge serait trompeur pour une séance entière.
            // On ne déduit donc jamais ces champs globaux du texte libre.

        }
        static int integer(String x){try{return Integer.parseInt(x);}catch(Exception e){return 0;}}
        static double number(String x){try{return Double.parseDouble(x);}catch(Exception e){return 0;}}
        static int limit(int x,int lo,int hi){return Math.max(lo,Math.min(hi,x));}
        double volume(){return Math.max(0,sets)*Math.max(0,reps)*Math.max(0,weight);}
    }
    static int correctGarminKcal(int amount,String source){
        return WorkoutMetrics.normalizeStoredKcal(amount,source);
    }
    SportStore(Context c){super(c,"momentum_sport.db",null,3);}
    @Override public void onCreate(SQLiteDatabase db){
        db.execSQL("CREATE TABLE sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER NOT NULL, sport TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', duration INTEGER NOT NULL DEFAULT 0, hr INTEGER NOT NULL DEFAULT 0, rpe INTEGER NOT NULL DEFAULT 0, distance REAL NOT NULL DEFAULT 0, exercise TEXT NOT NULL DEFAULT '', sets INTEGER NOT NULL DEFAULT 0, reps INTEGER NOT NULL DEFAULT 0, weight REAL NOT NULL DEFAULT 0, source TEXT NOT NULL DEFAULT '', source_key TEXT, calories INTEGER NOT NULL DEFAULT 0)");
        db.execSQL("CREATE INDEX ix_sessions_time ON sessions(time DESC)");
        db.execSQL("CREATE UNIQUE INDEX ix_sessions_source ON sessions(source_key) WHERE source_key IS NOT NULL");
    }
    @Override public void onUpgrade(SQLiteDatabase db,int oldV,int newV){
        if(oldV<2){
            db.execSQL("ALTER TABLE sessions ADD COLUMN source TEXT NOT NULL DEFAULT ''");
            db.execSQL("ALTER TABLE sessions ADD COLUMN source_key TEXT");
            db.execSQL("ALTER TABLE sessions ADD COLUMN calories INTEGER NOT NULL DEFAULT 0");
            db.execSQL("CREATE UNIQUE INDEX ix_sessions_source ON sessions(source_key) WHERE source_key IS NOT NULL");
        }
        if(oldV<3){
            db.execSQL("UPDATE sessions SET calories = CAST(ROUND(calories / 1000.0) AS INTEGER) "+
                "WHERE source='Garmin Connect' AND calories > 10000");
            db.execSQL("UPDATE sessions SET sport = 'HYROX' "+
                "WHERE source='Garmin Connect' AND sport='Autre'");
        }
    }
    private ContentValues values(Session s){
        ContentValues v=new ContentValues();
        v.put("time",s.time);v.put("sport",s.sport);v.put("note",s.note);
        v.put("duration",s.duration);v.put("hr",s.hr);v.put("rpe",s.rpe);
        v.put("distance",s.distance);v.put("exercise",s.exercise);
        v.put("sets",s.sets);v.put("reps",s.reps);v.put("weight",s.weight);
        v.put("source",s.source==null?"":s.source);
        if(s.sourceKey==null||s.sourceKey.isEmpty())v.putNull("source_key");
        else v.put("source_key",s.sourceKey);
        v.put("calories",correctGarminKcal(s.calories,s.source));
        return v;
    }
    long save(Session s){
        s.detectFromNote();
        if(s.id>0){
            getWritableDatabase().update(TABLE,values(s),"id=?",new String[]{Long.toString(s.id)});
            return s.id;
        }
        s.id=getWritableDatabase().insertOrThrow(TABLE,null,values(s));
        return s.id;
    }
    /** Déduplication par identifiant santé Connect ; les notes et modifications utilisateur sont préservées. */
    boolean upsertImported(Session incoming){
        if(incoming.sourceKey==null||incoming.sourceKey.isEmpty())
            throw new IllegalArgumentException("Séance sans identifiant de provenance");
        SQLiteDatabase db=getWritableDatabase();
        try(Cursor c=db.query(TABLE,null,"source_key=?",new String[]{incoming.sourceKey},
            null,null,null)){
            if(c.moveToFirst()){
                Session old=read(c);
                if(old.duration==0)old.duration=incoming.duration;
                if(old.hr==0)old.hr=incoming.hr;
                if(old.distance==0)old.distance=incoming.distance;
                if(old.calories==0)old.calories=incoming.calories;
                // La v1.5.0 stockait parfois les cal en les affichant comme des kcal.
                old.calories=correctGarminKcal(old.calories,old.source);
                if("Autre".equals(old.sport))old.sport="HYROX";
                // Ne pas écraser les notes, le sport corrigé, le RPE ou la date modifiée.
                db.update(TABLE,values(old),"id=?",new String[]{Long.toString(old.id)});
                return false;
            }
        }
        // Retrouver une séance que l'utilisateur a saisie avant son arrivée depuis Garmin.
        Session candidate=findManualMatch(db,incoming);
        if(candidate!=null){
            if(candidate.duration==0)candidate.duration=incoming.duration;
            if(candidate.hr==0)candidate.hr=incoming.hr;
            if(candidate.distance==0)candidate.distance=incoming.distance;
            if(candidate.calories==0)candidate.calories=incoming.calories;
            candidate.source=incoming.source;
            candidate.sourceKey=incoming.sourceKey;
            db.update(TABLE,values(candidate),"id=?",new String[]{Long.toString(candidate.id)});
            return false;
        }
        db.insertOrThrow(TABLE,null,values(incoming));
        return true;
    }
    /**
     * Rapprochement prudent : un seul entraînement manuel du même sport
     * le même jour ET un horaire proche ou une durée similaire.
     * En cas d'incertitude, laisser deux séances plutôt qu'écraser une note.
     */
    Session findManualMatch(SQLiteDatabase db,Session incoming){
        Calendar day=Calendar.getInstance();
        day.setTimeInMillis(incoming.time);
        day.set(Calendar.HOUR_OF_DAY,0);day.set(Calendar.MINUTE,0);
        day.set(Calendar.SECOND,0);day.set(Calendar.MILLISECOND,0);
        long start=day.getTimeInMillis();
        day.add(Calendar.DATE,1);
        long stop=day.getTimeInMillis();
        ArrayList<Session> candidates=new ArrayList<>();
        try(Cursor c=db.query(TABLE,null,
                "(source_key IS NULL OR source_key='') AND (source IS NULL OR source='') "+
                    "AND (sport=? OR (?='HYROX' AND sport='Autre')) AND time>=? AND time<?",
                new String[]{incoming.sport,incoming.sport,Long.toString(start),Long.toString(stop)},
                null,null,null)){
            while(c.moveToNext())candidates.add(read(c));
        }
        if(candidates.size()!=1)return null;
        Session manual=candidates.get(0);
        long timeDifference=Math.abs(manual.time-incoming.time);
        boolean closeStart=timeDifference<=90*60*1000L;
        boolean closeDuration=manual.duration>0 && incoming.duration>0
            && Math.abs(manual.duration-incoming.duration)<=Math.max(12,incoming.duration/5);
        return closeStart||closeDuration?manual:null;
    }
    void clearAll(){getWritableDatabase().delete(TABLE,null,null);}
    void delete(long id){getWritableDatabase().delete(TABLE,"id=?",new String[]{Long.toString(id)});}
    List<Session> all(){
        ArrayList<Session> out=new ArrayList<>();
        try(Cursor c=getReadableDatabase().query(TABLE,null,null,null,null,null,"time DESC, id DESC")){
            while(c.moveToNext())out.add(read(c));
        }
        return out;
    }
    private Session read(Cursor c){
        Session s=new Session();
        s.id=c.getLong(c.getColumnIndexOrThrow("id"));s.time=c.getLong(c.getColumnIndexOrThrow("time"));
        s.sport=c.getString(c.getColumnIndexOrThrow("sport"));s.note=c.getString(c.getColumnIndexOrThrow("note"));
        s.duration=c.getInt(c.getColumnIndexOrThrow("duration"));s.hr=c.getInt(c.getColumnIndexOrThrow("hr"));
        s.rpe=c.getInt(c.getColumnIndexOrThrow("rpe"));s.distance=c.getDouble(c.getColumnIndexOrThrow("distance"));
        s.exercise=c.getString(c.getColumnIndexOrThrow("exercise"));s.sets=c.getInt(c.getColumnIndexOrThrow("sets"));
        s.reps=c.getInt(c.getColumnIndexOrThrow("reps"));s.weight=c.getDouble(c.getColumnIndexOrThrow("weight"));
        s.source=c.getString(c.getColumnIndexOrThrow("source"));
        s.sourceKey=c.isNull(c.getColumnIndexOrThrow("source_key"))?"":c.getString(c.getColumnIndexOrThrow("source_key"));
        s.calories=correctGarminKcal(c.getInt(c.getColumnIndexOrThrow("calories")),s.source);
        return s;
    }
    String exportJson() throws Exception {
        JSONObject root=new JSONObject();
        root.put("format","momentum-sport");root.put("version",1);root.put("exportedAt",System.currentTimeMillis());
        JSONArray a=new JSONArray();for(Session s:all())a.put(s.toJson());
        root.put("sessions",a);return root.toString(2);
    }
    int restore(String input) throws Exception {
        if(input.length()>25000000)throw new IllegalArgumentException("Sauvegarde trop volumineuse");
        JSONObject root=new JSONObject(input);
        if(!"momentum-sport".equals(root.optString("format"))||root.optInt("version")!=1)
            throw new IllegalArgumentException("Format non reconnu");
        JSONArray a=root.getJSONArray("sessions");
        if(a.length()>100000)throw new IllegalArgumentException("Trop de séances");
        ArrayList<Session> items=new ArrayList<>();
        for(int i=0;i<a.length();i++){
            Session s=Session.fromJson(a.getJSONObject(i));
            if(s.time<=0||s.sport.length()>80||s.note.length()>100000)
                throw new IllegalArgumentException("Données invalides à la séance "+(i+1));
            items.add(s);
        }
        SQLiteDatabase db=getWritableDatabase();db.beginTransaction();
        try{
            db.delete(TABLE,null,null);
            for(Session s:items)db.insertOrThrow(TABLE,null,values(s));
            db.setTransactionSuccessful();
        }finally{db.endTransaction();}
        return items.size();
    }
}