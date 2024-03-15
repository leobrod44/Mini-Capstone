import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styling/CondoFilesComponent.css";
//import { uploadFile } from "../backend/PropertyHandler"; // Import the uploadFile function
import { uploadFile } from "../backend/ImageHandler"; // Import the uploadFile function

const CondoFilesComponent = ({ condoID, condoFiles, setCondoFiles, onFileClick }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileUpload = async (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles([...files, ...uploadedFiles]); // Append new files to the existing files

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

    const handleUploadClick = async () => {
        // Upload files using the backend function
        try {
            // Upload files and get the updated list of files
            const uploadedFiles = await Promise.all(files.map(async (file) => {
                await uploadFile(condoID, file);
                return { fileName: file.name };
            }));

            // Add the uploaded files to the existing files
            setCondoFiles([...condoFiles, ...uploadedFiles]);

            // Reset files after uploading
            setFiles([]);

        } catch (error) {
            // Handle error
            // console.error("Error uploading files:", error);
        }
    };
    const resetFileInputValue = () => {
        const form = document.createElement("form");
        const input = document.createElement("input");
        input.type = "file";
        input.id = "file-input";
        form.appendChild(input);
        document.body.appendChild(form);
        form.reset();
        document.body.removeChild(form);
        const input1 = document.getElementById("file-input");
        if (input1) {
            input1.value = "";
        }
    };

    const handleCancelClick = () => {
        // Reset the file input value to allow re-selection of the same file
        resetFileInputValue();
        // Cancel the upload and reset the files
        setFiles([]);
    };

    return (
        <div className={`cfc-containerFiles ${isDragging ? "dragging" : ""}`}>
            <div
                className="drag-and-drop-area"
                onDragEnter={(event) => handleDragEnter(event, setIsDragging)}
                onDragOver={handleDragOver}
                onDragLeave={() => handleDragLeave(setIsDragging)}
                onDrop={(event) => handleDrop(event, files, setFiles, setIsDragging, onFileClick)}
            >
                {isDragging ? (
                    <p>Drop files here</p>
                ) : (
                    <p>Drag &amp; Drop files here</p>
                )}
            </div>
            <label htmlFor="file-input">Upload Files</label> {/* Add label element here */}
            <input
                id="file-input"
                type="file"
                onChange={handleFileUpload}
                multiple
                className="file-input"
                data-testid="file-input"
            />
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
            {/* Upload Files and Cancel buttons */}
            <div className="button-containerFiles">
                <button className="details-buttonFiles" onClick={handleUploadClick}>
                    Upload Files
                </button>
                <button className="cancel-buttonFiles" onClick={handleCancelClick}>
                    Cancel
                </button>
            </div>
        </div>
    );
};


CondoFilesComponent.propTypes = {
    condoID: PropTypes.string.isRequired,
    condoFiles: PropTypes.array.isRequired,
    setCondoFiles: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
};

export default CondoFilesComponent;

export const handleDragEnter = (event, setIsDragging) => {
    event.preventDefault();
    setIsDragging(true);
};

export const handleDragOver = (event) => {
    event.preventDefault();
};

export const handleDragLeave = (setIsDragging) => {
    setIsDragging(false);
};

export const handleDrop = (event, files, setFiles, setIsDragging, onFileClick) => {
    event.preventDefault();

    const droppedFiles = Array.from(event.dataTransfer.files);

    if (files) {
        setFiles([...files, ...droppedFiles]); // Append new files to the existing files
    } else {
        setFiles([...droppedFiles]); // Set dropped files if no existing files
    }

    // Read content of text files and trigger the onFileClick callback
    for (const file of droppedFiles) {
        if (file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                onFileClick({ fileName: file.name, content });
            };
            if (reader.readAsText) {
                reader.readAsText(file);
            } else {
                //    console.error("FileReader.readAsText is not supported in this environment.");
            }
        }
    }

    setIsDragging(false);
};

export const handleUploadClick = async (condoID, files, setFiles, setCondoFiles, condoFiles) => {
    // Upload files using the backend function
    try {
        // Upload files and get the updated list of files
        const uploadedFiles = await Promise.all(files.map(async (file) => {
            await uploadFile(condoID, file);
            return { fileName: file.name };
        }));

        // Add the uploaded files to the existing files
        setCondoFiles([...condoFiles, ...uploadedFiles]);

        // Reset files after uploading
        setFiles([]);

    } catch (error) {
        // Handle error
        // console.error("Error uploading files:", error);
    }
};
export const resetFileInputValue = () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.type = "file";
    input.id = "file-input";
    form.appendChild(input);
    document.body.appendChild(form);
    form.reset();
    document.body.removeChild(form);
    const input1 = document.getElementById("file-input");
    if (input1) {
        input1.value = "";
    }
};



export const handleCancelClick = (setFiles) => {
    // Reset the file input value to allow re-selection of the same file
    resetFileInputValue();
    // Cancel the upload and reset the files
    setFiles([]);
};