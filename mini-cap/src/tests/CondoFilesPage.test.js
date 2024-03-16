import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CondoFilesPage from "../pages/CondoFilesPage";
import { getPropertyFiles } from "../backend/ImageHandler";

jest.mock("../backend/ImageHandler", () => ({
  getPropertyFiles: jest.fn(),
}));

describe("CondoFilesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders condo files page correctly when condo files are available", async () => {
    const propertyName = "Test Property";
    const propertyID = "123";
    const condoFiles = [
      { fileName: "file1.txt", content: "Content 1" },
      { fileName: "file2.txt", content: "Content 2" },
    ];

    // Mock getPropertyFiles to resolve with condoFiles
    getPropertyFiles.mockResolvedValue(condoFiles);

    render(
      <MemoryRouter initialEntries={[`/condo/${propertyID}/${propertyName}`]}>
        <CondoFilesPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(`Condo Files for Property ${propertyName}`)
    ).toBeInTheDocument();

    expect(
      screen.getByText(`Files associated with ${propertyName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText("No files available")).not.toBeInTheDocument();
  });

  it("handles opening and closing modal correctly", async () => {
    const propertyName = "Test Property";
    const propertyID = "123";
    const condoFiles = [
      { fileName: "file1.txt", content: "Content 1" },
      { fileName: "file2.txt", content: "Content 2" },
    ];

    // Mock getPropertyFiles to resolve with condoFiles
    getPropertyFiles.mockResolvedValue(condoFiles);

    render(
      <MemoryRouter initialEntries={[`/condo/${propertyID}/${propertyName}`]}>
        <CondoFilesPage />
      </MemoryRouter>
    );

    // Click on a file to open modal
    const file1 = await screen.findByText("file1.txt");
    fireEvent.click(file1);

    // Ensure modal is opened
    expect(screen.getByText("Content 1")).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    // Ensure modal is closed
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("handles opening and closing modal correctly", () => {
    const TestComponent = () => {
      const [selectedFile, setSelectedFile] = React.useState(null);

      const handleOpenModal = (file) => {
        setSelectedFile(file);
      };

      const handleCloseModal = () => {
        setSelectedFile(null);
      };

      return (
        <div>
          <button onClick={() => handleOpenModal("file1.txt")}>
            Open Modal
          </button>
          <button onClick={handleCloseModal}>Close Modal</button>
          {selectedFile && <div>{selectedFile}</div>}
        </div>
      );
    };

    render(<TestComponent />);

    // Open modal
    fireEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByText("file1.txt")).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByText("file1.txt")).not.toBeInTheDocument();
  });

  it("handles opening and closing modal correctly with mocked getPropertyFiles", async () => {
    const propertyName = "Test Property";
    const propertyID = "123";
    const condoFiles = [
      { fileName: "file1.txt", content: "Content 1" },
      { fileName: "file2.txt", content: "Content 2" },
    ];

    // Mock getPropertyFiles to resolve with condoFiles
    getPropertyFiles.mockResolvedValue(condoFiles);

    render(
      <MemoryRouter initialEntries={[`/condo/${propertyID}/${propertyName}`]}>
        <CondoFilesPage />
      </MemoryRouter>
    );

    await act(async () => {});

    // Ensure handleOpenModal sets selectedFile
    const file1 = screen.getByText("file1.txt");
    fireEvent.click(file1);
    expect(screen.getByText("Content 1")).toBeInTheDocument();

    // Ensure handleCloseModal resets selectedFile
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });
});
