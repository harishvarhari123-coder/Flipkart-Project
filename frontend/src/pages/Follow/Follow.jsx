import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiUserPlus, FiUserCheck, FiUsers, FiBell, FiBellOff,
  FiShare2, FiCopy, FiCheck, FiEdit2, FiTrash2, FiCamera,
  FiX, FiSave, FiChevronDown, FiChevronUp, FiUser,
  FiHeart, FiMessageCircle, FiSend, FiCornerDownRight, FiUserX
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/logo.jpeg';

const API = 'http://localhost:5000/api';

/* ══════════════════════════════════════════════════════════════
   IMAGE COMPRESS HELPER
══════════════════════════════════════════════════════════════ */
function compressImage(file, maxSize = 200, quality = 0.7) {
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
function launchConfetti() {
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
    el.style.cssText = `position:absolute;top:-20px;left:${left}%;width:${size}px;height:${size}px;background:${color};border-radius:${shape};animation:confettiFall ${duration}s ${delay}s ease-in forwards;`;
    container.appendChild(el);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}`;
  document.head.appendChild(style);
  setTimeout(() => { container.remove(); style.remove(); }, 3000);
}

/* ══════════════════════════════════════════════════════════════
   FLYING HEARTS ANIMATION
══════════════════════════════════════════════════════════════ */
function launchHearts(btnEl) {
  const rect = btnEl ? btnEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99998;overflow:visible;';
  document.body.appendChild(container);
  const styleEl = document.createElement('style');
  styleEl.textContent = `@keyframes heartFly{0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1}60%{opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(var(--sc)) rotate(var(--rot));opacity:0}}`;
  document.head.appendChild(styleEl);
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    const size = 14 + Math.random() * 14;
    el.innerHTML = '❤️';
    el.style.cssText = `position:fixed;left:${cx - size/2}px;top:${cy - size/2}px;font-size:${size}px;line-height:1;--tx:${(Math.random()-0.5)*100}px;--ty:${-(60+Math.random()*100)}px;--sc:${0.4+Math.random()*0.8};--rot:${(Math.random()-0.5)*60}deg;animation:heartFly ${0.7+Math.random()*0.5}s ${Math.random()*0.25}s ease-out forwards;pointer-events:none;user-select:none;`;
    container.appendChild(el);
  }
  setTimeout(() => { container.remove(); styleEl.remove(); }, 2000);
}

/* ══════════════════════════════════════════════════════════════
   GLOBAL AVATAR STORE
══════════════════════════════════════════════════════════════ */
const AvatarStore = {
  key: (email) => `hk_av_${(email || '').toLowerCase().trim()}`,
  set(email, base64) { if (!email || !base64) return; try { localStorage.setItem(this.key(email), base64); } catch {} },
  remove(email)      { if (!email) return; try { localStorage.removeItem(this.key(email)); } catch {} },
  get(email)         { if (!email) return null; try { return localStorage.getItem(this.key(email)) || null; } catch { return null; } },
};

/* ══════════════════════════════════════════════════════════════
   PER-USER PROFILE STORE
══════════════════════════════════════════════════════════════ */
const ProfileStore = {
  key: (u) => u ? `hk_profile_${u.id || u._id || u.email}` : null,
  get(u) { try { const k = this.key(u); if (!k) return null; const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch { return null; } },
  set(u, data) { try { const k = this.key(u); if (k) localStorage.setItem(k, JSON.stringify(data)); } catch {} },
};

/* ══════════════════════════════════════════════════════════════
   AXIOS HELPER
══════════════════════════════════════════════════════════════ */
const authAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
};

/* ══════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════ */
const S = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(145deg,#f0f4ff 0%,#faf5ff 50%,#fff7ed 100%)', fontFamily:"'Plus Jakarta Sans',sans-serif", padding:'24px 16px', position:'relative', overflow:'hidden' },
  orb1: { position:'absolute', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)', top:'-80px', left:'-80px', pointerEvents:'none' },
  orb2: { position:'absolute', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(234,88,12,0.07) 0%,transparent 70%)', bottom:'-60px', right:'-60px', pointerEvents:'none' },
  card: { position:'relative', zIndex:2, background:'rgba(255,255,255,0.82)', border:'1px solid rgba(124,58,237,0.12)', borderRadius:26, padding:'44px 36px 36px', width:'100%', maxWidth:450, display:'flex', flexDirection:'column', alignItems:'center', backdropFilter:'blur(20px)', boxShadow:'0 2px 40px rgba(124,58,237,0.08),0 0 0 1px rgba(255,255,255,0.9) inset', animation:'cardIn 0.6s cubic-bezier(.22,1,.36,1) both' },
  avatarWrap: { position:'relative', marginBottom:18, animation:'avatarPop 0.7s cubic-bezier(.34,1.56,.64,1) 0.15s both' },
  avatarRing: { width:96, height:96, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ea580c 100%)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 4px rgba(124,58,237,0.12),0 8px 28px rgba(124,58,237,0.22)', overflow:'hidden', transition:'transform 0.2s ease,box-shadow 0.2s ease' },
  avatarRingGlow: { width:96, height:96, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ea580c 100%)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', transition:'transform 0.2s ease,box-shadow 0.2s ease', animation:'ringPulse 2.5s ease-in-out infinite' },
  onlineDot: { position:'absolute', bottom:4, right:4, width:14, height:14, borderRadius:'50%', background:'#22c55e', border:'2.5px solid #fff', zIndex:10, animation:'dotPulse 2s ease-in-out infinite' },
  userBanner: { width:'100%', background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, marginTop:14, animation:'fadeUp 0.5s ease 0.28s both' },
  userBannerName:  { fontSize:13.5, fontWeight:700, color:'#1e1b4b' },
  userBannerEmail: { fontSize:11.5, color:'#9ca3af', marginTop:1 },
  storeName: { margin:'14px 0 0', fontSize:26, fontWeight:800, color:'#1e1b4b', letterSpacing:'-0.5px', animation:'fadeUp 0.5s ease 0.25s both', textAlign:'center', fontFamily:"'Syne',sans-serif", display:'flex', alignItems:'center', gap:8, justifyContent:'center' },
  handle: { margin:'4px 0 0', fontSize:13, color:'#7c3aed', fontWeight:600, animation:'fadeUp 0.5s ease 0.3s both' },
  bio: { margin:'12px 0 0', fontSize:14, color:'#6b7280', textAlign:'center', lineHeight:1.65, maxWidth:340, animation:'fadeUp 0.5s ease 0.35s both' },
  badgeRow: { display:'flex', gap:8, marginTop:12, flexWrap:'wrap', justifyContent:'center', animation:'fadeUp 0.5s ease 0.38s both' },
  badge: { fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:'#ede9fe', color:'#5b21b6', border:'1px solid #c4b5fd', letterSpacing:'0.3px', textTransform:'uppercase' },
  editPanel: { width:'100%', marginTop:16, background:'#faf5ff', border:'1px solid #e9d5ff', borderRadius:18, padding:'20px', animation:'fadeUp 0.3s ease both', boxSizing:'border-box' },
  editLabel: { fontSize:11, color:'#7c3aed', fontWeight:700, letterSpacing:'0.5px', marginBottom:5, display:'block', textTransform:'uppercase' },
  editInput: { width:'100%', background:'#fff', border:'1px solid #ddd6fe', borderRadius:10, color:'#1e1b4b', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", padding:'9px 12px', outline:'none', marginBottom:12, boxSizing:'border-box', transition:'border 0.2s' },
  editActions: { display:'flex', gap:8, marginTop:4 },
  saveBtn: { flex:1, height:38, borderRadius:10, border:'none', background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontFamily:"'Plus Jakarta Sans',sans-serif" },
  cancelBtn: { flex:1, height:38, borderRadius:10, border:'1px solid #ddd6fe', background:'#fff', color:'#9ca3af', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontFamily:"'Plus Jakarta Sans',sans-serif" },
  divider: { width:'100%', height:1, background:'rgba(124,58,237,0.08)', margin:'20px 0' },
  statsRow: { display:'flex', alignItems:'center', gap:8, animation:'fadeUp 0.5s ease 0.4s both' },
  statIcon:   { color:'#7c3aed', fontSize:18 },
  statNumber: { fontSize:22, fontWeight:800, color:'#1e1b4b', letterSpacing:'-0.5px', fontFamily:"'Syne',sans-serif" },
  statLabel:  { fontSize:13, color:'#9ca3af', fontWeight:500, marginLeft:2 },
  memberSince: { marginTop:6, fontSize:11.5, color:'#a78bfa', fontWeight:600, display:'flex', alignItems:'center', gap:4, animation:'fadeUp 0.5s ease 0.41s both' },
  followersToggle: { marginTop:10, padding:'5px 12px', borderRadius:20, border:'1px solid #c4b5fd', background:'#f5f3ff', color:'#6d28d9', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:'all 0.2s', animation:'fadeUp 0.5s ease 0.42s both' },
  followersList: { width:'100%', marginTop:14, background:'#faf5ff', border:'1px solid #e9d5ff', borderRadius:16, overflow:'hidden', animation:'fadeUp 0.3s ease both', maxHeight:480, overflowY:'auto' },
  followersHeader: { padding:'12px 16px', fontSize:11, fontWeight:700, color:'#9ca3af', letterSpacing:'0.5px', borderBottom:'1px solid #f3e8ff', textTransform:'uppercase', position:'sticky', top:0, background:'#faf5ff' },
  followerItem: { display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:'1px solid #f3e8ff', transition:'background 0.15s' },
  followerAvatar: { width:36, height:36, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#7c3aed,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', overflow:'hidden' },
  followerName:  { fontSize:13.5, fontWeight:600, color:'#1e1b4b' },
  followerEmail: { fontSize:11.5, color:'#9ca3af', marginTop:1 },
  followerDate:  { fontSize:11, color:'#c4b5fd', flexShrink:0 },
  noFollowers:   { padding:'20px', textAlign:'center', fontSize:13, color:'#9ca3af' },
  greeting: { margin:'14px 0 0', fontSize:14, fontWeight:600, color:'#166534', textAlign:'center', display:'flex', alignItems:'center', gap:6, background:'#dcfce7', border:'1px solid #bbf7d0', borderRadius:12, padding:'8px 16px', animation:'greetPop 0.5s cubic-bezier(.34,1.56,.64,1) both' },
  btnWrap: { width:'100%', marginTop:20, animation:'fadeUp 0.5s ease 0.45s both' },
  notifBtn: { width:'100%', height:44, borderRadius:14, border:'1.5px solid #bbf7d0', background:'#f0fdf4', color:'#166534', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:13.5, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:'pointer', marginTop:10, transition:'all 0.2s ease', animation:'fadeUp 0.5s ease 0.5s both' },
  notifBtnOn: { background:'#f0fdf4', border:'1.5px solid #86efac', color:'#15803d' },
  shareRow: { display:'flex', gap:8, width:'100%', marginTop:10, animation:'fadeUp 0.5s ease 0.55s both' },
  shareBtn: { flex:1, height:40, borderRadius:12, border:'1px solid #e5e7eb', background:'#fff', color:'#6b7280', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontSize:12.5, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:'pointer', transition:'all 0.2s ease' },
  loginNote: { marginTop:14, fontSize:12.5, color:'#9ca3af', textAlign:'center', animation:'fadeUp 0.5s ease 0.5s both' },
  loginLink: { color:'#7c3aed', cursor:'pointer', fontWeight:600, textDecoration:'underline', textUnderlineOffset:2 },
  unfollowHint: { marginTop:8, fontSize:11.5, color:'#c4b5fd', textAlign:'center' },
  toast: { position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', background:'#fff', border:'1px solid #ddd6fe', color:'#6d28d9', fontSize:13.5, fontWeight:600, padding:'10px 22px', borderRadius:40, boxShadow:'0 4px 20px rgba(124,58,237,0.12)', zIndex:9999, whiteSpace:'nowrap', animation:'toastIn 0.35s cubic-bezier(.34,1.56,.64,1) both', display:'flex', alignItems:'center', gap:8 },
};

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */
function FollowButton({ following, loading, animating, onClick, isAuthenticated, btnRef }) {
  const base = { width:'100%', height:54, borderRadius:16, border:'none', cursor:loading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontSize:15.5, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:'0.2px', transition:'transform 0.15s ease,box-shadow 0.15s ease,opacity 0.15s ease', outline:'none', opacity:loading?0.7:1, transform:animating?'scale(0.96)':'scale(1)' };
  return (
    <button ref={btnRef} id="follow-page-btn"
      style={following ? { ...base, background:'#f5f3ff', border:'1.5px solid #c4b5fd', color:'#6d28d9' } : { ...base, background:'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ea580c 100%)', color:'#fff', boxShadow:'0 4px 24px rgba(124,58,237,0.32)' }}
      onClick={onClick} disabled={loading}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = animating ? 'scale(0.96)' : 'scale(1)'; }}
    >
      {following ? <><FiUserCheck size={19}/><span>Following</span></> : <><FiUserPlus size={19}/><span>{isAuthenticated?'Follow Us':'Login to Follow'}</span></>}
    </button>
  );
}

function Toast({ message, icon }) {
  return <div style={S.toast}>{icon} {message}</div>;
}

function AvatarCircle({ avatar, email, name, size = 36 }) {
  const gradients = ['linear-gradient(135deg,#7c3aed,#a855f7)','linear-gradient(135deg,#ea580c,#fb923c)','linear-gradient(135deg,#0284c7,#38bdf8)','linear-gradient(135deg,#059669,#34d399)','linear-gradient(135deg,#d97706,#fbbf24)','linear-gradient(135deg,#db2777,#f472b6)'];
  const gradient = gradients[((name || '?').charCodeAt(0)) % gradients.length];
  const style = { ...S.followerAvatar, width:size, height:size, fontSize:size*0.38 };
  const resolved = avatar || AvatarStore.get(email) || null;
  if (resolved) return <div style={style}><img src={resolved} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} /></div>;
  return <div style={{ ...style, background:gradient }}>{(name || '?')[0].toUpperCase()}</div>;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Follow() {
  const { isAuthenticated, user } = useAuth();
  const navigate     = useNavigate();
  const followBtnRef = useRef(null);
  const fileInputRef = useRef(null);

  const [followerCount, setFollowerCount] = useState(0);
  const [following, setFollowing]         = useState(false);
  const [loading, setLoading]             = useState(false);
  const [animating, setAnimating]         = useState(false);
  const [notifOn, setNotifOn]             = useState(false);
  const [copied,  setCopied]              = useState(false);
  const [toast,   setToast]               = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [loadingList,   setLoadingList]   = useState(false);
  const [memberSince,   setMemberSince]   = useState(null);

  const DEFAULT_STORE = { handle: '@harikart.official', bio: '' };
  const [storeProfile, setStoreProfile]   = useState(DEFAULT_STORE);
  const [editMode,     setEditMode]       = useState(false);

  const EMPTY_PROFILE = { fullName:'', dob:'', bio:'', avatar:null };
  const [userProfile,   setUserProfile]   = useState(() => ProfileStore.get(user) || EMPTY_PROFILE);
  const [editDraft,     setEditDraft]     = useState(EMPTY_PROFILE);
  const [avatarLoading, setAvatarLoading] = useState(false);

  /* ── Like / Comment / Reply state (persisted to localStorage) ── */
  const likesKey    = `hk_flw_likes_${user?.id || user?.email || 'guest'}`;
  const commentsKey = `hk_flw_comments_${user?.id || user?.email || 'guest'}`;

  const [followerLikes,    setFollowerLikesRaw]    = useState(() => { try { return JSON.parse(localStorage.getItem(likesKey) || '{}'); } catch { return {}; } });
  const [followerMsgOpen,  setFollowerMsgOpen]     = useState({});
  const [followerMsgDraft, setFollowerMsgDraft]    = useState({});
  const [commentSending,   setCommentSending]      = useState({});
  const [followerComments, setFollowerCommentsRaw] = useState(() => { try { return JSON.parse(localStorage.getItem(commentsKey) || '{}'); } catch { return {}; } });
  const [replyOpen,        setReplyOpen]           = useState({});
  const [replyDraft,       setReplyDraft]          = useState({});
  const [replySending,     setReplySending]        = useState({});

  /* ── In-page Notification / Chat states ── */
  const [notifications,    setNotifications]       = useState([]);
  const [unreadCount,      setUnreadCount]         = useState(0);
  const [replyTextState,   setReplyTextState]      = useState({});
  const [replyingMap,      setReplyingMap]         = useState({});
  const [loadingNotifs,    setLoadingNotifs]       = useState(false);
  const [activeTab,        setActiveTab]           = useState('followers');

  /* ── Line-by-line Chat states ── */
  const [activeChatPartner, setActiveChatPartner] = useState(null);
  const [chatHistory, setChatHistory]             = useState([]);
  const [chatMessageDraft, setChatMessageDraft]   = useState('');
  const [loadingChat, setLoadingChat]             = useState(false);
  const [sendingChat, setSendingChat]             = useState(false);
  const [blockedUsers, setBlockedUsers]           = useState([]);
  const chatEndRef                                = useRef(null);

  /* Wrappers that also save to localStorage */
  const setFollowerLikes = (updater) => {
    setFollowerLikesRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(likesKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const setFollowerComments = (updater) => {
    setFollowerCommentsRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(commentsKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  /* Like button refs for heart animation */
  const likeBtnRefs = useRef({});

  const showToast = (msg, icon = '✅') => {
    setToast({ message:msg, icon });
    setTimeout(() => setToast(null), 2800);
  };

  /* ── In-page Notification API Handlers ── */
  const fetchNotifications = useCallback(() => {
    if (!isAuthenticated) return;
    setLoadingNotifs(true);
    authAxios().get(`${API}/follow/my-notifications`)
      .then(res => {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      })
      .catch(() => {})
      .finally(() => setLoadingNotifs(false));
  }, [isAuthenticated]);

  const handleSendInboxReply = async (notifId) => {
    const text = (replyTextState[notifId] || '').trim();
    if (!text) return;

    setReplyingMap(prev => ({ ...prev, [notifId]: true }));
    try {
      await authAxios().post(`${API}/follow/my-notifications/${notifId}/reply`, { replyText: text });
      showToast('Reply sent successfully! ↩️', '↩️');
      setReplyTextState(prev => ({ ...prev, [notifId]: '' }));
      fetchNotifications();
    } catch (err) {
      showToast('Failed to send reply', '⚠️');
    } finally {
      setReplyingMap(prev => ({ ...prev, [notifId]: false }));
    }
  };

  const markAsRead = async (notifId) => {
    try {
      await authAxios().put(`${API}/follow/my-notifications/${notifId}/read`);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await authAxios().put(`${API}/follow/my-notifications/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
      showToast('All messages marked as read', '✅');
    } catch {}
  };

  /* ── Peer Chat API Handlers ── */
  const fetchBlockedUsers = useCallback(() => {
    if (!isAuthenticated) return;
    authAxios().get(`${API}/follow/blocked`)
      .then(res => setBlockedUsers(res.data.blockedUsers || []))
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  const toggleBlockUser = async (targetId) => {
    const isBlocked = blockedUsers.includes(targetId);
    try {
      if (isBlocked) {
        await authAxios().delete(`${API}/follow/block/${targetId}`);
        setBlockedUsers(prev => prev.filter(id => id !== targetId));
        showToast('User unblocked', '✅');
      } else {
        await authAxios().post(`${API}/follow/block/${targetId}`);
        setBlockedUsers(prev => [...prev, targetId]);
        showToast('User blocked', '🚫');
      }
    } catch (err) {
      showToast('Failed to update block status', '⚠️');
    }
  };

  const fetchChatHistory = useCallback((partnerId) => {
    if (!isAuthenticated || !partnerId) return;
    setLoadingChat(true);
    authAxios().get(`${API}/follow/chat/${partnerId}`)
      .then(res => {
        setChatHistory(res.data.chat || []);
        authAxios().put(`${API}/follow/chat/${partnerId}/read-all`).catch(() => {});
      })
      .catch(() => {})
      .finally(() => setLoadingChat(false));
  }, [isAuthenticated]);

  const sendChatMessage = async () => {
    if (!activeChatPartner || !chatMessageDraft.trim()) return;
    const text = chatMessageDraft.trim();
    setSendingChat(true);
    try {
      await authAxios().post(`${API}/follow/chat/${activeChatPartner.id}/send`, { message: text });
      setChatMessageDraft('');
      fetchChatHistory(activeChatPartner.id);
    } catch (err) {
      showToast('Failed to send message', '⚠️');
    } finally {
      setSendingChat(false);
    }
  };

  const clearChat = async () => {
    if (!activeChatPartner) return;
    if (!window.confirm(`Are you sure you want to clear chat with ${activeChatPartner.name}?`)) return;
    try {
      await authAxios().delete(`${API}/follow/chat/${activeChatPartner.id}`);
      setChatHistory([]);
      showToast('Chat cleared', '🧹');
    } catch (err) {
      showToast('Failed to clear chat', '⚠️');
    }
  };

  // Auto scroll chat to bottom when chatHistory updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Periodic polling for chat when activeChatPartner is set
  useEffect(() => {
    if (isAuthenticated && activeChatPartner) {
      fetchChatHistory(activeChatPartner.id);
      const interval = setInterval(() => {
        fetchChatHistory(activeChatPartner.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeChatPartner, fetchChatHistory]);

  useEffect(() => { window.scrollTo({ top:0, left:0, behavior:'instant' }); }, []);
  useEffect(() => { followBtnRef.current?.focus({ preventScroll:true }); }, [following, isAuthenticated]);

  useEffect(() => {
    axios.get(`${API}/store/profile`)
      .then(res => setStoreProfile({ handle: res.data.handle || DEFAULT_STORE.handle, bio: res.data.bio || '' }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) { setUserProfile(EMPTY_PROFILE); return; }
    const cached = ProfileStore.get(user);
    if (cached) setUserProfile(cached);
    authAxios().get(`${API}/user/profile`)
      .then(res => {
        const sv = { fullName:res.data.fullName||'', dob:res.data.dob||'', bio:res.data.bio||'', avatar:res.data.avatar||null };
        const merged = { fullName:sv.fullName||cached?.fullName||'', dob:sv.dob||cached?.dob||'', bio:sv.bio||cached?.bio||'', avatar:sv.avatar||cached?.avatar||null };
        setUserProfile(merged);
        ProfileStore.set(user, merged);
        if (merged.avatar && user.email) AvatarStore.set(user.email, merged.avatar);
      })
      .catch(() => { if (cached) setUserProfile(cached); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id || user?.email]);

  useEffect(() => {
    axios.get(`${API}/follow/count`).then(res => setFollowerCount(res.data.count)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      authAxios().get(`${API}/follow/status`)
        .then(res => { setFollowing(res.data.following); if (res.data.followedAt) setMemberSince(res.data.followedAt); })
        .catch(() => {});
    } else { setFollowing(false); setMemberSince(null); }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 8000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  useEffect(() => {
    if (!showFollowers || !isAuthenticated) return;
    setLoadingList(true);
    authAxios().get(`${API}/follow/followers`)
      .then(res => setFollowersList(res.data.followers || []))
      .catch(() => setFollowersList([]))
      .finally(() => setLoadingList(false));
  }, [showFollowers, isAuthenticated]);

  const formatCount = (n) => { if (n>=1_000_000) return (n/1_000_000).toFixed(1)+'M'; if (n>=1_000) return (n/1_000).toFixed(1)+'K'; return n.toString(); };
  const formatDate  = (d) => { if (!d) return ''; return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'}); };
  const formatMemberSince = (d) => { if (!d) return ''; return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}); };

  const handleFollow = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (loading) return;
    setLoading(true); setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
    try {
      const res = await authAxios().post(`${API}/follow/toggle`);
      setFollowing(res.data.following);
      setFollowerCount(res.data.count);
      if (res.data.following) { launchConfetti(); setMemberSince(res.data.followedAt || new Date().toISOString()); showToast("You're now following Harikart!", '🎉'); }
      else { setMemberSince(null); showToast('Unfollowed successfully','👋'); }
      if (!res.data.following) setNotifOn(false);
    } catch { showToast('Something went wrong','⚠️'); }
    finally  { setLoading(false); }
  };

  const handleNotif = () => {
    if (!isAuthenticated || !following) return;
    setNotifOn(prev => { const next = !prev; showToast(next?'Notifications turned on!':'Notifications turned off', next?'🔔':'🔕'); return next; });
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); showToast('Link copied!','🔗'); setTimeout(() => setCopied(false), 2000); });
  };
  const handleShare = () => { if (navigator.share) navigator.share({ title:'Harikart', url:window.location.href }); else handleCopy(); };

  const openEdit   = () => { setEditDraft({ ...userProfile }); setEditMode(true); };
  const cancelEdit = () => { setEditDraft({ ...userProfile }); setEditMode(false); };
  const saveEdit   = async () => {
    const updated = { ...editDraft };
    setUserProfile(updated); setEditMode(false); showToast('Profile updated!','✏️');
    ProfileStore.set(user, updated);
    if (user?.email) { if (updated.avatar) AvatarStore.set(user.email, updated.avatar); else AvatarStore.remove(user.email); }
    authAxios().put(`${API}/user/profile`, { fullName:updated.fullName, dob:updated.dob, bio:updated.bio, avatar:updated.avatar }).catch(() => {});
    if (showFollowers) { setLoadingList(true); authAxios().get(`${API}/follow/followers`).then(res => setFollowersList(res.data.followers||[])).catch(()=>{}).finally(()=>setLoadingList(false)); }
  };
  const handleAvatarClick = () => { if (isAuthenticated) fileInputRef.current?.click(); };
  const handleAvatarFile  = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5*1024*1024) { showToast('Image too large (max 5MB)','⚠️'); return; }
    setAvatarLoading(true);
    try { const compressed = await compressImage(file,200,0.75); setEditDraft(d => ({ ...d, avatar:compressed })); }
    catch { showToast('Image processing failed','⚠️'); }
    finally { setAvatarLoading(false); e.target.value=''; }
  };
  const handleAvatarRemove = () => setEditDraft(d => ({ ...d, avatar:null }));

  /* ══════════════════════════════════════════════════════════════
     LIKE — flying hearts + send notification to that follower
  ══════════════════════════════════════════════════════════════ */
  const toggleFollowerLike = useCallback((fId, followerName, followerEmail) => {
    if (!isAuthenticated) { navigate('/login'); return; }

    const wasLiked = !!followerLikes[fId];
    const nowLiked = !wasLiked;

    setFollowerLikes(prev => ({ ...prev, [fId]: nowLiked }));

    if (nowLiked) {
      const btnEl = likeBtnRefs.current[fId];
      launchHearts(btnEl);
      showToast(`❤️ Liked ${followerName}!`, '❤️');

      /* Send notification email to the liked follower */
      const senderName = userProfile.fullName || user?.name || 'Someone';
      const senderEmail = user?.email || '';
      if (followerEmail) {
        authAxios().post(`${API}/follow/notify/like`, {
          toEmail:   followerEmail,
          toName:    followerName,
          fromName:  senderName,
          fromEmail: senderEmail,
        }).catch(() => {}); /* silent fail — don't break UI */
      }
    } else {
      showToast(`Unliked ${followerName}`, '💔');
    }
  }, [followerLikes, isAuthenticated, navigate, user, userProfile]);

  /* ══════════════════════════════════════════════════════════════
     COMMENT — store locally + navigate to /follow with comment
  ══════════════════════════════════════════════════════════════ */
  const toggleFollowerMsg = (fId) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setFollowerMsgOpen(prev => ({ ...prev, [fId]: !prev[fId] }));
  };

  const sendFollowerComment = useCallback((fId, followerName, followerEmail) => {
    const text = (followerMsgDraft[fId] || '').trim();
    if (!text) return;

    const senderName  = userProfile.fullName || user?.name || 'Someone';
    const senderEmail = user?.email || '';
    const time        = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

    const newComment = { text, sender: senderName, time, replies: [] };
    setFollowerComments(prev => ({ ...prev, [fId]: [...(prev[fId]||[]), newComment] }));
    setFollowerMsgDraft(prev => ({ ...prev, [fId]: '' }));

    if (followerEmail) {
      setCommentSending(prev => ({ ...prev, [fId]: true }));
      authAxios().post(`${API}/follow/notify/comment`, {
        toEmail:   followerEmail,
        toName:    followerName,
        fromName:  senderName,
        fromEmail: senderEmail,
        message:   text,
      })
      .then(() => {
        showToast(`💬 Comment sent to ${followerName}!`, '💬');
      })
      .catch(() => {
        showToast('Failed to send comment notification', '⚠️');
      })
      .finally(() => {
        setCommentSending(prev => ({ ...prev, [fId]: false }));
      });
    } else {
      showToast(`💬 Comment sent to ${followerName}!`, '💬');
    }
  }, [followerMsgDraft, user, userProfile, navigate]);

  /* ══════════════════════════════════════════════════════════════
     REPLY — store locally + navigate to /follow with reply
  ══════════════════════════════════════════════════════════════ */
  const toggleReply = (fId, ci) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const key = `${fId}_${ci}`;
    setReplyOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sendReply = useCallback((fId, ci, originalSenderName) => {
    const key  = `${fId}_${ci}`;
    const text = (replyDraft[key] || '').trim();
    if (!text) return;

    const senderName = userProfile.fullName || user?.name || 'Someone';
    const time       = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

    setFollowerComments(prev => {
      const list    = [...(prev[fId] || [])];
      const comment = { ...list[ci], replies: [...(list[ci].replies || []), { text, sender: senderName, time }] };
      list[ci] = comment;
      return { ...prev, [fId]: list };
    });
    setReplyDraft(prev => ({ ...prev, [key]: '' }));
    setReplyOpen(prev => ({ ...prev, [key]: false }));

    showToast(`↩️ Replied to ${originalSenderName}!`, '↩️');
  }, [replyDraft, user, userProfile, navigate]);

  const displayName = userProfile.fullName || user?.name || '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes cardIn    { from{opacity:0;transform:translateY(32px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes avatarPop { from{opacity:0;transform:scale(.6)} to{opacity:1;transform:none} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes greetPop  { from{opacity:0;transform:scale(.85) translateY(6px)} to{opacity:1;transform:none} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(16px) scale(.9)} to{opacity:1;transform:translateX(-50%)} }
        @keyframes spinIn    { from{opacity:0;transform:rotate(-180deg) scale(0.4)} to{opacity:1;transform:rotate(0deg) scale(1)} }
        @keyframes commentSlide { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
        @keyframes ringPulse {
          0%,100% { box-shadow:0 0 0 4px rgba(124,58,237,0.25),0 8px 28px rgba(124,58,237,0.35),0 0 40px rgba(124,58,237,0.2); }
          50%     { box-shadow:0 0 0 8px rgba(124,58,237,0.15),0 8px 36px rgba(124,58,237,0.45),0 0 60px rgba(124,58,237,0.3); }
        }
        @keyframes dotPulse {
          0%,100% { box-shadow:0 0 0 2px rgba(34,197,94,0.3); }
          50%     { box-shadow:0 0 0 5px rgba(34,197,94,0.12); }
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.45); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.4s cubic-bezier(.34,1.56,.64,1) both !important; }
        #follow-page-btn:focus-visible { outline:2px solid rgba(124,58,237,0.5); outline-offset:3px; }
        .fedit:focus        { border-color:#a78bfa !important; }
        .fedit::placeholder { color:#d1d5db; }
        .frow:hover         { background:#f5f3ff; }
        .flist::-webkit-scrollbar       { width:4px; }
        .flist::-webkit-scrollbar-track { background:transparent; }
        .flist::-webkit-scrollbar-thumb { background:#ddd6fe; border-radius:4px; }

        .flw-like-btn {
          display:flex; align-items:center; gap:3px;
          padding:4px 9px; border-radius:20px;
          border:1px solid #e9d5ff; background:#fff;
          cursor:pointer; font-size:11.5px; font-weight:600;
          font-family:'Plus Jakarta Sans',sans-serif;
          color:#9ca3af; transition:border-color 0.18s, background 0.18s, color 0.18s;
          flex-shrink:0; line-height:1; position:relative; overflow:visible;
        }
        .flw-like-btn:hover { color:#ec4899; border-color:#fbcfe8; background:#fdf2f8; }
        .flw-like-btn.liked { color:#ec4899; border-color:#fbcfe8; background:#fdf2f8; }

        .flw-msg-btn {
          display:flex; align-items:center; gap:3px;
          padding:4px 9px; border-radius:20px;
          border:1px solid #e9d5ff; background:#fff;
          cursor:pointer; font-size:11.5px; font-weight:600;
          font-family:'Plus Jakarta Sans',sans-serif;
          color:#9ca3af; transition:all 0.18s; flex-shrink:0; line-height:1;
        }
        .flw-msg-btn:hover   { color:#7c3aed; border-color:#c4b5fd; background:#f5f3ff; }
        .flw-msg-btn.msg-open { color:#7c3aed; border-color:#c4b5fd; background:#f5f3ff; }

        .flw-comment-panel {
          background:#fff; border-top:1px solid #f3e8ff;
          padding:10px 14px 12px; animation:commentSlide 0.2s ease;
        }
        .flw-comment-label {
          font-size:10.5px; color:#9ca3af; font-weight:700;
          letter-spacing:0.4px; text-transform:uppercase; display:block; margin-bottom:8px;
        }
        .flw-comment-input-row { display:flex; gap:6px; align-items:center; }
        .flw-comment-input {
          flex:1; padding:7px 12px; border-radius:20px;
          border:1px solid #ddd6fe; font-size:12.5px;
          font-family:'Plus Jakarta Sans',sans-serif;
          color:#1e1b4b; outline:none; background:#faf5ff; transition:border 0.18s;
        }
        .flw-comment-input:focus { border-color:#a78bfa; }
        .flw-comment-input::placeholder { color:#c4b5fd; }
        .flw-comment-send {
          display:flex; align-items:center; justify-content:center;
          width:34px; height:34px; border-radius:50%; border:none; flex-shrink:0;
          background:linear-gradient(135deg,#7c3aed,#a855f7);
          color:#fff; cursor:pointer; transition:opacity 0.15s;
        }
        .flw-comment-send:hover   { opacity:0.85; }
        .flw-comment-send:disabled { opacity:0.4; cursor:not-allowed; }

        .flw-sent-list  { margin-top:8px; display:flex; flex-direction:column; gap:6px; }
        .flw-sent-block { animation:commentSlide 0.2s ease; }
        .flw-sent-item  {
          font-size:12px; color:#6d28d9; background:#ede9fe;
          border-radius:10px; padding:5px 10px; display:block; word-break:break-word;
        }
        .flw-sent-meta  { font-size:10.5px; color:#a78bfa; margin-top:2px; padding-left:4px; }

        .flw-reply-btn {
          display:inline-flex; align-items:center; gap:3px;
          font-size:10.5px; font-weight:600; color:#a78bfa;
          background:none; border:none; cursor:pointer; padding:2px 4px;
          font-family:'Plus Jakarta Sans',sans-serif; transition:color 0.15s;
        }
        .flw-reply-btn:hover { color:#7c3aed; }
        .flw-reply-panel { margin-top:6px; padding-left:14px; border-left:2px solid #e9d5ff; }
        .flw-reply-input-row { display:flex; gap:5px; align-items:center; margin-bottom:4px; }
        .flw-reply-input {
          flex:1; padding:5px 10px; border-radius:16px;
          border:1px solid #e9d5ff; font-size:12px;
          font-family:'Plus Jakarta Sans',sans-serif;
          color:#1e1b4b; outline:none; background:#faf5ff; transition:border 0.15s;
        }
        .flw-reply-input:focus { border-color:#c4b5fd; }
        .flw-reply-input::placeholder { color:#ddd6fe; }
        .flw-reply-send {
          display:flex; align-items:center; justify-content:center;
          width:28px; height:28px; border-radius:50%; border:none; flex-shrink:0;
          background:#f5f3ff; color:#7c3aed; cursor:pointer; transition:all 0.15s;
        }
        .flw-reply-send:hover   { background:#ede9fe; }
        .flw-reply-send:disabled { opacity:0.4; cursor:not-allowed; }
        .flw-reply-item {
          font-size:11.5px; color:#5b21b6; background:#f5f3ff;
          border-radius:8px; padding:4px 8px; margin-top:4px;
          display:block; word-break:break-word; animation:commentSlide 0.2s ease;
        }
        .flw-reply-meta { font-size:10px; color:#c4b5fd; margin-top:1px; padding-left:2px; }
      `}</style>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarFile} />

      <div style={S.page}>
        <div style={S.orb1}/><div style={S.orb2}/>

        <div style={S.card}>

          {/* ════ STORE AVATAR ════ */}
          <div style={S.avatarWrap}>
            <div style={following ? S.avatarRingGlow : S.avatarRing}>
              <img src={Logo} alt="Harikart"
                style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%', animation:'spinIn 0.9s cubic-bezier(.34,1.56,.64,1) both' }}
                onError={e => { e.currentTarget.style.display='none'; e.currentTarget.parentElement.innerHTML='<span style="font-size:40px;font-weight:800;color:#fff;letter-spacing:-1px;line-height:1">H</span>'; }}
              />
            </div>
            <div style={S.onlineDot}/>
          </div>

          {/* ════ STORE INFO ════ */}
          <h1 style={S.storeName}>
            Harikart
            <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20, background:'linear-gradient(135deg,#eff6ff,#eef2ff)', color:'#3b82f6', border:'1px solid #bfdbfe', letterSpacing:'0.3px' }}>✓ Official</span>
          </h1>
          <p style={S.handle}>{storeProfile.handle}</p>
          {storeProfile.bio ? <p style={S.bio}>{storeProfile.bio}</p> : <p style={{ ...S.bio, color:'#d1d5db', fontStyle:'italic' }}>No bio yet.</p>}

          <div style={S.badgeRow}>
            {['Electronics','Fashion','Best Deals'].map(b => <span key={b} style={S.badge}>{b}</span>)}
          </div>

          {/* ════ USER BANNER ════ */}
          {isAuthenticated && user && (
            <div style={S.userBanner}>
              <AvatarCircle avatar={userProfile.avatar} email={user.email} name={displayName||user.name} size={40}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={S.userBannerName}>{displayName||user.name}</div>
                <div style={S.userBannerEmail}>{user.email}</div>
              </div>
              {!editMode && (
                <button style={{ padding:'4px 10px', borderRadius:14, fontSize:11, fontWeight:600, border:'1px solid #c4b5fd', background:'#ede9fe', color:'#6d28d9', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:"'Plus Jakarta Sans',sans-serif", flexShrink:0 }} onClick={openEdit}>
                  <FiEdit2 size={10}/> Edit
                </button>
              )}
            </div>
          )}

          {/* ════ EDIT PANEL ════ */}
          {isAuthenticated && editMode && (
            <div style={S.editPanel}>
              <label style={S.editLabel}>Your Photo</label>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:editDraft.avatar?'transparent':'linear-gradient(135deg,#7c3aed,#ea580c)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'2px solid #ddd6fe' }}>
                  {avatarLoading ? <span style={{ fontSize:11, color:'#7c3aed' }}>...</span>
                    : editDraft.avatar ? <img src={editDraft.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    : <span style={{ fontSize:24, fontWeight:800, color:'#fff' }}>{(displayName||user?.name||'U')[0].toUpperCase()}</span>}
                </div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <button style={{ padding:'5px 10px', borderRadius:8, fontSize:11.5, fontWeight:600, border:'1px solid #c4b5fd', background:'#ede9fe', color:'#6d28d9', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }} onClick={handleAvatarClick} disabled={avatarLoading}>
                    <FiCamera size={11}/> {editDraft.avatar?'Change':'Upload'}
                  </button>
                  {editDraft.avatar && (
                    <button style={{ padding:'5px 10px', borderRadius:8, fontSize:11.5, fontWeight:600, border:'1px solid #fecaca', background:'#fef2f2', color:'#ef4444', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }} onClick={handleAvatarRemove}>
                      <FiTrash2 size={11}/> Remove
                    </button>
                  )}
                </div>
              </div>
              <label style={S.editLabel}>Full Name</label>
              <input className="fedit" style={S.editInput} value={editDraft.fullName} onChange={e => setEditDraft(d => ({ ...d, fullName:e.target.value }))} placeholder="Enter your full name"/>
              <label style={S.editLabel}>Date of Birth</label>
              <input className="fedit" style={{ ...S.editInput, colorScheme:'light' }} type="date" value={editDraft.dob} onChange={e => setEditDraft(d => ({ ...d, dob:e.target.value }))} max={new Date().toISOString().split('T')[0]}/>
              <label style={S.editLabel}>Bio</label>
              <input className="fedit" style={{ ...S.editInput, marginBottom:16 }} value={editDraft.bio} onChange={e => setEditDraft(d => ({ ...d, bio:e.target.value }))} placeholder="Tell us something about yourself…"/>
              <div style={S.editActions}>
                <button style={S.saveBtn} onClick={saveEdit} disabled={avatarLoading}><FiSave size={13}/> Save</button>
                <button style={S.cancelBtn} onClick={cancelEdit}><FiX size={13}/> Cancel</button>
              </div>
            </div>
          )}

          <div style={S.divider}/>

          {/* ════ FOLLOWER COUNT ════ */}
          <div style={S.statsRow}>
            <FiUsers style={S.statIcon}/>
            <span style={S.statNumber}>{formatCount(followerCount)}</span>
            <span style={S.statLabel}>{followerCount===1?'Follower':'Followers'}</span>
          </div>

          {isAuthenticated && following && memberSince && (
            <div style={S.memberSince}><span>🗓️</span><span>Following since {formatMemberSince(memberSince)}</span></div>
          )}

          {isAuthenticated && !showFollowers && (
            <button style={S.followersToggle} onClick={() => { setShowFollowers(true); setActiveTab('followers'); }}>
              <FiChevronDown size={13}/> Open Followers & Inbox Dashboard
            </button>
          )}

          {isAuthenticated && showFollowers && (
            <button style={{ ...S.followersToggle, marginBottom: 8 }} onClick={() => setShowFollowers(false)}>
              <FiChevronUp size={13}/> Close Dashboard
            </button>
          )}

          {isAuthenticated && showFollowers && (
            <div style={{ display:'flex', gap:10, width:'100%', marginTop:14, marginBottom:10 }}>
              <button
                onClick={() => setActiveTab('followers')}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: activeTab === 'followers' ? '2.5px solid #7c3aed' : '1px solid #e9d5ff',
                  background: activeTab === 'followers' ? '#f5f3ff' : '#fff',
                  color: activeTab === 'followers' ? '#7c3aed' : '#9ca3af',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  transition: 'all 0.2s'
                }}
              >
                <FiUsers size={15}/>
                Followers List
              </button>

              <button
                onClick={() => { setActiveTab('inbox'); fetchNotifications(); }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: activeTab === 'inbox' ? '2.5px solid #7c3aed' : '1px solid #e9d5ff',
                  background: activeTab === 'inbox' ? '#f5f3ff' : '#fff',
                  color: activeTab === 'inbox' ? '#7c3aed' : '#9ca3af',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                <FiBell size={15}/>
                Inbox & Chats
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 0 2px #fff, 0 2px 6px rgba(239,68,68,0.4)',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════
              FOLLOWERS LIST TAB
          ════════════════════════════════════════════ */}
          {isAuthenticated && showFollowers && activeTab === 'followers' && !activeChatPartner && (
            <div className="flist" style={S.followersList}>
              <div style={S.followersHeader}>
                <FiUser size={11} style={{ marginRight:5, verticalAlign:'middle' }}/>
                All Followers ({followerCount})
              </div>

              {loadingList && <div style={S.noFollowers}>Loading...</div>}
              {!loadingList && followersList.length === 0 && <div style={S.noFollowers}>No followers yet 👀</div>}

              {!loadingList && followersList.map((f, i) => {
                const fId      = f._id || f.id || i;
                const name     = f.fullName || f.name || 'Unknown';
                const liked    = !!followerLikes[fId];
                const msgOpen  = !!followerMsgOpen[fId];
                const comments = followerComments[fId] || [];
                const draft    = followerMsgDraft[fId] || '';
                const isSending = !!commentSending[fId];
                const isCurrentUser = user && f.email && user.email && f.email.toLowerCase() === user.email.toLowerCase();

                return (
                  <div key={fId}>
                    {/* ── Follower row ── */}
                    <div className="frow" style={S.followerItem}>
                      <AvatarCircle avatar={f.avatar} email={f.email||''} name={name} size={36}/>

                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={S.followerName}>
                          {name}
                          {isCurrentUser && (
                            <span style={{ color: '#7c3aed', fontWeight: 600, fontSize: '11px', marginLeft: '6px', background: '#ede9fe', padding: '2px 6px', borderRadius: '8px' }}>
                              (You)
                            </span>
                          )}
                        </div>
                        <div style={S.followerEmail}>{f.email||''}</div>
                      </div>

                      <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                        {/* ❤️ LIKE BUTTON — navigate to /follow on like */}
                        <button
                          ref={el => { if (el) likeBtnRefs.current[fId] = el; }}
                          className={`flw-like-btn${liked ? ' liked' : ''}`}
                          onClick={() => toggleFollowerLike(fId, name, f.email)}
                          title={liked ? 'Unlike' : 'Like'}
                        >
                          <FiHeart
                            size={13}
                            className={liked ? 'heart-pop' : ''}
                            style={{ fill:liked?'#ec4899':'none', color:liked?'#ec4899':'currentColor', transition:'fill 0.18s,color 0.18s' }}
                          />
                          <span style={{ minWidth:8, textAlign:'center' }}>{liked ? 1 : 0}</span>
                        </button>

                        {/* 💬 CHAT BUTTON */}
                        <button
                          className="flw-msg-btn"
                          onClick={() => {
                            setActiveChatPartner({ id: f._id || f.id || fId, name: name, email: f.email });
                            fetchChatHistory(f._id || f.id || fId);
                          }}
                          title="Chat"
                        >
                          <FiMessageCircle size={13}/>
                          <span>Chat</span>
                        </button>

                        <div style={S.followerDate}>{formatDate(f.followedAt)}</div>
                      </div>
                    </div>

                    {/* ── COMMENT PANEL ── */}
                    {msgOpen && (
                      <div className="flw-comment-panel">
                        <span className="flw-comment-label">Comment to {name}</span>

                        <div className="flw-comment-input-row">
                          <input
                            className="flw-comment-input"
                            placeholder={`Say something to ${name}…`}
                            value={draft}
                            onChange={e => setFollowerMsgDraft(prev => ({ ...prev, [fId]: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') sendFollowerComment(fId, name, f.email); }}
                          />
                          <button
                            className="flw-comment-send"
                            onClick={() => sendFollowerComment(fId, name, f.email)}
                            disabled={!draft.trim() || isSending}
                            title="Send"
                          >
                            <FiSend size={14}/>
                          </button>
                        </div>

                        {/* Sent comments + replies */}
                        {comments.length > 0 && (
                          <div className="flw-sent-list">
                            {comments.map((c, ci) => {
                              const rKey    = `${fId}_${ci}`;
                              const rOpen   = !!replyOpen[rKey];
                              const rDraft  = replyDraft[rKey] || '';
                              const rSending = !!replySending[rKey];
                              return (
                                <div key={ci} className="flw-sent-block">
                                  <span className="flw-sent-item">💬 {c.text}</span>
                                  <div className="flw-sent-meta">{c.sender} · {c.time}</div>

                                  {/* Reply button */}
                                  <button className="flw-reply-btn" onClick={() => toggleReply(fId, ci)}>
                                    <FiCornerDownRight size={10}/> {rOpen ? 'Cancel reply' : 'Reply'}
                                  </button>

                                  {/* Reply input */}
                                  {rOpen && (
                                    <div className="flw-reply-panel">
                                      <div className="flw-reply-input-row">
                                        <input
                                          className="flw-reply-input"
                                          placeholder={`Reply to ${c.sender}…`}
                                          value={rDraft}
                                          onChange={e => setReplyDraft(prev => ({ ...prev, [rKey]: e.target.value }))}
                                          onKeyDown={e => { if (e.key === 'Enter') sendReply(fId, ci, c.sender); }}
                                          autoFocus
                                        />
                                        <button
                                          className="flw-reply-send"
                                          onClick={() => sendReply(fId, ci, c.sender)}
                                          disabled={!rDraft.trim() || rSending}
                                          title="Send reply"
                                        >
                                          <FiSend size={12}/>
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Existing replies */}
                                  {(c.replies || []).map((r, ri) => (
                                    <div key={ri} className="flw-reply-panel" style={{ marginTop:4 }}>
                                      <span className="flw-reply-item">↩️ {r.text}</span>
                                      <div className="flw-reply-meta">{r.sender} · {r.time}</div>
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ════════════════════════════════════════════
              INBOX / CHATS TAB
          ════════════════════════════════════════════ */}
          {isAuthenticated && showFollowers && activeTab === 'inbox' && !activeChatPartner && (
            <div className="flist" style={S.followersList}>
              <div style={{ ...S.followersHeader, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span>
                  <FiBell size={11} style={{ marginRight:5, verticalAlign:'middle' }}/>
                  Inbox & Chats ({notifications.length})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#7c3aed',
                      fontSize: 10.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      textTransform: 'uppercase',
                      fontFamily: "'Plus Jakarta Sans',sans-serif"
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {loadingNotifs && notifications.length === 0 && <div style={S.noFollowers}>Loading messages...</div>}
              {!loadingNotifs && notifications.length === 0 && <div style={S.noFollowers}>No messages or notifications yet 💤</div>}

              {notifications.map((n) => {
                const isUnread = !n.is_read;
                return (
                  <div
                    key={n.id}
                    onClick={() => { if (isUnread) markAsRead(n.id); }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '12px 14px',
                      borderBottom: '1px solid #f3e8ff',
                      background: isUnread ? '#faf5ff' : '#fff',
                      borderLeft: isUnread ? '3px solid #7c3aed' : 'none',
                      transition: 'background 0.15s',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <AvatarCircle avatar={null} email={n.from_email} name={n.from_name} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>{n.from_name}</span>
                          <span style={{ fontSize: 10, color: '#a78bfa' }}>{formatDate(n.created_at)}</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6b7280', marginTop: 1 }}>{n.from_email}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: 6, marginLeft: 42 }}>
                      {n.type === 'like' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#db2777', fontWeight: 600 }}>
                          <span>liked your follow</span>
                          <FiHeart size={12} style={{ fill: '#db2777' }} />
                        </div>
                      )}

                      {n.type === 'comment' && (
                        <div>
                          <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3 }}>Commented</div>
                          <div style={{
                            fontSize: 12.5,
                            color: '#4c1d95',
                            background: '#f5f3ff',
                            borderLeft: '3px solid #7c3aed',
                            padding: '6px 10px',
                            borderRadius: 6,
                            marginTop: 3,
                            wordBreak: 'break-word',
                            fontStyle: 'italic'
                          }}>
                            "{n.message}"
                          </div>
                        </div>
                      )}

                      {n.type === 'reply' && (
                        <div>
                          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3 }}>Replied</div>
                          <div style={{
                            fontSize: 12.5,
                            color: '#065f46',
                            background: '#f0fdf4',
                            borderLeft: '3px solid #10b981',
                            padding: '6px 10px',
                            borderRadius: 6,
                            marginTop: 3,
                            wordBreak: 'break-word',
                            fontStyle: 'italic'
                          }}>
                            "{n.message}"
                          </div>
                        </div>
                      )}

                      {/* Chat Button */}
                      <div style={{ display: 'flex', gap: 6, marginTop: 10, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setActiveChatPartner({ id: n.from_user_id, name: n.from_name, email: n.from_email });
                            fetchChatHistory(n.from_user_id);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 14,
                            border: '1px solid #7c3aed',
                            background: '#f5f3ff',
                            color: '#7c3aed',
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontFamily: "'Plus Jakarta Sans',sans-serif"
                          }}
                        >
                          <FiMessageCircle size={12}/> Open Chat & Reply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════════════════════════════════════════════
              LINE-BY-LINE PEER CHAT SCREEN
          ════════════════════════════════════════════ */}
          {isAuthenticated && showFollowers && activeChatPartner && (
            <div className="flist" style={{ ...S.followersList, padding: 0 }}>
              <div style={{ display:'flex', flexDirection:'column', height:'420px', background:'#fff' }}>
                {/* Chat Header */}
                <div style={{
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'space-between',
                  padding:'10px 14px',
                  borderBottom:'1px solid #f3e8ff',
                  background:'#faf5ff',
                  position:'sticky',
                  top:0,
                  zIndex:5
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <button
                      onClick={() => setActiveChatPartner(null)}
                      style={{
                        background:'none',
                        border:'none',
                        color:'#7c3aed',
                        fontSize:13,
                        fontWeight:800,
                        cursor:'pointer',
                        padding:'4px 8px',
                        fontFamily:"'Plus Jakarta Sans',sans-serif",
                        display:'flex',
                        alignItems:'center',
                        gap:2
                      }}
                    >
                      ← Back
                    </button>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#1e1b4b' }}>
                        {activeChatPartner.name}
                      </div>
                      <div style={{ fontSize:10, color:'#a78bfa' }}>
                        {activeChatPartner.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => toggleBlockUser(activeChatPartner.id)}
                      style={{
                        background:'none',
                        border:'none',
                        color: blockedUsers.includes(activeChatPartner.id) ? '#9ca3af' : '#ea580c',
                        fontSize:11,
                        fontWeight:700,
                        cursor:'pointer',
                        padding:'4px 8px',
                        display:'flex',
                        alignItems:'center',
                        gap:4,
                        fontFamily:"'Plus Jakarta Sans',sans-serif"
                      }}
                    >
                      <FiUserX size={12}/> {blockedUsers.includes(activeChatPartner.id) ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={clearChat}
                      style={{
                        background:'none',
                        border:'none',
                        color:'#ef4444',
                        fontSize:11,
                        fontWeight:700,
                        cursor:'pointer',
                        padding:'4px 8px',
                        display:'flex',
                        alignItems:'center',
                        gap:4,
                        fontFamily:"'Plus Jakarta Sans',sans-serif"
                      }}
                    >
                      <FiTrash2 size={12}/> Clear Chat
                    </button>
                  </div>
                </div>

                {/* Chat History Panel */}
                <div
                  ref={chatEndRef}
                  style={{
                    flex:1,
                    overflowY:'auto',
                    padding:'12px 14px',
                    display:'flex',
                    flexDirection:'column',
                    gap:8,
                    background:'#fbfbfe'
                  }}
                >
                  {loadingChat && <div style={{ textAlign:'center', color:'#9ca3af', fontSize:12, marginTop:20 }}>Loading messages...</div>}
                  {!loadingChat && chatHistory.length === 0 && (
                    <div style={{ textAlign:'center', color:'#9ca3af', fontSize:12, marginTop:40, fontStyle:'italic' }}>
                      No messages yet. Send a message to start! 👋
                    </div>
                  )}

                  {!loadingChat && chatHistory.map((msg) => {
                    const isMe = msg.from_user_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display:'flex',
                          justifyContent: isMe ? 'flex-end' : 'flex-start',
                          width:'100%'
                        }}
                      >
                        <div style={{
                          maxWidth:'75%',
                          background: isMe ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#f3e8ff',
                          color: isMe ? '#fff' : '#1e1b4b',
                          borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          padding:'8px 12px',
                          boxShadow:'0 1px 2px rgba(0,0,0,0.05)',
                          fontSize:12.5,
                          wordBreak:'break-word',
                          display:'flex',
                          flexDirection:'column',
                          gap:2
                        }}>
                          {msg.type === 'like' ? (
                            <div style={{ display:'flex', alignItems:'center', gap:4, fontWeight:600 }}>
                              liked your follow <FiHeart size={11} style={{ fill: isMe ? '#fff' : '#db2777', color: isMe ? '#fff' : '#db2777' }} />
                            </div>
                          ) : (
                            <div>{msg.message}</div>
                          )}
                          <div style={{
                            fontSize:9,
                            color: isMe ? 'rgba(255,255,255,0.7)' : '#a78bfa',
                            textAlign:'right',
                            marginTop:2,
                            display:'flex',
                            justifyContent:'flex-end',
                            alignItems:'center',
                            gap:4
                          }}>
                            {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
                            {isMe && (
                              <span style={{ color: msg.is_read ? '#4ade80' : 'rgba(255,255,255,0.6)', display: 'flex', letterSpacing: '-4px', marginLeft: 2 }}>
                                <FiCheck size={11} /><FiCheck size={11} style={{ marginLeft: -6 }} />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Footer Input */}
                <div style={{
                  padding:'10px 14px',
                  borderTop:'1px solid #f3e8ff',
                  background:'#faf5ff',
                  display:'flex',
                  gap:6,
                  alignItems:'center'
                }}>
                  {blockedUsers.includes(activeChatPartner.id) ? (
                    <div style={{ flex: 1, textAlign: 'center', color: '#ea580c', fontSize: 12, fontWeight: 600 }}>
                      You have blocked this contact. Unblock to send messages.
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={chatMessageDraft}
                        onChange={e => setChatMessageDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') sendChatMessage(); }}
                        style={{
                          flex:1,
                          padding:'8px 14px',
                          borderRadius:20,
                          border:'1px solid #ddd6fe',
                          fontSize:12.5,
                          fontFamily:"'Plus Jakarta Sans',sans-serif",
                          outline:'none',
                          background:'#fff'
                        }}
                      />
                      <button
                        onClick={sendChatMessage}
                        disabled={!chatMessageDraft.trim() || sendingChat}
                        style={{
                          background:'linear-gradient(135deg,#7c3aed,#a855f7)',
                          color:'#fff',
                          border:'none',
                          borderRadius:'50%',
                          width:32,
                          height:32,
                          display:'flex',
                          alignItems:'center',
                          justifyContent: 'center',
                          cursor:'pointer',
                          opacity: !chatMessageDraft.trim() ? 0.5 : 1
                        }}
                      >
                        <FiSend size={13}/>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════ GREEN GREETING ════ */}
          {isAuthenticated && following && (
            <p style={S.greeting}>🎉 Hey <strong style={{ marginLeft:3 }}>{displayName||user?.name}</strong>, you're following us!</p>
          )}

          {/* ════ FOLLOW BUTTON ════ */}
          <div style={S.btnWrap}>
            <FollowButton btnRef={followBtnRef} following={following} loading={loading} animating={animating} onClick={handleFollow} isAuthenticated={isAuthenticated}/>
          </div>

          {/* ════ NOTIFICATION TOGGLE ════ */}
          {isAuthenticated && following && (
            <button style={{ ...S.notifBtn, ...(notifOn?S.notifBtnOn:{}) }} onClick={handleNotif}>
              {notifOn ? <FiBellOff size={15}/> : <FiBell size={15}/>}
              {notifOn ? 'Notifications On · Turn Off' : 'Turn On Notifications'}
            </button>
          )}

          {/* ════ SHARE ROW ════ */}
          <div style={S.shareRow}>
            <button style={S.shareBtn} onClick={handleShare}
              onMouseEnter={e => { e.currentTarget.style.background='#f9fafb'; e.currentTarget.style.borderColor='#c4b5fd'; e.currentTarget.style.color='#6d28d9'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#6b7280'; }}>
              <FiShare2 size={13}/> Share
            </button>
            <button style={S.shareBtn} onClick={handleCopy}
              onMouseEnter={e => { e.currentTarget.style.background='#f9fafb'; e.currentTarget.style.borderColor='#c4b5fd'; e.currentTarget.style.color='#6d28d9'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#6b7280'; }}>
              {copied ? <FiCheck size={13}/> : <FiCopy size={13}/>}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {!isAuthenticated && (
            <p style={S.loginNote}>You need to <span style={S.loginLink} onClick={() => navigate('/login')}>login</span> to follow us.</p>
          )}
          {following && <p style={S.unfollowHint}>Click again to unfollow</p>}

        </div>
      </div>

      {toast && <Toast message={toast.message} icon={toast.icon}/>}
    </>
  );
}