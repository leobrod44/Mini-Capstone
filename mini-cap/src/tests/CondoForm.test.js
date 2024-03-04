// CondoForm.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CondoForm from "../components/CondoForm";

describe("CondoForm", () => {
  it("renders condo form with provided props", () => {
    const props = {
      condo: {
        unitNumber: "123",
        squareFeet: "1000",
        unitPrice: "500000",
        unitSize: "2.5",
        parkingSpot: "P101",
        locker: "L202",
      },
      onInputChange: jest.fn(),
      onFileChange: jest.fn(),
      onCondoSubmit: jest.fn(),
    };

    render(<CondoForm {...props} />);

    expect(screen.getByLabelText("Unit Number:")).toHaveValue("123");
    expect(screen.getByLabelText("Square Feet")).toHaveValue("1000");
    expect(screen.getByLabelText("Unit Price:")).toHaveValue("500000");
    expect(screen.getByLabelText("Unit Size:")).toHaveValue("2.5");
    expect(screen.getByLabelText("Parking Spot")).toHaveValue("P101");
    expect(screen.getByLabelText("Locker")).toHaveValue("L202");
  });

  it("triggers onInputChange when condo input changes", () => {
    const props = {
      condo: {
        unitNumber: "",
        squareFeet: "",
        unitPrice: "",
        unitSize: "",
        parkingSpot: "",
        locker: "",
      },
      onInputChange: jest.fn(),
      onFileChange: jest.fn(),
      onCondoSubmit: jest.fn(),
    };

    render(<CondoForm {...props} />);
    const unitNumberInput = screen.getByLabelText("Unit Number:");

    fireEvent.change(unitNumberInput, { target: { value: "123" } });

    expect(props.onInputChange).toHaveBeenCalledWith("unitNumber", "123");
  });

  it("triggers onFileChange when condo file input changes", () => {
    const props = {
      condo: {
        unitNumber: "",
        squareFeet: "",
        unitPrice: "",
        unitSize: "",
        parkingSpot: "",
        locker: "",
      },
      onInputChange: jest.fn(),
      onFileChange: jest.fn(),
      onCondoSubmit: jest.fn(),
    };

    render(<CondoForm {...props} />);
    const fileInput = screen.getByLabelText("Condo Picture:");

    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(["dummy content"], "image.jpg", { type: "image/jpeg" }),
        ],
      },
    });

    expect(props.onFileChange).toHaveBeenCalledWith("image.jpg");
  });

  it("triggers onCondoSubmit when condo form is submitted", () => {
    const props = {
      condo: {
        unitNumber: "123",
        squareFeet: "1000",
        unitPrice: "500000",
        unitSize: "2.5",
        parkingSpot: "P101",
        locker: "L202",
      },
      onInputChange: jest.fn(),
      onFileChange: jest.fn(),
      onCondoSubmit: jest.fn(),
    };

    render(<CondoForm {...props} />);
    const submitButton = screen.getByText("Save Condo", { selector: "button" });

    fireEvent.click(submitButton);

    expect(props.onCondoSubmit).toHaveBeenCalled();
  });
});
