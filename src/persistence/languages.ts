import { Topic } from "../models/Topic";

export type LanguageKeys = "es" | "en" | "fr";

type AppTopicsScreenLanguageType = {
  stepBadge: Record<LanguageKeys, string>;
  subtitle: Record<LanguageKeys, string>;
  title: Record<LanguageKeys, string[]>;
  note: Record<LanguageKeys, string[]>;
  topics: Record<LanguageKeys, Topic[]>; // Aquí aseguramos que cada idioma sea un array de Topic
  buttons: Record<LanguageKeys, string[]>;
};

export const AppGenderScreenLanguage = {
  title: {
    es: ["Me", "identifico", "como"],
    en: ["I", "identify", "as"],
    fr: ["Je", "m'identifie", "comme"]
  },
  stepBadge: {
    es: "Paso 2 de 5",
    en: "Step 2 of 5",
    fr: "Étape 2 sur 5"
  },
  subtitle: {
    es: "Elige la atmósfera visual, el tono y los colores que prefieres.",
    en: "Select your preferred visual atmosphere, tone, and gentle color vibrations.",
    fr: "Choisissez l'atmosphère visuelle, le ton et les couleurs que vous préférez."
  },
  options: {
    man: {
      es: "Hombre",
      en: "A man",
      fr: "Homme"
    },
    woman: {
      fr: "Femme",
      en: "A woman",
      es: "Mujer",
    },
  }
}

export const AppSelectLanguage = {
  title: {
    es: ["Selecciona", "tu", "idioma"],
    en: ["Select", "your", "language"],
    fr: ["Choisissez", "votre", "langue"]
  },
  stepBadge: {
    es: "Paso 1 de 5",
    en: "Step 1 of 5",
    fr: "Étape 1 sur 5"
  }
}

export const AppTimeScreenLanguage = {
  stepBadge: {
    es: "Paso 3 de 5",
    en: "Step 3 of 5",
    fr: "Étape 3 sur 5"
  },
  title: {
    es: ["¿Cuándo deberíamos enviarte tu frase", "diaria?"],
    en: ["When should we send your daily", "quote?"],
    fr: ["Quand devons-nous envoyer votre citation", "quotidienne\u00a0?"]
  },
  note: {
    es: ["*Puedes cambiar esto después en las configuraciones."],
    en: ["*You can change this later in settings."],
    fr: ["*Vous pouvez modifier ce paramètre ultérieurement dans les réglages."]
  },
}

export const AppTopicsScreenLanguage: AppTopicsScreenLanguageType = {
  stepBadge: {
    es: "Paso 4 de 5",
    en: "Step 4 of 5",
    fr: "Étape 4 sur 5"
  },
  subtitle: {
    es: "Toca las áreas de tu vida que hoy piden luz.",
    en: "Tap the areas of your life calling for light today.",
    fr: "Touchez les domaines de votre vie qui appellent la lumière aujourd'hui."
  },
  title: {
    es: ["Elige los", "temas", "que más te interesan"],
    en: ["Choose the", "topics", "that matter to you the most"],
    fr: ["Choisissez les", "sujets", "qui comptent le plus pour vous"]
  },
  note: {
    es: ["*Adaptaremos tus citas diarias para que coincidan con tus intereses. ¡Selecciona tantos temas como desees!"],
    en: ["*We'll tailor your daily quotes to match your interests. Select as many topics as you like!"],
    fr: ["*Nous adapterons vos citations quotidiennes à vos centres d'intérêt. Sélectionnez autant de sujets que vous le souhaitez!"]
  },
  topics: {
    es: [{ key: "motivation", value: "Motivación" }, { key: "love", value: "Amor" }, { key: "happiness", value: "Felicidad" }, { key: "success", value: "Éxito" }, { key: "mindfulness", value: "Conciencia plena" }, { key: "humor", value: "Humor" }, { key: "creativity", value: "Creatividad" }, { key: "spirituality", value: "Espiritualidad" }, { key: "leadership", value: "Liderazgo" }, { key: "investing", value: "Inversión" }],
    en: [{ key: "motivation", value: "Motivation" }, { key: "love", value: "Love" }, { key: "happiness", value: "Happiness" }, { key: "success", value: "Success" }, { key: "mindfulness", value: "Mindfulness" }, { key: "humor", value: "Humor" }, { key: "creativity", value: "Creativity" }, { key: "spirituality", value: "Spirituality" }, { key: "leadership", value: "Leadership" }, { key: "investing", value: "Investing" }],
    fr: [{ key: "motivation", value: "Motivation" }, { key: "love", value: "Amour" }, { key: "happiness", value: "Bonheur" }, { key: "success", value: "Succès" }, { key: "mindfulness", value: "Pleine conscience" }, { key: "humor", value: "Humour" }, { key: "creativity", value: "Créativité" }, { key: "spirituality", value: "Spiritualité" }, { key: "leadership", value: "Leadership" }, { key: "investing", value: "Investissement" }]
  },
  buttons: {
    es: ["Continuar"],
    en: ["Next"],
    fr: ["Continuer"]
  },
}

export const AppNameScreenLanguage = {
  stepBadge: {
    es: "Paso 5 de 5",
    en: "Step 5 of 5",
    fr: "Étape 5 sur 5"
  },
  subtitle: {
    es: "Tu nombre aparecerá con tus citas diarias para una experiencia cálida y personal.",
    en: "Your name will appear with your daily quotes for a warm, personal experience.",
    fr: "Votre prénom apparaîtra avec vos citations quotidiennes pour une expérience chaleureuse et personnelle."
  },
  fieldLabel: {
    es: "Nombre de pila",
    en: "Preferred first name",
    fr: "Prénom"
  },
  greeting: {
    es: "¡Qué bien suena, {name}! ✨",
    en: "Looking good, {name}! ✨",
    fr: "Ça sonne bien, {name} ! ✨"
  },
  title: {
    es: ["¿Cuál es tu", "nombre?"],
    en: ["What's your", "name?"],
    fr: ["Quel est votre", "nom?"]
  },
  placeHolder: {
    es: ["Tu nombre aquí..."],
    en: ["Your name here..."],
    fr: ["Votre nom ici..."]
  },
  note: {
    es: ["*Tu nombre aparecerá con tus citas diarias para una experiencia personalizada."],
    en: ["*Your name will appear with your daily quotes for a personalized experience."],
    fr: ["*Votre nom apparaîtra avec vos citations quotidiennes pour une expérience personnalisée."]
  },
  buttons: {
    es: ["Finalizar"],
    en: ["Finish"],
    fr: ["Terminer"]
  },
  toastMessage: {
    es: "Por favor, ingresa tu nombre antes de continuar",
    en: "Please, enter your name before continuing",
    fr: "Veuillez entrer votre nom avant de continuer"
  },
  toastButton: {
    es: "Cerrar",
    en: "Dismiss",
    fr: "Fermer"
  },
}

export const AppLoadingScreenLanguage = {
  title: {
    es: ["Las cosas buenas toman tiempo.", "Tu cita está en", "camino."],
    en: ["Good things take time.", "Your quote is on its", "way!"],
    fr: ["Les bonnes choses prennent du temps.", "Votre citation est en", "chemin."]
  },
  status: {
    es: "Preparando tu sabiduría diaria en tres idiomas…",
    en: "Brewing your daily wisdom in three languages…",
    fr: "Préparation de votre sagesse du jour en trois langues…"
  },
}

export const AppHomeScreenLanguage = {
  greetings: {
    es: ["Hola"],
    en: ["Hi"],
    fr: ["Bonjour"]
  },
  inspirationText: {
    es: ["Aquí tienes algo de inspiración para tu día!"],
    en: ["Here's some inspiration for your today!"],
    fr: ["Voici de l'inspiration pour votre jour!"]
  }
}

export const AppSetttingsScreenLanguage = {
  title: {
    es: ["Ajustes"],
    en: ["Settings"],
    fr: ["Paramètres"]
  },
  editNameButton: {
    es: ["Editar nombre"],
    en: ["Edit name"],
    fr: ["Modifier le nom"]
  },
  languageButton: {
    es: ["Idioma"],
    en: ["Language"],
    fr: ["Langue"]
  },
  TimeButton: {
    es: ["Hora"],
    en: ["Time"],
    fr: ["Heure"]
  },
  topicsButton: {
    es: ["Temas"],
    en: ["Topics"],
    fr: ["Sujets"]
  },
  pushNotificationsButton: {
    es: ["Notificaciones"],
    en: ["Notifications"],
    fr: ["Notifications"]
  },
  darkModeButton: {
    es: ["Tema oscuro"],
    en: ["Dark Theme"],
    fr: ["Thème sombre"]
  },
  versionLabel: {
    es: ["Versión"],
    en: ["Version"],
    fr: ["Version"]
  }
}

export const AppNotificationsLanguage = {
  channelName: {
    es: "Frase diaria",
    en: "Daily quote",
    fr: "Citation du jour",
  },
  permissionDeniedTitle: {
    es: "Notificaciones desactivadas",
    en: "Notifications are off",
    fr: "Notifications désactivées",
  },
  permissionDeniedMessage: {
    es: "Para recibir tu frase diaria, permite las notificaciones de Gr8ful en los ajustes de tu dispositivo.",
    en: "To receive your daily quote, allow Gr8ful notifications in your device settings.",
    fr: "Pour recevoir ta citation du jour, autorise les notifications de Gr8ful dans les réglages de ton appareil.",
  },
  permissionDeniedButton: {
    es: "Entendido",
    en: "Got it",
    fr: "Compris",
  },
};

export const AppHomeNavLanguage = {
  tabs: {
    es: { home: "Diario", favorites: "Favoritos", settings: "Ajustes" },
    en: { home: "Daily", favorites: "Favorites", settings: "Settings" },
    fr: { home: "Quotidien", favorites: "Favoris", settings: "Réglages" },
  },
  refresh: {
    es: "Renovar inspiración",
    en: "Refresh inspiration",
    fr: "Nouvelle inspiration",
  },
};

export const AppSettingsDetailLanguage = {
  timeLine: {
    es: "Cada día a las {time}",
    en: "Daily at {time}",
    fr: "Chaque jour à {time}",
  },
  allTopics: {
    es: "Todos los temas",
    en: "All topics",
    fr: "Tous les sujets",
  },
  notificationsHint: {
    es: "Recordatorios de tu frase diaria",
    en: "Daily quote reminders",
    fr: "Rappels de votre citation quotidienne",
  },
};

export const AppFavoritesLanguage = {
  title: { es: "Favoritos", en: "Favorites", fr: "Favoris" },
  count: {
    es: { one: "{n} frase guardada", other: "{n} frases guardadas" },
    en: { one: "{n} saved quote", other: "{n} saved quotes" },
    fr: { one: "{n} citation enregistrée", other: "{n} citations enregistrées" },
  },
  emptyTitle: {
    es: "Aún no tienes favoritos",
    en: "No favorites yet",
    fr: "Pas encore de favoris",
  },
  emptyHint: {
    es: "Toca el marcador en una tarjeta de Inicio para guardarla aquí.",
    en: "Tap the bookmark on a Home card to save it here.",
    fr: "Touchez le marque-page sur une carte d'accueil pour l'enregistrer ici.",
  },
  remove: {
    es: "Quitar de favoritos",
    en: "Remove from favorites",
    fr: "Retirer des favoris",
  },
};

