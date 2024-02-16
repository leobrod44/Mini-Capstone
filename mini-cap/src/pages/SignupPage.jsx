import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/SignupPage.css"; // Ensure your CSS file path is correct
import Header from "../components/Header";
import Footer from "../components/Footer";
import user from "../assets/user.png"; // Adjust the path accordingly
import { db, auth, storage } from "../config/firebase";

import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getUserData, addUser, addCompany } from "../backend/Fetcher";


const SignupPage = () => {

  const [previewUrl, setPreviewUrl] = useState(user);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const usersCollectionRef = collection(db, "users");

  const [formData, setFormData] = useState({
    role: "renter/owner", // "Renter/Owner" as the default role
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "", // Phone number for both roles
    companyName: "",
    password: "",
    confirmPassword: "",
    picture: ""
  });
  SignupPage.getFormData = () => {
    return formData;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSignup = async (e) => {
    e.preventDefault();
   
    // Validation checks
    if (
      (formData.role === "renter/owner" &&
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

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error(
        "Invalid email format. Please include '@' and '.' in your email address."
      );
      return;
    }

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
    if(profilePicUrl){
      formData.picture = profilePicUrl;
    }

    if(formData.role === "renter/owner"){
      try {
        const newUser = await addUser(formData);
      } catch (err) {
        toast.error("User already exists");
      }
    }
    
    else if (formData.role === "managementCompany"){
      try {
        const newUser = await addCompany(formData);
      } catch (err) {
        toast.error("Company already exists");
      }
    }
    //TODO login user and navigate to home page
  
  };

  const handlePhotoChange = (event) => {
    const photo = event.target.files[0];
    if (
      photo.type !== "image/png" &&
      photo.type !== "image/jpeg" &&
      photo.type !== "image/jpg"
    ) {
      return toast.error("File not supported");
    }
    if (photo.size > 2097152) return toast.error("File must be less than 2 MB");

    setProfilePicUrl(photo);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    //TODO profilePic preview dosent seem to be working anymore
    
  };

  return (
    <div>
      <Header />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossOrigin="anonymous"
      />
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSignup}>
          <h2 style={{ marginBottom: "40px" }}>Signup</h2>

          <div className="card" style={{ borderColor: "transparent" }}>
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="profile"
                    className="rounded-circle"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={user}
                    alt="profile"
                    className="rounded-circle"
                    width={100}
                  />
                )}
              </div>
            </div>
          </div>

          <label className="form-label mt-3" htmlFor="customFile">
            Choose an image:
          </label>
          <div className="row justify-content-center" >
            <div className="col-sm-" >
              <input
                type="file"
                className="form-control"
                id="customFile"
                onChange={handlePhotoChange}
                
              />
            </div>
          </div>

          <div className="input-group">
            <label
              className="signup"
              htmlFor="role"
              style={{ paddingTop: "50px" }}
            >
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="renter/owner">Renter/Owner</option>
              <option value="managementCompany">Management Company</option>
            </select>
          </div>

          {formData.role === "renter/owner" && (
            <>
              <div className="input-group">
                <label className="signup" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="signup" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="signup" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="signup" htmlFor="phoneNumber">
                  Phone Number (optional)
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {formData.role === "managementCompany" && (
            <>
              <div className="input-group">
                <label className="signup" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="signup" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="signup" htmlFor="phoneNumber">
                  Phone Number (optional)
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label className="signup" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label className="signup" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
            id = "signup"
            type="submit"
            className="loginbtn"
            style={{ width: "100%", borderRadius: "5px" }}
          >
            Signup
          </button>
          <a
            href="/login"
            className="forgot-password-link"
            style={{ color: "#3531a1", marginTop: "35px" }}
          >
            Already have an account?
          </a>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
