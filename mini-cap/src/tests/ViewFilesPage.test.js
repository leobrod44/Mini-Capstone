import React from "react";
import { render, screen } from "@testing-library/react";
import ViewFilesPage from "../pages/ViewFilesPage";
import FilesComponent from "../components/FilesComponent";

describe("ViewFilesPage", () => {
  test("renders header, back button, files heading, FilesComponent, and footer", () => {
    // Mocking userID
    const userID = "testUserID";

    render(<ViewFilesPage userID={userID} />);

    // Ensure header is rendered
    expect(screen.getByTestId("header")).toBeInTheDocument();

    // Ensure back arrow button is rendered
    expect(screen.getByTestId("back-arrow-btn")).toBeInTheDocument();

    // Ensure files heading is rendered
    expect(screen.getByText("Files")).toBeInTheDocument();

    // Ensure FilesComponent is rendered with the correct userID prop
    const filesComponent = screen.getByTestId("files-component");
    expect(filesComponent).toBeInTheDocument();
    expect(filesComponent).toHaveAttribute("userID", userID);

    // Ensure footer is rendered
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
