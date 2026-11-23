#!/usr/bin/env python3
"""Test smoke UI sur émulateur Android après compilation Gradle."""
import re, subprocess, time, unicodedata, xml.etree.ElementTree as ET

PKG="fr.momentum.sport.garmin151"
COMPONENT=PKG+"/fr.momentum.sport.MainActivity"
TIMER=PKG+"/fr.momentum.sport.TimerActivity"

def run(*args, check=True):
    p=subprocess.run(list(args),capture_output=True,text=True,timeout=75)
    if check and p.returncode: raise AssertionError(f"Commande échouée: {args}\n{p.stdout}\n{p.stderr}")
    return p.stdout.strip()

def adb(*args, check=True): return run("adb", *args,check=check)
def normalize(s):
    return unicodedata.normalize("NFD",s.lower()).encode("ascii","ignore").decode()

def xml_nodes():
    for retry in range(6):
        try:
            adb("shell","uiautomator","dump","/sdcard/window.xml")
            xml=adb("shell","cat","/sdcard/window.xml")
            root=ET.fromstring(xml[xml.index("<?xml"):])
            return list(root.iter("node"))
        except Exception as e:
            print("Dump temporairement indisponible :",repr(e))
            time.sleep(2)
    raise AssertionError("Impossible de lire l'écran Android")

def tap(node):
    bounds=node.attrib.get("bounds","")
    m=re.fullmatch(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]",bounds)
    if not m:raise AssertionError(f"Invalid bounds: {bounds}")
    x1,y1,x2,y2=map(int,m.groups())
    adb("shell","input","tap",str((x1+x2)//2),str((y1+y2)//2))
    time.sleep(0.8)

def find_text(term,exact=False,timeout=16):
    needle=normalize(term);until=time.time()+timeout
    while time.time()<until:
        nodes=xml_nodes()
        for n in nodes:
            label=normalize(n.attrib.get("text","")+" "+n.attrib.get("content-desc",""))
            if needle.strip()==label.strip() if exact else needle in label:
                return n
        time.sleep(1)
    snapshot=" | ".join(n.attrib.get("text","") for n in xml_nodes() if n.attrib.get("text",""))
    raise AssertionError("Élément absent : "+term+" ; écran : "+snapshot[:1500])

def confirm_running():
    pid=adb("shell","pidof",PKG,check=False)
    if not pid: raise AssertionError("Processus de Momentum Sport absent (plantage au démarrage)")
    errors=adb("logcat","-d","-s","AndroidRuntime:E",check=False)
    if "FATAL EXCEPTION" in errors and PKG in errors:
        raise AssertionError("Exception fatale Android détectée:\n"+errors[-5000:])
    print("Processus actif :",pid)

def main():
    path="momentum-android/app/build/outputs/apk/debug/app-debug.apk"
    print("Installation", adb("install","-r",path))
    print("Démarrage",adb("shell","am","start","-W","-n",COMPONENT))
    time.sleep(3);confirm_running()
    tap(find_text("＋  SÉANCE",exact=True))
    find_text("Nouvelle séance")
    print("Éditeur ouvert")
    # Ajout, insertion et suppression d'un raccourci de structure.
    tap(find_text("＋ Ajouter",exact=True))
    find_text("Nouveau raccourci")
    inputs=[n for n in xml_nodes() if n.attrib.get("class")=="android.widget.EditText"]
    if not inputs:raise AssertionError("Champ de nom absent")
    tap(inputs[0]);adb("shell","input","text","Tempo");adb("shell","input","keyevent","4")
    tap(find_text("Enregistrer",exact=True))
    tap(find_text("Tempo",exact=True))
    notes=" | ".join(n.attrib.get("text","") for n in xml_nodes())
    if "- Tempo -" not in notes:raise AssertionError("Insertion de structure personnalisée absente")
    print("Insertion du raccourci personnalisé validée")
    adb("shell","input","keyevent","4")
    if any("Quitter l'édition" in n.attrib.get("text","") for n in xml_nodes()):
        tap(find_text("CONTINUER",exact=True))
    tap(find_text("Gérer",exact=True))
    find_text("Gérer les structures")
    tap(find_text("Effacer",exact=True))
    tap(find_text("Effacer",exact=True))
    find_text("Gérer les structures")
    tap(find_text("Fermer",exact=True))
    print("Suppression de raccourci validée")
    tap(find_text("Exercice"))
    print("Sélecteur ouvert :",find_text("Choisir un exercice").attrib.get("text"))
    nodes=xml_nodes()
    search=next((n for n in nodes if n.attrib.get("class")=="android.widget.EditText"),None)
    if search is None:raise AssertionError("Recherche absente")
    tap(search)
    adb("shell","input","text","developpe%scouche")
    time.sleep(1)
    tap(find_text("Développé couché aux haltères",timeout=18))
    time.sleep(1)
    nodes=xml_nodes()
    text_values=" ".join(n.attrib.get("text","") for n in nodes)
    if "Développé couché aux haltères" not in text_values:
        raise AssertionError("L'exercice sélectionné n'a pas été inséré dans la note")
    print("Insertion exercice validée")
    # Cas de régression : 20 x 11 kg ne signifie PAS 20 séries x 1 rep x 1 kg.
    adb("shell","input","text","20x11kg")
    adb("shell","input","keyevent","4")  # clavier
    time.sleep(0.5)
    tap(find_text("Enregistrer la séance"))
    time.sleep(2);confirm_running()
    print("Enregistrement séance validé")
    for attempt in range(5):
        nodes=xml_nodes()
        cards=" | ".join(n.attrib.get("text","") for n in nodes)
        if "20×1" in cards or "20x1 · 1 kg" in cards or "Volume saisi" in cards:
            raise AssertionError("Fausse métrique de musculation affichée : "+cards[:1600])
        exercise=next((n for n in nodes if "Développé couché aux haltères" in n.attrib.get("text","")),None)
        if exercise is not None:
            tap(exercise)
            break
        adb("shell","input","swipe","350","745","350","255","350")
        time.sleep(0.5)
    else:
        raise AssertionError("Aperçu de séance introuvable après défilement")
    find_text("Modifier la séance")
    stored=" | ".join(n.attrib.get("text","") for n in xml_nodes())
    if "20x11kg" not in stored:
        raise AssertionError("Texte de la séance non conservé : "+stored[:1500])
    print("Régression 20x11kg validée : note conservée sans fausse série")
    tap(find_text("Enregistrer les modifications"))
    tap(find_text("Chronos"))
    time.sleep(2);confirm_running()
    find_text("Tabata")
    find_text("Minuteur")
    print("Écran Chronos validé via la navigation")
    adb("shell","input","keyevent","4")
    # La création manuelle doit rester accessible même si Santé Connect ne synchronise rien.
    tap(find_text("Saisir une séance sans synchronisation"))
    find_text("Nouvelle séance")
    find_text("HEURE DE DÉBUT")
    find_text("HYROX")
    print("Saisie manuelle et heure de début accessibles")
    tap(find_text("Enregistrer la séance"))
    find_text("Garmin Connect")
    sdk=int(adb("shell","getprop","ro.build.version.sdk"))
    if sdk>=34:
        find_text("Garmin Connect")
        find_text("Synchroniser Garmin")
        print("Bouton Garmin présent sur Android",sdk)
        tap(find_text("Synchroniser Garmin"))
        time.sleep(2)
        confirm_running()
        print("Demande d'autorisation / diagnostic Santé Connect sans plantage")
    else:
        find_text("Garmin Connect")
        find_text("Android 14")
        print("Mode compatible ancien Android : carnet utilisable sans Garmin")


if __name__=="__main__":main()
