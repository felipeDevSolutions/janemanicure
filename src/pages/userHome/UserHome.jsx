import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; 
import './UserHome.css';

function UserHome() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // Estado para armazenar os dados do usuário

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Busca os dados do usuário no Firestore
        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data()); 
        } else {
          console.error('Documento do usuário não encontrado!');
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const changeRoleToAdmin = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'usuarios', user.uid);

        await updateDoc(userDocRef, {
          role: 'admin',
          roleChangeUsed: true,
        });

        console.log('Role do usuário atualizada para admin!');

        // Atualiza o estado userData após a mudança de role
        setUserData({ ...userData, role: 'admin', roleChangeUsed: true });
      }
    } catch (error) {
      console.error('Erro ao atualizar role do usuário:', error);
    }
  };

  return (
    <div className="home-container">
      <h1>Bem-vindo à Home!</h1>

      {/* Exibe informações do usuário se estiverem disponíveis */}
      {userData && (
        <div>
          <p>Nome: {userData.nome}</p>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
        </div>
      )}

      <button onClick={handleLogout} className="logout-button">
        Sair
      </button>

      {/* Botão para mudar a role - verifica se userData existe e se roleChangeUsed é false */}
      {userData && !userData.roleChangeUsed && (
        <button onClick={changeRoleToAdmin} className="change-role-button">
          Mudar para Admin
        </button>
      )}
    </div>
  );
}

export default UserHome;