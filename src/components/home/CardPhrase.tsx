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
    position: "top-[32%]",
    height: "h-[68%]",
  },
  [CardColors.WOMAN_PURPLE]: {
    background: "bg-violet-400",
    text: "text-purple-900",
    position: "top-[50%]",
    height: "h-[50%]",
  },
  [CardColors.WOMAN_VIOLETTE]: {
    background: "bg-violet-300",
    text: "text-indigo-900",
    position: "top-[68%]",
    height: "h-[32%]",
  },
  [CardColors.MAN_SKY_BLUE]: {
    background: "bg-sky-500",
    text: "text-sky-800",
    position: "top-[32%]",
    height: "h-[68%]",
  },
  [CardColors.MAN_LIGHT_SKY_BLUE]: {
    background: "bg-cyan-700",
    text: "text-sky-900",
    position: "top-[52%]",
    height: "h-[48%]",
  },
  [CardColors.MAN_DEEP_SKY_BLUE]: {
    background: "bg-slate-400",
    text: "text-sky-900",
    position: "top-[72%]",
    height: "h-[28%]",
  },
};

const CardPhrase = ({ phrase, position, color }: CardPhraseProps) => {
  return (
    <div
      className={`${colorConfig[color].background} 
       rounded-t-3xl p-6 shadow-[rgba(0,0,0,0.55)_-2px_-2px_10px_-2px] absolute
      ${colorConfig[color].position}  ${colorConfig[color].height}`}
    >
      <h1 className={`${colorConfig[color].text} text-lg font-semibold `}>
        {phrase}
      </h1>
    </div>
  );
};

export default CardPhrase;
