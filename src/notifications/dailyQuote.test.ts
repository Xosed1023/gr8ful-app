import { beforeEach, describe, expect, it, vi } from "vitest";

const plugin = vi.hoisted(() => ({
  checkPermissions: vi.fn(),
  requestPermissions: vi.fn(),
  schedule: vi.fn().mockResolvedValue({ notifications: [] }),
  cancel: vi.fn().mockResolvedValue(undefined),
  createChannel: vi.fn().mockResolvedValue(undefined),
}));
const phrasesDb = vi.hoisted(() => ({ value: [] as unknown[] }));
const platform = vi.hoisted(() => ({ native: true, name: "ios" }));

vi.mock("@capacitor/local-notifications", () => ({ LocalNotifications: plugin }));
vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: () => platform.native,
    getPlatform: () => platform.name,
  },
}));
vi.mock("../persistence/IndexedDBService", () => ({
  getAllPhrases: () => Promise.resolve(phrasesDb.value),
}));

import {
  buildSchedule,
  disableDailyQuotes,
  enableDailyQuotes,
  NOTIFICATION_BASE_ID,
  NOTIFICATION_DAYS,
  refreshDailyQuotes,
} from "./dailyQuote";

const makePhrases = (n: number, type = "Motivation", shown = false) =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    author: `Autor ${i + 1}`,
    type,
    content: { es: `es ${i + 1}`, en: `en ${i + 1}`, fr: `fr ${i + 1}` },
    isFavorite: false,
    hasShown: shown,
  })) as never[];

describe("buildSchedule", () => {
  const input = (over = {}) => ({
    phrases: makePhrases(40),
    topics: [],
    language: "es" as const,
    hour: 12,
    now: new Date(2026, 9, 2, 9, 0),
    ...over,
  });

  it("empieza hoy si la hora aún no pasó", () => {
    const [first] = buildSchedule(input());
    expect(first.at).toEqual(new Date(2026, 9, 2, 12, 0));
  });

  it("empieza mañana si la hora ya pasó", () => {
    const [first] = buildSchedule(input({ now: new Date(2026, 9, 2, 13, 0) }));
    expect(first.at).toEqual(new Date(2026, 9, 3, 12, 0));
  });

  it("genera 30 días consecutivos a la hora elegida con IDs fijos", () => {
    const q = buildSchedule(input({ hour: 18 }));
    expect(q).toHaveLength(NOTIFICATION_DAYS);
    q.forEach((n, i) => {
      expect(n.id).toBe(NOTIFICATION_BASE_ID + i);
      expect(n.at.getHours()).toBe(18);
      expect(n.at.getDate()).toBe(new Date(2026, 9, 2 + i, 18).getDate());
    });
  });

  it("usa frases distintas y el idioma pedido, con autor", () => {
    const q = buildSchedule(input({ language: "fr" }));
    expect(new Set(q.map((n) => n.phraseId)).size).toBe(NOTIFICATION_DAYS);
    expect(q[0].body).toMatch(/^fr \d+\n— Autor \d+$/);
  });

  it("prioriza las no vistas", () => {
    const phrases = [...makePhrases(30, "Motivation", false), ...makePhrases(5, "Motivation", true).map((p: any, i) => ({ ...p, id: 100 + i }))];
    const ids = buildSchedule(input({ phrases })).map((n) => n.phraseId);
    expect(ids.some((id) => (id ?? 0) >= 100)).toBe(false);
  });

  it("respeta los temas y completa con otros si faltan", () => {
    const phrases = [
      ...makePhrases(10, "Love"),
      ...makePhrases(40, "Humor").map((p: any, i) => ({ ...p, id: 200 + i })),
    ];
    const q = buildSchedule(input({ phrases, topics: [{ key: "Love", value: "Amor" }] }));
    const first10 = q.slice(0, 10).map((n) => n.phraseId);
    expect(first10.every((id) => (id ?? 0) <= 10)).toBe(true);
    expect(q).toHaveLength(NOTIFICATION_DAYS);
  });

  it("repite solo cuando no quedan frases distintas", () => {
    const q = buildSchedule(input({ phrases: makePhrases(3) }));
    expect(q).toHaveLength(NOTIFICATION_DAYS);
    expect(new Set(q.map((n) => n.phraseId)).size).toBe(3);
  });

  it("sin frases no programa nada", () => {
    expect(buildSchedule(input({ phrases: [] }))).toEqual([]);
  });
});

describe("enable / disable / refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    platform.native = true;
    platform.name = "ios";
    phrasesDb.value = makePhrases(40);
    plugin.checkPermissions.mockResolvedValue({ display: "granted" });
    plugin.requestPermissions.mockResolvedValue({ display: "granted" });
    localStorage.setItem("language", "es");
    localStorage.setItem("time", "6");
  });

  it("enable pide permiso, cancela, programa 30 y marca activadas", async () => {
    plugin.checkPermissions.mockResolvedValue({ display: "prompt" });
    expect(await enableDailyQuotes()).toBe("scheduled");
    expect(plugin.requestPermissions).toHaveBeenCalledTimes(1);
    expect(plugin.cancel).toHaveBeenCalled();
    expect(plugin.schedule.mock.calls[0][0].notifications).toHaveLength(30);
    expect(localStorage.getItem("pushNotifications")).toBe("true");
  });

  it("enable con permiso denegado no programa y deja desactivadas", async () => {
    plugin.checkPermissions.mockResolvedValue({ display: "prompt" });
    plugin.requestPermissions.mockResolvedValue({ display: "denied" });
    expect(await enableDailyQuotes()).toBe("denied");
    expect(plugin.schedule).not.toHaveBeenCalled();
    expect(localStorage.getItem("pushNotifications")).toBe("false");
  });

  it("enable sin hora guardada usa 12:00", async () => {
    localStorage.removeItem("time");
    await enableDailyQuotes();
    expect(localStorage.getItem("time")).toBe("12");
  });

  it("en Android crea el canal", async () => {
    platform.name = "android";
    await enableDailyQuotes();
    expect(plugin.createChannel).toHaveBeenCalledWith(expect.objectContaining({ id: "daily-quote" }));
  });

  it("disable cancela las 30 y marca desactivadas", async () => {
    await disableDailyQuotes();
    expect(plugin.cancel.mock.calls[0][0].notifications).toHaveLength(30);
    expect(localStorage.getItem("pushNotifications")).toBe("false");
  });

  it("refresh no programa si están desactivadas", async () => {
    await refreshDailyQuotes();
    expect(plugin.schedule).not.toHaveBeenCalled();
  });

  it("refresh no pide permiso y no programa si no está concedido", async () => {
    localStorage.setItem("pushNotifications", "true");
    plugin.checkPermissions.mockResolvedValue({ display: "denied" });
    await refreshDailyQuotes();
    expect(plugin.requestPermissions).not.toHaveBeenCalled();
    expect(plugin.schedule).not.toHaveBeenCalled();
  });

  it("refresh repone la ventana si están activadas y con permiso", async () => {
    localStorage.setItem("pushNotifications", "true");
    await refreshDailyQuotes();
    expect(plugin.schedule).toHaveBeenCalledTimes(1);
  });

  it("en web todo es no-op", async () => {
    platform.native = false;
    expect(await enableDailyQuotes()).toBe("unavailable");
    await refreshDailyQuotes();
    await disableDailyQuotes();
    expect(plugin.schedule).not.toHaveBeenCalled();
    expect(plugin.cancel).not.toHaveBeenCalled();
  });
});
