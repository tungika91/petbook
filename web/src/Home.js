import PetList from './PetList';
import { useContext } from 'react';
import DataContext from './context/DataContext';

const Home = () => {
    const { searchResults } = useContext(DataContext);
    return (
        <main className="Home">
            {/* check the posts length - if there are posts > Feed, if not, show "No Posts to display" */}
            {searchResults.length ? (
                <PetList pets={searchResults} />
            ) : (
                <p style={{ marginTop: "2rem" }}>
                    No pets to display.
                </p>
            )}
        </main>
    )
}

export default Home
