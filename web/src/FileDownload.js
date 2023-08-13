import { useContext } from "react"
import { useState } from "react";
import DataContext from './context/DataContext';
import api from './api/posts';

const FileDownload = ({ record_id, pet_id }) => {
    const { userID, auth } = useContext(DataContext);
    const [url, setUrl] = useState('');

    const handleDownload = async () => {
        const response = await api.get(`${userID}/pets/${pet_id}/medical/${record_id}/download`, {
            headers: {
                'x-access-token': auth.accessToken
            }
        });
        console.log(response.data);
        setUrl(response.data);
        // Open in new tab in browser
        const pdfWindow = window.open();
        pdfWindow.location.href = url;  
        setUrl('')
    }

    return (
        <>
            <button onClick={handleDownload}> Download </button>
        </>
    )
}

export default FileDownload
