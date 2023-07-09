import { Link } from 'react-router-dom';

const PetMedicalRecord = ({ record }) => {
    return (
        <>
            <div className="record">
                <h2 className="recordTitle">{ record.date }</h2>
                <li className="recordList">Clinic: { record.clinic }</li>
                <li className="recordList">Address: { record.address }</li>
                <li className="recordList">Phone: { record.phone }</li>
                <li className="recordList">Doctor: { record.doctor }</li>
                <li className="recordList">Reason: { record.agenda }</li>
            </div> 
            <button>Edit</button>
            <button>Delete</button>
        </>
           
    )
}

export default PetMedicalRecord
