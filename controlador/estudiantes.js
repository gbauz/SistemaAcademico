const express = require('express');
const router = express.Router();
const pool = require('./conexion'); 

// Obtener todos los estudiantes y sus cursos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.cedula, u.nombre, u.correo_electronico, c.Curso 
            FROM Usuario u
            JOIN Matricula m ON u.cedula = m.cedula_usuario
            JOIN Cursos c ON m.id_cursos = c.id_Curso
            WHERE u.rol_id = 3`
        );
        res.json(result[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo estudiantes' });
    }
});

// Obtener todos los cursos
router.get('/cursos', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id_Curso, Curso, Materia FROM Cursos`
        );
        res.json(result[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo cursos' });
    }
});

// Insertar un nuevo estudiante
router.post('/', async (req, res) => {
    const { cedula, nombre, correo, curso } = req.body;
    try {
       
        await pool.query(
            'INSERT INTO Usuario (cedula, nombre, correo_electronico, contraseña, rol_id) VALUES (?, ?, ?, ?, 3)',
            [cedula, nombre, correo, '123']
        );

       
        await pool.query(
            'INSERT INTO Matricula (cedula_usuario, id_cursos) VALUES (?, ?)',
            [cedula, curso]
        );

        res.json({
            cedula,
            nombre,
            correo,
            curso
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error insertando estudiante' });
    }
});

// Actualizar un estudiante
router.put('/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const { nombre, correo, curso } = req.body;
    try {
     
        await pool.query(
            'UPDATE Usuario SET nombre = ?, correo_electronico = ? WHERE cedula = ?',
            [nombre, correo, cedula]
        );

    
        await pool.query(
            'UPDATE Matricula SET id_cursos = ? WHERE cedula_usuario = ?',
            [curso, cedula]
        );

        res.json({ message: 'Estudiante actualizado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error actualizando estudiante' });
    }
});

// Eliminar un estudiante
router.delete('/:cedula', async (req, res) => {
    const { cedula } = req.params;
    try {

        await pool.query('DELETE FROM Matricula WHERE cedula_usuario = ?', [cedula]);


        await pool.query('DELETE FROM Usuario WHERE cedula = ?', [cedula]);

        res.json({ message: 'Estudiante eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error eliminando estudiante' });
    }
});

module.exports = router;
