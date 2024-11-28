import { useState } from "react";
import { motion } from "framer-motion";
import { CardColors } from "../../models/CardColors";

interface CardPhraseProps {
  phrase: string;
  position: number;
  color: CardColors;
}

interface CardPhraseStyle {
  background: string;
  text: string;
  position: string;
  height: string;
}

const colorConfig: Record<CardColors, CardPhraseStyle> = {
  [CardColors.WOMAN_BLUE]: {
    background: "bg-sky-500",
    text: "text-sky-900",
    position: "32%", // Cambia las posiciones a valores numéricos para animación
    height: "58%",
  },
  [CardColors.WOMAN_PURPLE]: {
    background: "bg-violet-400",
    text: "text-purple-900",
    position: "50%",
    height: "40%",
  },
  [CardColors.WOMAN_VIOLETTE]: {
    background: "bg-violet-300",
    text: "text-indigo-900",
    position: "68%",
    height: "20%",
  },
  [CardColors.MAN_SKY_BLUE]: {
    background: "bg-sky-500",
    text: "text-sky-800",
    position: "32%",
    height: "68%",
  },
  [CardColors.MAN_LIGHT_SKY_BLUE]: {
    background: "bg-cyan-700",
    text: "text-sky-900",
    position: "52%",
    height: "48%",
  },
  [CardColors.MAN_DEEP_SKY_BLUE]: {
    background: "bg-slate-400",
    text: "text-sky-900",
    position: "72%",
    height: "28%",
  },
};

const CardPhrase = ({ phrase, position, color }: CardPhraseProps) => {
  const [componentColorConfig, setComponentColorConfig] = useState(colorConfig);
  const [topPosition, setTopPosition] = useState(colorConfig[color].position);
  
  const handleClick = (currentPosition: number) => {
    // Cambia la posición según el valor de `position`
    switch (currentPosition) {
      case 0:
        setTopPosition("10%"); // Nueva posición
        break;
      case 1:
        setTopPosition("40%");
        break;
      case 2:
        setTopPosition("70%");
        break;
      default:
        setTopPosition("32%");
    }
  };

  return (
    <motion.div
      className={`${colorConfig[color].background} 
        rounded-t-3xl p-6 shadow-[rgba(0,0,0,0.55)_-2px_-2px_10px_-2px] absolute 
        ${colorConfig[color].height}`}
      style={{ top: topPosition }} // Aplica la posición dinámica
      onClick={() => handleClick(position)}
      animate={{ top: topPosition }} // Propiedad animada
      initial={{ top: topPosition }} // Estado inicial
      transition={{ duration: 0.5 }} // Duración de la animación
    >
      <h1 className={`${colorConfig[color].text} text-lg font-semibold`}>
        {phrase}
      </h1>
    </motion.div>
  );
};

export default CardPhrase;
