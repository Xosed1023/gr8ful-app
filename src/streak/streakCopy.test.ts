import { describe, expect, it } from "vitest";
import { AppStreakRestoredLanguage } from "./streakCopy";

describe("AppStreakRestoredLanguage", () => {
  it("tiene todos los textos en ES, EN y FR", () => {
    for (const entry of Object.values(AppStreakRestoredLanguage)) {
      for (const lang of ["es", "en", "fr"] as const) {
        expect(entry[lang].trim().length).toBeGreaterThan(0);
      }
    }
  });
});
