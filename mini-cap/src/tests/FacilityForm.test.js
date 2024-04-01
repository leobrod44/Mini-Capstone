import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import FacilityForm from "../components/FacilityForm";

describe("FacilityForm", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockFacility = {
    name: "Gym",
    description: "Fitness center",
    startHour: "09:00",
    endHour: "21:00",
  };

  beforeEach(() => {
    render(
      <FacilityForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        facility={mockFacility}
        isEditing={true}
      />
    );
  });

  it("should render the form with the correct fields and values", () => {
    expect(screen.getByLabelText(/Title:/i)).toHaveValue(mockFacility.name);
    expect(screen.getByLabelText(/Description:/i)).toHaveValue(
      mockFacility.description
    );
    expect(screen.getByLabelText(/Available Start Time:/i)).toHaveValue(
      mockFacility.startHour
    );
    expect(screen.getByLabelText(/Available End Time:/i)).toHaveValue(
      mockFacility.endHour
    );
  });

  it("should call onSave with the correct data when the form is submitted", () => {
    fireEvent.change(screen.getByLabelText(/Title:/i), {
      target: { value: "Updated Gym" },
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: "Updated Fitness center" },
    });
    fireEvent.change(screen.getByLabelText(/Available Start Time:/i), {
      target: { value: "10:00" },
    });
    fireEvent.change(screen.getByLabelText(/Available End Time:/i), {
      target: { value: "22:00" },
    });
    fireEvent.click(screen.getByText(/Save/i));

    expect(mockOnSave).toHaveBeenCalledWith({
      title: "Updated Gym",
      description: "Updated Fitness center",
      startHour: "10:00",
      endHour: "22:00",
    });
  });

  it("should call onCancel when the cancel button is clicked", () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
