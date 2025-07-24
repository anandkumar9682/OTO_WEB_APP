import React, { useState } from "react";
import "../styles/formStyle.css";
import { changeAdminPassword } from "../api/userService";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const validateForm = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const userId = localStorage.getItem("userId");
      const response = await changeAdminPassword(userId,oldPassword, newPassword);
      setToastMessage(response.message || "Password changed successfully");
      setShowToast(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to change password";
      setErrorMessage(msg);
    }
  };

  return (
    <>
      <div className="mainDiv">
        <div className="cardStyle">
          <h2 className="formTitle">Change Admin Password</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="oldPassword">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="input_style"
              />
            </div>

            <div className="inputDiv">
              <label className="inputLabel" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input_style"
              />
            </div>

            <div className="inputDiv">
              <label className="inputLabel" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input_style"
              />
            </div>

            {errorMessage && (
              <p style={{ color: "red", fontSize: 12, marginTop: 5 }}>
                {errorMessage}
              </p>
            )}

            <div className="buttonWrapper">
              <button type="submit" className="submitButton">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      <div
        className={`toast ${showToast ? "show" : ""}`}
        onAnimationEnd={() => setShowToast(false)}
      >
        {toastMessage}
      </div>
    </>
  );
}
