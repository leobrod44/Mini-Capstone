// LandingPage.test.js
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LandingPage from "../pages/LandingPage.jsx";

// Mock the Header and Footer components
jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);

describe("LandingPage Component", () => {
  it("renders without crashing and contains all key elements", () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Check if Header and Footer are rendered
    expect(screen.getByText("Header Mock")).toBeInTheDocument();
    expect(screen.getByText("Footer Mock")).toBeInTheDocument();

    // Check for main title and subtitle
    expect(screen.getByText("Condo Connect")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Elevating Condo Living with Seamless Management Solutions."
      )
    ).toBeInTheDocument();

    // Check for navigation links
    const signUpLink = screen.getByText("Sign Up");
    const loginLink = screen.getByText("Login");
    expect(signUpLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();

    // Optionally, check if the links have the correct href attribute
    expect(signUpLink.closest("a")).toHaveAttribute("href", "/signup");
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");

    // Check for 'About Us' section
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(
      screen.getByText("Explore what makes us unique.")
    ).toBeInTheDocument();
  });
});
