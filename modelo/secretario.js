const Usuario = require('./usuario');        
class Secretario extends Usuario {
    constructor(cedula, nombre, correoElectronico, contrasena) {
        super(cedula, nombre, correoElectronico, contrasena);
    }

    matricularEstudiante(curso, estudiante) {
        curso.matricular(estudiante);
    }
}
module.exports = Secretario;
