import React from "react";
import { render, screen } from "@testing-library/react";
import FilesComponent from "../components/FilesComponent";

describe("FilesComponent", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restore mock implementations after each test
  });

  test("does not render anything if no properties or files are present - Empty properties", async () => {
    // Mocking successful data fetching with empty properties
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({ properties: [] }),
    });

    render(<FilesComponent />);
    expect(
      await screen.queryByText(/Loading...|Error:/)
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Test Property")).not.toBeInTheDocument();
    expect(screen.queryByText("File 1")).not.toBeInTheDocument();
  });

  test("handles empty response from API gracefully - Empty response", async () => {
    // Mocking successful data fetching with empty response
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({}),
    });

    render(<FilesComponent />);
    expect(
      await screen.queryByText(/Loading...|Error:/)
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Test Property")).not.toBeInTheDocument();
    expect(screen.queryByText("File 1")).not.toBeInTheDocument();
    expect(screen.queryByText("File 2")).not.toBeInTheDocument();
  });
});
