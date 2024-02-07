import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom"; 
import { toast } from "react-toastify";
import LoginPage from "../pages/LoginPage.jsx";

// Mocking toast


afterEach(cleanup);


jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    ...originalModule,
    toast: {
      ...originalModule.toast,
      error: jest.fn(),
    },
  };
});


describe("LoginPage", () => {
  beforeEach(() => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
  });

  it("renders the login form with email and password fields", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates the email and password fields when they are changed", () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    expect(screen.getByLabelText(/email/i).value).toBe("test@example.com");
    expect(screen.getByLabelText(/password/i).value).toBe("password");
  });

  
  it("shows a toast message when the email format is invalid", () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Invalid email format. Please include '@' and '.' in your email address."
    );
  });
  
  it("shows a toast message when the email format is invalid", () => {
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Please enter both email and password."
    );
  });

});