// src/componentes/PanelAdmin/Navbar.js

import React from 'react';
import './AdminPage.css'; // Asegúrate de que el CSS esté correctamente importado

const Navbar = ({ user, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">Dashboard Cursos de ingles</a>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user-circle"></i> {user ? user.name : 'Usuario'}
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
