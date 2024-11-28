import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './WomanTime.css';
import { useHistory } from "react-router";

const WomanTime: React.FC = () => {
  const navigate = useHistory();
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="background-woman flex flex-col items-center justify-center min-h-screen">
          {/* SVG de los puntos superiores */}
          <img src="./step4.svg" alt="Progress dots" className="dots1 absolute top-20" />

          {/* Texto principal */}
          <div className="text-container flex flex-col items-center mt-12 px-16 pb-6 pt-6">
            <p className="text-normal">
              When should we send your daily{" "}
              <span className="text-highlight">quote? *</span>
            </p>
          </div>

          {/* Botones de horario */}
          <div className="buttons-container flex flex-col gap-4 mt-12 pb-6">
            <button
              className="time-button"
              onClick={() => navigate.push("/time/6am")}
            >
              6:00 AM
            </button>
            <button
              className="time-button"
              onClick={() => navigate.push("/time/12pm")}
            >
              12:00 PM
            </button>
            <button
              className="time-button"
              onClick={() => navigate.push("/time/6pm")}
            >
              6:00 PM
            </button>
          </div>

          {/* Texto de nota */}
          <div className="note-container mt-8 text-center px-20">
            <p className="text-note">
              * You can change this later in settings.
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WomanTime;
