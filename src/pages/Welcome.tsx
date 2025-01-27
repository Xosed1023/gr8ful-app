import { IonButton, IonContent, IonPage, useIonRouter } from "@ionic/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import "./Welcome.css";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const Welcome: React.FC = () => {
  const welcomeTexts = [
    "Discover daily inspiration and gratitude quotes to brighten your day!",
    "Descubre frases diarias de inspiración y gratitud para alegrar tu día.",
    "Découvrez des citations quotidiennes d'inspiration et de gratitude pour illuminer votre journée !",
  ];
  const [welcomeText, setWelcomeText] = useState(welcomeTexts[0]);
  const [textIndex, setTextIndex] = useState(0); // Índice del texto actual
  const navigate = useIonRouter();

  useEffect(() => {
    if(localStorage.getItem("gr8fulFirstTime") === "true"){
      navigate.push("/mainHome", "forward");
    }

    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % welcomeTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Actualiza el texto cuando cambia el índice
    setWelcomeText(welcomeTexts[textIndex]);
  }, [textIndex]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area">
          <div className="background flex flex-col items-center justify-center min-h-screen">
            {/* Logo */}
            <img src="./logo.svg" alt="Gr8ful Logo" className="logo" />

            {/* Descripción */}
            <div className="text-container mb-6 pb-8 h-44">
              <AnimatePresence mode="wait">
                <motion.p
                  key={textIndex} // Cambia el componente cuando cambia el índice
                  className="description text-center"
                  initial={{ opacity: 0 }} // Estado inicial: invisible
                  animate={{ opacity: 1 }} // Estado final: visible
                  exit={{ opacity: 0 }} // Animación de salida
                  transition={{ duration: 0.8 }} // Duración de la animación
                >
                  {welcomeText}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Botón */}
            <button
              className='ionic-button'
              onClick={async () => {
                navigate.push("/languages", "forward")
                await Haptics.impact({ style: ImpactStyle.Medium });
              }
              }
            >
              Continue
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
