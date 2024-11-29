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
    initialPosition: "32%",
    initialHeight: "68%",
    expandedPosition: "0%",
    expandedHeight: "100%",
  },
  [CardColors.WOMAN_PURPLE]: {
    background: "bg-violet-400",
    text: "text-purple-900",
    initialPosition: "50%",
    initialHeight: "50%",
    expandedPosition: "18%",
    expandedHeight: "82%",
  },
  [CardColors.WOMAN_VIOLETTE]: {
    background: "bg-violet-300",
    text: "text-indigo-900",
    initialPosition: "68%",
    initialHeight: "31%",
    expandedPosition: "36%",
    expandedHeight: "64%",
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

  const toggleCard = () => {
    setIsExpanded((prev) => !prev);
  };

  const { background, text, initialPosition, initialHeight, expandedPosition, expandedHeight } =
    colorConfig[color];

  return (
    <motion.div
      className={`${background} rounded-t-3xl p-6 shadow-[rgba(0,0,0,0.55)_-2px_-2px_10px_-2px] absolute w-full`}
      style={{ top: initialPosition }}
      onClick={toggleCard}
      animate={{
        top: isExpanded ? expandedPosition : initialPosition,
        height: isExpanded ? expandedHeight : initialHeight,
      }}
      initial={{
        top: initialPosition,
        height: initialHeight,
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <h1 className={`${text} text-lg font-semibold`}>{phrase}</h1>
    </motion.div>
  );
};

export default CardPhrase;