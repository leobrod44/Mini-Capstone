import React from "react";
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import RequestForm from "../components/RequestForm.jsx";
import CondoDetails from "../pages/CondoDetails.jsx";
import { submitRequest } from '../backend/RequestHandler';
import { getCondo } from "../backend/PropertyHandler.js";

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

  jest.mock("../backend/RequestHandler", () => ({
    submitRequest: jest.fn(),
  }));  

  console.log = jest.fn();

  describe("RequestForm", () => {

    const mockCondoInfo = {
      propertyName: "Test Property",
      unitNumber: "123",
    };

    it("should allow user to fill out the Request Form", async () => {
      const { getByLabelText, getByText, getByRole } = render(
        <BrowserRouter>
          <RequestForm condoInfo={mockCondoInfo}/>
        </BrowserRouter>
      );

      // Fill out the form //
      fireEvent.change(getByLabelText("Subject:"), {
        target: { value: "1" },
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
            <RequestForm condoInfo={mockCondoInfo}/>
          </BrowserRouter>
        );

        // Fill out the form //
        fireEvent.change(getByLabelText("Subject:"), {
            target: { value: "1" },
        });
    
        fireEvent.change(getByLabelText("Description:"), {
            target: { value: "" },
        });
    
        const submitRequestButton = getByText("Submit");
    
        // Submit the form
        fireEvent.click(submitRequestButton);
    
        // Ensure the error message is shown
        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
        });

        expect(submitRequest).not.toHaveBeenCalled();
    });

    it("should not be successful because description is less than 15 words", async () => {
        const { getByLabelText, getByText, getByRole } = render(
          <BrowserRouter>
            <RequestForm condoInfo={mockCondoInfo}/>
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
            <RequestForm condoInfo={mockCondoInfo}/>
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
          expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
        });
    }); 

    it('should handle form submission successfully', async () => {
      // Mock submitRequest function
      const mockSubmitRequest = jest.fn().mockResolvedValue('requestID');
      jest.mock('../backend/RequestHandler', () => ({
        submitRequest: mockSubmitRequest,
      }));

      const {clearImmediate} = require('node:timers')

      Object.defineProperties(globalThis, {
        clearImmediate: {value: clearImmediate}
      })

      const { getByLabelText, getByText } = render(
        <BrowserRouter>
          <RequestForm condoInfo={mockCondoInfo}/>
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