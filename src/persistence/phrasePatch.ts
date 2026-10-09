import { Phrase } from "../models/Phrase";

/** Lo mínimo que se necesita de un almacén (el objectStore de una transacción `readwrite`). */
export interface PhraseStore {
  get(id: number): Promise<Phrase | undefined>;
  put(phrase: Phrase): Promise<unknown>;
}

/** Campos que se cambian sueltos: nunca se reescribe el registro entero desde un objeto viejo. */
export type PhrasePatch = Partial<Pick<Phrase, "isFavorite" | "hasShown">>;

/**
 * Aplica un cambio parcial sobre el registro VIGENTE del almacén: lo lee, cambia solo esos
 * campos y lo escribe. Se llama dentro de una única transacción, así que nada puede colarse
 * entre la lectura y la escritura. Devuelve si la frase existía.
 */
export async function applyPhrasePatch(store: PhraseStore, id: number, patch: PhrasePatch): Promise<boolean> {
  const current = await store.get(id);
  if (!current) return false;
  await store.put({ ...current, ...patch });
  return true;
}

/**
 * Invierte el favorito del registro vigente (también en una sola transacción) y devuelve el
 * valor nuevo, o `null` si la frase no existe. Dos pulsaciones seguidas nunca se pisan: cada
 * una parte de lo que de verdad hay guardado, no de un icono que quizá esté obsoleto.
 */
export async function flipPhraseFavorite(store: PhraseStore, id: number): Promise<boolean | null> {
  const current = await store.get(id);
  if (!current) return null;
  const next = !current.isFavorite;
  await store.put({ ...current, isFavorite: next });
  return next;
}
