/*
// server.js
const Usuario = require('./modelo/usuario'); // Importar la clase Usuario desde la ruta correcta

const usuario1 = new Usuario('12345678', 'Juan Pérez', 'juan.perez@example.com', 'password123');
usuario1.mostrarInformacion();


*/
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const usuariosRouter = require('./controlador/usuarios');
const rolesRouter = require('./controlador/roles');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', usuariosRouter);
app.use('/api/roles', rolesRouter);

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
