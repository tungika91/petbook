import Pet from './Pet';
import React from 'react';

const PetList = ({ pets }) => {
    return (
        <div className="container">
            {pets.map(pet => (
                <Pet pet={pet} key={pet.id} />
            ))}
        </div>
    )
}

export default PetList
