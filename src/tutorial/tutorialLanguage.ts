import { LanguageKeys } from "../persistence/languages";

type L<T> = Record<LanguageKeys, T>;

/** Textos del tutorial y de la guía del widget (EN / ES / FR). */
export const TutorialText = {
  skip: { es: "Omitir", en: "Skip", fr: "Passer" } as L<string>,
  next: { es: "Siguiente", en: "Next", fr: "Suivant" } as L<string>,
  done: { es: "Listo", en: "Done", fr: "Terminé" } as L<string>,
  /** Lectura para accesibilidad del indicador de pasos; `{n}` y `{total}` se sustituyen. */
  progress: { es: "Paso {n} de {total}", en: "Step {n} of {total}", fr: "Étape {n} sur {total}" } as L<string>,

  openTitle: { es: "Abre una tarjeta", en: "Open a card", fr: "Ouvrez une carte" } as L<string>,
  openBody: {
    es: "Cada frase llega en tres idiomas. Toca una tarjeta para leerla con calma.",
    en: "Every quote comes in three languages. Tap a card to read it calmly.",
    fr: "Chaque citation existe en trois langues. Touchez une carte pour la lire tranquillement.",
  } as L<string>,

  actionsTitle: { es: "Haz tuya la frase", en: "Make it yours", fr: "Faites-la vôtre" } as L<string>,
  actionSave: {
    title: { es: "Guardar", en: "Save", fr: "Enregistrer" } as L<string>,
    body: {
      es: "La guarda en Favoritos para volver a ella.",
      en: "Keeps it in Favorites to come back to.",
      fr: "La garde dans Favoris pour y revenir.",
    } as L<string>,
  },
  actionShare: {
    title: { es: "Compartir", en: "Share", fr: "Partager" } as L<string>,
    body: {
      es: "Como imagen bonita o como texto.",
      en: "As a lovely image or as text.",
      fr: "En belle image ou en texte.",
    } as L<string>,
  },
  actionCopy: {
    title: { es: "Copiar", en: "Copy", fr: "Copier" } as L<string>,
    body: {
      es: "Copia el texto para pegarlo donde quieras.",
      en: "Copies the text to paste anywhere.",
      fr: "Copie le texte pour le coller où vous voulez.",
    } as L<string>,
  },

  // Cierre sin widget (web)
  closingTitle: { es: "¡Ya lo tienes!", en: "You've got it!", fr: "Vous y êtes !" } as L<string>,
  closingBody: {
    es: "Respira, lee y quédate con lo que te acompañe hoy.",
    en: "Breathe, read, and keep what speaks to you today.",
    fr: "Respirez, lisez et gardez ce qui vous accompagne aujourd'hui.",
  } as L<string>,

  widget: {
    // Cabecera cuando llega justo después del tutorial
    lead: {
      es: "¡Ya lo tienes! Un último detalle:",
      en: "You've got it! One last thing:",
      fr: "Vous y êtes ! Un dernier détail :",
    } as L<string>,
    title: {
      es: "Tu frase del día, a la vista",
      en: "Your daily quote, at a glance",
      fr: "Votre citation du jour, sous les yeux",
    } as L<string>,
    body: {
      es: "Añade el widget de Gr8ful a tu pantalla de inicio y recibe una frase nueva cada día sin abrir la app.",
      en: "Add the Gr8ful widget to your home screen for a fresh quote each day, without opening the app.",
      fr: "Ajoutez le widget Gr8ful à votre écran d'accueil pour une nouvelle citation chaque jour, sans ouvrir l'app.",
    } as L<string>,
    iosSteps: {
      es: [
        "Mantén pulsada una zona libre de la pantalla de inicio.",
        "Toca el botón «+» de arriba a la izquierda.",
        "Busca «Gr8ful» y elige «Frase del día».",
        "Toca «Añadir widget».",
      ],
      en: [
        "Touch and hold an empty area of your home screen.",
        "Tap the “+” button at the top left.",
        "Search for “Gr8ful” and choose “Daily quote”.",
        "Tap “Add Widget”.",
      ],
      fr: [
        "Maintenez appuyé sur une zone libre de l'écran d'accueil.",
        "Touchez le bouton « + » en haut à gauche.",
        "Cherchez « Gr8ful » et choisissez « Citation du jour ».",
        "Touchez « Ajouter le widget ».",
      ],
    } as L<string[]>,
    androidSteps: {
      es: [
        "Mantén pulsada una zona libre de la pantalla de inicio.",
        "Elige «Widgets» y busca «Gr8ful».",
        "Arrastra «Frase del día» a tu pantalla.",
      ],
      en: [
        "Touch and hold an empty area of your home screen.",
        "Choose “Widgets” and look for “Gr8ful”.",
        "Drag “Daily quote” onto your screen.",
      ],
      fr: [
        "Maintenez appuyé sur une zone libre de l'écran d'accueil.",
        "Choisissez « Widgets » et cherchez « Gr8ful ».",
        "Faites glisser « Citation du jour » sur votre écran.",
      ],
    } as L<string[]>,
    add: { es: "Añadir widget", en: "Add widget", fr: "Ajouter le widget" } as L<string>,
    added: {
      es: "Listo: tu widget aparecerá en la pantalla de inicio.",
      en: "Done: your widget will appear on your home screen.",
      fr: "C'est fait : votre widget apparaîtra sur l'écran d'accueil.",
    } as L<string>,
    already: {
      es: "Ya tienes el widget en tu pantalla de inicio.",
      en: "You already have the widget on your home screen.",
      fr: "Vous avez déjà le widget sur votre écran d'accueil.",
    } as L<string>,
    manualNote: {
      es: "Tu teléfono no permite añadirlo desde aquí. Hazlo así:",
      en: "Your phone can't add it from here. Do it like this:",
      fr: "Votre téléphone ne permet pas de l'ajouter d'ici. Faites ainsi :",
    } as L<string>,
    understood: { es: "Entendido", en: "Got it", fr: "Compris" } as L<string>,
    later: { es: "Ahora no", en: "Not now", fr: "Pas maintenant" } as L<string>,
    close: { es: "Cerrar", en: "Close", fr: "Fermer" } as L<string>,
  },

  settings: {
    widgetTitle: {
      es: "Añadir widget a la pantalla de inicio",
      en: "Add widget to home screen",
      fr: "Ajouter le widget à l'écran d'accueil",
    } as L<string>,
    widgetHint: {
      es: "Tu frase del día sin abrir la app",
      en: "Your daily quote without opening the app",
      fr: "Votre citation du jour sans ouvrir l'app",
    } as L<string>,
    replayTitle: {
      es: "Ver el tutorial de nuevo",
      en: "Watch the tutorial again",
      fr: "Revoir le tutoriel",
    } as L<string>,
    replayHint: {
      es: "Guardar, copiar y compartir frases",
      en: "Saving, copying and sharing quotes",
      fr: "Enregistrer, copier et partager des citations",
    } as L<string>,
  },
};
