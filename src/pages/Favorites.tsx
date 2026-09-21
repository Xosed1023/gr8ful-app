import {
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { bookmark } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Phrase } from "../models/Phrase";
import { getFavoritePhrases, toggleFavorite } from "../persistence/IndexedDBService";
import { useAppLanguage } from "../hooks/useAppLanguage";
import { hapticTap } from "../hooks/useHaptics";

const EMPTY_STATE_TEXT: Record<string, string> = {
  es: "Todavía no tienes frases favoritas. Toca el marcador en una tarjeta de Inicio para guardarla aquí.",
  en: "You don't have any favorite quotes yet. Tap the bookmark on a Home card to save it here.",
  fr: "Vous n'avez pas encore de citations favorites. Touchez le marque-page sur une carte d'accueil pour l'enregistrer ici.",
};

const Favorites: React.FC = () => {
  const { userLanguage } = useAppLanguage();
  const [favorites, setFavorites] = useState<Phrase[]>([]);

  const loadFavorites = async () => {
    setFavorites(await getFavoritePhrases());
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Refresca al revisitar el tab (p. ej. tras marcar una frase nueva desde Home)
  useIonViewWillEnter(() => {
    loadFavorites();
  });

  const handleUnfavorite = async (favorite: Phrase) => {
    if (favorite.id == null) return;
    await toggleFavorite(favorite.id, false);
    setFavorites((prev) => prev.filter((p) => p.id !== favorite.id));
    await hapticTap();
  };

  return (
    <IonPage className="bg-slate-900">
      <div className="bg-slate-900 h-1/5 flex items-center pl-10">
        <h1 className="text-3xl font-bold text-white">
          {userLanguage === "es"
            ? "Favoritos"
            : userLanguage === "fr"
            ? "Favoris"
            : "Favorites"}
        </h1>
      </div>
      <IonContent className="bg-white rounded-t-3xl">
        {favorites.length === 0 ? (
          <div className="flex items-center justify-center h-full px-10 pt-16 text-center text-slate-500">
            <p>{EMPTY_STATE_TEXT[userLanguage]}</p>
          </div>
        ) : (
          <IonList inset={true} lines="none" className="w-full pt-6">
            {favorites.map((favorite) => (
              <IonItem key={favorite.id}>
                <p className="flex-1 py-2 pr-2 text-sm">
                  {favorite.content[userLanguage]}
                </p>
                <IonIcon
                  slot="end"
                  icon={bookmark}
                  className="text-2xl text-slate-900 cursor-pointer"
                  onClick={() => handleUnfavorite(favorite)}
                />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;
