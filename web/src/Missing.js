import { Link } from 'react-router-dom';
import React from 'react';

const Missing = () => {
    return (
        <main className='Missing'>
            <h2>Page Not Found</h2>
            <p>
                <Link to='/'>Homepage</Link>
            </p>
        </main>
    )
}

export default Missing
