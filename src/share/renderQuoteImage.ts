import { QUOTE_MARKS } from "../components/common/quoteMarks";
import { LanguageKeys } from "../persistence/languages";
import { fitText } from "./layoutQuote";

export type ShareFormat = "story" | "square";

export const FORMAT_SIZE: Record<ShareFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
};

export interface RenderQuoteParams {
  quote: string;
  author: string;
  language: LanguageKeys;
  format: ShareFormat;
  isMale: boolean;
  isDark: boolean;
}

interface Palette {
  base: string;
  /** Manchas de fondo: arriba-izquierda, derecha y abajo. */
  glows: [string, string, string];
  accent: string;
  text: string;
  muted: string;
  card: string;
  cardEdge: string;
  watermark: string;
}

/**
 * Colores de la imagen por género y tema. Reflejan los tokens de `src/theme/variables.css`
 * (--background-color, --glow-*, --step-active, --glass-bg…): el canvas se dibuja fuera del
 * DOM de la app, así que no puede leer las variables CSS de forma fiable.
 */
const PALETTES: Record<"woman" | "man", Record<"light" | "dark", Palette>> = {
  woman: {
    light: {
      base: "#F8F6F6",
      glows: ["rgba(217,172,253,0.60)", "rgba(141,205,255,0.55)", "rgba(232,221,255,0.70)"],
      accent: "#5602D3",
      text: "#1B1C1C",
      muted: "#6B6578",
      card: "rgba(255,255,255,0.78)",
      cardEdge: "rgba(255,255,255,0.9)",
      watermark: "rgba(25,16,76,0.55)",
    },
    dark: {
      base: "#0F1220",
      glows: ["rgba(74,39,168,0.60)", "rgba(30,95,138,0.50)", "rgba(91,63,168,0.45)"],
      accent: "#A58BFF",
      text: "#ECEAF4",
      muted: "#A9A7BD",
      card: "rgba(26,29,46,0.78)",
      cardEdge: "rgba(255,255,255,0.14)",
      watermark: "rgba(236,234,244,0.55)",
    },
  },
  man: {
    light: {
      base: "#F8F6F6",
      glows: ["rgba(137,206,255,0.65)", "rgba(57,184,253,0.40)", "rgba(202,230,255,0.75)"],
      accent: "#006493",
      text: "#1B1C1C",
      muted: "#5B6B78",
      card: "rgba(255,255,255,0.78)",
      cardEdge: "rgba(255,255,255,0.9)",
      watermark: "rgba(13,58,92,0.55)",
    },
    dark: {
      base: "#0C1520",
      glows: ["rgba(30,95,138,0.65)", "rgba(0,100,147,0.50)", "rgba(24,60,92,0.55)"],
      accent: "#8FC4E8",
      text: "#ECEAF4",
      muted: "#A9B7C4",
      card: "rgba(26,36,50,0.78)",
      cardEdge: "rgba(255,255,255,0.14)",
      watermark: "rgba(236,234,244,0.55)",
    },
  },
};

const LANGUAGE_LABEL: Record<LanguageKeys, string> = {
  en: "ENGLISH",
  es: "ESPAÑOL",
  fr: "FRANÇAIS",
};

const FONT = "Montserrat, -apple-system, system-ui, 'Segoe UI', sans-serif";

/** Espera las tipografías de la app; sin red se usa la de respaldo del sistema. */
async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load("600 40px Montserrat"),
      document.fonts.load("500 40px Montserrat"),
      document.fonts.load("italic 500 40px Montserrat"),
    ]);
  } catch {
    // sin tipografía de la app: se dibuja con la de respaldo
  }
}

function loadImage(src: string, timeoutMs = 4000): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(null), timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Texto con separación entre letras, centrado en `cx` (ctx.letterSpacing no es fiable en Safari). */
function drawSpaced(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (widths.length - 1);
  let x = cx - total / 2;
  const align = ctx.textAlign;
  ctx.textAlign = "left";
  [...text].forEach((ch, i) => {
    ctx.fillText(ch, x, y);
    x += widths[i] + spacing;
  });
  ctx.textAlign = align;
}

/** Dibuja el logo teñido con `color` (silueta + opacidad) o, si no carga, el nombre en texto. */
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  color: string,
  cx: number,
  centerY: number,
  size: number
) {
  if (!logo) {
    ctx.fillStyle = color;
    ctx.font = `700 ${Math.round(size * 0.42)}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Gr8ful", cx, centerY);
    return;
  }
  const tint = document.createElement("canvas");
  tint.width = tint.height = Math.round(size * 2); // el doble de resolución para que no se vea blando
  const tctx = tint.getContext("2d");
  if (!tctx) return;
  tctx.drawImage(logo, 0, 0, tint.width, tint.height);
  tctx.globalCompositeOperation = "source-in";
  tctx.fillStyle = color;
  tctx.fillRect(0, 0, tint.width, tint.height);
  ctx.drawImage(tint, cx - size / 2, centerY - size / 2, size, size);
}

/**
 * Dibuja la imagen para compartir y la devuelve como data URL PNG.
 * Todo ocurre en el dispositivo, sin red (las tipografías y el logo ya viajan con la app).
 */
export async function renderQuoteImage(params: RenderQuoteParams): Promise<string> {
  const { quote, author, language, format, isMale, isDark } = params;
  const { width: W, height: H } = FORMAT_SIZE[format];
  const palette = PALETTES[isMale ? "man" : "woman"][isDark ? "dark" : "light"];

  const [, logo] = await Promise.all([ensureFonts(), loadImage("./logo.svg")]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");

  // --- Fondo: color base + manchas (degradados radiales; ctx.filter no es fiable en Safari)
  ctx.fillStyle = palette.base;
  ctx.fillRect(0, 0, W, H);
  const blobs: [number, number, number, string][] = [
    [W * 0.1, H * 0.08, W * 0.75, palette.glows[0]],
    [W * 0.98, H * 0.55, W * 0.7, palette.glows[1]],
    [W * 0.4, H * 1.0, W * 0.8, palette.glows[2]],
  ];
  for (const [x, y, r, color] of blobs) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // --- Medidas de la tarjeta
  const isStory = format === "story";
  const cardW = 900;
  const cardX = (W - cardW) / 2;
  const padding = 76;
  const textW = cardW - padding * 2;
  const areaTop = isStory ? 250 : 80;
  const areaBottom = isStory ? 1520 : 880;
  const areaH = areaBottom - areaTop;

  const labelH = 30;
  const gap = 56;
  const ruleH = 6;
  const authorFont = 38;
  const authorH = 50;
  const overhead = padding * 2 + labelH + gap + gap + ruleH + 40 + authorH;

  const [open, close] = QUOTE_MARKS[language];
  const fit = fitText({
    text: `${open}${quote}${close}`,
    maxWidth: textW,
    maxHeight: areaH - overhead,
    maxFont: isStory ? 76 : 64,
    minFont: 34,
    measureAt: (size) => {
      ctx.font = `500 ${size}px ${FONT}`;
      return (text) => ctx.measureText(text).width;
    },
  });

  const cardH = overhead + fit.height;
  const cardY = areaTop + (areaH - cardH) / 2;

  // --- Tarjeta de vidrio
  ctx.save();
  ctx.shadowColor = isDark ? "rgba(0,0,0,0.5)" : "rgba(15,23,42,0.18)";
  ctx.shadowBlur = 70;
  ctx.shadowOffsetY = 26;
  roundedRect(ctx, cardX, cardY, cardW, cardH, 72);
  ctx.fillStyle = palette.card;
  ctx.fill();
  ctx.restore();
  roundedRect(ctx, cardX, cardY, cardW, cardH, 72);
  ctx.lineWidth = 2;
  ctx.strokeStyle = palette.cardEdge;
  ctx.stroke();

  // --- Contenido
  const cx = W / 2;
  let y = cardY + padding;

  ctx.textBaseline = "top";
  ctx.fillStyle = palette.accent;
  ctx.font = `600 ${labelH - 4}px ${FONT}`;
  drawSpaced(ctx, LANGUAGE_LABEL[language], cx, y, 6);
  y += labelH + gap;

  ctx.textAlign = "center";
  ctx.fillStyle = palette.text;
  ctx.font = `500 ${fit.fontSize}px ${FONT}`;
  for (const line of fit.lines) {
    ctx.fillText(line, cx, y);
    y += fit.lineHeight;
  }
  y += gap;

  roundedRect(ctx, cx - 48, y, 96, ruleH, ruleH / 2);
  ctx.fillStyle = palette.accent;
  ctx.fill();
  y += ruleH + 40;

  ctx.fillStyle = palette.muted;
  ctx.font = `italic 500 ${authorFont}px ${FONT}`;
  let authorText = `— ${author}`;
  while (ctx.measureText(authorText).width > textW && authorText.length > 6) {
    authorText = authorText.slice(0, -2) + "…";
  }
  ctx.fillText(authorText, cx, y);

  // --- Marca de agua
  const logoSize = isStory ? 170 : 120;
  drawWatermark(ctx, logo, palette.watermark, cx, H - (isStory ? 190 : 100), logoSize);

  return canvas.toDataURL("image/png");
}
