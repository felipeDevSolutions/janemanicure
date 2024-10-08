import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import User from '../../models/User';
import './Signup.css';
import Logo from '../../static/img/logo.png';

function Signup() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 2. Verifica se o email é do administrador DEPOIS de criar o usuário
      const isAdmin = user.email === process.env.REACT_APP_ADMIN_EMAIL; 

      // 3. Define a role com base na verificação
      const role = isAdmin ? 'admin' : 'user';

      // 4. Cria o objeto User com os dados do novo usuário
      const novoUsuario = new User(user.uid, nome, email, null, role, true);

      // 5. Salva os dados do usuário no Firestore
      await setDoc(doc(db, "usuarios", user.uid), { ...novoUsuario });

      // 6. Envia o email de verificação (opcional, mas recomendado)
      await sendEmailVerification(user);

      // 7. Redireciona para a página de login após o cadastro
      navigate('/login'); 
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={Logo} alt="Logo do Salão" className="logo" />
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="webflow-style-input">
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="webflow-style-input">
            <input
              type="email"
              id="email"
              placeholder="Digite seu email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="webflow-style-input">
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {erro && <p className="error-message">{erro}</p>}
          <button type="submit" className="btn-auth">
            Cadastrar
          </button>
          <div className="auth-links">
            <Link to="/login">Já possui conta? Faça login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;