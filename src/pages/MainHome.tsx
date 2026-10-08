import { AdMob } from "@capacitor-community/admob";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { bookmarkOutline, infiniteOutline, optionsOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Redirect, Route, useLocation } from "react-router";
import { Phrase } from "../models/Phrase";
import {
  addOrUpdatePhrase,
  initDB,
} from "../persistence/IndexedDBService";
import Favorites from "./Favorites";
import Home from "./Home";
import Languages from "./Languages";
import QuoteTime from "./QuoteTime";
import QuoteTopics from "./QuoteTopics";
import Settings from "./Settings";
import UserName from "./UserName";
import { App } from "@capacitor/app";
import "../components/home/HomeKit.css";
import { useUserGender } from "../hooks/useUserGender";
import { AppHomeNavLanguage } from "../persistence/languages";
import { initInterstitial } from "../ads/interstitial";
import { showRewarded } from "../ads/rewarded";
import { getTodayPhrase, replaceTodayPhrase } from "../daily/dailyPlan";
import { refreshDailyContent } from "../daily/refreshDailyContent";

/** Pantallas de edición que se abren desde Ajustes: ahí la barra de pestañas estorba. */
const EDIT_ROUTES = ["/languages", "/quoteTime", "/quoteTopics", "/userName"];

/**
 * Marca <html> con `hide-tabs` mientras se edita algo desde Ajustes, para que la
 * píldora flotante se oculte (con transición) y no tape el botón de continuar.
 * Va dentro del IonReactRouter anidado: solo ahí `useLocation` ve estas rutas.
 */
const HideTabsOnEdit = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.classList.toggle("hide-tabs", EDIT_ROUTES.includes(pathname));
    return () => document.documentElement.classList.remove("hide-tabs");
  }, [pathname]);
  return null;
};

const MainHome = () => {
  const { isMale } = useUserGender();
  // Se lee en cada render para que los textos sigan al idioma tras cambiarlo en Ajustes.
  const storedLanguage = localStorage.getItem("language");
  const navText =
    AppHomeNavLanguage.tabs[
      storedLanguage === "es" || storedLanguage === "fr" ? storedLanguage : "en"
    ];
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  /* const [present] = useIonToast(); */
  // Rastreado a mano (no vía useLocation) porque MainHome monta su propio
  // <IonReactRouter> anidado dentro del router principal de App.tsx; leer la
  // ubicación desde ahí quedaba desincronizada con los taps reales del usuario.
  const [selectedTab, setSelectedTab] = useState<"home" | "favorites" | "settings">("home");


  useEffect(() => {
    initializeAdMob();

    initDB().then(() => {
      if (phrase === null) {
        loadTodayPhrase();
      }
    });
  }, []);

  // Si la app estuvo en segundo plano y cambió el día, pasa a la frase de hoy
  useEffect(() => {
    const listener = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive && phrase !== null) void loadTodayPhrase();
    });
    return () => {
      void listener.then((handle) => handle.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase === null]);

  const initializeAdMob = async () => {
    try {
      await AdMob.initialize({
        testingDevices: [],
        initializeForTesting: true,
      });
      // Intersticial listo para cuando la política lo pida (spec 027)
      await initInterstitial();
    } catch (error) {
      console.error("Error al inicializar AdMob", error);
    }
  };

  // Rewarded: cambia la frase del día. Se guarda en el plan para que el widget y las
  // notificaciones muestren la misma.
  const loadRandomPhraseWithAd = async () => {
    if (await showRewarded()) {
      // TODO: Hacer una animación para ocultar las tarjetas y mostrarlas de nuevo
      const next = await replaceTodayPhrase();
      if (next) {
        await markShown(next);
        setPhrase(next);
        void refreshDailyContent();
      }
    }
  };

  // La frase del día es la del plan: no cambia al reabrir la app, solo al cambiar el día
  const loadTodayPhrase = async () => {
    const today = await getTodayPhrase();
    if (today) {
      await markShown(today);
      setPhrase((prev) => (prev?.id === today.id ? prev : today));
    }
  };

  const markShown = async (phrase: Phrase) => {
    if (phrase.id == null || phrase.hasShown) return;
    await addOrUpdatePhrase({ ...phrase, hasShown: true });
  };

  return (
    <IonReactRouter>
      <HideTabsOnEdit />
      <IonTabs className="bg-[color:var(--tabs-bg)]">
        <IonRouterOutlet>
          <Route exact path="/tabs/home">
            <Home phrase={phrase!} onRefresh={loadRandomPhraseWithAd} />
          </Route>
          <Route exact path="/tabs/favorites" component={Favorites} />
          <Route exact path="/tabs/settings" component={Settings} />
          <Route exact path="/languages">
            <Languages backTo="/tabs/settings" />
          </Route>
          <Route exact path="/quoteTime">
            <QuoteTime backTo="/tabs/settings" />
          </Route>
          <Route exact path="/quoteTopics">
            <QuoteTopics backTo="/tabs/settings" />
          </Route>
          <Route exact path="/userName">
            <UserName backTo="/tabs/settings" />
          </Route>
          <Route
            exact
            path="/mainHome"
            render={() => <Redirect to="/tabs/home" />}
          />
        </IonRouterOutlet>
        {/* Píldora de vidrio flotante con icono y texto (estilos en HomeKit.css) */}
        <IonTabBar
          slot="bottom"
          className={`floating-tabs ${isMale ? "man" : "woman"}`}
        >

          <IonTabButton
            tab="home"
            href="/tabs/home"
            onClick={() => {
              // Si ya estábamos en Home, el tap pide una frase nueva (con
              // anuncio rewarded). Si veníamos de otro tab, es navegación
              // normal: no se dispara ningún anuncio.
              if (selectedTab === "home") {
                loadRandomPhraseWithAd();
              }
              setSelectedTab("home");
            }}
          >
            <IonIcon aria-hidden="true" icon={infiniteOutline} />
            <IonLabel>{navText.home}</IonLabel>
          </IonTabButton>
          <IonTabButton
            tab="favorites"
            href="/tabs/favorites"
            onClick={() => setSelectedTab("favorites")}
          >
            <IonIcon aria-hidden="true" icon={bookmarkOutline} />
            <IonLabel>{navText.favorites}</IonLabel>
          </IonTabButton>
          <IonTabButton
            tab="settings"
            href="/tabs/settings"
            onClick={() => setSelectedTab("settings")}
          >
            <IonIcon aria-hidden="true" icon={optionsOutline} />
            <IonLabel>{navText.settings}</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default MainHome;
