import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/SignupPage.css"; // Make sure your CSS file path is correct
import Header from "../components/Header";
import Footer from "../components/Footer";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    role: "publicUser", // Set "Public User" as the default role
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // Check if all mandatory fields are filled
    if (
      (formData.role === "publicUser" &&
        (!formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword)) ||
      (formData.role === "managementCompany" &&
        (!formData.companyName ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword))
    ) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    // Perform email validation check
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error(
        "Invalid email format. Please include '@' and '.' in your email address."
      );
      return;
    }

    // Perform password validation checks
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      toast.error("Password must contain both letters and numbers.");
      return;
    }

    // Add your signup logic here
    console.log("Signup clicked");
  };

  return (
    <div>
      <Header />
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSignup}>
          <h2>Signup</h2>
          <div className="input-group">
            <label className="signup" htmlFor="role">Select Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="publicUser">Public User</option>
              <option value="managementCompany">Management Company</option>
            </select>
          </div>
          {formData.role === "publicUser" && (
            <div>
              <div className="input-group">
                <label className="signup" htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="signup" htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="signup"  htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="signup" htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {formData.role === "managementCompany" && (
            <div>
              <div className="input-group">
                <label  className="signup" htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label  className="signup" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          <div className="input-group">
            <label  className="signup" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label className="signup"  htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button className="signupbtn" type="submit">Signup</button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
