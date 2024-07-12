const express = require('express');
const router = express.Router();
const Conexion = require('./conexion');
const { generateToken, verificaToken, revokeToken } = require('./auth');
const Usuario = require('../modelo/usuario');
/**NOTA SIEMPRE AL AGREGAR ALGUNA CLASE DE POO A LA CAPA CONTROLADOR SE DEBE PRIMERO REVISAR LA CLASE AUTH Y 
 * TOKENS.JS
 */
// Endpoint de inicio de sesión
router.post('/login', async (req, res) => {
  const { cedula, contraseña } = req.body;

  if (!cedula || !contraseña) 
    return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos.' });

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

// Endpoint para verificar sesión y obtener permisos del usuario
router.get('/session', verificaToken, async (req, res) => {
  try {
    const { cedula, email, name, rol } = req.user;
    const [rows] = await (await Conexion).execute(
      'SELECT rp.id_permiso FROM Roles_Permisos rp WHERE rp.id_rol = ?',
      [rol]
    );

    const permissions = rows.map(row => row.id_permiso);

    res.json({ user: { cedula, name, email, rol, permissions } });
  } catch (error) {
    console.error('Error al obtener información de sesión:', error);
    res.status(500).json({ error: 'Error al obtener información de sesión.' });
  }
});

// Endpoint para cerrar sesión
router.post('/logout', verificaToken, (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    revokeToken(token);
    res.json({ success: true, message: 'Sesión cerrada exitosamente.' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: 'Error al cerrar sesión.' });
  }
});

// Endpoint para obtener todos los usuarios
router.get('/users', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute(
      'SELECT u.cedula, u.nombre, u.correo_electronico, r.nombre AS rol FROM Usuario u JOIN Rol r ON u.rol_id = r.id_rol'
    );
    res.json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
});

// Endpoint para crear un nuevo usuario
router.post('/users', verificaToken, async (req, res) => {
  const { cedula, nombre, correo_electronico, contraseña, rol_id } = req.body;

  try {
    const rolIdNumerico = Number(rol_id);

    if (rolIdNumerico === 1) {
      return res.status(403).json({ error: 'No se pueden crear usuarios con rol 1 Administrador.' });
    }

    const [existingUserRows] = await (await Conexion).execute(
      'SELECT * FROM Usuario WHERE cedula = ?',
      [cedula]
    );

    if (existingUserRows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un usuario con el mismo número de cédula.' });
    }

    const nuevoUsuario = new Usuario(cedula, nombre, correo_electronico, contraseña);

    await (await Conexion).execute(
      'INSERT INTO Usuario (cedula, nombre, correo_electronico, contraseña, rol_id) VALUES (?, ?, ?, ?, ?)',
      [nuevoUsuario.getCedula(), nuevoUsuario.getNombre(), nuevoUsuario.getCorreoElectronico(), nuevoUsuario.getContrasena(), rol_id]
    );

    res.json({ success: true, message: 'Usuario creado correctamente.' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error al crear usuario.' });
  }
});

// Endpoint para eliminar un usuario
router.delete('/users/:id', verificaToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const [userRows] = await (await Conexion).execute(
      'SELECT rol_id FROM Usuario WHERE cedula = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const userRol = userRows[0].rol_id;

    if (userRol === 1) {
      return res.status(403).json({ error: 'No se puede eliminar a un usuario con rol Administrador.' });
    }

    await (await Conexion).execute('DELETE FROM Usuario WHERE cedula = ?', [userId]);
    res.json({ success: true, message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar usuario.' });
  }
});

// Endpoint para editar un usuario
router.put('/users/:id', verificaToken, async (req, res) => {
  const userId = req.params.id;
  const { nombre, correo_electronico, rol_id } = req.body;

  try {
    // Verificar el rol del usuario antes de editar
    const [userRows] = await (await Conexion).execute(
      'SELECT rol_id FROM Usuario WHERE cedula = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const userRol = userRows[0].rol_id;
    const rolIdNumerico = Number(rol_id);

    if (rolIdNumerico === 1) {
      return res.status(403).json({ error: 'No se puede asignar el rol 1 Administrador a un usuario.' });
    }

    // Verificar si se está intentando cambiar el rol de un usuario con rol 1
    if (userRol === 1 && rol_id !== userRol) {
      return res.status(403).json({ error: 'No se puede cambiar el rol de un usuario con rol 1 Administrador.' });
    }

    await (await Conexion).execute(
      'UPDATE Usuario SET nombre = ?, correo_electronico = ?, rol_id = ? WHERE cedula = ?',
      [nombre, correo_electronico, userRol === 1 ? userRol : rol_id, userId]
    );

    res.json({ success: true, message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error al actualizar usuario.' });
  }
});

// Endpoint para editar la contraseña de un usuario
router.put('/users/:id/password', verificaToken, async (req, res) => {
  const userId = req.params.id;
  const { nuevaContraseña, confirmarContraseña } = req.body;

  if (nuevaContraseña !== confirmarContraseña) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  try {
    await (await Conexion).execute(
      'UPDATE Usuario SET contraseña = ? WHERE cedula = ?',
      [nuevaContraseña, userId]
    );

    res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Error al actualizar la contraseña.' });
  }
});

module.exports = router;
