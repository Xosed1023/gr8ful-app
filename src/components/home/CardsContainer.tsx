import { CardColors } from "../../models/CardColors";
import { Phrase } from "../../models/Phrase";
import CardPhrase from "./CardPhrase";

const CardsContainer = ({ phrase }: { phrase: Phrase }) => {

  return (
    <div className="overflow-y-hidden flex flex-col items-center">
      <CardPhrase color={CardColors.WOMAN_BLUE} phrase={phrase.content.en} />
      <CardPhrase color={CardColors.WOMAN_PURPLE} phrase={phrase.content.es} />
      <CardPhrase
        color={CardColors.WOMAN_VIOLETTE}
        phrase={phrase.content.fr}
      />

      <div
        className={`bg-indigo-950 rounded-t-3xl p-6 shadow-[rgba(0,0,0,0.55)_-2px_-2px_10px_-2px] absolute bottom-14 z-9 w-full flex justify-center items-center h-3`}
      >
        <h1 className={`text-lg font-semibold text-white`}>{phrase.author}</h1>
      </div>
    </div>
  );
};

export default CardsContainer;
