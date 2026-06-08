import { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const SYSTEM_PROMPT = `You are Hari AI, the friendly and helpful shopping assistant for Harikart — an Indian e-commerce platform.

You help customers with:
- Product searches and recommendations
- Order tracking and status
- Coupons and offers (available: HARI10 for 10% off, FREESHIP99 for free shipping above ₹499, WELCOME200 for ₹200 off first order, ELECTRONICS15 for 15% off electronics, FASHION25 for 25% off fashion, GIFTYOU50 for ₹50 cashback)
- Delivery info (standard 3-5 days, express 1-2 days, free delivery above ₹500)
- Returns (7-day return policy, easy pickup)
- Payment methods (UPI, Credit/Debit Card, Net Banking, Cash on Delivery)
- General shopping help

Personality: Warm, helpful, slightly playful. Mix Tamil and English naturally when appropriate (Tanglish). Keep responses concise and friendly. Use emojis moderately. Format nicely with line breaks.`;

const QUICK_REPLIES = [
  { label: '📦 Track Order',   text: 'How do I track my order?' },
  { label: '🏷️ Coupons',       text: 'Show me available coupons' },
  { label: '↩️ Returns',        text: 'What is the return policy?' },
  { label: '🚚 Delivery',       text: 'How long does delivery take?' },
  { label: '💳 Payments',       text: 'What payment methods are accepted?' },
  { label: '🛍️ Best Deals',     text: 'What are the best deals today?' },
];

function TypingDots() {
  return (
    <div className="hc-typing-indicator">
      <span /><span /><span />
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`hc-msg-row ${isUser ? 'user' : 'bot'}`}>
      {!isUser && <div className="hc-avatar bot-av">🛒</div>}
      <div className="hc-msg-wrap">
        <div
          className={`hc-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}
          dangerouslySetInnerHTML={{ __html: msg.html }}
        />
        <span className={`hc-time ${isUser ? 'time-right' : 'time-left'}`}>{msg.time}</span>
      </div>
      {isUser && <div className="hc-avatar user-av">👤</div>}
    </div>
  );
}

export default function ChatBot() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [history,   setHistory]   = useState([]);
  const [clock,     setClock]     = useState('');
  const [showQuick, setShowQuick] = useState(true);
  const [unread,    setUnread]    = useState(1);
  const [error,     setError]     = useState('');

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const textareaRef    = useRef(null);

  // ── Realtime clock ──────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: true,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Welcome message on first open ──────────────────────────────
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      });
      setMessages([
        {
          id: Date.now(),
          role: 'bot',
          html: `👋 வணக்கம்! நான் <strong>Hari AI</strong> — உங்கள் Harikart shopping assistant!<br><br>Products, orders, coupons, delivery — எல்லாத்துக்கும் help பண்றேன். என்ன தேவை? 😊`,
          time: welcomeTime,
        },
      ]);
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    if (isOpen) setUnread(0);
  }, [isOpen]);

  // ── Auto-scroll ─────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Auto-resize textarea ────────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 100) + 'px';
    }
  };

  const getTime = () =>
    new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  const escHtml = (str) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

  // ── Send message ────────────────────────────────────────────────
  const sendMessage = async (text = input.trim()) => {
    if (!text || loading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setShowQuick(false);
    setError('');

    const userMsg = { id: Date.now(), role: 'user', html: escHtml(text), time: getTime() };
    setMessages(prev => [...prev, userMsg]);

    const newHistory = [...history, { role: 'user', content: text }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newHistory,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'API error');

      const replyText = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');

      const replyHtml = replyText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

      setHistory(prev => [...prev, { role: 'assistant', content: replyText }]);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', html: replyHtml, time: getTime() },
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          html: '😔 Sorry, oru technical issue வந்திருக்கு. கொஞ்சம் wait பண்ணி retry பண்ணுங்க!',
          time: getTime(),
        },
      ]);
      setError(err.message || 'Something went wrong');
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setHistory([]);
    setShowQuick(true);
    setIsOpen(false);
    setTimeout(() => setIsOpen(true), 50);
  };

  const todayLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
  });

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        className={`hc-fab ${isOpen ? 'hc-fab-open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Chat with Hari AI"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!isOpen && unread > 0 && (
          <span className="hc-fab-badge">{unread}</span>
        )}
      </button>

      {/* ── Chat Window ── */}
      <div className={`hc-window ${isOpen ? 'hc-window-open' : ''}`}>

        {/* Header */}
        <div className="hc-header">
          <div className="hc-header-avatar">🛒</div>
          <div className="hc-header-info">
            <div className="hc-header-name">
              Hari AI
              <span className="hc-online-dot" />
            </div>
            <div className="hc-header-sub">Harikart Assistant · Online</div>
          </div>
          <div className="hc-header-right">
            <span className="hc-clock">{clock}</span>
            <button className="hc-icon-btn" onClick={clearChat} title="New Chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.78"/>
              </svg>
            </button>
            <button className="hc-icon-btn" onClick={() => setIsOpen(false)} title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="hc-messages">
          <div className="hc-date-chip">{todayLabel}</div>

          {messages.map(msg => (
            <Message key={msg.id} msg={msg} />
          ))}

          {loading && (
            <div className="hc-msg-row bot">
              <div className="hc-avatar bot-av">🛒</div>
              <TypingDots />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {showQuick && messages.length <= 1 && (
          <div className="hc-quick-wrap">
            <p className="hc-quick-label">Quick questions</p>
            <div className="hc-quick-grid">
              {QUICK_REPLIES.map(q => (
                <button
                  key={q.text}
                  className="hc-quick-btn"
                  onClick={() => sendMessage(q.text)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className="hc-error">{error}</div>}

        {/* Input */}
        <div className="hc-input-area">
          <div className="hc-input-wrap" ref={inputRef}>
            <textarea
              ref={textareaRef}
              className="hc-input"
              placeholder="Message Hari AI…"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKey}
              rows={1}
              disabled={loading}
            />
          </div>
          <button
            className="hc-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <div className="hc-footer">Powered by Claude AI · Harikart</div>
      </div>
    </>
  );
}