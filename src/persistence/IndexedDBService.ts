import { Phrase } from "../models/Phrase";
import { Topic } from "../models/Topic";
import { openDB, IDBPDatabase } from 'idb';
import { applyPhrasePatch, flipPhraseFavorite, PhrasePatch } from './phrasePatch';

const DB_NAME = 'motivationalPhrasesDB';
const STORE_NAME = 'phrases';

let db: IDBPDatabase | null = null;

export async function initDB() {
  db = await openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('author', 'author');
        store.createIndex('type', 'type');
        store.createIndex('isFavorite', 'isFavorite'); // Índice para buscar por favoritos
        store.createIndex('hasShown', 'hasShown'); // Índice para el historial diario
      }
    },
  });
}

export async function addOrUpdatePhrase(phrase: Phrase) {
  if (!db) throw new Error('Database not initialized');
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.put(phrase);
  await tx.done;
}


export async function getFavoritePhrases(): Promise<Phrase[]> {
  if (!db) throw new Error('Database not initialized');
  // No se usa el índice 'isFavorite': IndexedDB no admite `boolean` como tipo
  // de clave válido (spec: solo number/string/Date/binario/array de esos), por
  // lo que un índice sobre un campo boolean nunca indexa ningún registro. Se
  // filtra en memoria, mismo patrón ya usado para `hasShown` en getRandomPhrase.
  const phrases = await db.getAll(STORE_NAME);
  return phrases.filter((phrase) => phrase.isFavorite === true);
}

/**
 * Cambia campos sueltos de una frase en UNA transacción sobre el registro vigente (ver
 * phrasePatch.ts). Es la forma de escribir `isFavorite`/`hasShown`: reescribir la frase entera
 * desde un objeto cargado antes pisaría cambios hechos mientras tanto.
 */
export async function patchPhrase(id: number, patch: PhrasePatch): Promise<boolean> {
  if (!db) throw new Error('Database not initialized');
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const found = await applyPhrasePatch(tx.store, id, patch);
  await tx.done;
  return found;
}

export async function toggleFavorite(id: number, isFavorite: boolean) {
  await patchPhrase(id, { isFavorite });
}

/** Invierte el favorito de la frase tal como está guardado y devuelve el valor nuevo. */
export async function flipFavorite(id: number): Promise<boolean | null> {
  if (!db) throw new Error('Database not initialized');
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const next = await flipPhraseFavorite(tx.store, id);
  await tx.done;
  return next;
}

/** Marca la frase como mostrada sin tocar el resto de sus campos. */
export async function markPhraseShown(id: number) {
  await patchPhrase(id, { hasShown: true });
}

export async function getAllPhrases(): Promise<Phrase[]> {
  if (!db) throw new Error('Database not initialized');
  return db.getAll(STORE_NAME);
}

export async function getRandomPhrase(typesToFilter: Topic[] = []): Promise<Phrase | null> {
  if (!db) throw new Error('Database not initialized');
  const phrases = await db.getAll(STORE_NAME);
  if (phrases.length === 0) return null;


  // Se filtran por las frases que no se han mostrado
  let finalPhrases = phrases.filter(phrase => phrase.hasShown === false);
  // Se filtran las frases por los topicos seleccinados
  if(typesToFilter.length > 0) {
    finalPhrases = finalPhrases.filter(phrase => typesToFilter.some(topic => topic.key.toLowerCase() === phrase.type.toLowerCase()));
  }

  // Si se encuentra que las frases han sido mostradas todas se reinicia el atributo hasShown
  if (finalPhrases.length === 0) {
    phrases.forEach(phrase => {
      phrase.hasShown = false;
      addOrUpdatePhrase(phrase);
    });
    finalPhrases = phrases.filter(phrase => phrase.hasShown === false);
  }
  const randomIndex = Math.floor(Math.random() * finalPhrases.length);
  return finalPhrases[randomIndex];
}

export async function addPhrasesBatch(phrases: Phrase[]) {
  if (!db) throw new Error('Database not initialized');
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const phrase of phrases) {
    await tx.store.add(phrase);
  }
  await tx.done;
}

export async function getPhraseById(id: number): Promise<Phrase | null> {
  if (!db) throw new Error('Database not initialized');
  return await db.get(STORE_NAME, id);
}