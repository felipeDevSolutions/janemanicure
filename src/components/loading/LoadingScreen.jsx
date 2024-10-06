import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingScreen.css'; // Importe o arquivo CSS da animação

function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simula um tempo de carregamento (ajuste conforme necessário)
    setTimeout(() => {
      setLoading(false);
      navigate('/login'); // Redireciona para a página de login
    }, 8000); // Substitua 3000 pelo tempo desejado em milissegundos
  }, [navigate]); 

  return (
    <div className={`loading-screen ${loading ? 'active' : ''}`}>
      <video autoPlay muted className="logo-animation"> 
        <source src="/janeVideo.mp4" type="video/mp4" /> 
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </div>
  );
}

export default LoadingScreen;