import {
  IonContent,
  IonIcon,
  IonPage,
  isPlatform,
  useIonViewDidEnter,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { bookmark, sparklesOutline } from "ionicons/icons";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CALM_DURATION,
  CALM_RISE,
  CALM_SHIFT,
  CALM_STAGGER,
  calmTransition,
} from "../theme/motion";
import { IoBookmarkOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { computeBannerMargin } from "../ads/bannerMargin";
import { favoritesBannerAdId, hideFavoritesBanner, showFavoritesBanner } from "../ads/favoritesBanner";
import { Phrase } from "../models/Phrase";
import { getFavoritePhrases, toggleFavorite } from "../persistence/IndexedDBService";
import { AppFavoritesLanguage, LanguageKeys } from "../persistence/languages";
import { useUserGender } from "../hooks/useUserGender";
import { hapticTap } from "../hooks/useHaptics";
import { QUOTE_MARKS } from "../components/common/quoteMarks";
import "../components/home/HomeKit.css";
import "./Favorites.css";

const Favorites: React.FC = () => {
  // Se lee el idioma en cada render: la pestaña no se desmonta al cambiarlo en Ajustes.
  const stored = localStorage.getItem("language");
  const lang: LanguageKeys = stored === "es" || stored === "fr" ? stored : "en";
  const { isMale } = useUserGender();
  const accent = isMale ? "man" : "woman";
  const reduceMotion = useReducedMotion();
  const [favorites, setFavorites] = useState<Phrase[]>([]);
  // Cambia en cada visita a la pestaña: la lista se vuelve a montar y entra con calma
  const [enterKey, refresh] = useState(0);

  const loadFavorites = async () => {
    setFavorites(await getFavoritePhrases());
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Refresca al revisitar el tab (p. ej. tras marcar una frase nueva desde Home)
  useIonViewWillEnter(() => {
    loadFavorites();
    refresh((n) => n + 1);
  });

  // Banner fijo al pie (spec 029): el hueco `.favorites-ad-slot` marca dónde va, justo encima
  // de la barra de pestañas flotante. Se pide al terminar la transición (para medir el hueco
  // ya en su sitio) y se quita al salir o desmontar; el coordinador lo comparte con Home.
  const adSlotRef = useRef<HTMLDivElement>(null);
  useIonViewDidEnter(() => {
    if (!adSlotRef.current) return;
    const platform = isPlatform("ios") ? "ios" : "android";
    showFavoritesBanner(
      favoritesBannerAdId(import.meta.env, platform),
      computeBannerMargin(adSlotRef.current.getBoundingClientRect())
    );
  });
  useIonViewWillLeave(hideFavoritesBanner);
  useEffect(() => hideFavoritesBanner, []);

  const handleUnfavorite = async (favorite: Phrase) => {
    if (favorite.id == null) return;
    await toggleFavorite(favorite.id, false);
    setFavorites((prev) => prev.filter((p) => p.id !== favorite.id));
    await hapticTap();
  };

  const countText = AppFavoritesLanguage.count[lang][
    favorites.length === 1 ? "one" : "other"
  ].replace("{n}", String(favorites.length));

  return (
    <IonPage className="favorites-page bg-[color:var(--header-bg)]">
      <div className={`favorites-header glow-header ${accent}`}>
        <h1 className="favorites-title">{AppFavoritesLanguage.title[lang]}</h1>
        {favorites.length > 0 && <span className="favorites-count">{countText}</span>}
      </div>

      <IonContent
        className="favorites-sheet"
        // La lista deja sitio a la barra flotante y al banner que va encima
        style={{ "--padding-bottom": "var(--favorites-bottom-space)" } as React.CSSProperties}
      >
        {favorites.length === 0 ? (
          <motion.div
            key={enterKey}
            className="favorites-empty"
            initial={reduceMotion ? false : { opacity: 0, y: CALM_RISE }}
            animate={{ opacity: 1, y: 0 }}
            transition={calmTransition(reduceMotion, CALM_DURATION.slow)}
          >
            <span className={`favorites-empty-icon ${accent}`}>
              <IoBookmarkOutline aria-hidden="true" />
            </span>
            <h2>{AppFavoritesLanguage.emptyTitle[lang]}</h2>
            <p>{AppFavoritesLanguage.emptyHint[lang]}</p>
          </motion.div>
        ) : (
          <div className="favorites-list" key={enterKey}>
            <AnimatePresence>
              {favorites.map((favorite, index) => (
                <motion.article
                  key={favorite.id}
                  layout={!reduceMotion}
                  className={`fav-card ${accent}`}
                  initial={reduceMotion ? false : { opacity: 0, y: CALM_RISE }}
                  animate={{ opacity: 1, y: 0 }}
                  // Al quitar un favorito se desvanece y el resto sube con calma
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -CALM_SHIFT / 2, transition: calmTransition(false, CALM_DURATION.quick) }
                  }
                  transition={{
                    default: calmTransition(
                      reduceMotion,
                      CALM_DURATION.base,
                      reduceMotion ? 0 : Math.min(index, 6) * CALM_STAGGER
                    ),
                    layout: calmTransition(reduceMotion, CALM_DURATION.base),
                  }}
                >
                  <div className="fav-card-top">
                    <span className="fav-chip">
                      <IonIcon icon={sparklesOutline} aria-hidden="true" />
                      {favorite.type}
                    </span>
                    <button
                      type="button"
                      className="fav-remove"
                      aria-label={AppFavoritesLanguage.remove[lang]}
                      onClick={() => handleUnfavorite(favorite)}
                    >
                      <IonIcon icon={bookmark} />
                    </button>
                  </div>
                  <p className="fav-quote">
                    {QUOTE_MARKS[lang][0]}
                    {favorite.content[lang]}
                    {QUOTE_MARKS[lang][1]}
                  </p>
                  <p className="fav-author">— {favorite.author}</p>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </IonContent>

      {/* Hueco (transparente) del banner nativo: solo sirve para medir su posición */}
      <div ref={adSlotRef} className="favorites-ad-slot" aria-hidden="true" />
    </IonPage>
  );
};

export default Favorites;
