export interface Phrase {
  id?: number;
  author: string;
  type: string;
  content: {
    es: string;
    en: string;
    fr: string;
  };
  isFavorite: boolean;
  hasShown: boolean;
}