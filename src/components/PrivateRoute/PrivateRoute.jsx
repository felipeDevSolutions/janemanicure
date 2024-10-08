import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const PrivateRoute = ({ role, children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);

        // Busca os dados do usuário no Firestore
        const userDocRef = doc(db, 'usuarios', authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data().role);
        } else {
          console.error('Documento do usuário não encontrado!');
        }
      } else {
        setUser(null);
        setUserRole(null);
      }

      setIsLoading(false); // Define isLoading como false após verificar a autenticação
    });

    // Limpa o listener quando o componente desmontar
    return () => unsubscribe();
  }, []);

  // Renderiza um componente de loading enquanto verifica a autenticação
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Redireciona para a página de login se o usuário não estiver autenticado
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redireciona para a página apropriada se a role não corresponder
  if (role && userRole !== role) {
    return <Navigate to={role === 'admin' ? '/' : '/admin'} />;
  }

  // Renderiza os componentes filhos se o usuário estiver autenticado e tiver a role correta
  return children;
};

export default PrivateRoute;