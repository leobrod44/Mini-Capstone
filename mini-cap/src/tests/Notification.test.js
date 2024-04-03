import React from "react";
import { render, screen } from "@testing-library/react";
import Notification from "../components/Notification";
import { getNotifications } from "../backend/RequestHandler";

jest.mock("../backend/RequestHandler", () => ({
  getNotifications: jest.fn()
}));

describe("Notification Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders notification icon", () => {
    render(<Notification />);
    const notificationIcon = screen.getByTestId("notification-icon");
    expect(notificationIcon).toBeInTheDocument();
  });

  it("renders notification popup with correct count", async () => {
    const mockNotifications = [
      { viewed: false },
      { viewed: false },
      { viewed: true }
    ];
    getNotifications.mockResolvedValue(mockNotifications);

    render(<Notification />);
    const notificationPop = await screen.findByTestId("popup");
    expect(notificationPop).toBeInTheDocument();
    expect(notificationPop).toHaveTextContent("2");
  });

  it("does not render notification popup when unviewedCount is 0", async () => {
    const mockNotifications = [
      { viewed: true },
      { viewed: true },
      { viewed: true }
    ];
    getNotifications.mockResolvedValue(mockNotifications);

    render(<Notification />);
    const notificationPop = screen.queryByTestId("popup");
    expect(notificationPop).not.toBeInTheDocument();
  });
});
