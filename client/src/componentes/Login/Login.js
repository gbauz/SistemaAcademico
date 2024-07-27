import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Login.css';

const Login = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cedula, contraseña: password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, cedula } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('cedula', cedula) // Almacena el token en localStorage
        navigate('/admin'); // Redirige a la página protegida
      } else {
        setError(data.error); // Muestra el mensaje de error del servidor
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión.');
    }
  };

  return (
    <div className="bs-body-color min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="bs-secondary-color col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-body text-center">
                <img
                  src="https://www.gob.ec/sites/default/files/styles/medium/public/2018-11/INSPI%20LOGO_0.png?itok=3n2KJyo2"
                  alt="Logo de INSPI"
                />
                <h2 className="mb-4">Iniciar Sesión</h2>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input"
                    type="text"
                    placeholder="Cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                  />
                  <label htmlFor="input" style={{ color: '#808080', opacity: 0.8 }}>
                    Cédula <i className="fa fa-user"></i>
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="inputPassword"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="inputPassword" style={{ color: '#808080', opacity: 0.8 }}>
                    Contraseña <i className="fa fa-lock"></i>
                  </label>
                  {error && <div className="text-danger">{error}</div>}
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" onClick={handleLogin}>
                    Iniciar Sesión
                  </button>
                  <a href="/register" className="mt-3">¿Olvidaste tu Contraseña?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
