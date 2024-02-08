import React from "react";
import { render } from "@testing-library/react";
import App from "../App"; // Assuming that this is the correct path to your App component
import "./index.css";
import { Router } from "react-router-dom";

test("renders App component without errors", () => {
  const { getByTestId } = render(<Router>
      <App />
    </Router>);
  const appElement = getByTestId("app"); // Assuming you have a test ID for your main App component
  expect(appElement).toBeInTheDocument();
});