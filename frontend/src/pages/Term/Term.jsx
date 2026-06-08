import React, { useState } from "react";

const termsData = [
  {
    id: "membership",
    title: "Membership Eligibility",
    content: `Transaction on the Platform is available only to persons who can form legally binding contracts under Indian Contract Act, 1872. Persons who are "incompetent to contract" within the meaning of the Indian Contract Act, 1872 including un-discharged insolvents etc. are not eligible to use the Platform. If you are a minor i.e. under the age of 18 years, you may use the Platform or access content on the Platform only under the supervision and prior consent/ permission of a parent or legal guardian.

As a minor if you wish to transact on the Platform, such transaction on the Platform may be made by your legal guardian or parents. Harikart reserves the right to terminate your membership and / or refuse to provide you with access to the Platform if it is brought to Harikart's notice or if it is discovered that You are under the age of 18 years and transacting on the Platform.`
  },
  {
    id: "account",
    title: "Your Account and Registration Obligations",
    content: `If You use the Platform, You shall be responsible for maintaining the confidentiality of your Display Name and Password and You shall be responsible for all activities that occur under your Display Name and Password. You agree that if You provide any information that is untrue, inaccurate, not current or incomplete or We have reasonable grounds to suspect that such information is untrue, inaccurate, not current or incomplete, or not in accordance with the this Terms of Use, We shall have the right to indefinitely suspend or terminate or block access of your membership on the Platform and refuse to provide You with access to the Platform.

Your mobile phone number and/or e-mail address is treated as Your primary identifier on the Platform. It is your responsibility to ensure that Your mobile phone number and your email address is up to date on the Platform at all times.

You must maintain confidentiality of the account information and for all the activities that occur under Your account. You must not share your login details, ie, username and password of Your account with any other person, else it would be considered breach of this Terms of Use.`
  },
  {
    id: "platform",
    title: "Platform for Transaction and Communication",
    content: `The Platform enables the Buyer and Seller to transact on the Platform. Harikart is not and cannot be a party to or control in any manner any transaction between the Platform's Users.

All commercial/contractual terms are offered by and agreed to between Buyers and Sellers alone. The commercial/contractual terms include without limitation price, shipping costs, payment methods, payment terms, date, period and mode of delivery, warranties related to products and services and after sales services related to products and services. Harikart does not have any control or does not determine or advise or in any way involve itself in the offering or acceptance of such commercial/contractual terms between the Buyers and Sellers.

Harikart does not make any representation or Warranty as to specifics (such as quality, value, saleability, etc) of the products or services proposed to be sold or offered to be sold or purchased on the Platform. Harikart does not implicitly or explicitly support or endorse the sale or purchase of any products or services on the Platform.`
  },
  {
    id: "charges",
    title: "Charges",
    content: `Harikart may charge a nominal fee for browsing and buying on the Platform. Harikart reserves the right to change its Fee Policy from time to time. In particular, Harikart may at its sole discretion introduce new services/fees and modify some or all of the existing services/fees offered on the Platform.

What is the platform fee? Fee levied by Harikart to sustain the efficient operations and continuous improvement of the platform, for a hassle-free app experience.

Changes to the Fee Policy shall be posted on the Platform and such changes shall automatically become effective immediately after they are posted on the Platform. Unless otherwise stated, all fees shall be quoted in Indian Rupees.`
  },
  {
    id: "use",
    title: "Use of the Platform",
    content: `You agree, undertake and confirm that Your use of Platform shall be strictly governed by the following binding principles. You shall not host, display, upload, modify, publish, transmit, update or share any information which belongs to another person and to which You do not have any right to; is grossly harmful, harassing, blasphemous, defamatory, obscene, pornographic, or otherwise unlawful in any manner; is misleading in any way; promotes illegal activities or conduct; infringes upon or violates any third party's rights.

You shall not use any "deep-link", "page-scrape", "robot", "spider" or other automatic device, program, algorithm or methodology to access, acquire, copy or monitor any portion of the Platform or any Content.

You shall at all times ensure full compliance with the applicable provisions of the Information Technology Act, 2000 and rules thereunder as applicable and as amended from time to time.`
  },
  {
    id: "privacy",
    title: "Privacy",
    content: `We view protection of Your privacy as a very important principle. We understand clearly that You and Your Personal Information is one of Our most important assets. We store and process Your Information including any sensitive financial information collected (as defined under the Information Technology Act, 2000), if any, on computers that may be protected by physical as well as reasonable technological security measures and procedures.

We may share personal information with our other corporate entities and affiliates. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out.

We may disclose personal information to third parties. This disclosure may be required for us to provide you access to our Services, to comply with our legal obligations, to enforce our User Agreement, to facilitate our marketing and advertising activities, or to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our Services.`
  },
  {
    id: "disclaimer",
    title: "Disclaimer of Warranties and Liability",
    content: `This Platform, all the materials and products (including but not limited to software) and services, included on or otherwise made available to You through this site are provided on "as is" and "as available" basis without any representation or warranties, express or implied except otherwise specified in writing.

Harikart will not be liable to You in any way or in relation to the Contents of, or use of, or otherwise in connection with, the Platform. Harikart does not warrant that this site; information, Content, materials, product (including software) or services included on or otherwise made available to You through the Platform; their servers; or electronic communication sent from Us are free of viruses or other harmful components.

IN NO EVENT SHALL HARIKART BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND IN CONNECTION WITH THESE TERMS OF USE, EVEN IF USER HAS BEEN INFORMED IN ADVANCE OF THE POSSIBILITY OF SUCH DAMAGES.`
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: `You shall indemnify and hold harmless Harikart, its owner, licensee, affiliates, subsidiaries, group companies (as applicable) and their respective officers, directors, agents, and employees, from any claim or demand, or actions including reasonable attorneys' fees, made by any third party or penalty imposed due to or arising out of Your breach of this Terms of Use, privacy Policy and other Policies, or Your violation of any law, rules or regulations or the rights (including infringement of intellectual property rights) of a third party.`
  },
  {
    id: "law",
    title: "Applicable Law",
    content: `Terms of Use shall be governed by and interpreted and construed in accordance with the laws of India. The place of jurisdiction shall be exclusively in Bangalore.

Unless otherwise specified, the material on the Platform is presented solely for the purpose of sale in India. Harikart make no representation that materials in the Platform are appropriate or available for use in other locations/Countries other than India. Those who choose to access this site from other locations/Countries other than India do so on their own initiative and Harikart is not responsible for supply of products/refund for the products ordered from other locations/Countries other than India, compliance with local laws, if and to the extent local laws are applicable.`
  },
  {
    id: "grievance",
    title: "Grievance Officer",
    content: `In accordance with Information Technology Act 2000 and rules made there under and the Consumer Protection (E-Commerce) Rules, 2020, the name and contact details of the Grievance Officer are provided below:

Karthik R
Associate Director
Harikart Internet Pvt Ltd
Block B (Begonia), 7th Floor Embassy Tech Village,
Outer Ring Road, Devarabeesanahalli Village,
Varthur Hobli, Bengaluru East Taluk,
Bengaluru District-560103, Karnataka, India.

Email: grievance.officer@harikart.com
Phone: 044-45614700
Time: Mon - Sat (9:00 - 18:00)`
  }
];

export default function Term() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#f9f8f6",
      minHeight: "100vh",
      color: "#1a1a2e"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .terms-wrapper {
          max-width: 2000px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        .terms-header {
          background: #1a1a2e;
          color: #fff;
          padding: 0 24px;
          margin: 0 -24px 0;
        }

        .terms-header-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 0 36px;
        }

        .brand-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Source Serif 4', serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c8a96e;
          margin-bottom: 20px;
        }

        .brand-tag::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: #c8a96e;
        }

        h1.terms-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 700;
          line-height: 1.15;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
        }

        .terms-subtitle {
          font-family: 'Source Serif 4', serif;
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          font-style: italic;
          letter-spacing: 0.3px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .terms-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px 0;
          flex-wrap: wrap;
        }

        .meta-item {
          font-family: 'Source Serif 4', serif;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .meta-item strong {
          color: rgba(255,255,255,0.7);
          font-weight: 600;
        }

        .meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
        }

        .disclaimer-bar {
          background: #fff8ec;
          border-left: 3px solid #c8a96e;
          margin: 32px 0;
          padding: 14px 20px;
          border-radius: 0 4px 4px 0;
        }

        .disclaimer-bar p {
          font-family: 'Source Serif 4', serif;
          font-size: 13px;
          color: #7a6030;
          font-style: italic;
          line-height: 1.5;
        }

        .toc-block {
          background: #fff;
          border: 1px solid #e8e2d9;
          border-radius: 6px;
          padding: 28px 32px;
          margin: 32px 0;
        }

        .toc-label {
          font-family: 'Source Serif 4', serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 18px;
        }

        .toc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 4px 24px;
        }

        .toc-link {
          font-family: 'Source Serif 4', serif;
          font-size: 14px;
          color: #1a1a2e;
          text-decoration: none;
          padding: 6px 0;
          border-bottom: 1px dotted #ddd;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: color 0.2s;
          cursor: pointer;
        }

        .toc-link:hover { color: #c8a96e; }

        .toc-num {
          font-size: 11px;
          color: #bbb;
          font-weight: 600;
          min-width: 20px;
          font-style: normal;
        }

        .sections-container {
          margin-top: 40px;
        }

        .section-block {
          background: #fff;
          border: 1px solid #e8e2d9;
          border-radius: 6px;
          margin-bottom: 2px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .section-block.active {
          border-color: #c8a96e;
          box-shadow: 0 2px 16px rgba(200,169,110,0.08);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
          cursor: pointer;
          user-select: none;
          transition: background 0.15s;
        }

        .section-header:hover {
          background: #faf8f5;
        }

        .section-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .section-number {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          color: #c8a96e;
          font-weight: 600;
          min-width: 26px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a2e;
          letter-spacing: -0.2px;
        }

        .chevron {
          width: 18px;
          height: 18px;
          border: 1.5px solid #ccc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s, border-color 0.2s;
          flex-shrink: 0;
        }

        .section-block.active .chevron {
          transform: rotate(180deg);
          border-color: #c8a96e;
        }

        .chevron svg {
          width: 9px;
          height: 9px;
          fill: none;
          stroke: #888;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .section-block.active .chevron svg {
          stroke: #c8a96e;
        }

        .section-body {
          display: none;
          padding: 0 28px 28px 70px;
          border-top: 1px solid #f0ebe3;
        }

        .section-block.active .section-body {
          display: block;
        }

        .section-body p {
          font-family: 'Source Serif 4', serif;
          font-size: 15px;
          line-height: 1.85;
          color: #3a3a4a;
          margin-top: 18px;
        }

        .section-body p + p {
          margin-top: 14px;
        }

        .footer-note {
          background: #1a1a2e;
          color: rgba(255,255,255,0.5);
          margin: 48px -24px -80px;
          padding: 28px 24px;
          text-align: center;
        }

        .footer-note p {
          font-family: 'Source Serif 4', serif;
          font-size: 12.5px;
          letter-spacing: 0.3px;
          line-height: 1.7;
        }

        .footer-note a {
          color: #c8a96e;
          text-decoration: none;
        }

        @media (max-width: 600px) {
          .section-body { padding-left: 28px; }
          .toc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="terms-wrapper">
        {/* Header */}
        <div className="terms-header">
          <div className="terms-header-inner">
            <div className="brand-tag">Harikart</div>
            <h1 className="terms-title">Terms of Use</h1>
            <p className="terms-subtitle">
              Please read these terms carefully before using the Platform. Your use constitutes acceptance of these terms.
            </p>
            <div className="terms-meta">
              <span className="meta-item"><strong>Effective Date:</strong> January 1, 2024</span>
              <span className="meta-dot" />
              <span className="meta-item"><strong>Governed by:</strong> Laws of India</span>
              <span className="meta-dot" />
              <span className="meta-item"><strong>Jurisdiction:</strong> Bangalore</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-bar">
          <p>
            <strong>Disclaimer:</strong> In case of any discrepancy or difference, the English version will take precedence over any translation.
            This document is an electronic record under the Information Technology Act, 2000.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="toc-block">
          <div className="toc-label">Table of Contents</div>
          <div className="toc-grid">
            {termsData.map((section, i) => (
              <a
                key={section.id}
                className="toc-link"
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <span className="toc-num">{String(i + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="sections-container">
          {termsData.map((section, i) => (
            <div
              key={section.id}
              id={section.id}
              className={`section-block${activeSection === section.id ? " active" : ""}`}
            >
              <div
                className="section-header"
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <div className="section-header-left">
                  <span className="section-number">{String(i + 1).padStart(2, "0")}</span>
                  <span className="section-title">{section.title}</span>
                </div>
                <div className="chevron">
                  <svg viewBox="0 0 10 6">
                    <polyline points="1,1 5,5 9,1" />
                  </svg>
                </div>
              </div>
              <div className="section-body">
                {section.content.split("\n\n").map((para, j) => (
                  <p key={j}>{para.trim()}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="footer-note">
          <p>
            For queries, visit our{" "}
            <a href="https://www.harikart.com/helpcentre">Help Centre</a> or contact our Grievance Officer at{" "}
            <a href="mailto:grievance.officer@harikart.com">grievance.officer@harikart.com</a>
            <br />© 2024 Harikart Internet Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}