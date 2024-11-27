import { useEffect, useState } from "react";
import {
  addOrUpdatePhrase,
  getPhraseById,
  getRandomPhrase,
  initDB
} from "../persistence/IndexedDBService";

const Home = () => {
  const [phrase, setPhrase] = useState<string | null>(null);

  useEffect(() => {
    // Inicializar la base de datos
    initDB().then(() => {
      loadRandomPhrase();
    });
  }, []);

  const loadRandomPhrase = async () => {
    const randomPhrase = await getRandomPhrase();
    if (randomPhrase) {
      // Actualizar la frase en la base de datos con la fecha actual
      await updateHistoryDate(randomPhrase.id!);
      setPhrase(randomPhrase.content.es); // Mostrar en español, puedes cambiarlo dinámicamente
    }
  };

  const updateHistoryDate = async (id: number) => {
    const phrase = await getPhraseById(id);
    if (phrase) {
      phrase.hasShown = true;
      await addOrUpdatePhrase(phrase);
    }
  };

  return (
    <div>
      <h1>Frase Motivacional del Día</h1>
      <p>{phrase || "Cargando..."}</p>
      <button onClick={loadRandomPhrase}>Nueva Frase</button>
    </div>
  );
};

export default Home;
