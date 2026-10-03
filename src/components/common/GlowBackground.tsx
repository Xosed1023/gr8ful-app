import "./OnboardingKit.css";

/** Manchas de color difuminadas del fondo del onboarding (diseño de Stitch). */
const GlowBackground = () => (
  <div className="glow-layer" aria-hidden="true">
    <span className="glow glow-top" />
    <span className="glow glow-right" />
    <span className="glow glow-bottom" />
    <span className="glow glow-center-a" />
    <span className="glow glow-center-b" />
  </div>
);

export default GlowBackground;
