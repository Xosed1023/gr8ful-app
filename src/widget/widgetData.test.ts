import { beforeEach, describe, expect, it, vi } from "vitest";

const bridge = vi.hoisted(() => ({
  setData: vi.fn().mockResolvedValue(undefined),
  requestPin: vi.fn(),
}));
const platform = vi.hoisted(() => ({ name: "ios" }));

vi.mock("@capacitor/core", () => ({
  Capacitor: { getPlatform: () => platform.name },
  registerPlugin: () => bridge,
}));

import { Phrase } from "../models/Phrase";
import { buildWidgetPayload, requestWidgetPin, writeWidgetData } from "./widgetData";

const phrase = (id: number): Phrase =>
  ({
    id,
    author: `Autor ${id}`,
    type: "Motivation",
    content: { es: `es ${id}`, en: `en ${id}`, fr: `fr ${id}` },
    isFavorite: false,
    hasShown: false,
  }) as Phrase;

const byId = new Map([1, 2, 3].map((id) => [id, phrase(id)]));
const plan = {
  topicsKey: "",
  days: [
    { date: "2026-10-02", phraseId: 1 }, // ayer
    { date: "2026-10-03", phraseId: 2 },
    { date: "2026-10-04", phraseId: 3 },
    { date: "2026-10-05", phraseId: 99 }, // frase inexistente
  ],
};
const NOW = new Date(2026, 9, 3, 10, 0);

describe("buildWidgetPayload", () => {
  it("resuelve frase y autor en el idioma de la app, de hoy en adelante", () => {
    const p = buildWidgetPayload({ plan, byId, language: "fr", gender: "M", now: NOW });
    expect(p.v).toBe(1);
    expect(p.language).toBe("fr");
    expect(p.gender).toBe("M");
    expect(p.days).toEqual([
      { date: "2026-10-03", quote: "fr 2", author: "Autor 2" },
      { date: "2026-10-04", quote: "fr 3", author: "Autor 3" },
    ]);
  });

  it("omite las frases que ya no existen", () => {
    const p = buildWidgetPayload({ plan, byId, language: "es", gender: "W", now: NOW });
    expect(p.days.map((d) => d.date)).not.toContain("2026-10-05");
  });
});

describe("writeWidgetData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    platform.name = "ios";
  });

  const payload = buildWidgetPayload({ plan, byId, language: "es", gender: "W", now: NOW });

  it("en iOS entrega el JSON al plugin", async () => {
    await writeWidgetData(payload);
    expect(bridge.setData).toHaveBeenCalledTimes(1);
    expect(JSON.parse(bridge.setData.mock.calls[0][0].json)).toEqual(payload);
  });

  it("en Android también entrega el JSON al plugin", async () => {
    platform.name = "android";
    await writeWidgetData(payload);
    expect(bridge.setData).toHaveBeenCalledTimes(1);
    expect(JSON.parse(bridge.setData.mock.calls[0][0].json)).toEqual(payload);
  });

  it("en la web no hace nada", async () => {
    platform.name = "web";
    await writeWidgetData(payload);
    expect(bridge.setData).not.toHaveBeenCalled();
  });

  it("un fallo del plugin no se propaga", async () => {
    bridge.setData.mockRejectedValueOnce(new Error("sin grupo"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(writeWidgetData(payload)).resolves.toBeUndefined();
    spy.mockRestore();
  });
});

describe("requestWidgetPin", () => {
  const NOT_SUPPORTED = { supported: false, requested: false, alreadyAdded: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("en Android devuelve lo que responde el plugin", async () => {
    platform.name = "android";
    bridge.requestPin.mockResolvedValueOnce({ supported: true, requested: true, alreadyAdded: false });
    await expect(requestWidgetPin()).resolves.toEqual({ supported: true, requested: true, alreadyAdded: false });
    expect(bridge.requestPin).toHaveBeenCalledTimes(1);
  });

  it("en iOS y en la web no llama al plugin y devuelve «no soportado»", async () => {
    platform.name = "ios";
    await expect(requestWidgetPin()).resolves.toEqual(NOT_SUPPORTED);
    platform.name = "web";
    await expect(requestWidgetPin()).resolves.toEqual(NOT_SUPPORTED);
    expect(bridge.requestPin).not.toHaveBeenCalled();
  });

  it("un fallo del plugin se trata como «no soportado»", async () => {
    platform.name = "android";
    bridge.requestPin.mockRejectedValueOnce(new Error("sin launcher"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(requestWidgetPin()).resolves.toEqual(NOT_SUPPORTED);
    spy.mockRestore();
  });
});
