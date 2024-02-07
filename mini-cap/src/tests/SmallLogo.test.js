import React from "react";
import { render } from "@testing-library/react";
import Logo from "../components/SmallLogo.jsx"; // Adjust the path according to your file structure

describe("Logo Component", () => {
  it("renders the logo with correct attributes and styles", () => {
    const { getByAltText } = render(<Logo />);
    const logoImage = getByAltText("CondoConnect");

    // Check if the logo is in the document
    expect(logoImage).toBeInTheDocument();

    // Check the src attribute
    expect(logoImage).toHaveAttribute(
      "src",
      expect.stringContaining("logo.png")
    );

    // Check the className
    expect(logoImage).toHaveClass("logo");

    // Check the inline styles
    expect(logoImage).toHaveStyle("width: 100px");
    expect(logoImage).toHaveStyle("height: auto");
    expect(logoImage).toHaveStyle("top: 10px");
    expect(logoImage).toHaveStyle("left: 10px");
  });
});
