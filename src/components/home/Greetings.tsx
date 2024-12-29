import { useState } from "react";

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
    <div className="inspire-container flex flex-col items-center px-4 mt-11">
      <div className="texts-inspire flex flex-col self-start mb-4">
        <h1 className={`${userGender === "M" ? 'text-[#1C2742]' : 'text-violet-950'} text-4xl font-bold self-start`}>
          {greeting} {localStorage.getItem("name")}!
        </h1>
      </div>

      <div className="img-container flex flex-row justify-between relative">
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
