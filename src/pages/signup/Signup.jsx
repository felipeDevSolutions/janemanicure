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
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const novoUsuario = new User(user.uid, nome, email, null, 'user', true);
      await setDoc(doc(db, "usuarios", user.uid), { ...novoUsuario });

      await sendEmailVerification(user);
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
          <div className="form-group">
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <label htmlFor="nome">Nome:</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email:</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <label htmlFor="senha">Senha:</label>
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