import { Clipboard } from "@capacitor/clipboard";
import { Share } from "@capacitor/share";
import { IonIcon, useIonToast } from "@ionic/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  bookmark,
  bookmarkOutline,
  copyOutline,
  ellipsisHorizontal,
  shareSocialOutline,
  sparklesOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { CardColors } from "../../models/CardColors";
import { Phrase } from "../../models/Phrase";
import { hapticTap } from "../../hooks/useHaptics";
import { LanguageKeys } from "../../persistence/languages";
import "./HomeKit.css";
import { QUOTE_MARKS } from "../common/quoteMarks";
import { computeBannerMargin } from "../../ads/bannerMargin";
import { hideCardBanner, showCardBanner } from "../../ads/cardBanner";

interface CardPhraseProps {
  phrase: Pick<Phrase, "content" | "type" | "author">;
  color: CardColors;
  adBannerId: string;
  language: LanguageKeys;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * Movimiento de las tarjetas: resortes en vez de duraciones fijas, para que el
 * movimiento acelere y frene de forma natural.
 * - Entrada: suave y lenta, con un leve asentamiento.
 * - Abrir: algo más vivo, con un rebote casi imperceptible (~3 %).
 * - Cerrar: más amortiguado, vuelve a su sitio sin rebotar.
 */
const ENTER_SPRING = { type: "spring", stiffness: 130, damping: 19, mass: 1 } as const;
const OPEN_SPRING = { type: "spring", stiffness: 220, damping: 22, mass: 1 } as const;
const CLOSE_SPRING = { type: "spring", stiffness: 290, damping: 31, mass: 1 } as const;

const LANGUAGE_LABEL: Record<LanguageKeys, string> = {
  en: "English · 01",
  es: "Español · 02",
  fr: "Français · 03",
};

const colorConfig = {
  [CardColors.WOMAN_BLUE]: {
    background: "bg-[color:var(--card-woman-blue-bg)]",
    text: "text-[color:var(--card-woman-blue-text)]",
    initialPosition: "30vh",
    initialHeight: "70vh",
    expandedHeight: "90vh",
    expandedPosition: "10vh",
  },
  [CardColors.WOMAN_PURPLE]: {
    background: "bg-[color:var(--card-woman-purple-bg)]",
    text: "text-[color:var(--card-woman-purple-text)]",
    initialPosition: "45vh",
    initialHeight: "55vh",
    expandedHeight: "72vh",
    expandedPosition: "28vh",
  },
  [CardColors.WOMAN_VIOLETTE]: {
    background: "bg-[color:var(--card-woman-violette-bg)]",
    text: "text-[color:var(--card-woman-violette-text)]",
    initialPosition: "60vh",
    initialHeight: "40vh",
    expandedHeight: "54vh",
    expandedPosition: "46vh",
  },
  [CardColors.MAN_SKY_BLUE]: {
    background: "bg-[color:var(--card-man-sky-bg)]",
    text: "text-[color:var(--card-man-sky-text)]",
    initialPosition: "30vh",
    initialHeight: "70vh",
    expandedHeight: "90vh",
    expandedPosition: "10vh",
  },
  [CardColors.MAN_LIGHT_SKY_BLUE]: {
    background: "bg-[color:var(--card-man-light-bg)]",
    text: "text-[color:var(--card-man-light-text)]",
    initialPosition: "45vh",
    initialHeight: "55vh",
    expandedHeight: "72vh",
    expandedPosition: "28vh",
  },
  [CardColors.MAN_DEEP_SKY_BLUE]: {
    background: "bg-[color:var(--card-man-deep-bg)]",
    text: "text-[color:var(--card-man-deep-text)]",
    initialPosition: "60vh",
    initialHeight: "40vh",
    expandedHeight: "54vh",
    expandedPosition: "46vh",
  },
};

const CardPhrase = ({
  phrase,
  color,
  adBannerId,
  language,
  isFavorite,
  onToggleFavorite,
}: CardPhraseProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false);
  // Verdadero solo cuando la tarjeta terminó de abrirse: el banner no aparece
  // a mitad de la animación y desaparece en cuanto se pulsa para cerrar.
  const [isSettledOpen, setIsSettledOpen] = useState(false);
  const bannerSlotRef = useRef<HTMLDivElement>(null);
  const [present] = useIonToast();
  const reduceMotion = useReducedMotion();

  const presentToast = (message: string) => {
    present({
      message,
      duration: 5000,
      position: "bottom",
    });
  };

  const toggleCard = async () => {
    if (isExpanded) setIsSettledOpen(false);
    setIsExpanded((prev) => !prev);
    await hapticTap();
  };

  const {
    background,
    text,
    initialPosition,
    initialHeight,
    expandedPosition,
    expandedHeight,
  } = colorConfig[color];

  // Banner de la tarjeta (spec 020): se pide al terminar de abrirse y se
  // oculta al cerrar, al desmontar o al salir de Home (ver cardBanner.ts).
  useEffect(() => {
    if (!isSettledOpen || !bannerSlotRef.current) return;
    showCardBanner({
      ownerId: language,
      adId: adBannerId,
      margin: computeBannerMargin(bannerSlotRef.current.getBoundingClientRect()),
    });
    return () => hideCardBanner(language);
  }, [isSettledOpen, language, adBannerId]);

  // Entrada escalonada: la tarjeta de más abajo sube primero y las de arriba
  // la siguen con ~0,12 s de diferencia entre cada una.
  const animationDelay = Math.max(0, (60 - parseInt(initialPosition)) * 0.008);

  // Háptico en el instante en que la tarjeta empieza a aparecer (al terminar su
  // retardo escalonado), no cuando el resorte ya se asentó, que se sentía tarde.
  useEffect(() => {
    const timer = setTimeout(
      () => hapticTap(),
      reduceMotion ? 0 : animationDelay * 1000
    );
    return () => clearTimeout(timer);
    // Solo en la entrada inicial de la tarjeta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El movimiento depende de la fase: entrada inicial, abrir o cerrar.
  const transition = reduceMotion
    ? { duration: 0 }
    : !isInitialAnimationDone
    ? { ...ENTER_SPRING, delay: animationDelay }
    : isExpanded
    ? OPEN_SPRING
    : CLOSE_SPRING;

  return (
    <motion.div
      className={`phrase-card ${background} ${text} absolute w-full`}
      onClick={toggleCard}
      animate={{
        top: isExpanded ? expandedPosition : initialPosition,
        height: isExpanded ? expandedHeight : initialHeight,
      }}
      initial={{
        top: "100%", // Empieza fuera de la pantalla (abajo)
        height: initialHeight,
      }}
      transition={transition}
      // Leve «hundimiento» al tocar: confirma el toque sin competir con el resorte.
      whileTap={{ scale: 0.988 }}
      onAnimationComplete={(definition) => {
        // Solo cuenta la animación de posición/alto, no el efecto del toque.
        if (
          typeof definition !== "object" ||
          definition === null ||
          !("top" in definition)
        ) {
          return;
        }
        if (!isInitialAnimationDone) {
          setIsInitialAnimationDone(true); // Marca como completada la animación inicial
        }
        if (isExpanded) setIsSettledOpen(true);
      }}
    >
      <span className="card-lang">{LANGUAGE_LABEL[language]}</span>
      <motion.span
        className="card-more"
        animate={{ rotate: isExpanded ? 90 : 0 }}
        transition={reduceMotion ? { duration: 0 } : OPEN_SPRING}
      >
        <IonIcon icon={ellipsisHorizontal} />
      </motion.span>
      <h1 className="card-quote">
        {QUOTE_MARKS[language][0]}
        {phrase.content[language]}
        {QUOTE_MARKS[language][1]}
      </h1>
      <div className="mt-2 flex justify-between items-center">
        <span className="card-chip">
          <IonIcon icon={sparklesOutline} aria-hidden="true" />
          {phrase.type}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="card-action"
            aria-label="Favorite"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <IonIcon icon={isFavorite ? bookmark : bookmarkOutline} />
          </button>
          <button
            type="button"
            className="card-action"
            aria-label="Share"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await Share.share({
                  text: `${phrase.content[language]}\n\n— ${phrase.author}`,
                });
              } catch (error) {
                // Cancelar el share sheet nativo también rechaza la promesa
                // en algunas plataformas (ej. iOS) — no es necesariamente un
                // error real, así que no se muestra toast (research.md Decisión 4).
                console.error("Error al compartir", error);
              }
            }}
          >
            <IonIcon icon={shareSocialOutline} />
          </button>
          <button
            type="button"
            className="card-action"
            aria-label="Copy"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await Clipboard.write({
                  string: phrase.content[language],
                });
                presentToast("Frase copiada al portapapeles");
              } catch (err) {
                presentToast("Error al copiar al portapapeles");
              }
            }}
          >
            <IonIcon icon={copyOutline} />
          </button>
        </div>
      </div>
      {/* Espacio reservado para el banner nativo (spec 020); transparente. */}
      <div ref={bannerSlotRef} aria-hidden="true" className="mt-4 min-h-[60px]" />
    </motion.div>
  );
};

export default CardPhrase;
