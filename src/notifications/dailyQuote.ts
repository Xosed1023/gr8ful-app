import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Phrase } from "../models/Phrase";
import { Topic } from "../models/Topic";
import { getAllPhrases } from "../persistence/IndexedDBService";
import {
  AppNotificationsLanguage,
  LanguageKeys,
} from "../persistence/languages";

/** IDs fijos 7000..7029: reprogramar reemplaza, nunca duplica (FR-012). */
export const NOTIFICATION_BASE_ID = 7000;
export const NOTIFICATION_DAYS = 30;
const CHANNEL_ID = "daily-quote";
const DEFAULT_HOUR = 12;

export interface ScheduledQuote {
  id: number;
  at: Date;
  title: string;
  body: string;
  phraseId?: number;
}

export type EnableResult = "scheduled" | "denied" | "unavailable";

interface BuildScheduleInput {
  phrases: Phrase[];
  topics: Topic[];
  language: LanguageKeys;
  hour: number;
  now: Date;
  days?: number;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Orden de uso: no vistas primero, luego vistas, barajadas dentro de cada grupo. */
function orderByPreference(phrases: Phrase[]): Phrase[] {
  return [
    ...shuffle(phrases.filter((p) => !p.hasShown)),
    ...shuffle(phrases.filter((p) => p.hasShown)),
  ];
}

/**
 * Calendario de las próximas notificaciones (función pura): una por día a la
 * hora `hour` local, frases distintas mientras haya suficientes. La primera
 * fecha es hoy si la hora aún no pasó; si no, mañana.
 */
export function buildSchedule({
  phrases,
  topics,
  language,
  hour,
  now,
  days = NOTIFICATION_DAYS,
}: BuildScheduleInput): ScheduledQuote[] {
  if (phrases.length === 0) return [];

  const topicKeys = topics.map((t) => t.key.toLowerCase());
  const inTopics = (p: Phrase) =>
    topicKeys.length === 0 || topicKeys.includes(p.type.toLowerCase());
  const pool = [
    ...orderByPreference(phrases.filter(inTopics)),
    ...orderByPreference(phrases.filter((p) => !inTopics(p))),
  ];

  const first = new Date(now);
  first.setHours(hour, 0, 0, 0);
  const startOffset = first.getTime() > now.getTime() ? 0 : 1;

  const title = "Gr8ful";
  return Array.from({ length: days }, (_, i) => {
    const phrase = pool[i % pool.length];
    const at = new Date(now);
    at.setDate(at.getDate() + startOffset + i);
    at.setHours(hour, 0, 0, 0);
    return {
      id: NOTIFICATION_BASE_ID + i,
      at,
      title,
      body: `${phrase.content[language]}\n— ${phrase.author}`,
      phraseId: phrase.id,
    };
  });
}

const allIds = () =>
  Array.from({ length: NOTIFICATION_DAYS }, (_, i) => ({
    id: NOTIFICATION_BASE_ID + i,
  }));

const readLanguage = (): LanguageKeys => {
  const stored = localStorage.getItem("language");
  return stored === "es" || stored === "fr" ? stored : "en";
};

const readTopics = (): Topic[] => {
  try {
    return JSON.parse(localStorage.getItem("topics") || "[]");
  } catch {
    return [];
  }
};

const readHour = (): number => {
  const hour = parseInt(localStorage.getItem("time") ?? "", 10);
  return [6, 12, 18].includes(hour) ? hour : DEFAULT_HOUR;
};

async function ensureAndroidChannel(language: LanguageKeys) {
  if (Capacitor.getPlatform() !== "android") return;
  await LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: AppNotificationsLanguage.channelName[language],
    importance: 3,
    visibility: 1,
  });
}

/** Cancela las pendientes y programa la ventana actual (sin comprobar permiso). */
async function scheduleWindow() {
  const language = readLanguage();
  const phrases = await getAllPhrases();
  const queue = buildSchedule({
    phrases,
    topics: readTopics(),
    language,
    hour: readHour(),
    now: new Date(),
  });

  await LocalNotifications.cancel({ notifications: allIds() });
  if (queue.length === 0) return;
  await ensureAndroidChannel(language);
  await LocalNotifications.schedule({
    notifications: queue.map((q) => ({
      id: q.id,
      title: q.title,
      body: q.body,
      channelId: CHANNEL_ID,
      schedule: { at: q.at, allowWhileIdle: true },
      extra: { phraseId: q.phraseId },
    })),
  });
}

/**
 * Activa las notificaciones: pide el permiso si hace falta y programa.
 * Si no hay hora guardada usa 12:00 (FR-014).
 */
export async function enableDailyQuotes(): Promise<EnableResult> {
  if (!Capacitor.isNativePlatform()) return "unavailable";
  try {
    let status = await LocalNotifications.checkPermissions();
    if (status.display === "prompt" || status.display === "prompt-with-rationale") {
      status = await LocalNotifications.requestPermissions();
    }
    if (status.display !== "granted") {
      localStorage.setItem("pushNotifications", "false");
      return "denied";
    }
    if (!localStorage.getItem("time")) localStorage.setItem("time", String(DEFAULT_HOUR));
    await scheduleWindow();
    localStorage.setItem("pushNotifications", "true");
    return "scheduled";
  } catch (error) {
    console.error("Error al activar notificaciones", error);
    localStorage.setItem("pushNotifications", "false");
    return "unavailable";
  }
}

/** Desactiva y cancela todas las pendientes. */
export async function disableDailyQuotes() {
  localStorage.setItem("pushNotifications", "false");
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.cancel({ notifications: allIds() });
  } catch (error) {
    console.error("Error al cancelar notificaciones", error);
  }
}

/**
 * Repone la ventana si las notificaciones están activadas y el permiso ya está
 * concedido. Nunca pide permiso (FR-009): se usa al abrir la app y tras cambiar
 * hora, idioma o temas.
 */
export async function refreshDailyQuotes() {
  if (!Capacitor.isNativePlatform()) return;
  if (localStorage.getItem("pushNotifications") !== "true") return;
  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display !== "granted") return;
    await scheduleWindow();
  } catch (error) {
    console.error("Error al reponer notificaciones", error);
  }
}
