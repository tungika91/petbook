import { useContext } from 'react';
import DataContext from '../context/DataContext';

const NewPet = () => {
    const {handleSubmit, petName, setPetName, petType, setPetType, dob, setDob, deworm, setDeworm, gender, setGender, ster, setSter, petDesc, setPetDesc} = useContext(DataContext)
    
    return (
        <main className="NewPost">
            <h2>New Pet</h2>
            <form className="newPostForm" onSubmit={handleSubmit}>
                <label htmlFor="postTitle">Pet Name:</label>
                <input
                    id="postTitle" // match with htmlFor attribute
                    type="text" // accept text input
                    required
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                />
                <label htmlFor="postTitle">Pet Type:</label>
                <input
                    id="postTitle" // match with htmlFor attribute
                    type="text" // accept text input
                    required
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                />
                <label htmlFor="postTitle">Gender:</label>
                <input
                    id="postTitle" // match with htmlFor attribute
                    type="text" // accept text input
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="postTitle">Birthday (MM-DD-YYYY):</label>
                <input
                    id="postTitle" // match with htmlFor attribute
                    type="text" // accept text input
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
                <label htmlFor="postTitle">Last Deworm Date (MM-DD-YYYY):</label>
                <input
                    id="postTitle" // match with htmlFor attribute
                    type="text" // accept text input
                    required
                    value={deworm}
                    onChange={(e) => setDeworm(e.target.value)}
                />
                <label htmlFor="postTitle">Is your pet sterilised?</label>
                <input
                    id="postTitle" // match with htmlFor attribute
                    type="text" // accept text input
                    required
                    value={ster}
                    onChange={(e) => setSter(e.target.value)}
                />
            
                <label htmlFor="postBody">Description:</label>
                <textarea
                    id="postBody" // match with htmlFor attribute
                    required
                    value={petDesc}
                    onChange={(e) => setPetDesc(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </main>
    )
}

export default NewPet
