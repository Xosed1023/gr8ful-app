import { Phrase } from "../models/Phrase";

export const initialData: Phrase[] = [
  {
    id: 1,
    author: "Albert Einstein",
    type: "inspiración",
    content: {
      es: "La vida es como montar en bicicleta. Para mantener el equilibrio, debes seguir adelante.",
      en: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
      fr: "La vie, c'est comme faire du vélo. Pour garder l'équilibre, il faut avancer.",
    },
    isFavorite: false,
    hasShown: false
  },
  {
    id: 2,
    author: "Maya Angelou",
    type: "superación",
    content: {
      es: "Puedes encontrar muchas derrotas, pero no debes ser derrotado.",
      en: "You may encounter many defeats, but you must not be defeated.",
      fr: "Vous pouvez rencontrer de nombreuses défaites, mais vous ne devez pas être vaincu.",
    },
    isFavorite: false,
    hasShown: false
  },
  {
    id: 3,
    author: "Dalai Lama",
    type: "alegría",
    content: {
      es: "El propósito de nuestras vidas es ser felices.",
      en: "The purpose of our lives is to be happy.",
      fr: "Le but de nos vies est d'être heureux.",
    },
    isFavorite: false,
    hasShown: false
  },
  {
    id: 4,
    author: "Nelson Mandela",
    type: "superación",
    content: {
      es: "Siempre parece imposible hasta que se hace.",
      en: "It always seems impossible until it's done.",
      fr: "Cela semble toujours impossible jusqu'à ce que ce soit fait.",
    },
    isFavorite: false,
    hasShown: false
  },
  {
    id: 5,
    author: "Confucio",
    type: "sabiduría",
    content: {
      es: "Elige un trabajo que te guste y no tendrás que trabajar ni un día de tu vida.",
      en: "Choose a job you love, and you will never have to work a day in your life.",
      fr: "Choisissez un travail que vous aimez, et vous n'aurez jamais à travailler un seul jour de votre vie.",
    },
    isFavorite: false,
    hasShown: false
  },
];
