import { IoArrowBack } from "react-icons/io5";
import "./OnboardingKit.css";

interface BackButtonProps {
  onClick: () => void;
  /** Override de posicionamiento horizontal/z del contenedor; la posición vertical siempre respeta la zona segura. */
  className?: string;
  /** "glass": círculo esmerilado (diseño de Stitch); "plain": solo la flecha. */
  variant?: "plain" | "glass";
}

const BackButton = ({
  onClick,
  className = "absolute left-4 z-10",
  variant = "plain",
}: BackButtonProps) =>
  variant === "glass" ? (
    <button
      type="button"
      aria-label="Back"
      className="back-glass"
      // Debajo de la barra de estado / isla dinámica de iOS (0 en Android y web).
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 0.5rem)" }}
      onClick={onClick}
    >
      <IoArrowBack />
    </button>
  ) : (
    <div
      className={className}
      // Debajo de la barra de estado / isla dinámica de iOS (0 en Android y web).
      // `--ion-safe-area-top` no sirve: variables.css la fija en 25px.
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
    >
      <IoArrowBack
        className="text-[color:var(--text-color)] text-3xl cursor-pointer"
        onClick={onClick}
      />
    </div>
  );

export default BackButton;
