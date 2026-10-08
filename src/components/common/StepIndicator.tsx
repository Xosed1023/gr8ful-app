import "./OnboardingKit.css";

interface StepIndicatorProps {
  /** Paso actual (1..total). */
  step: number;
  total?: number;
}

/**
 * Píldora de vidrio con un punto por paso; el activo es más grande y brilla. Los puntos
 * son siempre los mismos elementos: al cambiar de paso, el tamaño y el color se animan
 * por CSS, así que el brillo «se desliza» de un punto al siguiente.
 */
const StepIndicator = ({ step, total = 5 }: StepIndicatorProps) => (
  <div className="step-indicator" role="img" aria-label={`${step} / ${total}`}>
    {Array.from({ length: total }, (_, i) => (
      <span key={i} className={`step-dot ${i + 1 === step ? "active" : ""}`} />
    ))}
  </div>
);

export default StepIndicator;
