import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackArrowBtn from "../components/BackArrowBtn";
import Calendar from "react-calendar";
import "../index.css";
import "../styling/Calendar.css";
import {
  getMonthlyReservations,
  makeReservation,
} from "../backend/FacilityHandler";
import { useLocation, useNavigate } from "react-router-dom";
import store from "storejs";
import { getPropertyData } from "../backend/PropertyHandler";

const CalendarPage = () => {
  //get the user
  const userID = store("user");
  //get the property and facilityid using the url
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const propertyID = queryParams.get("propertyID");
  const facilityID = queryParams.get("facilityID");
  const facilityType = queryParams.get("facilityType");
  const description = queryParams.get("desc");
  const maxAvailableSlots = 9;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservationStatus, setReservationStatus] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [reservedTimeSlots, setReservedTimeSlots] = useState([]);
  const [propertyName, setPropertyName] = useState(""); // State variable to store property name

  // for submit button
  const navigate = useNavigate();

  // Calculate min and max date
  const currentYear = new Date().getFullYear();
  const maxDate = new Date(currentYear, 11, 31);
  const minDate = new Date(currentYear, 0, 1);

  useEffect(() => {
    //get property name
    getPropertyData(propertyID).then((propertyData) => {
      if (propertyData) {
        setPropertyName(propertyData.propertyName);
      }
    });

    // Fetch available time slots for the selected date
    fetchAvailableTimeSlots(selectedDate);
  }, [selectedDate]);
  useEffect(() => {
    // Fetch reservations for the selected month when component mounts or page is refreshed
    fetchReservationsForMonth(selectedDate);
  }, []);

  /**
   * Function to handle date selection
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  /**
   * Function to handle month change
   */
  const handleViewChange = ({ activeStartDate }) => {
    // Convert activeStartDate to a Date object if it's not already
    const newDate =
      activeStartDate instanceof Date
        ? activeStartDate
        : new Date(activeStartDate);
    fetchReservationsForMonth(newDate);
  };

  /**
   * Function to fetch available time slots for the selected date
   */
  const fetchAvailableTimeSlots = async (date) => {
    // Check if the selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    if (date < today) {
      // If the date is in the past, set reservationStatus to 'unavailable'
      setReservationStatus("unavailable");
      return; // Exit the function early
    }

    try {
      const timeSlots = await fetchTimeSlots(date);
      if (timeSlots.length === 0) {
        // If no available slots, set reservationStatus to 'unavailable'
        setReservationStatus("reserved");
        return;
      }
      setAvailableTimeSlots(timeSlots);
      setReservationStatus("available");
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      setReservationStatus("error");
    }
  };

  /**
   * Function to fetch available time slots for the given date
   */
  const fetchTimeSlots = async (date) => {
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    // this returns a json with each date of the month as a key and any existing reservations as start time values
    const reservations = await getMonthlyReservations(
      propertyID,
      facilityID,
      slotDate.getMonth()
    );

    // Extract reservation times for the selected date
    const reservedTimeSlotsForDate = reservations[slotDate.getDate()] || [];

    const defaultTimeSlots = [
      "08:00 AM - 09:00 AM",
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 01:00 PM",
      "01:00 PM - 02:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
      "04:00 PM - 05:00 PM",
    ];

    // Filter available time slots based on reserved time slots for the selected date
    const filteredTimeSlots = defaultTimeSlots.filter(
      (timeSlot) => !reservedTimeSlotsForDate.includes(timeSlot.split(" - ")[0])
    );

    return filteredTimeSlots;
  };

  /**
   * Function to update reservation slots for the displayed month
   */
  const fetchReservationsForMonth = async (date) => {
    try {
      const reservations = await getMonthlyReservations(
        propertyID,
        facilityID,
        date.getMonth()
      );
      const reservedSlots = [];

      const numberOfDaysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      // Iterate over the reservations for each date in the month
      for (var i = 0; i < numberOfDaysInMonth; i++) {
        const slots = reservations[i] || [];
        const currentDate = i;

        if (slots !== []) {
          // Iterate over the time slots for the current date
          slots.forEach((slot) => {
            const newReservedTimeSlot = {
              date: currentDate,
              month: date.getMonth(),
              startTime: slot.split(" - ")[0],
            };
            reservedSlots.push(newReservedTimeSlot);
          });
        }
      }

      // Update the reservedTimeSlots state with the new reservations
      setReservedTimeSlots(reservedSlots);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  /**
   * Function to handle time slot selection
   */
  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

  /**
   * Function to handle reservation
   */
  const handleReservation = async () => {
    if (!selectedTimeSlot) {
      console.error("No time slot selected for reservation.");
      return;
    }

    const [startTime, endTime] = selectedTimeSlot.split(" - ");
    const reservationDateTime = new Date(selectedDate);
    reservationDateTime.setHours(0, 0, 0, 0);

    // Check if the selected time slot is already reserved for the selected date
    const isTimeSlotReserved = reservedTimeSlots.some((slot) => {
      return (
        slot.date === reservationDateTime.date &&
        slot.split(" - ")[0] === startTime
      );
    });

    if (isTimeSlotReserved) {
      console.error("This time slot is already reserved.");
      return;
    }

    try {
      await makeReservation({
        month: reservationDateTime.getMonth(),
        date: reservationDateTime.getDate(),
        startTime,
        endTime,
        userID,
        facilityID,
        propertyID,
      });

      // Update ReservedTimeSlots to include new reservation
      const newReservedTimeSlot = {
        date: reservationDateTime,
        startTime,
        endTime,
      };
      setReservedTimeSlots([...reservedTimeSlots, newReservedTimeSlot]);

      console.log("Reservation confirmed for time slot:", selectedTimeSlot);

      // return to reservation page
      navigate('/my-reservations');
    } catch (e) {
      console.error(e);
    }
  };

  //
  /**
   * Function to render reservation status message based on the reservationStatus state
   */
  const renderReservationStatusMessage = () => {
    switch (reservationStatus) {
      case "reserved":
        return <p style={{fontWeight:"bold"}}>This date is fully reserved.</p>;
      case "available":
        return (
          <div>
            <p>This date is available.</p>
            <div
              style={{
                backgroundColor: "white",
                height: "auto",
                width: "350px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <label
                className="signup"
                style={{
                  paddingTop: "20px",
                  color: "#4540db",
                  fontSize: "16px",
                }}
              >
                Please select a time slot:
              </label>
              <select
                value={selectedTimeSlot}
                onChange={handleTimeSlotChange}
                style={{ width: "auto" }}
              >
                <option value="">Select a time slot</option>
                {availableTimeSlots.map((timeSlot, index) => (
                  <option key={index} value={timeSlot}>
                    {timeSlot}
                  </option>
                ))}
              </select>
              {selectedTimeSlot &&
                reservedTimeSlots.includes(selectedTimeSlot) && (
                  <p>This time slot is already reserved.</p>
                )}
              {selectedTimeSlot &&
                !reservedTimeSlots.includes(selectedTimeSlot) && (
                  <button
                    className="button-reserved"
                    onClick={handleReservation}
                    style={{ display: "block", marginBottom: "20px" }}
                  >
                    Confirm Reservation
                  </button>
                )}
            </div>
          </div>
        );
      case "unavailable":
        return (
          <p style={{ fontWeight: "bolder" }}>
        
            Reservation is unavailable for past dates.
          </p>
        );
      case "error":
        return <p>There was an error fetching available time slots.</p>;
      default:
        return null;
    }
  };

  /**
   * Function to handle tile colour based on date and reservations available
   */
  const tileClassName = ({ date }) => {
    // Check if the selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    const isPastDate = date < today;

    if (isPastDate) {
      // If the date is in the past, return the appropriate class
      return "react-calendar__tile--unavailable";
    }

    // Count the number of time slots reserved for the date
    const reservedSlotsForDate = reservedTimeSlots.filter((slot) => {
      const slotYear = date.getFullYear();
      const slotMonth = slot.month;
      if (date.getMonth() !== slotMonth) {
        return false; // Skip reservations from other months
      }

      // Create a new Date object for the reservation date using the year, month, and day of the month
      const reservationDate = new Date(slotYear, slotMonth, slot.date);

      // Now compare the reservationDate with the selected date to filter reservations for that specific date
      return reservationDate.toDateString() === date.toDateString();
    });
    const numberOfReservedSlots = reservedSlotsForDate.length;

    // check if any slots left
    if (numberOfReservedSlots < maxAvailableSlots) {
      return "available";
    }

    // no slots left
    return "react-calendar__tile--all";
  };

  return (
    <div>
      <Header />
      <h1
        className="calendar-page-title"
        style={{
          textAlign: "center",
          paddingTop: "50px",
          paddingBottom: "20px",
        }}
      >
        Make A Reservation
      </h1>
      <h2
        style={{
          textAlign: "center",
          paddingBottom: "20px",
        }}
      >
        {" "}
        {propertyName} : {facilityType}
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <p
          style={{
            textAlign: "center",
            display: "block",
            margin: "0 auto",
            maxWidth: "80%",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <span
            style={{ color: "#4540db", fontWeight: "bold", marginRight: "5px" }}
          >
            NOTE:
          </span>
          {description}{" "}
        </p>
      </div>
      <div className="calendar-page-container">
        <BackArrowBtn /> {/* Include BackArrowBtn here */}
        <div className="content-calendar-container">
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={tileClassName}
              onActiveStartDateChange={handleViewChange}
              maxDate={maxDate}
              minDate={minDate}
              // for testing
               
            />
          </div>
          <div className="calendar-container">
            {renderReservationStatusMessage()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;
