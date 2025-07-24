import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/formStyle.css";
import {
  getUserById,
  saveOrUpdateUser,
  searchApartments,
} from "../api/userService";

export default function AddUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, isUpdate = false} = location.state || {};

  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isRWAPartner, setIsRWAPartner] = useState(false);
  const [apartmentId, setApartmentId] = useState("");
  const [apartmentSearch, setApartmentSearch] = useState("");
  const [apartmentList, setApartmentList] = useState([]);
  const [showApartmentList, setShowApartmentList] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [mobileError, setMobileError] = useState("");

  // This flag controls whether apartment search should be triggered
  const [skipApartmentSearch, setSkipApartmentSearch] = useState(true);

  useEffect(() => {
    if (isUpdate && userId) {
      getUserById(userId)
        .then((res) => {
          const user = res.data?.partnerAppUser;
          const propertyName = res.data?.propertyName;
          if (user) {
            setName(user.name || "");
            setMobileNo(user.mobileNo || "");
            setEmail(user.email || "");
            setIsActive(user.isActive || false);
            setIsRWAPartner(user.isRWAPartner || false);
            setApartmentId(user.apartmentId || "");
            if(user.isRWAPartner) setApartmentSearch("Id-"+ user.apartmentId +", Name-"+ propertyName || "");
          } else {
            setErrorMessage("User not found");
          }
        })
        .catch(() => setErrorMessage("Error fetching user data"))
        .finally(() => {
          // After loading data, allow apartment search when user types
          setSkipApartmentSearch(false);
        });
    } else {
      // If creating new user, no skip needed
      setSkipApartmentSearch(false);
    }
  }, [isUpdate, userId]);

  const validateMobileNumber = (value) => {
    if (!/^\d*$/.test(value) || value.length > 10) {
      setMobileError("Please enter a valid 10-digit mobile number.");
    } else {
      setMobileError("");
    }
  };

  useEffect(() => {
    // If we're still skipping apartment search, don't trigger API calls
    if (skipApartmentSearch) {
      setShowApartmentList(false);
      return;
    }

    if (apartmentSearch.length > 2 && isRWAPartner) {
      searchApartments(apartmentSearch)
        .then((res) => {
          if (res.data?.status && res.data?.result?.length > 0) {
            setApartmentList(res.data.result);
            setShowApartmentList(true);
          } else {
            setApartmentList([]);
            setShowApartmentList(false);
          }
        })
        .catch(() => {
          setApartmentList([]);
          setShowApartmentList(false);
        });
    } else {
      setShowApartmentList(false);
    }
  }, [apartmentSearch, isRWAPartner, skipApartmentSearch]);

  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (mobileNo.length !== 10 || mobileError) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name,
      mobileNo,
      email,
      isActive,
      isRWAPartner,
      apartmentId: isRWAPartner ? apartmentId : null,
      isUpdate,
      userId: userId || null,
      apartmentIdHidden: apartmentId,
    };

    try {
      const response = await saveOrUpdateUser(payload);
      const data = response.data;

      setToastMessage(
        data.message || (isUpdate ? "Updated successfully" : "Saved successfully")
      );
      setShowToast(true);

      if (!isUpdate) {
        setName("");
        setMobileNo("");
        setEmail("");
        setIsActive(false);
        setIsRWAPartner(false);
        setApartmentId("");
        setApartmentSearch("");
        setApartmentList([]);
        setShowApartmentList(false);
      } else {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Error saving data";
      setErrorMessage(message);
    }
  };

  const selectApartment = (apt) => {
    setApartmentSearch(`${apt.propertyName} - ${apt.city}`);
    setApartmentId(apt.apartmentId);
    setShowApartmentList(false);
  };

  const handleRWAPartnerChange = (checked) => {
    setIsRWAPartner(checked);
    if (!checked) {
      setApartmentSearch("");
      setApartmentId("");
      setShowApartmentList(false);
    }
  };

  return (
    <>
      <div className="mainDiv">
        <div className="cardStyle">
          <h2 className="formTitle">{isUpdate ? "Update Staff" : "Register Staff"}</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="inputDiv">
              <label htmlFor="name">Enter Name</label>
              <input
                className="input_style"
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="inputDiv">
              <label htmlFor="mobileNo">Enter Mobile Number</label>
              <input
                className="input_style"
                type="tel"
                name="mobileNo"
                placeholder="Mobile Number"
                value={mobileNo}
                maxLength={10}
                pattern="\d{10}"
                title="Please enter a valid 10-digit mobile number."
                onChange={(e) => {
                  setMobileNo(e.target.value);
                  validateMobileNumber(e.target.value);
                }}
                required
              />
              {mobileError && <span style={{ color: "red" }}>{mobileError}</span>}
            </div>

            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <input
                className="input_style"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <fieldset className="row" >
              <legend>Account Action</legend>
              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                /> Account Active
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={isRWAPartner}
                  onChange={(e) => handleRWAPartnerChange(e.target.checked)}
                /> RWA Partner
              </label>
            </fieldset>

            <fieldset>
              <legend>Assign Apartment</legend>
              <label htmlFor="searchInput">Search Apartments</label>
              <input
                className="input_style"
                type="text"
                id="searchInput"
                placeholder="Search by name or city"
                value={apartmentSearch}
                onChange={(e) => {
                  setApartmentSearch(e.target.value);
                  // User has started typing, so stop skipping apartment search
                  if (skipApartmentSearch) setSkipApartmentSearch(false);
                }}
                autoComplete="off"
                disabled={!isRWAPartner}
              />
              {showApartmentList && (
                <ul className="apartment-list">
                  {apartmentList.length ? (
                    apartmentList.map((apt) => (
                      <li key={apt.apartmentId} onClick={() => selectApartment(apt)}>
                        {apt.propertyName} - {apt.city}
                      </li>
                    ))
                  ) : (
                    <li>No apartments found.</li>
                  )}
                </ul>
              )}
            </fieldset>

            <button type="submit">{isUpdate ? "Update" : "Save"}</button>

            {errorMessage && (
              <p style={{ color: "red", fontSize: 12, marginTop: 5 }}>{errorMessage}</p>
            )}
          </form>
        </div>
      </div>

      <div
        className="toast"
        style={{ opacity: showToast ? 1 : 0, display: showToast ? "flex" : "none" }}
        onAnimationEnd={() => setShowToast(false)}
      >
        {toastMessage}
      </div>
    </>
  );
}
