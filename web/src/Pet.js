import { Link } from 'react-router-dom';

const Pet = ({ pet }) => {
    return (
        <div className="card">
            <div></div>

            <div>
                <img src={pet.profile_pic} alt={pet.id}/>
            </div>

            <div>
                <Link to={`post/${pet.id}`}>
                    <h3>{pet.pet_name}</h3>
                </Link>
                <span>{pet.pet_type}</span>
            </div>
        </div>    
    )
}

export default Pet
