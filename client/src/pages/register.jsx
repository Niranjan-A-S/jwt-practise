import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useNotify } from "../hooks/use-notify";

const initialFormState = { name: '', email: '', password: '', };

export const Register = () => {
    const [{ email, name, password }, setFormData] = useState(initialFormState);

    const updateFormData = useCallback(({ target: { value, name } }) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }, []);

    const notify = useNotify();

    const registerUser = useCallback(async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        const { message, code } = await response.json();
        if (response.ok) {
            notify(message, { type: 'success' });
        } else {
            notify(code === 11000 ? 'Already Registered' : 'Internal Server Error', { type: 'warning' });
        }
        setFormData(initialFormState);
    }, [email, name, notify, password]);

    return (
        <div>
            <h2>Register</h2>
            <form className="form" onSubmit={registerUser}>
                <input placeholder="Name" name="name" type="text" value={name} onChange={updateFormData} required />
                <input placeholder="Email" name="email" type="mail" value={email} onChange={updateFormData} required />
                <input placeholder="Password" name="password" type="password" value={password} onChange={updateFormData} required />
                <button type="submit">Sign up</button>
                <Link to="/login">Already have an account, Sign in!</Link>
                <ToastContainer />
            </form>
        </div>
    )

}
