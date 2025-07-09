import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";
import { useInView } from "react-intersection-observer";

// Animated Section Component
const AnimatedSection = ({ children, delay = 0 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      style={{
        transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
      }}
    >
      {children}
    </div>
  );
};

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: "",
    contactNumber: "",
    address: "",
    isAdmin: false,
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    async function fetchProfile() {
      setLoading(true);
      try {
        const { data } = await api.get(`/profile?email=${encodeURIComponent(user.email)}`);
        setProfile({
          name: data.name || "",
          contactNumber: data.contactNumber || "",
          address: data.address || "",
          isAdmin: !!data.isAdmin,
        });
        setBookings(data.bookings || []);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  function handleChange(e) {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.put("/profile", { ...profile, email: user.email });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        fontSize: "18px",
        fontFamily: "'Poppins', sans-serif"
      }}>
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
      padding: "40px 20px",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <AnimatedSection>
          <div style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "40px",
            marginBottom: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              fontSize: "48px"
            }}>
              👤
            </div>
            
            <h1 style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "8px"
            }}>
              My Profile
            </h1>
            
            <p style={{
              fontSize: "16px",
              color: "#64748b",
              marginBottom: "24px"
            }}>
              Manage your account information and view booking history
            </p>

            {/* Account Type Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: profile.isAdmin 
                ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "25px",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              boxShadow: profile.isAdmin 
                ? "0 4px 12px rgba(245, 158, 11, 0.3)"
                : "0 4px 12px rgba(16, 185, 129, 0.3)"
            }}>
              {profile.isAdmin ? "🔑 ADMIN ACCOUNT" : "👤 USER ACCOUNT"}
            </div>
          </div>
        </AnimatedSection>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "32px"
        }}>
          {/* Profile Form */}
          <AnimatedSection delay={200}>
            <div style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                ✏️ Edit Profile
              </h2>

              {loading ? (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px",
                  color: "#64748b"
                }}>
                  <div className="spinner" />
                  Loading profile...
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      style={{
                        width: "100%",
                        padding: "16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontFamily: "'Poppins', sans-serif",
                        outline: "none",
                        transition: "all 0.3s ease",
                        backgroundColor: "#fff",
                        boxSizing: "border-box"
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
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={profile.contactNumber}
                      onChange={handleChange}
                      placeholder="Enter your contact number"
                      style={{
                        width: "100%",
                        padding: "16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontFamily: "'Poppins', sans-serif",
                        outline: "none",
                        transition: "all 0.3s ease",
                        backgroundColor: "#fff",
                        boxSizing: "border-box"
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
                  </div>

                  <div style={{ marginBottom: "32px" }}>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontFamily: "'Poppins', sans-serif",
                        outline: "none",
                        transition: "all 0.3s ease",
                        backgroundColor: "#fff",
                        boxSizing: "border-box",
                        resize: "vertical",
                        minHeight: "120px"
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
                  </div>

                  <button 
                    type="submit" 
                    disabled={saving}
                    style={{
                      width: "100%",
                      background: saving 
                        ? "#9ca3af" 
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "16px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: saving ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      letterSpacing: "0.5px",
                      marginBottom: "24px"
                    }}
                    onMouseEnter={(e) => {
                      if (!saving) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!saving) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    {saving ? "Saving Changes..." : "Save Profile"}
                  </button>

                  {error && (
                    <div style={{
                      background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                      color: "#dc2626",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      marginBottom: "16px",
                      border: "1px solid #fecaca",
                      textAlign: "center"
                    }}>
                      {error}
                    </div>
                  )}

                  {success && (
                    <div style={{
                      background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                      color: "#16a34a",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      marginBottom: "16px",
                      border: "1px solid #bbf7d0",
                      textAlign: "center"
                    }}>
                      {success}
                    </div>
                  )}
                </form>
              )}
            </div>
          </AnimatedSection>
          
          {/* Booking History */}
          <AnimatedSection delay={400}>
            <div style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                📅 Booking History
              </h2>

              {bookings.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#64748b"
                }}>
                  <div style={{
                    fontSize: "64px",
                    marginBottom: "16px"
                  }}>
                    📋
                  </div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#374151"
                  }}>
                    No bookings yet
                  </h3>
                  <p style={{ fontSize: "14px" }}>
                    Your booking history will appear here once you make your first appointment.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  maxHeight: "500px",
                  overflowY: "auto"
                }}>
                  {bookings.map((booking, index) => (
                    <div 
                      key={booking._id} 
                      style={{
                        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "20px",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px"
                      }}>
                        <h3 style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1e293b",
                          margin: 0
                        }}>
                          {booking.service || "Service Details"}
                        </h3>
                        <span style={{
                          background: booking.status === "Completed" 
                            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                            : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          {booking.status || "Pending"}
                        </span>
                      </div>
                      
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        fontSize: "14px",
                        color: "#64748b"
                      }}>
                        <div>
                          <strong style={{ color: "#374151" }}>Date:</strong><br />
                          {booking.date ? new Date(booking.date).toLocaleDateString() : "Not specified"}
                        </div>
                        <div>
                          <strong style={{ color: "#374151" }}>Time:</strong><br />
                          {booking.time || "Not specified"}
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div style={{
                          marginTop: "12px",
                          fontSize: "14px",
                          color: "#64748b"
                        }}>
                          <strong style={{ color: "#374151" }}>Notes:</strong><br />
                          {booking.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
