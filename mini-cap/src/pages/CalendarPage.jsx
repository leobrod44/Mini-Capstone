import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackArrowBtn from "../components/BackArrowBtn";
import Calendar from 'react-calendar';
import "../index.css";
import 'react-calendar/dist/Calendar.css'; // Import default styles
import "../styling/Calendar.css";
import { getMonthlyReservations, makeReservation } from "../backend/FacilityHandler";

const CalendarPage = ({ totalAvailableSlots }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reservationStatus, setReservationStatus] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [reservedTimeSlots, setReservedTimeSlots] = useState([]);

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

    const fetchTimeSlots = async (date) => {
        // Perform logic to fetch available time slots for the given date
        // Here, we'll simulate fetching available time slots for demonstration purposes
        // You should replace this with your own logic
        const slotDate = new Date(date);
        slotDate.setHours(0, 0, 0, 0);

        const availableTimeSlots = [
            "09:00 AM - 10:00 AM",
            "10:30 AM - 11:30 AM",
            "01:00 PM - 02:00 PM",
            "03:00 PM - 04:00 PM",
        ];

        // Filter out reserved time slots for the selected date
        const reservedTimeSlotsForDate = reservedTimeSlots.filter(slot => {
            const slotDate = new Date(slot.date);
            return slotDate.toDateString() === date.toDateString();
        });

        // Filter available time slots based on reserved time slots for the selected date
        const filteredTimeSlots = availableTimeSlots.filter(timeSlot => !reservedTimeSlotsForDate.find(slot => slot.startTime === timeSlot.split(' - ')[0]));

        return filteredTimeSlots;
    };

    // Function to handle time slot selection
    const handleTimeSlotChange = (event) => {
        setSelectedTimeSlot(event.target.value);
    };

    // Function to handle reservation
    const handleReservation = async () => {
        if (!selectedTimeSlot) {
            console.error("No time slot selected for reservation.");
            return;
        }
        
        const [startTime, endTime] = selectedTimeSlot.split(' - ');
        const reservationDateTime = new Date(selectedDate);
        reservationDateTime.setHours(0, 0, 0, 0);

        // Check if the selected time slot is already reserved for the selected date
        const isTimeSlotReserved = reservedTimeSlots.some(slot => {
            return slot.date.getTime() === reservationDateTime.getTime() &&
                slot.startTime === startTime && slot.endTime === endTime;
        });

        if (isTimeSlotReserved) {
            console.error("This time slot is already reserved.");
            return;
        }
        //Backend functions, put them where appropriate
        try{
            //missing these values
            var userID = "leobrod44@gmail.com"
            var facilityID = "QhxkTBqDpzJdalTvD92S"
            var propertyID = "QPIOS5Tmww195XJyKlRM"

            await makeReservation(
                {
                    month: reservationDateTime.getMonth(),
                    date:reservationDateTime.getDate(), 
                    startTime, 
                    endTime, 
                    userID, 
                    facilityID,
                    propertyID
                });
        }
        catch(e){
            console.error(e);
        }
        
        // this returns a json with each date of the month as a key and any existing reservations as start time values
        const reservations =  await getMonthlyReservations(propertyID,facilityID,reservationDateTime.getMonth());
       
        //ex:
        // 13:['10:30 AM']
        // 16:['10:30 AM']
        // 18:['09:00 AM']
        // 19:['10:30 AM', '09:00 AM']
        //you can use this to check if the date is reserved
        
        const newReservedTimeSlot = { date: reservationDateTime, startTime, endTime };
        setReservedTimeSlots([...reservedTimeSlots, newReservedTimeSlot]);

        // Update reservation status to 'reserved'
        setReservationStatus("reserved");

        console.log("Reservation confirmed for time slot:", selectedTimeSlot);
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
                        {selectedTimeSlot && reservedTimeSlots.includes(selectedTimeSlot) && (
                            <p>This time slot is already reserved.</p>
                        )}
                        {selectedTimeSlot && !reservedTimeSlots.includes(selectedTimeSlot) && (
                            <button className="button-reserved" onClick={handleReservation}>Confirm Reservation</button>
                        )}
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

    const tileClassName = ({ date }) => {
        // Count the number of time slots reserved for the date
        const reservedSlotsForDate = reservedTimeSlots.filter(slot => {
            const slotDate = new Date(slot.date);
            return slotDate.toDateString() === date.toDateString();
        });
        const numberOfReservedSlots = reservedSlotsForDate.length;

        // Check if the selected date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight
        const isPastDate = date < today;

        if (isPastDate) {
            // If the date is in the past, return the appropriate class
            return 'react-calendar__tile--unavailable';
        }

        if (numberOfReservedSlots > 0) {
            // If there are reserved slots for the date, return the appropriate class
            if (numberOfReservedSlots === 4) {
                // If all time slots are reserved for the date, highlight in red
                return 'react-calendar__tile--all';
            }
            // If some time slots are reserved but not all, return a different class
            return 'react-calendar__tile--selected';
        }

        // Return 'available' class for dates with no reserved slots
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


