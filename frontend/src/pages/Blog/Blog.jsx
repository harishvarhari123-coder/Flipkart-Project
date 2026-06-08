import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Warm ivory / parchment base */
  --bg:       #faf7f2;
  --bg2:      #f5f0e8;
  --bg3:      #eee8dc;
  --bg4:      #e8e0d0;
  --surface:  #ffffff;
  --surface2: #f9f6f0;

  /* Borders */
  --border:   rgba(139,110,78,0.13);
  --border2:  rgba(139,110,78,0.24);
  --border3:  rgba(185,100,60,0.3);

  /* Accent palette */
  --terra:    #b9643c;   /* terracotta – primary */
  --terra2:   #d4845a;   /* light terracotta */
  --terra3:   #8c3f20;   /* deep terracotta */
  --sage:     #5a7a5e;   /* sage green */
  --sage2:    #7a9e7e;   /* light sage */
  --amber:    #c48a1e;   /* warm amber */
  --amber2:   #f0b54a;   /* light amber */
  --plum:     #7a4f6d;   /* dusty plum */
  --sky:      #3d7a9e;   /* muted sky blue */
  --danger:   #c0392b;

  /* Text */
  --text:     #2c2015;
  --text2:    #6b5540;
  --text3:    #a08060;

  /* Fonts */
  --serif:    'Playfair Display', Georgia, serif;
  --sans:     'DM Sans', system-ui, sans-serif;
  --mono:     'DM Mono', monospace;

  --r:        6px;
  --r2:       12px;
  --r3:       18px;
}

html { scroll-behavior: smooth; }
body, #root { background: var(--bg); min-height: 100vh; }

.blog-root {
  font-family: var(--sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  position: relative;
}

.blog-root::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 15% 5%, rgba(185,100,60,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 85% 85%, rgba(90,122,94,0.05) 0%, transparent 55%),
    radial-gradient(ellipse 40% 40% at 55% 45%, rgba(196,138,30,0.03) 0%, transparent 50%);
  pointer-events: none; z-index: 0;
}

/* HEADER */
.header {
  position: sticky; top: 0; z-index: 200;
  background: rgba(250,247,242,0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border2);
  padding: 0 2rem; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
}
.header-left { display: flex; align-items: center; gap: 14px; }
.header-logo {
  font-family: var(--serif); font-size: 1.55rem; font-style: italic; font-weight: 600;
  color: var(--terra3); letter-spacing: -0.02em;
}
.header-logo span { color: var(--terra2); }
.header-badge {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--sage); background: rgba(90,122,94,0.1);
  border: 1px solid rgba(90,122,94,0.25); padding: 3px 9px; border-radius: 20px;
}
.header-right { display: flex; align-items: center; gap: 20px; }
.header-stat {
  font-size: 0.73rem; font-weight: 500; color: var(--text3);
  display: flex; align-items: center; gap: 6px;
}
.header-stat-num { font-family: var(--mono); color: var(--terra); font-size: 0.85rem; font-weight: 500; }

/* ALERT */
.alert {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 2rem; font-size: 0.83rem; font-weight: 500;
  animation: alertIn 0.25s ease; position: relative; z-index: 10;
}
@keyframes alertIn { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none} }
.alert.error   { background: rgba(192,57,43,0.07);  border-bottom: 1px solid rgba(192,57,43,0.2);  color: #922b21; }
.alert.success { background: rgba(90,122,94,0.08);  border-bottom: 1px solid rgba(90,122,94,0.22); color: var(--sage); }

/* LAYOUT */
.layout {
  position: relative; z-index: 1;
  max-width: 1400px; margin: 0 auto;
  padding: 2rem 2rem 5rem;
  display: grid; grid-template-columns: 360px 1fr;
  gap: 2.5rem; align-items: start;
}
.sidebar { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 1.25rem; }

/* PANEL */
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r2);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(139,110,78,0.06);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.panel:hover { border-color: var(--border2); box-shadow: 0 4px 20px rgba(139,110,78,0.1); }

.panel-head {
  padding: 14px 18px 12px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
  background: var(--surface2);
}
.panel-head-icon {
  width: 28px; height: 28px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
}
.panel-head-icon.terra  { background: rgba(185,100,60,0.1);  color: var(--terra);  }
.panel-head-icon.sage   { background: rgba(90,122,94,0.1);   color: var(--sage);   }
.panel-head-icon.amber  { background: rgba(196,138,30,0.1);  color: var(--amber);  }
.panel-title {
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text2);
}

/* COMPOSE */
.compose-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 13px; }
.field-label {
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase;
  color: var(--text3); margin-bottom: 6px;
  display: flex; align-items: center; justify-content: space-between;
}
.field-counter { font-family: var(--mono); font-weight: 500; color: var(--text3); }

.field-input, .field-textarea {
  width: 100%; font-family: var(--sans); font-size: 0.88rem; font-weight: 400;
  color: var(--text); background: var(--bg2); border: 1px solid var(--border2);
  border-radius: var(--r); padding: 10px 13px; outline: none;
  transition: border-color 0.18s, box-shadow 0.18s; resize: none;
}
.field-input:focus, .field-textarea:focus {
  border-color: var(--terra2); box-shadow: 0 0 0 3px rgba(185,100,60,0.1);
  background: #fff;
}
.field-input::placeholder, .field-textarea::placeholder { color: var(--text3); font-weight: 400; }
.field-textarea { height: 110px; line-height: 1.65; }

/* AI ROW */
.ai-assist-row { display: flex; gap: 8px; }
.btn-ai {
  flex: 1; padding: 9px 8px; font-family: var(--sans); font-size: 0.71rem; font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--plum); background: rgba(122,79,109,0.07);
  border: 1px solid rgba(122,79,109,0.2); border-radius: var(--r);
  cursor: pointer; transition: all 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}
.btn-ai:hover:not(:disabled) {
  background: rgba(122,79,109,0.13); border-color: rgba(122,79,109,0.38);
  box-shadow: 0 2px 10px rgba(122,79,109,0.12);
}
.btn-ai:disabled { opacity: 0.4; cursor: not-allowed; }

.ai-thinking { display: inline-flex; gap: 3px; align-items: center; }
.ai-thinking span {
  width: 4px; height: 4px; background: var(--plum); border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}
.ai-thinking span:nth-child(2) { animation-delay: 0.15s; }
.ai-thinking span:nth-child(3) { animation-delay: 0.3s; }
@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)} }

.ai-result {
  background: rgba(122,79,109,0.05); border: 1px solid rgba(122,79,109,0.15);
  border-radius: var(--r); padding: 12px 13px; font-size: 0.82rem;
  color: var(--text2); line-height: 1.65; animation: alertIn 0.2s ease;
}
.ai-result-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
}
.ai-result-label {
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--plum);
}
.btn-use-ai {
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--sage); background: rgba(90,122,94,0.1); border: 1px solid rgba(90,122,94,0.25);
  border-radius: 4px; padding: 3px 8px; cursor: pointer; transition: all 0.15s;
}
.btn-use-ai:hover { background: rgba(90,122,94,0.18); }
.ai-result-text { white-space: pre-wrap; }

/* PUBLISH BUTTON */
.btn-publish {
  width: 100%; padding: 12px 16px; font-family: var(--sans); font-size: 0.82rem;
  font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: #fff; background: var(--terra3);
  border: none; border-radius: var(--r); cursor: pointer;
  transition: all 0.2s; position: relative; overflow: hidden;
  box-shadow: 0 2px 0 rgba(140,63,32,0.4);
}
.btn-publish:hover:not(:disabled) {
  background: var(--terra); box-shadow: 0 4px 16px rgba(185,100,60,0.35);
  transform: translateY(-1px);
}
.btn-publish:active:not(:disabled) { transform: scale(0.975); box-shadow: none; }
.btn-publish:disabled { opacity: 0.45; cursor: not-allowed; }

/* STATS */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); }
.stat-cell { background: var(--surface); padding: 14px 16px; }
.stat-val {
  font-family: var(--mono); font-size: 1.4rem; font-weight: 500;
  color: var(--terra); line-height: 1; margin-bottom: 4px;
}
.stat-label {
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text3);
}

/* FEED */
.feed { display: flex; flex-direction: column; gap: 1.5rem; }

.discovery {
  display: flex; align-items: center; gap: 10px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r2); padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(139,110,78,0.05);
}
.search-wrap { position: relative; flex: 1; }
.search-icon-el {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  font-size: 0.85rem; color: var(--text3); pointer-events: none;
}
.search-input {
  width: 100%; font-family: var(--sans); font-size: 0.88rem; font-weight: 400;
  color: var(--text); background: var(--bg2); border: 1px solid var(--border2);
  border-radius: var(--r); padding: 9px 11px 9px 34px; outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.search-input:focus { border-color: var(--terra2); box-shadow: 0 0 0 3px rgba(185,100,60,0.08); }
.search-input::placeholder { color: var(--text3); font-weight: 400; }

.btn-filter {
  flex-shrink: 0; padding: 9px 14px; font-family: var(--sans); font-size: 0.72rem;
  font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--text2); background: var(--bg2); border: 1px solid var(--border2);
  border-radius: var(--r); cursor: pointer; transition: all 0.18s;
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
}
.btn-filter:hover { border-color: var(--terra2); color: var(--terra); }
.btn-filter.active { background: rgba(185,100,60,0.08); border-color: rgba(185,100,60,0.3); color: var(--terra); }
.filter-count {
  font-family: var(--mono); font-size: 0.68rem; font-weight: 500;
  color: var(--text3); background: var(--bg3); padding: 1px 6px; border-radius: 10px;
}
.btn-filter.active .filter-count { color: var(--terra2); background: rgba(185,100,60,0.1); }

/* HISTORY PANEL */
.history-panel {
  background: var(--surface); border: 1px solid var(--border3); border-radius: var(--r2);
  overflow: hidden; animation: alertIn 0.2s ease;
  box-shadow: 0 4px 20px rgba(185,100,60,0.1);
}
.history-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 18px; background: rgba(185,100,60,0.05); border-bottom: 1px solid var(--border);
}
.history-title {
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--terra); display: flex; align-items: center; gap: 8px;
}
.history-close {
  width: 26px; height: 26px; border-radius: 6px; background: none;
  border: 1px solid var(--border2); color: var(--text3); cursor: pointer; font-size: 1rem;
  display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.history-close:hover { background: var(--bg3); color: var(--text); border-color: var(--border3); }

.history-search { padding: 10px 18px; border-bottom: 1px solid var(--border); }
.history-search-input {
  width: 100%; font-family: var(--sans); font-size: 0.82rem; color: var(--text);
  background: var(--bg2); border: 1px solid var(--border2);
  border-radius: var(--r); padding: 7px 11px; outline: none; transition: border-color 0.18s;
}
.history-search-input:focus { border-color: var(--terra2); }
.history-search-input::placeholder { color: var(--text3); }

.history-list { max-height: 320px; overflow-y: auto; padding: 6px 0; }
.history-list::-webkit-scrollbar { width: 3px; }
.history-list::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 10px; }

.history-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 18px; cursor: pointer; transition: background 0.15s;
}
.history-item:hover { background: var(--surface2); }
.history-item-num { font-family: var(--mono); font-size: 0.65rem; color: var(--text3); width: 18px; flex-shrink: 0; }
.history-item-info { flex: 1; min-width: 0; }
.history-item-title {
  font-size: 0.83rem; font-weight: 500; color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.history-item-meta { font-size: 0.68rem; color: var(--text3); margin-top: 2px; font-family: var(--mono); }
.history-item-actions { display: flex; align-items: center; gap: 6px; opacity: 0; transition: opacity 0.15s; }
.history-item:hover .history-item-actions { opacity: 1; }

.btn-h-search, .btn-h-delete {
  width: 26px; height: 26px; border-radius: 5px; border: 1px solid var(--border2);
  background: none; cursor: pointer; font-size: 0.75rem;
  display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.btn-h-search { color: var(--sky); }
.btn-h-search:hover { background: rgba(61,122,158,0.1); border-color: rgba(61,122,158,0.3); }
.btn-h-delete { color: var(--danger); }
.btn-h-delete:hover { background: rgba(192,57,43,0.1); border-color: rgba(192,57,43,0.3); }
.history-empty { padding: 30px 18px; text-align: center; font-size: 0.82rem; color: var(--text3); }

/* TAG FILTER BAR */
.tag-filter-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tag-filter-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text3); }
.tag-pill {
  font-size: 0.72rem; font-weight: 500; letter-spacing: 0.04em;
  padding: 4px 11px; border-radius: 20px;
  background: var(--surface); border: 1px solid var(--border2);
  color: var(--text2); cursor: pointer; transition: all 0.15s;
}
.tag-pill:hover { border-color: var(--terra2); color: var(--terra); }
.tag-pill.active { background: rgba(185,100,60,0.1); border-color: rgba(185,100,60,0.3); color: var(--terra); font-weight: 600; }

/* FEED META */
.feed-meta { display: flex; align-items: center; justify-content: space-between; }
.feed-meta-text { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text3); }
.feed-meta-text strong { color: var(--terra); font-family: var(--mono); }

.sort-select {
  font-family: var(--sans); font-size: 0.72rem; font-weight: 600;
  color: var(--text2); background: var(--surface); border: 1px solid var(--border2);
  border-radius: var(--r); padding: 5px 10px; outline: none; cursor: pointer;
  transition: border-color 0.15s;
}
.sort-select:focus { border-color: var(--terra2); }
.sort-select option { background: #fff; }

/* BLOG GRID */
.blogs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.1rem; }

.blog-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r2); padding: 1.2rem 1.2rem 1rem;
  display: flex; flex-direction: column; gap: 0.65rem;
  box-shadow: 0 2px 8px rgba(139,110,78,0.06);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  position: relative; overflow: hidden;
  animation: cardIn 0.3s ease both;
}
@keyframes cardIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none} }
.blog-card:hover {
  border-color: var(--border3); transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(139,110,78,0.14), 0 2px 8px rgba(139,110,78,0.08);
}
.blog-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--terra), var(--amber2));
  opacity: 0; transition: opacity 0.2s;
}
.blog-card:hover::after { opacity: 1; }

.card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.card-meta {
  display: flex; align-items: center; gap: 7px; font-size: 0.68rem; font-weight: 500;
  letter-spacing: 0.03em; color: var(--text3); font-family: var(--mono);
}
.card-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text3); }
.card-readtime {
  color: var(--sage); background: rgba(90,122,94,0.08);
  border: 1px solid rgba(90,122,94,0.2); padding: 2px 7px;
  border-radius: 10px; font-size: 0.65rem;
}
.card-delete {
  width: 26px; height: 26px; border-radius: 6px; background: none;
  border: 1px solid transparent; color: var(--text3); cursor: pointer;
  font-size: 0.8rem; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; flex-shrink: 0; opacity: 0;
}
.blog-card:hover .card-delete { opacity: 1; }
.card-delete:hover { background: rgba(192,57,43,0.08); border-color: rgba(192,57,43,0.25); color: var(--danger); }

.card-title {
  font-family: var(--serif); font-size: 1.1rem; font-style: italic; font-weight: 600;
  line-height: 1.35; color: var(--text); letter-spacing: -0.01em;
}
.card-body {
  font-size: 0.83rem; font-weight: 400; color: var(--text2); line-height: 1.7;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.card-tags { display: flex; flex-wrap: wrap; gap: 5px; }

.ctag {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
  padding: 3px 8px; border-radius: 4px; cursor: pointer; transition: all 0.15s;
}
.ctag-terra  { color: var(--terra3); background: rgba(185,100,60,0.08);  border: 1px solid rgba(185,100,60,0.18); }
.ctag-sage   { color: var(--sage);   background: rgba(90,122,94,0.08);   border: 1px solid rgba(90,122,94,0.2);  }
.ctag-amber  { color: var(--amber);  background: rgba(196,138,30,0.08);  border: 1px solid rgba(196,138,30,0.2); }
.ctag-plum   { color: var(--plum);   background: rgba(122,79,109,0.08);  border: 1px solid rgba(122,79,109,0.2); }
.ctag-sky    { color: var(--sky);    background: rgba(61,122,158,0.08);  border: 1px solid rgba(61,122,158,0.2); }
.ctag:hover  { filter: brightness(0.88) saturate(1.2); }

/* LOADER & EMPTY */
.loader { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; gap:14px; padding:80px 20px; color:var(--text3); }
.spinner { width:32px; height:32px; border:2px solid var(--bg4); border-top-color:var(--terra); border-radius:50%; animation:spin 0.7s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }
.loader-text { font-size:0.72rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; }

.empty-state { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; padding:80px 20px; gap:12px; }
.empty-glyph { font-size:2.5rem; opacity:0.18; margin-bottom:6px; }
.empty-title { font-family:var(--serif); font-size:1.3rem; font-style:italic; color:var(--text2); }
.empty-sub { font-size:0.82rem; color:var(--text3); }
.btn-reset {
  margin-top:6px; font-family:var(--sans); font-size:0.72rem; font-weight:600;
  letter-spacing:0.07em; text-transform:uppercase; color:var(--terra);
  background:rgba(185,100,60,0.08); border:1px solid rgba(185,100,60,0.22);
  border-radius:var(--r); padding:9px 18px; cursor:pointer; transition:all 0.15s;
}
.btn-reset:hover { background:rgba(185,100,60,0.15); }

/* MODAL */
.modal-overlay {
  position:fixed; inset:0; background:rgba(44,32,21,0.45);
  backdrop-filter:blur(4px); z-index:500;
  display:flex; align-items:center; justify-content:center; animation:alertIn 0.15s ease;
}
.modal {
  background:var(--surface); border:1px solid var(--border2);
  border-radius:var(--r3); padding:2rem; max-width:360px; width:90%;
  box-shadow:0 20px 60px rgba(44,32,21,0.22);
}
.modal-title { font-family:var(--serif); font-size:1.2rem; font-style:italic; font-weight:600; color:var(--text); margin-bottom:10px; }
.modal-sub { font-size:0.83rem; color:var(--text2); line-height:1.6; margin-bottom:1.5rem; }
.modal-actions { display:flex; gap:10px; }
.btn-cancel {
  flex:1; padding:10px; font-family:var(--sans); font-size:0.78rem; font-weight:600;
  letter-spacing:0.05em; text-transform:uppercase; color:var(--text2);
  background:var(--bg2); border:1px solid var(--border2); border-radius:var(--r);
  cursor:pointer; transition:all 0.15s;
}
.btn-cancel:hover { border-color:var(--border3); color:var(--text); }
.btn-confirm-del {
  flex:1; padding:10px; font-family:var(--sans); font-size:0.78rem; font-weight:600;
  letter-spacing:0.05em; text-transform:uppercase; color:var(--danger);
  background:rgba(192,57,43,0.07); border:1px solid rgba(192,57,43,0.25);
  border-radius:var(--r); cursor:pointer; transition:all 0.15s;
}
.btn-confirm-del:hover { background:rgba(192,57,43,0.15); }

::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--bg4); border-radius:10px; }

@media(max-width:1024px){ .layout{grid-template-columns:300px 1fr;gap:1.5rem;} }
@media(max-width:860px) { .layout{grid-template-columns:1fr;} .sidebar{position:static;} }
@media(max-width:600px) { .header{padding:0 1rem;} .layout{padding:1.2rem 1rem 3rem;} .header-right{display:none;} }
`;

const API = "http://localhost:5000";
const readTime = (t) => Math.max(1, Math.ceil((t||"").trim().split(/\s+/).length / 200));
const TAG_COLORS = ["terra","sage","amber","plum","sky"];
const tagColor = (tag) => TAG_COLORS[Math.abs([...tag].reduce((a,c)=>a+c.charCodeAt(0),0)) % TAG_COLORS.length];
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "Just now";
const fmtDateTime = (d) => d ? new Date(d).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:true}) : "Just now";

const Alert = ({ type, children }) => (
  <div className={`alert ${type}`}>
    <span style={{fontSize:"1rem"}}>{type==="error"?"⚠":"✓"}</span>
    {children}
  </div>
);

export default function Blog() {
  const [blogs, setBlogs]             = useState([]);
  const [title, setTitle]             = useState("");
  const [content, setContent]         = useState("");
  const [tags, setTags]               = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy]           = useState("newest");
  const [activeTag, setActiveTag]     = useState("");
  const [historyFilter, setHistoryFilter] = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [aiMode, setAiMode]           = useState(null);
  const [aiResult, setAiResult]       = useState("");
  const [aiLoading, setAiLoading]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const feedRef  = useRef(null);
  const titleRef = useRef(null);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/blogs`);
      if (!res.ok) throw new Error("Failed to load posts.");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data.reverse() : []);
    } catch(e) { setError(e.message); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true); setError(null); setSuccess(null);
    const tagArray = tags.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean);
    const newBlog  = { title:title.trim(), content:content.trim(), tags:tagArray, date:new Date().toISOString() };
    const tmpId    = `tmp_${Date.now()}`;
    setBlogs(prev => [{ ...newBlog, id:tmpId }, ...prev]);
    setTitle(""); setContent(""); setTags(""); setAiResult("");
    try {
      const res = await fetch(`${API}/blogs`,{
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(newBlog)
      });
      if (!res.ok) throw new Error("Could not save post.");
      const saved = await res.json();
      setBlogs(prev => prev.map(b => b.id===tmpId ? {...b, id:saved.id} : b));
      setSuccess("Post published successfully!");
      setTimeout(()=>setSuccess(null), 3000);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => titleRef.current?.focus(), 100);
    } catch(e) {
      setError(e.message);
      setBlogs(prev => prev.filter(b => b.id!==tmpId));
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    setBlogs(prev => prev.filter(b => b.id!==id));
    try { await fetch(`${API}/blogs/${id}`,{method:"DELETE"}); }
    catch { fetchBlogs(); }
  };

  const handleAI = async (mode) => {
    setAiMode(mode); setAiLoading(true); setAiResult("");
    let prompt = "";
    if (mode==="title")   prompt = `Generate 3 catchy, creative blog post titles about: "${content||title||"AI and technology"}". Return just the titles, numbered 1-3.`;
    if (mode==="content") prompt = `Write a compelling blog post introduction (3-4 paragraphs) about: "${title||"artificial intelligence"}". Be insightful. No markdown headers.`;
    if (mode==="tags")    prompt = `Suggest 5 relevant tags for a blog post titled "${title||"AI blog"}" about: "${(content||"").slice(0,200)||"technology"}". Return just comma-separated tags, lowercase.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] })
      });
      const data = await res.json();
      setAiResult((data.content||[]).map(c=>c.text||"").join("").trim() || "No response.");
    } catch { setAiResult("AI assist unavailable."); }
    finally { setAiLoading(false); }
  };

  const applyAiResult = () => {
    if (!aiResult) return;
    if (aiMode==="title")   setTitle(aiResult.split("\n")[0].replace(/^[123]\.\s*/,""));
    if (aiMode==="content") setContent(aiResult);
    if (aiMode==="tags")    setTags(aiResult);
    setAiResult(""); setAiMode(null);
  };

  const allTags = useMemo(() => {
    const map = {};
    blogs.forEach(b => (b.tags||[]).forEach(t => { map[t]=(map[t]||0)+1; }));
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([t])=>t);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let list = blogs.filter(b => {
      const q = searchQuery.toLowerCase();
      return (!q || b.title?.toLowerCase().includes(q) || b.content?.toLowerCase().includes(q))
          && (!activeTag || (b.tags||[]).includes(activeTag));
    });
    if (sortBy==="oldest") list = [...list].reverse();
    if (sortBy==="read")   list = [...list].sort((a,b)=>readTime(b.content)-readTime(a.content));
    return list;
  }, [blogs, searchQuery, activeTag, sortBy]);

  const filteredHistory = useMemo(() => {
    const q = historyFilter.toLowerCase();
    return blogs.filter(b => !q || b.title?.toLowerCase().includes(q));
  }, [blogs, historyFilter]);

  const totalWords = useMemo(() => blogs.reduce((s,b)=>s+(b.content||"").split(/\s+/).length,0), [blogs]);
  const avgRead = blogs.length ? Math.ceil(blogs.reduce((s,b)=>s+readTime(b.content),0)/blogs.length) : 0;

  return (
    <>
      <style>{STYLES}</style>
      <div className="blog-root">

        <header className="header">
          <div className="header-left">
            <span className="header-logo">Neuron<span> Blog</span></span>
            <span className="header-badge">AI-Powered</span>
          </div>
          <div className="header-right">
            <span className="header-stat">Posts <span className="header-stat-num">{blogs.length}</span></span>
            <span className="header-stat">Words <span className="header-stat-num">{totalWords.toLocaleString()}</span></span>
          </div>
        </header>

        {error   && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <div className="layout">
          <aside className="sidebar">

            <div className="panel">
              <div className="panel-head">
                <div className="panel-head-icon terra">✏</div>
                <span className="panel-title">Compose</span>
              </div>
              <form className="compose-body" onSubmit={handleSubmit}>
                <div>
                  <div className="field-label">
                    Title <span className="field-counter">{title.length}/120</span>
                  </div>
                  <input className="field-input" type="text" placeholder="Your headline here…"
                    ref={titleRef} autoFocus
                    value={title} onChange={e=>setTitle(e.target.value)}
                    disabled={isSubmitting} maxLength={120} required />
                </div>
                <div>
                  <div className="field-label">Tags</div>
                  <input className="field-input" type="text" placeholder="ai, tech, design"
                    value={tags} onChange={e=>setTags(e.target.value)} disabled={isSubmitting} />
                </div>
                <div>
                  <div className="field-label">Content</div>
                  <textarea className="field-textarea" placeholder="Write something extraordinary…"
                    value={content} onChange={e=>setContent(e.target.value)}
                    disabled={isSubmitting} required />
                </div>

                <div className="ai-assist-row">
                  {["title","content","tags"].map(m => (
                    <button key={m} type="button" className="btn-ai"
                      onClick={()=>handleAI(m)} disabled={aiLoading||isSubmitting}>
                      ✦ {m.charAt(0).toUpperCase()+m.slice(1)}
                    </button>
                  ))}
                </div>

                {(aiLoading||aiResult) && (
                  <div className="ai-result">
                    <div className="ai-result-header">
                      <span className="ai-result-label">✦ AI — {aiMode}</span>
                      {!aiLoading && aiResult && (
                        <button type="button" className="btn-use-ai" onClick={applyAiResult}>Use ↵</button>
                      )}
                    </div>
                    {aiLoading
                      ? <div className="ai-thinking"><span/><span/><span/></div>
                      : <div className="ai-result-text">{aiResult}</div>
                    }
                  </div>
                )}

                <button type="submit" className="btn-publish" disabled={isSubmitting}>
                  {isSubmitting ? "Publishing…" : "⬆ Publish Post"}
                </button>
              </form>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div className="panel-head-icon sage">◈</div>
                <span className="panel-title">Stats</span>
              </div>
              <div className="stats-grid">
                <div className="stat-cell"><div className="stat-val">{blogs.length}</div><div className="stat-label">Total Posts</div></div>
                <div className="stat-cell"><div className="stat-val">{allTags.length}</div><div className="stat-label">Unique Tags</div></div>
                <div className="stat-cell"><div className="stat-val">{totalWords.toLocaleString()}</div><div className="stat-label">Total Words</div></div>
                <div className="stat-cell"><div className="stat-val">{avgRead}m</div><div className="stat-label">Avg Read</div></div>
              </div>
            </div>

          </aside>

          <section className="feed" ref={feedRef}>

            <div className="discovery">
              <div className="search-wrap">
                <span className="search-icon-el">⌕</span>
                <input className="search-input" type="text" placeholder="Search posts…"
                  value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
              </div>
              <button type="button" className={`btn-filter${isHistoryOpen?" active":""}`}
                onClick={()=>setIsHistoryOpen(v=>!v)}>
                ☰ History <span className="filter-count">{blogs.length}</span>
              </button>
            </div>

            {isHistoryOpen && (
              <div className="history-panel">
                <div className="history-head">
                  <span className="history-title">⏱ History — {blogs.length}</span>
                  <button className="history-close" onClick={()=>setIsHistoryOpen(false)}>×</button>
                </div>
                <div className="history-search">
                  <input className="history-search-input" type="text" placeholder="Filter history…"
                    value={historyFilter} onChange={e=>setHistoryFilter(e.target.value)} />
                </div>
                {filteredHistory.length===0
                  ? <div className="history-empty">No posts found.</div>
                  : (
                    <ul className="history-list">
                      {filteredHistory.map((blog,i) => (
                        <li key={blog.id} className="history-item">
                          <span className="history-item-num">{String(i+1).padStart(2,"0")}</span>
                          <div className="history-item-info">
                            <div className="history-item-title">{blog.title}</div>
                            <div className="history-item-meta">{fmtDateTime(blog.date)} · {readTime(blog.content)}m</div>
                          </div>
                          <div className="history-item-actions">
                            <button className="btn-h-search" title="Search"
                              onClick={()=>{setSearchQuery(blog.title);setIsHistoryOpen(false);}}>⌕</button>
                            <button className="btn-h-delete" title="Delete"
                              onClick={()=>setDeleteTarget({...blog,fromHistory:true})}>✕</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            )}

            {allTags.length>0 && (
              <div className="tag-filter-bar">
                <span className="tag-filter-label">Filter:</span>
                <span className={`tag-pill${!activeTag?" active":""}`} onClick={()=>setActiveTag("")}>All</span>
                {allTags.map(t => (
                  <span key={t} className={`tag-pill${activeTag===t?" active":""}`}
                    onClick={()=>setActiveTag(activeTag===t?"":t)}>#{t}</span>
                ))}
              </div>
            )}

            <div className="feed-meta">
              <span className="feed-meta-text">
                Showing <strong>{filteredBlogs.length}</strong> of {blogs.length} posts
                {searchQuery && <> · "<strong>{searchQuery}</strong>"</>}
              </span>
              <select className="sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="read">Longest read</option>
              </select>
            </div>

            {isLoading && blogs.length===0 ? (
              <div className="blogs-grid">
                <div className="loader">
                  <div className="spinner"/>
                  <span className="loader-text">Loading feed…</span>
                </div>
              </div>
            ) : filteredBlogs.length===0 ? (
              <div className="blogs-grid">
                <div className="empty-state">
                  <div className="empty-glyph">◈</div>
                  <h3 className="empty-title">Nothing here yet</h3>
                  <p className="empty-sub">Try a different search or be the first to write.</p>
                  {(searchQuery||activeTag) && (
                    <button className="btn-reset" onClick={()=>{setSearchQuery("");setActiveTag("");}}>Clear filters</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="blogs-grid">
                {filteredBlogs.map((blog,idx) => (
                  <article className="blog-card" key={blog.id} style={{animationDelay:`${idx*0.04}s`}}>
                    <div className="card-top">
                      <div className="card-meta">
                        <span>{fmtDate(blog.date)}</span>
                        <span className="card-dot"/>
                        <span className="card-readtime">{readTime(blog.content)} min</span>
                      </div>
                      <button className="card-delete" onClick={()=>setDeleteTarget(blog)} title="Delete">✕</button>
                    </div>
                    <h2 className="card-title">{blog.title}</h2>
                    <p className="card-body">{blog.content}</p>
                    {blog.tags?.length>0 && (
                      <div className="card-footer">
                        <div className="card-tags">
                          {blog.tags.map((tag,i) => (
                            <span key={i} className={`ctag ctag-${tagColor(tag)}`}
                              onClick={()=>setActiveTag(activeTag===tag?"":tag)}>#{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {deleteTarget && (
          <div className="modal-overlay" onClick={()=>setDeleteTarget(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Delete this post?</div>
              <p className="modal-sub">
                "<strong>{deleteTarget.title}</strong>" will be permanently removed. This cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={()=>setDeleteTarget(null)}>Cancel</button>
                <button className="btn-confirm-del" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}