import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import PropertyForm from "../pages/PropertyForm";

afterEach(cleanup);

jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    ...originalModule,
    toast: {
      ...originalModule.toast,
      error: jest.fn(),
    },
  };
});

describe("PropertyForm", () => {
  it("should allow user to fill out the Property Fields", async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <Router>
        <PropertyForm />
      </Router>
    );
    // Fill out the form //// property part

    const file2 = new File(["dummy content"], "image.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(getByLabelText("Property Picture:"), {
      target: { files: [file2] },
    });

    fireEvent.change(getByLabelText("Property Name:"), {
      target: { value: "Example Property" },
    });

    fireEvent.change(getByLabelText("Unit Count:"), {
      target: { value: "255" },
    });

    fireEvent.change(getByLabelText("Parking Count:"), {
      target: { value: "99" },
    });
    fireEvent.change(getByLabelText("Parking Cost:"), {
      target: { value: "200" },
    });

    fireEvent.change(getByLabelText("Locker Count:"), {
      target: { value: "88" },
    });
    fireEvent.change(getByLabelText("Locker Cost:"), {
      target: { value: "100" },
    });

    const submitPropertyButton = getByText("Submit Property", {
      selector: "button",
    });

    // Submit the form
    fireEvent.click(submitPropertyButton);
  });

  it("should show an error for negative  Counts and 0 counts", async () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <PropertyForm />
      </Router>
    );

    // Fill out the form
    const file2 = new File(["dummy content"], "image.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(getByLabelText("Property Picture:"), {
      target: { files: [file2] },
    });
    fireEvent.change(getByLabelText("Property Name:"), {
      target: { value: "Example Property" },
    });
    fireEvent.change(getByLabelText("Unit Count:"), {
      target: { value: "-5" },
    });
    fireEvent.change(getByLabelText("Parking Count:"), {
      target: { value: "4" },
    });
    fireEvent.change(getByLabelText("Parking Cost:"), {
      target: { value: "3" },
    });
    fireEvent.change(getByLabelText("Locker Count:"), {
      target: { value: "2" },
    });
    fireEvent.change(getByLabelText("Locker Cost:"), {
      target: { value: "1" },
    });
    const submitPropertyButton = getByText("Submit Property", {
      selector: "button",
    });

  
    // Submit the form
    fireEvent.click(submitPropertyButton);
  
    expect(toast.error).toHaveBeenCalledWith("Count or price must be greater than  0");
  });
  
  

  it("should display toast error for unsupported file type", () => {
    const { getByLabelText } = render(
      <Router>
        <PropertyForm />
      </Router>
    );

    const file = new File(["dummy content"], "image.txt", {
      type: "text/plain",
    });
    fireEvent.change(getByLabelText("Property Picture:"), {
      target: { files: [file] },
    });

    // Assert that toast.error is called with the expected message
    expect(toast.error).toHaveBeenCalledWith("File type not supported");
  });

  it("should display toast error for file size exceeding 2 MB", () => {
    const { getByLabelText } = render(
      <Router>
        <PropertyForm />
      </Router>
    );

    // Creating a large file (more than 2 MB)
    const largeFile = new File(
      ["dummy content".repeat(500000)],
      "large_image.jpg",
      { type: "image/jpeg" }
    );

    fireEvent.change(getByLabelText("Property Picture:"), {
      target: { files: [largeFile] },
    });

    // Assert that toast.error is called with the expected message
    expect(toast.error).toHaveBeenCalledWith("File must be less than 2 MB");
  });




it("should toast error if a field is missing in the property form", () => {
  const { getByLabelText, getByText } = render(
    <Router>
      <PropertyForm />
    </Router>
  );
  const file2 = new File(["dummy content"], "image.jpg", {
    type: "image/jpeg",
  });

  fireEvent.change(getByLabelText("Property Picture:"), {
    target: { files: [file2] },
  });

  fireEvent.change(getByLabelText("Property Name:"), {
    target: { value: "" },
  });

  fireEvent.change(getByLabelText("Unit Count:"), {
    target: { value: "3" },
  });

  fireEvent.change(getByLabelText("Parking Count:"), {
    target: { value: "3" },
  });
  fireEvent.change(getByLabelText("Parking Cost:"), {
    target: { value: "3" },
  });

  fireEvent.change(getByLabelText("Locker Count:"), {
    target: { value: "3" },
  });
  fireEvent.change(getByLabelText("Locker Cost:"), {
    target: { value: "100" },
  });
  // Submit the form
  const submitPropertyButton = getByText("Submit Property", {
    selector: "button",
  });

  // Submit the form
  fireEvent.click(submitPropertyButton);

  expect(toast.error).toHaveBeenCalledWith("Missing Property Information");
});

it("should toast error if all fields are missing in the property form", async () => {
  const { getByLabelText, getByText } = render(
    <Router>
      <PropertyForm />
    </Router>
  );
 
  const submitPropertyButton = getByText("Submit Property", {
    selector: "button",
  });

  // Submit the form
  fireEvent.click(submitPropertyButton);

  
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      "Missing Property Information"
    );
  });
});

});