import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const VerCalificaciones = () => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsumos = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar el token para obtener la cédula
        const cedula = decoded.cedula;

        try {
          const response = await axios.get(`/matricula/insumos/${cedula}`);
          console.log("Datos recibidos:", response.data); // Añadir log para depuración
          setInsumos(response.data.data || []);
          setLoading(false);
        } catch (error) {
          setError(error.response ? error.response.data.error : "Error al obtener los insumos");
          setLoading(false);
        }
      } else {
        setError("No se encontró el token de usuario.");
        setLoading(false);
      }
    };

    fetchInsumos();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Calificaciones del Estudiante</h2>
      {insumos.length > 0 ? (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Nombre del Usuario</th>
              <th>Curso</th>
              <th>Materia</th>
              <th>Insumo 1</th>
              <th>Insumo 2</th>
              <th>Insumo 3</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((insumo, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{insumo.Estudiante}</td>
                <td>{insumo.Curso}</td>
                <td>{insumo.Materia}</td>
                <td>{insumo.insumo1}</td>
                <td>{insumo.insumo2}</td>
                <td>{insumo.insumo3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron insumos para este estudiante.</p>
      )}
    </div>
  );
};

export default VerCalificaciones;
