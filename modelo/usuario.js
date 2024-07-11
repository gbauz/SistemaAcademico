class Usuario {
    constructor(cedula, nombre, correoElectronico, contrasena) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.correoElectronico = correoElectronico;
        this.contrasena = contrasena; // Recuerda no guardar contraseñas en texto plano en un entorno de producción
    }

    // Getters
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

    // Setters
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
        this.contrasena = contrasena; // Nuevamente, asegúrate de manejar esto de forma segura en producción
    }

    // Método para mostrar información del usuario
    mostrarInformacion() {
        console.log(`Cedula: ${this.cedula}, Nombre: ${this.nombre}, Correo Electrónico: ${this.correoElectronico}`);
    }
}
module.exports = Usuario;

// Ejemplo de uso
/*const usuario1 = new Usuario('12345678', 'Juan Pérez', 'juan.perez@example.com', 'password123');
usuario1.mostrarInformacion();*/
