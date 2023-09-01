import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from 'react';
import DataContext from '../context/DataContext';
import api from '../api/axios';
import React from 'react';

export const EditPetMedicalRecord = () => {
    const navigate = useNavigate();
    // access prop by using location = useLocation() through location.state
    const location = useLocation();
    const record = location.state;
    console.log(record)
    const { userID, auth } = useContext(DataContext);
    const { id, record_id } = useParams(); // extract the id from the link
    const [newClinic, setNewClinic] = useState('');
    const [newDoctor, setNewDoctor] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newReason, setNewReason] = useState('');

    useEffect(() => {
        // To pre-fill the form with existing info
        if (record) {
            setNewClinic(record.clinic);
            setNewDoctor(record.doctor);
            setNewAddress(record.address);
            setNewPhone(record.phone);
            setNewDate(record.date);
            setNewReason(record.agenda);
        }
    }, [record])
    
    const handleMedicalEdit = async (record_id) => {
        const updateMedical = {
            id: record_id,
            date: newDate,
            clinic: newClinic,
            address: newAddress,
            phone: newPhone,
            doctor: newDoctor,
            agenda: newReason
        };
        console.log(updateMedical)
        try {
            const response = await api.patch(`${userID}/pets/${id}/medical/${record_id}`, updateMedical, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            });
            navigate(`/post/${id}`)
            console.log(response)
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
    }

    return (
        <main className="NewPost">
            {record &&
                <>
                    <h2>Edit Medical Record</h2>
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

                        <button type="submit" onClick={() => handleMedicalEdit(record_id)}>Submit</button>

                    </form>
                </>
            }

            {!record && 
                <>
                    <h2>Page Not Found</h2>
                    <p>Well, that's disappointing.</p>
                    <p>
                        <Link to='/'>Visit Our Homepage</Link>
                    </p>
                </>
            }
        </main>
    )
}

export default EditPetMedicalRecord