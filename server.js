const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const usuariosRouter = require('./controlador/usuarios');
const rolesRouter = require('./controlador/roles');
const insumosRouter = require('./controlador/insumos');  // Añadir el controlador de insumos
const estudiantesRouter = require('./controlador/estudiantes');
const estudiantescompletoRouter = require('./controlador/estudiantescompleto');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', usuariosRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/insumos', insumosRouter); 
app.use('/api/estudiantes', estudiantesRouter);
app.use('/api/estudiantescompletos', estudiantescompletoRouter); 
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

