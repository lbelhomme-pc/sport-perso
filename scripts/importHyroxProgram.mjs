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

function searchable(text) {
  return cleanInline(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
  const text = searchable(lines.join(" "));
  const match = text.match(/duree(?:\s+par\s+defaut|\s+max)?\s*:\s*(?:environ\s*)?(\d+)(?:\s*[-a]\s*(\d+))?\s*min/i);
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
  const match = text.match(/repos\s*:?\s*((?:\d|libre|complet)[^,.;]*)/i);
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

function getDefaultRestText(slot, name, repsText) {
  const haystack = searchable(`${name} ${repsText}`);
  if (haystack.includes("echauff") || haystack.includes("activation") || haystack.includes("mobilite") || haystack.includes("retour au calme")) {
    return "Pas de repos imposé";
  }
  if (slot === "badminton") return "Hydratation entre matchs";
  if (slot === "strength") return "90-120 s si non précisé";
  if (slot === "run") return "60-90 s ou marche lente si non précisé";
  if (slot === "hyrox") return "90 s entre blocs si non précisé";
  if (slot === "recovery") return "Libre";
  return undefined;
}

function extractSessionRestText(lines) {
  const restLine = lines.find((line) => searchable(line.text).startsWith("repos"));
  if (!restLine) return undefined;

  const restText = cleanInline(restLine.text.replace(/^repos\s*:?\s*/i, ""));
  return restText || undefined;
}

function parseExercise(line, week, slot, order, sessionRestText) {
  const { text, numberedBlock, techniqueNotes } = line;
  const cleanText = cleanInline(text);
  const colonMatch = cleanText.match(/^([^:]{2,72})\s*:\s*(.+)$/);
  const name = numberedBlock ? `Bloc ${numberedBlock}` : colonMatch ? cleanInline(colonMatch[1]) : cleanText.split(" - ")[0];
  const repsText = numberedBlock ? cleanText : colonMatch ? cleanInline(colonMatch[2]) : cleanText;
  const restText = extractRestText(cleanText) ?? (numberedBlock ? sessionRestText : undefined) ?? getDefaultRestText(slot, name, repsText);

  return {
    id: `${slot}-w${week}-${String(order).padStart(2, "0")}-${slugify(name) || "bloc"}`,
    block: numberedBlock ? "Blocs HYROX" : name,
    name,
    order,
    repsText,
    targetLoadText: extractLoadText(repsText),
    restText,
    rpeTarget: extractRpeText(cleanText),
    techniqueNotes,
    ...parseSetData(repsText)
  };
}

function extractBulletLines(content) {
  const lines = [];

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

      lines.push({ text, numberedBlock: undefined, indent });
      continue;
    }

    if (numberedMatch) {
      lines.push({ text: cleanInline(numberedMatch[2]), numberedBlock: Number(numberedMatch[1]), indent });
    }
  }

  return lines;
}

function isSummaryOnlyLine(text, slot) {
  if (slot === "rest") return true;

  const normalized = searchable(text);
  return [
    /^duree max\b/,
    /^duree par defaut\b/,
    /^intensite\b/,
    /^intensite cible\b/,
    /^nombre de blocs\b/,
    /^repos\b/,
    /^blocs\b/,
    /^dans la pwa\b/,
    /^si match\b/,
    /^si fatigue\b/,
    /^pas de fractionne\b/
  ].some((pattern) => pattern.test(normalized));
}

function extractExerciseLines(content, slot) {
  const exercises = [];
  let current = undefined;

  for (const line of extractBulletLines(content)) {
    if (line.indent > 0 && !line.numberedBlock && current) {
      current.techniqueNotes = [...(current.techniqueNotes ?? []), line.text];
      continue;
    }

    if (!line.numberedBlock && isSummaryOnlyLine(line.text, slot)) continue;

    current = { text: line.text, numberedBlock: line.numberedBlock };
    exercises.push(current);
  }

  return exercises;
}

function buildNormalVersion(slot, lines) {
  if (!lines.length) return "Prescription issue du programme envoyé, à ajuster selon ton état du jour.";

  const summary = lines
    .filter((line) => !searchable(line.text).startsWith("dans la pwa"))
    .slice(0, slot === "hyrox" ? 5 : 4)
    .map((line) => cleanInline(line.text))
    .join(" • ");
  return `Prescription du fichier : ${summary}`;
}

function buildSessionPlan(week, slot, dayTitle, sessionTitle, content, phaseTitle, statusText) {
  const summaryLines = extractBulletLines(content);
  const rawLines = extractExerciseLines(content, slot);
  const sessionRestText = extractSessionRestText(summaryLines);
  const exercises = rawLines.map((line, index) => parseExercise(line, week, slot, index + 1, sessionRestText));
  const durationMin = parseDuration(summaryLines.map((line) => line.text), slot);
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
    rpeTarget: parseRpe(summaryLines.map((line) => line.text), slot),
    fatigueVersion: slot === "badminton"
      ? "Version fatiguée : jouer technique, limiter les matchs longs, durée 45-60 min, stop si douleur mollet/adducteurs/tendon."
      : FATIGUE_VERSION,
    normalVersion: buildNormalVersion(slot, summaryLines),
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
    const dayMatches = [...block.matchAll(/^### ([^\n]+)$/gm)];
    const sessions = {};

    for (let dayIndex = 0; dayIndex < dayMatches.length; dayIndex += 1) {
      const dayStart = dayMatches[dayIndex].index;
      const nextDayStart = dayMatches[dayIndex + 1]?.index ?? block.length;
      const nextSectionOffset = block.slice(dayStart + 1).search(/\n##\s+/);
      const nextSectionStart = nextSectionOffset >= 0 ? dayStart + 1 + nextSectionOffset : block.length;
      const dayEnd = Math.min(nextDayStart, nextSectionStart);
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
