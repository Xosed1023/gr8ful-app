import {
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
} from "@capacitor-community/admob";
import { Clipboard } from "@capacitor/clipboard";
import { Share } from "@capacitor/share";
import {
  IonButton,
  IonChip,
  IonIcon,
  isPlatform,
  useIonToast,
} from "@ionic/react";
import { motion } from "framer-motion";
import {
  bookmark,
  bookmarkOutline,
  copyOutline,
  ellipsisHorizontal,
  shareSocialOutline,
} from "ionicons/icons";
import { useState } from "react";
import { CardColors } from "../../models/CardColors";
import { Phrase } from "../../models/Phrase";
import { hapticTap } from "../../hooks/useHaptics";
import { LanguageKeys } from "../../persistence/languages";

interface CardPhraseProps {
  phrase: Pick<Phrase, "content" | "type" | "author">;
  color: CardColors;
  adBannerId: string;
  language: LanguageKeys;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const colorConfig = {
  [CardColors.WOMAN_BLUE]: {
    background: "bg-[color:var(--card-woman-blue-bg)]",
    text: "text-[color:var(--card-woman-blue-text)]",
    initialPosition: "35vh",
    initialHeight: "65vh",
    expandedHeight: "90vh",
    expandedPosition: "10vh",
    bottomAdSpace: isPlatform("ios") ? 400 : 450,
  },
  [CardColors.WOMAN_PURPLE]: {
    background: "bg-[color:var(--card-woman-purple-bg)]",
    text: "text-[color:var(--card-woman-purple-text)]",
    initialPosition: "53vh",
    initialHeight: "47vh",
    expandedHeight: "72vh",
    expandedPosition: "28vh",
    bottomAdSpace: isPlatform("ios") ? 250 : 300,
  },
  [CardColors.WOMAN_VIOLETTE]: {
    background: "bg-[color:var(--card-woman-violette-bg)]",
    text: "text-[color:var(--card-woman-violette-text)]",
    initialPosition: "70vh",
    initialHeight: "30vh",
    expandedHeight: "54vh",
    expandedPosition: "46vh",
    bottomAdSpace: isPlatform("ios") ? 120 : 170,
  },
  [CardColors.MAN_SKY_BLUE]: {
    background: "bg-[color:var(--card-man-sky-bg)]",
    text: "text-[color:var(--card-man-sky-text)]",
    initialPosition: "35vh",
    initialHeight: "65vh",
    expandedHeight: "90vh",
    expandedPosition: "10vh",
    bottomAdSpace: isPlatform("ios") ? 400 : 450,
  },
  [CardColors.MAN_LIGHT_SKY_BLUE]: {
    background: "bg-[color:var(--card-man-light-bg)]",
    text: "text-[color:var(--card-man-light-text)]",
    initialPosition: "53vh",
    initialHeight: "47vh",
    expandedHeight: "72vh",
    expandedPosition: "28vh",
    bottomAdSpace: isPlatform("ios") ? 250 : 300,
  },
  [CardColors.MAN_DEEP_SKY_BLUE]: {
    background: "bg-[color:var(--card-man-deep-bg)]",
    text: "text-[color:var(--card-man-deep-text)]",
    initialPosition: "70vh",
    initialHeight: "30vh",
    expandedHeight: "54vh",
    expandedPosition: "46vh",
    bottomAdSpace: isPlatform("ios") ? 120 : 170,
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
  const [present] = useIonToast();

  const presentToast = (message: string) => {
    present({
      message,
      duration: 5000,
      position: "bottom",
    });
  };

  const toggleCard = async () => {
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
          hapticTap(); // Vibra al finalizar la animación de entrada
        }
      }}
    >
      <IonIcon
        icon={ellipsisHorizontal}
        className={`absolute top-4 right-6 text-xl ${text}`}
      />
      <h1 className={`${text} text-lg font-medium mt-4 min-h-32`}>
        {phrase.content[language]}
      </h1>
      <div className="mt-2 flex justify-between items-center">
        <IonChip className="text-sm italic">{phrase.type}</IonChip>
        <div className="flex -space-x-2">
          <IonButton
            shape="round"
            fill="clear"
            color="light"
            size="large"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <IonIcon
              slot="icon-only"
              icon={isFavorite ? bookmark : bookmarkOutline}
            ></IonIcon>
          </IonButton>
          <IonButton
            shape="round"
            fill="clear"
            color="light"
            size="large"
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
            <IonIcon slot="icon-only" icon={shareSocialOutline}></IonIcon>
          </IonButton>
          <IonButton
            shape="round"
            fill="clear"
            color="light"
            size="large"
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
            <IonIcon slot="icon-only" icon={copyOutline}></IonIcon>
          </IonButton>
        </div>
      </div>
    </motion.div>
  );
};

export default CardPhrase;
