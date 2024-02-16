import Header from "../components/Header";
import Footer from "../components/Footer";
import CondoComponent from "../components/CondoComponent.jsx";

const Dashboard =() => {

    // Hardcoded condo details for testing
    const condoDetails = {
        name: 'Sample Condo',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '101',
        parkingSpot: 'P101',
        locker: 'L101',
        userType: 'Owner'
    };

    const condoDetails1 = {
        name: 'My Condo',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '102',
        parkingSpot: 'P102',
        locker: 'L102',
        userType: 'Renter'
    };

    return(
        <div>
            <Header/>
                <div>
                    <CondoComponent {...condoDetails} />
                    <CondoComponent {...condoDetails1} />
                </div>
                <Footer/>
        </div>
    );


};

export default Dashboard;
