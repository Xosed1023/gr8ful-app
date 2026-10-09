import { IonIcon, useIonRouter, useIonToast } from "@ionic/react";
import {
  flameOutline,
  megaphoneOutline,
  refreshOutline,
  schoolOutline,
  skullOutline,
  timeOutline,
} from "ionicons/icons";
import { hapticTap } from "../hooks/useHaptics";
import {
  armInterstitial,
  devToolsEnabled,
  resetAdPolicy,
  resetTutorial,
  simulateStreak,
  skipAdGrace,
  StreakScenario,
} from "./devTools";

interface Action {
  icon: string;
  title: string;
  hint: string;
  run: () => void;
  /** Tras ejecutar, ir a «Diario» para que la app evalúe el nuevo estado. */
  goHome?: boolean;
}

const STREAK: { scenario: StreakScenario; icon: string; title: string; hint: string }[] = [
  { scenario: "yesterday", icon: timeOutline, title: "Racha: abrí ayer", hint: "Racha de 5; al abrir hoy sube a 6." },
  { scenario: "rescue", icon: flameOutline, title: "Racha: falló 1 día", hint: "Racha de 5; ofrece el rescate con anuncio." },
  { scenario: "lost", icon: skullOutline, title: "Racha: falló 3 días", hint: "Racha de 8; se pierde y vuelve a 1." },
  { scenario: "reset", icon: refreshOutline, title: "Racha: reiniciar", hint: "Borra la racha guardada." },
];

/**
 * Sección de pruebas de Ajustes (spec 032). Solo con `VITE_IS_TESTING=true`: simula días, el
 * rescate de racha, los límites de anuncios y el tutorial sin tocar el reloj del teléfono.
 */
const DevToolsSection = () => {
  const [present] = useIonToast();
  const navigate = useIonRouter();
  if (!devToolsEnabled()) return null;

  const actions: Action[] = [
    ...STREAK.map(({ scenario, icon, title, hint }) => ({
      icon,
      title,
      hint,
      run: () => simulateStreak(scenario),
      goHome: true,
    })),
    {
      icon: megaphoneOutline,
      title: "Anuncios: saltar gracia de 24 h",
      hint: "Finge 2 días de uso.",
      run: () => skipAdGrace(),
    },
    {
      icon: megaphoneOutline,
      title: "Anuncios: dejar listo un intersticial",
      hint: "La próxima acción de valor lo dispara.",
      run: () => armInterstitial(),
      goHome: true,
    },
    {
      icon: refreshOutline,
      title: "Anuncios: reiniciar contadores",
      hint: "Vuelve a instalación nueva.",
      run: () => resetAdPolicy(),
    },
    {
      icon: schoolOutline,
      title: "Tutorial: reiniciar",
      hint: "Se muestra al volver a Diario.",
      run: () => resetTutorial(),
      goHome: true,
    },
  ];

  const handle = (action: Action) => {
    void hapticTap();
    action.run();
    present({ message: `Listo: ${action.title}`, duration: 1800, position: "bottom" });
    if (action.goHome) navigate.push("/tabs/home", "root");
  };

  return (
    <>
      <p className="settings-footer settings-dev-title">Herramientas de prueba</p>
      {actions.map((action) => (
        <button key={action.title} type="button" className="settings-row" onClick={() => handle(action)}>
          <span className="settings-icon tint-n">
            <IonIcon icon={action.icon} aria-hidden="true" />
          </span>
          <span className="settings-row-text">
            <span className="settings-row-title">{action.title}</span>
            <span className="settings-row-subtitle">{action.hint}</span>
          </span>
        </button>
      ))}
    </>
  );
};

export default DevToolsSection;
