import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import CondoFilesComponent, {
  handleDragEnter,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleUploadClick,
  handleCancelClick,
  resetFileInputValue,
} from "../components/CondoFilesComponent";

describe("CondoFilesComponent", () => {
  const condoID = "condo123";
  const condoFiles = [];
  const setCondoFiles = jest.fn();
  const onFileClick = jest.fn();

  it("renders correctly", () => {
    render(
      <CondoFilesComponent
        condoID={condoID}
        condoFiles={condoFiles}
        setCondoFiles={setCondoFiles}
        onFileClick={onFileClick}
      />
    );

    expect(screen.getByText("Drag & Drop files here")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload Files")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("handles file upload correctly", async () => {
    render(
      <CondoFilesComponent
        condoID={condoID}
        condoFiles={condoFiles}
        setCondoFiles={setCondoFiles}
        onFileClick={onFileClick}
      />
    );

    const fileInput = screen.getByTestId("file-input");
    fireEvent.change(fileInput, {
      target: {
        files: [new File(["content"], "example.txt", { type: "text/plain" })],
      },
    });

    await waitFor(() => {
      expect(onFileClick).toHaveBeenCalledTimes(1);
      expect(onFileClick).toHaveBeenCalledWith({
        fileName: "example.txt",
        content: "content",
      });
    });
  });

  it("handles cancel button click correctly", async () => {
    render(
      <CondoFilesComponent
        condoID={condoID}
        condoFiles={condoFiles}
        setCondoFiles={setCondoFiles}
        onFileClick={onFileClick}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    const fileInput = screen.getByTestId("file-input");
    expect(fileInput.files).toHaveLength(0);
  });

  describe("handleDragEnter", () => {
    test("sets isDragging to true", () => {
      const event = { preventDefault: jest.fn() };
      const setIsDragging = jest.fn();
      handleDragEnter(event, setIsDragging);
      expect(setIsDragging).toHaveBeenCalledWith(true);
    });
  });

  describe("handleDragOver", () => {
    test("prevents default behavior", () => {
      const event = { preventDefault: jest.fn() };
      handleDragOver(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe("handleDragLeave", () => {
    test("sets isDragging to false", () => {
      const setIsDragging = jest.fn();
      handleDragLeave(setIsDragging);
      expect(setIsDragging).toHaveBeenCalledWith(false);
    });
  });

  describe("handleDrop", () => {
    test("appends dropped files and triggers onFileClick for text files", () => {
      const files = [];
      const setFiles = jest.fn();
      const setIsDragging = jest.fn();
      const event = {
        preventDefault: jest.fn(),
        dataTransfer: {
          files: [{ name: "file1.txt", type: "text/plain" }],
        },
      };
      handleDrop(event, files, setFiles, setIsDragging, onFileClick);
      expect(setFiles).toHaveBeenCalledWith([
        ...files,
        event.dataTransfer.files[0],
      ]);
      expect(onFileClick).toHaveBeenCalledWith({
        fileName: event.dataTransfer.files[0].name,
        content: expect.any(String),
      });
      expect(setIsDragging).toHaveBeenCalledWith(false);
    });

    test("does not trigger onFileClick for non-text files", () => {
      const files = [];
      const setFiles = jest.fn();
      const setIsDragging = jest.fn();
      const event = {
        preventDefault: jest.fn(),
        dataTransfer: {
          files: [{ name: "image.png", type: "image/png" }],
        },
      };
      handleDrop(event, files, setFiles, setIsDragging, onFileClick);
      expect(setFiles).toHaveBeenCalledWith([
        ...files,
        event.dataTransfer.files[0],
      ]);
      expect(onFileClick).not.toHaveBeenCalled(); // Ensure onFileClick is not called
      expect(setIsDragging).toHaveBeenCalledWith(false);
    });
  });

  describe("handleUploadClick", () => {
    test("uploads files and updates condoFiles even if some fail", async () => {
      const files = [{ name: "file1.txt" }, { name: "file2.txt" }];
      const setFiles = jest.fn();
      const setCondoFiles = jest.fn();
      const uploadFile = jest
        .fn()
        .mockResolvedValueOnce({ fileName: "file1.txt" })
        .mockRejectedValueOnce(new Error("Upload error"));

      await handleUploadClick(
        condoID,
        files,
        setFiles,
        setCondoFiles,
        uploadFile
      );
      expect(uploadFile).toHaveBeenCalledTimes(2);
      expect(uploadFile).toHaveBeenCalledWith(condoID, files[0]);
      expect(uploadFile).toHaveBeenCalledWith(condoID, files[1]);
      expect(setCondoFiles).toHaveBeenCalledWith([{ fileName: "file1.txt" }]);
      expect(setFiles).toHaveBeenCalledWith([]);
    });
  });

  describe("handleCancelClick", () => {
    test("resets files array to empty", () => {
      const setFiles = jest.fn();
      handleCancelClick(setFiles);
      expect(setFiles).toHaveBeenCalledWith([]);
    });
  });
});
