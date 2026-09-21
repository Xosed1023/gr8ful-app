import {
  AdMob,
  AdOptions,
  InterstitialAdPluginEvents,
} from "@capacitor-community/admob";
import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonToast,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { bookmark, home, settings, sync } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Redirect, Route } from "react-router";
import { Phrase } from "../models/Phrase";
import {
  addOrUpdatePhrase,
  getPhraseById,
  getRandomPhrase,
  initDB,
} from "../persistence/IndexedDBService";
import Favorites from "./Favorites";
import Home from "./Home";
import Languages from "./Languages";
import QuoteTime from "./QuoteTime";
import QuoteTopics from "./QuoteTopics";
import Settings from "./Settings";
import UserName from "./UserName";
import {
  RewardAdOptions,
  AdLoadInfo,
  RewardAdPluginEvents,
  AdMobRewardItem,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

// IDs de prueba oficiales de Google AdMob — https://developers.google.com/admob/ios/test-ads
// y https://developers.google.com/admob/android/test-ads. Devuelven anuncios de test
// para toda solicitud, sin depender de configuración de cuenta/consentimiento.
const TEST_INTERSTITIAL_AD_ID =
  Capacitor.getPlatform() === "ios"
    ? "ca-app-pub-3940256099942544/4411468910"
    : "ca-app-pub-3940256099942544/1033173712";
const TEST_REWARDED_AD_ID =
  Capacitor.getPlatform() === "ios"
    ? "ca-app-pub-3940256099942544/1712485313"
    : "ca-app-pub-3940256099942544/5224354917";

const MainHome = () => {
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  /* const [present] = useIonToast(); */
  const [isAdVisible, setIsAdVisible] = useState(false);
  // Rastreado a mano (no vía useLocation) porque MainHome monta su propio
  // <IonReactRouter> anidado dentro del router principal de App.tsx; leer la
  // ubicación desde ahí quedaba desincronizada con los taps reales del usuario.
  const [selectedTab, setSelectedTab] = useState<"home" | "favorites" | "settings">("home");

  useEffect(() => {
    initializeAdMob();

    initDB().then(() => {
      if (phrase === null) {
        loadRandomPhrase();
      }
    });
  }, []);

  useEffect(() => {
    const onDismissListener = AdMob.addListener(
      InterstitialAdPluginEvents.Dismissed,
      () => {
        setIsAdVisible(false);
      }
    );
    const onFailedListener = AdMob.addListener(
      InterstitialAdPluginEvents.FailedToLoad,
      (error) => {
        console.error("Intersticial: fallo al cargar", error);
        setIsAdVisible(false);
      }
    );

    const onLoadListener = AdMob.addListener(
      InterstitialAdPluginEvents.Showed,
      () => {
        setIsAdVisible(true);
      }
    );

    return () => {
      onDismissListener.remove();
      onFailedListener.remove();
      onLoadListener.remove();
    };
  }, []);

  useEffect(() => {
    /* present({
      message: `isAdVisible: ${isAdVisible}`,
      duration: 5000,
      position: "bottom",
    }); */
    if (!isAdVisible) {
      setTimeout(() => {
        showAdMobInterstitial();
      }, 45000);
    } else {
    }
  }, [isAdVisible]);

  const showAdMobInterstitial = async (): Promise<void> => {
    try {
      const options: AdOptions = {
        adId: TEST_INTERSTITIAL_AD_ID,
        isTesting: true,
      };
      console.log("Intersticial: solicitando anuncio de prueba", options);
      await AdMob.prepareInterstitial(options);
      AdMob.showInterstitial().then(() => {
        setIsAdVisible(true);
      });
    } catch (error) {
      console.error("Error mostrando intersticial", error);
      setIsAdVisible(false);
    }
  };

  const initializeAdMob = async () => {
    try {
      await AdMob.initialize({
        testingDevices: [],
        initializeForTesting: true,
      });
    } catch (error) {
      console.error("Error al inicializar AdMob", error);
    }
  };

  const loadRandomPhraseWithAd = async () => {
    const onLoadedListener = AdMob.addListener(
      RewardAdPluginEvents.Loaded,
      (info: AdLoadInfo) => {
        console.log("Rewarded: anuncio de prueba cargado", info);
      }
    );
    const onFailedListener = AdMob.addListener(
      RewardAdPluginEvents.FailedToLoad,
      (error) => {
        console.error("Rewarded: fallo al cargar", error);
      }
    );
    const onRewardedListener = AdMob.addListener(
      RewardAdPluginEvents.Rewarded,
      (rewardItem: AdMobRewardItem) => {
        console.log("Rewarded: recompensa otorgada", rewardItem);
      }
    );

    try {
      const options: RewardAdOptions = {
        adId: TEST_REWARDED_AD_ID,
        isTesting: true,
      };
      console.log("Rewarded: solicitando anuncio de prueba", options);
      await AdMob.prepareRewardVideoAd(options);
      const rewardItem = await AdMob.showRewardVideoAd();
      if (rewardItem.amount > 0) {
        // TODO: Hacer una animación para ocultar las tarjetas y mostrarlas de nuevo
        await loadRandomPhrase();
      }
    } catch (error) {
      console.error("Error mostrando rewarded", error);
    } finally {
      onLoadedListener.remove();
      onFailedListener.remove();
      onRewardedListener.remove();
    }
  };

  const loadRandomPhrase = async () => {
    let topics = JSON.parse(localStorage.getItem("topics") || "[]");
    const randomPhrase = await getRandomPhrase(topics);
    if (randomPhrase) {
      await updateHistoryDate(randomPhrase.id!);
      setPhrase(randomPhrase);
    }
  };

  const updateHistoryDate = async (id: number) => {
    const phrase = await getPhraseById(id);
    if (phrase) {
      phrase.hasShown = true;
      await addOrUpdatePhrase(phrase);
    }
  };

  return (
    <IonReactRouter>
      <IonTabs className="bg-indigo-950">
        <IonRouterOutlet>
          <Route exact path="/tabs/home">
            <Home phrase={phrase!} />
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
        <IonTabBar slot="bottom" className="bg-slate-900">
          <IonTabButton
            tab="home"
            href="/tabs/home"
            className="bg-slate-900"
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
            <IonIcon aria-hidden="true" icon={selectedTab === "home" ? sync : home} />
          </IonTabButton>
          <IonTabButton
            tab="favorites"
            href="/tabs/favorites"
            className="bg-slate-900"
            onClick={() => setSelectedTab("favorites")}
          >
            <IonIcon aria-hidden="true" icon={bookmark} />
          </IonTabButton>
          <IonTabButton
            tab="settings"
            href="/tabs/settings"
            className="bg-slate-900"
            onClick={() => setSelectedTab("settings")}
          >
            <IonIcon aria-hidden="true" icon={settings} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default MainHome;
