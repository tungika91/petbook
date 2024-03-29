import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useContext } from 'react';
import DataContext from '../context/DataContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';

export const EditPet = () => {
    const { pets, handleEdit, newPetName, setNewPetName, newPetType, setNewPetType, newDob, setNewDob, newDeworm, setNewDeworm, newGender, setNewGender, newSter, setNewSter, newPetDesc, setNewPetDesc } = useContext(DataContext);
    const { id } = useParams(); // extract the id from the link
    const pet = pets.find(pet => (pet.id).toString() === id);

    useEffect(() => {
        // To pre-fill the form with existing info
        if (pet) {
            setNewPetName(pet.pet_name);
            setNewPetType(pet.pet_type);
            setNewDob(new Date(pet.pet_dob));
            setNewDeworm(new Date(pet.last_deworm));
            setNewGender(pet.pet_gender);
            setNewSter(pet.sterilised.toString());
            setNewPetDesc(pet.pet_description);
        }
    }, [pet, setNewPetName, setNewPetType, setNewDob, setNewDeworm, setNewGender, setNewSter, setNewPetDesc])
    
    return (
        <main className="NewPost">
            {pet &&
                <>
                    <h2>Edit Pet</h2>
                    <form className="newPostForm" onSubmit={(e)=>e.preventDefault()}>
                        <label htmlFor="postTitle">Pet Name:</label>
                        <input
                            id="postTitle" // match with htmlFor attribute
                            type="text" // accept text input
                            required
                            value={newPetName}
                            onChange={(e) => setNewPetName(e.target.value)}
                        />
                        <label htmlFor="postTitle">Pet Type:</label>
                        <input
                            id="postTitle" // match with htmlFor attribute
                            type="text" // accept text input
                            required
                            value={newPetType}
                            onChange={(e) => setNewPetType(e.target.value)}
                        />
                        <label htmlFor="postTitle">Gender:</label>
                        <input
                            id="postTitle" // match with htmlFor attribute
                            type="text" // accept text input
                            required
                            value={newGender}
                            onChange={(e) => setNewGender(e.target.value)}
                        />
                        <label htmlFor="postTitle">Birthday (MM/DD/YYYY):</label>
                        <DatePicker selected={newDob} onChange={(date) => setNewDob(date)} />

                        <label htmlFor="postTitle">Last Deworm Date (MM/DD/YYYY):</label>
                        <DatePicker selected={newDeworm} onChange={(date) => setNewDeworm(date)} />

                        <label htmlFor="postTitle">Is your pet sterilised?</label>
                        <input
                            id="postTitle" // match with htmlFor attribute
                            type="text" // accept text input
                            required
                            value={newSter}
                            onChange={(e) => setNewSter(e.target.value)}
                        />
                    
                        <label htmlFor="postBody">Description:</label>
                        <textarea
                            id="postBody" // match with htmlFor attribute
                            required
                            value={newPetDesc}
                            onChange={(e) => setNewPetDesc(e.target.value)}
                        />
                        <button type="submit" onClick={()=>handleEdit(pet.id)}>Submit</button>
                    </form>
                </>
            }

            {!pet && 
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

export default EditPet