// CondoFilesComponent.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styling/CondoFilesComponent.css";
import { uploadFile } from "../backend/PropertyHandler"; // Import the uploadFile function

const CondoFilesComponent = ({ condoID, onFileClick }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileUpload = async (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles(uploadedFiles);

        // Read content of text files and trigger the onFileClick callback
        for (const file of uploadedFiles) {
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    onFileClick({ fileName: file.name, content });
                };
                reader.readAsText(file);
            }
        }
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();

        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles(droppedFiles);

        // Read content of text files and trigger the onFileClick callback
        for (const file of droppedFiles) {
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    onFileClick({ fileName: file.name, content });
                };
                reader.readAsText(file);
            }
        }

        setIsDragging(false);
    };

    const handleUploadClick = async () => {
        // Upload files using the backend function
        try {
            await Promise.all(files.map(async (file) => {
                await uploadFile(condoID, file);
            }));
            // Reset files after uploading
            setFiles([]);
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    const handleCancelClick = () => {
        // Cancel the upload and reset the files
        setFiles([]);
    };

    return (
        <div className={`cfc-container ${isDragging ? "dragging" : ""}`}>
            <div
                className="drag-and-drop-area"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isDragging ? (
                    <p>Drop files here</p>
                ) : (
                    <p>Drag &amp; Drop files here</p>
                )}
            </div>
            <input
                type="file"
                onChange={handleFileUpload}
                multiple
                className="file-input"
            />
            <div className="button-container">
                <button className="details-button" onClick={handleUploadClick}>
                    Upload Files
                </button>
                <button className="cancel-button" onClick={handleCancelClick}>
                    Cancel
                </button>
            </div>
            {/* Display uploaded files */}
            {files.length > 0 && (
                <div>
                    <h4>Uploaded Files:</h4>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index} onClick={() => onFileClick({ fileName: file.name })}>
                                {file.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

CondoFilesComponent.propTypes = {
    condoID: PropTypes.string.isRequired,
    onFileClick: PropTypes.func.isRequired,
};

export default CondoFilesComponent;
