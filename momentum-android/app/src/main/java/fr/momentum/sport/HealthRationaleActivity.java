package fr.momentum.sport;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.Gravity;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.LinearLayout;

/** Notice de confidentialité affichée depuis Santé Connect. */
public final class HealthRationaleActivity extends Activity {
    @Override public void onCreate(Bundle saved){
        super.onCreate(saved);
        getWindow().setStatusBarColor(Color.rgb(12,17,28));
        LinearLayout content=new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        int px=Math.round(24*getResources().getDisplayMetrics().density);
        content.setPadding(px,px,px,px);
        content.setBackgroundColor(Color.rgb(12,17,28));
        TextView title=new TextView(this);
        title.setText("Momentum Sport · Santé Connect");
        title.setTextColor(Color.WHITE);title.setTextSize(21);
        title.setGravity(Gravity.CENTER_VERTICAL);
        content.addView(title);
        TextView message=new TextView(this);
        message.setText("\nPourquoi ces autorisations ?\n\n"+
            "Momentum Sport lit uniquement les séances d'exercice, les fréquences cardiaques, "+
            "les distances et les calories actives que Garmin Connect envoie à Santé Connect.\n\n"+
            "Ces données servent à créer des séances dans ton journal sportif et à en afficher "+
            "les mesures. Tu peux ensuite ajouter tes propres notes, charges et exercices.\n\n"+
            "Les données importées et tes notes restent stockées localement sur ton téléphone. "+
            "Momentum Sport ne possède pas de serveur, ne vend aucune donnée et ne transmet "+
            "pas ces informations à un service extérieur.\n\n"+
            "Aucune donnée n'est écrite dans Garmin Connect ni dans Santé Connect.\n\n"+
            "Tu peux retirer les autorisations à tout moment dans les réglages de Santé Connect. "+
            "Les séances déjà enregistrées dans Momentum Sport restent dans le carnet jusqu'à leur suppression "+
            "ou la désinstallation de l'application.\n\n"+
            "L'accès à Santé Connect fonctionne sur Android 14 ou plus.");
        message.setTextColor(Color.rgb(229,234,242));message.setTextSize(16);message.setLineSpacing(4,1);
        content.addView(message);
        ScrollView sc=new ScrollView(this);sc.addView(content);
        setContentView(sc);
    }
}