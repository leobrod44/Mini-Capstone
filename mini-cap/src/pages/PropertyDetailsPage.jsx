import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddCondoBtn from "../components/AddCondoBtn";
import BackArrowBtn from "../components/BackArrowBtn";  // Import BackArrowBtn component
import "../index.css";
import "../styling/PropertyDetailsPage.css";
import CondoMgmtComponent from "../components/CondoMGMTComponent";
import { getCondos, getCondoPicture } from "../backend/Fetcher";
import PropTypes from 'prop-types';

const PropertyDetailsPage = () => {
  let { propertyID, propertyName } = useParams();
  // State to represent whether the user has registered condos or not, since i dont have backend right now
  const navigate = useNavigate();
  const [condoDetails, setCondoDetails] = useState([]);
  const [hasCondos, setHasCondos] = useState(false);
  let [condoPicURL, setCondoPicURL] = useState(null);

  useEffect(() => {
    const fetchCondos = async () => {
      try {
        const condos = await getCondos(propertyID);
        condos.map(async (condo) => {
          //we need to implement setting the condo picture
          console.log("-----------------------" + condo.id);
          condoPicURL = await getCondoPicture(condo.id);
          setCondoPicURL(condoPicURL);
          // condo.picture = picture;
          return { ...condo };
        });
        if (condos.length > 0) {
          setHasCondos(true);
          setCondoDetails(condos);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCondos();
  }, []);


  return (
    <div>
      <Header />
      <BackArrowBtn /> {/* Include BackArrowBtn here */}
      <div className="center-page" >
        <div className="title_container">
          <h3 className="DB_title"> {propertyName}</h3>
        </div>

        <div >
          {hasCondos ? (
            <div className="condo_list">
              {condoDetails.map((condo, index) => (
                <CondoMgmtComponent key={index} {...condo} condoId={condo.id} />
              ))}

            </div>
          ) : (
            <div className="content_container">
              <div className="white_card">
                <p className="card_title">You have not added any condos yet.</p>
                {/*<p className="button"> Add a condo</p>*/}
                <Link to="/add-condo" className="button"> Add a condo</Link>
              </div>
            </div>
          )}
        </div>
        {hasCondos && <AddCondoBtn data-testid="add-condo-btn" onClick={() => navigate('/add-condo')} />}
      </div>
      <Footer />

    </div>
  );
};

export default PropertyDetailsPage;
