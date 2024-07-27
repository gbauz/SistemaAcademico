import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './matricula.css';
import BootstrapModal from './components/modal';
import CursosTable from './components/cursoTable';
import { useNavigate } from 'react-router-dom';

const Matriculacion = () => {
  const [niveles, setNiveles] = useState([]);
  const [selectedNivel, setSelectedNivel] = useState('');
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState('');
  const [cursosAgregados, setCursosAgregados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        const response = await fetch('/matricula/nivel', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setNiveles(data.nombres);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Error al obtener los niveles.');
      }
    };

    fetchNiveles();
  }, []);

  const handleNivelChange = (e) => {
    setSelectedNivel(e.target.value);
  };

  const fetchCursos = async () => {
    if (!selectedNivel) {
      setError('Seleccione un nivel.');
      return;
    }
    try {
      const response = await fetch(`/matricula/curso/${selectedNivel}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setCursos(data.cursos);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error al obtener los cursos.');
    }
  };

  const agregarCurso = (cursoId) => {
    const curso = cursos.find((c) => c.id_Curso === cursoId);
    if (curso && !cursosAgregados.includes(curso)) {
      setCursosAgregados([...cursosAgregados, curso]);
      setCursos(cursos.filter((c) => c.id_Curso !== cursoId));
    }
  };

  const quitarCurso = (cursoId) => {
    const curso = cursosAgregados.find((c) => c.id_Curso === cursoId);
    if (curso) {
      setCursos([...cursos, curso]);
      setCursosAgregados(cursosAgregados.filter((c) => c.id_Curso !== cursoId));
    }
  };

  const confirmarMatricula = () => {
    if (cursosAgregados.length === 0) {
      setError('No hay cursos agregados.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cedula');
    navigate('/');
  };

  const generarMatricula = async () => {
    setShowConfirmModal(false); 
    
    const cedula = localStorage.getItem('cedula');
    if (!cedula) {
      setError('No se encontró la cédula en el almacenamiento local.');
      return;
    }// Cerrar el modal de confirmación
    try {
      const response = await fetch('/matricula/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula_usuario: cedula,
          cursos: cursosAgregados.map((curso) => curso.id_Curso),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCursosAgregados([]);
        setError('');
        handleLogout();
        setModalMessage('Matrícula generada con éxito');
      } else {
        setError(data.error);
        setModalMessage('Error al generar la matrícula');
      }
      setShowModal(true);
    } catch (error) {
      setError('Error al generar la matrícula.');
      setModalMessage('Error al generar la matrícula');
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);
  const closeConfirmModal = () => setShowConfirmModal(false);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Insumos</h2>
      <div className="select-container mb-3">
        <select className="form-select" aria-label="Default select example" onChange={handleNivelChange}>
          <option value="">Seleccione un nivel</option>
          {niveles.map((nivel, index) => (
            <option key={index} value={nivel}>{nivel}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={fetchCursos}>Mostrar Cursos</button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      {cursos.length > 0 && (
        <CursosTable
          cursos={cursos}
          onAgregar={agregarCurso}
          agregar={true}
        />
      )}
      {cursosAgregados.length > 0 && (
        <div className="mt-4">
          <CursosTable
            cursos={cursosAgregados}
            onQuitar={quitarCurso}
            agregar={false}
          />
          <button className="btn btn-primary mt-3" onClick={confirmarMatricula}>Generar Matrícula</button>
        </div>
      )}
      <BootstrapModal
        show={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={generarMatricula}
        title="Confirmar Matrícula"
        message="¿Está seguro que desea generar la matrícula?"
      />
      <BootstrapModal
        show={showModal}
        onClose={closeModal}
        title="Resultado de la Matrícula"
        message={modalMessage}
        onConfirm={closeModal} // Añadido para poder reutilizar el modal
      />
    </div>
  );
};

export default Matriculacion;
