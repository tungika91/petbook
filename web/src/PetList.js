import Pet from './Pet';

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
