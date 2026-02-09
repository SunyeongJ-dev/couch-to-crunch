// app/lib/classify.ts

type TypeTag =
  | "cardio"
  | "hiit"
  | "strength"
  | "yoga"
  | "stretching"
  | "walking";
type LevelTag = "beginner" | "intermediate" | "advanced";

export function classifyTags(title: string, description: string): string[] {
  const titleText = title.toLowerCase();
  const descText = description.toLowerCase();
  const tags: string[] = [];

  // ---------- TYPE ----------
  const typeRules = {
    cardio: ["cardio", "aerobic", "burn calories", "heart rate"],
    hiit: ["hiit", "interval", "tabata", "circuit"],
    strength: [
      "strength",
      "weight",
      "muscle",
      "dumbbell",
      "kettlebell",
      "resistance",
      "upper body",
      "lower body",
      "abs",
    ],
    yoga: ["yoga", "vinyasa", "hatha", "yin yoga", "flow", "sun salutation"],
    stretching: [
      "stretch",
      "stretching",
      "mobility",
      "flexibility",
      "cool down",
      "warm up",
    ],
    walking: ["walking", "walk at home", "indoor walk", "steps workout"],
  } as const;

  // Prioritize types (not tested yet due to quota limits)
  const typePriority: (keyof typeof typeRules)[] = [
    "walking",
    "yoga",
    "stretching",
    "hiit",
    "cardio",
    "strength",
  ];

  // We first check the title for type keywords, and if we don't find any, we check the description
  for (const type of typePriority) {
    if (typeRules[type].some((kw) => titleText.includes(kw))) {
      tags.push(type);
      break;
    }
  }
  if (!tags.some((t) => typePriority.includes(t as TypeTag))) {
    for (const type of typePriority) {
      if (typeRules[type].some((kw) => descText.includes(kw))) {
        tags.push(type);
        break;
      }
    }
  }

  // ---------- LEVEL ----------
  const levelRules = {
    beginner: [
      "beginner",
      "easy",
      "low impact",
      "no jumping",
      "for seniors",
      "basic",
      "level 1",
      "starter",
      "gentle",
    ],
    intermediate: [
      "intermediate",
      "burn",
      "conditioning",
      "level 2",
      "toning",
      "no rest",
      "sweat",
      "power",
      "all levels",
    ],
    advanced: [
      "advanced",
      "insane",
      "extreme",
      "pro",
      "athlete",
      "shred",
      "challenge",
      "beast",
      "hardcore",
      "plyometrics",
      "heavy",
      "level 3",
      "intense",
    ],
  } as const;

  // We prioritize levels to ensure only one level tag is assigned, preferring beginner over intermediate, and intermediate over advanced
  const levelPriority: (keyof typeof levelRules)[] = [
    "beginner",
    "intermediate",
    "advanced",
  ];

  // Similar to type classification, we first check the title for level keywords, and if we don't find any, we check the description
  for (const lvl of levelPriority) {
    if (levelRules[lvl].some((kw) => titleText.includes(kw))) {
      tags.push(lvl);
      break;
    }
  }
  if (!tags.some((t) => levelPriority.includes(t as LevelTag))) {
    for (const lvl of levelPriority) {
      if (levelRules[lvl].some((kw) => descText.includes(kw))) {
        tags.push(lvl);
        break;
      }
    }
  }

  return Array.from(new Set(tags));
}
