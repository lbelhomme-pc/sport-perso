package fr.momentum.sport;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.text.InputType;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Momentum Sport — carnet sportif, sans serveur ni authentification.
 * UI entièrement native, données SQLite, sauvegarde JSON via le sélecteur Android.
 */
public final class MainActivity extends Activity {
    static final int BG=Color.rgb(12,17,28), CARD=Color.rgb(22,30,44), MUTED=Color.rgb(151,162,182),
            WHITE=Color.rgb(242,246,252), LINE=Color.rgb(42,53,69), ACCENT=Color.rgb(164,240,197),
            NAV=Color.rgb(15,22,34), SECOND=Color.rgb(30,40,57);
    static final String[] SPORTS={"Musculation","Vélo","Badminton","CrossFit","HYROX","WOD","Autre"};
    static final String[] ICONS={"◆","↗","✦","⚡","◉","▣","·"};
    static final int[] COLORS={Color.rgb(174,166,255),Color.rgb(105,193,255),Color.rgb(255,183,137),
            Color.rgb(255,145,162),Color.rgb(245,210,120),Color.rgb(154,223,201), MUTED};
    SportStore store;
    FrameLayout root;
    int tab=0, maxShown=40;
    String sportFilter="Tous";
    SportStore.Session editing;
    String editorSport="Musculation";
    TextView editorDateButton;
    LinearLayout sportChipLine;
    EditText noteField, durationField, hrField, rpeField, distanceField, exerciseField, setsField, repsField, weightField;
    boolean advancedExpanded=false;
    static final int CREATE_JSON=201, OPEN_JSON=202;
    String pendingBackup="";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(BG);
        getWindow().setNavigationBarColor(BG);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        store=new SportStore(this);
        editorSport=getPreferences(MODE_PRIVATE).getString("last_sport","Musculation");
        showTab(0);
    }
    @Override protected void onDestroy(){super.onDestroy(); if(store!=null)store.close();}
    int dp(float d){return Math.round(d*getResources().getDisplayMetrics().density);}
    GradientDrawable shape(int color,float radius){
        GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(dp(radius));return d;
    }
    GradientDrawable outlined(int color,float radius,int stroke){
        GradientDrawable d=shape(color,radius);d.setStroke(dp(1),stroke);return d;
    }
    LinearLayout column(){LinearLayout v=new LinearLayout(this);v.setOrientation(LinearLayout.VERTICAL);return v;}
    LinearLayout row(){LinearLayout v=new LinearLayout(this);v.setOrientation(LinearLayout.HORIZONTAL);v.setGravity(Gravity.CENTER_VERTICAL);return v;}
    LinearLayout.LayoutParams lp(int w,int h){return new LinearLayout.LayoutParams(w<0?w:dp(w),h<0?h:dp(h));}
    FrameLayout.LayoutParams fp(int w,int h){return new FrameLayout.LayoutParams(w<0?w:dp(w),h<0?h:dp(h));}
    TextView text(String value,int sp,int color,boolean bold){
        TextView t=new TextView(this);t.setText(value);t.setTextColor(color);t.setTextSize(TypedValue.COMPLEX_UNIT_SP,sp);
        t.setFontFeatureSettings("kern");
        t.setTypeface(Typeface.create("sans-serif",bold?Typeface.BOLD:Typeface.NORMAL));
        t.setGravity(Gravity.CENTER_VERTICAL);return t;
    }
    TextView tap(String label,int sp,int fg,int bg,Runnable r){
        TextView t=text(label,sp,fg,true);t.setGravity(Gravity.CENTER);t.setBackground(shape(bg,15));
        t.setOnClickListener(v->r.run());t.setClickable(true);t.setFocusable(true);return t;
    }
    void pad(View v,int l,int top,int right,int bottom){v.setPadding(dp(l),dp(top),dp(right),dp(bottom));}
    void space(LinearLayout p,int h){View v=new View(this);p.addView(v,lp(1,h));}
    void startRoot(){root=new FrameLayout(this);root.setBackgroundColor(BG);setContentView(root);}
    ScrollView scroll(LinearLayout into){
        ScrollView s=new ScrollView(this);s.setClipToPadding(false);s.setFillViewport(false);s.setVerticalScrollBarEnabled(false);
        s.addView(into,new ScrollView.LayoutParams(-1,-2));return s;
    }
    LinearLayout paddedContent(){LinearLayout l=column();pad(l,20,14,20,28);return l;}
    String fnum(double d){return String.format(Locale.FRANCE, d==(long)d?"%.0f":"%.1f",d);}
    String date(long when){return new SimpleDateFormat("EEE d MMM · HH:mm",Locale.FRANCE).format(new Date(when));}
    String shortDate(long when){return new SimpleDateFormat("dd MMM yyyy",Locale.FRANCE).format(new Date(when));}
    void titleRow(LinearLayout p,String overline,String title,String sub){
        TextView o=text(overline.toUpperCase(Locale.FRANCE),11,ACCENT,true);o.setLetterSpacing(.18f);p.addView(o);
        space(p,7);p.addView(text(title,30,WHITE,true));
        if(sub!=null){space(p,5);p.addView(text(sub,13,MUTED,false));}
        space(p,24);
    }
    void section(LinearLayout p,String name){
        TextView t=text(name,18,WHITE,true);p.addView(t);space(p,14);
    }
    LinearLayout panel(){LinearLayout l=column();pad(l,17,17,17,17);l.setBackground(outlined(CARD,20,LINE));return l;}
    void hint(LinearLayout p,String s){TextView t=text(s,13,MUTED,false);p.addView(t);}
    int sportColor(String sport){for(int i=0;i<SPORTS.length;i++)if(SPORTS[i].equals(sport))return COLORS[i];return MUTED;}
    String icon(String sport){for(int i=0;i<SPORTS.length;i++)if(SPORTS[i].equals(sport))return ICONS[i];return "·";}
    TextView badge(String str,int bg,int fg){TextView t=text(str,12,fg,true);pad(t,11,8,11,8);t.setBackground(shape(bg,11));return t;}

    void showTab(int next){
        editing=null;tab=next;startRoot();
        LinearLayout shell=column();root.addView(shell,fp(-1,-1));
        LinearLayout content=paddedContent();
        if(tab==0)journal(content);
        else if(tab==1)stats(content);
        else dataScreen(content);
        ScrollView sc=scroll(content);shell.addView(sc,new LinearLayout.LayoutParams(-1,0,1));
        shell.addView(bottomNav(),lp(-1,74));
        if(tab!=2){
            TextView fab=tap("＋  SÉANCE",15,BG,ACCENT,()->showEditor(null));
            fab.setElevation(dp(8));
            FrameLayout.LayoutParams b=fp(155,54);b.gravity=Gravity.BOTTOM|Gravity.RIGHT;
            b.setMargins(0,0,dp(19),dp(89));root.addView(fab,b);
        }
    }
    LinearLayout bottomNav(){
        LinearLayout bar=row();pad(bar,13,6,13,10);bar.setBackgroundColor(NAV);
        String[] labels={"▤ Journal","▥ Progrès","◷ Chronos","◫ Données"};
        for(int i=0;i<labels.length;i++){
            final int ix=i;
            boolean selected=(i==0&&tab==0)||(i==1&&tab==1)||(i==3&&tab==2);
            TextView t=text(labels[i],11,selected?ACCENT:MUTED,true);
            t.setGravity(Gravity.CENTER);t.setBackground(shape(selected?SECOND:NAV,14));
            bar.addView(t,new LinearLayout.LayoutParams(0,-1,1));
            t.setOnClickListener(v->{
                if(ix==2)startActivity(new Intent(this,TimerActivity.class));
                else showTab(ix==3?2:ix);
            });
        }
        return bar;
    }
    void journal(LinearLayout content){
        titleRow(content,"TON CARNET SPORTIF","Momentum.","Chaque séance compte. Zéro friction.");
        List<SportStore.Session> all=store.all();
        Calendar cal=Calendar.getInstance();cal.set(Calendar.HOUR_OF_DAY,0);cal.set(Calendar.MINUTE,0);cal.set(Calendar.SECOND,0);cal.set(Calendar.MILLISECOND,0);
        cal.add(Calendar.DATE,-6);long start=cal.getTimeInMillis();
        int recent=0,minutes=0;double vol=0;
        for(SportStore.Session s:all){if(s.time>=start){recent++;minutes+=s.duration;vol+=s.volume();}}
        LinearLayout overview=panel();
        TextView label=text("LES 7 DERNIERS JOURS",11,ACCENT,true);label.setLetterSpacing(.12f);overview.addView(label);
        space(overview,17);
        LinearLayout metrics=row();
        metric(metrics,String.valueOf(recent),"séances");metric(metrics,formatDuration(minutes),"d'activité");
        overview.addView(metrics);space(overview,21);
        overview.addView(new WeekChart(this,all),lp(-1,102));
        content.addView(overview,lp(-1,-2));space(content,26);
        LinearLayout heading=row();
        TextView h=text("Historique",19,WHITE,true);heading.addView(h,new LinearLayout.LayoutParams(0,dp(36),1));
        TextView n=text(all.size()+" séances",12,MUTED,false);heading.addView(n);
        content.addView(heading);space(content,12);
        HorizontalScrollView filterScroll=new HorizontalScrollView(this);filterScroll.setHorizontalScrollBarEnabled(false);
        LinearLayout chips=row();pad(chips,0,0,6,4);
        String[] filters={"Tous","Musculation","Vélo","Badminton","CrossFit","HYROX","WOD","Autre"};
        for(String f:filters){
            TextView c=badge(f,f.equals(sportFilter)?ACCENT:SECOND,f.equals(sportFilter)?BG:MUTED);
            LinearLayout.LayoutParams cp=lp(-2,38);cp.rightMargin=dp(7);chips.addView(c,cp);
            c.setGravity(Gravity.CENTER);c.setOnClickListener(v->{sportFilter=f;maxShown=40;showTab(0);});
        }
        filterScroll.addView(chips);content.addView(filterScroll);space(content,13);
        int found=0;
        for(SportStore.Session s:all){
            if(!"Tous".equals(sportFilter)&&!sportFilter.equals(s.sport))continue;
            if(found++>=maxShown)continue;
            addSessionCard(content,s);
        }
        if(found==0){
            LinearLayout empty=panel();pad(empty,18,27,18,27);
            empty.addView(text("Ton journal commence ici.",17,WHITE,true));space(empty,7);
            hint(empty,"Une note ou un simple choix de sport suffit pour enregistrer une séance.");
            space(empty,16);TextView add=tap("Créer ma première séance",13,BG,ACCENT,()->showEditor(null));
            empty.addView(add,lp(-1,45));content.addView(empty);
        } else if(found>maxShown){
            TextView more=tap("Afficher plus  ·  "+Math.min(found-maxShown,40)+" séances",13,WHITE,SECOND,()->{maxShown+=40;showTab(0);});
            content.addView(more,lp(-1,48));
        }
        space(content,98);
    }
    void metric(LinearLayout parent,String value,String caption){
        LinearLayout block=column();block.addView(text(value,31,WHITE,true));block.addView(text(caption,12,MUTED,false));
        parent.addView(block,new LinearLayout.LayoutParams(0,-2,1));
    }
    static String formatDuration(int minutes){
        if(minutes==0)return "0 min";
        if(minutes<60)return minutes+" min";
        return minutes/60+" h"+(minutes%60==0?"":" "+(minutes%60));
    }
    void addSessionCard(LinearLayout parent,SportStore.Session s){
        LinearLayout card=panel();pad(card,15,15,15,15);
        LinearLayout top=row();
        TextView ico=badge(icon(s.sport),SECOND,sportColor(s.sport));ico.setTextSize(19);ico.setGravity(Gravity.CENTER);
        top.addView(ico,lp(42,42));
        LinearLayout centre=column();pad(centre,12,0,0,0);
        centre.addView(text(s.sport,15,WHITE,true));centre.addView(text(date(s.time),12,MUTED,false));
        top.addView(centre,new LinearLayout.LayoutParams(0,-2,1));
        TextView arrow=text("›",25,MUTED,false);top.addView(arrow);
        card.addView(top);
        if(!s.note.trim().isEmpty()){
            space(card,12);
            String val=s.note.trim();if(val.length()>210)val=val.substring(0,210)+"…";
            TextView body=text(val,14,WHITE,false);body.setMaxLines(4);body.setEllipsize(TextUtils.TruncateAt.END);
            card.addView(body);
        }
        ArrayList<String> details=new ArrayList<>();
        if(s.duration>0)details.add("◷ "+formatDuration(s.duration));
        if(s.hr>0)details.add("♥ "+s.hr+" bpm");
        if(s.distance>0)details.add("↗ "+fnum(s.distance)+" km");
        if(s.rpe>0)details.add("RPE "+s.rpe);
        if(s.sets>0&&s.reps>0)details.add(s.sets+"×"+s.reps+(s.weight>0?" · "+fnum(s.weight)+" kg":""));
        if(!details.isEmpty()){
            space(card,14);
            TextView tags=text(TextUtils.join("   ·   ",details),12,ACCENT,true);
            tags.setMaxLines(2);card.addView(tags);
        }
        card.setOnClickListener(v->showEditor(s));
        LinearLayout.LayoutParams lp=lp(-1,-2);lp.bottomMargin=dp(10);parent.addView(card,lp);
    }
    void stats(LinearLayout content){
        titleRow(content,"CHIFFRES UTILES","Progression.","Tes tendances, sans statistiques décoratives.");
        List<SportStore.Session> all=store.all();
        int min=0,count=all.size(),hrCount=0,hrSum=0,rpeCount=0,rpeSum=0;double volume=0;
        Map<String,Integer> perSport=new HashMap<>();Map<String,Double> records=new HashMap<>();
        for(SportStore.Session s:all){
            min+=s.duration;volume+=s.volume();
            if(s.hr>0){hrCount++;hrSum+=s.hr;}if(s.rpe>0){rpeCount++;rpeSum+=s.rpe;}
            perSport.put(s.sport,perSport.getOrDefault(s.sport,0)+1);
            if(s.weight>0&&!s.exercise.trim().isEmpty()){
                String key=s.exercise.trim();records.put(key,Math.max(records.getOrDefault(key,0.0),s.weight));
            }
        }
        LinearLayout two=row();two.setGravity(Gravity.TOP);
        statBox(two,String.valueOf(count),"Séances");statBox(two,formatDuration(min),"Durée totale");
        content.addView(two);space(content,12);
        LinearLayout two2=row();two2.setGravity(Gravity.TOP);
        statBox(two2,volume>0?fnum(volume)+" kg":"—","Volume saisi");
        statBox(two2,rpeCount>0?fnum((double)rpeSum/rpeCount):"—","RPE moyen");
        content.addView(two2);space(content,25);
        section(content,"Rythme des 7 derniers jours");
        LinearLayout plot=panel();plot.addView(new WeekChart(this,all),lp(-1,151));content.addView(plot);
        space(content,25);section(content,"Répartition des sports");
        if(all.isEmpty())hint(content,"Commence par enregistrer une séance : les graphiques apparaîtront ici.");
        for(String sp:SPORTS){int n=perSport.getOrDefault(sp,0);if(n==0)continue;
            LinearLayout p=panel();LinearLayout label=row();
            TextView name=text(icon(sp)+"  "+sp,14,WHITE,true);label.addView(name,new LinearLayout.LayoutParams(0,dp(30),1));
            label.addView(text(n+" séances",12,MUTED,false));p.addView(label);space(p,9);
            FrameLayout track=new FrameLayout(this);track.setBackground(shape(SECOND,7));
            View fill=new View(this);fill.setBackground(shape(sportColor(sp),7));
            FrameLayout.LayoutParams bp=fp(-1,8);bp.width=dp(250);track.addView(fill,bp);
            p.addView(track,lp(-1,8));
            final int percent=(int)(100f*n/Math.max(1,all.size()));
            track.post(()->{ViewGroup.LayoutParams z=fill.getLayoutParams();z.width=(int)(track.getWidth()*(percent/100f));fill.setLayoutParams(z);});
            LinearLayout.LayoutParams pp=lp(-1,-2);pp.bottomMargin=dp(9);content.addView(p,pp);
        }
        if(!records.isEmpty()){
            space(content,23);section(content,"Charges maximales enregistrées");
            int displayed=0;
            ArrayList<Map.Entry<String,Double>> sort=new ArrayList<>(records.entrySet());
            sort.sort((a,b)->Double.compare(b.getValue(),a.getValue()));
            for(Map.Entry<String,Double> e:sort){if(displayed++>=12)break;
                LinearLayout line=row();pad(line,15,12,15,12);line.setBackground(outlined(CARD,14,LINE));
                line.addView(text(e.getKey(),13,WHITE,false),new LinearLayout.LayoutParams(0,-2,1));
                line.addView(text(fnum(e.getValue())+" kg",14,ACCENT,true));
                LinearLayout.LayoutParams p=lp(-1,-2);p.bottomMargin=dp(8);content.addView(line,p);
            }
        }
        space(content,100);
    }
    void statBox(LinearLayout parent,String value,String desc){
        LinearLayout p=panel();pad(p,14,15,10,15);
        p.addView(text(value,22,WHITE,true));space(p,6);p.addView(text(desc,12,MUTED,false));
        LinearLayout.LayoutParams q=new LinearLayout.LayoutParams(0,dp(105),1);q.rightMargin=dp(7);parent.addView(p,q);
    }
    void dataScreen(LinearLayout content){
        titleRow(content,"100 % HORS LIGNE","Tes données.","Sans compte, sans serveur, sans abonnement.");
        LinearLayout privacy=panel();privacy.addView(text("✓  Stockage local",18,ACCENT,true));space(privacy,9);
        hint(privacy,"Les séances sont dans une base SQLite privée sur ce téléphone. L'application ne demande pas d'accès Internet.");
        content.addView(privacy);space(content,23);
        section(content,"Sauvegarde et restauration");
        LinearLayout exp=panel();exp.addView(text("Exporter mes séances",17,WHITE,true));space(exp,5);
        hint(exp,"Crée un fichier JSON lisible, réutilisable et archivable où tu veux.");space(exp,16);
        TextView ex=tap("Exporter la sauvegarde  ↗",14,BG,ACCENT,this::exportBackup);
        exp.addView(ex,lp(-1,48));content.addView(exp);space(content,12);
        LinearLayout imp=panel();imp.addView(text("Restaurer une sauvegarde",17,WHITE,true));space(imp,5);
        hint(imp,"Remplace les séances actuelles par celles d'un fichier Momentum Sport. Confirmation avant remplacement.");space(imp,16);
        TextView im=tap("Choisir un fichier JSON",14,WHITE,SECOND,this::importBackup);
        imp.addView(im,lp(-1,48));content.addView(imp);space(content,24);
        section(content,"Format du carnet");
        hint(content,"Exemples de notes comprises automatiquement :\n\n« Deadlift 2x4 140 kg RPE 7 »\n« Vélo 45 min, 125 bpm, 18 km »\n« Badminton 1 h, bon ressenti »\n\nLes mesures facultatives précisent la durée, la FC, le RPE et la distance.");
        space(content,23);
        LinearLayout clear=panel();clear.addView(text("Effacer toutes les séances",16,WHITE,true));space(clear,10);
        TextView cl=tap("Tout supprimer",13,Color.rgb(255,156,164),SECOND,()->new AlertDialog.Builder(this)
            .setTitle("Supprimer toutes les séances ?")
            .setMessage("Cette action est définitive. Exporte d'abord une sauvegarde si nécessaire.")
            .setNegativeButton("Annuler",null)
            .setPositiveButton("Supprimer",(d,w)->{store.clearAll();showTab(2);toast("Données supprimées");}).show());
        clear.addView(cl,lp(-1,45));content.addView(clear);
        space(content,30);
        TextView v=text("MOMENTUM SPORT  ·  VERSION 1.3.9",11,MUTED,true);v.setGravity(Gravity.CENTER);content.addView(v);
    }
    void toast(String m){Toast.makeText(this,m,Toast.LENGTH_SHORT).show();}
    void showEditor(SportStore.Session session){ showEditor(session,false); }
    void showEditor(SportStore.Session session, boolean preserve){
        tab=-1;editing=session==null?new SportStore.Session():session;
        editorSport=session==null?getPreferences(MODE_PRIVATE).getString("last_sport","Musculation"):session.sport;
        if(!preserve) advancedExpanded=session!=null && (session.duration>0||session.hr>0||session.rpe>0||session.distance>0);
        startRoot();
        LinearLayout shell=column();root.addView(shell,fp(-1,-1));
        LinearLayout bar=row();pad(bar,20,11,20,10);
        TextView back=text("‹",34,WHITE,false);back.setGravity(Gravity.CENTER);bar.addView(back,lp(48,43));back.setOnClickListener(v->showTab(0));
        TextView name=text(editing.id<=0?"Nouvelle séance":"Modifier la séance",18,WHITE,true);
        bar.addView(name,new LinearLayout.LayoutParams(0,-2,1));
        if(editing.id>0){TextView del=badge("Supprimer",SECOND,Color.rgb(255,160,170));bar.addView(del);
            del.setOnClickListener(v->new AlertDialog.Builder(this).setTitle("Supprimer cette séance ?")
                .setNegativeButton("Annuler",null).setPositiveButton("Supprimer",(d,b)->{store.delete(editing.id);showTab(0);toast("Séance supprimée");}).show());}
        shell.addView(bar,lp(-1,65));
        LinearLayout content=paddedContent();
        TextView eyebrow=text("1 · CHOISIS TON SPORT",11,ACCENT,true);eyebrow.setLetterSpacing(.1f);content.addView(eyebrow);space(content,12);
        HorizontalScrollView hor=new HorizontalScrollView(this);hor.setHorizontalScrollBarEnabled(false);
        sportChipLine=row();pad(sportChipLine,0,0,4,0);hor.addView(sportChipLine);content.addView(hor);renderSportChips();space(content,23);
        LinearLayout day=row();
        TextView dateLabel=text("2 · DATE DE LA SÉANCE",11,ACCENT,true);dateLabel.setLetterSpacing(.1f);
        day.addView(dateLabel,new LinearLayout.LayoutParams(0,-2,1));
        editorDateButton=badge(shortDate(editing.time)+"  ▾",SECOND,WHITE);day.addView(editorDateButton);
        editorDateButton.setOnClickListener(v->chooseDate());content.addView(day);space(content,20);
        TextView lab=text("3 · RACONTE TA SÉANCE",11,ACCENT,true);lab.setLetterSpacing(.1f);content.addView(lab);space(content,10);
        noteField=new EditText(this);
        noteField.setTextColor(WHITE);noteField.setHintTextColor(MUTED);
        noteField.setHint("Ex. Deadlift 2x4 140 kg RPE 7\nou Badminton 1h10, bonnes sensations…");
        noteField.setTextSize(16);noteField.setGravity(Gravity.TOP|Gravity.START);
        noteField.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_MULTI_LINE|InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        noteField.setMinLines(5);noteField.setMaxLines(16);noteField.setSingleLine(false);
        pad(noteField,16,16,16,16);noteField.setBackground(outlined(CARD,18,LINE));
        noteField.setText(editing.note);noteField.setSelection(noteField.length());
        content.addView(noteField,lp(-1,-2));space(content,12);
        addNoteShortcutBars(content);space(content,12);
        hint(content,"Une note libre, sans formulaire imposé. Les mesures peuvent être détectées dans le texte.");space(content,18);
        TextView toggle=tap(advancedExpanded?"Masquer les détails  ⌃":"＋  Ajouter des détails facultatifs",13,WHITE,SECOND,()->{
            captureFields();advancedExpanded=!advancedExpanded;rebuildEditor();
        });content.addView(toggle,lp(-1,48));space(content,14);
        LinearLayout details=column();content.addView(details);
        if(advancedExpanded)renderDetails(details);
        space(content,28);
        ScrollView sc=scroll(content);shell.addView(sc,new LinearLayout.LayoutParams(-1,0,1));
        LinearLayout footer=column();pad(footer,20,12,20,13);footer.setBackgroundColor(NAV);
        TextView save=tap(editing.id<=0?"Enregistrer la séance  ✓":"Enregistrer les modifications  ✓",15,BG,ACCENT,()->saveEditor());
        footer.addView(save,lp(-1,56));shell.addView(footer,lp(-1,-2));
    }
    // La structure libre de la note est conservée lors d'un changement de mode.
    void captureFields(){
        if(editing==null)return;
        if(noteField!=null)editing.note=noteField.getText().toString();
        if(durationField!=null){
            editing.duration=numInt(durationField,0,1440);editing.hr=numInt(hrField,0,250);
            editing.rpe=numInt(rpeField,0,10);editing.distance=numFloat(distanceField);
        }
    }
    void rebuildEditor(){SportStore.Session s=editing;showEditor(s,true);}
    void addNoteShortcutBars(LinearLayout into){
        into.addView(text("STRUCTURE",11,MUTED,true));space(into,7);
        addShortcutsRow(into,new String[]{"Échauffement","Exercice principal","Accessoires","Retour au calme"},
            new String[]{"- Échauffement -","- Exercice principal -","- Accessoires -","- Retour au calme -"});
        space(into,9);
        into.addView(text("DÉTAILS",11,MUTED,true));space(into,7);
        addShortcutsRow(into,new String[]{"Montée en charge","En charge","Série","RPE","Ressenti"},
            new String[]{"-- Montée en charge --","-- En charge --","--- Série ---","RPE : ","Ressenti : "});
    }
    void addShortcutsRow(LinearLayout into,String[] labels,String[] fragments){
        HorizontalScrollView scroll=new HorizontalScrollView(this);
        scroll.setHorizontalScrollBarEnabled(false);
        LinearLayout line=row();pad(line,0,0,4,0);
        for(int i=0;i<labels.length;i++){
            final String fragment=fragments[i];
            TextView chip=text(labels[i],12,WHITE,true);
            pad(chip,13,0,13,0);chip.setGravity(Gravity.CENTER);
            chip.setBackground(outlined(SECOND,13,LINE));
            LinearLayout.LayoutParams pp=lp(-2,40);pp.rightMargin=dp(7);
            line.addView(chip,pp);
            chip.setOnClickListener(v->insertNoteFragment(fragment));
        }
        scroll.addView(line);into.addView(scroll);
    }
    void insertNoteFragment(String fragment){
        if(noteField==null)return;
        int cursor=Math.max(0,Math.min(noteField.getSelectionStart(),noteField.length()));
        String current=noteField.getText().toString();
        boolean newLine=(cursor>0 && current.charAt(cursor-1)!=10);
        String insert=(newLine?String.valueOf((char)10):"")+fragment+(fragment.endsWith(" : ")?"":String.valueOf((char)10));
        noteField.getText().insert(cursor,insert);
        noteField.setSelection(cursor+insert.length());
        noteField.requestFocus();
    }
    void renderSportChips(){
        sportChipLine.removeAllViews();
        for(String sport:SPORTS){boolean selected=sport.equals(editorSport);
            TextView t=text(icon(sport)+"  "+sport,14,selected?BG:WHITE,true);
            pad(t,16,0,16,0);t.setGravity(Gravity.CENTER);
            t.setBackground(outlined(selected?ACCENT:SECOND,14,selected?ACCENT:LINE));
            LinearLayout.LayoutParams p=lp(-2,48);p.rightMargin=dp(8);sportChipLine.addView(t,p);
            t.setOnClickListener(v->{editorSport=sport;renderSportChips();});
        }
    }
    void chooseDate(){
        Calendar d=Calendar.getInstance();d.setTimeInMillis(editing.time);
        DatePickerDialog pick=new DatePickerDialog(this,(picker,y,m,day)->{
            Calendar a=Calendar.getInstance();a.setTimeInMillis(editing.time);
            a.set(Calendar.YEAR,y);a.set(Calendar.MONTH,m);a.set(Calendar.DAY_OF_MONTH,day);
            editing.time=a.getTimeInMillis();editorDateButton.setText(shortDate(editing.time)+"  ▾");
        },d.get(Calendar.YEAR),d.get(Calendar.MONTH),d.get(Calendar.DAY_OF_MONTH));
        pick.show();
    }
    EditText field(LinearLayout group,String label,String hint,String value,boolean decimals){
        LinearLayout block=column();TextView name=text(label,12,MUTED,true);block.addView(name);space(block,6);
        EditText f=new EditText(this);f.setSingleLine(true);f.setTextColor(WHITE);f.setHintTextColor(MUTED);
        f.setTextSize(15);f.setHint(hint);f.setText(value);f.selectAll();
        f.setInputType(decimals?InputType.TYPE_CLASS_NUMBER|InputType.TYPE_NUMBER_FLAG_DECIMAL:
                InputType.TYPE_CLASS_NUMBER);
        pad(f,12,0,10,0);f.setBackground(outlined(SECOND,12,LINE));block.addView(f,lp(-1,46));
        LinearLayout.LayoutParams b=new LinearLayout.LayoutParams(0,-2,1);b.rightMargin=dp(10);group.addView(block,b);
        return f;
    }
    EditText freeField(LinearLayout p,String label,String hint,String value){
        p.addView(text(label,12,MUTED,true));space(p,6);
        EditText f=new EditText(this);f.setSingleLine(true);f.setTextColor(WHITE);f.setHintTextColor(MUTED);
        f.setHint(hint);f.setText(value);f.setTextSize(15);f.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        pad(f,12,0,10,0);f.setBackground(outlined(SECOND,12,LINE));p.addView(f,lp(-1,46));return f;
    }
    void renderDetails(LinearLayout into){
        LinearLayout p=panel();p.addView(text("Mesures",15,WHITE,true));space(p,13);
        LinearLayout r=row();r.setGravity(Gravity.TOP);
        durationField=field(r,"Durée (min)","45",editing.duration>0?""+editing.duration:"",false);
        hrField=field(r,"FC moyenne","125",editing.hr>0?""+editing.hr:"",false);p.addView(r);space(p,15);
        LinearLayout r2=row();r2.setGravity(Gravity.TOP);
        rpeField=field(r2,"RPE (1–10)","7",editing.rpe>0?""+editing.rpe:"",false);
        distanceField=field(r2,"Distance (km)","20,5",editing.distance>0?fnum(editing.distance):"",true);
        p.addView(r2);
        into.addView(p);
    }
    int numInt(EditText f,int lo,int hi){try{return Math.max(lo,Math.min(hi,Integer.parseInt(f.getText().toString().trim())));}catch(Exception e){return 0;}}
    double numFloat(EditText f){try{return Math.max(0,Double.parseDouble(f.getText().toString().trim().replace(',','.')));}catch(Exception e){return 0;}}
    void saveEditor(){
        try {
            captureFields();editing.sport=editorSport;editing.detectFromNote();
            store.save(editing);
            getPreferences(MODE_PRIVATE).edit().putString("last_sport",editorSport).apply();
            editing=null;maxShown=40;sportFilter="Tous";
            showTab(0);toast("Séance enregistrée ✓");
        } catch(Exception e){toast("Enregistrement impossible : "+e.getMessage());}
    }
    @Override public void onBackPressed(){
        if(tab==-1){new AlertDialog.Builder(this).setTitle("Quitter l'édition ?")
            .setMessage("Les modifications non enregistrées seront perdues.")
            .setNegativeButton("Continuer",null)
            .setPositiveButton("Quitter",(d,b)->showTab(0)).show();
        }else if(tab!=0)showTab(0);else super.onBackPressed();
    }
    void exportBackup(){
        try{
            pendingBackup=store.exportJson();
            Intent i=new Intent(Intent.ACTION_CREATE_DOCUMENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);i.setType("application/json");
            i.putExtra(Intent.EXTRA_TITLE,"momentum-sport-"+new SimpleDateFormat("yyyy-MM-dd",Locale.US).format(new Date())+".json");
            startActivityForResult(i,CREATE_JSON);
        }catch(Exception e){toast("Export impossible : "+e.getMessage());}
    }
    void importBackup(){
        Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("application/json");startActivityForResult(i,OPEN_JSON);
    }
    @Override protected void onActivityResult(int request,int result,Intent data){
        super.onActivityResult(request,result,data);
        if(result!=RESULT_OK||data==null||data.getData()==null)return;
        Uri uri=data.getData();
        try{
            if(request==CREATE_JSON){
                try(OutputStream out=getContentResolver().openOutputStream(uri)){
                    if(out==null)throw new IllegalStateException("Fichier non accessible");
                    out.write(pendingBackup.getBytes(StandardCharsets.UTF_8));out.flush();
                }
                pendingBackup="";toast("Sauvegarde créée ✓");
            }else if(request==OPEN_JSON){
                byte[] bytes;
                try(InputStream in=getContentResolver().openInputStream(uri);
                    ByteArrayOutputStream buf=new ByteArrayOutputStream()){
                    if(in==null)throw new IllegalStateException("Fichier non accessible");
                    byte[] block=new byte[8192];int n;
                    while((n=in.read(block))!=-1){buf.write(block,0,n);
                        if(buf.size()>25_000_000)throw new IllegalArgumentException("Fichier trop volumineux");}
                    bytes=buf.toByteArray();
                }
                final String json=new String(bytes,StandardCharsets.UTF_8);
                JSONObject j=new JSONObject(json);
                if(!"momentum-sport".equals(j.optString("format"))||j.optInt("version")!=1)
                    throw new IllegalArgumentException("Sauvegarde incompatible");
                int amount=j.getJSONArray("sessions").length();
                new AlertDialog.Builder(this).setTitle("Restaurer "+amount+" séances ?")
                    .setMessage("Les séances du téléphone seront remplacées par celles de cette sauvegarde. Cette action est irréversible.")
                    .setNegativeButton("Annuler",null)
                    .setPositiveButton("Restaurer",(d,w)->{
                        try{int count=store.restore(json);showTab(0);toast(count+" séances restaurées ✓");}
                        catch(Exception e){toast("Import impossible : "+e.getMessage());}
                    }).show();
            }
        }catch(Exception e){toast("Erreur fichier : "+e.getMessage());}
    }

    /** Histogramme dessiné en natif : rapide, indépendant d'une bibliothèque tierce. */
    static final class WeekChart extends View {
        final Paint paint=new Paint(3);final int[] daily=new int[7];
        final String[] days=new String[7];
        WeekChart(Activity c,List<SportStore.Session> all){super(c);
            Calendar t=Calendar.getInstance();
            t.set(Calendar.HOUR_OF_DAY,0);t.set(Calendar.MINUTE,0);t.set(Calendar.SECOND,0);t.set(Calendar.MILLISECOND,0);
            t.add(Calendar.DAY_OF_MONTH,-6);
            SimpleDateFormat f=new SimpleDateFormat("EEEEE",Locale.FRANCE);
            for(int i=0;i<7;i++){
                days[i]=f.format(t.getTime()).toUpperCase(Locale.FRANCE);
                long low=t.getTimeInMillis();t.add(Calendar.DAY_OF_MONTH,1);long high=t.getTimeInMillis();
                for(SportStore.Session s:all)if(s.time>=low&&s.time<high)daily[i]++;
            }
            setContentDescription("Séances des sept derniers jours");
        }
        @Override protected void onDraw(Canvas c){super.onDraw(c);
            float d=getResources().getDisplayMetrics().density;
            float width=getWidth(),height=getHeight();float top=6*d,base=height-25*d;
            int max=1;for(int v:daily)max=Math.max(max,v);
            paint.setColor(LINE);paint.setStrokeWidth(d);
            c.drawLine(0,base,width,base,paint);
            float cell=width/7f;
            for(int i=0;i<7;i++){
                float bh=(base-top-6*d)*(daily[i]/(float)max);
                float x=cell*(i+.5f), bar=Math.min(25*d,cell*.5f);
                paint.setColor(i==6?ACCENT:Color.rgb(90,127,127));
                c.drawRoundRect(x-bar/2f,base-bh,x+bar/2f,base,7*d,7*d,paint);
                paint.setColor(MUTED);paint.setTextSize(11*d);paint.setTextAlign(Paint.Align.CENTER);
                c.drawText(days[i],x,height-6*d,paint);
                if(daily[i]>0){paint.setColor(WHITE);paint.setTextSize(10*d);c.drawText(""+daily[i],x,Math.max(9*d,base-bh-6*d),paint);}
            }
        }
    }
}