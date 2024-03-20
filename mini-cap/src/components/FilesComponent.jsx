import React, { useState, useEffect } from "react";
import { getUsersFiles } from "../backend/ImageHandler";
import "../styling/FilesComponent.css"; // Import your custom styling for FilesComponent

const FilesComponent = ({ userID }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                let fetchedFiles;
                if (userID) {
                    // Fetch files based on userID if provided
                    fetchedFiles = await getUsersFiles(userID);
                } else {
                    // Hardcoded default files if userID is not provided
                    fetchedFiles = [
                        { id: 1, fileName: "Property Deed", fileType: "pdf" },
                        { id: 2, fileName: "Insurance Policy", fileType: "pdf" },
                        { id: 3, fileName: "Rules and Regulations", fileType: "pdf" }
                    ];
                }
                setFiles(fetchedFiles);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchFiles();
    }, [userID]);

    // Handler to open modal with file content
    const handleOpenModal = (file) => {
        setSelectedFile(file);
    };

    // Handler to close modal
    const handleCloseModal = () => {
        setSelectedFile(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="files-component-container">
            <h2 className="files-component-title">Owner Documents</h2>
            <ul className="files-component-list">
                {files.map((file, index) => (
                    <li
                        key={index}
                        onClick={() => handleOpenModal(file)}
                        className="files-component-item"
                    >
                        {/* Render file details as needed */}
                        <div className="files-component-icon">
                            {file.fileType === "pdf" ? (
                                <i className="far fa-file-pdf"></i>
                            ) : (
                                <i className="far fa-file"></i>
                            )}
                        </div>
                        <div className="files-component-details">
                            <p className="files-component-name">{file.fileName}</p>
                            <p className="files-component-type">{file.fileType.toUpperCase()}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal */}
            {selectedFile && (
                <div className="files-component-modal" onClick={handleCloseModal}>
                    <div className="files-component-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedFile.fileName}</h2>
                        {/* Display file content or additional details here */}
                        <button className="files-component-close-btn" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilesComponent;
