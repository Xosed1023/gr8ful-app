import { Clipboard } from "@capacitor/clipboard";
import { Share } from "@capacitor/share";

/**
 * Copiar y compartir como texto, compartidos por Home y Favoritos. Devuelven si la acción se
 * completó: quien llama decide qué avisar y si cuenta como momento de valor para los anuncios.
 */

/** Copia la frase al portapapeles. */
export async function copyQuote(text: string): Promise<boolean> {
  try {
    await Clipboard.write({ string: text });
    return true;
  } catch (error) {
    console.error("Error al copiar", error);
    return false;
  }
}

/** Abre la hoja de compartir del sistema con la frase y su autor. */
export async function shareQuoteText(text: string, author: string): Promise<boolean> {
  try {
    await Share.share({ text: `${text}\n\n— ${author}` });
    return true;
  } catch (error) {
    // Cancelar el share sheet nativo también rechaza la promesa en algunas plataformas
    // (p. ej. iOS): no es necesariamente un error real, así que no se avisa (research.md Decisión 4).
    console.error("Error al compartir", error);
    return false;
  }
}
