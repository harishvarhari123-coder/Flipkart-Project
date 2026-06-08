import React from "react";
import "./Payments.css";

const methods = [
  { name: "UPI", desc: "Pay instantly via GPay, PhonePe, Paytm, and more." },
  { name: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay accepted securely." },
  { name: "Net Banking", desc: "All major Indian banks supported." },
  { name: "Cash on Delivery", desc: "Pay in cash when your order arrives." },
  { name: "Harikart Wallet", desc: "Use your Harikart balance for faster checkout." },
];

export default function Payments() {
  return (
    <div className="pay-page">
      <div className="pay-header">
        <h1>Payments</h1>
        <p>We support multiple secure payment methods for your convenience.</p>
      </div>
      <div className="pay-list">
        {methods.map((m, i) => (
          <div className="pay-item" key={i}>
            <div className="pay-icon">💳</div>
            <div>
              <h3>{m.name}</h3>
              <p>{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pay-note">All transactions are encrypted with 256-bit SSL security.</div>
    </div>
  );
}