import { isPlatform, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { CardColors } from "../../models/CardColors";
import { Phrase } from "../../models/Phrase";
import CardPhrase from "./CardPhrase";
import { useUserGender } from "../../hooks/useUserGender";
import { getPhraseById, toggleFavorite } from "../../persistence/IndexedDBService";

const CardsContainer = ({ phrase }: { phrase: Phrase }) => {
  const { isMale } = useUserGender();
  const [isFavorite, setIsFavorite] = useState(phrase.isFavorite);

  // Re-lee el estado real al revisitar el tab Home (p. ej. tras desmarcar
  // esta misma frase desde el tab Favoritos) — ver research.md Decisión 3.
  useIonViewWillEnter(() => {
    if (phrase.id == null) return;
    getPhraseById(phrase.id).then((p) => {
      if (p) setIsFavorite(p.isFavorite);
    });
  });

  const handleToggleFavorite = async () => {
    if (phrase.id == null) return;
    const next = !isFavorite;
    setIsFavorite(next);
    await toggleFavorite(phrase.id, next);
  };

  return (
    <>
      <CardPhrase
        color={isMale ? CardColors.MAN_SKY_BLUE : CardColors.WOMAN_BLUE}
        phrase={phrase}
        adBannerId={isPlatform("ios") ? import.meta.env.VITE_IOS_EN_CARD : import.meta.env.VITE_ANDROID_EN_CARD}
        language="en"
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
      <CardPhrase
        color={isMale ? CardColors.MAN_LIGHT_SKY_BLUE : CardColors.WOMAN_PURPLE}
        phrase={phrase}
        adBannerId={isPlatform("ios") ? import.meta.env.VITE_IOS_ES_CARD : import.meta.env.VITE_ANDROID_ES_CARD}
        language="es"
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
      <CardPhrase
        color={isMale ? CardColors.MAN_DEEP_SKY_BLUE : CardColors.WOMAN_VIOLETTE}
        phrase={phrase}
        adBannerId={isPlatform("ios") ? import.meta.env.VITE_IOS_FR_CARD : import.meta.env.VITE_ANDROID_FR_CARD}
        language="fr"
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />

      <div
        className={`${
          isMale
            ? "bg-[color:var(--author-bar-man)]"
            : "bg-[color:var(--author-bar-woman)]"
        } rounded-t-3xl p-6 shadow-[rgba(0,0,0,0.55)_-2px_-2px_10px_-2px] absolute ${
          isPlatform("ios") ? "bottom-16 pb-10" : "bottom-14"
        } z-9 w-full flex justify-center items-center h-3`}
      >
        <h1 className={`text-lg font-semibold text-white`}>{phrase.author}</h1>
      </div>
    </>
  );
};

export default CardsContainer;
