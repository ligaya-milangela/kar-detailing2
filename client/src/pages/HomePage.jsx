import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import api from '../api';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const particlesOptions = {
    background: {
        color: {
            value: "transparent",
        },
    },
    fpsLimit: 60,
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "repulse",
            },
            resize: true,
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4,
            },
        },
    },
    particles: {
        color: {
            value: "#ffffff",
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.1,
            width: 1,
        },
        collisions: {
            enable: true,
        },
        move: {
            direction: "none",
            enable: true,
            outModes: {
                default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
            },
            value: 50,
        },
        opacity: {
            value: 0.1,
        },
        shape: {
            type: "circle",
        },
        size: {
            value: { min: 1, max: 5 },
        },
    },
    detectRetina: true,
};


const AnimatedSection = ({ children, style }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section
            ref={ref}
            style={{
                ...style,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(50px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
        >
            {children}
        </section>
    );
};


const AnimatedStat = ({ value, title, icon }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      if (start === end) return;

      const duration = 2000;
      const incrementTime = (duration / end);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <div ref={ref} style={{ textAlign: 'center', color: '#fff' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '48px', fontWeight: '800' }}>{count}+</div>
      <div style={{ fontSize: '16px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>{title}</div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '32px',
        textAlign: 'center',
        color: '#fff',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease',
        transform: `perspective(1000px) rotateX(${isHovered ? 5 : 0}deg) rotateY(${isHovered ? 5 : 0}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1})`,
        boxShadow: isHovered ? '0 30px 50px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.2)',
    };

    return (
        <div 
            ref={ref}
            style={cardStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>{icon}</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: '#FFFFFF' }}>{title}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>{description}</p>
        </div>
    );
};

const HowItWorksStep = ({ icon, title, description, index }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  
    const stepStyle = {
      textAlign: 'center',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(50px)',
      transition: `opacity 0.5s ease-out ${index * 0.2}s, transform 0.5s ease-out ${index * 0.2}s`,
    };
  
    return (
      <div ref={ref} style={stepStyle}>
        <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>{title}</h3>
        <p style={{ color: '#475569', lineHeight: 1.6 }}>{description}</p>
      </div>
    );
};

const TestimonialCard = ({ name, rating, comment, index }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  
    const cardStyle = {
      background: '#fff',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(50px)',
      transition: `opacity 0.5s ease-out ${index * 0.2}s, transform 0.5s ease-out ${index * 0.2}s`,
    };

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= rating ? '#fbbf24' : '#e5e7eb', fontSize: '20px' }}>
                    ★
                </span>
            );
        }
        return stars;
    };
  
    return (
      <div ref={ref} style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '18px',
              marginRight: '12px'
          }}>
              {name.charAt(0)}
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{name}</h4>
            <div style={{ display: 'flex' }}>{renderStars()}</div>
          </div>
        </div>
        <p style={{ fontStyle: 'italic', color: '#475569' }}>"{comment}"</p>
      </div>
    );
};


export default function HomePage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await api.get('/feedback');
        setFeedbacks(data);
      } catch (err) {
        console.error("Failed to fetch feedbacks for homepage");
      }
    };
    fetchFeedbacks();
  }, []);
  
  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: '#0a0a1a', // Darker base background
      color: '#fff',
      overflowX: 'hidden'
    }}>
      <style>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title {
          animation: fadeInDown 1s ease-out;
        }

        .hero-subtitle {
            animation: fadeInDown 1s ease-out 0.3s;
            animation-fill-mode: both;
        }

        .cta-button {
            animation: fadeInUp 1s ease-out 0.6s;
            animation-fill-mode: both;
        }

        .cta-button:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
        }
      `}</style>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
        textAlign: 'center',
        padding: '80px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesOptions}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
            <h1 className="hero-title" style={{
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                fontWeight: '800',
                marginBottom: '24px',
                background: 'linear-gradient(90deg, #fff, #aaa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1.2'
            }}>
                Revive Your Ride.
        </h1>
            <p className="hero-subtitle" style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                marginBottom: '40px',
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '600px',
                margin: '0 auto 40px auto'
            }}>
                Unleash the true potential of your vehicle with our unmatched detailing expertise.
            </p>
            <Link to="/self-assess" style={{ textDecoration: 'none' }}>
              <button className="cta-button" style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff',
                border: 'none',
                padding: '18px 40px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}>
                Get an Instant Quote
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedSection style={{ background: '#111827', padding: '80px 20px' }}>
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px'
        }}>
            <AnimatedStat value={150} title="Cars Detailed" icon="🚗" />
            <AnimatedStat value={98} title="Happy Clients" icon="😊" />
            <AnimatedStat value={80} title="5-Star Reviews" icon="⭐" />
        </div>
      </AnimatedSection>
      
      {/* Services Section */}
      <div style={{ padding: '80px 0', backgroundColor: '#0a0f1f' }}>
         <AnimatedSection style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: '800', color: '#FFFFFF' }}>Our Signature Services</h2>
            <p style={{ fontSize: '20px', maxWidth: '700px', margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
                Tailored detailing solutions to meet every need and exceed every expectation.
            </p>
        </AnimatedSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <ServiceCard 
                icon="✨"
                title="Interior Revival"
                description="A meticulous deep clean of your cabin. We vacuum, shampoo, and treat every surface to restore that new-car feel."
            />
            <ServiceCard 
                icon="🛡️"
                title="Exterior Perfection"
                description="A showroom-quality finish with our multi-step wash, polish, and premium wax or ceramic coating for ultimate protection."
            />
            <ServiceCard 
                icon="🌊"
                title="Disaster Recovery"
                description="Specialized service for severe conditions including flood, mold, and heavy odor removal to bring your car back to life."
            />
        </div>
    </div>

      {/* How It Works Section */}
      <AnimatedSection style={{ padding: '100px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '60px', color: '#1e293b' }}>
                Simple, Transparent Process
            </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px',
                position: 'relative'
            }}>
                <HowItWorksStep index={0} icon="📝" title="1. Assess & Book" description="Use our quick tool to assess your car's needs and book your service in minutes." />
                <HowItWorksStep index={1} icon="🚚" title="2. We Come to You" description="Our professional detailers arrive at your location with all the necessary equipment." />
                <HowItWorksStep index={2} icon="💖" title="3. Enjoy Your Car" description="Experience the joy of a perfectly clean and restored vehicle, ready to impress." />
            </div>
        </div>
      </AnimatedSection>

       {/* Testimonials Section */}
       <AnimatedSection style={{ padding: '100px 20px', background: '#111827' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '60px', color: '#fff' }}>
                What Our Clients Say
        </h2>
        <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '30px'
            }}>
                {feedbacks.slice(0, 3).map((fb, index) => (
                    <TestimonialCard key={fb._id} index={index} name={fb.name} rating={fb.rating} comment={fb.comment} />
                ))}
            </div>
        </div>
      </AnimatedSection>

      {/* Final CTA */}
      <AnimatedSection style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '20px' }}>
              Ready for the Transformation?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 40px auto' }}>
              Your car deserves the best. Let us show you what a true professional detailing can do.
          </p>
          <Link to="/booking" style={{ textDecoration: 'none' }}>
              <button style={{
                  background: '#fff',
                  color: '#667eea',
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s ease'
              }}>
                  Book Your Detailing Session
              </button>
          </Link>
      </AnimatedSection>

    </div>
  );
}
