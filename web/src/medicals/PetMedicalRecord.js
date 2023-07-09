import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import DataContext from '../context/DataContext';
import api from '../api/posts';

const PetMedicalRecord = ({ record }) => {
    const { userID, auth } = useContext(DataContext);
    const { id } = useParams(); // extract the id from the link
    const navigate = useNavigate();

    const handleMedicalDelete = async () => {
        try {
            await api.delete(`${userID}/pets/${id}/medical/${record.id}`, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            });
            navigate(`/post/${id}/medical`)
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
        navigate('/');
    }
    return (
        <>
            <div className="record">
                <h2 className="recordTitle">{ record.date }</h2>
                <li className="recordList">ID: { record.id }</li>
                <li className="recordList">Clinic: { record.clinic }</li>
                <li className="recordList">Address: { record.address }</li>
                <li className="recordList">Phone: { record.phone }</li>
                <li className="recordList">Doctor: { record.doctor }</li>
                <li className="recordList">Reason: { record.agenda }</li>
            </div> 
            <Link to={`${record.id}/edit`}>
                <button>Edit</button>
            </Link>
            <button onClick={()=>handleMedicalDelete()}>x</button>
        </>
    )
}

export default PetMedicalRecord
