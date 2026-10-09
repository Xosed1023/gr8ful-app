import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useLocation } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { initialData } from "./persistence/initialData";
import "./tailwind.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
import "@ionic/react/css/palettes/dark.class.css";
/* import "@ionic/react/css/palettes/dark.system.css"; */

/* Theme variables */
import { useEffect } from "react";
import Gender from "./pages/Gender";
import Languages from "./pages/Languages";
import LoadingScreen from "./pages/LoadingScreen";
import MainHome from "./pages/MainHome";
import QuoteTime from "./pages/QuoteTime";
import QuoteTopics from "./pages/QuoteTopics";
import UserName from "./pages/UserName";
import OnboardingProgress from "./components/common/OnboardingProgress";
import RewardedLoader from "./ads/RewardedLoader";
import Welcome from "./pages/Welcome";
import { addPhrasesBatch, initDB } from "./persistence/IndexedDBService";
import "./theme/variables.css";
import "./theme/motion.css";
import { calmPageTransition } from "./theme/pageTransition";
import { PushNotifications } from "@capacitor/push-notifications";
import { refreshDailyContent } from "./daily/refreshDailyContent";

// Transición calmada entre pantallas (spec 031); las pestañas y el gesto de volver conservan la de Ionic
setupIonicReact({ navAnimation: calmPageTransition });

/**
 * Rutas donde NO se debe poder volver al onboarding (ni deslizando de izquierda a
 * derecha en iOS ni con el botón atrás de Android): una vez terminado el onboarding,
 * Home es la raíz de la app. Con «root» Ionic solo cambia la animación, no borra el
 * historial, así que el historial anterior seguía accesible.
 */
const NO_BACK_ROUTES = ["/mainHome", "/tabs/home", "/loadingScreen"];

/** Pantallas raíz: el botón atrás de Android cierra la app en vez de navegar. */
const EXIT_ON_BACK_ROUTES = ["/", "/mainHome", "/tabs/home", "/tabs/favorites", "/tabs/settings"];

/** Se actualiza con la ruta actual; lo consulta el gesto de volver. */
let swipeBackBlocked = false;
const guardedHandlers = new WeakSet<object>();

/**
 * Esta versión de Ionic no expone `swipeGesture`: el router de Ionic React asigna al
 * outlet un `swipeHandler` con su propio `canStart`. Se envuelve una sola vez para que,
 * además, compruebe que la ruta actual permite volver. Se aplica al primer outlet del
 * documento (el principal; el de MainHome es posterior).
 */
const guardSwipeBack = () => {
  const outlet = document.querySelector("ion-router-outlet");
  const handler = outlet?.swipeHandler;
  if (!outlet || !handler || guardedHandlers.has(handler)) return;
  const guarded = {
    ...handler,
    canStart: () => !swipeBackBlocked && handler.canStart(),
  };
  guardedHandlers.add(guarded);
  outlet.swipeHandler = guarded;
};

const AppRoutes: React.FC = () => {
  const { pathname } = useLocation();

  // Android: el botón atrás cierra la app desde las pantallas raíz y se ignora en la carga.
  useEffect(() => {
    const handle = CapacitorApp.addListener("backButton", () => {
      const current = window.location.pathname;
      if (current === "/loadingScreen") return;
      if (EXIT_ON_BACK_ROUTES.includes(current)) CapacitorApp.exitApp();
      else window.history.back();
    });
    return () => {
      handle.then((h) => h.remove()).catch(() => undefined);
    };
  }, []);

  // Bloquea el gesto de «volver deslizando» en las rutas sin retorno.
  useEffect(() => {
    swipeBackBlocked = NO_BACK_ROUTES.includes(pathname);
    guardSwipeBack();
  }, [pathname]);

  return (
    <>
    <OnboardingProgress />
    <IonRouterOutlet>
      <Route exact path="/" component={Welcome} />
      <Route exact path="/languages" component={Languages} />
      <Route exact path="/gender" component={Gender} />
      <Route exact path="/quoteTime" component={QuoteTime} />
      <Route exact path="/quoteTopics" component={QuoteTopics} />
      <Route exact path="/userName" component={UserName} />
      <Route exact path="/loadingScreen" component={LoadingScreen} />
      <Route exact path={["/mainHome", "/tabs/home"]} component={MainHome} />
      <Route>
        <Redirect to="/" />
      </Route>
    </IonRouterOutlet>
    </>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Inicializar la base de datos
    initDB().then(() => {
      loadInitialData();
    });
  }, []);

  const loadInitialData = async () => {
    // Leer el json inicial y cargarlo en la base de datos
    if (localStorage.getItem("gr8fulFirstTime") === null) {
      await addPhrasesBatch(initialData);
      localStorage.setItem("gr8fulFirstTime", "true");
    } else {
      console.log("No se cargaron las frases iniciales");
    }
    addListeners();
    registerNotifications();
    getDeliveredNotifications();
    refreshDailyContent();
  };

  const addListeners = async () => {
    await PushNotifications.addListener("registration", (token) => {
      console.info("Registration token: ", token.value);
    });

    await PushNotifications.addListener("registrationError", (err) => {
      console.error("Registration error: ", err.error);
    });

    await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push notification received: ", notification);
      }
    );

    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log(
          "Push notification action performed",
          notification.actionId,
          notification.inputValue
        );
      }
    );
  };

  const registerNotifications = async () => {
    // Ya no se pide el permiso al arrancar (spec 021, FR-009): se solicita al
    // elegir la hora en el onboarding o al activar el interruptor de Ajustes.
    // El registro remoto solo se hace si el permiso ya fue concedido.
    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive !== "granted") return;

    await PushNotifications.register();
  };

  const getDeliveredNotifications = async () => {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log("delivered notifications", notificationList);
  };

  return (
    <IonApp>
      <RewardedLoader />
      <IonReactRouter>
        <AppRoutes />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
