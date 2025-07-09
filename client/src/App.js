import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import SelfAssessPage from "./pages/SelfAssessPage";
import FeedbackPage from "./pages/FeedbackPage"; // <-- NEW: Import FeedbackPage
import api from "./api";

// Context to manage user authentication globally
export const AuthContext = createContext();

function NavBar({ user, onLogout }) {
  return (
    <nav style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "16px 24px",
      marginBottom: "0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
      }}>
        {/* Logo/Brand */}
        <Link 
          to="/" 
          style={{ 
            color: "#fff", 
            textDecoration: "none", 
            fontSize: "24px", 
            fontWeight: "700",
            letterSpacing: "1px"
          }}
        >
          KAR DETAILING
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <Link 
            style={{ 
              color: "#fff", 
              textDecoration: "none", 
              padding: "8px 16px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
              fontSize: "16px",
              fontWeight: "500"
            }} 
            to="/"
            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
          >
            Home
          </Link>
          <Link 
            style={{ 
              color: "#fff", 
              textDecoration: "none", 
              padding: "8px 16px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
              fontSize: "16px",
              fontWeight: "500"
            }} 
            to="/self-assess"
            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
          >
            Self-Assessment
          </Link>
          <Link 
            style={{ 
              color: "#fff", 
              textDecoration: "none", 
              padding: "8px 16px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
              fontSize: "16px",
              fontWeight: "500"
            }} 
            to="/feedback"
            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
          >
            Feedback
          </Link>
          
          {!user && (
            <>
              <Link 
                style={{ 
                  color: "#fff", 
                  textDecoration: "none", 
                  padding: "10px 20px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                  fontSize: "16px",
                  fontWeight: "500"
                }} 
                to="/login"
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.2)";
                  e.target.style.borderColor = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                }}
              >
                Login
              </Link>
              <Link 
                style={{ 
                  color: "#667eea", 
                  textDecoration: "none", 
                  padding: "10px 20px",
                  background: "#fff",
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }} 
                to="/register"
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                Register
              </Link>
            </>
          )}
          
          {user && (
            <>
              <Link 
                style={{ 
                  color: "#fff", 
                  textDecoration: "none", 
                  padding: "8px 16px",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                  fontSize: "16px",
                  fontWeight: "500"
                }} 
                to="/booking"
                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                Book Service
              </Link>
              <Link 
                style={{ 
                  color: "#fff", 
                  textDecoration: "none", 
                  padding: "8px 16px",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                  fontSize: "16px",
                  fontWeight: "500"
                }} 
                to="/calendar"
                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                Calendar
              </Link>
              <Link 
                style={{ 
                  color: "#fff", 
                  textDecoration: "none", 
                  padding: "8px 16px",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                  fontSize: "16px",
                  fontWeight: "500"
                }} 
                to="/profile"
                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                My Profile
              </Link>
              
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ 
                  color: "rgba(255,255,255,0.9)", 
                  fontSize: "14px",
                  background: "rgba(255,255,255,0.1)",
                  padding: "6px 12px",
                  borderRadius: "15px"
                }}>
                  {user.email}
                </span>
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                  onClick={onLogout}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.2)";
                    e.target.style.borderColor = "rgba(255,255,255,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.borderColor = "rgba(255,255,255,0.3)";
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  // Persistent login: fetch profile from backend if cookie exists
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/auth/profile"); // returns { email, isAdmin, ... }
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    }
    fetchProfile();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <NavBar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/self-assess" element={<SelfAssessPage />} />
          <Route path="/feedback" element={<FeedbackPage />} /> {/* NEW: Feedback page route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking" element={user ? <BookingPage /> : <LoginPage />} />
          <Route path="/calendar" element={user ? <CalendarPage /> : <LoginPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <LoginPage />} />
          {/* ADMIN ROUTE (admin only) */}
          <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <LoginPage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
