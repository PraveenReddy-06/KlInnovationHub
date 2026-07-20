import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import toast, { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
    <>
        <Toaster position="top-right"
                toastOptions={{duration: 1500, style: {background: "#111827",color: "#fff",border: "1px solid #374151",},}}
        />
        <App />
    </>
)
