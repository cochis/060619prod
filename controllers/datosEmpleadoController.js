"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
// import { exists } from 'fs';
const moment_1 = __importDefault(require("moment"));
var now = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
class DatosEmpleadoController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const datos = yield database_1.default.query('SELECT * FROM datosEmpleado');
            res.json(datos);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            const rol = yield database_1.default.query('SELECT * FROM datosEmpleado WHERE clvEmpleado = ?', [clvEmpleado]);
            if (rol.length > 0) {
                return res.json(rol[0]);
            }
            res.status(404).json({ text: "El sitio no existe" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //SETEAMOS USUARIO PARA HACER LA BUSQUEDA POR USUARIO
            console.log('inicio');
            req.body.fechaCreacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            if (req.body.clvEmpleado == null ||
                req.body.nombreCompleto == null ||
                req.body.fechaIngreso == null ||
                req.body.clinicaImss == null ||
                req.body.rfc == null ||
                req.body.horario == null ||
                req.body.curp == null ||
                req.body.nss == null ||
                req.body.telefonoCasa == null ||
                req.body.telefonoMovil == null ||
                req.body.tipoSangre == null ||
                req.body.domicilio == null ||
                req.body.estadoCivil == null ||
                req.body.hijos == null ||
                req.body.nombrePadre == null ||
                req.body.nombreMadre == null ||
                req.body.genero == null ||
                req.body.sueldo == null) {
                return res.status(204).send({ error: 'Envía los campos requeridos.' });
            }
            var clvEmpelado = req.body.clvEmpleado;
            // req.body.hijos = undefined; 
            // req.body.horario = undefined;
            var datosEmpleado = yield database_1.default.query('SELECT * FROM datosEmpleado WHERE clvEmpleado = ?', [clvEmpelado]);
            if (datosEmpleado.length > 0) {
                return res.status(204).send({ error: 'Ya existe un los datos de ese usuario. ' });
            }
            else {
                var empleado = yield database_1.default.query('SELECT * FROM empleados WHERE clvEmpleado = ?', [clvEmpelado]);
                // console.log(empleado.length);
                empleadob = empleado[0];
                // console.log('empleado guardado');
                // console.log(empleadob.activo + '   activo'); 
                console.log(empleado[0].activo);
                if (empleado.length = 0) {
                    return res.status(204).send({ error: 'El empleado no existe ' });
                }
                else if (empleado.length = 1) {
                    const result = yield database_1.default.query('INSERT INTO datosEmpleado  set ?', [req.body]);
                    console.log('Guardo emple');
                    res.json({ datosEmpleado: result[0],
                        message: 'Nuevo datos guardado' });
                }
                else {
                    return res.status(500).send({ error: 'El empleado no existe ' });
                }
            }
            // console.log(req.body);  
            // console.log('antes');
            // const result = await pool.query('INSERT INTO datosEmpleado  set ?', [req.body]);
            // console.log('despues');
            // res.json({ message: 'Nuevo datos guardado' });
            // const result = await pool.query('INSERT INTO datosEmpleados  set ?', [req.body]);
            // res.json({ message: 'Nuevo datos guardado' });
            //         }
            //     }
            // }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            const oldSitio = req.body;
            if (req.body.nombreCompleto == null) {
                return res.status(200).send({ error: 'Verifique los campos. ' });
            }
            if (req.body.clvEmpleado.length != 8) {
                return res.status(200).send({ error: 'Clave de empleado no valida. ' });
            }
            // req.body.fechaIngreso = undefined;
            // req.body.fechaCreacion = undefined;
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            var updateSitio = yield database_1.default.query('UPDATE datosEmpleado set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
            if (updateSitio.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el Empleado" });
            }
            else {
                res.json({ message: "Los datos del empleado fueron actualizados fue actualizado" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            req.body.activo = false;
            const oldSitio = req.body;
            var updateSitio = yield database_1.default.query('UPDATE datosEmpleado set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
            if (updateSitio.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el Empleado" });
            }
            else {
                res.json({ message: "El sitio fue desactivado" });
            }
        });
    }
    activate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            req.body.activo = true;
            const oldSitio = req.body;
            var updateSitio = yield database_1.default.query('UPDATE datosEmpleado set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
            if (updateSitio.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el empleado" });
            }
            else {
                res.json({ message: "El Empleado fue activado" });
            }
        });
    }
}
function MaysPrimera(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function convertName(string) {
    var res = string.split(" ");
    return res;
}
function cleanString(string) {
    string = string.trim();
    return string;
}
const datosEmpleadoController = new DatosEmpleadoController;
exports.default = datosEmpleadoController;
