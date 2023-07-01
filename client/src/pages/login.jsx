import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotify } from '../hooks/use-notify';

const initialFormState = { email: '', password: '', };

export const Login = () => {

    const [{ email, password }, setFormData] = useState(initialFormState);
    const updateFormData = useCallback(({ target: { value, name } }) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }, []);

    const notify = useNotify();
    const navigate = useNavigate();

    const loginUser = useCallback(async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const { userToken } = await response.json();
        if (userToken) {
            const token = localStorage.getItem("token")
            if (!token) {
                localStorage.setItem("token", userToken);
            }
            notify("Logged in successfully", {
                type: 'success'
            });
            setTimeout(() => {
                navigate('/home');
            }, 2000)
        } else if (!response.ok) {
            notify("Invalid Credentials", {
                type: 'error'
            });
        }
        setFormData(initialFormState);
    }, [email, navigate, notify, password]);

    return (
        <div>
            <h1>Login</h1>
            <form className="form" onSubmit={loginUser}>
                <input placeholder="Email" name="email" type="mail" value={email} onChange={updateFormData} required />
                <input placeholder="Password" name="password" type="password" value={password} onChange={updateFormData} required />
                <button type="submit">Sign in</button>
                <Link to="/register">New User? Register Now!</Link>
                <ToastContainer />
            </form>
        </div>
    );
};
