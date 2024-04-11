import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReservationComponent from "../components/ReservationComponent"; // Adjust the import path as necessary

describe("ReservationComponent", () => {
  test("renders the facility type and reservation details correctly", () => {
    render(
      <ReservationComponent
        facilityType="Swimming Pool"
        date="10"
        month={3} // April, since the month index is 0-based
        startTime="10:00 AM"
        endTime="11:00 AM"
      />
    );

    // Check for facility type
    expect(screen.getByText(/Upcoming Reservation: Swimming Pool/i)).toBeInTheDocument();

    // Check for date and time
    expect(screen.getByText(/Date: April 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Time: 10:00 AM - 11:00 AM/i)).toBeInTheDocument();
  });

  test("handles month indexing correctly", () => {
    render(
      <ReservationComponent
        facilityType="Tennis Court"
        date="15"
        month={0} 
        startTime="2:00 PM"
        endTime="3:00 PM"
      />
    );

    // Check if January is correctly displayed given the month index of 0
    expect(screen.getByText(/Date: January 15/i)).toBeInTheDocument();
  });

});
