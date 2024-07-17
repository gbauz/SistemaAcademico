import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './AdminPage.css';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import IngresoCalificaciones from '../Docente/IngresoCalificaciones';
import ModificarCalificaciones from '../Secretaria/ModificarCalificaciones';
import IngresarEstudiante from '../Secretaria/IngresarEstudiante';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar el token para obtener el rol
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderOptions = () => {
    if (user) {
      if (user.rol === 1) { // Rol Docente
        return (
          <ul className="list-group">
            <li className="list-group-item"><Link to="/admin/IngresoCalificaciones">Ingreso de Calificaciones</Link></li>
          </ul>
        );
      } else if (user.rol === 2) { // Rol Secretario
        return (
          <ul className="list-group">
            <li className="list-group-item"><Link to="/admin/ModificarCalificaciones">Modificar Calificaciones</Link></li>
            <li className="list-group-item"><Link to="/admin/IngresarEstudiante">Ingresar Estudiante</Link></li>
          </ul>
        );
      }
    }
    return null;
  };

  return (
    <div className="container-fluid p-0">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="row no-gutters">
        <Sidebar user={user} renderOptions={renderOptions} />
        <div className="content">
          <Routes>
            <Route path="/admin/IngresoCalificaciones" element={<IngresoCalificaciones />} />
            <Route path="/admin/ModificarCalificaciones" element={<ModificarCalificaciones />} />
            <Route path="/admin/IngresarEstudiante" element={<IngresarEstudiante />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
