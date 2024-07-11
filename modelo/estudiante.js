const Usuario = require('./usuario');        

class Estudiante extends Usuario {
    constructor(cedula, nombre, correoElectronico, contrasena) {
        super(cedula, nombre, correoElectronico, contrasena);
        this.cursos = [];
        this.notas = {};
    }

    agregarCurso(curso) {
        this.cursos.push(curso);
    }

    agregarNota(curso, nota) {
        if (!this.notas[curso]) {
            this.notas[curso] = [];
        }
        this.notas[curso].push(nota);
    }
}

// Clase Curso
class Curso {
    constructor(id, nombre, docente) {
        this.id = id;
        this.nombre = nombre;
        this.docente = docente;
        this.estudiantes = [];
        this.notas = {};
    }

    matricular(estudiante) {
        this.estudiantes.push(estudiante);
        estudiante.agregarCurso(this);
    }

    registrarNota(estudiante, nota) {
        if (!this.notas[estudiante.getCedula()]) {
            this.notas[estudiante.getCedula()] = [];
        }
        this.notas[estudiante.getCedula()].push(nota);
        estudiante.agregarNota(this.id, nota);
    }
}
module.exports = Estudiante;
