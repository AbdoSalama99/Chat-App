import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LandingPage, Login, Signup, Chat } from './pages'
import React, { useState } from 'react'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='login' element={<Login />} />
        <Route exact path='signup' element={<Signup />} />
        <Route exact path='chatPage' element={<Chat />} />
      </Routes>
    </Router>
  )
}

export default App
