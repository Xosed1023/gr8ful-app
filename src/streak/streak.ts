import { dateKey } from "../daily/dailyPlan";

const STORAGE_KEY = "streak";

export interface StreakState {
  current: number;
  best: number;
  /** Último día contado, `YYYY-MM-DD` en hora local. */
  lastDay: string | null;
}

export interface OpenResult {
  state: StreakState;
  /** Si no es `null`, hay que ofrecer rescatar una racha de ese tamaño antes de contar hoy. */
  rescue: { streak: number } | null;
}

export const EMPTY_STREAK: StreakState = { current: 0, best: 0, lastDay: null };

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Lee el estado guardado; cualquier dato corrupto equivale a «sin racha». */
export function parseStreak(raw: string | null): StreakState {
  if (!raw) return EMPTY_STREAK;
  try {
    const value = JSON.parse(raw);
    const { current, best, lastDay } = value ?? {};
    if (
      !Number.isInteger(current) ||
      !Number.isInteger(best) ||
      current < 0 ||
      best < current ||
      typeof lastDay !== "string" ||
      !DAY_PATTERN.test(lastDay)
    ) {
      return EMPTY_STREAK;
    }
    return { current, best, lastDay };
  } catch {
    return EMPTY_STREAK;
  }
}

/** Días de calendario entre dos claves `YYYY-MM-DD` (positivo si `b` es posterior). */
export function daysBetween(a: string, b: string): number {
  const toUtc = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

const withCurrent = (state: StreakState, current: number, today: string): StreakState => ({
  current,
  best: Math.max(state.best, current),
  lastDay: today,
});

/**
 * Registra una apertura. Tras exactamente un día sin abrir (con racha de 2 o más) NO
 * modifica el estado: devuelve `rescue` y la decisión llega con `acceptRescue` o
 * `declineRescue`. Así, si se cierra la app sin decidir, el aviso reaparece.
 */
export function registerOpen(state: StreakState, today: string): OpenResult {
  if (state.lastDay === null) return { state: withCurrent(state, 1, today), rescue: null };

  const gap = daysBetween(state.lastDay, today);
  // Mismo día, o reloj atrasado: no cambia nada
  if (gap <= 0) return { state, rescue: null };
  if (gap === 1) return { state: withCurrent(state, state.current + 1, today), rescue: null };
  if (gap === 2 && state.current >= 2) return { state, rescue: { streak: state.current } };
  return { state: withCurrent(state, 1, today), rescue: null };
}

/** El anuncio se completó: el día perdido queda cubierto y hoy cuenta. */
export const acceptRescue = (state: StreakState, today: string): StreakState =>
  withCurrent(state, state.current + 1, today);

/** Se renuncia al rescate: vuelve a empezar hoy. */
export const declineRescue = (state: StreakState, today: string): StreakState =>
  withCurrent(state, 1, today);

export function loadStreak(): StreakState {
  try {
    return parseStreak(localStorage.getItem(STORAGE_KEY));
  } catch {
    return EMPTY_STREAK;
  }
}

export function saveStreak(state: StreakState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Sin almacenamiento la racha simplemente no persiste
  }
}

export const todayKey = (now: Date = new Date()): string => dateKey(now);
