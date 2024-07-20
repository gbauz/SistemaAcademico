const Usuario = require('../modelo/usuario');

class Insumo extends Usuario {
    constructor(cedula, nombre, correoElectronico, contrasena, insumo1, insumo2, insumo3) {
        super(cedula, nombre, correoElectronico, contrasena);
        this.insumo1 = insumo1;
        this.insumo2 = insumo2;
        this.insumo3 = insumo3;
    }

    getInsumo1() {
        return this.insumo1;
    }

    getInsumo2() {
        return this.insumo2;
    }

    getInsumo3() {
        return this.insumo3;
    }

    setInsumo1(insumo1) {
        this.insumo1 = insumo1;
    }

    setInsumo2(insumo2) {
        this.insumo2 = insumo2;
    }

    setInsumo3(insumo3) {
        this.insumo3 = insumo3;
    }
}
module.exports = Insumo;
