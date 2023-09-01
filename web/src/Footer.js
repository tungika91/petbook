import React from 'react';

const Footer = () => {
    const today = new Date();
    return (
        <footer className='Footer'>
            <p>&copy; PetBook {today.getFullYear()}</p>
        </footer>
    )
}

export default Footer
