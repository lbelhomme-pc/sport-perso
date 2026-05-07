import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, HeartPulse, Target } from "lucide-react";
import type { AppExperienceMode, Settings, SportType, TargetEventType, UserSportLevel, WeekdayKey } from "../../types";
import { toISODate } from "../../utils/dates";

type OnboardingPromptProps = {
  settings: Settings;
  onComplete: (settings: Settings) => void;
};

const goalOptions: Array<{ id: AppExperienceMode; label: string; description: string; sports: SportType[]; eventType: TargetEventType }> = [
  {
    id: "competition",
    label: "Préparer HYROX",
    description: "Planifier une date cible, les séances clés et les adaptations fatigue.",
    sports: ["hyrox", "strength", "run", "badminton", "recovery"],
    eventType: "hyrox"
  },
  {
    id: "weight-loss",
    label: "Perdre du poids",
    description: "Suivre activité, nutrition et régularité sans pression absurde.",
    sports: ["strength", "run", "recovery", "free"],
    eventType: "none"
  },
  {
    id: "fitness",
    label: "Reprendre le sport",
    description: "Construire une routine réaliste avec des séances courtes et progressives.",
    sports: ["strength", "mobility", "recovery", "free"],
    eventType: "none"
  },
  {
    id: "muscle-gain",
    label: "Progresser en musculation",
    description: "Suivre charges, volume, protéines et récupération.",
    sports: ["strength", "mobility", "recovery"],
    eventType: "none"
  },
  {
    id: "racket",
    label: "Raquette + condition physique",
    description: "Badminton, appuis, explosivité et cardio intermittent.",
    sports: ["badminton", "racket", "strength", "mobility", "recovery"],
    eventType: "none"
  }
];

const levelOptions: Array<{ id: UserSportLevel; label: string }> = [
  { id: "beginner", label: "Débutant" },
  { id: "intermediate", label: "Intermédiaire" },
  { id: "advanced", label: "Confirmé" }
];

const dayOptions: Array<{ id: WeekdayKey; label: string }> = [
  { id: "monday", label: "Lun" },
  { id: "tuesday", label: "Mar" },
  { id: "wednesday", label: "Mer" },
  { id: "thursday", label: "Jeu" },
  { id: "friday", label: "Ven" },
  { id: "saturday", label: "Sam" },
  { id: "sunday", label: "Dim" }
];

function buildProgramTargetDate(programLengthWeeks: number) {
  const date = new Date();
  date.setDate(date.getDate() + programLengthWeeks * 7);
  return toISODate(date);
}

export function OnboardingPrompt({ settings, onComplete }: OnboardingPromptProps) {
  const initialGoal = settings.appMode ?? "competition";
  const [goal, setGoal] = useState<AppExperienceMode>(initialGoal);
  const [level, setLevel] = useState<UserSportLevel>(settings.sportLevel ?? "intermediate");
  const [availableDays, setAvailableDays] = useState<WeekdayKey[]>(
    settings.availableDays?.length ? settings.availableDays : ["tuesday", "wednesday", "thursday", "friday", "saturday"]
  );
  const [maxDuration, setMaxDuration] = useState(settings.maxSessionDurationMin ?? 60);
  const [injuryNotes, setInjuryNotes] = useState(settings.injuryNotes ?? "");
  const [targetEventType, setTargetEventType] = useState<TargetEventType>(settings.targetEventType ?? "hyrox");
  const [targetDate, setTargetDate] = useState(settings.targetDate);
  const [programLengthWeeks, setProgramLengthWeeks] = useState<4 | 8 | 12>(settings.programLengthWeeks ?? 12);
  const [weightGoal, setWeightGoal] = useState(settings.targetWeightLoss ? String(settings.targetWeightLoss) : "");

  const selectedGoal = useMemo(() => goalOptions.find((option) => option.id === goal) ?? goalOptions[0], [goal]);

  const toggleDay = (day: WeekdayKey) => {
    setAvailableDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );
  };

  const completeOnboarding = (skip = false) => {
    const nextEventType = skip ? settings.targetEventType ?? "hyrox" : targetEventType;
    const nextProgramLength = skip ? settings.programLengthWeeks ?? 12 : programLengthWeeks;
    const nextTargetDate = nextEventType === "none" ? buildProgramTargetDate(nextProgramLength) : targetDate;
    const parsedWeightGoal = Number(weightGoal.replace(",", "."));

    onComplete({
      ...settings,
      appMode: skip ? settings.appMode : goal,
      enabledSports: skip ? settings.enabledSports : selectedGoal.sports,
      onboardingCompleted: true,
      sportLevel: skip ? settings.sportLevel : level,
      availableDays: skip ? settings.availableDays : availableDays,
      maxSessionDurationMin: skip ? settings.maxSessionDurationMin : maxDuration,
      injuryNotes: skip ? settings.injuryNotes : injuryNotes.trim(),
      targetEventType: nextEventType,
      programLengthWeeks: nextProgramLength,
      targetDate: nextTargetDate,
      startDate: settings.startDate || toISODate(new Date()),
      targetWeightLoss: Number.isFinite(parsedWeightGoal) && parsedWeightGoal > 0 ? parsedWeightGoal : settings.targetWeightLoss
    });
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-petrol-900/70 px-4 py-5 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl border border-white/20 bg-cream shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="bg-petrol-800 p-5 text-white sm:p-7">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-limeSoft">Première ouverture</p>
            <h1 className="mt-3 font-display text-4xl font-black leading-tight tracking-[-0.07em] sm:text-5xl">
              Ton coach doit d'abord te comprendre.
            </h1>
            <p className="mt-4 text-sm font-semibold leading-6 text-white/75">
              Pas de formulaire soviétique : juste assez d'infos pour proposer le bon niveau, la bonne durée et les bonnes priorités.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-bold">
              <div className="flex gap-3">
                <Target className="mt-0.5 h-5 w-5 text-limeSoft" />
                <span>Objectif principal et sports pratiqués.</span>
              </div>
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 text-limeSoft" />
                <span>Jours disponibles, durée max et échéance éventuelle.</span>
              </div>
              <div className="flex gap-3">
                <HeartPulse className="mt-0.5 h-5 w-5 text-limeSoft" />
                <span>Douleurs ou limites pour éviter le mode héros fragile.</span>
              </div>
            </div>
          </aside>

          <div className="grid gap-5 p-5 sm:p-7">
            <section>
              <p className="eyebrow">Objectif principal</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {goalOptions.map((option) => {
                  const active = option.id === goal;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`border p-4 text-left transition ${
                        active ? "border-petrol-800 bg-petrol-800 text-white" : "border-petrol-800/10 bg-white text-petrol-800 hover:border-petrol-800/35"
                      }`}
                      onClick={() => {
                        setGoal(option.id);
                        setTargetEventType(option.eventType);
                      }}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-base font-black">{option.label}</span>
                        {active ? <CheckCircle2 className="h-5 w-5 text-limeSoft" /> : null}
                      </span>
                      <span className={active ? "mt-2 block text-xs font-bold leading-5 text-white/70" : "mt-2 block text-xs font-bold leading-5 text-muted"}>
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <label className="field-label">
                Niveau
                <select className="field" value={level} onChange={(event) => setLevel(event.target.value as UserSportLevel)}>
                  {levelOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-label">
                Durée max par séance
                <select className="field" value={maxDuration} onChange={(event) => setMaxDuration(Number(event.target.value))}>
                  {[30, 45, 60, 75, 90].map((duration) => (
                    <option key={duration} value={duration}>
                      {duration} min
                    </option>
                  ))}
                </select>
              </label>
            </section>

            <section>
              <p className="eyebrow">Jours disponibles</p>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {dayOptions.map((day) => {
                  const active = availableDays.includes(day.id);

                  return (
                    <button
                      key={day.id}
                      type="button"
                      className={`min-h-12 border text-sm font-black uppercase tracking-[0.05em] ${
                        active ? "border-petrol-800 bg-limeSoft text-petrol-900" : "border-petrol-800/10 bg-white text-muted"
                      }`}
                      onClick={() => toggleDay(day.id)}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <label className="field-label">
                Échéance
                <select className="field" value={targetEventType} onChange={(event) => setTargetEventType(event.target.value as TargetEventType)}>
                  <option value="hyrox">HYROX ou compétition datée</option>
                  <option value="other">Autre événement</option>
                  <option value="none">Pas d'événement</option>
                </select>
              </label>

              {targetEventType === "none" ? (
                <label className="field-label">
                  Programme
                  <select className="field" value={programLengthWeeks} onChange={(event) => setProgramLengthWeeks(Number(event.target.value) as 4 | 8 | 12)}>
                    <option value={4}>4 semaines</option>
                    <option value={8}>8 semaines</option>
                    <option value={12}>12 semaines</option>
                  </select>
                </label>
              ) : (
                <label className="field-label">
                  Date cible
                  <input className="field" type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
                </label>
              )}
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <label className="field-label">
                Objectif poids facultatif
                <input
                  className="field"
                  inputMode="decimal"
                  value={weightGoal}
                  onChange={(event) => setWeightGoal(event.target.value)}
                  placeholder="Ex : 6 kg"
                />
              </label>
              <label className="field-label">
                Douleurs / limites
                <input
                  className="field"
                  value={injuryNotes}
                  onChange={(event) => setInjuryNotes(event.target.value)}
                  placeholder="Ex : mollet, genou, épaule..."
                />
              </label>
            </section>

            <div className="flex flex-col-reverse gap-2 border-t border-petrol-800/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" className="ghost-button justify-center" onClick={() => completeOnboarding(true)}>
                Passer pour l'instant
              </button>
              <button type="button" className="action-button justify-center" onClick={() => completeOnboarding(false)}>
                Créer mon suivi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
