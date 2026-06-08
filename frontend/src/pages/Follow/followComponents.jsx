import {
  FiUserPlus, FiUserCheck, FiBell, FiBellOff,
} from 'react-icons/fi';
import { AvatarStore } from './followHelpers';

/* ══════════════════════════════════════════════════════════════
   FOLLOW BUTTON
══════════════════════════════════════════════════════════════ */
export function FollowButton({ following, loading, animating, onClick, isAuthenticated, btnRef }) {
  return (
    <button
      ref={btnRef}
      id="follow-page-btn"
      className={`fp-follow-btn ${following ? 'fp-follow-btn--following' : 'fp-follow-btn--default'} ${animating ? 'fp-follow-btn--animating' : ''} ${loading ? 'fp-follow-btn--loading' : ''}`}
      onClick={onClick}
      disabled={loading}
    >
      {following
        ? <><FiUserCheck size={19} /><span>Following</span></>
        : <><FiUserPlus size={19} /><span>{isAuthenticated ? 'Follow Us' : 'Login to Follow'}</span></>
      }
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION BUTTON
══════════════════════════════════════════════════════════════ */
export function NotifButton({ notifOn, onClick }) {
  return (
    <button
      className={`fp-notif-btn ${notifOn ? 'fp-notif-btn--on' : ''}`}
      onClick={onClick}
    >
      {notifOn ? <FiBellOff size={15} /> : <FiBell size={15} />}
      {notifOn ? 'Notifications On · Turn Off' : 'Turn On Notifications'}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════ */
export function Toast({ message, icon }) {
  return (
    <div className="fp-toast">
      {icon} {message}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   VERIFIED ICON (SVG)
══════════════════════════════════════════════════════════════ */
export function VerifiedIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   AVATAR CIRCLE
══════════════════════════════════════════════════════════════ */
const GRADIENTS = [
  'linear-gradient(135deg, #7c3aed, #a855f7)',
  'linear-gradient(135deg, #ea580c, #fb923c)',
  'linear-gradient(135deg, #0284c7, #38bdf8)',
  'linear-gradient(135deg, #059669, #34d399)',
  'linear-gradient(135deg, #d97706, #fbbf24)',
  'linear-gradient(135deg, #db2777, #f472b6)',
];

export function AvatarCircle({ avatar, email, name, size = 36 }) {
  const gradient = GRADIENTS[((name || '?').charCodeAt(0)) % GRADIENTS.length];
  const resolved = avatar || AvatarStore.get(email) || null;
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.38,
    background: resolved ? 'transparent' : gradient,
  };

  return (
    <div className="fp-avatar-circle" style={style}>
      {resolved
        ? <img src={resolved} alt={name} className="fp-avatar-circle__img" />
        : (name || '?')[0].toUpperCase()
      }
    </div>
  );
}
