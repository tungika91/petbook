import { Link } from 'react-router-dom';

const Post = ({ pet }) => {
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

            {/* <p className="postBody">{
                (pet.pet_description).length <= 25
                    ? pet.pet_description
                    : `${(pet.pet_description).slice(0, 25)}...`
            }</p> */}
        </div>    
    )
}

export default Post
