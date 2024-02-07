import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteModal from "../components/DeleteModal.jsx"; // Adjust the path according to your file structure

describe("DeleteModal Component", () => {
  const handleClose = jest.fn();
  const handleDeleteItem = jest.fn();
  const message = "Are you sure you want to delete this item?";

  it("should be visible when show is true", () => {
    render(
      <DeleteModal
        show={true}
        handleClose={handleClose}
        handleDeleteItem={handleDeleteItem}
        message={message}
      />
    );
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("should not be visible when show is false", () => {
    const { queryByText } = render(
      <DeleteModal
        show={false}
        handleClose={handleClose}
        handleDeleteItem={handleDeleteItem}
        message={message}
      />
    );
    expect(queryByText("Confirm Delete")).not.toBeInTheDocument();
  });

  it("should call handleDeleteItem when Delete Permanently button is clicked", () => {
    render(
      <DeleteModal
        show={true}
        handleClose={handleClose}
        handleDeleteItem={handleDeleteItem}
        message={message}
      />
    );
    fireEvent.click(screen.getByText("Delete Permanently"));
    expect(handleDeleteItem).toHaveBeenCalledTimes(1);
  });

  it("should call handleClose when Cancel button is clicked", () => {
    render(
      <DeleteModal
        show={true}
        handleClose={handleClose}
        handleDeleteItem={handleDeleteItem}
        message={message}
      />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should call handleClose when close button is clicked", () => {
    render(
      <DeleteModal
        show={true}
        handleClose={handleClose}
        handleDeleteItem={handleDeleteItem}
        message={message}
      />
    );
    fireEvent.click(screen.getByClassName("btn-close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
