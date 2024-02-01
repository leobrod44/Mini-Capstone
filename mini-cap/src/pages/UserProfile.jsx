import "../styling/profile.css"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from "react";
import DeleteModal from "../components/DeleteModal";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const UserProfile =() => {

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [show, setShow] = useState(false);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(null);


  //edit button
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  //save button
  const handleSaveClick = async (ev) => {
    ev.preventDefault();
    if (!firstName || !lastName)
      return toast.error("Please make sure all required fields aren't empty");
   

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber))
      return toast.error("Please make sure the phone number format is correct");


    const formData = {
      firstName,
      lastName,
      phoneNumber,
    };
    //await updateUserInfo(formData);
    toast.success("User info updated successfully");
    setIsEditMode(false);
  };


    //photo change
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
      fileReader.readAsDataURL(photo);
    };


    //submitting photo to backend
    const handleSubmitPhoto = async (event) => {
      event.preventDefault();
  
      // create a new FormData object to send the file
      const formData = new FormData();
      formData.append("image", profilePicUrl);

      // make a POST request to the backend to upload the image
     
    };

    
  const handleClickDelete = (id) => {
    setShow(true);
  };

  
  //delete user
  const handleClose = () => {
    setShow(false);
  };

  
  //delete function
  const deleteAccount = () => {
   // dispatch(deleteUser);
    toast.success("Account deleted successfully");
    navigate("/"); //link to registration page instead 
    setShow(false);
  };
  
  //cancel button
  const handleCancelClick = () => {
    setIsEditMode(false);
    window.location.reload();
  };

  //changes
  const handleFirstNameChange = (ev) => {
    setFirstName(ev.target.value);
  };
  const handleLastNameChange = (ev) => {
    setLastName(ev.target.value);
  };
  const handlePhoneNumberChange = (ev) => {
    setPhoneNumber(ev.target.value);
  };
  const handleCurrentPasswordChange = (ev) => {
    setCurrentPassword(ev.target.value);
  };
  const handleNewPasswordChange = (ev) => {
    setNewPassword(ev.target.value);
  };
  const handleConfirmPasswordChange = (ev) => {
    setConfirmPassword(ev.target.value);
  };
  const handleChangePassword = async (ev) => {
    ev.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("Please make sure all password fields are filled out");

    if (newPassword !== confirmPassword)
      return toast.error("New passwords do not match");

    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters");
/* 
   // setIsLoading(true);
    const dataForm = {
      currentPassword,
      newPassword,
    };

    const data = await changePassword(dataForm);
    //setIsLoading(false);

    if (data?.message === "Password updated successfully") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(data.message);
    } */
  };

    return(
       <div>
        <Header/>
        <div style={{ backgroundColor: "#f8f9fa" }}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossOrigin="anonymous"
      />
      <div>
        <div className="container pt-5">
          <div className="main-body">
            <div className="row gutters-sm">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                    {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="profile.jpg"
                          className="rounded-circle"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={profilePicUrl}
                          alt="profile.jpg"
                          className="rounded-circle"
                          width={150}
                        />
                      )}

                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitPhoto}>
                  <label className="form-label mt-3" htmlFor="customFile">
                    Choose an image:
                  </label>

                  <div className="row">
                    <div className="col-sm-8">
                      <input
                        type="file"
                        className="form-control"
                        id="customFile"
                        onChange={handlePhotoChange}
                      />
                    </div>
                    <div className="col-sm-4">
                      <button type="submit" className="form-control">
                        Upload
                      </button>
                    </div>
                  </div>
                </form>

            
                <button
                  type="button"
                  className="btn btn-danger btn-block mt-2"
                  onClick={() => handleClickDelete()}
                >
                  Delete Account
                </button>
                <DeleteModal
                  show={show}
                  handleClose={handleClose}
                  handleDeleteItem={deleteAccount}
                  message={
                    "All information will be deleted, are you sure you want to proceed?"
                  }
                />

              </div>
              <div className="col-md-8">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">First Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                      {isEditMode ? (
                          <input
                            type="text"
                            className={
                              "form-control" +
                              (firstName === "" ? " is-invalid" : "")
                            }
                            name="firstName"
                            value={firstName}
                            onChange={handleFirstNameChange}
                          />
                        ) : (
                          <span>{firstName}</span>
                        )}



                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Last Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                      {isEditMode ? (
                          <input
                            type="text"
                            className={
                              "form-control" +
                              (lastName === "" ? " is-invalid" : "")
                            }
                            name="lastName"
                            value={lastName}
                            onChange={handleLastNameChange}
                          />
                        ) : (
                          <span>{lastName}</span>
                        )}
                      </div>
                    </div>
                    <hr />
                   
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                      {isEditMode ? (
                          <input
                            type="text"
                            className={"form-control"}
                            name="email"
                            value={email}
                            disabled
                          />
                        ) : (
                          <span>{email}</span>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Phone</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                      {isEditMode ? (
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            name="phoneNumber"
                            value={phoneNumber || ""}
                            placeholder="Phone Number"
                            onChange={handlePhoneNumberChange}
                          />
                        ) : (
                          <span>
                            {phoneNumber ? phoneNumber : <>+1(XXX) XXX-XXXX</>}
                          </span>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">User type</h6>
                      </div>
                      <div className="col-sm-9 text-secondary text-capitalize">
                      {isEditMode ? (
                          <input
                            type="text"
                            className={"form-control text-capitalize"}
                            name="role"
                            value={role}
                            disabled
                          />
                        ) : (
                          <span>{role}</span>
                        )}
                      </div>
                    </div>
                    <hr />

                    <div className="row">
                      <div className="col-sm-12 d-flex justify-content-between">
                        {isEditMode ? (
                          <>
                            <button
                              className="btn saveChanges"
                              onClick={handleSaveClick}
                            >
                              Save Changes
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{
                                width: "250px",
                              }}
                              onClick={() => handleCancelClick()}
                            >
                              Cancel Changes
                            </button>
                          </>
                        ) : (
                    <button
                            className="btn editProfile"
                            onClick={() => handleEditClick()}
                          >
                            Edit Profile
                          </button>
                       )}
                
                      </div>
                    </div>
                  </div>
                </div>
                <form
                  className="row gutters-md"
                  onSubmit={handleChangePassword}
                >
                  <div className="col-md-12">
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col">
                            <h6 className="mb-0 mt-2">Current Password</h6>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="password"
                              className="form-control"
                              name="currentPassword"
                              placeholder="**********"  
                              value={currentPassword}
                              onChange={handleCurrentPasswordChange}                       
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <h6 className="mb-0 mt-4">New Password</h6>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="password"
                              className="form-control"
                              name="newPassword"
                              placeholder="**********"
                              value={newPassword}
                              onChange={handleNewPasswordChange}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <h6 className="mb-0 mt-4">Confirm Password</h6>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="password"
                              className="form-control"
                              name="confirmPassword"
                              placeholder="**********"
                              value={confirmPassword}
                              onChange={handleConfirmPasswordChange}
                            />
                          </div>
                        </div>
                        <button className="btn mt-3 changePassword">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
       </div> 
    );
};

export default UserProfile;