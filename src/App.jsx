import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Feed from './pages/Feed.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import Offline from './pages/Offline.jsx'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/offline" element={<Offline />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
