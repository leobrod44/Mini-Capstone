// CondoFilesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackArrowBtn from "../components/BackArrowBtn";
import CondoFilesComponent from "../components/CondoFilesComponent";
import { getPropertyFiles, getCondo } from "../backend/PropertyHandler"; // Import the getCondo function
import "../styling/CondoFilesPage.css"; // Import your CSS file

const CondoFilesPage = () => {
    const navigate = useNavigate();
    const { condoID, propertyID } = useParams();
    const [condo, setCondo] = useState({});
    const [condoFiles, setCondoFiles] = useState([]);

    useEffect(() => {
        const fetchCondoInfo = async () => {
            try {
                const condoInfo = await getCondo(condoID);
                setCondo(condoInfo || {});
            } catch (err) {
                console.error(err);
            }
        };

        const fetchCondoFiles = async () => {
            try {
                const files = await getPropertyFiles(condoID);
                setCondoFiles(files);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCondoInfo();
        fetchCondoFiles();
    }, [condoID]);

    return (
        <div>
            <Header />
            <BackArrowBtn />
            <div className="center-page">
                <h3 className="condo-files-heading">{`Condo Files for Property ID ${propertyID}`}</h3>
                <CondoFilesComponent condoID={condoID} />
                {condoFiles.length > 0 && (
                    <div>
                        <h4>Files associated with this condo:</h4>
                        <ul>
                            {condoFiles.map((file, index) => (
                                <li key={index}>{file.fileName}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CondoFilesPage;
