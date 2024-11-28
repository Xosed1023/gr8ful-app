import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import Tab1 from "./pages/Gender";
import Tab2 from "./pages/QuoteTime";
import Tab3 from "./pages/QuoteTopics";
import "./tailwind.css";
import { initialData } from "./persistence/initialData";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import { useEffect } from "react";
import { addPhrasesBatch, initDB } from "./persistence/IndexedDBService";
import Languages from './pages/Languages';
import Gender from './pages/Gender';
import QuoteTime from './pages/QuoteTime';
import QuoteTopics from './pages/QuoteTopics';
import UserName from './pages/UserName';
import LoadingScreen from './pages/LoadingScreen';
import MainHome from "./pages/MainHome";

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
    if (localStorage.getItem("firstTime") === null) {
      console.log("Cargando datos iniciales por ser primera vez");
      await addPhrasesBatch(initialData);
      localStorage.setItem("gr8fulFirstTime", "true");
    }
  };

  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/mainHome" component={MainHome} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/languages" component={Languages} />
        <Route exact path="/gender" component={Gender} />
        <Route exact path="/quoteTime" component={QuoteTime} />
        <Route exact path="/quoteTopics" component={QuoteTopics} />
        <Route exact path="/userName" component={UserName} />
        <Route exact path="/loadingScreen" component={LoadingScreen} />
        <Redirect from="*" to="/"></Redirect>
        {/* <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={triangle} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={ellipse} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs> */}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
