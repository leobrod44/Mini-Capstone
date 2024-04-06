import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationElement from "../components/NotificationElement";

describe("NotificationElement Component", () => {
  const mockNotification = {
    id: 1,
    condoName: "Condo A",
    type: "Type A",
    date: "2024-03-26 12:00",
    viewed: false
  };

  it("renders notification element with all details correctly", () => {
    render(<NotificationElement notification={mockNotification} onClick={() => {}} />);

    // Check if all details are rendered correctly
    expect(screen.getByText("Type A")).toBeInTheDocument();
    expect(screen.getByText("Condo A")).toBeInTheDocument();
    expect(screen.getByText("2024-03-26 12:00")).toBeInTheDocument();
  });

  it("calls onClick function when the notification element is clicked", () => {
    const onClickMock = jest.fn();
    render(<NotificationElement notification={mockNotification} onClick={onClickMock} />);

    // Click on the notification element
    fireEvent.click(screen.getByText("Type A"));

    // Verify that onClick function is called
    expect(onClickMock).toHaveBeenCalled();
  });
});
