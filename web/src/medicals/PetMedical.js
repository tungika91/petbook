import { Link, useParams } from "react-router-dom";
import { useContext, useEffect } from 'react';
import DataContext from '../context/DataContext';
import api from '../api/axios';
import PetMedicalRecord from "./PetMedicalRecord";
import React from 'react';

const PetMedical = () => {
    const { pets, userID, auth, medicalRecord, setMedicalRecord } = useContext(DataContext);
    const { id } = useParams(); // id is used in Route
    const pet = pets.find(pet => (pet.id).toString() === id); // === is for string match, == for numeric

    useEffect(() => {
    const getMedicalRecords = async () => {
        try {
            const response = await api.get(`${userID}/pets/${pet.id}/medical/all`, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            });
            response.data.sort((a,b) => new Date(b.date) - new Date(a.date));
            setMedicalRecord(response.data); // response.data is in json format
        } catch (err) {
            if (err.response) { // Not in the 200 response range
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else { console.log(`Error: ${err.message}`) }
        }
    }
    getMedicalRecords();
    }, [pet, userID, auth, setMedicalRecord])

    return (
        <>
            <div className="newRecord">
                <Link to={'new'}>
                    <button> Add Medical Record </button>
                </Link>
            </div>
            <div className="container">
                {medicalRecord 
                ? medicalRecord.map(record => (
                    <PetMedicalRecord record={record} pet_id = {pet.id} key={record.id} />))
                : "Missing Record"}
            </div>
        </>
        
    )
}

export default PetMedical
