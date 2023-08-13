import { useContext } from "react"
import DataContext from './context/DataContext';
import api from './api/posts';

const FileDownload = ({ record_id, pet_id }) => {
    const { userID, auth } = useContext(DataContext);

    const handleDownload = async () => {
        try {
                await api.get(`${userID}/pets/${pet_id}/medical/${record_id}/download`, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            })
            .then((response) => {
                // Open in new tab in browser
                const res = response.data
                res['error'] ? alert(res['error']) : window.open(res);        
            })
            .catch((error) => {
                console.log(error);
            });
        }
        catch (error) {
            return { error };
        }
    }
    return (
        <>
            <button onClick={handleDownload}> Download </button>
        </>
    )
}

export default FileDownload