import React from 'react';
import "../styling/Header.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesome library
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import Logo from '../components/Logo';
import Navbar from './Navbar';
import  Notification from '../components/Notification';
import store from "storejs";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Logo/>
      </div>
      <div className="header-right">
          {store.get('?loggedUser') && (
              <div className='notification-wrapper'>
                  <Notification/>
              </div>
          )}
    <div>
        <Navbar/>
        </div>
      </div>
    </header>
  );
};

export default Header;