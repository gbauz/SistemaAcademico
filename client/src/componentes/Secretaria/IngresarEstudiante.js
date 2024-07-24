import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IngresarEstudiante.css';

const IngresarEstudiante = () => {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [curso, setCurso] = useState('');
    const [estudiantes, setEstudiantes] = useState([]);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const cursos = [
        { id_Curso: 1, Curso: '1-1', Materia: 'Grammar' },
        { id_Curso: 2, Curso: '2-1', Materia: 'Listening' },
        { id_Curso: 3, Curso: '3-1', Materia: 'Speaking' },
        { id_Curso: 4, Curso: '1-2', Materia: 'Grammar' },
        { id_Curso: 5, Curso: '2-2', Materia: 'Listening' },
        { id_Curso: 6, Curso: '3-2', Materia: 'Speaking' }
    ];

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const fetchEstudiantes = async () => {
        try {
            const response = await axios.get('/api/estudiantes');
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/estudiantes', { cedula, nombre, correo, curso });
            fetchEstudiantes(); 
            setCedula('');
            setNombre('');
            setCorreo('');
            setCurso('');
        } catch (error) {
            console.error('Error al agregar estudiante:', error);
        }
    };

    const handleEdit = (estudiante) => {
        setEditing(estudiante.cedula);
        setCedula(estudiante.cedula);
        setNombre(estudiante.nombre);
        setCorreo(estudiante.correo_electronico);
        setCurso(estudiante.curso);
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/estudiantes/${cedula}`, { nombre, correo, curso });
            fetchEstudiantes();
            setEditing(null);
            setCedula('');
            setNombre('');
            setCorreo('');
            setCurso('');
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
        }
    };

    const handleDelete = (cedula) => {
        setConfirmDelete(cedula);
    };

    const confirmDeleteStudent = async (cedula) => {
        try {
            await axios.delete(`/api/estudiantes/${cedula}`);
            fetchEstudiantes();
            setConfirmDelete(null);
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
        }
    };

    const cancelDelete = () => {
        setConfirmDelete(null);
    };

    return (
        <div className="contenedor">
            <form onSubmit={handleSubmit} className="formulario">
                <h2>Ingresar Estudiante</h2>
                <div>
                    <label>Cédula:</label>
                    <input
                        type="text"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        required
                        disabled={editing !== null}
                    />
                </div>
                <div>
                    <label>Nombre del Estudiante:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Curso:</label>
                    <select
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un curso</option>
                        {cursos.map((curso) => (
                            <option key={curso.id_Curso} value={curso.id_Curso}>
                                {curso.Curso} - {curso.Materia}
                            </option>
                        ))}
                    </select>
                </div>
                {editing !== null ? (
                    <button type="button" onClick={handleSave} className="guardar">Guardar</button>
                ) : (
                    <button type="submit">Guardar Estudiante</button>
                )}
            </form>
            <table className="tabla">
                <thead>
                    <tr>
                        <th>Cédula</th>
                        <th>Nombre del Estudiante</th>
                        <th>Correo Electrónico</th>
                        <th>Curso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((estudiante) => (
                        <tr key={estudiante.cedula}>
                            <td>{estudiante.cedula}</td>
                            <td>{editing === estudiante.cedula ? (
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            ) : (
                                estudiante.nombre
                            )}</td>
                            <td>{editing === estudiante.cedula ? (
                                <input
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                />
                            ) : (
                                estudiante.correo_electronico
                            )}</td>
                            <td>{editing === estudiante.cedula ? (
                                <select
                                    value={curso}
                                    onChange={(e) => setCurso(e.target.value)}
                                >
                                    <option value="">Selecciona un curso</option>
                                    {cursos.map((curso) => (
                                        <option key={curso.id_Curso} value={curso.id_Curso}>
                                            {curso.Curso} - {curso.Materia}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                estudiante.Curso
                            )}</td>
                            <td>
                                {editing === estudiante.cedula ? (
                                    <button onClick={handleSave} className="guardar">Guardar</button>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(estudiante)} className="editar">Editar</button>
                                        <button onClick={() => handleDelete(estudiante.cedula)} className="borrar">Borrar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {confirmDelete && (
                <div className="confirmDelete">
                    <p>¿Seguro que deseas borrar a este estudiante?</p>
                    <button onClick={() => confirmDeleteStudent(confirmDelete)}>Sí</button>
                    <button onClick={cancelDelete}>No</button>
                </div>
            )}
        </div>
    );
};

export default IngresarEstudiante;
