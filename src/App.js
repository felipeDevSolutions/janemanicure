import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cursor from './components/cursor/Cursor';
import LoadingScreen from './components/loading/LoadingScreen';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import AdminHome from './pages/admin/adminHome/AdminHome';
import UserHome from './pages/client/userHome/UserHome';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'; 

function App() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    const animationDuration = 5000;
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Cursor />
      {showLoadingScreen && <LoadingScreen />}
      {!showLoadingScreen && (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Signup />} />
            <Route path="/admin" element={<PrivateRoute role="admin"><AdminHome /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute role="user"><UserHome /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;