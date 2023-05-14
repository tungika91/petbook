import Post from './Post';

const Feed = ({ pets }) => {
    return (
        <div className="container">
            {pets.map(pet => (
                <Post pet={pet} key={pet.id} />
            ))}
        </div>
    )
}

export default Feed
