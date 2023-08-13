import { MdAccountCircle } from "react-icons/md";

const Header = ({ title, user }) => {
    return (
        <header className="Header">
            <h1>{ title }</h1>
            <div><MdAccountCircle/> { user }</div>
        </header>
    )
}

export default Header
