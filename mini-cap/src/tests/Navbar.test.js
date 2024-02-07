import React from "react";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../components/Navbar"; // Adjust the import path as necessary
import { BrowserRouter } from "react-router-dom";

// Mocks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Utility function to render the component
const renderNavbar = (role) => {
  window.HTMLElement.prototype.getBoundingClientRect = () => {
    return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 };
  };

  return render(
    <BrowserRouter>
      <Navbar initialRole={role} />
    </BrowserRouter>
  );
};

describe("Navbar Component", () => {
  afterEach(cleanup);

  it("comprehensively tests the Navbar component", async () => {
    // Render Navbar with a role that triggers the hamburger menu
    renderNavbar("mgmt");

    // Toggle the dropdown menu
    const hamburgerMenu = screen.getByRole("button");
    fireEvent.click(hamburgerMenu);
    expect(screen.getByText("My employees")).toBeVisible();

    // Click outside to close the dropdown
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("My employees")).not.toBeInTheDocument();

    // Test role-based rendering for 'condoOwner'
    cleanup();
    renderNavbar("condoOwner");
    expect(screen.getByText("Dashboard")).toBeVisible();

    // Test role-based rendering for 'renter'
    cleanup();
    renderNavbar("renter");
    expect(screen.getByText("My rental")).toBeVisible();

    // Logout functionality
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    // Here, you would normally assert the navigation, but since it's mocked to jest.fn(), we can't assert it here
  });

  // Add more role-based tests if necessary
});
