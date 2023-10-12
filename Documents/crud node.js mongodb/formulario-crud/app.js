const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

// Configura el motor de plantillas EJS
app.set('view engine', 'ejs');

// Configura body-parser para analizar las solicitudes JSON y codificar URL
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecta a la base de datos MongoDB (asegúrate de tener MongoDB en ejecución)
mongoose.connect('mongodb://127.0.0.1:27017/formulario-crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define el modelo de datos (por ejemplo, para un formulario de contacto)
const Contacto = mongoose.model('contactos', {
  nombre: String,
  email: String,
  mensaje: String,
});

// Rutas CRUD
app.get('/', async (req, res) => {
  try {
    const contactos = await Contacto.find();
    res.render('index', { contactos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener contactos.');
  }
});

app.post('/contacto', async (req, res) => {
  try {
    const contacto = new Contacto(req.body);
    await contacto.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar el contacto.');
  }
});

app.get('/contacto/:id', async (req, res) => {
  try {
    const contacto = await Contacto.findById(req.params.id);
    res.render('contacto', { contacto });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el contacto.');
  }
});

app.post('/contacto/:id/eliminar', async (req, res) => {
  try {
    await Contacto.findByIdAndRemove(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el contacto.');
  }
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000');
});
