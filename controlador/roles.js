const express = require('express');
const router = express.Router();
const Conexion = require('./conexion');
const { verificaToken } = require('./auth');

router.get('/', verificaToken, async (req, res) => {
  try {
    const [roles] = await (await Conexion).execute('SELECT id_rol, nombre FROM Rol');
    const rolesWithPermissions = await Promise.all(roles.map(async (role) => {
      const [permisos] = await (await Conexion).execute(
        'SELECT p.id_permiso, p.nombre_permiso AS permiso_nombre FROM Permisos p JOIN Roles_Permisos rp ON p.id_permiso = rp.id_permiso WHERE rp.id_rol = ?',
        [role.id_rol]
      );
      return { ...role, permisos };
    }));

    res.json({ roles: rolesWithPermissions });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Error al obtener roles.' });
  }
});

// Otros endpoints para crear, editar y eliminar roles...

module.exports = router;
