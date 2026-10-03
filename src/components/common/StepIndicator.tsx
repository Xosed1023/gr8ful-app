import "./OnboardingKit.css";

interface StepIndicatorProps {
  /** Paso actual (1..total). */
  step: number;
  total?: number;
}

/** Píldora de vidrio con un punto por paso; el activo es más grande y brilla. */
const StepIndicator = ({ step, total = 5 }: StepIndicatorProps) => (
  <div
    className="step-indicator"
    role="img"
    aria-label={`${step} / ${total}`}
  >
    {Array.from({ length: total }, (_, i) =>
      i + 1 === step ? (
        <span key={i} className="step-active">
          <span className="step-ring" />
          <span className="step-core" />
        </span>
      ) : (
        <span key={i} className="step-dot" />
      )
    )}
  </div>
);

export default StepIndicator;
