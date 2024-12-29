import { Phrase } from "../models/Phrase";
import { openDB, IDBPDatabase } from 'idb';

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
  // TODO Revisar el true en getAllFromIndex
  return await db.getAllFromIndex(STORE_NAME, 'isFavorite', "true");
}

export async function toggleFavorite(id: number, isFavorite: boolean) {
  if (!db) throw new Error('Database not initialized');
  const phrase = await db.get(STORE_NAME, id);
  if (phrase) {
    phrase.isFavorite = isFavorite;
    await addOrUpdatePhrase(phrase); // Actualizamos la frase
  }
}

export async function getRandomPhrase(typesToFilter: string[] = []): Promise<Phrase | null> {
  if (!db) throw new Error('Database not initialized');
  const phrases = await db.getAll(STORE_NAME);
  if (phrases.length === 0) return null;


  // Se filtran por las frases que no se han mostrado
  let finalPhrases = phrases.filter(phrase => phrase.hasShown === false);
  console.log("Frases sin mostrar: ", finalPhrases.length);

  // Se filtran las frases por los topicos seleccinados
  if(typesToFilter.length > 0) {
    console.log({typesToFilter})
    finalPhrases = finalPhrases.filter(phrase => typesToFilter.includes(phrase.type));
    console.log("Frases con topicos de usuario: ", finalPhrases.length);
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