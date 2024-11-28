
const Greetings = () => {
  return (
    <div className="inspire-container flex flex-col items-center px-4 mt-11">
      <div className="texts-inspire flex flex-col self-start mb-4">
        <h1 className="text-4xl font-bold text-violet-950 self-start">
          Hi Andrea!
        </h1>
      </div>

      <div className="img-container flex flex-row justify-between">
        <h2 className="text-lg text-violet-950 text-center w-2/3">
          Here's some inspiration for your today!
        </h2>
        <img src="./flower.svg" alt="flower-img" className="w-16" />
      </div>
    </div>
  );
};

export default Greetings;
