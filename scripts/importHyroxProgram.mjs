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

function extractSection(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start < 0) return "";
  const next = markdown.indexOf("\n## ", start + heading.length);
  return markdown.slice(start, next > start ? next : markdown.length);
}

function splitMarkdownRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cleanInline(cell));
}

function parseMarkdownTable(section) {
  return section
    .split("\n")
    .filter((line) => /^\|/.test(line.trim()))
    .filter((line) => !/^\|\s*-+/.test(line.trim()))
    .map(splitMarkdownRow)
    .filter((cells) => cells.length >= 2);
}

function expandWeekCell(cell) {
  const normalized = searchable(cell);
  const range = normalized.match(/^(\d+)\s*(?:a|à|-)\s*(\d+)/);
  if (range) {
    const from = Number(range[1]);
    const to = Number(range[2]);
    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
  }

  const single = normalized.match(/^(\d+)/);
  return single ? [Number(single[1])] : [];
}

function buildRowsByWeek(rows, mapper) {
  const byWeek = {};
  for (const row of rows) {
    for (const week of expandWeekCell(row[0])) {
      byWeek[week] = mapper(row, week);
    }
  }
  return byWeek;
}

function parseDurationFromCell(value, fallback) {
  const match = searchable(value).match(/(\d+)(?:\s*[-a]\s*(\d+))?\s*min/);
  if (!match) return fallback;
  return Number(match[2] ?? match[1]);
}

function formatDate(date) {
  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getWeekDateRange(week) {
  const start = new Date(Date.UTC(2026, 3, 27 + (week - 1) * 7));
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return `${formatDate(start)}-${formatDate(end)}`;
}

function getPhaseRows(markdown) {
  const rows = parseMarkdownTable(extractSection(markdown, "## Phases de périodisation"));
  return rows.slice(1).map((row) => ({
    weeks: expandWeekCell(row[0]),
    title: cleanInline(row[1] ?? "Phase"),
    focus: cleanInline(row[2] ?? "")
  }));
}

function getPhaseForGeneratedWeek(phaseRows, week) {
  return phaseRows.find((phase) => phase.weeks.includes(week)) ?? {
    title: `Semaine ${week}`,
    focus: ""
  };
}

function splitExerciseParts(content) {
  return cleanInline(content)
    .replace(/^Deload\s*:\s*/i, "")
    .replace(/^Activation légère\s*:\s*/i, "")
    .split(/,\s+/)
    .map((part) => cleanInline(part))
    .filter(Boolean);
}

function inferExerciseName(text) {
  const cleanText = cleanInline(text);
  const known = [
    "Sled Push",
    "Sled Pull",
    "trap bar deadlift ou front squat",
    "trap bar deadlift",
    "front squat ou presse",
    "front squat",
    "presse légère",
    "presse",
    "goblet squat",
    "soulevé de terre roumain",
    "fentes ou split squat",
    "farmer carry",
    "wall balls",
    "force entretien",
    "activation légère",
    "Tests",
    "Rappel vitesse",
    "Affûtage",
    "Semaine course",
    "Deload"
  ];
  const match = known.find((name) => searchable(cleanText).startsWith(searchable(name)));
  if (match) return cleanInline(match);

  const volumeIndex = cleanText.search(/\d+\s*[×x]\s*|\d+\s+à\s+\d+|\d+\s+a\s+\d+|\d+\s*min/i);
  if (volumeIndex > 2) return cleanInline(cleanText.slice(0, volumeIndex));

  return cleanText.split(":")[0] || cleanText;
}

function tableExercise(slot, week, order, raw, restText, rpeTarget) {
  const text = cleanInline(raw);
  const name = inferExerciseName(text);

  return {
    id: `${slot}-w${week}-${String(order).padStart(2, "0")}-${slugify(name) || "bloc"}`,
    block: order === 1 ? "Échauffement" : order >= 90 ? "Retour au calme" : `Bloc ${order - 1}`,
    name,
    order,
    repsText: text,
    targetLoadText: extractLoadText(text),
    restText: extractRestText(text) ?? restText,
    rpeTarget: extractRpeText(text) ?? rpeTarget,
    ...parseSetData(text)
  };
}

function strengthExercisesFromRow(week, row) {
  const content = row.content;
  const rpe = `RPE ${row.rpe}`;
  const parts = splitExerciseParts(content);
  const exercises = [
    {
      id: `strength-w${week}-01-echauffement-commun`,
      block: "Échauffement",
      name: "Échauffement force + sled",
      order: 1,
      repsText:
        "6 min rameur/vélo/tapis incliné + mobilité chevilles/hanches + squats 2 x 10 + fentes 2 x 8/jambe + farmer léger 2 x 20 m + sled léger 2 x 10 m.",
      restText: "30 s entre activations",
      rpeTarget: "RPE 3-4"
    }
  ];

  parts.forEach((part, index) => {
    exercises.push(tableExercise("strength", week, index + 2, part, "90-120 s, 2 min 30 à 3 min sur force lourde", rpe));
  });

  exercises.push({
    id: `strength-w${week}-99-retour-au-calme`,
    block: "Retour au calme",
    name: "Retour au calme",
    order: 99,
    repsText: "5-8 min marche ou vélo très facile + mobilité mollets/hanches.",
    restText: "Libre",
    rpeTarget: "RPE 2-3"
  });

  return exercises;
}

function runExercisesFromRow(week, row) {
  const rpe = `RPE ${row.rpe}`;
  return [
    {
      id: `run-w${week}-01-echauffement`,
      block: "Échauffement",
      name: "Échauffement course",
      order: 1,
      repsText:
        "8 min footing facile + montées de genoux 2 x 20 s + talons-fesses 2 x 20 s + squats 2 x 10 + fentes marchées 2 x 10 pas + accélérations 3 x 20 s.",
      restText: "30-40 s",
      rpeTarget: "RPE 3-5"
    },
    tableExercise("run", week, 2, row.content, "60-90 s selon phase", rpe),
    {
      id: `run-w${week}-03-burpees-technique`,
      block: "Technique",
      name: "Burpee broad jumps technique",
      order: 3,
      repsText: searchable(row.content).includes("deload") ? "3 x 10 m propres, sans forcer." : "5 x 10 m propres, régulier.",
      restText: "60 s",
      rpeTarget: "RPE 6"
    },
    {
      id: `run-w${week}-04-farmer-option`,
      block: "Complément",
      name: "Farmer carry modéré",
      order: 4,
      repsText: "3 x 60-80 m si jambes et grip OK.",
      restText: "90 s",
      rpeTarget: "RPE 6-7"
    },
    {
      id: `run-w${week}-99-retour-au-calme`,
      block: "Retour au calme",
      name: "Retour au calme",
      order: 99,
      repsText: "8-10 min très facile + mobilité mollets/hanches.",
      restText: "Libre",
      rpeTarget: "RPE 2-3"
    }
  ];
}

const HYROX_STATIONS = [
  "1 km course + SkiErg 1000 m",
  "1 km course + Sled Push 4 x 10 m",
  "1 km course + Sled Pull 4 x 10 m",
  "1 km course + Burpee Broad Jumps 40 à 80 m",
  "1 km course + Rameur 1000 m",
  "1 km course + Farmer Carry 100 à 200 m",
  "1 km course + Sandbag Lunges 50 à 100 m",
  "1 km course + Wall Balls 40 à 100 reps"
];

function getHyroxRestForWeek(week) {
  if (week <= 4) return "2 min après chaque bloc";
  if (week <= 8) return "90 s après chaque bloc";
  if (week <= 16) return "75-90 s après chaque bloc";
  if (week <= 24) return "60-75 s après chaque bloc";
  if (week <= 28) return "45-60 s après chaque bloc";
  if (week <= 31) return "30-60 s, transitions rapides";
  return "90 s, volume réduit";
}

function hyroxExercisesFromRow(week, row) {
  const blocks = Number(row.blocks);
  const rpe = `RPE ${row.rpe}`;
  const exercises = [
    {
      id: `hyrox-w${week}-01-echauffement`,
      block: "Échauffement",
      name: "Échauffement HYROX",
      order: 1,
      repsText:
        "8 min footing/rameur + 5 min mobilité chevilles/hanches/épaules + squats 2 x 10 + fentes 2 x 10 pas + wall balls légers 2 x 8 + farmer léger 2 x 30 m + accélérations 3 x 20 s.",
      restText: "30-45 s",
      rpeTarget: "RPE 3-5"
    }
  ];

  if (!Number.isFinite(blocks)) {
    exercises.push({
      id: `hyrox-w${week}-02-rappel-course`,
      block: "Affûtage",
      name: "Rappel course semaine HYROX",
      order: 2,
      repsText: "20-30 min très facile + 3 accélérations de 20 s uniquement si jambes fraîches.",
      restText: "Récupération complète",
      rpeTarget: rpe
    });
  } else {
    HYROX_STATIONS.slice(0, blocks).forEach((station, index) => {
      exercises.push({
        id: `hyrox-w${week}-${String(index + 2).padStart(2, "0")}-bloc-${index + 1}`,
        block: `Bloc ${index + 1}`,
        name: station.replace(/^1 km course \+ /, "Course + "),
        order: index + 2,
        repsText: station,
        targetLoadText: row.intensity,
        restText: getHyroxRestForWeek(week),
        rpeTarget: rpe
      });
    });
  }

  exercises.push({
    id: `hyrox-w${week}-99-retour-au-calme`,
    block: "Retour au calme",
    name: "Retour au calme",
    order: 99,
    repsText: "8-10 min très facile + respiration + mobilité mollets/hanches.",
    restText: "Libre",
    rpeTarget: "RPE 2-3"
  });

  return exercises;
}

function buildGeneratedProgram(markdown) {
  const phaseRows = getPhaseRows(markdown);
  const strengthRows = parseMarkdownTable(extractSection(markdown, "### Progression Force + sled par semaine")).slice(1);
  const runRows = parseMarkdownTable(extractSection(markdown, "### Progression Course + moteur par semaine")).slice(1);
  const hyroxRows = parseMarkdownTable(extractSection(markdown, "### Progression HYROX spécifique par semaine")).slice(1);

  const strengthByWeek = buildRowsByWeek(strengthRows, (row) => ({
    content: row[1],
    durationMin: parseDurationFromCell(row[2], 75),
    rpe: row[3]
  }));
  const runByWeek = buildRowsByWeek(runRows, (row) => ({
    content: row[1],
    durationMin: parseDurationFromCell(row[2], 65),
    rpe: row[3]
  }));
  const hyroxByWeek = buildRowsByWeek(hyroxRows, (row) => ({
    blocks: row[1],
    intensity: row[2],
    durationMin: parseDurationFromCell(row[3], 80),
    rpe: row[4]
  }));

  return Array.from({ length: 33 }, (_, index) => {
    const week = index + 1;
    const phase = getPhaseForGeneratedWeek(phaseRows, week);
    const strength = strengthByWeek[week];
    const run = runByWeek[week];
    const hyrox = hyroxByWeek[week];
    const deload = [4, 8, 12, 16, 20, 24, 28].includes(week);

    return {
      week,
      dateRange: getWeekDateRange(week),
      phaseTitle: phase.title,
      note: phase.focus || undefined,
      status: deload ? "Semaine allégée : volume réduit, technique propre, récupération prioritaire." : undefined,
      sessions: {
        rest: {
          title: "Repos complet",
          objective: OBJECTIVES.rest,
          durationMin: 0,
          rpeTarget: "RPE 0",
          fatigueVersion: "Repos complet, mobilité 8 min si ça fait du bien.",
          normalVersion: "Repos complet, marche douce possible. Pas de séance cachée.",
          strongVersion: "Repos quand même. L'énergie sert à mieux encaisser la suite.",
          tags: ["Repos", phase.title],
          exercises: []
        },
        badminton: {
          title: week === 33 ? "Badminton léger" : "Badminton",
          objective: OBJECTIVES.badminton,
          durationMin: week === 33 ? 60 : 75,
          rpeTarget: week === 33 ? "RPE 5-6" : "RPE 6-8",
          fatigueVersion: "45-60 min : technique, déplacements propres, pas de matchs à rallonge.",
          normalVersion: "75-90 min : séance classique avec échauffement obligatoire et retour au calme.",
          strongVersion: "90-110 min possible, mais pas deux jours de suite à très haute intensité.",
          tags: ["Badminton", "Appuis", phase.title],
          exercises: [
            {
              id: `badminton-w${week}-01-echauffement`,
              block: "Échauffement",
              name: "Échauffement badminton",
              order: 1,
              repsText:
                "3 min marche rapide ou corde douce + squats 2 x 10 + fentes arrière 2 x 8/jambe + mollets 2 x 15 + pas chassés 3 x 20 s + accélérations 3 x 15 s.",
              restText: "20-30 s",
              rpeTarget: "RPE 3-5"
            },
            {
              id: `badminton-w${week}-02-jeu`,
              block: "Jeu",
              name: "Badminton",
              order: 2,
              repsText: week === 33 ? "45-60 min léger, priorité fraîcheur." : "75-90 min selon fatigue.",
              restText: "Hydratation entre matchs",
              rpeTarget: week === 33 ? "RPE 5-6" : "RPE 6-8"
            },
            {
              id: `badminton-w${week}-03-retour-au-calme`,
              block: "Retour au calme",
              name: "Retour au calme badminton",
              order: 3,
              repsText: "3-5 min marche lente + mollets 2 x 30 s/côté + adducteurs 2 x 30 s/côté + 2 min respiration.",
              restText: "Libre",
              rpeTarget: "RPE 2"
            }
          ]
        },
        recovery: {
          title: "Récupération active",
          objective: OBJECTIVES.recovery,
          durationMin: 40,
          rpeTarget: "RPE 3-4",
          fatigueVersion: "15-20 min marche facile + respiration.",
          normalVersion: "30-45 min zone 2 très facile : vélo, marche inclinée ou mobilité.",
          strongVersion: "45 min zone 2 facile + mobilité longue. Pas d'intensité cachée.",
          tags: ["Récupération", "Zone 2", phase.title],
          exercises: [
            tableExercise("recovery", week, 1, "Marche ou vélo zone 2 très facile 30-45 min", "Libre", "RPE 3-4"),
            tableExercise("recovery", week, 2, "Mobilité hanches, chevilles, mollets, fessiers, dos 15-20 min", "Libre", "RPE 2-3")
          ]
        },
        strength: {
          title: deload ? "Salle 1 - Force + sled allégé" : "Salle 1 - Force + sled",
          objective: OBJECTIVES.strength,
          durationMin: strength.durationMin,
          rpeTarget: `RPE ${strength.rpe}`,
          fatigueVersion:
            "Réduire les séries de 30 à 50 %, garder RPE ≤ 6, augmenter les repos de 20 à 30 %, aucune série à l'échec.",
          normalVersion: `Prescription du fichier : ${strength.content}`,
          strongVersion:
            "Ajouter un seul bonus si sommeil et jambes OK : +1 série sled OU farmer plus long OU wall balls propres. Jamais tout en même temps.",
          tags: ["Salle 1", "Force", "Sled", phase.title],
          exercises: strengthExercisesFromRow(week, strength)
        },
        run: {
          title: deload ? "Salle 2 - Course + moteur allégé" : "Salle 2 - Course + moteur",
          objective: OBJECTIVES.run,
          durationMin: run.durationMin,
          rpeTarget: `RPE ${run.rpe}`,
          fatigueVersion: "35-45 min zone 2 vélo, rameur ou tapis incliné. Garder RPE 4-5, pas de sprint.",
          normalVersion: `Prescription du fichier : ${run.content}`,
          strongVersion: "Ajouter un seul bloc court ou farmer carry lourd si récupération OK. Finir propre.",
          tags: ["Salle 2", "Course", "Moteur", phase.title, "Sans SkiErg possible"],
          exercises: runExercisesFromRow(week, run)
        },
        hyrox: {
          title: week === 33 ? "Rappel HYROX / semaine course" : "Salle 3 - Spécifique HYROX",
          objective: OBJECTIVES.hyrox,
          durationMin: hyrox.durationMin,
          rpeTarget: `RPE ${hyrox.rpe}`,
          fatigueVersion:
            "Version fatiguée : 4-5 blocs faciles, rameur 250 m, wall balls légers, farmer court, fentes sans charge, mobilité.",
          normalVersion:
            week === 33
              ? "Semaine course : rappel court uniquement si besoin. La vraie séance est HYROX Paris le samedi."
              : `Prescription du fichier : ${hyrox.blocks} blocs à ${hyrox.intensity}, repos ${getHyroxRestForWeek(week)}.`,
          strongVersion: "Transitions plus courtes et +1 bloc seulement si la phase le permet. Aucune station à l'échec.",
          tags: ["Salle 3", "HYROX", phase.title, hyrox.blocks ? `${hyrox.blocks} blocs` : "Course"],
          exercises: hyroxExercisesFromRow(week, hyrox)
        }
      }
    };
  });
}

const weeks = source.includes("### Progression Force + sled par semaine")
  ? buildGeneratedProgram(source)
  : parseWeeks(source);
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
