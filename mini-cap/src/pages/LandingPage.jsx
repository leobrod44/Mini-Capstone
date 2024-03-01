import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styling/LandingPage.css"
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import store from "storejs";


const LandingPage =() => {

    return(
       <div>
        <Header/>
        <div className="background-container">
            <div className="card2-container">
                <div className="small-card">
                    <h2 className="landingpage">Condo Connect</h2>
                    <p className="lptext1">
                    Elevating Condo Living with Seamless Management Solutions.  
                    </p>
                    <div className="btndiv" style={{ display: store.get('?user') ? "none" : "block" }}>
                        <Link to="/signup" className="btn"> Sign Up</Link>
                        <Link to="/login" className="btn" style={{marginLeft:"50px"}}>Login</Link>
                    </div>
                </div>
         </div>
     </div>



        <section className="about-us">
        <div className="about-us-content">
          <h3 className="aboutush3"> About Us</h3>
          <div className="line-div">
            <div className="green-line"></div>
          </div>
          <p className="aboutusp">Explore what makes us unique.</p>

          <div className="cards2">
            <div className="card2">
              <h5 className="card-title2">Manage Your Properties</h5>
              <p>
                {" "}
                Condo Connect provides an easy-to-use and comprehensive platform that simplifies the 
                condo management process for you! 
              </p>
            </div>

            <div className="card2">
              <h5 className="card-title2">Easy Registration</h5>
              <p>
              Simply enter the unique condo key provided to you by email and start building your condo empire!
              </p>
            </div>

            <div className="card2">
              <h5 className="card-title2">Help When You Need It</h5>
              <p>
              Leaky sink? No problem! Condo Connect's easy request system will help you submit any and all
               requests directly to the corresponding management companies account.
              </p>
            </div>

          
          </div>
        </div>
      </section>
        <div>
            <Footer/>
        </div>
       </div> 
    );
};

export default LandingPage;