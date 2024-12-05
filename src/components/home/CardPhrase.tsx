import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CardColors } from "../../models/CardColors";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

interface CardPhraseProps {
  phrase: string;
  color: CardColors;
}

const colorConfig = {
  [CardColors.WOMAN_BLUE]: {
    background: "bg-sky-500",
    text: "text-sky-900",
    initialPosition: "30vh", // Cambiado a vh para ser relativo al tamaño del viewport
    initialHeight: "70vh", // Altura relativa
    expandedPosition: "0vh",
    expandedHeight: "100vh",
  },
  [CardColors.WOMAN_PURPLE]: {
    background: "bg-violet-400",
    text: "text-purple-900",
    initialPosition: "50vh",
    initialHeight: "50vh",
    expandedPosition: "10vh",
    expandedHeight: "90vh",
  },
  [CardColors.WOMAN_VIOLETTE]: {
    background: "bg-violet-300",
    text: "text-indigo-900",
    initialPosition: "70vh",
    initialHeight: "30vh",
    expandedPosition: "20vh",
    expandedHeight: "80vh",
  },
  [CardColors.MAN_SKY_BLUE]: {
    background: "bg-sky-500",
    text: "text-sky-800",
    initialPosition: "32%",
    initialHeight: "68%",
    expandedPosition: "10%",
    expandedHeight: "90%",
  },
  [CardColors.MAN_LIGHT_SKY_BLUE]: {
    background: "bg-cyan-700",
    text: "text-sky-900",
    initialPosition: "52%",
    initialHeight: "48%",
    expandedPosition: "10%",
    expandedHeight: "90%",
  },
  [CardColors.MAN_DEEP_SKY_BLUE]: {
    background: "bg-slate-400",
    text: "text-sky-900",
    initialPosition: "72%",
    initialHeight: "28%",
    expandedPosition: "10%",
    expandedHeight: "90%",
  },
};

const CardPhrase = ({ phrase, color }: CardPhraseProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false);

  const toggleCard = async () => {
    setIsExpanded((prev) => !prev);
    // Copiar esta línea para las vibraciones
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const { background, text, initialPosition, initialHeight, expandedPosition, expandedHeight } =
    colorConfig[color];

  const triggerHapticFeedback = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      if (navigator.vibrate) navigator.vibrate(50); // Fallback para navegadores
    }
  };

  // Calcula el delay invertido basado en `initialPosition`
  const calculateDelay = (position: string) => {
    const invertedValue = 100 - parseInt(position.replace("%", ""));
    return invertedValue * 0.01; // Convierte el porcentaje invertido en segundos
  };

  const animationDelay = calculateDelay(initialPosition);

  return (
    <motion.div
      className={`${background} rounded-t-3xl p-6 shadow-[rgba(0,0,0,0.55)_-2px_-2px_10px_-2px] absolute w-full`}
      onClick={toggleCard}
      animate={{
        top: isExpanded ? expandedPosition : initialPosition,
        height: isExpanded ? expandedHeight : initialHeight,
      }}
      initial={{
        top: "100%", // Empieza fuera de la pantalla (abajo)
        height: initialHeight,
      }}
      transition={{
        top: {
          duration: 0.4,
          ease: "easeOut",
          delay: isInitialAnimationDone ? 0 : animationDelay, // Aplica delay solo en la animación inicial
        },
        height: { duration: 0.4, ease: "easeInOut" },
      }}
      onAnimationComplete={() => {
        if (!isInitialAnimationDone) {
          setIsInitialAnimationDone(true); // Marca como completada la animación inicial
          triggerHapticFeedback(); // Vibra al finalizar la animación de entrada
        }
      }}
    >
      <h1 className={`${text} text-lg font-semibold`}>{phrase}</h1>
    </motion.div>
  );
};

export default CardPhrase;
