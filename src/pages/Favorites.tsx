import {
  IonContent,
  IonIcon,
  IonPage,
  isPlatform,
  useIonToast,
  useIonViewDidEnter,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { bookmark, chevronDown, copyOutline, shareSocialOutline, sparklesOutline } from "ionicons/icons";
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
import { registerAdMoment } from "../ads/adMoments";
import { computeBannerMargin } from "../ads/bannerMargin";
import { favoritesBannerAdId, hideFavoritesBanner, showFavoritesBanner } from "../ads/favoritesBanner";
import { Phrase } from "../models/Phrase";
import { getFavoritePhrases, toggleFavorite } from "../persistence/IndexedDBService";
import { AppFavoritesLanguage, LanguageKeys } from "../persistence/languages";
import { useUserGender } from "../hooks/useUserGender";
import { hapticTap } from "../hooks/useHaptics";
import { QUOTE_MARKS } from "../components/common/quoteMarks";
import { copyQuote, shareQuoteText } from "../share/quoteActions";
import ShareSheet from "../share/ShareSheet";
import { FavoritesActionsText } from "./favoritesCopy";
import { LANGUAGE_NAME, otherLanguages } from "./favoriteLanguages";
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
  const [present] = useIonToast();
  // Frase cuyo menú de compartir está abierto (un solo menú para toda la lista)
  const [shareTarget, setShareTarget] = useState<Phrase | null>(null);
  // Tarjetas con las otras versiones desplegadas (spec 035)
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

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
  const viewActive = useRef(false);
  const requestBanner = () => {
    if (!adSlotRef.current) return;
    const platform = isPlatform("ios") ? "ios" : "android";
    showFavoritesBanner(
      favoritesBannerAdId(import.meta.env, platform),
      computeBannerMargin(adSlotRef.current.getBoundingClientRect())
    );
  };
  useIonViewDidEnter(() => {
    viewActive.current = true;
    if (!shareTarget) requestBanner();
  });
  useIonViewWillLeave(() => {
    viewActive.current = false;
    hideFavoritesBanner();
  });
  useEffect(() => hideFavoritesBanner, []);

  // El banner nativo flota sobre la web: se oculta mientras el menú de compartir está abierto
  // y vuelve al cerrarlo.
  useEffect(() => {
    if (shareTarget) hideFavoritesBanner();
    else if (viewActive.current) requestBanner();
    // `requestBanner` solo depende de refs; interesa reaccionar al abrir/cerrar el menú
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareTarget]);

  const handleUnfavorite = async (favorite: Phrase) => {
    if (favorite.id == null) return;
    await toggleFavorite(favorite.id, false);
    setFavorites((prev) => prev.filter((p) => p.id !== favorite.id));
    await hapticTap();
  };

  const toggleExpanded = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const copyText = async (text: string) => {
    const ok = await copyQuote(text);
    // Arriba: abajo quedaría tapado por el banner y la barra de pestañas
    present({
      message: FavoritesActionsText[ok ? "copied" : "copyError"][lang],
      duration: 2200,
      position: "top",
    });
    if (ok) registerAdMoment("copy");
  };

  const shareAsText = async () => {
    const target = shareTarget;
    setShareTarget(null);
    if (target && (await shareQuoteText(target.content[lang], target.author))) {
      registerAdMoment("share");
    }
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

                  <div className="fav-actions">
                    <button
                      type="button"
                      className="fav-more"
                      aria-expanded={favorite.id != null && expanded.has(favorite.id)}
                      onClick={() => favorite.id != null && toggleExpanded(favorite.id)}
                    >
                      {FavoritesActionsText[
                        favorite.id != null && expanded.has(favorite.id) ? "hideOthers" : "showOthers"
                      ][lang]}
                      <IonIcon
                        icon={chevronDown}
                        aria-hidden="true"
                        className={favorite.id != null && expanded.has(favorite.id) ? "open" : ""}
                      />
                    </button>
                    <div className="fav-actions-right">
                      <button
                        type="button"
                        className="fav-action"
                        aria-label={FavoritesActionsText.copy[lang]}
                        onClick={() => copyText(favorite.content[lang])}
                      >
                        <IonIcon icon={copyOutline} />
                      </button>
                      <button
                        type="button"
                        className="fav-action"
                        aria-label={FavoritesActionsText.share[lang]}
                        onClick={() => setShareTarget(favorite)}
                      >
                        <IonIcon icon={shareSocialOutline} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {favorite.id != null && expanded.has(favorite.id) && (
                      <motion.div
                        key="others"
                        className="fav-others"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={calmTransition(reduceMotion, CALM_DURATION.base)}
                      >
                        {otherLanguages(lang).map((other) => (
                          <div className="fav-other" key={other}>
                            <div className="fav-other-head">
                              <span className="fav-other-label">{LANGUAGE_NAME[other]}</span>
                              <button
                                type="button"
                                className="fav-action small"
                                aria-label={FavoritesActionsText.copyVersion[lang].replace(
                                  "{language}",
                                  LANGUAGE_NAME[other]
                                )}
                                onClick={() => copyText(favorite.content[other])}
                              >
                                <IonIcon icon={copyOutline} />
                              </button>
                            </div>
                            <p className="fav-other-quote">
                              {QUOTE_MARKS[other][0]}
                              {favorite.content[other]}
                              {QUOTE_MARKS[other][1]}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </IonContent>

      {/* Menú de compartir (como imagen o como texto), el mismo de Home */}
      <ShareSheet
        open={shareTarget !== null}
        onClose={() => setShareTarget(null)}
        quote={shareTarget?.content[lang] ?? ""}
        author={shareTarget?.author ?? ""}
        language={lang}
        onShareText={shareAsText}
        pauseHomeBanner={false}
      />

      {/* Hueco (transparente) del banner nativo: solo sirve para medir su posición */}
      <div ref={adSlotRef} className="favorites-ad-slot" aria-hidden="true" />
    </IonPage>
  );
};

export default Favorites;
