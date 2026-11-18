package fr.momentum.sport;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/** Petits raccourcis de note, indépendants des séances, conservés sur le téléphone. */
public final class ShortcutPresets {
    public static final String STRUCTURE="structure", DETAIL="detail";
    public static final int LEVEL_1=0, LEVEL_2=1, LEVEL_3=2, TEXT=3;
    public static final String[] FORMATS={
        "Titre : - ... -", "Sous-titre : -- ... --",
        "Détail : --- ... ---", "Texte libre : Nom : "
    };
    static final String STORE="momentum_note_shortcuts_v1", CUSTOM="custom", HIDDEN="hidden";
    public static final class Preset {
        public final String id,group,label;
        public final int format;
        public final boolean builtIn,hidden;
        Preset(String id,String group,String label,int format,boolean builtIn,boolean hidden){
            this.id=id;this.group=group;this.label=label;this.format=format;
            this.builtIn=builtIn;this.hidden=hidden;
        }
        String fragment(){
            switch(format){
                case LEVEL_1:return "- "+label+" -";
                case LEVEL_2:return "-- "+label+" --";
                case LEVEL_3:return "--- "+label+" ---";
                default:return label+" : ";
            }
        }
    }
    private static final String[][] DEFAULTS={
        {"s-warm",STRUCTURE,"Échauffement","0"},
        {"s-main",STRUCTURE,"Exercice principal","0"},
        {"s-access",STRUCTURE,"Accessoires","0"},
        {"s-cool",STRUCTURE,"Retour au calme","0"},
        {"d-warm",DETAIL,"Montée en charge","1"},
        {"d-work",DETAIL,"En charge","1"},
        {"d-series",DETAIL,"Série","2"},
        {"d-rpe",DETAIL,"RPE","3"},
        {"d-feel",DETAIL,"Ressenti","3"}
    };
    final SharedPreferences prefs;
    public ShortcutPresets(Context ctx){
        prefs=ctx.getSharedPreferences(STORE,Context.MODE_PRIVATE);
    }
    static boolean validGroup(String group){return STRUCTURE.equals(group)||DETAIL.equals(group);}
    public static String labelKey(String name){
        return Normalizer.normalize(name.trim().toLowerCase(Locale.ROOT),Normalizer.Form.NFD)
            .replaceAll("\\p{M}","").replaceAll("\\s+"," ");
    }
    JSONArray getArray(String name){
        try {return new JSONArray(prefs.getString(name,"[]"));}
        catch(Exception e){return new JSONArray();}
    }
    Set<String> hiddenIds(){
        HashSet<String> out=new HashSet<>();
        JSONArray a=getArray(HIDDEN);
        for(int i=0;i<a.length();i++)out.add(a.optString(i));
        return out;
    }
    void putHidden(Set<String> hidden){
        JSONArray a=new JSONArray();
        for(String id:hidden)a.put(id);
        prefs.edit().putString(HIDDEN,a.toString()).apply();
    }
    public List<Preset> list(String group,boolean includeHidden){
        ArrayList<Preset> all=new ArrayList<>();
        Set<String> hidden=hiddenIds();
        for(String[] row:DEFAULTS){
            if(!group.equals(row[1]))continue;
            boolean h=hidden.contains(row[0]);
            if(!h||includeHidden)
                all.add(new Preset(row[0],row[1],row[2],Integer.parseInt(row[3]),true,h));
        }
        JSONArray custom=getArray(CUSTOM);
        for(int i=0;i<custom.length();i++){
            JSONObject j=custom.optJSONObject(i);if(j==null)continue;
            String g=j.optString("group","");
            if(!group.equals(g))continue;
            String label=j.optString("label","");
            String id=j.optString("id","");
            int format=j.optInt("format",group.equals(STRUCTURE)?0:1);
            if(label.isEmpty()||id.isEmpty()||format<0||format>3)continue;
            all.add(new Preset(id,g,label,format,false,false));
        }
        return all;
    }
    public String upsert(String id,String group,String entered,int format){
        if(!validGroup(group)||format<0||format>3)return "Format de raccourci invalide";
        String label=entered.replaceAll("[\\r\\n]+"," ").replaceAll("\\s+"," ").trim();
        if(label.isEmpty())return "Saisis un nom";
        if(label.length()>70)return "Nom trop long (70 caractères maximum)";
        String key=labelKey(label);
        for(Preset p:list(group,true)){
            if(!p.id.equals(id)&&labelKey(p.label).equals(key))return "Ce raccourci existe déjà";
        }
        JSONArray existing=getArray(CUSTOM),updated=new JSONArray();
        String newId=(id==null||id.isEmpty())?"custom-"+Long.toHexString(System.nanoTime()):id;
        for(int i=0;i<existing.length();i++){
            JSONObject item=existing.optJSONObject(i);
            if(item!=null&&!item.optString("id").equals(newId))updated.put(item);
        }
        JSONObject item=new JSONObject();
        try{
            item.put("id",newId);item.put("group",group);
            item.put("label",label);item.put("format",format);
            updated.put(item);
        }catch(Exception e){return "Enregistrement impossible";}
        prefs.edit().putString(CUSTOM,updated.toString()).apply();
        return null;
    }
    public void removeOrHide(Preset preset){
        if(preset.builtIn){
            Set<String> hidden=hiddenIds();hidden.add(preset.id);putHidden(hidden);
        }else{
            JSONArray items=getArray(CUSTOM),updated=new JSONArray();
            for(int i=0;i<items.length();i++){
                JSONObject j=items.optJSONObject(i);
                if(j!=null&&!preset.id.equals(j.optString("id")))updated.put(j);
            }
            prefs.edit().putString(CUSTOM,updated.toString()).apply();
        }
    }
    public void reveal(String id){
        Set<String> hidden=hiddenIds();hidden.remove(id);putHidden(hidden);
    }
    public void restoreDefaults(String group){
        Set<String> hidden=hiddenIds();
        for(String[] item:DEFAULTS)if(group.equals(item[1]))hidden.remove(item[0]);
        putHidden(hidden);
    }
    public JSONArray exportCustom(){return getArray(CUSTOM);}
    public JSONArray exportHidden(){return getArray(HIDDEN);}
    public void restoreBackup(JSONObject backup){
        SharedPreferences.Editor edit=prefs.edit();
        if(backup.has("custom_shortcuts")){
            JSONArray old=backup.optJSONArray("custom_shortcuts"),newArray=new JSONArray();
            Set<String> seen=new HashSet<>();
            if(old!=null)for(int i=0;i<Math.min(old.length(),200);i++){
                JSONObject item=old.optJSONObject(i);if(item==null)continue;
                String group=item.optString("group","");
                String label=item.optString("label","").replaceAll("[\\r\\n]+"," ").trim();
                int format=item.optInt("format",-1);
                String id=item.optString("id","");
                if(!validGroup(group)||label.isEmpty()||label.length()>70||format<0||format>3)continue;
                String duplicate=group+":"+labelKey(label);
                if(!seen.add(duplicate))continue;
                JSONObject sanitized=new JSONObject();
                try{
                    sanitized.put("id","restored-"+i+"-"+Math.abs(id.hashCode()));
                    sanitized.put("group",group);
                    sanitized.put("label",label);
                    sanitized.put("format",format);
                    newArray.put(sanitized);
                }catch(Exception ignored){}
            }
            edit.putString(CUSTOM,newArray.toString());
        }
        if(backup.has("hidden_shortcuts")){
            JSONArray old=backup.optJSONArray("hidden_shortcuts"),newArray=new JSONArray();
            Set<String> seen=new HashSet<>();
            if(old!=null)for(int i=0;i<old.length();i++){
                String id=old.optString(i);
                for(String[] row:DEFAULTS)if(row[0].equals(id)&&seen.add(id))newArray.put(id);
            }
            edit.putString(HIDDEN,newArray.toString());
        }
        edit.apply();
    }
}