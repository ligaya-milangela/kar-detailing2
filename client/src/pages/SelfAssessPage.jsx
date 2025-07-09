import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const interiorQuestions = [
  {
    text: "Overall Interior Cleanliness",
    icon: "🏠",
    options: [
      { label: "Just needs a quick tidy-up", category: "Light" },
      { label: "Has visible dirt and some stains", category: "Moderate" },
      { label: "Very dirty, muddy, or has mold", category: "Severe" },
    ],
  },
  {
    text: "Interior Smell",
    icon: "👃",
    options: [
      { label: "Smells fresh and clean", category: "Light" },
      { label: "Has a slight, noticeable odor", category: "Moderate" },
      { label: "Has a strong, bad smell", category: "Severe" },
    ],
  },
  {
    text: "Seats & Upholstery",
    icon: "🪑",
    options: [
      { label: "Seats are clean, no stains", category: "Light" },
      { label: "Seats have stains or pet hair", category: "Moderate" },
      { label: "Seats are moldy or water-damaged", category: "Severe" },
    ],
  },
  {
    text: "Carpets & Mats",
    icon: "🏻",
    options: [
      { label: "Light crumbs or dust", category: "Light" },
      { label: "Visible dirt, mud, or spills", category: "Moderate" },
      { label: "Flooded, soaked, or moldy", category: "Severe" },
    ],
  },
  {
    text: "Dashboard & Panels",
    icon: "🎛️",
    options: [
      { label: "Mostly clean, not sticky", category: "Light" },
      { label: "Dusty vents or smudges", category: "Moderate" },
      { label: "Sticky, moldy, or water-damaged", category: "Severe" },
    ],
  },
];

const exteriorQuestions = [
  {
    text: "Paint Condition",
    icon: "🎨",
    options: [
      { label: "Shiny and clean, no major flaws", category: "Light" },
      { label: "Light water spots or fine scratches", category: "Moderate" },
      { label: "Paint is dull, scratched, or faded", category: "Severe" },
    ],
  },
  {
    text: "Stuck-on Grime (Tar, Sap)",
    icon: "🌳",
    options: [
      { label: "No stuck-on grime", category: "Light" },
      { label: "A few spots of tar or sap", category: "Moderate" },
      { label: "Lots of stuck-on grime", category: "Severe" },
    ],
  },
  {
    text: "Wheels & Tires",
    icon: "🛞",
    options: [
      { label: "Wheels are clean, tires look new", category: "Light" },
      { label: "Noticeable brake dust or dirt", category: "Moderate" },
      { label: "Heavy grime, very dirty", category: "Severe" },
    ],
  },
  {
    text: "Windows & Glass",
    icon: "🪟",
    options: [
      { label: "Clean and streak-free", category: "Light" },
      { label: "Water spots or bug splatters", category: "Moderate" },
      { label: "Hard water stains or heavy grime", category: "Severe" },
    ],
  },
  {
    text: "Undercarriage & Wheel Wells",
    icon: "🔧",
    options: [
      { label: "Clean or lightly soiled", category: "Light" },
      { label: "Some mud or road dirt", category: "Moderate" },
      { label: "Heavy mud or caked-on dirt", category: "Severe" },
    ],
  }
];

const priceTable = {
  Light:   { interior: 400, exterior: 400 },
  Moderate:{ interior: 800, exterior: 900 },
  Severe:  { interior: 2000, exterior: 1500 },
};

const categoryDetails = {
  Light: {
    label: "🚗 Light Condition",
    color: "#10b981",
    bgColor: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    description: [
      "Minor dust on dashboard and surfaces",
      "A few crumbs or small trash items",
      "Clean upholstery with no visible stains",
      "No foul or lingering odors",
      "Vents and panels mostly clean"
    ],
  },
  Moderate: {
    label: "🚙 Moderate Condition",
    color: "#f59e0b",
    bgColor: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    description: [
      "Visible dirt on seats, carpets, or floor mats",
      "Stains from food or drinks",
      "Presence of pet hair or lint buildup",
      "Mild odor or musty smell",
      "Dust in vents, around buttons, and tight areas"
    ],
  },
  Severe: {
    label: "🌊 Severe / Flooded Condition",
    color: "#dc2626",
    bgColor: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    description: [
      "Heavy mud, water stains, or debris inside the car",
      "Mold or mildew present on upholstery or panels",
      "Strong foul odor or damp smell",
      "Electrical issues or corrosion from water exposure",
      "Sticky or damaged surfaces"
    ],
  },
};

const serviceTypeInfo = {
  interior: {
    label: "Interior Only",
    icon: "🏠",
    color: "#3b82f6",
    description: "Deep clean cabin, seats, dashboard, and all interior surfaces"
  },
  exterior: {
    label: "Exterior Only", 
    icon: "✨",
    color: "#8b5cf6",
    description: "Wash, polish, and protect paint, wheels, and exterior glass"
  },
  both: {
    label: "Full Service",
    icon: "🚗",
    color: "#10b981",
    description: "Complete interior and exterior detailing package"
  }
};

const categoryOrder = ["Severe", "Moderate", "Light"];

function getMostSevere(answers, questions, section) {
  for (let cat of categoryOrder) {
    const found = questions.some((q, idx) => {
      const selectedIdx = answers[`${section}_${idx}`];
      return selectedIdx !== undefined && q.options[selectedIdx].category === cat;
    });
    if (found) return cat;
  }
  return null;
}

export default function SelfAssessPage() {
  const [answers, setAnswers] = useState({});
  const [serviceType, setServiceType] = useState("both");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleSelect = (section, qIdx, oIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [`${section}_${qIdx}`]: oIdx,
    }));
  };

  const recommended = (() => {
    if (serviceType === "interior") {
      return getMostSevere(answers, interiorQuestions, "interior");
    } else if (serviceType === "exterior") {
      return getMostSevere(answers, exteriorQuestions, "exterior");
    } else {
      const intCat = getMostSevere(answers, interiorQuestions, "interior");
      const extCat = getMostSevere(answers, exteriorQuestions, "exterior");
      if (!intCat && !extCat) return null;
      return categoryOrder.find(cat => cat === intCat || cat === extCat);
    }
  })();

  let price = null;
  if (recommended) {
    if (serviceType === "both") {
      const intCat = getMostSevere(answers, interiorQuestions, "interior");
      const extCat = getMostSevere(answers, exteriorQuestions, "exterior");
      if (intCat && extCat) {
        price = priceTable[intCat].interior + priceTable[extCat].exterior;
      } else if (intCat) {
        price = priceTable[intCat].interior;
      } else if (extCat) {
        price = priceTable[extCat].exterior;
      }
    } else if (serviceType === "interior") {
      price = priceTable[recommended].interior;
    } else if (serviceType === "exterior") {
      price = priceTable[recommended].exterior;
    }
  }

  // Calculate progress
  const totalQuestions = interiorQuestions.length + exteriorQuestions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const QuestionCard = ({ question, questionIdx, section }) => {
    const selectedIdx = answers[`${section}_${questionIdx}`];

  return (
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: selectedIdx !== undefined ? "2px solid #667eea" : "2px solid #e5e7eb",
        transition: "all 0.3s ease"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px"
        }}>
          <span style={{ fontSize: "24px" }}>{question.icon}</span>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0
          }}>
            {question.text}
          </h3>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          {question.options.map((opt, oIdx) => (
            <label 
              key={oIdx}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: selectedIdx === oIdx 
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#f8fafc",
                color: selectedIdx === oIdx ? "#fff" : "#374151",
                border: "1px solid",
                borderColor: selectedIdx === oIdx ? "#667eea" : "#e5e7eb",
              }}
              onMouseEnter={(e) => {
                if (selectedIdx !== oIdx) {
                  e.currentTarget.style.borderColor = "#667eea";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIdx !== oIdx) {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }
              }}
            >
                <input
                  type="radio"
                name={`${section}_${questionIdx}`}
                  value={oIdx}
                checked={selectedIdx === oIdx}
                onChange={() => handleSelect(section, questionIdx, oIdx)}
                style={{
                  marginRight: "12px",
                  transform: "scale(1.2)",
                  accentColor: "#764ba2"
                }}
              />
              <span style={{
                fontSize: "14px",
                fontWeight: selectedIdx === oIdx ? "600" : "500",
                lineHeight: 1.4
              }}>
                {opt.label}
              </span>
              
              {/* Category indicator */}
              <span style={{
                marginLeft: "auto",
                padding: "3px 8px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "700",
                flexShrink: 0,
                background: selectedIdx === oIdx 
                  ? "rgba(255,255,255,0.2)" 
                  : opt.category === "Light" ? "#dcfce7"
                    : opt.category === "Moderate" ? "#fef3c7"
                    : "#fee2e2",
                color: selectedIdx === oIdx 
                  ? "#fff"
                  : opt.category === "Light" ? "#065f46"
                    : opt.category === "Moderate" ? "#92400e"
                    : "#991b1b"
              }}>
                {opt.category}
              </span>
              </label>
            ))}
          </div>
      </div>
    );
  };

  const ServiceTypeCard = ({ type, info }) => {
    const isSelected = serviceType === type;
    
    return (
      <div 
        onClick={() => setServiceType(type)}
        style={{
          background: isSelected 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "#fff",
          color: isSelected ? "#fff" : "#374151",
          border: isSelected ? "2px solid #667eea" : "2px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          textAlign: "center"
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.target.style.transform = "translateY(-4px)";
            e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          {info.icon}
        </div>
        <h3 style={{
          fontSize: "20px",
          fontWeight: "700",
          marginBottom: "8px",
          margin: "0 0 8px 0"
        }}>
          {info.label}
        </h3>
        <p style={{
          fontSize: "14px",
          opacity: 0.8,
          margin: 0,
          lineHeight: "1.5"
        }}>
          {info.description}
        </p>
        
        {isSelected && (
          <div style={{
            marginTop: "16px",
            padding: "8px 16px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            ✓ Selected
          </div>
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
            🔍
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
            Vehicle Assessment
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
            marginBottom: "0",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Help us understand your vehicle's condition to recommend the perfect service
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <section style={{ padding: "40px 20px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1e293b",
                margin: 0
              }}>
                Assessment Progress
              </h3>
              <span style={{
                fontSize: "14px",
                color: "#64748b",
                fontWeight: "600"
              }}>
                {answeredQuestions} of {totalQuestions} questions
              </span>
            </div>
            
            <div style={{
              width: "100%",
              height: "8px",
              background: "#e5e7eb",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "0 20px 60px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Main Assessment Area */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "flex-start"
          }}>
            {/* Interior Column */}
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
                🏠 Interior Assessment
              </h2>
              
              {interiorQuestions.map((question, qIdx) => (
                <QuestionCard 
                  key={qIdx}
                  question={question}
                  questionIdx={qIdx}
                  section="interior"
                />
              ))}
            </div>

            {/* Exterior Column */}
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
                ✨ Exterior Assessment
              </h2>
              
              {exteriorQuestions.map((question, qIdx) => (
                <QuestionCard 
                  key={qIdx}
                  question={question}
                  questionIdx={qIdx}
                  section="exterior"
                />
              ))}
            </div>
          </div>
          
          {/* Service Type Selection */}
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            marginTop: "40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "24px",
              textAlign: "center"
            }}>
              Select Your Service Type
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px"
            }}>
              {Object.entries(serviceTypeInfo).map(([type, info]) => (
                <ServiceTypeCard key={type} type={type} info={info} />
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div style={{
            background: recommended ? categoryDetails[recommended].bgColor : "#f1f5f9",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: recommended ? `2px solid ${categoryDetails[recommended].color}` : "2px solid #e5e7eb",
            marginTop: '40px'
          }}>
        {recommended ? (
          <>
                <div style={{
                  textAlign: "center",
                  marginBottom: "32px"
                }}>
                  <div style={{
                    fontSize: "64px",
                    marginBottom: "16px"
                  }}>
                    🎯
                  </div>
                  
                  <h2 style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: categoryDetails[recommended].color,
                    marginBottom: "16px"
                  }}>
              {categoryDetails[recommended].label}
                  </h2>
                  
                  <div style={{
                    display: "inline-block",
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: "12px",
                    padding: "16px 24px",
                    marginBottom: "24px"
                  }}>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      Recommended Service
                    </div>
                    <div style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: serviceTypeInfo[serviceType].color
                    }}>
                      {serviceTypeInfo[serviceType].label}
                    </div>
                  </div>

                  <div style={{
                    display: "inline-block",
                    background: categoryDetails[recommended].color,
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "20px 32px"
                  }}>
                    <div style={{
                      fontSize: "14px",
                      opacity: 0.9,
                      marginBottom: "4px"
                    }}>
                      Estimated Price
                    </div>
                    <div style={{
                      fontSize: "32px",
                      fontWeight: "800"
                    }}>
                      ₱{price?.toLocaleString()}
                    </div>
                  </div>
            </div>

                {/* Service Details */}
                <div style={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "32px"
                }}>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "16px"
                  }}>
                    What this service includes:
                  </h3>
                  <ul style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0
                  }}>
                    {categoryDetails[recommended].description.map((item, idx) => (
                      <li key={idx} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "8px 0",
                        fontSize: "16px",
                        color: "#64748b"
                      }}>
                        <span style={{
                          color: categoryDetails[recommended].color,
                          fontWeight: "600"
                        }}>
                          ✓
            </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book Button */}
                <div style={{ textAlign: "center" }}>
            <button
              onClick={() => navigate("/booking", {
                state: {
                  suggestedService: {
                    serviceType,
                    category: recommended,
                    price,
                  }
                }
              })}
              style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                      borderRadius: "16px",
                      padding: "20px 40px",
                      fontSize: "18px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      letterSpacing: "0.5px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    🚀 Book This Service
            </button>
                </div>
          </>
        ) : (
              <div style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#64748b"
              }}>
                <div style={{
                  fontSize: "64px",
                  marginBottom: "24px"
                }}>
                  📝
                </div>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#374151"
                }}>
                  Complete Your Assessment
                </h3>
                <p style={{
                  fontSize: "16px",
                  margin: 0,
                  lineHeight: "1.6"
                }}>
                  Answer all questions above to receive our personalized service recommendation and pricing
                </p>
                
                <div style={{
                  marginTop: "24px",
                  padding: "16px 24px",
                  background: "rgba(102, 126, 234, 0.1)",
                  borderRadius: "12px",
                  display: "inline-block"
                }}>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#667eea"
                  }}>
                    Progress: {Math.round(progress)}% Complete
                  </span>
                </div>
              </div>
        )}
      </div>
        </div>
      </section>
    </div>
  );
}
