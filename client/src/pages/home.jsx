import { useCallback, useEffect, useState } from "react"
import jwt_decode from "jwt-decode"
import { useNavigate } from "react-router-dom";
import { useNotify } from "../hooks/use-notify";
import { ToastContainer } from "react-toastify";

export const HomePage = () => {

    const navigate = useNavigate()
    const notify = useNotify();
    const [data, setData] = useState("");

    useEffect(() => {

        const populateQuote = async () => {
            const req = await fetch('http://localhost:8000/api/quote', {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "Content-type": "application/json"
                }
            });
            const rData = await req.json();
            if (req.ok) {
                setData(rData.quote);
            }
        }

        const token = localStorage.getItem("token");
        if (token) {
            const user = jwt_decode(token);
            if (!user) {
                localStorage.removeItem("token");
                navigate('/login');
            } else {
                populateQuote();
            }
        }
    }, [navigate]);

    const [quote, setQuote] = useState("");

    const onSubmit = useCallback(async (event) => {
        event.preventDefault();
        const req = await fetch('http://localhost:8000/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": localStorage.getItem("token")
            },
            body: JSON.stringify({ quote }),
        });

        if (req.ok) {
            notify('Quote submitted', { type: 'success' });
            setTimeout(() => {
                navigate(0);
            }, 2000)
        } else {
            notify('Note Submitted', { type: 'success' });
        }
    }, [quote, notify, navigate]);

    return (
        <div>
            <h1>Quote from DB: {data}</h1>
            <form onSubmit={onSubmit} className="form">
                <textarea value={quote} onChange={(event) => setQuote(event.target.value)} />
                <button type="submit">Submit</button>
                <ToastContainer />
            </form>
        </div>
    )
}
