const express = require('express');
const router = express.Router();
const conexion = require('./conexion'); // Asegúrate de que la ruta es correcta


// Obtener todos los insumos
router.get('/', async (req, res) => {
    try {
        const [rows] = await conexion.query(`
            SELECT Insumos.id, Insumos.usuario_id, Insumos.insumo1, Insumos.insumo2, Insumos.insumo3, Usuario.nombre AS usuario_nombre FROM Insumos INNER JOIN Usuario ON Insumos.usuario_id = Usuario.cedula WHERE Usuario.rol_id = 3;
        `);

        // Calcular el promedio para cada insumo
        const insumosConPromedio = rows.map(insumo => {
            const promedio = (insumo.insumo1 + insumo.insumo2 + insumo.insumo3) / 3;
            return { ...insumo, promedio };
        });

        res.json(insumosConPromedio);
    } catch (err) {
        console.error('Error fetching insumos:', err);
        res.status(500).json({ error: 'Error fetching insumos' });
    }
});

// Agregar un nuevo insumo
router.post('/', async (req, res) => {
    const { usuario_id, insumo1, insumo2, insumo3 } = req.body;
    try {
        await conexion.query('INSERT INTO Insumos (usuario_id, insumo1, insumo2, insumo3) VALUES (?, ?, ?, ?)', 
            [usuario_id, insumo1, insumo2, insumo3]);
        const promedio = (insumo1 + insumo2 + insumo3) / 3;
        res.json({ usuario_id, insumo1, insumo2, insumo3, promedio });
    } catch (err) {
        console.error('Error adding insumo:', err);
        res.status(500).json({ error: 'Error adding insumo' });
    }
});

// Actualizar un insumo
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

// Eliminar un insumo
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
