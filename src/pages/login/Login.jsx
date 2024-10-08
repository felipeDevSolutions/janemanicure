import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './Login.css';
import Logo from '../../static/img/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/');
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
            Entrar
          </button>
          <div className="auth-links">
            <Link to="/esqueci-senha">Esqueci a senha</Link>
            <Link to="/cadastro">Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;