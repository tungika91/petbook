import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="App">
            <Header title="PetBook"/>
            <Nav/>
            {/* Outlet represent all components wrap between Nav and Footer */}
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout
