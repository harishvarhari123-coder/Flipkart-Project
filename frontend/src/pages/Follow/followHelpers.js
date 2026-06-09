import axios from 'axios';

export const API = 'https://flipkart-project-l2ex.onrender.com/api';

/* ══════════════════════════════════════════════════════════════
   IMAGE COMPRESS HELPER
══════════════════════════════════════════════════════════════ */
export function compressImage(file, maxSize = 200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > h) { if (w > maxSize) { h = (h * maxSize) / w; w = maxSize; } }
        else       { if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ══════════════════════════════════════════════════════════════
   CONFETTI HELPER
══════════════════════════════════════════════════════════════ */
export function launchConfetti() {
  const colors = ['#7c3aed','#a855f7','#ea580c','#f59e0b','#10b981','#3b82f6','#ec4899'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;overflow:hidden;';
  document.body.appendChild(container);
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = Math.random() * 1.5 + 1.2;
    const shape = Math.random() > 0.5 ? '50%' : '2px';
    el.style.cssText = `
      position:absolute;top:-20px;left:${left}%;
      width:${size}px;height:${size}px;
      background:${color};border-radius:${shape};
      animation:confettiFall ${duration}s ${delay}s ease-in forwards;
    `;
    container.appendChild(el);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(540deg);opacity:0} }`;
  document.head.appendChild(style);
  setTimeout(() => { container.remove(); style.remove(); }, 3000);
}

/* ══════════════════════════════════════════════════════════════
   GLOBAL AVATAR STORE
══════════════════════════════════════════════════════════════ */
export const AvatarStore = {
  key: (email) => `hk_av_${(email || '').toLowerCase().trim()}`,
  set(email, base64) {
    if (!email || !base64) return;
    try { localStorage.setItem(this.key(email), base64); } catch {}
  },
  remove(email) {
    if (!email) return;
    try { localStorage.removeItem(this.key(email)); } catch {}
  },
  get(email) {
    if (!email) return null;
    try { return localStorage.getItem(this.key(email)) || null; } catch { return null; }
  },
};

/* ══════════════════════════════════════════════════════════════
   PER-USER PROFILE STORE
══════════════════════════════════════════════════════════════ */
export const ProfileStore = {
  key: (u) => u ? `hk_profile_${u.id || u._id || u.email}` : null,
  get(u) {
    try {
      const k = this.key(u); if (!k) return null;
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  set(u, data) {
    try {
      const k = this.key(u); if (k) localStorage.setItem(k, JSON.stringify(data));
    } catch {}
  },
};

/* ══════════════════════════════════════════════════════════════
   AXIOS HELPER
══════════════════════════════════════════════════════════════ */
export const authAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
};

/* ══════════════════════════════════════════════════════════════
   FORMATTERS
══════════════════════════════════════════════════════════════ */
export const formatCount = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
};

export const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
};

export const formatMemberSince = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};
