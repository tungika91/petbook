import { useContext } from "react"
import { useState } from "react";
import DataContext from './context/DataContext';
import api from './api/posts';

const FileUpload = ({ record_id, pet_id }) => {
    const { userID, auth, navigate } = useContext(DataContext);
    const [file, setFile] = useState();

    const handleFile = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    }

    const handleUpload = async (e) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`${userID}/pets/${pet_id}/medical/${record_id}/upload`, formData, {
            headers: {
                'x-access-token': auth.accessToken
            }
        });
        console.log(response.data);
        navigate('/');
    }

    return (
        <div>
            <input class="file-upload" type="file" name='file' onChange={(e) => handleFile(e)}/>
            <button onClick={handleUpload}> Upload </button>
        </div>
    )
}

export default FileUpload
