import { CardColors } from "../../models/CardColors";

interface CardPhraseProps {
  phrase: string;
  position: number;
  color: CardColors;
}

const CardPhrase = ({ phrase, position, color }: CardPhraseProps) => {
  return (
    <div className="bg-sky-500 h-screen rounded-t-3xl p-6 shadow-[rgba(0,0,0,0.55)_-2px_-2px_10px_-2px]">
      <h1 className="text-lg font-semibold text-sky-900">{phrase}</h1>
    </div>
  );
};

export default CardPhrase;
