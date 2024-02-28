import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BackArrowBtn from "../components/BackArrowBtn";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("BackArrowBtn Component", () => {
  it("renders the button correctly", () => {
    render(<BackArrowBtn />);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("floating_button1");
  });

  it("navigates back when the button is clicked", () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    render(<BackArrowBtn />);
    const buttonElement = screen.getByRole("button");
    fireEvent.click(buttonElement);

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
