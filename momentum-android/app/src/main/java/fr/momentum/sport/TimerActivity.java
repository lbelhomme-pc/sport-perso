package fr.momentum.sport;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.text.InputType;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import java.util.ArrayList;
import java.util.Locale;

/**
 * Six chronos d'entraînement, entièrement hors-ligne.
 * Android elapsedRealtime : le temps reste correct après la mise en veille.
 */
public final class TimerActivity extends Activity {
    static final int BG=Color.rgb(12,17,28), CARD=Color.rgb(22,30,44),
        SECOND=Color.rgb(30,40,57), LINE=Color.rgb(42,53,69),
        MUTED=Color.rgb(151,162,182), WHITE=Color.rgb(242,246,252),
        ACCENT=Color.rgb(164,240,197), NAV=Color.rgb(15,22,34);
    static final String[] MODES={"Chronomètre","Minuteur","Tabata","AMRAP","EMOM","Intervalles"};
    // Chaque mode possède ses propres réglages : A, B et C.
    // 0 chrono : aucun. 1 minuteur : minutes, secondes.
    // 2 tabata : effort (s), repos (s), tours.
    // 3 AMRAP : minutes. 4 EMOM : secondes par tour, tours.
    // 5 intervalles : effort (s), repos (s), répétitions.
    int mode=0, runningState=0, amrapRounds=0, lastPhase=-1; // 0 prêt, 1 lancé, 2 pause, 3 terminé
    final int[][] settings={{0,0,0},{5,0,0},{20,10,8},{12,0,0},{60,10,0},{45,15,10}};
    long elapsedBefore=0, startedAt=0;
    final Handler handler=new Handler(Looper.getMainLooper());
    final Runnable tick=new Runnable(){@Override public void run(){
        if(runningState!=1)return;
        updateClock();
        if(runningState==1)handler.postDelayed(this,100);
    }};
    TextView elapsedLabel,phaseLabel,cyclesLabel,primary,roundsLabel;
    EditText[] fields=new EditText[3];
    LinearLayout modeRow,settingsPanel,roundsPanel;
    ToneGenerator tone;
    @Override public void onCreate(Bundle state){
        super.onCreate(state);
        getWindow().setStatusBarColor(BG);getWindow().setNavigationBarColor(BG);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        if(state!=null){
            mode=state.getInt("mode",0);runningState=state.getInt("runningState",0);
            elapsedBefore=state.getLong("elapsedBefore",0);startedAt=state.getLong("startedAt",0);
            amrapRounds=state.getInt("amrapRounds",0);
            for(int i=0;i<settings.length;i++)for(int j=0;j<3;j++)
                settings[i][j]=state.getInt("cfg"+i+"_"+j,settings[i][j]);
        }
        build();
    }
    @Override public void onStart(){super.onStart();updateClock();if(runningState==1)schedule();}
    @Override public void onStop(){handler.removeCallbacks(tick);super.onStop();}
    @Override protected void onDestroy(){handler.removeCallbacks(tick);
        if(tone!=null){tone.release();tone=null;}super.onDestroy();}
    @Override public void onSaveInstanceState(Bundle out){
        readSettings();
        out.putInt("mode",mode);out.putInt("runningState",runningState);
        out.putLong("elapsedBefore",elapsedBefore);out.putLong("startedAt",startedAt);
        out.putInt("amrapRounds",amrapRounds);
        for(int i=0;i<settings.length;i++)for(int j=0;j<3;j++)
            out.putInt("cfg"+i+"_"+j,settings[i][j]);
        super.onSaveInstanceState(out);
    }
    int dp(float v){return Math.round(v*getResources().getDisplayMetrics().density);}
    LinearLayout column(){LinearLayout x=new LinearLayout(this);x.setOrientation(LinearLayout.VERTICAL);return x;}
    LinearLayout row(){LinearLayout x=new LinearLayout(this);x.setOrientation(LinearLayout.HORIZONTAL);x.setGravity(Gravity.CENTER_VERTICAL);return x;}
    LinearLayout.LayoutParams lp(int w,int h){return new LinearLayout.LayoutParams(w<0?w:dp(w),h<0?h:dp(h));}
    void pad(View x,int l,int t,int r,int b){x.setPadding(dp(l),dp(t),dp(r),dp(b));}
    void space(LinearLayout x,int height){x.addView(new View(this),lp(1,height));}
    GradientDrawable shape(int color,int radius){
        GradientDrawable x=new GradientDrawable();x.setColor(color);x.setCornerRadius(dp(radius));return x;}
    GradientDrawable outline(int color,int radius){
        GradientDrawable x=shape(color,radius);x.setStroke(dp(1),LINE);return x;}
    TextView text(String content,int size,int color,boolean bold){
        TextView x=new TextView(this);x.setText(content);x.setTextColor(color);x.setTextSize(TypedValue.COMPLEX_UNIT_SP,size);
        x.setTypeface(Typeface.create("sans-serif",bold?Typeface.BOLD:Typeface.NORMAL));x.setGravity(Gravity.CENTER_VERTICAL);return x;
    }
    TextView action(String label,int foreground,int background,boolean strong,View.OnClickListener callback){
        TextView x=text(label,15,foreground,strong);x.setGravity(Gravity.CENTER);
        x.setBackground(shape(background,16));x.setOnClickListener(callback);
        x.setClickable(true);x.setFocusable(true);return x;
    }
    LinearLayout panel(){LinearLayout x=column();pad(x,18,18,18,18);x.setBackground(outline(CARD,20));return x;}
    void build(){
        LinearLayout shell=column();shell.setBackgroundColor(BG);setContentView(shell);
        LinearLayout heading=row();pad(heading,14,8,20,6);
        TextView back=text("‹",34,WHITE,false);back.setGravity(Gravity.CENTER);
        back.setContentDescription("Retour au journal");heading.addView(back,lp(50,52));
        back.setOnClickListener(v->finish());
        TextView title=text("Chronos",22,WHITE,true);
        heading.addView(title,new LinearLayout.LayoutParams(0,dp(52),1));
        shell.addView(heading);
        LinearLayout page=column();pad(page,20,12,20,36);
        page.addView(text("ENTRAÎNEMENT",11,ACCENT,true));space(page,11);
        HorizontalScrollView scrollModes=new HorizontalScrollView(this);
        scrollModes.setHorizontalScrollBarEnabled(false);
        modeRow=row();scrollModes.addView(modeRow);page.addView(scrollModes);
        buildModeChips();space(page,25);
        LinearLayout display=panel();pad(display,16,25,16,26);
        elapsedLabel=text("00:00",48,WHITE,true);elapsedLabel.setGravity(Gravity.CENTER);
        display.addView(elapsedLabel,lp(-1,75));
        phaseLabel=text("Prêt",17,ACCENT,true);phaseLabel.setGravity(Gravity.CENTER);
        display.addView(phaseLabel,lp(-1,34));space(display,4);
        cyclesLabel=text("",13,MUTED,false);cyclesLabel.setGravity(Gravity.CENTER);
        display.addView(cyclesLabel,lp(-1,30));
        page.addView(display);space(page,20);
        settingsPanel=column();page.addView(settingsPanel);
        roundsPanel=column();page.addView(roundsPanel);
        buildSettings();
        ScrollView scroll=new ScrollView(this);scroll.setFillViewport(false);
        scroll.setVerticalScrollBarEnabled(false);
        scroll.addView(page,new ScrollView.LayoutParams(-1,-2));
        shell.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
        LinearLayout footer=column();pad(footer,20,12,20,14);footer.setBackgroundColor(NAV);
        LinearLayout actions=row();
        primary=action("Démarrer  ▶",BG,ACCENT,true,v->toggle());
        actions.addView(primary,new LinearLayout.LayoutParams(0,dp(56),2));
        TextView reset=action("↻  RAZ",WHITE,SECOND,true,v->resetWithConfirmation());
        LinearLayout.LayoutParams rp=new LinearLayout.LayoutParams(0,dp(56),1);rp.leftMargin=dp(9);
        actions.addView(reset,rp);footer.addView(actions);
        shell.addView(footer);
        updateClock();
    }
    void buildModeChips(){
        modeRow.removeAllViews();
        for(int i=0;i<MODES.length;i++){
            final int selected=i;
            boolean active=i==mode;
            TextView chip=text(MODES[i],13,active?BG:WHITE,true);chip.setGravity(Gravity.CENTER);
            pad(chip,15,0,15,0);
            chip.setBackground(shape(active?ACCENT:SECOND,14));
            LinearLayout.LayoutParams p=lp(-2,44);p.rightMargin=dp(8);
            modeRow.addView(chip,p);
            chip.setOnClickListener(v->switchMode(selected));
        }
    }
    void switchMode(int selected){
        if(selected==mode)return;
        if(runningState==1||runningState==2){
            new AlertDialog.Builder(this).setTitle("Changer de chrono ?")
                .setMessage("Le chrono en cours sera remis à zéro.")
                .setNegativeButton("Annuler",null)
                .setPositiveButton("Changer",(d,w)->changeMode(selected)).show();
        }else changeMode(selected);
    }
    void changeMode(int selected){
        readSettings();resetInternal();mode=selected;buildModeChips();buildSettings();updateClock();
    }
    void buildSettings(){
        settingsPanel.removeAllViews();roundsPanel.removeAllViews();
        fields=new EditText[3];
        String[] labels,units;
        if(mode==1){labels=new String[]{"Minutes","Secondes"};units=new String[]{"min","s"};}
        else if(mode==2){labels=new String[]{"Effort","Repos","Tours"};units=new String[]{"s","s","×"};}
        else if(mode==3){labels=new String[]{"Durée"};units=new String[]{"min"};}
        else if(mode==4){labels=new String[]{"Intervalle","Cycles"};units=new String[]{"s","×"};}
        else if(mode==5){labels=new String[]{"Effort","Repos","Répétitions"};units=new String[]{"s","s","×"};}
        else{labels=new String[0];units=new String[0];}
        if(labels.length>0){
            settingsPanel.addView(text("RÉGLAGES",11,MUTED,true));space(settingsPanel,10);
            LinearLayout options=row();options.setGravity(Gravity.TOP);
            for(int i=0;i<labels.length;i++){
                final int ix=i;
                LinearLayout block=column();
                block.addView(text(labels[i]+" ("+units[i]+")",12,MUTED,true));space(block,7);
                EditText input=new EditText(this);input.setSingleLine(true);
                input.setTextColor(WHITE);input.setTextSize(17);
                input.setInputType(InputType.TYPE_CLASS_NUMBER);
                input.setText(String.valueOf(settings[mode][ix]));
                input.setSelectAllOnFocus(true);
                pad(input,12,0,6,0);input.setBackground(outline(SECOND,12));
                block.addView(input,lp(-1,48));fields[i]=input;
                LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(0,-2,1);
                p.rightMargin=dp(i<labels.length-1?9:0);
                options.addView(block,p);
            }
            settingsPanel.addView(options);space(settingsPanel,13);
            TextView help=text(modeHint(),12,MUTED,false);settingsPanel.addView(help);space(settingsPanel,17);
        }else{
            settingsPanel.addView(text("Chronomètre libre, sans limite de durée.",13,MUTED,false));space(settingsPanel,17);
        }
        if(mode==3){
            LinearLayout p=panel();
            p.addView(text("Tours effectués",13,MUTED,true));space(p,11);
            LinearLayout r=row();
            TextView minus=action("−",WHITE,SECOND,true,v->{amrapRounds=Math.max(0,amrapRounds-1);refreshRound();});
            r.addView(minus,lp(58,48));
            roundsLabel=text(String.valueOf(amrapRounds),28,WHITE,true);roundsLabel.setGravity(Gravity.CENTER);
            r.addView(roundsLabel,new LinearLayout.LayoutParams(0,dp(48),1));
            TextView plus=action("+ 1 tour",BG,ACCENT,true,v->{amrapRounds++;refreshRound();});
            r.addView(plus,lp(110,48));p.addView(r);roundsPanel.addView(p);
        }else roundsLabel=null;
        setConfigEnabled(runningState==0||runningState==3);
    }
    String modeHint(){
        switch(mode){
            case 1:return "Le signal retentit à zéro.";
            case 2:return "Effort et repos alternent sur chaque tour.";
            case 3:return "Ajoute un tour à chaque passage terminé.";
            case 4:return "Un signal marque le début de chaque cycle.";
            case 5:return "Récupération entre les répétitions (pas après la dernière).";
            default:return "";
        }
    }
    void refreshRound(){if(roundsLabel!=null)roundsLabel.setText(String.valueOf(amrapRounds));}
    void setConfigEnabled(boolean enabled){
        for(EditText e:fields)if(e!=null){e.setEnabled(enabled);e.setAlpha(enabled?1f:.65f);}
    }
    int parsed(EditText e,int defaultValue,int min,int max){
        if(e==null)return defaultValue;
        try{return Math.max(min,Math.min(max,Integer.parseInt(e.getText().toString().trim())));}
        catch(Exception ex){return defaultValue;}
    }
    void readSettings(){
        if(fields[0]==null)return;
        int[] val=settings[mode];
        if(mode==1){val[0]=parsed(fields[0],5,0,600);val[1]=parsed(fields[1],0,0,59);}
        else if(mode==2){val[0]=parsed(fields[0],20,1,3600);val[1]=parsed(fields[1],10,0,3600);val[2]=parsed(fields[2],8,1,200);}
        else if(mode==3){val[0]=parsed(fields[0],12,1,600);}
        else if(mode==4){val[0]=parsed(fields[0],60,1,3600);val[1]=parsed(fields[1],10,1,200);}
        else if(mode==5){val[0]=parsed(fields[0],45,1,3600);val[1]=parsed(fields[1],15,0,3600);val[2]=parsed(fields[2],10,1,200);}
        if(mode==1 && val[0]==0&&val[1]==0)val[1]=1;
    }
    long durationMs(){
        int[] c=settings[mode];
        switch(mode){
            case 1:return (c[0]*60L+c[1])*1000L;
            case 2:return (long)(c[0]+c[1])*c[2]*1000L;
            case 3:return c[0]*60000L;
            case 4:return (long)c[0]*c[1]*1000L;
            case 5:return ((long)c[0]*c[2]+(long)c[1]*Math.max(0,c[2]-1))*1000L;
            default:return Long.MAX_VALUE;
        }
    }
    long elapsedMs(){
        return elapsedBefore+(runningState==1?Math.max(0,SystemClock.elapsedRealtime()-startedAt):0);
    }
    void schedule(){handler.removeCallbacks(tick);handler.post(tick);}
    void toggle(){
        if(runningState==1){
            elapsedBefore=elapsedMs();runningState=2;handler.removeCallbacks(tick);
            setConfigEnabled(false);updateClock();return;
        }
        if(runningState==0||runningState==3){
            readSettings();elapsedBefore=0;amrapRounds=0;refreshRound();lastPhase=-1;
        }
        runningState=1;startedAt=SystemClock.elapsedRealtime();
        setConfigEnabled(false);schedule();updateClock();
    }
    void resetWithConfirmation(){
        if(runningState==1){
            new AlertDialog.Builder(this).setTitle("Réinitialiser le chrono ?")
                .setNegativeButton("Annuler",null)
                .setPositiveButton("Réinitialiser",(d,w)->reset()).show();
        }else reset();
    }
    void reset(){resetInternal();setConfigEnabled(true);updateClock();}
    void resetInternal(){
        handler.removeCallbacks(tick);runningState=0;elapsedBefore=0;startedAt=0;
        lastPhase=-1;amrapRounds=0;refreshRound();
    }
    String clock(long millis){
        long sec=Math.max(0,millis)/1000;long h=sec/3600;
        if(h>0)return String.format(Locale.FRANCE,"%02d:%02d:%02d",h,(sec/60)%60,sec%60);
        return String.format(Locale.FRANCE,"%02d:%02d",sec/60,sec%60);
    }
    void beep(){
        try{
            if(tone==null)tone=new ToneGenerator(AudioManager.STREAM_NOTIFICATION,75);
            tone.startTone(ToneGenerator.TONE_PROP_BEEP,250);
        }catch(RuntimeException ignored){}
    }
    void updateClock(){
        if(elapsedLabel==null)return;
        long elapsed=elapsedMs(), total=durationMs();
        if(mode!=0 && elapsed>=total && (runningState==1||runningState==2)){
            elapsedBefore=total;runningState=3;handler.removeCallbacks(tick);
            setConfigEnabled(true);beep();elapsed=total;
        }
        elapsedLabel.setText(clock(mode==1?Math.max(0,total-elapsed):elapsed));
        String phase="Prêt", detail="";
        if(runningState==3){phase="Terminé";detail=mode==3?amrapRounds+" tours réalisés":"Séance terminée";}
        else {
            long sec=elapsed/1000L;
            int[] c=settings[mode];
            if(mode==0){phase="Chronomètre";detail="Temps écoulé";}
            if(mode==1){phase="Compte à rebours";detail="Temps restant";}
            if(mode==2){
                long cycle=(long)c[0]+c[1],round=sec/cycle+1,inner=sec%cycle;
                phase=inner<c[0]?"Effort":"Repos";
                detail="Tour "+Math.min(round,c[2])+" / "+c[2]+" · "+clock(((inner<c[0])?c[0]-inner:cycle-inner)*1000L)+" restants";
            }
            if(mode==3){phase="AMRAP";detail=amrapRounds+" tours · "+clock(Math.max(0,total-elapsed))+" restants";}
            if(mode==4){
                long index=sec/c[0]+1;
                phase="EMOM";detail="Cycle "+Math.min(index,c[1])+" / "+c[1]+" · "+clock((c[0]-(sec%c[0]))*1000L)+" restants";
            }
            if(mode==5){
                long cycle=(long)c[0]+c[1],index=sec/cycle+1,inner=sec%cycle;
                phase=inner<c[0]?"Effort":"Repos";
                detail="Répétition "+Math.min(index,c[2])+" / "+c[2]+" · "+clock(((inner<c[0])?c[0]-inner:cycle-inner)*1000L)+" restants";
            }
            if(runningState==2)phase+=" · Pause";
            if(runningState==0)phase="Prêt · "+MODES[mode];
        }
        phaseLabel.setText(phase);cyclesLabel.setText(detail);
        if(primary!=null){
            primary.setText(runningState==1?"Pause  ‖":runningState==2?"Reprendre  ▶":runningState==3?"Recommencer  ▶":"Démarrer  ▶");
        }
        if(runningState==1 && mode>=2){
            int phaseIndex=0;
            int[] c=settings[mode];long ms=elapsed;
            if(mode==2){long cycle=(long)(c[0]+c[1])*1000L;phaseIndex=(int)(ms/cycle)*2+(ms%cycle<c[0]*1000L?0:1);}
            if(mode==4)phaseIndex=(int)(ms/(c[0]*1000L));
            if(mode==5){long cycle=(long)(c[0]+c[1])*1000L;phaseIndex=(int)(ms/cycle)*2+(ms%cycle<c[0]*1000L?0:1);}
            if(lastPhase>=0 && phaseIndex!=lastPhase)beep();
            lastPhase=phaseIndex;
        }
    }
    @Override public void onBackPressed(){finish();}
}