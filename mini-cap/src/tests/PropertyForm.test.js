import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { toast } from 'react-toastify';
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
 
    it("renders the property form form with all input fields", () => {
        render(<PropertyForm />);
        expect(screen.getByLabelText('Property Picture:')).toBeInTheDocument();
    expect(screen.getByLabelText('Property Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Unit Count:')).toBeInTheDocument();
    expect(screen.getByLabelText('Parking Count:')).toBeInTheDocument();
    expect(screen.getByLabelText('Locker Count:')).toBeInTheDocument();
  });
      it("updates the fields when they are changed", () => {
        fireEvent.change(screen.getByLabelText(/propertyName/i), {
          target: { value: "My Property" },
        });
        fireEvent.change(screen.getByLabelText(/address/i), {
          target: { value: "1234 address" },
        });
        fireEvent.change(screen.getByLabelText(/unitCount/i), {
            target: { value: "1234" },
          });
          fireEvent.change(screen.getByLabelText(/parkingCount/i), {
            target: { value: "3453" },
          });
          fireEvent.change(screen.getByLabelText(/lockerCount/i), {
            target: { value: "6564" },
          });
          fireEvent.change(screen.getByLabelText(/condos/i), {
            target: { value: "condo 1" },
          });

    
        expect(screen.getByLabelText(/propertyName/i).value).toBe("My Property");
        expect(screen.getByLabelText(/address/i).value).toBe("1234 address");
        expect(screen.getByLabelText(/unitCount/i).value).toBe("1234 ");
        expect(screen.getByLabelText(/parkingCount/i).value).toBe("3453");
        expect(screen.getByLabelText(/lockerCount/i).value).toBe("6564");
        expect(screen.getByLabelText(/condos/i).value).toBe("condo 1");

      });
    });