import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Logo from "../components/Logo.jsx"; // Adjust the path to your Logo component

describe("Logo Component", () => {
  // Backup the original location
  const originalLocation = window.location;

  beforeEach(() => {
    // Delete the window.location property and re-define it as a mock
    delete window.location;
    window.location = { ...originalLocation, href: jest.fn() };
  });

  afterEach(() => {
    // Restore the original location after each test
    window.location = originalLocation;
  });

  it("renders correctly with the specified attributes and styles", () => {
    const { getByAltText } = render(<Logo />);
    const logoImage = getByAltText("CondoConnect");

    // Check if the logo is in the document
    expect(logoImage).toBeInTheDocument();

    // Check the src attribute
    expect(logoImage).toHaveAttribute(
      "src",
      expect.stringContaining("Logo_BiggerWriting.png")
    );

    // Check the className
    expect(logoImage).toHaveClass("logo");

    // Check the inline styles
    expect(logoImage).toHaveStyle("width: 140px");
    expect(logoImage).toHaveStyle("height: auto");
    expect(logoImage).toHaveStyle("top: 10px");
    expect(logoImage).toHaveStyle("left: 10px");
  });

  it("navigates to home on click", () => {
    const { getByAltText } = render(<Logo />);
    const logoImage = getByAltText("CondoConnect");

    // Simulate a click on the logo
    fireEvent.click(logoImage);

    // Verify window.location.href was set to "/"
    expect(window.location.href).toBe("/");
  });
});
