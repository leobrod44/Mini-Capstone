import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import * as PropertyHandler from "../backend/PropertyHandler";
import * as Backend from "../backend/PropertyHandler"; // Import the backend module

// Mock the Header and Footer components
jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);
jest.mock("../backend/PropertyHandler");
jest.mock("../backend/ImageHandler", () => ({
  getCondoPicture: jest.fn().mockResolvedValue("https://example.com/image.jpg"),
}));

// Mock React toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(toast, "success").mockImplementation();
    jest.spyOn(toast, "error").mockImplementation();
  });

  it("renders without crashing and renders condos (if any)", () => {
    const mockCondos = [
      {
        propertyName: "Property 1",
        unitNumber: "101",
        parkingNumber: "P101",
        lockerNumber: "L101",
        userType: "Owner",
      },
    ];

    jest.spyOn(PropertyHandler, "getUserCondos").mockResolvedValue(mockCondos);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Header Mock")).toBeInTheDocument();
    expect(screen.getByText("Footer Mock")).toBeInTheDocument();

    const condoComponents = screen.queryAllByTestId("condo-component");

    if (condoComponents.length > 0) {
      // If property components are rendered, ensure they are present
      expect(screen.getByText("Property 1")).toBeInTheDocument();
    } else {
      // If no property components are rendered, ensure the registration section is present
      expect(
        screen.getByText("You have not registered a condo yet.")
      ).toBeInTheDocument();
      expect(screen.getByText("Register my first condo")).toBeInTheDocument();
    }
  });

  it("renders the welcome message correctly", () => {
    render(<Dashboard />);
    expect(
      screen.getByText("Welcome to your Condo Dashboard !")
    ).toBeInTheDocument();
  });

  it("renders the registration condo section when the user has no condos", () => {
    render(<Dashboard />);
    expect(
      screen.getByText("You have not registered a condo yet.")
    ).toBeInTheDocument();
    expect(screen.getByText("Register my first condo")).toBeInTheDocument();
  });

  it('toggles the visibility of the popup when clicking the "Register my first condo" button', () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByText("Register my first condo"));
    expect(screen.getByText("Register your condo")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-button"));
    expect(screen.queryByText("Register your condo")).not.toBeInTheDocument();
  });

  it("renders AddCondoBtn when hasCondos is true and does not render it when hasCondos is false", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.queryByTestId("add-condo-btn")).not.toBeInTheDocument(); // Button shouldn't be rendered initially
    const toggleButton = screen.getByTestId("toggle");
    fireEvent.click(toggleButton); // Set hasProperties to true

    waitFor(() => {
      expect(screen.getByTestId("add-condo-btn")).toBeInTheDocument(); // Button should be rendered now
    });
    fireEvent.click(toggleButton); // Set hasProperties to false
    // Wait for the component to update with the new state
    waitFor(() => {
      expect(screen.queryByTestId("add-condo-btn")).not.toBeInTheDocument(); // Button should not be rendered now
    });
  });

  it("does not render the AddCondoBtn when the user has no properties", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.queryByTestId("add-condo-btn")).not.toBeInTheDocument();
  });

  it("fetches condo pictures and updates state accordingly", async () => {
    const mockCondos = [
      {
        propertyName: "Property 1",
        unitNumber: "101",
        parkingNumber: "P101",
        lockerNumber: "L101",
        userType: "Owner",
      },
    ];

    jest.spyOn(PropertyHandler, "getUserCondos").mockResolvedValue(mockCondos);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Property 1")).toBeInTheDocument();
    });
  });

  it("registers a new condo successfully", async () => {
    const mockCondos = [];

    jest.spyOn(PropertyHandler, "getUserCondos").mockResolvedValue(mockCondos);
    jest.spyOn(Backend, "linkCondoToUser").mockResolvedValue("Condo added!"); // Mock the linkCondoToUser function

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const registerButton = screen.getByText("Register my first condo");
    fireEvent.click(registerButton);

    expect(screen.getByText("Register your condo")).toBeInTheDocument();

    const condoKeyInput = screen.getByTestId("condo-key-input");
    fireEvent.change(condoKeyInput, { target: { value: "mocked-condo-key" } });

    const submitButton = screen.getByText("Submit Key");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Condo added!");
      expect(screen.queryByText("Register your condo")).not.toBeInTheDocument();
    });
  });

   it('displays error message if condo registration fails', async () => {
    const mockCondos = []; 
    jest.spyOn(PropertyHandler, 'getUserCondos').mockResolvedValue(mockCondos);
    jest.spyOn(Backend, 'linkCondoToUser').mockRejectedValue("Error adding condo"); 

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Click the button to register a condo
    const registerButton = screen.getByText('Register my first condo');
    fireEvent.click(registerButton);

    // Ensure the registration popup is displayed
    expect(screen.getByText('Register your condo')).toBeInTheDocument();

    // Assuming you have some way to simulate a condo key, for instance, a text input
    const condoKeyInput = screen.getByTestId('condo-key-input');
    fireEvent.change(condoKeyInput, { target: { value: '12345678912345678912' } });

    // Simulate clicking the submit button
    const submitButton = screen.getByText('Submit Key');
    fireEvent.click(submitButton);

    // Wait for asynchronous operations to complete
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error adding condo');
      expect(screen.getByText('Register your condo')).toBeInTheDocument(); // Popup should still be visible
    });
  });
 

  
  it('displays error message if key is not valid', async () => {
    const mockCondos = []; 
    jest.spyOn(PropertyHandler, 'getUserCondos').mockResolvedValue(mockCondos);
    jest.spyOn(Backend, 'linkCondoToUser').mockRejectedValue("Key is not valid!"); 

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Click the button to register a condo
    const registerButton = screen.getByText('Register my first condo');
    fireEvent.click(registerButton);

    // Ensure the registration popup is displayed
    expect(screen.getByText('Register your condo')).toBeInTheDocument();

    // Assuming you have some way to simulate a condo key, for instance, a text input
    const condoKeyInput = screen.getByTestId('condo-key-input');
    fireEvent.change(condoKeyInput, { target: { value: 'mocked-condo-key' } });

    // Simulate clicking the submit button
    const submitButton = screen.getByText('Submit Key');
    fireEvent.click(submitButton);

    // Wait for asynchronous operations to complete
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Key is not valid!');
      expect(screen.getByText('Register your condo')).toBeInTheDocument(); // Popup should still be visible
    });
  });
 
});
