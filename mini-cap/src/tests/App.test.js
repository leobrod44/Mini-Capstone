// src/test/App.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import App from "../App"; // Import App from one level up in the src directory

// Mocking page components
jest.mock("../pages/LandingPage", () => () => <div>Landing Page Mock</div>);
jest.mock("../pages/UserProfile", () => () => <div>User Profile Mock</div>);
jest.mock("../pages/LoginPage", () => () => <div>Login Page Mock</div>);
jest.mock("../pages/SignupPage", () => () => <div>Signup Page Mock</div>);

describe("App Component", () => {
  // Test for default route rendering LandingPage
  it('renders LandingPage component for "/" route', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Landing Page Mock")).toBeInTheDocument();
  });

  // Test for "/user-profile" route rendering UserProfile
  it('renders UserProfile component for "/user-profile" route', () => {
    render(
      <MemoryRouter initialEntries={["/user-profile"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("User Profile Mock")).toBeInTheDocument();
  });

  // Test for "/login" route rendering LoginPage
  it('renders LoginPage component for "/login" route', () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Login Page Mock")).toBeInTheDocument();
  });

  // Test for "/signup" route rendering SignupPage
  it('renders SignupPage component for "/signup" route', () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Signup Page Mock")).toBeInTheDocument();
  });
});
