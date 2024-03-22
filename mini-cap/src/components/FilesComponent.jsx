import React, { useState, useEffect } from "react";
import { getUsersFiles } from "../backend/ImageHandler";
import "../styling/FilesComponent.css"; // Import your custom styling for FilesComponent
import store from "storejs";

const FilesComponent = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const userID = store("user"); // Get userID from local storage or context

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                let fetchedFiles;
                if (userID) {
                    // Fetch files based on userID if provided
                    fetchedFiles = await getUsersFiles(userID);
                }
                setProperties(fetchedFiles);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchFiles();
    }, [userID]);

    const handleOpenModal = (file) => {
        // Define your logic for opening the modal here
        console.log("Open modal for file:", file);
    };

    const handleClick = (url) => {
        window.open(url, "_blank");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="files-component-container">
            {properties && properties.map((property, propertyIndex) => (
                <div key={propertyIndex}>
                    <div key={propertyIndex} className="files-component-propertyUser">
                        <h3>{property.property}</h3>
                        <ul className="files-component-list">
                            {property.files.map((file, index) => (
                                <li key={index}><a href="#" onClick={() => handleClick(file.url)} className="underline">
                                    {file.name}
                                </a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FilesComponent;
