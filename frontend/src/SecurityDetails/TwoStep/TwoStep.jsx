import React, { useEffect, useState, useRef, useCallback } from "react";
import "./TwoStep.css";

// ── Constants ──────────────────────────────────────────────
const CORRECT_ANSWER = "blue";
const CORRECT_PIN    = "1234";
const MAX_ATTEMPTS   = 3;
const RESEND_DELAY   = 20;

// ── Tiny helper: typing-effect label ──────────────────────
function TypedLabel({ text, speed = 28 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <span className="typed-label">{displayed}<span className="cursor-blink">▌</span></span>;
}

// ── OTP / PIN 4-box input ──────────────────────────────────
function PinBoxes({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      const next = value.slice(0, idx) + "" + value.slice(idx + 1);
      onChange(next);
      if (idx > 0) refs[idx - 1].current?.focus();
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = value.slice(0, idx) + e.key + value.slice(idx + 1);
    onChange(next);
    if (idx < 3) refs[idx + 1].current?.focus();
  };

  return (
    <div className="pin-boxes">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          className="pin-cell"
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={() => {}} // controlled via onKeyDown
          onKeyDown={(e) => handleKey(e, i)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}

// ── Progress segments ──────────────────────────────────────
function StepBar({ current }) {
  const steps = [
    { num: 1, label: "IDENTITY"  },
    { num: 2, label: "VERIFY"    },
    { num: 3, label: "ACCESS"    },
  ];

  const activeIdx =
    current === 0  ? 0 :
    current === 1  ? 1 :
    current === 2  ? 2 : -1;

  return (
    <div className="step-bar">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className={`step ${activeIdx === i ? "active" : activeIdx > i ? "done" : ""}`}>
            <span className="step-num">{activeIdx > i ? "✓" : s.num}</span>
            <span className="step-label">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-connector ${activeIdx > i ? "filled" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Method toggle tabs ─────────────────────────────────────
function MethodTabs({ method, onSwitch }) {
  return (
    <div className="method-tabs">
      <button
        className={`tab ${method === "question" ? "tab-active" : ""}`}
        onClick={() => onSwitch("question")}
        type="button"
      >
        <span className="tab-icon">?</span> Security Q
      </button>
      <button
        className={`tab ${method === "pin" ? "tab-active" : ""}`}
        onClick={() => onSwitch("pin")}
        type="button"
      >
        <span className="tab-icon">#</span> Backup PIN
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
const TwoStep = () => {
  const [phase, setPhase]       = useState("intro");   // intro | email | verify | success | locked
  const [introCount, setIntroCount] = useState(3);

  const [email, setEmail]       = useState("");
  const [emailErr, setEmailErr] = useState("");

  const [method, setMethod]     = useState("question");
  const [answer, setAnswer]     = useState("");
  const [pin, setPin]           = useState("");

  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [timer, setTimer]       = useState(0);

  const [toast, setToast]       = useState(null); // { msg, type }
  const toastTimer              = useRef(null);

  // ── Intro countdown 3→0 ──
  useEffect(() => {
    if (phase !== "intro") return;
    const id = setInterval(() => {
      setIntroCount((c) => {
        if (c <= 1) { clearInterval(id); setPhase("email"); return 0; }
        return c - 1;
      });
    }, 500);
    return () => clearInterval(id);
  }, [phase]);

  // ── Resend timer ──
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Toast helper ──
  const showToast = useCallback((msg, type = "info") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  }, []);

  // ── Validate email ──
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleEmailSubmit = () => {
    if (!email) { setEmailErr("Email address required"); return; }
    if (!validateEmail(email)) { setEmailErr("Enter a valid email address"); return; }
    setEmailErr("");
    showToast(`Verification link dispatched → ${email}`, "warn");
    setPhase("verify");
    setTimer(RESEND_DELAY);
    setAttempts(MAX_ATTEMPTS);
  };

  const handleFail = () => {
    const left = attempts - 1;
    setAttempts(left);
    if (left <= 0) {
      showToast("Maximum attempts exceeded — account locked", "error");
      setPhase("locked");
    } else {
      showToast(`Incorrect — ${left} attempt${left !== 1 ? "s" : ""} remaining`, "error");
    }
  };

  const verifyQuestion = () => {
    if (!answer.trim()) { showToast("Answer cannot be empty", "error"); return; }
    answer.trim().toLowerCase() === CORRECT_ANSWER
      ? (showToast("Security check passed", "success"), setPhase("success"))
      : handleFail();
  };

  const verifyPin = () => {
    if (pin.length < 4) { showToast("Enter all 4 digits", "error"); return; }
    pin === CORRECT_PIN
      ? (showToast("PIN verified successfully", "success"), setPhase("success"))
      : handleFail();
  };

  const resetAll = () => {
    setPhase("email");
    setEmail(""); setEmailErr("");
    setAnswer(""); setPin("");
    setAttempts(MAX_ATTEMPTS);
    setTimer(0);
    setToast(null);
  };

  // ── Step index for StepBar ──
  const stepIdx = phase === "email" ? 0 : phase === "verify" ? 1 : phase === "success" ? 2 : 0;

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="auth-wrapper">

      {/* ── Intro overlay ── */}
      {phase === "intro" && (
        <div className="intro-overlay">
          <div className="intro-ring">
            <span className="intro-count">{introCount}</span>
          </div>
          <p className="intro-label">INITIALIZING SECURE SESSION</p>
        </div>
      )}

      {phase !== "intro" && (
        <>
          {/* ── Header ── */}
          <header className="auth-header">
            <div className="header-lock">🔐</div>
            <h1><TypedLabel text="VAULT AUTHENTICATION" speed={32} /></h1>
            <p className="header-sub">HARIKART SECURE ACCESS TERMINAL v2.4</p>
          </header>

          {/* ── Step bar ── */}
          <StepBar current={stepIdx} />

          {/* ── Card ── */}
          <div className="auth-card">

            {/* ══ PHASE: email ══ */}
            {phase === "email" && (
              <div className="box fade" key="email">
                <div className="box-tag">STEP 01 / IDENTITY</div>
                <h2>Email Verification</h2>
                <p className="box-desc">
                  Enter the email address linked to your Harikart account.
                  A one-time verification token will be dispatched.
                </p>

                <label className="field-label">EMAIL ADDRESS</label>
                <div className={`input-group ${emailErr ? "input-error" : ""}`}>
                  <span className="input-prefix">@</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailErr(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                    autoFocus
                  />
                </div>
                {emailErr && <p className="field-err">⚠ {emailErr}</p>}

                <button className="btn-primary" onClick={handleEmailSubmit}>
                  <span className="btn-icon">→</span> DISPATCH VERIFICATION
                </button>
              </div>
            )}

            {/* ══ PHASE: verify ══ */}
            {phase === "verify" && (
              <div className="box fade" key="verify">
                <div className="box-tag">STEP 02 / VERIFY</div>
                <h2>Identity Challenge</h2>

                <div className="meta-row">
                  <span className="meta-chip attempts">
                    ATTEMPTS&nbsp;&nbsp;<strong>{attempts}/{MAX_ATTEMPTS}</strong>
                  </span>
                  <span className={`meta-chip timer ${timer > 0 ? "ticking" : ""}`}>
                    {timer > 0 ? `RESEND IN ${timer}s` : "RESEND READY"}
                  </span>
                </div>

                <MethodTabs method={method} onSwitch={(m) => { setMethod(m); setAnswer(""); setPin(""); }} />

                {method === "question" ? (
                  <div className="method-body fade" key="q">
                    <p className="challenge-prompt">
                      <span className="prompt-tag">CHALLENGE</span>
                      What is your favorite color?
                    </p>
                    <label className="field-label">YOUR ANSWER</label>
                    <div className="input-group">
                      <span className="input-prefix">›</span>
                      <input
                        type="text"
                        placeholder="Type answer..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && verifyQuestion()}
                      />
                    </div>
                    <button className="btn-primary" onClick={verifyQuestion}>
                      <span className="btn-icon">✓</span> VERIFY ANSWER
                    </button>
                  </div>
                ) : (
                  <div className="method-body fade" key="p">
                    <p className="challenge-prompt">
                      <span className="prompt-tag">CHALLENGE</span>
                      Enter your 4-digit backup PIN
                    </p>
                    <label className="field-label">BACKUP PIN</label>
                    <PinBoxes value={pin} onChange={setPin} />
                    <button className="btn-primary" onClick={verifyPin}>
                      <span className="btn-icon">✓</span> VERIFY PIN
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ══ PHASE: success ══ */}
            {phase === "success" && (
              <div className="box box-success fade" key="success">
                <div className="box-tag tag-success">STEP 03 / ACCESS</div>
                <div className="status-icon-lg">✦</div>
                <h2>Access Granted</h2>
                <p className="box-desc">
                  Identity confirmed. Secure session established for <strong>{email}</strong>.
                  All activity is monitored and encrypted.
                </p>
                <div className="session-badge">
                  <span className="session-dot" />
                  SESSION ACTIVE
                </div>
              </div>
            )}

            {/* ══ PHASE: locked ══ */}
            {phase === "locked" && (
              <div className="box box-error fade" key="locked">
                <div className="box-tag tag-error">LOCKOUT TRIGGERED</div>
                <div className="status-icon-lg icon-error">✕</div>
                <h2>Account Locked</h2>
                <p className="box-desc">
                  Too many failed attempts. Your account has been temporarily suspended.
                  Contact support or reset authentication below.
                </p>
                <button className="btn-ghost" onClick={resetAll}>
                  ↺ RESET &amp; TRY AGAIN
                </button>
              </div>
            )}

          </div>

          {/* ── Toast notification ── */}
          {toast && (
            <div className={`toast toast-${toast.type}`} key={toast.msg}>
              <span className="toast-dot" />
              {toast.msg}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TwoStep;