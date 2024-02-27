import React from "react";
import { render, screen } from "@testing-library/react";
import Notification from "../components/Notification";

describe("Notification Component", () => {
  it("renders notification icon", () => {
    render(<Notification />);
    const notificationIcon = screen.getByTestId("notification-icon");
    expect(notificationIcon).toBeInTheDocument();
  });
});