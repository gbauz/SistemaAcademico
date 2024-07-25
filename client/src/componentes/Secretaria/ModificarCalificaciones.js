import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './ModificarCalificaciones.css';

const ModificarCalificaciones = () => {
  const [insumos, setInsumos] = useState([]);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await axios.get('/api/estudiantescompletos'); // Asegúrate de usar la ruta correcta
      setInsumos(response.data);
    } catch (error) {
      console.error('Error fetching insumos:', error);
    }
  };

  const deleteInsumo = async (id) => {
    try {
      await axios.delete(`/api/estudiantescompletos/${id}`); // Asegúrate de usar la ruta correcta
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, insumo1, insumo2, insumo3 } = selectedInsumo;
    const promedio = (insumo1 + insumo2 + insumo3) / 3;
    try {
      await axios.put(`/api/estudiantescompletos/${id}`, { insumo1, insumo2, insumo3, promedio });
      handleCloseEdit();
    } catch (error) {
      console.error('Error updating insumo:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedInsumo({ ...selectedInsumo, [name]: Number(value) });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Insumos y Cursos de Estudiantes</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre del Usuario</th>
            <th>Insumo 1</th>
            <th>Insumo 2</th>
            <th>Insumo 3</th>
            <th>Promedio</th>
            <th>Curso</th>
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
              <td>{insumo.curso_nombre}</td>
              <td className='buttonsflex'>
                <button className="btn btn-primary mr-2" onClick={() => handleEditClick(insumo)}>Editar</button>
                <button className="btn btn-danger" onClick={() => deleteInsumo(insumo.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="container mt-4">
          <h2 className="mb-4">Editar Insumo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="insumo1">Insumo 1:</label>
                <input
                  type="number"
                  className="form-control"
                  id="insumo1"
                  name="insumo1"
                  value={selectedInsumo.insumo1 || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="insumo2">Insumo 2:</label>
                <input
                  type="number"
                  className="form-control"
                  id="insumo2"
                  name="insumo2"
                  value={selectedInsumo.insumo2 || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="insumo3">Insumo 3:</label>
                <input
                  type="number"
                  className="form-control"
                  id="insumo3"
                  name="insumo3"
                  value={selectedInsumo.insumo3 || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='btngroup'>
            <button type="submit" className="btn btn-primary mr-2">Guardar</button>
            <button type="button" className="btn btn-secondary" onClick={handleCloseEdit}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ModificarCalificaciones;
