import { MdAccountCircle } from "react-icons/md";
import React from 'react';

const Header = ({ title, user }) => {
    return (
        <header className="Header">
            <h1>{ title }</h1>
            <div><MdAccountCircle/> { user }</div>
        </header>
    )
}

export default Header
