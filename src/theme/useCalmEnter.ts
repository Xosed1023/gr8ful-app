import { useIonViewWillEnter } from "@ionic/react";
import { useCallback, useRef } from "react";

/**
 * Reinicia la entrada escalonada (`.calm-stagger`, ver motion.css) cada vez que Ionic va a
 * mostrar la pantalla: la primera vez y también al volver con «atrás», porque Ionic mantiene
 * montadas las pantallas anteriores. Uso:
 *
 *   const calmRef = useCalmEnter<HTMLDivElement>();
 *   <div ref={calmRef} className="onboarding-content calm-stagger">…</div>
 */
export function useCalmEnter<T extends HTMLElement>() {
  const node = useRef<T | null>(null);

  const ref = useCallback((el: T | null) => {
    node.current = el;
  }, []);

  useIonViewWillEnter(() => {
    const el = node.current;
    if (!el) return;
    el.classList.remove("calm-run");
    // Forzar el reflujo para que el navegador reinicie la animación
    void el.offsetWidth;
    el.classList.add("calm-run");
  });

  return ref;
}
