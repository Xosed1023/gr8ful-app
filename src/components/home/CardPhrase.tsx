import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { IonButton, IonChip, IonIcon, useIonToast } from "@ionic/react";
import { motion } from "framer-motion";
import {
  bookmarkOutline,
  ellipsisHorizontal,
  shareSocialOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { CardColors } from "../../models/CardColors";
import { Phrase } from "../../models/Phrase";
import {
  AdMob,
  BannerAdPluginEvents,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

interface CardPhraseProps {
  phrase: Pick<Phrase, "content" | "type">;
  color: CardColors;
}

const colorConfig = {
  [CardColors.WOMAN_BLUE]: {
    background: "bg-sky-500",
    text: "text-sky-900",
    initialPosition: "35vh",
    initialHeight: "65vh",
    expandedHeight: "90vh",
    expandedPosition: "10vh",
  },
  [CardColors.WOMAN_PURPLE]: {
    background: "bg-violet-400",
    text: "text-purple-900",
    initialPosition: "53vh",
    initialHeight: "47vh",
    expandedHeight: "72vh",
    expandedPosition: "28vh",
  },
  [CardColors.WOMAN_VIOLETTE]: {
    background: "bg-violet-300",
    text: "text-indigo-900",
    initialPosition: "70vh",
    initialHeight: "30vh",
    expandedHeight: "54vh",
    expandedPosition: "46vh",
  },
  [CardColors.MAN_SKY_BLUE]: {
    background: "bg-[#61B2E4]",
    text: "text-[#17537A]",
    initialPosition: "35vh",
    initialHeight: "65vh",
    expandedPosition: "10vh",
    expandedHeight: "90vh",
  },
  [CardColors.MAN_LIGHT_SKY_BLUE]: {
    background: "bg-[#5A9ABE]",
    text: "text-[#154C6B]",
    initialPosition: "53vh",
    initialHeight: "47vh",
    expandedPosition: "10vh",
    expandedHeight: "90vh",
  },
  [CardColors.MAN_DEEP_SKY_BLUE]: {
    background: "bg-[#95C5DE]",
    text: "text-[#0D4461]",
    initialPosition: "70vh",
    initialHeight: "30vh",
    expandedPosition: "20vh",
    expandedHeight: "80vh",
  },
};

const CardPhrase = ({ phrase, color }: CardPhraseProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false);
  const [present] = useIonToast();

  useEffect(() => {
    showBanner();
  }, []);

  async function showBanner(): Promise<void> {
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      presentToast("Banner Loaded");
    });

    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (e) => {
      presentToast(`Banner Failed to Load ${JSON.stringify(e)}`);
    });

    const presentToast = (message: string) => {
      present({
        message,
        duration: 10000,
        position: "bottom",
      });
    };

    const options: BannerAdOptions = {
      adId: "ca-app-pub-6255300430204769/4171974484",
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0
    };
    AdMob.showBanner(options);
  }

  const toggleCard = async () => {
    setIsExpanded((prev) => !prev);
    // Copiar esta línea para las vibraciones
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const {
    background,
    text,
    initialPosition,
    initialHeight,
    expandedPosition,
    expandedHeight,
  } = colorConfig[color];

  const triggerHapticFeedback = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      if (navigator.vibrate) navigator.vibrate(50); // Fallback para navegadores
    }
  };

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
          triggerHapticFeedback(); // Vibra al finalizar la animación de entrada
        }
      }}
    >
      <IonIcon
        icon={ellipsisHorizontal}
        className={`absolute top-4 right-6 text-xl ${text}`}
      />
      <h1 className={`${text} text-lg font-medium mt-4 min-h-32`}>
        {phrase.content.es}
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
              console.log("Guardando frase...");
            }}
          >
            <IonIcon slot="icon-only" icon={bookmarkOutline}></IonIcon>
          </IonButton>
          <IonButton
            shape="round"
            fill="clear"
            color="light"
            size="large"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Compartiendo frase...");
            }}
          >
            <IonIcon slot="icon-only" icon={shareSocialOutline}></IonIcon>
          </IonButton>
        </div>
      </div>
    </motion.div>
  );
};

export default CardPhrase;
