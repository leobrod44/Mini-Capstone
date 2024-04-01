import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackArrowBtn from "../components/BackArrowBtn";
import Calendar from 'react-calendar';
import "../index.css";
import 'react-calendar/dist/Calendar.css'; // Import default styles
import "../styling/Calendar.css";

const CalendarPage = () => {
    return (
        <div>
            <Header />
            <div className="calendar-page-container">
                <BackArrowBtn /> {/* Include BackArrowBtn here */}
                <div className="content-calendar-container">
                    <h1>Reservations</h1>
                    <Calendar />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CalendarPage;
