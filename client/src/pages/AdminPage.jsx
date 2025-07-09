import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../App';
import { Navigate } from 'react-router-dom';

function AdminPage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.isAdmin) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [usersRes, bookingsRes, feedbacksRes] = await Promise.all([
            api.get('/auth/users'),
            api.get('/bookings'),
            api.get('/feedback'),
          ]);
          setUsers(usersRes.data);
          setBookings(bookingsRes.data);
          setFeedbacks(feedbacksRes.data);
        } catch (err) {
          setError('Failed to fetch admin data. Please try again later.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }
  if (!user.isAdmin) {
    return <Navigate to="/" />;
  }

  const StatCard = ({ title, value, icon, gradient }) => (
    <div
      style={{
        background: gradient,
        borderRadius: '20px',
        padding: '32px',
        color: '#fff',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.8 }}>
        {icon}
      </div>
      <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>
        {title}
      </div>
    </div>
  );

  const ListItem = ({ primary, secondary, status, isAdmin }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0'
    }}>
        <div>
            <div style={{ fontWeight: '600', color: '#1e293b' }}>{primary}</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>{secondary}</div>
        </div>
        {status && (
            <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                background: status === 'Completed' ? '#dcfce7' : '#fef3c7',
                color: status === 'Completed' ? '#166534' : '#92400e',
            }}>
                {status}
            </span>
        )}
        {isAdmin !== undefined && (
            <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                background: isAdmin ? 'linear-gradient(135deg, #fca5a5, #ef4444)' : 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
                color: isAdmin ? '#fff' : '#374151',
            }}>
                {isAdmin ? 'Admin' : 'User'}
            </span>
        )}
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '16px',
          }}
        >
          Admin Dashboard
        </h1>
        <p
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Welcome, {user.name}. Manage your application data from here.
        </p>
      </section>

      {/* Main Content */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Stat Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              marginBottom: '60px',
            }}
          >
            <StatCard
              title="Total Users"
              value={users.length}
              icon="👥"
              gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
            />
            <StatCard
              title="Total Bookings"
              value={bookings.length}
              icon="📅"
              gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
            />
            <StatCard
              title="Total Feedbacks"
              value={feedbacks.length}
              icon="💬"
              gradient="linear-gradient(135deg, #10b981, #34d399)"
            />
             <StatCard
              title="Pending Bookings"
              value={bookings.filter(b => b.status !== 'Completed').length}
              icon="⏳"
              gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
            />
          </div>

          {loading && <div>Loading data...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}

          {/* Data Panels */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '40px',
              alignItems: 'flex-start'
            }}
          >
            {/* Users Panel */}
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                <h2 style={{ padding: '24px 24px 16px', margin: 0, fontSize: '22px', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #e2e8f0'}}>
                    Users
                </h2>
                <div style={{ maxHeight: '400px', overflowY: 'auto'}}>
                    {users.map(u => (
                        <ListItem key={u._id} primary={u.name} secondary={u.email} isAdmin={u.isAdmin} />
                    ))}
                </div>
            </div>

            {/* Bookings Panel */}
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                <h2 style={{ padding: '24px 24px 16px', margin: 0, fontSize: '22px', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #e2e8f0'}}>
                    Recent Bookings
                </h2>
                <div style={{ maxHeight: '400px', overflowY: 'auto'}}>
                    {bookings.slice(0, 10).map(b => (
                        <ListItem key={b._id} primary={b.name} secondary={new Date(b.date).toLocaleDateString()} status={b.status || 'Pending'} />
                    ))}
                </div>
            </div>

            {/* Feedback Panel */}
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                <h2 style={{ padding: '24px 24px 16px', margin: 0, fontSize: '22px', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #e2e8f0'}}>
                    Recent Feedback
                </h2>
                <div style={{ maxHeight: '400px', overflowY: 'auto'}}>
                    {feedbacks.slice(0, 10).map(f => (
                        <ListItem key={f._id} primary={`"${f.comment}"`} secondary={`${f.name} - ${f.rating} Stars`} />
                    ))}
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminPage;
