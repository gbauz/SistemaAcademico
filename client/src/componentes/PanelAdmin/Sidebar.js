// src/componentes/PanelAdmin/Sidebar.js

import React from 'react';
import './AdminPage.css'; // Asegúrate de que el CSS esté correctamente importado

const Sidebar = ({ user, renderOptions }) => {
  return (
    <div className="sidebar col-md-3 col-lg-2">
      <h2>Información del Usuario</h2>
      {user ? (
        <div>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
          <h3 className='permisos'><strong>Permisos:</strong></h3>
          {renderOptions()}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Sidebar;
