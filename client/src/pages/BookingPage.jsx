import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";
import { useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";

// Animated Section Component
const AnimatedSection = ({ children, className = "" }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        transition: `opacity 0.8s ease-out, transform 0.8s ease-out`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
      }}
    >
      {children}
    </div>
  );
};

const timeOptions = [
  "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
  "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"
];

const severityLabels = {
  Severe: "🌊 Severe / Flooded Condition",
  Moderate: "🚙 Moderate Condition",
  Light: "🚗 Light Condition"
};

const serviceTypeLabels = {
  interior: "Interior Only",
  exterior: "Exterior Only",
  both: "Full Service"
};

const serviceInfo = {
  Severe: {
    icon: "🌊",
    color: "#dc2626",
    description: "Deep restoration for heavily damaged or flooded vehicles"
  },
  Moderate: {
    icon: "🚙", 
    color: "#f59e0b",
    description: "Comprehensive cleaning for moderately used vehicles"
  },
  Light: {
    icon: "🚗",
    color: "#10b981",
    description: "Basic maintenance cleaning for well-maintained vehicles"
  }
};

function getDropdownOptions(suggestion) {
  if (suggestion) {
    const label = `${severityLabels[suggestion.category]} (${serviceTypeLabels[suggestion.serviceType]})`;
    return [
      {
        value: label,
        label: label,
        severity: suggestion.category,
        type: suggestion.serviceType
      }
    ];
  }
  
  const allOptions = [];
  for (const [catKey, catLabel] of Object.entries(severityLabels)) {
    for (const [typeKey, typeLabel] of Object.entries(serviceTypeLabels)) {
      allOptions.push({
        value: `${catLabel} (${typeLabel})`,
        label: `${catLabel} (${typeLabel})`,
        severity: catKey,
        type: typeKey
      });
    }
  }
  return allOptions;
}

export default function BookingPage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const suggestion = location.state?.suggestedService;

  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
    service: "",
    notes: ""
  });
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Autofill from profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user || !user.email) return;
      try {
        const { data } = await api.get(`/profile?email=${encodeURIComponent(user.email)}`);
        setForm(f => ({
          ...f,
          name: data.name || "",
          contact: data.contactNumber || ""
        }));
      } catch (err) {}
    }
    fetchProfile();
  }, [user]);

  // Handle suggestion from self-assessment
  useEffect(() => {
    if (suggestion) {
      const matchedLabel = `${severityLabels[suggestion.category]} (${serviceTypeLabels[suggestion.serviceType]})`;
      setForm(f => ({
        ...f,
        service: matchedLabel
      }));
      setPrice(suggestion.price ? `₱${suggestion.price}` : "");
    }
  }, [suggestion]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "service") setPrice("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/bookings", form);
      setSuccess("🎉 Booking submitted successfully! We'll contact you soon to confirm the details.");
      
      // Reset form but preserve autofilled data
      if (user && user.email) {
        const { data } = await api.get(`/profile?email=${encodeURIComponent(user.email)}`);
        setForm(f => ({
          ...f,
          name: data.name || "",
          contact: data.contactNumber || "",
          date: "",
          time: "",
          service: "",
          notes: ""
        }));
      } else {
        setForm({
          name: "",
          contact: "",
          date: "",
          time: "",
          service: "",
          notes: ""
        });
      }
      setPrice("");
      setStep(1);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const serviceOptions = getDropdownOptions(suggestion);
  const selectedServiceInfo = form.service ? serviceOptions.find(opt => opt.value === form.service) : null;

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

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
            Book Your Service
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
            marginBottom: "0",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Schedule your premium car detailing service with our professional team
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* Suggested Service Banner */}
          {suggestion && (
            <AnimatedSection>
              <div style={{
                background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                border: "2px solid #10b981",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "40px",
                textAlign: "center"
              }}>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#065f46",
                  marginBottom: "8px"
                }}>
                  🌟 We've pre-selected a service based on your assessment!
                </h3>
                <p style={{
                  margin: 0,
                  color: "#065f46"
                }}>
                  Feel free to change it if you'd like.
                </p>
              </div>
            </AnimatedSection>
          )}

          {/* Form Container */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "40px",
            alignItems: "flex-start"
          }}>
            {/* Form */}
            <AnimatedSection className="form-container">
              <div style={{
                background: "#fff",
                borderRadius: "24px",
                padding: "40px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
              }}>
        <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <AnimatedSection>
                      <div>
                        <h2 style={styles.formSectionTitle}>
                          <span style={styles.formSectionIcon}>👤</span>
                          Step 1: Your Information
                        </h2>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="name"
                            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
                            style={styles.input}
          />
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Contact Number</label>
          <input
                            type="tel"
            name="contact"
                            placeholder="Enter your contact number"
            value={form.contact}
            onChange={handleChange}
            required
                            style={styles.input}
                          />
                        </div>
                        <button 
                          type="button"
                          style={styles.nextButton}
                          onClick={() => setStep(2)}
                        >
                          Next Step →
                        </button>
                      </div>
                    </AnimatedSection>
                  )}

                  {/* Step 2: Service Selection */}
                  {step === 2 && (
                    <AnimatedSection>
                      <div>
                        <h2 style={styles.formSectionTitle}>
                          <span style={styles.formSectionIcon}>🛠️</span>
                          Step 2: Choose Your Service
                        </h2>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Service Type</label>
                          <select
                            style={styles.input}
                            name="service"
                            value={form.service}
                            onChange={handleChange}
                            required
                          >
                            <option value="" disabled>Select a service</option>
                            {serviceOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Additional Notes (Optional)</label>
                          <textarea
                            style={styles.textarea}
                            name="notes"
                            placeholder="e.g., focus on pet hair removal, specific stains"
                            value={form.notes}
                            onChange={handleChange}
                          />
                        </div>
                        <div style={{...styles.buttonGroup, justifyContent: 'space-between'}}>
                          <button 
                            type="button"
                            style={{...styles.prevButton, width: '48%'}}
                            onClick={() => setStep(1)}
                          >
                            ← Previous
                          </button>
                          <button 
                            type="button"
                            style={{...styles.nextButton, width: '48%'}}
                            onClick={() => setStep(3)}
                          >
                            Next Step →
                          </button>
                        </div>
                      </div>
                    </AnimatedSection>
                  )}

                  {/* Step 3: Schedule */}
                  {step === 3 && (
                    <AnimatedSection>
                      <div>
                        <h2 style={styles.formSectionTitle}>
                          <span style={styles.formSectionIcon}>🗓️</span>
                          Step 3: Schedule
                        </h2>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Select Date</label>
          <input
            style={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
                            min={today}
          />
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Select Time</label>
          <select
            style={styles.input}
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          >
                            <option value="">Select a time</option>
                            {timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
                        </div>
                        <div style={{...styles.buttonGroup, justifyContent: 'space-between'}}>
                          <button 
                            type="button"
                            style={{...styles.prevButton, width: '48%'}}
                            onClick={() => setStep(2)}
                          >
                            ← Previous
                          </button>
                          <button 
                            type="submit"
                            style={{...styles.submitButton, width: '48%'}}
                            disabled={loading}
                          >
                            {loading ? 'Submitting...' : 'Book Now 🚀'}
                          </button>
                        </div>
                      </div>
                    </AnimatedSection>
                  )}
                </form>
              </div>
            </AnimatedSection>

            {/* Service Info Card */}
            <AnimatedSection className="service-card-container">
              <div style={{
                background: "#fff",
                borderRadius: "24px",
                padding: "40px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1e293b",
                  marginBottom: "24px",
                  paddingBottom: "16px",
                  borderBottom: "2px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: '24px' }}>ℹ️</span> Service Details
                </h3>
                
                {form.service && selectedServiceInfo ? (
                  <div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "24px"
                    }}>
                      <div style={{
                        ...styles.serviceIcon,
                        backgroundColor: serviceInfo[selectedServiceInfo.severity]?.color
                      }}>
                        {serviceInfo[selectedServiceInfo.severity]?.icon}
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#1e293b",
                          margin: 0
                        }}>
                          {form.service}
                        </h4>
                        <p style={{ margin: "4px 0 0 0", color: "#64748b" }}>
                          {serviceInfo[selectedServiceInfo.severity]?.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: "16px" }}>
                      <p style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}>
                        <span style={{ fontWeight: 600, color: '#374151' }}>Severity:</span>
                        <span style={{
                          background: serviceInfo[selectedServiceInfo.severity]?.color,
                          padding: "4px 8px",
                          borderRadius: "6px",
                          color: "#fff",
                          fontWeight: 600
                        }}>
                          {selectedServiceInfo.severity}
                        </span>
                      </p>
                      <p style={styles.priceDetailRow}>
                        <span style={{ fontWeight: 600, color: '#374151' }}>Type:</span>
                        <span>{serviceTypeLabels[selectedServiceInfo.type]}</span>
                      </p>
                      <p style={styles.priceDetailRow}>
                        <span style={{ fontWeight: 600, color: '#374151' }}>Estimated Price:</span>
                        <span style={{ fontWeight: 700, fontSize: "18px", color: "#1e293b" }}>
                          {price || "Select service to see price"}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                    <p>Select a service to see the details and estimated price here.</p>
            </div>
          )}
              </div>
            </AnimatedSection>
          </div>

          {/* Success/Error Modals */}
          {(success || error) && (
            <AnimatedSection>
              <div style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                background: success ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                color: success ? "#16a34a" : "#dc2626",
                padding: "16px 20px",
                borderRadius: "12px",
                fontSize: "14px",
                marginBottom: "16px",
                border: success ? "1px solid #bbf7d0" : "1px solid #fecaca",
                textAlign: "center",
                lineHeight: "1.5",
                zIndex: 1000,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
              }}>
                  <p style={{ margin: 0, fontSize: "16px" }}>{success || error}</p>
                </div>
            </AnimatedSection>
        )}
      </div>
    </section>
    </div>
  );
}

const styles = {
  inputGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
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
  },
  textarea: {
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
    minHeight: "120px",
  },
  nextButton: {
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "18px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
  },
  prevButton: {
    width: "100%",
    background: "#f1f5f9",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
  },
  submitButton: {
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "18px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
  },
  formSectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formSectionIcon: {
    fontSize: "24px",
  },
  serviceIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    color: "#fff",
  },
  priceDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#64748b",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "12px",
  },
  cardText: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  priceTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "8px",
  },
  priceValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
  },
};
