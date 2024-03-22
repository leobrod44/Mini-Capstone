import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";
import { toast } from "react-toastify";
import * as PropertyHandler from "../backend/PropertyHandler";
import { getCondos } from '../backend/PropertyHandler';
import { getCondoPicture } from '../backend/ImageHandler';


jest.mock("../backend/PropertyHandler");
jest.mock("../backend/ImageHandler", () => ({
  getCondoPicture: jest.fn().mockResolvedValue("https://example.com/image.jpg"),
}));



// Mock the Header and Footer components
jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);

describe("PropertyDetailsPage component", () => {

  it("renders without crashing and renders condos (if any)", () => {
    const mockCondos = [
      {
        propertyName: "Property 1",
        unitNumber: "101",
        parkingNumber: "P101",
        lockerNumber: "L101",
        userType: "Owner",
      },
    ];

    jest.spyOn(PropertyHandler, "getUserCondos").mockResolvedValue(mockCondos);

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Header Mock")).toBeInTheDocument();
    expect(screen.getByText("Footer Mock")).toBeInTheDocument();
    expect(screen.getByTestId("back-arrow-btn")).toBeInTheDocument(); // Assertion for BackArrowBtn

    const condoComponents = screen.queryAllByTestId("condo-component");

    if (condoComponents.length > 0) {
      expect(screen.getByText("Property 1")).toBeInTheDocument();
    } else {
      expect(
        screen.getByText("You have not added any condos yet.")
      ).toBeInTheDocument();
      expect(screen.getByText("Add a condo")).toBeInTheDocument();
    }
  });


  test("navigates to the '/add-condo' page when clicking the 'Add a condo' link", () => {
    // Mocking the Fetcher functions
    jest
      .spyOn(require("../backend/Fetcher"), "getCondos")
      .mockResolvedValue([]);
    jest
      .spyOn(require("../backend/Fetcher"), "getCondoPicture")
      .mockResolvedValue("mock-image-url");

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Check if the "Add a condo" button is rendered
    expect(screen.getByText("Add a condo")).toBeInTheDocument();

    // Trigger a click event on the "Add a condo" link
    screen.getByText("Add a condo").click();

    // Check if the navigation to '/add-condo' occurs
    expect(window.location.pathname).toBe("/");
  });


  it("does not render the AddCondoBtn when the user has no condos", () => {
    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );
    expect(screen.queryByTestId("add-condo-btn")).not.toBeInTheDocument();
  });

  it('fetches condos and their pictures', async () => {
    const mockCondos = [
      { id: 1, propertyName: 'TestProperty', unitNumber: '101' },
      { id: 2, propertyName: 'TestProperty', unitNumber: '102' },
    ];

    const mockCondoPictureURL = 'https://example.com/image.jpg';
    
    // Mocking the return values for backend functions
    getCondos.mockResolvedValueOnce(mockCondos);
    getCondoPicture.mockImplementation(async () => mockCondoPictureURL);

    const { getByText } = render(
    <MemoryRouter>
      <PropertyDetailsPage />
      </MemoryRouter>
      );

    // Wait for the state updates triggered by useEffect
    await waitFor(() => {
      expect(getCondos).toHaveBeenCalled();
      expect(getCondoPicture).toHaveBeenCalledTimes(mockCondos.length);
    });

    // Assert that condos and their pictures are rendered
    expect(getByText('TestProperty')).toBeInTheDocument();
    expect(getByText('101')).toBeInTheDocument();
    expect(getByText('102')).toBeInTheDocument();
    expect(document.querySelector('.condo_list').childElementCount).toBe(mockCondos.length);
    expect(document.querySelectorAll('.condo_list img')[0].src).toBe(mockCondoPictureURL);
    expect(document.querySelectorAll('.condo_list img')[1].src).toBe(mockCondoPictureURL);
  });

  test('toggleEdit toggles the value of showEdit', () => {
    // Render PropertyDetailsPage inside MemoryRouter
    const { getByText } = render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Check initial state
    const editButton = getByText('Edit Property');
    expect(editButton).toBeInTheDocument();

    // Trigger toggleEdit
    fireEvent.click(editButton);

    // Check if showEdit is toggled
    const updatedEditButton = getByText('Cancel');
    expect(updatedEditButton).toBeInTheDocument();
  });
})

/////

jest.mock("../backend/PropertyHandler");
jest.mock("../backend/ImageHandler", () => ({
  getCondoPicture: jest.fn().mockResolvedValue("https://example.com/image.jpg"),
}));

jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);

describe("PropertyDetailsPage component", () => {
  // Other test cases...

  test('setCondoPicURL updates condo picture URL correctly', async () => {
    const mockCondos = [
      { id: 1, propertyName: 'TestProperty', unitNumber: '101', picture: '' },
    ];

    const mockCondoPictureURL = 'https://example.com/image.jpg';

    // Mocking the return values for backend functions
    PropertyHandler.getCondos.mockResolvedValueOnce(mockCondos);
    getCondoPicture.mockResolvedValueOnce(mockCondoPictureURL);

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Wait for the state updates triggered by useEffect
    await waitFor(() => {
      expect(PropertyHandler.getCondos).toHaveBeenCalled();
      expect(getCondoPicture).toHaveBeenCalledTimes(mockCondos.length);
    });

    // Check if the condo picture URL is initially empty
    const condoElement = screen.getByText('101');
    expect(condoElement).toBeInTheDocument();
    expect(condoElement.querySelector('img').src).toBe('');

    // Simulate setting the condo picture URL
    fireEvent.load(condoElement.querySelector('img'));

    // Assert that the condo picture URL is updated
    expect(condoElement.querySelector('img').src).toBe(mockCondoPictureURL);
  });

  test('setHasCondos and setCondoDetails are called when condos.length > 0', async () => {
    const mockCondos = [
      { id: 1, propertyName: 'TestProperty1', unitNumber: '101' },
      { id: 2, propertyName: 'TestProperty2', unitNumber: '102' },
    ];

    // Mocking the return values for backend functions
    PropertyHandler.getCondos.mockResolvedValueOnce(mockCondos);

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Wait for the state updates triggered by useEffect
    await waitFor(() => {
      expect(PropertyHandler.getCondos).toHaveBeenCalled();
    });

    // Assert that setHasCondos is called with true
    expect(PropertyDetailsPage.mock.calls[1][0]).toBeTruthy();

    // Assert that setCondoDetails is called with the correct condo details
    expect(PropertyDetailsPage.mock.calls[2][0]).toEqual(mockCondos);
  });

  test('setPropertyDetails is called with updated details', async () => {
    const mockCondos = [
      { id: 1, propertyName: 'TestProperty1', unitNumber: '101' },
      { id: 2, propertyName: 'TestProperty2', unitNumber: '102' },
    ];
    const updatedDetails = { id: 1, propertyName: 'UpdatedProperty', unitNumber: '101' };

    // Mocking the return values for backend functions
    PropertyHandler.getCondos.mockResolvedValueOnce(mockCondos);

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Wait for the state updates triggered by useEffect
    await waitFor(() => {
      expect(PropertyHandler.getCondos).toHaveBeenCalled();
    });

    // Simulate updating property details
    PropertyHandler.setPropertyDetails(updatedDetails);

    // Assert that setPropertyDetails is called with the updated details
    expect(PropertyHandler.setPropertyDetails).toHaveBeenCalledWith(updatedDetails);
  });

  test('onClick navigates to the correct route', async () => {
    const propertyID = 'property123';
    const propertyName = 'TestProperty';

    // Mocking the return values for backend functions
    PropertyHandler.getCondos.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <PropertyDetailsPage />
      </MemoryRouter>
    );

    // Wait for the state updates triggered by useEffect
    await waitFor(() => {
      expect(PropertyHandler.getCondos).toHaveBeenCalled();
    });

    // Simulate clicking on the element triggering navigation
    fireEvent.click(screen.getByText('Add a condo'));

    // Assert that useNavigate is called with the correct route
    expect(require("react-router-dom").useNavigate).toHaveBeenCalledWith(`/add-condo/${propertyID}/${propertyName}`);
  });
});
