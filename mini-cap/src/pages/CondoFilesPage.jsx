// CondoFilesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackArrowBtn from "../components/BackArrowBtn";
import CondoFilesComponent from "../components/CondoFilesComponent";
import { getPropertyFiles, getCondo } from "../backend/PropertyHandler";
import "../styling/CondoFilesPage.css";

const CondoFilesPage = () => {
    const navigate = useNavigate();
    const { condoID, propertyID, propertyName } = useParams();
    const [condo, setCondo] = useState({});
    const [condoFiles, setCondoFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

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

    // Handler to open modal with file content
    const handleOpenModal = (file) => {
        setSelectedFile(file);
    };

    // Handler to close modal
    const handleCloseModal = () => {
        setSelectedFile(null);
    };

    return (
        <div>
            <Header />
            <BackArrowBtn />
            <div className="center-pageF">
                <h3 className="condo-files-heading">{`Condo Files for Property ${propertyName}`}</h3>
                <div className="white-container">
                    <CondoFilesComponent condoID={condoID} onFileClick={handleOpenModal} />
                    {condoFiles.length > 0 && (
                        <div>
                            <h4>Files associated with this condo:</h4>
                            <ul>
                                {condoFiles.map((file, index) => (
                                    <li key={index} onClick={() => handleOpenModal(file)}>
                                        {file.fileName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <Footer />

            {/* Modal */}
            {selectedFile && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedFile.fileName}</h2>
                        {selectedFile.content && <p>{selectedFile.content}</p>}
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CondoFilesPage;
