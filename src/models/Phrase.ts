import { TypePhraseEnum } from "./TypePhraseEnum";

export interface Phrase {
  id?: number;
  author: string;
  type: TypePhraseEnum;
  content: {
    es: string;
    en: string;
    fr: string;
  };
  isFavorite: boolean;
  hasShown: boolean;
}