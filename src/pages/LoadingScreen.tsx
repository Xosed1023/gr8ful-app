import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import "./LoadingScreen.css";

const LoadingScreen: React.FC = () => {
  const navigate = useIonRouter();
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="background-waiting flex flex-col items-center justify-center min-h-screen">
          {/* Texto principal */}
          <div className="text-container-loading text-center">
            <p className="text-normal">
              Good things take time. Your quote is on its{" "}
              <span className="text-highlight">way!</span>
            </p>
          </div>

          {/* SVG de la pluma */}
          <div className="feather-container mt-8">
            <img
              src="./feather.svg"
              alt="Feather"
              className="feather animate-feather"
              onClick={() => navigate.push("/mainHome", "forward")}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoadingScreen;
