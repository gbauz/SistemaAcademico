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
import Matriculacion from '../Estudiante/matricula';
import ProtectedRoute from '../Estudiante/components/ProtectedRoute';
import VerCalificaciones from '../Estudiante/calificaciones';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [isMatriculado, setIsMatriculado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar el token para obtener el rol
      setUser(decoded);
      checkMatriculado(decoded.cedula);
    }
  }, []);

  const checkMatriculado = async (cedula) => {
    try {
      const response = await fetch(`/matricula/checkMatriculado/${cedula}`);
      const data = await response.json();
      setIsMatriculado(data.isMatriculado);
    } catch (error) {
      console.error('Error al verificar la matrícula:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderOptions = () => {
    if (user) {
      if (user.rol === 1) { // Rol Docente
        return (
          <ul className="list-group">
            <li className="list-group-item"><Link to="IngresoCalificaciones">Ingreso de Calificaciones</Link></li>
          </ul>
        );
      } else if (user.rol === 2) { // Rol Secretario
        return (
          <ul className="list-group">
            <li className="list-group-item"><Link to="ModificarCalificaciones">Modificar Calificaciones</Link></li>
            <li className="list-group-item"><Link to="IngresarEstudiante">Ingresar Estudiante</Link></li>
          </ul>
        );
      } else if (user.rol === 3) { // Rol Estudiante
        return (
          <ul className="list-group">
            {!isMatriculado && <li className="list-group-item"><Link to="Matriculacion">Matriculación</Link></li>}
            {isMatriculado && <li className="list-group-item"><Link to="VerCalificaciones">Calificación del Estudiante</Link></li>}
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
            <Route path="IngresoCalificaciones" element={<IngresoCalificaciones />} />
            <Route path="ModificarCalificaciones" element={<ModificarCalificaciones />} />
            <Route path="IngresarEstudiante" element={<IngresarEstudiante />} />
            <Route path="Matriculacion" element={
              <ProtectedRoute isAuthenticated={user?.rol !== 3 || !isMatriculado}>
                <Matriculacion />
              </ProtectedRoute>
            } />
            <Route path="VerCalificaciones" element={
              <ProtectedRoute isAuthenticated={user?.rol === 3 && isMatriculado}>
                <VerCalificaciones />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
