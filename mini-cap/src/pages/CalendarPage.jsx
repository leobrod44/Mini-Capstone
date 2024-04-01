import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackArrowBtn from "../components/BackArrowBtn";
import Calendar from 'react-calendar';
import "../index.css";
import 'react-calendar/dist/Calendar.css'; // Import default styles
import "../styling/Calendar.css";

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservationStatus, setReservationStatus] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    useEffect(() => {
        // Fetch available time slots for the selected date
        fetchAvailableTimeSlots(selectedDate);
    }, [selectedDate]);

    // Function to handle date selection
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Function to fetch available time slots for the selected date
    const fetchAvailableTimeSlots = async (date) => {
        // Check if the selected date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight
        if (date < today) {
            // If the date is in the past, set reservationStatus to 'unavailable'
            setReservationStatus("unavailable");
            return; // Exit the function early
        }

        // Mock function to fetch available time slots (replace with your own implementation)
        try {
            const timeSlots = await fetchTimeSlots(date);
            setAvailableTimeSlots(timeSlots);
            setReservationStatus("available");
        } catch (error) {
            console.error("Error fetching available time slots:", error);
            setReservationStatus("error");
        }
    };


    // Mock function to fetch available time slots for the selected date
    const fetchTimeSlots = async (date) => {
        // Perform logic to fetch available time slots for the given date
        // Here, we'll simulate fetching available time slots for demonstration purposes
        // You should replace this with your own logic
        const availableTimeSlots = [
            "09:00 AM - 10:00 AM",
            "10:30 AM - 11:30 AM",
            "01:00 PM - 02:00 PM",
            "03:00 PM - 04:00 PM",
        ];
        return availableTimeSlots;
    };

    // Function to handle time slot selection
    const handleTimeSlotChange = (event) => {
        setSelectedTimeSlot(event.target.value);
    };

    // Render reservation status message based on the reservationStatus state
    const renderReservationStatusMessage = () => {
        switch (reservationStatus) {
            case "reserved":
                return <p>This date is already reserved.</p>;
            case "available":
                return (
                    <div>
                        <p>This date is available.</p>
                        <p>Please select a time slot:</p>
                        <select value={selectedTimeSlot} onChange={handleTimeSlotChange}>
                            <option value="">Select a time slot</option>
                            {availableTimeSlots.map((timeSlot, index) => (
                                <option key={index} value={timeSlot}>{timeSlot}</option>
                            ))}
                        </select>
                    </div>
                );
            case "unavailable":
                return <p>Data is unavailable for past dates.</p>;
            case "error":
                return <p>There was an error fetching available time slots.</p>;
            default:
                return null;
        }
    };


    // Function to determine the class name for each calendar tile
    const tileClassName = ({ date }) => {
        // Check if the date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight
        if (date < today || availableTimeSlots.length === 0) {
            // If the date is in the past or no available time slots, return 'unavailable' class
            return 'react-calendar__tile--unavailable';
        }
        // Return 'available' class for future dates with available time slots
        return 'available';
    };

    return (
        <div>
            <Header />
            <div className="calendar-page-container">
                <BackArrowBtn /> {/* Include BackArrowBtn here */}
                <div className="content-calendar-container">
                    <h1>Reservations</h1>
                    {/* Pass the handleDateChange function to the onChange prop */}
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate} // Set the selected date
                        tileClassName={tileClassName} // Add tileClassName function
                    />
                    {renderReservationStatusMessage()}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CalendarPage;
