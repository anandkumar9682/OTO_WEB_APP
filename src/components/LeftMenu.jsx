import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles.css';
import '../responsive.css';

import dashboardIcon from '../assets/img/icon_dashboard.png';
import accountIcon from '../assets/img/icon_account.png';
import settingIcon from '../assets/img/icon_setting.png';
import logoutIcon from '../assets/img/icon_logout.png';

const LeftMenu = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: dashboardIcon },
    { path: '/add-user', label: 'Register RWA/Staff', icon: accountIcon },
    { path: '/change-password', label: 'Change Password', icon: settingIcon },
  ];

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  return (
    <>
      <div className="navcontainer">
        <nav className="nav">
          <div className="nav-upper-options">
            {menuItems.map(({ path, label, icon }) => (
              <Link key={path} to={path}>
                <div className={`nav-option ${isActive(path) ? 'option1' : ''}`}>
                  <img src={icon} className="nav-img" alt={label.toLowerCase()} />
                  <h3>{label}</h3>
                </div>
              </Link>
            ))}

            <div className="nav-option logout" onClick={() => setShowLogoutConfirm(true)}>
              <img src={logoutIcon} className="nav-img" alt="logout" />
              <h3>Logout</h3>
            </div>
          </div>
        </nav>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="btn confirm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftMenu;
