import { useRef, useState, useEffect, useContext } from 'react';
import DataContext from './context/DataContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import AuthContext from "./context/AuthProvider";

import axios from './api/axios';
const LOGIN_URL = '/login';

const Login = () => {
    // const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const { user, setUser, pwd, setPwd, setUserID, setAuth } = useContext(DataContext);
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from.pathname || "/";

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data))
            const id = response?.data?.id;
            const accessToken = response?.data?.token;
            setUserID(id)
            setAuth({ user, pwd, accessToken })
            // const roles = response?.data?.roles;
            // setUser('');
            // setPwd('');
            navigate(from, { replace: true });

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Wrong Username or Password');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button>Sign In</button>
                </form>
                <p>
                    Need an Account?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <a href="register">Sign Up</a>
                    </span>
                </p>
            </section>

    )
}

export default Login