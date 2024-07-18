import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './componentes/Login/Login';
import Paneladministrador from './componentes/PanelAdmin/Paneladministrador';
import IngresoCalificaciones from './componentes/Docente/IngresoCalificaciones';


const App = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/admin/*" element={<Paneladministrador />} />
  </Routes>
);

export default App;
