// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchDashboardTotals } from '../api/userService';
import BookingList from '../components/BookingList';
import ApartmentList from '../components/ApartmentList';
import CityList from '../components/CityList';
import StaffList from '../components/StaffList';
import TraceUserActivity from '../pages/TraceUserActivity';
import TraceUserPropertyList from './TraceUserPropertyList';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('booking');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [totals, setTotals] = useState({
    totalBooking: '--',
    totalProperty: '--',
    totalCity: '--',
    totalStaff: '--',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   useEffect(() => {
    const fetchTotals = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetchDashboardTotals();
        const data = response.data;

        setTotals({
          totalBooking: data.totalBooking ?? 0,
          totalProperty: data.totalProperty ?? 0,
          totalCity: data.totalCity ?? 0,
          totalStaff: data.totalStaff ?? 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard totals:', err);
        setError(err.message || 'Failed to load totals');
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'booking':
        return <BookingList />;
      case 'apartment':
        return <ApartmentList />;
      case 'city':
        return <CityList />;
      case 'staff':
        return <StaffList />;
      case 'trace':
        return (
          <TraceUserActivity
            onViewUser={(userId) => {
              setSelectedUserId(userId);
              setActiveView('trace-detail');
            }}
          />
        );
      case 'trace-detail':
        return (
          <TraceUserPropertyList
            userId={selectedUserId}
            onBack={() => setActiveView('trace')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Top Summary Boxes */}
      <div className="box-container">
        <div
          className={`box box1 ${activeView === 'apartment' ? 'box_active' : ''}`}
          onClick={() => setActiveView('apartment')}
        >
          <div className="text">
            <h2 className="topic-heading">{totals.totalProperty}</h2>
            <h2 className="topic">Total Apartments</h2>
          </div>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
            alt="apartment"
          />
        </div>

        <div
          className={`box box2 ${activeView === 'booking' ? 'box_active' : ''}`}
          onClick={() => setActiveView('booking')}
        >
          <div className="text">
            <h2 className="topic-heading">{totals.totalBooking}</h2>
            <h2 className="topic">Total Booking</h2>
          </div>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png"
            alt="booking"
          />
        </div>

        <div
          className={`box box3 ${activeView === 'city' ? 'box_active' : ''}`}
          onClick={() => setActiveView('city')}
        >
          <div className="text">
            <h2 className="topic-heading">{totals.totalCity}</h2>
            <h2 className="topic">Total City</h2>
          </div>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
            alt="city"
          />
        </div>

        <div
          className={`box box4 ${activeView === 'staff' ? 'box_active' : ''}`}
          onClick={() => setActiveView('staff')}
        >
          <div className="text">
            <h2 className="topic-heading">{totals.totalStaff}</h2>
            <h2 className="topic">Total Staff</h2>
          </div>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png"
            alt="staff"
          />
        </div>

         <div
          className={`box box3 ${activeView === 'trace' ? 'box_active' : ''}`}
          onClick={() => setActiveView('trace')}
        >
          <div className="text">
            <h2 className="topic-heading">Staff</h2>
            <h2 className="topic">Activity</h2>
          </div>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
            alt="city"
          />
        </div>

      </div>

      {/* Dynamic Content Area */}
      {renderContent()}
    </div>
  );
};

export default Dashboard;
