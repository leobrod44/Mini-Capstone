import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropertyPage from "./PropertyPage";

test("renders PropertyPage component with no registered properties", () => {
  render(
    <MemoryRouter>
      <PropertyPage />
    </MemoryRouter>
  );

  // Check if the title is rendered
  expect(screen.getByText("My Property 2")).toBeInTheDocument();

  // Check if the message for no registered properties is rendered
  expect(
    screen.getByText("You have not added any condos yet.")
  ).toBeInTheDocument();

  // Check if the "Add a condo" button is rendered
  expect(screen.getByText("Add a condo")).toBeInTheDocument();
});

test("renders PropertyPage component with registered properties", () => {
  render(
    <MemoryRouter>
      <PropertyPage />
    </MemoryRouter>
  );

  // Simulate having registered properties
  fireEvent.click(screen.getByTestId("add-condo-btn"));

  // Check if the message for registered properties is rendered
  expect(
    screen.getByText("You have registered properties:")
  ).toBeInTheDocument();
});
