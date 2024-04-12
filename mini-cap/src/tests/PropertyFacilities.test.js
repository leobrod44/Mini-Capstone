import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import PropertyFacilities from "../pages/PropertyFacilities";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

jest.mock("../backend/FacilityHandler.js", () => ({
  getFacilities: jest.fn(),
  editFacility: jest.fn(),
  addFacility: jest.fn(),
}));
jest.mock("../backend/PropertyHandler.js", () => ({
  getPropertyData: jest.fn(),
}));

describe("PropertyFacilities", () => {
  test("renders the component and its elements", async () => {
    const mockFacilities = [
      {
        id: "1",
        type: "Gym",
        description: "Fitness equipment",
        startHour: "08:00",
        endHour: "22:00",
      },
      {
        id: "2",
        type: "Pool",
        description: "Swimming pool",
        startHour: "08:00",
        endHour: "22:00",
      },
    ];
    const FacilityHandler = require("../backend/FacilityHandler.js"); // Requiring the mocked module
    FacilityHandler.getFacilities.mockResolvedValueOnce(mockFacilities); // Mocking facilities with data
    const PropertyHandler = require("../backend/PropertyHandler.js"); // Requiring the mocked module
    const mockpropertyName = { propertyName: "Test Property" };
    PropertyHandler.getPropertyData.mockResolvedValueOnce(mockpropertyName); // Mocking facilities with data

    await act(async () => {
      render(
        <MemoryRouter>
          <PropertyFacilities />
        </MemoryRouter>
      );
    });
    // Check if the title is rendered
    expect(screen.getByText("Test Property Facilities")).toBeInTheDocument();

    // Check if the Add Facility button is rendered
    expect(screen.getByText("Add Facility")).toBeInTheDocument();

    // Asserting that the component renders with facilities
    await waitFor(() => {
      expect(screen.getByText("Gym")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Pool")).toBeInTheDocument();
    });
  });
  test("renders the component and its elements, click edit and click on cancel", async () => {
    const mockFacilities = [
      {
        id: "1",
        type: "Gym",
        description: "Fitness equipment",
        startHour: "08:00",
        endHour: "22:00",
      },
      {
        id: "2",
        type: "Pool",
        description: "Swimming pool",
        startHour: "08:00",
        endHour: "22:00",
      },
    ];
    const FacilityHandler = require("../backend/FacilityHandler.js"); // Requiring the mocked module
    FacilityHandler.getFacilities.mockResolvedValueOnce(mockFacilities); // Mocking facilities with data
    const PropertyHandler = require("../backend/PropertyHandler.js"); // Requiring the mocked module
    const mockpropertyName = { propertyName: "Test Property" };
    PropertyHandler.getPropertyData.mockResolvedValueOnce(mockpropertyName); // Mocking facilities with data

    await act(async () => {
      render(
        <MemoryRouter>
          <PropertyFacilities />
        </MemoryRouter>
      );
    });
    // Check if the title is rendered
    expect(screen.getByText("Test Property Facilities")).toBeInTheDocument();

    // Check if the Add Facility button is rendered
    expect(screen.getByText("Add Facility")).toBeInTheDocument();

    // Asserting that the component renders with facilities
    await waitFor(() => {
      expect(screen.getByText("Gym")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Pool")).toBeInTheDocument();
    });

    const editBtns = screen.getAllByText("Edit");
    fireEvent.click(editBtns[0]);

    const cancelBtn = screen.getByText("Cancel");
    fireEvent.click(cancelBtn);
  });
  test("renders the component and its elements, click edit and click on save", async () => {
    const mockFacilities = [
      {
        id: "1",
        type: "Gym",
        description: "Fitness equipment",
        startHour: "08:00",
        endHour: "22:00",
      },
      {
        id: "2",
        type: "Pool",
        description: "Swimming pool",
        startHour: "08:00",
        endHour: "22:00",
      },
    ];
    const FacilityHandler = require("../backend/FacilityHandler.js"); // Requiring the mocked module
    FacilityHandler.getFacilities.mockResolvedValueOnce(mockFacilities); // Mocking facilities with data
    FacilityHandler.editFacility.mockResolvedValueOnce({});
    const PropertyHandler = require("../backend/PropertyHandler.js"); // Requiring the mocked module
    const mockpropertyName = { propertyName: "Test Property" };
    PropertyHandler.getPropertyData.mockResolvedValueOnce(mockpropertyName); // Mocking facilities with data

    await act(async () => {
      render(
        <MemoryRouter>
          <PropertyFacilities />
        </MemoryRouter>
      );
    });
    // Check if the title is rendered
    expect(screen.getByText("Test Property Facilities")).toBeInTheDocument();

    // Check if the Add Facility button is rendered
    expect(screen.getByText("Add Facility")).toBeInTheDocument();

    // Asserting that the component renders with facilities
    await waitFor(() => {
      expect(screen.getByText("Gym")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Pool")).toBeInTheDocument();
    });

    const editBtns = screen.getAllByText("Edit");
    fireEvent.click(editBtns[0]);

    await waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    const saveBtn = screen.getByText("Save");
    fireEvent.click(saveBtn);
  });
  test("renders the component and its elements, click edit Delete", async () => {
    const mockFacilities = [
      {
        id: "1",
        type: "Gym",
        description: "Fitness equipment",
        startHour: "08:00",
        endHour: "22:00",
      },
      {
        id: "2",
        type: "Pool",
        description: "Swimming pool",
        startHour: "08:00",
        endHour: "22:00",
      },
    ];
    const FacilityHandler = require("../backend/FacilityHandler.js"); // Requiring the mocked module
    FacilityHandler.getFacilities.mockResolvedValueOnce(mockFacilities); // Mocking facilities with data
    FacilityHandler.editFacility.mockResolvedValueOnce({});
    const PropertyHandler = require("../backend/PropertyHandler.js"); // Requiring the mocked module
    const mockpropertyName = { propertyName: "Test Property" };
    PropertyHandler.getPropertyData.mockResolvedValueOnce(mockpropertyName); // Mocking facilities with data

    await act(async () => {
      render(
        <MemoryRouter>
          <PropertyFacilities />
        </MemoryRouter>
      );
    });
    // Check if the title is rendered
    expect(screen.getByText("Test Property Facilities")).toBeInTheDocument();

    // Check if the Add Facility button is rendered
    expect(screen.getByText("Add Facility")).toBeInTheDocument();

    // Asserting that the component renders with facilities
    await waitFor(() => {
      expect(screen.getByText("Gym")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Pool")).toBeInTheDocument();
    });

    const deleteBtns = screen.getAllByText("Delete");
    fireEvent.click(deleteBtns[0]);
  });
});
