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
                     <div className="btndiv" style={{ display: store.get('?loggedUser') ? "none" : "block" }}>
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
              <h5 className="card-title2">Title 1</h5>
              <p>
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor inc Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod.
              </p>
            </div>

            <div className="card2">
              <h5 className="card-title2">Title 2</h5>
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor inc{" "}
              </p>
            </div>

            <div className="card2">
              <h5 className="card-title2">Title 3</h5>
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incsed do eiusmod tempor inc.{" "}
              </p>
            </div>

            <div className="card2">
              <h5 className="card-title2">Title 4</h5>
              <p>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incsed do eiusmod tempor incsed do eiusmod tempor inc.
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