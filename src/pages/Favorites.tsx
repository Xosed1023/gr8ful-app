import { IonContent, IonIcon, IonPage, useIonViewWillEnter } from "@ionic/react";
import { bookmark, sparklesOutline } from "ionicons/icons";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IoBookmarkOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
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
  const [, refresh] = useState(0);

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
    <IonPage className="bg-[color:var(--header-bg)]">
      <div className={`favorites-header glow-header ${accent}`}>
        <h1 className="favorites-title">{AppFavoritesLanguage.title[lang]}</h1>
        {favorites.length > 0 && <span className="favorites-count">{countText}</span>}
      </div>

      <IonContent
        className="favorites-sheet"
        style={{ "--padding-bottom": "var(--nav-space)" } as React.CSSProperties}
      >
        {favorites.length === 0 ? (
          <motion.div
            className="favorites-empty"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          >
            <span className={`favorites-empty-icon ${accent}`}>
              <IoBookmarkOutline aria-hidden="true" />
            </span>
            <h2>{AppFavoritesLanguage.emptyTitle[lang]}</h2>
            <p>{AppFavoritesLanguage.emptyHint[lang]}</p>
          </motion.div>
        ) : (
          <div className="favorites-list">
            <AnimatePresence initial={false}>
              {favorites.map((favorite, index) => (
                <motion.article
                  key={favorite.id}
                  layout={!reduceMotion}
                  className={`fav-card ${accent}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: -48, scale: 0.96 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 26,
                    delay: reduceMotion ? 0 : Math.min(index, 6) * 0.04,
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
    </IonPage>
  );
};

export default Favorites;
