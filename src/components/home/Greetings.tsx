import { useState } from "react";
import { isPlatform } from "@ionic/react";

const Greetings = ({
  greeting,
  inspiration,
}: {
  greeting: string;
  inspiration: string;
}) => {
  const [userGender, setUserGender] = useState(
    localStorage.getItem("gender")
  )

  return (
    <div className={`flex flex-col items-center px-4 ${isPlatform('ios') ? 'mt-20' : 'mt-11'}`}>
      <div className="flex flex-col self-start mb-4">
        <h1 className={`${userGender === "M" ? 'text-[#1C2742]' : 'text-violet-950'} text-4xl font-bold self-start`}>
          {greeting} {localStorage.getItem("name")}!
        </h1>
      </div>

      <div className="flex flex-row justify-between relative h-64 w-full">
        <h2 className={`${userGender === "M" ? 'text-[#1C2742]' : 'text-violet-950'} text-lg text-center w-2/3`}>
          {inspiration}
        </h2>
        <img
          src={`${userGender === "M" ? './quotes.svg' : './flower.svg'}`}
          alt="flower-img"
          className="w-16 absolute right-0"
        />
      </div>
    </div>
  );
};

export default Greetings;
