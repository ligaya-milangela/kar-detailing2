import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .register-card { animation: fadeIn 0.8s ease-out; }
      `}</style>

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
        opacity: 0.3
      }} />

      <div className="register-card" style={{
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        padding: "48px 40px",
        maxWidth: "420px",
        width: "100%",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "80px", height: "80px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "20px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "32px", margin: "0 auto 20px"
          }}>
            ✨
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
            Create Account
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>
            Join KAR DETAILING for premium car services
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <InputField type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" label="Email Address" />
          <InputField type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a secure password" label="Password" hint="Use 8 or more characters with a mix of letters and numbers" />

          <SubmitButton loading={loading} text="Create Account" />

          {error && <MessageBox text={error} type="error" />}
          {success && <MessageBox text={success} type="success" />}
        </form>

        <div style={{ textAlign: "center", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 16px", lineHeight: "1.5" }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 16px" }}>
            Already have an account?
          </p>
          <Link to="/login" style={linkStyle}>
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, hint, ...props }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <label style={{
        display: "block", fontSize: "14px", fontWeight: "600",
        color: "#374151", marginBottom: "8px"
      }}>{label}</label>
      <input
        {...props}
        style={{
          width: "100%", padding: "16px", border: "2px solid #e5e7eb",
          borderRadius: "12px", fontSize: "16px", fontFamily: "'Poppins', sans-serif",
          backgroundColor: "#fff", outline: "none", boxSizing: "border-box",
          transition: "all 0.3s ease"
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#667eea";
          e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e5e7eb";
          e.target.style.boxShadow = "none";
        }}
        required
      />
      {hint && <p style={{ fontSize: "12px", color: "#6b7280", margin: "8px 0 0" }}>{hint}</p>}
    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%", background: loading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff", border: "none", borderRadius: "12px", padding: "16px",
        fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease", letterSpacing: "0.5px", marginBottom: "24px"
      }}
    >
      {loading ? "Creating Account..." : text}
    </button>
  );
}

function MessageBox({ text, type }) {
  const isError = type === "error";
  const styles = {
    background: isError ? "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)" : "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
    color: isError ? "#dc2626" : "#16a34a",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    border: `1px solid ${isError ? "#fecaca" : "#bbf7d0"}`,
    textAlign: "center"
  };
  return <div style={styles}>{text}</div>;
}

const linkStyle = {
  color: "#667eea",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
  padding: "8px 16px",
  borderRadius: "8px",
  transition: "all 0.3s ease"
};
