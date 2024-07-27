const express = require('express');
const router = express.Router();
const Conexion = require('./conexion');
const Matricula = require('../modelo/matricula');



// Obtener los niveles
router.get('/nivel', async (req, res) => {
  try {
      const [rows] = await (await Conexion).execute('SELECT nombre FROM Nivel');

      if (rows.length > 0) {
          const nombres = rows.map(row => row.nombre);
          res.json({ success: true, nombres });
      } else {
          res.status(404).json({ error: 'No se encontraron niveles.' });
      }
  } catch (error) {
      console.error('Error al obtener los niveles:', error);
      res.status(500).json({ error: 'Error al obtener los niveles.' });
  }
});

// Obtener cursos por nivel
router.get('/curso/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    try {
      const [rows] = await (await Conexion).execute(`
        SELECT id_Curso, Curso, Materia, Docente, Horario 
        FROM Cursos 
        WHERE id_nivel = (SELECT id_nivel FROM Nivel WHERE nombre = ?)
      `, [nombre]);
  
      if (rows.length > 0) {
        const cursos = rows.map(row => ({
          id_Curso: row.id_Curso,
          Curso: row.Curso,
          Materia: row.Materia,
          Docente: row.Docente,
          Horario: row.Horario,
        }));
        res.json({ success: true, cursos });
      } else {
        res.status(404).json({ error: 'No se encontraron cursos para este nivel.' });
      }
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
      res.status(500).json({ error: 'Error al obtener los cursos.' });
    }
  });


router.post('/generar', async (req, res) => {
    const { cedula_usuario, cursos } = req.body;

    if (!cedula_usuario || !cursos || cursos.length === 0) {
        return res.status(400).json({ error: 'Cédula y cursos son requeridos.' });
    }

    try {
        const matricula = new Matricula(null, cedula_usuario, cursos);
        
        for (const id_curso of cursos) {
            await (await Conexion).execute(
                'INSERT INTO matricula (cedula_usuario, id_cursos) VALUES (?, ?)',
                [matricula.cedula_usuario, id_curso] // Corrected from id_cursos to id_curso
            );
        }

        res.json({ success: true, message: 'Cursos agregados a la matrícula.', matricula });
    } catch (error) {
        console.error('Error al agregar el curso a la matrícula:', error);
        res.status(500).json({ error: 'Error al agregar el curso a la matrícula.' });
    }
});


router.get('/checkMatriculado/:cedula', async (req, res) => {
  const { cedula } = req.params;
  
  try {
    const [rows] = await (await Conexion).execute(`
      SELECT COUNT(*) as count
      FROM Matricula
      WHERE cedula_usuario = ?
      `, [cedula]);
      
      res.json({ isMatriculado: rows[0].count > 0 });
    } catch (error) {
      console.error('Error al verificar la matrícula:', error);
      res.status(500).json({ error: 'Error al verificar la matrícula.' });
    }
  });
  
  router.get('/insumos/:cedula', async (req, res) => {
    const { cedula } = req.params;
  
    try {
      const [rows] = await (await Conexion).execute(`
        SELECT 
          U.nombre AS Estudiante, C.Curso, C.Materia, I.insumo1, I.insumo2, I.insumo3
        FROM 
          Matricula M
        JOIN 
          Usuario U ON M.cedula_usuario = U.cedula
        JOIN 
          Cursos C ON M.id_cursos = C.id_Curso
        JOIN 
          Insumos I ON U.cedula = I.usuario_id AND C.id_Curso = I.id_curso
        WHERE 
          U.rol_id = 3 AND U.cedula = ?
      `, [cedula]);
  
      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Error al obtener los insumos:', error);
      res.status(500).json({ error: 'Error al obtener los insumos.' });
    }
  });
  
  module.exports = router;
