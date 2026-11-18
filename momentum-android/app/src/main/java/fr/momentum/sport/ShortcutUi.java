package fr.momentum.sport;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Color;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import java.util.List;
import java.util.function.Consumer;

/** Interface légère des raccourcis personnalisables sans modifier la note en cours. */
final class ShortcutUi {
    private final MainActivity activity;
    private final ShortcutPresets presets;
    private final Consumer<String> insert;
    private LinearLayout target;
    private AlertDialog manager;
    ShortcutUi(MainActivity activity,ShortcutPresets presets,Consumer<String> insert){
        this.activity=activity;this.presets=presets;this.insert=insert;
    }
    int dp(int px){return activity.dp(px);}
    LinearLayout.LayoutParams lp(int w,int h){return activity.lp(w,h);}
    void addGap(LinearLayout v,int gap){activity.space(v,gap);}
    TextView badge(String text,int fg){
        return activity.badge(text,MainActivity.SECOND,fg);
    }
    void attach(LinearLayout container){target=container;render();}
    void render(){
        if(target==null)return;
        target.removeAllViews();
        group(ShortcutPresets.STRUCTURE,"STRUCTURES");
        addGap(target,13);
        group(ShortcutPresets.DETAIL,"DÉTAILS");
    }
    void group(String group,String title){
        LinearLayout row=activity.row();
        TextView label=activity.text(title,11,MainActivity.MUTED,true);
        row.addView(label,new LinearLayout.LayoutParams(0,-2,1));
        TextView plus=badge("＋ Ajouter",MainActivity.ACCENT);
        row.addView(plus);plus.setOnClickListener(v->edit(group,null));
        TextView manage=badge("Gérer",MainActivity.WHITE);
        LinearLayout.LayoutParams p=lp(-2,-2);p.leftMargin=dp(7);row.addView(manage,p);
        manage.setOnClickListener(v->manage(group));
        target.addView(row);addGap(target,9);
        List<ShortcutPresets.Preset> entries=presets.list(group,false);
        if(entries.isEmpty()){
            activity.hint(target,"Aucun raccourci. Appuie sur « Ajouter ».");
            return;
        }
        HorizontalScrollView scroll=new HorizontalScrollView(activity);
        scroll.setHorizontalScrollBarEnabled(false);
        LinearLayout chips=activity.row();activity.pad(chips,0,0,4,0);
        for(ShortcutPresets.Preset item:entries){
            TextView chip=activity.text(item.label,12,MainActivity.WHITE,true);
            activity.pad(chip,13,0,13,0);chip.setGravity(Gravity.CENTER);
            chip.setBackground(activity.outlined(MainActivity.SECOND,13,MainActivity.LINE));
            LinearLayout.LayoutParams chipParams=lp(-2,40);chipParams.rightMargin=dp(7);
            chips.addView(chip,chipParams);
            chip.setOnClickListener(v->insert.accept(item.fragment()));
            chip.setOnLongClickListener(v->{
                if(item.builtIn)confirmRemove(item,false);
                else edit(group,item);
                return true;
            });
        }
        scroll.addView(chips);target.addView(scroll);
    }
    void edit(String group, ShortcutPresets.Preset original){
        LinearLayout content=activity.column();activity.pad(content,20,12,20,10);
        content.addView(activity.text("Nom du raccourci",12,MainActivity.MUTED,true));
        addGap(content,8);
        EditText input=new EditText(activity);
        input.setTextColor(MainActivity.WHITE);input.setHintTextColor(MainActivity.MUTED);
        input.setSingleLine(true);input.setTextSize(16);input.setHint("Ex. Travail technique");
        input.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        input.setText(original==null?"":original.label);
        activity.pad(input,12,0,12,0);
        input.setBackground(activity.outlined(MainActivity.SECOND,12,MainActivity.LINE));
        content.addView(input,lp(-1,50));addGap(content,16);
        content.addView(activity.text("Format du texte à insérer",12,MainActivity.MUTED,true));
        addGap(content,7);
        Spinner format=new Spinner(activity);
        ArrayAdapter<String> adapter=new ArrayAdapter<>(activity,android.R.layout.simple_spinner_item,ShortcutPresets.FORMATS);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        format.setAdapter(adapter);
        format.setBackground(activity.outlined(MainActivity.SECOND,12,MainActivity.LINE));
        int defaultFormat=group.equals(ShortcutPresets.STRUCTURE)?ShortcutPresets.LEVEL_1:ShortcutPresets.LEVEL_2;
        format.setSelection(original==null?defaultFormat:original.format);
        content.addView(format,lp(-1,50));
        addGap(content,10);
        activity.hint(content,"Le nouveau raccourci s'ajoute sans modifier tes notes.");
        AlertDialog dlg=new AlertDialog.Builder(activity)
            .setTitle(original==null?"Nouveau raccourci":"Modifier ce raccourci")
            .setView(content)
            .setNegativeButton("Annuler",null)
            .setPositiveButton("Enregistrer",null).create();
        dlg.setOnShowListener(d->dlg.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v->{
            String result=presets.upsert(original==null?null:original.id,group,
                input.getText().toString(),format.getSelectedItemPosition());
            if(result!=null){activity.toast(result);return;}
            dlg.dismiss();
            render();
            activity.toast("Raccourci enregistré");
            if(manager!=null&&manager.isShowing())manage(group);
        }));
        dlg.show();
    }
    void confirmRemove(ShortcutPresets.Preset item,boolean reopen){
        String label=item.builtIn?"Masquer":"Effacer";
        new AlertDialog.Builder(activity)
            .setTitle(label+" ce raccourci ?")
            .setMessage("« "+item.label+" » sera retiré des boutons. Les séances enregistrées ne changent pas.")
            .setNegativeButton("Annuler",null)
            .setPositiveButton(label,(d,w)->{
                presets.removeOrHide(item);
                render();
                if(reopen)manage(item.group);
            }).show();
    }
    void manage(String group){
        if(manager!=null&&manager.isShowing())manager.dismiss();
        LinearLayout content=activity.column();activity.pad(content,15,8,15,10);
        content.addView(activity.text("Ajoute, modifie ou masque tes raccourcis.",12,MainActivity.MUTED,false));
        addGap(content,13);
        for(ShortcutPresets.Preset item:presets.list(group,true)){
            LinearLayout entry=activity.row();activity.pad(entry,8,8,7,8);
            entry.setBackground(activity.outlined(MainActivity.CARD,12,MainActivity.LINE));
            LinearLayout left=activity.column();
            left.addView(activity.text(item.label+(item.hidden?" (masqué)":""),12,
                item.hidden?MainActivity.MUTED:MainActivity.WHITE,true));
            left.addView(activity.text(item.fragment(),11,MainActivity.MUTED,false));
            entry.addView(left,new LinearLayout.LayoutParams(0,-2,1));
            if(!item.builtIn){
                TextView rename=badge("Modifier",MainActivity.ACCENT);
                entry.addView(rename);rename.setOnClickListener(v->edit(group,item));
            }
            TextView remove=badge(item.hidden?"Afficher":item.builtIn?"Masquer":"Effacer",
                item.hidden?MainActivity.ACCENT:Color.rgb(255,172,178));
            LinearLayout.LayoutParams pad=lp(-2,-2);pad.leftMargin=dp(5);
            entry.addView(remove,pad);
            remove.setOnClickListener(v->{
                if(item.hidden){presets.reveal(item.id);render();manage(group);}
                else confirmRemove(item,true);
            });
            content.addView(entry,lp(-1,-2));addGap(content,7);
        }
        TextView restore=badge("↺ Restaurer les raccourcis d'origine",MainActivity.ACCENT);
        content.addView(restore);
        restore.setOnClickListener(v->{presets.restoreDefaults(group);render();manage(group);});
        ScrollView list=new ScrollView(activity);
        list.setFillViewport(false);list.addView(content);
        manager=new AlertDialog.Builder(activity)
            .setTitle(group.equals(ShortcutPresets.STRUCTURE)?"Gérer les structures":"Gérer les détails")
            .setView(list)
            .setNeutralButton("＋ Ajouter",(d,w)->edit(group,null))
            .setPositiveButton("Fermer",null).create();
        manager.show();
    }
}
