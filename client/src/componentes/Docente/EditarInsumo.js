import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const EditarInsumo = ({ insumo, onClose }) => {
  const [insumo1, setInsumo1] = useState(insumo.insumo1);
  const [insumo2, setInsumo2] = useState(insumo.insumo2);
  const [insumo3, setInsumo3] = useState(insumo.insumo3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promedio = (insumo1 + insumo2 + insumo3) / 3;
    try {
      await axios.put(`/api/insumos/${insumo.id}`, { insumo1, insumo2, insumo3, promedio });
      onClose();
    } catch (error) {
      console.error('Error updating insumo:', error);
    }
  };

  return (
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
              value={insumo1}
              onChange={(e) => setInsumo1(Number(e.target.value))}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="insumo2">Insumo 2:</label>
            <input
              type="number"
              className="form-control"
              id="insumo2"
              value={insumo2}
              onChange={(e) => setInsumo2(Number(e.target.value))}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="insumo3">Insumo 3:</label>
            <input
              type="number"
              className="form-control"
              id="insumo3"
              value={insumo3}
              onChange={(e) => setInsumo3(Number(e.target.value))}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mr-2">Guardar Cambios</button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditarInsumo;
