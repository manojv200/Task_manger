import React from 'react'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login'
import Dashboard from './pages/Dashboard';
import Taskdashboard from './pages/Taskdashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/datatable' element={<Taskdashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
