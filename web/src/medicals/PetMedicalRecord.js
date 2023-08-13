import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import DataContext from '../context/DataContext';
import api from '../api/posts';
import FileUpload from "../FileUpload";
import FileDownload from '../FileDownload';
import { MdDeleteForever, MdEditSquare, MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp, MdMoreHoriz, MdMoreVert  } from "react-icons/md";


const PetMedicalRecord = ({ record, pet_id }) => {
    const { userID, auth } = useContext(DataContext);
    const { id } = useParams(); // extract the id from the link
    const navigate = useNavigate();
    const [popUpMenu, setPopUpMenu] = useState(false);

    function PopUpMenu() {
        return (
            <ul className="drop-down">
                <Link to = {`${record.id}/edit`} state = { record }>
                    <button><MdEditSquare/></button>
                </Link>
                <button onClick={()=>handleMedicalDelete()}><MdDeleteForever /></button>
                <FileDownload record_id = { record.id } pet_id = { pet_id }/>
                <FileUpload record_id = { record.id } pet_id = { pet_id } />
            </ul>
        );
    }

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
                <li className="recordList">Attachment: { record.attachment }</li>

                <button onClick={() => setPopUpMenu(!popUpMenu)}> 
                    { popUpMenu ? <MdKeyboardDoubleArrowUp/> : <MdKeyboardDoubleArrowDown/> }
                </button>
                {popUpMenu && PopUpMenu()}
            </div>
        </>
    )
}
// sending props down Link through state. Then prop can be accessed via useLocation

export default PetMedicalRecord
