import React from "react";
import { useParams } from "react-router-dom";

const MethodDetailPage = () => {
  const { method } = useParams();

  const content = {
    sms: {
      title: "SMS Verification",
      desc: "SMS sends a one-time password to your mobile number."
    },
    authenticator: {
      title: "Authenticator App",
      desc: "Apps like Google Authenticator generate secure time-based codes."
    },
    email: {
      title: "Email Verification",
      desc: "You receive OTP or links in your registered email."
    }
  };

  const data = content[method];

  if (!data) {
    return <h2 style={{ padding: "20px" }}>Invalid method</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{data.title}</h1>
      <p>{data.desc}</p>
    </div>
  );
};

export default MethodDetailPage;