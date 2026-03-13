import { describe, expect, test } from "@jest/globals";
import { classifyTags } from "@/app/lib/classify";

describe("classifyTags", () => {
  test("classifies tags based on title", () => {
    const title = "30-Minute Full Body Strength Workout";
    const description =
      "This strength training workout targets your upper body, lower body, and core using dumbbells and bodyweight exercises.";
    const tags = classifyTags(title, description);
    expect(tags).toContain("strength");
  });

  test("classifies tags based on description", () => {
    const title = "30-Minute Full Body Workout";
    const description =
      "This strength training workout targets your upper body, lower body, and core using dumbbells and bodyweight exercises.";
    const tags = classifyTags(title, description);
    expect(tags).toContain("strength");
  });

  test("classifies tags when both title and description are not specific", () => {
    const title = "30-Minute Full Body Workout";
    const description =
      "This 30-minute workout session is designed to improve your overall fitness.";
    const tags = classifyTags(title, description);
    expect(tags).toEqual([]);
  });
});
