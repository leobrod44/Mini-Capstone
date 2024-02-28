import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Popup from "../components/Popup";
import { BrowserRouter } from "react-router-dom";

describe("Popup Component", () => {
  it("renders the popup content correctly", () => {
    render(
      <BrowserRouter>
        <Popup handleClose={() => {}} />
      </BrowserRouter>
    );

    // Check if popup content is rendered correctly
    expect(screen.getByText("Register your condo")).toBeInTheDocument();
    expect(screen.getByLabelText("Key:")).toBeInTheDocument();
    expect(screen.getByText("Submit Key")).toBeInTheDocument();
  });

  it("submits the form with a valid key", async () => {
    const mockHandleClose = jest.fn();
    const mockHandleRegisterCondo = jest.fn(() => Promise.resolve());
    render(
      <BrowserRouter>
        <Popup
          handleClose={mockHandleClose}
          handleRegisterCondo={mockHandleRegisterCondo}
        />
      </BrowserRouter>
    );

    const input = screen.getByLabelText("Key:");
    const submitButton = screen.getByText("Submit Key");

    fireEvent.change(input, { target: { value: "valid_key" } });
    fireEvent.click(submitButton);

    // Check if handleRegisterCondo is called with the correct key
    expect(mockHandleRegisterCondo).toHaveBeenCalledWith("valid_key");

    // Check if handleClose is called after successful registration
    await screen.findByTestId("close-button");
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("handles registration failure", async () => {
    const mockHandleClose = jest.fn();
    const mockHandleRegisterCondo = jest.fn(() => Promise.reject("Some error"));

    // Mock console.error to capture the error message
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Popup
          handleClose={mockHandleClose}
          handleRegisterCondo={mockHandleRegisterCondo}
        />
      </BrowserRouter>
    );

    const input = screen.getByLabelText("Key:");
    const submitButton = screen.getByText("Submit Key");

    fireEvent.change(input, { target: { value: "invalid_key" } });
    fireEvent.click(submitButton);
    expect(mockHandleRegisterCondo).toHaveBeenCalledWith("invalid_key");
    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Registration failed",
        "Some error"
      )
    );
    consoleErrorSpy.mockRestore();
  });
});
