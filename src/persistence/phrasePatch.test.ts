import { describe, expect, it } from "vitest";
import { Phrase } from "../models/Phrase";
import { applyPhrasePatch, flipPhraseFavorite, PhraseStore } from "./phrasePatch";

const phrase = (over: Partial<Phrase> = {}): Phrase =>
  ({
    id: 1,
    author: "Autor",
    type: "Motivation",
    content: { es: "es", en: "en", fr: "fr" },
    isFavorite: false,
    hasShown: false,
    ...over,
  }) as Phrase;

/** Almacén en memoria; `put` es asíncrono para que las pruebas puedan intercalar escrituras. */
function memoryStore(initial: Phrase[]) {
  const data = new Map(initial.map((p) => [p.id as number, p]));
  const store: PhraseStore & { data: Map<number, Phrase> } = {
    data,
    get: async (id) => data.get(id),
    put: async (p) => {
      await Promise.resolve();
      data.set(p.id as number, p);
    },
  };
  return store;
}

describe("applyPhrasePatch", () => {
  it("cambia solo los campos indicados y conserva el resto", async () => {
    const store = memoryStore([phrase({ isFavorite: true })]);
    expect(await applyPhrasePatch(store, 1, { hasShown: true })).toBe(true);
    expect(store.data.get(1)).toMatchObject({ isFavorite: true, hasShown: true });
  });

  it("no pisa un favorito cambiado después de cargar la frase (el caso del bug)", async () => {
    // La pantalla cargó la frase cuando NO era favorita...
    const store = memoryStore([phrase({ isFavorite: false })]);
    // ...luego se guardó como favorita en otra parte...
    await applyPhrasePatch(store, 1, { isFavorite: true });
    // ...y marcarla como vista no debe devolverla a «no favorita» con el objeto viejo.
    await applyPhrasePatch(store, 1, { hasShown: true });
    expect(store.data.get(1)?.isFavorite).toBe(true);
  });

  it("devuelve false si la frase no existe y no escribe nada", async () => {
    const store = memoryStore([]);
    expect(await applyPhrasePatch(store, 9, { hasShown: true })).toBe(false);
    expect(store.data.size).toBe(0);
  });
});

describe("flipPhraseFavorite", () => {
  it("invierte lo guardado y devuelve el valor nuevo", async () => {
    const store = memoryStore([phrase({ isFavorite: false })]);
    expect(await flipPhraseFavorite(store, 1)).toBe(true);
    expect(store.data.get(1)?.isFavorite).toBe(true);
    expect(await flipPhraseFavorite(store, 1)).toBe(false);
    expect(store.data.get(1)?.isFavorite).toBe(false);
  });

  it("parte de lo que hay guardado aunque el icono estuviera obsoleto", async () => {
    // Se quitó de favoritos desde otra pestaña: la base dice false.
    const store = memoryStore([phrase({ isFavorite: false })]);
    // Un icono obsoleto «guardada» pulsaría para «quitar»; aquí se parte de la base y se guarda.
    expect(await flipPhraseFavorite(store, 1)).toBe(true);
  });

  it("devuelve null si la frase no existe", async () => {
    expect(await flipPhraseFavorite(memoryStore([]), 7)).toBeNull();
  });
});
