import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Navbar from "../components/Navbar.jsx"; // Adjust the import path as necessary
import { BrowserRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Navbar Component Coverage Tests", () => {
  const setup = (role = "condoOwner") => {
    // Mocking the role setting (adjust this part to match how your component expects to receive the role)
    Object.defineProperty(window, "user", {
      value: { role },
      writable: true,
    });

    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it("handles role setting and conditional rendering", () => {
    setup("mgmt");
    expect(screen.queryByText("Hello company!")).toBeInTheDocument();

    setup("condoOwner");
    expect(screen.queryByText("Hello first name!")).not.toBeInTheDocument(); // Adjust this assertion based on your actual content
  });

  it("closes dropdown menu when clicking outside", () => {
    setup("mgmt");
    fireEvent.click(screen.getByRole("button", { name: /menu/i })); // Open the menu
    fireEvent.mouseDown(document.body); // Simulate a click outside the menu
    expect(screen.getByTestId("dropdown-menu")).not.toHaveClass("active"); // Ensure this matches your active/inactive class logic
  });

  // Additional tests to cover other roles and their specific dropdown items
});
