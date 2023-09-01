import { useContext } from "react"
import { useState } from "react";
import DataContext from './context/DataContext';
import api from './api/posts';
import { MdOutlineFileUpload } from "react-icons/md";
import React from 'react';

const ImageUpload = ({ pet_id }) => {
    const { userID, auth, navigate } = useContext(DataContext);
    const [file, setFile] = useState();

    const handleFile = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    }

    const handleUpload = async (e) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`${userID}/pets/${pet_id}/upload`, formData, {
            headers: {
                'x-access-token': auth.accessToken
            }
        });
        console.log(response.data);
        navigate('/');
    }

    return (
        <>
            <input class="file-upload" type="file" name='file' onChange={(e) => handleFile(e)}/>
            <button onClick={handleUpload}> <MdOutlineFileUpload/> </button>
        </>
    )
}

export default ImageUpload
