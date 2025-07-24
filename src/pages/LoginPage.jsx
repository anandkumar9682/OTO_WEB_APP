import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/userService";
import "../styles/formStyle.css";

export default function LoginPage() {
  const [form, setForm] = useState({ userName: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.userName.trim() || !form.password) {
      setErrorMessage("Username and password are required");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    try {
      const data = await login({
        userName: form.userName,
        password: form.password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        
        // Optionally store additional data like totals
        // localStorage.setItem("totals", JSON.stringify({
        //   totalBooking: data.totalBooking,
        //   totalProperty: data.totalProperty,
        //   totalCity: data.totalCity,
        //   totalStaff: data.totalStaff
        // }));

        setToastMessage(data.message || "Login successful");
        setShowToast(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setErrorMessage(data?.message || "Login failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error connecting to server";
      setErrorMessage(msg);
    }
  };

  return (
    <>
      <div className="mainDiv" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="cardStyle" style={{ width: "320px", padding: "2rem" }}>
          <h2 className="formTitle" style={{ textAlign: "center", marginBottom: "1rem" }}>Admin Login</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="inputDiv" >
              <label className="inputLabel" htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                placeholder="Enter username"
                value={form.userName}
                onChange={handleChange}
                required
                className="input_style"
              />
            </div>

            <div className="inputDiv" style={{ marginBottom: "1rem" }}>
              <label className="inputLabel" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
                className="input_style"
              />
            </div>

            {errorMessage && (
              <p style={{ color: "red", fontSize: 12, marginBottom: "1rem" }}>
                {errorMessage}
              </p>
            )}

            <div className="buttonWrapper" style={{ textAlign: "center" }}>
              <button type="submit" className="submitButton" style={{ width: "100%" }}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        className={`toast ${showToast ? "show" : ""}`}
        onAnimationEnd={() => setShowToast(false)}
      >
        {toastMessage}
      </div>
    </>
  );
}
