import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";
import { useInView } from "react-intersection-observer";

// Animated Section Component
const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {children}
    </div>
  );
};


function formatDate(date) {
  const d = new Date(date);
  return !isNaN(d) ? d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "";
}

function formatDateShort(date) {
  const d = new Date(date);
  return !isNaN(d) ? d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) : "";
}

function groupBookingsByDate(bookings) {
  const grouped = {};
  bookings.forEach(booking => {
    const date = booking.date.split('T')[0]; // Get date part only
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(booking);
  });
  
  // Sort dates
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
  const result = {};
  sortedDates.forEach(date => {
    result[date] = grouped[date].sort((a, b) => a.time.localeCompare(b.time));
  });
  
  return result;
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get("/bookings")
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load bookings.");
        setLoading(false);
      });
  }, []);

  // Mark booking as completed
  async function handleMarkDone(bookingId) {
    try {
      await api.put(`/bookings/status/${bookingId}`);
      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId ? { ...b, status: "Completed" } : b
        )
      );
    } catch {
      setError("Failed to update booking.");
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.contact && booking.contact.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "pending" && (!booking.status || booking.status === "Pending")) ||
      (statusFilter === "completed" && booking.status === "Completed");
    
    return matchesSearch && matchesStatus;
  });

  const groupedBookings = groupBookingsByDate(filteredBookings);
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === "Completed").length;
  const pendingBookings = totalBookings - completedBookings;

  const StatusBadge = ({ status }) => {
    const isCompleted = status === "Completed";
    return (
      <span style={{
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        background: isCompleted 
          ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" 
          : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        color: isCompleted ? "#065f46" : "#92400e",
        border: `1px solid ${isCompleted ? "#10b981" : "#f59e0b"}`
      }}>
        {isCompleted ? "✅ Completed" : "⏳ Pending"}
      </span>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        padding: "80px 20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
          opacity: 0.3
        }} />
        
        <div style={{ 
          maxWidth: "800px", 
          margin: "0 auto", 
          position: "relative", 
          zIndex: 1 
        }}>
          <div style={{
            fontSize: "64px",
            marginBottom: "24px"
          }}>
            📅
          </div>
          
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            fontWeight: "800",
            marginBottom: "24px",
            background: "linear-gradient(45deg, #fff 30%, #f1f5f9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: "1.2"
          }}>
            Booking Calendar
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
            marginBottom: "0",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            {user?.isAdmin 
              ? "Manage and track all service bookings in one place"
              : "View your upcoming and completed service appointments"
            }
          </p>
        </div>
      </section>

      {/* Statistics Cards */}
      <section style={{ padding: "40px 20px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
              marginBottom: "40px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                borderRadius: "20px",
                padding: "32px",
                color: "#fff",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  marginBottom: "8px",
                  color: "#60a5fa"
                }}>
                  {totalBookings}
                </div>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  Total Bookings
                </div>
              </div>

              <div style={{
                background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
                borderRadius: "20px",
                padding: "32px",
                color: "#fff",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  marginBottom: "8px",
                  color: "#34d399"
                }}>
                  {completedBookings}
                </div>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  Completed
                </div>
              </div>

              <div style={{
                background: "linear-gradient(135deg, #92400e 0%, #b45309 100%)",
                borderRadius: "20px",
                padding: "32px",
                color: "#fff",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  marginBottom: "8px",
                  color: "#fbbf24"
                }}>
                  {pendingBookings}
                </div>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  Pending
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "0 20px 60px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Controls */}
          <AnimatedSection delay={200}>
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              marginBottom: "40px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                🔍 Search & Filter
              </h2>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "24px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px"
                  }}>
                    Search bookings
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
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
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px"
                  }}>
                    Filter by status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
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
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {loading ? (
            <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
              <div className="spinner" />
              Loading bookings...
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", color: "#dc2626", padding: "40px" }}>
              {error}
            </div>
          ) : Object.keys(groupedBookings).length > 0 ? (
            Object.entries(groupedBookings).map(([date, dailyBookings]) => (
              <AnimatedSection key={date} className="date-group" delay={200}>
                <div style={{ marginBottom: "40px" }}>
                  <h2 style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#374151",
                    marginBottom: "24px",
                    paddingBottom: "12px",
                    borderBottom: "3px solid #667eea"
                  }}>
                    {formatDate(date)}
                  </h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "24px"
                  }}>
                    {dailyBookings.map(booking => (
                      <div 
                        key={booking._id}
                        style={{
                          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "16px",
                          padding: "24px",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {/* Booking Header */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "16px"
                        }}>
                          <div>
                            <h4 style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              color: "#1e293b",
                              margin: "0 0 4px 0"
                            }}>
                              {booking.name}
                            </h4>
                            <div style={{
                              fontSize: "14px",
                              color: "#64748b",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px"
                            }}>
                              🕒 {booking.time || "Time not set"}
                            </div>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>

                        {/* Service Info */}
                        <div style={{
                          background: "#fff",
                          borderRadius: "12px",
                          padding: "16px",
                          marginBottom: "16px"
                        }}>
                          <div style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}>
                            🚗 {booking.service}
                          </div>
                          {booking.notes && (
                            <div style={{
                              fontSize: "14px",
                              color: "#64748b",
                              fontStyle: "italic"
                            }}>
                              "{booking.notes}"
                            </div>
                          )}
                        </div>

                        {/* Contact Info & Actions */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          {user?.isAdmin && (
                            <div style={{
                              fontSize: "14px",
                              color: "#64748b",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px"
                            }}>
                              📞 {booking.contact}
                            </div>
                          )}
                          
                {user?.isAdmin && (
                              <div>
                    {booking.status === "Completed" ? (
                                  <span style={{
                                    fontSize: "14px",
                                    color: "#10b981",
                                    fontWeight: "600"
                                  }}>
                                    ✅ Completed
                                  </span>
                    ) : (
                      <button
                        onClick={() => handleMarkDone(booking._id)}
                                    style={{
                                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "8px",
                                      padding: "8px 16px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                      transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.transform = "translateY(-2px)";
                                      e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.transform = "translateY(0)";
                                      e.target.style.boxShadow = "none";
                                    }}
                                  >
                                    Mark Complete
                      </button>
                    )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
              <div style={{
                fontSize: "64px",
                marginBottom: "16px"
              }}>
                {filteredBookings.length === 0 && bookings.length > 0 ? "🔍" : "📅"}
              </div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#374151"
              }}>
                No bookings match your search
              </h3>
              <p style={{ fontSize: "16px", margin: 0 }}>
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
