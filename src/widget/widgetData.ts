import { Capacitor, registerPlugin } from "@capacitor/core";
import { dateKey, DailyPlan } from "../daily/dailyPlan";
import { Phrase } from "../models/Phrase";
import { LanguageKeys } from "../persistence/languages";

/**
 * Contenido que lee el widget (esquema v1). Va ya resuelto —idioma, frase y autor—:
 * la extensión no tiene acceso a la base de datos de la app.
 */
export interface WidgetPayload {
  v: 1;
  language: LanguageKeys;
  /** "W" = mujer, "M" = hombre (decide la paleta). */
  gender: "W" | "M";
  updatedAt: number;
  days: { date: string; quote: string; author: string }[];
}

interface BuildPayloadInput {
  plan: DailyPlan;
  byId: Map<number, Phrase>;
  language: LanguageKeys;
  gender: "W" | "M";
  now: Date;
}

/** Plan → contenido del widget (función pura): solo de hoy en adelante. */
export function buildWidgetPayload({ plan, byId, language, gender, now }: BuildPayloadInput): WidgetPayload {
  const today = dateKey(now);
  const days = plan.days
    .filter((d) => d.date >= today)
    .flatMap((d) => {
      const phrase = byId.get(d.phraseId);
      return phrase ? [{ date: d.date, quote: phrase.content[language], author: phrase.author }] : [];
    });
  return { v: 1, language, gender, updatedAt: now.getTime(), days };
}

/** Plugin nativo local (ios/App/App/WidgetBridgePlugin.swift). */
interface WidgetBridgePlugin {
  setData(options: { json: string }): Promise<void>;
}
const WidgetBridge = registerPlugin<WidgetBridgePlugin>("WidgetBridge");

/**
 * Entrega el contenido al widget: el plugin lo guarda en el contenedor compartido del App
 * Group y pide al sistema recargar el widget. Solo existe en iOS; en el resto no hace nada.
 */
export async function writeWidgetData(payload: WidgetPayload): Promise<void> {
  if (Capacitor.getPlatform() !== "ios") return;
  try {
    await WidgetBridge.setData({ json: JSON.stringify(payload) });
  } catch (error) {
    // Un fallo del widget nunca debe afectar a la app
    console.error("Error al actualizar el widget", error);
  }
}
