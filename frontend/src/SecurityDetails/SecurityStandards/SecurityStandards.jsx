import React, { useEffect, useState } from "react";

/**
 * SecurityStandards.jsx
 * Secure Payments UI (PCI-DSS Compliance themed dashboard)
 */

const SecurityStandards = () => {
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    amount: "",
  });

  const [errors, setErrors] = useState({});
  const [logs, setLogs] = useState([]);
  const [showTop, setShowTop] = useState(false);
  const [secureToken, setSecureToken] = useState("");

  // ✅ FIXED: Force scroll to TOP on load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  const validate = () => {
    let err = {};

    if (!form.cardNumber || form.cardNumber.length < 12) {
      err.cardNumber = "Invalid card number";
    }
    if (!form.expiry) {
      err.expiry = "Expiry required";
    }
    if (!form.cvv || form.cvv.length < 3) {
      err.cvv = "Invalid CVV";
    }
    if (!form.name) {
      err.name = "Name required";
    }
    if (!form.amount || isNaN(form.amount)) {
      err.amount = "Enter valid amount";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const generateToken = () => {
    return "SEC_" + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = generateToken();
    setSecureToken(token);

    const newLog = {
      time: new Date().toLocaleString(),
      action: "Payment Processed",
      status: "SUCCESS",
      token,
    };

    setLogs((prev) => [newLog, ...prev]);

    setForm({
      cardNumber: "",
      expiry: "",
      cvv: "",
      name: "",
      amount: "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Smooth scroll top fix
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div style={styles.wrapper}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1>Secure Payments Dashboard</h1>
        <p>PCI-DSS Compliant Payment Security Interface</p>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <h2>Enterprise Grade Payment Security</h2>
        <p>
          End-to-end encryption, tokenization, and secure transaction handling UI simulation.
        </p>
      </section>

      {/* GRID */}
      <div style={styles.grid}>
        {/* PAYMENT FORM */}
        <div style={styles.card}>
          <h2>Payment Form</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Card Holder Name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}

            <input
              name="cardNumber"
              placeholder="Card Number"
              value={form.cardNumber}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.cardNumber && <p style={styles.error}>{errors.cardNumber}</p>}

            <div style={styles.row}>
              <input
                name="expiry"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="cvv"
                placeholder="CVV"
                value={form.cvv}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <input
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.amount && <p style={styles.error}>{errors.amount}</p>}

            <button style={styles.button}>Process Secure Payment</button>
          </form>

          {secureToken && (
            <div style={styles.tokenBox}>
              <h4>Secure Token</h4>
              <code>{secureToken}</code>
            </div>
          )}
        </div>

        {/* COMPLIANCE */}
        <div style={styles.card}>
          <h2>PCI-DSS Checklist</h2>
          <ul style={styles.list}>
            <li>✔ TLS Encryption</li>
            <li>✔ No Card Storage</li>
            <li>✔ Tokenization</li>
            <li>✔ Access Control</li>
            <li>✔ Monitoring Enabled</li>
            <li>✔ Vulnerability Testing</li>
          </ul>
        </div>

        {/* LOGS */}
        <div style={styles.cardWide}>
          <h2>Audit Logs</h2>

          {logs.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <div style={styles.logBox}>
              {logs.map((log, index) => (
                <div key={index} style={styles.logItem}>
                  <span>{log.time}</span>
                  <strong>{log.action}</strong>
                  <span>{log.status}</span>
                  <code>{log.token}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 Secure Payment Systems</p>
      </footer>

      {/* TOP BUTTON */}
      {showTop && (
        <button onClick={scrollToTop} style={styles.topButton}>
          ↑
        </button>
      )}
    </div>
  );
};

/* =========================
   STYLES
========================= */

const styles = {
  wrapper: {
    fontFamily: "Arial",
    background: "#0b1220",
    color: "#fff",
    minHeight: "100vh",
    width: "100%",
    padding: "20px",
  },

  header: {
    textAlign: "center",
    padding: "20px",
  },

  hero: {
    padding: "20px",
    background: "#13213c",
    borderRadius: "12px",
    marginTop: "10px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    background: "#111a2e",
    padding: "20px",
    borderRadius: "12px",
  },

  cardWide: {
    gridColumn: "1 / -1",
    background: "#111a2e",
    padding: "20px",
    borderRadius: "12px",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #2a3b5e",
    background: "#0b1220",
    color: "#fff",
  },

  row: {
    display: "flex",
    gap: "10px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2d6cdf",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "12px",
  },

  tokenBox: {
    marginTop: "10px",
    padding: "10px",
    background: "#0c1f3a",
    borderRadius: "8px",
  },

  list: {
    listStyle: "none",
    padding: 0,
    lineHeight: "2",
  },

  logBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  logItem: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    fontSize: "12px",
    background: "#0b1220",
    padding: "10px",
    borderRadius: "8px",
  },

  footer: {
    textAlign: "center",
    marginTop: "30px",
  },

  topButton: {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#2d6cdf",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default SecurityStandards;