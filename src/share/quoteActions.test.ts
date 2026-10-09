import { beforeEach, describe, expect, it, vi } from "vitest";

const plugins = vi.hoisted(() => ({
  write: vi.fn(),
  share: vi.fn(),
}));
vi.mock("@capacitor/clipboard", () => ({ Clipboard: { write: plugins.write } }));
vi.mock("@capacitor/share", () => ({ Share: { share: plugins.share } }));

import { copyQuote, shareQuoteText } from "./quoteActions";

beforeEach(() => {
  vi.clearAllMocks();
  plugins.write.mockResolvedValue(undefined);
  plugins.share.mockResolvedValue(undefined);
});

describe("copyQuote", () => {
  it("copia el texto tal cual y devuelve true", async () => {
    expect(await copyQuote("Hola")).toBe(true);
    expect(plugins.write).toHaveBeenCalledWith({ string: "Hola" });
  });

  it("devuelve false si el portapapeles falla", async () => {
    plugins.write.mockRejectedValue(new Error("sin permiso"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await copyQuote("Hola")).toBe(false);
    spy.mockRestore();
  });
});

describe("shareQuoteText", () => {
  it("comparte la frase con su autor", async () => {
    expect(await shareQuoteText("Frase", "Autor")).toBe(true);
    expect(plugins.share).toHaveBeenCalledWith({ text: "Frase\n\n— Autor" });
  });

  it("devuelve false si se cancela o falla", async () => {
    plugins.share.mockRejectedValue(new Error("cancelado"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await shareQuoteText("Frase", "Autor")).toBe(false);
    spy.mockRestore();
  });
});
