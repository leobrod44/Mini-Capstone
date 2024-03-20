import React, { useState, useEffect } from "react";
import { getUsersFiles } from "../backend/ImageHandler";

const FilesComponent = ({ userID }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const userFiles = await getUsersFiles(userID);
                setFiles(userFiles);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchFiles();
    }, [userID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Files</h2>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        {/* Render file details as needed */}
                        <p>File Name: {file.fileName}</p>
                        <p>File URL: {file.fileUrl}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FilesComponent;
