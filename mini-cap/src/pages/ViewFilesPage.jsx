import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackArrowBtn from "../components/BackArrowBtn";
import FilesComponent from "../components/FilesComponent"; // Import FilesComponent
import "../styling/CondoFilesPage.css";

const ViewFilesPage = ({ userID }) => { // Accept userID as a prop
    return (
        <div>
            <Header />
            <BackArrowBtn />
            <div className="center-pageF">
                <h3 className="files-heading">Files</h3>
                <div className="white-containerFiles">
                    {/* Render FilesComponent with userID */}
                    <FilesComponent userID={userID} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ViewFilesPage;
