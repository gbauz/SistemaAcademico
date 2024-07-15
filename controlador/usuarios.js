const express = require('express');
const router = express.Router();
const Conexion = require('./conexion');
const { generateToken, verificaToken, revokeToken } = require('./auth');
const Usuario = require('../modelo/usuario');

router.post('/login', async (req, res) => {
  const { cedula, contraseña } = req.body;

  if (!cedula || !contraseña) 
    return res.status(400).json({ error: 'Cédula y contraseña son requeridos.' });

  try {
    const [rows] = await (await Conexion).execute(
      'SELECT * FROM Usuario WHERE cedula = ? AND contraseña = ?',
      [cedula, contraseña]
    );

    if (rows.length > 0) {
      const usuarioData = rows[0];
      const usuario = new Usuario(usuarioData.cedula, usuarioData.nombre, usuarioData.correo_electronico, usuarioData.contraseña);

      if (usuarioData.rol_id === 1 || usuarioData.rol_id === 2) {
        const token = generateToken(usuarioData);
        res.json({ success: true, token });
      } else {
        res.status(403).json({ error: 'No tienes permiso para acceder.' });
      }
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
  } catch (error) {
    console.error('Error al autenticar:', error);
    res.status(500).json({ error: 'Error al autenticar usuario.' });
  }
});

// Otros endpoints para sesión, cerrar sesión, obtener y manejar usuarios...

module.exports = router;
