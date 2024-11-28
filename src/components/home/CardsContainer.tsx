import React from "react";
import CardPhrase from "./CardPhrase";
import { Phrase } from "../../models/Phrase";
import { CardColors } from "../../models/CardColors";

const CardsContainer = ({ phrase }: { phrase: Phrase }) => {
  return (
    <>
      <CardPhrase
        color={CardColors.WOMAN_BLUE}
        position={0}
        phrase={phrase.content.en}
      />
      <CardPhrase
        color={CardColors.WOMAN_PURPLE}
        position={1}
        phrase={phrase.content.es}
      />
      <CardPhrase
        color={CardColors.WOMAN_VIOLETTE}
        position={2}
        phrase={phrase.content.fr}
      />
    </>
  );
};

export default CardsContainer;
