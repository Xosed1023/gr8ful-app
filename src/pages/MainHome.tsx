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
import { settings, sync } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Redirect, Route } from "react-router";
import { Phrase } from "../models/Phrase";
import {
  addOrUpdatePhrase,
  getPhraseById,
  getRandomPhrase,
  initDB,
} from "../persistence/IndexedDBService";
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

const MainHome = () => {
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [homeRefreshTrigger, setHomeRefreshTrigger] = useState<number>(0);
  /* const [present] = useIonToast(); */
  const [isAdVisible, setIsAdVisible] = useState(false);

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
      () => {
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
    let adId: string = "";
    try {
      const platform = Capacitor.getPlatform();
      if (platform === "ios") {
        adId = "ca-app-pub-6255300430204769/6703967819";
      } else if (platform === "android") {
        adId = "ca-app-pub-6255300430204769/3997913426";
      }
      const options: AdOptions = {
        adId: adId,
        isTesting: false,
      };
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
    /* present({
      message: `lanzando rewarded`,
      duration: 5000,
      position: "bottom",
    }); */
    AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      /* present({
        message: `Anuncio cargado ${JSON.stringify(info)}`,
        duration: 5000,
        position: "bottom",
      }); */
    });

    AdMob.addListener(
      RewardAdPluginEvents.Rewarded,
      (rewardItem: AdMobRewardItem) => {
        /* present({
          message: `rewardItem: ${JSON.stringify(rewardItem)}`,
          duration: 5000,
          position: "bottom",
        }); */
      }
    );

    const options: RewardAdOptions = {
      adId: import.meta.env.VITE_ANDROID_INTERSTICIAL_REWARDED,
      isTesting: import.meta.env.VITE_IS_TESTING,
    };

    await AdMob.prepareRewardVideoAd(options);
    const rewardItem = await AdMob.showRewardVideoAd();
    if (rewardItem.amount > 0) {
      // TODO: Hacer una animación para ocultar las tarjetas y mostrarlas de nuevo
      await loadRandomPhrase();
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

  const handleTabChange = (tab: string) => {
    // Detectar si estás tocando la tab "home" nuevamente
    if (tab === "home" && activeTab === "home") {
      setHomeRefreshTrigger((prev) => prev + 1); // Actualizar estado
    }
    setActiveTab(tab);
  };

  return (
    <IonReactRouter>
      <IonTabs className="bg-indigo-950">
        <IonRouterOutlet>
          <Route exact path="/tabs/home">
            <Home phrase={phrase!} />
          </Route>
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
              // TODO: Verificar que esté en el home para cargar nueva frase
              // TODO: Solicitar anuncio para nueva frase
              loadRandomPhraseWithAd();
            }}
          >
            <IonIcon aria-hidden="true" icon={sync} />
          </IonTabButton>
          <IonTabButton
            tab="settings"
            href="/tabs/settings"
            className="bg-slate-900"
          >
            <IonIcon aria-hidden="true" icon={settings} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default MainHome;
