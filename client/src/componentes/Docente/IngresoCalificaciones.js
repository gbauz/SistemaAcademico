import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditarInsumo from './EditarInsumo';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const IngresoCalificaciones = () => {
  const [insumos, setInsumos] = useState([]);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await axios.get('/api/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Error fetching insumos:', error);
    }
  };

  const deleteInsumo = async (id) => {
    try {
      await axios.delete(`/api/insumos/${id}`);
      fetchInsumos();
    } catch (error) {
      console.error('Error deleting insumo:', error);
    }
  };

  const handleEditClick = (insumo) => {
    setSelectedInsumo(insumo);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedInsumo(null);
    fetchInsumos();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Insumos</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre del Usuario</th>
            <th>Insumo 1</th>
            <th>Insumo 2</th>
            <th>Insumo 3</th>
            <th>Promedio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo.id}>
              <td>{insumo.id}</td>
              <td>{insumo.usuario_nombre}</td>
              <td>{insumo.insumo1}</td>
              <td>{insumo.insumo2}</td>
              <td>{insumo.insumo3}</td>
              <td>{insumo.promedio}</td>
              <td>
                <button className="btn btn-primary mr-2" onClick={() => handleEditClick(insumo)}>Editar</button>
                <button className="btn btn-danger" onClick={() => deleteInsumo(insumo.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <EditarInsumo insumo={selectedInsumo} onClose={handleCloseEdit} />
      )}
    </div>
  );
};

export default IngresoCalificaciones;
