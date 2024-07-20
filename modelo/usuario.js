
class Usuario {
    constructor(cedula, nombre, correoElectronico, contrasena) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.correoElectronico = correoElectronico;
        this.contrasena = contrasena;
    }

    getCedula() {
        return this.cedula;
    }

    getNombre() {
        return this.nombre;
    }

    getCorreoElectronico() {
        return this.correoElectronico;
    }

    getContrasena() {
        return this.contrasena;
    }

    setCedula(cedula) {
        this.cedula = cedula;
    }

    setNombre(nombre) {
        this.nombre = nombre;
    }

    setCorreoElectronico(correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    setContrasena(contrasena) {
        this.contrasena = contrasena;
    }

    mostrarInformacion() {
        console.log(`Cédula: ${this.cedula}, Nombre: ${this.nombre}, Correo Electrónico: ${this.correoElectronico}`);
    }
    
}

module.exports = Usuario;
