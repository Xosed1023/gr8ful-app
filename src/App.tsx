import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useHistory } from "react-router-dom";
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
import Home from "./pages/Home";
import Languages from "./pages/Languages";
import LoadingScreen from "./pages/LoadingScreen";
import MainHome from "./pages/MainHome";
import QuoteTime from "./pages/QuoteTime";
import QuoteTopics from "./pages/QuoteTopics";
import UserName from "./pages/UserName";
import Welcome from "./pages/Welcome";
import { addPhrasesBatch, initDB } from "./persistence/IndexedDBService";
import "./theme/variables.css";
import { PushNotifications } from "@capacitor/push-notifications";

setupIonicReact();

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
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      throw new Error("User denied permissions!");
    }

    await PushNotifications.register();
  };

  const getDeliveredNotifications = async () => {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log("delivered notifications", notificationList);
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/languages" component={Languages} />
          <Route exact path="/gender" component={Gender} />
          <Route exact path="/quoteTime" component={QuoteTime} />
          <Route exact path="/quoteTopics" component={QuoteTopics} />
          <Route exact path="/userName" component={UserName} />
          <Route exact path="/loadingScreen" component={LoadingScreen} />
          <Route
            exact
            path={["/mainHome", "/tabs/home"]}
            component={MainHome}
          />
          <Route>
            <Redirect to="/" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
