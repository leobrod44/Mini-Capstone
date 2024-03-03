import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddressComponent from "../components/AddressComponent";

describe("AddressComponent", () => {
  it("should update the address value when a place is selected", () => {
    const mockOnChange = jest.fn();
    render(
      <AddressComponent
        name="address"
        value=""
        onChange={mockOnChange}
        setFormData={() => {}}
      />
    );

    const addressInput = screen.getByPlaceholderText("Enter address...");
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });

    // Simulate a place being selected
    const place = {
      formatted_address: "123 Main St",
      geometry: {
        location: {
          lat: () => 40.7128,
          lng: () => -74.006,
        },
      },
    };

    const inputRef = addressInput.parentElement.querySelector("input");
    inputRef.getPlaces = () => [place];

    fireEvent.change(inputRef, { target: { value: "123 Main St" } });

    expect(mockOnChange).toHaveBeenCalledWith({
      target: {
        name: "address",
        value: "123 Main St",
      },
    });
  });
});
