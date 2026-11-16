package fr.momentum.sport;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import java.util.List;
import java.util.Locale;

/** Choix rapide d'exercices : 1 touche = une insertion dans la note. */
public final class ExercisePicker {
    public interface OnSelect {
        void insert(String name, boolean withPhases);
    }
    private final MainActivity activity;
    private final ExerciseLibrary library;
    private final OnSelect callback;
    private AlertDialog dialog;
    private EditText search;
    private LinearLayout categoryLine, exerciseList;
    private TextView templateMode;
    private String category="Tous";
    private boolean withPhases;
    private static final int BG=MainActivity.BG;
    private static final int CARD=MainActivity.CARD;
    private static final int SECOND=MainActivity.SECOND;
    private static final int LINE=MainActivity.LINE;
    private static final int MUTED=MainActivity.MUTED;
    private static final int WHITE=MainActivity.WHITE;
    private static final int ACCENT=MainActivity.ACCENT;

    public ExercisePicker(MainActivity activity, OnSelect callback) {
        this.activity=activity;
        this.callback=callback;
        this.library=new ExerciseLibrary(activity);
        this.withPhases=activity.getPreferences(Context.MODE_PRIVATE).getBoolean("exercise_insert_phases",true);
    }
    private int dp(int n){return Math.round(n*activity.getResources().getDisplayMetrics().density);}
    private LinearLayout col(){LinearLayout l=new LinearLayout(activity);l.setOrientation(LinearLayout.VERTICAL);return l;}
    private LinearLayout row(){LinearLayout l=new LinearLayout(activity);l.setOrientation(LinearLayout.HORIZONTAL);l.setGravity(Gravity.CENTER_VERTICAL);return l;}
    private void padding(View v,int l,int t,int r,int b){v.setPadding(dp(l),dp(t),dp(r),dp(b));}
    private LinearLayout.LayoutParams lp(int w,int h){return new LinearLayout.LayoutParams(w<0?w:dp(w),h<0?h:dp(h));}
    private void gap(LinearLayout parent,int height){parent.addView(new View(activity),lp(1,height));}
    private GradientDrawable shape(int color,int radius,boolean border) {
        GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(dp(radius));
        if(border)d.setStroke(dp(1),LINE);return d;
    }
    private TextView label(String content,int size,int color,boolean bold){
        TextView t=new TextView(activity);t.setText(content);t.setTextColor(color);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP,size);
        t.setTypeface(Typeface.create("sans-serif",bold?Typeface.BOLD:Typeface.NORMAL));
        t.setGravity(Gravity.CENTER_VERTICAL);return t;
    }
    public void show() {
        LinearLayout box=col();padding(box,18,18,18,15);box.setBackground(shape(BG,18,false));
        TextView heading=label("Choisir un exercice",20,WHITE,true);
        box.addView(heading);gap(box,4);
        box.addView(label("Appuie pour l'ajouter à ta séance.",12,MUTED,false));gap(box,15);
        search=new EditText(activity);
        search.setSingleLine(true);search.setTextColor(WHITE);search.setHintTextColor(MUTED);
        search.setTextSize(15);search.setHint("Rechercher un exercice...");
        search.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        padding(search,13,0,13,0);search.setBackground(shape(SECOND,12,true));
        box.addView(search,lp(-1,48));gap(box,13);
        HorizontalScrollView filterScroll=new HorizontalScrollView(activity);
        filterScroll.setHorizontalScrollBarEnabled(false);
        categoryLine=row();filterScroll.addView(categoryLine);
        box.addView(filterScroll);gap(box,12);
        ScrollView listScroll=new ScrollView(activity);listScroll.setFillViewport(false);
        listScroll.setVerticalScrollBarEnabled(false);
        exerciseList=col();listScroll.addView(exerciseList);
        box.addView(listScroll,lp(-1,390));gap(box,12);
        templateMode=label("",13,ACCENT,true);
        padding(templateMode,5,8,5,8);
        templateMode.setOnClickListener(v->{
            withPhases=!withPhases;
            activity.getPreferences(Context.MODE_PRIVATE).edit().putBoolean("exercise_insert_phases",withPhases).apply();
            updateModeLabel();
        });
        box.addView(templateMode);updateModeLabel();gap(box,8);
        TextView plus=label("＋  Ajouter mon exercice",15,BG,true);
        plus.setGravity(Gravity.CENTER);plus.setBackground(shape(ACCENT,14,false));
        box.addView(plus,lp(-1,48));
        plus.setOnClickListener(v->addCustomDialog());
        dialog=new AlertDialog.Builder(activity).setView(box).create();
        dialog.setOnShowListener(d->{
            Window window=dialog.getWindow();
            if(window!=null){
                window.setBackgroundDrawableResource(android.R.color.transparent);
                int width=activity.getResources().getDisplayMetrics().widthPixels-dp(22);
                window.setLayout(width,ViewGroup.LayoutParams.WRAP_CONTENT);
            }
        });
        search.addTextChangedListener(new TextWatcher(){
            @Override public void beforeTextChanged(CharSequence s,int st,int count,int after){}
            @Override public void onTextChanged(CharSequence s,int start,int before,int count){renderList();}
            @Override public void afterTextChanged(Editable e){}
        });
        renderCategories();renderList();dialog.show();
    }
    private void updateModeLabel(){
        templateMode.setText(withPhases?"☑  Ajouter aussi les phases « Montée en charge » / « En charge »"
            :"☐  Insérer le nom de l'exercice uniquement");
    }
    private void renderCategories(){
        categoryLine.removeAllViews();
        for(String c:ExerciseLibrary.CATEGORIES){
            boolean selected=c.equals(category);
            TextView tab=label(c,12,selected?BG:WHITE,true);
            padding(tab,12,0,12,0);tab.setGravity(Gravity.CENTER);
            tab.setBackground(shape(selected?ACCENT:SECOND,13,true));
            LinearLayout.LayoutParams p=lp(-2,37);p.rightMargin=dp(6);categoryLine.addView(tab,p);
            tab.setOnClickListener(v->{category=c;renderCategories();renderList();});
        }
    }
    private void renderList(){
        if(exerciseList==null||search==null)return;
        exerciseList.removeAllViews();
        String query=ExerciseLibrary.key(search.getText().toString());
        List<ExerciseLibrary.Exercise> exercises=library.all();
        int count=0;
        for(ExerciseLibrary.Exercise exercise:exercises){
            if(!query.isEmpty()&&!ExerciseLibrary.key(exercise.name).contains(query))continue;
            if(category.equals("Favoris")&&!library.isFavorite(exercise.name))continue;
            if(category.equals("Mes exercices")&&!exercise.custom)continue;
            if(!category.equals("Tous")&&!category.equals("Favoris")&&!category.equals("Mes exercices")
                &&!exercise.category.equals(category))continue;
            count++;
            LinearLayout item=row();padding(item,12,9,7,9);
            item.setBackground(shape(CARD,12,true));
            LinearLayout lines=col();lines.addView(label(exercise.name,14,WHITE,true));
            lines.addView(label(exercise.custom?"Personnel":exercise.category,11,MUTED,false));
            item.addView(lines,new LinearLayout.LayoutParams(0,-2,1));
            TextView star=label(library.isFavorite(exercise.name)?"★":"☆",23,
                library.isFavorite(exercise.name)?ACCENT:MUTED,false);
            star.setGravity(Gravity.CENTER);
            item.addView(star,lp(43,43));
            star.setOnClickListener(v->{library.toggleFavorite(exercise.name);renderList();});
            item.setOnClickListener(v->select(exercise.name));
            if(exercise.custom){
                item.setOnLongClickListener(v->{
                    new AlertDialog.Builder(activity)
                        .setTitle("Supprimer cet exercice ?")
                        .setMessage(exercise.name)
                        .setNegativeButton("Annuler",null)
                        .setPositiveButton("Supprimer",(d,w)->{library.removeCustom(exercise.name);renderList();})
                        .show();
                    return true;
                });
            }
            exerciseList.addView(item,lp(-1,-2));gap(exerciseList,7);
        }
        if(count==0){
            TextView empty=label("Aucun exercice trouvé. Tu peux ajouter le tien.",13,MUTED,false);
            padding(empty,8,22,8,22);exerciseList.addView(empty);
        }
    }
    private void select(String exerciseName){
        callback.insert(exerciseName,withPhases);
        if(dialog!=null)dialog.dismiss();
    }
    private void addCustomDialog(){
        EditText input=new EditText(activity);
        input.setSingleLine(true);input.setTextSize(16);
        input.setHint("Nom de l'exercice");
        input.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        LinearLayout frame=col();padding(frame,22,8,22,6);frame.addView(input,lp(-1,52));
        new AlertDialog.Builder(activity)
            .setTitle("Nouvel exercice")
            .setView(frame)
            .setNegativeButton("Annuler",null)
            .setPositiveButton("Ajouter",(d,w)->{
                String name=input.getText().toString().trim();
                if(library.addCustom(name)){select(name);}
                else activity.toast("Nom vide, trop long ou exercice déjà présent");
            }).show();
    }
}
