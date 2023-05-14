import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import DataContext from "./context/DataContext";

const RequireAuth = () => {
    const { user } = useContext(DataContext);
    const location = useLocation();

    return (
        user
            ? <Outlet />
            : <Navigate to="/login" state={{from: location}} replace/>
    );
}

export default RequireAuth;