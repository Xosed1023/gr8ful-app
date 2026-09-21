import { IoArrowBack } from "react-icons/io5";

interface BackButtonProps {
  onClick: () => void;
  /** Override de posicionamiento del contenedor; por defecto replica el estilo usado en Gender/QuoteTime/UserName. */
  className?: string;
}

const BackButton = ({
  onClick,
  className = "absolute top-4 left-4",
}: BackButtonProps) => (
  <div className={className}>
    <IoArrowBack
      className="text-black text-3xl cursor-pointer"
      onClick={onClick}
    />
  </div>
);

export default BackButton;
