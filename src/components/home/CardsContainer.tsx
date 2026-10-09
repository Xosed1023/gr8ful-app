import {
  isPlatform,
  useIonViewDidEnter,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { CardColors } from "../../models/CardColors";
import { Phrase } from "../../models/Phrase";
import CardPhrase from "./CardPhrase";
import { useUserGender } from "../../hooks/useUserGender";
import { getPhraseById, toggleFavorite } from "../../persistence/IndexedDBService";
import { setHomeVisible } from "../../ads/cardBanner";
import { useAppLanguage } from "../../hooks/useAppLanguage";
import { AppHomeNavLanguage } from "../../persistence/languages";
import { IoSync } from "react-icons/io5";
import "./HomeKit.css";

interface CardsContainerProps {
  phrase: Phrase;
  /** Pide otra frase (la misma acción que tocar la pestaña de inicio estando en Home). */
  onRefresh: () => void;
}

const CardsContainer = ({ phrase, onRefresh }: CardsContainerProps) => {
  const { isMale } = useUserGender();
  const { userLanguage } = useAppLanguage();
  const [isFavorite, setIsFavorite] = useState(phrase.isFavorite);

  // Al cambiar la frase (p. ej. tras el anuncio de «Renovar inspiración») el estado de favorito
  // debe ser el de la frase nueva, no el de la anterior.
  useEffect(() => {
    setIsFavorite(phrase.isFavorite);
  }, [phrase.id, phrase.isFavorite]);

  // Re-lee el estado real al revisitar el tab Home (p. ej. tras desmarcar
  // esta misma frase desde el tab Favoritos) — ver research.md Decisión 3.
  useIonViewWillEnter(() => {
    if (phrase.id == null) return;
    getPhraseById(phrase.id).then((p) => {
      if (p) setIsFavorite(p.isFavorite);
    });
  });

  // El banner nativo flota sobre toda la app: se oculta al salir de Home y
  // reaparece al volver si hay una tarjeta abierta (spec 020, FR-007).
  useIonViewWillLeave(() => setHomeVisible(false));
  useIonViewDidEnter(() => setHomeVisible(true));

  const handleToggleFavorite = async () => {
    if (phrase.id == null) return;
    const next = !isFavorite;
    setIsFavorite(next);
    await toggleFavorite(phrase.id, next);
  };

  return (
    <>
      <div className="cards-layer">
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

      </div>

      {/* Pie: autor y renovar, sobre el espacio de la barra flotante */}
      <div className="home-footer">
        <div className={`author-slab ${isMale ? "man" : "woman"}`}>
          <div className="author-line">
            <span className="rule" />
            <h1>{phrase.author}</h1>
            <span className="rule" />
          </div>
          <button type="button" className="refresh-row" onClick={onRefresh}>
            <IoSync aria-hidden="true" />
            {AppHomeNavLanguage.refresh[userLanguage]}
          </button>
        </div>
        <div className="nav-spacer" />
      </div>
    </>
  );
};

export default CardsContainer;
