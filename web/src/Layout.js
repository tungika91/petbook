import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import DataContext from './context/DataContext';
import React from 'react';

const Layout = () => {
    const { user } = useContext(DataContext);
    return (
        <div className="App">
            <Header 
                title="PetBook"
                user = {user}/>
            <Nav/>
            {/* Outlet represent all components wrap between Nav and Footer */}
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout
