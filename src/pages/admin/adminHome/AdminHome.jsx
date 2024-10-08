import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';

function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); 
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div>
      <h1>Painel do Administrador</h1>
      {/* Adicione o conteúdo da página do administrador */}

      <button onClick={handleLogout}>Sair</button> {/* Botão de Logout */}
    </div>
  );
}

export default AdminHome;