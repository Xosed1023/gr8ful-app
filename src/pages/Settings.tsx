import {
  IonContent,
  IonIcon,
  IonPage,
  useIonAlert,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  appsOutline,
  bookOutline,
  languageOutline,
  moonOutline,
  notificationsOutline,
  phonePortraitOutline,
  schoolOutline,
  timeOutline,
} from "ionicons/icons";
import { IoArrowForward, IoPencil } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useUserGender } from "../hooks/useUserGender";
import { hapticTap, isHapticsEnabled, setHapticsEnabled } from "../hooks/useHaptics";
import "./Settings.css";
import "../components/home/HomeKit.css";
import { applyStoredTheme } from "../theme/applyStoredTheme";
import { useCalmEnter } from "../theme/useCalmEnter";
import DevToolsSection from "../debug/DevToolsSection";
import WidgetGuide, { canShowWidgetGuide } from "../tutorial/WidgetGuide";
import { TutorialText } from "../tutorial/tutorialLanguage";
import { requestTutorialReplay } from "../tutorial/tutorialState";
import {
  disableDailyQuotes,
  enableDailyQuotes,
} from "../notifications/dailyQuote";
import {
  AppNotificationsLanguage,
  AppSettingsDetailLanguage,
  AppSetttingsScreenLanguage,
  AppTopicsScreenLanguage,
  LanguageKeys,
} from "../persistence/languages";

const LANGUAGE_NAME: Record<LanguageKeys, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
};

const TIME_LABEL: Record<string, string> = {
  "6": "6:00 AM",
  "12": "12:00 PM",
  "18": "6:00 PM",
};

interface SettingsRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  /** Color de la burbuja del icono (cada ajuste tiene el suyo, como en Stitch). */
  tint: "a" | "b" | "c" | "n";
  /** Fila de navegación (flecha); sin `onClick` es una fila con control propio. */
  onClick?: () => void;
  children?: React.ReactNode;
}

/** Fila de la lista: burbuja de icono, título, subtítulo y flecha o control. */
const SettingsRow = ({ icon, title, subtitle, tint, onClick, children }: SettingsRowProps) => {
  const content = (
    <>
      <span className={`settings-icon tint-${tint}`}>
        <IonIcon icon={icon} aria-hidden="true" />
      </span>
      <span className="settings-row-text">
        <span className="settings-row-title">{title}</span>
        {subtitle && <span className="settings-row-subtitle">{subtitle}</span>}
      </span>
      {onClick ? <IoArrowForward className="settings-chevron" aria-hidden="true" /> : children}
    </>
  );
  return onClick ? (
    <button type="button" className="settings-row" onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className="settings-row">{content}</div>
  );
};

/** Interruptor en píldora (52 × 28 px) con la bolita que se desliza, como en Stitch. */
const Switch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    className={`settings-switch ${checked ? "on" : ""}`}
    onClick={() => onChange(!checked)}
  >
    <span className="settings-switch-thumb" />
  </button>
);

const Settings = () => {
  const navigate = useIonRouter();
  // La tarjeta entra por partes (nombre, lista, pie) cada vez que se muestra Ajustes
  const calmRef = useCalmEnter<HTMLDivElement>();
  const [title, setTitle] = useState(["Settings"]);
  const [changeNameBtnText, setChangeNameBtnText] = useState(["Edit name"]);
  const [languageOptText, setLanguageOptText] = useState(["Language"]);
  const [hourOptText, setHourOptText] = useState(["Time"]);
  const [topicsOptText, setTopicsOptText] = useState(["Topics"]);
  const [versionText, setVersionText] = useState(["Version"]);
  const [pushNotificationsOptText, setPushNotificationsOptText] = useState([
    "Push Notifications",
  ]);
  const [darkmodeOptText, setDarkmodeOptText] = useState(["Dark Mode"]);
  // No usa useAppLanguage(): Settings se revisita sin remount (p. ej. al volver
  // tras cambiar el idioma) y necesita releer localStorage en cada navegación —
  // ver research.md A1 (Edge Case), misma excepción deliberada que Home.tsx.
  const [userLanguage, setUserLanguage] = useState<LanguageKeys | null>(
    localStorage.getItem("language") as LanguageKeys | null
  );
  const { isMale } = useUserGender();
  const accent = isMale ? "man" : "woman";
  // Fuerza releer hora y temas guardados al volver de editarlos (Settings no se desmonta).
  const [, refresh] = useState(0);
  useIonViewWillEnter(() => {
    setUserLanguage(localStorage.getItem("language") as LanguageKeys | null);
    refresh((n) => n + 1);
  });
  const [presentAlert] = useIonAlert();
  const [notificationsOn, setNotificationsOn] = useState(
    localStorage.getItem("pushNotifications") === "true"
  );
  const [darkOn, setDarkOn] = useState(localStorage.getItem("darkMode") === "true");
  const [hapticsOn, setHapticsOn] = useState(isHapticsEnabled());
  const [widgetGuideOpen, setWidgetGuideOpen] = useState(false);

  const handleHapticsToggle = (next: boolean) => {
    setHapticsOn(next);
    setHapticsEnabled(next);
    // Al activarlo, una muestra de cómo se siente (al apagarlo ya no vibra).
    if (next) void hapticTap();
  };

  const handleDarkToggle = (next: boolean) => {
    setDarkOn(next);
    localStorage.setItem("darkMode", next.toString());
    applyStoredTheme();
  };

  // El interruptor controla las notificaciones diarias (spec 021): activar pide
  // el permiso y programa; desactivar cancela. Con permiso denegado vuelve a
  // apagarse y explica cómo permitirlo en los ajustes del sistema.
  const handleNotificationsToggle = async (checked: boolean) => {
    if (checked === notificationsOn) return;
    setNotificationsOn(checked);
    if (!checked) {
      await disableDailyQuotes();
      return;
    }
    const result = await enableDailyQuotes();
    if (result === "scheduled") return;
    setNotificationsOn(false);
    if (result === "denied") {
      const lang = userLanguage ?? "en";
      presentAlert({
        header: AppNotificationsLanguage.permissionDeniedTitle[lang],
        message: AppNotificationsLanguage.permissionDeniedMessage[lang],
        buttons: [AppNotificationsLanguage.permissionDeniedButton[lang]],
      });
    }
  };

  useEffect(() => {
    setUserLanguage(localStorage.getItem("language") as LanguageKeys | null);
  }, [navigate]);

  useEffect(() => {
    if (!userLanguage) return;

    setTitle(AppSetttingsScreenLanguage.title[userLanguage]);
    setChangeNameBtnText(AppSetttingsScreenLanguage.editNameButton[userLanguage]);
    setLanguageOptText(AppSetttingsScreenLanguage.languageButton[userLanguage]);
    setHourOptText(AppSetttingsScreenLanguage.TimeButton[userLanguage]);
    setTopicsOptText(AppSetttingsScreenLanguage.topicsButton[userLanguage]);
    setPushNotificationsOptText(
      AppSetttingsScreenLanguage.pushNotificationsButton[userLanguage]
    );
    setDarkmodeOptText(AppSetttingsScreenLanguage.darkModeButton[userLanguage]);
    setVersionText(AppSetttingsScreenLanguage.versionLabel[userLanguage]);
  }, [userLanguage]);

  // Subtítulos con el valor actual de cada ajuste
  const lang: LanguageKeys = userLanguage ?? "en";
  const name = localStorage.getItem("name") ?? "";
  const timeLabel = TIME_LABEL[localStorage.getItem("time") ?? "12"] ?? TIME_LABEL["12"];
  const storedTopics: { key: string }[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("topics") || "[]");
    } catch {
      return [];
    }
  })();
  const topicNames = storedTopics.map(
    (t) =>
      AppTopicsScreenLanguage.topics[lang].find((x) => x.key === t.key)?.value ?? t.key
  );
  const topicsLine =
    topicNames.length === 0
      ? AppSettingsDetailLanguage.allTopics[lang]
      : topicNames.slice(0, 2).join(", ") +
        (topicNames.length > 2 ? ` +${topicNames.length - 2}` : "");

  return (
    <IonPage>
      <IonContent
        className="settings-page"
        style={{ "--padding-bottom": "var(--nav-space)" } as React.CSSProperties}
      >
        <div className={`settings-screen ${accent}`}>
          {/* Cabecera decorativa: índigo con las esquinas de abajo redondeadas y manchas de luz */}
          <div className="settings-header">
            <span className="settings-grabber" aria-hidden="true" />
          </div>

          {/* Tarjeta flotante que se monta sobre la cabecera */}
          <div ref={calmRef} className="settings-card calm-stagger">
            <h1 className="settings-name">{name}</h1>
            <button
              type="button"
              className="settings-edit-pill"
              onClick={() => navigate.push("/userName", "root")}
            >
              {changeNameBtnText[0]}
              <IoPencil aria-hidden="true" />
            </button>

            <div className="settings-list">
              <SettingsRow
                icon={languageOutline}
                title={languageOptText[0]}
                subtitle={LANGUAGE_NAME[lang]}
                tint="a"
                onClick={() => navigate.push("/languages")}
              />
              <SettingsRow
                icon={timeOutline}
                title={hourOptText[0]}
                subtitle={AppSettingsDetailLanguage.timeLine[lang].replace("{time}", timeLabel)}
                tint="b"
                onClick={() => navigate.push("/quoteTime", "forward")}
              />
              <SettingsRow
                icon={bookOutline}
                title={topicsOptText[0]}
                subtitle={topicsLine}
                tint="c"
                onClick={() => navigate.push("/quoteTopics", "forward")}
              />
              <SettingsRow
                icon={notificationsOutline}
                title={pushNotificationsOptText[0]}
                subtitle={AppSettingsDetailLanguage.notificationsHint[lang]}
                tint="n"
              >
                <Switch
                  checked={notificationsOn}
                  onChange={handleNotificationsToggle}
                  label={pushNotificationsOptText[0]}
                />
              </SettingsRow>
              <SettingsRow
                icon={phonePortraitOutline}
                title={AppSettingsDetailLanguage.hapticsTitle[lang]}
                subtitle={AppSettingsDetailLanguage.hapticsHint[lang]}
                tint="n"
              >
                <Switch
                  checked={hapticsOn}
                  onChange={handleHapticsToggle}
                  label={AppSettingsDetailLanguage.hapticsTitle[lang]}
                />
              </SettingsRow>
              <SettingsRow icon={moonOutline} title={darkmodeOptText[0]} tint="n">
                <Switch
                  checked={darkOn}
                  onChange={handleDarkToggle}
                  label={darkmodeOptText[0]}
                />
              </SettingsRow>
              {/* Ayuda: guía del widget (solo móvil) y repetir el tutorial (spec 030) */}
              {canShowWidgetGuide() && (
                <SettingsRow
                  icon={appsOutline}
                  title={TutorialText.settings.widgetTitle[lang]}
                  subtitle={TutorialText.settings.widgetHint[lang]}
                  tint="b"
                  onClick={() => setWidgetGuideOpen(true)}
                />
              )}
              <SettingsRow
                icon={schoolOutline}
                title={TutorialText.settings.replayTitle[lang]}
                subtitle={TutorialText.settings.replayHint[lang]}
                tint="c"
                onClick={() => {
                  requestTutorialReplay();
                  navigate.push("/tabs/home", "root");
                }}
              />
              {/* Solo con VITE_IS_TESTING=true (spec 032) */}
              <DevToolsSection />
            </div>

            <p className="settings-footer">
              {versionText[0]} {import.meta.env.VITE_VERSION_APP}
              <span>Gr8ful Daily Moments</span>
            </p>
          </div>
        </div>
        <WidgetGuide
          open={widgetGuideOpen}
          onClose={() => setWidgetGuideOpen(false)}
          language={lang}
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
