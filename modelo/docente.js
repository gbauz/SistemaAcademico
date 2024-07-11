const Usuario = require('./usuario');        

class Docente extends Usuario {
    constructor(cedula, nombre, correoElectronico, contrasena) {
        super(cedula, nombre, correoElectronico, contrasena);
    }

    registrarNota(curso, estudiante, nota) {
        curso.registrarNota(estudiante, nota);
    }
}
module.exports = Docente;
