import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./LoadingScreen.css";
import { useEffect, useState } from "react";
import { AppLoadingScreenLanguage } from '../persistence/languages';

const LoadingScreen: React.FC = () => {
  const navigate = useIonRouter();
  const [title, setTitle] = useState(["Good things take time. Your quote is on its", "way!"]);
  const [userLanguage, setUserLanguage] = useState(localStorage.getItem("language"));
  const isMale = localStorage.gender === "M";

  useEffect(() => {
    setTitle(
      AppLoadingScreenLanguage.title[
      userLanguage as keyof typeof AppLoadingScreenLanguage.title
      ]
    );
  }, []);

  const backgroundClass =
    localStorage.gender === "W" ? "background-waiting" : "loading-man";

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={`${backgroundClass} flex flex-col items-center justify-center min-h-screen`}>
          {/* Texto principal */}
          <div className="text-container-loading text-center">
            <p className="text-normal">
              {title[0]} {" "} {title[1]} {" "}
              <span className="text-highlight">{title[2]}</span>
            </p>
          </div>

          {/* Condicional para SVG o GIF */}
          <div className="media-container mt-8">
            {isMale ? (
              <img
                src="./flame.gif"
                alt="Loading Animation"
                className="animate-man"
                onClick={() => navigate.push("/mainHome", "forward")}
              />
            ) : (
              <img
                src="./feather.svg"
                alt="Feather"
                className="feather animate-feather"
                onClick={() => navigate.push("/mainHome", "forward")}
              />
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoadingScreen;
