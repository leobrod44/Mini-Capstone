import React from "react";
import { render } from "@testing-library/react";
import App from "./App"; // Assuming that this is the correct path to your App component
import "./index.css";
import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

test("renders App component without errors", () => {
  const { getByTestId } = render(<App />);
  const appElement = getByTestId("app"); // Assuming you have a test ID for your main App component
  expect(appElement).toBeInTheDocument();
});
