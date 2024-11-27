import { IonContent, IonPage } from "@ionic/react";
import "./Welcome.css";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const Welcome: React.FC = () => {
  const welcomeTexts = [
    "Discover daily inspiration and gratitude quotes to brighten your day!",
    "Descubre frases diarias de inspiración y gratitud para alegrar tu día.",
    "Découvrez des citations quotidiennes d'inspiration et de gratitude pour illuminer votre journée !",
  ];
  const [welcomeText, setWelcomeText] = useState(welcomeTexts[0]);
  const [textIndex, setTextIndex] = useState(0); // Índice del texto actual
  const navigate = useHistory();

  useEffect(() => {
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
            className="continue-button px-10 py-2 text-white rounded-full"
            onClick={() => navigate.push("/home")}
          >
            Continue
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
