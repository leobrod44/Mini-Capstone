import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropertyDetailsPage from "./PropertyDetailsPage";

jest.mock("../backend/Fetcher", () => ({
  getCondos: jest.fn(),
  getCondoPicture: jest.fn(),
}));

test("renders PropertyDetailsPage component with no registered condos", async () => {
  render(
    <MemoryRouter>
      <PropertyDetailsPage />
    </MemoryRouter>
  );

  // Check if the title is rendered
  expect(screen.getByText("My Property")).toBeInTheDocument();

  // Check if the message for no registered condos is rendered
  expect(
    screen.getByText("You have not added any condos yet.")
  ).toBeInTheDocument();

  // Check if the "Add a condo" button is rendered
  expect(screen.getByText("Add a condo")).toBeInTheDocument();
});

test("renders PropertyDetailsPage component with registered condos", async () => {
  // Mocking data for registered condos
  const mockCondos = [
    { id: 1, name: "Condo 1" },
    { id: 2, name: "Condo 2" },
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

  // Check if the title is rendered
  expect(screen.getByText("My Property")).toBeInTheDocument();

  // Wait for the component to load the condos
  await waitFor(() => {
    // Check if the message for registered condos is rendered
    expect(screen.getByText("You have registered condos:")).toBeInTheDocument();

    // Check if each condo is rendered
    mockCondos.forEach((condo) => {
      expect(screen.getByText(condo.name)).toBeInTheDocument();
    });
  });

  // Check if the "Add a condo" button is rendered
  expect(screen.getByText("Add a condo")).toBeInTheDocument();
});

test("navigates to the '/add-condo' page when clicking the 'Add a condo' link", async () => {
  render(
    <MemoryRouter>
      <PropertyDetailsPage />
    </MemoryRouter>
  );

  // Mocking the Fetcher functions
  jest.spyOn(require("../backend/Fetcher"), "getCondos").mockResolvedValue([]);
  jest
    .spyOn(require("../backend/Fetcher"), "getCondoPicture")
    .mockResolvedValue("mock-image-url");

  fireEvent.click(screen.getByText("Add a condo"));
  expect(window.location.pathname).toBe("/add-condo");
});
