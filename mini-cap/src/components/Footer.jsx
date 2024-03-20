import React from "react";
import "../styling/Footer.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

/**
 * Functional component representing the footer section of the website.
 * @returns {JSX.Element} - The JSX for the footer component.
 */
const Footer = () => {
  return (
    <div className="footerwrapper">
      <div className="main-footer">
        <div className="container">
          
          <div>
            <div className="footer-cols">
              <ul className="footer-links">
                <p className="titlefooter"> General</p>
                <li>
                  <Link className="link">lorem ipsum </Link>
                </li>
                <li>
                  <Link className="link">lorem ipsum</Link>
                </li>
                <li>
                  <Link className="link">lorem ipsum</Link>
                </li>
              </ul>
            </div>

            <div className="footer-cols">
              <ul className="footer-links">
                <p className="titlefooter">Help</p>
                <li>
                  <Link className="link">Report Bug</Link>
                </li>
                <li>
                  <Link className="link">FAQ</Link>
                </li>
                <li>
                  <Link className="link">Leave a Review</Link>
                </li>
              </ul>
            </div>

            <div className="footer-cols">
              <ul className="footer-links">
                <p className="titlefooter"> Follow Our Socials</p>
                <li className="faicon">
                  <FontAwesomeIcon icon={faTwitter} />
                </li>
                <li className="faicon">
                  <FontAwesomeIcon icon={faInstagram} />
                </li>
                <li className="faicon">
                  <FontAwesomeIcon icon={faFacebook} />
                </li>
              </ul>
            </div>
          </div>

          <div >
            <p className="intro-text2">
              &copy;{new Date().getFullYear()} CondoConnect Corporation | Terms
              of Services | Privacy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;