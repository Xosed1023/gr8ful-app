import { IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { settings, sync } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Home from "./Home";
import Settings from "./Settings";
import Languages from "./Languages";
import QuoteTime from "./QuoteTime";
import QuoteTopics from "./QuoteTopics";
import UserName from "./UserName";

const MainHome = () => {
  return (
    <IonReactRouter>
      <IonTabs className="bg-indigo-950">
        <IonRouterOutlet>
          <Route exact path="/tabs/home" component={Home} />
          <Route exact path="/tabs/settings" component={Settings} />
          <Route exact path="/languages">
            <Languages backTo="/tabs/settings"/>
          </Route>
          <Route exact path="/quoteTime">
            <QuoteTime backTo="/tabs/settings"/>
          </Route>
          <Route exact path="/quoteTopics">
            <QuoteTopics backTo="/tabs/settings"/>
          </Route>
          <Route exact path="/userName">
            <UserName backTo="/tabs/settings"/>
          </Route>
          <Route exact path="/mainHome" render={() => <Redirect to="/tabs/home" />} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom" className="bg-slate-900 rounded-t-3xl">
          <IonTabButton tab="home" href="/tabs/home" className="bg-slate-900">
            <IonIcon aria-hidden="true" icon={sync} />
          </IonTabButton>
          <IonTabButton tab="settings" href="/tabs/settings" className="bg-slate-900">
            <IonIcon aria-hidden="true" icon={settings} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default MainHome;
