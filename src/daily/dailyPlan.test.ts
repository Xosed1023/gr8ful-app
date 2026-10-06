import { describe, expect, it } from "vitest";
import { Phrase } from "../models/Phrase";
import {
  buildPlan,
  dateKey,
  MIN_DAYS_LEFT,
  PLAN_DAYS,
  resolvePlan,
  topicsKeyOf,
} from "./dailyPlan";

const makePhrases = (n: number, type = "Motivation", idStart = 1, shown = false): Phrase[] =>
  Array.from({ length: n }, (_, i) => ({
    id: idStart + i,
    author: `Autor ${idStart + i}`,
    type,
    content: { es: `es ${idStart + i}`, en: `en ${idStart + i}`, fr: `fr ${idStart + i}` },
    isFavorite: false,
    hasShown: shown,
  })) as Phrase[];

const NOW = new Date(2026, 9, 3, 10, 0); // 3 oct 2026, 10:00

describe("dateKey", () => {
  it("formatea el día local con ceros", () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(dateKey(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
  });
});

describe("buildPlan", () => {
  it("genera 30 días consecutivos desde la fecha de inicio", () => {
    const plan = buildPlan({ phrases: makePhrases(40), topics: [], start: new Date(2026, 9, 3) });
    expect(plan.days).toHaveLength(PLAN_DAYS);
    expect(plan.days[0].date).toBe("2026-10-03");
    expect(plan.days[29].date).toBe("2026-11-01"); // cruza de mes
  });

  it("usa frases distintas mientras haya suficientes", () => {
    const plan = buildPlan({ phrases: makePhrases(40), topics: [], start: NOW });
    expect(new Set(plan.days.map((d) => d.phraseId)).size).toBe(PLAN_DAYS);
  });

  it("prioriza los temas elegidos y las no vistas", () => {
    const phrases = [
      ...makePhrases(5, "Love"),
      ...makePhrases(40, "Humor", 100),
      ...makePhrases(3, "Love", 200, true),
    ];
    const plan = buildPlan({ phrases, topics: [{ key: "Love", value: "Amor" }], start: NOW });
    const first8 = plan.days.slice(0, 8).map((d) => d.phraseId);
    expect(first8.slice(0, 5).every((id) => id >= 1 && id <= 5)).toBe(true); // Love no vistas
    expect(first8.slice(5).every((id) => id >= 200)).toBe(true); // luego Love vistas
  });

  it("conserva la frase que ya tocaba hoy", () => {
    const plan = buildPlan({ phrases: makePhrases(40), topics: [], start: NOW, keepToday: 17 });
    expect(plan.days[0].phraseId).toBe(17);
    expect(plan.days.filter((d) => d.phraseId === 17)).toHaveLength(1);
  });

  it("repite solo cuando no quedan frases y devuelve vacío sin frases", () => {
    const few = buildPlan({ phrases: makePhrases(3), topics: [], start: NOW });
    expect(new Set(few.days.map((d) => d.phraseId)).size).toBe(3);
    expect(buildPlan({ phrases: [], topics: [], start: NOW }).days).toEqual([]);
  });
});

describe("resolvePlan", () => {
  const phrases = makePhrases(40);
  const base = buildPlan({ phrases, topics: [], start: new Date(2026, 9, 3) });

  it("reutiliza el plan vigente sin tocarlo", () => {
    const r = resolvePlan({ stored: base, phrases, topics: [], now: NOW });
    expect(r.changed).toBe(false);
    expect(r.plan).toBe(base);
  });

  it("sigue valiendo al día siguiente mientras queden suficientes días", () => {
    const tomorrow = new Date(2026, 9, 4, 8, 0);
    expect(resolvePlan({ stored: base, phrases, topics: [], now: tomorrow }).changed).toBe(false);
  });

  it("lo rehace si cambian los temas", () => {
    const r = resolvePlan({ stored: base, phrases, topics: [{ key: "Love", value: "x" }], now: NOW });
    expect(r.changed).toBe(true);
    expect(r.plan.topicsKey).toBe(topicsKeyOf([{ key: "Love", value: "x" }]));
  });

  it("lo repone si quedan menos de 14 días, conservando la frase de hoy", () => {
    const late = new Date(2026, 9, 3 + (PLAN_DAYS - MIN_DAYS_LEFT + 1), 9, 0); // quedan 13
    const todayId = base.days.find((d) => d.date === dateKey(late))!.phraseId;
    const r = resolvePlan({ stored: base, phrases, topics: [], now: late });
    expect(r.changed).toBe(true);
    expect(r.plan.days[0].date).toBe(dateKey(late));
    expect(r.plan.days[0].phraseId).toBe(todayId);
  });

  it("lo rehace si una frase del plan ya no existe", () => {
    const missing = phrases.filter((p) => p.id !== base.days[5].phraseId);
    expect(resolvePlan({ stored: base, phrases: missing, topics: [], now: NOW }).changed).toBe(true);
  });

  it("lo crea si no hay plan guardado", () => {
    const r = resolvePlan({ stored: null, phrases, topics: [], now: NOW });
    expect(r.changed).toBe(true);
    expect(r.plan.days[0].date).toBe("2026-10-03");
  });
});

describe("topicsKeyOf", () => {
  it("no depende del orden ni de las mayúsculas", () => {
    expect(
      topicsKeyOf([{ key: "Love", value: "" }, { key: "humor", value: "" }])
    ).toBe(topicsKeyOf([{ key: "HUMOR", value: "" }, { key: "love", value: "" }]));
  });
});
