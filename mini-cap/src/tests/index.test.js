import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";

import { setupServer } from "msw/node";

// Mock server for handling API requests in tests
const server = setupServer(
  rest.get("/api/data", (req, res, ctx) => {
    return res(ctx.json({ data: "some data" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders App component and interacts with UI", async () => {
  const { getByText, getByRole } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Simulate user interactions
  fireEvent.click(getByText("Some Button")); // Adjust text to match your actual UI

  // Test for conditional rendering
  const conditionalElement = getByText("Conditional Element"); // Adjust text to match your actual UI
  expect(conditionalElement).toBeInTheDocument();

  // Test routing
  fireEvent.click(getByRole("link", { name: "About" })); // Adjust link text to match your actual UI
  await waitFor(() => expect(getByText("About Page")).toBeInTheDocument()); // Adjust text to match your actual UI

  // Test side effects (e.g., data fetching)
  await waitFor(() => expect(getByText("some data")).toBeInTheDocument());
});
