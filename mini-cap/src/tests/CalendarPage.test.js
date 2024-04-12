import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CalendarPage from '../pages/CalendarPage';
import {
    getMonthlyReservations,
    makeReservation,
} from "../backend/FacilityHandler";
import { getPropertyData } from "../backend/PropertyHandler";

// Mock required components
jest.mock('../components/Header.jsx', () => () => <div data-testid="header-mock">Header Mock</div>);
jest.mock('../components/Footer.jsx', () => () => <div data-testid="footer-mock">Footer Mock</div>);
jest.mock('../components/BackArrowBtn.jsx', () => () => <button data-testid="back-arrow-btn-mock">Back Arrow Btn Mock</button>);
jest.mock("../backend/PropertyHandler.js", () => ({
    getPropertyData: jest.fn()
}));
jest.mock("../backend/FacilityHandler.js", () => ({
    getMonthlyReservations: jest.fn(),
    makeReservation: jest.fn()
}));
// Mock the useLocation hook to return the desired query parameters
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        search: "?propertyID=XTStwb1XT05Goxj5SYv2&facilityID=pGP2VNo8L1fRlsWRTooW&facilityType=Spa&desc=test2"
    })
}));
const fakeMonth = { "11": ["11:00 AM", "08:00 AM"], "12": ["11:00 AM"] }

describe('Calendar Page', () => {

    it('renders without crashing', () => {
        getPropertyData.mockResolvedValueOnce('propertyData1').mockResolvedValueOnce('propertyData2');
        render(<Router><CalendarPage /></Router>);
        expect(screen.getByText("Make A Reservation")).toBeInTheDocument();
    });
    
    it('renders calendar numbers without crashing', () => {
        getPropertyData.mockResolvedValueOnce('propertyData1').mockResolvedValueOnce('propertyData2');
        getMonthlyReservations.mockResolvedValueOnce('propertyData1').mockResolvedValueOnce('propertyData2');
        render(<Router><CalendarPage /></Router>);
        expect(screen.getByText('21')).toBeInTheDocument();
    });
    
    it('renders reservation status without crashing', async () => {
        getPropertyData.mockResolvedValueOnce('propertyData1').mockResolvedValueOnce('propertyData2');
        getMonthlyReservations.mockResolvedValueOnce(fakeMonth).mockResolvedValueOnce(fakeMonth);
        render(<Router><CalendarPage /></Router>);
        // Wait for the text to appear
        await waitFor(() => {
            expect(screen.getByText('This date is available.')).toBeInTheDocument();
        });
    });
    
    it('updates reservation status message when date is selected', async () => {
        getPropertyData.mockResolvedValueOnce('propertyData1').mockResolvedValueOnce('propertyData2');
        getMonthlyReservations.mockResolvedValueOnce(fakeMonth).mockResolvedValueOnce(fakeMonth);
        render(<Router><CalendarPage /></Router>);
        fireEvent.click(screen.getByText('21')); // Adjust the date as needed
        await waitFor(() => {
            expect(screen.getByText('This date is available.')).toBeInTheDocument();
        });  
    });
    
    it('fetches reservations for the selected month when navigating', async () => {
        getPropertyData.mockResolvedValueOnce('propertyData1').mockResolvedValueOnce('propertyData2');
        getMonthlyReservations.mockResolvedValueOnce(fakeMonth).mockResolvedValueOnce(fakeMonth);
        render(<Router><CalendarPage /></Router>);
           // Finding the "Next Month" button
    const nextButtons = screen.getAllByRole('button');
    const nextButton = nextButtons.find(button =>
        button.classList.contains('react-calendar__navigation__next-button')
    );

    // Simulating click on the "Next Month" button
    fireEvent.click(nextButton); // Using nextButton instead of getByRole

    // Getting the next month's index
    const nextMonth = new Date().getMonth() + 1;

    // Verifying if getMonthlyReservations is called with the expected arguments
    await waitFor(() => {
        expect(getMonthlyReservations).toHaveBeenCalledWith('XTStwb1XT05Goxj5SYv2', 'pGP2VNo8L1fRlsWRTooW', nextMonth);
    });
});
    
    it('renders null when reservationStatus is null', () => {
        getPropertyData.mockResolvedValueOnce('propertyData1').mockResolvedValueOnce('propertyData2');
        render(<Router><CalendarPage /></Router>);
        expect(screen.queryByText('This date is already reserved.')).toBeNull();
        expect(screen.queryByText('This date is available.')).toBeNull();
        expect(screen.queryByText('Data is unavailable for past dates.')).toBeNull();
        expect(screen.queryByText('There was an error fetching available time slots.')).toBeNull();
    });

});