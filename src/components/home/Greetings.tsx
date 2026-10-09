import { isPlatform } from "@ionic/react";
import { useUserGender } from "../../hooks/useUserGender";
import { LanguageKeys } from "../../persistence/languages";
import { useCalmEnter } from "../../theme/useCalmEnter";
import StreakPill from "./StreakPill";

interface GreetingsProps {
  greeting: string;
  inspiration: string;
  /** Días de racha; la píldora solo aparece si es mayor que 0. */
  streak?: number;
  language?: LanguageKeys | null;
}

const Greetings = ({ greeting, inspiration, streak = 0, language }: GreetingsProps) => {
  const { isMale } = useUserGender();
  // Saludo e inspiración entran uno tras otro cada vez que se muestra Home
  const calmRef = useCalmEnter<HTMLDivElement>();

  return (
    <div ref={calmRef} className={`calm-stagger flex flex-col items-center px-4 ${isPlatform('ios') ? 'mt-20' : 'mt-11'}`}>
      <div className="flex items-center justify-between w-full gap-3 mb-4">
        <h1 className={`${isMale ? 'text-[color:var(--greeting-man)]' : 'text-[color:var(--greeting-woman)]'} text-4xl font-bold min-w-0`}>
          {greeting} {localStorage.getItem("name")}!
        </h1>
        {streak > 0 && <StreakPill days={streak} language={language ?? "en"} />}
      </div>

      <div className="flex flex-row justify-between relative h-64 w-full">
        <h2 className={`${isMale ? 'text-[color:var(--greeting-man)]' : 'text-[color:var(--greeting-woman)]'} text-lg text-center w-2/3`}>
          {inspiration}
        </h2>
        <img
          src={`${isMale ? './quotes.svg' : './flower.svg'}`}
          alt="flower-img"
          className="img-themed w-16 absolute right-0"
        />
      </div>
    </div>
  );
};

export default Greetings;
