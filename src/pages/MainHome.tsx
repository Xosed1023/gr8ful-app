import { IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { settings, sync } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Home from "./Home";
import Gender from "./Gender";

const MainHome = () => {
  return (
    <IonReactRouter>
      <IonTabs className="bg-indigo-950">
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/settings">
            <Gender />
          </Route>
          <Route exact path="/mainHome">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" className="bg-slate-900 rounded-t-3xl">
          <IonTabButton tab="home" href="/home" className="bg-slate-900">
            <IonIcon aria-hidden="true" icon={sync} />
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings" className="bg-slate-900">
            <IonIcon aria-hidden="true" icon={settings} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default MainHome;
