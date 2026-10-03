import "./OnboardingKit.css";

/** Etiqueta de paso sobre el título («Paso 2 de 5»). */
const StepBadge = ({ label }: { label: string }) => (
  <span className="step-badge">
    <span className="step-badge-dot" />
    {label}
  </span>
);

export default StepBadge;
