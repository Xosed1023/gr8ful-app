import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { settings, sync } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Home from "./Home";
import Settings from "./Settings";
import Languages from "./Languages";
import QuoteTime from "./QuoteTime";
import QuoteTopics from "./QuoteTopics";
import UserName from "./UserName";
import { useEffect, useState } from "react";
import {
  addOrUpdatePhrase,
  getPhraseById,
  getRandomPhrase,
  initDB,
} from "../persistence/IndexedDBService";
import { Phrase } from "../models/Phrase";

const MainHome = () => {
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [homeRefreshTrigger, setHomeRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    initDB().then(() => {
      if (phrase === null) {
        loadRandomPhrase();
      }
    });
  }, []);

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
    console.log('Tab de Home tocado nuevamente.');
    if (tab === 'home' && activeTab === 'home') {
      console.log('Tab de Home tocado nuevamente.');
      setHomeRefreshTrigger(prev => prev + 1); // Actualizar estado
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
              loadRandomPhrase()
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
