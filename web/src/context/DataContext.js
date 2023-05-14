import { createContext, useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/posts';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [pets, setPets] = useState([]); /* default state is an array loaded from local storage or an empty array, in the event the database shoppinglist is deleted */
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]); // array of search results
    const [picURL, setPicURL] = useState('')
    const navigate = useNavigate();

    // Inputs for Login
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [userID, setUserID] = useState('');
    const [email, setEmail] = useState('');
    const [auth, setAuth] = useState({})

    // Inputs for Pet in POST
    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState('');
    const [dob, setDob] = useState('');
    const [deworm, setDeworm] = useState(format(new Date(), 'M-d-y'));
    const [gender, setGender] = useState('');
    const [ster, setSter] = useState('false');
    const [petDesc, setPetDesc] = useState('');

    // Inputs for Pet in PATCH
    const [newPetName, setNewPetName] = useState(petName);
    const [newPetType, setNewPetType] = useState(petType);
    const [newDob, setNewDob] = useState(dob);
    const [newDeworm, setNewDeworm] = useState(deworm);
    const [newGender, setNewGender] = useState(gender);
    const [newSter, setNewSter] = useState(ster);
    const [newPetDesc, setNewPetDesc] = useState(petDesc);

    // ------------------- CREATE in CRUD ------------------- //
    const addPet = async (petName, petType, dob, deworm, gender, ster, petDesc, userID) => {
        const id = pets.length ? pets[pets.length - 1].id + 1 : 1; // to reference the last post --> posts[posts.length-1]
        const isSterilised = (ster.toLowerCase()) === 'true';
        const newPet = {
            id,
            pet_name: petName,
            pet_type: petType,
            pet_dob: dob,
            pet_gender: gender,
            last_deworm: deworm,
            sterilised: isSterilised,
            pet_description: petDesc,
            user_id: userID
        };

        try {
            const response = await api.post(`${userID}/pets/register`, newPet, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            })
            console.log(response.data)
            const allPets = [...pets, response.data]; // append new post to allPosts
            setPets(allPets); // set Posts to allPosts
            setPetName(''); // reset the setPostTitle and setPostBody to empty
            setPetType('');
            setDob('');
            setDeworm(format(new Date(), 'M-d-y'));
            setGender('');
            setSter('false');
            setPetDesc('');
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!petName) return;
        addPet(petName, petType, dob, deworm, gender, ster, petDesc, userID) // addItem function
        navigate('/'); // return to home page after submitting post
    }

    // ------------------- REQUEST in CRUD ------------------- //
    useEffect(() => {
        const fetchPets = async () => {
            try {
                // in axios, it automatically returns response in json format and catch the error, accesible through response.data
                const response = await api.get(`${userID}/pets`, {
                    headers: {
                        'x-access-token': auth.accessToken
                    }
                });
                setPets(response.data); // response.data is in json format
                console.log(response.data)

            } catch (err) {
                if (err.response) { // Not in the 200 response range
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else { console.log(`Error: ${err.message}`) }
            }
        }
        fetchPets();
    }, [userID, auth]) // [] to show dependency so it won't infinitely request from server

    // ------------------- UPDATE in CRUD ------------------- //
    const handleEdit = async (id) => {
        const updatePet = {
            id,
            pet_type: newPetType,
            pet_dob: newDob,
            pet_gender: newGender,
            last_deworm: newDeworm,
            sterilised: (newSter.toLowerCase()) === 'true',
            pet_description: newPetDesc,
            pet_name: newPetName
        };
        try {
            const response = await api.patch(`${userID}/pets/${id}`, updatePet, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            });
            console.log(response.data)
            setPets(pets.map(pet => (pet.id).toString() === id ? { ...response.data } : pet)) // if pet id matches then update
            setNewPetName('')
            navigate(`/post/${id}`)
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
    }
    // ------------------- DELETE in CRUD ------------------- //
    const handleDelete = async (id) => {
        try {
            await api.delete(`${userID}/pets/${id}`, {
                headers: {
                    'x-access-token': auth.accessToken
                }
            });
            const petsList = pets.filter(pet => pet.id !== id); // filter out the posts with post.id not equal to the id of the post we want to delete
            setPets(petsList); // setPets to the newly filtered postsList
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
        navigate('/');
    }
    // ------------------- Send Notification Email (not automated) ------------------- //
    const API_URL = 'http://127.0.0.1:5000/pets/';
    const sendEmail = async (id) => {
        try {
            const response = api.get(`${API_URL}reminder/${id}/send-email`);
        } catch (err) {
            if (err.response) {
                // Not in the 200 response range
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else { console.log(`Error: ${err.message}`) }
        }
        navigate('/');
    }
    // ------------------- Filter Search Results on Home page ------------------- //
    useEffect(() => {
        const filteredResults = pets.filter((pet) =>
            ((pet.pet_name).toLowerCase()).includes(search.toLowerCase()));
        setSearchResults(filteredResults.reverse());
    }, [pets, search])
    
    return (
        <DataContext.Provider value={{
            search, setSearch,
            searchResults, setSearchResults,
            handleSubmit, petName, setPetName, petType, setPetType, dob, setDob, deworm, setDeworm, gender, setGender, ster, setSter, petDesc, setPetDesc,
            pets, handleDelete, sendEmail,
            handleEdit, newPetName, setNewPetName, newPetType, setNewPetType, newDob, setNewDob, newDeworm, setNewDeworm, newGender, setNewGender, newSter, setNewSter, newPetDesc, setNewPetDesc,
            user, setUser, pwd, setPwd, userID, setUserID, auth, setAuth, picURL, setPicURL, email, setEmail
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;