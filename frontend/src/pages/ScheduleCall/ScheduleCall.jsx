import React, { useState, useEffect, useMemo, useRef } from "react";

/* ─── STYLES (replaces ScheduleCall.css) ─────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:      #1a1208;
  --ink2:     #4a3728;
  --ink3:     #8a6a50;
  --paper:    #fdf8f0;
  --paper2:   #f7f0e4;
  --paper3:   #efe5d4;
  --paper4:   #e4d8c4;
  --rust:     #b85c38;
  --rust2:    #d4784e;
  --rust3:    #8c3e20;
  --gold:     #c49a30;
  --gold2:    #e8bc50;
  --sage:     #5a7856;
  --border:   rgba(90,60,30,0.12);
  --border2:  rgba(90,60,30,0.22);
  --shadow:   0 2px 16px rgba(30,16,4,0.09);
  --shadow2:  0 8px 40px rgba(30,16,4,0.13);
  --serif:    'Cormorant Garamond', Georgia, serif;
  --sans:     'Outfit', system-ui, sans-serif;
  --mono:     'JetBrains Mono', monospace;
  --r:        8px;
  --r2:       14px;
  --r3:       20px;
}

.sc-wrap {
  font-family: var(--sans);
  background: var(--paper);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

/* faint dot grid bg */
.sc-wrap::before {
  content: '';
  position: fixed; inset: 0;
  background-image: radial-gradient(circle, rgba(90,60,30,0.09) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}
.sc-wrap::after {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 10% 5%, rgba(184,92,56,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 55% 40% at 90% 90%, rgba(196,154,48,0.07) 0%, transparent 55%);
  pointer-events: none;
}

.sc-card {
  position: relative; z-index: 1;
  background: #fff;
  border: 1px solid var(--border2);
  border-radius: var(--r3);
  box-shadow: var(--shadow2);
  width: 100%; max-width: 560px;
  overflow: hidden;
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: none; }
}

/* top stripe */
.sc-card-header {
  background: var(--rust3);
  padding: 28px 32px 24px;
  position: relative; overflow: hidden;
}
.sc-card-header::before {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 12px,
    rgba(255,255,255,0.03) 12px,
    rgba(255,255,255,0.03) 24px
  );
}
.sc-card-header-inner { position: relative; z-index: 1; }
.sc-step-badge {
  font-family: var(--mono); font-size: 0.65rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-bottom: 8px; display: block;
}
.sc-title {
  font-family: var(--serif); font-size: 2rem; font-weight: 600;
  font-style: italic; color: #fff; letter-spacing: -0.02em; line-height: 1.2;
}
.sc-subtitle {
  font-size: 0.85rem; font-weight: 300; color: rgba(255,255,255,0.65);
  margin-top: 6px; line-height: 1.5;
}

/* progress bar */
.sc-progress {
  height: 3px; background: rgba(255,255,255,0.15);
  position: relative; overflow: hidden;
}
.sc-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold2), var(--rust2));
  transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
}

/* body */
.sc-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 24px; }

/* field */
.sc-field { display: flex; flex-direction: column; gap: 8px; }
.sc-label {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--ink3);
  display: flex; align-items: center; gap: 8px;
}
.sc-label-req {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--rust); flex-shrink: 0;
}
.sc-label-req.done { background: var(--sage); }

/* calendar */
.sc-calendar {
  background: var(--paper2); border: 1px solid var(--border);
  border-radius: var(--r2); overflow: hidden;
}
.sc-cal-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-bottom: 1px solid var(--border);
}
.sc-cal-title {
  font-family: var(--serif); font-size: 1.05rem; font-weight: 600;
  font-style: italic; color: var(--ink);
}
.sc-cal-arrow {
  width: 30px; height: 30px; border-radius: 7px;
  background: none; border: 1px solid var(--border2);
  color: var(--ink2); cursor: pointer; font-size: 0.85rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.sc-cal-arrow:hover { background: var(--paper3); border-color: var(--rust2); color: var(--rust); }

.sc-cal-dow {
  display: grid; grid-template-columns: repeat(7,1fr);
  padding: 8px 12px 4px; gap: 2px;
}
.sc-cal-dow span {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.07em;
  text-transform: uppercase; color: var(--ink3); text-align: center;
}

.sc-cal-days {
  display: grid; grid-template-columns: repeat(7,1fr);
  padding: 4px 12px 12px; gap: 3px;
}
.sc-cal-day {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; font-weight: 400; border-radius: var(--r);
  cursor: pointer; transition: all 0.14s; color: var(--ink2);
  border: 1px solid transparent;
  background: none;
}
.sc-cal-day:hover:not(.disabled):not(.selected) {
  background: var(--paper3); border-color: var(--border2); color: var(--ink);
}
.sc-cal-day.other-month { color: var(--ink3); opacity: 0.45; cursor: default; }
.sc-cal-day.today { font-weight: 600; color: var(--rust); }
.sc-cal-day.disabled { opacity: 0.3; cursor: not-allowed; }
.sc-cal-day.selected {
  background: var(--rust3); color: #fff; border-color: var(--rust3);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(140,62,32,0.3);
}
.sc-cal-day.empty { cursor: default; }

/* time grid */
.sc-time-grid {
  display: grid; grid-template-columns: repeat(4,1fr); gap: 7px;
}
.sc-time-btn {
  padding: 10px 4px; font-family: var(--mono); font-size: 0.78rem; font-weight: 500;
  color: var(--ink2); background: var(--paper2); border: 1px solid var(--border2);
  border-radius: var(--r); cursor: pointer; transition: all 0.15s;
  text-align: center;
}
.sc-time-btn:hover:not(.active) {
  background: var(--paper3); border-color: var(--rust2); color: var(--rust);
}
.sc-time-btn.active {
  background: var(--rust3); color: #fff; border-color: var(--rust3);
  font-weight: 600; box-shadow: 0 2px 8px rgba(140,62,32,0.25);
}

/* meeting type */
.sc-type-grid { display: flex; flex-direction: column; gap: 8px; }
.sc-type-card {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; background: var(--paper2);
  border: 1px solid var(--border2); border-radius: var(--r2);
  cursor: pointer; transition: all 0.18s;
}
.sc-type-card:hover:not(.selected) { background: var(--paper3); border-color: var(--rust2); }
.sc-type-card.selected {
  background: rgba(140,62,32,0.05); border-color: var(--rust);
  box-shadow: 0 0 0 3px rgba(140,62,32,0.08);
}
.sc-type-icon {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
  background: var(--paper3); border: 1px solid var(--border2);
  transition: all 0.18s;
}
.sc-type-card.selected .sc-type-icon {
  background: var(--rust3); border-color: var(--rust3);
}
.sc-type-info { flex: 1; }
.sc-type-name {
  font-size: 0.9rem; font-weight: 600; color: var(--ink); line-height: 1.2;
}
.sc-type-desc {
  font-size: 0.78rem; font-weight: 300; color: var(--ink3); margin-top: 3px;
}
.sc-type-radio {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--border2); background: none;
  transition: all 0.18s; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.sc-type-card.selected .sc-type-radio {
  border-color: var(--rust); background: var(--rust);
}
.sc-type-radio-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #fff;
  opacity: 0; transform: scale(0); transition: all 0.15s;
}
.sc-type-card.selected .sc-type-radio-dot { opacity: 1; transform: scale(1); }

/* divider */
.sc-divider {
  height: 1px; background: var(--border); margin: 0 -32px;
}

/* summary strip */
.sc-summary {
  background: var(--paper2); border: 1px solid var(--border);
  border-radius: var(--r2); padding: 14px 16px;
  display: grid; grid-template-columns: repeat(3,1fr); gap: 12px;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
.sc-sum-item { display: flex; flex-direction: column; gap: 3px; }
.sc-sum-label {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--ink3);
}
.sc-sum-val {
  font-family: var(--serif); font-size: 0.95rem; font-style: italic;
  font-weight: 600; color: var(--ink);
}

/* submit */
.sc-submit {
  width: 100%; padding: 15px 20px;
  font-family: var(--sans); font-size: 0.88rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: #fff; background: var(--rust3);
  border: none; border-radius: var(--r2); cursor: pointer;
  transition: all 0.22s;
  box-shadow: 0 3px 0 rgba(80,30,10,0.35), 0 2px 12px rgba(140,62,32,0.2);
  display: flex; align-items: center; justify-content: center; gap: 10px;
  position: relative; overflow: hidden;
}
.sc-submit:hover:not(:disabled) {
  background: var(--rust);
  box-shadow: 0 3px 0 rgba(80,30,10,0.35), 0 6px 24px rgba(140,62,32,0.3);
  transform: translateY(-1px);
}
.sc-submit:active:not(:disabled) { transform: scale(0.982); box-shadow: none; }
.sc-submit:disabled { opacity: 0.42; cursor: not-allowed; transform: none; box-shadow: none; }

.sc-spinner {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%;
  animation: spin 0.65s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* success screen */
.sc-success {
  position: relative; z-index: 1;
  background: #fff; border: 1px solid var(--border2); border-radius: var(--r3);
  box-shadow: var(--shadow2); width: 100%; max-width: 480px;
  overflow: hidden; text-align: center;
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
.sc-success-top {
  background: var(--sage); padding: 40px 32px 32px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.sc-success-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.3);
  display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
  animation: popIn 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes popIn { from{opacity:0;transform:scale(0.4)} to{opacity:1;transform:scale(1)} }
.sc-success-title {
  font-family: var(--serif); font-size: 1.9rem; font-style: italic; font-weight: 600;
  color: #fff; letter-spacing: -0.02em;
}
.sc-success-sub { font-size: 0.85rem; font-weight: 300; color: rgba(255,255,255,0.72); }
.sc-success-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 16px; }
.sc-success-details {
  background: var(--paper2); border: 1px solid var(--border);
  border-radius: var(--r2); overflow: hidden;
}
.sc-success-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 18px; border-bottom: 1px solid var(--border);
}
.sc-success-row:last-child { border-bottom: none; }
.sc-success-key {
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--ink3);
}
.sc-success-val {
  font-family: var(--serif); font-size: 0.95rem; font-style: italic;
  font-weight: 600; color: var(--ink);
}
.sc-success-note {
  font-size: 0.78rem; font-weight: 300; color: var(--ink3); line-height: 1.55;
}
.sc-new-btn {
  width: 100%; padding: 13px 20px;
  font-family: var(--sans); font-size: 0.82rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--rust3); background: none;
  border: 1.5px solid var(--rust3); border-radius: var(--r2);
  cursor: pointer; transition: all 0.18s;
}
.sc-new-btn:hover { background: rgba(140,62,32,0.06); }

@media(max-width:520px){
  .sc-body { padding: 20px 20px 24px; }
  .sc-card-header { padding: 22px 20px 20px; }
  .sc-time-grid { grid-template-columns: repeat(3,1fr); }
  .sc-summary { grid-template-columns: 1fr 1fr; }
}
`;

/* ─── DATA ────────────────────────────────────────────────── */
const TIME_SLOTS = [
  "09:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "02:00 PM","03:00 PM","04:00 PM","05:00 PM",
];

const MEETING_TYPES = [
  { id:"intro",   icon:"👋", label:"Intro Call",         desc:"Quick 15-min introduction" },
  { id:"project", icon:"🗂", label:"Project Discussion", desc:"Deep dive into your work"   },
  { id:"support", icon:"🛠", label:"Support Call",       desc:"Get help & guidance"         },
];

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

/* ─── MINI CALENDAR ──────────────────────────────────────── */
function Calendar({ value, onChange }) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const [cursor, setCursor] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const { year, month } = cursor;

  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const prevDays  = new Date(year, month, 0).getDate();

  const cells = useMemo(() => {
    const arr = [];
    for (let i = firstDay-1; i >= 0; i--)
      arr.push({ day: prevDays-i, type: "prev" });
    for (let d = 1; d <= daysInMonth; d++)
      arr.push({ day: d, type: "cur" });
    const rem = 42 - arr.length;
    for (let d = 1; d <= rem; d++)
      arr.push({ day: d, type: "next" });
    return arr;
  }, [year, month, firstDay, daysInMonth, prevDays]);

  const prev = () => setCursor(c =>
    c.month === 0 ? { year: c.year-1, month: 11 } : { year: c.year, month: c.month-1 });
  const next = () => setCursor(c =>
    c.month === 11 ? { year: c.year+1, month: 0 } : { year: c.year, month: c.month+1 });

  const fmt = (d) => `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  return (
    <div className="sc-calendar">
      <div className="sc-cal-nav">
        <button className="sc-cal-arrow" onClick={prev}>‹</button>
        <span className="sc-cal-title">{MONTHS[month]} {year}</span>
        <button className="sc-cal-arrow" onClick={next}>›</button>
      </div>
      <div className="sc-cal-dow">
        {DAYS.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="sc-cal-days">
        {cells.map((cell, i) => {
          if (cell.type !== "cur") {
            return <div key={i} className="sc-cal-day other-month">{cell.day}</div>;
          }
          const dateStr = fmt(cell.day);
          const cellDate = new Date(year, month, cell.day);
          const isPast = cellDate < today;
          const isSel  = value === dateStr;
          const isToday = cellDate.getTime() === today.getTime();
          return (
            <div
              key={i}
              className={`sc-cal-day${isPast?" disabled":""}${isSel?" selected":""}${isToday&&!isSel?" today":""}`}
              onClick={() => !isPast && onChange(dateStr)}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function ScheduleCall() {
  const [date,    setDate]    = useState("");
  const [time,    setTime]    = useState("");
  const [type,    setType]    = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    cardRef.current?.focus();
  }, [confirmed]);

  const step = [!!date, !!time, !!type].filter(Boolean).length;
  const progress = (step / 3) * 100;
  const isValid = date && time && type;

  const fmtDate = (d) => {
    if (!d) return "";
    const [y,m,day] = d.split("-");
    return `${MONTHS[parseInt(m)-1].slice(0,3)} ${parseInt(day)}, ${y}`;
  };

  const getTypeName = (id) => MEETING_TYPES.find(m => m.id === id)?.label || "";

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setConfirmed(true);
  };

  const reset = () => {
    setDate(""); setTime(""); setType(""); setConfirmed(false);
  };

  /* ── Success ── */
  if (confirmed) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="sc-wrap">
          <div className="sc-success" ref={cardRef} tabIndex={-1} style={{outline:"none"}}>
            <div className="sc-success-top">
              <div className="sc-success-icon">✓</div>
              <h1 className="sc-success-title">You're booked!</h1>
              <p className="sc-success-sub">A confirmation has been sent to your email.</p>
            </div>
            <div className="sc-success-body">
              <div className="sc-success-details">
                <div className="sc-success-row">
                  <span className="sc-success-key">Date</span>
                  <span className="sc-success-val">{fmtDate(date)}</span>
                </div>
                <div className="sc-success-row">
                  <span className="sc-success-key">Time</span>
                  <span className="sc-success-val">{time}</span>
                </div>
                <div className="sc-success-row">
                  <span className="sc-success-key">Type</span>
                  <span className="sc-success-val">{getTypeName(type)}</span>
                </div>
              </div>
              <p className="sc-success-note">
                We'll send you a calendar invite and a reminder 30 minutes before the call. You can reschedule or cancel up to 2 hours beforehand.
              </p>
              <button className="sc-new-btn" onClick={reset}>
                + Schedule Another Call
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Form ── */
  return (
    <>
      <style>{STYLES}</style>
      <div className="sc-wrap">
        <div className="sc-card" ref={cardRef} tabIndex={-1} style={{outline:"none"}}>

          {/* Header */}
          <div className="sc-card-header">
            <div className="sc-card-header-inner">
              <span className="sc-step-badge">Step {step} of 3 complete</span>
              <h1 className="sc-title">Schedule a Call</h1>
              <p className="sc-subtitle">Pick a date, time slot, and meeting type to get started.</p>
            </div>
          </div>

          {/* Progress */}
          <div className="sc-progress">
            <div className="sc-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Body */}
          <div className="sc-body">

            {/* Date */}
            <div className="sc-field">
              <div className="sc-label">
                <span className={`sc-label-req${date?" done":""}`} />
                Select Date
              </div>
              <Calendar value={date} onChange={setDate} />
            </div>

            {/* Time */}
            <div className="sc-field">
              <div className="sc-label">
                <span className={`sc-label-req${time?" done":""}`} />
                Select Time
              </div>
              <div className="sc-time-grid">
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    className={`sc-time-btn${time===t?" active":""}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Meeting Type */}
            <div className="sc-field">
              <div className="sc-label">
                <span className={`sc-label-req${type?" done":""}`} />
                Meeting Type
              </div>
              <div className="sc-type-grid">
                {MEETING_TYPES.map(m => (
                  <div
                    key={m.id}
                    className={`sc-type-card${type===m.id?" selected":""}`}
                    onClick={() => setType(m.id)}
                  >
                    <div className="sc-type-icon">{m.icon}</div>
                    <div className="sc-type-info">
                      <div className="sc-type-name">{m.label}</div>
                      <div className="sc-type-desc">{m.desc}</div>
                    </div>
                    <div className="sc-type-radio">
                      <div className="sc-type-radio-dot" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary strip */}
            {isValid && (
              <div className="sc-summary">
                <div className="sc-sum-item">
                  <span className="sc-sum-label">Date</span>
                  <span className="sc-sum-val">{fmtDate(date)}</span>
                </div>
                <div className="sc-sum-item">
                  <span className="sc-sum-label">Time</span>
                  <span className="sc-sum-val">{time}</span>
                </div>
                <div className="sc-sum-item">
                  <span className="sc-sum-label">Type</span>
                  <span className="sc-sum-val">{getTypeName(type)}</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              className="sc-submit"
              disabled={!isValid || loading}
              onClick={handleSubmit}
            >
              {loading
                ? <><div className="sc-spinner" /> Scheduling…</>
                : "Confirm Schedule →"
              }
            </button>

          </div>
        </div>
      </div>
    </>
  );
}