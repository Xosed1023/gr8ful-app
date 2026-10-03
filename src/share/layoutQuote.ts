/** Devuelve el ancho (px) de un texto con la tipografía ya aplicada. */
export type Measure = (text: string) => number;

/** Parte un texto en renglones por palabras sin pasar de `maxWidth`. */
export function wrapText(text: string, maxWidth: number, measure: Measure): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    // Una palabra sola siempre entra en su propio renglón aunque se pase del ancho
    if (!current || measure(candidate) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export interface FitOptions {
  text: string;
  maxWidth: number;
  maxHeight: number;
  maxFont: number;
  minFont: number;
  /** Cuánto se reduce el tamaño en cada intento. */
  step?: number;
  /** Alto de renglón como múltiplo del tamaño de letra. */
  lineHeightRatio?: number;
  /** Medidor de ancho para un tamaño de letra concreto. */
  measureAt: (fontSize: number) => Measure;
}

export interface FitResult {
  fontSize: number;
  lineHeight: number;
  lines: string[];
  /** Alto total del bloque de texto. */
  height: number;
}

/**
 * Busca el tamaño de letra más grande (entre `maxFont` y `minFont`) con el que el
 * texto cabe entero: sin pasar de `maxHeight` y sin ningún renglón más ancho que
 * `maxWidth`. Si ni el mínimo cabe, devuelve el mínimo (nunca corta texto).
 */
export function fitText({
  text,
  maxWidth,
  maxHeight,
  maxFont,
  minFont,
  step = 4,
  lineHeightRatio = 1.35,
  measureAt,
}: FitOptions): FitResult {
  let result: FitResult | null = null;
  for (let size = maxFont; size >= minFont; size -= step) {
    const measure = measureAt(size);
    const lines = wrapText(text, maxWidth, measure);
    const lineHeight = Math.round(size * lineHeightRatio);
    const height = lines.length * lineHeight;
    result = { fontSize: size, lineHeight, lines, height };
    const widest = Math.max(...lines.map((line) => measure(line)));
    if (height <= maxHeight && widest <= maxWidth) return result;
  }
  return result as FitResult;
}
