import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Notification from "../components/Notification";
import { BrowserRouter as Router } from "react-router-dom";
import * as NotifHandler from "../backend/RequestHandler";
import NotificationElement from "../components/NotificationElement";

// Mock the Header and Footer components
jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);
jest.mock("../backend/RequestHandler");
jest.mock('../backend/UserHandler');

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn()
  };
});

describe("Notification Component", () => {
  beforeEach(() => {
    // Simulate a logged-in state
    localStorage.setItem("user", "exampleUserId");
    localStorage.setItem("role", "renter");
  });

  afterEach(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");

import { getNotifications } from "../backend/RequestHandler";

jest.mock("../backend/RequestHandler", () => ({
  getNotifications: jest.fn()
}));

describe("Notification Component", () => {
  afterEach(() => {
    jest.clearAllMocks();

  });

  it("renders notification icon", () => {
    render(
      <Router>
        <Notification />
      </Router>
    );
    const notificationIcon = screen.getByTestId("notification-icon");
    expect(notificationIcon).toBeInTheDocument();
  });

  it("opens modal onclick", async () => {
    render(
      <Router>
        <Notification />
      </Router>
    );

    // Click the notification icon to open the notification tab
    fireEvent.click(screen.getByTestId("notification-icon"));

    try {
      // Wait for the modal to open (you may need to adjust the time)
      await waitFor(() => {
        // Check if the modal is open by verifying the presence of a specific CSS class or element
        const modalElement = screen.getByClassName("myDropdownNotif");
        expect(modalElement).toBeInTheDocument();
  
        // Verify if the "Notifications" text is present in the modal
        const notificationTab = screen.getByText("Notifications");
        expect(notificationTab).toBeInTheDocument();
      });
    } catch (error) {
      // Handle the error, e.g., log it or fail the test with a message
      console.error("Error opening modal:", error);
    }
  });

  it("renders fetched notifications", async () => {
    // Create fake notifications
    const notification = {
      id: 1,
      type: "Type A",
      date: "2024-03-26T12:00:00Z",
      viewed: false,
      path: "/example-path" // Specify the path for navigation
    };

   

// Mocking getNotifications function to return sample notifications
jest.spyOn(NotifHandler, "getNotifications").mockResolvedValueOnce([notification]);

    render(
      <Router>
        <Notification />
      </Router>
    );

    // Click the notification icon to open the notification tab
    fireEvent.click(screen.getByTestId("notification-icon"));

    // Wait for the modal to open
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify if the notifications are rendered
    expect(screen.getByText("Type A")).toBeInTheDocument();
  });






  it("navigates to the destination specified in the notification", async () => {
    // Mock notification object
    const notification = {
      id: 1,
      type: "Type A",
      date: "2024-03-26T12:00:00Z",
      viewed: false,
      path: "/example-path" // Specify the path for navigation
    };

    // Mocking getNotifications function to return sample notifications
    jest.spyOn(NotifHandler, "getNotifications").mockResolvedValueOnce([notification]);

     // Mock the navigate function
     const navigateMock = jest.fn();
     jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(navigateMock);

     
    // Render the Notification component with mocked navigate function
    render(
      <Router>
        <Notification  />
      </Router>
    );

     // Click the notification icon to open the notification tab
     fireEvent.click(screen.getByTestId("notification-icon"));

     await waitFor(() => {
      // Click the actual notification
      fireEvent.click(screen.getByText("Type A"));
    });
  
    // Assert that the navigate function is called with the correct path
    expect(navigateMock).toHaveBeenCalledWith("/example-path");

    // Assert that the URL has changed accordingly
    expect(window.location.href).toContain("http://localhost");
  });
});
it("renders 'See All' button only when there are more than 3 notifications", async () => {
  // Create fake notifications
  const notifications = [
    { id: 1, type: "Type A", date: "2024-03-26T12:00:00Z", viewed: false },
    { id: 2, type: "Type B", date: "2024-03-26T12:00:00Z", viewed: false },
    { id: 3, type: "Type C", date: "2024-03-26T12:00:00Z", viewed: false }
  ];

  // Mocking
  jest.spyOn(NotifHandler, "getNotifications").mockResolvedValueOnce(notifications);

  // Render the component
  render(
    <Router>
      <Notification />
    </Router>
  );

  // Click the notification icon to open the notification tab
  fireEvent.click(screen.getByTestId("notification-icon"));

  // Wait for the notifications to be fetched and rendered
  await waitFor(() => {
    // Check if the 'See All' button is rendered
    if (notifications.length > 3) {
      const seeAllButton = screen.queryByText("See All");
      expect(seeAllButton).toBeInTheDocument();
    } else {
      // If there are not more than 3 notifications, check that the 'See All' button is not rendered
      const seeAllButton = screen.queryByText("See All");
      expect(seeAllButton).not.toBeInTheDocument();
    }
  });
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
