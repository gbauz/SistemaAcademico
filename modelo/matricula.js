class Matricula{
    constructor(id_matricula, cedula_usuario, id_cursos){
        this.id_matricula = id_matricula,
        this.cedula_usuario = cedula_usuario
    }
    
    mostrarInformacion() {
        console.log(`Matrícula ID: ${this.id_matricula}, Estudiante: ${this.estudiante.getNombre()}, Curso: ${this.curso.nombre_curso}`);
    }
}

module.exports = Matricula;