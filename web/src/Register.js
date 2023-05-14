import { useRef, useState, useEffect, useContext } from 'react';
import DataContext from './context/DataContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import AuthContext from "./context/AuthProvider";

import axios from './api/axios';
const REGISTER_URL = '/register';

const Login = () => {
    // const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const { user, setUser, email, setEmail, pwd, setPwd } = useContext(DataContext);
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from.pathname || "/";

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username: user, email: email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data))
            navigate('/login');
            setUser('');
            setPwd('');
            setEmail('');

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Wrong Username or Password');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    }

    return (
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign Up</h1>
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

                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
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
                    <button>Register</button>
                </form>

            </section>

    )
}

export default Login