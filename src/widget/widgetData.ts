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

/** Plugin nativo local (ios/App/App/WidgetBridgePlugin.swift y android/.../WidgetBridgePlugin.java). */
interface WidgetBridgePlugin {
  setData(options: { json: string }): Promise<void>;
  /** Solo Android: pide al launcher fijar el widget en la pantalla de inicio. */
  requestPin(): Promise<WidgetPinResult>;
}

/**
 * Resultado de pedir fijar el widget. `supported` = el launcher admite fijarlo desde la app;
 * `requested` = se lanzó la petición (el sistema pide confirmar); `alreadyAdded` = ya hay uno.
 */
export interface WidgetPinResult {
  supported: boolean;
  requested: boolean;
  alreadyAdded: boolean;
}

const NOT_SUPPORTED: WidgetPinResult = { supported: false, requested: false, alreadyAdded: false };
const WidgetBridge = registerPlugin<WidgetBridgePlugin>("WidgetBridge");

/**
 * Entrega el contenido al widget: el plugin lo guarda donde el widget puede leerlo (App Group
 * en iOS, SharedPreferences en Android) y pide al sistema redibujarlo. En la web no hace nada.
 */
export async function writeWidgetData(payload: WidgetPayload): Promise<void> {
  const platform = Capacitor.getPlatform();
  if (platform !== "ios" && platform !== "android") return;
  try {
    await WidgetBridge.setData({ json: JSON.stringify(payload) });
  } catch (error) {
    // Un fallo del widget nunca debe afectar a la app
    console.error("Error al actualizar el widget", error);
  }
}

/**
 * Pide al sistema fijar el widget en la pantalla de inicio. Solo Android lo permite; en iOS (y
 * en la web) no hace nada y devuelve «no soportado», así que la UI muestra las instrucciones.
 */
export async function requestWidgetPin(): Promise<WidgetPinResult> {
  if (Capacitor.getPlatform() !== "android") return NOT_SUPPORTED;
  try {
    return await WidgetBridge.requestPin();
  } catch (error) {
    console.error("Error al pedir fijar el widget", error);
    return NOT_SUPPORTED;
  }
}
