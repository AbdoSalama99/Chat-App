import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'tailwindcss/tailwind.css'
import './assets/global.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { UserContextProvider } from './contexts/UserContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <React.StrictMode>
      <App />
      <ToastContainer position='top-center' />
    </React.StrictMode>
  </UserContextProvider>
)
