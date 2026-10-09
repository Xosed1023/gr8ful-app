import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const haptic = vi.hoisted(() => ({ soft: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../../streak/streakHaptics", () => ({ hapticSoftSuccess: haptic.soft }));
vi.mock("../../ads/cardBanner", () => ({ setHomeVisible: vi.fn() }));
// En jsdom las animaciones de salida de framer-motion no terminan nunca (no hay fotogramas), y
// `AnimatePresence mode="wait"` esperaría para siempre. Aquí se prueba la lógica; el movimiento
// se verifica en navegador (quickstart.md).
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const motion = new Proxy(
    {},
    {
      get: (_, tag: string) =>
        React.forwardRef<HTMLElement, Record<string, unknown>>(
          ({ initial, animate, exit, transition, ...rest }, ref) => {
            void [initial, animate, exit, transition];
            return React.createElement(tag, { ...rest, ref });
          }
        ),
    }
  );
  return {
    motion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    useReducedMotion: () => false,
  };
});

import { AppStreakLanguage } from "../../persistence/languages";
import { AppStreakRestoredLanguage } from "../../streak/streakCopy";
import StreakRescue from "./StreakRescue";

const watch = AppStreakLanguage.rescueWatch.es;
const restart = AppStreakLanguage.rescueRestart.es;
const restoredTitle = AppStreakRestoredLanguage.title.es;

/** Espera real dentro de `act`: con las animaciones de framer en jsdom, `waitFor` se atasca. */
const wait = (ms: number) =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });

const setup = (onAccept: () => Promise<boolean>, restoredDuration = 80) => {
  const onDecline = vi.fn();
  render(
    <StreakRescue
      streak={4}
      language="es"
      onAccept={onAccept}
      onDecline={onDecline}
      restoredDuration={restoredDuration}
    />
  );
  return { onDecline };
};

describe("StreakRescue: racha restaurada", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tras completar el anuncio muestra «Racha restaurada» con la racha subiendo de N a N+1", async () => {
    setup(() => Promise.resolve(true), 5000);
    fireEvent.click(screen.getByText(watch));
    await wait(150); // sale el rescate y entra el mensaje
    expect(Boolean(screen.queryByText(restoredTitle))).toBe(true);
    // Al principio se lee la racha anterior; pasada la pausa del contador sube a N+1 y suena el háptico
    expect(Boolean(screen.queryByText("4"))).toBe(true);
    expect(haptic.soft).not.toHaveBeenCalled();
    await wait(1000);
    expect(Boolean(screen.queryByText("5"))).toBe(true);
    expect(haptic.soft).toHaveBeenCalledTimes(1);
  });

  it("el mensaje se descarta solo pasado su tiempo y no tiene botón de continuar", async () => {
    setup(() => Promise.resolve(true), 400);
    fireEvent.click(screen.getByText(watch));
    await wait(100);
    expect(Boolean(screen.queryByText(restoredTitle))).toBe(true);
    expect(Boolean(screen.queryByRole("button"))).toBe(false);
    await wait(500);
    expect(Boolean(screen.queryByText(restoredTitle))).toBe(false);
  });

  it("tocar en cualquier punto lo descarta de inmediato", async () => {
    setup(() => Promise.resolve(true), 60_000);
    fireEvent.click(screen.getByText(watch));
    await wait(150);
    fireEvent.click(screen.getByText(restoredTitle));
    await wait(150);
    expect(Boolean(screen.queryByText(restoredTitle))).toBe(false);
  });

  it("si el anuncio falla no hay mensaje: aparece el error y se puede reintentar", async () => {
    setup(() => Promise.resolve(false));
    fireEvent.click(screen.getByText(watch));
    await wait(150);
    expect(Boolean(screen.queryByText(AppStreakLanguage.rescueError.es))).toBe(true);
    expect(Boolean(screen.queryByText(restoredTitle))).toBe(false);
    expect(Boolean(screen.queryByText(watch))).toBe(true);
  });

  it("«Empezar de nuevo» no muestra el mensaje", async () => {
    const { onDecline } = setup(() => Promise.resolve(true));
    fireEvent.click(screen.getByText(restart));
    await wait(150);
    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(Boolean(screen.queryByText(restoredTitle))).toBe(false);
  });
});
