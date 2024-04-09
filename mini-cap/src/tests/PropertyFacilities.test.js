import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFacilities from "../pages/PropertyFacilities";
import "@testing-library/jest-dom";

describe("PropertyFacilities", () => {
  test("renders the component and its elements", () => {
    render(<PropertyFacilities />);

    // Check if the title is rendered
    expect(screen.getByText("Property Facilities")).toBeInTheDocument();

    // Check if the Add Facility button is rendered
    expect(screen.getByText("Add Facility")).toBeInTheDocument();

    // Check if the mock facility is rendered
    expect(screen.getByText("Gym")).toBeInTheDocument();
    expect(screen.getByText("Apes together... strong.")).toBeInTheDocument();
    expect(screen.getByText("Hours: 06:00 - 22:00")).toBeInTheDocument();

    // Check if the Edit and Delete buttons are rendered
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("handles Add Facility button click", () => {
    // You can mock the console.log to test the click event
    const consoleSpy = jest.spyOn(console, "log");
    render(<PropertyFacilities />);

    const addButton = screen.getByText("Add Facility");
    fireEvent.click(addButton);

    expect(consoleSpy).toHaveBeenCalledWith("Add facility logic here");
  });

  test("handles Delete button click", () => {
    // Mock the console.log to test the click event
    const consoleSpy = jest.spyOn(console, "log");
    render(<PropertyFacilities />);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    // Assuming the mock facility's id is 1
    expect(consoleSpy).toHaveBeenCalledWith("Delete facility logic here");
  });

  // Additional tests can be added here
});
