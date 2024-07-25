const express = require('express');
const router = express.Router();
const conexion = require('./conexion');

// Obtener todos los insumos con detalles completos
router.get('/', async (req, res) => {
  try {
    const [rows] = await conexion.query(`
      SELECT 
        i.id, 
        u.nombre AS usuario_nombre, 
        i.insumo1, 
        i.insumo2, 
        i.insumo3, 
        (i.insumo1 + i.insumo2 + i.insumo3) / 3 AS promedio, 
        c.Curso AS curso_nombre 
      FROM Insumos i
      JOIN Usuario u ON i.usuario_id = u.cedula
      JOIN Matricula m ON u.cedula = m.cedula_usuario
      JOIN Cursos c ON m.id_cursos = c.id_Curso
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching insumos:', err);
    res.status(500).json({ error: 'Error fetching insumos' });
  }
});

// Actualizar un insumo con detalles completos
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { insumo1, insumo2, insumo3 } = req.body;
  try {
    await conexion.query('UPDATE Insumos SET insumo1 = ?, insumo2 = ?, insumo3 = ? WHERE id = ?', 
      [insumo1, insumo2, insumo3, id]);
    const promedio = (insumo1 + insumo2 + insumo3) / 3;
    res.json({ id, insumo1, insumo2, insumo3, promedio });
  } catch (err) {
    console.error('Error updating insumo:', err);
    res.status(500).json({ error: 'Error updating insumo' });
  }
});

// Eliminar un insumo con detalles completos
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await conexion.query('DELETE FROM Insumos WHERE id = ?', [id]);
    res.send('Insumo eliminado');
  } catch (err) {
    console.error('Error deleting insumo:', err);
    res.status(500).json({ error: 'Error deleting insumo' });
  }
});

module.exports = router;
