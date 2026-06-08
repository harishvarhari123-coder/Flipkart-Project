import React, { useState, useEffect, useCallback, useRef } from "react";
import "./GetStarted.css";

/**
 * Utility: simulate API delay
 */
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Step data for onboarding flow
 */
const STEPS = [
  { id: 1, title: "Welcome", desc: "Start your journey" },
  { id: 2, title: "Profile Setup", desc: "Tell us about you" },
  { id: 3, title: "Preferences", desc: "Customize experience" },
  { id: 4, title: "Finish", desc: "You're ready to go" },
];

/**
 * Progress Bar Component
 */
const ProgressBar = ({ step }) => {
  const progress = (step / STEPS.length) * 100;

  return (
    <div className="progress-wrapper">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">
        Step {step} of {STEPS.length}
      </p>
    </div>
  );
};

/**
 * Step Card UI
 */
const StepCard = ({ step }) => {
  const data = STEPS[step - 1];

  return (
    <div className="step-card">
      <h2 tabIndex={-1}>{data.title}</h2>
      <p>{data.desc}</p>

      {/* Example focusable element (ensures autofocus works) */}
      <button className="btn secondary" autoFocus>
        Focus Target
      </button>
    </div>
  );
};

/**
 * Floating decoration elements
 */
const FloatingShapes = () => {
  return (
    <div className="floating-shapes">
      <span className="shape circle"></span>
      <span className="shape square"></span>
      <span className="shape triangle"></span>
    </div>
  );
};

/**
 * Main GetStarted Component
 */
const GetStarted = ({
  onComplete,
  title = "Get Started",
  subtitle = "Begin your experience in seconds",
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [direction, setDirection] = useState("next");

  const containerRef = useRef(null);

  const nextStep = useCallback(() => {
    setDirection("next");
    setStep((prev) => Math.min(prev + 1, STEPS.length));
  }, []);

  const prevStep = useCallback(() => {
    setDirection("prev");
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleStart = async () => {
    setLoading(true);
    await wait(1200);
    setLoading(false);
    nextStep();
  };

  const handleFinish = async () => {
    setLoading(true);
    await wait(1500);
    setLoading(false);
    setFinished(true);
    if (onComplete) onComplete();
  };

  /**
   * FIX 1: scroll to top on step change
   * FIX 2: autofocus first focusable element
   */
  useEffect(() => {
    // Scroll reset (index 0 feel)
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Autofocus first focusable element inside container
    const el = containerRef.current;
    if (!el) return;

    const focusable = el.querySelector(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );

    if (focusable) {
      setTimeout(() => focusable.focus(), 50);
    }
  }, [step]);

  if (finished) {
    return (
      <div className="get-started-container success">
        <h1>🎉 You're All Set!</h1>
        <p>Welcome aboard. Your setup is complete.</p>
      </div>
    );
  }

  return (
    <div className="get-started-container" ref={containerRef}>
      <FloatingShapes />

      <div className="header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <ProgressBar step={step} />

      <div className={`step-wrapper ${direction}`}>
        <StepCard step={step} />
      </div>

      <div className="actions">
        {step > 1 && (
          <button className="btn secondary" onClick={prevStep}>
            Back
          </button>
        )}

        {step === 1 && (
          <button className="btn primary" onClick={handleStart}>
            Start
          </button>
        )}

        {step > 1 && step < STEPS.length && (
          <button className="btn primary" onClick={nextStep}>
            Continue
          </button>
        )}

        {step === STEPS.length && (
          <button className="btn success" onClick={handleFinish}>
            Finish
          </button>
        )}
      </div>

      {loading && (
        <div className="overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default GetStarted;