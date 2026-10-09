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
import ShareSheet from "../../share/ShareSheet";
import { computeBannerMargin } from "../../ads/bannerMargin";
import { hideCardBanner, showCardBanner } from "../../ads/cardBanner";
import { registerAdMoment } from "../../ads/adMoments";
import { isTutorialActive } from "../../tutorial/tutorialState";
import { CALM_SPRING } from "../../theme/motion";

interface CardPhraseProps {
  phrase: Pick<Phrase, "content" | "type" | "author">;
  color: CardColors;
  adBannerId: string;
  language: LanguageKeys;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * Movimiento de las tarjetas (spec 031): resortes sobreamortiguados —nunca pasan de su
 * destino ni rebotan—, para que las tarjetas se posen con calma.
 * - Entrada: lenta y suave (CALM_SPRING), escalonada de abajo arriba.
 * - Abrir: igual de suave, sin prisa.
 * - Cerrar: algo más firme para que la tarjeta vuelva a su sitio sin arrastrarse.
 */
const ENTER_SPRING = CALM_SPRING;
const OPEN_SPRING = CALM_SPRING;
const CLOSE_SPRING = { ...CALM_SPRING, stiffness: 110, damping: 26, mass: 1.1 } as const;

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

/** Durante el tutorial guiado no cuentan los momentos de valor de los anuncios (spec 030). */
const adMoment = (moment: Parameters<typeof registerAdMoment>[0]) => {
  if (!isTutorialActive()) registerAdMoment(moment);
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
  const [shareOpen, setShareOpen] = useState(false);

  // «Como texto»: el compartir de siempre (frase + autor, en el idioma de la tarjeta)
  const shareAsText = async () => {
    setShareOpen(false);
    try {
      await Share.share({
        text: `${phrase.content[language]}\n\n— ${phrase.author}`,
      });
      adMoment("share");
    } catch (error) {
      // Cancelar el share sheet nativo también rechaza la promesa
      // en algunas plataformas (ej. iOS) — no es necesariamente un
      // error real, así que no se muestra toast (research.md Decisión 4).
      console.error("Error al compartir", error);
    }
  };

  const presentToast = (message: string) => {
    present({
      message,
      duration: 5000,
      position: "bottom",
    });
  };

  const toggleCard = async () => {
    if (isExpanded) {
      setIsSettledOpen(false);
      adMoment("card_close");
    }
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
    // Sin banners mientras dura el tutorial guiado
    if (!isSettledOpen || !bannerSlotRef.current || isTutorialActive()) return;
    showCardBanner({
      ownerId: language,
      adId: adBannerId,
      margin: computeBannerMargin(bannerSlotRef.current.getBoundingClientRect()),
    });
    return () => hideCardBanner(language);
  }, [isSettledOpen, language, adBannerId]);

  // Entrada escalonada: la tarjeta de más abajo sube primero y las de arriba
  // la siguen con ~0,12 s de diferencia entre cada una.
  const animationDelay = Math.max(0, (60 - parseInt(initialPosition)) * 0.012);

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
      // El tutorial guiado localiza la tarjeta y sabe si está abierta y asentada (spec 030)
      data-tutorial={`card-${language}`}
      data-tutorial-open={isExpanded}
      data-tutorial-settled={isSettledOpen}
      animate={{
        top: isExpanded ? expandedPosition : initialPosition,
        height: isExpanded ? expandedHeight : initialHeight,
      }}
      initial={{
        top: "100%", // Empieza fuera de la pantalla (abajo)
        height: initialHeight,
      }}
      transition={transition}
      // Leve «hundimiento» al tocar (--motion-press): confirma el toque sin competir con el resorte.
      whileTap={{ scale: 0.985 }}
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
        <div className="flex gap-2" data-tutorial="actions">
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
            onClick={(e) => {
              e.stopPropagation();
              setShareOpen(true);
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
                adMoment("copy");
              } catch (err) {
                presentToast("Error al copiar al portapapeles");
              }
            }}
          >
            <IonIcon icon={copyOutline} />
          </button>
        </div>
      </div>
      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        quote={phrase.content[language]}
        author={phrase.author}
        language={language}
        onShareText={shareAsText}
      />
      {/* Espacio reservado para el banner nativo (spec 020); transparente. */}
      <div ref={bannerSlotRef} aria-hidden="true" className="mt-4 min-h-[60px]" />
    </motion.div>
  );
};

export default CardPhrase;
