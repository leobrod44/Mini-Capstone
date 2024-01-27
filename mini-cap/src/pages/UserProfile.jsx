import "../styling/profile.css"

const UserProfile =() => {

    return(
       <div>
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

                      <div className="mt-3">
                        <p className="text-secondary mb-1">
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <form>
                  <label className="form-label mt-3" htmlFor="customFile">
                    Choose an image:
                  </label>

                  <div className="row">
                    <div className="col-sm-8">
                      <input
                        type="file"
                        className="form-control"
                        id="customFile"
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
                >
                  Delete Account
                </button>
              </div>
              <div className="col-md-8">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">First Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                      
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Last Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                   
                      </div>
                    </div>
                    <hr />
                   
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Phone</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                       
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">User type</h6>
                      </div>
                      <div className="col-sm-9 text-secondary text-capitalize">
                       
                      </div>
                    </div>
                    <hr />
                    <button
                            className="btn editProfile"
                          >
                            Edit Profile
                          </button>
                    
                    <div className="row">
                      <div className="col-sm-12 d-flex justify-content-between">
                   
                      </div>
                    </div>
                  </div>
                </div>
                <form
                  className="row gutters-md"
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
       </div> 
    );
};

export default UserProfile;