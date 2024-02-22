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
import PropertyForm from '../pages/PropertyForm.jsx';

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
describe('PropertyForm', () => {
    it("should allow user to fill out the form ", async () => {
        const { getByLabelText, getByText } = render(
        
            <PropertyForm />
          
        );
    
 
        // Fill out the form
        
    
        fireEvent.change(getByLabelText("Property Name:"), {
          target: { value: "My Property" },
        });
        fireEvent.change(getByLabelText("Unit Count:"), { target: { value: "44" } });
        fireEvent.change(getByLabelText("Parking Count:"), {
          target: { value: "555" },
        });
        fireEvent.change(getByLabelText("Locker Count:"), {
          target: { value: "52" },
        });
        
    
        const submitPropertybutton = getByLabelText("Submit Property", { selector: "button" });
    
        // Submit the form
        fireEvent.click(submitPropertybutton);
    
        // Assert form data
        // Access the form data from the component's state
        const property= PropertyForm.setProperty();

        expect(property.propertyName).toBe("My Property");
        expect(property.unitCount).toBe("44");
        expect(property.parkingCount).toBe("555");
        expect(property.lockerCount).toBe("52");
        
    });
    it("should allow the user to upload a property picture", async () => {
        const { getByLabelText, getByText } = render(
          
            <PropertyForm />
          
        );
    
        const file = new File(["dummy content"], "profile.jpg", {
          type: "image/jpeg",
        });
    
        const fileInput = getByLabelText("Propety Picture:");
        fireEvent.change(fileInput, { target: { files: [file] } });
    
        await waitFor(() => {
          const previewImage = document.querySelector("img[alt='Property Preview']");
          expect(previewImage).toBeInTheDocument();
          expect(previewImage.src).toContain("data:image/jpeg;base64,");
        });
      });

      it("should allow the user to add a condo", async () => {
        const { getByText } = render(<PropertyForm />);
    
        fireEvent.click(getByText("Add Condo"));
    
        // Assert that a new condo form is added
        expect(document.querySelectorAll(".condo-form")).toHaveLength(3); // Assuming you start with two condos
      });
    
      it("should allow the user to delete a condo", async () => {
        const { getByText, getByLabelText, queryByText } = render(<PropertyForm />);
    
        // Add a condo first
        fireEvent.click(getByText("Add Condo"));
    
        // Delete the added condo
        fireEvent.click(getByText("Delete"));
    
        // Assert that the condo form is removed
        expect(queryByText("Condo 1")).toBeNull();
      });
    
      // Add more tests for other functionalities as needed
    });
      it("displays errors for empty form submission", async () => {
      
        const submitPropertybutton = getByLabelText("Submit Property", { selector: "button" });
        fireEvent.click(submitPropertybutton);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Missing Property Information"
                );
            });
          });
     it('should handle condo input change and update state', () => {
        const property = { condos: [{}, {}] };
        const setProperty = jest.fn();
        const index = 0;
 // Rendering the component
 const { getByLabelText } = render(
    <PropertyForm
      property={property}
      setProperty={setProperty}
      handleCondoInputChange={handleCondoInputChange}
    />
    );
    fireEvent.change(getByLabelText('Unit Number:'), { target: { name: 'unitNumber', value: '123' } });
    fireEvent.change(getByLabelText('Square Feet'), { target: { name: 'squareFeet', value: '1000' } });
    fireEvent.change(getByLabelText('Unit Price:'), { target: { name: 'currency', value: 'USD' } });
    fireEvent.change(getByLabelText('Unit Price:').nextElementSibling, { target: { name: 'unitPrice', value: '200000' } });
    fireEvent.change(getByLabelText('Unit Size:'), { target: { name: 'unitSize', value: '2.5' } });
    fireEvent.change(getByLabelText('Parking Spot Number'), { target: { name: 'parkingNumber', value: 'P123' } });
    fireEvent.change(getByLabelText('Locker Number'), { target: { name: 'lockerNumber', value: 'L456' } });


    
    expect(getByLabelText('Unit Number:').value).toBe('123');
    expect(getByLabelText('Square Feet').value).toBe('1000');
    expect(getByLabelText('Unit Price:').value).toBe('USD');
    expect(getByLabelText('Unit Price:').nextElementSibling.value).toBe('200000');
    expect(getByLabelText('Unit Size:').value).toBe('2.5');
    expect(getByLabelText('Parking Spot Number').value).toBe('P123');
    expect(getByLabelText('Locker Number').value).toBe('L456');

    const fileInput = getByLabelText('Condo Picture:');
    const file = new File(['(file contents)'], 'condo_image.jpg', { type: 'image/jpg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(setProperty).toHaveBeenCalledTimes(7); 
    expect(setProperty).toHaveBeenCalledWith({
      condos: [
        {
          unitNumber: '123',
          squareFeet: '1000',
          currency: 'USD',
          unitPrice: '200000',
          unitSize: '2.5',
          parkingNumber: 'P123',
          lockerNumber: 'L456',
        },
        {},
      ],
    });

    // Expecting file change to be handled
    expect(handleCondoFileChange).toHaveBeenCalledTimes(1);
    expect(handleCondoFileChange).toHaveBeenCalledWith(expect.any(FileList), index);

    // Simulating condo submission
    fireEvent.click(getByText('Save Condo'));

    // Expecting handleCondoSubmit to be called
    expect(handleCondoSubmit).toHaveBeenCalledTimes(1);
    expect(handleCondoSubmit).toHaveBeenCalledWith(index);
  });

