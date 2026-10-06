import { Phrase } from "../models/Phrase";
import { Topic } from "../models/Topic";
import { getAllPhrases } from "../persistence/IndexedDBService";

/** Días que cubre el plan (una frase por día). */
export const PLAN_DAYS = 30;
/** Si quedan menos días que estos desde hoy, el plan se repone. */
export const MIN_DAYS_LEFT = 14;
const STORAGE_KEY = "dailyPlan";

export interface PlanDay {
  /** Día local, `YYYY-MM-DD`. */
  date: string;
  phraseId: number;
}

/**
 * Plan diario único: qué frase toca cada día. Lo comparten las notificaciones y el
 * widget, así que la frase del día es la misma en ambos. Guarda ids (no textos): cambiar
 * el idioma no obliga a rehacerlo.
 */
export interface DailyPlan {
  topicsKey: string;
  days: PlanDay[];
}

export const dateKey = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const addDays = (date: Date, days: number): Date => {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
};

/** Identifica un conjunto de temas, sin importar el orden ni las mayúsculas. */
export const topicsKeyOf = (topics: Topic[]): string =>
  topics
    .map((t) => t.key.toLowerCase())
    .sort()
    .join("|");

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

/** Frases de los temas elegidos primero (o todas si no hay temas), luego el resto. */
export function orderPool(phrases: Phrase[], topics: Topic[]): Phrase[] {
  const keys = topics.map((t) => t.key.toLowerCase());
  const inTopics = (p: Phrase) => keys.length === 0 || keys.includes(p.type.toLowerCase());
  return [
    ...orderByPreference(phrases.filter(inTopics)),
    ...orderByPreference(phrases.filter((p) => !inTopics(p))),
  ];
}

interface BuildPlanInput {
  phrases: Phrase[];
  topics: Topic[];
  start: Date;
  days?: number;
  /** Frase que ya tocaba hoy: se conserva al rehacer el plan. */
  keepToday?: number;
}

/** Construye un plan (función pura): una frase distinta por día mientras haya suficientes. */
export function buildPlan({
  phrases,
  topics,
  start,
  days = PLAN_DAYS,
  keepToday,
}: BuildPlanInput): DailyPlan {
  const withId = phrases.filter((p): p is Phrase & { id: number } => p.id != null);
  let pool = orderPool(withId, topics) as (Phrase & { id: number })[];
  const kept = keepToday != null ? pool.find((p) => p.id === keepToday) : undefined;
  if (kept) pool = [kept, ...pool.filter((p) => p.id !== kept.id)];

  return {
    topicsKey: topicsKeyOf(topics),
    days:
      pool.length === 0
        ? []
        : Array.from({ length: days }, (_, i) => ({
            date: dateKey(addDays(start, i)),
            phraseId: pool[i % pool.length].id,
          })),
  };
}

interface ResolveInput {
  stored: DailyPlan | null;
  phrases: Phrase[];
  topics: Topic[];
  now: Date;
}

/**
 * Decide si el plan guardado sigue valiendo o hay que rehacerlo. Vale si es de los mismos
 * temas, incluye hoy, quedan al menos `MIN_DAYS_LEFT` días y todas sus frases existen.
 * Al rehacerlo se conserva la frase de hoy (si los temas no cambiaron).
 */
export function resolvePlan({ stored, phrases, topics, now }: ResolveInput): {
  plan: DailyPlan;
  changed: boolean;
} {
  const today = dateKey(now);
  const key = topicsKeyOf(topics);
  const ids = new Set(phrases.map((p) => p.id));
  const sameTopics = stored?.topicsKey === key;
  const remaining = stored ? stored.days.filter((d) => d.date >= today) : [];
  const usable =
    !!stored &&
    sameTopics &&
    remaining.length >= MIN_DAYS_LEFT &&
    remaining[0].date === today &&
    remaining.every((d) => ids.has(d.phraseId));

  if (usable && stored) return { plan: stored, changed: false };

  const todayEntry = sameTopics ? remaining.find((d) => d.date === today) : undefined;
  return {
    plan: buildPlan({
      phrases,
      topics,
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      keepToday: todayEntry && ids.has(todayEntry.phraseId) ? todayEntry.phraseId : undefined,
    }),
    changed: true,
  };
}

const readTopics = (): Topic[] => {
  try {
    return JSON.parse(localStorage.getItem("topics") || "[]");
  } catch {
    return [];
  }
};

const readStored = (): DailyPlan | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DailyPlan) : null;
  } catch {
    return null;
  }
};

export interface LoadedPlan {
  plan: DailyPlan;
  byId: Map<number, Phrase>;
}

/** Plan vigente (lo reutiliza o lo rehace y lo guarda). `null` si aún no hay frases. */
export async function loadDailyPlan(now: Date = new Date()): Promise<LoadedPlan | null> {
  const phrases = await getAllPhrases();
  if (phrases.length === 0) return null;
  const { plan, changed } = resolvePlan({
    stored: readStored(),
    phrases,
    topics: readTopics(),
    now,
  });
  if (changed) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // sin almacenamiento: el plan se vuelve a calcular la próxima vez
    }
  }
  if (plan.days.length === 0) return null;
  const byId = new Map<number, Phrase>();
  phrases.forEach((p) => p.id != null && byId.set(p.id, p));
  return { plan, byId };
}
