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

function FeedbackPage() {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
    const { data } = await api.get("/feedback");
    setFeedbacks(data);
    } catch (err) {
      console.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!rating || !comment.trim()) {
      setError("Please provide both rating and comment");
      setSubmitting(false);
      return;
    }
    if (comment.length > 200) {
      setError("Comment must be 200 characters or less");
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/feedback", { rating, comment: comment.trim() });
      setSuccess("Thank you for your feedback! 🎉");
      setComment("");
      setRating(5);
      fetchFeedbacks();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedbacks();
    } catch (err) {
      alert("Failed to delete feedback");
    }
  };

  const FeedbackStarRating = ({ rating }) => {
    return (
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: "24px",
              color: star <= rating ? "#fbbf24" : "#9ca3af", // Darker gray
              textShadow: star <= rating ? "0 0 8px rgba(251, 191, 36, 0.3)" : "none"
            }}
          >
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
        <span style={{ marginLeft: "8px", fontSize: "14px", color: "#64748b" }}>
          ({rating}/5)
        </span>
      </div>
    );
  };

  const StarRating = ({ rating, interactive = false, onRatingChange = null }) => {
    return (
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            style={{
              fontSize: "24px",
              color: star <= rating ? "#fbbf24" : "#9ca3af", // Darker gray
              cursor: interactive ? "pointer" : "default",
              transition: "all 0.2s ease",
              textShadow: star <= rating ? "0 0 8px rgba(251, 191, 36, 0.3)" : "none"
            }}
            onMouseEnter={(e) => {
              if (interactive) {
                e.target.style.transform = "scale(1.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (interactive) {
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
        {!interactive && (
          <span style={{ marginLeft: "8px", fontSize: "14px", color: "#64748b" }}>
            ({rating}/5)
          </span>
        )}
      </div>
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
            💬
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
            Customer Feedback
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
            marginBottom: "0",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Share your experience and read what our customers have to say about our services
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "40px",
            marginBottom: "60px"
          }}>
            
            {/* Feedback Form */}
            {user && (
              <AnimatedSection delay={200}>
                <div style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "40px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  order: window.innerWidth < 768 ? 2 : 1
                }}>
                  <h2 style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    ✍️ Share Your Experience
                  </h2>
                  
                  <p style={{
                    fontSize: "16px",
                    color: "#64748b",
                    marginBottom: "32px"
                  }}>
                    Help us improve by sharing your thoughts about our service
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "32px" }}>
                      <label style={{
                        display: "block",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "12px"
                      }}>
                        How would you rate our service?
                      </label>
                      <StarRating 
                        rating={rating} 
                        interactive={true} 
                        onRatingChange={setRating}
                      />
                    </div>

                    <div style={{ marginBottom: "32px" }}>
                      <label style={{
                        display: "block",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "12px"
                      }}>
                        Tell us about your experience
                      </label>
            <textarea
              value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about our service..."
              maxLength={200}
                        rows={5}
              required
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
                          minHeight: "140px"
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
                      <div style={{
                        fontSize: "14px",
                        color: comment.length > 180 ? "#dc2626" : "#64748b",
                        textAlign: "right",
                        marginTop: "8px"
                      }}>
                        {comment.length}/200 characters
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={submitting || !comment.trim()}
                      style={{
                        width: "100%",
                        background: submitting || !comment.trim()
                          ? "#9ca3af" 
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        padding: "16px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: submitting || !comment.trim() ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.5px",
                        marginBottom: "24px"
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting && comment.trim()) {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!submitting && comment.trim()) {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    >
                      {submitting ? "Submitting..." : "Submit Feedback"}
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
                </div>
              </AnimatedSection>
            )}

            {/* Statistics Card */}
            <AnimatedSection delay={user ? 400 : 200}>
              <div style={{
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                borderRadius: "24px",
                padding: "40px",
                color: "#fff",
                textAlign: "center",
                order: window.innerWidth < 768 ? 1 : 2
              }}>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "24px"
                }}>
                  📊 Feedback Statistics
                </h3>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  marginBottom: "32px"
          }}>
            <div>
                    <div style={{
                      fontSize: "36px",
                      fontWeight: "800",
                      color: "#fbbf24",
                      marginBottom: "8px"
                    }}>
                      {feedbacks.length}
                    </div>
                    <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                      Total Reviews
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: "36px",
                      fontWeight: "800",
                      color: "#10b981",
                      marginBottom: "8px"
                    }}>
                      {feedbacks.length > 0 ? 
                        (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) 
                        : "0.0"
                      }
                    </div>
                    <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                      Average Rating
                    </div>
                  </div>
            </div>

                {!user && (
                  <div style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginTop: "24px"
                  }}>
                    <p style={{
                      fontSize: "16px",
                      marginBottom: "16px",
                      color: "rgba(255,255,255,0.9)"
                    }}>
                      Want to share your experience?
                    </p>
                    <a 
                      href="/login" 
                style={{
                        display: "inline-block",
                        background: "#fff",
                        color: "#1e293b",
                        padding: "12px 24px",
                        borderRadius: "25px",
                        textDecoration: "none",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      Login to Leave Feedback
                    </a>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Feedback List */}
          <AnimatedSection>
            <div style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "40px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                🗣️ What Our Customers Say
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
                  Loading feedback...
                </div>
              ) : feedbacks.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#64748b"
                }}>
                  <div style={{
                    fontSize: "64px",
                    marginBottom: "16px"
                  }}>
                    💭
                  </div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#374151"
                  }}>
                    No feedback yet
                  </h3>
                  <p style={{ fontSize: "14px" }}>
                    Be the first to share your experience with our services!
                  </p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                  gap: "24px"
                }}>
                  {feedbacks.map((feedback) => (
                    <AnimatedSection key={feedback._id}>
                      <div 
                        style={{
                          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "16px",
                          padding: "24px",
                          transition: "all 0.3s ease",
                          position: "relative"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
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
                          marginBottom: "16px"
                        }}>
                          <div>
                            <h4 style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              color: "#1e293b",
                              margin: "0 0 8px 0"
                            }}>
                              {feedback.name || "Anonymous Customer"}
                            </h4>
                            <FeedbackStarRating rating={feedback.rating} />
                          </div>
                          
                          {user?.isAdmin && (
                            <button
                              onClick={() => handleDelete(feedback._id)}
                              style={{
                                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = "scale(1)";
                              }}
                            >
                Delete
              </button>
            )}
          </div>
                        
                        <p style={{
                          fontSize: "16px",
                          color: "#475569",
                          lineHeight: "1.6",
                          marginBottom: "16px",
                          fontStyle: "italic"
                        }}>
                          "{feedback.comment}"
                        </p>
                        
                        <div style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          textAlign: "right"
                        }}>
                          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

export default FeedbackPage;
