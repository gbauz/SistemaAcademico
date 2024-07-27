import React from 'react';

const CursosTable = ({ cursos, onAgregar, onQuitar, agregar }) => {
  return (
    <div>
      <h3>{agregar ? 'Cursos Disponibles' : 'Cursos Agregados'}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID Curso</th>
            <th>Curso</th>
            <th>Materia</th>
            <th>Docente</th>
            <th>Horario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso, index) => (
            <tr key={index}>
              <td>{curso.id_Curso}</td>
              <td>{curso.Curso}</td>
              <td>{curso.Materia}</td>
              <td>{curso.Docente}</td>
              <td>{curso.Horario}</td>
              <td>
                {agregar ? (
                  <button className="btn btn-success" onClick={() => onAgregar(curso.id_Curso)}>Agregar</button>
                ) : (
                  <button className="btn btn-danger" onClick={() => onQuitar(curso.id_Curso)}>Quitar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CursosTable;
