import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header';


jest.mock('../backend/UserHandler');

  
describe('Header Component', () => {
    beforeEach(() => {
        // Simulate a logged-in state
        localStorage.setItem("user", "exampleUserId");
        localStorage.setItem("role", "renter");
      });
    
      afterEach(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      });

  it('renders without crashing', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByTestId('header-id')).toBeInTheDocument();
  });

  it('displays Logo component', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('displays Notification component', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByTestId('notification-wrapper')).toBeInTheDocument();
  });

  it('displays Navbar component', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
