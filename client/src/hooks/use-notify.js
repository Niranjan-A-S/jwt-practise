import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from "react"


export const useNotify = () => {
    const notify = useCallback((message, options) => {
        toast(message, {
            position: "top-right",
            autoClose: 1000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            newestOnTop: false,
            bodyStyle: { flex: "unset", },
            ...options,
        });
    }, [])

    return notify
}