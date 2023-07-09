import { useParams } from "react-router-dom";
import { useContext, useEffect } from 'react';
import DataContext from '../context/DataContext';
import api from '../api/posts';
import PetMedicalRecord from "./PetMedicalRecord";

const PetMedical = () => {
    // const [medicalRecord, setMedicalRecord] = useState();
    const { pets, userID, auth, medicalRecord, setMedicalRecord } = useContext(DataContext);
    const { id } = useParams(); // id is used in Route
    const pet = pets.find(pet => (pet.id).toString() === id); // === is for string match, == for numeric

    useEffect(() => {
    const getMedicalRecords = async () => {
        try {
            // in axios, it automatically returns response in json format and catch the error, accesible through response.data
            const response = await api.get(`${userID}/pets/${pet.id}/medical/all`, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            });
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
    }, [pet.id, auth, userID, setMedicalRecord])

    return (
        <div className="container">
            {medicalRecord 
            ? medicalRecord.map(record => (
                <PetMedicalRecord record={record} key={record.id} />))
            : "Missing Record"}
        </div>
    )
}

export default PetMedical
