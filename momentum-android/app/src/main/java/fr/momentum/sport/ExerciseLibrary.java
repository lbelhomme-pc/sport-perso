package fr.momentum.sport;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/** Bibliothèque locale d'exercices, extensible sans connexion Internet. */
public final class ExerciseLibrary {
    public static final class Exercise {
        public final String name;
        public final String category;
        public final boolean custom;
        Exercise(String name, String category, boolean custom) {
            this.name=name; this.category=category; this.custom=custom;
        }
    }
    public static final String[] CATEGORIES = {
        "Tous", "Favoris", "Jambes", "Pectoraux", "Dos",
        "Épaules", "Biceps", "Triceps", "Abdos", "Mes exercices"
    };
    // Noms utilisables comme titres de séance, sans unités ni séries préimposées.
    private static final String[][] DEFAULTS = {
        {"Jambes", "Squat à la barre"},
        {"Jambes", "Front squat à la barre"},
        {"Jambes", "Presse à cuisses"},
        {"Jambes", "Hack squat à la machine"},
        {"Jambes", "Squat bulgare avec haltères"},
        {"Jambes", "Fentes marchées avec haltères"},
        {"Jambes", "Leg extension"},
        {"Jambes", "Leg curl assis"},
        {"Jambes", "Leg curl couché"},
        {"Jambes", "Soulevé de terre roumain"},
        {"Jambes", "Hip thrust à la barre"},
        {"Jambes", "Abduction de hanche à la machine"},
        {"Jambes", "Adduction de hanche à la machine"},
        {"Jambes", "Extensions des mollets debout"},
        {"Jambes", "Extensions des mollets assis"},
        {"Pectoraux", "Développé couché à la barre"},
        {"Pectoraux", "Développé couché aux haltères"},
        {"Pectoraux", "Développé incliné à la barre"},
        {"Pectoraux", "Développé incliné aux haltères"},
        {"Pectoraux", "Développé à la machine convergente"},
        {"Pectoraux", "Écartés à la poulie vis-à-vis"},
        {"Pectoraux", "Écartés aux haltères"},
        {"Pectoraux", "Pec deck"},
        {"Pectoraux", "Pompes"},
        {"Dos", "Soulevé de terre"},
        {"Dos", "Tractions pronation"},
        {"Dos", "Tractions supination"},
        {"Dos", "Tirage vertical à la poulie haute"},
        {"Dos", "Tirage vertical prise neutre"},
        {"Dos", "Tirage horizontal assis à la poulie"},
        {"Dos", "Rowing poitrine appuyée à la machine"},
        {"Dos", "Rowing à la barre"},
        {"Dos", "Rowing unilatéral avec haltère"},
        {"Dos", "Rowing à la machine"},
        {"Dos", "Pull-over à la poulie haute"},
        {"Dos", "Extensions lombaires au banc"},
        {"Épaules", "Développé militaire à la barre"},
        {"Épaules", "Développé épaules aux haltères"},
        {"Épaules", "Développé épaules à la machine"},
        {"Épaules", "Élévations latérales aux haltères"},
        {"Épaules", "Élévations latérales à la poulie"},
        {"Épaules", "Oiseau aux haltères"},
        {"Épaules", "Oiseau à la machine"},
        {"Épaules", "Face pull à la poulie"},
        {"Biceps", "Curl à la barre EZ"},
        {"Biceps", "Curl debout aux haltères"},
        {"Biceps", "Curl incliné aux haltères"},
        {"Biceps", "Curl marteau aux haltères"},
        {"Biceps", "Curl pupitre"},
        {"Biceps", "Curl biceps à la poulie basse"},
        {"Biceps", "Curl concentration"},
        {"Triceps", "Extension des triceps à la poulie haute (corde)"},
        {"Triceps", "Extension des triceps à la poulie haute (barre)"},
        {"Triceps", "Extension des triceps au-dessus de la tête à la poulie basse"},
        {"Triceps", "Extension triceps unilatérale à la poulie"},
        {"Triceps", "Barre au front avec barre EZ"},
        {"Triceps", "Extension triceps au-dessus de la tête avec haltère"},
        {"Triceps", "Dips"},
        {"Triceps", "Développé couché prise serrée"},
        {"Abdos", "Gainage ventral"},
        {"Abdos", "Gainage latéral"},
        {"Abdos", "Relevés de jambes suspendu"},
        {"Abdos", "Relevés de genoux suspendu"},
        {"Abdos", "Crunch à la poulie haute"},
        {"Abdos", "Ab wheel (roue abdominale)"},
        {"Abdos", "Dead bug"},
        {"Abdos", "Pallof press"}
    };
    private static final String PREF="momentum_exercise_library";
    private static final String CUSTOM="custom_v1";
    private static final String FAV="favorites_v1";
    private final SharedPreferences prefs;
    public ExerciseLibrary(Context context) {
        prefs=context.getSharedPreferences(PREF,Context.MODE_PRIVATE);
    }
    static String key(String s) {
        return Normalizer.normalize(s.toLowerCase(Locale.ROOT).trim(),Normalizer.Form.NFD)
            .replaceAll("\\p{M}","").replaceAll("\\s+"," ");
    }
    JSONArray getArray(String prefKey) {
        try {return new JSONArray(prefs.getString(prefKey,"[]"));}
        catch(Exception ignored){return new JSONArray();}
    }
    List<Exercise> all() {
        ArrayList<Exercise> list=new ArrayList<>();
        for(String[] raw:DEFAULTS) list.add(new Exercise(raw[1],raw[0],false));
        JSONArray saved=getArray(CUSTOM);
        for(int i=0;i<saved.length();i++) {
            String value=saved.optString(i,"").trim();
            if(!value.isEmpty())list.add(new Exercise(value,"Mes exercices",true));
        }
        Set<String> fav=favoriteKeys();
        list.sort(Comparator.comparingInt((Exercise e)->fav.contains(key(e.name))?0:1)
            .thenComparingInt(e->e.custom?0:1)
            .thenComparing(e->e.name,String.CASE_INSENSITIVE_ORDER));
        return list;
    }
    boolean addCustom(String input) {
        String name=input.replaceAll("[\\r\\n]+"," ").replaceAll("\\s+"," ").trim();
        if(name.isEmpty()||name.length()>90) return false;
        String lookup=key(name);
        for(Exercise e:all()) if(key(e.name).equals(lookup)) return false;
        JSONArray items=getArray(CUSTOM);items.put(name);
        prefs.edit().putString(CUSTOM,items.toString()).apply();
        return true;
    }
    void removeCustom(String name) {
        JSONArray old=getArray(CUSTOM),updated=new JSONArray();
        for(int i=0;i<old.length();i++)if(!key(old.optString(i)).equals(key(name)))updated.put(old.optString(i));
        prefs.edit().putString(CUSTOM,updated.toString()).apply();
        Set<String> favorites=favoriteKeys();favorites.remove(key(name));writeFavorites(favorites);
    }
    Set<String> favoriteKeys() {
        HashSet<String> saved=new HashSet<>();
        JSONArray array=getArray(FAV);
        for(int i=0;i<array.length();i++)saved.add(key(array.optString(i)));
        return saved;
    }
    boolean isFavorite(String name){return favoriteKeys().contains(key(name));}
    void toggleFavorite(String name){
        Set<String> data=favoriteKeys();String k=key(name);
        if(!data.add(k))data.remove(k);
        writeFavorites(data);
    }
    void writeFavorites(Set<String> data){
        JSONArray arr=new JSONArray();for(String s:data)arr.put(s);
        prefs.edit().putString(FAV,arr.toString()).apply();
    }
    JSONArray exportCustom(){return getArray(CUSTOM);}
    JSONArray exportFavorites(){return getArray(FAV);}
    void restoreFromBackup(JSONObject obj){
        SharedPreferences.Editor editor=prefs.edit();
        if(obj.has("custom_exercises")){
            JSONArray incoming=obj.optJSONArray("custom_exercises");
            if(incoming!=null){
                JSONArray clean=new JSONArray();
                Set<String> seen=new HashSet<>();
                for(int i=0;i<Math.min(incoming.length(),500);i++){
                    String n=incoming.optString(i,"").replaceAll("[\\r\\n]+"," ").trim();
                    if(!n.isEmpty() && n.length()<=90 && seen.add(key(n)))clean.put(n);
                }
                editor.putString(CUSTOM,clean.toString());
            }
        }
        if(obj.has("favorite_exercises")){
            JSONArray incoming=obj.optJSONArray("favorite_exercises");
            if(incoming!=null){
                JSONArray clean=new JSONArray();
                for(int i=0;i<Math.min(incoming.length(),500);i++){
                    String n=incoming.optString(i,"");
                    if(n.length()<=90&&!n.isEmpty())clean.put(key(n));
                }
                editor.putString(FAV,clean.toString());
            }
        }
        editor.apply();
    }
}
