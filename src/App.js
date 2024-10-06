import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import LoadingScreen from './components/loading/LoadingScreen';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Home from './pages/home/Home'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <BrowserRouter> 
      {/* LoadingScreen dentro do BrowserRouter */}
      {loading ? ( 
        <LoadingScreen /> 
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          {/* ... outras rotas ... */}
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;