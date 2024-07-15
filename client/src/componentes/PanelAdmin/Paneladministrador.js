import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './AdminPage.css';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar el token para obtener el rol
      setUser(decoded);
      fetchRoles();
    }
  }, []);

  const fetchRoles = async () => {
    const response = await fetch('/api/roles', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    setRoles(data.roles);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderOptions = () => {
    if (user) {
      if (user.rol === 1) {
        return <li className="list-group-item">Ingreso de Calificaciones</li>; // Rol Docente
      } else if (user.rol === 2) {
        return <li className="list-group-item">Ver Asistencia</li>; // Rol Secretario
      }
    }
    return null;
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <a className="navbar-brand" href="#">Instituto Nacional INSPI</a>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {user ? user.name : 'Usuario'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div className="card">
        <div className="card-header">
          <h1>Panel Administrativo</h1>
        </div>
        <div className="card-body">
          {user ? (
            <div>
              <h2>Bienvenido, {user.name}</h2>
              <h3>Rol: {user.rol}</h3>
              <h3>Permisos:</h3>
              <ul className="list-group">
                {renderOptions()}
              </ul>
            </div>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
