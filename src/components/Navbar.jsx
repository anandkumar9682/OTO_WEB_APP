import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // If you're using react-router

export default function Navbar() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    localStorage.clear(); // Or any token cleanup
    setShowLogoutConfirm(false);
    navigate("/login"); // Or: window.location.href = "/login"
  };

  return (
    <>
      <nav className="navbar">
        {/* Other nav items */}
        <ul>
          <li onClick={() => setShowLogoutConfirm(true)}>Logout</li>
        </ul>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>Are you sure you want to logout?</p>
            <div className="modalActions">
              <button onClick={handleConfirmLogout}>Yes</button>
              <button onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
