import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <>
        <Toaster position="top-right"
                toastOptions={{duration: 5000, style: {background: "#111827",color: "#fff",border: "1px solid #374151",},}}
        />
        <App />
    </>
)
