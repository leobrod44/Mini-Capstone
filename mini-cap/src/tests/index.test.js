import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Mocking ReactDOM.createRoot and reportWebVitals
jest.mock("react-dom", () => ({
  createRoot: jest.fn().mockImplementation(() => ({
    render: jest.fn(),
  })),
}));
jest.mock("./reportWebVitals");

describe("index.js", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>'; // Reset the DOM
  });

  it("renders App component without crashing", () => {
    // Require index.js to execute it
    require("./index");

    // Check if ReactDOM.createRoot was called with the correct element
    const rootElement = document.getElementById("root");
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);

    // Verify that createRoot().render was called with <App />
    const mockCreateRootInstance = ReactDOM.createRoot.mock.results[0].value;
    expect(mockCreateRootInstance.render).toHaveBeenCalledWith(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });

  it("calls reportWebVitals", () => {
    // Re-import index.js to re-execute it
    jest.resetModules();
    require("./index");

    // Verify reportWebVitals was called
    expect(reportWebVitals).toHaveBeenCalled();
  });
});
