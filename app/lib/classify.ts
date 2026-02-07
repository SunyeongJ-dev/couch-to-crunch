// This function takes a video's title and description and classifies it into tags based on keyword matching.
// It looks for keywords related to workout type (e.g. "cardio", "yoga") and difficulty level (e.g. "beginner", "advanced").
// The tags are used later for filtering and sorting videos in the UI.
export function classifyTags(title: string, description: string): string[] {
  const titleText = title.toLowerCase();
  const descText = description.toLowerCase();
  const tags: string[] = [];

  // ---------- TYPE ----------
  const typeRules = {
    cardio: ["cardio"],
    hiit: ["hiit", "interval"],
    strength: ["strength", "full body strength", "bodyweight", "dumbbell"],
    yoga: ["yoga", "vinyasa", "flow"],
    stretching: ["stretch", "stretching", "mobility", "flexibility"],
    walking: ["walking workout", "walk at home", "indoor walking"],
  } as const;

  // We first check the title for type keywords, and if we don't find any, we check the description
  (Object.keys(typeRules) as (keyof typeof typeRules)[]).forEach((type) => {
    if (typeRules[type].some((kw) => titleText.includes(kw))) {
      tags.push(type);
    }
  });

  if (tags.length === 0) {
    (Object.keys(typeRules) as (keyof typeof typeRules)[]).forEach((type) => {
      if (typeRules[type].some((kw) => descText.includes(kw))) {
        tags.push(type);
      }
    });
  }

  // ---------- LEVEL ----------
  const levelRules = {
    beginner: ["beginner", "for beginners", "easy", "low impact", "no jumping"],
    intermediate: ["intermediate"],
    advanced: ["advanced", "intense", "challenge"],
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
  if (!tags.some((t) => levelPriority.includes(t as any))) {
    for (const lvl of levelPriority) {
      if (levelRules[lvl].some((kw) => descText.includes(kw))) {
        tags.push(lvl);
        break;
      }
    }
  }

  return Array.from(new Set(tags));
}
