import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: node scripts/importHyroxProgram.mjs <programme.md>");
  process.exit(1);
}

const source = readFileSync(resolve(inputPath), "utf8").replace(/\r\n/g, "\n");

const SLOT_LABELS = {
  rest: "Repos",
  badminton: "Badminton",
  strength: "Salle 1",
  run: "Salle 2",
  recovery: "Récupération",
  hyrox: "Salle 3"
};

const OBJECTIVES = {
  rest: "Récupérer vraiment, absorber la charge et protéger la suite de la semaine.",
  badminton: "Garder le plaisir, les appuis et le cardio intermittent sans saboter la récupération.",
  strength: "Construire la force utile HYROX avec charges, repos et technique maîtrisés.",
  run: "Apprendre à courir avec de la fatigue contrôlée, sans SkiErg, avec le substitut prévu.",
  recovery: "Faire circuler sans ajouter de dette de fatigue.",
  hyrox: "Enchaîner course et stations avec un pacing régulier et des transitions propres."
};

const FATIGUE_VERSION =
  "Version fatiguée : réduire les charges de 15 à 25 %, enlever 1 à 2 séries, rester entre 45 et 65 min, et remplacer la course intense par vélo, rameur ou marche inclinée zone 2.";

const STRONG_VERSION =
  "Version en forme : ajouter une seule option, pas tout en même temps : +1 série de sled, +10 kg si RPE ≤ 6 la semaine précédente, +10 min zone 2 ou +1 bloc HYROX.";

function cleanInline(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s{2,}$/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+\./g, ".")
    .replace(/\.\./g, ".");
}

function slugify(text) {
  return cleanInline(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);
}

function classifySlot(dayTitle, sessionTitle) {
  const haystack = `${dayTitle} ${sessionTitle}`.toLowerCase();
  if (dayTitle.toLowerCase().includes("repos")) return "rest";
  if (haystack.includes("récupération") || haystack.includes("recuperation")) return "recovery";
  if (haystack.includes("salle 1")) return "strength";
  if (haystack.includes("salle 2")) return "run";
  if (haystack.includes("salle 3") || haystack.includes("hyrox")) return "hyrox";
  if (haystack.includes("badminton")) return "badminton";
  return "rest";
}

function parseDuration(lines, slot) {
  const text = lines.join(" ");
  const match = text.match(/durée(?:\s+par\s+défaut|\s+max)?\s*:\s*(?:environ\s*)?(\d+)(?:\s*[-à]\s*(\d+))?\s*min/i);
  if (match) return Number(match[2] ?? match[1]);

  if (slot === "rest") return 0;
  if (slot === "badminton") return 90;
  if (slot === "recovery") return 45;
  if (slot === "strength") return 80;
  if (slot === "run") return 75;
  return 90;
}

function parseRpe(lines, slot) {
  const text = lines.join(" ");
  const match = text.match(/RPE\s*[≤>=]?\s*\d+(?:\s*[-à]\s*\d+)?/i);
  if (match) return match[0].replace(/\s+/g, " ");

  if (slot === "rest") return "RPE 0";
  if (slot === "recovery") return "RPE 3-4";
  if (slot === "badminton") return "RPE 6-7";
  if (slot === "strength") return "RPE 6-7";
  if (slot === "run") return "RPE 7";
  return "RPE 7-8";
}

function extractRestText(text) {
  const match = text.match(/repos\s+((?:\d|libre|complet)[^,.;]*)/i);
  return match ? cleanInline(match[1]) : undefined;
}

function extractRpeText(text) {
  const match = text.match(/RPE\s*[≤>=]?\s*\d+(?:\s*[-à]\s*\d+)?/i);
  return match ? cleanInline(match[0]) : undefined;
}

function extractLoadText(text) {
  const match = text.match(/(?:à|a)\s+([^,.;]*kg[^,.;]*)/i);
  return match ? cleanInline(match[1]) : undefined;
}

function parseSetData(text) {
  const match = text.match(/(\d+)\s*[×x]\s*([\d,.]+)\s*(m|km|reps?|s|min)?/i);
  if (!match) return {};

  const sets = Number(match[1]);
  const value = Number(match[2].replace(",", "."));
  const unit = match[3]?.toLowerCase();

  if (!Number.isFinite(sets) || !Number.isFinite(value)) return {};
  if (unit === "m") return { sets, distanceM: value };
  if (unit === "km") return { sets, distanceM: value * 1000 };
  if (unit === "s") return { sets, durationSec: value };
  if (unit === "min") return { sets, repsText: `${match[2]} min` };
  return { sets, reps: value };
}

function parseExercise(text, week, slot, order, numberedBlock) {
  const cleanText = cleanInline(text);
  const colonMatch = cleanText.match(/^([^:]{2,72})\s*:\s*(.+)$/);
  const name = numberedBlock ? `Bloc ${numberedBlock}` : colonMatch ? cleanInline(colonMatch[1]) : cleanText.split(" - ")[0];
  const repsText = numberedBlock ? cleanText : colonMatch ? cleanInline(colonMatch[2]) : cleanText;

  return {
    id: `${slot}-w${week}-${String(order).padStart(2, "0")}-${slugify(name) || "bloc"}`,
    block: numberedBlock ? "Blocs HYROX" : name,
    name,
    order,
    repsText,
    targetLoadText: extractLoadText(repsText),
    restText: extractRestText(cleanText),
    rpeTarget: extractRpeText(cleanText),
    ...parseSetData(repsText)
  };
}

function extractExerciseLines(content) {
  const exercises = [];
  let current = undefined;

  for (const rawLine of content.split("\n")) {
    if (!rawLine.trim()) continue;
    if (/^\*\*.+\*\*\s*$/.test(rawLine.trim())) continue;
    if (/^###/.test(rawLine)) continue;
    if (/^Blocs\s*:/i.test(cleanInline(rawLine))) continue;

    const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
    const trimmed = rawLine.trim();
    const bulletMatch = trimmed.match(/^-\s+(.+)$/);
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);

    if (bulletMatch) {
      const text = cleanInline(bulletMatch[1]);
      if (!text) continue;

      if (indent > 0 && current) {
        current.techniqueNotes = [...(current.techniqueNotes ?? []), text];
        continue;
      }

      current = { text, numberedBlock: undefined };
      exercises.push(current);
      continue;
    }

    if (numberedMatch) {
      current = { text: cleanInline(numberedMatch[2]), numberedBlock: Number(numberedMatch[1]) };
      exercises.push(current);
    }
  }

  return exercises;
}

function buildNormalVersion(slot, lines) {
  if (!lines.length) return "Prescription issue du programme envoyé, à ajuster selon ton état du jour.";

  const summary = lines.slice(0, slot === "hyrox" ? 5 : 4).map((line) => cleanInline(line.text)).join(" • ");
  return `Prescription du fichier : ${summary}`;
}

function buildSessionPlan(week, slot, dayTitle, sessionTitle, content, phaseTitle, statusText) {
  const rawLines = extractExerciseLines(content);
  const exercises = rawLines.map((line, index) => parseExercise(line.text, week, slot, index + 1, line.numberedBlock));
  const durationMin = parseDuration(rawLines.map((line) => line.text), slot);
  const title = slot === "rest" ? "Repos complet / mobilité douce" : cleanInline(sessionTitle) || SLOT_LABELS[slot];
  const statusTags = statusText ? [cleanInline(statusText).split(".")[0]] : [];
  const tags = [
    SLOT_LABELS[slot],
    phaseTitle.replace(/^Phase\s+\d+\s+—\s+/, ""),
    ...statusTags,
    slot === "run" || slot === "hyrox" ? "Sans SkiErg" : undefined
  ].filter(Boolean);

  return {
    title,
    objective: OBJECTIVES[slot],
    durationMin,
    rpeTarget: parseRpe(rawLines.map((line) => line.text), slot),
    fatigueVersion: slot === "badminton"
      ? "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon."
      : FATIGUE_VERSION,
    normalVersion: buildNormalVersion(slot, rawLines),
    strongVersion: slot === "badminton"
      ? "Version en forme : séance normale à intense, sans dépasser 90 min de haute intensité."
      : STRONG_VERSION,
    tags,
    exercises
  };
}

function parseWeeks(markdown) {
  const weekMatches = [...markdown.matchAll(/^## Semaine (\d+) — ([^\n]+)$/gm)];

  return weekMatches.map((match, index) => {
    const start = match.index;
    const end = weekMatches[index + 1]?.index ?? markdown.length;
    const block = markdown.slice(start, end);
    const week = Number(match[1]);
    const dateRange = cleanInline(match[2]);
    const phaseTitle = cleanInline(block.match(/\*\*Phase :\*\*\s*([^\n]+)/)?.[1] ?? `Semaine ${week}`);
    const note = cleanInline(block.match(/\*\*Note :\*\*\s*([^\n]+)/)?.[1] ?? "");
    const status = cleanInline(block.match(/\*\*Statut :\*\*\s*([^\n]+)/)?.[1] ?? "");
    const dayMatches = [...block.matchAll(/^### ([^\n]+)$/gm)].filter((day) => !day[1].includes("Permutations"));
    const sessions = {};

    for (let dayIndex = 0; dayIndex < dayMatches.length; dayIndex += 1) {
      const dayStart = dayMatches[dayIndex].index;
      const dayEnd = dayMatches[dayIndex + 1]?.index ?? block.length;
      const heading = cleanInline(dayMatches[dayIndex][1]);
      const dayBlock = block.slice(dayStart, dayEnd);
      if (heading.includes("Permutations")) continue;

      const [, dayName = "", dayTitle = heading] = heading.match(/^(.+?)\s+—\s+(.+)$/) ?? [];
      const explicitTitle = cleanInline(dayBlock.match(/^\*\*(.+?)\*\*\s*$/m)?.[1] ?? dayTitle);
      const slot = classifySlot(dayTitle, explicitTitle);
      sessions[slot] = buildSessionPlan(week, slot, dayTitle, explicitTitle, dayBlock, phaseTitle, status || note);
      sessions[slot].sourceDay = cleanInline(dayName);
    }

    return {
      week,
      dateRange,
      phaseTitle,
      note: note || undefined,
      status: status || undefined,
      sessions
    };
  });
}

const weeks = parseWeeks(source);
const plans = Object.fromEntries(weeks.map((week) => [week.week, week]));

const output = `import type { ExercisePrescription } from "../types";

export type PreciseSessionSlot = "rest" | "badminton" | "strength" | "run" | "recovery" | "hyrox";

export type PreciseSessionPlan = {
  title: string;
  objective: string;
  durationMin: number;
  rpeTarget: string;
  fatigueVersion: string;
  normalVersion: string;
  strongVersion: string;
  tags: string[];
  sourceDay?: string;
  exercises: ExercisePrescription[];
};

export type PreciseWeekPlan = {
  week: number;
  dateRange: string;
  phaseTitle: string;
  note?: string;
  status?: string;
  sessions: Partial<Record<PreciseSessionSlot, PreciseSessionPlan>>;
};

export const PRECISE_WEEK_PLANS: Record<number, PreciseWeekPlan> = ${JSON.stringify(plans, null, 2)};

export function getPreciseWeekPlan(week: number): PreciseWeekPlan | undefined {
  return PRECISE_WEEK_PLANS[week];
}
`;

writeFileSync("src/data/preciseTrainingPlan.ts", output, "utf8");
console.log(`Imported ${weeks.length} HYROX weeks into src/data/preciseTrainingPlan.ts`);
