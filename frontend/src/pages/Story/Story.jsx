// Story.jsx — Harikart Real-Time Story Component (with working Upload)
import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Story.css";

// ── Seed Data ────────────────────────────────────────────
const SEED_STORIES = [
  {
    id: 1,
    username: "Hari",
    profile: "https://randomuser.me/api/portraits/men/11.jpg",
    storyImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
    time: "Just now",
    viewed: false,
    likes: 120,
    comments: 22,
    liked: false,
    isNew: false,
    caption: "Morning serenity 🌄",
  },
  {
    id: 2,
    username: "Karthik",
    profile: "https://randomuser.me/api/portraits/men/12.jpg",
    storyImage: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80",
    time: "2 min ago",
    viewed: true,
    likes: 98,
    comments: 18,
    liked: false,
    isNew: false,
    caption: "Golden hour vibes ✨",
  },
  {
    id: 3,
    username: "Priya",
    profile: "https://randomuser.me/api/portraits/women/44.jpg",
    storyImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
    time: "5 min ago",
    viewed: false,
    likes: 300,
    comments: 55,
    liked: true,
    isNew: false,
    caption: "City lights & dreams 🌆",
  },
  {
    id: 4,
    username: "Arjun",
    profile: "https://randomuser.me/api/portraits/men/32.jpg",
    storyImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    time: "10 min ago",
    viewed: true,
    likes: 76,
    comments: 11,
    liked: false,
    isNew: false,
    caption: "Adventure awaits 🏔️",
  },
  {
    id: 5,
    username: "Meera",
    profile: "https://randomuser.me/api/portraits/women/21.jpg",
    storyImage: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&q=80",
    time: "15 min ago",
    viewed: false,
    likes: 210,
    comments: 33,
    liked: false,
    isNew: false,
    caption: "Stargazing night 🌌",
  },
];

const STORY_DURATION = 5000;

// ── Upload Modal Component ────────────────────────────────
const UploadModal = ({ onClose, onPublish }) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime"];
  const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

  const validateAndPreview = (file) => {
    setError("");
    if (!ACCEPTED.includes(file.type)) {
      setError("Only JPG, PNG, WebP, GIF, or MP4 files are supported.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 50 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl({ url: e.target.result, type: file.type, file });
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndPreview(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndPreview(file);
  };

  const handlePublish = () => {
    if (!previewUrl) return;
    setUploading(true);
    // Simulate upload delay (replace with real API call if needed)
    setTimeout(() => {
      setUploading(false);
      onPublish({
        id: Date.now(),
        username: "You",
        profile: "https://randomuser.me/api/portraits/men/75.jpg",
        storyImage: previewUrl.url,
        time: "Just now",
        viewed: false,
        likes: 0,
        comments: 0,
        liked: false,
        isNew: true,
        caption: caption.trim() || "My story",
        isVideo: previewUrl.type.startsWith("video/"),
      });
    }, 1200);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setCaption("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="sk-modal-backdrop" onClick={onClose}>
      <div
        className="sk-upload-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Upload your story"
      >
        {/* Header */}
        <div className="sk-upload-header">
          <h2 className="sk-upload-title">Upload Your Story</h2>
          <button className="sk-close-btn" onClick={onClose} aria-label="Close upload">✕</button>
        </div>

        {/* Step 1: Drop zone */}
        {!previewUrl && (
          <div
            className={`sk-dropzone ${dragOver ? "sk-dropzone--active" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            aria-label="Click or drag to upload"
          >
            <div className="sk-dropzone-icon">📂</div>
            <p className="sk-dropzone-primary">Drag & drop your photo or video here</p>
            <p className="sk-dropzone-secondary">or click to browse · JPG, PNG, WebP, GIF, MP4 · max 50 MB</p>
            <button
              className="sk-upload-choose-btn"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              type="button"
            >
              Choose File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
              className="sk-file-input"
              onChange={handleFileChange}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Error */}
        {error && <p className="sk-upload-error">⚠️ {error}</p>}

        {/* Step 2: Preview + caption */}
        {previewUrl && (
          <div className="sk-upload-preview-wrap">
            <div className="sk-upload-preview-container">
              {previewUrl.type.startsWith("video/") ? (
                <video
                  src={previewUrl.url}
                  className="sk-upload-preview"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img src={previewUrl.url} alt="Preview" className="sk-upload-preview" />
              )}
              <button
                className="sk-preview-remove"
                onClick={handleRemove}
                aria-label="Remove selected file"
              >✕</button>
            </div>

            <div className="sk-upload-form">
              <label className="sk-upload-label" htmlFor="sk-caption-input">
                Caption
              </label>
              <textarea
                id="sk-caption-input"
                className="sk-caption-input"
                placeholder="Write a caption… (optional)"
                maxLength={150}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
              />
              <p className="sk-char-count">{caption.length}/150</p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="sk-upload-footer">
          <button className="sk-upload-cancel-btn" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button
            className={`sk-upload-publish-btn ${uploading ? "sk-upload-publish-btn--loading" : ""}`}
            onClick={handlePublish}
            disabled={!previewUrl || uploading}
          >
            {uploading ? (
              <>
                <span className="sk-spinner" /> Uploading…
              </>
            ) : (
              "🚀 Share Story"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────
const Story = () => {
  const [stories, setStories] = useState(SEED_STORIES);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [notification, setNotification] = useState(null);
  const [liveCount, setLiveCount] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false); // ← NEW

  const progressRef = useRef(null);
  const progressStart = useRef(null);
  const animFrameRef = useRef(null);
  const commentInputRef = useRef(null);
  const stripRef = useRef(null);

  // ── Real-time: new story every 15s ──────────────────────
  useEffect(() => {
    const names = ["Sneha", "Rahul", "Divya", "Vikram", "Nisha", "Arun", "Kavya", "Dev"];
    const captions = [
      "Living the moment 🔥", "Good times only ✌️", "Explore more 🌏",
      "Feeling blessed 🙏", "New day new vibes ☀️", "Chasing sunsets 🌅",
    ];
    const interval = setInterval(() => {
      const rnd = Math.floor(Math.random() * 1000);
      const name = names[rnd % names.length];
      const newStory = {
        id: Date.now(),
        username: name,
        profile: `https://randomuser.me/api/portraits/${rnd % 2 === 0 ? "women" : "men"}/${(rnd % 70) + 1}.jpg`,
        storyImage: `https://picsum.photos/600/900?random=${rnd}`,
        time: "Just now",
        viewed: false,
        likes: Math.floor(Math.random() * 400) + 10,
        comments: Math.floor(Math.random() * 80) + 1,
        liked: false,
        isNew: true,
        caption: captions[rnd % captions.length],
      };
      setStories((prev) => [newStory, ...prev.slice(0, 19)]);
      setLiveCount((c) => c + 1);
      showNotif(`📸 ${name} just posted a story!`);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // ── Handle published story from upload modal ─────────────
  const handlePublish = (newStory) => {
    setStories((prev) => [newStory, ...prev.slice(0, 19)]);
    setLiveCount((c) => c + 1);
    setUploadOpen(false);
    showNotif("🎉 Your story is live!");
    // Auto-scroll strip to show new story
    setTimeout(() => {
      stripRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }, 200);
  };

  const openStory = (idx) => {
    setViewerIndex(idx);
    setViewerOpen(true);
    setProgress(0);
    setPaused(false);
    setShowComment(false);
    setCommentText("");
    markViewed(idx);
  };

  const markViewed = (idx) => {
    setStories((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, viewed: true, isNew: false } : s))
    );
  };

  const startProgress = useCallback(() => {
    progressStart.current = null;
    const animate = (ts) => {
      if (!progressStart.current) progressStart.current = ts;
      const elapsed = ts - progressStart.current;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        goNext();
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, [viewerIndex, stories.length]);

  useEffect(() => {
    if (!viewerOpen) return;
    cancelAnimationFrame(animFrameRef.current);
    if (!paused) startProgress();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [viewerOpen, viewerIndex, paused]);

  const goNext = () => {
    if (viewerIndex < stories.length - 1) {
      const next = viewerIndex + 1;
      setViewerIndex(next);
      setProgress(0);
      markViewed(next);
      setShowComment(false);
    } else {
      closeViewer();
    }
  };

  const goPrev = () => {
    if (viewerIndex > 0) {
      const prev = viewerIndex - 1;
      setViewerIndex(prev);
      setProgress(0);
      setShowComment(false);
    }
  };

  const closeViewer = () => {
    cancelAnimationFrame(animFrameRef.current);
    setViewerOpen(false);
    setProgress(0);
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    setStories((prev) =>
      prev.map((s, i) =>
        i === viewerIndex
          ? { ...s, liked: !s.liked, likes: s.liked ? s.likes - 1 : s.likes + 1 }
          : s
      )
    );
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setStories((prev) =>
      prev.map((s, i) =>
        i === viewerIndex ? { ...s, comments: s.comments + 1 } : s
      )
    );
    setCommentText("");
    setShowComment(false);
    showNotif("💬 Comment sent!");
  };

  const openComment = (e) => {
    e.stopPropagation();
    setPaused(true);
    setShowComment(true);
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };

  const scrollStrip = (dir) => {
    if (stripRef.current) {
      stripRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
    }
  };

  const current = stories[viewerIndex];

  return (
    <div className="sk-page">

      {/* ── Live Notification ── */}
      {notification && (
        <div className="sk-notif">
          <span className="sk-notif-dot" />
          {notification}
        </div>
      )}

      {/* ── Header ── */}
      <header className="sk-header">
        <div className="sk-header-left">
          <span className="sk-logo-badge">H</span>
          <h1 className="sk-logo-text">Harikart <span>Stories</span></h1>
        </div>
        <div className="sk-header-right">
          {liveCount > 0 && (
            <span className="sk-live-badge">
              <span className="sk-live-dot" /> {liveCount} Live
            </span>
          )}
          {/* Upload button now opens the modal */}
          <button className="sk-upload-btn" onClick={() => setUploadOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7-7 7 7"/>
            </svg>
            Upload
          </button>
        </div>
      </header>

      {/* ── Story Strip ── */}
      <div className="sk-strip-wrap">
        <button className="sk-arrow sk-arrow--left" onClick={() => scrollStrip(-1)}>‹</button>
        <div className="sk-strip" ref={stripRef}>
          {stories.map((story, idx) => (
            <div
              key={story.id}
              className={`sk-card ${story.viewed ? "sk-card--viewed" : ""} ${story.isNew ? "sk-card--new" : ""}`}
              onClick={() => openStory(idx)}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {story.isNew && <span className="sk-new-badge">NEW</span>}
              <div className={`sk-avatar-ring ${story.viewed ? "sk-avatar-ring--viewed" : ""}`}>
                <img src={story.profile} alt={story.username} className="sk-avatar" />
              </div>
              <div className="sk-card-preview">
                {story.isVideo ? (
                  <video src={story.storyImage} className="sk-card-img" muted playsInline />
                ) : (
                  <img src={story.storyImage} alt="story" className="sk-card-img" />
                )}
                <div className="sk-card-overlay">
                  <span className="sk-card-caption">{story.caption}</span>
                </div>
              </div>
              <p className="sk-card-name">{story.username}</p>
              <p className="sk-card-time">{story.time}</p>
              <div className="sk-card-stats">
                <span>❤️ {story.likes}</span>
                <span>💬 {story.comments}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="sk-arrow sk-arrow--right" onClick={() => scrollStrip(1)}>›</button>
      </div>

      {/* ── Story Viewer Modal ── */}
      {viewerOpen && current && (
        <div className="sk-modal-backdrop" onClick={closeViewer}>
          <div className="sk-modal" onClick={(e) => e.stopPropagation()}>

            {/* Progress bars */}
            <div className="sk-progress-row">
              {stories.map((_, i) => (
                <div key={i} className="sk-prog-track">
                  <div
                    className="sk-prog-fill"
                    style={{
                      width:
                        i < viewerIndex ? "100%"
                        : i === viewerIndex ? `${progress}%`
                        : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Top bar */}
            <div className="sk-modal-top">
              <img src={current.profile} alt="" className="sk-modal-avatar" />
              <div className="sk-modal-userinfo">
                <span className="sk-modal-username">{current.username}</span>
                <span className="sk-modal-time">{current.time}</span>
              </div>
              <div className="sk-modal-topbtns">
                <button
                  className="sk-pause-btn"
                  onClick={(e) => { e.stopPropagation(); setPaused((p) => !p); }}
                  title={paused ? "Resume" : "Pause"}
                >
                  {paused ? "▶" : "⏸"}
                </button>
                <button className="sk-close-btn" onClick={closeViewer}>✕</button>
              </div>
            </div>

            {/* Story image / video */}
            <div className="sk-modal-img-wrap">
              {current.isVideo ? (
                <video
                  src={current.storyImage}
                  className="sk-modal-img"
                  key={current.id}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={current.storyImage}
                  alt="story"
                  className="sk-modal-img"
                  key={current.id}
                />
              )}
              <div className="sk-modal-caption">{current.caption}</div>
              <div className="sk-nav-left" onClick={goPrev} />
              <div className="sk-nav-right" onClick={goNext} />
            </div>

            {/* Actions */}
            <div className="sk-modal-actions">
              <button
                className={`sk-action-btn sk-like-btn ${current.liked ? "sk-like-btn--active" : ""}`}
                onClick={toggleLike}
              >
                {current.liked ? "❤️" : "🤍"} {current.likes}
              </button>
              <button className="sk-action-btn sk-comment-btn" onClick={openComment}>
                💬 {current.comments}
              </button>
              <button
                className="sk-action-btn sk-share-btn"
                onClick={(e) => { e.stopPropagation(); showNotif("🔗 Link copied!"); }}
              >
                📤 Share
              </button>
            </div>

            {/* Comment box */}
            {showComment && (
              <form
                className="sk-comment-form"
                onSubmit={submitComment}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={commentInputRef}
                  className="sk-comment-input"
                  placeholder="Write a comment…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="sk-comment-send">Send</button>
                <button
                  type="button"
                  className="sk-comment-cancel"
                  onClick={() => { setShowComment(false); setPaused(false); }}
                >✕</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Upload Modal ── */}
      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onPublish={handlePublish}
        />
      )}

      {/* ── Footer ── */}
      <footer className="sk-footer">
        © 2026 Harikart Story Platform &nbsp;•&nbsp; Real-Time Updates Enabled
      </footer>
    </div>
  );
};

export default Story;