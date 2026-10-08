import { dateKey } from "../daily/dailyPlan";

/**
 * Reglas de los intersticiales (spec 027). Valores iniciales razonables para una app de
 * sesiones cortas; se recalibran aquí, en un único sitio.
 */
export const AD_POLICY = {
  /** Sin intersticiales durante las primeras horas de uso. */
  graceMs: 24 * 60 * 60 * 1000,
  /** Separación mínima entre dos intersticiales (reloj real, también entre sesiones). */
  minGapMs: 4 * 60 * 1000,
  /** Máximo de intersticiales por día local. */
  dailyCap: 3,
  /** Puntos de «momento de valor» que hay que acumular para un anuncio. */
  pointsPerAd: 3,
  /** Respiro sin intersticiales tras ver un anuncio recompensado. */
  rewardedQuietMs: 10 * 60 * 1000,
} as const;

/** Cuánto vale cada momento de valor (compartir es la señal más fuerte). */
export const MOMENT_POINTS = { card_close: 1, copy: 1, share: 2 } as const;
export type AdMoment = keyof typeof MOMENT_POINTS;

export interface AdState {
  /** Primer momento de uso registrado (ms); `null` hasta el primero. */
  firstSeenAt: number | null;
  /** Último intersticial mostrado (ms). */
  lastShownAt: number;
  /** No mostrar intersticiales hasta este instante (ms): respiro tras un rewarded. */
  quietUntil: number;
  /** Día local de `shownToday`, `YYYY-MM-DD`. */
  day: string;
  shownToday: number;
  /** Puntos acumulados desde el último anuncio. */
  points: number;
}

export const EMPTY_AD_STATE: AdState = {
  firstSeenAt: null,
  lastShownAt: 0,
  quietUntil: 0,
  day: "",
  shownToday: 0,
  points: 0,
};

const STORAGE_KEY = "adPolicy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Lee el estado guardado; lo ausente o corrupto equivale a un estado inicial. */
export function parseAdState(raw: string | null): AdState {
  if (!raw) return EMPTY_AD_STATE;
  try {
    const v = JSON.parse(raw);
    if (
      !v ||
      !(v.firstSeenAt === null || isNum(v.firstSeenAt)) ||
      !isNum(v.lastShownAt) ||
      !isNum(v.quietUntil) ||
      typeof v.day !== "string" ||
      !isNum(v.shownToday) ||
      !isNum(v.points)
    ) {
      return EMPTY_AD_STATE;
    }
    return {
      firstSeenAt: v.firstSeenAt,
      lastShownAt: v.lastShownAt,
      quietUntil: v.quietUntil,
      day: v.day,
      shownToday: v.shownToday,
      points: v.points,
    };
  } catch {
    return EMPTY_AD_STATE;
  }
}

const shownTodayOf = (state: AdState, today: string) => (state.day === today ? state.shownToday : 0);

/**
 * Registra un momento de valor y dice si ya toca un intersticial. No lo da por mostrado:
 * eso lo confirma `markShown` cuando el anuncio realmente salió.
 */
export function recordMoment(
  state: AdState,
  points: number,
  now: number
): { state: AdState; due: boolean } {
  const firstSeenAt = state.firstSeenAt ?? now;
  const next: AdState = { ...state, firstSeenAt, points: state.points + points };

  const due =
    now - firstSeenAt >= AD_POLICY.graceMs &&
    next.points >= AD_POLICY.pointsPerAd &&
    now >= state.quietUntil &&
    now - state.lastShownAt >= AD_POLICY.minGapMs &&
    shownTodayOf(state, dateKey(new Date(now))) < AD_POLICY.dailyCap;

  return { state: next, due };
}

/** El intersticial se mostró: empieza la separación y se reinician los puntos. */
export function markShown(state: AdState, now: number): AdState {
  const today = dateKey(new Date(now));
  return { ...state, lastShownAt: now, points: 0, day: today, shownToday: shownTodayOf(state, today) + 1 };
}

/** Se vio un anuncio recompensado: respiro sin intersticiales y puntos a cero. */
export function markRewarded(state: AdState, now: number): AdState {
  return {
    ...state,
    firstSeenAt: state.firstSeenAt ?? now,
    quietUntil: now + AD_POLICY.rewardedQuietMs,
    points: 0,
  };
}

export function loadAdState(): AdState {
  try {
    return parseAdState(localStorage.getItem(STORAGE_KEY));
  } catch {
    return EMPTY_AD_STATE;
  }
}

export function saveAdState(state: AdState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Sin almacenamiento los límites simplemente no persisten
  }
}
