import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";

jest.mock("../backend/Fetcher", () => ({
  getCondos: jest.fn(),
  getCondoPicture: jest.fn(),
}));

describe("PropertyDetailsPage component", () => {
  test("renders PropertyDetailsPage component with no registered condos", () => {
    // Mocking the Fetcher functions
    jest
      .spyOn(require("../backend/Fetcher"), "getCondos")
      .mockResolvedValue([]);

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Check if the message for no registered condos is rendered
    expect(
      screen.getByText("You have not added any condos yet.")
    ).toBeInTheDocument();

    // Check if the "Add a condo" button is rendered
    expect(screen.getByText("Add a condo")).toBeInTheDocument();
  });

  test("renders PropertyDetailsPage component with registered condos", () => {
    // Mocking data for registered condos
    const mockCondos = [
      { id: 1, name: "Property 1" },
      { id: 2, name: "Property 2" },
    ];

    // Mocking the Fetcher functions
    jest
      .spyOn(require("../backend/Fetcher"), "getCondos")
      .mockResolvedValue(mockCondos);
    jest
      .spyOn(require("../backend/Fetcher"), "getCondoPicture")
      .mockResolvedValue("mock-image-url");

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Check if the message for registered condos is rendered
    expect(
      screen.getByText("You have not added any condos yet.")
    ).toBeInTheDocument();

    // Check if each condo is rendered
    mockCondos.forEach((condo) => {
      expect(screen.getByText(condo.name)).toBeInTheDocument();
    });

    // Check if the "Add a condo" button is rendered
    expect(screen.getByText("Add a condo")).toBeInTheDocument();
  });

  test("navigates to the '/add-condo' page when clicking the 'Add a condo' link", () => {
    // Mocking the Fetcher functions
    jest
      .spyOn(require("../backend/Fetcher"), "getCondos")
      .mockResolvedValue([]);
    jest
      .spyOn(require("../backend/Fetcher"), "getCondoPicture")
      .mockResolvedValue("mock-image-url");

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Check if the "Add a condo" button is rendered
    expect(screen.getByText("Add a condo")).toBeInTheDocument();

    // Trigger a click event on the "Add a condo" link
    screen.getByText("Add a condo").click();

    // Check if the navigation to '/add-condo' occurs
    expect(window.location.pathname).toBe("/");
  });
});
