import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import DataContext from '../context/DataContext';
import api from '../api/posts';

export const NewPetMedicalRecord = () => {
    const navigate = useNavigate();

    // Inputs for Pet in POST
    const { userID, auth } = useContext(DataContext);
    const { id } = useParams(); // extract the id from the link
    const [newClinic, setNewClinic] = useState('');
    const [newDoctor, setNewDoctor] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newReason, setNewReason] = useState('');
    
    const handleSubmitMedical = async () => {
        const newMedical = {
            date: newDate,
            clinic: newClinic,
            address: newAddress,
            phone: newPhone,
            doctor: newDoctor,
            agenda: newReason
        };
        try {
            const response = await api.post(`${userID}/pets/${id}/medical`, newMedical, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            });
            navigate(`/post/${id}`)
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
    }

    return (
        <main className="NewPost">
            <>
                <h2>New Medical Record</h2>
                <form className="newPostForm" onSubmit={(e)=>e.preventDefault()}>
                    <label htmlFor="postTitle">Date:</label>
                    <input
                        id="postTitle"
                        type="text"
                        required
                        value={ newDate }
                        onChange={(e) => setNewDate(e.target.value)}
                    />
                    <label htmlFor="postTitle">Clinic:</label>
                    <input
                        id="postTitle"
                        type="text"
                        required
                        value={ newClinic }
                        onChange={(e) => setNewClinic(e.target.value)}
                    />
                    <label htmlFor="postTitle">Address:</label>
                    <input
                        id="postTitle"
                        type="text"
                        required
                        value={ newAddress }
                        onChange={(e) => setNewAddress(e.target.value)}
                    />
                    <label htmlFor="postTitle">Phone:</label>
                    <input
                        id="postTitle"
                        type="text"
                        required
                        value={ newPhone }
                        onChange={(e) => setNewPhone(e.target.value)}
                    />
                    <label htmlFor="postTitle">Doctor:</label>
                    <input
                        id="postTitle"
                        type="text"
                        required
                        value={ newDoctor }
                        onChange={(e) => setNewDoctor(e.target.value)}
                    />
                    <label htmlFor="postTitle">Reason:</label>
                    <input
                        id="postTitle"
                        type="text"
                        required
                        value={ newReason }
                        onChange={(e) => setNewReason(e.target.value)}
                    />
                    <button type="submit" onClick={() => handleSubmitMedical()}>Submit</button>

                </form>
            </>
        </main>
    )
}

export default NewPetMedicalRecord