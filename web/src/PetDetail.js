import { useParams, Link } from "react-router-dom";
import { useContext } from 'react';
import DataContext from './context/DataContext';
import ImageUpload from "./ImageUpload";
import styled from "styled-components";
import { MdDeleteForever, MdEditSquare, MdMedicalInformation } from "react-icons/md";
import React from 'react';

// -------------- CSS Style -------------- //
const Button1 = styled.button`
    height: 48px;
    min-width: 48px;
    margin-left: 0.5rem;
    border-radius: 0.25rem;
    padding: 0.5rem;
    font-size: 1rem;
    background-color: #ff5e6c;
    color: white;
    cursor: pointer;
`;

const Button2 = styled.button`
    height: 48px;
    min-width: 48px;
    margin-left: 0.5rem;
    border-radius: 0.25rem;
    padding: 0.5rem; 
    font-size: 1rem;
    background-color: #fff5d7;
    color: black;
    cursor: pointer;
`;

const Button3 = styled.button`
    height: 48px;
    min-width: 48px;
    margin-left: 0.5rem;
    border-radius: 0.25rem;
    padding: 0.5rem; 
    font-size: 1rem;
    background-color: green;
    color: white;
    cursor: pointer;
`;

const PetDetail = () => {
    const { pets, handleDelete } = useContext(DataContext);
    const { id } = useParams(); // id is used in Route
    const pet = pets.find(pet => (pet.id).toString() === id); // === is for string match, == for numeric

    return (
        <main className="PostPage">
            <article className="post">
                <div>
                    {pet ? (
                        <>
                            <h2>{pet.pet_name}</h2>
                            <li className="postBody">Birthday: {pet.pet_dob.slice(0, 16)}</li>
                            <li className="postBody">Last deworm date: {pet.last_deworm.slice(0, 16)}</li>
                            <li className="postBody">Time to deworm: {(pet.deworm_reminder) ? 'Yes': 'No'}</li>                           
                            <li className="postBody">Age: {pet.pet_age}</li>
                            <li className="postBody">Sterilised: {(pet.sterilised) ? 'Yes': 'No'}</li>
                            <li className="postBody">Pet Type: {pet.pet_type}</li>
                            <li className="postBody">Description: {pet.pet_description}</li>

                            <Button1 onClick={() => {
                                    const confirmBox = window.confirm("Do you really want to remove this pet?");
                                    confirmBox ? handleDelete(pet.id) : console.log('No')}}>
                                <MdDeleteForever/>
                            </Button1>

                            <Link to={`edit`}><Button2> <MdEditSquare/> </Button2></Link>

                            <Link to={`medical`}><Button3><MdMedicalInformation/></Button3></Link>

                            <ImageUpload pet_id = {pet.id}/>
                        </> ) 
                        : (
                        <>
                            <h2>Pet Not Found</h2>
                            <p>
                                <Link to='/'>Return to Homepage</Link>
                            </p>
                        </> )
                    }
                </div>
            </article>
        </main>
    )
}

export default PetDetail
