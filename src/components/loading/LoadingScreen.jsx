import React from 'react';
import './LoadingScreen.css';
import video from '../../static/video/videoSemAudio.mp4'; // Importe o vídeo

function LoadingScreen() {
  return (
    <div className="loading-screen"> 
      <video autoPlay muted className="logo-animation">
        <source src={video} type="video/mp4" /> {/* Use a variável video */}
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </div>
  );
}

export default LoadingScreen;