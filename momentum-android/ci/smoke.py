#!/usr/bin/env python3
"""Test smoke UI sur émulateur Android après compilation Gradle."""
import re, subprocess, time, unicodedata, xml.etree.ElementTree as ET

PKG="fr.momentum.sport.exercises"
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
    adb("shell","input","keyevent","4")  # clavier
    time.sleep(0.5)
    tap(find_text("Enregistrer la séance"))
    time.sleep(2);confirm_running()
    print("Enregistrement séance validé")
    print("Démarrage chronos",adb("shell","am","start","-W","-n",TIMER))
    time.sleep(2);confirm_running()
    find_text("Chronos")
    find_text("Tabata")
    print("Écran Chronos validé")
if __name__=="__main__":main()
