import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  getAllByRole,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import AddCondoFormComponent from "../components/AddCondoFormComponent";

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

describe("AddCondoFormComponent", () => {
 

  
  it("should allow user to fill out the form and create a Condo", async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <Router>
        <AddCondoFormComponent />
      </Router>
    );
  

    // Fill out the form
    const file = new File(["dummy content"], "image.jpg", { type: "image/jpeg" });
    
    fireEvent.change(getByLabelText("Condo Picture:"), { target: { files: [file] } });

    fireEvent.change(getByLabelText("Unit Number:"), {
      target: { value: "101" },
    });
    fireEvent.change(getByLabelText("Square Feet:"), { target: { value: "23sqft" } });
    fireEvent.change(getByLabelText ("Unit Size:"), { target: { value: "1.5" } });
   
    fireEvent.change(getByLabelText("Parking:"), {
      target: { value: "P99" },
    });
    fireEvent.change(getByLabelText("Locker:"), {
      target: { value: "L12" },
    });
    
    
    fireEvent.change(getByLabelText("Unit Price:"), {
      target: { value: "1500" },
    });

    const submitCondoButton = getByText("Submit Condo", { selector: "button" });

    // Submit the form
    fireEvent.click(submitCondoButton);

    
   
    
});

it("should display toast error for unsupported file type", () => {
  const { getByLabelText } = render(
    <Router>
      <AddCondoFormComponent />
    </Router>
  );

  const file = new File(["dummy content"], "image.txt", { type: "text/plain" });

  fireEvent.change(getByLabelText("Condo Picture:"), { target: { files: [file] } });

  // Assert that toast.error is called with the expected message
  expect(toast.error).toHaveBeenCalledWith("File type not supported");
});

it("should display toast error for file size exceeding 2 MB", () => {
  const { getByLabelText } = render(
    <Router>
      <AddCondoFormComponent />
    </Router>
  );

  // Creating a large file (more than 2 MB)
  const largeFile = new File(["dummy content".repeat(500000)], "large_image.jpg", { type: "image/jpeg" });

  fireEvent.change(getByLabelText("Condo Picture:"), { target: { files: [largeFile] } });

  // Assert that toast.error is called with the expected message
  expect(toast.error).toHaveBeenCalledWith("File must be less than 2 MB");
});
it("should display toast error for invalid Unit Price", () => {
  const { getByLabelText } = render(
    <Router>
      <AddCondoFormComponent />
    </Router>
  );

  fireEvent.change(getByLabelText("Unit Price:"), {
    target: { value: "abc" }, // Provide an invalid value
  });

  // Assert that toast.error is called with the expected message
  expect(toast.error).toHaveBeenCalledWith("Please enter a valid number for Unit Price");
});
it("should display toast error for empty fields on form submission", () => {
  const { getByLabelText, getByText } = render(
    <Router>
      <AddCondoFormComponent />
    </Router>
  );
  const file = new File(["dummy content"], "image.txt", { type: "text/plain" });
  fireEvent.change(getByLabelText("Condo Picture:"), { target: { files: [file] } });

  fireEvent.change(getByLabelText("Unit Number:"), {
    target: { value: "101" },
  });
  fireEvent.change(getByLabelText("Square Feet:"), { target: { value: "23sqft" } });
  fireEvent.change(getByLabelText ("Unit Size:"), { target: { value: "1.5" } });
 
  fireEvent.change(getByLabelText("Parking:"), {
    target: { value: "P99" },
  });
  fireEvent.change(getByLabelText("Locker:"), {
    target: { value: "" },
  });
  
  fireEvent.change(getByLabelText("Unit Price:"), {
    target: { value: "1500" },
  });

  const submitCondoButton = getByText("Submit Condo", { selector: "button" });

  // Submit the form
  fireEvent.click(submitCondoButton);
  expect(toast.error).toHaveBeenCalledWith("All fields must be filled");
});

test('it should set the previewCondoImage state correctly', async () => {
  
  // Render your component
  <Router>
  <AddCondoFormComponent />
</Router>
  // Mock FileReader and its methods
  const readAsDataURLMock = jest.fn();
  const onloadendMock = jest.fn();

  global.FileReader = jest.fn(() => ({
    readAsDataURL: readAsDataURLMock,
    onloadend: onloadendMock,
  }));


});
 

});


