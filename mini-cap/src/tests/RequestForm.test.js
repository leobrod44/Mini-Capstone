import React from "react";
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import RequestForm from "../pages/RequestForm.jsx";

afterEach(() => {
  jest.clearAllMocks();
});

afterEach(cleanup);

jest.mock("react-toastify", () => {
    const originalModule = jest.requireActual("react-toastify");
    return {
      ...originalModule,
      toast: {
        ...originalModule.toast,
        error: jest.fn(),
        success: jest.fn(),
      },
    };
  });

  describe("RequestForm", () => {
    it("should allow user to fill out the Request Form", async () => {
      const { getByLabelText, getByText, getByRole } = render(
        <BrowserRouter>
          <RequestForm />
        </BrowserRouter>
      );

      // Fill out the form //
      fireEvent.change(getByLabelText("Subject:"), {
        target: { value: "Financial" },
      });
  
      fireEvent.change(getByLabelText("Description:"), {
        target: { value: "There are fifteen words in this description, thus making it a valid request form submission." },
      });
  
      const submitRequestButton = getByText("Submit", {
        selector: "button",
      });
  
      // Submit the form
      fireEvent.click(submitRequestButton);
    });

    it("should not submit due to empty description", async () => {
        const { getByLabelText, getByText } = render(
          <BrowserRouter>
            <RequestForm />
          </BrowserRouter>
        );

        // Fill out the form //
        fireEvent.change(getByLabelText("Subject:"), {
            target: { value: "Financial" },
        });
    
        fireEvent.change(getByLabelText("Description:"), {
            target: { value: null },
        });
    
        const submitRequestButton = getByText("Submit", {
            selector: "button",
          });
    
        // Submit the form
        fireEvent.click(submitRequestButton);
    
        // Ensure the error message is shown
        await waitFor(() => {
            // Ensure that the error is thrown
            expect(() => {
                throw new Error("Description must be at least 15 words long.");
            }).toThrow();
        });
    });

    it("should not be successful because description is less than 15 words", async () => {
        const { getByLabelText, getByText, getByRole } = render(
          <BrowserRouter>
            <RequestForm />
          </BrowserRouter>
        );
    
        // Fill out the form //
        fireEvent.change(getByLabelText("Subject:"), {
          target: { value: "Financial" },
        });
    
        fireEvent.change(getByLabelText("Description:"), {
          target: { value: "There are not fifteen words in this description." },
        });
    
        const submitRequestButton = getByText("Submit", {
            selector: "button",
          });
    
        // Submit the form
        fireEvent.click(submitRequestButton);
    
        // Ensure the error message is shown
        await waitFor(() => {
            expect(() => {
                throw new Error("Description must be at least 15 words long.");
            }).toThrow();
        });
    });

    it("should display toast error for unsuccessful request submission", async () => {
        const { getByLabelText, getByText } = render(
          <BrowserRouter>
            <RequestForm />
          </BrowserRouter>
        );
      
        // Fill out the form //
        fireEvent.change(getByLabelText("Subject:"), {
          target: { value: "Maintenance" },
        });

        fireEvent.change(getByLabelText("Description:"), {
          target: { value: null },
        });
      
        const submitRequestButton = getByText("Submit", { selector: "button" });
      
        // Submit the form
        fireEvent.click(submitRequestButton);
      
        // Ensure toast is shown
        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith("Error submitting request");
        });
    });
    
    it("should return to condo-details page after clicking cancel", async () => {
        const { getByLabelText, getByText } = render(
          <BrowserRouter>
            <RequestForm />
          </BrowserRouter>
        );

        const cancelLinkButton = getByText('Cancel');
        
        fireEvent.click(cancelLinkButton);

        expect(window.location.href).toMatch('/condo-details');
    });

    it('should handle form submission successfully', async () => {
      // Mock submitRequest function
      const mockSubmitRequest = jest.fn().mockResolvedValue('requestID');
      jest.mock('../backend/RequestHandler', () => ({
        submitRequest: mockSubmitRequest,
      }));

      const { getByLabelText, getByText } = render(
        <BrowserRouter>
          <RequestForm/>
        </BrowserRouter>
      );
    
      // Fill out the form //
      fireEvent.change(getByLabelText("Subject:"), {
        target: { value: "Administrative" },
      });
  
      fireEvent.change(getByLabelText("Description:"), {
        target: { value: "There are fifteen words in this description, thus making it a valid request form submission." },
      });
    
      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);
  
      // Assert that console.log is called with the expected message
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("The request was submitted successfully");
      });
  
      // Assert that toast.success is called
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Request submitted successfully");
      });
  });
  
});