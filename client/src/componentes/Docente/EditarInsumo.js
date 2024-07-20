import React, { useState } from 'react';
import axios from 'axios';
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
      <div>
        <h2>Editar Insumo</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Insumo 1:
            <input type="number" value={insumo1} onChange={(e) => setInsumo1(Number(e.target.value))} />
          </label>
          <label>
            Insumo 2:
            <input type="number" value={insumo2} onChange={(e) => setInsumo2(Number(e.target.value))} />
          </label>
          <label>
            Insumo 3:
            <input type="number" value={insumo3} onChange={(e) => setInsumo3(Number(e.target.value))} />
          </label>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    );
  };
  
  export default EditarInsumo;