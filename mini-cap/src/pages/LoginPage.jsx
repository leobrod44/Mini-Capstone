import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/LoginPage.css"; // Make sure your CSS file path is correct
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Perform email validation check
    if (!credentials.email.includes("@") || !credentials.email.includes(".")) {
      toast.error(
        "Invalid email format. Please include '@' and '.' in your email address."
      );
      return;
    }

    // Perform validation for email and password
    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    // Add your login logic here
    console.log("Login clicked");
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Login</button>
          <a href="#" className="forgot-password-link">
            Forgot Password?
          </a>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
