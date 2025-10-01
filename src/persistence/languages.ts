type LanguageKeys = "es" | "en" | "fr";

type AppTopicsScreenLanguageType = {
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
  }
}

export const AppTimeScreenLanguage = {
  title: {
    es: ["¿Cuándo deberíamos enviarte tu frase", "diaria?*"],
    en: ["When should we send your daily", "quote?"],
    fr: ["Quand devons-nous envoyer votre devis", "quotidien ?*"]
  },
  note: {
    es: ["*Puedes cambiar esto después en las configuraciones."],
    en: ["*You can change this later in settings."],
    fr: ["*Vous pouvez modifier ce paramètre ultérieurement dans les réglages."]
  },
}

export const AppTopicsScreenLanguage: AppTopicsScreenLanguageType = {
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
    es: ["Notificaciones Push"],
    en: ["Push Notifications"],
    fr: ["Notifications Push"]
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
