import { describe, expect, it } from "vitest";
import { fitText, wrapText } from "./layoutQuote";

/** Medidor falso: cada carácter mide `fontSize * 0.5`. */
const measureAt = (fontSize: number) => (text: string) => text.length * fontSize * 0.5;

describe("wrapText", () => {
  it("deja una frase corta en un solo renglón", () => {
    expect(wrapText("hola mundo", 1000, measureAt(10))).toEqual(["hola mundo"]);
  });

  it("parte por palabras cuando no cabe", () => {
    // 10 caracteres por renglón como máximo (ancho 50 con 5 px por carácter)
    expect(wrapText("uno dos tres cuatro", 50, measureAt(10))).toEqual([
      "uno dos",
      "tres",
      "cuatro",
    ]);
  });

  it("mantiene una palabra más larga que el ancho en su propio renglón", () => {
    expect(wrapText("a supercalifragilistico b", 40, measureAt(10))).toEqual([
      "a",
      "supercalifragilistico",
      "b",
    ]);
  });

  it("ignora espacios repetidos y vacíos", () => {
    expect(wrapText("  uno   dos  ", 1000, measureAt(10))).toEqual(["uno dos"]);
    expect(wrapText("", 1000, measureAt(10))).toEqual([]);
  });
});

describe("fitText", () => {
  const base = { maxWidth: 200, minFont: 20, maxFont: 60, measureAt };

  it("usa el tamaño máximo si el texto cabe", () => {
    const fit = fitText({ ...base, text: "hola", maxHeight: 500 });
    expect(fit.fontSize).toBe(60);
    expect(fit.lines).toEqual(["hola"]);
  });

  it("reduce el tamaño hasta que el texto cabe en el alto", () => {
    const text = "una frase bastante larga para forzar varios renglones en la tarjeta";
    const fit = fitText({ ...base, text, maxHeight: 220 });
    expect(fit.fontSize).toBeLessThan(60);
    expect(fit.height).toBeLessThanOrEqual(220);
    expect(fit.lineHeight).toBe(Math.round(fit.fontSize * 1.35));
  });

  it("nunca baja del mínimo, aunque no quepa", () => {
    const text = "palabra ".repeat(80);
    const fit = fitText({ ...base, text, maxHeight: 50 });
    expect(fit.fontSize).toBe(20);
    expect(fit.lines.length).toBeGreaterThan(1);
  });

  it("encoge una palabra que se pasa del ancho", () => {
    const fit = fitText({ ...base, text: "supercalifragilisticoespialidoso", maxHeight: 1000 });
    const widest = Math.max(...fit.lines.map((l) => measureAt(fit.fontSize)(l)));
    expect(widest <= 200 || fit.fontSize === 20).toBe(true);
  });
});
