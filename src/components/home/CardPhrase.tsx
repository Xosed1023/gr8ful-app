import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { motion } from "framer-motion";
import { useState } from "react";
import { CardColors } from "../../models/CardColors";

interface CardPhraseProps {
  phrase: string;
  color: CardColors;
}

const colorConfig = {
  [CardColors.WOMAN_BLUE]: {
    background: "bg-sky-500",
    text: "text-sky-900",
    initialPosition: "35vh",
    initialHeight: "65vh",
    expandedHeight: "90vh",
    expandedPosition: "10vh",
  },
  [CardColors.WOMAN_PURPLE]: {
    background: "bg-violet-400",
    text: "text-purple-900",
    initialPosition: "53vh",
    initialHeight: "47vh",
    expandedHeight: "72vh",
    expandedPosition: "28vh",
  },
  [CardColors.WOMAN_VIOLETTE]: {
    background: "bg-violet-300",
    text: "text-indigo-900",
    initialPosition: "70vh",
    initialHeight: "30vh",
    expandedHeight: "54vh",
    expandedPosition: "46vh",
  },
  [CardColors.MAN_SKY_BLUE]: {
    background: "bg-sky-500",
    text: "text-sky-800",
    initialPosition: "35vh",
    initialHeight: "65vh",
    expandedPosition: "10vh",
    expandedHeight: "90vh",
  },
  [CardColors.MAN_LIGHT_SKY_BLUE]: {
    background: "bg-cyan-700",
    text: "text-sky-900",
    initialPosition: "53vh",
    initialHeight: "47vh",
    expandedPosition: "10vh",
    expandedHeight: "90vh",
  },
  [CardColors.MAN_DEEP_SKY_BLUE]: {
    background: "bg-slate-400",
    text: "text-sky-900",
    initialPosition: "70vh",
    initialHeight: "30vh",
    expandedPosition: "20vh",
    expandedHeight: "80vh",
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

  const {
    background,
    text,
    initialPosition,
    initialHeight,
    expandedPosition,
    expandedHeight,
  } = colorConfig[color];

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
